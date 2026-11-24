"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { ArrowRightIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, RestartIcon, XIcon } from "@/components/ui/icons";
import { ProgressRing } from "@/components/ui/ProgressRing";
import type { QuizQuestion } from "@/content/types";
import { btn, cn } from "@/lib/cn";
import { parseLocal, removeLocal, useLocalRaw, writeLocal } from "@/lib/local";
import { progress } from "@/lib/progress/store";

/* Deterministic shuffle so server and client render the same order. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function seededShuffle<T>(items: T[], seed: string): T[] {
  const a = [...items];
  let x = hash(seed) || 1;
  for (let i = a.length - 1; i > 0; i--) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    const j = (x >>> 0) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

type Status = "idle" | "correct" | "wrong";

export function Quiz({ questions, title }: { questions: QuizQuestion[]; title?: string }) {
  const { t } = useApp();
  const total = questions.length;
  const [round, setRound] = useState(0);
  // Position is remembered per quiz, so a refresh continues where the learner stopped.
  const storeKey = `quiz:${questions.map(q => q.id).join(",")}`;
  const raw = useLocalRaw(storeKey);
  const saved = useMemo(() => {
    const s = parseLocal<{ results: boolean[] }>(raw);
    return Array.isArray(s?.results) ? s.results.slice(0, total).map(Boolean) : [];
  }, [raw, total]);
  const [own, setOwn] = useState<{ index: number; results: boolean[] } | null>(null);
  // An answered question is not shown again after a refresh: continue with the next one.
  const { index, results } = own ?? { index: saved.length, results: saved };
  const done = index >= total;
  const score = results.filter(Boolean).length;

  const update = (next: { index: number; results: boolean[] }) => {
    setOwn(next);
    if (next.results.length) writeLocal(storeKey, { results: next.results });
    else removeLocal(storeKey);
  };

  const onAnswered = (correct: boolean) => {
    const q = questions[index];
    progress.recordQuiz(q.id, correct);
    const next = [...results];
    next[index] = correct;
    update({ index, results: next });
  };

  return (
    <section
      aria-label={title ?? t.quiz.question}
      className="card not-prose relative my-8 overflow-hidden p-5 sm:p-7"
    >
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden="true" />
      <div className="relative flex items-center justify-between gap-3">
        <p className="font-hand text-2xl leading-none text-accent">{title ?? "Квіз"}</p>
        {!done && total > 1 ? (
          <div className="flex gap-1.5" aria-hidden="true">
            {questions.map((q, i) => (
              <span
                key={q.id}
                className={cn(
                  "h-1.5 w-5 rounded-full transition",
                  i < index ? (results[i] ? "bg-success" : "bg-danger") : i === index ? "bg-accent" : "bg-surface-3",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {done ? (
        <div className="relative flex flex-col items-center py-4 text-center">
          <ProgressRing value={score / total} size={96} stroke={7} label={`${score} ${t.quiz.of} ${total}`}>
            <span className="text-xl">
              {score}/{total}
            </span>
          </ProgressRing>
          <p className="mt-4 font-display text-lg font-semibold">{t.quiz.score}</p>
          <p className="mt-1 text-muted">
            {score === total ? "Ідеально! 🔥" : score >= total / 2 ? "Непогано — переглянь пояснення до помилок." : "Варто перечитати розділ і спробувати ще."}
          </p>
          <button
            type="button"
            className={cn(btn.base, btn.ghost, "mt-5")}
            onClick={() => {
              update({ index: 0, results: [] });
              setRound(r => r + 1);
            }}
          >
            <RestartIcon size={18} /> {t.quiz.restart}
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${round}-${index}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="relative"
          >
            <QuestionView
              q={questions[index]}
              number={index + 1}
              total={total}
              onAnswered={onAnswered}
              onNext={() => update({ index: index + 1, results })}
              isLast={index === total - 1}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}

function QuestionView({
  q,
  number,
  total,
  onAnswered,
  onNext,
  isLast,
}: {
  q: QuizQuestion;
  number: number;
  total: number;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const { t } = useApp();
  const [status, setStatus] = useState<Status>("idle");

  const finish = (correct: boolean) => {
    setStatus(correct ? "correct" : "wrong");
    onAnswered(correct);
  };

  const hint =
    q.type === "multi"
      ? t.quiz.selectAll
      : q.type === "order"
        ? t.quiz.orderHint
        : q.type === "findbug"
          ? t.quiz.tapBad
          : q.type === "match"
            ? t.quiz.matchHint
            : t.quiz.selectOne;

  return (
    <div>
      <div className="mt-4 flex flex-col items-center text-center">
        <ProgressRing value={number / total} size={64} label={`${t.quiz.question} ${number} ${t.quiz.of} ${total}`}>
          <span className="text-lg">{number}</span>
        </ProgressRing>
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted">
          {String(number).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="mt-3 max-w-xl text-lg sm:text-xl">{q.question}</h3>
        <p className="mt-1.5 text-sm text-muted">{hint}</p>
      </div>

      {q.code ? (
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-line bg-[#141518] p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {q.code}
        </pre>
      ) : null}

      <div className="mt-5">
        {q.type === "single" || q.type === "truefalse" ? (
          <SingleBody q={q} status={status} onFinish={finish} />
        ) : q.type === "multi" ? (
          <MultiBody q={q} status={status} onFinish={finish} />
        ) : q.type === "order" ? (
          <OrderBody q={q} status={status} onFinish={finish} />
        ) : q.type === "findbug" ? (
          <FindBugBody q={q} status={status} onFinish={finish} />
        ) : (
          <MatchBody q={q} status={status} onFinish={finish} />
        )}
      </div>

      {status !== "idle" ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className={cn(
            "mt-5 rounded-2xl border p-4",
            status === "correct" ? "border-success/40 bg-success-soft" : "border-danger/40 bg-danger-soft",
          )}
        >
          <p className={cn("flex items-center gap-2 font-bold", status === "correct" ? "text-success" : "text-danger")}>
            {status === "correct" ? <CheckIcon size={20} /> : <XIcon size={20} />}
            {status === "correct" ? t.quiz.correct : t.quiz.wrong}
          </p>
          <p className="mt-1.5 text-[0.95rem]">{q.explain}</p>
        </motion.div>
      ) : null}

      {status !== "idle" ? (
        <div className="mt-5 flex justify-end">
          <button type="button" className={cn(btn.base, btn.primary)} onClick={onNext}>
            {isLast ? t.quiz.finish : t.common.next} <ArrowRightIcon size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function optionClass(state: "idle" | "selected" | "correct" | "wrong" | "missed" | "dim") {
  return cn(
    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[0.98rem] transition min-h-14",
    state === "idle" && "border-transparent bg-surface-2 shadow-raised hover:bg-surface-3",
    state === "selected" && "border-accent bg-surface-2 shadow-pressed",
    state === "correct" && "border-success bg-success-soft",
    state === "wrong" && "border-danger bg-danger-soft",
    state === "missed" && "border-success/60 border-dashed bg-surface-2",
    state === "dim" && "border-transparent bg-surface-2 opacity-60",
  );
}

function Letter({ i, state }: { i: number; state?: string }) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
        state === "correct" ? "bg-success text-bg" : state === "wrong" ? "bg-danger text-bg" : "bg-surface text-accent",
      )}
      aria-hidden="true"
    >
      {LETTERS[i]}
    </span>
  );
}

interface BodyProps<Q> {
  q: Q;
  status: Status;
  onFinish: (correct: boolean) => void;
}

function SingleBody({ q, status, onFinish }: BodyProps<Extract<QuizQuestion, { type: "single" | "truefalse" }>>) {
  const { t } = useApp();
  const options = useMemo(
    () =>
      q.type === "truefalse"
        ? [
            { text: t.quiz.true, correct: q.answer },
            { text: t.quiz.false, correct: !q.answer },
          ]
        : seededShuffle(q.options, q.id),
    [q, t],
  );
  const [picked, setPicked] = useState<number | null>(null);
  const answered = status !== "idle";

  return (
    <ul className={cn("grid gap-3", q.type === "truefalse" && "grid-cols-2")}>
      {options.map((o, i) => {
        const state = !answered
          ? "idle"
          : o.correct
            ? "correct"
            : picked === i
              ? "wrong"
              : "dim";
        return (
          <li key={o.text}>
            <button
              type="button"
              disabled={answered}
              className={cn(optionClass(state), q.type === "truefalse" && "justify-center font-semibold")}
              onClick={() => {
                setPicked(i);
                onFinish(Boolean(o.correct));
              }}
            >
              {q.type === "single" ? <Letter i={i} state={state} /> : null}
              <span>{o.text}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MultiBody({ q, status, onFinish }: BodyProps<Extract<QuizQuestion, { type: "multi" }>>) {
  const { t } = useApp();
  const options = useMemo(() => seededShuffle(q.options, q.id), [q]);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const answered = status !== "idle";

  return (
    <>
      <ul className="grid gap-3">
        {options.map((o, i) => {
          const sel = picked.has(i);
          const state = !answered
            ? sel
              ? "selected"
              : "idle"
            : o.correct && sel
              ? "correct"
              : !o.correct && sel
                ? "wrong"
                : o.correct
                  ? "missed"
                  : "dim";
          return (
            <li key={o.text}>
              <button
                type="button"
                role="checkbox"
                aria-checked={sel}
                disabled={answered}
                className={optionClass(state)}
                onClick={() =>
                  setPicked(p => {
                    const n = new Set(p);
                    if (n.has(i)) n.delete(i);
                    else n.add(i);
                    return n;
                  })
                }
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-md border-2",
                    sel ? "border-accent bg-accent text-on-accent" : "border-line",
                  )}
                  aria-hidden="true"
                >
                  {sel ? <CheckIcon size={14} strokeWidth={3} /> : null}
                </span>
                <span>{o.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {!answered ? (
        <CheckButton
          disabled={picked.size === 0}
          label={t.quiz.check}
          onClick={() => onFinish(options.every((o, i) => Boolean(o.correct) === picked.has(i)))}
        />
      ) : null}
    </>
  );
}

function OrderBody({ q, status, onFinish }: BodyProps<Extract<QuizQuestion, { type: "order" }>>) {
  const { t } = useApp();
  const initial = useMemo(() => {
    let s = seededShuffle(q.items, q.id);
    if (s.every((x, i) => x === q.items[i])) s = [...s.slice(1), s[0]];
    return s;
  }, [q]);
  const [items, setItems] = useState(initial);
  const answered = status !== "idle";

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems(list => {
      const n = [...list];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  };

  return (
    <>
      <ol className="grid gap-2.5" aria-label={t.quiz.orderHint}>
        {items.map((item, i) => {
          const ok = answered && item === q.items[i];
          return (
            <motion.li layout key={item} className={cn(optionClass(answered ? (ok ? "correct" : "wrong") : "idle"), "py-2 pr-2")}>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface font-bold text-accent" aria-hidden="true">
                {i + 1}
              </span>
              <span className="flex-1">{item}</span>
              {!answered ? (
                <span className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-lg bg-surface text-muted hover:text-accent disabled:opacity-30"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`${t.quiz.moveUp}: ${item}`}
                  >
                    <ChevronUpIcon size={18} />
                  </button>
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-lg bg-surface text-muted hover:text-accent disabled:opacity-30"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label={`${t.quiz.moveDown}: ${item}`}
                  >
                    <ChevronDownIcon size={18} />
                  </button>
                </span>
              ) : null}
            </motion.li>
          );
        })}
      </ol>
      {answered && status === "wrong" ? (
        <p className="mt-3 text-sm text-muted">
          Правильно: {q.items.map((x, i) => `${i + 1}) ${x}`).join("  ")}
        </p>
      ) : null}
      {!answered ? (
        <CheckButton label={t.quiz.check} onClick={() => onFinish(items.every((x, i) => x === q.items[i]))} />
      ) : null}
    </>
  );
}

function FindBugBody({ q, status, onFinish }: BodyProps<Extract<QuizQuestion, { type: "findbug" }>>) {
  const { t } = useApp();
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const answered = status !== "idle";
  const bad = new Set(q.bad);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-line bg-[#141518] font-mono text-sm">
        {q.lines.map((line, i) => {
          const sel = picked.has(i);
          const state = !answered ? (sel ? "sel" : "idle") : bad.has(i) ? (sel ? "hit" : "missed") : sel ? "wrong" : "idle";
          return (
            <button
              key={i}
              type="button"
              role="checkbox"
              aria-checked={sel}
              disabled={answered}
              onClick={() =>
                setPicked(p => {
                  const n = new Set(p);
                  if (n.has(i)) n.delete(i);
                  else n.add(i);
                  return n;
                })
              }
              className={cn(
                "flex w-full gap-3 border-l-4 px-3 py-2.5 text-left whitespace-pre-wrap transition",
                state === "idle" && "border-transparent hover:bg-surface-2",
                state === "sel" && "border-accent bg-accent-soft",
                state === "hit" && "border-success bg-success-soft",
                state === "missed" && "border-success border-dashed bg-surface-2",
                state === "wrong" && "border-danger bg-danger-soft",
              )}
            >
              <span className="w-5 shrink-0 text-right text-muted select-none" aria-hidden="true">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">{line || " "}</span>
            </button>
          );
        })}
      </div>
      {!answered ? (
        <CheckButton
          disabled={picked.size === 0}
          label={t.quiz.check}
          onClick={() => onFinish(picked.size === bad.size && [...picked].every(i => bad.has(i)))}
        />
      ) : null}
    </>
  );
}

function MatchBody({ q, status, onFinish }: BodyProps<Extract<QuizQuestion, { type: "match" }>>) {
  const { t } = useApp();
  const rights = useMemo(() => seededShuffle(q.pairs.map(p => p[1]), q.id), [q]);
  const [choice, setChoice] = useState<string[]>(() => q.pairs.map(() => ""));
  const answered = status !== "idle";

  return (
    <>
      <ul className="grid gap-3">
        {q.pairs.map(([left, right], i) => {
          const ok = choice[i] === right;
          return (
            <li
              key={left}
              className={cn(
                optionClass(answered ? (ok ? "correct" : "wrong") : choice[i] ? "selected" : "idle"),
                "flex-col items-stretch gap-2 sm:flex-row sm:items-center",
              )}
            >
              <span className="font-semibold sm:w-2/5">{left}</span>
              <label className="sr-only" htmlFor={`${q.id}-${i}`}>
                {left}
              </label>
              <select
                id={`${q.id}-${i}`}
                value={choice[i]}
                disabled={answered}
                onChange={e =>
                  setChoice(c => {
                    const n = [...c];
                    n[i] = e.target.value;
                    return n;
                  })
                }
                className="min-h-11 w-full flex-1 rounded-xl border border-line bg-surface px-3 text-[0.95rem] text-fg"
              >
                <option value="">— обери —</option>
                {rights.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {answered && !ok ? <span className="text-sm text-success">→ {right}</span> : null}
            </li>
          );
        })}
      </ul>
      {!answered ? (
        <CheckButton
          disabled={choice.some(c => !c)}
          label={t.quiz.check}
          onClick={() => onFinish(q.pairs.every(([, r], i) => choice[i] === r))}
        />
      ) : null}
    </>
  );
}

function CheckButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <div className="mt-5 flex justify-end">
      <button type="button" className={cn(btn.base, btn.primary)} onClick={onClick} disabled={disabled}>
        {label}
      </button>
    </div>
  );
}
