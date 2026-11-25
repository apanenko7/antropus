# 11. Lime accent and the name "Atropus"

Date: 2026-11-25

## Status

Proposed. Supersedes the accent colour in ADR-0007 (the rest of 0007 stands).

## Context

Before publishing to Google Play the project was checked for trademark and store-policy risks. The old name "Antropus" plus an orange accent in a course about Claude reads as close to Anthropic's own brand, which raises the risk of a trademark complaint or a rejection for impersonation. The owner prefers a lime accent on the dark theme.

## Decision

- Accent colour is lime: `--accent #a3e635`, `--accent-strong #7ccf14`, dark text on it (`--on-accent #13200a`). The logo and the icons use the same lime gradient.
- `--success` moves to emerald (`#34d399`) so "correct" states stay distinct from the brand colour.
- The product name is "Atropus" (the "A" echoes the triangle head of the octopus logo). The footer and the privacy page keep the "not affiliated with Anthropic" notice.
- Internal identifiers keep the old spelling: localStorage keys and events (`antropus:*`), so guests keep their progress, and the Firebase project id `antropus-52cbe`, which cannot be renamed.

## Consequences

- `pnpm icons` must be re-run after any logo or name change.
- The Google sign-in popup shows the Firebase auth domain (`antropus-52cbe.firebaseapp.com`) until a custom auth domain on the production domain is set up; the Firebase "public-facing name" should be set to "Atropus".
- The name still shares letters with "Anthropic"; the risk is lower than with "Antropus" but not zero. Check Google Play and trademark registers before publishing.
