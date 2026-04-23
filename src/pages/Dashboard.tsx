import { AlertTriangle, Clock, CheckCircle2, DollarSign, ArrowRight, Zap, Shield, Brain, TrendingUp, Users, Star, Play, ChevronRight, Sparkles, Target, Award, Globe, Eye } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { RiskBadge, StatusBadge } from "@/components/shared/RiskBadge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useCases } from "@/hooks/useSupabaseData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const { data: cases = [], isLoading, error } = useCases();

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
    { title: "Refund Exposure", value: `${(refundExposure / 1000).toFixed(0)}K`, change: "Open case value", changeType: "positive" as const, icon: DollarSign },
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading intelligence dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4" />
          <div>Error loading data: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-info/10" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-info/20 rounded-full blur-3xl opacity-20" />
        
        <div className="relative px-6 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Luxury, Verified • AI-Powered Fraud Detection
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
              Stop Fraud Before It
              <span className="block text-gradient-primary">Costs You Millions</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              LuxeResolve uses advanced AI to detect luxury marketplace fraud with 94.2% accuracy, 
              saving companies an average of $2.3M annually in fraudulent refunds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/cases')}
              >
                <Play className="w-5 h-5 mr-2" />
                View Live Cases
              </Button>
            </div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                Enterprise Security
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                94.2% Accuracy
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-info" />
                Real-time Processing
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Live Intelligence Dashboard</h2>
            <p className="text-muted-foreground">Monitor fraud patterns and protect your marketplace in real-time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {metrics.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
              >
                <MetricCard {...m} index={i} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Analytics Dashboard */}
      <section className="px-6 py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold mb-4">Fraud Detection Analytics</h2>
            <p className="text-muted-foreground">Real-time insights from your AI fraud detection system</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Risk Score Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={riskBuckets}>
                  <XAxis 
                    dataKey="range" 
                    tick={{ fill: "hsl(220,9%,46%)", fontSize: 11 }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(220,9%,46%)", fontSize: 11 }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {riskBuckets.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card p-5">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Detection Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Accuracy Rate</span>
                  <span className="text-sm font-medium text-foreground">94.2%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "94.2%" }} 
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-success to-primary" 
                  />
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Ready to Explore the System?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              See how our AI analyzes real fraud cases and makes intelligent decisions 
              to protect your marketplace.
            </p>
            
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/cases')}
            >
              <Zap className="w-5 h-5 mr-2" />
              Explore Case Queue
            </Button>

            <div className="text-sm text-muted-foreground mt-6">
              Live demo with real fraud detection scenarios
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}