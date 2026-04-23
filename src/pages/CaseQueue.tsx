import { useState } from "react";
import { Search, Loader2, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RiskBadge, StatusBadge } from "@/components/shared/RiskBadge";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCases } from "@/hooks/useSupabaseData";
import { useProcessingStatus, triggerProcessing } from "@/hooks/useProcessCase";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const filterChips = [
  { label: "Active", value: "active", count: 0 },
  { label: "Escalated", value: "escalated", count: 0 },
  { label: "Approved", value: "approved", count: 0 },
  { label: "Denied", value: "denied", count: 0 },
];

export default function CaseQueue() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cases = [], isLoading } = useCases();
  const { isProcessing, pendingCases } = useProcessingStatus();

  // Update filter counts
  const updatedFilterChips = filterChips.map(chip => ({
    ...chip,
    count: chip.value === "active" 
      ? cases.filter(c => c.status === "pending" || c.status === "under_review").length
      : chip.value === "escalated"
      ? cases.filter(c => c.status === "escalated").length
      : chip.value === "approved"
      ? cases.filter(c => c.status === "approved").length
      : cases.filter(c => c.status === "denied").length
  }));

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
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Case Queue</h1>
          <p className="text-muted-foreground mt-2">
            {cases.length} total cases • {filtered.length} matching filter
          </p>
        </div>
      </motion.div>

      {/* Processing Banner */}
      <AnimatePresence>
        {(isProcessing || pendingCases > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="glass-card p-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-info/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-info/10 opacity-50" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isProcessing ? (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-warning animate-pulse" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">
                    {isProcessing
                      ? "AI Pipeline Active"
                      : `${pendingCases} Cases Awaiting Analysis`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isProcessing
                      ? "Advanced computer vision and behavioral analysis in progress..."
                      : "Ready to process with 3-agent AI system"}
                  </p>
                </div>
              </div>
              {!isProcessing && pendingCases > 0 && (
                <Button
                  onClick={triggerProcessing()}
                  className="bg-primary hover:bg-primary/90 shadow-lg"
                >
                  Process Now
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
      >
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cases, brands, items, or buyers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 h-11"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {updatedFilterChips.map((chip) => (
            <motion.button
              key={chip.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(chip.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-2",
                activeFilter === chip.value
                  ? "bg-primary/15 text-primary border-primary/30 shadow-sm"
                  : "bg-card/50 text-muted-foreground border-border/50 hover:border-primary/20 hover:bg-primary/5"
              )}
            >
              {chip.label}
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-xs font-semibold",
                activeFilter === chip.value
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}>
                {chip.count}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Cases Table */}
      {isLoading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading case intelligence...</p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20">
                  {[
                    { label: "Case ID", key: "case" },
                    { label: "Brand / Item", key: "brand" },
                    { label: "Value", key: "value" },
                    { label: "Dispute Type", key: "type" },
                    { label: "Risk Score", key: "risk" },
                    { label: "Status", key: "status" },
                    { label: "Buyer", key: "buyer" },
                    { label: "Seller", key: "seller" }
                  ].map((header) => (
                    <th key={header.key} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      <div className="flex items-center gap-1">
                        {header.label}
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.02, duration: 0.3 }}
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="border-b border-border/20 hover:bg-primary/5 cursor-pointer transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {c.case_id}
                            </div>
                            {c.status === "pending" && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <Loader2 className="h-3 w-3 text-primary animate-spin" />
                                <span className="text-xs text-primary font-medium">AI Processing...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">{c.brand}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[250px]" title={c.item_title}>
                            {c.item_title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">
                          ${Number(c.price).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{c.dispute_type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <RiskBadge score={c.risk_score} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{c.buyer_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{c.seller_name}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-muted-foreground">
                        <Filter className="h-8 w-8 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No cases match your current filter</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
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
