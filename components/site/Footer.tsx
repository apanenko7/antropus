import Link from "next/link";
import type { Locale } from "@/content/types";
import type { Dictionary } from "@/lib/i18n";

/** Site footer: the "not affiliated with Anthropic" notice and the privacy link (both required for store listings). */
export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <footer className="border-t border-line/60 pb-28 md:pb-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-6 text-sm text-muted sm:px-6 md:flex-row md:items-start md:justify-between md:gap-8">
        <p className="max-w-2xl">{t.footer.disclaimer}</p>
        <Link href={`/${locale}/privacy`} className="shrink-0 font-semibold underline underline-offset-4 hover:text-fg">
          {t.footer.privacy}
        </Link>
      </div>
    </footer>
  );
}
