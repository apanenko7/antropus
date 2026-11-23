import type { Course } from "@/content/types";

/**
 * Course structure. Each lesson maps to content/uk/<module>/<lesson>.mdx.
 * Order here is the order in the UI.
 */
export const course: Course = {
  modules: [
    {
      slug: "basics",
      badge: "01",
      title: "Основи ШІ",
      summary: "Як «думає» мовна модель, що таке токени й контекст, яку модель Claude обрати.",
      lessons: [
        { slug: "llm-tokens", title: "LLM і токени", summary: "Що таке мовна модель і чому вона рахує токенами, а не словами.", minutes: 6 },
        { slug: "context-window", title: "Контекстне вікно", summary: "Скільки модель «пам'ятає» в розмові і що з цим робити.", minutes: 6 },
        { slug: "models", title: "Моделі Claude", summary: "Opus, Sonnet, Haiku, Fable: чим відрізняються і коли яку брати.", minutes: 6 },
        { slug: "limits", title: "Галюцинації та межі", summary: "Чому модель іноді впевнено помиляється і як цього уникати.", minutes: 5 },
      ],
    },
    {
      slug: "prompting",
      badge: "02",
      title: "Промптинг",
      summary: "Як формулювати запит, щоб отримати потрібний результат з першого разу.",
      lessons: [
        { slug: "clarity", title: "Чіткість і контекст", summary: "Головне правило: пиши як для розумного колеги, який нічого не знає про задачу.", minutes: 7 },
        { slug: "examples", title: "Приклади (few-shot)", summary: "Один хороший приклад замінює абзац пояснень.", minutes: 6 },
        { slug: "xml-structure", title: "Структура та XML-теги", summary: "Як розкласти довгий промпт по поличках.", minutes: 6 },
        { slug: "output-format", title: "Формат і роль", summary: "Як отримати відповідь у потрібній формі: JSON, таблиця, тон.", minutes: 6 },
        { slug: "iterate", title: "Складні задачі та ітерації", summary: "Розбивай, дай подумати, покращуй промпт крок за кроком.", minutes: 7 },
      ],
    },
    {
      slug: "claude-code",
      badge: "03",
      title: "Claude Code: старт",
      summary: "Агент для коду в терміналі: встановлення, дозволи, контекст, CLAUDE.md і робочий цикл.",
      lessons: [
        { slug: "what-is", title: "Що таке Claude Code", summary: "Чим агент відрізняється від чату і як працює його цикл.", minutes: 6 },
        { slug: "first-session", title: "Перша сесія", summary: "Встановлення, запуск і перша задача в реальному проєкті.", minutes: 7 },
        { slug: "permissions-plan", title: "Дозволи та Plan mode", summary: "Як контролювати, що агент робить, і планувати перед кодом.", minutes: 7 },
        { slug: "context-commands", title: "Контекст і slash-команди", summary: "/clear, /compact, @-файли та інші команди на щодень.", minutes: 6 },
        { slug: "claude-md", title: "CLAUDE.md", summary: "Постійні інструкції для проєкту: що туди писати, а що ні.", minutes: 7 },
        { slug: "workflow", title: "Робочий цикл", summary: "Дослідити → спланувати → зробити → перевірити → закомітити.", minutes: 7 },
      ],
    },
    {
      slug: "claude-ai",
      badge: "04",
      title: "Claude.ai на практиці",
      summary: "Чат на максимум: файли, Projects, Artifacts, конектори і коли чат кращий за агента.",
      lessons: [
        { slug: "chat-power", title: "Чат на максимум", summary: "Файли, зображення, пошук у вебі, міркування й стилі відповіді.", minutes: 6 },
        { slug: "projects", title: "Projects", summary: "Постійні інструкції й база знань для повторюваних задач.", minutes: 6 },
        { slug: "artifacts", title: "Artifacts", summary: "Документи, код і міні-застосунки поруч із чатом.", minutes: 6 },
        { slug: "connectors", title: "Конектори та інструменти", summary: "Google Drive, пошта, календар і MCP-конектори прямо в чаті.", minutes: 6 },
        { slug: "chat-or-agent", title: "Чат чи агент?", summary: "Коли досить чату, а коли потрібен Claude Code чи інший агент.", minutes: 5 },
      ],
    },
    {
      slug: "claude-code-pro",
      badge: "05",
      title: "Claude Code: прокачка",
      summary: "Skills, субагенти, хуки, MCP, плагіни й налаштування під команду.",
      lessons: [
        { slug: "skills", title: "Skills", summary: "Повторювані процеси як навички, що агент підвантажує сам.", minutes: 7 },
        { slug: "subagents", title: "Субагенти", summary: "Помічники з окремим контекстом для пошуку, рев'ю та паралельної роботи.", minutes: 7 },
        { slug: "hooks", title: "Хуки", summary: "Автоматичні дії на події: форматування, перевірки, заборони.", minutes: 7 },
        { slug: "mcp", title: "MCP-сервери", summary: "Підключаємо Figma, Jira, бази даних, браузер та інше.", minutes: 7 },
        { slug: "team-setup", title: "Налаштування для команди", summary: "Ієрархія settings, спільні дозволи, плагіни й маркетплейси.", minutes: 7 },
      ],
    },
    {
      slug: "agent-env",
      badge: "06",
      title: "Агентне середовище",
      summary: "Що таке harness, контекст-інжиніринг, headless і CI, безпека та власні агенти.",
      lessons: [
        { slug: "harness", title: "Що таке harness", summary: "Модель — це мозок, harness — тіло: цикл, інструменти, контекст, дозволи.", minutes: 7 },
        { slug: "context-engineering", title: "Контекст-інжиніринг", summary: "Як тримати контекст агента чистим і корисним.", minutes: 7 },
        { slug: "headless-ci", title: "Headless і CI", summary: "claude -p, скрипти й GitHub Actions: агент без інтерфейсу.", minutes: 7 },
        { slug: "security", title: "Безпека й ізоляція", summary: "Пісочниці, контейнери, prompt injection і секрети.", minutes: 7 },
        { slug: "own-agent", title: "Власний агент", summary: "Agent SDK, Messages API з інструментами і Managed Agents: що обрати.", minutes: 7 },
      ],
    },
    {
      slug: "ai-sdlc",
      badge: "07",
      title: "AI-SDLC",
      summary: "Процес розробки з агентами: специфікації, ADR, тести, рев'ю і «ворота» якості.",
      lessons: [
        { slug: "overview", title: "SDLC з агентом", summary: "Хто що робить на кожному етапі: людина чи агент.", minutes: 7 },
        { slug: "specs", title: "Специфікація перед кодом", summary: "Вимоги й критерії приймання, з якими агент не вгадує.", minutes: 7 },
        { slug: "adr", title: "ADR: фіксуємо рішення", summary: "Як записувати архітектурні рішення, щоб агент їх поважав.", minutes: 6 },
        { slug: "tests-review", title: "Тести, рев'ю і quality gates", summary: "Як перевіряти роботу агента системно, а не «на око».", minutes: 7 },
        { slug: "team", title: "Агенти в команді", summary: "Спільні правила, ролі, метрики й поступове впровадження.", minutes: 6 },
      ],
    },
    {
      slug: "best-practices",
      badge: "08",
      title: "Бест практики",
      summary: "Як отримувати максимум: економія токенів, паралельна робота, вибір моделі, антипатерни.",
      lessons: [
        { slug: "efficiency", title: "Економія токенів і часу", summary: "Менше контексту, кешування, короткі цикли — і рахунок нижчий.", minutes: 6 },
        { slug: "parallel", title: "Паралельна робота", summary: "Кілька сесій, worktrees і субагенти одночасно.", minutes: 6 },
        { slug: "model-choice", title: "Модель і effort під задачу", summary: "Коли Haiku, коли Opus, коли Fable і скільки думати.", minutes: 6 },
        { slug: "antipatterns", title: "Антипатерни", summary: "Найчастіші помилки при роботі з агентами і як їх уникнути.", minutes: 6 },
        { slug: "daily-setup", title: "Твій робочий сетап", summary: "Чекліст: що налаштувати раз і назавжди.", minutes: 6 },
      ],
    },
    {
      slug: "evals",
      badge: "09",
      title: "Оцінка та evals",
      summary: "Як перевіряти відповіді моделі системно: критерії успіху, тестові набори, автоматична оцінка.",
      lessons: [
        { slug: "validate-output", title: "Перевірка відповідей", summary: "Як не приймати відповідь «на віру»: факти, формат, логіка, джерела.", minutes: 6 },
        { slug: "success-criteria", title: "Критерії успіху", summary: "Що означає «добре» для твоєї задачі — конкретно й вимірювано.", minutes: 6 },
        { slug: "evals-basics", title: "Evals: тестовий набір для промпту", summary: "Набір прикладів, на яких перевіряєш кожну зміну промпту.", minutes: 7 },
        { slug: "graders", title: "Як оцінювати: код, модель, людина", summary: "Точні перевірки, LLM-as-judge і людська оцінка: що коли.", minutes: 7 },
        { slug: "prompt-iteration", title: "Цикл покращення промпту", summary: "Змінив → прогнав evals → порівняв → залишив краще.", minutes: 6 },
      ],
    },
    {
      slug: "governance",
      badge: "10",
      title: "Відповідальне використання",
      summary: "Ризики, дані, політики й людський контроль: як використовувати ШІ безпечно в роботі.",
      lessons: [
        { slug: "risks", title: "Ризики ШІ на практиці", summary: "Галюцинації, упередження, витоки, надмірна довіра — і як їх зменшити.", minutes: 6 },
        { slug: "data-privacy", title: "Дані та приватність", summary: "Що можна давати моделі, а що ні: персональні дані, секрети, NDA.", minutes: 6 },
        { slug: "human-oversight", title: "Людина в циклі", summary: "Де обов'язкове рішення людини і як побудувати контроль.", minutes: 6 },
        { slug: "org-policy", title: "Політики в компанії", summary: "Правила використання ШІ для команди: доступи, аудит, навчання.", minutes: 6 },
      ],
    },
    {
      slug: "api",
      badge: "11",
      title: "Claude API в застосунках",
      summary: "Messages API, streaming, помилки, інструменти, batches і кешування — для розробників.",
      lessons: [
        { slug: "messages-api", title: "Перший запит до API", summary: "Ключ, SDK, Messages API: system, messages, max_tokens.", minutes: 7 },
        { slug: "streaming", title: "Streaming і довгі відповіді", summary: "Як показувати відповідь по мірі генерації і не впертися в таймаути.", minutes: 6 },
        { slug: "errors-limits", title: "Помилки, ретраї й ліміти", summary: "429, 5xx, stop_reason, refusal — і як на них реагувати.", minutes: 7 },
        { slug: "tools-structured", title: "Інструменти та структуровані відповіді", summary: "Tool use і structured outputs: модель викликає твій код і повертає JSON.", minutes: 7 },
        { slug: "cost-scale", title: "Вартість і масштаб", summary: "Prompt caching, batches, effort і вибір моделі для продакшну.", minutes: 7 },
      ],
    },
    {
      slug: "agent-architecture",
      badge: "12",
      title: "Архітектура агентів",
      summary: "Патерни workflows і агентів, проєктування інструментів і MCP-серверів.",
      lessons: [
        { slug: "workflow-vs-agent", title: "Workflow чи агент?", summary: "Коли досить фіксованого ланцюжка, а коли потрібен автономний агент.", minutes: 7 },
        { slug: "patterns", title: "Патерни: chaining, routing, parallel", summary: "Базові будівельні блоки систем на LLM.", minutes: 7 },
        { slug: "orchestration", title: "Orchestrator-workers і evaluator-optimizer", summary: "Як агенти ділять роботу і перевіряють одне одного.", minutes: 7 },
        { slug: "tool-design", title: "Проєктування інструментів", summary: "Назви, описи, схеми й помилки інструментів, які модель розуміє.", minutes: 7 },
        { slug: "mcp-design", title: "Свій MCP-сервер", summary: "Tools, resources, prompts: як спроєктувати сервер для агентів.", minutes: 7 },
      ],
    },
  ],
};
