import type { LogLine } from "@/components/labs/simulation-logs";

export type ConceptCard = {
  name: string;
  plain: string;
  example: string;
  mistake: string;
  why: string;
};

export const autoConcepts: ConceptCard[] = [
  {
    name: "What is Automation Studio?",
    plain:
      "Automation Studio automates backend processes in Marketing Cloud — import, transform, update, schedule, send, and verify. It is the engine room behind your sends.",
    example:
      "A nightly automation imports a CSV, queries active customers, updates a DE, and sends a summary email.",
    mistake: "Treating it like a send tool instead of a data pipeline.",
    why: "Most production work is data plumbing. If the automation breaks, the send is wrong or never happens.",
  },
  {
    name: "Import Activity",
    plain: "Loads an external file (CSV) into a Data Extension.",
    example: "Import Customers.csv into a staging DE every morning.",
    mistake: "Column headers in the file not matching the DE field names.",
    why: "A column mismatch silently imports nulls or fails the whole run.",
  },
  {
    name: "Query Activity",
    plain: "Runs SQL against DEs/Data Views and writes results to a target DE.",
    example: "SELECT active customers and write them to Active_Customers_DE.",
    mistake: "Pointing at the wrong target DE or returning zero rows.",
    why: "The query output is the audience. Wrong query, wrong people.",
  },
  {
    name: "Filter Activity",
    plain: "Applies a saved filter to a DE to produce a filtered DE.",
    example: "Filter subscribers to Status = Active without writing SQL.",
    mistake: "Using a stale filter definition after the schema changed.",
    why: "Filters are reusable, but drift quietly when fields are renamed.",
  },
  {
    name: "File Transfer Activity",
    plain: "Moves files between the Safehouse and an SFTP location.",
    example: "Pick up a partner file from SFTP before the Import step.",
    mistake: "Running Import before the file has actually landed.",
    why: "Order matters — a missing file makes every later step fail.",
  },
  {
    name: "Script Activity",
    plain: "Runs server-side JavaScript (SSJS) for custom logic.",
    example: "Call an API or transform data the query activity can't.",
    mistake: "Putting heavy logic in SSJS that a SQL query could do faster.",
    why: "Powerful but slow and hard to debug — use it sparingly.",
  },
  {
    name: "Send Email Activity",
    plain: "Sends an email to a sendable Data Extension from the automation.",
    example: "Send the Daily Summary email to Active_Customers_DE.",
    mistake: "Target DE is not marked sendable, so the send fails.",
    why: "This is the payoff step. A non-sendable DE blocks the entire outcome.",
  },
  {
    name: "Verification Activity",
    plain: "Checks row counts/thresholds and can stop the automation if wrong.",
    example: "Stop the run if the query returned 0 rows.",
    mistake: "Skipping verification and sending to an empty or huge audience.",
    why: "Verification is your seatbelt — it prevents bad sends from going out.",
  },
  {
    name: "Schedule",
    plain: "Controls when and how often an automation runs.",
    example: "Run daily at 02:00, or trigger on a file drop.",
    mistake: "Timezone misconfiguration so it runs at the wrong hour.",
    why: "A misconfigured schedule means stale data or missed SLAs.",
  },
  {
    name: "Run History",
    plain: "A log of every automation run with status and timing.",
    example: "Confirm last night's run completed and how long each step took.",
    mistake: "Not checking run history after a complaint about a missing send.",
    why: "It's the first place a pro looks when something 'didn't send'.",
  },
  {
    name: "Error Logs",
    plain: "Per-activity messages explaining why a step failed.",
    example: "'Target DE not sendable' on the Send Email step.",
    mistake: "Assuming a green automation status means business success.",
    why: "Status covers execution, not outcome — read the logs to be sure.",
  },
];

export type AutoStepKind =
  | "import"
  | "query"
  | "filter"
  | "update"
  | "send"
  | "transfer"
  | "script"
  | "verify";

export type AutoStep = {
  id: string;
  kind: AutoStepKind;
  label: string;
  sub: string;
  logs: LogLine[];
};

// Default exercise: Daily Customer Import and Email Send
export const pipeline: AutoStep[] = [
  {
    id: "import",
    kind: "import",
    label: "Import File",
    sub: "Customers.csv → Staging_DE",
    logs: [
      { time: "02:00", level: "INFO", message: "Import started" },
      { time: "02:01", level: "OK", message: "4,210 rows imported" },
    ],
  },
  {
    id: "query",
    kind: "query",
    label: "Query Activity",
    sub: "Active Customers",
    logs: [
      { time: "02:02", level: "INFO", message: "Query Activity started" },
      { time: "02:03", level: "OK", message: "4,103 rows returned" },
    ],
  },
  {
    id: "update",
    kind: "update",
    label: "Update Data Extension",
    sub: "Active_Customers_DE",
    logs: [
      { time: "02:04", level: "OK", message: "Active_Customers_DE updated" },
    ],
  },
  {
    id: "send",
    kind: "send",
    label: "Send Email",
    sub: "Daily Summary",
    logs: [{ time: "02:05", level: "OK", message: "Send completed" }],
  },
];

export const palette: { kind: AutoStepKind; label: string }[] = [
  { kind: "transfer", label: "File Transfer" },
  { kind: "import", label: "Import File" },
  { kind: "query", label: "Query Activity" },
  { kind: "filter", label: "Filter Activity" },
  { kind: "update", label: "Update Data Extension" },
  { kind: "script", label: "Script Activity" },
  { kind: "verify", label: "Verification Step" },
  { kind: "send", label: "Send Email" },
];

export type AutoNodeGuide = {
  title: string;
  what: string;
  settings: string[];
  beginner: string;
  mistake: string;
  simEffect: string;
};

export const autoNodeGuides: Record<AutoStepKind, AutoNodeGuide> = {
  import: {
    title: "Import File Activity",
    what: "Loads Customers.csv into a staging Data Extension.",
    settings: ["Source file & location", "Field mapping", "Overwrite vs append"],
    beginner: "This is where external data enters Marketing Cloud.",
    mistake: "CSV column names not matching the DE fields.",
    simEffect: "Brings in 4,210 rows. A mismatch here fails every later step.",
  },
  query: {
    title: "Query Activity",
    what: "Runs SQL to select the active-customer audience.",
    settings: ["SQL statement", "Target DE", "Update type (overwrite/append)"],
    beginner: "Shapes who the email will actually go to.",
    mistake: "Returning zero rows, or writing to the wrong target DE.",
    simEffect: "Returns 4,103 active customers from the 4,210 imported.",
  },
  filter: {
    title: "Filter Activity",
    what: "Applies a saved filter without writing SQL.",
    settings: ["Filter definition", "Source DE", "Result DE"],
    beginner: "A no-code alternative to a simple query.",
    mistake: "Using a filter that drifted after a field rename.",
    simEffect: "Not used in this pipeline — the Query Activity covers it.",
  },
  update: {
    title: "Update Data Extension",
    what: "Writes the query result into Active_Customers_DE.",
    settings: ["Target DE", "Primary key", "Sendable relationship"],
    beginner: "Refreshes the audience list the send will use.",
    mistake: "Target DE not marked sendable, which blocks the send.",
    simEffect: "Updates the sendable DE with 4,103 rows.",
  },
  send: {
    title: "Send Email Activity",
    what: "Sends the Daily Summary email to the updated audience.",
    settings: ["Email asset", "Sendable DE", "Send classification", "Suppression"],
    beginner: "The payoff — the actual email goes out here.",
    mistake: "Sending before verification, or to a non-sendable DE.",
    simEffect: "Sends to 4,103 contacts once the DE is ready.",
  },
  transfer: {
    title: "File Transfer Activity",
    what: "Moves files between SFTP and the Safehouse.",
    settings: ["SFTP location", "File pattern", "Decryption"],
    beginner: "Gets the file in place before Import runs.",
    mistake: "Running Import before the file has landed.",
    simEffect: "Optional first step — ensures the CSV exists.",
  },
  script: {
    title: "Script Activity",
    what: "Runs SSJS for logic SQL can't express.",
    settings: ["SSJS code", "Timeout", "Error handling"],
    beginner: "Custom code for special cases.",
    mistake: "Heavy logic that belongs in a query.",
    simEffect: "Not used here — keep pipelines SQL-first when possible.",
  },
  verify: {
    title: "Verification Activity",
    what: "Stops the run if row counts are outside expected bounds.",
    settings: ["Target DE", "Min/Max rows", "Action on fail"],
    beginner: "A safety check before the send.",
    mistake: "Skipping it and sending to an empty audience.",
    simEffect: "Would halt the run if the query returned 0 rows.",
  },
};

export const failureLogs: LogLine[] = [
  { time: "02:00", level: "INFO", message: "Automation 'Daily Customer Import' started" },
  { time: "02:01", level: "OK", message: "Import completed — 4,210 rows" },
  { time: "02:03", level: "OK", message: "Query Activity returned 4,103 rows" },
  { time: "02:04", level: "OK", message: "Active_Customers_DE updated (4,103 rows)" },
  { time: "02:05", level: "INFO", message: "Send Email Activity started" },
  { time: "02:05", level: "ERROR", message: "Send failed: target Data Extension 'Active_Customers_DE' is not marked sendable" },
  { time: "02:05", level: "WARN", message: "Automation finished with 1 failed activity" },
];

export type RootCause = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
};

export const troubleshoot = {
  brief:
    "Last night's 'Daily Customer Import' automation reports a failure. The import, query, and update all succeeded with healthy row counts, but no email went out. Read the logs and identify the root cause.",
  logs: failureLogs,
  options: [
    {
      id: "rc1",
      label: "CSV column mismatch on import",
      correct: false,
      feedback:
        "Import logged 4,210 rows successfully. The column mapping was fine — the failure is later in the run.",
    },
    {
      id: "rc2",
      label: "Target Data Extension is not sendable",
      correct: true,
      feedback:
        "Correct. Active_Customers_DE was updated fine, but it isn't marked sendable, so the Send Email activity cannot use it. Mark the DE sendable (with a subscriber relationship) and re-run.",
    },
    {
      id: "rc3",
      label: "SQL query returned zero rows",
      correct: false,
      feedback:
        "The query returned 4,103 rows — the audience exists. Zero rows would have shown a different log line.",
    },
    {
      id: "rc4",
      label: "File not found at SFTP",
      correct: false,
      feedback:
        "The import succeeded, so the file was present. A missing file would fail at the import step, not the send.",
    },
    {
      id: "rc5",
      label: "Automation schedule misconfigured",
      correct: false,
      feedback:
        "The automation ran on time at 02:00. Scheduling isn't the issue — the send step itself errored.",
    },
  ] as RootCause[],
  review: {
    beginner:
      "Every step before the send worked, which is why this is tricky — the data was perfect. The send couldn't happen because the destination wasn't allowed to send.",
    professional:
      "A 'sendable' Data Extension requires a defined subscriber relationship (a field mapped to Subscriber Key). Updating a DE does not make it sendable. Verify sendability as part of deployment, not after a failed run.",
    improvement:
      "Add a Verification Activity before the send to assert the DE is sendable and row count is in range, and alert on automation failure so this is caught before stakeholders notice.",
  },
};
