import { ampLessons } from "@/lib/ampscript-curriculum";
import { sqlLessons } from "@/lib/sql-curriculum";

// ---------------------------------------------------------------------------
// Persisted progress shape (localStorage). Everything the dashboard, progress
// page, academy and competency matrix display is DERIVED from this — no
// hardcoded numbers.
// ---------------------------------------------------------------------------
export type ProgressStore = {
  completedLessons: string[]; // lesson ids (amp-*, sql-*)
  viewedLessons: string[]; // lessons opened but not completed
  lessonScores: Record<string, number>; // lessonId -> best validation %
  challengeScores: Record<string, number>; // challengeId -> best %
  certAnswers: Record<string, { correct: boolean; choice: number }>;
  examBest: number; // best mock-exam %
  examAttempts: number;
  simRuns: { journey: number; automation: number };
  milestones: string[]; // 'jb-learn','jb-build','jb-sim','auto-learn','auto-sim','auto-fix'
  incidentsResolved: number;
  streak: number;
  lastActiveISO: string | null;
  xpHistory: { t: number; xp: number }[];
  activity: { id: string; text: string; type: "success" | "info" | "warning"; ts: number }[];
};

export const initialStore: ProgressStore = {
  completedLessons: [],
  viewedLessons: [],
  lessonScores: {},
  challengeScores: {},
  certAnswers: {},
  examBest: 0,
  examAttempts: 0,
  simRuns: { journey: 0, automation: 0 },
  milestones: [],
  incidentsResolved: 0,
  streak: 0,
  lastActiveISO: null,
  xpHistory: [],
  activity: [],
};

export type Category =
  | "AMPscript"
  | "SQL"
  | "Journey Builder"
  | "Automation Studio"
  | "Troubleshooting";

export type CompetencyStatus =
  | "Not Started"
  | "Learning"
  | "Practicing"
  | "Competent"
  | "Mastered";

export const competencyCategories: { category: Category; items: string[] }[] = [
  {
    category: "AMPscript",
    items: [
      "Variables",
      "AttributeValue",
      "Output with v()",
      "IF / ELSE",
      "EMPTY fallback",
      "Lookup",
      "LookupRows",
      "RowCount",
      "Dynamic Content",
      "Error Handling",
    ],
  },
  {
    category: "SQL",
    items: [
      "SELECT",
      "WHERE",
      "ORDER BY",
      "DISTINCT",
      "JOIN",
      "LEFT JOIN",
      "GROUP BY",
      "Aggregations",
      "Deduplication",
      "Date Filtering",
      "Subqueries",
    ],
  },
  {
    category: "Journey Builder",
    items: [
      "Contacts",
      "Entry Sources",
      "Send Email",
      "Wait Activities",
      "Decision Splits",
      "Engagement Splits",
      "Goals",
      "Exit Criteria",
      "Re-entry",
      "Suppression",
      "Troubleshooting",
    ],
  },
  {
    category: "Automation Studio",
    items: [
      "Import Activity",
      "Query Activity",
      "Filter Activity",
      "File Transfer",
      "Script Activity",
      "Scheduling",
      "Dependencies",
      "Run History",
      "Error Logs",
      "Failure Recovery",
    ],
  },
  {
    category: "Troubleshooting",
    items: [
      "Log Reading",
      "Root Cause Analysis",
      "Data Validation",
      "Journey Failure",
      "Automation Failure",
      "SQL Failure",
      "Send Failure",
      "Production Reasoning",
    ],
  },
];

// lesson id -> competency item (AMPscript + SQL are precisely mapped)
const ampCompetencyMap: Record<string, string> = {
  "amp-b1": "Variables",
  "amp-b2": "Variables",
  "amp-b3": "AttributeValue",
  "amp-b4": "Output with v()",
  "amp-b5": "IF / ELSE",
  "amp-b6": "EMPTY fallback",
  "amp-i1": "Lookup",
  "amp-i2": "LookupRows",
  "amp-i3": "RowCount",
  "amp-i4": "Dynamic Content",
  "amp-i5": "Dynamic Content",
  "amp-a1": "Dynamic Content",
  "amp-a2": "Error Handling",
  "amp-a3": "IF / ELSE",
  "amp-a4": "Error Handling",
  "amp-a5": "Error Handling",
};

const sqlCompetencyMap: Record<string, string> = {
  "sql-b0": "SELECT",
  "sql-b1": "SELECT",
  "sql-b2": "WHERE",
  "sql-b3": "ORDER BY",
  "sql-b4": "DISTINCT",
  "sql-b5": "Date Filtering",
  "sql-i1": "JOIN",
  "sql-i2": "LEFT JOIN",
  "sql-i3": "GROUP BY",
  "sql-i4": "Aggregations",
  "sql-i5": "Subqueries",
  "sql-a1": "Deduplication",
  "sql-a2": "Subqueries",
  "sql-a3": "Subqueries",
  "sql-a4": "Aggregations",
  "sql-a5": "WHERE",
};

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));

function fillToStatus(fill: number): CompetencyStatus {
  if (fill <= 0) return "Not Started";
  if (fill < 0.3) return "Learning";
  if (fill < 0.65) return "Practicing";
  if (fill < 1) return "Competent";
  return "Mastered";
}

// XP economy (mock)
export const XP = {
  cert: 10, // per correct answer
  sim: 35, // per simulation run
  incident: 90, // per resolved incident
  milestone: 60,
  challengeBonus: 140,
};

function lessonXp(id: string): number {
  const amp = ampLessons.find((l) => l.id === id);
  if (amp) return amp.xp;
  const sql = sqlLessons.find((l) => l.id === id);
  if (sql) return sql.xp;
  return 0;
}

export type CompetencyResult = {
  category: Category;
  item: string;
  status: CompetencyStatus;
  fill: number;
};

export type BadgeResult = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
};

export type Stats = {
  xp: number;
  readiness: number; // overall %
  categoryReadiness: Record<Category, number>;
  competencies: CompetencyResult[];
  badges: BadgeResult[];
  lessonsCompleted: number;
  ampLessonsDone: number;
  ampLessonsTotal: number;
  sqlLessonsDone: number;
  sqlLessonsTotal: number;
  certAnswered: number;
  certCorrect: number;
};

function mappedCompetencyFill(
  store: ProgressStore,
  item: string,
  map: Record<string, string>,
  track: "amp" | "sql"
): number {
  const related = Object.keys(map).filter((id) => map[id] === item);
  if (related.length === 0) return 0;
  const completed = related.filter((id) => store.completedLessons.includes(id));
  const viewed = related.some((id) => store.viewedLessons.includes(id));
  const masteredTrack = Object.entries(store.challengeScores).some(
    ([cid, score]) => cid.startsWith(track) && score >= 80
  );
  if (completed.length === 0) return viewed ? 0.2 : 0;
  if (completed.length < related.length) return 0.5;
  return masteredTrack ? 1 : 0.85;
}

function categoryProgress(store: ProgressStore, category: Category): number {
  const has = (m: string) => store.milestones.includes(m);
  if (category === "Journey Builder") {
    return clamp(
      0.25 * (has("jb-learn") ? 1 : 0) +
        0.25 * (has("jb-build") ? 1 : 0) +
        0.3 * (store.simRuns.journey >= 1 ? 1 : 0) +
        0.2 * clamp(store.simRuns.journey / 3)
    );
  }
  if (category === "Automation Studio") {
    return clamp(
      0.3 * (has("auto-learn") ? 1 : 0) +
        0.35 * (store.simRuns.automation >= 1 ? 1 : 0) +
        0.35 * (has("auto-fix") ? 1 : 0)
    );
  }
  if (category === "Troubleshooting") {
    return clamp(
      0.6 * clamp(store.incidentsResolved / 3) + 0.4 * (has("auto-fix") ? 1 : 0)
    );
  }
  return 0;
}

function distribute(p: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => clamp(p * n - i, 0, 1));
}

export function computeStats(store: ProgressStore): Stats {
  const competencies: CompetencyResult[] = [];
  const categoryReadiness = {} as Record<Category, number>;

  for (const group of competencyCategories) {
    let fills: number[];
    if (group.category === "AMPscript") {
      fills = group.items.map((item) =>
        mappedCompetencyFill(store, item, ampCompetencyMap, "amp")
      );
    } else if (group.category === "SQL") {
      fills = group.items.map((item) =>
        mappedCompetencyFill(store, item, sqlCompetencyMap, "sql")
      );
    } else {
      fills = distribute(categoryProgress(store, group.category), group.items.length);
    }
    group.items.forEach((item, i) => {
      competencies.push({
        category: group.category,
        item,
        fill: fills[i],
        status: fillToStatus(fills[i]),
      });
    });
    categoryReadiness[group.category] = Math.round(
      (fills.reduce((a, b) => a + b, 0) / fills.length) * 100
    );
  }

  const readiness = Math.round(
    competencies.reduce((a, c) => a + c.fill, 0) / competencies.length * 100
  );

  // XP
  const lessonXpTotal = store.completedLessons.reduce(
    (sum, id) => sum + lessonXp(id),
    0
  );
  const challengeXp =
    Object.values(store.challengeScores).filter((s) => s >= 80).length *
    XP.challengeBonus;
  const certCorrect = Object.values(store.certAnswers).filter(
    (a) => a.correct
  ).length;
  const certXp = certCorrect * XP.cert;
  const simXp = (store.simRuns.journey + store.simRuns.automation) * XP.sim;
  const incidentXp = store.incidentsResolved * XP.incident;
  const milestoneXp = store.milestones.length * XP.milestone;
  const xp =
    lessonXpTotal + challengeXp + certXp + simXp + incidentXp + milestoneXp;

  const ampLessonsDone = store.completedLessons.filter((id) =>
    id.startsWith("amp-")
  ).length;
  const sqlLessonsDone = store.completedLessons.filter((id) =>
    id.startsWith("sql-")
  ).length;
  const certAnswered = Object.keys(store.certAnswers).length;

  const sqlChallengeHits = Object.entries(store.challengeScores).filter(
    ([cid, s]) => cid.startsWith("sql") && s >= 90
  ).length;

  const badges: BadgeResult[] = [
    {
      id: "first-deploy",
      title: "First Deploy",
      description: "Complete your first mission",
      earned: store.completedLessons.length >= 1,
    },
    {
      id: "decision-split",
      title: "Decision Split Master",
      description: "Run 5 journey simulations",
      earned: store.simRuns.journey >= 5,
    },
    {
      id: "query-sniper",
      title: "Query Sniper",
      description: "Score 90+ on 3 SQL challenges",
      earned: sqlChallengeHits >= 3,
    },
    {
      id: "amp-architect",
      title: "AMPscript Architect",
      description: "Reach 90% AMPscript readiness",
      earned: categoryReadiness["AMPscript"] >= 90,
    },
    {
      id: "incident-commander",
      title: "Incident Commander",
      description: "Resolve 5 incidents",
      earned: store.incidentsResolved >= 5,
    },
    {
      id: "cert-ready",
      title: "Cert Ready",
      description: "Score 80%+ on a mock exam",
      earned: store.examBest >= 80,
    },
  ];

  return {
    xp,
    readiness,
    categoryReadiness,
    competencies,
    badges,
    lessonsCompleted: store.completedLessons.length,
    ampLessonsDone,
    ampLessonsTotal: ampLessons.length,
    sqlLessonsDone,
    sqlLessonsTotal: sqlLessons.length,
    certAnswered,
    certCorrect,
  };
}

export const statusTone: Record<
  CompetencyStatus,
  "neutral" | "blue" | "amber" | "green" | "violet"
> = {
  "Not Started": "neutral",
  Learning: "blue",
  Practicing: "amber",
  Competent: "green",
  Mastered: "violet",
};
