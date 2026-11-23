import type { DemoScript } from "@/content/types";

/* Demo sessions for module "agent-architecture". */

export const workflowVsAgentDemo: DemoScript = {
  id: "arch-workflow-vs-agent",
  title: "Одна задача — два підходи",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Workflow: кроки прописані в коді" },
    { kind: "note", text: "$ node translate-pipeline.js article.md" },
    { kind: "tool", name: "LLM #1", detail: "написати анонс", result: "Анонс готовий (120 слів)" },
    { kind: "tool", name: "check", detail: "довжина ≤ 150 слів", result: "OK" },
    { kind: "tool", name: "LLM #2", detail: "перекласти англійською", result: "Переклад готовий" },
    { kind: "note", text: "Завжди 2 виклики моделі, завжди в тому самому порядку" },
    { kind: "caption", text: "Агент: модель сама вирішує, що робити далі" },
    { kind: "input", text: "Користувачі скаржаться, що експорт у PDF ламає таблиці. Розберись і полагодь." },
    { kind: "output", text: "Спершу відтворю проблему." },
    { kind: "tool", name: "Bash", detail: "npm run export -- sample.md", result: "PDF згенеровано, таблиця обрізана" },
    { kind: "tool", name: "Grep", detail: "\"renderTable\"", result: "src/pdf/table.ts, src/pdf/layout.ts" },
    { kind: "tool", name: "Read", detail: "src/pdf/table.ts", result: "Read 88 lines" },
    { kind: "output", text: "Ширина колонок не враховує поля сторінки. Виправляю й перевіряю." },
    { kind: "tool", name: "Bash", detail: "npm test", result: "PASS 34 tests" },
    { kind: "caption", text: "Кількість кроків наперед невідома — тому тут потрібен агент" },
  ],
};

export const patternsDemo: DemoScript = {
  id: "arch-patterns",
  title: "Routing у службі підтримки",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Крок 1: класифікатор (дешева модель) визначає тип звернення" },
    { kind: "input", text: "Мені двічі списали гроші за підписку, поверніть один платіж" },
    { kind: "tool", name: "classify", detail: "model: haiku", result: "category: refund (впевненість 0.97)" },
    { kind: "caption", text: "Крок 2: звернення йде у спеціалізований обробник" },
    { kind: "tool", name: "refund_handler", detail: "промпт + інструменти для повернень", result: "Знайдено 2 платежі за 14.11, один ініційовано до повернення" },
    { kind: "output", text: "Вибачте за незручність! Ми повернули зайвий платіж, гроші надійдуть за 3–5 днів." },
    { kind: "caption", text: "Паралельно: окрема модель перевіряє відповідь на політики (sectioning)" },
    { kind: "tool", name: "policy_check", detail: "паралельний виклик", result: "OK: без обіцянок поза політикою повернень" },
    { kind: "caption", text: "Кожен обробник простий і добре налаштований під свій тип задач" },
  ],
};

export const orchestrationDemo: DemoScript = {
  id: "arch-orchestration",
  title: "Оркестратор роздає роботу, оцінювач перевіряє",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Orchestrator-workers: план складається на льоту" },
    { kind: "input", text: "Перейменуй поле userName на displayName по всьому проєкту" },
    { kind: "tool", name: "Grep", detail: "\"userName\"", result: "знайдено в 7 файлах: api, ui, tests, migrations" },
    { kind: "output", text: "План: 3 виконавці — API (3 файли), UI (2 файли), тести й міграція (2 файли)." },
    { kind: "tool", name: "Agent", detail: "worker: API", result: "3 файли змінено" },
    { kind: "tool", name: "Agent", detail: "worker: UI", result: "2 файли змінено" },
    { kind: "tool", name: "Agent", detail: "worker: tests + migration", result: "2 файли змінено, міграцію додано" },
    { kind: "caption", text: "Evaluator-optimizer: окремий оцінювач перевіряє за критеріями" },
    { kind: "tool", name: "Agent", detail: "evaluator: чи не лишилось userName, чи проходять тести", result: "FAIL: userName лишився в docs/api.md" },
    { kind: "tool", name: "Edit", detail: "docs/api.md", result: "1 заміна" },
    { kind: "tool", name: "Agent", detail: "evaluator: повторна перевірка", result: "PASS: 0 входжень, 58 тестів зелені" },
    { kind: "output", text: "Готово: поле перейменовано в 8 файлах, міграція додана, тести проходять." },
    { kind: "caption", text: "Оркестратор ділить роботу, оцінювач не дає закінчити, поки не добре" },
  ],
};

export const toolDesignDemo: DemoScript = {
  id: "arch-tool-design",
  title: "Поганий і хороший інструмент",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Інструмент-обгортка над API: агент бродить і палить токени" },
    { kind: "input", text: "Запиши мене на зустріч з Оленою завтра після обіду" },
    { kind: "tool", name: "list_users", detail: "{}", result: "[ 4 812 записів з uuid… ] (36 000 токенів)" },
    { kind: "tool", name: "list_events", detail: "{ user: \"a3f9…\" }", result: "Error 400" },
    { kind: "note", text: "Незрозуміла помилка: агент не знає, що виправити" },
    { kind: "caption", text: "Інструмент під задачу: один виклик, зрозуміла відповідь" },
    { kind: "tool", name: "calendar_schedule_event", detail: "{ attendee_name: \"Олена\", date: \"завтра\", after: \"13:00\" }", result: "Знайдено 2 вільні слоти: 14:00 і 16:30" },
    { kind: "output", text: "У вас з Оленою вільні 14:00 і 16:30 завтра. Бронюю 14:00?" },
    { kind: "caption", text: "Менше інструментів, кращі назви, корисні відповіді й помилки" },
  ],
};

export const mcpDesignDemo: DemoScript = {
  id: "arch-mcp-design",
  title: "Агент користується твоїм MCP-сервером",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Хост (Claude Code) підключився до сервера й отримав список інструментів" },
    { kind: "note", text: "MCP server shop-db: 2 tools, 1 resource, 1 prompt" },
    { kind: "input", text: "Скільки замовлень було минулого тижня і який товар найпопулярніший?" },
    { kind: "caption", text: "Ресурс дає контекст: схему бази" },
    { kind: "tool", name: "shop-db resource", detail: "schema://orders", result: "orders(id, product_id, created_at, total)…" },
    { kind: "caption", text: "Інструмент виконує дію: запит" },
    { kind: "tool", name: "shop-db - orders_query", detail: "{ period: \"last_week\", group_by: \"product\", response_format: \"concise\" }", result: "312 замовлень; топ: термокружка (58)" },
    { kind: "output", text: "Минулого тижня 312 замовлень. Найпопулярніша — термокружка: 58 штук." },
    { kind: "caption", text: "Tools — дії, resources — дані, prompts — готові шаблони" },
  ],
};
