import type { JourneyNodeKind } from "@/components/labs/journey-canvas";

export type ConceptCard = {
  id: string;
  name: string;
  plain: string;
  example: string;
  mistake: string;
  why: string;
};

export const concepts: ConceptCard[] = [
  {
    id: "journey",
    name: "What is Journey Builder?",
    plain:
      "A tool for designing automated customer paths based on data, timing, and behavior. A journey is not just an email sequence — it is logic that moves people through different experiences.",
    example:
      "A cart-abandonment journey waits an hour, emails a reminder, then branches based on whether the person opened it.",
    mistake:
      "Treating a journey like a simple email blast and ignoring the branching logic.",
    why: "The branching is the value. It lets one journey serve thousands of people the right next step instead of one generic message.",
  },
  {
    id: "contact",
    name: "What is a Contact?",
    plain:
      "A person moving through the journey. In the simulator, contacts represent your subscribers or customers.",
    example:
      "5,000 cart abandoners each enter as a contact and travel the path independently.",
    mistake:
      "Assuming every contact behaves the same. They split across paths based on their own data and actions.",
    why: "Everything you design happens per-contact. Counts at each node tell you how real people are flowing.",
  },
  {
    id: "entry",
    name: "What is an Entry Source?",
    plain: "The doorway into a journey. It controls who is allowed to enter.",
    example:
      "A Data Extension called Cart_Abandoners_DE feeds customers into the journey.",
    mistake:
      "Using a DE that does not update or has the wrong sendable relationship.",
    why: "If the entry source is wrong, nobody enters the journey — the most common reason a 'live' journey sends nothing.",
  },
  {
    id: "email",
    name: "What is a Send Email activity?",
    plain:
      "Sends a specific email to contacts at that step. The email may include AMPscript personalization.",
    example:
      "A 'Reminder Email' that injects the contact's first name and cart items.",
    mistake: "Sending without a fallback for missing personalization data ('Hi ,').",
    why: "The email is the message; personalization is what makes it feel one-to-one instead of mass.",
  },
  {
    id: "wait",
    name: "What is a Wait activity?",
    plain: "Delays the next step. It controls timing.",
    example: "Wait 2 days before checking if someone opened the reminder.",
    mistake: "Waiting too long, so intent decays and the follow-up arrives irrelevant.",
    why: "Timing is a lever. The same message converts very differently at 1 hour vs 3 days.",
  },
  {
    id: "split",
    name: "What is a Decision Split?",
    plain:
      "A logic gate. It routes contacts based on data or behavior. Every split should have a fallback/default path.",
    example: "If Opened Email = true, send SMS. If false, send a discount email.",
    mistake:
      "Building a split where some contacts do not match any rule and silently fall out.",
    why: "Splits are how you personalize the path itself, not just the content. A missing default path strands contacts.",
  },
  {
    id: "engagement",
    name: "What is an Engagement Split?",
    plain:
      "A decision based specifically on email or SMS behavior — opened, clicked, did not open.",
    example:
      "Route contacts who clicked the reminder differently from those who only opened it.",
    mistake: "Checking engagement before the wait gives the data time to populate.",
    why: "Behavioral routing reacts to what people actually did, which is far more predictive than static data.",
  },
  {
    id: "exit",
    name: "What is an Exit?",
    plain: "Where the journey ends. Good journeys have clear exit rules.",
    example: "Contacts exit when they purchase or reach the end of the path.",
    mistake:
      "No exit criteria, so contacts keep receiving messages after they have already converted.",
    why: "Clean exits prevent annoying over-messaging and keep your reporting honest.",
  },
  {
    id: "goal",
    name: "What is a Goal?",
    plain: "The desired outcome of the journey.",
    example: "Customer purchases, completes signup, or redeems an offer.",
    mistake: "Setting a goal that is not aligned with the business objective.",
    why: "The goal defines success. Without it, you cannot tell whether the journey actually worked.",
  },
  {
    id: "reentry",
    name: "What is Re-entry?",
    plain:
      "Controls whether the same contact can enter the journey again. Configured correctly, it prevents duplicate or repeated sends.",
    example: "Allow re-entry only after 30 days so frequent shoppers are not spammed.",
    mistake:
      "Leaving re-entry on 'no restriction' so contacts loop and get duplicate sends.",
    why: "Re-entry rules are the difference between a helpful nudge and an inbox-flooding bug.",
  },
  {
    id: "suppression",
    name: "What is Suppression?",
    plain: "Rules that prevent certain contacts from receiving messages.",
    example: "Exclude unsubscribed users, hard bounces, and an excluded-segment list.",
    mistake: "Forgetting suppression and emailing people who already opted out.",
    why: "Suppression protects deliverability and compliance. Skipping it risks fines and blocklisting.",
  },
  {
    id: "settings",
    name: "What are Journey Settings?",
    plain:
      "Configuration choices that affect how contacts enter, exit, repeat, and qualify.",
    example: "Entry mode, re-entry rules, contact evaluation, and exit criteria.",
    mistake:
      "Shipping with default settings without reviewing re-entry and exit behavior.",
    why: "Settings quietly govern the whole journey. Most production incidents trace back to a setting nobody reviewed.",
  },
];

export type NodeGuide = {
  title: string;
  what: string;
  settings: string[];
  beginner: string;
  mistake: string;
  simEffect: string;
};

export const nodeGuides: Record<JourneyNodeKind, NodeGuide> = {
  entry: {
    title: "Entry Source",
    what: "The front door of your journey. It defines which contacts qualify to enter.",
    settings: [
      "Source Data Extension (Cart_Abandoners_DE)",
      "Entry mode: how often new contacts are injected",
      "Sendable relationship + contact key",
    ],
    beginner:
      "Think of this as the guest list. Only people on it get into the journey.",
    mistake: "Pointing at a DE that never refreshes — so no new contacts ever enter.",
    simEffect:
      "Sets the starting contact count. In this run, 5,000 contacts qualified to enter.",
  },
  wait: {
    title: "Wait Activity",
    what: "Pauses each contact for a set duration before the next step.",
    settings: ["Wait duration (1 hour)", "Wait until a specific date/attribute"],
    beginner: "It is a timer. The contact stands still here until the time is up.",
    mistake: "Waiting too long so the reminder loses relevance.",
    simEffect:
      "No contacts are lost here — it only delays them. All 5,000 continue after the wait.",
  },
  email: {
    title: "Send Email Activity",
    what: "Delivers a specific email (optionally personalized with AMPscript) to each contact.",
    settings: [
      "Email asset / content",
      "Send classification & sender profile",
      "Suppression lists",
    ],
    beginner: "This is the actual message landing in the inbox.",
    mistake: "No suppression check, so opted-out contacts still get emailed.",
    simEffect:
      "All contacts that reach this node receive the email — unless suppressed.",
  },
  split: {
    title: "Decision Split",
    what: "Asks a yes/no question and routes each contact down a matching path.",
    settings: [
      "Decision criteria (Opened email = true?)",
      "Branch order and rules",
      "Default / fallback path",
    ],
    beginner:
      "A fork in the road. The question here is: 'Did the contact open the email?' Yes → SMS nudge. No → discount email.",
    mistake:
      "Building a split where some contacts match no rule and silently drop out. Always include a default path.",
    simEffect:
      "Splits the 5,000 contacts: 2,180 opened (Yes path) and 2,820 did not (No path).",
  },
  sms: {
    title: "SMS Activity (Yes path)",
    what: "Sends a text message — here, a nudge to contacts who engaged with the email.",
    settings: ["SMS content", "Mobile number availability", "Quiet hours"],
    beginner:
      "A second channel for the people who showed interest by opening the email.",
    mistake: "Texting contacts without a valid mobile number or consent.",
    simEffect: "Receives the 2,180 contacts from the Yes (opened) branch.",
  },
  exit: {
    title: "Exit",
    what: "Ends the journey for each contact. Strong journeys define why a contact exits.",
    settings: ["Goal: Purchase", "Exit criteria", "Re-entry rules"],
    beginner: "The finish line. Contacts leave the journey here.",
    mistake: "No exit criteria, so contacts who already purchased keep getting messages.",
    simEffect:
      "4,612 contacts completed the journey; 388 were suppressed or errored before exit.",
  },
};

export type SimNarration = { step: number; text: string };

export const narration: SimNarration[] = [
  { step: 1, text: "5,000 contacts entered through Cart_Abandoners_DE." },
  { step: 2, text: "All 5,000 received the reminder email." },
  { step: 3, text: "After the wait period, the journey checked engagement." },
  { step: 4, text: "2,180 contacts opened the email." },
  { step: 5, text: "2,820 did not open." },
  { step: 6, text: "Openers moved to the SMS nudge." },
  { step: 7, text: "Non-openers moved to the discount offer." },
  { step: 8, text: "Suppressed contacts were removed before the final send." },
  { step: 9, text: "Contacts exited after reaching the goal or end of journey." },
];

export type FlowStage = {
  stage: string;
  count: string;
  detail: string;
};

export const contactFlow: FlowStage[] = [
  {
    stage: "Entry Source",
    count: "5,000",
    detail: "contacts qualified to enter from Cart_Abandoners_DE.",
  },
  {
    stage: "Email Send",
    count: "5,000",
    detail: "contacts received the Reminder Email.",
  },
  {
    stage: "Wait",
    count: "5,000",
    detail: "journey paused before checking behavior.",
  },
  {
    stage: "Decision Split",
    count: "2,180 / 2,820",
    detail: "2,180 contacts opened, 2,820 did not open.",
  },
  {
    stage: "Branching",
    count: "2,180 → 2,820",
    detail: "openers went to SMS Nudge; non-openers went to Discount Offer.",
  },
  {
    stage: "Exit",
    count: "4,612 / 388",
    detail: "4,612 completed the journey; 388 were suppressed or failed.",
  },
];

export const whatThisMeans =
  "Your open rate is 43.6%. Most contacts did not open the reminder email, so the discount path handled the largest group. This means the No path is not an edge case — it is the primary recovery path. Design your strongest offer there, not just on the happy path.";

export const operationalLesson =
  "In real SFMC work, you do not just build the happy path. You design for the majority behavior, failure cases, suppressions, and exit rules. A journey that only accounts for engaged contacts will quietly under-serve the silent majority.";

export const architectReview = {
  beginner:
    "Your journey worked because every contact had a clear path from entry to exit. Nobody got stranded with no matching branch.",
  professional:
    "The branch logic is solid, but production journeys should also include suppression checks, exit criteria for purchases, and re-entry controls. Right now a contact who buys after the reminder could still receive the SMS.",
  improvement:
    "Add a goal exit for customers who purchase after the reminder email, and configure re-entry so frequent abandoners are not messaged repeatedly.",
};

export type ConfigWarning = {
  title: string;
  detail: string;
};

export const configWarnings: ConfigWarning[] = [
  {
    title: "No exit criteria",
    detail:
      "Contacts who purchase mid-journey are not removed, so they keep receiving messages.",
  },
  {
    title: "Re-entry settings not configured",
    detail:
      "The same contact could re-enter and receive duplicate sends. Set a re-entry window.",
  },
  {
    title: "Decision split missing default path",
    detail:
      "Add an explicit fallback so contacts that match no rule are still handled.",
  },
  {
    title: "No suppression check",
    detail:
      "Unsubscribed or bounced contacts may be emailed. Attach a suppression list before send.",
  },
];

export type CommonMistake = {
  title: string;
  meaning: string;
  production: string;
  avoid: string;
};

export const commonMistakes: CommonMistake[] = [
  {
    title: "Wrong entry source",
    meaning: "The journey points at the wrong Data Extension.",
    production: "Contacts you intended never enter; the wrong audience may.",
    avoid: "Verify the source DE and its filters before activating.",
  },
  {
    title: "Data Extension not updating",
    meaning: "The entry DE is static and never receives new rows.",
    production: "The journey looks live but injects zero new contacts.",
    avoid: "Confirm the automation that populates the DE is running on schedule.",
  },
  {
    title: "No contacts qualifying",
    meaning: "Entry filters are too strict or fields do not match.",
    production: "A 'successful' journey that sends nothing.",
    avoid: "Test entry criteria against a sample and check field mappings.",
  },
  {
    title: "Missing default path",
    meaning: "A decision split has no fallback branch.",
    production: "Contacts matching no rule silently drop out of the journey.",
    avoid: "Always add an explicit default/else path to every split.",
  },
  {
    title: "Wait activity too long",
    meaning: "The delay outlasts the contact's intent.",
    production: "Follow-ups arrive irrelevant; conversion drops.",
    avoid: "Match wait duration to the behavior — minutes/hours for cart recovery.",
  },
  {
    title: "Re-entry misconfigured",
    meaning: "Re-entry rules allow contacts to loop.",
    production: "Duplicate and repeated sends to the same person.",
    avoid: "Set a sensible re-entry window or restrict re-entry entirely.",
  },
  {
    title: "Exit criteria missing",
    meaning: "There is no rule to remove converted contacts.",
    production: "People who already purchased keep getting messaged.",
    avoid: "Add a goal/exit on the conversion event.",
  },
  {
    title: "Suppression not checked",
    meaning: "No suppression list is attached to sends.",
    production: "Opted-out or bounced contacts receive messages — a compliance risk.",
    avoid: "Attach suppression lists and honor unsubscribe data.",
  },
  {
    title: "Decision split rules overlap",
    meaning: "Multiple branches can match the same contact.",
    production: "Unpredictable routing and double-counting in reports.",
    avoid: "Make branch rules mutually exclusive and ordered.",
  },
  {
    title: "Goal criteria not aligned with business objective",
    meaning: "The journey optimizes for the wrong outcome.",
    production: "Reports show success while revenue does not move.",
    avoid: "Define the goal as the real business result (e.g., purchase).",
  },
];

export const simSummary = {
  entered: 5000,
  emailed: 5000,
  opened: 2180,
  notOpened: 2820,
  sms: 2180,
  discount: 2820,
  exited: 4612,
  suppressed: 388,
};
