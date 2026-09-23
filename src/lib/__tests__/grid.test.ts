import { describe, expect, it } from "vitest";
import {
  GRID_AVENUES,
  GRID_ZONE_RING,
  STREET_ALONG,
  avenuePolyline,
  gridSegments,
} from "../grid";

describe("procedural 1811 grid", () => {
  it("generates a fixed set of streets and avenues, cached across calls", () => {
    const a = gridSegments();
    const b = gridSegments();
    expect(a).toBe(b);
    expect(a.streets).toHaveLength(220);
    expect(a.avenues.length).toBeGreaterThanOrEqual(18);
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

  it("spaces streets about a block (~80 m) apart", () => {
    const { streets } = gridSegments();
    const mid = (s: [[number, number], [number, number]]) => [
      ((s[0][0] + s[1][0]) / 2) * 84310,
      ((s[0][1] + s[1][1]) / 2) * 111320,
    ];
    const m0 = mid(streets[0]);
    const m1 = mid(streets[1]);
    const gap = Math.hypot(m1[0] - m0[0], m1[1] - m0[1]);
    expect(gap).toBeGreaterThan(70);
    expect(gap).toBeLessThan(95);
  });

  it("samples an avenue from start to end inclusive", () => {
    const pts = avenuePolyline("2nd Ave", 0, 1000, 300);
    expect(pts).toHaveLength(5); // 0, 300, 600, 900, 1000
    const first = avenuePolyline("2nd Ave", 0, 0, 300);
    expect(first).toHaveLength(1);
    expect(() => avenuePolyline("Nowhere Ave", 0, 1)).toThrow();
  });

  it("orders the avenues west to east and the streets south to north", () => {
    const across = (name: string) => GRID_AVENUES.find((a) => a.name === name)!.across;
    const westToEast = ["10th Ave", "8th Ave", "6th Ave", "5th Ave", "Madison Ave", "Park Ave", "Lexington Ave", "3rd Ave", "2nd Ave", "1st Ave", "Ave A"];
    for (let i = 1; i < westToEast.length; i++) {
      expect(across(westToEast[i]), westToEast[i]).toBeGreaterThan(across(westToEast[i - 1]));
    }
    for (let i = 1; i < STREET_ALONG.length; i++) {
      expect(STREET_ALONG[i]).toBeGreaterThan(STREET_ALONG[i - 1]);
    }
  });

  it("has a grid zone that sits north of the old city", () => {
    for (const [, lat] of GRID_ZONE_RING) {
      expect(lat).toBeGreaterThan(40.71);
    }
  });
});
