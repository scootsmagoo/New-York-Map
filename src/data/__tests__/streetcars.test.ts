import { describe, expect, it } from "vitest";
import geometry from "../geo/streetcars.json";
import centers from "../geo/streetcarCenters.json";
import { streetcarLines, streetcarPower } from "../streetcars";

const routes = geometry as unknown as Record<string, [number, number][][]>;

describe("streetcar lines", () => {
  it("have unique ids, dates in order, and built geometry for every leg", () => {
    expect(new Set(streetcarLines.map((l) => l.id)).size).toBe(streetcarLines.length);
    for (const line of streetcarLines) {
      if (line.close !== undefined) expect(line.close, line.id).toBeGreaterThan(line.open);
      // Rebuild with scripts/prepare-streetcars.mjs after changing a line's legs.
      expect(routes[line.id]?.length, line.id).toBe(line.legs.length);
      expect((centers as Record<string, unknown>)[line.id], line.id).toBeDefined();
      for (const leg of routes[line.id]) {
        expect(leg.length, line.id).toBeGreaterThanOrEqual(2);
        for (const [lon, lat] of leg) {
          expect(lon, line.id).toBeGreaterThan(-74.1);
          expect(lon, line.id).toBeLessThan(-73.75);
          expect(lat, line.id).toBeGreaterThan(40.57);
          expect(lat, line.id).toBeLessThan(40.9);
        }
      }
    }
  });

  it("run on horses, then electricity, until buses take over", () => {
    const byId = (id: string) => streetcarLines.find((l) => l.id === id)!;
    expect(streetcarPower(byId("harlem"), 1831)).toBeNull();
    expect(streetcarPower(byId("harlem"), 1832)).toBe("horse");
    expect(streetcarPower(byId("harlem"), 1910)).toBe("electric");
    expect(streetcarPower(byId("harlem"), 1935)).toBeNull();
    expect(streetcarPower(byId("myrtle"), 1892)).toBe("horse");
    expect(streetcarPower(byId("myrtle"), 1893)).toBe("electric");
    // The last horsecar line never went electric.
    expect(streetcarPower(byId("bleecker"), 1916)).toBe("horse");
    expect(streetcarPower(byId("bleecker"), 1917)).toBeNull();
  });
});
