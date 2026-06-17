"use client";

import { TrendingUp, Award, Target, Zap, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { SkillBar } from "@/components/dashboard/skill-bar";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  user,
  skills,
  xpHistory,
  achievements,
  missions,
} from "@/lib/data";
import { cn } from "@/lib/utils";

function XpChart() {
  const max = Math.max(...xpHistory.map((d) => d.xp));
  const w = 100;
  const h = 100;
  const points = xpHistory
    .map((d, i) => {
      const x = (i / (xpHistory.length - 1)) * w;
      const y = h - (d.xp / max) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="h-48 w-full"
      >
        <defs>
          <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,${h} ${points} ${w},${h}`}
          fill="url(#xpFill)"
          stroke="none"
        />
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
        {xpHistory.map((d) => (
          <span key={d.week}>{d.week}</span>
        ))}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const completed = missions.filter((m) => m.status === "completed").length;

  return (
    <AppShell title="Progress">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="Total XP"
            value={user.xp.toLocaleString()}
            delta="+1,230 this week"
            icon={Zap}
            accent="var(--color-cyan)"
          />
          <MetricCard
            label="Missions Done"
            value={`${completed}`}
            delta="+4 this month"
            icon={Target}
            accent="var(--color-green)"
          />
          <MetricCard
            label="Rank"
            value={user.rank}
            delta="Top 18%"
            icon={TrendingUp}
            accent="var(--color-electric)"
          />
          <MetricCard
            label="Badges"
            value={`${achievements.filter((a) => a.earned).length} / ${achievements.length}`}
            delta="2 in progress"
            icon={Award}
            accent="var(--color-violet)"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>XP Trajectory</CardTitle>
              <Badge tone="blue">8 weeks</Badge>
            </CardHeader>
            <CardBody>
              <XpChart />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Readiness</CardTitle>
            </CardHeader>
            <CardBody className="flex justify-center">
              <ProgressRing
                value={user.operationalReadiness}
                label="Ready"
                size={150}
              />
            </CardBody>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Skill Matrix</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              {skills.map((s) => (
                <SkillBar key={s.name} {...s} />
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <span className="text-xs text-muted">
                {achievements.filter((a) => a.earned).length} earned
              </span>
            </CardHeader>
            <CardBody className="grid grid-cols-2 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={cn(
                    "rounded-lg border p-3",
                    a.earned
                      ? "border-violet/30 bg-violet/5"
                      : "border-line bg-deep/40 opacity-70"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "grid h-8 w-8 place-items-center rounded-lg",
                        a.earned
                          ? "bg-violet/15 text-violet"
                          : "bg-line/40 text-muted"
                      )}
                    >
                      {a.earned ? (
                        <Award className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                  <h4
                    className={cn(
                      "mt-2 text-sm font-semibold",
                      a.earned ? "text-text" : "text-muted"
                    )}
                  >
                    {a.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted">
                    {a.description}
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
