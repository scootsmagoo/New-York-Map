import { describe, expect, it } from "vitest";
import { waterfront, waterfrontOpacity } from "../waterfront";
import { allEntries } from "../entries";
import { TIME_MAX } from "../eras";

describe("the working waterfront", () => {
  it("has unique ids, sites in the harbor, and dates in order", () => {
    expect(new Set(waterfront.map((s) => s.id)).size).toBe(waterfront.length);
    for (const s of waterfront) {
      const [lon, lat] = s.coords;
      expect(lon, s.id).toBeGreaterThan(-74.06);
      expect(lon, s.id).toBeLessThan(-73.9);
      expect(lat, s.id).toBeGreaterThan(40.62);
      expect(lat, s.id).toBeLessThan(40.8);
      expect(s.from, s.id).toBeLessThanOrEqual(TIME_MAX);
      if (s.to !== undefined) expect(s.to, s.id).toBeGreaterThan(s.from);
      if (s.book?.book === "gotham") expect(s.book.pages, s.id).toBeTruthy();
    }
  });

  it("doesn't draw a site twice where an entry already marks it", () => {
    // A twin: an entry marker a block or so away whose name shares a word
    // (the Meal Market and "The slave market's merchants" did).
    const words = (t: string) =>
      new Set(t.toLowerCase().match(/[a-z]{4,}/g)?.map((w) => w.replace(/'s$|s$/, "")) ?? []);
    const marked = allEntries.filter((e) => e.coords);
    for (const s of waterfront) {
      const mine = words(s.name);
      const twin = marked.find(
        (e) =>
          Math.hypot(e.coords![0] - s.coords[0], e.coords![1] - s.coords[1]) < 0.0015 &&
          [...words(e.title)].some((w) => mine.has(w))
      );
      expect(twin?.title, s.id).toBeUndefined();
    }
  });

  it("shows a site only while it worked", () => {
    const fly = waterfront.find((s) => s.id === "fly-market")!;
    expect(waterfrontOpacity(fly, 1698)).toBe(0);
    expect(waterfrontOpacity(fly, 1750)).toBe(1);
    expect(waterfrontOpacity(fly, 1822)).toBe(0);
    const fulton = waterfront.find((s) => s.id === "fulton-market")!;
    expect(waterfrontOpacity(fulton, TIME_MAX)).toBe(1);
  });
});
