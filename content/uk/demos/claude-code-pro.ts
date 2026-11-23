import type { DemoScript } from "@/content/types";

/* Demo sessions for module "claude-code-pro". Claude Code UI strings stay in English, as in the real tool. */

export const skillDemo: DemoScript = {
  id: "ccpro-skill",
  title: "Skill для релізних нотаток",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Повторюваний процес → skill" },
    { kind: "input", text: "створи skill release-notes: збирає зміни з git log з останнього тегу і пише нотатки українською" },
    { kind: "tool", name: "Bash", detail: "git describe --tags --abbrev=0", result: "v1.4.0" },
    { kind: "tool", name: "Write", detail: ".claude/skills/release-notes/SKILL.md", result: "Wrote 18 lines" },
    {
      kind: "diff",
      file: ".claude/skills/release-notes/SKILL.md",
      lines: [
        "+---",
        "+name: release-notes",
        "+description: Write release notes from git history since the last tag. Use when preparing a release.",
        "+disable-model-invocation: true",
        "+---",
        "+",
        "+1. Find the last tag: git describe --tags --abbrev=0",
        "+2. Read commits since it: git log <tag>..HEAD --oneline",
        "+3. Group into Нове / Виправлено / Інше, write in Ukrainian",
      ],
    },
    { kind: "caption", text: "Тепер процес запускається однією командою" },
    { kind: "input", text: "/release-notes" },
    { kind: "tool", name: "Bash", detail: "git log v1.4.0..HEAD --oneline", result: "7 commits" },
    { kind: "output", text: "## v1.5.0\n**Нове:** експорт у CSV, темна тема\n**Виправлено:** падіння при порожньому кошику" },
    { kind: "caption", text: "Однаковий результат щоразу, без пояснень з нуля" },
  ],
};

export const subagentDemo: DemoScript = {
  id: "ccpro-subagent",
  title: "Субагент шукає, основна сесія лишається чистою",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Великий пошук делегуємо" },
    { kind: "input", text: "з'ясуй, де в проєкті перевіряються права доступу, і чи є місця без перевірки" },
    { kind: "tool", name: "Agent", detail: "Explore: find permission checks", result: "Searched 214 files · Read 31 files" },
    { kind: "note", text: "Усі 31 прочитаних файли лишились у контексті субагента, не в твоєму" },
    {
      kind: "output",
      text: "Перевірки в middleware/auth.ts і в 9 роутах. Без перевірки: api/export.ts і api/admin/stats.ts.",
    },
    { kind: "caption", text: "Власний субагент-рев'юер" },
    { kind: "input", text: "use the security-reviewer subagent on api/export.ts" },
    { kind: "tool", name: "Agent", detail: "security-reviewer", result: "Read 3 files" },
    { kind: "output", text: "Критично: експорт доступний без авторизації. Додай requireRole('admin') перед обробником." },
    { kind: "caption", text: "У головну сесію повертається лише висновок" },
  ],
};

export const hookDemo: DemoScript = {
  id: "ccpro-hook",
  title: "Хук блокує небезпечну команду",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "У .claude/settings.json є PreToolUse-хук на Bash" },
    { kind: "input", text: "почисти папку build і все зайве в корені" },
    { kind: "tool", name: "Bash", detail: "rm -rf ./build ./*", result: "Blocked by PreToolUse hook: Destructive command blocked by hook" },
    { kind: "caption", text: "Хук спрацював до виконання: агент отримав причину" },
    { kind: "output", text: "Хук заборонив rm -rf. Видалю лише build через npm script." },
    { kind: "tool", name: "Bash", detail: "npm run clean", result: "removed build/" },
    { kind: "caption", text: "PostToolUse-хук форматує кожен змінений файл" },
    { kind: "tool", name: "Edit", detail: "src/app.ts", result: "Updated 2 lines" },
    { kind: "note", text: "PostToolUse · npx prettier --write src/app.ts" },
    { kind: "caption", text: "Хуки спрацьовують завжди, а не «коли модель згадає»" },
  ],
};

export const mcpDemo: DemoScript = {
  id: "ccpro-mcp",
  title: "Підключаємо MCP-сервер Sentry",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Додаємо віддалений сервер одним рядком" },
    { kind: "note", text: "$ claude mcp add --transport http sentry https://mcp.sentry.dev/mcp" },
    { kind: "note", text: "Added HTTP MCP server sentry to local config" },
    { kind: "caption", text: "У сесії: /mcp → вхід через OAuth" },
    { kind: "input", text: "/mcp" },
    { kind: "note", text: "sentry · needs authentication → Authenticate … ✔ connected" },
    { kind: "caption", text: "Тепер агент бачить помилки з продакшну" },
    { kind: "input", text: "які 3 найчастіші помилки за добу і де вони в коді?" },
    { kind: "tool", name: "mcp__sentry__search_issues", detail: "last 24h, sort by count", result: "3 issues" },
    { kind: "tool", name: "Read", detail: "src/checkout/pay.ts", result: "Read 120 lines" },
    { kind: "output", text: "1. TypeError у pay.ts:48 — немає перевірки на порожню адресу (1 240 подій)…" },
    { kind: "caption", text: "Дані із зовнішнього сервісу + твій код в одній сесії" },
  ],
};

export const teamDemo: DemoScript = {
  id: "ccpro-team",
  title: "Спільні налаштування команди",
  variant: "terminal",
  steps: [
    { kind: "caption", text: "Новий розробник клонує репозиторій" },
    { kind: "note", text: "$ git clone acme/shop && cd shop && claude" },
    { kind: "ask", question: "Do you trust the files in this folder?", options: ["Yes, proceed", "No, exit"], choice: 0 },
    { kind: "caption", text: "Командний .claude/settings.json уже діє" },
    { kind: "input", text: "запусти тести і покажи вміст .env" },
    { kind: "tool", name: "Bash", detail: "npm run test", result: "PASS 48 tests (allow: Bash(npm run *))" },
    { kind: "tool", name: "Read", detail: ".env", result: "Permission denied by deny rule Read(./.env)" },
    { kind: "output", text: "Тести пройшли. .env прочитати не можу: це заборонено правилами проєкту." },
    { kind: "caption", text: "Плагін команди теж підтягується з налаштувань" },
    { kind: "input", text: "/plugin" },
    { kind: "note", text: "Installed · code-formatter@acme-tools (enabled by project settings)" },
    { kind: "caption", text: "Одні правила для всіх — без інструкцій у Slack" },
  ],
};
