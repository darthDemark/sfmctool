"use client";

import Link from "next/link";
import { TrendingUp, Award, Target, Zap, Lock, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { SkillBar } from "@/components/dashboard/skill-bar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CompetencyMatrix } from "@/components/labs/competency-matrix";
import { useProgress } from "@/lib/progress";
import { competencyCategories, type Category } from "@/lib/competency";
import { rankForXp } from "@/lib/data";
import { ampLessons } from "@/lib/ampscript-curriculum";
import { sqlLessons } from "@/lib/sql-curriculum";
import { cn } from "@/lib/utils";

const skillColor: Record<Category, string> = {
  AMPscript: "var(--color-electric)",
  SQL: "var(--color-cyan)",
  "Journey Builder": "var(--color-violet)",
  "Automation Studio": "var(--color-amber)",
  Troubleshooting: "var(--color-green)",
};

function XpChart({ data }: { data: { t: number; xp: number }[] }) {
  if (data.length < 2) {
    return (
      <div className="grid h-48 place-items-center text-sm text-muted">
        Complete lessons to start plotting your XP trajectory.
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.xp), 1);
  const w = 100;
  const h = 100;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (d.xp / max) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-48 w-full">
        <defs>
          <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`0,${h} ${points} ${w},${h}`} fill="url(#xpFill)" stroke="none" />
        <polyline
          points={points}
          fill="none"
          stroke="#4F8CFF"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
        <span>start</span>
        <span>{data.length} checkpoints</span>
        <span>now</span>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { store, stats } = useProgress();

  const recommended = [
    ampLessons.find((l) => !store.completedLessons.includes(l.id)),
    sqlLessons.find((l) => !store.completedLessons.includes(l.id)),
  ].filter(Boolean) as { id: string; title: string }[];

  return (
    <AppShell title="Progress">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="Total XP"
            value={stats.xp.toLocaleString()}
            delta={rankForXp(stats.xp)}
            icon={Zap}
            accent="var(--color-cyan)"
          />
          <MetricCard
            label="Lessons Done"
            value={`${stats.lessonsCompleted}`}
            delta={`${stats.ampLessonsDone + stats.sqlLessonsDone} core lessons`}
            icon={Target}
            accent="var(--color-green)"
          />
          <MetricCard
            label="Readiness"
            value={`${stats.readiness}%`}
            delta="overall"
            icon={TrendingUp}
            accent="var(--color-electric)"
          />
          <MetricCard
            label="Badges"
            value={`${stats.badges.filter((b) => b.earned).length} / ${stats.badges.length}`}
            delta={`${stats.certCorrect} cert correct`}
            icon={Award}
            accent="var(--color-violet)"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>XP Trajectory</CardTitle>
              <Badge tone="blue">your history</Badge>
            </CardHeader>
            <CardBody>
              <XpChart data={store.xpHistory} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Readiness</CardTitle>
            </CardHeader>
            <CardBody className="flex justify-center">
              <ProgressRing value={stats.readiness} label="Ready" size={150} />
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skill Matrix</CardTitle>
            <span className="text-xs text-muted">computed from competencies</span>
          </CardHeader>
          <CardBody className="space-y-4">
            {(Object.keys(stats.categoryReadiness) as Category[]).map((c) => (
              <SkillBar
                key={c}
                name={c}
                value={stats.categoryReadiness[c]}
                color={skillColor[c]}
              />
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <span className="text-xs text-muted">
              {stats.badges.filter((b) => b.earned).length} earned
            </span>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {stats.badges.map((b) => (
              <div
                key={b.id}
                className={cn(
                  "rounded-lg border p-3",
                  b.earned
                    ? "border-violet/30 bg-violet/5"
                    : "border-line bg-deep/40 opacity-70"
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg",
                    b.earned ? "bg-violet/15 text-violet" : "bg-line/40 text-muted"
                  )}
                >
                  {b.earned ? <Award className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </span>
                <h4
                  className={cn(
                    "mt-2 text-sm font-semibold",
                    b.earned ? "text-text" : "text-muted"
                  )}
                >
                  {b.title}
                </h4>
                <p className="mt-0.5 text-[11px] leading-snug text-muted">
                  {b.description}
                </p>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Readiness by Competency</CardTitle>
            <span className="text-xs text-muted">
              {stats.competencies.filter((c) => c.status !== "Not Started").length}{" "}
              in progress
            </span>
          </CardHeader>
          <CardBody className="space-y-5">
            {competencyCategories.map((g) => (
              <div key={g.category}>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-text">{g.category}</h4>
                  <span className="font-mono text-xs text-muted">
                    {stats.categoryReadiness[g.category]}%
                  </span>
                </div>
                <CompetencyMatrix
                  items={stats.competencies.filter((c) => c.category === g.category)}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {recommended.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommended Next Lessons</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2">
              {recommended.map((l) => {
                const href = l.id.startsWith("amp-")
                  ? "/labs/ampscript"
                  : "/labs/sql";
                return (
                  <Link
                    key={l.id}
                    href={href}
                    className="flex items-center gap-3 rounded-lg border border-line bg-deep/40 px-4 py-3 hover:border-electric/40"
                  >
                    <span className="h-2 w-2 rounded-full bg-electric" />
                    <span className="flex-1 text-sm text-text">{l.title}</span>
                    <ArrowRight className="h-4 w-4 text-muted" />
                  </Link>
                );
              })}
            </CardBody>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
