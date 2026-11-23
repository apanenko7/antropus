import type { GlossaryEntry } from "@/content/types";

/** Terms used by the ai-sdlc module. One sentence each for `short` and `practice`. */
export const entries: GlossaryEntry[] = [
  {
    id: "user-story",
    abbr: "user story",
    full: "Користувацька історія",
    short: "Коротка вимога з погляду користувача: «Як <роль>, я хочу <дію>, щоб <користь>».",
    practice: "Агент краще розуміє, навіщо фіча, коли бачить історію, а не лише технічне завдання.",
    related: ["spec", "acceptance-criteria"],
  },
  {
    id: "acceptance-criteria",
    abbr: "критерії приймання",
    full: "Acceptance criteria",
    short: "Перелік перевірюваних умов, за яких фічу вважають зробленою.",
    practice: "Пиши їх у форматі Given/When/Then — з них агент одразу робить тести.",
    related: ["spec", "user-story", "definition-of-done"],
  },
  {
    id: "definition-of-done",
    abbr: "DoD",
    full: "Definition of Done — визначення «готово»",
    short: "Спільний для команди чекліст, що має бути виконано, перш ніж задачу закрито.",
    practice: "Тести зелені, lint чистий, рев'ю пройдено, документація оновлена — агент звіряється з цим списком, а не з відчуттям «наче готово».",
    related: ["quality-gate", "acceptance-criteria"],
  },
  {
    id: "human-in-the-loop",
    abbr: "human-in-the-loop",
    full: "Людина в циклі",
    short: "Підхід, коли ключові рішення й схвалення лишаються за людиною, а агент виконує решту.",
    practice: "Агент пише spec, план і код, але ти схвалюєш кожен етап перед наступним.",
    related: ["quality-gate", "sdlc"],
  },
  {
    id: "regression",
    abbr: "регресія",
    full: "Regression",
    short: "Помилка, коли нова зміна ламає те, що раніше працювало.",
    practice: "Повний набір тестів після кожної зміни агента ловить регресії до того, як їх побачать користувачі.",
    related: ["tdd", "quality-gate"],
  },
  {
    id: "lead-time",
    abbr: "lead time",
    full: "Час від задачі до релізу",
    short: "Скільки часу минає від появи задачі до того, як зміна працює в продакшені.",
    practice: "Корисна метрика ефекту від агентів — на відміну від кількості рядків коду.",
    related: ["sdlc"],
  },
];
