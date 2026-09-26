import { expect, test, type Page } from "@playwright/test";
import { open, year } from "./helpers";

/** Count the view transitions the page starts. */
async function countTransitions(page: Page) {
  await page.addInitScript(() => {
    (window as any).__vt = 0;
    const start = document.startViewTransition?.bind(document);
    if (start) {
      document.startViewTransition = ((...args: any[]) => {
        (window as any).__vt++;
        return (start as any)(...args);
      }) as typeof document.startViewTransition;
    }
  });
  return () => page.evaluate(() => (window as any).__vt as number);
}

test("scrubbing the timeline never starts a view transition, even with panels open", async ({ page }) => {
  const count = await countTransitions(page);
  await page.addInitScript(() => localStorage.setItem("nycmap:settings:mapKeyOpen", "true"));
  await open(page, "#year=1850");
  await page.locator(".explore-btn").click();
  await expect(page.locator(".era-panel")).toBeVisible();
  const before = await count();
  const box = (await page.locator(".timeline svg").first().boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 20; i++) await page.mouse.wheel(300, 0);
  for (let i = 0; i < 15; i++) await page.keyboard.press("ArrowRight");
  await expect.poll(() => year(page)).not.toBe("1850");
  await page.waitForTimeout(400);
  expect(await count()).toBe(before);
});

test("closing a panel and stepping a tour animate once each", async ({ page }) => {
  const count = await countTransitions(page);
  await open(page, "#year=1850");
  test.skip(!(await page.evaluate(() => "startViewTransition" in document)), "no View Transitions here");

  await page.locator(".explore-btn").click();
  await expect(page.locator(".era-panel")).toBeVisible();
  let n = await count();
  await page.locator(".era-panel .modal-close").click();
  await expect(page.locator(".era-panel")).toBeHidden();
  expect(await count()).toBe(n + 1);

  await open(page, "#tour=island-remade");
  await expect(page.locator(".tour-card")).toBeVisible();
  n = await count();
  await page.getByRole("button", { name: /next/i }).first().click();
  await expect(page.locator(".tour-card-count")).toContainText("2 of");
  expect(await count()).toBe(n + 1);
});

test("letters typed right after opening search aren't lost", async ({ page }) => {
  await open(page, "#year=1900");
  await page.keyboard.press("Control+k");
  await page.keyboard.type("Collect", { delay: 0 });
  await expect(page.getByRole("searchbox")).toHaveValue("Collect");
});
