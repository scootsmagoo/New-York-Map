import { expect, test } from "@playwright/test";
import { open, zoomMap } from "./helpers";

/**
 * Pan frame rate, zoomed into the busiest scenes with every layer on. Local only:
 * CI runners have no GPU, and WebKit there renders in software at 2–3 fps
 * whatever the map does, so a floor would measure the runner, not the app.
 * Raise the floor with PERF_FLOOR=45 to hold the line.
 */
const FLOOR = Number(process.env.PERF_FLOOR ?? 30);

const SCENES = [
  // Manhattan's grid, labels, and els at their densest.
  { name: "1940 Manhattan", hash: "#year=1940&span=0.05", at: [725, 390] as const },
  // Downtown Brooklyn and the harbor: els, railroads, ferries, bridges, housing.
  { name: "1930 Brooklyn", hash: "#year=1930&span=0.05", at: [0.52, 0.62] as const },
];

for (const scene of SCENES) {
  test(`the map pans smoothly with every layer on: ${scene.name}`, async ({ page, browserName }) => {
    test.skip(browserName !== "webkit", "WebKit is where the frame-rate trouble lives");
    test.skip(!!process.env.CI, "no GPU on CI runners; run locally");
    await page.addInitScript(() => {
      for (const k of ["streetLabels", "neighborhoods", "lostLandscape", "calamities", "waterfront", "streetcars", "publicHousing"]) {
        localStorage.setItem(`nycmap:settings:${k}`, "true");
      }
    });
    await open(page, scene.hash);
    // Points under 1 are fractions of the map's box.
    const box = (await page.locator(".map-svg").first().boundingBox())!;
    const [ax, ay] = scene.at;
    const x = ax < 1 ? box.x + box.width * ax : ax;
    const y = ay < 1 ? box.y + box.height * ay : ay;
    await zoomMap(page, x, y, 14);

    await page.evaluate(() => {
      (window as any).__frames = 0;
      const tick = () => {
        (window as any).__frames++;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    const t0 = Date.now();
    await page.evaluate(() => ((window as any).__frames = 0));
    await page.mouse.move(700, 430);
    await page.mouse.down();
    for (let i = 0; i < 60; i++) {
      await page.mouse.move(700 + 150 * Math.sin(i / 6), 430 + 100 * Math.cos(i / 6));
    }
    await page.mouse.up();
    const fps = (await page.evaluate(() => (window as any).__frames)) / ((Date.now() - t0) / 1000);
    if (process.env.PERF_SHOT) await page.screenshot({ path: process.env.PERF_SHOT + scene.name.replace(/ /g, "-") + ".png" });
    console.log(`pan, ${scene.name}: ${fps.toFixed(1)} fps (floor ${FLOOR})`);
    expect(fps).toBeGreaterThan(FLOOR);
  });
}
