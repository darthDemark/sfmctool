// A deliberately small AMPscript-ish evaluator for the prototype.
// It supports SET assignments (literals, numbers, AttributeValue),
// simple IF/ELSEIF/ELSE/ENDIF blocks with numeric/string comparisons,
// and %%=v(@var)=%% substitution in the body. Good enough to demo
// personalization without a real rendering engine.

export type Contact = Record<string, string | number>;

type EvalResult = {
  output: string;
  vars: Record<string, string | number>;
  errors: string[];
};

function resolveValue(
  raw: string,
  vars: Record<string, string | number>,
  contact: Contact
): string | number {
  const token = raw.trim();
  // string literal
  const str = token.match(/^"([\s\S]*)"$/);
  if (str) return str[1];
  // number
  if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);
  // AttributeValue("X")
  const attr = token.match(/^AttributeValue\(\s*"([^"]+)"\s*\)$/i);
  if (attr) {
    const key = Object.keys(contact).find(
      (k) => k.toLowerCase() === attr[1].toLowerCase()
    );
    return key ? contact[key] : "";
  }
  // variable reference
  const ref = token.match(/^@(\w+)$/);
  if (ref) {
    const key = Object.keys(vars).find(
      (k) => k.toLowerCase() === ref[1].toLowerCase()
    );
    return key ? vars[key] : "";
  }
  return token;
}

function compare(
  left: string | number,
  op: string,
  right: string | number
): boolean {
  const ln = typeof left === "number" ? left : parseFloat(left);
  const rn = typeof right === "number" ? right : parseFloat(right);
  const numeric = !isNaN(ln) && !isNaN(rn);
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

export function renderAmpscript(code: string, contact: Contact): EvalResult {
  const vars: Record<string, string | number> = {};
  const errors: string[] = [];

  // Extract logic block(s) and body.
  const blockMatch = code.match(/%%\[([\s\S]*?)\]%%/);
  const block = blockMatch ? blockMatch[1] : "";
  let body = code.replace(/%%\[[\s\S]*?\]%%/g, "").trim();

  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Evaluate with simple IF/ELSE handling via a branch stack.
  const branchStack: boolean[] = [];
  const branchTaken: boolean[] = [];
  const active = () => branchStack.every(Boolean);

  for (const line of lines) {
    const ifM = line.match(/^IF\s+(.+?)\s+(>=|<=|!=|==|=|>|<)\s+(.+?)\s+THEN$/i);
    const elseifM = line.match(
      /^ELSEIF\s+(.+?)\s+(>=|<=|!=|==|=|>|<)\s+(.+?)\s+THEN$/i
    );
    const elseM = /^ELSE$/i.test(line);
    const endM = /^ENDIF$/i.test(line);
    const setM = line.match(/^SET\s+@(\w+)\s*=\s*(.+)$/i);

    if (ifM) {
      const cond = compare(
        resolveValue(ifM[1], vars, contact),
        ifM[2],
        resolveValue(ifM[3], vars, contact)
      );
      branchStack.push(cond);
      branchTaken.push(cond);
    } else if (elseifM) {
      const already = branchTaken[branchTaken.length - 1];
      const cond =
        !already &&
        compare(
          resolveValue(elseifM[1], vars, contact),
          elseifM[2],
          resolveValue(elseifM[3], vars, contact)
        );
      branchStack[branchStack.length - 1] = cond;
      if (cond) branchTaken[branchTaken.length - 1] = true;
    } else if (elseM) {
      const already = branchTaken[branchTaken.length - 1];
      branchStack[branchStack.length - 1] = !already;
    } else if (endM) {
      branchStack.pop();
      branchTaken.pop();
    } else if (setM && active()) {
      vars[setM[1]] = resolveValue(setM[2], vars, contact);
    } else if (line && !/^SET/i.test(line) && active()) {
      errors.push(`Unrecognized statement: ${line}`);
    }
  }

  // Substitute %%=v(@var)=%% and %%=AttributeValue("x")=%%.
  body = body.replace(
    /%%=\s*v\(\s*@(\w+)\s*\)\s*=%%/gi,
    (_m, name: string) => {
      const key = Object.keys(vars).find(
        (k) => k.toLowerCase() === name.toLowerCase()
      );
      return key !== undefined ? String(vars[key]) : "";
    }
  );
  body = body.replace(
    /%%=\s*AttributeValue\(\s*"([^"]+)"\s*\)\s*=%%/gi,
    (_m, name: string) => {
      const key = Object.keys(contact).find(
        (k) => k.toLowerCase() === name.toLowerCase()
      );
      return key ? String(contact[key]) : "";
    }
  );

  return { output: body, vars, errors };
}
