"use client";

import { motion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useApp } from "@/components/providers";
import { CheckIcon, RestartIcon, XIcon } from "@/components/ui/icons";
import type { TaskDef } from "@/content/types";
import { btn, cn } from "@/lib/cn";
import { parseLocal, removeLocal, useLocalRaw, writeLocal } from "@/lib/local";
import { progress, useProgress } from "@/lib/progress/store";
import { countWords, validate } from "@/lib/validation";

const NL = "\n";

/** XML tags the task talks about (prompt, hints, solution), offered as one-tap inserts. */
function taskTags(task: TaskDef): string[] {
  const text = [task.prompt, task.placeholder, task.solution, ...task.rules.map(r => r.hint)].join(" ");
  const tags = new Set<string>();
  for (const r of task.rules) if (r.type === "xmlTag") tags.add(r.tag);
  for (const m of text.matchAll(/<([a-zA-Z][\w-]*)(?:\s[^<>]*)?>/g)) tags.add(m[1]);
  return [...tags].slice(0, 6);
}

/**
 * Hands-on task: the learner writes or fixes a prompt / config,
 * criteria light up live, "Check" shows hints for what's missing.
 */
export function Task({ task }: { task: TaskDef }) {
  const { t } = useApp();
  const { tasks } = useProgress();
  const id = useId();
  const starter = task.starter ?? "";
  const draftKey = `task-draft:${task.id}`;
  // The saved draft (read after hydration) is the starting value until the learner types.
  const stored = parseLocal<string>(useLocalRaw(draftKey));
  const [edited, setEdited] = useState<string | null>(null);
  const value = edited ?? (typeof stored === "string" ? stored : starter);
  const [checked, setChecked] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const tags = useMemo(() => (task.mono ? [] : taskTags(task)), [task]);

  const setValue = (next: string) => {
    setEdited(next);
    if (next === starter) removeLocal(draftKey);
    else writeLocal(draftKey, next);
  };

  useEffect(() => {
    const el = inputRef.current;
    if (el && pendingCaret.current !== null) {
      el.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  }, [value]);

  /** Wrap the selection in <tag>…</tag>, or insert an empty pair with the caret inside. */
  const insertTag = (tag: string) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const head = `${before}${before && !before.endsWith(NL) ? NL : ""}<${tag}>${NL}${selected}`;
    pendingCaret.current = head.length;
    setValue(`${head}${NL}</${tag}>${value.slice(end)}`);
    setChecked(false);
    el?.focus();
  };

  const [showSolution, setShowSolution] = useState(false);
  const live = useMemo(() => validate(task.rules, value), [task.rules, value]);
  const doneBefore = Boolean(tasks[task.id]);

  const onCheck = () => {
    setChecked(true);
    if (live.passed) progress.completeTask(task.id);
  };

  return (
    <section aria-labelledby={`${id}-title`} className="card not-prose relative my-8 overflow-hidden p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-accent">
          {t.task.label}
        </span>
        {doneBefore ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
            <CheckIcon size={14} /> {t.common.completed}
          </span>
        ) : null}
      </div>
      <h3 id={`${id}-title`} className="mt-3 text-lg sm:text-xl">
        {task.title}
      </h3>
      <p className="mt-2 text-[0.98rem] whitespace-pre-line text-muted">{task.prompt}</p>

      <label htmlFor={`${id}-input`} className="sr-only">
        {t.task.yourAnswer}
      </label>
      {tags.length ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">{t.task.insertTag}:</span>
          {tags.map(tag => (
            <button
              key={tag}
              type="button"
              // Keep focus (and the phone keyboard) on the textarea.
              onMouseDown={e => e.preventDefault()}
              onClick={() => insertTag(tag)}
              className="min-h-9 rounded-full border border-accent/40 bg-accent-soft px-3 font-mono text-sm text-accent transition hover:bg-accent hover:text-on-accent active:scale-95"
            >
              {`<${tag}>`}
            </button>
          ))}
        </div>
      ) : null}
      <textarea
        ref={inputRef}
        id={`${id}-input`}
        value={value}
        onChange={e => {
          setValue(e.target.value);
          setChecked(false);
        }}
        placeholder={task.placeholder}
        spellCheck={!task.mono}
        rows={8}
        className={cn(
          "pressed mt-4 block w-full resize-y rounded-2xl border border-line p-4 text-[0.95rem] leading-relaxed text-fg placeholder:text-muted/70 [field-sizing:content] min-h-44 max-h-[70vh]",
          task.mono && "font-mono text-sm",
        )}
      />
      <p className="mt-1.5 flex justify-between gap-3 text-xs text-muted">
        <span>{t.task.draftSaved}</span>
        <span className="tabular-nums">{countWords(value)} слів</span>
      </p>

      <div className="mt-3">
        <p className="text-sm font-bold uppercase tracking-wider text-muted">{t.task.criteria}</p>
        <ul className="mt-2 grid gap-2">
          {live.results.map(r => {
            const showFail = checked && !r.passed;
            return (
              <li key={r.id} className="text-[0.95rem]">
                <div className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full transition",
                      r.passed ? "bg-success text-bg" : showFail ? "bg-danger text-bg" : "bg-surface-3 text-muted",
                    )}
                    aria-hidden="true"
                  >
                    {r.passed ? <CheckIcon size={14} strokeWidth={3} /> : showFail ? <XIcon size={14} strokeWidth={3} /> : null}
                  </span>
                  <span className={cn(r.passed && "text-fg", !r.passed && "text-muted")}>
                    {r.label}
                    <span className="sr-only">{r.passed ? " — виконано" : " — ще ні"}</span>
                  </span>
                </div>
                {showFail ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="ml-8.5 mt-1 text-sm text-danger"
                  >
                    {r.hint}
                  </motion.p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {checked ? (
        <div
          role="status"
          className={cn(
            "mt-5 rounded-2xl border p-4 font-bold",
            live.passed ? "border-success/40 bg-success-soft text-success" : "border-danger/40 bg-danger-soft text-danger",
          )}
        >
          {live.passed ? `🎉 ${t.task.passed}` : `${t.task.failed} (${live.score}%)`}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={cn(btn.base, btn.subtle, "px-3")}
            onClick={() => {
              setValue(task.starter ?? "");
              setChecked(false);
            }}
          >
            <RestartIcon size={18} /> {t.task.reset}
          </button>
          {task.solution && (checked || doneBefore) ? (
            <button type="button" className={cn(btn.base, btn.subtle, "px-3")} onClick={() => setShowSolution(s => !s)} aria-expanded={showSolution}>
              {showSolution ? t.task.hideSolution : t.task.showSolution}
            </button>
          ) : null}
        </div>
        <button type="button" className={cn(btn.base, btn.primary)} onClick={onCheck} disabled={!value.trim()}>
          {t.task.check}
        </button>
      </div>

      {showSolution && task.solution ? (
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-line bg-[#141518] p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {task.solution}
        </pre>
      ) : null}
    </section>
  );
}
