# 1. Record architecture decisions

Date: 2026-11-23

## Status

Accepted

## Context

The project is built largely with AI agents (Claude Code and subagents). Agents and new contributors need to know which decisions are settled so they don't reopen them or contradict them.

## Decision

We keep Architecture Decision Records in `docs/adr/`, one Markdown file per decision, numbered `NNNN-short-title.md`, in Michael Nygard's format: Status, Context, Decision, Consequences (plus Alternatives considered where useful). `CLAUDE.md` points agents here.

A decision is changed by writing a new ADR that supersedes the old one; the old one gets status `Superseded by ADR-NNNN` and is not rewritten.

## Consequences

- Decisions and their reasons survive across sessions and people.
- Every significant change of direction costs one short document.
