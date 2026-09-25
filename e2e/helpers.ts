import { expect, type Page } from "@playwright/test";

/** Open the app at a hash, failing the test on any page error. */
export async function open(page: Page, hash = "") {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    // Wikipedia summaries are fetched live; offline CI may fail them.
    if (m.type() === "error" && !/wikipedia|Failed to load resource/i.test(m.text())) errors.push(m.text());
  });
  // A new hash on the same page doesn't reload it; start from a blank page.
  await page.goto("about:blank");
  await page.goto(`/${hash}`);
  await expect(page.locator(".map-svg").first()).toBeVisible();
  await expect(page.locator(".map-land").first()).toBeAttached();
  return errors;
}

export const year = (page: Page) => page.locator(".year-now").textContent();

/** Wheel-zoom the map about a point. */
export async function zoomMap(page: Page, x: number, y: number, steps: number) {
  await page.mouse.move(x, y);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(700);
}

export const openMenu = (page: Page) => page.locator(".header-menu-btn").click();

/** Open the ⋯ menu and toggle a checkbox by its label. */
export async function toggleLayer(page: Page, label: string) {
  await openMenu(page);
  await page.getByLabel(label, { exact: true }).click();
  await page.keyboard.press("Escape");
}
