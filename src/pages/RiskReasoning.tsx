import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useRiskSignals, useCase, useDecision, useVisualAnalysis } from "@/hooks/useSupabaseData";
import { Brain, User, Truck, Clock, AlertTriangle, ShieldAlert, MessageSquare, Package, Scale, Fingerprint, TrendingUp, Truck as TruckIcon, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function RiskRow({ label, value, highlight = false }: { label: string; value: string | number | boolean; highlight?: boolean }) {
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-xs font-medium", highlight ? "text-warning" : "text-foreground")}>{display}</span>
    </div>
  );
}

function AgentCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export default function RiskReasoning() {
  const { id } = useParams();
  const { data: caseData }      = useCase(id);
  const { data: behavioralRows } = useRiskSignals(id);
  const { data: decisionAgent }  = useDecision(id);
  const { data: visualAgent }    = useVisualAnalysis(id);

  const riskScore = caseData?.risk_score ?? 0;
  const riskLabel = riskScore >= 80 ? "Critical" : riskScore >= 60 ? "High" : riskScore >= 40 ? "Medium" : "Low";
  const riskColor = riskScore >= 60 ? "text-critical" : riskScore >= 40 ? "text-warning" : "text-success";
  const barColor  = riskScore >= 60 ? "from-critical to-critical" : riskScore >= 40 ? "from-warning to-critical" : "from-success to-warning";

  const beh  = (behavioralRows?.[0]?.findings as any) || {};
  const buyer  = beh.buyer_assessment  || {};
  const seller = beh.seller_assessment || {};
  const timing = beh.temporal_patterns || {};

  // Advanced metrics
  const weightConsistency   = beh.weight_consistency       || {};
  const itemIdentity        = beh.item_identity_confidence || {};
  const fraudPropensity     = beh.buyer_fraud_propensity   || {};
  const custodyAnomaly      = beh.custody_anomaly          || {};
  const policyTriggers      = beh.policy_triggers          || {};

  const visFindings = (visualAgent?.findings as any) || {};
  const sim  = visFindings.similarity  || {};
  const auth = visFindings.authenticity || {};

  const decFindings = (decisionAgent?.findings as any) || {};
  const agg = decFindings.aggregated_assessment || {};
  const decisionConfidence = agg.decision_confidence_score ?? (caseData?.confidence ? caseData.confidence / 100 : null);

  const meta = (caseData as any)?.metadata || {};
  const c = caseData as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Risk & Reasoning</h1>
        {caseData && (
          <p className="text-sm text-muted-foreground mt-1">{caseData.case_id} · {caseData.brand} {caseData.item_title}</p>
        )}
      </div>

      {/* Risk score */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Risk Assessment</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className={cn("text-3xl font-display font-bold", riskColor)}>{riskScore}</p>
              <p className={cn("text-xs font-medium", riskColor)}>{riskLabel} Risk</p>
            </div>
            <div className={cn("h-12 w-12 rounded-full border-4 flex items-center justify-center",
              riskScore >= 60 ? "border-critical/30" : riskScore >= 40 ? "border-warning/30" : "border-success/30")}>
              <AlertTriangle className={cn("h-5 w-5", riskColor)} />
            </div>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${riskScore}%` }} transition={{ duration: 1, delay: 0.3 }}
            className={cn("h-full rounded-full bg-gradient-to-r", barColor)} />
        </div>
        {caseData?.confidence != null && (
          <p className="text-xs text-muted-foreground mt-2">AI Confidence: {caseData.confidence}%</p>
        )}
      </motion.div>

      {/* Buyer / Seller / Timing / Comms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AgentCard title="Buyer Profile" icon={User}>
          <RiskRow label="Name"            value={c?.buyer_name || "—"} />
          <RiskRow label="Account Age"     value={`${c?.buyer_account_age_days ?? "—"} days`} />
          <RiskRow label="Past Cases"      value={c?.buyer_dispute_count ?? 0} />
          <RiskRow label="Fraud Flags"     value={meta.buyer_past_fraud_flags ?? 0} highlight={(meta.buyer_past_fraud_flags ?? 0) > 0} />
          <RiskRow label="Account Active"  value={meta.buyer_account_active ?? "yes"} />
          <RiskRow label="Risk Level"      value={buyer.risk_level || "—"} highlight={["high","critical"].includes(buyer.risk_level)} />
          <RiskRow label="Return Pattern"  value={buyer.return_pattern || "—"} />
          <RiskRow label="Dispute Pattern" value={buyer.dispute_pattern || "—"} />
        </AgentCard>

        <AgentCard title="Seller Profile" icon={Truck}>
          <RiskRow label="Name"              value={c?.seller_name || "—"} />
          <RiskRow label="Account Age"       value={`${c?.seller_account_age_days ?? "—"} days`} />
          <RiskRow label="Past Cases"        value={c?.seller_dispute_count ?? 0} />
          <RiskRow label="Fraud Flags"       value={meta.seller_past_fraud_flags ?? 0} highlight={(meta.seller_past_fraud_flags ?? 0) > 0} />
          <RiskRow label="Account Active"    value={meta.seller_account_active ?? "yes"} />
          <RiskRow label="Risk Level"        value={seller.risk_level || "—"} />
          <RiskRow label="Resolution Rate"   value={seller.dispute_resolution_rate != null ? `${Math.round(seller.dispute_resolution_rate * 100)}%` : "—"} />
          <RiskRow label="Avg Rating"        value={c?.seller_avg_rating ?? "—"} />
        </AgentCard>

        <AgentCard title="Shipping & Timing" icon={Clock}>
          <RiskRow label="Carrier"           value={c?.shipping_method || "—"} />
          <RiskRow label="Tracking"          value={c?.shipping_tracking_number || "—"} />
          <RiskRow label="Ship Date"         value={meta.ship_date || "—"} />
          <RiskRow label="Delivery Date"     value={c?.delivery_date ? new Date(c.delivery_date).toLocaleDateString() : "—"} />
          <RiskRow label="Days to Deliver"   value={meta.days_to_deliver ?? "—"} />
          <RiskRow label="Return Initiated"  value={c?.return_initiated_date ? new Date(c.return_initiated_date).toLocaleDateString() : "—"} />
          <RiskRow label="Days to Return"    value={timing.return_timing_days ?? meta.days_to_return ?? "—"} highlight={(timing.return_timing_days ?? 99) <= 2} />
          <RiskRow label="Signature Req."    value={c?.delivery_signature_required ? "Yes" : "No"} />
        </AgentCard>

        <AgentCard title="Visual & Authenticity" icon={Package}>
          <RiskRow label="Item Similarity"   value={sim.overall_similarity != null ? `${Math.round(sim.overall_similarity * 100)}%` : "—"} highlight={(sim.overall_similarity ?? 1) < 0.65} />
          <RiskRow label="Same Item"         value={sim.is_same_item != null ? (sim.is_same_item ? "Yes" : "No") : "—"} highlight={sim.is_same_item === false} />
          <RiskRow label="Auth. Concern"     value={auth.authenticity_concerns != null ? (auth.authenticity_concerns ? "Yes" : "No") : "—"} highlight={auth.authenticity_concerns === true} />
          <RiskRow label="Condition Score"   value={visFindings.condition?.condition_score != null ? `${Math.round(visFindings.condition.condition_score * 100)}%` : "—"} />
          <RiskRow label="Damage Detected"   value={visFindings.condition?.damage_detected != null ? (visFindings.condition.damage_detected ? "Yes" : "No") : "—"} highlight={visFindings.condition?.damage_detected === true} />
          <RiskRow label="Defects Found"     value={visFindings.defects?.defects_found ?? "—"} highlight={(visFindings.defects?.defects_found ?? 0) > 0} />
          <RiskRow label="Color Fade"        value={visFindings.color_material?.color_fade_detected != null ? (visFindings.color_material.color_fade_detected ? "Yes" : "No") : "—"} />
          <RiskRow label="Visual Model"      value={visualAgent?.vision_model_used || "—"} />
        </AgentCard>
      </div>

      {/* Advanced Metrics Panel */}
      {(weightConsistency.score != null || itemIdentity.confidence_score != null || fraudPropensity.propensity_score != null) && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Advanced Metrics</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

            {/* Metric 1: Weight Consistency */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className={cn("glass-card p-4 border", (weightConsistency.is_fraud_signal) ? "border-critical/30 bg-critical/5" : "border-border/30")}>
              <div className="flex items-center gap-2 mb-2">
                <Scale className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Weight Consistency</span>
              </div>
              <p className={cn("text-2xl font-display font-bold", weightConsistency.is_fraud_signal ? "text-critical" : "text-success")}>
                {weightConsistency.score != null ? `${Math.round((1 - weightConsistency.score) * 100)}%` : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{weightConsistency.detail || "No weight data"}</p>
              <span className={cn("text-xs font-medium mt-1 inline-block", weightConsistency.is_fraud_signal ? "text-critical" : "text-success")}>
                {weightConsistency.status || "—"}
              </span>
            </motion.div>

            {/* Metric 2: Item Identity Confidence */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className={cn("glass-card p-4 border", itemIdentity.is_fraud_signal ? "border-critical/30 bg-critical/5" : "border-border/30")}>
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Item Identity</span>
              </div>
              <p className={cn("text-2xl font-display font-bold", itemIdentity.is_fraud_signal ? "text-critical" : "text-success")}>
                {itemIdentity.confidence_score != null ? `${Math.round(itemIdentity.confidence_score * 100)}%` : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{itemIdentity.detail || "No verification data"}</p>
              <span className={cn("text-xs font-medium mt-1 inline-block capitalize", itemIdentity.level === "low" ? "text-critical" : itemIdentity.level === "medium" ? "text-warning" : "text-success")}>
                {itemIdentity.level || "—"} confidence
              </span>
            </motion.div>

            {/* Metric 3: Buyer Fraud Propensity */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}
              className={cn("glass-card p-4 border", fraudPropensity.is_fraud_signal ? "border-critical/30 bg-critical/5" : "border-border/30")}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Fraud Propensity</span>
              </div>
              <p className={cn("text-2xl font-display font-bold", fraudPropensity.is_fraud_signal ? "text-critical" : fraudPropensity.propensity_score > 0.30 ? "text-warning" : "text-success")}>
                {fraudPropensity.propensity_score != null ? `${Math.round(fraudPropensity.propensity_score * 100)}%` : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {fraudPropensity.key_factors?.[0] || "No significant factors"}
              </p>
              <span className={cn("text-xs font-medium mt-1 inline-block capitalize", fraudPropensity.level === "critical" || fraudPropensity.level === "high" ? "text-critical" : fraudPropensity.level === "medium" ? "text-warning" : "text-success")}>
                {fraudPropensity.level || "—"} risk
              </span>
            </motion.div>

            {/* Metric 4: Custody Anomaly */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className={cn("glass-card p-4 border", custodyAnomaly.level === "high" ? "border-warning/30 bg-warning/5" : "border-border/30")}>
              <div className="flex items-center gap-2 mb-2">
                <TruckIcon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Custody Anomaly</span>
              </div>
              <p className={cn("text-2xl font-display font-bold", custodyAnomaly.level === "high" ? "text-warning" : "text-success")}>
                {custodyAnomaly.anomaly_score != null ? `${Math.round(custodyAnomaly.anomaly_score * 100)}%` : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {custodyAnomaly.flags?.[0] || `Carrier: ${custodyAnomaly.carrier || "Unknown"}`}
              </p>
              {custodyAnomaly.suggests_carrier_fault && (
                <span className="text-xs font-medium mt-1 inline-block text-warning">Carrier fault likely</span>
              )}
            </motion.div>

            {/* Metric 5: Policy Triggers */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30 }}
              className={cn("glass-card p-4 border", policyTriggers.critical_triggers > 0 ? "border-critical/30 bg-critical/5" : policyTriggers.high_triggers > 0 ? "border-warning/30 bg-warning/5" : "border-border/30")}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Policy Triggers</span>
              </div>
              <p className={cn("text-2xl font-display font-bold", policyTriggers.critical_triggers > 0 ? "text-critical" : policyTriggers.high_triggers > 0 ? "text-warning" : "text-success")}>
                {policyTriggers.trigger_count ?? 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {policyTriggers.trigger_count > 0
                  ? `${policyTriggers.critical_triggers ?? 0} critical, ${policyTriggers.high_triggers ?? 0} high`
                  : "No triggers fired"}
              </p>
              <span className={cn("text-xs font-medium mt-1 inline-block", policyTriggers.enforcement === "DENY_REFUND" ? "text-critical" : policyTriggers.enforcement === "ESCALATE" ? "text-warning" : "text-success")}>
                {policyTriggers.enforcement || "No enforcement"}
              </span>
            </motion.div>

            {/* Metric 6: Decision Confidence */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="glass-card p-4 border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Decision Confidence</span>
              </div>
              <p className="text-2xl font-display font-bold text-primary">
                {decisionConfidence != null ? `${Math.round(decisionConfidence * 100)}%` : `${caseData?.confidence ?? "—"}%`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {decisionConfidence != null && decisionConfidence > 0.85
                  ? "Strong signal agreement across agents"
                  : decisionConfidence != null && decisionConfidence > 0.70
                  ? "Moderate confidence — some signal divergence"
                  : "Low confidence — manual review recommended"}
              </p>
              <span className={cn("text-xs font-medium mt-1 inline-block",
                (decisionConfidence ?? 0) > 0.85 ? "text-success" : (decisionConfidence ?? 0) > 0.70 ? "text-warning" : "text-critical")}>
                {(decisionConfidence ?? 0) > 0.85 ? "High" : (decisionConfidence ?? 0) > 0.70 ? "Medium" : "Low"} confidence
              </span>
            </motion.div>

          </div>

          {/* Policy trigger details */}
          {policyTriggers.triggers?.length > 0 && (
            <div className="glass-card p-4 border border-warning/20">
              <p className="text-xs font-medium text-foreground mb-2">Policy Trigger Details</p>
              <div className="space-y-2">
                {policyTriggers.triggers.map((t: any) => (
                  <div key={t.id} className="flex items-start gap-2">
                    <span className={cn("text-xs font-mono px-1.5 py-0.5 rounded shrink-0",
                      t.severity === "critical" ? "bg-critical/10 text-critical" :
                      t.severity === "high" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                    )}>{t.id}</span>
                    <div>
                      <span className="text-xs font-medium text-foreground">{t.name}</span>
                      <p className="text-xs text-muted-foreground">{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviewer notes from Excel */}
      {meta.notes && (
        <AgentCard title="Reviewer Notes" icon={MessageSquare}>
          <p className="text-sm text-foreground/80 leading-relaxed">{meta.notes}</p>
        </AgentCard>
      )}

      {/* AI Decision Reasoning */}
      {((c as any)?.ai_explanation || decisionAgent?.reasoning) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">AI Decision Reasoning</h3>
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed bg-muted/40 rounded-lg p-4 border border-border/40">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {(c as any)?.ai_explanation || decisionAgent?.reasoning}
            </pre>
          </div>
        </motion.div>
      )}

      {/* Recommended action */}
      {caseData?.recommended_action && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Recommended Action</span>
          </div>
          <span className={cn("text-sm font-bold px-3 py-1 rounded-full",
            caseData.recommended_action === "APPROVE_REFUND" ? "bg-success/10 text-success" :
            caseData.recommended_action === "DENY_REFUND"    ? "bg-critical/10 text-critical" :
            caseData.recommended_action === "ESCALATE"       ? "bg-warning/10 text-warning" :
            "bg-primary/10 text-primary"
          )}>
            {caseData.recommended_action.replace(/_/g, " ")}
          </span>
        </motion.div>
      )}
    </div>
  );
}
