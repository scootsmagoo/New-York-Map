import { describe, expect, it } from "vitest";
import { TIME_MAX } from "../eras";
import {
  neighborhoodName,
  neighborhoodOpacity,
  neighborhoods,
} from "../neighborhoods";

describe("neighborhoods", () => {
  it("have unique ids, map-frame coordinates, and names in date order", () => {
    expect(new Set(neighborhoods.map((n) => n.id)).size).toBe(neighborhoods.length);
    for (const nb of neighborhoods) {
      const [lon, lat] = nb.coords;
      expect(lon, nb.id).toBeGreaterThan(-74.28);
      expect(lon, nb.id).toBeLessThan(-73.69);
      expect(lat, nb.id).toBeGreaterThan(40.49);
      expect(lat, nb.id).toBeLessThan(40.94);
      for (let i = 1; i < nb.names.length; i++) {
        expect(nb.names[i].from, nb.id).toBeGreaterThan(nb.names[i - 1].from);
      }
      expect(nb.names[0].from, nb.id).toBeLessThanOrEqual(TIME_MAX);
      if (nb.to !== undefined) expect(nb.to, nb.id).toBeGreaterThan(nb.names[0].from);
    }
  });

  it("go by the name of their day", () => {
    const byId = (id: string) => neighborhoods.find((n) => n.id === id)!;
    expect(neighborhoodName(byId("harlem"), 1650)).toBeNull();
    expect(neighborhoodName(byId("harlem"), 1660)).toBe("Nieuw Haarlem");
    expect(neighborhoodName(byId("harlem"), 1900)).toBe("Harlem");
    expect(neighborhoodName(byId("times-square"), 1900)).toBe("Longacre Square");
    expect(neighborhoodName(byId("times-square"), 1904)).toBe("Times Square");
    expect(neighborhoodName(byId("five-points"), 1900)).toBeNull();
  });

  it("fade in when named and out when the name lapses", () => {
    const fp = neighborhoods.find((n) => n.id === "five-points")!;
    expect(neighborhoodOpacity(fp, 1820)).toBeGreaterThan(0);
    expect(neighborhoodOpacity(fp, 1820)).toBeLessThan(1);
    expect(neighborhoodOpacity(fp, 1850)).toBe(1);
    expect(neighborhoodOpacity(fp, 1894)).toBeLessThan(1);
  });
});
