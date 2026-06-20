"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type LabTab = { id: string; label: string; icon: LucideIcon };

export function LabTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: LabTab[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-line bg-card p-1">
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active === t.id
                ? "bg-electric/15 text-text"
                : "text-muted hover:text-text-secondary"
            )}
          >
            <Icon className="h-4 w-4" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
