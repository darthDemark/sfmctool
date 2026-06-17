import { Award, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const certs = [
  {
    name: "Email Specialist",
    progress: 78,
    questions: 320,
    status: "In Progress",
    tone: "amber" as const,
  },
  {
    name: "Marketing Cloud Administrator",
    progress: 45,
    questions: 260,
    status: "In Progress",
    tone: "amber" as const,
  },
  {
    name: "Marketing Cloud Developer",
    progress: 22,
    questions: 410,
    status: "Started",
    tone: "neutral" as const,
  },
  {
    name: "Marketing Cloud Consultant",
    progress: 0,
    questions: 380,
    status: "Locked",
    tone: "neutral" as const,
  },
];

const domains = [
  { name: "Data Modeling", pct: 82 },
  { name: "Subscriber & Data Management", pct: 74 },
  { name: "Email Message Configuration", pct: 88 },
  { name: "Content Creation (AMPscript)", pct: 69 },
  { name: "Marketing Automation", pct: 61 },
];

export default function CertificationPrepPage() {
  return (
    <AppShell title="Certification Prep">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-amber/10 via-card to-violet/10 p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber/15 text-amber">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Certification Track
              </h2>
              <p className="text-sm text-muted">
                Practice exams mapped to the real exam blueprint — no dumps, just
                competency.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {certs.map((c) => {
            const locked = c.status === "Locked";
            return (
              <Card key={c.name}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-text">
                        {c.name}
                      </h3>
                      <p className="text-xs text-muted">
                        {c.questions} practice questions
                      </p>
                    </div>
                    <Badge tone={c.tone}>{c.status}</Badge>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-deep">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        locked ? "bg-line" : "gradient-primary"
                      )}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-mono text-muted">
                      {c.progress}% complete
                    </span>
                    <Button
                      href="/labs"
                      size="sm"
                      variant={locked ? "ghost" : "secondary"}
                      className={cn(locked && "pointer-events-none opacity-50")}
                    >
                      {locked ? "Locked" : "Practice"}
                      {!locked && <ArrowRight className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Specialist — Domain Readiness</CardTitle>
            <Badge tone="amber">78% overall</Badge>
          </CardHeader>
          <CardBody className="space-y-3">
            {domains.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                {d.pct >= 75 ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-amber" />
                )}
                <span className="w-64 shrink-0 text-sm text-text-secondary">
                  {d.name}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-deep">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.pct}%`,
                      background:
                        d.pct >= 75
                          ? "var(--color-green)"
                          : "var(--color-amber)",
                    }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-xs text-muted">
                  {d.pct}%
                </span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
