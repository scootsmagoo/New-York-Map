import { expect, test } from "@playwright/test";
import { open } from "./helpers";

// Runs in the "iphone" project only (see playwright.config.ts).

test("the corner panels don't cover each other", async ({ page }) => {
  await open(page, "#year=1880");
  await page.locator(".population-toggle").tap();
  await expect(page.locator(".population-legend")).toBeVisible();
  await page.getByRole("button", { name: "Key" }).tap();
  await expect(page.locator(".map-key-panel")).toBeVisible();
  await expect(page.locator(".population-legend")).toHaveCount(0);
  await page.locator(".population-toggle").tap();
  await expect(page.locator(".map-key-panel")).toHaveCount(0);
});

test("a map marker can be tapped a finger's width off center", async ({ page }) => {
  await open(page, "#year=1880");
  const box = await page.locator('.marker[aria-label="Coney Island"] rect').boundingBox();
  await page.touchscreen.tap(box!.x + box!.width / 2 + 19, box!.y + box!.height / 2);
  await expect(page.locator(".modal h2")).toHaveText("Coney Island");
});

test("search opens with its box focused", async ({ page }) => {
  await open(page, "#year=1880");
  await page.locator(".search-btn").tap();
  await expect(page.locator(".search-input")).toBeFocused();
});

test("the credit line stays out from under the map buttons", async ({ page }) => {
  await open(page, "#year=1880");
  await expect(page.locator(".map-attribution")).toBeHidden();
});
