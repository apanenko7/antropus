import type { DemoScript } from "@/content/types";

export const sdlcFlowDemo: DemoScript = {
  id: "sdlc-flow",
  title: "Від задачі до PR з «воротами»",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Етап 1: досліджуємо в plan mode — агент нічого не змінює" },
    { kind: "note", text: "⏸ plan mode on (shift+tab to cycle)" },
    { kind: "input", text: "Треба додати експорт звіту в CSV. Подивись, як зараз влаштовані звіти, і запропонуй план" },
    { kind: "tool", name: "Grep", detail: "\"report\" in src/", result: "Found 9 files" },
    { kind: "tool", name: "Read", detail: "src/reports/service.ts", result: "Read 142 lines" },
    { kind: "output", text: "План:\n1. Додати toCsv() у src/reports/format.ts\n2. Ендпоінт GET /reports/:id.csv\n3. Тести на екранування ком і лапок\nВідкрите питання: потрібна кодування UTF-8 з BOM для Excel?" },
    { kind: "caption", text: "Ворота 1: людина схвалює план і відповідає на питання" },
    { kind: "ask", question: "Would you like to proceed?", options: ["Yes, and use auto mode", "Yes, manually approve edits", "No, keep planning"], choice: 1 },
    { kind: "caption", text: "Етап 2: тести першими, потім код" },
    { kind: "tool", name: "Write", detail: "src/reports/format.test.ts", result: "4 tests" },
    { kind: "tool", name: "Bash", detail: "npm test -- format", result: "4 failed (expected: no implementation yet)" },
    { kind: "tool", name: "Edit", detail: "src/reports/format.ts", result: "+38 lines" },
    { kind: "tool", name: "Bash", detail: "npm test && npm run lint", result: "All 212 tests passed · lint clean" },
    { kind: "caption", text: "Ворота 2: незалежне рев'ю свіжим контекстом" },
    { kind: "input", text: "/code-review" },
    { kind: "output", text: "1 finding: CSV injection — значення, що починаються з =, + або -, треба екранувати." },
    { kind: "caption", text: "Ворота 3: людина дивиться diff і PR" },
  ],
};

export const interviewDemo: DemoScript = {
  id: "sdlc-interview",
  title: "Claude інтерв'ює тебе перед специфікацією",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Ще не знаєш усіх деталей? Нехай агент розпитає" },
    { kind: "input", text: "Хочу додати обмеження частоти запитів до публічного API, але ще не продумав. Інтерв'юй мене, поки не зможеш написати spec, потім запиши в SPEC.md" },
    { kind: "output", text: "Питання 1/5. Ліміт рахуємо:\n  a) на користувача\n  b) на API-ключ\n  c) на IP" },
    { kind: "input", text: "b" },
    { kind: "output", text: "Питання 2/5. Що робимо із запитом понад ліміт?\n  a) 429 + Retry-After\n  b) ставимо в чергу\n  c) пропускаємо, але логуємо" },
    { kind: "input", text: "a" },
    { kind: "note", text: "… ще 3 питання: межі, винятки, що поза рамками …" },
    { kind: "tool", name: "Write", detail: "SPEC.md", result: "Goal · Non-goals · User stories · Acceptance criteria (6) · Open questions (1)" },
    { kind: "caption", text: "Далі — нова сесія: будуємо з чистим контекстом і готовим «визначенням готово»" },
    { kind: "input", text: "/clear" },
    { kind: "input", text: "Реалізуй SPEC.md. Спершу план у plan mode" },
  ],
};

export const adrDemo: DemoScript = {
  id: "sdlc-adr",
  title: "Агент пише ADR і поважає вже ухвалені",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Рішення ухвалено — просимо зафіксувати його" },
    { kind: "input", text: "Ми вирішили зберігати сесії в Redis, а не в Postgres. Напиши ADR за шаблоном з docs/adr/" },
    { kind: "tool", name: "Glob", detail: "docs/adr/*.md", result: "0001-use-postgres.md, 0002-rest-not-graphql.md" },
    { kind: "tool", name: "Write", detail: "docs/adr/0003-sessions-in-redis.md", result: "Status: Proposed · Context · Decision · Alternatives · Consequences" },
    { kind: "output", text: "Чернетку створено зі статусом Proposed. Зміни на Accepted, коли команда погодить." },
    { kind: "caption", text: "Тиждень потому: агент натикається на ухвалене рішення" },
    { kind: "input", text: "Додай GraphQL-ендпоінт для звітів" },
    { kind: "tool", name: "Read", detail: "docs/adr/0002-rest-not-graphql.md", result: "Status: Accepted" },
    { kind: "output", text: "ADR-0002 (Accepted) фіксує: лише REST. Пропоную REST-ендпоінт /reports або спершу новий ADR, який замінить 0002. Як робимо?" },
    { kind: "caption", text: "Агент не «перевідкриває» рішення мовчки, а питає" },
  ],
};

export const reviewDemo: DemoScript = {
  id: "sdlc-review",
  title: "Тести першими і рев'ю без упередження",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Ціль, яку агент може перевірити сам" },
    { kind: "input", text: "Користувачі скаржаться: після тайм-ауту сесії логін падає. Подивись token refresh у src/auth/, напиши тест, що відтворює баг, потім виправ" },
    { kind: "tool", name: "Write", detail: "src/auth/refresh.test.ts", result: "1 test" },
    { kind: "tool", name: "Bash", detail: "npm test -- refresh", result: "1 failed ✓ баг відтворено" },
    { kind: "tool", name: "Edit", detail: "src/auth/refresh.ts", result: "+6 −2" },
    { kind: "tool", name: "Bash", detail: "npm test && npm run typecheck", result: "All passed" },
    { kind: "caption", text: "Рев'юер, що не бачив, як писався код" },
    { kind: "input", text: "Скористайся субагентом reviewer: звір diff із SPEC.md, перевір, що кожна вимога реалізована й має тест. Стиль пропускай" },
    { kind: "tool", name: "Agent", detail: "reviewer (tools: Read, Grep, Glob)", result: "1 gap: немає тесту на прострочений refresh token" },
    { kind: "output", text: "Додаю тест на прострочений refresh token і перевіряю ще раз." },
    { kind: "caption", text: "Докази, а не «все працює»: команда і її вивід" },
  ],
};

export const teamDemo: DemoScript = {
  id: "sdlc-team",
  title: "Налаштування команди живуть у репозиторії",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Новий розробник клонує репозиторій — і агент уже знає правила" },
    { kind: "input", text: "Які в цьому репо правила для агента?" },
    { kind: "tool", name: "Read", detail: "CLAUDE.md", result: "Команди тестів, рішення команди, посилання на docs/adr/" },
    { kind: "tool", name: "Glob", detail: ".claude/**", result: "settings.json · agents/reviewer.md · skills/release/SKILL.md" },
    { kind: "output", text: "• Тести: pnpm test, один файл: pnpm vitest run <path>\n• Рев'ю: субагент reviewer перед кожним PR\n• Реліз: skill /release\n• Заборонено: читати .env, правити migrations/ (deny-правила й хук)" },
    { kind: "caption", text: "Особисті вподобання — окремо, поза git" },
    { kind: "note", text: "CLAUDE.local.md → у .gitignore" },
  ],
};
