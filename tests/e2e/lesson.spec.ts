import { expect, test } from "@playwright/test";

const LESSON = "/uk/learn/prompting/clarity";

test.beforeEach(async ({ page }) => {
  await page.goto(LESSON);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("term opens an explanation popover", async ({ page, isMobile }) => {
  const term = page.getByRole("button", { name: /^промпті:/ }).first();
  if (isMobile) await term.tap();
  else await term.click();
  const popover = page.getByRole("dialog");
  await expect(popover).toBeVisible();
  await expect(popover).toContainText("На практиці");
  await page.keyboard.press("Escape");
  await expect(popover).toBeHidden();
});

test("answering a quiz correctly awards XP once", async ({ page }) => {
  const quiz = page.getByRole("region", { name: "Перевір себе" });
  await quiz.getByRole("button", { name: /бракує контексту/ }).click();
  await expect(quiz.getByRole("status")).toContainText("Правильно");
  await expect(page.getByLabel(/^10 XP$/)).toBeVisible();
});

test("task passes when all criteria are met", async ({ page }) => {
  const task = page.getByRole("region", { name: "Перепиши розмитий промпт" });
  const input = task.getByRole("textbox");
  await input.fill("Напиши пост");
  await task.getByRole("button", { name: "Перевірити" }).click();
  await expect(task.getByRole("status")).toContainText("Ще трохи");

  await input.fill(
    "Напиши пост для Instagram для постійних клієнтів кав'ярні. Знижка 20% на всі напої до 30 листопада. Тон дружній, з легким гумором. До 60 слів.",
  );
  await task.getByRole("button", { name: "Перевірити" }).click();
  await expect(task.getByRole("status")).toContainText("Завдання виконано");
  await expect(page.getByLabel(/^30 XP$/)).toBeVisible();
});

test("completing a lesson shows the next lesson link", async ({ page }) => {
  await page.getByRole("button", { name: /Завершити урок/ }).click();
  await expect(page.getByText("Урок пройдено")).toBeVisible();
  await expect(page.getByRole("link", { name: /Наступний урок: Приклади/ })).toBeVisible();
});
