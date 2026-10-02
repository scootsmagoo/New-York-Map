import { describe, expect, it } from "vitest";
import { allEntries } from "../entries";
import geometry from "../geo/railroads.json";
import { infrastructureLines, loadOuterInfrastructure } from "../infrastructure";
import { railroadInfrastructure as build, railroadLines } from "../railroads";
import type { Routes } from "../transit";

const railroadInfrastructure = build(geometry as unknown as Routes);

describe("railroads", () => {
  it("each has built geometry, dates in order, and a real entry", async () => {
    // Ids are unique across every line, the lazily loaded ones included.
    const all = [...infrastructureLines, ...(await loadOuterInfrastructure())];
    expect(new Set(all.map((l) => l.id)).size).toBe(all.length);
    expect(all.length).toBeGreaterThan(infrastructureLines.length + 40);
    const entries = new Set(allEntries.map((e) => e.id));
    for (const line of railroadInfrastructure) {
      // Rebuild with scripts/prepare-railroads.mjs after changing a line's sources.
      expect(line.legs?.length, line.id).toBeGreaterThan(0);
      if (line.close !== undefined) expect(line.close, line.id).toBeGreaterThan(line.open);
      if (line.entryId) expect(entries.has(line.entryId), line.entryId).toBe(true);
    }
  });

  it("stay inside the city", () => {
    for (const line of railroadInfrastructure)
      for (const [lon, lat] of line.pts) {
        expect(lon, line.id).toBeGreaterThan(-74.27);
        expect(lon, line.id).toBeLessThan(-73.69);
        expect(lat, line.id).toBeGreaterThan(40.49);
        expect(lat, line.id).toBeLessThan(40.92);
      }
  });

  it("hand over to the subway without a gap or an overlap", () => {
    // A railroad rebuilt for rapid transit closes the year before its successor opens.
    const pairs: [string, string][] = [
      ["west-end-rr", "bmt-west-end"],
      ["culver-rr", "bmt-culver"],
      ["brighton-rr", "bmt-brighton"],
      ["sea-beach-rr", "bmt-sea-beach"],
    ];
    const byId = new Map(railroadLines.map((l) => [l.id, l]));
    for (const [rr, subway] of pairs) expect(byId.get(rr)!.close! + 1, rr).toBe(byId.get(subway)!.open);
  });
});
