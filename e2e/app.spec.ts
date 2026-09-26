import { expect, test } from "@playwright/test";
import { open, openMenu, toggleLayer, year, zoomMap } from "./helpers";

test("loads the map and timeline without errors", async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator(".app-header h1")).toHaveText("Gotham");
  await expect(page.locator(".timeline")).toBeVisible();
  expect(errors).toEqual([]);
});

test("deep links open the right year", async ({ page }) => {
  await open(page, "#year=1776");
  expect(await year(page)).toBe("1776");
  await open(page, "#year=1945");
  expect(await year(page)).toBe("1945");
});

test("an entry link opens its card", async ({ page }) => {
  await open(page, "#entry=vj-day");
  await expect(page.locator(".modal h2")).toHaveText("V-J Day in Times Square");
});

test("arrow keys scrub the timeline", async ({ page }) => {
  await open(page, "#year=1850");
  for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  expect(Number(await year(page))).toBeGreaterThan(1850);
});

test("Then & Now opens on two different years, and both can be typed", async ({ page }) => {
  await open(page, "#year=1900");
  await openMenu(page);
  await page.getByRole("menuitem", { name: /Then & Now/ }).click();
  const then = page.getByRole("textbox", { name: /^Then year/ });
  const now = page.getByRole("textbox", { name: /^Now year/ });
  await expect(then).toHaveValue("1840");
  await expect(now).toHaveValue("1900");
  await expect(page.locator(".compare-pane .map-svg")).toBeVisible();

  await then.click();
  await page.keyboard.type("1776");
  await page.keyboard.press("Enter");
  await expect(then).toHaveValue("1776");

  await now.click();
  await page.keyboard.type("2020");
  await page.keyboard.press("Enter");
  await expect(now).toHaveValue("1945"); // capped at the end of the timeline
  expect(await year(page)).toBe("1945");
});

test("a tour steps through time and turns on its layer", async ({ page }) => {
  await open(page, "#tour=island-remade");
  await expect(page.locator(".tour-card")).toContainText("The Island Remade");
  await expect(page.locator(".lost-landscape")).toBeAttached();
  const first = await year(page);
  await page.getByRole("button", { name: /next/i }).first().click();
  await expect.poll(() => year(page)).not.toBe(first);
});

test("search finds a lost water and takes the map to it", async ({ page }) => {
  await open(page, "#year=1900");
  await page.keyboard.press("Control+k");
  await page.getByRole("searchbox").fill("Collect");
  await page.getByRole("option", { name: /Collect Pond.*filled/ }).click();
  await expect.poll(async () => Number(await year(page))).toBeLessThan(1811);
  await expect(page.locator(".lost-landscape")).toBeAttached();
});

test("street and neighborhood names appear when their layers are on", async ({ page }) => {
  await open(page, "#year=1940&span=0.05");
  await toggleLayer(page, "Street names");
  await toggleLayer(page, "Neighborhood names");
  await zoomMap(page, 725, 390, 14);
  await expect.poll(() => page.locator(".street-label").count()).toBeGreaterThan(50);
  await expect.poll(() => page.locator(".neighborhood-label").count()).toBeGreaterThan(3);
});

test("historical maps are placed by landmarks, not stretched boxes", async ({ page }) => {
  await open(page, "#year=1767");
  await toggleLayer(page, "Show overlays");
  const img = page.locator(".historical-overlay").first();
  await expect(img).toBeAttached();
  await expect(img).toHaveAttribute("transform", /^matrix\(/);
});

test("the map key lists only what's on screen", async ({ page }) => {
  await open(page, "#year=1700");
  await page.getByRole("button", { name: "Key" }).click();
  const items = page.locator(".map-key-panel li");
  await expect(items.first()).toBeVisible();
  await expect(page.locator(".map-key-panel")).not.toContainText("Subway");

  await open(page, "#year=1940&span=0.05");
  await zoomMap(page, 725, 390, 14);
  await expect(page.locator(".map-key-panel")).toContainText("Subway");
});

test("scrolling on the timeline zooms it, and sideways scrolling pans it", async ({ page }) => {
  await open(page, "#year=1850");
  const strip = page.locator(".timeline svg").first();
  const box = (await strip.boundingBox())!;
  const ticks = () => page.locator(".timeline text").allTextContents();
  const before = await ticks();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, -200);
  await expect.poll(ticks).not.toEqual(before);
  const zoomedYear = await year(page);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(300, 0);
  await expect.poll(() => year(page)).not.toBe(zoomedYear);
});

test("search results can be picked with the arrow keys", async ({ page }) => {
  await open(page, "#year=1900");
  await page.keyboard.press("Control+k");
  await page.getByRole("searchbox").fill("Tweed");
  const options = page.getByRole("option");
  await expect(options.nth(1)).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  const title = await options.nth(1).locator(".search-result-title").textContent();
  await page.keyboard.press("Enter");
  await expect(page.locator(".modal h2")).toHaveText(title!);
});

test("Escape closes search", async ({ page }) => {
  await open(page);
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("searchbox")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("searchbox")).toHaveCount(0);
});
