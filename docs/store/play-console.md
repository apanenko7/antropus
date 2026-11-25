# Google Play Console answers

What to enter in Play Console for the Android app (ADR-0010). Keep it in sync with the code: if the app starts collecting anything new (analytics, crash reports, AI review of tasks), update the Data safety answers, the privacy page (`app/[locale]/privacy/page.tsx`) and this file together.

`<domain>` = the production domain of the site.

## URLs

| Field | Value |
| --- | --- |
| Privacy policy | `https://<domain>/uk/privacy` |
| Account deletion (Data safety → Data deletion, "web link") | `https://<domain>/uk/privacy#delete` |
| Website | `https://<domain>/uk` |
| Contact email | a dedicated project mailbox, not a personal one. Play shows it publicly on the listing. |

## Data safety

**Data collection and security**

| Question | Answer |
| --- | --- |
| Does your app collect or share any of the required user data types? | Yes |
| Is all of the user data collected by your app encrypted in transit? | Yes (HTTPS only) |
| Do you provide a way for users to request that their data is deleted? | Yes: in the app (Profile → Delete account) and the web link above |

**Data types.** For every type below: *Collected* = yes, *Shared* = no (Firebase and Vercel are service providers acting on our behalf, which Play does not count as sharing), *Processed ephemerally* = no, *Required or optional* = optional (the whole course works without signing in).

| Category → type | What it is in the app | Purposes |
| --- | --- | --- |
| Personal info → Name | Google display name (`users/{uid}.displayName`, Firebase Auth) | Account management |
| Personal info → Email address | Google email (Firebase Auth) | Account management |
| Personal info → User IDs | Firebase Auth uid | Account management, App functionality |
| Personal info → Other info | Google profile photo URL (`users/{uid}.photoURL`) | Account management |
| App activity → Other user-generated content | none: task answers and drafts stay on the device. Do **not** tick this | — |
| App activity → App interactions | completed lessons, quiz results, completed tasks, active days, XP | App functionality |
| App info and performance → Diagnostics | hosting request logs on Vercel: IP address, user agent, time, URL. Kept by Vercel for a short time, not used by the app | Fraud prevention, security, and compliance; App functionality. **Required** (every request is logged), not optional |

The Diagnostics row is declared on purpose, so the IP address in the hosting logs is not hidden. The privacy page says the same ("Хто обробляє дані" → Vercel).

**Not collected** (leave unticked): location (the IP is not used to work out location), financial info, health, messages, photos and videos, audio, files and docs, calendar, contacts, web browsing, crash logs, device or other IDs (no advertising ID).

## App content (other declarations)

| Section | Answer |
| --- | --- |
| App access | All functionality is available without special access. Sign-in is optional and only syncs progress, so no test account is needed |
| Ads | No, the app does not contain ads |
| Content rating (IARC questionnaire) | Category: Reference, News, or Educational. Answer "No" to violence, sexuality, language, controlled substances, gambling, user interaction/chat, sharing location. Expected rating: Everyone / PEGI 3 |
| Target audience | 13–15, 16–17 and 18+. Never under 13: that brings the Families policy. "Appeals to children": No (the course is about work tools; the mascot is a logo). Matches the privacy page ("not for children under 13") |
| News app | No |
| Health apps, Financial features, Government app | No / None |
| Data safety | see above |

## Store listing (Ukrainian, default language)

App name, ≤ 30 characters (keep "Claude" out of the name and the icon; mention it only in descriptions):

> Atropus: курс промптингу

Short description, ≤ 80 characters:

> Короткі уроки про Claude, промпти й AI-агентів: квізи, завдання та прогрес.

Full description, ≤ 4000 characters:

> Atropus — інтерактивний курс українською про те, як працювати з Claude, писати хороші промпти й користуватися Claude Code.
>
> Що всередині:
> • Короткі уроки на 5–8 хвилин: TL;DR на початку, без води.
> • Терміни з підказками: кожна абревіатура пояснена простими словами.
> • Живі демо: анімовані сесії, де видно, що відбувається крок за кроком.
> • Квізи та практичні завдання з миттєвою перевіркою.
> • XP, рівні й нагороди, щоб тримати ритм.
> • Глосарій усіх термінів курсу.
>
> Від «що таке токен» до власних skills, subagents і MCP-серверів.
>
> Можна вчитися без реєстрації. Увійди через Google, якщо хочеш зберігати прогрес на кількох пристроях. Реклами й трекерів немає.
>
> Atropus — незалежний освітній проєкт, не пов'язаний з Anthropic і не схвалений нею. Claude, Claude Code та Anthropic — торговельні марки Anthropic PBC.

Category: Education. Tags: Education, Courses / Online learning.

**Graphics** (`pnpm icons` regenerates them):

| Asset | File |
| --- | --- |
| App icon 512×512 | `docs/store/assets/play-icon-512.png` |
| Feature graphic 1024×500 | `docs/store/assets/feature-graphic-1024x500.png` |
| Phone screenshots (2–8, 9:16) | made during the conversion step, see `android-twa.md` |

## If ads are added later

Not planned yet. Adding any ad network changes all of these at once:

- **Ads** declaration → Yes (the listing gets a "Contains ads" label).
- **Data safety**: the ad SDK collects and *shares* data (device or other IDs, approximate location, app interactions, diagnostics) for Advertising or marketing. Copy the answers from the network's own Data safety guide.
- **Privacy page and listing text**: remove "no ads, no trackers", name the ad network and what it collects.
- **Consent**: users in the EEA, the UK and Switzerland need a Google-certified consent banner (CMP) before personalised ads.
- **Placement** (Play disruptive ads policy): no full-screen ads on app launch, on exit or when signing in or out; nothing that covers lesson content, quiz or task buttons, or appears where it gets tapped by accident. A banner inside a lesson is fine when it sits between two `##` sections, is labelled «Реклама», looks clearly different from lesson cards, and is never inside a Quiz, Task, Demo or Flashcards block or right next to their buttons. At most one or two per lesson.
- **Target audience** stays 13+. With teens (13–17) in the audience: set the ad network's maximum ad content rating to a teen-safe level and serve non-personalised ads, or mark requests as coming from a mixed audience. Under 13 is never included: that brings the Families policy (only Families-certified ad SDKs).
- Check that the chosen network allows ads inside a TWA before integrating.

## Release requirements to plan for

- A personal developer account created after 13 Nov 2023 must run a **closed test with at least 12 testers opted in for 14 days in a row** before it can apply for production access.
- New apps must target a recent Android API level; Bubblewrap's current version sets it.
