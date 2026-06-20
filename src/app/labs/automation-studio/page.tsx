"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Hammer,
  Activity,
  Bug,
  Play,
  Download,
  Database,
  Filter,
  RefreshCw,
  Mail,
  FileUp,
  Code2,
  ShieldCheck,
  ArrowRight,
  Lightbulb,
  MousePointerClick,
  CheckCircle2,
  XCircle,
  Clock,
  History,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SimulationLogs, type LogLine } from "@/components/labs/simulation-logs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  autoConcepts,
  pipeline,
  palette,
  autoNodeGuides,
  troubleshoot,
  type AutoStepKind,
} from "@/lib/automation-content";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Mode = "learn" | "build" | "simulate" | "troubleshoot";

const kindMeta: Record<
  AutoStepKind,
  { icon: typeof Mail; color: string }
> = {
  import: { icon: Download, color: "var(--color-electric)" },
  query: { icon: Database, color: "var(--color-cyan)" },
  filter: { icon: Filter, color: "var(--color-green)" },
  update: { icon: RefreshCw, color: "var(--color-violet)" },
  send: { icon: Mail, color: "var(--color-amber)" },
  transfer: { icon: FileUp, color: "var(--color-electric)" },
  script: { icon: Code2, color: "var(--color-cyan)" },
  verify: { icon: ShieldCheck, color: "var(--color-green)" },
};

const modeTabs: { id: Mode; label: string; icon: typeof BookOpen }[] = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "build", label: "Build", icon: Hammer },
  { id: "simulate", label: "Simulate", icon: Activity },
  { id: "troubleshoot", label: "Troubleshoot", icon: Bug },
];

type StepStatus = "idle" | "queued" | "running" | "success";

export default function AutomationStudioLab() {
  const { addMilestone, recordSim, resolveIncident, store } = useProgress();
  const [mode, setMode] = useState<Mode>("learn");
  const [selected, setSelected] = useState<AutoStepKind | null>(null);

  // simulation
  const [autoState, setAutoState] = useState<"idle" | "running" | "complete">(
    "idle"
  );
  const [stepIdx, setStepIdx] = useState(-1);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [history, setHistory] = useState<
    { time: string; status: string; rows: number }[]
  >([]);

  // troubleshoot
  const [answer, setAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (mode === "learn") addMilestone("auto-learn");
  }, [mode, addMilestone]);

  useEffect(() => {
    if (autoState !== "running") return;
    if (stepIdx >= pipeline.length) {
      const t = setTimeout(() => {
        setAutoState("complete");
        setHistory((h) => [
          {
            time: new Date().toLocaleTimeString(),
            status: "Success",
            rows: 4103,
          },
          ...h,
        ]);
      }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLogs((prev) => [...prev, ...pipeline[stepIdx].logs]);
      setStepIdx((i) => i + 1);
    }, 850);
    return () => clearTimeout(t);
  }, [autoState, stepIdx]);

  const runAutomation = () => {
    setLogs([]);
    setStepIdx(0);
    setAutoState("running");
    recordSim("automation", "Ran an Automation Studio pipeline");
    addMilestone("auto-sim");
  };

  const stepStatus = (i: number): StepStatus => {
    if (autoState === "idle") return "idle";
    if (autoState === "complete") return "success";
    if (i < stepIdx) return "success";
    if (i === stepIdx) return "running";
    return "queued";
  };

  const chosen = troubleshoot.options.find((o) => o.id === answer);
  const correct = chosen?.correct;

  const submitDiagnosis = () => {
    setSubmitted(true);
    if (chosen?.correct) {
      addMilestone("auto-fix");
      resolveIncident("Resolved Automation Studio incident — send failure");
    }
  };

  const selectedGuide = selected ? autoNodeGuides[selected] : null;

  return (
    <AppShell title="Automation Studio Lab">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="amber">Automation Studio</Badge>
          <Badge tone="neutral">Intermediate</Badge>
          <span className="text-sm text-muted">
            Learn the activities, build a pipeline, simulate the run, then fix a
            failure.
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-card p-1">
          {modeTabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === t.id
                    ? "bg-electric/15 text-text"
                    : "text-muted hover:text-text-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* LEARN */}
      {mode === "learn" && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {autoConcepts.map((c) => (
            <div key={c.name} className="rounded-xl border border-line bg-card p-4">
              <h4 className="text-sm font-semibold text-text">{c.name}</h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                {c.plain}
              </p>
              <div className="mt-3 space-y-2 border-t border-line pt-3 text-[12px]">
                <p className="text-text-secondary">
                  <span className="font-semibold text-electric">Example: </span>
                  {c.example}
                </p>
                <p className="text-text-secondary">
                  <span className="font-semibold text-red">Common mistake: </span>
                  {c.mistake}
                </p>
                <p className="text-text-secondary">
                  <span className="font-semibold text-green">Why it matters: </span>
                  {c.why}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-xl border border-electric/30 bg-electric/5 px-4 py-3 md:col-span-2 xl:col-span-3">
            <span className="text-sm text-text-secondary">
              Now build the daily import pipeline.
            </span>
            <Button size="sm" onClick={() => setMode("build")}>
              Go to Build <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* BUILD + SIMULATE share the pipeline view */}
      {(mode === "build" || mode === "simulate") && (
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-xl border border-line bg-deep">
              <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
                <span className="font-mono text-xs text-muted">
                  daily-customer-import.automation
                </span>
                {mode === "simulate" ? (
                  <Button
                    size="sm"
                    onClick={runAutomation}
                    disabled={autoState === "running"}
                  >
                    <Play className="h-3.5 w-3.5" />
                    {autoState === "running" ? "Running…" : "Run Automation"}
                  </Button>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] text-muted">
                    <MousePointerClick className="h-3.5 w-3.5" /> Click a step for
                    guidance
                  </span>
                )}
              </div>
              <div className="space-y-0 p-5">
                {pipeline.map((step, i) => {
                  const meta = kindMeta[step.kind];
                  const Icon = meta.icon;
                  const status = mode === "simulate" ? stepStatus(i) : "idle";
                  return (
                    <div key={step.id}>
                      <button
                        onClick={() =>
                          mode === "build" && setSelected(step.kind)
                        }
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left transition-all",
                          mode === "build" && "hover:border-electric/40",
                          selected === step.kind && mode === "build"
                            ? "border-electric/60"
                            : "border-line",
                          status === "running" && "jb-node-active"
                        )}
                        style={
                          status === "running"
                            ? ({
                                ["--jb-ring" as string]: `${meta.color}80`,
                                ["--jb-glow" as string]: `${meta.color}80`,
                                borderColor: meta.color,
                              } as React.CSSProperties)
                            : undefined
                        }
                      >
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                          style={{ background: `${meta.color}1a`, color: meta.color }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-text">
                            {step.label}
                          </div>
                          <div className="font-mono text-[11px] text-muted">
                            {step.sub}
                          </div>
                        </div>
                        {mode === "simulate" && (
                          <StatusBadge status={status} />
                        )}
                        {mode === "build" && (
                          <ArrowRight className="h-4 w-4 text-muted" />
                        )}
                      </button>
                      {i < pipeline.length - 1 && (
                        <div className="ml-[34px] h-5 w-px bg-line" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {mode === "simulate" && (
              <div className="mt-4 overflow-hidden rounded-xl border border-line bg-card">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber" />
                    <h3 className="text-sm font-semibold text-text">
                      Run Logs (live)
                    </h3>
                  </div>
                  <Badge
                    tone={
                      autoState === "complete"
                        ? "green"
                        : autoState === "running"
                        ? "blue"
                        : "neutral"
                    }
                  >
                    {autoState === "complete"
                      ? "Success"
                      : autoState === "running"
                      ? "Running"
                      : "Idle"}
                  </Badge>
                </div>
                <div className="p-4">
                  {logs.length === 0 ? (
                    <p className="text-sm text-muted">
                      Press Run Automation to stream the activity logs.
                    </p>
                  ) : (
                    <SimulationLogs lines={logs} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right rail */}
          <div className="space-y-4 lg:col-span-4">
            {mode === "build" && (
              <>
                <div className="overflow-hidden rounded-xl border border-line bg-card">
                  <div className="border-b border-line px-4 py-3">
                    <h3 className="text-sm font-semibold text-text">
                      Activity Palette
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3">
                    {palette.map((p) => {
                      const Icon = kindMeta[p.kind].icon;
                      return (
                        <button
                          key={p.kind}
                          onClick={() => setSelected(p.kind)}
                          className="flex items-center gap-2 rounded-lg border border-line bg-deep/50 px-2.5 py-2 text-left hover:border-electric/40"
                        >
                          <Icon
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: kindMeta[p.kind].color }}
                          />
                          <span className="truncate text-[12px] text-text-secondary">
                            {p.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-line bg-card">
                  <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                    <Lightbulb className="h-4 w-4 text-amber" />
                    <h3 className="text-sm font-semibold text-text">
                      Step Guidance
                    </h3>
                  </div>
                  {selectedGuide ? (
                    <div className="space-y-3 p-4">
                      <h4 className="text-sm font-semibold text-text">
                        {selectedGuide.title}
                      </h4>
                      <p className="text-[13px] text-text-secondary">
                        {selectedGuide.what}
                      </p>
                      <div>
                        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                          Important settings
                        </div>
                        <ul className="space-y-1">
                          {selectedGuide.settings.map((s, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-[12px] text-text-secondary"
                            >
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-line bg-deep/50 p-3 text-[12px]">
                        <span className="font-semibold text-electric">Beginner: </span>
                        <span className="text-text-secondary">
                          {selectedGuide.beginner}
                        </span>
                      </div>
                      <div className="rounded-lg border border-red/20 bg-red/5 p-3 text-[12px]">
                        <span className="font-semibold text-red">Avoid: </span>
                        <span className="text-text-secondary">
                          {selectedGuide.mistake}
                        </span>
                      </div>
                      <div className="rounded-lg border border-amber/20 bg-amber/5 p-3 text-[12px]">
                        <span className="font-semibold text-amber">In the run: </span>
                        <span className="text-text-secondary">
                          {selectedGuide.simEffect}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                      <MousePointerClick className="h-6 w-6 text-muted" />
                      <p className="text-sm text-muted">
                        Click a step or palette activity to learn what it does.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {mode === "simulate" && (
              <div className="overflow-hidden rounded-xl border border-line bg-card">
                <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                  <History className="h-4 w-4 text-amber" />
                  <h3 className="text-sm font-semibold text-text">Run History</h3>
                </div>
                <div className="p-3">
                  {history.length === 0 ? (
                    <p className="px-1 py-2 text-[13px] text-muted">
                      No runs yet. Run the automation to populate history.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {history.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-lg border border-line bg-deep/40 px-3 py-2 text-[12px]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-green" />
                          <span className="flex items-center gap-1 text-muted">
                            <Clock className="h-3 w-3" />
                            {h.time}
                          </span>
                          <span className="flex-1 text-right font-mono text-text-secondary">
                            {h.rows.toLocaleString()} rows
                          </span>
                          <Badge tone="green">{h.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 rounded-lg border border-line bg-deep/40 px-3 py-2 text-[12px] text-muted">
                    Total automation runs:{" "}
                    <span className="font-mono text-cyan">
                      {store.simRuns.automation}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TROUBLESHOOT */}
      {mode === "troubleshoot" && (
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-xl border border-red/30 bg-red/5 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-red">
                <Bug className="h-4 w-4" /> Incident — automation completed, no send
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                {troubleshoot.brief}
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <div className="border-b border-line px-5 py-3">
                <h3 className="text-sm font-semibold text-text">
                  Automation Run Logs
                </h3>
              </div>
              <div className="p-4">
                <SimulationLogs lines={troubleshoot.logs} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <div className="border-b border-line px-5 py-3">
                <h3 className="text-sm font-semibold text-text">
                  Identify the root cause
                </h3>
              </div>
              <div className="space-y-2 p-4">
                {troubleshoot.options.map((o) => {
                  const isSel = answer === o.id;
                  const showState = submitted && isSel;
                  return (
                    <button
                      key={o.id}
                      onClick={() => {
                        setAnswer(o.id);
                        setSubmitted(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                        isSel
                          ? "border-electric/50 bg-electric/10 text-text"
                          : "border-line bg-deep/40 text-text-secondary hover:border-electric/30",
                        showState && o.correct && "border-green/50 bg-green/10",
                        showState && !o.correct && "border-red/50 bg-red/10"
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                          isSel ? "border-electric" : "border-line"
                        )}
                      >
                        {showState &&
                          (o.correct ? (
                            <CheckCircle2 className="h-4 w-4 text-green" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red" />
                          ))}
                      </span>
                      {o.label}
                    </button>
                  );
                })}
                <Button
                  size="sm"
                  disabled={!answer}
                  onClick={submitDiagnosis}
                  className="mt-2"
                >
                  Submit Diagnosis
                </Button>
                {submitted && chosen && (
                  <div
                    className={cn(
                      "mt-2 flex gap-2.5 rounded-lg border px-4 py-3 text-sm",
                      correct
                        ? "border-green/30 bg-green/5 text-text-secondary"
                        : "border-amber/30 bg-amber/5 text-text-secondary"
                    )}
                  >
                    <Lightbulb
                      className={cn(
                        "h-4 w-4 shrink-0",
                        correct ? "text-green" : "text-amber"
                      )}
                    />
                    {chosen.feedback}
                  </div>
                )}
              </div>
            </div>

            {submitted && correct && (
              <div className="mt-4 overflow-hidden rounded-xl border border-violet/20 bg-gradient-to-br from-violet/5 to-transparent">
                <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet/15 text-violet">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-semibold text-text">
                    Senior Architect Review
                  </h3>
                </div>
                <div className="space-y-3 p-5 text-[13px]">
                  <p className="text-text-secondary">
                    <span className="font-semibold text-green">Beginner: </span>
                    {troubleshoot.review.beginner}
                  </p>
                  <p className="text-text-secondary">
                    <span className="font-semibold text-electric">
                      Professional:{" "}
                    </span>
                    {troubleshoot.review.professional}
                  </p>
                  <p className="text-text-secondary">
                    <span className="font-semibold text-amber">
                      Recommended:{" "}
                    </span>
                    {troubleshoot.review.improvement}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function StatusBadge({ status }: { status: StepStatus }) {
  if (status === "success") return <Badge tone="green">success</Badge>;
  if (status === "running") return <Badge tone="blue">running</Badge>;
  if (status === "queued") return <Badge tone="neutral">queued</Badge>;
  return <Badge tone="neutral">idle</Badge>;
}
