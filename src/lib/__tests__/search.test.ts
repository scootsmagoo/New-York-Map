import { describe, expect, it } from "vitest";
import { groupSearchHits, searchEntries } from "../search";

const top = (q: string) => searchEntries(q)[0]?.item;

describe("search", () => {
  it("finds entries, streets, neighborhoods, and lost waters", () => {
    expect(top("Boss Tweed")?.kind).toBe("person");
    expect(top("Pearl Street")?.kind).toBe("street");
    expect(searchEntries("Five Points").some((h) => h.item.kind === "neighborhood")).toBe(true);
    expect(top("Minetta")?.kind).toBe("water");
  });

  it("finds a neighborhood by an earlier name", () => {
    const flushing = searchEntries("Vlissingen").find((h) => h.item.kind === "neighborhood");
    expect(flushing?.item.title).toBe("Flushing");
    const ts = searchEntries("Longacre").find((h) => h.item.kind === "neighborhood");
    expect(ts?.item.title).toBe("Times Square");
  });

  it("sends a lost water back to a year before it was filled, with its layer", () => {
    const hit = searchEntries("Collect Pond").find((h) => h.item.kind === "water")!;
    expect(hit.item.source.type).toBe("location");
    if (hit.item.source.type !== "location") return;
    const loc = hit.item.source.location;
    expect(loc.layer).toBe("lostLandscape");
    expect(loc.year).toBeLessThan(1811);
    expect(loc.range[1]).toBe(1811);
  });

  it("finds a fire or epidemic and sends the map to its year, with its layer", () => {
    const hit = searchEntries("cholera").find((h) => h.item.kind === "calamity")!;
    if (hit.item.source.type !== "location") throw new Error("not a location");
    expect(hit.item.source.location.layer).toBe("calamities");
    expect([1832, 1849]).toContain(hit.item.source.location.year);
    expect(searchEntries("Canvas Town").some((h) => h.item.id === "calamity:fire-1776")).toBe(true);
  });

  it("finds a waterfront site by what it made or did", () => {
    const hit = searchEntries("Monitor ironclad").find((h) => h.item.kind === "waterfront")!;
    expect(hit.item.title).toBe("Continental Iron Works");
    if (hit.item.source.type !== "location") throw new Error("not a location");
    expect(hit.item.source.location.layer).toBe("waterfront");
    expect(hit.item.source.location.range[0]).toBe(1861);
  });

  it("opens a renamed neighborhood under its later name", () => {
    const hit = searchEntries("Times Square").find((h) => h.item.kind === "neighborhood")!;
    if (hit.item.source.type !== "location") throw new Error("not a location");
    expect(hit.item.source.location.year).toBeGreaterThanOrEqual(1904);
  });

  it("groups results under labeled headings", () => {
    const groups = groupSearchHits(searchEntries("Harlem"));
    const labels = groups.map((g) => g.label);
    expect(labels).toContain("Neighborhoods");
    expect(labels).toContain("Lost waters");
  });
});
