# 6. Client-side rule engine for practical tasks; AI review deferred

Date: 2026-11-23

## Status

Accepted

## Context

Practical tasks ask the learner to write or fix a prompt, CLAUDE.md, SKILL.md, JSON config and similar. Feedback must be instant and free. An AI review through the Claude API was planned, but no API key is available for now.

## Decision

- `lib/validation` is a pure TypeScript rule engine: `includesAny`, `includesAll`, `notIncludes`, `regex`, `notRegex`, `minWords`, `maxWords`, `xmlTag`, `xmlTagCount`, `heading`, `validJson`, `jsonKeys`, `frontmatter`. Matching is case-insensitive by default; a broken rule fails instead of throwing.
- Criteria light up live while typing; "Check" shows a hint for each failed rule and awards XP once.
- Every task ships a reference `solution`; tests require the solution to pass and the `starter` to fail (ADR-0008).
- Rule values for Ukrainian text use word stems (e.g. `списк`, not `список`) so inflected forms match.
- AI review (`/api/review` with the Claude API, structured output, rate limit per user) is postponed until an `ANTHROPIC_API_KEY` exists. When added, the key stays server-only.

## Consequences

- Validation checks structure and presence of key elements, not meaning; a determined learner can satisfy rules with a weak answer.
- No running cost and no network dependency for tasks.
