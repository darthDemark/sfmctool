import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "var(--color-electric)",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ background: `${accent}1a`, color: accent }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 font-mono text-2xl font-bold text-text">{value}</div>
      {delta && (
        <div
          className={cn(
            "mt-1 text-xs font-medium",
            delta.startsWith("-") ? "text-red" : "text-green"
          )}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
