import { describe, expect, it } from "vitest";
import { transitInfrastructure, transitLines } from "../transit";

describe("els and subways beyond Manhattan's trunk lines", () => {
  it("each has built geometry and dates in order", () => {
    expect(new Set(transitLines.map((l) => l.id)).size).toBe(transitLines.length);
    for (const line of transitInfrastructure) {
      // Rebuild with scripts/prepare-transit.mjs after changing a line's legs.
      expect(line.pts.length, line.id).toBeGreaterThanOrEqual(2);
      if (line.close !== undefined) expect(line.close, line.id).toBeGreaterThan(line.open);
    }
    const src = new Map(transitLines.map((l) => [l.id, l]));
    for (const line of transitInfrastructure) {
      const t = src.get(line.id)!;
      expect(line.legs?.length, line.id).toBe(t.legs.length);
    }
  });
});
