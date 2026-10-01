import { describe, expect, it } from "vitest";
import { allEntries } from "../entries";
import { bridges, ferries } from "../structures";

describe("bridges and ferries", () => {
  const all = [...bridges, ...ferries];

  it("have unique ids, a line, and dates in order", () => {
    expect(new Set(all.map((s) => s.id)).size).toBe(all.length);
    for (const s of all) {
      expect(s.pts.length, s.id).toBeGreaterThanOrEqual(2);
      if (s.close !== undefined) expect(s.close, s.id).toBeGreaterThan(s.open);
    }
  });

  it("are the kind of their list, and link only to real entries", () => {
    for (const b of bridges) expect(b.kind, b.id).toBe("bridge");
    for (const f of ferries) expect(f.kind, f.id).toBe("ferry");
    const entries = new Set(allEntries.map((e) => e.id));
    for (const s of all) if (s.entryId) expect(entries.has(s.entryId), s.entryId).toBe(true);
  });

  it("stay in the harbor", () => {
    for (const s of all)
      for (const [lon, lat] of s.pts) {
        expect(lon, s.id).toBeGreaterThan(-74.27);
        expect(lon, s.id).toBeLessThan(-73.69);
        expect(lat, s.id).toBeGreaterThan(40.49);
        expect(lat, s.id).toBeLessThan(40.92);
      }
  });
});
