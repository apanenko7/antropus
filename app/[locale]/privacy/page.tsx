import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isLocale } from "@/lib/i18n";

/*
 * Privacy policy and terms of use. Google Play needs a public privacy policy URL, an in-app way to delete the account
 * (profile page) and a web link for deletion requests: this page covers the last two with the contact address.
 * Keep it in sync with what the app really collects (lib/progress, app/api/progress, app/api/account).
 */

const UPDATED = "24 листопада 2026";
/**
 * Optional contact for privacy and deletion requests. Without it the page points to the developer email on the
 * Google Play listing (Play shows one publicly anyway), so no personal address has to be in the code or on the site.
 */
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;

export const metadata: Metadata = { title: "Конфіденційність і умови" };

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="text-xl">{title}</h2>
      <div className="mt-3 space-y-3 text-muted [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-fg">{children}</div>
    </section>
  );
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const contact = CONTACT ? (
    <a href={`mailto:${CONTACT}`} className="font-semibold text-accent underline underline-offset-4">
      {CONTACT}
    </a>
  ) : (
    "email розробника, вказаний на сторінці застосунку в Google Play"
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1>Конфіденційність і умови</h1>
      <p className="mt-3 text-sm text-muted">Оновлено: {UPDATED}</p>

      <Section title="Про проєкт">
        <p>
          <strong>Atropus</strong> — незалежний освітній проєкт про роботу з Claude, промптинг і Claude Code. Він{" "}
          <strong>не пов&apos;язаний з Anthropic PBC</strong>, не спонсорований і не схвалений нею.
        </p>
        <p>
          Claude, Claude Code та Anthropic — торговельні марки Anthropic PBC. Тут вони згадуються лише для того, щоб назвати
          продукти, про які розповідає курс. Логотип, ілюстрації та тексти уроків — власні матеріали проєкту.
        </p>
      </Section>

      <Section title="Які дані ми збираємо">
        <p>
          <strong>Без входу</strong> нічого не надсилається на наші сервери. Прогрес, XP, чернетки завдань і позиція в
          квізах зберігаються лише в цьому браузері (localStorage). Відповіді в завданнях перевіряються на пристрої.
        </p>
        <p>
          <strong>Після входу через Google</strong> ми зберігаємо:
        </p>
        <ul>
          <li>ідентифікатор акаунта, email, ім&apos;я та фото профілю з Google — щоб ти міг увійти й бачити свій профіль;</li>
          <li>прогрес: пройдені уроки, результати квізів, виконані завдання, дні активності й XP.</li>
        </ul>
        <p>Тексти твоїх відповідей у завданнях і чернетки на сервер не надсилаються.</p>
      </Section>

      <Section title="Навіщо">
        <p>
          Лише для того, щоб зберігати прогрес і синхронізувати його між пристроями. Ми не показуємо рекламу, не
          використовуємо аналітику чи трекери, не продаємо і не передаємо дані третім особам для маркетингу.
        </p>
      </Section>

      <Section title="Хто обробляє дані">
        <ul>
          <li>Google Firebase (Authentication, Cloud Firestore) — вхід і зберігання прогресу;</li>
          <li>Vercel — хостинг сайту; він може вести технічні журнали запитів (IP-адреса, тип браузера) для безпеки й роботи сервісу.</li>
        </ul>
        <p>Дані передаються лише через захищене з&apos;єднання (HTTPS).</p>
      </Section>

      <Section id="delete" title="Як видалити акаунт і дані">
        <p>
          Відкрий{" "}
          <Link href={`/${locale}/profile`} className="font-semibold text-accent underline underline-offset-4">
            Профіль
          </Link>{" "}
          і натисни <strong>«Видалити акаунт»</strong>. Акаунт Atropus і весь збережений прогрес буде видалено одразу й
          назавжди. Твій Google-акаунт при цьому не змінюється.
        </p>
        <p>
          Застосунок не потрібен: те саме можна зробити в будь-якому браузері — відкрий цей сайт, увійди тим самим
          Google-акаунтом і видали акаунт у Профілі.
        </p>
        <p>Якщо увійти не виходить, напиши на {contact}, вказавши email, яким входив: ми видалимо дані протягом 30 днів.</p>
        <p>Локальні дані в браузері зникають після виходу з акаунта, кнопки «Скинути прогрес» або очищення даних сайту.</p>
      </Section>

      <Section title="Скільки зберігаємо">
        <p>Доки існує акаунт. Після видалення дані зникають з бази одразу, з резервних копій постачальників — за їхніми строками.</p>
      </Section>

      <Section title="Діти">
        <p>Курс не призначений для дітей до 13 років, і ми свідомо не збираємо їхні дані.</p>
      </Section>

      <Section title="Умови користування">
        <ul>
          <li>Матеріали курсу безкоштовні й надаються «як є», для навчання. Вони можуть застарівати: перевіряй важливе в офіційній документації Anthropic.</li>
          <li>Не намагайся зламати сервіс, обійти обмеження чи навантажити його автоматичними запитами.</li>
          <li>Тексти й ілюстрації курсу можна цитувати з посиланням на Atropus; копіювати курс цілком без дозволу не можна.</li>
        </ul>
      </Section>

      <Section title="Зміни й контакти">
        <p>Якщо ця сторінка зміниться, ми оновимо дату вгорі. Питання щодо даних — на {contact}.</p>
      </Section>
    </div>
  );
}
