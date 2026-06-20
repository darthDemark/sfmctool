import type { CurriculumLevel } from "@/components/labs/curriculum-panel";
import type { Note } from "@/components/labs/architect-notes";
import type { Table } from "@/lib/sql-data";

export type SqlCheck = {
  label: string;
  hint?: string;
  test: (q: string) => boolean;
};

export type SqlLesson = {
  id: string;
  level: CurriculumLevel;
  title: string;
  xp: number;
  concept: string;
  task: string[];
  starter: string;
  schema: Table[];
  checks: SqlCheck[];
  expectedColumns: string[];
  expectedRows: (string | number)[][];
  notes: Note[];
};

// --- Mock Data Extension catalog (referenced by lessons) ---
const T = {
  subscribers: {
    name: "Subscribers",
    columns: [
      { name: "SubscriberKey", type: "Text", key: true },
      { name: "FirstName", type: "Text" },
      { name: "Email", type: "EmailAddress" },
      { name: "LoyaltyTier", type: "Text" },
      { name: "Status", type: "Text" },
      { name: "JoinDate", type: "Date" },
    ],
  },
  orders: {
    name: "Orders",
    columns: [
      { name: "OrderId", type: "Number", key: true },
      { name: "SubscriberKey", type: "Text" },
      { name: "OrderTotal", type: "Decimal" },
      { name: "OrderDate", type: "Date" },
    ],
  },
  sent: {
    name: "_Sent",
    columns: [
      { name: "SubscriberKey", type: "Text" },
      { name: "JobID", type: "Number" },
      { name: "EventDate", type: "Date" },
    ],
  },
  open: {
    name: "_Open",
    columns: [
      { name: "SubscriberKey", type: "Text" },
      { name: "JobID", type: "Number" },
      { name: "EventDate", type: "Date" },
    ],
  },
  click: {
    name: "_Click",
    columns: [
      { name: "SubscriberKey", type: "Text" },
      { name: "JobID", type: "Number" },
      { name: "URL", type: "Text" },
      { name: "EventDate", type: "Date" },
    ],
  },
} satisfies Record<string, Table>;

const has = (q: string, re: RegExp) => re.test(q);

export const sqlLessons: SqlLesson[] = [
  // ----------------------------- BEGINNER -----------------------------
  {
    id: "sql-b1",
    level: "Beginner",
    title: "SELECT basics",
    xp: 90,
    concept:
      "SELECT chooses which columns to return; FROM names the Data Extension. In SFMC you query DEs and system Data Views with standard SQL inside Automation Studio. Start by listing the columns you actually need.",
    task: [
      "Return FirstName and Email for every subscriber.",
      "Select only those two columns from the Subscribers DE.",
    ],
    starter: `SELECT
    FirstName,
    Email
FROM Subscribers`,
    schema: [T.subscribers],
    checks: [
      { label: "Uses SELECT", test: (q) => has(q, /\bselect\b/) },
      {
        label: "Reads from Subscribers",
        hint: "FROM Subscribers",
        test: (q) => has(q, /from\s+subscribers/),
      },
      {
        label: "Returns FirstName and Email",
        test: (q) => has(q, /firstname/) && has(q, /email/),
      },
    ],
    expectedColumns: ["FirstName", "Email"],
    expectedRows: [
      ["Maya", "maya.lin@example.com"],
      ["Diego", "diego.ramos@example.com"],
      ["Priya", "priya.shah@example.com"],
      ["Liam", "liam.ok@example.com"],
    ],
    notes: [
      {
        tone: "info",
        text: "Naming columns explicitly (instead of SELECT *) keeps query activities fast and your sends predictable when a DE schema changes.",
      },
    ],
  },
  {
    id: "sql-b2",
    level: "Beginner",
    title: "WHERE filters",
    xp: 100,
    concept:
      "WHERE narrows rows to those matching a condition. This is the foundation of segmentation — 'active subscribers', 'Gold tier', 'spent over $100'. Text values go in single quotes.",
    task: [
      "Return active subscribers only.",
      "Filter where Status = 'Active'.",
    ],
    starter: `SELECT
    SubscriberKey,
    FirstName,
    Status
FROM Subscribers
WHERE Status = 'Active'`,
    schema: [T.subscribers],
    checks: [
      { label: "Reads from Subscribers", test: (q) => has(q, /from\s+subscribers/) },
      { label: "Uses a WHERE clause", test: (q) => has(q, /\bwhere\b/) },
      {
        label: "Filters Status = 'Active'",
        hint: "WHERE Status = 'Active'",
        test: (q) => has(q, /status\s*=\s*'active'/),
      },
    ],
    expectedColumns: ["SubscriberKey", "FirstName", "Status"],
    expectedRows: [
      ["SK-10293", "Maya", "Active"],
      ["SK-77310", "Diego", "Active"],
      ["SK-22014", "Priya", "Active"],
    ],
    notes: [
      {
        tone: "warning",
        text: "Filtering on un-indexed text columns over millions of rows is slow. Where possible, filter on keys or pre-flagged status fields.",
      },
    ],
  },
  {
    id: "sql-b3",
    level: "Beginner",
    title: "ORDER BY",
    xp: 100,
    concept:
      "ORDER BY sorts your result set. ASC is ascending (default), DESC descending. Sorting matters when you take a 'top N' segment or rank subscribers by recency or value.",
    task: [
      "Return subscribers sorted by JoinDate, newest first.",
      "Use ORDER BY ... DESC.",
    ],
    starter: `SELECT
    FirstName,
    JoinDate
FROM Subscribers
ORDER BY JoinDate DESC`,
    schema: [T.subscribers],
    checks: [
      { label: "Reads from Subscribers", test: (q) => has(q, /from\s+subscribers/) },
      { label: "Uses ORDER BY", test: (q) => has(q, /order\s+by/) },
      {
        label: "Sorts descending (DESC)",
        hint: "ORDER BY JoinDate DESC",
        test: (q) => has(q, /order\s+by[\s\S]*desc/),
      },
    ],
    expectedColumns: ["FirstName", "JoinDate"],
    expectedRows: [
      ["Liam", "2026-05-30"],
      ["Priya", "2026-03-12"],
      ["Diego", "2026-02-04"],
      ["Maya", "2025-11-21"],
    ],
    notes: [
      {
        tone: "info",
        text: "ORDER BY combined with TOP/ROW_NUMBER is how you build 'most recent purchase' or 'highest spender' segments.",
      },
    ],
  },
  {
    id: "sql-b4",
    level: "Beginner",
    title: "DISTINCT",
    xp: 110,
    concept:
      "DISTINCT removes duplicate rows from a result. Use it to answer 'what are the unique values?' — e.g., which loyalty tiers exist, or which unique subscribers opened an email.",
    task: [
      "Return the unique list of loyalty tiers.",
      "Use SELECT DISTINCT on LoyaltyTier.",
    ],
    starter: `SELECT DISTINCT
    LoyaltyTier
FROM Subscribers`,
    schema: [T.subscribers],
    checks: [
      {
        label: "Uses SELECT DISTINCT",
        hint: "SELECT DISTINCT LoyaltyTier",
        test: (q) => has(q, /select\s+distinct/),
      },
      { label: "Reads LoyaltyTier", test: (q) => has(q, /loyaltytier/) },
    ],
    expectedColumns: ["LoyaltyTier"],
    expectedRows: [["Gold"], ["Silver"], ["Bronze"]],
    notes: [
      {
        tone: "warning",
        text: "DISTINCT can hide data problems. If you expected 3 tiers and see 5, you may have 'gold' vs 'Gold' casing issues to clean up first.",
      },
    ],
  },
  {
    id: "sql-b5",
    level: "Beginner",
    title: "Date filtering",
    xp: 120,
    concept:
      "Date filters power recency segments: 'joined this year', 'purchased in the last 30 days'. Compare a date column against a literal date, or use GETDATE()/DATEADD for rolling windows.",
    task: [
      "Return subscribers who joined on or after 2026-01-01.",
      "Filter JoinDate >= '2026-01-01'.",
    ],
    starter: `SELECT
    FirstName,
    JoinDate
FROM Subscribers
WHERE JoinDate >= '2026-01-01'`,
    schema: [T.subscribers],
    checks: [
      { label: "Uses a WHERE clause", test: (q) => has(q, /\bwhere\b/) },
      { label: "Filters on JoinDate", test: (q) => has(q, /joindate/) },
      {
        label: "Uses a date comparison",
        hint: "WHERE JoinDate >= '2026-01-01'",
        test: (q) => has(q, /joindate\s*(>=|>|between)/),
      },
    ],
    expectedColumns: ["FirstName", "JoinDate"],
    expectedRows: [
      ["Liam", "2026-05-30"],
      ["Priya", "2026-03-12"],
      ["Diego", "2026-02-04"],
    ],
    notes: [
      {
        tone: "info",
        text: "For rolling windows, prefer DATEADD(DAY, -30, GETDATE()) over hard-coded dates so the segment stays correct every day it runs.",
      },
    ],
  },

  // --------------------------- INTERMEDIATE ---------------------------
  {
    id: "sql-i1",
    level: "Intermediate",
    title: "INNER JOIN",
    xp: 160,
    concept:
      "JOIN combines rows from two DEs on a shared key. An INNER JOIN keeps only rows that match in BOTH tables. Join Subscribers to Orders on SubscriberKey to see who purchased.",
    task: [
      "Join Subscribers to Orders on SubscriberKey.",
      "Return the subscriber name and each order total.",
    ],
    starter: `SELECT
    s.FirstName,
    o.OrderId,
    o.OrderTotal
FROM Subscribers s
JOIN Orders o
    ON o.SubscriberKey = s.SubscriberKey`,
    schema: [T.subscribers, T.orders],
    checks: [
      { label: "Reads from Subscribers", test: (q) => has(q, /from\s+subscribers/) },
      {
        label: "Joins Orders",
        hint: "JOIN Orders o ON ...",
        test: (q) => has(q, /join\s+orders/),
      },
      {
        label: "Joins on SubscriberKey",
        test: (q) => has(q, /on\s+[\s\S]*subscriberkey\s*=\s*[\s\S]*subscriberkey/),
      },
    ],
    expectedColumns: ["FirstName", "OrderId", "OrderTotal"],
    expectedRows: [
      ["Maya", "O-5521", "$168.00"],
      ["Maya", "O-4410", "$92.00"],
      ["Diego", "O-5310", "$54.00"],
      ["Priya", "O-5009", "$220.00"],
    ],
    notes: [
      {
        tone: "warning",
        text: "An INNER JOIN silently drops subscribers with no orders. That's correct here ('who purchased') but a common segmentation bug elsewhere.",
      },
    ],
  },
  {
    id: "sql-i2",
    level: "Intermediate",
    title: "LEFT JOIN",
    xp: 170,
    concept:
      "A LEFT JOIN keeps every row from the left table and fills NULLs where the right table has no match. This is how you find subscribers who have NOT done something — e.g., never ordered.",
    task: [
      "LEFT JOIN Orders so subscribers with no orders still appear.",
      "Return the subscriber and their OrderId (NULL when none).",
    ],
    starter: `SELECT
    s.FirstName,
    o.OrderId
FROM Subscribers s
LEFT JOIN Orders o
    ON o.SubscriberKey = s.SubscriberKey`,
    schema: [T.subscribers, T.orders],
    checks: [
      {
        label: "Uses a LEFT JOIN",
        hint: "LEFT JOIN Orders o ON ...",
        test: (q) => has(q, /left\s+join\s+orders/),
      },
      { label: "Joins on SubscriberKey", test: (q) => has(q, /subscriberkey/) },
    ],
    expectedColumns: ["FirstName", "OrderId"],
    expectedRows: [
      ["Maya", "O-5521"],
      ["Diego", "O-5310"],
      ["Priya", "O-5009"],
      ["Liam", "NULL"],
    ],
    notes: [
      {
        tone: "info",
        text: "LEFT JOIN + WHERE right.key IS NULL is the canonical 'anti-join' pattern for win-back and never-purchased segments.",
      },
    ],
  },
  {
    id: "sql-i3",
    level: "Intermediate",
    title: "GROUP BY",
    xp: 180,
    concept:
      "GROUP BY collapses rows into groups so you can summarize them. 'How many subscribers per tier?' groups by LoyaltyTier. Every non-aggregated column in SELECT must appear in GROUP BY.",
    task: [
      "Count subscribers per loyalty tier.",
      "GROUP BY LoyaltyTier and return the count.",
    ],
    starter: `SELECT
    LoyaltyTier,
    COUNT(*) AS Members
FROM Subscribers
GROUP BY LoyaltyTier`,
    schema: [T.subscribers],
    checks: [
      { label: "Uses GROUP BY", test: (q) => has(q, /group\s+by/) },
      { label: "Groups by LoyaltyTier", test: (q) => has(q, /group\s+by\s+loyaltytier/) },
      { label: "Uses an aggregate (COUNT)", test: (q) => has(q, /count\s*\(/) },
    ],
    expectedColumns: ["LoyaltyTier", "Members"],
    expectedRows: [
      ["Gold", 2],
      ["Silver", 1],
      ["Bronze", 1],
    ],
    notes: [
      {
        tone: "warning",
        text: "Forgetting to add a SELECTed column to GROUP BY is the most common SQL error new SFMC operators hit. The engine will reject the query.",
      },
    ],
  },
  {
    id: "sql-i4",
    level: "Intermediate",
    title: "COUNT / SUM",
    xp: 190,
    concept:
      "Aggregate functions turn many rows into one number. COUNT(*) counts rows, SUM() totals a column, AVG() averages it. Combined with GROUP BY they produce per-segment metrics like lifetime spend.",
    task: [
      "Total each subscriber's spend across all orders.",
      "SUM(OrderTotal) grouped by subscriber.",
    ],
    starter: `SELECT
    s.FirstName,
    SUM(o.OrderTotal) AS TotalSpend
FROM Subscribers s
JOIN Orders o
    ON o.SubscriberKey = s.SubscriberKey
GROUP BY s.FirstName`,
    schema: [T.subscribers, T.orders],
    checks: [
      { label: "Uses SUM()", test: (q) => has(q, /sum\s*\(/) },
      { label: "Sums OrderTotal", test: (q) => has(q, /sum\s*\(\s*[\w.]*ordertotal/) },
      { label: "Groups results", test: (q) => has(q, /group\s+by/) },
    ],
    expectedColumns: ["FirstName", "TotalSpend"],
    expectedRows: [
      ["Priya", "$220.00"],
      ["Maya", "$260.00"],
      ["Diego", "$54.00"],
    ],
    notes: [
      {
        tone: "info",
        text: "SUM + GROUP BY at the subscriber grain is the backbone of every RFM, lifetime-value, and tiering model you'll build.",
      },
    ],
  },
  {
    id: "sql-i5",
    level: "Intermediate",
    title: "Exclusions",
    xp: 200,
    concept:
      "Exclusion segments answer 'who did NOT do X?'. Use NOT IN (a subquery) or a LEFT JOIN ... IS NULL anti-join. Example: subscribers who were sent an email but never opened it.",
    task: [
      "Find subscribers who are NOT in the _Open Data View.",
      "Use NOT IN with a subquery on _Open.",
    ],
    starter: `SELECT
    s.SubscriberKey,
    s.FirstName
FROM Subscribers s
WHERE s.SubscriberKey NOT IN (
    SELECT SubscriberKey FROM _Open
)`,
    schema: [T.subscribers, T.open],
    checks: [
      {
        label: "Uses NOT IN (or anti-join)",
        hint: "WHERE SubscriberKey NOT IN (SELECT ...)",
        test: (q) => has(q, /not\s+in/) || has(q, /is\s+null/),
      },
      { label: "References the _Open Data View", test: (q) => has(q, /_open/) },
      { label: "Uses a subquery", test: (q) => (q.match(/select/g) || []).length >= 2 },
    ],
    expectedColumns: ["SubscriberKey", "FirstName"],
    expectedRows: [
      ["SK-22014", "Priya"],
      ["SK-99001", "Liam"],
    ],
    notes: [
      {
        tone: "warning",
        text: "NOT IN behaves unexpectedly if the subquery returns any NULLs. For large data, the LEFT JOIN ... IS NULL anti-join is usually safer and faster.",
      },
    ],
  },

  // ----------------------------- ADVANCED -----------------------------
  {
    id: "sql-a1",
    level: "Advanced",
    title: "Deduplication with ROW_NUMBER",
    xp: 250,
    concept:
      "Duplicate rows wreck sends. ROW_NUMBER() OVER (PARTITION BY key ORDER BY date DESC) numbers rows within each group so you can keep only row #1 — the latest record per subscriber.",
    task: [
      "Rank each subscriber's orders newest-first with ROW_NUMBER().",
      "PARTITION BY SubscriberKey ORDER BY OrderDate DESC.",
    ],
    starter: `SELECT
    SubscriberKey,
    OrderId,
    OrderDate,
    ROW_NUMBER() OVER (
        PARTITION BY SubscriberKey
        ORDER BY OrderDate DESC
    ) AS rn
FROM Orders`,
    schema: [T.orders],
    checks: [
      { label: "Uses ROW_NUMBER()", test: (q) => has(q, /row_number\s*\(\s*\)/) },
      {
        label: "Partitions by SubscriberKey",
        hint: "PARTITION BY SubscriberKey",
        test: (q) => has(q, /partition\s+by\s+subscriberkey/),
      },
      { label: "Orders within the window", test: (q) => has(q, /over\s*\([\s\S]*order\s+by/) },
    ],
    expectedColumns: ["SubscriberKey", "OrderId", "OrderDate", "rn"],
    expectedRows: [
      ["SK-10293", "O-5521", "2026-06-01", 1],
      ["SK-10293", "O-4410", "2026-04-18", 2],
      ["SK-77310", "O-5310", "2026-05-09", 1],
      ["SK-22014", "O-5009", "2026-05-22", 1],
    ],
    notes: [
      {
        tone: "success",
        text: "Wrap this in a subquery and filter WHERE rn = 1 to get exactly one latest row per subscriber — the standard SFMC dedupe pattern.",
      },
    ],
  },
  {
    id: "sql-a2",
    level: "Advanced",
    title: "Subqueries",
    xp: 250,
    concept:
      "A subquery is a query inside a query. Use it to filter against a computed set ('subscribers whose spend is above average') or to dedupe by selecting from a ranked inner query.",
    task: [
      "Return only the latest order per subscriber.",
      "Select from the ROW_NUMBER subquery WHERE rn = 1.",
    ],
    starter: `SELECT SubscriberKey, OrderId, OrderDate
FROM (
    SELECT
        SubscriberKey,
        OrderId,
        OrderDate,
        ROW_NUMBER() OVER (
            PARTITION BY SubscriberKey
            ORDER BY OrderDate DESC
        ) AS rn
    FROM Orders
) ranked
WHERE rn = 1`,
    schema: [T.orders],
    checks: [
      { label: "Uses a nested subquery", test: (q) => (q.match(/select/g) || []).length >= 2 },
      { label: "Filters the ranked set (rn = 1)", test: (q) => has(q, /rn\s*=\s*1/) },
      { label: "Uses ROW_NUMBER inside", test: (q) => has(q, /row_number/) },
    ],
    expectedColumns: ["SubscriberKey", "OrderId", "OrderDate"],
    expectedRows: [
      ["SK-10293", "O-5521", "2026-06-01"],
      ["SK-77310", "O-5310", "2026-05-09"],
      ["SK-22014", "O-5009", "2026-05-22"],
    ],
    notes: [
      {
        tone: "info",
        text: "Derived tables (subqueries in FROM) are evaluated once. For repeated use, a CTE (WITH ranked AS ...) reads more cleanly.",
      },
    ],
  },
  {
    id: "sql-a3",
    level: "Advanced",
    title: "Engagement segmentation",
    xp: 260,
    concept:
      "Engagement segments combine tracking Data Views. 'Opened but did not click' joins _Open and excludes _Click. These segments drive re-engagement and channel-fatigue suppression.",
    task: [
      "Find subscribers who opened (in _Open) but did NOT click (not in _Click).",
      "Join _Open and exclude _Click.",
    ],
    starter: `SELECT DISTINCT
    o.SubscriberKey
FROM _Open o
WHERE o.SubscriberKey NOT IN (
    SELECT SubscriberKey FROM _Click
)`,
    schema: [T.open, T.click],
    checks: [
      { label: "References _Open", test: (q) => has(q, /_open/) },
      { label: "Excludes _Click", test: (q) => has(q, /_click/) },
      {
        label: "Uses an exclusion (NOT IN / IS NULL)",
        test: (q) => has(q, /not\s+in/) || has(q, /is\s+null/),
      },
    ],
    expectedColumns: ["SubscriberKey"],
    expectedRows: [["SK-10293"], ["SK-77310"]],
    notes: [
      {
        tone: "warning",
        text: "Tracking Data Views are append-only and can be huge. Always filter by JobID or date window before joining them, or the query activity will time out.",
      },
    ],
  },
  {
    id: "sql-a4",
    level: "Advanced",
    title: "Purchase behavior segmentation",
    xp: 270,
    concept:
      "HAVING filters AFTER aggregation (WHERE filters before). 'High-value customers' = subscribers whose SUM(spend) exceeds a threshold. This is HAVING's signature use case.",
    task: [
      "Return subscribers whose total spend is over $150.",
      "GROUP BY subscriber and filter with HAVING SUM(...) > 150.",
    ],
    starter: `SELECT
    s.FirstName,
    SUM(o.OrderTotal) AS TotalSpend
FROM Subscribers s
JOIN Orders o
    ON o.SubscriberKey = s.SubscriberKey
GROUP BY s.FirstName
HAVING SUM(o.OrderTotal) > 150`,
    schema: [T.subscribers, T.orders],
    checks: [
      { label: "Groups by subscriber", test: (q) => has(q, /group\s+by/) },
      {
        label: "Uses HAVING to filter aggregates",
        hint: "HAVING SUM(o.OrderTotal) > 150",
        test: (q) => has(q, /having/),
      },
      { label: "Filters on summed spend > 150", test: (q) => has(q, /having[\s\S]*sum[\s\S]*>\s*150/) },
    ],
    expectedColumns: ["FirstName", "TotalSpend"],
    expectedRows: [
      ["Maya", "$260.00"],
      ["Priya", "$220.00"],
    ],
    notes: [
      {
        tone: "info",
        text: "Remember the order: WHERE filters rows, GROUP BY aggregates, HAVING filters the aggregates. Putting SUM() in WHERE is a classic mistake.",
      },
    ],
  },
  {
    id: "sql-a5",
    level: "Advanced",
    title: "Query performance",
    xp: 290,
    concept:
      "Query activities have runtime limits. Performance = select only needed columns (never SELECT *), filter early with WHERE, join on indexed keys, and avoid functions on filtered columns. Production discipline.",
    task: [
      "Rewrite for performance: name explicit columns (no SELECT *), and filter early with WHERE.",
      "Return active Gold subscribers' key and email.",
    ],
    starter: `SELECT
    SubscriberKey,
    Email
FROM Subscribers
WHERE Status = 'Active'
    AND LoyaltyTier = 'Gold'`,
    schema: [T.subscribers],
    checks: [
      {
        label: "Avoids SELECT * (names columns)",
        hint: "List columns explicitly instead of *",
        test: (q) => !has(q, /select\s+\*/),
      },
      { label: "Filters early with WHERE", test: (q) => has(q, /\bwhere\b/) },
      {
        label: "Targets active Gold subscribers",
        test: (q) => has(q, /status\s*=\s*'active'/) && has(q, /gold/),
      },
    ],
    expectedColumns: ["SubscriberKey", "Email"],
    expectedRows: [["SK-10293", "maya.lin@example.com"]],
    notes: [
      {
        tone: "success",
        text: "Explicit columns + early filtering is 80% of SFMC query performance. The other 20% is joining on keys and pre-staging heavy tracking joins.",
      },
      {
        tone: "warning",
        text: "Wrapping a filtered column in a function (e.g. WHERE YEAR(JoinDate) = 2026) defeats indexing. Compare against a date range instead.",
      },
    ],
  },
];

export type SqlRunResult = {
  rows: (string | number)[][];
  columns: string[];
  rowCount: number;
  ms: number;
  score: number;
  matchesExpected: boolean;
  checks: { label: string; passed: boolean; hint?: string }[];
};

export function runSqlLesson(lesson: SqlLesson, query: string): SqlRunResult {
  const q = query.toLowerCase();
  const checks = lesson.checks.map((c) => ({
    label: c.label,
    hint: c.hint,
    passed: c.test(q),
  }));
  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  const matchesExpected = passed === checks.length;

  return {
    columns: lesson.expectedColumns,
    rows: matchesExpected ? lesson.expectedRows : [],
    rowCount: matchesExpected ? lesson.expectedRows.length : 0,
    ms: 18 + (query.trim().length % 42),
    score,
    matchesExpected,
    checks,
  };
}
