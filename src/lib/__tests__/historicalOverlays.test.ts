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
