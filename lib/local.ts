/*
 * Small per-browser state (task drafts, quiz position). Separate from the
 * progress store: it is a convenience, never synced and never required.
 * Every access is guarded: storage can be missing or throw (private mode).
 */

import { useSyncExternalStore } from "react";

// Kept from the old name "Antropus": changing it would wipe guests' drafts and progress.
const PREFIX = "antropus:";

const noopSubscribe = () => () => {};

/**
 * Raw stored string for `key`, read after hydration (null on the server and
 * on the first client render). Components keep their own state once the
 * user acts; this is only the starting point.
 */
export function useLocalRaw(key: string): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return window.localStorage.getItem(PREFIX + key);
      } catch {
        return null;
      }
    },
    () => null,
  );
}

export function parseLocal<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readLocal<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable: keep working without it */
  }
}

export function removeLocal(key: string) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* storage unavailable */
  }
}

/** Removes every key this module wrote (drafts, quiz positions): used when an account is deleted. */
export function clearLocal() {
  try {
    const keys = Object.keys(window.localStorage).filter(k => k.startsWith(PREFIX));
    keys.forEach(k => window.localStorage.removeItem(k));
  } catch {
    /* storage unavailable */
  }
}
