"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeMouseHandler,
} from "@xyflow/react";
import {
  GitBranch,
  Play,
  BookOpen,
  Workflow,
  Activity,
  Target,
  ArrowRight,
  MousePointerClick,
  Lightbulb,
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  ListChecks,
  Info,
  CheckCircle2,
  Mail,
  Clock,
  MessageSquare,
  Flag,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  JourneyCanvas,
  type JourneyNodeKind,
} from "@/components/labs/journey-canvas";
import { AnimatedCounter } from "@/components/labs/animated-counter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  concepts,
  nodeGuides,
  narration,
  contactFlow,
  whatThisMeans,
  operationalLesson,
  architectReview,
  configWarnings,
  commonMistakes,
  simSummary,
} from "@/lib/journey-content";
import { cn } from "@/lib/utils";

type Mode = "learn" | "build" | "simulate";

const NODE_STEP: Record<string, number> = {
  entry: 0,
  wait1: 1,
  email1: 2,
  split: 3,
  sms: 4,
  email2: 4,
  exit: 5,
};
const EDGE_STEP: Record<string, number> = {
  e1: 1,
  e2: 2,
  e3: 3,
  e4: 4,
  e5: 4,
  e6: 5,
  e7: 5,
};
const MAX_STEP = 5;

const BASE_NODES: Node[] = [
  { id: "entry", type: "journey", position: { x: 260, y: 0 }, data: { kind: "entry", label: "Entry Source", sub: "Cart_Abandoners_DE", count: simSummary.entered } },
  { id: "wait1", type: "journey", position: { x: 260, y: 130 }, data: { kind: "wait", label: "Wait", sub: "1 hour", count: simSummary.entered } },
  { id: "email1", type: "journey", position: { x: 260, y: 260 }, data: { kind: "email", label: "Reminder Email", sub: "Cart recovery", count: simSummary.emailed } },
  { id: "split", type: "journey", position: { x: 260, y: 390 }, data: { kind: "split", label: "Decision Split", sub: "Opened email?", count: simSummary.entered } },
  { id: "sms", type: "journey", position: { x: 30, y: 520 }, data: { kind: "sms", label: "SMS Nudge", sub: "Yes path", count: simSummary.sms } },
  { id: "email2", type: "journey", position: { x: 490, y: 520 }, data: { kind: "email", label: "Discount Offer", sub: "No path", count: simSummary.discount } },
  { id: "exit", type: "journey", position: { x: 260, y: 650 }, data: { kind: "exit", label: "Exit", sub: "Goal: Purchase", count: simSummary.exited } },
];

const BASE_EDGES: Edge[] = [
  { id: "e1", source: "entry", target: "wait1", type: "contact", data: { color: "#4f8cff" } },
  { id: "e2", source: "wait1", target: "email1", type: "contact", data: { color: "#4f8cff" } },
  { id: "e3", source: "email1", target: "split", type: "contact", data: { color: "#4f8cff" } },
  { id: "e4", source: "split", target: "sms", type: "contact", data: { color: "#22d3ee", label: "Yes · opened" } },
  { id: "e5", source: "split", target: "email2", type: "contact", data: { color: "#4f8cff", label: "No · didn't open" } },
  { id: "e6", source: "sms", target: "exit", type: "contact", data: { color: "#22d3ee" } },
  { id: "e7", source: "email2", target: "exit", type: "contact", data: { color: "#4f8cff" } },
];

const modeTabs: { id: Mode; label: string; icon: typeof BookOpen }[] = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "build", label: "Build", icon: Workflow },
  { id: "simulate", label: "Simulate", icon: Activity },
];

const visualSteps = [
  { icon: Play, label: "Entry Source", desc: "Who enters", color: "var(--color-green)" },
  { icon: Clock, label: "Wait", desc: "Pause before acting", color: "var(--color-amber)" },
  { icon: Mail, label: "Reminder Email", desc: "The message", color: "var(--color-electric)" },
  { icon: GitBranch, label: "Decision Split", desc: "Opened? Yes / No", color: "var(--color-violet)" },
  { icon: MessageSquare, label: "SMS / Discount", desc: "Branch by behavior", color: "var(--color-cyan)" },
  { icon: Flag, label: "Exit", desc: "Goal: Purchase", color: "var(--color-red)" },
];

const learningObjectives = [
  "Explain what every journey node does in plain English.",
  "Read contact counts and branch percentages with confidence.",
  "Identify the production risks a working journey can still hide.",
];

const simStateMeta = {
  idle: { tone: "neutral", label: "Idle" },
  running: { tone: "blue", label: "Running" },
  complete: { tone: "green", label: "Complete" },
  warning: { tone: "amber", label: "Complete · Warnings" },
  failed: { tone: "red", label: "Failed" },
} as const;

export default function JourneyBuilderLab() {
  const [mode, setMode] = useState<Mode>("learn");
  const [nodes, , onNodesChange] = useNodesState(BASE_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(BASE_EDGES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [simState, setSimState] =
    useState<"idle" | "running" | "complete" | "warning" | "failed">("idle");
  const [simStep, setSimStep] = useState(-1);

  const onConnect = useCallback(
    (c: Connection) =>
      setEdges((eds) => addEdge({ ...c, type: "contact", data: { color: "#4f8cff" } }, eds)),
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    setSelectedId(node.id);
  }, []);

  // Drive the simulation step sequence.
  useEffect(() => {
    if (simState !== "running") return;
    if (simStep >= MAX_STEP) {
      const t = setTimeout(() => setSimState("warning"), 850);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setSimStep((s) => s + 1), 850);
    return () => clearTimeout(t);
  }, [simState, simStep]);

  const runSimulation = () => {
    setMode("simulate");
    setSimStep(0);
    setSimState("running");
  };

  const isSimMode = mode === "simulate";
  const resultsReady = simState === "complete" || simState === "warning";

  const displayNodes = useMemo(
    () =>
      nodes.map((n) => {
        const step = NODE_STEP[n.id] ?? 99;
        const revealed = isSimMode && (resultsReady || step <= simStep);
        const active = isSimMode && simState === "running" && step === simStep;
        return {
          ...n,
          data: {
            ...n.data,
            revealed,
            active,
            dim: isSimMode && !revealed,
            selected: mode === "build" && selectedId === n.id,
          },
        };
      }),
    [nodes, isSimMode, simStep, simState, resultsReady, selectedId, mode]
  );

  const displayEdges = useMemo(
    () =>
      edges.map((e) => {
        const step = EDGE_STEP[e.id] ?? 99;
        const active = isSimMode && (resultsReady || step <= simStep);
        return { ...e, data: { ...e.data, active } };
      }),
    [edges, isSimMode, simStep, resultsReady]
  );

  const selectedKind = selectedId
    ? (nodes.find((n) => n.id === selectedId)?.data as
        | { kind: JourneyNodeKind }
        | undefined)?.kind
    : undefined;
  const selectedGuide = selectedKind ? nodeGuides[selectedKind] : null;

  const visibleNarration = resultsReady
    ? narration
    : narration.filter((n) => n.step <= simStep + 1);

  return (
    <AppShell title="Journey Builder Lab">
      {/* Header: difficulty + mode tabs */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="violet">Journey Builder</Badge>
          <Badge tone="red">Advanced</Badge>
          <span className="text-sm text-muted">
            Guided training — from zero knowledge to a simulated journey.
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

      <div className="grid gap-4 lg:grid-cols-12">
        {/* LEFT: brief + objectives + glossary */}
        <div className="space-y-4 lg:col-span-3">
          <div className="overflow-hidden rounded-xl border border-line bg-card">
            <div className="border-b border-line px-4 py-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-electric">
                Mission 07
              </span>
              <h2 className="text-base font-semibold leading-tight text-text">
                Cart Recovery Journey
              </h2>
            </div>
            <div className="space-y-4 p-4">
              <p className="text-sm leading-relaxed text-text-secondary">
                Shoppers abandon carts daily. You will learn what each journey
                node does, build the path, then simulate 5,000 contacts flowing
                through it.
              </p>
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <Target className="h-3.5 w-3.5" /> Learning Objectives
                </div>
                <ul className="space-y-2">
                  {learningObjectives.map((o, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-text-secondary">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-line bg-card">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <ListChecks className="h-4 w-4 text-violet" />
              <h3 className="text-sm font-semibold text-text">Concept Glossary</h3>
            </div>
            <div className="scrollbar-thin max-h-72 space-y-0.5 overflow-y-auto p-2">
              {concepts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setMode("learn")}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] text-text-secondary hover:bg-panel"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-violet" />
                  {c.name.replace(/^What (is|are) /, "").replace(/\?$/, "")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: mode content */}
        <div className="lg:col-span-6">
          {mode === "learn" && (
            <div className="space-y-4">
              {/* Visual journey explanation */}
              <div className="rounded-xl border border-line bg-card p-5">
                <h3 className="mb-1 text-sm font-semibold text-text">
                  How this journey flows
                </h3>
                <p className="mb-4 text-[13px] text-muted">
                  Every contact travels top to bottom. Read it like a story.
                </p>
                <div className="space-y-2">
                  {visualSteps.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                          style={{ background: `${s.color}1a`, color: s.color }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-text">
                            {s.label}
                          </div>
                          <div className="text-[12px] text-muted">{s.desc}</div>
                        </div>
                        {i < visualSteps.length - 1 && (
                          <ChevronDown className="h-4 w-4 text-line" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Concept cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {concepts.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-line bg-card p-4"
                  >
                    <h4 className="text-sm font-semibold text-text">{c.name}</h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                      {c.plain}
                    </p>
                    <div className="mt-3 space-y-2 border-t border-line pt-3 text-[12px]">
                      <p className="text-text-secondary">
                        <span className="font-semibold text-electric">
                          Example:{" "}
                        </span>
                        {c.example}
                      </p>
                      <p className="text-text-secondary">
                        <span className="font-semibold text-red">
                          Common mistake:{" "}
                        </span>
                        {c.mistake}
                      </p>
                      <p className="text-text-secondary">
                        <span className="font-semibold text-green">
                          Why it matters:{" "}
                        </span>
                        {c.why}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-electric/30 bg-electric/5 px-4 py-3">
                <span className="text-sm text-text-secondary">
                  Understand the pieces? Build the journey next.
                </span>
                <Button size="sm" onClick={() => setMode("build")}>
                  Go to Build <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {(mode === "build" || mode === "simulate") && (
            <div className="flex h-[560px] flex-col overflow-hidden rounded-xl border border-line bg-deep">
              <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
                <span className="font-mono text-xs text-muted">
                  cart-recovery.journey
                </span>
                {mode === "build" ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-muted">
                    <MousePointerClick className="h-3.5 w-3.5" /> Click a node for
                    guidance
                  </span>
                ) : (
                  <Button
                    size="sm"
                    onClick={runSimulation}
                    disabled={simState === "running"}
                  >
                    <Play className="h-3.5 w-3.5" />
                    {simState === "running" ? "Running…" : "Run Simulation"}
                  </Button>
                )}
              </div>
              <div className="min-h-0 flex-1">
                <JourneyCanvas
                  nodes={displayNodes}
                  edges={displayEdges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                />
              </div>
              {mode === "simulate" && (
                <div className="border-t border-line bg-panel px-4 py-2">
                  <div className="flex items-center gap-2 text-[12px]">
                    <Badge tone={simStateMeta[simState].tone}>
                      {simStateMeta[simState].label}
                    </Badge>
                    <span className="text-muted">
                      {simState === "idle"
                        ? "Press Run Simulation to watch contacts flow."
                        : resultsReady
                        ? "Simulation finished — read the breakdown below."
                        : `Step ${simStep + 1} of ${MAX_STEP + 1}…`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: contextual guidance */}
        <div className="space-y-4 lg:col-span-3">
          {mode === "learn" && (
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <Info className="h-4 w-4 text-electric" />
                <h3 className="text-sm font-semibold text-text">
                  How to read a journey
                </h3>
              </div>
              <div className="space-y-3 p-4 text-[13px] text-text-secondary">
                <p>
                  A journey is a flowchart for people. Each box is a step; each
                  line is the path a contact takes next.
                </p>
                <p>
                  Numbers on a node show how many contacts reached it. When a
                  path splits, the numbers should add up to the node above.
                </p>
                <p>
                  When you are comfortable, switch to{" "}
                  <span className="text-electric">Build</span> to inspect each
                  node, then <span className="text-electric">Simulate</span> to
                  watch it run.
                </p>
              </div>
            </div>
          )}

          {mode === "build" && (
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <Lightbulb className="h-4 w-4 text-amber" />
                <h3 className="text-sm font-semibold text-text">
                  Node Explanation
                </h3>
              </div>
              {selectedGuide ? (
                <div className="space-y-4 p-4">
                  <div>
                    <h4 className="text-sm font-semibold text-text">
                      {selectedGuide.title}
                    </h4>
                    <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                      {selectedGuide.what}
                    </p>
                  </div>
                  <div>
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      Settings that matter
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
                    <span className="font-semibold text-electric">
                      Beginner:{" "}
                    </span>
                    <span className="text-text-secondary">
                      {selectedGuide.beginner}
                    </span>
                  </div>
                  <div className="rounded-lg border border-red/20 bg-red/5 p-3 text-[12px]">
                    <span className="font-semibold text-red">
                      Avoid this:{" "}
                    </span>
                    <span className="text-text-secondary">
                      {selectedGuide.mistake}
                    </span>
                  </div>
                  <div className="rounded-lg border border-violet/20 bg-violet/5 p-3 text-[12px]">
                    <span className="font-semibold text-violet">
                      In the simulation:{" "}
                    </span>
                    <span className="text-text-secondary">
                      {selectedGuide.simEffect}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <MousePointerClick className="h-6 w-6 text-muted" />
                  <p className="text-sm text-muted">
                    Click any node on the canvas to learn what it does, the
                    settings that matter, and the mistakes to avoid.
                  </p>
                </div>
              )}
            </div>
          )}

          {mode === "simulate" && (
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <ShieldAlert className="h-4 w-4 text-amber" />
                <h3 className="text-sm font-semibold text-text">
                  Configuration Warnings
                </h3>
              </div>
              <div className="space-y-2.5 p-4">
                <p className="text-[12px] text-muted">
                  The journey runs, but these settings are not production-ready:
                </p>
                {configWarnings.map((w) => (
                  <div
                    key={w.title}
                    className="rounded-lg border border-amber/20 bg-amber/5 p-3"
                  >
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-amber">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {w.title}
                    </div>
                    <p className="mt-1 text-[12px] leading-snug text-text-secondary">
                      {w.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================== SIMULATION OUTPUT ===================== */}
      {mode === "simulate" && (
        <div className="mt-4 space-y-4">
          {/* Step-by-step narration */}
          <div className="overflow-hidden rounded-xl border border-line bg-card">
            <div className="flex items-center gap-2 border-b border-line px-5 py-3">
              <Activity className="h-4 w-4 text-violet" />
              <h3 className="text-sm font-semibold text-text">
                Step-by-step narration
              </h3>
            </div>
            <div className="p-5">
              {simState === "idle" ? (
                <p className="text-sm text-muted">
                  Run the simulation to see each step explained as contacts move
                  through the journey.
                </p>
              ) : (
                <ol className="space-y-2">
                  {visibleNarration.map((n) => (
                    <li
                      key={n.step}
                      className="jb-reveal flex gap-3 text-sm text-text-secondary"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/15 font-mono text-[11px] text-violet">
                        {n.step}
                      </span>
                      {n.text}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {resultsReady && (
            <>
              {/* Beginner-friendly contact flow */}
              <div className="overflow-hidden rounded-xl border border-line bg-card">
                <div className="flex items-center gap-2 border-b border-line px-5 py-3">
                  <GitBranch className="h-4 w-4 text-electric" />
                  <h3 className="text-sm font-semibold text-text">
                    Contact Flow Explanation
                  </h3>
                </div>
                <div className="divide-y divide-line">
                  {contactFlow.map((f) => (
                    <div
                      key={f.stage}
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3"
                    >
                      <span className="w-36 shrink-0 text-sm font-semibold text-text">
                        {f.stage}
                      </span>
                      <span className="font-mono text-sm text-cyan">
                        {f.count}
                      </span>
                      <span className="flex-1 text-[13px] text-text-secondary">
                        {f.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation results metrics */}
              <div className="overflow-hidden rounded-xl border border-line bg-card">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-violet" />
                    <h3 className="text-sm font-semibold text-text">
                      Simulation Results
                    </h3>
                  </div>
                  <Badge tone="green">
                    {((simSummary.exited / simSummary.entered) * 100).toFixed(1)}%
                    completed
                  </Badge>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Entered", value: simSummary.entered, color: "var(--color-green)" },
                    { label: "Opened (Yes)", value: simSummary.opened, color: "var(--color-cyan)" },
                    { label: "Didn't open (No)", value: simSummary.notOpened, color: "var(--color-electric)" },
                    { label: "Exited successfully", value: simSummary.exited, color: "var(--color-violet)" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border border-line bg-deep/50 p-4"
                    >
                      <div className="text-xs uppercase tracking-wider text-muted">
                        {s.label}
                      </div>
                      <div
                        className="mt-1 font-mono text-2xl font-bold"
                        style={{ color: s.color }}
                      >
                        <AnimatedCounter value={s.value} />
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-deep">
                        <div
                          className="h-full rounded-full transition-[width] duration-1000"
                          style={{
                            width: `${(s.value / simSummary.entered) * 100}%`,
                            background: s.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-line px-5 py-3 font-mono text-xs text-muted">
                  <span>
                    SMS nudge:{" "}
                    <span className="text-cyan">
                      {simSummary.sms.toLocaleString()}
                    </span>
                  </span>
                  <span>
                    Discount offer:{" "}
                    <span className="text-electric">
                      {simSummary.discount.toLocaleString()}
                    </span>
                  </span>
                  <span>
                    Suppressed / errored:{" "}
                    <span className="text-red">
                      {simSummary.suppressed.toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>

              {/* What this means + operational lesson */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan" />
                    <h3 className="text-sm font-semibold text-text">
                      What This Means
                    </h3>
                  </div>
                  <p className="text-[13px] leading-relaxed text-text-secondary">
                    {whatThisMeans}
                  </p>
                </div>
                <div className="rounded-xl border border-amber/20 bg-amber/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber" />
                    <h3 className="text-sm font-semibold text-text">
                      Operational Lesson
                    </h3>
                  </div>
                  <p className="text-[13px] leading-relaxed text-text-secondary">
                    {operationalLesson}
                  </p>
                </div>
              </div>

              {/* Architect review */}
              <div className="overflow-hidden rounded-xl border border-violet/20 bg-gradient-to-br from-violet/5 to-transparent">
                <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet/15 text-violet">
                    <ShieldAlert className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-text">
                      Senior Architect Review
                    </h3>
                    <p className="text-[11px] text-muted">
                      Updated after your simulation run
                    </p>
                  </div>
                </div>
                <div className="grid gap-px bg-line md:grid-cols-3">
                  <div className="bg-card p-4">
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-green">
                      Beginner Explanation
                    </div>
                    <p className="text-[13px] leading-relaxed text-text-secondary">
                      {architectReview.beginner}
                    </p>
                  </div>
                  <div className="bg-card p-4">
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-electric">
                      Professional Review
                    </div>
                    <p className="text-[13px] leading-relaxed text-text-secondary">
                      {architectReview.professional}
                    </p>
                  </div>
                  <div className="bg-card p-4">
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber">
                      Recommended Improvement
                    </div>
                    <p className="text-[13px] leading-relaxed text-text-secondary">
                      {architectReview.improvement}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended next step */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-electric/30 bg-electric/5 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <ArrowRight className="h-4 w-4 text-electric" />
                  <div>
                    <div className="text-sm font-semibold text-text">
                      Recommended Next Step
                    </div>
                    <p className="text-[13px] text-text-secondary">
                      Add a purchase goal-exit and re-entry rules, then re-run to
                      compare.
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setMode("build")}>
                  Refine in Build
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Common mistakes (collapsible, always available) */}
      <CommonMistakes />
    </AppShell>
  );
}

function CommonMistakes() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-line bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3.5"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red" />
          <h3 className="text-sm font-semibold text-text">
            Common Journey Builder Mistakes
          </h3>
          <Badge tone="neutral">{commonMistakes.length}</Badge>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="grid gap-3 border-t border-line p-5 md:grid-cols-2">
          {commonMistakes.map((m) => (
            <div
              key={m.title}
              className="rounded-lg border border-line bg-deep/40 p-4"
            >
              <h4 className="text-sm font-semibold text-text">{m.title}</h4>
              <div className="mt-2 space-y-1.5 text-[12px]">
                <p className="text-text-secondary">
                  <span className="font-semibold text-muted">What it means: </span>
                  {m.meaning}
                </p>
                <p className="text-text-secondary">
                  <span className="font-semibold text-red">In production: </span>
                  {m.production}
                </p>
                <p className="text-text-secondary">
                  <span className="font-semibold text-green">How to avoid: </span>
                  {m.avoid}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
