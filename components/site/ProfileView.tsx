"use client";

import { MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { useApp } from "@/components/providers";
import { AccountCard } from "@/components/site/AuthButton";
import { useAuth } from "@/components/site/AuthProvider";
import { badgeIcon } from "@/components/ui/badge-icons";
import { BoltIcon } from "@/components/ui/icons";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { btn, cn } from "@/lib/cn";
import { level, progress, streak, useProgress } from "@/lib/progress/store";

interface ModuleInfo {
  slug: string;
  title: string;
  keys: string[];
}

export function ProfileView({ modules }: { modules: ModuleInfo[] }) {
  const { t } = useApp();
  const p = useProgress();
  const { user, deleteAccount } = useAuth();
  // Reset is guest-only: a signed-in account's progress lives on the server; signed-in users get account deletion instead.
  const lv = level(p.xp);
  const lessonsDone = Object.keys(p.lessons).length;
  const quizzesOk = Object.values(p.quizzes).filter(Boolean).length;
  const tasksDone = Object.keys(p.tasks).length;
  const days = streak(p.days);

  const badges = [
    { id: "first-lesson", title: "Перший крок", text: "Пройти перший урок", earned: lessonsDone >= 1 },
    { id: "first-task", title: "Практик", text: "Виконати перше завдання", earned: tasksDone >= 1 },
    { id: "quiz-10", title: "Ерудит", text: "10 правильних відповідей", earned: quizzesOk >= 10 },
    { id: "streak-3", title: "У ритмі", text: "3 дні поспіль", earned: days >= 3 },
    ...modules.map(m => ({
      id: `module-${m.slug}`,
      title: m.title,
      text: "Пройти весь модуль",
      earned: m.keys.length > 0 && m.keys.every(k => p.lessons[k]),
    })),
  ];

  const stats = [
    { label: t.profile.lessonsDone, value: lessonsDone },
    { label: t.profile.quizzes, value: quizzesOk },
    { label: t.profile.tasks, value: tasksDone },
    { label: t.profile.streak, value: days },
  ];

  return (
    <>
      <AccountCard />
      <div className="card glow mt-6 flex items-center gap-5 p-5 sm:p-6">
        <ProgressRing value={lv.into / lv.needed} size={88} stroke={7} label={`Рівень ${lv.level}`}>
          <span className="text-xl">{lv.level}</span>
        </ProgressRing>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-muted">Рівень {lv.level}</p>
          <p className="mt-1 flex items-center gap-1.5 font-display text-2xl font-semibold">
            <BoltIcon size={22} className="text-accent" /> {p.xp} XP
          </p>
          <p className="mt-1 text-sm text-muted">
            ще {lv.needed - lv.into} XP до рівня {lv.level + 1}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="font-display text-2xl font-semibold text-accent tabular-nums">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10">{t.profile.badges}</h2>
      <MotionConfig reducedMotion="user">
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {badges.map((b, i) => {
            const Icon = badgeIcon(b.id);
            return (
              <motion.li
                key={b.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: b.earned ? 1 : 0.45, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="card group flex flex-col items-center p-4 text-center"
              >
                <motion.span
                  initial={b.earned ? { scale: 0.4, rotate: -20 } : false}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15 + i * 0.04, type: "spring", stiffness: 260, damping: 14 }}
                  whileHover={b.earned ? { rotate: [0, -12, 10, -6, 0], scale: 1.08 } : undefined}
                  className="grid"
                >
                  <span
                    className={cn(
                      "relative grid size-14 place-items-center overflow-hidden rounded-full",
                      b.earned ? "badge-earned badge-shine bg-accent text-on-accent" : "bg-surface-3 text-muted",
                    )}
                    style={b.earned ? { animationDelay: `${(i % 5) * -0.6}s` } : undefined}
                  >
                    <Icon size={26} />
                  </span>
                </motion.span>
                <p className="mt-3 font-bold">{b.title}</p>
                <p className="mt-0.5 text-sm text-muted">{b.text}</p>
                <span className="sr-only">{b.earned ? "отримано" : "ще не отримано"}</span>
              </motion.li>
            );
          })}
        </ul>
      </MotionConfig>

      {!user ? (
        <div className="mt-10">
          <p className="text-sm text-muted">{t.profile.guestNote}</p>
          <ConfirmAction
            label={t.profile.reset}
            warning={t.profile.resetConfirm}
            confirmLabel={t.profile.resetYes}
            cancelLabel={t.profile.cancel}
            onConfirm={async () => {
              progress.reset();
              return true;
            }}
          />
        </div>
      ) : (
        <div className="mt-12 border-t border-line/60 pt-6">
          <p className="text-sm text-muted">{t.profile.deleteNote}</p>
          <ConfirmAction
            label={t.profile.deleteAccount}
            warning={t.profile.deleteConfirm}
            confirmLabel={t.profile.deleteYes}
            busyLabel={t.profile.deleting}
            cancelLabel={t.profile.cancel}
            failedText={t.profile.deleteFailed}
            onConfirm={deleteAccount}
          />
        </div>
      )}
    </>
  );
}

/** Destructive action in two explicit steps: the button, then a warning with "confirm" and "cancel". */
function ConfirmAction({
  label,
  warning,
  confirmLabel,
  cancelLabel,
  busyLabel,
  failedText,
  onConfirm,
}: {
  label: string;
  warning: string;
  confirmLabel: string;
  cancelLabel: string;
  busyLabel?: string;
  failedText?: string;
  onConfirm: () => Promise<boolean>;
}) {
  const [state, setState] = useState<"idle" | "confirm" | "busy" | "failed">("idle");

  if (state === "idle" || state === "failed") {
    return (
      <>
        <button type="button" className={cn(btn.base, btn.danger, "mt-3 px-4")} onClick={() => setState("confirm")}>
          {label}
        </button>
        {state === "failed" && failedText ? (
          <p role="alert" className="mt-2 text-sm text-danger">
            {failedText}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-danger/40 bg-danger-soft p-4">
      <p role="alert" className="text-sm font-semibold text-danger">
        {warning}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={state === "busy"}
          className={cn(btn.base, btn.dangerSolid, "px-4")}
          onClick={async () => {
            setState("busy");
            setState((await onConfirm()) ? "idle" : "failed");
          }}
        >
          {state === "busy" && busyLabel ? busyLabel : confirmLabel}
        </button>
        <button type="button" disabled={state === "busy"} className={cn(btn.base, btn.secondary, "px-4")} onClick={() => setState("idle")}>
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}
