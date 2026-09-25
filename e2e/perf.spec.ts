import { expect, test } from "@playwright/test";
import { open, zoomMap } from "./helpers";

/**
 * Pan frame rate, zoomed into 1940 Manhattan with every layer on. Local only:
 * CI runners have no GPU, and WebKit there renders in software at 2–3 fps
 * whatever the map does, so a floor would measure the runner, not the app.
 * Raise the floor with PERF_FLOOR=45 to hold the line.
 */
const FLOOR = Number(process.env.PERF_FLOOR ?? 30);

test("the map pans smoothly with every layer on", async ({ page, browserName }) => {
  test.skip(browserName !== "webkit", "WebKit is where the frame-rate trouble lives");
  test.skip(!!process.env.CI, "no GPU on CI runners; run locally");
  await page.addInitScript(() => {
    for (const k of ["streetLabels", "neighborhoods", "lostLandscape"]) {
      localStorage.setItem(`nycmap:settings:${k}`, "true");
    }
  });
  await open(page, "#year=1940&span=0.05");
  await zoomMap(page, 725, 390, 14);

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
  console.log(`pan: ${fps.toFixed(1)} fps (floor ${FLOOR})`);
  expect(fps).toBeGreaterThan(FLOOR);
});
