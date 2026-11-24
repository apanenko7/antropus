import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinueButton, DoneFade, ModuleRing } from "@/components/site/CourseProgress";
import { BoltIcon, LockIcon } from "@/components/ui/icons";
import { OctoMark } from "@/components/ui/OctoMark";
import { flatLessons, getCourse, lessonHref, lessonKey } from "@/lib/course";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const course = getCourse(locale);
  const lessons = flatLessons(locale).map(l => ({ key: l.key, title: l.title, href: lessonHref(locale, l.module.slug, l.slug) }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="relative flex flex-col items-center pt-10 pb-14 text-center sm:pt-16">
        <div
          className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-[28rem]"
          style={{
            background:
              "repeating-conic-gradient(from 0deg at 50% 38%, rgb(255 255 255 / 0.025) 0deg 6deg, transparent 6deg 14deg), radial-gradient(50% 50% at 50% 38%, rgb(255 138 31 / 0.18), transparent 70%)",
            maskImage: "radial-gradient(60% 60% at 50% 40%, #000 30%, transparent 75%)",
          }}
          aria-hidden="true"
        />
        <OctoMark size={150} id="octo-hero" animated className="drop-shadow-[0_18px_30px_rgb(255_138_31/0.35)]" />
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.home.heroKicker}</p>
        <h1 className="mt-3 max-w-3xl">
          {t.home.heroTitle}{" "}
          <span className="font-hand text-[1.35em] font-bold text-accent">{t.home.heroAccent}</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{t.home.heroText}</p>
        <div className="mt-8">
          <ContinueButton lessons={lessons} />
        </div>
      </section>

      {/* Features */}
      <section aria-label="Переваги" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.home.features.map((f, i) => (
          <div key={f.title} className="card p-5">
            <span className="grid size-10 place-items-center rounded-full bg-accent-soft font-display text-sm font-bold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-4 text-lg">{f.title}</h2>
            <p className="mt-1.5 text-[0.95rem] text-muted">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Modules */}
      <section className="mt-16" aria-labelledby="modules-title">
        <h2 id="modules-title">{t.home.modulesTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {course.modules.map(mod => {
            const first = mod.lessons[0];
            const keys = mod.lessons.map(l => lessonKey(mod.slug, l.slug));
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-3xl font-bold text-accent/90">{mod.badge}</span>
                  {mod.soon ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-3 px-2.5 py-1 text-xs font-bold text-muted">
                      <LockIcon size={14} /> Скоро
                    </span>
                  ) : (
                    <ModuleRing keys={keys} size={48} />
                  )}
                </div>
                <h3 className="mt-3 text-lg">{mod.title}</h3>
                <p className="mt-1.5 text-[0.95rem] text-muted">{mod.summary}</p>
                {!mod.soon ? (
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-muted">
                    <BoltIcon size={14} className="text-accent" />
                    {mod.lessons.length} {t.common.lessons} · ~{mod.lessons.reduce((s, l) => s + l.minutes, 0)} {t.common.minutes}
                  </p>
                ) : null}
              </>
            );
            return first ? (
              <DoneFade key={mod.slug} keys={keys} className="h-full">
                <Link href={lessonHref(locale, mod.slug, first.slug)} className="card block h-full p-5 transition hover:-translate-y-0.5">
                  {inner}
                </Link>
              </DoneFade>
            ) : (
              <div key={mod.slug} className="card p-5 opacity-70">
                {inner}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
