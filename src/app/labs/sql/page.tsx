"use client";

import { useState } from "react";
import {
  Database,
  Play,
  RotateCcw,
  Table2,
  KeyRound,
  Gauge,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ScenarioPanel } from "@/components/labs/scenario-panel";
import { CodeEditor } from "@/components/labs/code-editor";
import { ArchitectNotes } from "@/components/labs/architect-notes";
import { ResultsTable } from "@/components/labs/results-table";
import { InspectorPanel } from "@/components/labs/workbench";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { schema, runQuery, type QueryScore } from "@/lib/sql-data";
import { cn } from "@/lib/utils";

const STARTER = `SELECT
    s.SubscriberKey,
    s.FirstName,
    s.LoyaltyTier,
    SUM(o.OrderTotal) AS TotalSpend
FROM Subscribers s
JOIN Orders o
    ON o.SubscriberKey = s.SubscriberKey
WHERE s.LoyaltyTier = 'Gold'
GROUP BY s.SubscriberKey, s.FirstName, s.LoyaltyTier
ORDER BY TotalSpend DESC`;

export default function SqlLab() {
  const [code, setCode] = useState(STARTER);
  const [result, setResult] = useState<QueryScore | null>(() =>
    runQuery(STARTER)
  );

  return (
    <AppShell title="SQL Lab">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone="cyan">SQL</Badge>
          <Badge tone="neutral">Segmentation</Badge>
          <span className="text-sm text-muted">
            Practice segmentation and SQL logic.
          </span>
        </div>
        <span className="font-mono text-xs text-cyan">+200 XP available</span>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Challenge */}
          <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
            <ScenarioPanel
              code="Challenge 03"
              title="High-Value Gold Segment"
              difficulty="Intermediate"
              icon={Database}
              objective="Find Gold-tier subscribers ranked by lifetime spend for a VIP campaign."
              brief="The retention team is launching a VIP rewards push. They need every Gold loyalty member with their total spend across all orders, highest spenders first, so they can size the offer budget."
              requirements={[
                "Join Subscribers to Orders on SubscriberKey.",
                "Aggregate OrderTotal into TotalSpend per subscriber.",
                "Filter to LoyaltyTier = 'Gold' and sort by spend descending.",
              ]}
            />
          </div>

          {/* Editor */}
          <div className="flex h-[460px] flex-col overflow-hidden rounded-xl border border-line bg-deep lg:col-span-6">
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
              <span className="font-mono text-xs text-muted">
                gold-segment.sql
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCode(STARTER);
                    setResult(runQuery(STARTER));
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
                <Button size="sm" onClick={() => setResult(runQuery(code))}>
                  <Play className="h-3.5 w-3.5" /> Run Query
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <CodeEditor value={code} onChange={setCode} language="sql" />
            </div>
          </div>

          {/* Schema */}
          <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
            <InspectorPanel
              title="Schema Viewer"
              icon={<Table2 className="h-4 w-4 text-cyan" />}
            >
              <div className="space-y-3">
                {schema.map((t) => (
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
                            {c.key && (
                              <KeyRound className="h-3 w-3 text-amber" />
                            )}
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
        </div>

        {/* Results */}
        <div className="overflow-hidden rounded-xl border border-line bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
            <div className="flex items-center gap-2">
              <Table2 className="h-4 w-4 text-cyan" />
              <h3 className="text-sm font-semibold text-text">Query Results</h3>
            </div>
            {result && (
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
          {result ? (
            <>
              <ResultsTable columns={result.columns} rows={result.rows} />
              <div className="flex flex-wrap gap-2 border-t border-line px-5 py-3">
                {result.checks.map((c) => (
                  <span
                    key={c.label}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px]",
                      c.passed
                        ? "border-green/30 bg-green/10 text-green"
                        : "border-line bg-deep/50 text-muted"
                    )}
                  >
                    {c.passed ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {c.label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="grid h-32 place-items-center text-sm text-muted">
              Run the query to see results.
            </div>
          )}
        </div>

        <ArchitectNotes
          notes={[
            {
              tone: "success",
              text: "Aggregating with SUM and GROUP BY at the subscriber grain is exactly right — this is the backbone of nearly every RFM and lifetime-value segment.",
            },
            {
              tone: "warning",
              text: "Be careful: an INNER JOIN to Orders silently drops Gold members who have never purchased. If the brief wanted all Gold members, you'd switch to a LEFT JOIN and COALESCE the spend to 0.",
            },
            {
              tone: "info",
              text: "In SFMC, query activities have runtime limits. For large data extensions, filter early and index your SubscriberKey to keep this performant.",
            },
          ]}
        />
      </div>
    </AppShell>
  );
}
