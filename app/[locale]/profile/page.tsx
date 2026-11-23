import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/site/ProfileView";
import { getCourse, lessonKey } from "@/lib/course";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/profile">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).profile.title } : {};
}

export default async function ProfilePage({ params }: PageProps<"/[locale]/profile">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const modules = getCourse(locale)
    .modules.filter(m => !m.soon)
    .map(m => ({ slug: m.slug, title: m.title, keys: m.lessons.map(l => lessonKey(m.slug, l.slug)) }));
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1>{t.profile.title}</h1>
      <ProfileView modules={modules} />
    </div>
  );
}
