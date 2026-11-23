"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { GlossaryEntry, Locale } from "@/content/types";
import type { Dictionary } from "@/lib/i18n";

interface AppContextValue {
  locale: Locale;
  t: Dictionary;
  glossary: Record<string, GlossaryEntry>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProviders({
  locale,
  dictionary,
  glossary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  glossary: GlossaryEntry[];
  children: ReactNode;
}) {
  const byId = Object.fromEntries(glossary.map(g => [g.id, g]));
  return <AppContext.Provider value={{ locale, t: dictionary, glossary: byId }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProviders>");
  return ctx;
}
