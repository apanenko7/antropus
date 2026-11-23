import type { Locale } from "@/content/types";
import { uk } from "@/messages/uk";

export const locales: Locale[] = ["uk"];
export const defaultLocale: Locale = "uk";

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

const dictionaries = { uk };

export type Dictionary = typeof uk;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
