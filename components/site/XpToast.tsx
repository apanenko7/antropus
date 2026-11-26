"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BoltIcon } from "@/components/ui/icons";
import type { XpEventDetail } from "@/lib/progress/store";

interface Toast extends XpEventDetail {
  id: number;
}

/** Floating "+10 XP" feedback after any reward. */
export function XpToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let n = 0;
    const onXp = (e: Event) => {
      const detail = (e as CustomEvent<XpEventDetail>).detail;
      const id = ++n;
      setToasts(list => [...list, { ...detail, id }]);
      window.setTimeout(() => setToasts(list => list.filter(t => t.id !== id)), 2200);
    };
    window.addEventListener("antropus:xp", onXp);
    return () => window.removeEventListener("antropus:xp", onXp);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-20 z-50 flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-display text-sm font-bold text-on-accent shadow-[0_10px_30px_-10px_rgb(151_196_90/0.8)]"
          >
            <BoltIcon size={16} />+{t.amount} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
