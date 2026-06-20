import type { Contact, Tables, EvalResult } from "@/lib/ampscript";
import type { CurriculumLevel } from "@/components/labs/curriculum-panel";
import type { Note } from "@/components/labs/architect-notes";

export type AmpCheck = {
  label: string;
  hint?: string;
  test: (code: string, result: EvalResult) => boolean;
};

export type AmpLesson = {
  id: string;
  level: CurriculumLevel;
  title: string;
  xp: number;
  concept: string;
  task: string[];
  starter: string;
  subject: string;
  checks: AmpCheck[];
  notes: Note[];
};

export const CONTACT: Contact = {
  FirstName: "Maya",
  LastName: "Lin",
  LoyaltyTier: "Gold",
  CartTotal: 168,
  Email: "maya.lin@example.com",
  MemberId: "M-204",
};

export const TABLES: Tables = {
  Loyalty: [
    { MemberId: "M-204", Tier: "Gold", Points: 4820, Reward: "Free Shipping" },
    { MemberId: "M-118", Tier: "Silver", Points: 1200, Reward: "5% Off" },
  ],
  Products: [
    { Category: "Shoes", Name: "Trail Runner X", Price: 129 },
    { Category: "Shoes", Name: "Court Classic", Price: 89 },
    { Category: "Shoes", Name: "Cloud Walker", Price: 149 },
  ],
  Orders: [
    { MemberId: "M-204", OrderId: "O-5521", Total: 168, Date: "2026-06-01" },
    { MemberId: "M-204", OrderId: "O-4410", Total: 92, Date: "2026-04-18" },
  ],
  Preferences: [
    {
      MemberId: "M-204",
      Frequency: "Weekly",
      Topics: "New Arrivals",
      Channel: "Email",
    },
  ],
};

const has = (code: string, re: RegExp) => re.test(code);

export const ampLessons: AmpLesson[] = [
  // ----------------------------- BEGINNER -----------------------------
  {
    id: "amp-b1",
    level: "Beginner",
    title: "What is AMPscript?",
    xp: 80,
    subject: "Welcome aboard",
    concept:
      "AMPscript is Marketing Cloud's scripting language for personalizing content inside emails, pages, and SMS. It runs server-side at send time. Logic lives inside a %%[ ... ]%% block; output is injected back into the email with %%= ... =%% tags.",
    task: [
      "Run the script as-is and read the rendered email on the right.",
      "Notice how %%=v(@firstName)=%% is replaced with a real value at send time.",
      "Change the greeting text and Run again to see the preview update.",
    ],
    starter: `%%[
  /* Logic block: this runs before the email is built */
  SET @firstName = "Maya"
]%%
Hi %%=v(@firstName)=%%,

Welcome to the lab. This sentence was assembled by AMPscript.`,
    checks: [
      {
        label: "A logic block %%[ ... ]%% exists",
        hint: "Wrap your logic in %%[ and ]%%",
        test: (c) => has(c, /%%\[[\s\S]*\]%%/),
      },
      {
        label: "You output a value with %%=v(@firstName)=%%",
        hint: "Use %%=v(@firstName)=%% in the email body",
        test: (c) => has(c, /%%=\s*v\(\s*@firstName\s*\)\s*=%%/i),
      },
      {
        label: "The email renders some text",
        test: (_c, r) => r.output.trim().length > 0,
      },
    ],
    notes: [
      {
        tone: "info",
        text: "Everything inside %%[ ]%% is logic and never appears in the email. Only %%= =%% output tags render to the subscriber.",
      },
      {
        tone: "success",
        text: "Reading the rendered preview after every change is the single fastest way to learn AMPscript. Run early, run often.",
      },
    ],
  },
  {
    id: "amp-b2",
    level: "Beginner",
    title: "Variables and SET",
    xp: 90,
    subject: "Your details",
    concept:
      "Variables hold values you reuse later. Declare and assign them with SET. Variable names start with @. You can store text in quotes or numbers without quotes.",
    task: [
      "Create a variable @city and SET it to your favorite city.",
      "Output @firstName and @city in the email body with v().",
    ],
    starter: `%%[
  SET @firstName = "Maya"
  SET @city = "Lisbon"
]%%
Hi %%=v(@firstName)=%%,

Greetings from %%=v(@city)=%%!`,
    checks: [
      {
        label: "At least two SET assignments",
        hint: "Use SET @name = value for each variable",
        test: (c) => (c.match(/SET\s+@\w+\s*=/gi) || []).length >= 2,
      },
      {
        label: "You output @city",
        test: (c) => has(c, /%%=\s*v\(\s*@city\s*\)\s*=%%/i),
      },
    ],
    notes: [
      {
        tone: "info",
        text: "Numbers (SET @n = 5) and strings (SET @s = \"text\") behave differently in comparisons. Keep numeric values unquoted.",
      },
    ],
  },
  {
    id: "amp-b3",
    level: "Beginner",
    title: "AttributeValue()",
    xp: 100,
    subject: "Personalized for you",
    concept:
      "Real emails read data from the sending Data Extension, not hard-coded strings. AttributeValue(\"FieldName\") pulls a field for the current subscriber. The Variable Inspector shows the contact record feeding this send.",
    task: [
      "Replace the hard-coded name by reading FirstName with AttributeValue().",
      "Also read LoyaltyTier from the Data Extension and output it.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @tier = AttributeValue("LoyaltyTier")
]%%
Hi %%=v(@firstName)=%%,

Thanks for being a %%=v(@tier)=%% member.`,
    checks: [
      {
        label: 'Reads FirstName with AttributeValue("FirstName")',
        hint: 'Use AttributeValue("FirstName")',
        test: (c) => has(c, /AttributeValue\(\s*"FirstName"\s*\)/i),
      },
      {
        label: "Reads LoyaltyTier from the Data Extension",
        test: (c) => has(c, /AttributeValue\(\s*"LoyaltyTier"\s*\)/i),
      },
      {
        label: "The greeting resolves to a real name",
        test: (_c, r) => r.output.includes("Maya"),
      },
    ],
    notes: [
      {
        tone: "warning",
        text: "AttributeValue() field names must match your DE column names exactly (case-insensitive here, but be strict in production).",
      },
    ],
  },
  {
    id: "amp-b4",
    level: "Beginner",
    title: "Output with v()",
    xp: 90,
    subject: "Output basics",
    concept:
      "v(@var) is the most common output function — it prints a variable's value. You wrap it in %%= =%% to inject it into the email. You can also output an expression directly inside %%= =%%.",
    task: [
      "Output @firstName with v().",
      "Build a @fullName using Concat() and output it too.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @lastName = AttributeValue("LastName")
  SET @fullName = Concat(@firstName, " ", @lastName)
]%%
Hi %%=v(@firstName)=%%,

We have your name on file as %%=v(@fullName)=%%.`,
    checks: [
      {
        label: "Uses Concat() to combine values",
        hint: "Concat(@firstName, \" \", @lastName)",
        test: (c) => has(c, /Concat\(/i),
      },
      {
        label: "Outputs @fullName",
        test: (c) => has(c, /%%=\s*v\(\s*@fullName\s*\)\s*=%%/i),
      },
      {
        label: "Full name renders as Maya Lin",
        test: (_c, r) => r.output.includes("Maya Lin"),
      },
    ],
    notes: [
      {
        tone: "info",
        text: "Concat() is your workhorse for stitching dynamic strings — URLs with tracking params, full names, formatted offers.",
      },
    ],
  },
  {
    id: "amp-b5",
    level: "Beginner",
    title: "IF / ELSE logic",
    xp: 120,
    subject: "Tailored greeting",
    concept:
      "Conditional logic lets one email behave differently per subscriber. IF <condition> THEN ... ELSE ... ENDIF. Conditions compare values with =, >, <, >=, <=, !=.",
    task: [
      "Set @greeting to a VIP message when LoyaltyTier = 'Gold', otherwise a standard message.",
      "Output @greeting in the email.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @tier = AttributeValue("LoyaltyTier")

  IF @tier == "Gold" THEN
    SET @greeting = "Welcome back, VIP"
  ELSE
    SET @greeting = "Welcome back"
  ENDIF
]%%
%%=v(@greeting)=%%, %%=v(@firstName)=%%!`,
    checks: [
      {
        label: "Uses an IF condition",
        test: (c) => has(c, /\bIF\b[\s\S]*\bTHEN\b/i),
      },
      {
        label: "Provides an ELSE branch",
        hint: "Add an ELSE for non-Gold members",
        test: (c) => has(c, /\bELSE\b/i),
      },
      {
        label: "Closes the block with ENDIF",
        test: (c) => has(c, /\bENDIF\b/i),
      },
      {
        label: "Gold member sees the VIP greeting",
        test: (_c, r) => /VIP/i.test(r.output),
      },
    ],
    notes: [
      {
        tone: "success",
        text: "One IF/ELSE replaces what would otherwise be two separate emails. This is the heart of dynamic content.",
      },
      {
        tone: "info",
        text: "Use == for equality comparisons. A single = also works in AMPscript, but == reads more clearly.",
      },
    ],
  },
  {
    id: "amp-b6",
    level: "Beginner",
    title: "EMPTY() and fallback handling",
    xp: 130,
    subject: "Safe personalization",
    concept:
      "Never trust data to be present. If FirstName is blank, 'Hi ,' looks broken. EMPTY(@var) returns true when a value is missing — wrap reads in a guard and supply a friendly fallback.",
    task: [
      "After reading FirstName, if it is EMPTY set @firstName to a fallback like 'there'.",
      "Confirm the greeting never renders an empty name.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")

  IF EMPTY(@firstName) THEN
    SET @firstName = "there"
  ENDIF
]%%
Hi %%=v(@firstName)=%%,

This greeting is safe even when the data is missing.`,
    checks: [
      {
        label: "Uses EMPTY() to test the value",
        hint: "IF EMPTY(@firstName) THEN ...",
        test: (c) => has(c, /EMPTY\s*\(/i),
      },
      {
        label: "Sets a fallback value",
        test: (c) => has(c, /IF\s+EMPTY[\s\S]*SET\s+@firstName/i),
      },
      {
        label: "Renders a non-empty greeting",
        test: (_c, r) => /Hi\s+\S/i.test(r.output),
      },
    ],
    notes: [
      {
        tone: "danger",
        text: "Missing-data bugs are the #1 cause of embarrassing 'Hi ,' sends. Guarding reads with EMPTY() is a non-negotiable production habit.",
      },
    ],
  },

  // --------------------------- INTERMEDIATE ---------------------------
  {
    id: "amp-i1",
    level: "Intermediate",
    title: "Lookup()",
    xp: 150,
    subject: "Your rewards",
    concept:
      "Lookup() fetches a single value from another Data Extension. Signature: Lookup(\"DataExtension\", \"ReturnColumn\", \"MatchColumn\", matchValue). Here we read the Loyalty DE to get a member's reward.",
    task: [
      "Use the MemberId to Lookup the member's Reward from the Loyalty DE.",
      "Output the reward in the email.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @memberId = AttributeValue("MemberId")
  SET @reward = Lookup("Loyalty", "Reward", "MemberId", @memberId)
]%%
Hi %%=v(@firstName)=%%,

Your current reward is: %%=v(@reward)=%%.`,
    checks: [
      {
        label: "Calls Lookup() against the Loyalty DE",
        hint: 'Lookup("Loyalty", "Reward", "MemberId", @memberId)',
        test: (c) => has(c, /Lookup\(\s*"Loyalty"/i),
      },
      {
        label: "Outputs the looked-up reward",
        test: (_c, r) => /Free Shipping/i.test(r.output),
      },
    ],
    notes: [
      {
        tone: "info",
        text: "Lookup() returns only the first match. If multiple rows can match, you'll want LookupRows() instead (next lesson).",
      },
    ],
  },
  {
    id: "amp-i2",
    level: "Intermediate",
    title: "LookupRows()",
    xp: 160,
    subject: "Your order history",
    concept:
      "LookupRows(\"DE\", \"MatchColumn\", matchValue) returns every matching row as a row set. You then iterate or count them. Here we fetch all of a member's orders.",
    task: [
      "Use LookupRows() to pull all Orders for the MemberId.",
      "Store the result in @orders (you'll count and loop over it next).",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @memberId = AttributeValue("MemberId")
  SET @orders = LookupRows("Orders", "MemberId", @memberId)
]%%
Hi %%=v(@firstName)=%%,

We pulled your order records. (Check the Variable Inspector — @orders holds a row set.)`,
    checks: [
      {
        label: "Calls LookupRows() against Orders",
        hint: 'LookupRows("Orders", "MemberId", @memberId)',
        test: (c) => has(c, /LookupRows\(\s*"Orders"/i),
      },
      {
        label: "Stores the row set in a variable",
        test: (c) => has(c, /SET\s+@\w+\s*=\s*LookupRows/i),
      },
    ],
    notes: [
      {
        tone: "info",
        text: "A row set is not a string — you can't output it directly. The inspector shows it as [N rows]. Use RowCount() and Row()/Field() to read it.",
      },
    ],
  },
  {
    id: "amp-i3",
    level: "Intermediate",
    title: "RowCount()",
    xp: 160,
    subject: "Order summary",
    concept:
      "RowCount(@rowset) returns how many rows LookupRows() found. It's essential for guarding loops and showing counts ('You have 2 orders').",
    task: [
      "Count the member's orders with RowCount().",
      "Output the count in a sentence.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @memberId = AttributeValue("MemberId")
  SET @orders = LookupRows("Orders", "MemberId", @memberId)
  SET @count = RowCount(@orders)
]%%
Hi %%=v(@firstName)=%%,

You have placed %%=v(@count)=%% orders with us.`,
    checks: [
      {
        label: "Uses RowCount() on the row set",
        test: (c) => has(c, /RowCount\(/i),
      },
      {
        label: "Outputs the correct count (2)",
        test: (_c, r) => /\b2\b/.test(r.output),
      },
    ],
    notes: [
      {
        tone: "success",
        text: "Always RowCount() before you loop. Calling Row(@set, 1) on an empty set is a classic runtime error.",
      },
    ],
  },
  {
    id: "amp-i4",
    level: "Intermediate",
    title: "Conditional offers",
    xp: 180,
    subject: "An offer for you",
    concept:
      "Combine data reads with IF logic to swap offers. High-value carts deserve a stronger incentive. This pattern powers cart recovery, win-back, and tiered promotions.",
    task: [
      "If CartTotal is 150 or more, set @offer to 'FREESHIP', otherwise 'SAVE10'.",
      "Output the offer code.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @cartTotal = AttributeValue("CartTotal")

  IF @cartTotal >= 150 THEN
    SET @offer = "FREESHIP"
  ELSE
    SET @offer = "SAVE10"
  ENDIF
]%%
Hi %%=v(@firstName)=%%, use code %%=v(@offer)=%% to complete your order.`,
    checks: [
      {
        label: "Compares CartTotal with a threshold",
        test: (c) => has(c, /@cartTotal\s*>=/i),
      },
      {
        label: "Defines both offer branches",
        test: (c) => has(c, /FREESHIP/) && has(c, /SAVE10/),
      },
      {
        label: "Maya (cart $168) gets FREESHIP",
        test: (_c, r) => /FREESHIP/.test(r.output),
      },
    ],
    notes: [
      {
        tone: "warning",
        text: "Hard-coded thresholds are fine to learn, but production teams store them in a config DE so marketers can tune offers without a code deploy.",
      },
    ],
  },
  {
    id: "amp-i5",
    level: "Intermediate",
    title: "Dynamic content blocks",
    xp: 190,
    subject: "Tailored just for you",
    concept:
      "Use IF / ELSEIF / ELSE to render entirely different content blocks per segment. One email, many experiences — Gold, Silver, and everyone else each see tailored copy.",
    task: [
      "Build a @block message for Gold, Silver (ELSEIF), and all others (ELSE).",
      "Output the block.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @tier = AttributeValue("LoyaltyTier")

  IF @tier == "Gold" THEN
    SET @block = "Enjoy free express shipping and early access."
  ELSEIF @tier == "Silver" THEN
    SET @block = "You're close to Gold — one more order unlocks perks."
  ELSE
    SET @block = "Join our loyalty program and start earning."
  ENDIF
]%%
Hi %%=v(@firstName)=%%,

%%=v(@block)=%%`,
    checks: [
      {
        label: "Uses ELSEIF for a second segment",
        test: (c) => has(c, /\bELSEIF\b/i),
      },
      {
        label: "Has a catch-all ELSE block",
        test: (c) => has(c, /\bELSE\b/i),
      },
      {
        label: "Gold member sees the express-shipping block",
        test: (_c, r) => /express shipping/i.test(r.output),
      },
    ],
    notes: [
      {
        tone: "info",
        text: "ELSEIF chains are readable up to ~4 branches. Beyond that, a Lookup() into a content-mapping DE scales better.",
      },
    ],
  },

  // ----------------------------- ADVANCED -----------------------------
  {
    id: "amp-a1",
    level: "Advanced",
    title: "Product table rendering",
    xp: 240,
    subject: "Picked for you",
    concept:
      "Catalogs are dynamic. LookupRows() pulls products, then a FOR loop walks each row, reading columns with Row()/Field() and building HTML with Concat(). This is how recommendation blocks are rendered.",
    task: [
      "Loop over the Shoes products with FOR @i = 1 TO RowCount(@rows).",
      "Use Row()/Field() to read Name and Price, and Concat() into @list.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @rows = LookupRows("Products", "Category", "Shoes")
  SET @count = RowCount(@rows)
  SET @list = ""

  FOR @i = 1 TO @count DO
    SET @row = Row(@rows, @i)
    SET @name = Field(@row, "Name")
    SET @price = Field(@row, "Price")
    SET @list = Concat(@list, "• ", @name, " — $", @price, "\\n")
  NEXT @i
]%%
Hi %%=v(@firstName)=%%, here are your picks:

%%=v(@list)=%%`,
    checks: [
      {
        label: "Pulls products with LookupRows()",
        test: (c) => has(c, /LookupRows\(\s*"Products"/i),
      },
      {
        label: "Iterates with a FOR ... NEXT loop",
        hint: "FOR @i = 1 TO @count DO ... NEXT @i",
        test: (c) => has(c, /\bFOR\b[\s\S]*\bNEXT\b/i),
      },
      {
        label: "Reads columns with Row()/Field()",
        test: (c) => has(c, /Field\(/i) && has(c, /Row\(/i),
      },
      {
        label: "Renders all three products",
        test: (_c, r) =>
          /Trail Runner X/.test(r.output) &&
          /Court Classic/.test(r.output) &&
          /Cloud Walker/.test(r.output),
      },
    ],
    notes: [
      {
        tone: "success",
        text: "Building the list in a variable first (then outputting once) keeps your template clean and your loop testable.",
      },
      {
        tone: "warning",
        text: "Always guard the loop with RowCount(). A LookupRows() that returns zero rows should render a graceful 'nothing to show' block, not a broken table.",
      },
    ],
  },
  {
    id: "amp-a2",
    level: "Advanced",
    title: "Preference center logic",
    xp: 230,
    subject: "Your preferences",
    concept:
      "Preference centers read a subscriber's stored choices and render accordingly — respecting frequency, topics, and channel. Missing preferences must fall back to safe defaults.",
    task: [
      "Look up the member's Frequency and Topics from the Preferences DE.",
      "If Frequency is EMPTY, default it to 'Monthly'.",
    ],
    starter: `%%[
  SET @memberId = AttributeValue("MemberId")
  SET @freq = Lookup("Preferences", "Frequency", "MemberId", @memberId)
  SET @topics = Lookup("Preferences", "Topics", "MemberId", @memberId)

  IF EMPTY(@freq) THEN
    SET @freq = "Monthly"
  ENDIF
]%%
You're subscribed to %%=v(@topics)=%% updates, delivered %%=v(@freq)=%%.`,
    checks: [
      {
        label: "Looks up preferences from the Preferences DE",
        test: (c) => has(c, /Lookup\(\s*"Preferences"/i),
      },
      {
        label: "Defaults Frequency when EMPTY",
        test: (c) => has(c, /EMPTY\s*\(\s*@freq/i),
      },
      {
        label: "Renders the stored frequency (Weekly)",
        test: (_c, r) => /Weekly/i.test(r.output),
      },
    ],
    notes: [
      {
        tone: "info",
        text: "A real preference center also writes choices back via a form/CloudPage. Reading is half the job — defaulting the gaps is the part beginners forget.",
      },
    ],
  },
  {
    id: "amp-a3",
    level: "Advanced",
    title: "Multi-condition personalization",
    xp: 250,
    subject: "Just for you",
    concept:
      "Real targeting layers conditions: tier AND spend, lifecycle AND geography. Nest IF blocks (or combine conditions) to express richer rules without exploding into dozens of emails.",
    task: [
      "Nest logic: Gold members with CartTotal >= 150 get a VIP gift offer; other Gold members get free shipping; everyone else gets 10% off.",
    ],
    starter: `%%[
  SET @firstName = AttributeValue("FirstName")
  SET @tier = AttributeValue("LoyaltyTier")
  SET @cartTotal = AttributeValue("CartTotal")

  IF @tier == "Gold" THEN
    IF @cartTotal >= 150 THEN
      SET @offer = "VIP free shipping + a gift"
    ELSE
      SET @offer = "free shipping"
    ENDIF
  ELSE
    SET @offer = "10% off"
  ENDIF
]%%
Hi %%=v(@firstName)=%%, you've unlocked %%=v(@offer)=%%.`,
    checks: [
      {
        label: "Nests at least two IF conditions",
        test: (c) => (c.match(/\bIF\b/gi) || []).length >= 2,
      },
      {
        label: "Tests both tier and cart value",
        test: (c) => has(c, /@tier/i) && has(c, /@cartTotal/i),
      },
      {
        label: "Maya (Gold, $168) unlocks the VIP gift offer",
        test: (_c, r) => /VIP/i.test(r.output),
      },
    ],
    notes: [
      {
        tone: "warning",
        text: "Deeply nested IFs get hard to QA. When you reach 3+ levels, consider a scoring approach or a decision DE you can Lookup().",
      },
    ],
  },
  {
    id: "amp-a4",
    level: "Advanced",
    title: "Error handling",
    xp: 250,
    subject: "Resilient content",
    concept:
      "Production AMPscript must never throw at send time. Guard row reads with RowCount() before Row(), guard values with EMPTY(), and always provide an alternate branch.",
    task: [
      "Only read the latest order when RowCount(@orders) > 0.",
      "Provide a friendly ELSE message for members with no orders.",
    ],
    starter: `%%[
  SET @memberId = AttributeValue("MemberId")
  SET @orders = LookupRows("Orders", "MemberId", @memberId)

  IF RowCount(@orders) > 0 THEN
    SET @row = Row(@orders, 1)
    SET @last = Field(@row, "OrderId")
    SET @msg = Concat("Your most recent order was ", @last, ".")
  ELSE
    SET @msg = "We'd love to see your first order!"
  ENDIF
]%%
%%=v(@msg)=%%`,
    checks: [
      {
        label: "Guards row access with RowCount() > 0",
        test: (c) => has(c, /RowCount\([\s\S]*\)\s*>\s*0/i),
      },
      {
        label: "Has an ELSE for the empty case",
        test: (c) => has(c, /\bELSE\b/i),
      },
      {
        label: "Renders the latest order (O-5521)",
        test: (_c, r) => /O-5521/.test(r.output),
      },
    ],
    notes: [
      {
        tone: "danger",
        text: "Calling Row(@set, 1) when the set is empty is a hard runtime error that can fail the entire send. The RowCount() guard is mandatory.",
      },
    ],
  },
  {
    id: "amp-a5",
    level: "Advanced",
    title: "Production-safe patterns",
    xp: 280,
    subject: "Ship it",
    concept:
      "Bring it all together. Production-grade AMPscript guards every external read, supplies fallbacks, documents intent with comments, and degrades gracefully. This is the standard a Senior Architect signs off on.",
    task: [
      "Guard both FirstName and LoyaltyTier with EMPTY() fallbacks.",
      "Keep the comment explaining the safety intent.",
    ],
    starter: `%%[
  /* Production-safe: guard every read, never render empty */
  SET @firstName = AttributeValue("FirstName")
  IF EMPTY(@firstName) THEN
    SET @firstName = "there"
  ENDIF

  SET @tier = AttributeValue("LoyaltyTier")
  IF EMPTY(@tier) THEN
    SET @tier = "valued"
  ENDIF
]%%
Hi %%=v(@firstName)=%%,

Thanks for being a %%=v(@tier)=%% member of the program.`,
    checks: [
      {
        label: "Guards two reads with EMPTY()",
        test: (c) => (c.match(/EMPTY\s*\(/gi) || []).length >= 2,
      },
      {
        label: "Documents intent with a comment",
        test: (c) => has(c, /\/\*[\s\S]*\*\//),
      },
      {
        label: "Both name and tier always render",
        test: (_c, r) => /Hi\s+\S/i.test(r.output) && /member/i.test(r.output),
      },
    ],
    notes: [
      {
        tone: "success",
        text: "This is the bar: every read guarded, every gap defaulted, intent documented. Code like this passes architect review on the first pass.",
      },
      {
        tone: "info",
        text: "In a real org you'd also move repeated guards into a reusable content block or SSJS helper to keep templates DRY.",
      },
    ],
  },
];
