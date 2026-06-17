"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  Flame,
  Play,
  Trophy,
  Zap,
  CheckCircle2,
  Info,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { SkillBar } from "@/components/dashboard/skill-bar";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  user,
  skills,
  criticalIncident,
  missions,
  recentActivity,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const activityIcon = {
  success: { icon: CheckCircle2, color: "text-green" },
  info: { icon: Info, color: "text-electric" },
  warning: { icon: AlertCircle, color: "text-amber" },
};

function RightRail() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
          <Activity className="h-3.5 w-3.5" /> Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((a) => {
            const { icon: Icon, color } = activityIcon[a.type];
            return (
              <div key={a.id} className="flex gap-3">
                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
                <div className="min-w-0">
                  <p className="text-[13px] leading-snug text-text-secondary">
                    {a.text}
                  </p>
                  <span className="text-[11px] text-muted">{a.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-card p-4">
        <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
          <Trophy className="h-3.5 w-3.5" /> Leaderboard
        </h3>
        <div className="space-y-2">
          {[
            { name: "M. Vega", xp: 18420, you: false },
            { name: "Heron", xp: 12430, you: true },
            { name: "K. Owens", xp: 11280, you: false },
            { name: "S. Patel", xp: 9640, you: false },
          ].map((row, i) => (
            <div
              key={row.name}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm",
                row.you && "bg-electric/10"
              )}
            >
              <span className="w-4 font-mono text-xs text-muted">{i + 1}</span>
              <span
                className={cn(
                  "flex-1 truncate",
                  row.you ? "font-semibold text-text" : "text-text-secondary"
                )}
              >
                {row.name}
              </span>
              <span className="font-mono text-xs text-cyan">
                {row.xp.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const inProgress = missions.find((m) => m.status === "in-progress");

  return (
    <AppShell title="Dashboard" rightRail={<RightRail />}>
      <div className="space-y-6">
        {/* Greeting */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Good morning, {user.name}
            </h2>
            <p className="mt-1 text-sm text-muted">
              You&apos;re {user.rank}. 1 mission in progress · {user.streak}-day
              streak active.
            </p>
          </div>
          <Button href="/labs" size="sm">
            <Play className="h-4 w-4" /> Resume Training
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="Total XP"
            value={user.xp.toLocaleString()}
            delta="+1,230 this week"
            icon={Zap}
            accent="var(--color-cyan)"
          />
          <MetricCard
            label="Readiness"
            value={`${user.operationalReadiness}%`}
            delta="+8% this month"
            icon={Activity}
            accent="var(--color-electric)"
          />
          <MetricCard
            label="Streak"
            value={`${user.streak} days`}
            delta="Personal best"
            icon={Flame}
            accent="var(--color-amber)"
          />
          <MetricCard
            label="Badges"
            value="3 / 6"
            delta="2 in progress"
            icon={Award}
            accent="var(--color-violet)"
          />
        </div>

        {/* Readiness + skills */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Operational Readiness</CardTitle>
              <Badge tone="blue">Live</Badge>
            </CardHeader>
            <CardBody className="flex flex-col items-center">
              <ProgressRing
                value={user.operationalReadiness}
                label="Ready"
                sublabel="for the field"
              />
              <p className="mt-4 text-center text-sm text-text-secondary">
                Combat-readiness across all SFMC disciplines.
              </p>
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Skill Matrix</CardTitle>
              <span className="text-xs text-muted">5 disciplines tracked</span>
            </CardHeader>
            <CardBody className="space-y-4">
              {skills.map((s) => (
                <SkillBar key={s.name} {...s} />
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Continue + Incident */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue Training</CardTitle>
              <Badge tone="amber">In Progress</Badge>
            </CardHeader>
            <CardBody>
              {inProgress && (
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-electric">
                    {inProgress.code} · {inProgress.lab}
                  </span>
                  <h4 className="mt-1.5 text-lg font-semibold">
                    {inProgress.title}
                  </h4>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-deep">
                    <div className="h-full w-2/3 rounded-full gradient-primary" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted">
                    <span>66% complete</span>
                    <span className="font-mono text-cyan">
                      +{inProgress.xp} XP
                    </span>
                  </div>
                  <Button
                    href="/labs/ampscript"
                    className="mt-4 w-full"
                    size="sm"
                  >
                    Resume Mission <ArrowRight className="h-4 w-4" />
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

        {/* Mission log */}
        <Card>
          <CardHeader>
            <CardTitle>Mission Log</CardTitle>
            <Link
              href="/progress"
              className="text-xs font-medium text-electric hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardBody className="space-y-2">
            {missions.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 rounded-lg border border-line bg-deep/40 px-4 py-2.5"
              >
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    m.status === "completed" && "bg-green",
                    m.status === "in-progress" && "bg-amber animate-pulse",
                    m.status === "locked" && "bg-line"
                  )}
                />
                <span className="hidden w-20 shrink-0 font-mono text-xs text-muted sm:block">
                  {m.code}
                </span>
                <span
                  className={cn(
                    "flex-1 truncate text-sm",
                    m.status === "locked"
                      ? "text-muted"
                      : "font-medium text-text"
                  )}
                >
                  {m.title}
                </span>
                <span className="hidden text-xs text-muted md:block">
                  {m.lab}
                </span>
                <Badge
                  tone={
                    m.status === "completed"
                      ? "green"
                      : m.status === "in-progress"
                      ? "amber"
                      : "neutral"
                  }
                >
                  {m.status === "in-progress" ? "active" : m.status}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
