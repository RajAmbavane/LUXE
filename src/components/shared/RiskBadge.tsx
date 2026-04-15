import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function getRiskLevel(score: number) {
  if (score >= 75) return { label: "Critical", className: "bg-critical/15 text-critical border-critical/30" };
  if (score >= 50) return { label: "High", className: "bg-warning/15 text-warning border-warning/30" };
  if (score >= 25) return { label: "Medium", className: "bg-info/15 text-info border-info/30" };
  return { label: "Low", className: "bg-success/15 text-success border-success/30" };
}

export function RiskBadge({ score, size = "md", showLabel = true }: RiskBadgeProps) {
  const risk = getRiskLevel(score);
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border font-medium", risk.className, sizeClasses[size])}>
      <span className="font-semibold">{score}</span>
      {showLabel && <span className="opacity-80">· {risk.label}</span>}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-info/15 text-info border-info/30",
    under_review: "bg-warning/15 text-warning border-warning/30",
    approved: "bg-success/15 text-success border-success/30",
    denied: "bg-critical/15 text-critical border-critical/30",
    escalated: "bg-primary/15 text-primary border-primary/30",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    under_review: "Under Review",
    approved: "Approved",
    denied: "Denied",
    escalated: "Escalated",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", styles[status] ?? "bg-muted text-muted-foreground border-border")}>
      {labels[status] ?? status}
    </span>
  );
}
