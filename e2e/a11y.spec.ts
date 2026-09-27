import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { open, openMenu } from "./helpers";

// Every main screen must pass axe's WCAG 2.2 A/AA rules. Map and SVG label
// contrast isn't measured by axe; it was checked by hand (see styles.css).
const states: [string, string, (p: Page) => Promise<unknown>, { tips?: boolean }?][] = [
  ["Lenapehoking", "#year=1200", async () => {}],
  ["New Amsterdam", "#year=1650", async () => {}],
  ["the Revolution", "#year=1776", async () => {}],
  ["1850", "#year=1850", async () => {}],
  ["1880", "#year=1880", async () => {}],
  ["1910", "#year=1910", async () => {}],
  ["1940", "#year=1940", async () => {}],
  ["an entry card", "#entry=prison-ships", async () => {}],
  ["the ⋯ menu", "#year=1850", (p) => openMenu(p)],
  ["the era panel", "#year=1850", (p) => p.locator(".explore-btn").click()],
  ["search", "#year=1850", async (p) => {
    await p.keyboard.press("Control+k");
    await p.keyboard.type("Five");
  }],
  ["a tour", "#tour=riots", async () => {}],
  ["Then & Now", "#year=1900&compare=1776", async () => {}],
  ["the map key", "#year=1900", (p) => p.getByRole("button", { name: /key/i }).first().click()],
  ["the population panel", "#year=1900", (p) => p.locator(".population-toggle").click()],
  ["the tips card", "", async () => {}, { tips: true }],
  ["the working waterfront", "#year=1865", async (p) => {
    await openMenu(p);
    await p.getByLabel("Working waterfront", { exact: true }).click();
    await p.keyboard.press("Escape");
  }],
  ["fires & epidemics", "#year=1835", async (p) => {
    await openMenu(p);
    await p.getByLabel("Fires & epidemics", { exact: true }).click();
    await p.keyboard.press("Escape");
  }],
];

for (const [name, hash, act, opts] of states) {
  test(`no axe violations: ${name}`, async ({ page }) => {
    await open(page, hash, opts);
    await act(page);
    // Scan the settled screen: mid-fade text is partly transparent, and on
    // CI's GPU-less WebKit a 0.2s fade can still be running a second later.
    await page.waitForFunction(
      () =>
        !(document as Document & { activeViewTransition?: unknown }).activeViewTransition &&
        document.getAnimations().every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity),
      null,
      { timeout: 10_000 }
    );
    // Tours and deep links fly the timeline by script, which isn't a Web
    // Animation: also wait for the year to hold still.
    let last = "";
    await expect
      .poll(async () => {
        const now = await page.locator(".year-now").textContent();
        const settled = now === last;
        last = now ?? "";
        return settled;
      }, { intervals: [250], timeout: 10_000 })
      .toBe(true);
    await page.waitForTimeout(250);
    let axe = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);
    // Search results scroll with the arrow keys from the input (the combobox
    // pattern keeps focus there), which this rule can't see.
    if (name === "search") axe = axe.disableRules(["scrollable-region-focusable"]);
    const { violations } = await axe.analyze();
    const summary = violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
    expect(summary).toEqual([]);
  });
}
