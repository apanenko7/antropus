import type { NextConfig } from "next";
import createMDX from "@next/mdx";

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
  async rewrites() {
    // Android app (TWA) verification; see app/api/assetlinks/route.ts.
    return [{ source: "/.well-known/assetlinks.json", destination: "/api/assetlinks" }];
  },
};

// Turbopack needs plugins as strings. remark-gfm adds tables, strikethrough, task lists.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
