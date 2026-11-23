/**
 * Progress shape and pure helpers shared by the browser store and the server API.
 * XP is always derived from what was completed, never trusted as a number.
 */

export const XP = { lesson: 50, quiz: 10, task: 30 } as const;

export interface ProgressState {
  version: 1;
  xp: number;
  /** lessonKey ("module/lesson") -> completedAt (ms) */
  lessons: Record<string, number>;
  /** quizId -> answered correctly (first answer counts) */
  quizzes: Record<string, boolean>;
  /** taskId -> completedAt (ms) */
  tasks: Record<string, number>;
  /** Local dates (YYYY-MM-DD) with any activity, for the streak. */
  days: string[];
}

export const EMPTY_PROGRESS: ProgressState = { version: 1, xp: 0, lessons: {}, quizzes: {}, tasks: {}, days: [] };

export function computeXp(s: Pick<ProgressState, "lessons" | "quizzes" | "tasks">) {
  return (
    Object.keys(s.lessons).length * XP.lesson +
    Object.values(s.quizzes).filter(Boolean).length * XP.quiz +
    Object.keys(s.tasks).length * XP.task
  );
}

const ID_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;
const LESSON_RE = /^[a-z0-9-]{1,60}\/[a-z0-9-]{1,60}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ENTRIES = 2000;
const MAX_DAYS = 400;

export const isItemId = (id: unknown): id is string => typeof id === "string" && ID_RE.test(id);
export const isLessonKey = (key: unknown): key is string => typeof key === "string" && LESSON_RE.test(key);
export const isDay = (d: unknown): d is string => typeof d === "string" && DAY_RE.test(d);

function pickRecord<T>(value: unknown, keyOk: (k: string) => boolean, valOk: (v: unknown) => v is T): Record<string, T> {
  const out: Record<string, T> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return out;
  let n = 0;
  for (const [k, v] of Object.entries(value)) {
    if (n >= MAX_ENTRIES) break;
    if (keyOk(k) && valOk(v)) {
      out[k] = v;
      n++;
    }
  }
  return out;
}

const isTimestamp = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;
const isBool = (v: unknown): v is boolean => typeof v === "boolean";

/** Coerces untrusted input (localStorage, request body, Firestore doc) into a valid state. */
export function sanitize(input: unknown): ProgressState {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const lessons = pickRecord(src.lessons, isLessonKey, isTimestamp);
  const quizzes = pickRecord(src.quizzes, isItemId, isBool);
  const tasks = pickRecord(src.tasks, isItemId, isTimestamp);
  const days = Array.isArray(src.days) ? [...new Set(src.days.filter(isDay))].sort().slice(-MAX_DAYS) : [];
  return { version: 1, lessons, quizzes, tasks, days, xp: computeXp({ lessons, quizzes, tasks }) };
}

/** Union of two progress states; earliest completion time wins, a correct quiz answer wins. */
export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const lessons = { ...b.lessons, ...a.lessons };
  for (const [k, t] of Object.entries(b.lessons)) if (a.lessons[k]) lessons[k] = Math.min(a.lessons[k], t);
  const tasks = { ...b.tasks, ...a.tasks };
  for (const [k, t] of Object.entries(b.tasks)) if (a.tasks[k]) tasks[k] = Math.min(a.tasks[k], t);
  const quizzes = { ...b.quizzes };
  for (const [k, v] of Object.entries(a.quizzes)) quizzes[k] = v || Boolean(b.quizzes[k]);
  const days = [...new Set([...a.days, ...b.days])].sort().slice(-MAX_DAYS);
  return { version: 1, lessons, quizzes, tasks, days, xp: computeXp({ lessons, quizzes, tasks }) };
}

export function localDay(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** A client-reported day is accepted only within one day of server UTC time (time zones). */
export function isPlausibleDay(day: string, now = Date.now()) {
  if (!isDay(day)) return false;
  const t = Date.parse(`${day}T12:00:00Z`);
  return Math.abs(t - now) <= 36 * 60 * 60 * 1000;
}

export type ProgressAction =
  | { type: "lesson"; key: string; day: string }
  | { type: "quiz"; id: string; correct: boolean; day: string }
  | { type: "task"; id: string; day: string }
  | { type: "merge"; state: unknown };

/** Applies one action to a state. Returns the same object if nothing changed. */
export function applyAction(state: ProgressState, action: Exclude<ProgressAction, { type: "merge" }>, now = Date.now()) {
  const next: ProgressState = {
    ...state,
    lessons: { ...state.lessons },
    quizzes: { ...state.quizzes },
    tasks: { ...state.tasks },
    days: [...state.days],
  };
  let changed = false;
  if (action.type === "lesson" && !next.lessons[action.key]) {
    next.lessons[action.key] = now;
    changed = true;
  } else if (action.type === "quiz" && !(action.id in next.quizzes)) {
    next.quizzes[action.id] = action.correct;
    changed = true;
  } else if (action.type === "task" && !next.tasks[action.id]) {
    next.tasks[action.id] = now;
    changed = true;
  }
  if (!next.days.includes(action.day)) {
    next.days = [...next.days, action.day].sort().slice(-MAX_DAYS);
    changed = true;
  }
  if (!changed) return state;
  next.xp = computeXp(next);
  return next;
}
