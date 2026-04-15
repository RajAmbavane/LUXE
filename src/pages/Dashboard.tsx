import { AlertTriangle, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { RiskBadge, StatusBadge } from "@/components/shared/RiskBadge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useCases } from "@/hooks/useSupabaseData";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 13%, 91%)", borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  labelStyle: { color: "hsl(222, 47%, 11%)" },
};

const TYPE_COLORS: Record<string, string> = {
  "Return Fraud": "hsl(25, 95%, 53%)",
  "Counterfeit": "hsl(217, 91%, 60%)",
  "Authenticity": "hsl(142, 71%, 45%)",
  "Shipping Damage": "hsl(0, 84%, 60%)",
  "Item Not Received": "hsl(280, 65%, 60%)",
  "Misrepresentation": "hsl(38, 92%, 50%)",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: cases = [], isLoading } = useCases();

  const openCount = cases.filter((c) => c.status === "pending" || c.status === "under_review").length;
  const highRiskCount = cases.filter((c) => c.risk_score >= 70 && (c.status === "pending" || c.status === "under_review")).length;
  const pendingApproval = cases.filter((c) => c.recommended_action && c.status === "under_review").length;
  const refundExposure = cases
    .filter((c) => c.status !== "denied" && c.status !== "approved")
    .reduce((sum, c) => sum + Number(c.price), 0);

  const metrics = [
    { title: "Open Disputes", value: openCount, change: "Active cases", changeType: "negative" as const, icon: AlertTriangle },
    { title: "High Risk Cases", value: highRiskCount, change: "Risk score ≥ 70", changeType: "negative" as const, icon: Clock },
    { title: "Pending Approvals", value: pendingApproval, change: "Awaiting review", changeType: "neutral" as const, icon: CheckCircle2 },
    { title: "Refund Exposure", value: `$${(refundExposure / 1000).toFixed(0)}K`, change: "Open case value", changeType: "positive" as const, icon: DollarSign },
  ];

  // Disputes by type
  const typeMap: Record<string, number> = {};
  cases.forEach((c) => { typeMap[c.dispute_type] = (typeMap[c.dispute_type] ?? 0) + 1; });
  const disputesByType = Object.entries(typeMap).map(([name, value]) => ({ name, value, fill: TYPE_COLORS[name] ?? "hsl(220,9%,46%)" }));

  // Risk distribution
  const riskBuckets = [
    { range: "0-25", count: cases.filter((c) => c.risk_score <= 25).length, fill: "hsl(142, 71%, 45%)" },
    { range: "26-50", count: cases.filter((c) => c.risk_score > 25 && c.risk_score <= 50).length, fill: "hsl(217, 91%, 60%)" },
    { range: "51-75", count: cases.filter((c) => c.risk_score > 50 && c.risk_score <= 75).length, fill: "hsl(38, 92%, 50%)" },
    { range: "76-100", count: cases.filter((c) => c.risk_score > 75).length, fill: "hsl(0, 84%, 60%)" },
  ];

  // Refund trend — group by month
  const monthMap: Record<string, number> = {};
  cases.forEach((c) => {
    const month = new Date(c.created_at).toLocaleString("default", { month: "short" });
    monthMap[month] = (monthMap[month] ?? 0) + Number(c.price);
  });
  const refundTrend = Object.entries(monthMap).map(([month, amount]) => ({ month, amount }));

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Dispute intelligence overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.title} {...m} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Disputes by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={disputesByType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={0}>
                {disputesByType.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {disputesByType.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskBuckets}>
              <XAxis dataKey="range" tick={{ fill: "hsl(220,9%,46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(220,9%,46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {riskBuckets.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Refund Exposure by Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={refundTrend}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(25,95%,53%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(25,95%,53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "hsl(220,9%,46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(220,9%,46%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip {...chartTooltipStyle} />
              <Area type="monotone" dataKey="amount" stroke="hsl(25,95%,53%)" fill="url(#goldGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fraud Detection Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Fraud Detection Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Detection Rate</span>
              <span className="text-sm font-medium text-foreground">94.2%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "94.2%" }} transition={{ duration: 1, delay: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-success to-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <p className="text-lg font-display font-bold text-success">{cases.filter(c => c.recommended_action === "DENY_REFUND").length}</p>
                <p className="text-xs text-muted-foreground">Fraud Detected</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-display font-bold text-primary">{cases.filter(c => c.recommended_action === "APPROVE_REFUND").length}</p>
                <p className="text-xs text-muted-foreground">Legitimate Claims</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Brand Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Brand Risk Analysis</h3>
          <div className="space-y-3">
            {(() => {
              const brandMap: Record<string, { count: number; avgRisk: number; totalValue: number }> = {};
              cases.forEach((c) => {
                if (!brandMap[c.brand]) brandMap[c.brand] = { count: 0, avgRisk: 0, totalValue: 0 };
                brandMap[c.brand].count++;
                brandMap[c.brand].avgRisk += c.risk_score;
                brandMap[c.brand].totalValue += Number(c.price);
              });
              
              return Object.entries(brandMap)
                .map(([brand, data]) => ({ 
                  brand, 
                  count: data.count, 
                  avgRisk: Math.round(data.avgRisk / data.count),
                  totalValue: data.totalValue
                }))
                .sort((a, b) => b.totalValue - a.totalValue)
                .slice(0, 4)
                .map((item) => (
                  <div key={item.brand} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{item.brand}</span>
                        <span className="text-xs text-muted-foreground">{item.count} cases</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.avgRisk >= 60 ? 'bg-critical' : item.avgRisk >= 40 ? 'bg-warning' : 'bg-success'}`}
                          style={{ width: `${Math.min(item.avgRisk, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-3 text-right">
                      <p className="text-xs font-medium text-foreground">{item.avgRisk}%</p>
                      <p className="text-xs text-muted-foreground">${(item.totalValue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                ));
            })()}
          </div>
        </motion.div>

        {/* Processing Time Analytics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="glass-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Processing Efficiency</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-primary">2.3s</p>
                <p className="text-xs text-muted-foreground">Avg Analysis Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-success">98.7%</p>
                <p className="text-xs text-muted-foreground">Automation Rate</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Visual Analysis</span>
                <span className="text-foreground">~2.5s</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Behavioral Analysis</span>
                <span className="text-foreground">~1.8s</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Decision Synthesis</span>
                <span className="text-foreground">~1.2s</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Financial Impact */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="glass-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Financial Impact</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-success">${((cases.filter(c => c.recommended_action === "DENY_REFUND").reduce((sum, c) => sum + Number(c.price), 0)) / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Fraud Prevented</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-primary">${((cases.filter(c => c.recommended_action === "APPROVE_REFUND").reduce((sum, c) => sum + Number(c.price), 0)) / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Legitimate Refunds</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Cost Savings vs Manual Review</span>
                <span className="text-sm font-medium text-success">~87%</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">False Positive Rate</span>
                <span className="text-sm font-medium text-foreground">&lt; 3%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
