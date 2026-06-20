"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Timer,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lightbulb,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress";
import {
  questions,
  domains,
  certTracks,
  type CertQuestion,
  type Domain,
} from "@/lib/cert-data";
import { cn } from "@/lib/utils";

type Mode = "domain" | "exam" | "review" | "weak";

const modeTabs: { id: Mode; label: string; icon: typeof BookOpen }[] = [
  { id: "domain", label: "Practice by Domain", icon: BookOpen },
  { id: "exam", label: "Timed Mock Exam", icon: Timer },
  { id: "review", label: "Review Missed", icon: RefreshCw },
  { id: "weak", label: "Weak Areas", icon: AlertTriangle },
];

function QuestionView({
  q,
  storedChoice,
  onAnswer,
}: {
  q: CertQuestion;
  storedChoice?: number;
  onAnswer: (choice: number, correct: boolean) => void;
}) {
  const [choice, setChoice] = useState<number | null>(storedChoice ?? null);
  const [submitted, setSubmitted] = useState(storedChoice !== undefined);

  const correct = choice === q.answer;

  return (
    <div className="rounded-xl border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <Badge tone="violet">{q.domain}</Badge>
        <span className="font-mono text-[11px] text-muted">{q.id.toUpperCase()}</span>
      </div>
      <div className="p-5">
        <p className="text-[15px] font-medium text-text">{q.question}</p>
        <div className="mt-4 space-y-2">
          {q.choices.map((c, i) => {
            const isSel = choice === i;
            const showRight = submitted && i === q.answer;
            const showWrong = submitted && isSel && i !== q.answer;
            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setChoice(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                  !submitted && isSel
                    ? "border-electric/50 bg-electric/10 text-text"
                    : "border-line bg-deep/40 text-text-secondary",
                  !submitted && "hover:border-electric/30",
                  showRight && "border-green/50 bg-green/10 text-text",
                  showWrong && "border-red/50 bg-red/10 text-text"
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[11px]",
                    isSel ? "border-electric" : "border-line"
                  )}
                >
                  {showRight ? (
                    <CheckCircle2 className="h-4 w-4 text-green" />
                  ) : showWrong ? (
                    <XCircle className="h-4 w-4 text-red" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                {c}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <Button
            size="sm"
            className="mt-4"
            disabled={choice === null}
            onClick={() => {
              setSubmitted(true);
              onAnswer(choice as number, choice === q.answer);
            }}
          >
            Submit Answer
          </Button>
        ) : (
          <div className="mt-4 space-y-3">
            <div
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                correct ? "text-green" : "text-red"
              )}
            >
              {correct ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Correct
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" /> Incorrect
                </>
              )}
            </div>
            <div className="rounded-lg border border-line bg-deep/40 p-3 text-[13px] text-text-secondary">
              <span className="font-semibold text-text">Explanation: </span>
              {q.explanation}
            </div>
            <div className="rounded-lg border border-amber/20 bg-amber/5 p-3 text-[13px] text-text-secondary">
              <Lightbulb className="mr-1 inline h-3.5 w-3.5 text-amber" />
              <span className="font-semibold text-amber">In production: </span>
              {q.production}
            </div>
            <Link
              href={q.related.href}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-electric hover:underline"
            >
              Related: {q.related.label} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function DomainPractice() {
  const { store, answerCert } = useProgress();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [index, setIndex] = useState(0);

  const domainQuestions = useMemo(
    () => (domain ? questions.filter((q) => q.domain === domain) : []),
    [domain]
  );

  if (!domain) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {domains.map((d) => {
          const qs = questions.filter((q) => q.domain === d);
          const answered = qs.filter((q) => store.certAnswers[q.id]).length;
          const correct = qs.filter(
            (q) => store.certAnswers[q.id]?.correct
          ).length;
          return (
            <button
              key={d}
              onClick={() => {
                setDomain(d);
                setIndex(0);
              }}
              className="rounded-xl border border-line bg-card p-4 text-left transition-colors hover:border-electric/40"
            >
              <h4 className="text-sm font-semibold text-text">{d}</h4>
              <p className="mt-1 text-xs text-muted">{qs.length} questions</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted">{answered} answered</span>
                <span className="font-mono text-green">
                  {answered > 0 ? Math.round((correct / answered) * 100) : 0}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  const q = domainQuestions[index];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setDomain(null)}
          className="text-sm text-electric hover:underline"
        >
          ← All domains
        </button>
        <span className="text-xs text-muted">
          {index + 1} / {domainQuestions.length}
        </span>
      </div>
      <QuestionView
        key={q.id}
        q={q}
        storedChoice={store.certAnswers[q.id]?.choice}
        onAnswer={(choice, correct) => answerCert(q.id, choice, correct)}
      />
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          Previous
        </Button>
        {index < domainQuestions.length - 1 ? (
          <Button size="sm" onClick={() => setIndex((i) => i + 1)}>
            Next Question <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button size="sm" onClick={() => setDomain(null)}>
            Finish Domain
          </Button>
        )}
      </div>
    </div>
  );
}

const EXAM_SIZE = 12;
const EXAM_SECONDS = 12 * 60;

function MockExam() {
  const { answerCert, recordExam } = useProgress();
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useState(EXAM_SECONDS);
  const [score, setScore] = useState(0);

  const examQuestions = useMemo(() => questions.slice(0, EXAM_SIZE), []);

  const finish = () => {
    const correct = examQuestions.filter(
      (q) => answers[q.id] === q.answer
    ).length;
    const pct = Math.round((correct / examQuestions.length) * 100);
    setScore(pct);
    setFinished(true);
    examQuestions.forEach((q) => {
      if (answers[q.id] !== undefined)
        answerCert(q.id, answers[q.id], answers[q.id] === q.answer);
    });
    recordExam(pct);
  };

  useEffect(() => {
    if (!started || finished) return;
    if (seconds <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      finish();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, finished, seconds]);

  if (!started) {
    return (
      <div className="rounded-xl border border-line bg-card p-8 text-center">
        <Timer className="mx-auto h-8 w-8 text-electric" />
        <h3 className="mt-3 text-lg font-semibold">Timed Mock Exam</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted">
          {EXAM_SIZE} questions · 12 minutes · no feedback until you submit. Mirrors
          the pressure of the real Email Specialist exam.
        </p>
        <Button className="mt-5" onClick={() => setStarted(true)}>
          Start Exam <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (finished) {
    const pass = score >= 80;
    return (
      <div className="space-y-4">
        <div
          className={cn(
            "rounded-xl border p-8 text-center",
            pass ? "border-green/30 bg-green/5" : "border-amber/30 bg-amber/5"
          )}
        >
          <div
            className={cn(
              "mx-auto font-mono text-5xl font-bold",
              pass ? "text-green" : "text-amber"
            )}
          >
            {score}%
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            {pass
              ? "Pass — you cleared the 80% bar. Cert Ready badge unlocked."
              : "Not quite — aim for 80%. Review weak areas and retake."}
          </p>
          <Button
            className="mt-5"
            variant="secondary"
            onClick={() => {
              setStarted(false);
              setFinished(false);
              setAnswers({});
              setSeconds(EXAM_SECONDS);
            }}
          >
            Retake Exam
          </Button>
        </div>
        <div className="space-y-2">
          {examQuestions.map((q) => {
            const a = answers[q.id];
            const right = a === q.answer;
            return (
              <div
                key={q.id}
                className="flex items-center gap-3 rounded-lg border border-line bg-deep/40 px-4 py-2.5 text-sm"
              >
                {right ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-red" />
                )}
                <span className="flex-1 truncate text-text-secondary">
                  {q.question}
                </span>
                <Badge tone="neutral">{q.domain}</Badge>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-10 flex items-center justify-between rounded-xl border border-line bg-card/90 px-5 py-3 backdrop-blur">
        <span className="text-sm text-muted">
          {answeredCount} / {examQuestions.length} answered
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5 font-mono text-sm font-semibold",
            seconds < 60 ? "text-red" : "text-electric"
          )}
        >
          <Timer className="h-4 w-4" />
          {mm}:{ss}
        </span>
        <Button size="sm" onClick={finish}>
          Submit Exam
        </Button>
      </div>
      {examQuestions.map((q, qi) => (
        <div key={q.id} className="rounded-xl border border-line bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted">
              Question {qi + 1}
            </span>
            <Badge tone="violet">{q.domain}</Badge>
          </div>
          <p className="text-[15px] font-medium text-text">{q.question}</p>
          <div className="mt-3 space-y-2">
            {q.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                  answers[q.id] === i
                    ? "border-electric/50 bg-electric/10 text-text"
                    : "border-line bg-deep/40 text-text-secondary hover:border-electric/30"
                )}
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line font-mono text-[11px]">
                  {String.fromCharCode(65 + i)}
                </span>
                {c}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewMissed() {
  const { store, answerCert } = useProgress();
  const missed = questions.filter((q) => store.certAnswers[q.id]?.correct === false);

  if (missed.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-card p-8 text-center text-sm text-muted">
        No missed questions yet. Answer questions in Practice or the Mock Exam —
        anything you get wrong shows up here to retry.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {missed.length} question{missed.length > 1 ? "s" : ""} to re-attempt.
        Get them right to clear them from this list.
      </p>
      {missed.map((q) => (
        <QuestionView
          key={q.id + (store.certAnswers[q.id]?.correct ? "-r" : "")}
          q={q}
          onAnswer={(choice, correct) => answerCert(q.id, choice, correct)}
        />
      ))}
    </div>
  );
}

function WeakAreas() {
  const { store } = useProgress();
  const rows = domains
    .map((d) => {
      const qs = questions.filter((q) => q.domain === d);
      const answered = qs.filter((q) => store.certAnswers[q.id]).length;
      const correct = qs.filter((q) => store.certAnswers[q.id]?.correct).length;
      const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
      return { d, answered, correct, total: qs.length, pct };
    })
    .sort((a, b) => a.pct - b.pct);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Domains sorted weakest-first, based on your answer history.
      </p>
      {rows.map((r) => (
        <div key={r.d} className="rounded-xl border border-line bg-card p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-text">{r.d}</h4>
            <span
              className={cn(
                "font-mono text-sm font-semibold",
                r.answered === 0
                  ? "text-muted"
                  : r.pct >= 80
                  ? "text-green"
                  : r.pct >= 50
                  ? "text-amber"
                  : "text-red"
              )}
            >
              {r.answered === 0 ? "—" : `${r.pct}%`}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-deep">
            <div
              className="h-full rounded-full"
              style={{
                width: `${r.pct}%`,
                background:
                  r.pct >= 80
                    ? "var(--color-green)"
                    : r.pct >= 50
                    ? "var(--color-amber)"
                    : "var(--color-red)",
              }}
            />
          </div>
          <div className="mt-1.5 text-xs text-muted">
            {r.answered} of {r.total} answered · {r.correct} correct
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CertificationPrepPage() {
  const { store } = useProgress();
  const [mode, setMode] = useState<Mode>("domain");

  const answered = Object.keys(store.certAnswers).length;
  const correct = Object.values(store.certAnswers).filter((a) => a.correct).length;
  const readiness = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  return (
    <AppShell title="Certification Prep">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-amber/10 via-card to-violet/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber/15 text-amber">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Certification Track
                </h2>
                <p className="text-sm text-muted">
                  Practice questions mapped to the exam blueprint — no dumps,
                  real competency.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="font-mono text-2xl font-bold text-text">
                  {answered}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted">
                  answered
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-green">
                  {readiness}%
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted">
                  accuracy
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-violet">
                  {store.examBest}%
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted">
                  best exam
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track selector */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {certTracks.map((t) => (
            <div
              key={t.id}
              className={cn(
                "rounded-xl border p-4",
                t.available
                  ? "border-electric/40 bg-electric/5"
                  : "border-line bg-deep/40 opacity-70"
              )}
            >
              <div className="flex items-center justify-between">
                <Award
                  className={cn(
                    "h-4 w-4",
                    t.available ? "text-electric" : "text-muted"
                  )}
                />
                {t.available ? (
                  <Badge tone="blue">Active</Badge>
                ) : (
                  <Lock className="h-3.5 w-3.5 text-muted" />
                )}
              </div>
              <h4
                className={cn(
                  "mt-2 text-sm font-semibold",
                  t.available ? "text-text" : "text-muted"
                )}
              >
                {t.name}
              </h4>
              <p className="mt-0.5 text-[11px] text-muted">
                {t.available ? "Functional question flow" : "Coming soon"}
              </p>
            </div>
          ))}
        </div>

        {/* Mode tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-card p-1">
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

        {mode === "domain" && <DomainPractice />}
        {mode === "exam" && <MockExam />}
        {mode === "review" && <ReviewMissed />}
        {mode === "weak" && <WeakAreas />}
      </div>
    </AppShell>
  );
}
