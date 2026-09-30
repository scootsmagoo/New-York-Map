/**
 * Builds streetcar route geometry from the legs in src/data/streetcars.ts
 * and the city's street centerlines (downloaded by prepare-streets.mjs into
 * data-raw/).
 *
 * Each leg is a street between two cross streets. The script finds where
 * the street meets each cross street, then takes the shortest path between
 * those points along the street's own centerline segments (short gaps in a
 * street's line, like a divided avenue's median crossings, are bridged).
 *
 * Outputs:
 *   src/data/geo/streetcars.json — { lineId: [[lon, lat], …][] }, one
 *     polyline per leg. Loaded only when the streetcar layer is on.
 *   src/data/geo/streetcarCenters.json — { lineId: [lon, lat] }, the middle
 *     of each line, for search (small enough for the main bundle).
 *
 * Run: node --experimental-strip-types scripts/prepare-streetcars.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { streetcarLines, BOROUGH_CODE } from "../src/data/streetcars.ts";
import { buildLeg, midpoint } from "./lib/street-routes.mjs";

const outDir = path.resolve("src/data/geo");

const geometry = {};
const centers = {};
let failed = 0;
for (const line of streetcarLines) {
  const boro = BOROUGH_CODE[line.borough];
  const legs = [];
  for (const leg of line.legs) {
    const r = buildLeg(boro, leg);
    if (r.error) {
      console.error(`${line.id}: ${r.error}`);
      failed++;
    } else legs.push(r.pts);
  }
  geometry[line.id] = legs;
  const { point, km } = midpoint(legs);
  centers[line.id] = point;
  console.log(`${line.id}: ${legs.length}/${line.legs.length} legs, ${km.toFixed(1)} km`);
}

fs.writeFileSync(path.join(outDir, "streetcars.json"), JSON.stringify(geometry));
fs.writeFileSync(path.join(outDir, "streetcarCenters.json"), JSON.stringify(centers));
if (failed) {
  console.error(`${failed} leg(s) failed`);
  process.exit(1);
}
