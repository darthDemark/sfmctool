"use client";

import { useMemo, useState } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  User,
  Mail,
  Variable,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ScenarioPanel } from "@/components/labs/scenario-panel";
import { CodeEditor } from "@/components/labs/code-editor";
import { ArchitectNotes } from "@/components/labs/architect-notes";
import { InspectorPanel } from "@/components/labs/workbench";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { renderAmpscript, type Contact } from "@/lib/ampscript";

const CONTACT: Contact = {
  FirstName: "John",
  LastName: "Carter",
  LoyaltyTier: "Gold",
  CartTotal: 142,
  Email: "john.carter@example.com",
};

const STARTER = `%%[
  /* Cart Recovery — dynamic offer by cart value */
  SET @firstName = AttributeValue("FirstName")
  SET @tier = AttributeValue("LoyaltyTier")
  SET @cartTotal = AttributeValue("CartTotal")

  IF @cartTotal >= 100 THEN
    SET @offer = "FREESHIP"
    SET @message = "free shipping"
  ELSE
    SET @offer = "SAVE10"
    SET @message = "10% off"
  ENDIF
]%%
Hi %%=v(@firstName)=%%,

You left items in your cart. As a %%=v(@tier)=%% member,
use code %%=v(@offer)=%% for %%=v(@message)=%% before it expires!`;

export default function AmpscriptLab() {
  const [code, setCode] = useState(STARTER);
  const [ran, setRan] = useState(true);

  const result = useMemo(() => renderAmpscript(code, CONTACT), [code, ran]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppShell title="AMPscript Lab">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone="blue">AMPscript</Badge>
          <Badge tone="neutral">Personalization</Badge>
          <span className="text-sm text-muted">
            Practice personalization and dynamic content.
          </span>
        </div>
        <span className="font-mono text-xs text-cyan">+300 XP available</span>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Mission */}
          <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
            <ScenarioPanel
              code="Mission 05"
              title="Cart Recovery Dynamic Content"
              difficulty="Advanced"
              icon={Code2}
              objective="Build a cart-recovery email that swaps the offer code based on cart value."
              brief="An online retailer wants to win back shoppers who abandoned their cart. High-value carts (≥ $100) should receive free shipping; everyone else gets 10% off. Personalize the greeting with the contact's first name and loyalty tier."
              requirements={[
                "Read FirstName, LoyaltyTier, and CartTotal from the data extension.",
                "If CartTotal ≥ 100, set offer to FREESHIP, else SAVE10.",
                "Personalize the greeting and inject the dynamic offer code.",
              ]}
            />
          </div>

          {/* Editor */}
          <div className="flex h-[460px] flex-col overflow-hidden rounded-xl border border-line bg-deep lg:col-span-6">
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
              <span className="font-mono text-xs text-muted">
                cart-recovery.ampscript
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCode(STARTER);
                    setRan((r) => !r);
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
                <Button size="sm" onClick={() => setRan((r) => !r)}>
                  <Play className="h-3.5 w-3.5" /> Run
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="javascript"
              />
            </div>
          </div>

          {/* Variable inspector */}
          <div className="overflow-hidden rounded-xl border border-line bg-card lg:col-span-3">
            <InspectorPanel
              title="Variable Inspector"
              icon={<Variable className="h-4 w-4 text-cyan" />}
            >
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <User className="h-3.5 w-3.5" /> Contact
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
                      Run the script to resolve variables.
                    </p>
                  )}
                  {Object.entries(result.vars).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between rounded-md border border-electric/20 bg-electric/5 px-2.5 py-1.5 font-mono text-xs"
                    >
                      <span className="text-electric">@{k}</span>
                      <span className="text-text">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </InspectorPanel>
          </div>
        </div>

        {/* Email preview */}
        <div className="overflow-hidden rounded-xl border border-line bg-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-electric" />
              <h3 className="text-sm font-semibold text-text">Email Preview</h3>
            </div>
            <Badge tone="green">
              <CheckCircle2 className="h-3 w-3" /> Rendered · {result.errors.length}{" "}
              errors
            </Badge>
          </div>
          <div className="p-5">
            <div className="mx-auto max-w-xl rounded-lg border border-line bg-white p-6 text-[#1f2937] shadow-xl">
              <div className="mb-4 border-b border-gray-200 pb-3 text-xs text-gray-500">
                <div>
                  <span className="font-semibold">To:</span> {CONTACT.Email}
                </div>
                <div>
                  <span className="font-semibold">Subject:</span> You left
                  something behind 🛒
                </div>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {result.output}
              </div>
            </div>
          </div>
        </div>

        {/* Architect notes */}
        <ArchitectNotes
          notes={[
            {
              tone: "success",
              text: "Good instinct using a single IF/ELSE on CartTotal — that keeps the offer logic readable and easy to QA.",
            },
            {
              tone: "info",
              text: "In production, never trust AttributeValue() to be populated. Wrap reads with IF EMPTY(...) guards so a null FirstName doesn't render an awkward 'Hi ,'.",
            },
            {
              tone: "warning",
              text: "Hard-coding the $100 threshold works for the demo, but real teams store thresholds in a config data extension so marketers can tune them without a deploy.",
            },
          ]}
        />
      </div>
    </AppShell>
  );
}
