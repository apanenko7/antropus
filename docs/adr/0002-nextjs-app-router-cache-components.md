# 2. Next.js 16 App Router with Cache Components

Date: 2026-11-23

## Status

Accepted

## Context

We need a mobile-first content site with interactive client widgets, a few server endpoints (progress sync, later AI review) and good performance. The team works in TypeScript. Next.js 16 ships with Cache Components (`cacheComponents: true`) and partial prefetching enabled by `create-next-app`.

## Decision

- Next.js 16 App Router, TypeScript, Turbopack, Tailwind CSS v4.
- Keep `cacheComponents` and `partialPrefetching` on. Every dynamic route provides `generateStaticParams`, so all locale, course and lesson pages are prerendered.
- `dynamicParams` is not allowed with Cache Components; unknown slugs return `notFound()` from the page.
- The lesson page sets `export const instant = false`: dev-time instant-navigation validation can't load client components referenced from dynamically imported MDX in its prefetch environment. Rendering works; only the validation feedback is turned off for that segment.
- Values that change per request or per clock (`new Date()`, `localStorage`) are read only on the client after hydration.
- Before writing Next.js code, read the bundled docs in `node_modules/next/dist/docs/` (see `AGENTS.md`): this version differs from older training data.

## Consequences

- Pages are static and fast; client components hydrate the interactive parts.
- Some Next 16 rules are strict (no `dynamicParams`, no clock reads during prerender) and surface as build errors, not runtime bugs.

## Alternatives considered

- Plain React + Vite SPA: simpler, but no server routes and worse first load for content.
- Turning Cache Components off: fewer constraints, but loses prerendering defaults we benefit from.
