# 5. Firebase for Google sign-in and progress sync

Date: 2026-11-23

## Status

Accepted

## Context

Learners should keep XP, completed lessons, quizzes and tasks across devices, signing in with a Google account. Guests must be able to learn without an account. Supabase was planned first; the project owner prefers Firebase. Progress is document-shaped (one record per user).

## Decision

- Firebase Authentication (Google provider, popup with redirect fallback) and Cloud Firestore, project `antropus-52cbe`.
- Data: one document per user, `users/{uid}`, with `lessons`, `quizzes`, `tasks`, `days`, `xp`, `displayName`, `photoURL`, `updatedAt`.
- Firestore rules (`firestore.rules`): a user can read only their own document; **all client writes are denied**.
- Writes go only through `POST /api/progress` (Next route handler) using the Admin SDK after verifying the Firebase ID token. Actions: `lesson`, `quiz`, `task`, `merge`.
- XP is never trusted from the client: it is derived from completed items (`computeXp` in `lib/progress/model.ts`); input is sanitized; lesson keys are checked against the course; activity days must be within ±1 day of server time.
- Guests keep progress in `localStorage` (`lib/progress/store.ts`). On sign-in the guest state is merged into the account (union, earliest timestamp, correct answer wins). Actions are applied optimistically and synced; a Firestore snapshot keeps devices in sync.
- The public web config is in `lib/firebase/client.ts` (env vars may override; empty values fall back). Admin credentials come from `.env.local` (`FIREBASE_SERVICE_ACCOUNT_FILE` or the three `FIREBASE_ADMIN_*` vars, see `env.template`); without them the API returns 503 and the app stays in guest mode.

## Consequences

- Cheap to run (Spark plan), real-time sync out of the box.
- Leaderboards or analytics need denormalized data or an export; Firestore has no SQL.
- Task completion is trusted by id (the server doesn't re-run task validation); acceptable for a learning app.
- When deploying, the production domain must be added to Authentication → Authorized domains.

## Alternatives considered

- Supabase (Postgres + RLS): better for SQL queries, rejected by owner preference.
- Client writes with validating Firestore rules: no server needed, but XP rules get complex and easy to bypass.
