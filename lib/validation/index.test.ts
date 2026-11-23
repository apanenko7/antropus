import { describe, expect, it } from "vitest";
import type { TaskRule } from "@/content/types";
import { checkRule, countWords, frontmatterKeys, pairedXmlTags, validate } from "./index";

const base = { id: "r", label: "l", hint: "h" };

describe("checkRule", () => {
  it("includesAny is case-insensitive by default", () => {
    const rule: TaskRule = { ...base, type: "includesAny", values: ["Аудиторія", "для кого"] };
    expect(checkRule(rule, "Текст ДЛЯ КОГО ми пишемо")).toBe(true);
    expect(checkRule(rule, "нічого")).toBe(false);
  });

  it("includesAll needs every value", () => {
    const rule: TaskRule = { ...base, type: "includesAll", values: ["a", "b"] };
    expect(checkRule(rule, "a b")).toBe(true);
    expect(checkRule(rule, "a")).toBe(false);
  });

  it("notIncludes fails on empty input", () => {
    const rule: TaskRule = { ...base, type: "notIncludes", values: ["щось"] };
    expect(checkRule(rule, "")).toBe(false);
    expect(checkRule(rule, "текст")).toBe(true);
    expect(checkRule(rule, "тут є щось")).toBe(false);
  });

  it("regex and notRegex", () => {
    expect(checkRule({ ...base, type: "regex", pattern: "\\d+\\s*(слів|речень)" }, "до 100 слів")).toBe(true);
    expect(checkRule({ ...base, type: "notRegex", pattern: "будь ласка" }, "Будь ласка, зроби")).toBe(false);
  });

  it("word limits", () => {
    expect(countWords("Привіт, як справи? it's ok")).toBe(5);
    expect(checkRule({ ...base, type: "minWords", value: 3 }, "один два")).toBe(false);
    expect(checkRule({ ...base, type: "maxWords", value: 3 }, "один два")).toBe(true);
    expect(checkRule({ ...base, type: "maxWords", value: 3 }, "")).toBe(false);
  });

  it("xml tags need open and close in order", () => {
    expect(checkRule({ ...base, type: "xmlTag", tag: "document" }, "<document>x</document>")).toBe(true);
    expect(checkRule({ ...base, type: "xmlTag", tag: "document" }, '<document source="a">x</document>')).toBe(true);
    expect(checkRule({ ...base, type: "xmlTag", tag: "document" }, "</document><document>")).toBe(false);
    expect(pairedXmlTags("<a>1</a><b>2</b><c>")).toEqual(["a", "b"]);
    expect(checkRule({ ...base, type: "xmlTagCount", min: 2 }, "<a>1</a><b>2</b>")).toBe(true);
  });

  it("headings", () => {
    const md = "# Проєкт\n\n## Команди\n- npm test";
    expect(checkRule({ ...base, type: "heading", values: ["команд"] }, md)).toBe(true);
    expect(checkRule({ ...base, type: "heading", values: ["стиль"] }, md)).toBe(false);
  });

  it("json rules accept fenced json", () => {
    const text = '```json\n{"name": "x", "tags": []}\n```';
    expect(checkRule({ ...base, type: "validJson" }, text)).toBe(true);
    expect(checkRule({ ...base, type: "jsonKeys", keys: ["name", "tags"] }, text)).toBe(true);
    expect(checkRule({ ...base, type: "jsonKeys", keys: ["id"] }, text)).toBe(false);
    expect(checkRule({ ...base, type: "validJson" }, "{oops}")).toBe(false);
  });

  it("frontmatter", () => {
    const skill = "---\nname: release\ndescription: Do a release\n---\n# Steps";
    expect(frontmatterKeys(skill)).toEqual(["name", "description"]);
    expect(checkRule({ ...base, type: "frontmatter", keys: ["name", "description"] }, skill)).toBe(true);
    expect(checkRule({ ...base, type: "frontmatter", keys: ["name"] }, "no frontmatter")).toBe(false);
  });
});

describe("validate", () => {
  it("scores and passes", () => {
    const rules: TaskRule[] = [
      { ...base, id: "a", type: "includesAny", values: ["x"] },
      { ...base, id: "b", type: "includesAny", values: ["y"] },
    ];
    expect(validate(rules, "x")).toMatchObject({ passed: false, score: 50 });
    expect(validate(rules, "x y")).toMatchObject({ passed: true, score: 100 });
  });

  it("a broken regex fails the rule instead of throwing", () => {
    const res = validate([{ ...base, type: "regex", pattern: "(" }], "text");
    expect(res.passed).toBe(false);
  });
});
