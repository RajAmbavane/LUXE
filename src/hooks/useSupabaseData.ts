import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { apiUrl } from "@/config/environment";

// ── Cases ──────────────────────────────────────────────────────────────────

export function useCases() {
  return useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"cases">[];
    },
  });
}

export function useCase(id: string | undefined) {
  return useQuery({
    queryKey: ["cases", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Tables<"cases">;
    },
  });
}

// ── Agent Analysis ────────────────────────────────────────────────────────

export function useAgentAnalysis(caseId: string | undefined) {
  return useQuery({
    queryKey: ["agent_analysis", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_analysis")
        .select("*")
        .eq("case_id", caseId!);
      if (error) throw error;
      return data as any[];
    },
  });
}

// ── Risk Signals (from agent_analysis) ─────────────────────────────────────

export function useRiskSignals(caseId: string | undefined) {
  return useQuery({
    queryKey: ["risk_signals", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_analysis")
        .select("*")
        .eq("case_id", caseId!)
        .eq("agent_name", "text_data_agent")
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return data as any[];
    },
  });
}

// ── Visual Analysis (from agent_analysis) ──────────────────────────────────

export function useVisualAnalysis(caseId: string | undefined) {
  return useQuery({
    queryKey: ["visual_analysis", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_analysis")
        .select("*")
        .eq("case_id", caseId!)
        .eq("agent_name", "visual_agent")
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data?.[0] ?? null) as any | null;
    },
  });
}

// ── Case Images ────────────────────────────────────────────────────────────

export function useCaseImages(caseId: string | undefined) {
  return useQuery({
    queryKey: ["case_images", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_images")
        .select("*")
        .eq("case_id", caseId!);
      if (error) throw error;
      return data as any[];
    },
  });
}

// ── Evidence ───────────────────────────────────────────────────────────────

export function useEvidence(caseId: string | undefined) {
  return useQuery({
    queryKey: ["evidence", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_images")
        .select("*")
        .eq("case_id", caseId!);
      if (error) throw error;
      return data as any[];
    },
  });
}

// ── Decisions (from agent_analysis decision_agent) ────────────────────────

export function useDecision(caseId: string | undefined) {
  return useQuery({
    queryKey: ["decisions", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_analysis")
        .select("*")
        .eq("case_id", caseId!)
        .eq("agent_name", "synthesis_agent")
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data?.[0] ?? null) as any | null;
    },
  });
}

export function useSubmitDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Tables<"decisions"> & { case_id: string }) => {
      const { data, error } = await supabase
        .from("decisions")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["decisions", variables.case_id] });
      qc.invalidateQueries({ queryKey: ["cases", variables.case_id] });
      qc.invalidateQueries({ queryKey: ["cases"] }); // Invalidate entire cases list
    },
  });
}

export function useFinalizeDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { case_id: string; final_action: string; notes?: string | null }) => {
      const url = apiUrl(`/finalize-decision/${payload.case_id}`);
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ final_action: payload.final_action, notes: payload.notes }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to finalize decision";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      // Invalidate all case-related queries
      qc.invalidateQueries({ queryKey: ["cases", variables.case_id] });
      qc.invalidateQueries({ queryKey: ["cases"] });
      qc.invalidateQueries({ queryKey: ["decisions", variables.case_id] });
      qc.invalidateQueries({ queryKey: ["audit_logs", variables.case_id] });
    },
  });
}

// ── Audit Logs ─────────────────────────────────────────────────────────────

export function useAuditLogs(caseId: string | undefined) {
  return useQuery({
    queryKey: ["audit_logs", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("case_id", caseId!)
        .order("timestamp", { ascending: true });
      if (error) throw error;
      return data as Tables<"audit_logs">[];
    },
  });
}
