"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Database,
  Play,
  RotateCcw,
  Table2,
  KeyRound,
  Gauge,
  BookOpen,
  Code2,
  Target,
  ClipboardList,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CodeEditor } from "@/components/labs/code-editor";
import { ArchitectNotes } from "@/components/labs/architect-notes";
import { ResultsTable } from "@/components/labs/results-table";
import { InspectorPanel } from "@/components/labs/workbench";
import {
  CurriculumPanel,
  type CurriculumLevel,
} from "@/components/labs/curriculum-panel";
import { LessonFeedback, validate } from "@/components/labs/lesson-feedback";
import { LabTabs } from "@/components/labs/lab-tabs";
import { CompetencyMatrix } from "@/components/labs/competency-matrix";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  sqlLessons,
  runSqlLesson,
  type SqlLesson,
  type SqlRunResult,
} from "@/lib/sql-curriculum";
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

const CHALLENGE_SKELETON = `-- Challenge: write the full query yourself.
-- Use the schema on the right and the task above.

SELECT
`;

function SchemaViewer({ lesson }: { lesson: SqlLesson }) {
  return (
    <InspectorPanel
      title="Schema Viewer"
      icon={<Table2 className="h-4 w-4 text-cyan" />}
    >
      <div className="space-y-3">
        {lesson.schema.map((t) => (
          <div
            key={t.name}
            className="overflow-hidden rounded-lg border border-line bg-deep/50"
          >
            <div className="flex items-center gap-2 border-b border-line bg-panel px-3 py-1.5">
              <Database className="h-3.5 w-3.5 text-cyan" />
              <span className="font-mono text-xs font-semibold text-text">
                {t.name}
              </span>
            </div>
            <div className="p-1">
              {t.columns.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between px-2 py-1 font-mono text-[11px]"
                >
                  <span className="flex items-center gap-1.5 text-text-secondary">
                    {c.key && <KeyRound className="h-3 w-3 text-amber" />}
                    {c.name}
                  </span>
                  <span className="text-muted">{c.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </InspectorPanel>
  );
}

function ResultsCompare({
  ran,
  result,
  lesson,
}: {
  ran: boolean;
  result: SqlRunResult;
  lesson: SqlLesson;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <div className="flex items-center gap-2">
          <Table2 className="h-4 w-4 text-cyan" />
          <h3 className="text-sm font-semibold text-text">
            Results &amp; Expected Output
          </h3>
        </div>
        {ran && (
          <div className="flex items-center gap-4 font-mono text-xs text-muted">
            <span>{result.rowCount} rows</span>
            <span>{result.ms} ms</span>
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-cyan" />
              <span
                className={cn(
                  "font-semibold",
                  result.score >= 80
                    ? "text-green"
                    : result.score >= 50
                    ? "text-amber"
                    : "text-red"
                )}
              >
                Score {result.score}/100
              </span>
            </span>
          </div>
        )}
      </div>
      {ran ? (
        <div className="grid gap-px bg-line lg:grid-cols-2">
          <div className="bg-card">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Your Result
              </span>
              {result.matchesExpected ? (
                <Badge tone="green">
                  <CheckCircle2 className="h-3 w-3" /> Matches
                </Badge>
              ) : (
                <Badge tone="amber">Differs</Badge>
              )}
            </div>
            {result.rows.length > 0 ? (
              <ResultsTable columns={result.columns} rows={result.rows} />
            ) : (
              <div className="grid h-28 place-items-center px-4 text-center text-sm text-muted">
                No rows match yet — your query doesn&apos;t satisfy the
                requirements.
              </div>
            )}
          </div>
          <div className="bg-card">
            <div className="px-4 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Expected Output
              </span>
            </div>
            <div className="opacity-80">
              <ResultsTable columns={lesson.expectedColumns} rows={lesson.expectedRows} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid h-32 place-items-center text-sm text-muted">
          Run your query to compare it against the expected output.
        </div>
      )}
    </div>
  );
}

export default function SqlLab() {
  const { completeLesson, recordChallenge, viewLesson, stats, store } =
    useProgress();
  const [tab, setTab] = useState("learn");
  const [currentId, setCurrentId] = useState(sqlLessons[0].id);
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [ranMap, setRanMap] = useState<Record<string, boolean>>({});
  const [chCodeMap, setChCodeMap] = useState<Record<string, string>>({});
  const [chRanMap, setChRanMap] = useState<Record<string, boolean>>({});

  const index = sqlLessons.findIndex((l) => l.id === currentId);
  const lesson = sqlLessons[index];
  const lessonNumber = index + 1;

  useEffect(() => {
    viewLesson(currentId);
  }, [currentId, viewLesson]);

  const code = codeMap[currentId] ?? lesson.starter;
  const ran = ranMap[currentId] ?? false;
  const result = useMemo(() => runSqlLesson(lesson, code), [lesson, code]);
  const state = ran ? validate(result.checks) : "idle";

  useEffect(() => {
    if (ran && state === "success")
      completeLesson(currentId, lesson.title, result.score);
  }, [ran, state, currentId, lesson.title, result.score, completeLesson]);

  const chCode = chCodeMap[currentId] ?? CHALLENGE_SKELETON;
  const chRan = chRanMap[currentId] ?? false;
  const chResult = useMemo(() => runSqlLesson(lesson, chCode), [lesson, chCode]);
  const chState = chRan ? validate(chResult.checks) : "idle";

  useEffect(() => {
    if (chRan && chState === "success")
      recordChallenge(`sql-ch-${currentId}`, lesson.title, chResult.score);
  }, [chRan, chState, currentId, lesson.title, chResult.score, recordChallenge]);

  const next = sqlLessons[index + 1];
  const goNext = () => {
    if (next) {
      setCurrentId(next.id);
      setTab("learn");
    }
  };

  const sqlCompetencies = stats.competencies.filter((c) => c.category === "SQL");
  const recommended = sqlLessons.find(
    (l) => !store.completedLessons.includes(l.id)
  );

  return (
    <AppShell title="SQL Lab">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="cyan">SQL Path</Badge>
          <Badge tone={levelTone[lesson.level]}>{lesson.level}</Badge>
          <span className="text-sm text-muted">
            Challenge {lessonNumber} of {sqlLessons.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-cyan">
            <Zap className="h-3.5 w-3.5" />
            <span className="font-mono">{stats.xp.toLocaleString()} XP</span>
          </span>
          <span className="font-mono text-electric">
            {stats.categoryReadiness["SQL"]}% SQL
          </span>
        </div>
      </div>

      <div className="mb-4">
        <LabTabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
          <div className="h-[640px]">
            <CurriculumPanel
              items={sqlLessons}
              currentId={currentId}
              completedIds={store.completedLessons}
              onSelect={(id) => setCurrentId(id)}
              itemLabel="Challenge"
            />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-9">
          {tab === "learn" && (
            <>
              <div className="rounded-xl border border-line bg-card">
                <div className="flex items-center gap-2.5 border-b border-line px-5 py-3">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan/15 text-cyan">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-cyan">
                      Challenge {String(lessonNumber).padStart(2, "0")}
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
                          <span className="font-mono text-xs text-cyan">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      Starter query
                    </h4>
                    <pre className="scrollbar-thin overflow-x-auto rounded-lg border border-line bg-deep p-3 font-mono text-[12px] leading-relaxed text-text-secondary">
                      <code>{lesson.starter}</code>
                    </pre>
                  </section>
                  <div className="flex items-center justify-between border-t border-line pt-4">
                    <span className="text-sm text-muted">Ready to run it?</span>
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
                  <div className="flex h-[340px] flex-col overflow-hidden rounded-xl border border-line bg-deep">
                    <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
                      <span className="font-mono text-xs text-muted">
                        challenge-{lessonNumber}.sql
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
                          <Play className="h-3.5 w-3.5" /> Run Query
                        </Button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1">
                      <CodeEditor
                        value={code}
                        onChange={(v) => setCodeMap((m) => ({ ...m, [currentId]: v }))}
                        language="sql"
                      />
                    </div>
                  </div>
                  <LessonFeedback
                    checks={ran ? result.checks : []}
                    state={state}
                    successMessage={`Challenge solved — +${lesson.xp} XP`}
                  />
                  {state === "success" && (
                    <div className="flex items-center justify-between rounded-xl border border-green/30 bg-green/5 px-4 py-3">
                      <span className="text-sm text-text-secondary">
                        Output matches expected. Keep the streak going.
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setTab("challenge")}>
                          Challenge
                        </Button>
                        {next && (
                          <Button size="sm" onClick={goNext}>
                            Next Challenge <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="overflow-hidden rounded-xl border border-line bg-card">
                  <SchemaViewer lesson={lesson} />
                </div>
              </div>
              <ResultsCompare ran={ran} result={result} lesson={lesson} />
            </>
          )}

          {tab === "challenge" && (
            <>
              <div className="rounded-xl border border-amber/30 bg-amber/5 px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber">
                  <Target className="h-4 w-4" /> Challenge — write it from scratch
                </div>
                <p className="mt-1 text-[13px] text-text-secondary">
                  {lesson.task[0]}
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex h-[340px] flex-col overflow-hidden rounded-xl border border-line bg-deep">
                    <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
                      <span className="font-mono text-xs text-muted">
                        challenge-{lessonNumber}-graded.sql
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
                        language="sql"
                      />
                    </div>
                  </div>
                  <LessonFeedback
                    checks={chRan ? chResult.checks : []}
                    state={chState}
                    successMessage={`Challenge cleared — +${lesson.xp + 140} XP · competency mastered`}
                  />
                </div>
                <div className="overflow-hidden rounded-xl border border-line bg-card">
                  <SchemaViewer lesson={lesson} />
                </div>
              </div>
              <ResultsCompare ran={chRan} result={chResult} lesson={lesson} />
            </>
          )}

          {tab === "review" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-card p-4">
                  <div className="text-xs uppercase tracking-wider text-muted">
                    Challenges complete
                  </div>
                  <div className="mt-1 font-mono text-2xl font-bold text-text">
                    {stats.sqlLessonsDone}/{stats.sqlLessonsTotal}
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-card p-4">
                  <div className="text-xs uppercase tracking-wider text-muted">
                    SQL readiness
                  </div>
                  <div className="mt-1 font-mono text-2xl font-bold text-cyan">
                    {stats.categoryReadiness["SQL"]}%
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-card p-4">
                  <div className="text-xs uppercase tracking-wider text-muted">
                    Graded challenges 90+
                  </div>
                  <div className="mt-1 font-mono text-2xl font-bold text-amber">
                    {
                      Object.entries(store.challengeScores).filter(
                        ([k, s]) => k.startsWith("sql-ch") && s >= 90
                      ).length
                    }
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-text">
                  SQL Competency Matrix
                </h3>
                <CompetencyMatrix items={sqlCompetencies} />
              </div>

              <div className="rounded-xl border border-line bg-card">
                <div className="border-b border-line px-5 py-3">
                  <h3 className="text-sm font-semibold text-text">Challenge log</h3>
                </div>
                <div className="divide-y divide-line">
                  {sqlLessons.map((l, i) => {
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
                <div className="flex items-center justify-between rounded-xl border border-cyan/30 bg-cyan/5 px-5 py-4">
                  <div>
                    <div className="text-sm font-semibold text-text">
                      Recommended next: {recommended.title}
                    </div>
                    <p className="text-[13px] text-muted">
                      Close your largest SQL competency gap.
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
