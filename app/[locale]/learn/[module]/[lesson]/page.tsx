import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonFooter, ReadingProgress } from "@/components/site/CourseProgress";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { findLesson, getCourse, lessonHref } from "@/lib/course";
import { getDictionary, isLocale } from "@/lib/i18n";

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  return getCourse(params.locale).modules.flatMap(m => m.lessons.map(l => ({ module: m.slug, lesson: l.slug })));
}

/*
 * Lessons are fully prerendered. Dev-time instant validation fails to load client
 * components referenced from dynamically imported MDX in its prefetch environment
 * (render itself is fine), so opt this segment out of validation feedback only.
 */
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/learn/[module]/[lesson]">): Promise<Metadata> {
  const { locale, module, lesson } = await params;
  if (!isLocale(locale)) return {};
  const found = findLesson(locale, module, lesson);
  return found ? { title: found.lesson.title, description: found.lesson.summary } : {};
}

export default async function LessonPage({ params }: PageProps<"/[locale]/learn/[module]/[lesson]">) {
  const { locale, module, lesson } = await params;
  if (!isLocale(locale)) notFound();
  const found = findLesson(locale, module, lesson);
  if (!found) notFound();
  const t = getDictionary(locale);

  const { default: Content } = await import(`@/content/${locale}/${module}/${lesson}.mdx`);
  const { lesson: meta, next } = found;
  const positionInModule = meta.module.lessons.findIndex(l => l.slug === meta.slug) + 1;

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href={`/${locale}/learn`}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg"
        >
          <ArrowLeftIcon size={16} /> {t.lesson.backToCourse}
        </Link>
        <header className="mt-3">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {t.common.module} {meta.module.badge} · {meta.module.title} · {positionInModule}/{meta.module.lessons.length}
          </p>
          <h1 className="mt-2">{meta.title}</h1>
          <p className="mt-2 text-muted">
            {meta.summary} · {meta.minutes} {t.common.minutes}
          </p>
        </header>

        <div className="prose mt-8">
          <Content />
        </div>

        <LessonFooter
          lessonKey={meta.key}
          courseHref={`/${locale}/learn`}
          next={next ? { key: next.key, title: next.title, href: lessonHref(locale, next.module.slug, next.slug) } : null}
        />
      </article>
    </>
  );
}
