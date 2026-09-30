/**
 * Geometry for the parkways, expressways, and road tunnels in
 * src/data/highways.ts, from the city's centerlines for highways (rw_type 2),
 * bridges (3), and tunnels (4), matched by name.
 *
 * Input (gitignored): data-raw/cscl_rw{2,3,4}.json — download each with
 *   curl -s --get https://data.cityofnewyork.us/resource/inkn-q76z.json \
 *     --data-urlencode '$select=the_geom,full_street_name,boroughcode,rw_type' \
 *     --data-urlencode "\$where=rw_type='2'" --data-urlencode '$limit=10000'
 *
 * Output: src/data/geo/highways.json — { q, roads: { id: [packed line, …] } },
 * lines delta-encoded in 1/q-degree steps (lib/geoPack.ts unpackRing), and
 * simplified to ~8 m. Loaded with the map.
 *
 * Run: node --experimental-strip-types scripts/prepare-highways.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { highways } from "../src/data/highways.ts";

const rows = ["2", "3", "4"].flatMap((t) =>
  JSON.parse(fs.readFileSync(path.resolve(`data-raw/cscl_rw${t}.json`), "utf8"))
);
const norm = (s) => (s ?? "").toUpperCase().split(/\s+/).filter(Boolean).join(" ");

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
function pack(line) {
  const out = [];
  let px = 0, py = 0;
  for (const [x, y] of line) {
    const X = Math.round(x * Q), Y = Math.round(y * Q);
    out.push(X - px, Y - py);
    px = X;
    py = Y;
  }
  return out;
}
const key = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;
/** Joins segments that meet end to end into longer lines. */
function chain(lines) {
  const byEnd = new Map();
  const add = (k, l) => (byEnd.get(k) ?? byEnd.set(k, []).get(k)).push(l);
  for (const l of lines) { add(key(l[0]), l); add(key(l[l.length - 1]), l); }
  const used = new Set();
  const out = [];
  for (const start of lines) {
    if (used.has(start)) continue;
    used.add(start);
    let line = [...start];
    for (const forward of [true, false]) {
      for (;;) {
        const end = forward ? line[line.length - 1] : line[0];
        const next = (byEnd.get(key(end)) ?? []).find((l) => !used.has(l));
        if (!next) break;
        used.add(next);
        const pts = key(next[0]) === key(end) ? next : [...next].reverse();
        line = forward ? [...line, ...pts.slice(1)] : [...[...pts].reverse().slice(0, -1), ...line];
      }
    }
    out.push(line);
  }
  return out;
}

const roads = {};
let missing = 0;
for (const h of highways) {
  const match = (name) =>
    h.cscl.some((c) => (c.endsWith("*") ? name.startsWith(c.slice(0, -1)) : name === c));
  const segs = rows
    .filter((r) => r.the_geom && match(norm(r.full_street_name)))
    .flatMap((r) => r.the_geom.coordinates);
  if (!segs.length) {
    console.error(`${h.id}: no centerlines named ${h.cscl.join(", ")}`);
    missing++;
    continue;
  }
  const lines = chain(segs).map((l) => simplify(l, 8)).filter((l) => l.length >= 2);
  roads[h.id] = lines.map(pack);
  console.log(`${h.id}: ${segs.length} segments → ${lines.length} lines`);
}
const file = path.resolve("src/data/geo/highways.json");
fs.writeFileSync(file, JSON.stringify({ q: Q, roads }));
console.log(`${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
if (missing) process.exit(1);
