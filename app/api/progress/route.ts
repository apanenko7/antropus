import { flatLessons } from "@/lib/course";
import { getAdmin } from "@/lib/firebase/admin";
import {
  applyAction,
  EMPTY_PROGRESS,
  isItemId,
  isPlausibleDay,
  mergeProgress,
  sanitize,
  type ProgressAction,
  type ProgressState,
} from "@/lib/progress/model";

/**
 * POST /api/progress — the only way progress is written to Firestore.
 * Header: Authorization: Bearer <Firebase ID token>
 * Body: ProgressAction (lesson | quiz | task | merge). Responds with the stored state.
 */

const knownLessons = new Set(flatLessons("uk").map(l => l.key));

function parseAction(body: unknown): ProgressAction | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const day = typeof b.day === "string" && isPlausibleDay(b.day) ? b.day : null;
  switch (b.type) {
    case "lesson":
      return day && typeof b.key === "string" && knownLessons.has(b.key) ? { type: "lesson", key: b.key, day } : null;
    case "quiz":
      return day && isItemId(b.id) && typeof b.correct === "boolean" ? { type: "quiz", id: b.id, correct: b.correct, day } : null;
    case "task":
      return day && isItemId(b.id) ? { type: "task", id: b.id, day } : null;
    case "merge":
      return { type: "merge", state: b.state };
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const admin = getAdmin();
  if (!admin.ok) {
    console.error("[api/progress] Admin SDK unavailable:", admin.reason);
    return Response.json({ error: "Progress sync is not configured", reason: admin.reason }, { status: 503 });
  }

  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let uid: string;
  let profile: { name?: string; picture?: string };
  try {
    const decoded = await admin.auth.verifyIdToken(token);
    uid = decoded.uid;
    profile = { name: decoded.name, picture: decoded.picture };
  } catch (e) {
    // Log only the reason code (e.g. auth/argument-error for a project mismatch), never the token.
    const reason = (e as { code?: string }).code ?? (e as Error).message;
    console.warn("[api/progress] ID token rejected:", reason);
    return Response.json({ error: "Unauthorized", reason }, { status: 401 });
  }

  let action: ProgressAction | null = null;
  try {
    action = parseAction(await request.json());
  } catch {
    action = null;
  }
  if (!action) return Response.json({ error: "Bad request" }, { status: 400 });

  const ref = admin.db.collection("users").doc(uid);
  let stored: ProgressState;
  try {
    stored = await admin.db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      const current = snap.exists ? sanitize(snap.data()) : EMPTY_PROGRESS;
      let next: ProgressState;
      if (action.type === "merge") {
        // Guest progress from localStorage: keep only known lessons, then union.
        const guest = sanitize(action.state);
        guest.lessons = Object.fromEntries(Object.entries(guest.lessons).filter(([k]) => knownLessons.has(k)));
        next = mergeProgress(current, sanitize(guest));
      } else {
        next = applyAction(current, action);
      }
      if (next !== current || !snap.exists) {
        tx.set(ref, {
          ...next,
          displayName: profile.name ?? null,
          photoURL: profile.picture ?? null,
          updatedAt: Date.now(),
        });
      }
      return next;
    });
  } catch (e) {
    // Firestore errors (e.g. database not created, permission) carry no secrets.
    const reason = (e as Error).message;
    console.error("[api/progress] Firestore write failed:", reason);
    return Response.json({ error: "Progress write failed", reason }, { status: 500 });
  }

  return Response.json({ state: stored });
}
