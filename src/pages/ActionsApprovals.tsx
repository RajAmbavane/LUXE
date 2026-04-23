import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gavel, CheckCircle2, AlertTriangle, ArrowUpRight, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCase, useFinalizeDecision } from "@/hooks/useSupabaseData";

const ACTION_LABELS: Record<string, string> = {
  APPROVE_REFUND: "Approve Refund",
  DENY_REFUND: "Deny Refund",
  ESCALATE: "Escalate",
  MANUAL_REVIEW: "Manual Review",
};

export default function ActionsApprovals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: caseData, isLoading } = useCase(id);
  const finalizeDecision = useFinalizeDecision();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4" />
          <p>Case not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Actions & Approvals</h1>
        <p className="text-muted-foreground mt-2">{caseData.case_id} • {caseData.brand} {caseData.item_title}</p>
      </div>

      {/* AI Recommendation */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Gavel className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-display font-semibold text-foreground">AI Recommendation</h2>
        </div>

        {recommendedLabel ? (
          <div className="bg-gradient-to-r from-primary/5 to-info/5 border border-primary/20 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{recommendedLabel}</p>
                {caseData.confidence && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Risk Score: {caseData.risk_score}/100 • Confidence: {caseData.confidence}%
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-6 mb-6 text-center">
            <p className="text-muted-foreground">No AI recommendation available. Case needs to be processed first.</p>
          </div>
        )}

        {/* Action Buttons */}
        {!isProcessing ? (
          <div className="flex flex-wrap gap-3">
            {caseData.recommended_action && (
              <Button
                onClick={() => handleAction(caseData.recommended_action)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                disabled={finalizeDecision.isPending}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> 
                Approve: {ACTION_LABELS[caseData.recommended_action]}
              </Button>
            )}
            
            <Button
              onClick={() => handleAction("APPROVE_REFUND")}
              variant="outline"
              className="border-success/30 text-success hover:bg-success/10"
              disabled={finalizeDecision.isPending}
            >
              Override: Approve Refund
            </Button>
            
            <Button
              onClick={() => handleAction("DENY_REFUND")}
              variant="outline"
              className="border-critical/30 text-critical hover:bg-critical/10"
              disabled={finalizeDecision.isPending}
            >
              Override: Deny Refund
            </Button>
            
            <Button
              onClick={() => handleAction("ESCALATE")}
              variant="outline"
              className="border-warning/30 text-warning hover:bg-warning/10"
              disabled={finalizeDecision.isPending}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" /> 
              Escalate
            </Button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-success/5 border border-success/20 rounded-lg p-6"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-success" />
              <div>
                <p className="font-semibold text-success">Decision Recorded Successfully</p>
                <p className="text-sm text-muted-foreground mt-1">Redirecting to case queue...</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Notes Section */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }} 
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Investigation Notes</h3>
        </div>
        <Textarea
          placeholder="Add any additional notes about your decision..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-muted/30 border-border/50 focus:border-primary/50 min-h-[120px] text-foreground"
          disabled={isProcessing}
        />
        <p className="text-xs text-muted-foreground mt-2">
          These notes will be recorded in the audit log for compliance purposes.
        </p>
      </motion.div>

      {/* Case Summary */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }} 
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Case Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Case ID:</span>
            <span className="ml-2 font-medium">{caseData.case_id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Value:</span>
            <span className="ml-2 font-medium">${Number(caseData.price).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Dispute Type:</span>
            <span className="ml-2 font-medium">{caseData.dispute_type}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>
            <span className="ml-2 font-medium capitalize">{caseData.status.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Buyer:</span>
            <span className="ml-2 font-medium">{caseData.buyer_name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Seller:</span>
            <span className="ml-2 font-medium">{caseData.seller_name}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
