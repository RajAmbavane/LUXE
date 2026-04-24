import { useParams, useNavigate } from "react-router-dom";
import { useCase } from "@/hooks/useSupabaseData";
import { RiskBadge, StatusBadge } from "@/components/shared/RiskBadge";
import { User, Store } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: caseData, isLoading, refetch } = useCase(id);

  // Trigger AI processing when case is viewed and status is pending
  useEffect(() => {
    if (caseData?.status === "pending" && id) {
      const processCase = async () => {
        try {
          const response = await fetch(`/process-case/${id}`, {
            method: "POST",
          });
          if (response.ok) {
            // Refetch case data after processing
            setTimeout(() => refetch(), 1000);
          }
        } catch (error) {
          console.error("Failed to process case:", error);
        }
      };
      processCase();
    }
  }, [caseData?.status, id, refetch]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">Loading case...</div>;
  }

  if (!caseData) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">Case not found.</div>;
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/cases")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to Queue
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-display font-bold text-foreground">{caseData.case_id}</h1>
              <StatusBadge status={caseData.status} />
              <RiskBadge score={caseData.risk_score} size="sm" />
            </div>
            <p className="text-foreground">{caseData.brand} · {caseData.item_title}</p>
            <p className="text-2xl font-display font-bold text-primary mt-1">${Number(caseData.price).toLocaleString()}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Dispute type: <span className="text-foreground">{caseData.dispute_type}</span></p>
            <p>Opened {new Date(caseData.created_at).toLocaleDateString()}</p>
            {caseData.confidence && <p>AI confidence: <span className="text-foreground">{caseData.confidence}%</span></p>}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border/50">
          <TabsTrigger value="summary" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-foreground">Buyer</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground">{caseData.buyer_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Buyer ID</span><span className="text-foreground font-mono text-xs">{caseData.buyer_id || 'Not assigned'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Age</span><span className="text-foreground">{caseData.buyer_account_age_days || 0} days</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Return Rate</span><span className="text-foreground">{caseData.buyer_return_rate || 0}%</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Store className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-foreground">Seller</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground">{caseData.seller_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Seller ID</span><span className="text-foreground font-mono text-xs">{caseData.seller_id || 'Not assigned'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Age</span><span className="text-foreground">{caseData.seller_account_age_days || 0} days</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total Sales</span><span className="text-foreground">{caseData.seller_total_sales || 0}</span></div>
              </div>
            </motion.div>


          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
