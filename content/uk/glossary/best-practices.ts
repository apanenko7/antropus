import type { GlossaryEntry } from "@/content/types";

/** Terms used by the best-practices module. One sentence each for `short` and `practice`. */
export const entries: GlossaryEntry[] = [
  {
    id: "clear",
    abbr: "/clear",
    full: "Нова розмова в Claude Code",
    short: "Команда, яка починає сесію з чистого контексту, без історії попередньої задачі.",
    practice: "Між непов'язаними задачами /clear нічого не коштує, а наступна задача не платить за чужу історію.",
    related: ["compact", "context-window"],
  },
  {
    id: "rewind",
    abbr: "/rewind",
    full: "Відкат до попереднього кроку",
    short: "Меню, яке повертає код, розмову або обидва до стану перед одним із попередніх промптів.",
    practice: "Відкривається через /rewind або подвійний Esc на порожньому рядку — можна сміливо пробувати й відкочувати.",
    related: ["checkpoint"],
  },
  {
    id: "status-line",
    abbr: "status line",
    full: "Рядок стану Claude Code",
    short: "Налаштовуваний рядок унизу сесії, який показує модель, заповнення контексту, вартість чи git-гілку.",
    practice: "/statusline і опис словами — Claude сам напише скрипт і пропише його в налаштуваннях.",
    related: ["settings-json"],
  },
  {
    id: "ultrathink",
    abbr: "ultrathink",
    full: "Глибше міркування для одного запиту",
    short: "Слово в промпті, яке просить Claude подумати глибше лише на цьому кроці, не змінюючи effort.",
    practice: "Одне складне питання посеред рутинної роботи — додай ultrathink замість /effort high на всю сесію.",
    related: ["effort", "thinking"],
  },
];
