import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useVisualAnalysis, useCase, useCaseImages } from "@/hooks/useSupabaseData";
import { Eye, AlertTriangle, CheckCircle2, Info, Scan } from "lucide-react";
import { cn } from "@/lib/utils";

function ScoreBar({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) {
  const pct = Math.round(value * 100);
  const bad = invert ? pct > 40 : pct < 60;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-semibold", bad ? "text-critical" : "text-success")}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
          className={cn("h-full rounded-full", bad ? "bg-critical" : "bg-success")}
        />
      </div>
    </div>
  );
}

export default function VisualAnalysis() {
  const { id } = useParams();
  const { data: caseData } = useCase(id);
  const { data: visual, isLoading } = useVisualAnalysis(id);
  const { data: images = [] } = useCaseImages(id);

  const findings   = (visual?.findings as any) || {};
  const sim        = findings.similarity   || {};
  const cond       = findings.condition    || {};
  const defects    = findings.defects      || {};
  const colMat     = findings.color_material || {};
  const auth       = findings.authenticity || {};

  const similarity  = sim.overall_similarity  ?? 0;
  const condScore   = cond.condition_score    ?? 0;
  const defectList  = Array.isArray(defects.defects) ? defects.defects : [];
  const isSameItem  = sim.is_same_item ?? true;
  const authConcern = auth.authenticity_concerns ?? false;

  const originalImage = images.find(i => i.image_type === "original_item");
  const returnedImage = images.find(i => i.image_type === "returned_item");

  // Build signal cards from real AI findings
  const signals: { label: string; severity: "high" | "medium" | "low"; detail: string }[] = [];
  if (similarity < 0.65)    signals.push({ label: "Low Item Similarity",      severity: "high",   detail: `Only ${Math.round(similarity*100)}% match between original and returned` });
  if (!isSameItem)           signals.push({ label: "Different Item Suspected", severity: "high",   detail: "AI determined this may not be the same item" });
  if (authConcern)           signals.push({ label: "Authenticity Concern",     severity: "high",   detail: auth.authenticity_notes || "Possible counterfeit detected" });
  if (condScore < 0.60)      signals.push({ label: "Poor Condition",           severity: "high",   detail: `Condition score ${Math.round(condScore*100)}% — significant wear or damage` });
  if (cond.damage_detected)  signals.push({ label: "Damage Detected",          severity: "medium", detail: cond.damage_description || "Physical damage observed" });
  if (defects.defects_found > 0) signals.push({ label: `${defects.defects_found} Defect(s) Found`, severity: "medium", detail: defectList.slice(0,2).join(", ") || "Defects identified" });
  if (colMat.color_fade_detected) signals.push({ label: "Color Fading",        severity: "medium", detail: "Noticeable color degradation vs original" });
  if (colMat.color_match < 0.75)  signals.push({ label: "Color Mismatch",      severity: "medium", detail: `Color match only ${Math.round((colMat.color_match||0)*100)}%` });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      <Scan className="h-5 w-5 mr-2 animate-pulse" /> Analysing images...
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Visual Analysis</h1>
        {caseData && (
          <p className="text-sm text-muted-foreground mt-1">
            {caseData.case_id} · {caseData.brand} {caseData.item_title}
            {visual?.vision_model_used && visual.vision_model_used !== "mock" && (
              <span className="ml-2 text-xs text-primary/70">· AI Vision</span>
            )}
          </p>
        )}
      </div>

      {/* Before / After images - smaller size with proper scaling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Original Listing</p>
          <div className="aspect-[4/3] rounded-lg bg-muted/30 border border-border/30 overflow-hidden flex items-center justify-center">
            {originalImage?.image_url
              ? <img src={originalImage.image_url} alt="Original" className="w-full h-full object-contain" />
              : <div className="text-center space-y-2"><Eye className="h-6 w-6 text-primary mx-auto opacity-40" /><p className="text-xs text-muted-foreground">No image</p></div>
            }
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Returned Item</p>
          <div className={cn("aspect-[4/3] rounded-lg bg-muted/30 border overflow-hidden flex items-center justify-center", !isSameItem ? "border-critical/40" : "border-border/30")}>
            {returnedImage?.image_url
              ? <img src={returnedImage.image_url} alt="Returned" className="w-full h-full object-contain" />
              : <div className="text-center space-y-2"><AlertTriangle className="h-6 w-6 text-critical mx-auto opacity-40" /><p className="text-xs text-muted-foreground">No image</p></div>
            }
          </div>
        </motion.div>
      </div>

      {/* Detected Issues - moved right below images */}
      {signals.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Detected Issues
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {signals.map((s, i) => {
              const Icon = s.severity === "high" ? AlertTriangle : s.severity === "medium" ? Info : CheckCircle2;
              const cls  = s.severity === "high" ? "border-critical/30 bg-critical/5 text-critical"
                         : s.severity === "medium" ? "border-warning/30 bg-warning/5 text-warning"
                         : "border-success/30 bg-success/5 text-success";
              return (
                <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                  className={cn("glass-card p-4 border", cls)}>
                  <div className="flex items-start gap-3">
                    <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Score bars */}
      {visual && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Comparison Scores</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <ScoreBar label="Overall Similarity"    value={sim.overall_similarity    ?? 0} />
            <ScoreBar label="Structural Match"      value={sim.structural_similarity ?? 0} />
            <ScoreBar label="Color Match"           value={colMat.color_match        ?? 0} />
            <ScoreBar label="Material Consistency"  value={colMat.material_consistency ?? 0} />
            <ScoreBar label="Condition Score"       value={cond.condition_score      ?? 0} />
            <ScoreBar label="Wear Level"            value={cond.wear_level           ?? 0} invert />
          </div>
        </motion.div>
      )}

      {/* Authenticity notes */}
      {auth.authenticity_notes && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Authenticity Notes</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{auth.authenticity_notes}</p>
        </motion.div>
      )}

      {!visual && !isLoading && (
        <div className="glass-card p-8 text-center text-muted-foreground text-sm">
          No visual analysis yet. Process the case to run AI vision analysis.
        </div>
      )}
    </div>
  );
}
