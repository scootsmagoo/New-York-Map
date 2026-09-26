import { expect, test } from "@playwright/test";
import { open, openMenu, toggleLayer, year, zoomMap } from "./helpers";

test("loads the map and timeline without errors", async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator(".app-header h1")).toHaveText("Gotham");
  await expect(page.locator(".timeline")).toBeVisible();
  expect(errors).toEqual([]);
});

test("first visit shows the tips card once; its buttons do what they say", async ({ page }) => {
  await open(page, "", { tips: true });
  const card = page.getByRole("region", { name: "Things to try" });
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: /Then & Now/ }).click();
  await expect(page.locator(".compare-divider")).toBeVisible();
  await expect(card).toHaveCount(0);
  // Seen: gone after a reload too.
  await page.reload();
  await expect(page.locator(".map-svg").first()).toBeVisible();
  await expect(page.locator(".tips-card")).toHaveCount(0);
});

test("the tips card opens the ⋯ menu, and deep links skip it", async ({ page }) => {
  await open(page, "", { tips: true });
  await page.getByRole("button", { name: /Map layers/ }).click();
  await expect(page.getByRole("group", { name: "Map layers" })).toBeVisible();
  await page.evaluate(() => localStorage.clear());
  await open(page, "#entry=vj-day", { tips: true });
  await expect(page.locator(".modal h2")).toHaveText("V-J Day in Times Square");
  await expect(page.locator(".tips-card")).toHaveCount(0);
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

test("entry cards name the volume in the margin note and cite the book", async ({ page }) => {
  await open(page, "#entry=vj-day");
  await expect(page.locator(".modal .gotham-mark")).toHaveText("Gotham at War:");
  await expect(page.locator(".modal-bookref")).toContainText("Gotham at War, Epilogs, p. 851");
  await open(page, "#entry=prison-ships");
  await expect(page.locator(".modal-bookref")).toContainText(
    "Gotham, ch. 16, The Gibraltar of North America, pp. 253–55"
  );
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
  await page.getByRole("button", { name: /Then & Now/ }).click();
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
  await page.getByRole("combobox", { name: "Search Gotham" }).fill("Collect");
  await page.getByRole("option", { name: /Collect Pond.*filled/ }).click();
  await expect.poll(async () => Number(await year(page))).toBeLessThan(1811);
  await expect(page.locator(".lost-landscape")).toBeAttached();
});

test("fires and epidemics show in their years, with key rows, and search flies to them", async ({ page }) => {
  await open(page, "#year=1835");
  await toggleLayer(page, "Fires & epidemics");
  await expect(page.locator(".calamity-fire")).toHaveCount(1);
  await page.getByRole("button", { name: "Key" }).click();
  await expect(page.locator(".map-key-panel")).toContainText("Burned in a great fire");
  await page.getByRole("button", { name: "Key" }).click();
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: "Search Gotham" }).fill("infected district");
  await page.getByRole("option", { name: /infected district.*epidemic/i }).click();
  await expect.poll(() => year(page)).toBe("1822");
  await expect(page.locator(".calamity-epidemic")).toHaveCount(1);
  await expect(page.locator(".calamity-fire")).toHaveCount(0);
});

test("the Fire and Water tour turns on fires & epidemics", async ({ page }) => {
  await open(page, "#tour=fire-water");
  await expect(page.locator(".calamity-epidemic")).toHaveCount(1);
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
  await page.getByRole("combobox", { name: "Search Gotham" }).fill("Tweed");
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
  await expect(page.getByRole("combobox", { name: "Search Gotham" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("combobox", { name: "Search Gotham" })).toHaveCount(0);
});

test("search remembers its last query, selected so typing replaces it", async ({ page }) => {
  await open(page, "#year=1900");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: "Search Gotham" }).fill("Tweed");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("combobox", { name: "Search Gotham" })).toHaveCount(0);
  await page.keyboard.press("Control+k");
  const box = page.getByRole("combobox", { name: "Search Gotham" });
  await expect(box).toHaveValue("Tweed");
  await expect(page.getByRole("option").first()).toBeVisible();
  await page.keyboard.type("Minetta");
  await expect(box).toHaveValue("Minetta");
});

test("the era panel keeps its scroll position when closed and reopened", async ({ page }) => {
  await open(page, "#year=1880");
  await page.locator(".explore-btn").click();
  const scroller = page.locator(".era-panel-scroll");
  await expect(scroller).toBeVisible();
  await scroller.evaluate((el) => (el.scrollTop = 400));
  await page.locator(".era-panel .modal-close").click();
  await expect(page.locator(".era-panel")).toBeHidden();
  await page.locator(".explore-btn").click();
  await expect(scroller).toBeVisible();
  expect(await scroller.evaluate((el) => el.scrollTop)).toBe(400);
});

test("the ⋯ menu scrolls when it's taller than a laptop screen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await open(page, "#year=1850");
  await page.locator(".header-menu-btn").click();
  const panel = page.locator(".header-menu-panel");
  const box = (await panel.boundingBox())!;
  expect(box.y + box.height).toBeLessThanOrEqual(800);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 3000);
  await expect(page.getByLabel("Show overlays")).toBeInViewport();
});
