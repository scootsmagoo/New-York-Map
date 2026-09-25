/**
 * Packs src/data/geo/boroughs.json for the app: each ring becomes a flat
 * list of integer steps at 1e-5° (~1 m), the first absolute and the rest
 * relative to the point before. 141 KB → 50 KB (39 → 20 KB gzipped), and
 * less JSON to parse before the first paint. src/lib/geoPack.ts unpacks it.
 * The GeoJSON stays the source of truth for the scripts that read it.
 *
 * Run: node scripts/pack-geo.mjs (prepare-geo.mjs runs it too)
 */
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("src/data/geo");
const geo = JSON.parse(fs.readFileSync(path.join(dir, "boroughs.json"), "utf8"));

const packed = geo.features.map((f) => {
  const g = f.geometry;
  const polys = g.type === "MultiPolygon" ? g.coordinates : [g.coordinates];
  return {
    boro: f.properties.boro,
    p: polys.map((rings) =>
      rings.map((ring) => {
        const out = [];
        let px = 0;
        let py = 0;
        for (const [x, y] of ring) {
          const ix = Math.round(x * 1e5);
          const iy = Math.round(y * 1e5);
          out.push(ix - px, iy - py);
          px = ix;
          py = iy;
        }
        return out;
      })
    ),
  };
});

const dest = path.join(dir, "boroughs.packed.json");
fs.writeFileSync(dest, JSON.stringify(packed));
console.log(`wrote ${dest}: ${fs.statSync(dest).size} bytes`);
