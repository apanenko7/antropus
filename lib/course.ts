import type { Course, LessonMeta, Locale, ModuleMeta } from "@/content/types";
import { course as ukCourse } from "@/content/uk/course";
import { glossary as ukGlossary } from "@/content/uk/glossary";

const courses: Record<Locale, Course> = { uk: ukCourse };
const glossaries = { uk: ukGlossary };

export function getCourse(locale: Locale): Course {
  return courses[locale];
}

export function getGlossary(locale: Locale) {
  return glossaries[locale];
}

export function lessonKey(moduleSlug: string, lessonSlug: string) {
  return `${moduleSlug}/${lessonSlug}`;
}

export interface FlatLesson extends LessonMeta {
  module: ModuleMeta;
  key: string;
  index: number;
}

export function flatLessons(locale: Locale): FlatLesson[] {
  const list: FlatLesson[] = [];
  for (const mod of getCourse(locale).modules) {
    for (const lesson of mod.lessons) {
      list.push({ ...lesson, module: mod, key: lessonKey(mod.slug, lesson.slug), index: list.length });
    }
  }
  return list;
}

export function findLesson(locale: Locale, moduleSlug: string, lessonSlug: string) {
  const all = flatLessons(locale);
  const i = all.findIndex(l => l.module.slug === moduleSlug && l.slug === lessonSlug);
  if (i === -1) return null;
  return { lesson: all[i], prev: all[i - 1] ?? null, next: all[i + 1] ?? null, total: all.length };
}

export function lessonHref(locale: Locale, moduleSlug: string, lessonSlug: string) {
  return `/${locale}/learn/${moduleSlug}/${lessonSlug}`;
}
