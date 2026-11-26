// Generates PNG icons for the web manifest / Android app and the Google Play store graphics from app/icon.svg.
// Run: pnpm icons. Re-run after changing the logo or the site name (the feature graphic shows the name).
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BG = "#1c1d20";
const logo = readFileSync(join(root, "app/icon.svg"), "utf8");
const siteName = readFileSync(join(root, "messages/uk.ts"), "utf8").match(/siteName:\s*"([^"]+)"/)?.[1] ?? "Atropus";

/** The logo scaled to `size` px, as a PNG buffer with a transparent background. */
const logoPng = size => sharp(Buffer.from(logo), { density: Math.ceil((72 * size) / 120) * 2 }).resize(size, size).png().toBuffer();

/** Logo centred on a square of `size` px; `scale` is the logo's share of the side. */
async function square(file, size, { scale = 1, background = null } = {}) {
  const inner = Math.round(size * scale);
  const base = sharp({
    create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } },
  });
  await base
    .composite([{ input: await logoPng(inner), gravity: "centre" }])
    .png()
    .toFile(file);
  console.log("wrote", file.replace(root, "."));
}

const icons = join(root, "public/icons");
const store = join(root, "docs/store/assets");
mkdirSync(icons, { recursive: true });
mkdirSync(store, { recursive: true });

// Web manifest / launcher icons. "any" keeps a transparent background; "maskable" keeps the logo inside the 80% safe zone.
await square(join(icons, "icon-192.png"), 192, { scale: 0.92 });
await square(join(icons, "icon-512.png"), 512, { scale: 0.92 });
await square(join(icons, "maskable-512.png"), 512, { scale: 0.62, background: BG });
await square(join(icons, "apple-touch-icon.png"), 180, { scale: 0.74, background: BG });

// Google Play: 512x512 hi-res icon (opaque, Play rounds the corners itself) and the 1024x500 feature graphic.
await square(join(store, "play-icon-512.png"), 512, { scale: 0.72, background: BG });

const feature = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500">
  <defs>
    <radialGradient id="g" cx="0.3" cy="0.5" r="0.6">
      <stop offset="0" stop-color="#97c45a" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="500" fill="${BG}"/>
  <rect width="1024" height="500" fill="url(#g)"/>
  <text x="430" y="275" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="700" fill="#f4f1ec">${siteName}</text>
</svg>`);
await sharp(feature)
  .composite([{ input: await logoPng(300), left: 90, top: 100 }])
  .png()
  .toFile(join(store, "feature-graphic-1024x500.png"));
console.log("wrote ./docs/store/assets/feature-graphic-1024x500.png");
