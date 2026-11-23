import { describe, expect, it } from "vitest";
import { applyAction, computeXp, EMPTY_PROGRESS, isPlausibleDay, mergeProgress, sanitize } from "./model";

describe("progress model", () => {
  it("derives XP from completed items, ignoring a client-sent xp", () => {
    const s = sanitize({ xp: 99999, lessons: { "a/b": 1 }, quizzes: { q1: true, q2: false }, tasks: { t1: 2 } });
    expect(s.xp).toBe(50 + 10 + 30);
  });

  it("sanitize drops malformed keys and values", () => {
    const s = sanitize({
      lessons: { "a/b": 1, "../evil": 2, "x/y": "nope" },
      quizzes: { ok: true, "Bad Id": true, num: 1 },
      tasks: { t: -5 },
      days: ["2026-11-23", "2026-11-23", "yesterday"],
    });
    expect(Object.keys(s.lessons)).toEqual(["a/b"]);
    expect(Object.keys(s.quizzes)).toEqual(["ok"]);
    expect(s.tasks).toEqual({});
    expect(s.days).toEqual(["2026-11-23"]);
  });

  it("merge unions progress, keeps earliest time and a correct answer", () => {
    const a = sanitize({ lessons: { "m/a": 10 }, quizzes: { q: false }, days: ["2026-11-20"] });
    const b = sanitize({ lessons: { "m/a": 5, "m/b": 7 }, quizzes: { q: true }, tasks: { t: 3 }, days: ["2026-11-21"] });
    const m = mergeProgress(a, b);
    expect(m.lessons).toEqual({ "m/a": 5, "m/b": 7 });
    expect(m.quizzes.q).toBe(true);
    expect(m.days).toEqual(["2026-11-20", "2026-11-21"]);
    expect(m.xp).toBe(computeXp(m));
  });

  it("applyAction awards once and keeps the first quiz answer", () => {
    const day = "2026-11-23";
    let s = applyAction(EMPTY_PROGRESS, { type: "quiz", id: "q", correct: false, day });
    s = applyAction(s, { type: "quiz", id: "q", correct: true, day });
    expect(s.quizzes.q).toBe(false);
    const once = applyAction(s, { type: "lesson", key: "m/a", day });
    expect(applyAction(once, { type: "lesson", key: "m/a", day })).toBe(once);
    expect(once.xp).toBe(50);
  });

  it("accepts only days close to server time", () => {
    const now = Date.parse("2026-11-23T10:00:00Z");
    expect(isPlausibleDay("2026-11-23", now)).toBe(true);
    expect(isPlausibleDay("2026-11-24", now)).toBe(true);
    expect(isPlausibleDay("2026-11-30", now)).toBe(false);
  });
});
