"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { btn, cn } from "@/lib/cn";
import { progress, useProgress } from "@/lib/progress/store";

export interface LessonRef {
  key: string;
  href: string;
  title: string;
}

/** "Start" or "Continue" depending on local progress. */
export function ContinueButton({ lessons, className }: { lessons: LessonRef[]; className?: string }) {
  const { t } = useApp();
  const p = useProgress();
  const started = Object.keys(p.lessons).length > 0;
  const next = lessons.find(l => !p.lessons[l.key]) ?? lessons[lessons.length - 1];
  if (!next) return null;
  return (
    <Link href={next.href} className={cn(btn.base, btn.primary, "min-h-14 px-7 text-lg", className)}>
      {started ? t.home.ctaContinue : t.home.ctaStart}
      <ArrowRightIcon size={20} />
    </Link>
  );
}

export function LessonCheck({ lessonKey }: { lessonKey: string }) {
  const p = useProgress();
  const done = Boolean(p.lessons[lessonKey]);
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full",
        done ? "bg-success text-bg" : "bg-surface-3 text-transparent",
      )}
      aria-label={done ? "Пройдено" : undefined}
      aria-hidden={done ? undefined : true}
    >
      <CheckIcon size={16} strokeWidth={3} />
    </span>
  );
}

/** Dims a card a little once all its lessons are done; full opacity again on hover/focus. */
export function DoneFade({ keys, className, children }: { keys: string[]; className?: string; children: React.ReactNode }) {
  const p = useProgress();
  const done = keys.length > 0 && keys.every(k => p.lessons[k]);
  return <div className={cn("transition-opacity", done && "opacity-85 hover:opacity-100 focus-within:opacity-100", className)}>{children}</div>;
}

export function ModuleRing({ keys, size = 56 }: { keys: string[]; size?: number }) {
  const p = useProgress();
  const done = keys.filter(k => p.lessons[k]).length;
  return (
    <ProgressRing value={keys.length ? done / keys.length : 0} size={size} label={`${done} з ${keys.length}`}>
      {done}/{keys.length}
    </ProgressRing>
  );
}

export function CourseSummary({ keys }: { keys: string[] }) {
  const p = useProgress();
  const done = keys.filter(k => p.lessons[k]).length;
  const pct = keys.length ? Math.round((done / keys.length) * 100) : 0;
  return (
    <div className="card flex items-center gap-4 p-4 sm:p-5">
      <ProgressRing value={pct / 100} size={64} stroke={6} label={`${pct}%`}>
        {pct}%
      </ProgressRing>
      <div>
        <p className="font-display font-semibold">
          {done} / {keys.length} уроків
        </p>
        <p className="text-sm text-muted">{p.xp} XP зароблено</p>
      </div>
    </div>
  );
}

/** Thin orange bar under the header showing how far the lesson is read. */
export function ReadingProgress() {
  const { t } = useApp();
  const [v, setV] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setV(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      className="fixed inset-x-0 top-16 z-20 h-1 bg-transparent"
      role="progressbar"
      aria-label={t.lesson.progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
    >
      <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${v})` }} />
    </div>
  );
}

export function LessonFooter({ lessonKey, next, courseHref }: { lessonKey: string; next: LessonRef | null; courseHref: string }) {
  const { t } = useApp();
  const p = useProgress();
  const done = Boolean(p.lessons[lessonKey]);
  return (
    <div className="card glow mt-12 flex flex-col items-center gap-4 p-6 text-center sm:p-8">
      {done ? (
        <>
          <span className="grid size-14 place-items-center rounded-full bg-success text-bg">
            <CheckIcon size={28} strokeWidth={3} />
          </span>
          <p className="font-display text-lg font-semibold">{t.lesson.completed}</p>
          {next ? (
            <Link href={next.href} className={cn(btn.base, btn.primary)}>
              {t.lesson.nextLesson}: {next.title} <ArrowRightIcon size={18} />
            </Link>
          ) : (
            <>
              <p className="text-muted">{t.lesson.courseDone}</p>
              <Link href={courseHref} className={cn(btn.base, btn.ghost)}>
                {t.lesson.backToCourse}
              </Link>
            </>
          )}
        </>
      ) : (
        <>
          <p className="font-hand text-3xl text-accent">Все зрозуміло?</p>
          <button type="button" className={cn(btn.base, btn.primary, "min-h-14 px-8 text-lg")} onClick={() => progress.completeLesson(lessonKey)}>
            {t.lesson.complete} <span className="text-sm opacity-80">+50 XP</span>
          </button>
          {next ? (
            <Link href={next.href} className="text-sm font-semibold text-muted underline underline-offset-2 hover:text-fg">
              {t.lesson.nextLesson}: {next.title}
            </Link>
          ) : null}
        </>
      )}
    </div>
  );
}
