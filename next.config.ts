import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const firebaseProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "antropus-52cbe";

/**
 * Security headers for every response. No CSP on purpose: Next's inline scripts would need nonces (dynamic rendering for
 * every page) and Google sign-in needs frames and popups from Firebase. COOP is left at the default for the same reason.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // SAMEORIGIN, not DENY: Firebase Auth embeds /__/auth/iframe from our own domain.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [{ source: "/", destination: "/uk", permanent: false }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    return [
      // Android app (TWA) verification; see app/api/assetlinks/route.ts.
      { source: "/.well-known/assetlinks.json", destination: "/api/assetlinks" },
      // Firebase Auth helper served from our own domain. With NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN set to the production
      // domain, the Google sign-in window shows that domain instead of <project>.firebaseapp.com, and sign-in keeps
      // working in browsers that block third-party storage (Chrome, Safari, the Android app). See docs/store/android-twa.md.
      { source: "/__/auth/:path*", destination: `https://${firebaseProject}.firebaseapp.com/__/auth/:path*` },
      { source: "/__/firebase/:path*", destination: `https://${firebaseProject}.firebaseapp.com/__/firebase/:path*` },
    ];
  },
};

// Turbopack needs plugins as strings. remark-gfm adds tables, strikethrough, task lists.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
