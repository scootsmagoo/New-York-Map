/**
 * Public housing: the New York City Housing Authority's developments, each
 * outlined and dated by when it was completed.
 *
 * Inputs (gitignored), from NYC Open Data:
 *   data-raw/nycha/databook.json — NYCHA Development Data Book (evjd-dqpz):
 *     curl -s 'https://data.cityofnewyork.us/resource/evjd-dqpz.json?$limit=5000'
 *   data-raw/nycha/outlines.json — NYCHA Public Housing Developments (phvi-damg):
 *     curl -s 'https://data.cityofnewyork.us/resource/phvi-damg.json?$limit=5000'
 * joined on the TDS number (a mapped development can span several data-book
 * rows, consolidated since; its year is the earliest completion).
 *
 * Output: src/data/geo/housing.json — { q, developments: [{ name, year,
 * apartments, rings }] } for those completed by 1975, rings packed like the
 * other geometry (lib/geoPack.ts unpackRing). Loaded with the layer.
 *
 * Run: node scripts/prepare-housing.mjs
 */
import fs from "node:fs";
import path from "node:path";

const TIME_MAX = 1975;
const db = JSON.parse(fs.readFileSync(path.resolve("data-raw/nycha/databook.json"), "utf8"));
const outlines = JSON.parse(fs.readFileSync(path.resolve("data-raw/nycha/outlines.json"), "utf8"));
const num = (s) => Number(String(s ?? "0").replace(/,/g, "")) || 0;

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
const Q = 100000;
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
/** Title case for the data book's capitals: "JACOB RIIS" → "Jacob Riis". */
const title = (s) =>
  s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(Ii|Iii|Iv)\b/g, (m) => m.toUpperCase())
    .replace(/(\d)(St|Nd|Rd|Th)\b/g, (_, d, s2) => d + s2.toLowerCase());

const developments = [];
for (const o of outlines) {
  const rows = db.filter((r) => r.tds_ === o.tds_num || r.consolidated_tds_ === o.tds_num);
  const years = rows.map((r) => Number(String(r.completion_date ?? "").slice(0, 4))).filter(Boolean);
  if (!years.length || !o.the_geom) continue;
  const year = Math.min(...years);
  if (year > TIME_MAX) continue;
  const apartments = rows.reduce((s, r) => s + num(r.total_number_of_apartments), 0);
  const rings = o.the_geom.coordinates
    .map((poly) => simplify(poly[0].slice(0, -1), 4))
    .filter((r) => r.length >= 3)
    .map(pack);
  developments.push({ name: title(o.developmen), year, apartments, rings });
}
developments.sort((a, b) => a.year - b.year);
const file = path.resolve("src/data/geo/housing.json");
fs.writeFileSync(file, JSON.stringify({ q: Q, developments }));
const total = developments.reduce((s, d) => s + d.apartments, 0);
console.log(`${developments.length} developments by ${TIME_MAX}, ${total} apartments, ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
