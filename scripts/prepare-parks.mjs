/**
 * Real outlines for the parks of Brooklyn, Queens, the Bronx, and Staten
 * Island, from NYC Parks' property records (NYC Open Data enfh-gkve), each
 * dated by the city's acquisition of it. Manhattan's parks stay hand-drawn
 * in src/data/parks.ts.
 *
 * Input (gitignored): data-raw/parks/outer.json — download with
 *   curl -s --get https://data.cityofnewyork.us/resource/enfh-gkve.json \
 *     --data-urlencode '$select=name311,signname,borough,acquisitiondate,acres,typecategory,multipolygon' \
 *     --data-urlencode "\$where=borough in('B','Q','X','R') AND acres >= 6 AND acquisitiondate < '1976-01-01' AND typecategory in('Flagship Park','Community Park','Neighborhood Park','Nature Area','Historic House Park')" \
 *     --data-urlencode '$limit=2000' -o data-raw/parks/outer.json
 *
 * The acquisition date is the city's latest recorded one for the property,
 * so a park assembled over years can read late; KNOWN below overrides the
 * ones that matter.
 *
 * Output: src/data/geo/outerParks.json — { q, parks: [{ id, name, from,
 * completed?, rings }] }, each ring delta-encoded [dx0, dy0, dx1, dy1, …] in
 * 1/q-degree steps (lib/geoPack.ts unpackRing): about 10 m, finer than the
 * outlines are simplified to.
 * Run: node scripts/prepare-parks.mjs
 */
import fs from "node:fs";
import path from "node:path";

const rows = JSON.parse(fs.readFileSync(path.resolve("data-raw/parks/outer.json"), "utf8"));

/** Not parks by 1975, whatever the land records say. */
const SKIP = new Set([
  "Freshkills Park", // the city's landfill from 1948; a park only from 2008
]);

/** Better dates, from the parks' histories. */
const KNOWN = {
  "Prospect Park": { from: 1867, completed: 1873 },
  "Flushing Meadows Corona Park": { from: 1936, completed: 1939, name: "Flushing Meadows" },
  "Pelham Bay Park": { from: 1888 },
  "Van Cortlandt Park": { from: 1888 },
  "Bronx Park": { from: 1888 },
  "Crotona Park": { from: 1888 },
  "Forest Park": { from: 1895 },
  "Marine Park": { from: 1924 }, // the first large gift, 1920–24; mostly still marsh in 1945
};

const M_LAT = 111320;
const M_LON = 84310;
function distToSeg(p, a, b) {
  const ax = (a[0] - p[0]) * M_LON, ay = (a[1] - p[1]) * M_LAT;
  const dx = (b[0] - a[0]) * M_LON, dy = (b[1] - a[1]) * M_LAT;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
  return Math.hypot(ax + t * dx, ay + t * dy);
}
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  let far = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distToSeg(pts[i], pts[0], pts[pts.length - 1]);
    if (d > far) { far = d; idx = i; }
  }
  if (far <= tol) return [pts[0], pts[pts.length - 1]];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}
const area = (r) => Math.abs(r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2) * M_LON * M_LAT;
/** Counterclockwise, like the hand-drawn rings (the map reverses them for d3). */
const ccw = (r) => (r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + (q[0] - p[0]) * (q[1] + p[1]); }, 0) > 0 ? [...r].reverse() : r);

const Q = 10000;
function pack(ring) {
  const out = [];
  let px = 0, py = 0;
  for (const [x, y] of ring) {
    const X = Math.round(x * Q), Y = Math.round(y * Q);
    out.push(X - px, Y - py);
    px = X;
    py = Y;
  }
  return out;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const out = [];
for (const r of rows) {
  const name = r.name311;
  if (SKIP.has(name) || !r.multipolygon) continue;
  const known = KNOWN[name] ?? {};
  const rings = [];
  for (const poly of r.multipolygon.coordinates) {
    const outer = poly[0].slice(0, -1);
    if (area(outer) < 4000) continue; // pieces under ~1 acre: medians, slivers
    const s = simplify(outer, 10);
    if (s.length >= 3) rings.push(ccw(s));
  }
  if (!rings.length) continue;
  rings.sort((a, b) => area(b) - area(a));
  out.push({
    id: `park-${slug(name)}`,
    name: known.name ?? name,
    from: known.from ?? Number(r.acquisitiondate.slice(0, 4)),
    ...(known.completed ? { completed: known.completed } : {}),
    rings: rings.map(pack),
  });
}
out.sort((a, b) => a.from - b.from || a.name.localeCompare(b.name));
const file = path.resolve("src/data/geo/outerParks.json");
fs.writeFileSync(file, JSON.stringify({ q: Q, parks: out }));
console.log(`${out.length} parks, ${out.reduce((s, p) => s + p.rings.reduce((t, r) => t + r.length / 2, 0), 0)} points, ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
