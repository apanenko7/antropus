# Atropus

Interactive course on Claude, prompting and Claude Code. Ukrainian first (English planned), dark mobile-first UI, Next.js 16.

@AGENTS.md

## Commands

- `npm run dev -- --port 3100` — dev server (Playwright reuses port 3100)
- `npm test` — Vitest: validation engine, progress model, content checks (`content/content.test.ts`)
- `npm run test:e2e` — Playwright, mobile + desktop
- `npm run lint`, `npm run build`
- Before committing: `npm test && npm run lint && npm run build`; for UI changes also `npm run test:e2e`.

## Decisions

Settled decisions are in `docs/adr/` (index: `docs/adr/README.md`). Don't contradict an accepted ADR; propose a new one that supersedes it.

## Where things are

- Course order: `content/uk/course.ts`; lessons: `content/uk/<module>/<lesson>.mdx`; demo scripts: `content/uk/demos/<module>.ts`
- Glossary: `content/uk/glossary.ts` + per-module `content/uk/glossary/<module>.ts`
- MDX components: registered in `mdx-components.tsx`, implemented in `components/learn/`
- UI strings: `messages/uk.ts`; progress: `lib/progress/` (model shared by client and `app/api/progress/route.ts`); Firebase: `lib/firebase/`

## Writing lessons

- Follow `content/uk/prompting/clarity.mdx`: TLDR (3 bullets) → short `##` sections → Demo → Quiz (4–6, mixed types, at least one scenario question) → Task (rules + solution) → Flashcards.
- Wrap every abbreviation or term in `<Term id="..." />`; add missing terms to the module's glossary file first (one sentence each for `short` and `practice`). Use `<Term id="token">токенів</Term>` for inflected forms.
- Quiz/task ids: globally unique, prefixed with the lesson/module slug, never renamed after release (progress is keyed by them).
- Props must be serializable: rules are data, regexes are strings.
- Task rules on Ukrainian text use word stems (`списк`, not `список`); the solution must pass and the starter must fail.
- MDX: escape `{` `}` `<` in prose (inline code), no HTML comments.
- Verify facts about Claude, Claude Code and the API against official docs; leave out what can't be verified.
- Text: Ukrainian, short, concrete, friendly, no fluff. Code, comments and docs: English.

## Gotchas

- Next 16 + `cacheComponents`: no `dynamicParams`; no `new Date()` / `localStorage` during prerender; every dynamic route has `generateStaticParams`.
- Tailwind v4: global styles go in `@layer base` / `@layer components`, otherwise they override utilities.
- Secrets live in `.env.local` (gitignored; template in `env.template`). Never commit service account JSON or API keys. Firestore client writes are denied by rules; write through `/api/progress`.
- After adding a client component to the root layout, restart the dev server if you see "module factory is not available".
