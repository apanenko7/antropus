import type { GlossaryEntry } from "@/content/types";

/** Terms used by the api module. One sentence each for `short` and `practice`. */
export const entries: GlossaryEntry[] = [
  {
    id: "api-key",
    abbr: "API-ключ",
    full: "API key — ключ доступу до Claude API",
    short: "Секретний рядок, яким твій застосунок підтверджує, що має право викликати API і за чий рахунок.",
    practice: "Тримай його в змінній середовища ANTHROPIC_API_KEY на сервері, ніколи в коді, репозиторії чи браузері.",
    related: ["api", "sdk"],
  },
  {
    id: "max-tokens",
    abbr: "max_tokens",
    full: "Ліміт токенів відповіді",
    short: "Обов'язковий параметр запиту: максимум токенів, які модель може згенерувати у відповіді.",
    practice: "Якщо відповідь обрізалась і stop_reason = max_tokens, збільш ліміт; для великих значень вмикай streaming.",
    related: ["token", "stop-reason", "streaming"],
  },
  {
    id: "streaming",
    abbr: "streaming",
    full: "Потокова відповідь",
    short: "Режим, у якому API віддає відповідь шматочками по мірі генерації, а не одним блоком наприкінці.",
    practice: "Користувач бачить текст одразу, а довгі запити не впираються в HTTP-таймаут.",
    related: ["max-tokens"],
  },
  {
    id: "stop-reason",
    abbr: "stop_reason",
    full: "Причина зупинки генерації",
    short: "Поле відповіді, яке пояснює, чому модель зупинилась: end_turn, max_tokens, tool_use, refusal тощо.",
    practice: "Перевіряй його перед тим, як читати content: від нього залежить, що робити далі.",
    related: ["refusal", "max-tokens", "tool-use"],
  },
  {
    id: "refusal",
    abbr: "refusal",
    full: "Відмова моделі",
    short: "Значення stop_reason, коли модель або класифікатори безпеки відхилили запит; HTTP-статус при цьому 200.",
    practice: "Не показуй користувачу порожню відповідь як успіх: обробляй refusal окремою гілкою коду.",
    related: ["stop-reason"],
  },
  {
    id: "rate-limit",
    abbr: "rate limit",
    full: "Ліміт частоти запитів",
    short: "Обмеження на кількість запитів і токенів за хвилину; при перевищенні API повертає 429.",
    practice: "Почекай (заголовок retry-after підкаже скільки) і повтори запит із зростаючою паузою.",
    related: ["retry-backoff"],
  },
  {
    id: "retry-backoff",
    abbr: "retry з backoff",
    full: "Повтор запиту з експоненційною затримкою",
    short: "Стратегія: після тимчасової помилки повторити запит, щоразу збільшуючи паузу (1 с, 2 с, 4 с…).",
    practice: "SDK вже робить 2 повтори для 408/409/429/5xx; помилки 400 повторювати не треба — виправ запит.",
    related: ["rate-limit"],
  },
  {
    id: "batch-api",
    abbr: "Batches API",
    full: "Message Batches API — пакетна обробка",
    short: "Спосіб надіслати багато запитів одним пакетом і забрати результати пізніше, за половину ціни.",
    practice: "Ідеально для нічної обробки тисяч документів, де відповідь не потрібна миттєво.",
    related: ["api", "prompt-caching"],
  },
];
