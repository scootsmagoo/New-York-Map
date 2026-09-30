/**
 * Geometry for the railroads in src/data/railroads.ts, from OpenStreetMap's
 * railway ways (© OpenStreetMap contributors, ODbL). Download them once:
 *
 *   curl -s --data-urlencode 'data=[out:json][timeout:180];way["railway"~"^(rail|subway|light_rail|abandoned|disused|razed|construction|preserved)$"](40.49,-74.27,40.92,-73.68);out tags geom;' \
 *     https://overpass-api.de/api/interpreter -o data-raw/osm_rail.json
 *
 * Each line picks
 * ways by name within a box; parallel tracks are thinned to one line, then
 * simplified. Lines along a street use the street centerlines instead.
 * Output: src/data/geo/railroads.json — { lineId: [[lon, lat], …][] }.
 * Run: node --experimental-strip-types scripts/prepare-railroads.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { railroadLines } from "../src/data/railroads.ts";
import { buildLeg, dist, round, simplify } from "./lib/street-routes.mjs";

const ways = JSON.parse(fs.readFileSync(path.resolve("data-raw/osm_rail.json"), "utf8")).elements.filter(
  (w) => w.type === "way" && w.geometry
);

/** Tracks closer than this are one line on the map. */
const SAME_LINE_M = 30;
const TYPES = new Set(["rail", "subway", "light_rail", "abandoned", "disused", "razed"]);
const NEVER = new Set(["yard", "siding", "crossover"]);

const inBox = ([lon, lat], [w, s, e, n]) => lon >= w && lon <= e && lat >= s && lat <= n;

/** Distance in meters from p to segment ab. */
function toSegment(p, a, b) {
  const ax = (b[0] - a[0]) * 84310, ay = (b[1] - a[1]) * 111320;
  const px = (p[0] - a[0]) * 84310, py = (p[1] - a[1]) * 111320;
  const len = ax * ax + ay * ay;
  const t = len ? Math.max(0, Math.min(1, (px * ax + py * ay) / len)) : 0;
  return Math.hypot(px - t * ax, py - t * ay);
}

/** Runs of consecutive points inside the box, from the ways a source names. */
function pieces(src) {
  const out = [];
  for (const w of ways) {
    const t = w.tags ?? {};
    if (!src.names.includes(t.name) || !TYPES.has(t.railway)) continue;
    if (NEVER.has(t.service) || (t.service === "spur" && !src.spurs)) continue;
    if (src.noTunnel && t.tunnel && t.tunnel !== "no") continue;
    let run = [];
    for (const g of w.geometry) {
      const p = [g.lon, g.lat];
      if (!src.box || inBox(p, src.box)) run.push(p);
      else {
        if (run.length > 1) out.push(run);
        run = [];
      }
    }
    if (run.length > 1) out.push(run);
  }
  return out;
}

/** One line per corridor: keep a segment only if no kept one runs beside it. */
function thin(runs) {
  const length = (r) => r.slice(1).reduce((s, p, i) => s + dist(r[i], p), 0);
  runs.sort((a, b) => length(b) - length(a));
  const grid = new Map();
  const cell = (p) => `${Math.floor((p[0] * 84310) / 100)},${Math.floor((p[1] * 111320) / 100)}`;
  const near = (p) => {
    const [cx, cy] = cell(p).split(",").map(Number);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (const [a, b] of grid.get(`${cx + dx},${cy + dy}`) ?? [])
          if (toSegment(p, a, b) < SAME_LINE_M) return true;
    return false;
  };
  const add = (a, b) => {
    for (const p of [a, b, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]]) {
      const k = cell(p);
      if (!grid.has(k)) grid.set(k, []);
      grid.get(k).push([a, b]);
    }
  };
  const out = [];
  for (const r of runs) {
    // Split long OSM segments so a partial overlap doesn't hide the rest.
    const dense = [r[0]];
    for (let i = 1; i < r.length; i++) {
      const n = Math.ceil(dist(r[i - 1], r[i]) / 40);
      for (let j = 1; j <= n; j++)
        dense.push([r[i - 1][0] + ((r[i][0] - r[i - 1][0]) * j) / n, r[i - 1][1] + ((r[i][1] - r[i - 1][1]) * j) / n]);
    }
    let cur = [];
    const pending = [];
    for (let i = 1; i < dense.length; i++) {
      const a = dense[i - 1], b = dense[i];
      if (near([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])) {
        if (cur.length > 1) out.push(cur);
        cur = [];
      } else {
        if (!cur.length) cur.push(a);
        cur.push(b);
        pending.push([a, b]);
      }
    }
    if (cur.length > 1) out.push(cur);
    for (const [a, b] of pending) add(a, b);
  }
  return out;
}

/** Rejoin pieces whose ends meet (thinning cuts a line at every junction). */
function chain(legs) {
  const JOIN_M = 45;
  legs = legs.map((l) => [...l]);
  for (let joined = true; joined; ) {
    joined = false;
    outer: for (let i = 0; i < legs.length; i++)
      for (let j = i + 1; j < legs.length; j++) {
        const a = legs[i], b = legs[j];
        const [a0, a1, b0, b1] = [a[0], a[a.length - 1], b[0], b[b.length - 1]];
        let merged = null;
        if (dist(a1, b0) < JOIN_M) merged = [...a, ...b];
        else if (dist(a1, b1) < JOIN_M) merged = [...a, ...[...b].reverse()];
        else if (dist(a0, b1) < JOIN_M) merged = [...b, ...a];
        else if (dist(a0, b0) < JOIN_M) merged = [...[...b].reverse(), ...a];
        if (merged) {
          legs[i] = merged;
          legs.splice(j, 1);
          joined = true;
          break outer;
        }
      }
  }
  return legs;
}

const out = {};
let failed = 0;
for (const line of railroadLines) {
  let legs = [];
  for (const src of line.osm ?? []) {
    const runs = pieces(src);
    if (!runs.length) {
      console.error(`${line.id}: nothing named ${src.names.join(" / ")} in the box`);
      failed++;
    }
    legs.push(...thin(runs));
  }
  for (const leg of line.streets ?? []) {
    const r = buildLeg(line.boro, leg);
    if (r.error) {
      console.error(`${line.id}: ${r.error}`);
      failed++;
    } else legs.push(r.pts);
  }
  // Drop slivers left between thinned tracks.
  const length = (l) => l.slice(1).reduce((sum, p, i) => sum + dist(l[i], p), 0);
  legs = chain(legs)
    .filter((l) => length(l) > 150)
    .map((l) => simplify(l, 6).map(round));
  out[line.id] = legs;
  console.log(`${line.id}: ${legs.length} legs, ${(legs.reduce((s, l) => s + length(l), 0) / 1000).toFixed(1)} km`);
}
fs.writeFileSync(path.resolve("src/data/geo/railroads.json"), JSON.stringify(out));
if (failed) process.exit(1);
