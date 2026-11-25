# 7. Dark-first design and animated demos instead of video

Date: 2026-11-23

## Status

Accepted. The accent colour is superseded by ADR-0011 (lime instead of orange).

## Context

The course must not be boring, must read well on phones, and should show what Claude Code sessions look like. The owner gave a visual reference: a dark neumorphic quiz app with a bright orange accent. Recording and localizing screencasts is slow.

## Decision

- Dark theme by default: tokens in `app/globals.css` (`--bg`, `--surface*`, `--accent`, ...) exposed to Tailwind via `@theme inline`; soft raised/pressed shadows (`card`, `pressed` utilities); orange accent with dark text on it for contrast. A light theme can later redefine the same tokens.
- Fonts from Google with Cyrillic: Manrope (body), Unbounded (headings), Caveat (handwritten accents).
- Base styles live in `@layer base` and lesson prose in `@layer components`, so Tailwind utilities win; prose rules skip anything inside `.not-prose`.
- "Silent videos" are scripted timelines (`DemoScript` in `content/<locale>/demos/*.ts`) played by `<Demo>`: terminal (Claude Code) or chat variant, autoplay when visible, pause/step/restart/speed, full state shown under `prefers-reduced-motion`.
- Accessibility target WCAG 2.1 AA: keyboard support, visible focus, `aria` on custom controls, 44px+ touch targets, no horizontal page scroll at 390px.

## Consequences

- Demos are light, crisp on any screen and translatable as text.
- They are illustrations, not real recordings; they must be kept in line with the real product UI.
