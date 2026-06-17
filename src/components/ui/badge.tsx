import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
  {
    variants: {
      tone: {
        neutral: "border-line bg-panel text-muted",
        blue: "border-electric/30 bg-electric/10 text-electric",
        violet: "border-violet/30 bg-violet/10 text-violet",
        cyan: "border-cyan/30 bg-cyan/10 text-cyan",
        green: "border-green/30 bg-green/10 text-green",
        amber: "border-amber/30 bg-amber/10 text-amber",
        red: "border-red/30 bg-red/10 text-red",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
