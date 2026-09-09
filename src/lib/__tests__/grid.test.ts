import { describe, expect, it } from "vitest";
import { GRID_ZONE_RING, avenuePolyline, gridSegments } from "../grid";

describe("procedural 1811 grid", () => {
  it("generates a fixed set of streets and avenues, cached across calls", () => {
    const a = gridSegments();
    const b = gridSegments();
    expect(a).toBe(b);
    expect(a.streets).toHaveLength(250);
    expect(a.avenues).toHaveLength(16);
  });

  it("keeps streets perpendicular to avenues", () => {
    const { streets, avenues } = gridSegments();
    // Metres per degree at NYC latitude, so the dot product is in metric space.
    const toM = (p: [number, number]) => [p[0] * 84310, p[1] * 111320];
    const dir = (s: [[number, number], [number, number]]) => {
      const [ax, ay] = toM(s[0]);
      const [bx, by] = toM(s[1]);
      const len = Math.hypot(bx - ax, by - ay);
      return [(bx - ax) / len, (by - ay) / len];
    };
    const s = dir(streets[0]);
    const a = dir(avenues[0]);
    expect(Math.abs(s[0] * a[0] + s[1] * a[1])).toBeLessThan(1e-9);
  });

  it("spaces streets ~79 m apart along the avenue bearing", () => {
    const { streets } = gridSegments();
    const mid = (s: [[number, number], [number, number]]) => [
      ((s[0][0] + s[1][0]) / 2) * 84310,
      ((s[0][1] + s[1][1]) / 2) * 111320,
    ];
    const m0 = mid(streets[0]);
    const m1 = mid(streets[1]);
    expect(Math.hypot(m1[0] - m0[0], m1[1] - m0[1])).toBeCloseTo(79.25, 6);
  });

  it("samples an avenue from start to end inclusive", () => {
    const pts = avenuePolyline(0, 0, 1000, 300);
    expect(pts).toHaveLength(5); // 0, 300, 600, 900, 1000
    const first = avenuePolyline(0, 0, 0, 300);
    expect(first).toHaveLength(1);
  });

  it("has a grid zone that sits north of the old city", () => {
    for (const [, lat] of GRID_ZONE_RING) {
      expect(lat).toBeGreaterThan(40.71);
    }
  });
});
