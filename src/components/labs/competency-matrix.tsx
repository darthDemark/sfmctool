import { Badge } from "@/components/ui/badge";
import { statusTone, type CompetencyResult } from "@/lib/competency";

export function CompetencyMatrix({ items }: { items: CompetencyResult[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((c) => (
        <div
          key={`${c.category}-${c.item}`}
          className="rounded-lg border border-line bg-deep/40 p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-text">{c.item}</span>
            <Badge tone={statusTone[c.status]}>{c.status}</Badge>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-deep">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{
                width: `${Math.round(c.fill * 100)}%`,
                background:
                  c.fill >= 1
                    ? "var(--color-violet)"
                    : c.fill >= 0.65
                    ? "var(--color-green)"
                    : c.fill > 0
                    ? "var(--color-amber)"
                    : "var(--color-line)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
