import type { DemoScript } from "@/content/types";

export const tokensDemo: DemoScript = {
  id: "tokens-demo",
  title: "Як модель «бачить» текст",
  variant: "chat",
  steps: [
    { kind: "caption", text: "Ти пишеш звичайне речення" },
    { kind: "input", text: "Привіт! Як справи?" },
    { kind: "caption", text: "Модель отримує не слова, а токени" },
    { kind: "note", text: "[При][віт][!] [Як] [спра][ви][?]  ≈ 7 токенів" },
    { kind: "caption", text: "Те саме англійською зазвичай коротше" },
    { kind: "input", text: "Hi! How are you?" },
    { kind: "note", text: "[Hi][!] [How] [are] [you][?]  ≈ 6 токенів" },
    { kind: "caption", text: "Модель передбачає наступний токен, знову і знову" },
    { kind: "output", text: "Привіт! У мене все добре, дякую 🙂 Чим можу допомогти?" },
    { kind: "note", text: "Кожне слово відповіді = один або кілька кроків «вгадай наступний токен»" },
  ],
};

export const contextDemo: DemoScript = {
  id: "context-demo",
  title: "Нова розмова = чиста пам'ять",
  variant: "chat",
  steps: [
    { kind: "caption", text: "Розмова 1: даєш контекст" },
    { kind: "input", text: "Я пишу на TypeScript, проєкт на Next.js, відступи — 2 пробіли." },
    { kind: "output", text: "Зрозумів! Писатиму код під Next.js на TypeScript з відступом у 2 пробіли." },
    { kind: "note", text: "— нова розмова —" },
    { kind: "caption", text: "Розмова 2: контексту вже немає" },
    { kind: "input", text: "Напиши функцію форматування дати" },
    { kind: "output", text: "Ось функція на Python:\ndef format_date(d):\n    return d.strftime(\"%d.%m.%Y\")" },
    { kind: "caption", text: "Модель не пам'ятає попередніх розмов. Постійні правила треба давати щоразу або зберігати в інструкціях проєкту" },
  ],
};

export const modelsDemo: DemoScript = {
  id: "models-demo",
  title: "Одна задача — різні моделі",
  variant: "chat",
  steps: [
    { kind: "caption", text: "Проста задача: класифікувати відгук" },
    { kind: "input", text: "Відгук: «Доставка швидка, але коробка м'ята». Позитивний чи негативний? Одне слово." },
    { kind: "note", text: "Haiku · ~0.5 с" },
    { kind: "output", text: "Змішаний" },
    { kind: "caption", text: "Для такої задачі Haiku досить: швидко й дешево" },
    { kind: "caption", text: "Складна задача: спроєктувати архітектуру" },
    { kind: "input", text: "Спроєктуй схему БД для маркетплейсу з продавцями, замовленнями, поверненнями й комісіями. Поясни компроміси." },
    { kind: "note", text: "Opus · думає довше, глибша відповідь" },
    { kind: "output", text: "Пропоную 7 таблиць… Ключовий компроміс: зберігати комісію в замовленні (історична точність) чи рахувати на льоту (гнучкість)…" },
    { kind: "caption", text: "Складна логіка й архітектура → потужніша модель" },
  ],
};

export const limitsDemo: DemoScript = {
  id: "limits-demo",
  title: "Галюцинація і як її зупинити",
  variant: "chat",
  steps: [
    { kind: "caption", text: "Питання про маловідомий факт без джерела" },
    { kind: "input", text: "Яка цитата з виступу нашого CEO на конференції 2024 року?" },
    { kind: "output", text: "На конференції CEO сказав: «Майбутнє належить тим, хто сміливо інвестує в людей»." },
    { kind: "caption", text: "Звучить правдоподібно, але це вигадка: модель не бачила цього виступу" },
    { kind: "note", text: "— нова розмова —" },
    { kind: "caption", text: "Даємо джерело і дозволяємо сказати «не знаю»" },
    {
      kind: "input",
      text: "Ось стенограма виступу: <transcript>…</transcript>\nЗнайди цитату про найм. Якщо такої немає — так і скажи.",
    },
    { kind: "output", text: "У стенограмі немає прямої цитати про найм. Найближче: «Ми подвоїмо команду підтримки до кінця року» (абзац 4)." },
    { kind: "caption", text: "Джерело + дозвіл на «не знаю» = чесна відповідь" },
  ],
};
