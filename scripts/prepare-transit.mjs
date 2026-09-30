/**
 * Geometry for the els and subways in src/data/transit.ts, routed along
 * the streets they ran over or under (scripts/lib/street-routes.mjs).
 * Output: src/data/geo/transit.json — { lineId: [[lon, lat], …][] }.
 * Run: node --experimental-strip-types scripts/prepare-transit.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { transitLines } from "../src/data/transit.ts";
import { buildLeg, midpoint } from "./lib/street-routes.mjs";

const out = {};
let failed = 0;
for (const line of transitLines) {
  const legs = [];
  for (const leg of line.legs) {
    const r = buildLeg(line.boro, leg);
    if (r.error) {
      console.error(`${line.id}: ${r.error}`);
      failed++;
    } else legs.push(r.pts);
  }
  out[line.id] = legs;
  console.log(`${line.id}: ${legs.length}/${line.legs.length} legs, ${midpoint(legs).km.toFixed(1)} km`);
}
fs.writeFileSync(path.resolve("src/data/geo/transit.json"), JSON.stringify(out));
if (failed) process.exit(1);
