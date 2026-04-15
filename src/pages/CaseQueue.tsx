import { useState } from "react";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RiskBadge, StatusBadge } from "@/components/shared/RiskBadge";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCases } from "@/hooks/useSupabaseData";
import { useProcessingStatus, triggerProcessing } from "@/hooks/useProcessCase";
import { useQueryClient } from "@tanstack/react-query";

const filterChips = [
  { label: "Active", value: "active" },
  { label: "Escalated", value: "escalated" },
  { label: "Approved", value: "approved" },
  { label: "Denied", value: "denied" },
];

export default function CaseQueue() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cases = [], isLoading } = useCases();
  const { isProcessing, pendingCases } = useProcessingStatus();

  const filtered = cases.filter((c) => {
    const matchSearch =
      !search ||
      c.case_id.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.toLowerCase().includes(search.toLowerCase()) ||
      c.item_title.toLowerCase().includes(search.toLowerCase()) ||
      c.buyer_name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeFilter === "active") return c.status === "pending" || c.status === "under_review";
    if (activeFilter === "escalated") return c.status === "escalated";
    if (activeFilter === "approved") return c.status === "approved";
    if (activeFilter === "denied") return c.status === "denied";
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Case Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">{cases.length} total cases</p>
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ["cases"] })}
          className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Processing banner */}
      <AnimatePresence>
        {(isProcessing || pendingCases > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card p-4 border border-primary/20 bg-primary/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {isProcessing
                ? <Loader2 className="h-4 w-4 text-primary animate-spin" />
                : <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
              }
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isProcessing
                    ? "AI pipeline is running — analysing cases with vision model..."
                    : `${pendingCases} case(s) pending AI analysis`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isProcessing
                    ? "Cases will appear here automatically when complete."
                    : "Click Process to start AI analysis."}
                </p>
              </div>
            </div>
            {!isProcessing && pendingCases > 0 && (
              <button
                onClick={() => triggerProcessing()}
                className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Process Now
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by case, brand, or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setActiveFilter(chip.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                activeFilter === chip.value
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/20"
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading cases...
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  {["Case", "Brand / Item", "Value", "Type", "Risk", "Status", "Buyer", "Seller"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => navigate(`/cases/${c.id}`)}
                    className="border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-medium text-foreground">{c.case_id}</div>
                      {c.status === "pending" && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Loader2 className="h-2.5 w-2.5 text-primary animate-spin" />
                          <span className="text-xs text-primary">Processing...</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-foreground">{c.brand}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{c.item_title}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground">${Number(c.price).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.dispute_type}</td>
                    <td className="px-5 py-3.5"><RiskBadge score={c.risk_score} size="sm" /></td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.buyer_name}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.seller_name}</td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted-foreground">No cases match your filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
