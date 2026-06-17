export type Column = { name: string; type: string; key?: boolean };
export type Table = { name: string; columns: Column[] };

export const schema: Table[] = [
  {
    name: "Subscribers",
    columns: [
      { name: "SubscriberKey", type: "Text", key: true },
      { name: "FirstName", type: "Text" },
      { name: "Email", type: "EmailAddress" },
      { name: "LoyaltyTier", type: "Text" },
      { name: "Status", type: "Text" },
    ],
  },
  {
    name: "Orders",
    columns: [
      { name: "OrderId", type: "Number", key: true },
      { name: "SubscriberKey", type: "Text" },
      { name: "OrderTotal", type: "Decimal" },
      { name: "OrderDate", type: "Date" },
    ],
  },
  {
    name: "_Sent",
    columns: [
      { name: "SubscriberKey", type: "Text" },
      { name: "JobID", type: "Number" },
      { name: "EventDate", type: "Date" },
    ],
  },
  {
    name: "_Open",
    columns: [
      { name: "SubscriberKey", type: "Text" },
      { name: "JobID", type: "Number" },
      { name: "EventDate", type: "Date" },
    ],
  },
];

export const expectedColumns = [
  "SubscriberKey",
  "FirstName",
  "LoyaltyTier",
  "TotalSpend",
];

export const expectedRows: (string | number)[][] = [
  ["SK-10293", "John", "Gold", "$1,420.50"],
  ["SK-44820", "Amara", "Gold", "$1,180.00"],
  ["SK-77310", "Diego", "Gold", "$1,002.75"],
  ["SK-22014", "Priya", "Gold", "$988.20"],
  ["SK-65509", "Liam", "Gold", "$910.40"],
];

export type QueryScore = {
  rows: (string | number)[][];
  columns: string[];
  rowCount: number;
  ms: number;
  score: number;
  checks: { label: string; passed: boolean }[];
};

export function runQuery(sql: string): QueryScore {
  const q = sql.toLowerCase();
  const checks = [
    { label: "Selects from Subscribers", passed: /from\s+subscribers/.test(q) },
    { label: "Joins Orders", passed: /join\s+orders/.test(q) },
    {
      label: "Aggregates spend (SUM)",
      passed: /sum\s*\(/.test(q) && /ordertotal/.test(q),
    },
    { label: "Filters Gold tier", passed: /loyaltytier/.test(q) && /gold/.test(q) },
    { label: "Groups by subscriber", passed: /group\s+by/.test(q) },
    { label: "Orders results", passed: /order\s+by/.test(q) },
  ];
  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);

  return {
    rows: expectedRows,
    columns: expectedColumns,
    rowCount: expectedRows.length,
    ms: 38 + Math.round(Math.random() * 22),
    score,
    checks,
  };
}
