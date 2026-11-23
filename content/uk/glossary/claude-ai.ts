import type { GlossaryEntry } from "@/content/types";

/** Terms used by the claude-ai module. One sentence each for `short` and `practice`. */
export const entries: GlossaryEntry[] = [
  {
    id: "claude-ai",
    abbr: "Claude.ai",
    full: "Чат-застосунок Claude (веб, десктоп, мобільний)",
    short: "Застосунок для розмови з Claude у браузері, на комп'ютері чи телефоні.",
    practice: "Тут живуть чати, Projects, Artifacts і конектори; для коду в проєкті є окремо Claude Code.",
    related: ["claude-project", "artifact", "connector"],
  },
  {
    id: "claude-project",
    abbr: "Project",
    full: "Project у Claude.ai — робочий простір",
    short: "Окремий простір зі своїми чатами, інструкціями та базою знань (файлами).",
    practice: "Створи проєкт під повторювану задачу — і не вставляй ті самі документи та правила в кожен новий чат.",
    related: ["claude-ai", "rag"],
  },
  {
    id: "artifact",
    abbr: "Artifact",
    full: "Артефакт — самостійний результат поруч із чатом",
    short: "Документ, код, діаграма чи невеликий інтерактивний застосунок, який відкривається поруч із розмовою.",
    practice: "Проси «зроби як artifact», а далі уточнюй зміни словами — версії зберігаються, результат можна поділитися.",
    related: ["claude-ai"],
  },
  {
    id: "connector",
    abbr: "конектор",
    full: "Connector — підключення до застосунку чи сервісу",
    short: "Підключення, через яке Claude читає дані й діє у твоїх сервісах: Google Drive, Gmail, Calendar, Slack тощо.",
    practice: "Увімкни потрібні конектори в чаті через «+», і Claude сам знайде лист чи документ з твоїми ж правами доступу.",
    related: ["mcp", "research-mode"],
  },
  {
    id: "web-search",
    abbr: "пошук у вебі",
    full: "Web search",
    short: "Інструмент, яким Claude шукає свіжу інформацію в інтернеті й дає посилання на джерела.",
    practice: "Вмикай для новин, цін, версій бібліотек — усього, що могло змінитися після межі знань моделі.",
    related: ["knowledge-cutoff", "research-mode"],
  },
  {
    id: "research-mode",
    abbr: "Research",
    full: "Режим глибокого дослідження",
    short: "Режим, у якому Claude сам виконує серію пошуків, вирішує, що копати далі, і збирає розгорнуту відповідь.",
    practice: "Для аналізу ринку чи порівняння рішень; потребує увімкненого пошуку й витрачає ліміти швидше за звичайний чат.",
    related: ["web-search", "connector"],
  },
  {
    id: "chat-memory",
    abbr: "пам'ять чатів",
    full: "Memory у Claude.ai",
    short: "Функція, з якою Claude запам'ятовує твою роль, вподобання й поточні проєкти між розмовами.",
    practice: "Переглядай і редагуй, що запам'ятано, у налаштуваннях; для «чистої» розмови є інкогніто-чат.",
    related: ["claude-ai"],
  },
  {
    id: "cowork",
    abbr: "Cowork",
    full: "Claude Cowork — агентний режим для некодових задач",
    short: "Режим, де Claude сам планує й виконує багатокрокову роботу з файлами, документами й браузером без терміналу.",
    practice: "Доручи «розклади папку з рахунками й зроби зведену таблицю» — і отримай готовий файл, а не інструкцію.",
    related: ["agent", "claude-code"],
  },
];
