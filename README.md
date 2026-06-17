# SFMC Labs

**Learn Marketing Cloud the smart way.**

SFMC Labs is a hands-on simulation platform for aspiring Salesforce Marketing
Cloud professionals. It feels like a professional operations center — not a
course platform — where you train for real-world work through interactive
simulations across AMPscript, SQL, Journey Builder, Automation Studio, and
operational troubleshooting.

This repository is a **polished, interactive prototype** built to demonstrate
the product vision before production development begins. It uses mock data and
runs entirely in the browser (no backend).

## Design Direction

**Dark Ops Center** — inspired by Linear, Vercel, Raycast, Figma, the Bloomberg
Terminal, and modern cybersecurity dashboards. The goal is for the user to feel
like they are *becoming a dangerous Marketing Cloud operator*, not watching
lessons.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Flow](https://reactflow.dev/) (`@xyflow/react`) — Journey Builder canvas
- [Monaco Editor](https://github.com/suren-atoyan/monaco-react) — AMPscript & SQL editors
- [Lucide](https://lucide.dev/) — icons

No Supabase, Stripe, OpenAI, Anthropic, or Salesforce APIs are used. Mock data
lives in `src/lib/`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # lint
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/dashboard` | Operator dashboard — readiness, skills, missions, incidents |
| `/labs` | Training labs index |
| `/labs/ampscript` | AMPscript Lab — editor, variable inspector, live email preview |
| `/labs/sql` | SQL Lab — editor, schema viewer, scored query results |
| `/labs/journey-builder` | Journey Builder Lab — React Flow canvas + simulation |
| `/labs/troubleshooting` | Troubleshooting Lab — incident investigation + diagnosis |
| `/progress` | XP trajectory, skill matrix, achievements |
| `/interview-prep` | Interview question drills with model answers |
| `/certification-prep` | Certification practice tracks |

## Project Structure

```
src/
  app/                 # routes (App Router)
  components/
    layout/            # AppShell, Sidebar, TopBar
    ui/                # Button, Card, Badge
    dashboard/         # MetricCard, ProgressRing, SkillBar
    labs/              # CodeEditor, ScenarioPanel, ArchitectNotes,
                       # ResultsTable, JourneyCanvas, SimulationLogs, ...
  lib/                 # mock data + lightweight AMPscript/SQL evaluators
```

## Mock User

Heron — Marketing Automation Specialist · 12,430 XP · 67% Operational Readiness.
