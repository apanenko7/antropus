"use client";

import { useState } from "react";
import { useApp } from "@/components/providers";
import { AccountCard } from "@/components/site/AuthButton";
import { useAuth } from "@/components/site/AuthProvider";
import { BoltIcon, FlameIcon } from "@/components/ui/icons";
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
  const { user } = useAuth();
  // Reset is guest-only: a signed-in account's progress lives on the server.
  const [confirm, setConfirm] = useState(false);
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
      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {badges.map(b => (
          <li key={b.id} className={cn("card flex flex-col items-center p-4 text-center", !b.earned && "opacity-45")}>
            <span
              className={cn(
                "grid size-14 place-items-center rounded-full",
                b.earned ? "bg-accent text-on-accent shadow-[0_8px_24px_-8px_rgb(255_138_31/0.7)]" : "bg-surface-3 text-muted",
              )}
            >
              <FlameIcon size={26} />
            </span>
            <p className="mt-3 font-bold">{b.title}</p>
            <p className="mt-0.5 text-sm text-muted">{b.text}</p>
            <span className="sr-only">{b.earned ? "отримано" : "ще не отримано"}</span>
          </li>
        ))}
      </ul>

      {!user ? <p className="mt-10 text-sm text-muted">{t.profile.guestNote}</p> : null}
      {!user ? (
        <button
          type="button"
          className={cn(btn.base, confirm ? "bg-danger text-bg" : btn.subtle, "mt-3 px-4")}
          onClick={() => {
            if (confirm) {
              progress.reset();
              setConfirm(false);
            } else setConfirm(true);
          }}
          onBlur={() => setConfirm(false)}
        >
          {confirm ? t.profile.resetConfirm : t.profile.reset}
        </button>
      ) : null}
    </>
  );
}
