import type { GlossaryEntry } from "@/content/types";

/** Terms used by the agent-env module. One sentence each for `short` and `practice`. */
export const entries: GlossaryEntry[] = [
  {
    id: "context-rot",
    abbr: "context rot",
    full: "«Гниття» контексту",
    short: "Ефект, коли зі зростанням контексту модель гірше пам'ятає й використовує те, що в ньому є.",
    practice: "Не тримай у контексті все про всяк випадок: менше, але релевантного, дає кращу точність.",
    related: ["context-window", "context-engineering"],
  },
  {
    id: "github-actions",
    abbr: "GitHub Actions",
    full: "CI/CD-платформа GitHub",
    short: "Автоматичні workflow у репозиторії, що запускаються на події: push, PR, коментар, розклад.",
    practice: "Дія anthropics/claude-code-action запускає Claude Code прямо в workflow: на @claude або за розкладом.",
    related: ["ci", "headless"],
  },
  {
    id: "devcontainer",
    abbr: "dev container",
    full: "Development container",
    short: "Контейнер із готовим середовищем розробки, описаним у .devcontainer у репозиторії.",
    practice: "Запускаєш агента всередині контейнера — і його команди не дістають твоєї основної системи.",
    related: ["sandbox"],
  },
  {
    id: "least-privilege",
    abbr: "least privilege",
    full: "Принцип найменших привілеїв",
    short: "Давати агенту рівно ті права, які потрібні для задачі, і жодних зайвих.",
    practice: "Для рев'ю PR вистачить читання й коментарів; права на push і видалення тут не потрібні.",
    related: ["permissions", "sandbox"],
  },
  {
    id: "managed-agents",
    abbr: "Managed Agents",
    full: "Claude Managed Agents",
    short: "Сервіс Anthropic, що сам хостить цикл агента й пісочницю для його інструментів (бета).",
    practice: "Обирай, коли не хочеш тримати власний сервер для агента: конфігуруєш через API, а запуск і sandbox на боці Anthropic.",
    related: ["harness", "agent-sdk"],
  },
  {
    id: "messages-api",
    abbr: "Messages API",
    full: "Claude Messages API",
    short: "Базовий API Claude: надсилаєш повідомлення (і опис інструментів), отримуєш відповідь моделі.",
    practice: "З інструментами цикл агента пишеш сам: модель просить виклик, твій код виконує й повертає результат.",
    related: ["api", "tool-use"],
  },
];
