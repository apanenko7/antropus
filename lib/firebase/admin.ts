import "server-only";

import { readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Admin SDK for server routes. Credentials come from env vars (.env.local locally, project settings on Vercel),
 * checked in this order:
 *  - FIREBASE_SERVICE_ACCOUNT_JSON: the whole service account JSON as one value (best for Vercel), or
 *  - FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY, or
 *  - FIREBASE_SERVICE_ACCOUNT_FILE: path to the downloaded JSON (local only, the file is gitignored).
 * Returns null when they are missing, so the app still works in guest mode.
 */

interface ServiceAccount {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

/** Accepts the key with real newlines, literal "\n", doubled "\\n", wrapping quotes or CRLF. */
export function normalizePrivateKey(raw: string) {
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  key = key.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r/g, "");
  return key.endsWith("\n") ? key : `${key}\n`;
}

interface ServiceAccountJson {
  project_id: string;
  client_email: string;
  private_key: string;
}

function fromJson(json: ServiceAccountJson): ServiceAccount {
  return { projectId: json.project_id, clientEmail: json.client_email, privateKey: normalizePrivateKey(json.private_key) };
}

/** The whole service account JSON pasted into one env var: the easiest option on Vercel. */
function fromJsonEnv(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  return fromJson(JSON.parse(raw) as ServiceAccountJson);
}

/** Local development only: the JSON file is gitignored, so it never exists on Vercel. */
function fromFile(): ServiceAccount | null {
  const file = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  if (!file) return null;
  // turbopackIgnore keeps the build from tracing the whole project into the server bundle.
  const path = isAbsolute(file) ? file : join(/* turbopackIgnore: true */ process.cwd(), file);
  return fromJson(JSON.parse(readFileSync(path, "utf8")) as ServiceAccountJson);
}

function fromEnv(): ServiceAccount | null {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) return null;
  return { projectId, clientEmail, privateKey: normalizePrivateKey(privateKey) };
}

export type AdminResult =
  | { ok: true; auth: ReturnType<typeof getAuth>; db: ReturnType<typeof getFirestore> }
  /** `reason` is safe to show: it never contains credential values. */
  | { ok: false; reason: string };

export function getAdmin(): AdminResult {
  if (!getApps().length) {
    let account: ServiceAccount | null;
    try {
      account = fromJsonEnv() ?? fromEnv() ?? fromFile();
    } catch (e) {
      return { ok: false, reason: `service account JSON unreadable: ${(e as Error).message}` };
    }
    if (!account) {
      const missing = ["FIREBASE_ADMIN_PROJECT_ID", "FIREBASE_ADMIN_CLIENT_EMAIL", "FIREBASE_ADMIN_PRIVATE_KEY"].filter(
        k => !process.env[k]?.trim(),
      );
      return { ok: false, reason: `not configured, missing: ${missing.join(", ")}` };
    }
    const key = account.privateKey;
    if (!key.includes("-----BEGIN PRIVATE KEY-----") || !key.includes("-----END PRIVATE KEY-----")) {
      return {
        ok: false,
        reason: `FIREBASE_ADMIN_PRIVATE_KEY is malformed: BEGIN marker ${key.includes("-----BEGIN PRIVATE KEY-----") ? "found" : "missing"}, END marker ${key.includes("-----END PRIVATE KEY-----") ? "found" : "missing"}, ${key.split("\n").filter(Boolean).length} lines`,
      };
    }
    try {
      initializeApp({ credential: cert(account) });
    } catch (e) {
      // firebase-admin's messages describe the problem, not the key contents.
      return { ok: false, reason: `credential rejected: ${(e as Error).message}` };
    }
  }
  const app: App = getApp();
  return { ok: true, auth: getAuth(app), db: getFirestore(app) };
}
