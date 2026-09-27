import { describe, expect, it } from "vitest";
import { geoMercator } from "d3-geo";
import { carryViewAcrossResize } from "../resizeView";

const FRAME = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [[[-74.26, 40.49], [-73.7, 40.49], [-73.7, 40.92], [-74.26, 40.92], [-74.26, 40.49]]],
  },
  properties: {},
} as const;
const fit = (width: number, height: number) => ({
  projection: geoMercator().fitExtent([[10, 10], [width - 10, height - 10]], FRAME as never),
  width,
  height,
});

describe("carryViewAcrossResize", () => {
  it("keeps the same place in the middle, at the same zoom, when a phone turns", () => {
    const portrait = fit(390, 385);
    const landscape = fit(844, 195);
    // Zoomed 6× into somewhere downtown.
    const target = portrait.projection([-74.0, 40.71])!;
    const t = { k: 6, x: 195 - target[0] * 6, y: 192.5 - target[1] * 6 };
    const next = carryViewAcrossResize(t, portrait, landscape);
    expect(next.k).toBe(6);
    const mid = landscape.projection.invert!([(422 - next.x) / next.k, (97.5 - next.y) / next.k])!;
    expect(mid[0]).toBeCloseTo(-74.0, 5);
    expect(mid[1]).toBeCloseTo(40.71, 5);
  });

  it("leaves the whole-city view whole", () => {
    const next = carryViewAcrossResize({ k: 1, x: 0, y: 0 }, fit(390, 385), fit(844, 195));
    expect(next.k).toBe(1);
    expect(Math.abs(next.x)).toBeLessThan(1);
    expect(Math.abs(next.y)).toBeLessThan(1);
  });
});
