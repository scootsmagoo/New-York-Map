import { describe, expect, it } from "vitest";
import { calamities, calamityOpacity, CALAMITY_FADE } from "../calamities";
import { allEntries } from "../entries";
import { TIME_MAX } from "../eras";

describe("fires and epidemics", () => {
  it("have unique ids, dates in range, and rings in lower Manhattan", () => {
    expect(new Set(calamities.map((c) => c.id)).size).toBe(calamities.length);
    for (const c of calamities) {
      expect(c.to, c.id).toBeGreaterThanOrEqual(c.from);
      expect(c.to, c.id).toBeLessThanOrEqual(TIME_MAX);
      expect(c.ring.length, c.id).toBeGreaterThanOrEqual(3);
      for (const [lon, lat] of c.ring) {
        expect(lon, c.id).toBeGreaterThan(-74.02);
        expect(lon, c.id).toBeLessThan(-73.97);
        expect(lat, c.id).toBeGreaterThan(40.7);
        expect(lat, c.id).toBeLessThan(40.73);
      }
    }
  });

  it("link to entries that exist, and cite a Gotham chapter", () => {
    for (const c of calamities) {
      if (c.entryId) expect(allEntries.some((e) => e.id === c.entryId), c.id).toBe(true);
      if (c.book) expect(c.book.chapter, c.id).toMatch(/^\d+\. /);
    }
  });

  it("show in their years and fade out after", () => {
    const fire = calamities.find((c) => c.id === "fire-1835")!;
    expect(calamityOpacity(fire, 1834)).toBe(0);
    expect(calamityOpacity(fire, 1835)).toBe(1);
    expect(calamityOpacity(fire, 1837)).toBeGreaterThan(0);
    expect(calamityOpacity(fire, 1837)).toBeLessThan(1);
    expect(calamityOpacity(fire, 1835 + CALAMITY_FADE)).toBe(0);
    // The 1776 ruins stood until the British left.
    const ruins = calamities.find((c) => c.id === "fire-1776")!;
    expect(calamityOpacity(ruins, 1782)).toBe(1);
  });
});
