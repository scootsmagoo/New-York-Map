import { describe, expect, it } from "vitest";
import original from "../../data/geo/boroughs.json";
import packed from "../../data/geo/boroughs.packed.json";
import { unpackBoroughs } from "../geoPack";

describe("packed borough geometry", () => {
  it("unpacks to the original GeoJSON, to the metre", () => {
    const unpacked = unpackBoroughs(packed);
    const src = (original as any).features;
    expect(unpacked.features.map((f) => f.properties.boro)).toEqual(src.map((f: any) => f.properties.boro));
    unpacked.features.forEach((f, i) => {
      const g = src[i].geometry;
      const polys = g.type === "MultiPolygon" ? g.coordinates : [g.coordinates];
      expect(f.geometry.coordinates.length).toBe(polys.length);
      f.geometry.coordinates.forEach((rings, pi) =>
        rings.forEach((ring, ri) => {
          expect(ring.length).toBe(polys[pi][ri].length);
          ring.forEach(([x, y], k) => {
            expect(Math.abs(x - polys[pi][ri][k][0])).toBeLessThan(1e-5);
            expect(Math.abs(y - polys[pi][ri][k][1])).toBeLessThan(1e-5);
          });
        })
      );
    });
  });
});
