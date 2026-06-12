/**
 * Builds the base-map geometry.
 *
 * Sources:
 *   - NYC Open Data "Borough Boundaries" (gthc-hcne), clipped to shoreline —
 *     detailed enough to keep the East and Harlem Rivers visible.
 *   - US Census cb_2023_us_county_500k for the surrounding NJ/NY/CT land.
 *
 * Outputs:
 *   src/data/geo/boroughs.json — the five boroughs as named polygons
 *   src/data/geo/surround.json — dissolved neighboring land for context
 *
 * Run: node scripts/prepare-geo.mjs
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import mapshaper from "mapshaper";

const BOROUGHS_URL = "https://data.cityofnewyork.us/resource/gthc-hcne.geojson";
const CENSUS_URL =
  "https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip";

const rawDir = path.resolve("data-raw");
const outDir = path.resolve("src/data/geo");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

async function download(url, dest, label) {
  if (fs.existsSync(dest)) return;
  console.log(`Downloading ${label}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const boroughsRaw = path.join(rawDir, "boroughs_raw.geojson");
await download(BOROUGHS_URL, boroughsRaw, "NYC borough boundaries (~3 MB)");

let zipPath = path.join(rawDir, "cb_2023_us_county_500k.zip");
const tmpZip = path.join(os.tmpdir(), "cb_2023_us_county_500k.zip");
if (!fs.existsSync(zipPath) && fs.existsSync(tmpZip)) {
  fs.copyFileSync(tmpZip, zipPath);
}
await download(CENSUS_URL, zipPath, "census county boundaries (~12 MB)");

const zip = zipPath.split(path.sep).join("/");
const boroSrc = boroughsRaw.split(path.sep).join("/");
const out = outDir.split(path.sep).join("/");

// Surrounding land: all of NJ and CT plus nearby NY counties, dissolved to one
// anonymous mass and clipped to the map's viewport box.
const SURROUND_FILTER =
  'STATEFP=="34" || STATEFP=="09" || (STATEFP=="36" && "119,087,059,103".indexOf(COUNTYFP) > -1)';
const CLIP_BBOX = "-74.65,40.30,-73.30,41.18";

await mapshaper.runCommands(
  `-i '${boroSrc}' ` +
    `-each 'boro=boroname' ` +
    `-filter-fields boro ` +
    `-simplify weighted 8% keep-shapes ` +
    `-clean ` +
    // gj2008: keep pre-RFC-7946 ring winding (clockwise exteriors), which is
    // what d3-geo's spherical winding convention expects.
    `-o '${out}/boroughs.json' format=geojson gj2008 precision=0.00001`
);

await mapshaper.runCommands(
  `-i '${zip}' ` +
    `-filter '${SURROUND_FILTER}' ` +
    `-dissolve2 ` +
    // Keep one property so mapshaper emits a FeatureCollection, not a bare
    // GeometryCollection.
    `-each 'name="surround"' ` +
    `-clip bbox=${CLIP_BBOX} ` +
    `-simplify weighted 30% keep-shapes ` +
    `-clean ` +
    `-o '${out}/surround.json' format=geojson gj2008 precision=0.0001`
);

for (const f of ["boroughs.json", "surround.json"]) {
  const size = fs.statSync(path.join(outDir, f)).size;
  console.log(`${f}: ${(size / 1024).toFixed(1)} KB`);
}
