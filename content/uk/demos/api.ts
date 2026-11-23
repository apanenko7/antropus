import type { DemoScript } from "@/content/types";

export const firstRequestDemo: DemoScript = {
  id: "api-first-request",
  title: "Перший запит до Claude API",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Ставимо офіційний SDK" },
    { kind: "input", text: "npm install @anthropic-ai/sdk" },
    { kind: "note", text: "added 1 package in 2s" },
    { kind: "caption", text: "Ключ — у змінній середовища, не в коді" },
    { kind: "input", text: "export ANTHROPIC_API_KEY=sk-ant-…" },
    { kind: "caption", text: "Запускаємо скрипт з messages.create" },
    { kind: "input", text: "npx tsx hello.ts" },
    { kind: "output", text: "Київ — столиця України." },
    { kind: "note", text: "stop_reason: end_turn · input_tokens: 21 · output_tokens: 12" },
    { kind: "caption", text: "Відповідь + причина зупинки + витрачені токени" },
  ],
};

export const streamingDemo: DemoScript = {
  id: "api-streaming",
  title: "Без streaming і зі streaming",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Звичайний запит: тиша, поки вся відповідь не готова" },
    { kind: "input", text: "npx tsx report.ts" },
    { kind: "note", text: "… 40 секунд нічого …" },
    { kind: "output", text: "Звіт готовий (3 200 слів)." },
    { kind: "caption", text: "Зі streaming: текст з'являється одразу" },
    { kind: "input", text: "npx tsx report-stream.ts" },
    { kind: "output", text: "## Звіт за листопад\nВиручка зросла на 12%, головний драйвер — нові клієнти з… (текст друкується по мірі генерації)" },
    { kind: "note", text: "finalMessage(): stop_reason end_turn · output_tokens 4310" },
    { kind: "caption", text: "Той самий результат, але користувач не чекає в порожнечі" },
  ],
};

export const errorsDemo: DemoScript = {
  id: "api-errors",
  title: "429 і ретраї",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Масовий запуск без контролю частоти" },
    { kind: "input", text: "npx tsx summarize-all.ts --parallel 200" },
    { kind: "note", text: "RateLimitError 429: rate_limit_error · retry-after: 8" },
    { kind: "note", text: "SDK: retry 1/2 через 8 с… retry 2/2…" },
    { kind: "note", text: "RateLimitError 429 після 2 повторів — запит упав" },
    { kind: "caption", text: "Виправляємо: обмежуємо паралельність і додаємо backoff" },
    { kind: "input", text: "npx tsx summarize-all.ts --parallel 10" },
    { kind: "output", text: "Оброблено 1 000 / 1 000 документів. Помилок: 0." },
    { kind: "caption", text: "429 — «зачекай», а не «код зламаний»" },
  ],
};

export const toolsDemo: DemoScript = {
  id: "api-tools",
  title: "Модель викликає твою функцію",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Даємо моделі інструмент get_order_status" },
    { kind: "input", text: "npx tsx support-bot.ts \"Де моє замовлення 1842?\"" },
    { kind: "note", text: "stop_reason: tool_use" },
    { kind: "tool", name: "get_order_status", detail: "order_id: \"1842\"", result: "{ status: \"shipped\", eta: \"2026-11-26\" }" },
    { kind: "caption", text: "Твій код виконав функцію і повернув tool_result" },
    { kind: "output", text: "Замовлення 1842 вже в дорозі — очікуйте 26 листопада." },
    { kind: "note", text: "stop_reason: end_turn" },
    { kind: "caption", text: "Модель вирішує ЩО викликати, а виконує — твій код" },
  ],
};

export const costDemo: DemoScript = {
  id: "api-cost",
  title: "Кешування і batch у дії",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Перший запит з довгою інструкцією: кеш створюється" },
    { kind: "input", text: "npx tsx classify.ts --one" },
    { kind: "note", text: "cache_creation_input_tokens: 6 200 · cache_read_input_tokens: 0" },
    { kind: "caption", text: "Наступні запити читають той самий префікс з кешу" },
    { kind: "input", text: "npx tsx classify.ts --one" },
    { kind: "note", text: "cache_creation_input_tokens: 0 · cache_read_input_tokens: 6 200" },
    { kind: "caption", text: "10 000 відгуків, відповідь не термінова → Batches API" },
    { kind: "input", text: "npx tsx classify.ts --batch reviews.jsonl" },
    { kind: "output", text: "Batch msgbatch_01… створено: 10 000 запитів. processing_status: in_progress" },
    { kind: "note", text: "Через годину: ended · succeeded 9 998 · errored 2" },
    { kind: "caption", text: "Кеш + batch + дешевша модель = рахунок у рази менший" },
  ],
};
