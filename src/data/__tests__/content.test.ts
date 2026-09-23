import { describe, expect, it } from "vitest";
import { allEntries } from "../entries";
import { eras, TIME_MAX, TIME_MIN, eraForYear } from "../eras";
import { footprintAt, footprints, frontierAt } from "../footprints";
import { colonialStreets } from "../streets";

describe("eras", () => {
  it("tile the whole timeline without gaps or overlaps", () => {
    expect(eras[0].start).toBe(TIME_MIN);
    expect(eras[eras.length - 1].end).toBe(TIME_MAX);
    for (let i = 1; i < eras.length; i++) {
      expect(eras[i].start).toBe(eras[i - 1].end);
    }
  });

  it("resolve every year to exactly one era", () => {
    for (const year of [TIME_MIN, -500, 1608, 1609, 1664, 1783, 1898, 1919, 1945]) {
      const era = eraForYear(year);
      expect(era.start).toBeLessThanOrEqual(year);
      expect(year).toBeLessThanOrEqual(era.end);
    }
  });
});

describe("entries", () => {
  it("have unique ids and Wikipedia titles", () => {
    const ids = new Set(allEntries.map((e) => e.id));
    expect(ids.size).toBe(allEntries.length);
    for (const e of allEntries) {
      expect(e.wikiTitle, e.id).toBeTruthy();
      expect(e.title, e.id).toBeTruthy();
    }
  });

  it("sit inside the era they belong to", () => {
    const byId = new Map(eras.map((e) => [e.id, e]));
    for (const e of allEntries) {
      const era = byId.get(e.era);
      expect(era, `${e.id} has unknown era ${e.era}`).toBeDefined();
      expect(e.year, e.id).toBeGreaterThanOrEqual(era!.start);
      expect(e.year, e.id).toBeLessThanOrEqual(era!.end);
    }
  });

  it("keep coordinates inside the map frame", () => {
    for (const e of allEntries) {
      if (!e.coords) continue;
      const [lon, lat] = e.coords;
      expect(lon, e.id).toBeGreaterThan(-74.3);
      expect(lon, e.id).toBeLessThan(-73.65);
      expect(lat, e.id).toBeGreaterThan(40.45);
      expect(lat, e.id).toBeLessThan(40.95);
    }
  });

  it("have lifespans that end after they begin", () => {
    for (const e of allEntries) {
      if (!e.lifespan) continue;
      const [built, demolished] = e.lifespan;
      if (demolished !== null) expect(demolished, e.id).toBeGreaterThan(built);
    }
  });
});

describe("footprints", () => {
  it("are ordered by year and cumulative in extent", () => {
    for (let i = 1; i < footprints.length; i++) {
      expect(footprints[i].year).toBeGreaterThan(footprints[i - 1].year);
      expect(footprints[i].frontier.latW).toBeGreaterThanOrEqual(
        footprints[i - 1].frontier.latW
      );
    }
  });

  it("cross-fade between neighbouring snapshots", () => {
    const a = footprints[3];
    const b = footprints[4];
    const mid = (a.year + b.year) / 2;
    const { base, next, progress } = footprintAt(mid);
    expect(base).toBe(a);
    expect(next).toBe(b);
    expect(progress).toBeCloseTo(0.5, 9);
    expect(footprintAt(-5000).next).toBeNull();
    expect(footprintAt(3000).next).toBeNull();
  });

  it("move the frontier north monotonically", () => {
    let prev = -Infinity;
    for (let y = 1600; y <= TIME_MAX; y++) {
      const f = frontierAt(y).latW;
      expect(f).toBeGreaterThanOrEqual(prev - 1e-12);
      prev = f;
    }
  });
});

describe("colonial streets", () => {
  it("have unique ids and at least two points", () => {
    const ids = new Set(colonialStreets.map((s) => s.id));
    expect(ids.size).toBe(colonialStreets.length);
    for (const s of colonialStreets) {
      expect(s.pts.length, s.id).toBeGreaterThanOrEqual(2);
      if (s.to !== undefined) expect(s.to, s.id).toBeGreaterThan(s.from);
    }
  });
});
