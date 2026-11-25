import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Caveat, Manrope, Unbounded } from "next/font/google";
import { AppProviders } from "@/components/providers";
import { AuthProvider } from "@/components/site/AuthProvider";
import { Footer } from "@/components/site/Footer";
import { BottomNav, Header } from "@/components/site/Nav";
import { WaterBackground } from "@/components/site/WaterBackground";
import { XpToast } from "@/components/site/XpToast";
import { getGlossary } from "@/lib/course";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import "../globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "cyrillic"] });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin", "cyrillic"], weight: ["500", "600", "700"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin", "cyrillic"], weight: ["600", "700"] });

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: { default: `${t.siteName} — ${t.tagline}`, template: `%s · ${t.siteName}` },
    description: t.home.heroText,
    icons: { apple: "/icons/apple-touch-icon.png" },
  };
}

export const viewport: Viewport = {
  themeColor: "#1c1d20",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html lang={locale} className={`${manrope.variable} ${unbounded.variable} ${caveat.variable} antialiased`}>
      <body className="min-h-dvh">
        <WaterBackground />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          {t.common.skipToContent}
        </a>
        <AppProviders locale={locale} dictionary={t} glossary={getGlossary(locale)}>
          <AuthProvider>
            <Header />
            <XpToast />
            <main id="main" className="pb-12 md:pb-16">
              {children}
            </main>
            <Footer locale={locale} t={t} />
            <BottomNav />
          </AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}
