import "server-only";

import { readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Admin SDK for server routes. Credentials come from .env.local, either:
 *  - FIREBASE_SERVICE_ACCOUNT_FILE: path to the downloaded service account JSON (simplest), or
 *  - FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY.
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

function fromFile(): ServiceAccount | null {
  const file = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  if (!file) return null;
  const path = isAbsolute(file) ? file : join(process.cwd(), file);
  const json = JSON.parse(readFileSync(path, "utf8")) as { project_id: string; client_email: string; private_key: string };
  return { projectId: json.project_id, clientEmail: json.client_email, privateKey: normalizePrivateKey(json.private_key) };
}

function fromEnv(): ServiceAccount | null {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) return null;
  return { projectId, clientEmail, privateKey: normalizePrivateKey(privateKey) };
}

export function getAdmin() {
  if (!getApps().length) {
    const account = fromFile() ?? fromEnv();
    if (!account) return null;
    if (!account.privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
      console.error("[firebase-admin] Private key looks malformed: expected '-----BEGIN PRIVATE KEY-----'.");
      return null;
    }
    initializeApp({ credential: cert(account) });
  }
  const app: App = getApp();
  return { auth: getAuth(app), db: getFirestore(app) };
}
