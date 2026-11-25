# Building the Android app (TWA)

Steps to turn the deployed site into a Google Play app (ADR-0010). Not done yet: run them when the owner gives the go-ahead.

## Already in the repo

- `app/manifest.ts` → `/manifest.webmanifest` (name, colours, start URL `/uk`, icons)
- `public/icons/` → 192/512 icons, a maskable 512 icon, the Apple touch icon (`pnpm icons` regenerates them from `app/icon.svg`)
- `/.well-known/assetlinks.json` → `app/api/assetlinks/route.ts`, filled from `ANDROID_PACKAGE_NAME` and `ANDROID_SHA256_CERT_FINGERPRINTS`
- Privacy policy `/uk/privacy`, account deletion in Profile, the Anthropic notice in the footer
- Store graphics and Play Console answers: `docs/store/`

## Before the build

1. Final name chosen: it must not be confusable with "Anthropic". If it changes, update `siteName` in `messages/uk.ts`, the texts in `play-console.md`, and run `pnpm icons` (the feature graphic shows the name).
2. The site is deployed on its production domain over HTTPS; the domain is in Firebase → Authentication → Authorized domains.
3. A Google Play developer account and a dedicated contact mailbox.

## Conversion

Needs JDK 17 and the Android SDK; Bubblewrap offers to download both on first run. Keep the generated Android project in `android/` (gitignored build output) and the signing keystore **outside the repo**.

```bash
npx @bubblewrap/cli init --manifest https://<domain>/manifest.webmanifest --directory android
#   package id: e.g. app.<name>.twa (permanent once published)
#   display: standalone, orientation: default, status/nav bar colour: #1c1d20
#   signing key: create a new one, store it outside the repo, back it up with its passwords
cd android && npx @bubblewrap/cli build        # -> app-release-bundle.aab
```

## After the first upload

1. Play Console → create the app → Test and release → Internal testing → upload the `.aab`. Opt in to Play App Signing.
2. Copy the **App signing key** SHA-256 (Test and release → App integrity). Set `ANDROID_PACKAGE_NAME` and `ANDROID_SHA256_CERT_FINGERPRINTS` in Vercel (add the upload key's SHA-256 too if you install local builds), redeploy.
3. Check `https://<domain>/.well-known/assetlinks.json` returns the package and fingerprints. Installed from Play, the app must open without a URL bar.
4. On a real phone: sign in with Google, sync progress, delete the account, open a lesson offline (Chrome shows its own offline page).
5. Phone screenshots for the listing: home, a lesson with a term tooltip, a quiz, a task, the profile (1080×1920 or similar 9:16).
6. Fill in Play Console from `play-console.md`, then the closed test (12 testers, 14 days) and production.

Content updates only need a site deploy. Rebuild the app (`npx @bubblewrap/cli update && npx @bubblewrap/cli build`, bump the version) only when the manifest, icon, domain or package changes.
