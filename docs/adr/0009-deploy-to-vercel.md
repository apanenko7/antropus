# 9. Deploy to Vercel

Date: 2026-11-23

## Status

Proposed (deployment happens at the end of the current phase)

## Context

The app needs server route handlers (progress sync, later AI review). Firebase Hosting serves static sites; Next.js with server routes on Firebase needs App Hosting on the paid Blaze plan.

## Decision

Deploy to Vercel (free tier to start). Firebase stays the backend for auth and data only. Environment variables (Firebase Admin credentials, later `ANTHROPIC_API_KEY`) are set in the Vercel project settings, never committed.

## Consequences

- Zero-config Next.js 16 support, preview deployments per branch.
- The Vercel domain must be added to Firebase Authentication → Authorized domains, or Google sign-in fails there.
