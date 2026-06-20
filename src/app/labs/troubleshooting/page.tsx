"use client";

import { useState } from "react";
import {
  Bug,
  AlertTriangle,
  Terminal,
  Settings,
  Database,
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ArchitectNotes } from "@/components/labs/architect-notes";
import { SimulationLogs, type LogLine } from "@/components/labs/simulation-logs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const logs: LogLine[] = [
  { time: "02:00:01", level: "INFO", message: "Automation 'Welcome Series' started (scheduled)" },
  { time: "02:00:02", level: "INFO", message: "Step 1 — SQL Query Activity 'New_Subscribers' queued" },
  { time: "02:00:48", level: "OK", message: "Step 1 completed — 4,210 rows written to NewSubs_DE" },
  { time: "02:00:49", level: "INFO", message: "Step 2 — Journey entry event evaluated" },
  { time: "02:00:49", level: "WARN", message: "Entry source filter returned 0 qualifying contacts" },
  { time: "02:00:50", level: "ERROR", message: "Field mismatch: entry event expects 'EmailAddress', DE provides 'Email'" },
  { time: "02:00:50", level: "ERROR", message: "0 contacts injected into journey 'Welcome Series'" },
  { time: "02:00:51", level: "WARN", message: "Wait activity holding 4,210 prior-run contacts indefinitely" },
];

const causes = [
  {
    id: "c1",
    label: "The SQL query failed to populate the data extension",
    correct: false,
    feedback:
      "The logs show Step 1 completed with 4,210 rows. The data extension was populated correctly.",
  },
  {
    id: "c2",
    label: "The journey entry event field mapping doesn't match the DE column name",
    correct: true,
    feedback:
      "Correct. The DE exposes 'Email' but the entry event maps to 'EmailAddress', so 0 contacts qualify and the journey stalls.",
  },
  {
    id: "c3",
    label: "The send classification is missing, blocking all emails",
    correct: false,
    feedback:
      "No send was ever attempted — contacts never entered the journey. Send classification is not the blocker here.",
  },
  {
    id: "c4",
    label: "The automation schedule is misconfigured",
    correct: false,
    feedback:
      "The automation ran on schedule at 02:00 as expected. Scheduling is not the issue.",
  },
];

const tabs = [
  { id: "logs", label: "Logs", icon: Terminal },
  { id: "config", label: "Config", icon: Settings },
  { id: "data", label: "Data View", icon: Database },
];

const clues = [
  { text: "Step 1 SQL wrote 4,210 rows successfully.", tone: "success" as const },
  { text: "Entry event qualified 0 contacts.", tone: "danger" as const },
  { text: "DE column is named 'Email', not 'EmailAddress'.", tone: "warning" as const },
  { text: "4,210 contacts stuck at the wait activity.", tone: "danger" as const },
];

export default function TroubleshootingLab() {
  const { resolveIncident } = useProgress();
  const [tab, setTab] = useState("logs");
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const chosen = causes.find((c) => c.id === selected);
  const correct = chosen?.correct;

  const submitDiagnosis = () => {
    setSubmitted(true);
    if (chosen?.correct)
      resolveIncident("Resolved incident INC-204 — Welcome Series journey");
  };

  return (
    <AppShell title="Troubleshooting Lab">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone="red">Broken Monday</Badge>
          <Badge tone="neutral">Incident Response</Badge>
          <span className="text-sm text-muted">
            Teach operational troubleshooting.
          </span>
        </div>
        <span className="font-mono text-xs text-cyan">Resolve to earn XP</span>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Incident */}
          <div className="overflow-hidden rounded-xl border border-red/30 bg-card lg:col-span-3">
            <div className="border-b border-red/20 bg-red/5 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-red">
                  INC-204
                </span>
                <Badge tone="red">Critical</Badge>
              </div>
              <div className="mt-2 flex items-start gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red/15 text-red">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <h2 className="text-base font-semibold leading-tight text-text">
                  Welcome Series journey stalled
                </h2>
              </div>
            </div>
            <div className="scrollbar-thin space-y-5 overflow-y-auto p-5">
              <section>
                <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Symptoms
                </h4>
                <p className="text-sm leading-relaxed text-text-secondary">
                  New subscribers should receive a welcome email within 1 hour.
                  This morning 4,210 contacts entered but{" "}
                  <span className="text-text">none received the email</span>. The
                  automation reports success.
                </p>
              </section>
              <section>
                <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Impact
                </h4>
                <ul className="space-y-1.5 text-sm text-text-secondary">
                  <li>• 4,210 contacts not onboarded</li>
                  <li>• SLA breach: welcome email &lt; 1 hr</li>
                  <li>• Revenue at risk from first-touch drop-off</li>
                </ul>
              </section>
              <section>
                <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Your task
                </h4>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Investigate the logs and config, then identify the root cause.
                </p>
              </section>
            </div>
          </div>

          {/* Investigation */}
          <div className="flex h-[460px] flex-col overflow-hidden rounded-xl border border-line bg-deep lg:col-span-6">
            <div className="flex items-center gap-1 border-b border-line bg-panel px-3 py-2">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      tab === t.id
                        ? "bg-card text-text"
                        : "text-muted hover:text-text-secondary"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
            <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4">
              {tab === "logs" && <SimulationLogs lines={logs} />}
              {tab === "config" && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="rounded-lg border border-line bg-deep p-3">
                    <div className="mb-2 text-muted">{"// Journey entry event"}</div>
                    <div className="text-text-secondary">
                      source: <span className="text-cyan">&quot;NewSubs_DE&quot;</span>
                    </div>
                    <div className="text-text-secondary">
                      contactKey:{" "}
                      <span className="text-amber">&quot;EmailAddress&quot;</span>{" "}
                      <span className="text-red">{"// ⚠ mismatch"}</span>
                    </div>
                    <div className="text-text-secondary">
                      filter: <span className="text-cyan">&quot;Status = Active&quot;</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-line bg-deep p-3">
                    <div className="mb-2 text-muted">{"// NewSubs_DE columns"}</div>
                    <div className="text-text-secondary">SubscriberKey (Text)</div>
                    <div className="text-text-secondary">
                      <span className="text-amber">Email</span> (EmailAddress){" "}
                      <span className="text-red">{"// not 'EmailAddress'"}</span>
                    </div>
                    <div className="text-text-secondary">FirstName (Text)</div>
                    <div className="text-text-secondary">Status (Text)</div>
                  </div>
                </div>
              )}
              {tab === "data" && (
                <div className="font-mono text-xs">
                  <div className="mb-2 text-muted">
                    NewSubs_DE — 4,210 rows (sample)
                  </div>
                  <div className="overflow-hidden rounded-lg border border-line">
                    <div className="grid grid-cols-3 border-b border-line bg-panel px-3 py-1.5 text-muted">
                      <span>SubscriberKey</span>
                      <span>Email</span>
                      <span>Status</span>
                    </div>
                    {[
                      ["SK-9001", "ada@example.com", "Active"],
                      ["SK-9002", "lin@example.com", "Active"],
                      ["SK-9003", "raj@example.com", "Active"],
                    ].map((r) => (
                      <div
                        key={r[0]}
                        className="grid grid-cols-3 border-b border-line/60 px-3 py-1.5 text-text-secondary"
                      >
                        {r.map((c, i) => (
                          <span key={i}>{c}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clues */}
          <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <Search className="h-4 w-4 text-amber" />
              <h3 className="text-sm font-semibold text-text">Clues</h3>
            </div>
            <div className="space-y-2.5 p-4">
              {clues.map((c, i) => (
                <div
                  key={i}
                  className="flex gap-2.5 rounded-lg border border-line bg-deep/50 px-3 py-2"
                >
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      c.tone === "success" && "bg-green",
                      c.tone === "warning" && "bg-amber",
                      c.tone === "danger" && "bg-red"
                    )}
                  />
                  <p className="text-[13px] leading-snug text-text-secondary">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="overflow-hidden rounded-xl border border-line bg-card">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3">
            <Bug className="h-4 w-4 text-red" />
            <h3 className="text-sm font-semibold text-text">
              Root Cause Diagnosis
            </h3>
          </div>
          <div className="p-5">
            <p className="mb-3 text-sm text-muted">
              Based on your investigation, select the root cause:
            </p>
            <div className="space-y-2">
              {causes.map((c) => {
                const isSelected = selected === c.id;
                const showState = submitted && isSelected;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelected(c.id);
                      setSubmitted(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                      isSelected
                        ? "border-electric/50 bg-electric/10 text-text"
                        : "border-line bg-deep/40 text-text-secondary hover:border-electric/30",
                      showState && c.correct && "border-green/50 bg-green/10",
                      showState && !c.correct && "border-red/50 bg-red/10"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                        isSelected ? "border-electric" : "border-line"
                      )}
                    >
                      {showState &&
                        (c.correct ? (
                          <CheckCircle2 className="h-4 w-4 text-green" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red" />
                        ))}
                    </span>
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button
                size="sm"
                disabled={!selected}
                onClick={submitDiagnosis}
              >
                Submit Diagnosis
              </Button>
              {submitted && chosen && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    correct ? "text-green" : "text-red"
                  )}
                >
                  {correct ? "Root cause confirmed — incident logged" : "Not quite — review the logs"}
                </span>
              )}
            </div>

            {submitted && chosen && (
              <div
                className={cn(
                  "mt-3 flex gap-2.5 rounded-lg border px-4 py-3 text-sm",
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

        <ArchitectNotes
          notes={[
            {
              tone: "info",
              text: "Always read top-down: a 'successful' automation can still produce zero business outcomes. The status flag only covers activity execution, not downstream journey entry.",
            },
            {
              tone: "danger",
              text: "Field-name mismatches between a data extension and a journey entry event are one of the most common silent failures in SFMC. Standardize on a contact key naming convention.",
            },
            {
              tone: "success",
              text: "The fix: remap the entry event contact key to the DE's 'Email' column (or rename the DE column), then re-inject the stuck 4,210 contacts.",
            },
          ]}
        />
      </div>
    </AppShell>
  );
}
