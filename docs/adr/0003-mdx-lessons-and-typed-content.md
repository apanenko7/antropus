# 3. Lessons in MDX, course data in typed TypeScript

Date: 2026-11-23

## Status

Accepted

## Context

Lessons mix short prose with interactive components (quizzes, tasks, demos, term tooltips). Authors (people and agents) must be able to write a lesson quickly, and a future English version must be easy to add.

## Decision

- Each lesson is `content/<locale>/<module>/<lesson>.mdx`, loaded with `@next/mdx` through a dynamic `import()` in the lesson page. `remark-gfm` is enabled (as a string plugin, required by Turbopack) for tables.
- Course order and metadata live in `content/<locale>/course.ts`; types in `content/types.ts`.
- Components available in MDX are registered in `mdx-components.tsx`: `TLDR`, `Term`, `Callout`, `Steps`, `DoDont`, `PromptCompare`, `Demo`, `Quiz`, `Task`, `Flashcards`.
- All component props are serializable data (MDX renders on the server, components hydrate on the client): task rules are declarative objects, regexes are strings, no functions.
- The glossary (`content/<locale>/glossary.ts` plus per-module files in `glossary/`) is the single source of truth for `<Term>` tooltips, flashcards and the glossary page. Per-module files let several authors add terms in parallel without conflicts.
- Quiz and task ids are globally unique and prefixed with the lesson or module slug: progress and XP are keyed by them, so they must never be renamed after release.

## Consequences

- A lesson is one file plus optional demo scripts in `content/<locale>/demos/`.
- MDX syntax rules apply: `{`, `}` and `<` in prose must be escaped or put in inline code.
- `content/content.test.ts` guards the content (see ADR-0008).

## Alternatives considered

- Headless CMS: overkill for a single team, adds hosting and auth.
- Lessons as TS objects: strongly typed but painful to write prose in.
