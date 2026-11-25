"use client";

import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getFirebase } from "@/lib/firebase/client";
import { clearLocal } from "@/lib/local";
import type { ProgressAction, ProgressState } from "@/lib/progress/model";
import { progress } from "@/lib/progress/store";

/** "synced" = server is saving progress; "local" = server sync unavailable, browser only. */
type SyncStatus = "idle" | "syncing" | "synced" | "local" | "error";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  sync: SyncStatus;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
  /** Deletes the account and its progress on the server, then clears this browser. Resolves false on failure. */
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function postProgress(user: User, body: ProgressAction): Promise<{ status: number; state?: ProgressState }> {
  const token = await user.getIdToken();
  const res = await fetch("/api/progress", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { status: res.status };
  const data = (await res.json()) as { state: ProgressState };
  return { status: res.status, state: data.state };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [sync, setSync] = useState<SyncStatus>("idle");
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    const { auth, db } = getFirebase();
    auth.languageCode = "uk";
    let unsubDoc: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async current => {
      unsubDoc?.();
      unsubDoc = null;
      setUser(current);
      setReady(true);

      if (!current) {
        progress.setSyncer(null);
        setSync("idle");
        return;
      }

      // 1. Merge guest progress into the account.
      setSync("syncing");
      try {
        const res = await postProgress(current, { type: "merge", state: progress.get() });
        if (res.state) {
          progress.replace(res.state);
          setSync("synced");
        } else {
          setSync(res.status === 503 ? "local" : "error");
          return;
        }
      } catch {
        setSync("error");
        return;
      }

      // 2. Forward every new action to the server, one at a time.
      progress.setSyncer(action => {
        queue.current = queue.current
          .then(() => postProgress(current, action))
          .then(res => {
            if (res.state) progress.replace(res.state);
            setSync(res.state ? "synced" : "error");
          })
          .catch(() => setSync("error"));
      });

      // 3. Live updates from other devices.
      unsubDoc = onSnapshot(
        doc(db, "users", current.uid),
        snap => {
          if (snap.exists() && !snap.metadata.hasPendingWrites) progress.replace(snap.data() as ProgressState);
        },
        () => {
          // Rules not published yet or offline: server responses still keep state in sync.
        },
      );
    });

    return () => {
      unsubDoc?.();
      unsubAuth();
      progress.setSyncer(null);
    };
  }, []);

  const signIn = useCallback(async () => {
    const { auth } = getFirebase();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
        await signInWithRedirect(auth, provider);
      } else if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        console.error(e);
      }
    }
  }, []);

  const signOutUser = useCallback(async () => {
    progress.setSyncer(null);
    await signOut(getFirebase().auth);
    // The account's progress stays in the cloud; this browser goes back to a clean guest state.
    progress.reset();
  }, []);

  const deleteAccount = useCallback(async () => {
    const current = getFirebase().auth.currentUser;
    if (!current) return false;
    // Stop forwarding actions first, so a queued write can't recreate the deleted document.
    progress.setSyncer(null);
    try {
      const token = await current.getIdToken();
      const res = await fetch("/api/account", { method: "DELETE", headers: { authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setSync("error");
      return false;
    }
    // The Auth user is already gone on the server; signing out drops the cached session.
    await signOut(getFirebase().auth).catch(() => {});
    clearLocal();
    progress.reset();
    return true;
  }, []);

  const value = useMemo(
    () => ({ user, ready, sync, signIn, signOutUser, deleteAccount }),
    [user, ready, sync, signIn, signOutUser, deleteAccount],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
