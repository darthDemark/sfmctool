import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Database,
  GitBranch,
  Workflow,
  Bug,
  LayoutDashboard,
  FlaskConical,
  Radio,
  MessageSquareCode,
  Award,
  TrendingUp,
} from "lucide-react";

export const user = {
  name: "Heron",
  role: "Marketing Automation Specialist",
  xp: 12430,
  operationalReadiness: 67,
  rank: "Operator II",
  streak: 14,
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
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

export type Skill = {
  name: string;
  value: number;
  color: string;
};

export const skills: Skill[] = [
  { name: "AMPscript", value: 83, color: "var(--color-electric)" },
  { name: "SQL", value: 71, color: "var(--color-cyan)" },
  { name: "Journeys", value: 92, color: "var(--color-violet)" },
  { name: "Automation", value: 56, color: "var(--color-amber)" },
  { name: "Debugging", value: 61, color: "var(--color-green)" },
];

export type Lab = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  missions: number;
  estMinutes: number;
  skills: string[];
  href: string;
};

export const labs: Lab[] = [
  {
    slug: "ampscript",
    title: "AMPscript Lab",
    tagline: "Personalization & dynamic content",
    description:
      "Practice personalization, dynamic content, and server-side logic against realistic data extensions.",
    icon: Code2,
    accent: "var(--color-electric)",
    difficulty: "Intermediate",
    missions: 12,
    estMinutes: 25,
    skills: ["AMPscript", "Personalization", "Content Blocks"],
    href: "/labs/ampscript",
  },
  {
    slug: "sql",
    title: "SQL Lab",
    tagline: "Segmentation & query logic",
    description:
      "Write segmentation queries against a simulated SFMC schema and get scored on correctness and efficiency.",
    icon: Database,
    accent: "var(--color-cyan)",
    difficulty: "Intermediate",
    missions: 14,
    estMinutes: 30,
    skills: ["SQL", "Segmentation", "Data Views"],
    href: "/labs/sql",
  },
  {
    slug: "journey-builder",
    title: "Journey Builder Lab",
    tagline: "Design & simulate journeys",
    description:
      "Build multi-step journeys on a live canvas, then simulate contact flow and inspect path counts.",
    icon: GitBranch,
    accent: "var(--color-violet)",
    difficulty: "Advanced",
    missions: 9,
    estMinutes: 40,
    skills: ["Journey Builder", "Decision Splits", "Wait Activities"],
    href: "/labs/journey-builder",
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
    missions: 8,
    estMinutes: 35,
    skills: ["Debugging", "Automation Studio", "Root Cause"],
    href: "/labs/troubleshooting",
  },
];

export const automationLab: Lab = {
  slug: "automation",
  title: "Automation Studio",
  tagline: "Schedules, file drops & SQL automations",
  description:
    "Wire up multi-step automations with SQL query activities, file transfers, and verification steps.",
  icon: Workflow,
  accent: "var(--color-amber)",
  difficulty: "Intermediate",
  missions: 10,
  estMinutes: 30,
  skills: ["Automation Studio", "Scheduling", "SSJS"],
  href: "/labs",
};

export type Mission = {
  id: string;
  code: string;
  title: string;
  lab: string;
  status: "completed" | "in-progress" | "locked";
  difficulty: string;
  xp: number;
};

export const missions: Mission[] = [
  {
    id: "m1",
    code: "Mission 01",
    title: "Welcome Email Personalization",
    lab: "AMPscript",
    status: "completed",
    difficulty: "Foundational",
    xp: 120,
  },
  {
    id: "m2",
    code: "Mission 02",
    title: "Loyalty Tier Lookup",
    lab: "AMPscript",
    status: "completed",
    difficulty: "Intermediate",
    xp: 180,
  },
  {
    id: "m3",
    code: "Mission 03",
    title: "Active Subscriber Segment",
    lab: "SQL",
    status: "completed",
    difficulty: "Intermediate",
    xp: 200,
  },
  {
    id: "m4",
    code: "Mission 04",
    title: "Win-Back Journey",
    lab: "Journey Builder",
    status: "completed",
    difficulty: "Advanced",
    xp: 260,
  },
  {
    id: "m5",
    code: "Mission 05",
    title: "Cart Recovery Dynamic Content",
    lab: "AMPscript",
    status: "in-progress",
    difficulty: "Advanced",
    xp: 300,
  },
  {
    id: "m6",
    code: "Mission 06",
    title: "RFM Scoring Query",
    lab: "SQL",
    status: "locked",
    difficulty: "Advanced",
    xp: 320,
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

export type Activity = {
  id: string;
  text: string;
  time: string;
  type: "success" | "info" | "warning";
};

export const recentActivity: Activity[] = [
  { id: "a1", text: "Completed Mission 04 — Win-Back Journey", time: "2h ago", type: "success" },
  { id: "a2", text: "Earned badge: Decision Split Master", time: "5h ago", type: "info" },
  { id: "a3", text: "Query scored 92% on Active Subscriber Segment", time: "1d ago", type: "success" },
  { id: "a4", text: "Incident INC-198 resolved in 6m 42s", time: "2d ago", type: "warning" },
];

export const xpHistory = [
  { week: "W1", xp: 1800 },
  { week: "W2", xp: 3200 },
  { week: "W3", xp: 4100 },
  { week: "W4", xp: 6400 },
  { week: "W5", xp: 8200 },
  { week: "W6", xp: 9800 },
  { week: "W7", xp: 11200 },
  { week: "W8", xp: 12430 },
];

export type Achievement = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
};

export const achievements: Achievement[] = [
  { id: "ac1", title: "First Deploy", description: "Complete your first mission", earned: true },
  { id: "ac2", title: "Decision Split Master", description: "Build 5 journeys with decision splits", earned: true },
  { id: "ac3", title: "Query Sniper", description: "Score 90%+ on 3 SQL missions", earned: true },
  { id: "ac4", title: "Incident Commander", description: "Resolve 5 critical incidents", earned: false },
  { id: "ac5", title: "AMPscript Architect", description: "Reach 90% AMPscript readiness", earned: false },
  { id: "ac6", title: "Cert Ready", description: "Pass all certification practice exams", earned: false },
];
