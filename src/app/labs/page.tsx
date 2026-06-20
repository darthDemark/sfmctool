"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { labs, type Lab } from "@/lib/data";
import { useProgress } from "@/lib/progress";
import { ampLessons } from "@/lib/ampscript-curriculum";
import { sqlLessons } from "@/lib/sql-curriculum";

const difficultyTone = {
  Foundational: "green",
  Intermediate: "amber",
  Advanced: "red",
} as const;

function LabCard({ lab }: { lab: Lab }) {
  const { store, stats } = useProgress();
  const Icon = lab.icon;

  let progressLabel = lab.unit;
  if (lab.slug === "ampscript") {
    progressLabel = `${stats.ampLessonsDone}/${ampLessons.length} lessons`;
  } else if (lab.slug === "sql") {
    progressLabel = `${stats.sqlLessonsDone}/${sqlLessons.length} challenges`;
  } else if (lab.slug === "journey-builder") {
    progressLabel = `${store.simRuns.journey} simulations run`;
  } else if (lab.slug === "automation-studio") {
    progressLabel = `${store.simRuns.automation} automations run`;
  } else if (lab.slug === "troubleshooting") {
    progressLabel = `${store.incidentsResolved} incidents resolved`;
  }

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
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {progressLabel}
        </span>
        <span className="flex items-center gap-1 font-semibold text-electric transition-transform group-hover:translate-x-0.5">
          Enter <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function LabsPage() {
  return (
    <AppShell title="Labs">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-blue/10 via-card to-violet/10 p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-electric/15 text-electric">
              <FlaskConical className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Training Labs</h2>
              <p className="text-sm text-muted">
                Learn → Practice → Simulate → Break → Fix → Assess. Each lab
                tracks your real progress.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {labs.map((lab) => (
            <LabCard key={lab.slug} lab={lab} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
