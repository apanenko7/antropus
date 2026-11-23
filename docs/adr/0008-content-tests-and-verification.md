# 8. Content is tested like code

Date: 2026-11-23

## Status

Accepted

## Context

Most lessons are written by AI agents in parallel. Typical mistakes: a task's reference solution doesn't pass its own rules, duplicate quiz ids, unknown glossary ids, broken MDX, facts that are out of date.

## Decision

- `content/content.test.ts` (Vitest) checks every lesson listed in `course.ts`: the MDX exists and has a TL;DR, a quiz (4+ questions) and a task; task solutions pass and starters fail; quiz and task ids are unique; `single` quizzes have exactly one correct option; `findbug`/`match`/`order` data is consistent; every `<Term>` and `<Flashcards>` id exists; glossary ids are unique and `related` links resolve.
- `lib/**/*.test.ts` cover the validation engine and the progress model.
- Playwright e2e (`tests/e2e`, mobile + desktop) covers term popovers, quizzes, tasks and lesson completion.
- Before a commit: `npm test`, `npm run lint`, `npm run build`; for UI changes also the e2e suite.
- Facts about Claude, Claude Code and the API are verified against official docs while writing, not taken from memory.

## Consequences

- Broken content fails CI-style checks instead of reaching learners.
- Tests check structure, not wording quality; readability still needs human or agent review.
