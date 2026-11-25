# Atropus

Interactive course (Ukrainian first) on Claude, prompting and Claude Code: short lessons, inline term tooltips, animated demos, quizzes and hands-on tasks with instant validation. Dark theme, mobile-first.

## Stack

Next.js 16 (App Router, Cache Components, Turbopack) · TypeScript · Tailwind CSS v4 · MDX (`@next/mdx` + `remark-gfm`) · Radix UI · Motion · Vitest · Playwright.

## Commands

```bash
npm run dev          # http://localhost:3000 (redirects to /uk)
npm run build
npm run lint
npm test             # unit tests (validation engine)
npm run test:e2e     # Playwright, mobile + desktop; reuses a dev server on PORT (default 3100)
```

## Structure

```
app/[locale]/                 pages: home, learn, learn/[module]/[lesson], glossary, profile
components/learn/             lesson components used inside MDX
components/site/              navigation, progress widgets, glossary list, profile
content/types.ts              all content types (quiz, task rules, demo steps, glossary)
content/uk/course.ts          course structure: modules -> lessons (order = UI order)
content/uk/glossary.ts        terms for <Term> tooltips and the glossary page
content/uk/<module>/<lesson>.mdx
content/uk/demos/*.ts         scripted demo sessions
lib/validation/               task rule engine (pure, unit-tested)
lib/progress/store.ts         guest progress + XP in localStorage
messages/uk.ts                UI strings
```

## Writing a lesson

1. Add the lesson to `content/uk/course.ts`.
2. Create `content/uk/<module>/<lesson>.mdx`. Recommended shape: `<TLDR>` → short `##` sections → `<Demo>` → `<Quiz>` → `<Task>` → `<Flashcards>`. See `content/uk/prompting/clarity.mdx`.
3. Wrap every abbreviation or term in `<Term id="..." />` (add it to `glossary.ts` first; `short` and `practice` are one sentence each). Use `<Term id="token">токенів</Term>` for inflected forms.

Components available in MDX without imports (`mdx-components.tsx`):

| Component | Purpose |
| --- | --- |
| `<TLDR>` | three key takeaways |
| `<Term id full?>` | inline term with tooltip |
| `<Callout type="tip\|warn\|pro" title>` | highlighted note |
| `<Steps items>` / `<DoDont dont doThis>` | visual lists |
| `<PromptCompare bad good>` | bad vs good prompt (tabs on mobile) |
| `<Demo script>` | animated terminal / chat session (import the script from `content/uk/demos`) |
| `<Quiz title questions>` | types: `single`, `multi`, `truefalse`, `order`, `findbug`, `match` |
| `<Task task>` | textarea + live criteria; rule types in `content/types.ts` (`TaskRule`) |
| `<Flashcards terms>` | flip cards from glossary ids |

Quiz and task `id`s must be globally unique (prefix them with the lesson slug): progress and XP are keyed by them. All props must be serializable (no functions), regexes go in as strings.

MDX gotchas: escape `{`, `}` and `<` in plain text (use inline code), no HTML comments.

## Adding a language

Add `messages/<locale>.ts` with the same shape as `messages/uk.ts`, `content/<locale>/...`, register it in `lib/i18n.ts` and `lib/course.ts`, and extend the `Locale` type.

## Roadmap

Supabase accounts with synced progress, AI review of tasks via the Claude API, modules 04–06.
