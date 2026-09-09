import { describe, expect, it } from "vitest";
import { allEntries } from "../entries";
import { TIME_MAX, TIME_MIN } from "../eras";
import { tourById, tours } from "../tours";

describe("guided tours", () => {
  it("have unique ids and at least three stops", () => {
    expect(new Set(tours.map((t) => t.id)).size).toBe(tours.length);
    for (const t of tours) expect(t.stops.length, t.id).toBeGreaterThanOrEqual(3);
    expect(tourById(tours[0].id)).toBe(tours[0]);
    expect(tourById("nope")).toBeUndefined();
  });

  it("move forward in time and stay inside the timeline", () => {
    for (const t of tours) {
      let prev = -Infinity;
      for (const s of t.stops) {
        expect(s.year, `${t.id}: ${s.title}`).toBeGreaterThanOrEqual(prev);
        expect(s.year).toBeGreaterThanOrEqual(TIME_MIN);
        expect(s.year).toBeLessThanOrEqual(TIME_MAX);
        prev = s.year;
      }
    }
  });

  it("link only to entries that exist", () => {
    const ids = new Set(allEntries.map((e) => e.id));
    for (const t of tours) {
      for (const s of t.stops) {
        if (s.entryId) expect(ids.has(s.entryId), `${t.id}: ${s.entryId}`).toBe(true);
      }
    }
  });

  it("focus inside the map frame at a legal zoom", () => {
    for (const t of tours) {
      for (const s of t.stops) {
        if (!s.focus) continue;
        const [lon, lat] = s.focus.coords;
        expect(lon).toBeGreaterThan(-74.28);
        expect(lon).toBeLessThan(-73.69);
        expect(lat).toBeGreaterThan(40.49);
        expect(lat).toBeLessThan(40.94);
        expect(s.focus.k).toBeGreaterThanOrEqual(1);
        expect(s.focus.k).toBeLessThanOrEqual(16);
      }
    }
  });
});
