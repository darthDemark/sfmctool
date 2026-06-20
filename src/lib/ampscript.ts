// A deliberately small AMPscript-ish interpreter for the prototype.
//
// It is NOT a real AMPscript engine, but it supports enough of the language
// to make the curriculum feel alive:
//   - SET assignments (literals, numbers, @refs, function calls)
//   - IF / ELSEIF / ELSE / ENDIF with comparisons + EMPTY()/NOT EMPTY()
//   - FOR @i = a TO b DO ... NEXT @i loops
//   - OutputLine() / Output()
//   - Lookup(), LookupRows(), RowCount(), Row(), Field(), Concat(), Empty()
//   - %%=v(@var)=%% and %%=<expr>=%% substitution in the body
//
// Everything runs against mock data only — no network, no real Marketing Cloud.

export type Contact = Record<string, string | number>;
export type DataRow = Record<string, string | number>;
export type Tables = Record<string, DataRow[]>;

type RowSet = { __kind: "rows"; rows: DataRow[] };
type RowObj = { __kind: "row"; row: DataRow };
type Value = string | number | RowSet | RowObj;

export type EvalResult = {
  output: string;
  vars: Record<string, string>;
  rawVars: Record<string, Value>;
  errors: string[];
};

type Ctx = {
  vars: Record<string, Value>;
  contact: Contact;
  tables: Tables;
  output: string;
  errors: string[];
};

function isRows(v: Value): v is RowSet {
  return typeof v === "object" && v !== null && (v as RowSet).__kind === "rows";
}
function isRow(v: Value): v is RowObj {
  return typeof v === "object" && v !== null && (v as RowObj).__kind === "row";
}

function toDisplay(v: Value): string {
  if (isRows(v)) return `[${v.rows.length} rows]`;
  if (isRow(v)) return `[row]`;
  return String(v);
}

function toNum(v: Value): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }
  if (isRows(v)) return v.rows.length;
  return 0;
}

function isEmpty(v: Value): boolean {
  if (v === "" || v === null || v === undefined) return true;
  if (isRows(v)) return v.rows.length === 0;
  return false;
}

function unescape(s: string): string {
  return s.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}

function findKey(obj: Record<string, unknown>, name: string): string | undefined {
  return Object.keys(obj).find((k) => k.toLowerCase() === name.toLowerCase());
}

// Split function arguments on top-level commas, respecting quotes + parens.
function splitArgs(input: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let inStr = false;
  let cur = "";
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === '"') inStr = !inStr;
    if (!inStr && ch === "(") depth++;
    if (!inStr && ch === ")") depth--;
    if (!inStr && depth === 0 && ch === ",") {
      args.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim() !== "") args.push(cur.trim());
  return args;
}

function resolve(raw: string, ctx: Ctx): Value {
  const token = raw.trim();

  // string literal
  const str = token.match(/^"([\s\S]*)"$/);
  if (str) return unescape(str[1]);

  // number
  if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);

  // function call
  const fn = token.match(/^(\w+)\s*\(([\s\S]*)\)$/);
  if (fn) {
    const name = fn[1].toLowerCase();
    const args = splitArgs(fn[2]);
    switch (name) {
      case "attributevalue": {
        const field = stripQuotes(args[0]);
        const key = findKey(ctx.contact, field);
        return key ? ctx.contact[key] : "";
      }
      case "v": {
        return resolve(args[0], ctx);
      }
      case "concat": {
        return args.map((a) => String(resolve(a, ctx))).join("");
      }
      case "lookup": {
        const [table, ret, matchField] = args.map(stripQuotes);
        const matchVal = String(resolve(args[3], ctx));
        const rows = ctx.tables[findKey(ctx.tables, table) ?? table] ?? [];
        const row = rows.find((r) => {
          const k = findKey(r, matchField);
          return k && String(r[k]) === matchVal;
        });
        if (!row) return "";
        const rk = findKey(row, ret);
        return rk ? row[rk] : "";
      }
      case "lookuprows": {
        const [table, matchField] = args.map(stripQuotes);
        const matchVal = String(resolve(args[2], ctx));
        const rows = ctx.tables[findKey(ctx.tables, table) ?? table] ?? [];
        return {
          __kind: "rows",
          rows: rows.filter((r) => {
            const k = findKey(r, matchField);
            return k && String(r[k]) === matchVal;
          }),
        };
      }
      case "rowcount": {
        const v = resolve(args[0], ctx);
        return isRows(v) ? v.rows.length : 0;
      }
      case "row": {
        const set = resolve(args[0], ctx);
        const idx = toNum(resolve(args[1], ctx));
        if (isRows(set) && set.rows[idx - 1])
          return { __kind: "row", row: set.rows[idx - 1] };
        return "";
      }
      case "field": {
        const row = resolve(args[0], ctx);
        const field = stripQuotes(args[1]);
        if (isRow(row)) {
          const k = findKey(row.row, field);
          return k ? row.row[k] : "";
        }
        return "";
      }
      case "empty": {
        return isEmpty(resolve(args[0], ctx)) ? "true" : "false";
      }
      case "iif": {
        return evalCondition(args[0], ctx)
          ? resolve(args[1], ctx)
          : resolve(args[2], ctx);
      }
      case "uppercase":
        return String(resolve(args[0], ctx)).toUpperCase();
      case "lowercase":
        return String(resolve(args[0], ctx)).toLowerCase();
      case "format":
        return String(resolve(args[0], ctx));
      default:
        ctx.errors.push(`Unknown function: ${fn[1]}()`);
        return "";
    }
  }

  // variable reference @name
  const ref = token.match(/^@(\w+)$/);
  if (ref) {
    const key = findKey(ctx.vars, ref[1]);
    return key !== undefined ? ctx.vars[key] : "";
  }

  return token;
}

function stripQuotes(s: string): string {
  return s.trim().replace(/^"([\s\S]*)"$/, "$1");
}

function compare(left: Value, op: string, right: Value): boolean {
  const ln = toNum(left);
  const rn = toNum(right);
  const numeric =
    (typeof left === "number" || /^-?\d+(\.\d+)?$/.test(String(left))) &&
    (typeof right === "number" || /^-?\d+(\.\d+)?$/.test(String(right)));
  switch (op) {
    case ">":
      return numeric ? ln > rn : false;
    case "<":
      return numeric ? ln < rn : false;
    case ">=":
      return numeric ? ln >= rn : false;
    case "<=":
      return numeric ? ln <= rn : false;
    case "==":
    case "=":
      return String(left) === String(right);
    case "!=":
      return String(left) !== String(right);
    default:
      return false;
  }
}

function evalCondition(expr: string, ctx: Ctx): boolean {
  const c = expr.trim();
  const notEmpty = c.match(/^NOT\s+EMPTY\s*\(([\s\S]+)\)$/i);
  if (notEmpty) return !isEmpty(resolve(notEmpty[1], ctx));
  const empty = c.match(/^EMPTY\s*\(([\s\S]+)\)$/i);
  if (empty) return isEmpty(resolve(empty[1], ctx));
  const cmp = c.match(/^([\s\S]+?)\s*(>=|<=|!=|==|=|>|<)\s*([\s\S]+)$/);
  if (cmp) return compare(resolve(cmp[1], ctx), cmp[2], resolve(cmp[3], ctx));
  const v = resolve(c, ctx);
  return v === "true" || (typeof v === "number" && v !== 0) || (typeof v === "string" && v !== "" && v !== "false");
}

type Branch = { cond?: string; body: string[] };

function isOpener(l: string): boolean {
  return /^IF\b[\s\S]*\bTHEN$/i.test(l) || /^FOR\b[\s\S]*\bDO$/i.test(l);
}
function isCloser(l: string): boolean {
  return /^ENDIF$/i.test(l) || /^NEXT\b/i.test(l);
}

function collectIf(lines: string[], start: number): { branches: Branch[]; next: number } {
  const branches: Branch[] = [];
  let cond: string | undefined = lines[start].match(/^IF\s+([\s\S]+?)\s+THEN$/i)![1];
  let body: string[] = [];
  let depth = 0;
  let i = start + 1;
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (isOpener(l)) {
      depth++;
      body.push(l);
      continue;
    }
    if (depth > 0) {
      if (isCloser(l)) depth--;
      body.push(l);
      continue;
    }
    const elif = l.match(/^ELSEIF\s+([\s\S]+?)\s+THEN$/i);
    if (elif) {
      branches.push({ cond, body });
      cond = elif[1];
      body = [];
      continue;
    }
    if (/^ELSE$/i.test(l)) {
      branches.push({ cond, body });
      cond = undefined;
      body = [];
      continue;
    }
    if (/^ENDIF$/i.test(l)) {
      branches.push({ cond, body });
      i++;
      break;
    }
    body.push(l);
  }
  return { branches, next: i };
}

function collectFor(lines: string[], start: number): { body: string[]; next: number } {
  const body: string[] = [];
  let depth = 0;
  let i = start + 1;
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (isOpener(l)) {
      depth++;
      body.push(l);
      continue;
    }
    if (depth > 0) {
      if (isCloser(l)) depth--;
      body.push(l);
      continue;
    }
    if (/^NEXT\b/i.test(l)) {
      i++;
      break;
    }
    body.push(l);
  }
  return { body, next: i };
}

function run(lines: string[], ctx: Ctx, guard = { steps: 0 }) {
  let i = 0;
  while (i < lines.length) {
    if (guard.steps++ > 20000) {
      ctx.errors.push("Execution stopped (possible infinite loop).");
      return;
    }
    const line = lines[i];
    const forM = line.match(/^FOR\s+@(\w+)\s*=\s*([\s\S]+?)\s+TO\s+([\s\S]+?)\s+DO$/i);
    if (/^IF\s+[\s\S]+\s+THEN$/i.test(line)) {
      const { branches, next } = collectIf(lines, i);
      for (const br of branches) {
        if (br.cond === undefined || evalCondition(br.cond, ctx)) {
          run(br.body, ctx, guard);
          break;
        }
      }
      i = next;
    } else if (forM) {
      const { body, next } = collectFor(lines, i);
      const startN = toNum(resolve(forM[2], ctx));
      const endN = toNum(resolve(forM[3], ctx));
      for (let k = startN; k <= endN; k++) {
        ctx.vars[forM[1]] = k;
        run(body, ctx, guard);
        if (guard.steps > 20000) break;
      }
      i = next;
    } else {
      execSimple(line, ctx);
      i++;
    }
  }
}

function execSimple(line: string, ctx: Ctx) {
  const setM = line.match(/^SET\s+@(\w+)\s*=\s*([\s\S]+)$/i);
  if (setM) {
    ctx.vars[setM[1]] = resolve(setM[2], ctx);
    return;
  }
  const outLine = line.match(/^OutputLine\s*\(([\s\S]*)\)$/i);
  if (outLine) {
    ctx.output += String(resolve(outLine[1], ctx)) + "\n";
    return;
  }
  const out = line.match(/^Output\s*\(([\s\S]*)\)$/i);
  if (out) {
    ctx.output += String(resolve(out[1], ctx));
    return;
  }
  if (line && !/^\/\//.test(line)) {
    ctx.errors.push(`Unrecognized statement: ${line}`);
  }
}

export function renderAmpscript(
  code: string,
  contact: Contact,
  tables: Tables = {}
): EvalResult {
  const ctx: Ctx = { vars: {}, contact, tables, output: "", errors: [] };

  const blockMatch = code.match(/%%\[([\s\S]*?)\]%%/);
  const block = blockMatch ? blockMatch[1] : "";

  // Strip block comments, then split + trim lines.
  const cleaned = block.replace(/\/\*[\s\S]*?\*\//g, "");
  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  run(lines, ctx);

  let body = code.replace(/%%\[[\s\S]*?\]%%/g, "");
  // Prepend any OutputLine content produced inside the block.
  body = (ctx.output ? ctx.output : "") + body;

  // Substitute %%= ... =%% expressions.
  body = body.replace(/%%=\s*([\s\S]+?)\s*=%%/g, (_m, expr: string) => {
    return String(resolve(expr.trim(), ctx));
  });

  body = body.trim();

  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(ctx.vars)) vars[k] = toDisplay(v);

  return { output: body, vars, rawVars: ctx.vars, errors: ctx.errors };
}
