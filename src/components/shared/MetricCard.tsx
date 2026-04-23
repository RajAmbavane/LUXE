import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  index?: number;
}

export function MetricCard({ title, value, change, changeType = "neutral", icon: Icon, index = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card p-6 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-info/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <motion.p 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
            className="text-3xl font-display font-black tracking-tight text-foreground"
          >
            {value}
          </motion.p>
          {change && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
              className={cn(
                "text-xs font-semibold flex items-center gap-1",
                changeType === "positive" ? "text-success" : 
                changeType === "negative" ? "text-critical" : 
                "text-muted-foreground"
              )}
            >
              {change}
            </motion.p>
          )}
        </div>
        
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5, type: "spring" }}
          className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 p-3 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 shadow-sm"
        >
          <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
        </motion.div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-info/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
    </motion.div>
  );
}
