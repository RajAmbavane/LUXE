import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const BACKEND = "http://localhost:8000";

/** Poll /processing-status every 5s and auto-refresh case data when processing finishes */
export function useProcessingStatus() {
  const qc = useQueryClient();
  const wasProcessing = useRef(false);

  const query = useQuery({
    queryKey: ["processing_status"],
    queryFn: async () => {
      const r = await fetch(`${BACKEND}/processing-status`);
      if (!r.ok) return { is_processing: false, pending_cases: 0 };
      return r.json() as Promise<{ is_processing: boolean; pending_cases: number }>;
    },
    refetchInterval: 5000,   // poll every 5s
    retry: false,
  });

  useEffect(() => {
    const isProcessing = query.data?.is_processing ?? false;
    // When processing transitions from true → false, refresh all case data
    if (wasProcessing.current && !isProcessing) {
      qc.invalidateQueries({ queryKey: ["cases"] });
      qc.invalidateQueries({ queryKey: ["agent_analysis"] });
      qc.invalidateQueries({ queryKey: ["visual_analysis"] });
      qc.invalidateQueries({ queryKey: ["risk_signals"] });
      qc.invalidateQueries({ queryKey: ["decisions"] });
    }
    wasProcessing.current = isProcessing;
  }, [query.data?.is_processing, qc]);

  return {
    isProcessing: query.data?.is_processing ?? false,
    pendingCases: query.data?.pending_cases ?? 0,
  };
}

/** Trigger manual processing of all pending cases */
export async function triggerProcessing() {
  const r = await fetch(`${BACKEND}/trigger-processing`, { method: "POST" });
  return r.json();
}

/** Legacy: process a single case on demand (used by case detail pages) */
export function useProcessCase(caseId: string | undefined) {
  const qc = useQueryClient();

  const processCase = async () => {
    if (!caseId) return;
    try {
      const r = await fetch(`${BACKEND}/process-case/${caseId}`, { method: "POST" });
      if (!r.ok) return;
      qc.invalidateQueries({ queryKey: ["cases", caseId] });
      qc.invalidateQueries({ queryKey: ["agent_analysis", caseId] });
      qc.invalidateQueries({ queryKey: ["visual_analysis", caseId] });
      qc.invalidateQueries({ queryKey: ["risk_signals", caseId] });
      qc.invalidateQueries({ queryKey: ["decisions", caseId] });
      qc.invalidateQueries({ queryKey: ["case_images", caseId] });
    } catch {}
  };

  return { processCase };
}
