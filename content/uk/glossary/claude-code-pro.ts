import type { GlossaryEntry } from "@/content/types";

/** Terms used by the claude-code-pro module. One sentence each for `short` and `practice`. */
export const entries: GlossaryEntry[] = [
  {
    id: "frontmatter",
    abbr: "frontmatter",
    full: "YAML-заголовок файлу",
    short: "Блок налаштувань між рядками --- на самому початку markdown-файлу.",
    practice: "У SKILL.md і файлах субагентів там пишуть name, description та інші поля, які читає Claude Code.",
    related: ["skill", "subagent"],
  },
  {
    id: "progressive-disclosure",
    abbr: "progressive disclosure",
    full: "Поступове розкриття",
    short: "Принцип, коли в контексті спершу лише короткий опис, а повний текст підвантажується за потреби.",
    practice: "Описи всіх skills Claude бачить завжди, а сам SKILL.md і додаткові файли читає лише коли задача підходить.",
    related: ["skill", "context-engineering"],
  },
  {
    id: "matcher",
    abbr: "matcher",
    full: "Фільтр хука",
    short: "Поле в налаштуванні хука, що визначає, на які інструменти чи випадки він спрацьовує.",
    practice: "matcher \"Edit|Write\" запускає хук лише після редагування файлів, а не після кожної команди.",
    related: ["hook"],
  },
  {
    id: "stdio",
    abbr: "stdio",
    full: "Standard input/output — локальний транспорт MCP",
    short: "Спосіб роботи MCP-сервера як локальної програми, з якою Claude Code спілкується через ввід-вивід.",
    practice: "Локальні сервери (бази даних, файлові утиліти) додають через --transport stdio і команду після --.",
    related: ["mcp"],
  },
  {
    id: "marketplace",
    abbr: "marketplace",
    full: "Маркетплейс плагінів",
    short: "Каталог (репозиторій із marketplace.json), що перелічує плагіни й звідки їх брати.",
    practice: "Команда публікує свій маркетплейс, і кожен ставить звідти плагіни через /plugin.",
    related: ["plugin"],
  },
  {
    id: "managed-settings",
    abbr: "managed settings",
    full: "Керовані налаштування організації",
    short: "Налаштування Claude Code, які розгортає організація і які не можна перебити локально.",
    practice: "Через них компанія забороняє небезпечні команди чи дозволяє лише затверджені MCP-сервери для всіх.",
    related: ["settings-json", "permissions"],
  },
];
