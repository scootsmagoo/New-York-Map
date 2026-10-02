import { expect, test, type Page } from "@playwright/test";
import { open } from "./helpers";

// WebKit on macOS skips links and buttons with Tab unless full keyboard
// access is on, so these run in Chromium (and the iPhone project skips them).
test.skip(({ browserName }) => browserName !== "chromium", "Tab order is a Chromium check");

const activeInside = (page: Page, selector: string) =>
  page.evaluate((sel) => !!document.activeElement?.closest(sel), selector);

test("the entry card takes focus, keeps Tab inside, and gives focus back", async ({ page }) => {
  await open(page, "#year=1880");
  const marker = page.locator('.marker[aria-label="Coney Island"]');
  await marker.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".modal h2")).toHaveText("Coney Island");
  await expect.poll(() => activeInside(page, ".modal")).toBe(true);

  // Tab well past the last control; focus must wrap, never escape.
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(await activeInside(page, ".modal")).toBe(true);
  }
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Shift+Tab");
    expect(await activeInside(page, ".modal")).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(page.locator(".modal")).toHaveCount(0);
  await expect(marker).toBeFocused();
});

test("search keeps focus in the box and returns it on close", async ({ page }) => {
  await open(page);
  const button = page.locator(".search-btn");
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".search-input")).toBeFocused();
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Tab");
    expect(await activeInside(page, ".search-palette")).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
});

test("the era panel takes focus when it opens and gives it back when it closes", async ({ page }) => {
  await open(page, "#year=1880");
  const explore = page.locator(".explore-btn");
  await explore.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".era-panel")).toBeVisible();
  await expect.poll(() => activeInside(page, ".era-panel")).toBe(true);
  await page.locator(".era-panel .modal-close").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".era-panel")).toBeHidden();
  await expect(explore).toBeFocused();
});

test("the playhead is a keyboard slider for the year", async ({ page }) => {
  await open(page, "#year=1850");
  const slider = page.getByRole("slider", { name: "Year" });
  await expect(slider).toHaveAttribute("aria-valuetext", /^1850, Antebellum/);
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect.poll(async () => Number(await slider.getAttribute("aria-valuenow"))).toBeGreaterThan(1850);
  await page.keyboard.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "2025");
});

test("Space on a map marker opens it without starting playback", async ({ page }) => {
  await open(page, "#year=1850");
  const marker = page.locator(".marker:not(.marker-ghost)").first();
  await marker.focus();
  await page.keyboard.press(" ");
  await expect(page.locator(".modal")).toBeVisible();
  await expect(page.getByRole("button", { name: "Play through time" })).toBeVisible();
});

test("focusing a population group shows its enclaves, like hovering", async ({ page }) => {
  await open(page, "#year=1900");
  await page.locator(".population-toggle").click();
  await page.locator(".population-legend-row").first().focus();
  await expect(page.locator(".population-legend-row-active")).toHaveCount(1);
});

test("Escape closes the ⋯ menu and returns focus to its button", async ({ page }) => {
  await open(page, "#year=1850");
  await page.locator(".header-menu-btn").click();
  await page.locator(".header-menu-panel button").first().focus();
  await page.keyboard.press("Escape");
  await expect(page.locator(".header-menu-panel")).toBeHidden();
  await expect(page.locator(".header-menu-btn")).toBeFocused();
});
