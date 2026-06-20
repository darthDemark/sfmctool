import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Database,
  GitBranch,
  Workflow,
  Bug,
  Boxes,
  LayoutDashboard,
  FlaskConical,
  Radio,
  MessageSquareCode,
  Award,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

export const user = {
  name: "Heron",
  role: "Marketing Automation Specialist",
};

export function rankForXp(xp: number): string {
  if (xp >= 9000) return "Operator III";
  if (xp >= 4000) return "Operator II";
  if (xp >= 1500) return "Operator I";
  if (xp >= 300) return "Recruit";
  return "Trainee";
}

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Academy", href: "/academy", icon: GraduationCap },
  { label: "Labs", href: "/labs", icon: FlaskConical },
  { label: "Simulations", href: "/labs/journey-builder", icon: Radio },
  {
    label: "Broken Monday",
    href: "/labs/troubleshooting",
    icon: Bug,
    badge: "LIVE",
  },
  { label: "Interview Prep", href: "/interview-prep", icon: MessageSquareCode },
  { label: "Certification Prep", href: "/certification-prep", icon: Award },
  { label: "Progress", href: "/progress", icon: TrendingUp },
];

export type Lab = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  unit: string; // "lessons" | "challenges" | "modes" | "incidents"
  href: string;
  skills: string[];
};

export const labs: Lab[] = [
  {
    slug: "ampscript",
    title: "AMPscript Lab",
    tagline: "Personalization & dynamic content",
    description:
      "A guided path from variables to production-safe patterns, with live email previews and validation.",
    icon: Code2,
    accent: "var(--color-electric)",
    difficulty: "Intermediate",
    unit: "16 lessons",
    skills: ["AMPscript", "Personalization", "Content Blocks"],
    href: "/labs/ampscript",
  },
  {
    slug: "sql",
    title: "SQL Lab",
    tagline: "Segmentation & query logic",
    description:
      "Structured SQL training against a simulated SFMC schema, scored against expected output.",
    icon: Database,
    accent: "var(--color-cyan)",
    difficulty: "Intermediate",
    unit: "16 challenges",
    skills: ["SQL", "Segmentation", "Data Views"],
    href: "/labs/sql",
  },
  {
    slug: "journey-builder",
    title: "Journey Builder Lab",
    tagline: "Learn, build & simulate journeys",
    description:
      "Understand every node, build on a live canvas, then watch contacts flow through an animated simulation.",
    icon: GitBranch,
    accent: "var(--color-violet)",
    difficulty: "Advanced",
    unit: "3 modes",
    skills: ["Journey Builder", "Decision Splits", "Simulation"],
    href: "/labs/journey-builder",
  },
  {
    slug: "automation-studio",
    title: "Automation Studio Lab",
    tagline: "Backend automation & recovery",
    description:
      "Learn the activities, build a daily import pipeline, simulate the run, then troubleshoot a failure.",
    icon: Workflow,
    accent: "var(--color-amber)",
    difficulty: "Intermediate",
    unit: "4 modes",
    skills: ["Automation Studio", "Scheduling", "Recovery"],
    href: "/labs/automation-studio",
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting Lab",
    tagline: "Operational incident response",
    description:
      "Investigate broken automations and journeys, read the logs, and identify root cause under pressure.",
    icon: Bug,
    accent: "var(--color-red)",
    difficulty: "Advanced",
    unit: "incidents",
    skills: ["Debugging", "Root Cause", "Production"],
    href: "/labs/troubleshooting",
  },
];

export type AcademyTrack = {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  accent: string;
  href: string;
  total: number;
  beginner: number;
  intermediate: number;
  advanced: number;
  // how to derive completed-lesson count for this track
  source:
    | { kind: "lessons"; prefix: string }
    | { kind: "category"; category: string };
};

export const academyTracks: AcademyTrack[] = [
  {
    slug: "ampscript",
    title: "AMPscript Academy",
    tagline: "Personalization & server-side logic",
    icon: Code2,
    accent: "var(--color-electric)",
    href: "/labs/ampscript",
    total: 16,
    beginner: 6,
    intermediate: 5,
    advanced: 5,
    source: { kind: "lessons", prefix: "amp-" },
  },
  {
    slug: "sql",
    title: "SQL Academy",
    tagline: "Segmentation & data views",
    icon: Database,
    accent: "var(--color-cyan)",
    href: "/labs/sql",
    total: 16,
    beginner: 6,
    intermediate: 5,
    advanced: 5,
    source: { kind: "lessons", prefix: "sql-" },
  },
  {
    slug: "journey-builder",
    title: "Journey Builder Academy",
    tagline: "Automated customer paths",
    icon: GitBranch,
    accent: "var(--color-violet)",
    href: "/labs/journey-builder",
    total: 12,
    beginner: 6,
    intermediate: 4,
    advanced: 2,
    source: { kind: "category", category: "Journey Builder" },
  },
  {
    slug: "automation-studio",
    title: "Automation Studio Academy",
    tagline: "Backend automation pipelines",
    icon: Workflow,
    accent: "var(--color-amber)",
    href: "/labs/automation-studio",
    total: 10,
    beginner: 5,
    intermediate: 3,
    advanced: 2,
    source: { kind: "category", category: "Automation Studio" },
  },
  {
    slug: "data-modeling",
    title: "Data Modeling Academy",
    tagline: "Data extensions & relationships",
    icon: Boxes,
    accent: "var(--color-green)",
    href: "/labs/sql",
    total: 8,
    beginner: 4,
    intermediate: 3,
    advanced: 1,
    source: { kind: "category", category: "SQL" },
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting Academy",
    tagline: "Read logs, find root cause",
    icon: Bug,
    accent: "var(--color-red)",
    href: "/labs/troubleshooting",
    total: 8,
    beginner: 3,
    intermediate: 3,
    advanced: 2,
    source: { kind: "category", category: "Troubleshooting" },
  },
];

export type Incident = {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium";
  system: string;
  summary: string;
};

export const criticalIncident: Incident = {
  id: "inc-204",
  title: "Journey Failure — Welcome Series Stalled",
  severity: "Critical",
  system: "Journey Builder",
  summary:
    "Contacts are entering the Welcome Series journey but never advancing past the first wait activity. 4,210 contacts stuck.",
};
