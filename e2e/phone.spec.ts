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

test("turning the phone keeps the map on screen and where it was", async ({ page }) => {
  await open(page, "#year=1880");
  const view = () =>
    page.evaluate(() => {
      const map = document.querySelector(".app-main > .map-view")!.getBoundingClientRect();
      const t = (document.querySelector(".app-main .map-svg") as SVGSVGElement & { __zoom: { k: number } }).__zoom;
      return { mapW: Math.round(map.width), pageW: document.documentElement.scrollWidth, screenW: innerWidth, k: t.k };
    });
  // Let the web fonts land first: the header resizing under a zoom in
  // progress (a real resize) ends that zoom where it is.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  // Zoom in with a double tap on open water, as a person would, and let
  // the zoom animation finish.
  await page.locator(".app-main .map-svg").dblclick({ position: { x: 40, y: 300 } });
  await expect.poll(async () => (await view()).k, { intervals: [300] }).toBeCloseTo(2, 5);
  await expect(page.locator(".modal")).toHaveCount(0);
  const { k } = await view();
  const portrait = page.viewportSize()!;
  for (const size of [{ width: portrait.height, height: portrait.width }, portrait, { width: portrait.height, height: portrait.width }, portrait]) {
    await page.setViewportSize(size);
    await expect.poll(async () => (await view()).mapW).toBe(size.width);
    const v = await view();
    expect(v.pageW).toBe(size.width);
    expect(v.k).toBeCloseTo(k, 5);
    await expect(page.locator(".app-main .map-land").first()).toBeInViewport();
  }
});
