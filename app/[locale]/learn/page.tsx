import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseSummary, DoneFade, LessonCheck, ModuleRing } from "@/components/site/CourseProgress";
import { LockIcon } from "@/components/ui/icons";
import { getCourse, lessonHref, lessonKey } from "@/lib/course";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/learn">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.course } : {};
}

export default async function CoursePage({ params }: PageProps<"/[locale]/learn">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const course = getCourse(locale);
  const allKeys = course.modules.flatMap(m => m.lessons.map(l => lessonKey(m.slug, l.slug)));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1>{t.nav.course}</h1>
      <div className="mt-6">
        <CourseSummary keys={allKeys} />
      </div>

      <ol className="mt-10 space-y-10">
        {course.modules.map(mod => {
          const keys = mod.lessons.map(l => lessonKey(mod.slug, l.slug));
          return (
            <li key={mod.slug}>
              <section aria-labelledby={`m-${mod.slug}`}>
                <div className="flex items-center gap-4">
                  {mod.soon ? (
                    <span className="grid size-14 place-items-center rounded-full bg-surface text-muted shadow-raised">
                      <LockIcon />
                    </span>
                  ) : (
                    <ModuleRing keys={keys} />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-accent">
                      {t.common.module} {mod.badge}
                      {mod.soon ? " · скоро" : ""}
                    </p>
                    <h2 id={`m-${mod.slug}`} className="text-xl">
                      {mod.title}
                    </h2>
                  </div>
                </div>
                <p className="mt-3 text-muted">{mod.summary}</p>
                {mod.lessons.length ? (
                  <ol className="mt-4 space-y-3">
                    {mod.lessons.map((lesson, i) => (
                      <li key={lesson.slug}>
                        <DoneFade keys={[lessonKey(mod.slug, lesson.slug)]}>
                        <Link
                          href={lessonHref(locale, mod.slug, lesson.slug)}
                          className="card flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:bg-surface-2"
                        >
                          <span className="w-6 shrink-0 text-center font-display text-sm font-bold text-muted">{i + 1}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold">{lesson.title}</span>
                            <span className="mt-0.5 block text-sm text-muted">{lesson.summary}</span>
                          </span>
                          <span className="hidden shrink-0 text-sm text-muted sm:block">
                            {lesson.minutes} {t.common.minutes}
                          </span>
                          <LessonCheck lessonKey={lessonKey(mod.slug, lesson.slug)} />
                        </Link>
                        </DoneFade>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </section>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
