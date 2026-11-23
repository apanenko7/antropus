import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlossaryList } from "@/components/site/GlossaryList";
import { getGlossary } from "@/lib/course";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/glossary">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).glossary.title } : {};
}

export default async function GlossaryPage({ params }: PageProps<"/[locale]/glossary">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1>{t.glossary.title}</h1>
      <p className="mt-3 text-muted">{t.glossary.intro}</p>
      <GlossaryList entries={getGlossary(locale)} />
    </div>
  );
}
