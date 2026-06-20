export type CertTrack = {
  id: string;
  name: string;
  available: boolean;
};

export const certTracks: CertTrack[] = [
  { id: "email-specialist", name: "Marketing Cloud Email Specialist", available: true },
  { id: "administrator", name: "Marketing Cloud Administrator", available: false },
  { id: "developer", name: "Marketing Cloud Developer", available: false },
  { id: "consultant", name: "Marketing Cloud Consultant", available: false },
];

export const domains = [
  "Data Modeling",
  "Subscriber and Data Management",
  "Email Message Configuration",
  "Content Creation and AMPscript",
  "Marketing Automation",
  "Tracking and Reporting",
] as const;

export type Domain = (typeof domains)[number];

export type CertQuestion = {
  id: string;
  domain: Domain;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  production: string;
  related: { label: string; href: string };
};

export const questions: CertQuestion[] = [
  // ---------------- Data Modeling ----------------
  {
    id: "q1",
    domain: "Data Modeling",
    question:
      "What makes a Data Extension 'sendable' in Marketing Cloud?",
    choices: [
      "It contains at least one row of data",
      "It has a defined send relationship mapping a field to the Subscriber Key",
      "It is stored in the Shared Data Extensions folder",
      "It has a primary key defined",
    ],
    answer: 1,
    explanation:
      "A sendable DE requires a send relationship: a field in the DE mapped to the Subscriber/Contact Key so the platform knows who each row represents.",
    production:
      "Updating a DE does not make it sendable. A missing send relationship is a classic reason an automation 'completes' but no email goes out.",
    related: { label: "Automation Studio Lab", href: "/labs/automation-studio" },
  },
  {
    id: "q2",
    domain: "Data Modeling",
    question:
      "Which key uniquely identifies a person across all channels in Contact Builder?",
    choices: ["Subscriber Key", "Contact Key", "Email Address", "Primary Key"],
    answer: 1,
    explanation:
      "The Contact Key is the unique cross-channel identifier in Contact Builder; Subscriber Key is its email-channel equivalent and they are usually kept in sync.",
    production:
      "Inconsistent Contact/Subscriber Keys cause duplicate contacts and broken journey entry — standardize the key early.",
    related: { label: "Data Modeling Academy", href: "/academy" },
  },
  {
    id: "q3",
    domain: "Data Modeling",
    question:
      "What is the purpose of a primary key on a Data Extension?",
    choices: [
      "To make the DE sendable",
      "To prevent duplicate rows and enable updates by key",
      "To encrypt the data at rest",
      "To schedule the DE for refresh",
    ],
    answer: 1,
    explanation:
      "A primary key enforces uniqueness and lets import/query 'update' operations match and overwrite existing rows instead of duplicating them.",
    production:
      "No primary key + 'Update' import type = silently duplicated rows and inflated audiences.",
    related: { label: "SQL Lab", href: "/labs/sql" },
  },
  {
    id: "q4",
    domain: "Data Modeling",
    question: "Which statement about Data Views (e.g. _Open, _Sent) is true?",
    choices: [
      "They are editable Data Extensions you populate",
      "They are read-only system tables queryable via SQL for ~6 months of data",
      "They store unlimited historical tracking forever",
      "They can be used directly as a sendable audience",
    ],
    answer: 1,
    explanation:
      "Data Views are read-only system tables exposing tracking/subscriber data via SQL, typically retaining a rolling window of data.",
    production:
      "Query Data Views into a DE if you need to retain or send from that data — you cannot send from a Data View directly.",
    related: { label: "SQL Lab", href: "/labs/sql" },
  },

  // ---------------- Subscriber and Data Management ----------------
  {
    id: "q5",
    domain: "Subscriber and Data Management",
    question: "What does the All Subscribers list represent?",
    choices: [
      "Only subscribers who opted in",
      "The master list of every subscriber and their status across the account",
      "A sendable Data Extension",
      "Contacts deleted in the last 30 days",
    ],
    answer: 1,
    explanation:
      "All Subscribers is the master record of every subscriber in the account and their status (Active, Held, Bounced, Unsubscribed).",
    production:
      "Status here overrides sends — an Unsubscribed subscriber will not receive email even if they're in your DE.",
    related: { label: "Certification Prep", href: "/certification-prep" },
  },
  {
    id: "q6",
    domain: "Subscriber and Data Management",
    question:
      "A subscriber unsubscribes from a Commercial send. What happens by default?",
    choices: [
      "They are removed from all Data Extensions",
      "They are unsubscribed at the account (All Subscribers) level and excluded from future commercial sends",
      "Only that single send is affected",
      "Their email address is deleted",
    ],
    answer: 1,
    explanation:
      "By default, unsubscribes apply at the All Subscribers level and suppress the subscriber from future commercial sends across the account.",
    production:
      "Honor unsubscribes with suppression and never override opt-out — it's a compliance requirement, not a preference.",
    related: { label: "Journey Builder Lab", href: "/labs/journey-builder" },
  },
  {
    id: "q7",
    domain: "Subscriber and Data Management",
    question:
      "What is the safest way to exclude bounced and unsubscribed contacts from a send?",
    choices: [
      "Manually delete them before each send",
      "Attach a suppression list / exclusion to the send",
      "Hope the platform handles it",
      "Lower the send volume",
    ],
    answer: 1,
    explanation:
      "Suppression lists and exclusion scripts systematically remove bounced, unsubscribed, or excluded contacts at send time.",
    production:
      "Suppression protects deliverability and compliance. Forgetting it is one of the most common rookie incidents.",
    related: { label: "Journey Builder Lab", href: "/labs/journey-builder" },
  },
  {
    id: "q8",
    domain: "Subscriber and Data Management",
    question: "What is a Publication List used for?",
    choices: [
      "Storing AMPscript variables",
      "Managing topic-based subscriptions and unsubscribes by category",
      "Scheduling automations",
      "Defining a sendable relationship",
    ],
    answer: 1,
    explanation:
      "Publication Lists let subscribers opt out of a category of email rather than all email, powering preference centers.",
    production:
      "Use them for newsletter/topic opt-outs so a subscriber can leave one stream without going fully unsubscribed.",
    related: { label: "AMPscript Lab", href: "/labs/ampscript" },
  },

  // ---------------- Email Message Configuration ----------------
  {
    id: "q9",
    domain: "Email Message Configuration",
    question: "What does a Sender Profile control?",
    choices: [
      "The From name and From email address of a send",
      "The subscriber's time zone",
      "The SQL query for the audience",
      "The unsubscribe link text",
    ],
    answer: 0,
    explanation:
      "A Sender Profile defines the From name and From address (and reply behavior) used for a send.",
    production:
      "Send Classification ties a Sender Profile + Delivery Profile + CAN-SPAM category together — misconfiguring it affects deliverability.",
    related: { label: "Certification Prep", href: "/certification-prep" },
  },
  {
    id: "q10",
    domain: "Email Message Configuration",
    question: "What is the purpose of a Send Classification?",
    choices: [
      "To pick the email template",
      "To bundle Sender Profile, Delivery Profile, and CAN-SPAM/commercial settings",
      "To define the data model",
      "To schedule the send",
    ],
    answer: 1,
    explanation:
      "Send Classification combines a Sender Profile, Delivery Profile, and the CAN-SPAM classification (Commercial vs Transactional).",
    production:
      "Transactional classification can bypass commercial unsubscribes — use it only for genuinely transactional messages.",
    related: { label: "Certification Prep", href: "/certification-prep" },
  },
  {
    id: "q11",
    domain: "Email Message Configuration",
    question:
      "Which is required by CAN-SPAM in a commercial email?",
    choices: [
      "A personalized subject line",
      "A physical mailing address and an unsubscribe mechanism",
      "An AMPscript block",
      "A preheader",
    ],
    answer: 1,
    explanation:
      "Commercial email must include a valid physical postal address and a functioning unsubscribe mechanism.",
    production:
      "These are usually enforced via the email footer and Profile/Unsub Center — never remove them to 'clean up' a template.",
    related: { label: "Certification Prep", href: "/certification-prep" },
  },
  {
    id: "q12",
    domain: "Email Message Configuration",
    question: "What is A/B testing used for in Email Studio?",
    choices: [
      "Encrypting the audience",
      "Comparing two versions (e.g. subject lines) to send the winner to the remainder",
      "Scheduling recurring sends",
      "Building the data model",
    ],
    answer: 1,
    explanation:
      "A/B (or multivariate) testing sends variants to test groups, then the winning variant to the remaining audience based on a metric.",
    production:
      "Pick a meaningful winner metric (e.g. conversions, not just opens) and a large enough test group for significance.",
    related: { label: "Journey Builder Lab", href: "/labs/journey-builder" },
  },

  // ---------------- Content Creation and AMPscript ----------------
  {
    id: "q13",
    domain: "Content Creation and AMPscript",
    question: "What does AttributeValue(\"FirstName\") return?",
    choices: [
      "A hard-coded string 'FirstName'",
      "The FirstName field value for the current subscriber from the sending context",
      "All FirstName values in the DE",
      "An error if the field is empty",
    ],
    answer: 1,
    explanation:
      "AttributeValue() reads a field from the current send context (the sendable DE/attribute) for the subscriber being rendered.",
    production:
      "Always guard reads with EMPTY() and a fallback so a null FirstName doesn't render 'Hi ,'.",
    related: { label: "AMPscript Lab", href: "/labs/ampscript" },
  },
  {
    id: "q14",
    domain: "Content Creation and AMPscript",
    question:
      "Which function returns a single value from another Data Extension by matching a key?",
    choices: ["LookupRows()", "Lookup()", "RowCount()", "Concat()"],
    answer: 1,
    explanation:
      "Lookup(\"DE\",\"ReturnCol\",\"MatchCol\",value) returns one value from the first matching row. LookupRows() returns a row set.",
    production:
      "Use Lookup() for a single value (e.g. a reward); use LookupRows()+RowCount() when multiple rows can match.",
    related: { label: "AMPscript Lab", href: "/labs/ampscript" },
  },
  {
    id: "q15",
    domain: "Content Creation and AMPscript",
    question: "How should you safely loop over LookupRows() results?",
    choices: [
      "Call Row(@rows, 1) directly",
      "Guard with RowCount() > 0, then FOR loop using Row()/Field()",
      "Use AttributeValue() in a loop",
      "Loops are not possible in AMPscript",
    ],
    answer: 1,
    explanation:
      "Check RowCount(@rows) before iterating, then loop with FOR and read columns via Row()/Field(). Accessing Row() on an empty set errors.",
    production:
      "An unguarded Row() on an empty set is a hard runtime error that can fail the entire send.",
    related: { label: "AMPscript Lab", href: "/labs/ampscript" },
  },
  {
    id: "q16",
    domain: "Content Creation and AMPscript",
    question: "What is the difference between %%=v(@var)=%% and a personalization string like %%FirstName%%?",
    choices: [
      "They are identical",
      "v() outputs an AMPscript variable; %%Field%% outputs a profile/DE attribute directly",
      "%%FirstName%% only works in SMS",
      "v() only works in CloudPages",
    ],
    answer: 1,
    explanation:
      "v() prints an AMPscript variable you SET; %%Field%% substitution prints a profile attribute or DE column directly.",
    production:
      "Prefer setting variables with guards, then output v() — it's easier to apply fallbacks and debug.",
    related: { label: "AMPscript Lab", href: "/labs/ampscript" },
  },

  // ---------------- Marketing Automation ----------------
  {
    id: "q17",
    domain: "Marketing Automation",
    question: "In Automation Studio, what does a Query Activity do?",
    choices: [
      "Sends an email",
      "Runs SQL and writes the result into a target Data Extension",
      "Imports a CSV file",
      "Schedules the automation",
    ],
    answer: 1,
    explanation:
      "A Query Activity executes SQL against DEs/Data Views and writes the result rows into a target DE.",
    production:
      "The query output is your audience. Validate row counts before the send step to avoid empty or oversized sends.",
    related: { label: "Automation Studio Lab", href: "/labs/automation-studio" },
  },
  {
    id: "q18",
    domain: "Marketing Automation",
    question:
      "What is the key difference between a Decision Split and an Engagement Split in Journey Builder?",
    choices: [
      "There is no difference",
      "Decision Split branches on attribute/data values; Engagement Split branches on email/SMS behavior like opens/clicks",
      "Engagement Split only works in Automation Studio",
      "Decision Split can only have two branches",
    ],
    answer: 1,
    explanation:
      "Decision Split routes on data/attribute criteria; Engagement Split routes specifically on prior message engagement (opened/clicked) with a built-in evaluation window.",
    production:
      "Give every split an explicit default path so contacts matching no rule aren't stranded.",
    related: { label: "Journey Builder Lab", href: "/labs/journey-builder" },
  },
  {
    id: "q19",
    domain: "Marketing Automation",
    question: "Why might a 'successful' automation send zero emails?",
    choices: [
      "The server was down",
      "Downstream issues like a non-sendable target DE or a query returning zero rows",
      "Automations always send",
      "The email had no subject line",
    ],
    answer: 1,
    explanation:
      "A green automation status means activities executed; the send can still fail if the DE isn't sendable, the audience is empty, or entry criteria didn't match.",
    production:
      "Always read the per-activity logs and verify row counts — status covers execution, not business outcome.",
    related: { label: "Automation Studio Lab", href: "/labs/automation-studio" },
  },
  {
    id: "q20",
    domain: "Marketing Automation",
    question: "What controls whether a contact can enter a journey again?",
    choices: [
      "The Wait activity",
      "Re-entry settings on the journey",
      "The Send Email activity",
      "The Sender Profile",
    ],
    answer: 1,
    explanation:
      "Re-entry settings (no re-entry, re-entry only after exit, or unrestricted) control whether and when a contact can re-enter.",
    production:
      "Misconfigured re-entry causes duplicate/repeated sends to the same contact — a frequent complaint-driver.",
    related: { label: "Journey Builder Lab", href: "/labs/journey-builder" },
  },
  {
    id: "q21",
    domain: "Marketing Automation",
    question: "What does a Verification Activity in Automation Studio do?",
    choices: [
      "Sends a test email",
      "Checks row counts/thresholds and can stop the automation if criteria fail",
      "Encrypts the file",
      "Defines the schedule",
    ],
    answer: 1,
    explanation:
      "Verification checks a target DE's row count against expected bounds and can halt the run to prevent a bad send.",
    production:
      "Add verification before sends so an empty or oversized audience stops the run instead of going out.",
    related: { label: "Automation Studio Lab", href: "/labs/automation-studio" },
  },

  // ---------------- Tracking and Reporting ----------------
  {
    id: "q22",
    domain: "Tracking and Reporting",
    question: "Which metric best indicates content relevance to engaged users?",
    choices: [
      "Bounce rate",
      "Click-to-open rate (clicks among those who opened)",
      "Send count",
      "Unsubscribe rate",
    ],
    answer: 1,
    explanation:
      "Click-to-open rate isolates how compelling the content was for people who actually opened, separating subject-line effects from content effects.",
    production:
      "Pair open rate (subject/sender) with CTOR (content) to diagnose where a campaign underperformed.",
    related: { label: "Certification Prep", href: "/certification-prep" },
  },
  {
    id: "q23",
    domain: "Tracking and Reporting",
    question:
      "A high bounce rate on a new list most likely indicates what?",
    choices: [
      "Great deliverability",
      "Poor list quality / invalid or stale addresses",
      "Too many images",
      "A scheduling error",
    ],
    answer: 1,
    explanation:
      "High bounces usually mean invalid, mistyped, or stale email addresses — a list-quality problem.",
    production:
      "Sending to a dirty list damages sender reputation. Validate and warm up new lists gradually.",
    related: { label: "SQL Lab", href: "/labs/sql" },
  },
  {
    id: "q24",
    domain: "Tracking and Reporting",
    question: "What is the difference between a hard bounce and a soft bounce?",
    choices: [
      "Hard bounces are temporary; soft bounces are permanent",
      "Hard bounces are permanent failures (invalid address); soft bounces are temporary (mailbox full, server down)",
      "They are the same",
      "Soft bounces always unsubscribe the contact",
    ],
    answer: 1,
    explanation:
      "A hard bounce is a permanent failure (address doesn't exist); a soft bounce is temporary and may succeed on retry.",
    production:
      "Repeated soft bounces eventually convert to hard bounces and the address is suppressed automatically.",
    related: { label: "Troubleshooting Lab", href: "/labs/troubleshooting" },
  },
  {
    id: "q25",
    domain: "Tracking and Reporting",
    question:
      "Where would you confirm whether last night's scheduled automation actually ran?",
    choices: [
      "The email preview",
      "Automation Studio Run History / activity logs",
      "The Sender Profile",
      "Contact Builder",
    ],
    answer: 1,
    explanation:
      "Run History shows each automation run, its status, and per-activity timing — the first place to check for a missing send.",
    production:
      "Set up run-failure notifications so failures surface proactively instead of via a stakeholder complaint.",
    related: { label: "Automation Studio Lab", href: "/labs/automation-studio" },
  },
  {
    id: "q26",
    domain: "Tracking and Reporting",
    question: "What does the _Click Data View let you analyze?",
    choices: [
      "Which links each subscriber clicked and when",
      "The SQL schema",
      "The sender reputation score",
      "Unsubscribe reasons",
    ],
    answer: 0,
    explanation:
      "_Click records click events (subscriber, link/URL, timestamp), enabling click-based segmentation and engagement analysis.",
    production:
      "Join _Open and _Click to build 'opened-not-clicked' re-engagement segments — but filter by date/JobID for performance.",
    related: { label: "SQL Lab", href: "/labs/sql" },
  },
];
