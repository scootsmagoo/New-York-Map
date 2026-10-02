import { describe, expect, it } from "vitest";
import data from "../geo/housing.json";
import { unpackRing } from "../../lib/geoPack";
import { TIME_MAX } from "../eras";

describe("public housing", () => {
  it("has dated developments inside the city, from First Houses on", () => {
    expect(data.developments.length).toBeGreaterThan(100);
    expect(data.developments[0].name).toBe("First Houses");
    for (const d of data.developments) {
      expect(d.year, d.name).toBeGreaterThanOrEqual(1935);
      expect(d.year, d.name).toBeLessThanOrEqual(TIME_MAX);
      expect(d.apartments, d.name).toBeGreaterThan(0);
      for (const flat of d.rings) {
        for (const [lon, lat] of unpackRing(flat, data.q)) {
          expect(lon, d.name).toBeGreaterThan(-74.27);
          expect(lon, d.name).toBeLessThan(-73.69);
          expect(lat, d.name).toBeGreaterThan(40.49);
          expect(lat, d.name).toBeLessThan(40.92);
        }
      }
    }
  });
});
