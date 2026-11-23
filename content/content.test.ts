import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { QuizQuestion, TaskDef } from "@/content/types";
import { course } from "@/content/uk/course";
import { glossary, glossaryById } from "@/content/uk/glossary";
import { validate } from "@/lib/validation";

/*
 * Sanity checks for every lesson listed in course.ts: the MDX file exists,
 * task solutions pass their own rules, quizzes are well-formed, ids are unique
 * and every <Term> / <Flashcards> id exists in the glossary.
 */

/** Extracts the JS literal that starts right after `marker` (balanced brackets). */
function extract(src: string, marker: string): string[] {
  const out: string[] = [];
  let from = 0;
  for (;;) {
    const at = src.indexOf(marker, from);
    if (at === -1) return out;
    const start = at + marker.length - 1;
    const open = src[start];
    const close = open === "{" ? "}" : "]";
    let depth = 0;
    let inStr: string | null = null;
    for (let i = start; i < src.length; i++) {
      const ch = src[i];
      if (inStr) {
        if (ch === "\\") i++;
        else if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
      else if (ch === open) depth++;
      else if (ch === close && --depth === 0) {
        out.push(src.slice(start, i + 1));
        from = i;
        break;
      }
    }
  }
}

const evalLiteral = <T,>(code: string): T => new Function(`return (${code});`)() as T;

describe("glossary", () => {
  it("has unique ids and one-line fields", () => {
    const ids = glossary.map(g => g.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    for (const g of glossary) expect(g.short && g.practice && g.full && g.abbr, g.id).toBeTruthy();
  });

  it("related ids exist", () => {
    const missing = glossary.flatMap(g => (g.related ?? []).filter(r => !glossaryById[r]).map(r => `${g.id} -> ${r}`));
    expect(missing).toEqual([]);
  });
});

const quizIds = new Set<string>();
const taskIds = new Set<string>();

for (const mod of course.modules) {
  for (const lesson of mod.lessons) {
    const file = join(process.cwd(), "content/uk", mod.slug, `${lesson.slug}.mdx`);

    describe(`${mod.slug}/${lesson.slug}`, () => {
      it("mdx file exists", () => expect(existsSync(file)).toBe(true));
      if (!existsSync(file)) return;

      const src = readFileSync(file, "utf8");
      const tasks = extract(src, "task={{").map(c => evalLiteral<TaskDef>(c));
      const quizzes = extract(src, "questions={[").flatMap(c => evalLiteral<QuizQuestion[]>(c));

      it("has a TL;DR, a task and a quiz", () => {
        expect(src).toContain("<TLDR>");
        expect(tasks.length).toBeGreaterThan(0);
        expect(quizzes.length).toBeGreaterThanOrEqual(4);
      });

      it("uses only known glossary ids", () => {
        const termIds = [...src.matchAll(/<Term\s+id="([^"]+)"/g)].map(m => m[1]);
        const cardIds = extract(src, "terms={[").flatMap(c => evalLiteral<string[]>(c));
        const unknown = [...termIds, ...cardIds].filter(id => !glossaryById[id]);
        expect(unknown).toEqual([]);
      });

      for (const task of tasks) {
        it(`task ${task.id}: solution passes, starter fails`, () => {
          expect(taskIds.has(task.id), `duplicate task id ${task.id}`).toBe(false);
          taskIds.add(task.id);
          expect(task.solution, "solution").toBeTruthy();
          const res = validate(task.rules, task.solution!);
          expect(res.results.filter(r => !r.passed).map(r => r.id)).toEqual([]);
          if (task.starter) expect(validate(task.rules, task.starter).passed).toBe(false);
        });
      }

      for (const q of quizzes) {
        it(`quiz ${q.id} is well-formed`, () => {
          expect(quizIds.has(q.id), `duplicate quiz id ${q.id}`).toBe(false);
          quizIds.add(q.id);
          if (q.type === "single") expect(q.options.filter(o => o.correct).length).toBe(1);
          if (q.type === "multi") expect(q.options.filter(o => o.correct).length).toBeGreaterThan(0);
          if (q.type === "order") expect(new Set(q.items).size).toBe(q.items.length);
          if (q.type === "findbug") q.bad.forEach(i => expect(q.lines[i]).toBeDefined());
          if (q.type === "match") expect(new Set(q.pairs.map(p => p[1])).size).toBe(q.pairs.length);
        });
      }
    });
  }
}
