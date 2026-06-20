"use client";

import { CheckCircle2, XCircle, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckResult = { label: string; passed: boolean; hint?: string };

export type ValidationState = "idle" | "success" | "warning" | "error";

export function validate(checks: CheckResult[]): ValidationState {
  if (checks.length === 0) return "idle";
  const passed = checks.filter((c) => c.passed).length;
  if (passed === checks.length) return "success";
  if (passed === 0) return "error";
  return "warning";
}

const stateMeta = {
  success: {
    tone: "border-green/40 bg-green/10",
    icon: CheckCircle2,
    color: "text-green",
    title: "Validated — mission accomplished",
  },
  warning: {
    tone: "border-amber/40 bg-amber/10",
    icon: AlertTriangle,
    color: "text-amber",
    title: "Almost there — review the failing checks",
  },
  error: {
    tone: "border-red/40 bg-red/10",
    icon: XCircle,
    color: "text-red",
    title: "Not yet — your code missed the requirements",
  },
  idle: {
    tone: "border-line bg-deep/40",
    icon: Sparkles,
    color: "text-muted",
    title: "Run validation to check your work",
  },
} as const;

export function LessonFeedback({
  checks,
  state,
  successMessage,
}: {
  checks: CheckResult[];
  state: ValidationState;
  successMessage?: string;
}) {
  const meta = stateMeta[state];
  const Icon = meta.icon;
  const passedCount = checks.filter((c) => c.passed).length;

  return (
    <div className={cn("rounded-xl border", meta.tone)}>
      <div className="flex items-center gap-2.5 px-4 py-3">
        <Icon className={cn("h-5 w-5 shrink-0", meta.color)} />
        <div className="flex-1">
          <div className={cn("text-sm font-semibold", meta.color)}>
            {state === "success" && successMessage ? successMessage : meta.title}
          </div>
          {state !== "idle" && (
            <div className="text-[11px] text-muted">
              {passedCount} / {checks.length} checks passed
            </div>
          )}
        </div>
      </div>
      {checks.length > 0 && (
        <div className="space-y-1.5 border-t border-line/60 px-4 py-3">
          {checks.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-[13px]">
              {c.passed ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" />
              ) : (
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
              )}
              <span className={c.passed ? "text-text-secondary" : "text-muted"}>
                {c.label}
                {!c.passed && c.hint && (
                  <span className="text-muted/80"> — {c.hint}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
