"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  Flame,
  Zap,
  CheckCircle2,
  Info,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { SkillBar } from "@/components/dashboard/skill-bar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { user, rankForXp, criticalIncident } from "@/lib/data";
import { useProgress } from "@/lib/progress";
import { ampLessons } from "@/lib/ampscript-curriculum";
import { sqlLessons } from "@/lib/sql-curriculum";
import type { Category } from "@/lib/competency";
import { cn } from "@/lib/utils";

const activityIcon = {
  success: { icon: CheckCircle2, color: "text-green" },
  info: { icon: Info, color: "text-electric" },
  warning: { icon: AlertCircle, color: "text-amber" },
};

const skillColor: Record<Category, string> = {
  AMPscript: "var(--color-electric)",
  SQL: "var(--color-cyan)",
  "Journey Builder": "var(--color-violet)",
  "Automation Studio": "var(--color-amber)",
  Troubleshooting: "var(--color-green)",
};

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function DashboardPage() {
  const { store, stats, hydrated } = useProgress();

  const nextLesson =
    ampLessons.find((l) => !store.completedLessons.includes(l.id)) ??
    sqlLessons.find((l) => !store.completedLessons.includes(l.id));
  const nextHref = nextLesson?.id.startsWith("amp-")
    ? "/labs/ampscript"
    : "/labs/sql";
  const nextTrack = nextLesson?.id.startsWith("amp-") ? "AMPscript" : "SQL";

  const badgesEarned = stats.badges.filter((b) => b.earned).length;

  return (
    <AppShell
      title="Dashboard"
      rightRail={
        <div className="space-y-5">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              <Activity className="h-3.5 w-3.5" /> Recent Activity
            </h3>
            {store.activity.length === 0 ? (
              <p className="text-[13px] text-muted">
                No activity yet. Complete a lesson to start your log.
              </p>
            ) : (
              <div className="space-y-3">
                {store.activity.slice(0, 6).map((a) => {
                  const { icon: Icon, color } = activityIcon[a.type];
                  return (
                    <div key={a.id} className="flex gap-3">
                      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
                      <div className="min-w-0">
                        <p className="text-[13px] leading-snug text-text-secondary">
                          {a.text}
                        </p>
                        <span className="text-[11px] text-muted">
                          {timeAgo(a.ts)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-line bg-card p-4">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Readiness by competency
            </h3>
            <div className="space-y-2.5">
              {(Object.keys(stats.categoryReadiness) as Category[]).map((c) => (
                <div key={c}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span className="text-text-secondary">{c}</span>
                    <span className="font-mono text-muted">
                      {stats.categoryReadiness[c]}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-deep">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${stats.categoryReadiness[c]}%`,
                        background: skillColor[c],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back, {user.name}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {hydrated
                ? `${rankForXp(stats.xp)} · ${stats.lessonsCompleted} lessons completed · ${store.streak}-day streak`
                : "Loading your operational record…"}
            </p>
          </div>
          <Button href="/academy" size="sm">
            <GraduationCap className="h-4 w-4" /> Open Academy
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="Total XP"
            value={stats.xp.toLocaleString()}
            delta={`${stats.lessonsCompleted} lessons`}
            icon={Zap}
            accent="var(--color-cyan)"
          />
          <MetricCard
            label="Readiness"
            value={`${stats.readiness}%`}
            delta="across 5 disciplines"
            icon={Activity}
            accent="var(--color-electric)"
          />
          <MetricCard
            label="Streak"
            value={`${store.streak} days`}
            delta={store.streak > 0 ? "active" : "start today"}
            icon={Flame}
            accent="var(--color-amber)"
          />
          <MetricCard
            label="Badges"
            value={`${badgesEarned} / ${stats.badges.length}`}
            delta={`${stats.certCorrect} cert answers`}
            icon={Award}
            accent="var(--color-violet)"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Operational Readiness</CardTitle>
              <Badge tone="blue">Computed</Badge>
            </CardHeader>
            <CardBody className="flex flex-col items-center">
              <ProgressRing value={stats.readiness} label="Ready" sublabel="for the field" />
              <p className="mt-4 text-center text-sm text-text-secondary">
                Calculated live from your completed lessons, challenges, and
                simulations.
              </p>
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Skill Matrix</CardTitle>
              <span className="text-xs text-muted">5 disciplines tracked</span>
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
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue Training</CardTitle>
              <Badge tone="amber">{nextTrack}</Badge>
            </CardHeader>
            <CardBody>
              {nextLesson ? (
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-electric">
                    {nextTrack} · next up
                  </span>
                  <h4 className="mt-1.5 text-lg font-semibold">
                    {nextLesson.title}
                  </h4>
                  <p className="mt-2 text-sm text-text-secondary">
                    Pick up your path where you left off.
                  </p>
                  <Button href={nextHref} className="mt-4 w-full" size="sm">
                    Resume Lesson <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <h4 className="text-lg font-semibold text-green">
                    All core lessons complete
                  </h4>
                  <p className="mt-2 text-sm text-text-secondary">
                    Sharpen your edge with the Challenge tabs and the mock
                    certification exam.
                  </p>
                  <Button href="/certification-prep" className="mt-4 w-full" size="sm">
                    Mock Exam <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="border-red/30">
            <CardHeader className="border-red/20">
              <CardTitle className="flex items-center gap-2 text-red">
                <AlertTriangle className="h-4 w-4" /> Critical Incident
              </CardTitle>
              <Badge tone="red">{criticalIncident.severity}</Badge>
            </CardHeader>
            <CardBody>
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                {criticalIncident.id} · {criticalIncident.system}
              </span>
              <h4 className="mt-1.5 text-lg font-semibold">
                {criticalIncident.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {criticalIncident.summary}
              </p>
              <Button
                href="/labs/troubleshooting"
                variant="danger"
                className="mt-4 w-full"
                size="sm"
              >
                Respond to Incident <ArrowRight className="h-4 w-4" />
              </Button>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <Link
              href="/progress"
              className="text-xs font-medium text-electric hover:underline"
            >
              View progress
            </Link>
          </CardHeader>
          <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.badges.map((b) => (
              <div
                key={b.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3",
                  b.earned
                    ? "border-violet/30 bg-violet/5"
                    : "border-line bg-deep/40 opacity-70"
                )}
              >
                <Award
                  className={cn(
                    "h-5 w-5 shrink-0",
                    b.earned ? "text-violet" : "text-muted"
                  )}
                />
                <div>
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      b.earned ? "text-text" : "text-muted"
                    )}
                  >
                    {b.title}
                  </div>
                  <div className="text-[11px] text-muted">{b.description}</div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
