import { describe, expect, it } from "vitest";
import data from "../geo/lostLandscape.json";

const inFrame = ([lon, lat]: number[]) => lon > -74.1 && lon < -73.85 && lat > 40.69 && lat < 40.9;

describe("lost landscape data", () => {
  it("has a 1609 shoreline and fill dated by decade, in order", () => {
    expect(data.shoreline1609.length).toBeGreaterThan(0);
    for (const ring of data.shoreline1609) for (const p of ring) expect(inFrame(p)).toBe(true);
    for (let i = 1; i < data.fill.length; i++) {
      expect(data.fill[i].year).toBeGreaterThan(data.fill[i - 1].year);
    }
    for (const f of data.fill) {
      expect(f.year % 10).toBe(0);
      for (const ring of f.rings) {
        expect(ring.length).toBeGreaterThanOrEqual(3);
        for (const p of ring) expect(inFrame(p)).toBe(true);
      }
    }
  });

  it("dates the named waters", () => {
    const byId = new Map(data.water.map((w) => [w.id, w]));
    expect(byId.get("collect")?.until).toBe(1811);
    expect(byId.get("minetta")?.kind).toBe("stream");
    for (const w of data.water) {
      expect(w.rings ?? w.lines, w.id).toBeTruthy();
      if (w.until !== null) expect(w.until).toBeGreaterThan(1609);
    }
  });
});

import { lostWaters } from "../lostWaters";

describe("lost waters for search", () => {
  it("match the layer's data by id, name, and date", () => {
    const byId = new Map(data.water.map((w) => [w.id, w]));
    for (const w of lostWaters) {
      const geo = byId.get(w.id);
      expect(geo, w.id).toBeDefined();
      expect(geo!.name).toBe(w.name);
      expect(geo!.until).toBe(w.until);
    }
  });
});
