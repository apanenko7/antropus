"use client";

import { useSyncExternalStore } from "react";
import { applyAction, EMPTY_PROGRESS, localDay, sanitize, type ProgressAction, type ProgressState } from "@/lib/progress/model";

export { XP } from "@/lib/progress/model";
export type { ProgressState } from "@/lib/progress/model";

/**
 * Progress store. Guests keep progress in localStorage; when signed in, every
 * action is applied optimistically and sent to the server (see AuthProvider),
 * and the Firestore snapshot replaces the local state.
 */

// Storage key kept from the old name "Antropus" so guests keep their progress.
const KEY = "antropus:progress:v1";

let state: ProgressState = EMPTY_PROGRESS;
let loaded = false;
const listeners = new Set<() => void>();
let syncer: ((action: Exclude<ProgressAction, { type: "merge" }>) => void) | null = null;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = sanitize(JSON.parse(raw));
  } catch {
    // Storage unavailable (private mode, blocked): keep in-memory state.
  }
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Ignore: progress just won't persist locally.
  }
}

function emit() {
  listeners.forEach(l => l());
}

export interface XpEventDetail {
  amount: number;
  reason: string;
}

function run(action: Exclude<ProgressAction, { type: "merge" }>) {
  load();
  const before = state;
  const next = applyAction(state, action);
  if (next === before) return;
  state = next;
  save();
  emit();
  const gained = next.xp - before.xp;
  if (gained > 0) {
    window.dispatchEvent(new CustomEvent<XpEventDetail>("antropus:xp", { detail: { amount: gained, reason: action.type } }));
  }
  syncer?.(action);
}

export const progress = {
  completeLesson(key: string) {
    run({ type: "lesson", key, day: localDay() });
  },
  recordQuiz(id: string, correct: boolean) {
    run({ type: "quiz", id, correct, day: localDay() });
  },
  completeTask(id: string) {
    run({ type: "task", id, day: localDay() });
  },
  /** Replace the whole state (from the server). */
  replace(next: ProgressState) {
    load();
    state = sanitize(next);
    save();
    emit();
  },
  /** Current state snapshot (for merging guest progress on sign-in). */
  get(): ProgressState {
    load();
    return state;
  },
  /** Called by AuthProvider: forwards actions to the server while signed in. */
  setSyncer(fn: typeof syncer) {
    syncer = fn;
  },
  reset() {
    state = EMPTY_PROGRESS;
    save();
    emit();
  },
};

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      state = EMPTY_PROGRESS;
      load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return EMPTY_PROGRESS;
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Consecutive active days ending today or yesterday. */
export function streak(days: string[]) {
  // Server snapshot is always empty: return before touching the clock.
  if (!days.length) return 0;
  const set = new Set(days);
  const d = new Date();
  if (!set.has(localDay(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(localDay(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function level(xp: number) {
  // 200 XP per level, simple and predictable.
  const lvl = Math.floor(xp / 200) + 1;
  return { level: lvl, into: xp % 200, needed: 200 };
}
