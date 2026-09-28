import { describe, expect, it } from "vitest";
import { fitAffine, overlayPlacement } from "../historicalOverlays";
import { HISTORICAL_OVERLAYS } from "../../data/historicalOverlays";

describe("overlay placement", () => {
  it("recovers an affine map from control points", () => {
    // x' = 2x - y + 10, y' = 0.5x + 3y - 4
    const f = ([x, y]: [number, number]): [number, number] => [2 * x - y + 10, 0.5 * x + 3 * y - 4];
    const from: [number, number][] = [[0, 0], [10, 0], [0, 10], [7, 3]];
    const m = fitAffine(from, from.map(f))!;
    [2, 0.5, -1, 3, 10, -4].forEach((v, i) => expect(m[i]).toBeCloseTo(v, 9));
  });

  it("refuses too few points", () => {
    expect(fitAffine([[0, 0], [1, 1]], [[0, 0], [1, 1]])).toBeNull();
  });

  it("places every sheet by landmarks, within ~100 m of each", () => {
    // A local equirectangular "projection" in meters.
    const project = ([lon, lat]: [number, number]): [number, number] => [lon * 84310, -lat * 111320];
    for (const overlay of HISTORICAL_OVERLAYS) {
      expect(overlay.gcps?.length, overlay.id).toBeGreaterThanOrEqual(4);
      const p = overlayPlacement(project, overlay)!;
      expect(p.transform).toMatch(/^matrix\(/);
      const [a, b, c, d, e, f] = p.transform!.slice(7, -1).split(",").map(Number);
      for (const g of overlay.gcps!) {
        const [x, y] = g.px;
        const [tx, ty] = project(g.lonlat);
        expect(Math.hypot(a * x + c * y + e - tx, b * x + d * y + f - ty), g.place).toBeLessThan(100);
      }
    }
  });
});

import { overlayAutoWeights, overlayManualWeights } from "../historicalOverlays";

describe("overlay fades", () => {
  it("eases a lone sheet in and out rather than switching it at full strength", () => {
    const ratzer = (y: number) => overlayAutoWeights(y).get("ratzer") ?? 0;
    expect(ratzer(1744)).toBe(0);
    expect(ratzer(1748)).toBeGreaterThan(0);
    expect(ratzer(1748)).toBeLessThan(0.2);
    expect(ratzer(1767)).toBeCloseTo(1);
    expect(ratzer(1830)).toBeLessThan(0.1);
    // Nothing between the Ratzer and Viele windows.
    expect(overlayAutoWeights(1840).size).toBe(0);
    // Never more than full strength in all.
    for (let y = 1600; y <= 1945; y++) {
      const total = [...overlayAutoWeights(y).values()].reduce((a, b) => a + b, 0);
      expect(total, String(y)).toBeLessThanOrEqual(1.0001);
    }
  });

  it("crossfades between sheets in manual mode instead of switching at the midpoint", () => {
    const mid = (1660 + 1767) / 2;
    const at = overlayManualWeights(mid);
    expect(at.get("castello")).toBeGreaterThan(0.3);
    expect(at.get("ratzer")).toBeGreaterThan(0.3);
    expect(overlayManualWeights(1700).get("castello")).toBe(1);
    expect(overlayManualWeights(1900).get("viele")).toBe(1);
  });
});
