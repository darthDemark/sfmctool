import Link from "next/link";
import { ArrowRight, Clock, Layers } from "lucide-react";
import type { Lab } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const difficultyTone = {
  Foundational: "green",
  Intermediate: "amber",
  Advanced: "red",
} as const;

export function LabCard({ lab }: { lab: Lab }) {
  const Icon = lab.icon;
  return (
    <Link
      href={lab.href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-xl hover:shadow-black/40"
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
        style={{ background: lab.accent }}
      />
      <div className="flex items-start justify-between">
        <span
          className="grid h-11 w-11 place-items-center rounded-xl"
          style={{ background: `${lab.accent}1a`, color: lab.accent }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <Badge tone={difficultyTone[lab.difficulty]}>{lab.difficulty}</Badge>
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-text">
        {lab.title}
      </h3>
      <p className="text-[13px] font-medium text-muted">{lab.tagline}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
        {lab.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {lab.skills.map((s) => (
          <span
            key={s}
            className="rounded-md border border-line bg-deep/60 px-2 py-0.5 text-[11px] text-muted"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" /> {lab.missions} missions
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> ~{lab.estMinutes}m
          </span>
        </span>
        <span className="flex items-center gap-1 font-semibold text-electric transition-transform group-hover:translate-x-0.5">
          Enter <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
