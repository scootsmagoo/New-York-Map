import { expect, test } from "@playwright/test";
import { open, zoomMap } from "./helpers";

/**
 * Pan frame rate, zoomed into 1940 Manhattan with every layer on. CI runners
 * have no GPU, so the floor there is only a tripwire for large regressions
 * (the ones this project has hit ran at a third of normal speed); run locally
 * with PERF_FLOOR=45 to hold the line.
 */
const FLOOR = Number(process.env.PERF_FLOOR ?? (process.env.CI ? 8 : 30));

test("the map pans smoothly with every layer on", async ({ page, browserName }) => {
  test.skip(browserName !== "webkit", "WebKit is where the frame-rate trouble lives");
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
