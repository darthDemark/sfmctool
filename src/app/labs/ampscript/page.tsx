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
  Code2,
  Target,
  ClipboardList,
  Zap,
  CheckCircle2,
  Lightbulb,
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
import { LabTabs } from "@/components/labs/lab-tabs";
import { CompetencyMatrix } from "@/components/labs/competency-matrix";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { renderAmpscript, type EvalResult } from "@/lib/ampscript";
import { ampLessons, CONTACT, TABLES, type AmpLesson } from "@/lib/ampscript-curriculum";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const levelTone: Record<CurriculumLevel, "green" | "amber" | "red"> = {
  Beginner: "green",
  Intermediate: "amber",
  Advanced: "red",
};

const TABS = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: Code2 },
  { id: "challenge", label: "Challenge", icon: Target },
  { id: "review", label: "Review", icon: ClipboardList },
];

const CHALLENGE_SKELETON = `%%[
  /* Challenge: write the solution yourself — no worked example.
     Use the task above and the variable inspector to verify. */

]%%
`;

function checksFor(lesson: AmpLesson, code: string, result: EvalResult): CheckResult[] {
  return lesson.checks.map((c) => ({
    label: c.label,
    hint: c.hint,
    passed: c.test(code, result),
  }));
}

function EmailPreview({ subject, result }: { subject: string; result: EvalResult }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card">
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
              <span className="font-semibold">To:</span> {String(CONTACT.Email)}
            </div>
            <div>
              <span className="font-semibold">Subject:</span> {subject}
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
  );
}

function VarInspector({ result }: { result: EvalResult }) {
  return (
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
            <p className="text-xs text-muted">No variables set yet.</p>
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
      </div>
    </InspectorPanel>
  );
}

export default function AmpscriptLab() {
  const { completeLesson, recordChallenge, viewLesson, stats, store } =
    useProgress();
  const [tab, setTab] = useState("learn");
  const [currentId, setCurrentId] = useState(ampLessons[0].id);
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [ranMap, setRanMap] = useState<Record<string, boolean>>({});
  const [chCodeMap, setChCodeMap] = useState<Record<string, string>>({});
  const [chRanMap, setChRanMap] = useState<Record<string, boolean>>({});

  const index = ampLessons.findIndex((l) => l.id === currentId);
  const lesson = ampLessons[index];
  const lessonNumber = index + 1;

  useEffect(() => {
    viewLesson(currentId);
  }, [currentId, viewLesson]);

  // PRACTICE
  const code = codeMap[currentId] ?? lesson.starter;
  const ran = ranMap[currentId] ?? false;
  const result = useMemo(() => renderAmpscript(code, CONTACT, TABLES), [code]);
  const checks = useMemo(() => checksFor(lesson, code, result), [lesson, code, result]);
  const state = ran ? validate(checks) : "idle";
  const scorePct = Math.round(
    (checks.filter((c) => c.passed).length / checks.length) * 100
  );

  useEffect(() => {
    if (ran && state === "success") completeLesson(currentId, lesson.title, scorePct);
  }, [ran, state, currentId, lesson.title, scorePct, completeLesson]);

  // CHALLENGE
  const chCode = chCodeMap[currentId] ?? CHALLENGE_SKELETON;
  const chRan = chRanMap[currentId] ?? false;
  const chResult = useMemo(() => renderAmpscript(chCode, CONTACT, TABLES), [chCode]);
  const chChecks = useMemo(
    () => checksFor(lesson, chCode, chResult),
    [lesson, chCode, chResult]
  );
  const chState = chRan ? validate(chChecks) : "idle";
  const chScore = Math.round(
    (chChecks.filter((c) => c.passed).length / chChecks.length) * 100
  );

  useEffect(() => {
    if (chRan && chState === "success")
      recordChallenge(`amp-ch-${currentId}`, lesson.title, chScore);
  }, [chRan, chState, currentId, lesson.title, chScore, recordChallenge]);

  const next = ampLessons[index + 1];
  const goNext = () => {
    if (next) {
      setCurrentId(next.id);
      setTab("learn");
    }
  };

  const ampCompetencies = stats.competencies.filter(
    (c) => c.category === "AMPscript"
  );
  const recommended = ampLessons.find(
    (l) => !store.completedLessons.includes(l.id)
  );

  return (
    <AppShell title="AMPscript Lab">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="blue">AMPscript Path</Badge>
          <Badge tone={levelTone[lesson.level]}>{lesson.level}</Badge>
          <span className="text-sm text-muted">
            Lesson {lessonNumber} of {ampLessons.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-cyan">
            <Zap className="h-3.5 w-3.5" />
            <span className="font-mono">{stats.xp.toLocaleString()} XP</span>
          </span>
          <span className="flex items-center gap-1.5 text-electric">
            <span className="font-mono">
              {stats.categoryReadiness["AMPscript"]}% AMPscript
            </span>
          </span>
        </div>
      </div>

      <div className="mb-4">
        <LabTabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Curriculum */}
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
          <div className="h-[640px]">
            <CurriculumPanel
              items={ampLessons}
              currentId={currentId}
              completedIds={store.completedLessons}
              onSelect={(id) => setCurrentId(id)}
              itemLabel="Lesson"
            />
          </div>
        </div>

        {/* Main */}
        <div className="space-y-4 lg:col-span-9">
          {tab === "learn" && (
            <>
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
                  <section>
                    <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      Concept
                    </h4>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {lesson.concept}
                    </p>
                  </section>
                  <section>
                    <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      Your task
                    </h4>
                    <ul className="space-y-1.5">
                      {lesson.task.map((t, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-text-secondary">
                          <span className="font-mono text-xs text-electric">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      Starter code
                    </h4>
                    <pre className="scrollbar-thin overflow-x-auto rounded-lg border border-line bg-deep p-3 font-mono text-[12px] leading-relaxed text-text-secondary">
                      <code>{lesson.starter}</code>
                    </pre>
                  </section>
                  <div className="flex items-center justify-between border-t border-line pt-4">
                    <span className="text-sm text-muted">
                      Ready to try it yourself?
                    </span>
                    <Button size="sm" onClick={() => setTab("practice")}>
                      Practice <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-violet/20 bg-gradient-to-br from-violet/5 to-transparent">
                <div className="flex items-center gap-2 border-b border-line px-5 py-3">
                  <Lightbulb className="h-4 w-4 text-violet" />
                  <h3 className="text-sm font-semibold text-text">
                    Why this matters in real SFMC work
                  </h3>
                </div>
                <ArchitectNotes notes={lesson.notes} />
              </div>
            </>
          )}

          {tab === "practice" && (
            <>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex h-[360px] flex-col overflow-hidden rounded-xl border border-line bg-deep">
                    <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
                      <span className="font-mono text-xs text-muted">
                        lesson-{lessonNumber}.ampscript
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCodeMap((m) => ({ ...m, [currentId]: lesson.starter }));
                            setRanMap((m) => ({ ...m, [currentId]: false }));
                          }}
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reset
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setRanMap((m) => ({ ...m, [currentId]: true }))}
                        >
                          <Play className="h-3.5 w-3.5" /> Run &amp; Validate
                        </Button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1">
                      <CodeEditor
                        value={code}
                        onChange={(v) => setCodeMap((m) => ({ ...m, [currentId]: v }))}
                        language="javascript"
                      />
                    </div>
                  </div>
                  <LessonFeedback
                    checks={ran ? checks : []}
                    state={state}
                    successMessage={`Lesson complete — +${lesson.xp} XP`}
                  />
                  {state === "success" && (
                    <div className="flex items-center justify-between rounded-xl border border-green/30 bg-green/5 px-4 py-3">
                      <span className="text-sm text-text-secondary">
                        Locked in. Try the Challenge, or move on.
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setTab("challenge")}>
                          Challenge
                        </Button>
                        {next && (
                          <Button size="sm" onClick={goNext}>
                            Next Lesson <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="overflow-hidden rounded-xl border border-line bg-card">
                  <VarInspector result={result} />
                </div>
              </div>
              <EmailPreview subject={lesson.subject} result={result} />
            </>
          )}

          {tab === "challenge" && (
            <>
              <div className="rounded-xl border border-amber/30 bg-amber/5 px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber">
                  <Target className="h-4 w-4" /> Challenge — prove it from scratch
                </div>
                <p className="mt-1 text-[13px] text-text-secondary">
                  No worked example. Write the solution to: {lesson.task[0]}
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex h-[360px] flex-col overflow-hidden rounded-xl border border-line bg-deep">
                    <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
                      <span className="font-mono text-xs text-muted">
                        challenge-{lessonNumber}.ampscript
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setChCodeMap((m) => ({ ...m, [currentId]: CHALLENGE_SKELETON }));
                            setChRanMap((m) => ({ ...m, [currentId]: false }));
                          }}
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reset
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setChRanMap((m) => ({ ...m, [currentId]: true }))}
                        >
                          <Play className="h-3.5 w-3.5" /> Submit
                        </Button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1">
                      <CodeEditor
                        value={chCode}
                        onChange={(v) => setChCodeMap((m) => ({ ...m, [currentId]: v }))}
                        language="javascript"
                      />
                    </div>
                  </div>
                  <LessonFeedback
                    checks={chRan ? chChecks : []}
                    state={chState}
                    successMessage={`Challenge cleared — +${lesson.xp + 140} XP · competency mastered`}
                  />
                </div>
                <div className="overflow-hidden rounded-xl border border-line bg-card">
                  <VarInspector result={chResult} />
                </div>
              </div>
              <EmailPreview subject={lesson.subject} result={chResult} />
            </>
          )}

          {tab === "review" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-card p-4">
                  <div className="text-xs uppercase tracking-wider text-muted">
                    Lessons complete
                  </div>
                  <div className="mt-1 font-mono text-2xl font-bold text-text">
                    {stats.ampLessonsDone}/{stats.ampLessonsTotal}
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-card p-4">
                  <div className="text-xs uppercase tracking-wider text-muted">
                    AMPscript readiness
                  </div>
                  <div className="mt-1 font-mono text-2xl font-bold text-electric">
                    {stats.categoryReadiness["AMPscript"]}%
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-card p-4">
                  <div className="text-xs uppercase tracking-wider text-muted">
                    Challenges cleared
                  </div>
                  <div className="mt-1 font-mono text-2xl font-bold text-amber">
                    {
                      Object.keys(store.challengeScores).filter((k) =>
                        k.startsWith("amp-ch")
                      ).length
                    }
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-text">
                  AMPscript Competency Matrix
                </h3>
                <CompetencyMatrix items={ampCompetencies} />
              </div>

              <div className="rounded-xl border border-line bg-card">
                <div className="border-b border-line px-5 py-3">
                  <h3 className="text-sm font-semibold text-text">Lesson log</h3>
                </div>
                <div className="divide-y divide-line">
                  {ampLessons.map((l, i) => {
                    const done = store.completedLessons.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        onClick={() => {
                          setCurrentId(l.id);
                          setTab("learn");
                        }}
                        className="flex w-full items-center gap-3 px-5 py-2.5 text-left hover:bg-panel/40"
                      >
                        <CheckCircle2
                          className={cn(
                            "h-4 w-4 shrink-0",
                            done ? "text-green" : "text-line"
                          )}
                        />
                        <span className="w-6 font-mono text-[11px] text-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 truncate text-sm text-text-secondary">
                          {l.title}
                        </span>
                        <Badge tone={levelTone[l.level]}>{l.level}</Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              {recommended && (
                <div className="flex items-center justify-between rounded-xl border border-electric/30 bg-electric/5 px-5 py-4">
                  <div>
                    <div className="text-sm font-semibold text-text">
                      Recommended next: {recommended.title}
                    </div>
                    <p className="text-[13px] text-muted">
                      Pick up where your competency gaps are largest.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentId(recommended.id);
                      setTab("learn");
                    }}
                  >
                    Resume <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
