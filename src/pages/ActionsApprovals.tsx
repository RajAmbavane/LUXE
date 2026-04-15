import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gavel, CheckCircle2, AlertTriangle, ArrowUpRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCase, useFinalizeDecision } from "@/hooks/useSupabaseData";
import { useAuth } from "@/hooks/useAuth";

const ACTION_LABELS: Record<string, string> = {
  APPROVE_REFUND: "Approve Refund",
  DENY_REFUND: "Deny Refund",
  ESCALATE: "Escalate",
  MANUAL_REVIEW: "Manual Review",
};

export default function ActionsApprovals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: caseData } = useCase(id);
  const finalizeDecision = useFinalizeDecision();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (finalAction: string) => {
    if (!id || !caseData) return;
    
    setIsProcessing(true);
    try {
      const result = await finalizeDecision.mutateAsync({
        case_id: id,
        final_action: finalAction,
        notes: notes || null,
      });

      toast.success(`Action recorded: ${ACTION_LABELS[finalAction] ?? finalAction}`, {
        description: `Case ${caseData.case_id} has been ${result.new_status}.`,
      });

      // Auto-navigate to queue after 1.5 seconds
      setTimeout(() => {
        navigate("/cases");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to record action: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsProcessing(false);
    }
  };

  const recommendedLabel = caseData?.recommended_action
    ? ACTION_LABELS[caseData.recommended_action] ?? caseData.recommended_action
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Actions & Approvals</h1>
        {caseData && (
          <p className="text-sm text-muted-foreground mt-1">{caseData.case_id} · {caseData.brand} {caseData.item_title}</p>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Gavel className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold text-foreground">Recommended Action</h2>
        </div>

        {recommendedLabel ? (
          <div className="bg-critical/5 border border-critical/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-critical/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-critical" />
              </div>
              <div>
                <p className="text-foreground font-semibold">{recommendedLabel}</p>
                {caseData?.confidence && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Based on {caseData.risk_score}/100 risk score with {caseData.confidence}% confidence.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-4 mb-4 text-sm text-muted-foreground">
            No AI recommendation available. Process the case first.
          </div>
        )}

        {!isProcessing ? (
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleAction(caseData?.recommended_action || "MANUAL_REVIEW")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={finalizeDecision.isPending || !caseData?.recommended_action}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Recommendation
            </Button>
            <Button
              onClick={() => handleAction("APPROVE_REFUND")}
              variant="outline"
              className="border-border/50 text-foreground hover:bg-muted"
              disabled={finalizeDecision.isPending}
            >
              Override — Approve Refund
            </Button>
            <Button
              onClick={() => handleAction("ESCALATE")}
              variant="outline"
              className="border-warning/30 text-warning hover:bg-warning/10"
              disabled={finalizeDecision.isPending}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" /> Escalate
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <p className="text-sm font-medium text-success">Decision recorded. Redirecting...</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Notes</h3>
        </div>
        <Textarea
          placeholder="Add investigation notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-muted/30 border-border/50 focus:border-primary/50 min-h-[100px] text-foreground"
          disabled={isProcessing}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">Workflow Status</h3>
        <div className="space-y-3">
          {[
            { step: "Return request received", status: "complete", time: caseData ? new Date(caseData.created_at).toLocaleString() : "—" },
            { step: "AI analysis completed", status: caseData?.recommended_action ? "complete" : "active", time: caseData?.recommended_action ? "Done" : "In progress" },
            { step: "Recommendation generated", status: caseData?.recommended_action ? "complete" : "pending", time: caseData?.recommended_action ? recommendedLabel : "Pending" },
            { step: "Human review", status: isProcessing ? "complete" : "active", time: isProcessing ? "Done" : "Awaiting" },
            { step: "Case closure", status: isProcessing ? "complete" : "pending", time: isProcessing ? "Closed" : "Pending" },
            { step: "Next case ready", status: isProcessing ? "active" : "pending", time: isProcessing ? "Loading..." : "Pending" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn("h-2 w-2 rounded-full",
                s.status === "complete" ? "bg-success" : s.status === "active" ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
              )} />
              <span className={cn("text-sm flex-1", s.status === "pending" ? "text-muted-foreground" : "text-foreground")}>{s.step}</span>
              <span className="text-xs text-muted-foreground">{s.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
