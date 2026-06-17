"use client";

import { useState } from "react";
import type { Node, Edge } from "@xyflow/react";
import {
  GitBranch,
  Play,
  Mail,
  Clock,
  MessageSquare,
  Flag,
  Sliders,
  Activity,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ScenarioPanel } from "@/components/labs/scenario-panel";
import { JourneyCanvas } from "@/components/labs/journey-canvas";
import { ArchitectNotes } from "@/components/labs/architect-notes";
import { InspectorPanel } from "@/components/labs/workbench";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ENTRY = 5000;

const nodes: Node[] = [
  {
    id: "entry",
    type: "journey",
    position: { x: 260, y: 0 },
    data: { kind: "entry", label: "Entry Source", sub: "Cart Abandoners DE", count: ENTRY },
  },
  {
    id: "wait1",
    type: "journey",
    position: { x: 260, y: 130 },
    data: { kind: "wait", label: "Wait", sub: "1 hour", count: ENTRY },
  },
  {
    id: "email1",
    type: "journey",
    position: { x: 260, y: 260 },
    data: { kind: "email", label: "Reminder Email", sub: "Cart recovery", count: ENTRY },
  },
  {
    id: "split",
    type: "journey",
    position: { x: 260, y: 390 },
    data: { kind: "split", label: "Decision Split", sub: "Opened email?", count: ENTRY },
  },
  {
    id: "sms",
    type: "journey",
    position: { x: 40, y: 520 },
    data: { kind: "sms", label: "SMS Nudge", sub: "Yes path", count: Math.round(ENTRY * 0.42) },
  },
  {
    id: "email2",
    type: "journey",
    position: { x: 480, y: 520 },
    data: { kind: "email", label: "Discount Offer", sub: "No path", count: Math.round(ENTRY * 0.58) },
  },
  {
    id: "exit",
    type: "journey",
    position: { x: 260, y: 650 },
    data: { kind: "exit", label: "Exit", sub: "Goal: Purchase", count: ENTRY },
  },
];

const edges: Edge[] = [
  { id: "e1", source: "entry", target: "wait1", animated: true },
  { id: "e2", source: "wait1", target: "email1", animated: true },
  { id: "e3", source: "email1", target: "split", animated: true },
  { id: "e4", source: "split", target: "sms", animated: true, label: "Yes" },
  { id: "e5", source: "split", target: "email2", animated: true, label: "No" },
  { id: "e6", source: "sms", target: "exit", animated: true },
  { id: "e7", source: "email2", target: "exit", animated: true },
];

const palette = [
  { icon: Play, label: "Entry Source", color: "var(--color-green)" },
  { icon: Mail, label: "Email", color: "var(--color-electric)" },
  { icon: Clock, label: "Wait", color: "var(--color-amber)" },
  { icon: GitBranch, label: "Decision Split", color: "var(--color-violet)" },
  { icon: MessageSquare, label: "SMS", color: "var(--color-cyan)" },
  { icon: Flag, label: "Exit", color: "var(--color-red)" },
];

export default function JourneyBuilderLab() {
  const [simulated, setSimulated] = useState(false);

  const yes = Math.round(ENTRY * 0.42);
  const no = ENTRY - yes;
  const converted = Math.round(yes * 0.31 + no * 0.18);

  return (
    <AppShell title="Journey Builder Lab">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone="violet">Journey Builder</Badge>
          <Badge tone="neutral">Simulation</Badge>
          <span className="text-sm text-muted">Build and test journeys.</span>
        </div>
        <span className="font-mono text-xs text-cyan">+260 XP available</span>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Mission */}
          <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
            <ScenarioPanel
              code="Mission 07"
              title="Cart Recovery Journey"
              difficulty="Advanced"
              icon={GitBranch}
              objective="Design a multi-channel cart-recovery journey that branches on email engagement."
              brief="Shoppers abandon carts daily. Build a journey that waits, sends a reminder, then splits: engaged contacts get an SMS nudge, the rest get a discount offer. Everyone exits on purchase."
              requirements={[
                "Start from the Cart Abandoners data extension.",
                "Add a wait, a reminder email, then a decision split on 'Opened email?'.",
                "Route Yes → SMS, No → discount email, both → exit goal.",
              ]}
            />
          </div>

          {/* Canvas */}
          <div className="flex h-[460px] flex-col overflow-hidden rounded-xl border border-line bg-deep lg:col-span-6">
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
              <span className="font-mono text-xs text-muted">
                cart-recovery.journey
              </span>
              <Button size="sm" onClick={() => setSimulated(true)}>
                <Play className="h-3.5 w-3.5" /> Run Simulation
              </Button>
            </div>
            <div className="min-h-0 flex-1">
              <JourneyCanvas initialNodes={nodes} initialEdges={edges} />
            </div>
          </div>

          {/* Properties / node library */}
          <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
            <InspectorPanel
              title="Node Library"
              icon={<Sliders className="h-4 w-4 text-violet" />}
            >
              <p className="mb-3 text-xs text-muted">
                Drag activities onto the canvas to extend the journey.
              </p>
              <div className="space-y-2">
                {palette.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.label}
                      className="flex cursor-grab items-center gap-2.5 rounded-lg border border-line bg-deep/50 px-3 py-2 transition-colors hover:border-electric/40"
                    >
                      <span
                        className="grid h-7 w-7 place-items-center rounded-md"
                        style={{ background: `${p.color}22`, color: p.color }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm text-text-secondary">
                        {p.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </InspectorPanel>
          </div>
        </div>

        {/* Simulation results */}
        <div className="overflow-hidden rounded-xl border border-line bg-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-violet" />
              <h3 className="text-sm font-semibold text-text">
                Simulation Results
              </h3>
            </div>
            <Badge tone={simulated ? "green" : "neutral"}>
              {simulated ? "Completed" : "Idle"}
            </Badge>
          </div>
          <div className="p-5">
            {simulated ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Entered", value: ENTRY, color: "var(--color-green)" },
                  {
                    label: "Yes path (SMS)",
                    value: yes,
                    color: "var(--color-cyan)",
                  },
                  {
                    label: "No path (Email)",
                    value: no,
                    color: "var(--color-electric)",
                  },
                  {
                    label: "Converted",
                    value: converted,
                    color: "var(--color-violet)",
                  },
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
                      {s.value.toLocaleString()}
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-deep">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(s.value / ENTRY) * 100}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid h-28 place-items-center text-sm text-muted">
                Run the simulation to see path counts and conversion.
              </div>
            )}
            {simulated && (
              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-violet/20 bg-violet/5 px-4 py-3 text-sm">
                <span
                  className={cn("font-mono font-semibold text-violet")}
                >
                  {((converted / ENTRY) * 100).toFixed(1)}% conversion
                </span>
                <span className="text-text-secondary">
                  Engaged (Yes-path) contacts converted at nearly 2× the rate of
                  the discount path.
                </span>
              </div>
            )}
          </div>
        </div>

        <ArchitectNotes
          notes={[
            {
              tone: "success",
              text: "Splitting on email engagement before spending on SMS is cost-smart — you only pay for the channel where intent is highest.",
            },
            {
              tone: "info",
              text: "Your 1-hour wait is reasonable for cart recovery. Test 30 min vs 3 hr; abandonment intent decays fast, so earlier sends often win.",
            },
            {
              tone: "warning",
              text: "Add an exit criteria for 'purchased' on the entry event. Otherwise a contact who buys after the email still receives the SMS — a classic annoyance that drives unsubscribes.",
            },
          ]}
        />
      </div>
    </AppShell>
  );
}
