import type { TaskRule } from "@/content/types";

export interface RuleResult {
  id: string;
  label: string;
  hint: string;
  passed: boolean;
}

export interface ValidationResult {
  passed: boolean;
  /** 0..100 */
  score: number;
  results: RuleResult[];
}

function norm(text: string, caseSensitive?: boolean) {
  return caseSensitive ? text : text.toLocaleLowerCase("uk");
}

export function countWords(text: string) {
  const words = text.trim().match(/[\p{L}\p{N}][\p{L}\p{N}'’\-_.]*/gu);
  return words ? words.length : 0;
}

function hasXmlTag(text: string, tag: string) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const open = new RegExp(`<${escaped}(\\s[^>]*)?>`, "i");
  const close = new RegExp(`</${escaped}\\s*>`, "i");
  const openMatch = open.exec(text);
  const closeMatch = close.exec(text);
  return Boolean(openMatch && closeMatch && closeMatch.index > openMatch.index);
}

/** Distinct tag names that have both an opening and a closing tag. */
export function pairedXmlTags(text: string) {
  const names = new Set<string>();
  for (const m of text.matchAll(/<([a-zA-Z][\w-]*)(\s[^>]*)?>/g)) names.add(m[1].toLowerCase());
  return [...names].filter(name => hasXmlTag(text, name));
}

function parseJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(trimmed);
}

/** Parses a leading YAML frontmatter block into top-level keys (simple `key: value` lines only). */
export function frontmatterKeys(text: string): string[] | null {
  const m = /^\s*---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return null;
  const keys: string[] = [];
  for (const line of m[1].split(/\r?\n/)) {
    const km = /^([A-Za-z_][\w-]*)\s*:\s*\S/.exec(line);
    if (km) keys.push(km[1]);
  }
  return keys;
}

function headingTexts(text: string) {
  return [...text.matchAll(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm)].map(m => m[1]);
}

export function checkRule(rule: TaskRule, input: string): boolean {
  const text = norm(input, rule.caseSensitive);
  const val = (v: string) => norm(v, rule.caseSensitive);

  switch (rule.type) {
    case "includesAny":
      return rule.values.some(v => text.includes(val(v)));
    case "includesAll":
      return rule.values.every(v => text.includes(val(v)));
    case "notIncludes":
      return input.trim().length > 0 && !rule.values.some(v => text.includes(val(v)));
    case "regex":
      return new RegExp(rule.pattern, rule.flags ?? (rule.caseSensitive ? "mu" : "imu")).test(input);
    case "notRegex":
      return input.trim().length > 0 && !new RegExp(rule.pattern, rule.flags ?? (rule.caseSensitive ? "mu" : "imu")).test(input);
    case "minWords":
      return countWords(input) >= rule.value;
    case "maxWords":
      return input.trim().length > 0 && countWords(input) <= rule.value;
    case "xmlTag":
      return hasXmlTag(input, rule.tag);
    case "xmlTagCount":
      return pairedXmlTags(input).length >= rule.min;
    case "heading": {
      const heads = headingTexts(input).map(h => val(h));
      return rule.values.some(v => heads.some(h => h.includes(val(v))));
    }
    case "validJson":
      try {
        parseJson(input);
        return true;
      } catch {
        return false;
      }
    case "jsonKeys":
      try {
        const data = parseJson(input);
        if (!data || typeof data !== "object") return false;
        const target = Array.isArray(data) ? data[0] : data;
        return Boolean(target) && typeof target === "object" && rule.keys.every(k => k in (target as object));
      } catch {
        return false;
      }
    case "frontmatter": {
      const keys = frontmatterKeys(input);
      return keys !== null && rule.keys.every(k => keys.includes(k));
    }
  }
}

export function validate(rules: TaskRule[], input: string): ValidationResult {
  const results = rules.map(rule => {
    let passed = false;
    try {
      passed = checkRule(rule, input);
    } catch {
      passed = false;
    }
    return { id: rule.id, label: rule.label, hint: rule.hint, passed };
  });
  const ok = results.filter(r => r.passed).length;
  return {
    passed: results.length > 0 && ok === results.length,
    score: results.length ? Math.round((ok / results.length) * 100) : 0,
    results,
  };
}
