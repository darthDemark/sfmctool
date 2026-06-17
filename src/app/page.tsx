import Link from "next/link";
import {
  ArrowRight,
  Play,
  Code2,
  Database,
  GitBranch,
  Workflow,
  Bug,
  Terminal,
  Target,
  MessageSquareCode,
  TrendingUp,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const pillars = [
  {
    icon: Target,
    title: "Practice",
    text: "Run real SFMC workflows in a safe simulator — no sandbox required.",
    accent: "var(--color-electric)",
  },
  {
    icon: Bug,
    title: "Debug",
    text: "Investigate broken journeys and automations like a senior operator.",
    accent: "var(--color-red)",
  },
  {
    icon: MessageSquareCode,
    title: "Interview",
    text: "Drill the questions hiring managers actually ask, with model answers.",
    accent: "var(--color-violet)",
  },
  {
    icon: TrendingUp,
    title: "Advance",
    text: "Track operational readiness and level up toward certification.",
    accent: "var(--color-green)",
  },
];

const disciplines = [
  { icon: Code2, label: "AMPscript", accent: "var(--color-electric)" },
  { icon: Database, label: "SQL", accent: "var(--color-cyan)" },
  { icon: GitBranch, label: "Journeys", accent: "var(--color-violet)" },
  { icon: Workflow, label: "Automation", accent: "var(--color-amber)" },
  { icon: Bug, label: "Debugging", accent: "var(--color-red)" },
];

const notIs = [
  "A Salesforce clone",
  "A course platform",
  "A bootcamp",
  "A generic LMS",
];
const isList = [
  "A simulator",
  "A practice environment",
  "A Marketing Cloud training system",
  "A competency-building platform",
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-violet/15 blur-[120px]" />

      <div className="relative z-10">
        {/* Nav */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary shadow-lg shadow-blue/30">
              <span className="font-mono text-sm font-bold text-white">
                {"</>"}
              </span>
            </div>
            <span className="text-[17px] font-bold tracking-tight">
              SFMC Labs
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button href="/dashboard" variant="ghost" size="sm">
              Login
            </Button>
            <Button href="/dashboard" variant="secondary" size="sm">
              Enter Ops Center
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center md:pt-24">
          <div className="mb-6 flex justify-center">
            <Badge tone="blue" className="px-3 py-1">
              <Terminal className="h-3 w-3" />
              Dark Ops Training Environment
            </Badge>
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-[56px]">
            Learn Marketing Cloud the{" "}
            <span className="gradient-text">smart way</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Master AMPscript, SQL, Journeys, Automation Studio, and real-world
            troubleshooting through interactive simulations.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            No expensive sandbox. No memorizing certification dumps. Practice the
            workflows you&apos;ll actually use on the job.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/dashboard" size="lg">
              Start Free Mission <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/labs" variant="outline" size="lg">
              <Play className="h-4 w-4" /> View Demo
            </Button>
          </div>

          {/* Discipline strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-2.5">
            {disciplines.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.label}
                  className="flex items-center gap-2 rounded-full border border-line bg-card/70 px-4 py-2 text-sm font-medium text-text-secondary backdrop-blur"
                >
                  <Icon className="h-4 w-4" style={{ color: d.accent }} />
                  {d.label}
                </div>
              );
            })}
          </div>
        </section>

        {/* Pillars */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-xl border border-line bg-card/70 p-6 backdrop-blur transition-colors hover:border-electric/40"
                >
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl"
                    style={{ background: `${p.accent}1a`, color: p.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                    {p.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mock terminal preview */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="overflow-hidden rounded-2xl border border-line bg-deep shadow-2xl shadow-black/50 glow-blue">
            <div className="flex items-center gap-2 border-b border-line bg-panel px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red/80" />
              <span className="h-3 w-3 rounded-full bg-amber/80" />
              <span className="h-3 w-3 rounded-full bg-green/80" />
              <span className="ml-3 font-mono text-xs text-muted">
                mission-05 — cart-recovery.ampscript
              </span>
            </div>
            <pre className="scrollbar-thin overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-text-secondary">
              <code>{`%%[
  SET @cartTotal = AttributeValue("CartTotal")
  SET @firstName = AttributeValue("FirstName")

  IF @cartTotal > 100 THEN
    SET @offer = "FREESHIP"
  ELSE
    SET @offer = "SAVE10"
  ENDIF
]%%

Hey %%=v(@firstName)=%%, your cart is waiting.
Use code %%=v(@offer)=%% before it expires.`}</code>
            </pre>
            <div className="flex items-center justify-between border-t border-line bg-panel px-5 py-3 text-xs">
              <span className="font-mono text-green">
                ✓ Render passed · 0 errors
              </span>
              <span className="font-mono text-muted">Score: 94 / 100</span>
            </div>
          </div>
        </section>

        {/* What it is / is not */}
        <section className="mx-auto max-w-4xl px-6 pb-24">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-line bg-card/70 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-red">
                What SFMC Labs is not
              </h3>
              <ul className="mt-4 space-y-2.5">
                {notIs.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 text-sm text-muted line-through decoration-red/40"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-red/10 text-red no-underline">
                      ✕
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-electric/30 bg-electric/5 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-electric">
                What SFMC Labs is
              </h3>
              <ul className="mt-4 space-y-2.5">
                {isList.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 text-sm text-text"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-green/15 text-green">
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 pb-28">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-blue/15 via-card to-violet/15 p-10 text-center">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
            <div className="relative">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Become a dangerous Marketing Cloud operator.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-text-secondary">
                Stop watching lessons. Start running missions.
              </p>
              <div className="mt-7 flex justify-center">
                <Button href="/dashboard" size="lg">
                  Start Free Mission <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted sm:flex-row">
            <span>© {new Date().getFullYear()} SFMC Labs — Prototype</span>
            <span className="font-mono text-xs">
              Learn Marketing Cloud the smart way
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
