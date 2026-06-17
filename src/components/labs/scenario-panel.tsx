import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ScenarioPanel({
  code,
  title,
  difficulty,
  objective,
  brief,
  requirements,
  icon: Icon,
}: {
  code: string;
  title: string;
  difficulty: string;
  objective: string;
  brief: string;
  requirements: string[];
  icon: LucideIcon;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-electric">
            {code}
          </span>
          <Badge tone="violet">{difficulty}</Badge>
        </div>
        <div className="mt-2 flex items-start gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-electric/15 text-electric">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="text-base font-semibold leading-tight text-text">
            {title}
          </h2>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-5">
        <section>
          <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Objective
          </h4>
          <p className="text-sm font-medium text-text">{objective}</p>
        </section>

        <section>
          <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Scenario Brief
          </h4>
          <p className="text-sm leading-relaxed text-text-secondary">{brief}</p>
        </section>

        <section>
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Requirements
          </h4>
          <ul className="space-y-2">
            {requirements.map((req, i) => (
              <li
                key={i}
                className="flex gap-2.5 rounded-lg border border-line bg-deep/50 px-3 py-2 text-sm text-text-secondary"
              >
                <span className="font-mono text-xs text-electric">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {req}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
