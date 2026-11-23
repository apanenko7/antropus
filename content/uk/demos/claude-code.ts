import type { DemoScript } from "@/content/types";

/* Demo sessions for module "claude-code". UI strings of Claude Code itself stay in English, as in the real tool. */

export const agentLoopDemo: DemoScript = {
  id: "cc-agent-loop",
  title: "Агентний цикл: «полагодь тести»",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Ти ставиш ціль, а не кроки" },
    { kind: "input", text: "тест для calcTotal падає, полагодь" },
    { kind: "caption", text: "1. Збирає контекст: запускає тести й читає помилку" },
    { kind: "tool", name: "Bash", detail: "npm test", result: "FAIL src/cart.test.ts\n  expected 90, received 100 (знижка не застосована)" },
    { kind: "tool", name: "Grep", detail: "\"calcTotal\"", result: "src/cart.ts, src/cart.test.ts" },
    { kind: "tool", name: "Read", detail: "src/cart.ts", result: "Read 42 lines" },
    { kind: "caption", text: "2. Діє: змінює код" },
    { kind: "output", text: "Знижка рахується, але не віднімається від суми. Виправляю." },
    {
      kind: "diff",
      file: "src/cart.ts",
      lines: ["  const discount = subtotal * rate;", "- return subtotal;", "+ return subtotal - discount;"],
    },
    { kind: "caption", text: "3. Перевіряє результат: запускає тести знову" },
    { kind: "tool", name: "Bash", detail: "npm test", result: "PASS  12 tests" },
    { kind: "output", text: "Готово: calcTotal тепер віднімає знижку, усі 12 тестів проходять." },
    { kind: "caption", text: "Зібрати контекст → діяти → перевірити, і так по колу" },
  ],
};

export const firstSessionDemo: DemoScript = {
  id: "cc-first-session",
  title: "Перша сесія в незнайомому проєкті",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Запуск у папці проєкту" },
    { kind: "note", text: "~/projects/shop $ claude" },
    { kind: "note", text: "Claude Code · Opus 5.5 · ~/projects/shop" },
    { kind: "caption", text: "Спершу розберись, потім змінюй" },
    { kind: "input", text: "що робить цей проєкт і де головна точка входу?" },
    { kind: "tool", name: "Read", detail: "package.json", result: "Read 38 lines" },
    { kind: "tool", name: "Glob", detail: "src/**/*.ts", result: "Found 27 files" },
    {
      kind: "output",
      text: "Це інтернет-магазин на Next.js. Вхід: src/app/page.tsx. Кошик у src/cart/, оплата в src/payments/. Тести запускаються через npm test.",
    },
    { kind: "caption", text: "Маленька перша зміна" },
    { kind: "input", text: "додай у футер рік через new Date().getFullYear()" },
    { kind: "tool", name: "Read", detail: "src/components/Footer.tsx", result: "Read 18 lines" },
    {
      kind: "diff",
      file: "src/components/Footer.tsx",
      lines: ["- <p>© Shop</p>", "+ <p>© {new Date().getFullYear()} Shop</p>"],
    },
    {
      kind: "ask",
      question: "Do you want to make this edit to Footer.tsx?",
      options: ["Yes", "Yes, allow all edits during this session", "No"],
      choice: 0,
    },
    { kind: "output", text: "Готово. Рік у футері тепер оновлюється автоматично." },
    { kind: "caption", text: "Переглянь diff, і лише потім погоджуйся" },
  ],
};

export const permissionsDemo: DemoScript = {
  id: "cc-permissions",
  title: "Запит дозволу на команду",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Агент хоче запустити команду: він питає" },
    { kind: "input", text: "запусти тести і скажи, що падає" },
    { kind: "tool", name: "Bash", detail: "npm test", result: "(чекає на дозвіл)" },
    {
      kind: "ask",
      question: "Bash command: npm test — Do you want to proceed?",
      options: ["Yes", "Yes, and don't ask again for: npm test *", "No"],
      choice: 1,
    },
    { kind: "note", text: "Правило збережено в .claude/settings.local.json" },
    { kind: "output", text: "Падає 1 тест з 40: auth.test.ts, «refresh token expired»." },
    { kind: "caption", text: "Небезпечне — тільки з підтвердженням" },
    { kind: "input", text: "почисти гілки, які вже злиті" },
    { kind: "tool", name: "Bash", detail: "git branch -d feature/old-login", result: "(чекає на дозвіл)" },
    {
      kind: "ask",
      question: "Bash command: git branch -d feature/old-login — Do you want to proceed?",
      options: ["Yes", "Yes, and don't ask again for: git branch *", "No"],
      choice: 0,
    },
    { kind: "caption", text: "Тести можна дозволити назавжди, видалення краще підтверджувати щоразу" },
  ],
};

export const planModeDemo: DemoScript = {
  id: "cc-plan-mode",
  title: "Plan mode перед великою зміною",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Shift+Tab, доки не з'явиться plan mode" },
    { kind: "note", text: "⏸ plan mode on (shift+tab to cycle)" },
    { kind: "input", text: "додай вхід через Google до існуючої авторизації" },
    { kind: "caption", text: "Агент лише читає та досліджує, файли не змінює" },
    { kind: "tool", name: "Grep", detail: "\"signIn\"", result: "src/auth/session.ts, src/app/login/page.tsx" },
    { kind: "tool", name: "Read", detail: "src/auth/session.ts", result: "Read 96 lines" },
    {
      kind: "output",
      text: "План:\n1. Додати OAuth-провайдер Google у src/auth/providers.ts\n2. Кнопка «Увійти через Google» на сторінці входу\n3. Зв'язати акаунт за email з існуючим користувачем\n4. Тест на колбек і на конфлікт email",
    },
    {
      kind: "ask",
      question: "Would you like to proceed?",
      options: ["Yes, and use auto mode", "Yes, manually approve edits", "No, keep planning"],
      choice: 2,
    },
    { kind: "input", text: "не зв'язуй акаунти автоматично, спитай користувача" },
    { kind: "output", text: "Оновив крок 3: показати екран підтвердження перед зв'язуванням акаунтів." },
    { kind: "caption", text: "Виправити план дешевше, ніж переписувати код" },
  ],
};

export const contextDemo: DemoScript = {
  id: "cc-context",
  title: "Команди для контексту",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "@ — дати файл одразу, без пошуку" },
    { kind: "input", text: "поясни, що робить @src/lib/retry.ts" },
    { kind: "output", text: "retry() повторює запит до 3 разів з паузою, що росте вдвічі: 200, 400, 800 мс." },
    { kind: "caption", text: "! — виконати команду самому, результат побачить Claude" },
    { kind: "input", text: "! git status" },
    { kind: "note", text: "modified: src/lib/retry.ts" },
    { kind: "caption", text: "Довга задача: стисни історію, але залиш головне" },
    { kind: "input", text: "/compact залиш лише рішення щодо retry і список змінених файлів" },
    { kind: "note", text: "Conversation compacted" },
    { kind: "caption", text: "Нова, не пов'язана задача: почни з чистого контексту" },
    { kind: "input", text: "/clear" },
    { kind: "note", text: "(новий порожній контекст; попередню розмову поверне /resume)" },
    { kind: "caption", text: "/compact всередині задачі, /clear між задачами" },
  ],
};

export const initDemo: DemoScript = {
  id: "cc-init",
  title: "/init створює CLAUDE.md",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Чернетку CLAUDE.md генерує сам Claude" },
    { kind: "input", text: "/init" },
    { kind: "tool", name: "Read", detail: "package.json", result: "Read 41 lines" },
    { kind: "tool", name: "Glob", detail: "**/*.config.*", result: "Found 4 files" },
    { kind: "tool", name: "Write", detail: "CLAUDE.md", result: "Wrote 24 lines" },
    {
      kind: "diff",
      file: "CLAUDE.md",
      lines: [
        "+ # Commands",
        "+ - Dev: npm run dev",
        "+ - One test: npx vitest run path/to/file.test.ts",
        "+ - Typecheck: npx tsc --noEmit",
        "+",
        "+ # Conventions",
        "+ - Errors via helpers in src/lib/errors.ts",
        "+",
        "+ # Gotchas",
        "+ - E2E tests need DATABASE_URL, see .env.example",
      ],
    },
    { kind: "caption", text: "Далі твоя робота — здебільшого викреслювати зайве" },
    { kind: "input", text: "прибери з CLAUDE.md опис структури папок, ти й так її бачиш" },
    { kind: "output", text: "Прибрав. Лишились команди, домовленості й підводні камені: 14 рядків." },
  ],
};

export const workflowDemo: DemoScript = {
  id: "cc-workflow",
  title: "Дослідити → спланувати → зробити → перевірити → закомітити",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "1. Досліди: жодних змін, тільки розуміння" },
    { kind: "input", text: "користувачі скаржаться, що після таймауту сесії не можна увійти. розберись у src/auth/, нічого не змінюй" },
    { kind: "tool", name: "Read", detail: "src/auth/refresh.ts", result: "Read 64 lines" },
    { kind: "output", text: "Знайшов: при протермінованому refresh-токені помилка ковтається, і користувач застрягає." },
    { kind: "caption", text: "2–3. Тест, що відтворює баг, потім виправлення" },
    { kind: "input", text: "напиши падаючий тест, що це відтворює, потім виправ і прожени тести" },
    { kind: "tool", name: "Write", detail: "src/auth/refresh.test.ts", result: "Wrote 22 lines" },
    { kind: "tool", name: "Bash", detail: "npx vitest run src/auth", result: "FAIL 1 (як і очікували)" },
    {
      kind: "diff",
      file: "src/auth/refresh.ts",
      lines: ["- } catch { /* ignore */ }", "+ } catch (e) {", "+   await signOut();", "+   throw new SessionExpiredError(e);", "+ }"],
    },
    { kind: "caption", text: "4. Перевір: агент сам бачить, чи готово" },
    { kind: "tool", name: "Bash", detail: "npx vitest run src/auth", result: "PASS 9 tests" },
    { kind: "caption", text: "5. Коміт з осмисленим повідомленням" },
    { kind: "input", text: "закоміть" },
    { kind: "tool", name: "Bash", detail: "git commit -m \"Sign out on expired refresh token\"", result: "[fix/session 3f2a1c9] 2 files changed" },
    { kind: "caption", text: "Кожен крок короткий і перевірний" },
  ],
};
