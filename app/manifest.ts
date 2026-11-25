import type { MetadataRoute } from "next";
import { defaultLocale, getDictionary } from "@/lib/i18n";

/** Web app manifest: makes the site installable and is the source Bubblewrap reads to build the Android app (TWA). */
export default function manifest(): MetadataRoute.Manifest {
  const t = getDictionary(defaultLocale);
  return {
    id: `/${defaultLocale}`,
    name: t.siteName,
    short_name: t.siteName,
    description: t.tagline,
    lang: defaultLocale,
    start_url: `/${defaultLocale}`,
    scope: "/",
    display: "standalone",
    background_color: "#1c1d20",
    theme_color: "#1c1d20",
    categories: ["education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
