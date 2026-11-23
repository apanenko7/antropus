"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useApp } from "@/components/providers";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** Flip cards for the lesson's terms. Pass glossary ids. */
export function Flashcards({ terms }: { terms: string[] }) {
  const { glossary, t } = useApp();
  const cards = terms.map(id => glossary[id]).filter(Boolean);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards.length) return null;
  const card = cards[i];

  const go = (d: number) => {
    setFlipped(false);
    setI(x => (x + d + cards.length) % cards.length);
  };

  return (
    <section aria-label={t.flashcards.title} className="not-prose my-10">
      <p className="font-hand text-2xl text-accent">{t.flashcards.title}</p>
      <div className="mt-3 [perspective:1200px]">
        <motion.button
          type="button"
          onClick={() => setFlipped(f => !f)}
          aria-label={`${t.flashcards.flip}: ${card.abbr}`}
          aria-pressed={flipped}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="relative block h-56 w-full [transform-style:preserve-3d]"
        >
          <span className="card absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center [backface-visibility:hidden]">
            <span className="font-display text-2xl font-semibold text-accent sm:text-3xl">{card.abbr}</span>
            <span className="text-sm text-muted">{t.flashcards.flip} ↻</span>
          </span>
          <span className="card absolute inset-0 flex flex-col justify-center gap-2 overflow-y-auto p-5 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-sm font-bold text-accent">{card.full}</span>
            <span className="text-[0.95rem]">{card.short}</span>
            <span className="text-sm text-muted">{card.practice}</span>
          </span>
        </motion.button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button type="button" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-full bg-surface shadow-raised" aria-label={t.flashcards.prev}>
          <ArrowLeftIcon size={18} />
        </button>
        <div className="flex gap-1.5" aria-hidden="true">
          {cards.map((c, n) => (
            <span key={c.id} className={cn("size-2 rounded-full", n === i ? "bg-accent" : "bg-surface-3")} />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} className="grid size-11 place-items-center rounded-full bg-surface shadow-raised" aria-label={t.flashcards.next}>
          <ArrowRightIcon size={18} />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {i + 1} / {cards.length}
      </p>
    </section>
  );
}
