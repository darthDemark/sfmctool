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
  Target,
  ArrowRight,
  Zap,
  Trophy,
  CheckCircle2,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sqlLessons, runSqlLesson } from "@/lib/sql-curriculum";
import { useTrackProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const levelTone: Record<CurriculumLevel, "green" | "amber" | "red"> = {
  Beginner: "green",
  Intermediate: "amber",
  Advanced: "red",
};

export default function SqlLab() {
  const { completed, markComplete } = useTrackProgress("sql");
  const [currentId, setCurrentId] = useState(sqlLessons[0].id);
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [ranMap, setRanMap] = useState<Record<string, boolean>>({});

  const index = sqlLessons.findIndex((l) => l.id === currentId);
  const lesson = sqlLessons[index];
  const lessonNumber = index + 1;
  const code = codeMap[currentId] ?? lesson.starter;
  const ran = ranMap[currentId] ?? false;

  const result = useMemo(() => runSqlLesson(lesson, code), [lesson, code]);
  const state = ran ? validate(result.checks) : "idle";

  useEffect(() => {
    if (state === "success") markComplete(currentId);
  }, [state, currentId, markComplete]);

  const setCode = (v: string) => setCodeMap((m) => ({ ...m, [currentId]: v }));
  const run = () => setRanMap((m) => ({ ...m, [currentId]: true }));
  const reset = () => {
    setCodeMap((m) => ({ ...m, [currentId]: lesson.starter }));
    setRanMap((m) => ({ ...m, [currentId]: false }));
  };

  const next = sqlLessons[index + 1];
  const goNext = () => next && setCurrentId(next.id);

  const earnedXp = sqlLessons
    .filter((l) => completed.includes(l.id))
    .reduce((sum, l) => sum + l.xp, 0);
  const skillPct = Math.round(
    (completed.filter((id) => sqlLessons.some((l) => l.id === id)).length /
      sqlLessons.length) *
      100
  );

  return (
    <AppShell title="SQL Lab">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="cyan">SQL Path</Badge>
          <Badge tone={levelTone[lesson.level]}>{lesson.level}</Badge>
          <span className="text-sm text-muted">
            Challenge {lessonNumber} of {sqlLessons.length} · segment like an
            operator.
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
              items={sqlLessons}
              currentId={currentId}
              completedIds={completed}
              onSelect={setCurrentId}
              itemLabel="Challenge"
            />
          </div>
        </div>

        {/* Center: concept + editor */}
        <div className="space-y-4 lg:col-span-6">
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
              <p className="text-sm leading-relaxed text-text-secondary">
                {lesson.concept}
              </p>
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <Target className="h-3.5 w-3.5" /> Your task
                </div>
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
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex h-[340px] flex-col overflow-hidden rounded-xl border border-line bg-deep">
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
              <span className="font-mono text-xs text-muted">
                challenge-{lessonNumber}.sql
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={reset}>
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
                <Button size="sm" onClick={run}>
                  <Play className="h-3.5 w-3.5" /> Run Query
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <CodeEditor value={code} onChange={setCode} language="sql" />
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
                Query validated against the expected output.
              </span>
              {next ? (
                <Button size="sm" onClick={goNext}>
                  Next Challenge <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Badge tone="green">Path complete</Badge>
              )}
            </div>
          )}
        </div>

        {/* Right: schema viewer */}
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
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
        </div>

        {/* Results + expected comparison (full width) */}
        <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-9 lg:col-start-4">
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
                    requirements above.
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
                  <ResultsTable
                    columns={lesson.expectedColumns}
                    rows={lesson.expectedRows}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid h-32 place-items-center text-sm text-muted">
              Run your query to compare it against the expected output.
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <ArchitectNotes notes={lesson.notes} />
      </div>
    </AppShell>
  );
}
