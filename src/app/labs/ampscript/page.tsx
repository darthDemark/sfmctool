"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Play,
  RotateCcw,
  User,
  Mail,
  Variable,
  ArrowRight,
  BookOpen,
  Target,
  Zap,
  Trophy,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CodeEditor } from "@/components/labs/code-editor";
import { ArchitectNotes } from "@/components/labs/architect-notes";
import { InspectorPanel } from "@/components/labs/workbench";
import {
  CurriculumPanel,
  type CurriculumLevel,
} from "@/components/labs/curriculum-panel";
import {
  LessonFeedback,
  validate,
  type CheckResult,
} from "@/components/labs/lesson-feedback";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { renderAmpscript } from "@/lib/ampscript";
import { ampLessons, CONTACT, TABLES } from "@/lib/ampscript-curriculum";
import { useTrackProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const levelTone: Record<CurriculumLevel, "green" | "amber" | "red"> = {
  Beginner: "green",
  Intermediate: "amber",
  Advanced: "red",
};

export default function AmpscriptLab() {
  const { completed, markComplete } = useTrackProgress("ampscript");
  const [currentId, setCurrentId] = useState(ampLessons[0].id);
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [ranMap, setRanMap] = useState<Record<string, boolean>>({});

  const index = ampLessons.findIndex((l) => l.id === currentId);
  const lesson = ampLessons[index];
  const lessonNumber = index + 1;
  const code = codeMap[currentId] ?? lesson.starter;
  const ran = ranMap[currentId] ?? false;

  const result = useMemo(
    () => renderAmpscript(code, CONTACT, TABLES),
    [code]
  );

  const checks: CheckResult[] = useMemo(
    () =>
      lesson.checks.map((c) => ({
        label: c.label,
        hint: c.hint,
        passed: c.test(code, result),
      })),
    [lesson, code, result]
  );

  const state = ran ? validate(checks) : "idle";

  useEffect(() => {
    if (state === "success") markComplete(currentId);
  }, [state, currentId, markComplete]);

  const setCode = (v: string) =>
    setCodeMap((m) => ({ ...m, [currentId]: v }));

  const run = () => setRanMap((m) => ({ ...m, [currentId]: true }));

  const reset = () => {
    setCodeMap((m) => ({ ...m, [currentId]: lesson.starter }));
    setRanMap((m) => ({ ...m, [currentId]: false }));
  };

  const next = ampLessons[index + 1];
  const goNext = () => next && setCurrentId(next.id);

  const earnedXp = ampLessons
    .filter((l) => completed.includes(l.id))
    .reduce((sum, l) => sum + l.xp, 0);
  const skillPct = Math.round(
    (completed.filter((id) => ampLessons.some((l) => l.id === id)).length /
      ampLessons.length) *
      100
  );

  return (
    <AppShell title="AMPscript Lab">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="blue">AMPscript Path</Badge>
          <Badge tone={levelTone[lesson.level]}>{lesson.level}</Badge>
          <span className="text-sm text-muted">
            Lesson {lessonNumber} of {ampLessons.length} · learn personalization
            by doing.
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-cyan">
            <Zap className="h-3.5 w-3.5" />
            <span className="font-mono">{earnedXp.toLocaleString()} XP</span>
          </span>
          <span className="flex items-center gap-1.5 text-electric">
            <Trophy className="h-3.5 w-3.5" />
            <span className="font-mono">{skillPct}% skill</span>
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Curriculum */}
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3 lg:row-span-2">
          <div className="h-[640px]">
            <CurriculumPanel
              items={ampLessons}
              currentId={currentId}
              completedIds={completed}
              onSelect={setCurrentId}
              itemLabel="Lesson"
            />
          </div>
        </div>

        {/* Center: concept + editor */}
        <div className="space-y-4 lg:col-span-6">
          {/* Concept + task */}
          <div className="rounded-xl border border-line bg-card">
            <div className="flex items-center gap-2.5 border-b border-line px-5 py-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-electric/15 text-electric">
                <BookOpen className="h-4 w-4" />
              </span>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-electric">
                  Lesson {String(lessonNumber).padStart(2, "0")}
                </span>
                <h2 className="text-base font-semibold leading-tight text-text">
                  {lesson.title}
                </h2>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-sm leading-relaxed text-text-secondary">
                {lesson.concept}
              </p>
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <Target className="h-3.5 w-3.5" /> Your task
                </div>
                <ul className="space-y-1.5">
                  {lesson.task.map((t, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-sm text-text-secondary"
                    >
                      <span className="font-mono text-xs text-electric">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex h-[360px] flex-col overflow-hidden rounded-xl border border-line bg-deep">
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
              <span className="font-mono text-xs text-muted">
                lesson-{lessonNumber}.ampscript
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={reset}>
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
                <Button size="sm" onClick={run}>
                  <Play className="h-3.5 w-3.5" /> Run &amp; Validate
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <CodeEditor value={code} onChange={setCode} language="javascript" />
            </div>
          </div>

          {/* Validation feedback */}
          <LessonFeedback
            checks={ran ? checks : []}
            state={state}
            successMessage={`Lesson complete — +${lesson.xp} XP`}
          />

          {state === "success" && (
            <div className="flex items-center justify-between rounded-xl border border-green/30 bg-green/5 px-4 py-3">
              <span className="text-sm text-text-secondary">
                Nice work. Ready for the next concept?
              </span>
              {next ? (
                <Button size="sm" onClick={goNext}>
                  Next Lesson <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Badge tone="green">Path complete</Badge>
              )}
            </div>
          )}
        </div>

        {/* Right: inspector */}
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
          <InspectorPanel
            title="Variable Inspector"
            icon={<Variable className="h-4 w-4 text-cyan" />}
          >
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                <User className="h-3.5 w-3.5" /> Contact (Data Extension)
              </div>
              <div className="space-y-1.5">
                {Object.entries(CONTACT).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-md border border-line bg-deep/50 px-2.5 py-1.5 font-mono text-xs"
                  >
                    <span className="text-muted">{k}</span>
                    <span className="text-text">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Resolved Variables
              </div>
              <div className="space-y-1.5">
                {Object.keys(result.vars).length === 0 && (
                  <p className="text-xs text-muted">
                    No variables set yet — add a SET statement.
                  </p>
                )}
                {Object.entries(result.vars).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-2 rounded-md border border-electric/20 bg-electric/5 px-2.5 py-1.5 font-mono text-xs"
                  >
                    <span className="shrink-0 text-electric">@{k}</span>
                    <span className="truncate text-right text-text">{v}</span>
                  </div>
                ))}
              </div>
              {result.errors.length > 0 && (
                <div className="mt-3 rounded-md border border-red/30 bg-red/10 p-2.5">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-red">
                    Runtime errors
                  </div>
                  {result.errors.slice(0, 4).map((e, i) => (
                    <div key={i} className="font-mono text-[11px] text-red/90">
                      {e}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </InspectorPanel>
        </div>

        {/* Email preview (full width) */}
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-9 lg:col-start-4">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-electric" />
              <h3 className="text-sm font-semibold text-text">Email Preview</h3>
            </div>
            <Badge tone={result.errors.length === 0 ? "green" : "red"}>
              {result.errors.length === 0 ? "Rendered" : "Errors"} ·{" "}
              {result.errors.length} issues
            </Badge>
          </div>
          <div className="p-5">
            <div className="mx-auto max-w-xl rounded-lg border border-line bg-white p-6 text-[#1f2937] shadow-xl">
              <div className="mb-4 border-b border-gray-200 pb-3 text-xs text-gray-500">
                <div>
                  <span className="font-semibold">To:</span> {CONTACT.Email}
                </div>
                <div>
                  <span className="font-semibold">Subject:</span>{" "}
                  {lesson.subject}
                </div>
              </div>
              <div
                className={cn(
                  "whitespace-pre-wrap text-sm leading-relaxed",
                  !result.output && "italic text-gray-400"
                )}
              >
                {result.output || "Your rendered email will appear here."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architect notes */}
      <div className="mt-4">
        <ArchitectNotes notes={lesson.notes} />
      </div>
    </AppShell>
  );
}
