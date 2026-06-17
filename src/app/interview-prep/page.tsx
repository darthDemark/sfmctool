"use client";

import { useState } from "react";
import {
  MessageSquareCode,
  ChevronDown,
  Code2,
  Database,
  GitBranch,
  Bug,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
  { label: "AMPscript", count: 24, icon: Code2, accent: "var(--color-electric)" },
  { label: "SQL", count: 31, icon: Database, accent: "var(--color-cyan)" },
  { label: "Journey Builder", count: 18, icon: GitBranch, accent: "var(--color-violet)" },
  { label: "Troubleshooting", count: 15, icon: Bug, accent: "var(--color-red)" },
];

const questions = [
  {
    q: "How do you safely handle a null or empty AttributeValue in AMPscript?",
    a: "Wrap the read in an IF EMPTY() guard or use a default with the IIF / Empty() pattern, e.g. SET @name = IIF(EMPTY(AttributeValue('FirstName')), 'there', AttributeValue('FirstName')). Never render personalization directly without a fallback.",
    tag: "AMPscript",
  },
  {
    q: "What's the difference between a Data Extension and a Data View in SFMC?",
    a: "Data Extensions are tables you create and populate (sendable or not). Data Views (_Sent, _Open, _Click, etc.) are read-only system tables exposing tracking and subscriber data, queryable via SQL in Automation Studio.",
    tag: "SQL",
  },
  {
    q: "When would you use a Decision Split vs an Engagement Split in a journey?",
    a: "Decision Split branches on attribute/data values at evaluation time. Engagement Split branches specifically on email engagement (opened/clicked) from a prior send in the journey, with a built-in wait window.",
    tag: "Journey Builder",
  },
  {
    q: "An automation reports success but no emails were sent. Where do you look first?",
    a: "Confirm each step's row counts, then check journey entry qualification and field mappings. A 'successful' automation only means activities executed — downstream entry filters or contact-key mismatches commonly cause silent zero-sends.",
    tag: "Troubleshooting",
  },
];

export default function InterviewPrepPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <AppShell title="Interview Prep">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-violet/10 via-card to-blue/10 p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet/15 text-violet">
              <MessageSquareCode className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Interview Drill
              </h2>
              <p className="text-sm text-muted">
                Practice the questions hiring managers actually ask — with model
                answers from senior operators.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="rounded-xl border border-line bg-card p-4"
              >
                <span
                  className="grid h-9 w-9 place-items-center rounded-lg"
                  style={{ background: `${c.accent}1a`, color: c.accent }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="mt-3 text-sm font-semibold text-text">
                  {c.label}
                </div>
                <div className="text-xs text-muted">{c.count} questions</div>
              </div>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Questions</CardTitle>
            <Badge tone="violet">Model answers</Badge>
          </CardHeader>
          <CardBody className="space-y-2.5">
            {questions.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-line bg-deep/40"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <Badge tone="neutral" className="shrink-0">
                      {item.tag}
                    </Badge>
                    <span className="flex-1 text-sm font-medium text-text">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-line px-4 py-3 text-sm leading-relaxed text-text-secondary">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
