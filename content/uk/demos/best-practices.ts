import type { DemoScript } from "@/content/types";

export const efficiencyDemo: DemoScript = {
  id: "bp-efficiency",
  title: "Звідки беруться токени",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Сесія вже пережила три різні задачі" },
    { kind: "input", text: "/usage" },
    { kind: "note", text: "Session · Estimated cost: $4.80 · Prompt cache (main): 38 requests · 72% of input tokens from cache" },
    { kind: "caption", text: "Кожен запит знову надсилає всю історію — навіть стару задачу" },
    { kind: "input", text: "/clear auth-refactor" },
    { kind: "note", text: "Session saved as auth-refactor. Starting a new conversation." },
    { kind: "caption", text: "Нова задача — точне посилання замість «подивись усе»" },
    { kind: "input", text: "Додай валідацію email у @src/auth/signup.ts. Перевір: npm test -- signup" },
    { kind: "tool", name: "Edit", detail: "src/auth/signup.ts", result: "Updated 1 file" },
    { kind: "tool", name: "Bash", detail: "npm test -- signup", result: "✓ 6 passed" },
    { kind: "output", text: "Готово: email перевіряється перед створенням акаунта, 6 тестів зелені." },
    { kind: "caption", text: "Менше контексту + ціль для перевірки = менше токенів і менше спроб" },
  ],
};

export const parallelDemo: DemoScript = {
  id: "bp-parallel",
  title: "Дві сесії, два worktree",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Термінал 1: фіча в окремій робочій копії" },
    { kind: "input", text: "claude -w feature-export" },
    { kind: "note", text: "— нова робоча копія на власній гілці —" },
    { kind: "input", text: "Додай експорт звіту в CSV за SPEC.md" },
    { kind: "tool", name: "Read", detail: "SPEC.md" },
    { kind: "caption", text: "Термінал 2: баг-фікс паралельно, файли не перетинаються" },
    { kind: "input", text: "claude -w fix-date-format" },
    { kind: "input", text: "Дати в таблиці показуються в UTC. Виправ на локальний час, тест у dates.test.ts" },
    { kind: "tool", name: "Bash", detail: "npm test -- dates", result: "✓ 4 passed" },
    { kind: "caption", text: "Термінал 3: рев'юер, який не бачив, як писався код" },
    { kind: "input", text: "Перевір @src/export/csv.ts на відповідність SPEC.md. Тільки помилки, без стилю" },
    { kind: "output", text: "1 проблема: порожні значення не екрануються лапками (вимога 3 у SPEC.md)." },
    { kind: "caption", text: "Знахідки рев'юера повертаєш у першу сесію" },
  ],
};

export const modelDemo: DemoScript = {
  id: "bp-model",
  title: "Модель і effort під задачу",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Швидкий перейменувальний рефакторинг — не треба думати довго" },
    { kind: "input", text: "/effort low" },
    { kind: "note", text: "Effort set to low" },
    { kind: "input", text: "Перейменуй getUserData на fetchUser у src/api" },
    { kind: "tool", name: "Edit", detail: "3 files", result: "Updated 3 files" },
    { kind: "caption", text: "Плаваючий тест у чужому коді — тут варто думати глибше" },
    { kind: "input", text: "/effort high" },
    { kind: "input", text: "Тест payments.test.ts іноді падає. Знайди причину, не змінюючи сам тест" },
    { kind: "output", text: "Причина: два тести ділять один мок часу. Пропоную ізолювати мок у beforeEach." },
    { kind: "caption", text: "Найскладніша задача без нагляду — найпотужніша модель" },
    { kind: "input", text: "/model fable" },
    { kind: "note", text: "Switched to Fable" },
    { kind: "caption", text: "Не плати за max там, де вистачить medium" },
  ],
};

export const antipatternsDemo: DemoScript = {
  id: "bp-antipatterns",
  title: "Третя правка чи /clear?",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Дві правки підряд не допомогли" },
    { kind: "input", text: "Ні, кнопка має бути праворуч, я ж казав" },
    { kind: "output", text: "Перепрошую! Переніс кнопку праворуч…" },
    { kind: "input", text: "Тепер зламався мобільний вигляд" },
    { kind: "caption", text: "Третя правка лише додасть ще одну невдалу спробу в історію" },
    { kind: "input", text: "/clear" },
    { kind: "caption", text: "Новий промпт, у якому вже враховано все, що з'ясували" },
    {
      kind: "input",
      text: "У @src/components/Header.tsx перенеси кнопку «Увійти» праворуч на десктопі (від 768px). На мобільному вона лишається в меню. Перевір: npm run test:e2e -- header",
    },
    { kind: "tool", name: "Edit", detail: "src/components/Header.tsx", result: "Updated 1 file" },
    { kind: "tool", name: "Bash", detail: "npm run test:e2e -- header", result: "✓ 4 passed" },
    { kind: "caption", text: "Одна чітка спроба замість трьох латок" },
  ],
};

export const setupDemo: DemoScript = {
  id: "bp-setup",
  title: "Перші 30 хвилин у новому репозиторії",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Крок 1: розібратися в проєкті" },
    { kind: "input", text: "give me an overview of this codebase" },
    { kind: "output", text: "Next.js застосунок, тести на Vitest, e2e на Playwright, деплой через GitHub Actions…" },
    { kind: "caption", text: "Крок 2: чернетка CLAUDE.md, далі в основному викреслюємо" },
    { kind: "input", text: "/init" },
    { kind: "tool", name: "Write", detail: "CLAUDE.md", result: "Created CLAUDE.md (34 lines)" },
    { kind: "caption", text: "Крок 3: рядок стану з моделлю і заповненням контексту" },
    { kind: "input", text: "/statusline show model name and context percentage with a progress bar" },
    { kind: "tool", name: "Write", detail: "~/.claude/statusline.sh" },
    { kind: "caption", text: "Крок 4: перевірити, що реально завантажено в контекст" },
    { kind: "input", text: "/context" },
    { kind: "note", text: "System prompt · Tools · MCP tools (deferred) · Memory files: CLAUDE.md · Messages" },
    { kind: "caption", text: "Решту — дозволи, хуки, skills — додаєш, коли щось повторилось двічі" },
  ],
};
