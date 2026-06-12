/**
 * Builds the base-map geometry from US Census cartographic boundary data.
 *
 * Source: cb_2023_us_county_500k (1:500,000, clipped to shoreline, public domain).
 * Outputs:
 *   src/data/geo/boroughs.json — the five boroughs as named polygons
 *   src/data/geo/surround.json — dissolved NJ/Westchester/Nassau/CT land for context
 *
 * Run: node scripts/prepare-geo.mjs
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import mapshaper from "mapshaper";

const CENSUS_URL =
  "https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip";

const rawDir = path.resolve("data-raw");
const outDir = path.resolve("src/data/geo");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

let zipPath = path.join(rawDir, "cb_2023_us_county_500k.zip");
const tmpZip = path.join(os.tmpdir(), "cb_2023_us_county_500k.zip");
if (!fs.existsSync(zipPath) && fs.existsSync(tmpZip)) {
  fs.copyFileSync(tmpZip, zipPath);
}
if (!fs.existsSync(zipPath)) {
  console.log("Downloading census county boundaries (~12 MB)...");
  const res = await fetch(CENSUS_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  fs.writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));
}

const zip = zipPath.split(path.sep).join("/");
const out = outDir.split(path.sep).join("/");

// The five boroughs are coterminous with five NY counties.
const BORO_FILTER =
  'STATEFP=="36" && "005,047,061,081,085".indexOf(COUNTYFP) > -1';
const BORO_NAME =
  'boro = NAME=="New York" ? "Manhattan" : NAME=="Kings" ? "Brooklyn" : NAME=="Richmond" ? "Staten Island" : NAME';

// Surrounding land: all of NJ and CT plus nearby NY counties, dissolved to one
// anonymous mass and clipped to the map's viewport box.
const SURROUND_FILTER =
  'STATEFP=="34" || STATEFP=="09" || (STATEFP=="36" && "119,087,059,103".indexOf(COUNTYFP) > -1)';
const CLIP_BBOX = "-74.65,40.30,-73.30,41.18";

await mapshaper.runCommands(
  `-i '${zip}' ` +
    `-filter '${BORO_FILTER}' ` +
    `-each '${BORO_NAME}' ` +
    `-filter-fields boro ` +
    `-simplify weighted 90% keep-shapes ` +
    `-clean ` +
    `-o '${out}/boroughs.json' format=geojson precision=0.00001`
);

await mapshaper.runCommands(
  `-i '${zip}' ` +
    `-filter '${SURROUND_FILTER}' ` +
    `-dissolve2 ` +
    `-clip bbox=${CLIP_BBOX} ` +
    `-simplify weighted 30% keep-shapes ` +
    `-clean ` +
    `-o '${out}/surround.json' format=geojson precision=0.0001`
);

for (const f of ["boroughs.json", "surround.json"]) {
  const size = fs.statSync(path.join(outDir, f)).size;
  console.log(`${f}: ${(size / 1024).toFixed(1)} KB`);
}
