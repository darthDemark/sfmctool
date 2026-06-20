"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { academyTracks, type AcademyTrack } from "@/lib/data";
import { useProgress } from "@/lib/progress";
import type { Category } from "@/lib/competency";

const PHASES = ["Learn", "Practice", "Simulate", "Break", "Fix", "Assess"];

function trackCompleted(
  track: AcademyTrack,
  completedLessons: string[],
  categoryReadiness: Record<Category, number>
): number {
  if (track.source.kind === "lessons") {
    const prefix = track.source.prefix;
    return Math.min(
      track.total,
      completedLessons.filter((id) => id.startsWith(prefix)).length
    );
  }
  const pct = categoryReadiness[track.source.category as Category] ?? 0;
  return Math.round((pct / 100) * track.total);
}

export default function AcademyPage() {
  const { store, stats } = useProgress();

  return (
    <AppShell title="Academy">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-violet/10 via-card to-blue/10 p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet/15 text-violet">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                SFMC Academy
              </h2>
              <p className="text-sm text-muted">
                From zero knowledge to practical operator. Every track follows
                the same arc.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {PHASES.map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                <Badge tone="neutral">{p}</Badge>
                {i < PHASES.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-muted" />
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {academyTracks.map((track) => {
            const Icon = track.icon;
            const completed = trackCompleted(
              track,
              store.completedLessons,
              stats.categoryReadiness
            );
            const pct = Math.round((completed / track.total) * 100);
            const started = completed > 0;
            return (
              <Link
                key={track.slug}
                href={track.href}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-xl hover:shadow-black/40"
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                  style={{ background: track.accent }}
                />
                <div className="flex items-start justify-between">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl"
                    style={{ background: `${track.accent}1a`, color: track.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <Badge tone={started ? "blue" : "neutral"}>
                    {pct}% complete
                  </Badge>
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-tight text-text">
                  {track.title}
                </h3>
                <p className="text-[13px] font-medium text-muted">
                  {track.tagline}
                </p>

                <div className="mt-4 flex gap-1.5 text-[11px]">
                  <span className="rounded-md border border-green/30 bg-green/10 px-2 py-0.5 text-green">
                    {track.beginner} beginner
                  </span>
                  <span className="rounded-md border border-amber/30 bg-amber/10 px-2 py-0.5 text-amber">
                    {track.intermediate} inter
                  </span>
                  <span className="rounded-md border border-red/30 bg-red/10 px-2 py-0.5 text-red">
                    {track.advanced} adv
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>
                      {completed} / {track.total} lessons
                    </span>
                    <span className="font-mono">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-deep">
                    <div
                      className="h-full rounded-full transition-[width] duration-700"
                      style={{ width: `${pct}%`, background: track.accent }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
                  <span className="text-muted">
                    {started ? "Continue Track" : "Start Track"}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-electric transition-transform group-hover:translate-x-0.5">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
