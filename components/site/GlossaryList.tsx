"use client";

import { useState } from "react";
import { useApp } from "@/components/providers";
import { GlossaryIcon } from "@/components/ui/icons";
import type { GlossaryEntry } from "@/content/types";

export function GlossaryList({ entries }: { entries: GlossaryEntry[] }) {
  const { t, glossary } = useApp();
  const [q, setQ] = useState("");
  const query = q.trim().toLocaleLowerCase("uk");
  const sorted = [...entries].sort((a, b) => a.abbr.localeCompare(b.abbr, "uk", { sensitivity: "base" }));
  const list = query
    ? sorted.filter(e => [e.abbr, e.full, e.short, e.practice].some(s => s.toLocaleLowerCase("uk").includes(query)))
    : sorted;

  return (
    <>
      <div className="pressed sticky top-20 z-10 mt-6 flex items-center gap-3 rounded-2xl px-4">
        <GlossaryIcon size={20} className="shrink-0 text-muted" />
        <label htmlFor="glossary-search" className="sr-only">
          {t.glossary.search}
        </label>
        <input
          id="glossary-search"
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={t.glossary.search}
          className="min-h-13 w-full bg-transparent text-base text-fg outline-none placeholder:text-muted"
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {list.length}
      </p>
      {list.length === 0 ? <p className="mt-8 text-center text-muted">{t.glossary.nothing}</p> : null}
      <dl className="mt-6 grid gap-4">
        {list.map(e => (
          <div key={e.id} id={e.id} className="card scroll-mt-40 p-5 target:ring-2 target:ring-accent">
            <dt>
              <span className="font-display text-lg font-semibold text-accent">{e.abbr}</span>
              <span className="mt-0.5 block text-sm text-muted">{e.full}</span>
            </dt>
            <dd className="mt-3">
              <p>{e.short}</p>
              <p className="mt-2.5 rounded-xl bg-accent-soft px-3 py-2 text-[0.95rem]">
                <span className="font-bold text-accent">{t.glossary.inPractice}: </span>
                {e.practice}
              </p>
              {e.related?.length ? (
                <p className="mt-3 flex flex-wrap gap-2">
                  {e.related
                    .filter(r => glossary[r])
                    .map(r => (
                      <a key={r} href={`#${r}`} className="rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold text-muted hover:text-accent">
                        {glossary[r].abbr}
                      </a>
                    ))}
                </p>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
