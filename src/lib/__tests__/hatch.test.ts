import { describe, expect, it } from "vitest";
import { hatchTile } from "../hatch";

/** Perpendicular distance between two parallel segments. */
function spacing(a: number[], b: number[]) {
  const dx = a[2] - a[0];
  const dy = a[3] - a[1];
  const len = Math.hypot(dx, dy);
  return Math.abs((b[0] - a[0]) * dy - (b[1] - a[1]) * dx) / len;
}

describe("hatch tiles", () => {
  it("keeps the on-screen pitch at any zoom and angle", () => {
    for (const angle of [18, -8, 35, 8]) {
      for (const k of [1.5, 4, 12]) {
        const t = hatchTile(angle, 5, 0.5, k);
        expect(spacing(t.lines[0], t.lines[1]) * k).toBeCloseTo(5, 6);
        expect(t.strokeWidth * k).toBeCloseTo(0.5, 9);
      }
    }
  });

  it("runs its lines at the requested angle", () => {
    for (const angle of [18, -8, 35]) {
      const [x1, y1, x2, y2] = hatchTile(angle, 5, 0.5, 2).lines[0];
      expect((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI).toBeCloseTo(angle, 6);
    }
  });

  it("tiles seamlessly: a line leaving one edge enters the next tile on the opposite edge", () => {
    const t = hatchTile(18, 5, 0.5, 3);
    const [x1, y1, x2, y2] = t.lines[0];
    const slope = (y2 - y1) / (x2 - x1);
    const at = (x: number) => y1 + slope * (x - x1);
    // Where the main line crosses the right edge, some line in the tile must
    // cross the left edge at the same height (mod the tile height).
    const yRight = ((at(t.width) % t.height) + t.height) % t.height;
    const lefts = t.lines.map(([a, b, c, d]) => b + ((d - b) / (c - a)) * (0 - a)).map((y) => ((y % t.height) + t.height) % t.height);
    expect(lefts.some((y) => Math.abs(y - yRight) < 1e-9)).toBe(true);
  });

  it("draws near-horizontal hatch level", () => {
    const t = hatchTile(0.5, 5, 0.5, 2);
    expect(t.lines[0][1]).toBe(t.lines[0][3]);
  });
});
