# 4. Lightweight i18n with locale-prefixed routes

Date: 2026-11-23

## Status

Accepted

## Context

The course starts in Ukrainian; English is planned. `next-intl` was the first plan, but Next 16 with Cache Components is new and the extra dependency would bring friction for little benefit while there is one locale.

## Decision

- Routes are prefixed with the locale from day one: `/[locale]/...`, with `/` redirecting to `/uk`.
- UI strings live in `messages/<locale>.ts` (typed by the Ukrainian dictionary); `lib/i18n.ts` exposes `locales`, `isLocale`, `getDictionary`.
- Client components get strings and the glossary through `AppProviders` context (`useApp()`).
- Lesson content is per locale under `content/<locale>/`.

## Consequences

- Adding English = `messages/en.ts`, `content/en/...`, register the locale in `lib/i18n.ts` and `lib/course.ts`, extend the `Locale` type.
- No ICU plural rules or formatting helpers; add a library if those become necessary.
