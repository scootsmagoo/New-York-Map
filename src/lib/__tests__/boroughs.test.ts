import { describe, expect, it } from "vitest";
import { boroughOf } from "../boroughs";
import { searchEntries } from "../search";

describe("boroughs", () => {
  it("places points in their borough, offshore ones on the nearest shore", () => {
    expect(boroughOf([-73.9855, 40.758])).toBe("Manhattan"); // Times Square
    expect(boroughOf([-73.9581, 40.665])).toBe("Brooklyn"); // Ebbets Field
    expect(boroughOf([-73.8481, 40.7556])).toBe("Queens"); // Shea
    expect(boroughOf([-73.9262, 40.8296])).toBe("Bronx"); // Yankee Stadium
    expect(boroughOf([-74.1028, 40.6425])).toBe("Staten Island"); // Snug Harbor
    expect(boroughOf([-74.0181, 40.7714])).toBeNull(); // Weehawken, New Jersey
  });

  it("filters search to one borough", () => {
    const all = searchEntries("bridge", 60).map((h) => h.item.title);
    const bk = searchEntries("bridge", 60, "Brooklyn").map((h) => h.item.title);
    expect(bk.length).toBeGreaterThan(0);
    expect(bk.length).toBeLessThan(all.length);
    expect(searchEntries("Coney Island", 24, "Bronx").some((h) => h.item.title === "Coney Island")).toBe(false);
  });
});
