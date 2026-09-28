/**
 * Builds real street lines for Brooklyn, Queens, the Bronx, and Staten
 * Island, each street segment dated by when its blocks were built up, so
 * the outer boroughs fill in street by street as the timeline runs.
 *
 * Inputs (gitignored, in data-raw/):
 *   cscl_*.json — NYC street centerlines (downloaded by prepare-streets.mjs)
 *   pluto/pluto_*.json — NYC PLUTO tax lots with their year built; download:
 *     https://data.cityofnewyork.us/resource/64uk-42ks.json with
 *     $select=borough,yearbuilt,latitude,longitude and yearbuilt>0, paged.
 *
 * A segment's year is the earliest of:
 *   - the 15th-percentile year built of the tax lots along it (PLUTO dates
 *     surviving buildings, so a few old houses outvote later rebuilding);
 *   - the year the hand-drawn built-up footprint first covers it, through
 *     1880 (villages and early suburbs whose first buildings are gone; the
 *     later hand footprints are too rough to date blocks by, and are now
 *     themselves drawn from these streets, see scripts/borough-footprints);
 *   - a known date for old roads and turnpikes (OLD_ROADS below).
 * Segments with no dated lots nearby (parks, yards, cemeteries) take the
 * median of their dated neighbors. Anything built after 1945 is dropped.
 *
 * Output: src/data/geo/streets-{bk,qn,bx,si}.json, loaded by the map only
 * when zoomed into that borough. Lines are grouped in tiles for culling;
 * each line is [decade, x0, y0, dx1, dy1, …] in 1e-5° steps from the tile
 * corner (about a meter).
 *
 * Run: node --experimental-strip-types scripts/prepare-borough-streets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { handFootprints } from "../src/data/footprints.ts";

const rawDir = path.resolve("data-raw");
const outDir = path.resolve("src/data/geo");
const TIME_MAX = 1945;
/** Hand-drawn outer-borough footprints are used for dating up to here. */
const HAND_FOOTPRINTS_UNTIL = 1880;
/**
 * …but never date a street before this: a colonial village's footprint says
 * people lived there, not that today's streets did (Brooklyn Heights' grid
 * dates from the 1820s, inside the old ferry village's outline). Before
 * 1820 only the OLD_ROADS appear.
 */
const FOOTPRINT_EARLIEST = 1820;

const BOROUGHS = {
  2: { key: "bx", pluto: "BX" },
  3: { key: "bk", pluto: "BK" },
  4: { key: "qn", pluto: "QN" },
  5: { key: "si", pluto: "SI" },
};

/**
 * Colonial roads and early turnpikes, by borough code and centerline name:
 * the roads that ran through farmland long before the blocks along them
 * were built up. Dates are when the road is known to have been in use.
 */
const OLD_ROADS = {
  3: {
    "KINGS HWY": 1700, // Lenape path, then the road linking Kings County's towns
    "FLATBUSH AVE": 1700, // the road from the ferry to Midwout (Flatbush)
    "FULTON ST": 1704, // the Ferry Road toward Jamaica
    "NEW UTRECHT AVE": 1700,
    "GRAVESEND NECK RD": 1700,
    "JAMAICA AVE": 1704,
    "METROPOLITAN AVE": 1814, // Williamsburgh and Jamaica Turnpike
  },
  4: {
    "JAMAICA AVE": 1704, // the King's Highway through Jamaica
    "NORTHERN BLVD": 1801, // Flushing and North Hempstead Turnpike
    "METROPOLITAN AVE": 1814,
    BROADWAY: 1700, // the old road through Newtown
  },
  2: {
    "BOSTON RD": 1673, // the Boston Post Road
    "EASTCHESTER RD": 1700,
    "KINGSBRIDGE RD": 1693, // to Philipse's King's Bridge
    BROADWAY: 1700, // the Albany Post Road
  },
  5: {
    "RICHMOND RD": 1700,
    "AMBOY RD": 1700,
    "ARTHUR KILL RD": 1700,
    "VICTORY BLVD": 1816, // the Richmond Turnpike
  },
};

// ----- Load -----

const norm = (name) => (name ?? "").toUpperCase().split(/\s+/).filter(Boolean).join(" ");

const segments = [];
for (const f of fs.readdirSync(rawDir).filter((f) => /^cscl_\d+\.json$/.test(f))) {
  for (const row of JSON.parse(fs.readFileSync(path.join(rawDir, f), "utf8"))) {
    const code = Number(row.boroughcode);
    if (!BOROUGHS[code] || !row.the_geom) continue;
    for (const line of row.the_geom.coordinates) {
      if (line.length >= 2) segments.push({ code, name: norm(row.full_street_name), pts: line });
    }
  }
}
console.log(`${segments.length} outer-borough street segments`);

const lots = [];
const plutoDir = path.join(rawDir, "pluto");
for (const f of fs.readdirSync(plutoDir).filter((f) => f.endsWith(".json"))) {
  for (const r of JSON.parse(fs.readFileSync(path.join(plutoDir, f), "utf8"))) {
    const y = Number(r.yearbuilt);
    if (y >= 1600 && y <= 2030) lots.push([Number(r.longitude), Number(r.latitude), y]);
  }
}
console.log(`${lots.length} dated tax lots`);

// ----- Geometry -----

const M_LAT = 111320;
const M_LON = 84310;
const CELL = 0.001; // spatial hash cell, about 85 × 110 m
const cellKey = (lon, lat) => `${Math.floor(lon / CELL)},${Math.floor(lat / CELL)}`;

const lotGrid = new Map();
for (const lot of lots) {
  const k = cellKey(lot[0], lot[1]);
  if (!lotGrid.has(k)) lotGrid.set(k, []);
  lotGrid.get(k).push(lot);
}

/** Distance in meters from point p to segment ab. */
function distToSeg(p, a, b) {
  const ax = (a[0] - p[0]) * M_LON;
  const ay = (a[1] - p[1]) * M_LAT;
  const bx = (b[0] - p[0]) * M_LON;
  const by = (b[1] - p[1]) * M_LAT;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
  return Math.hypot(ax + t * dx, ay + t * dy);
}

/** Lots within `r` meters of a polyline. */
function lotsAlong(pts, r = 45) {
  const lons = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  const pad = r / M_LAT;
  const out = [];
  for (let cx = Math.floor((Math.min(...lons) - pad) / CELL); cx <= Math.floor((Math.max(...lons) + pad) / CELL); cx++) {
    for (let cy = Math.floor((Math.min(...lats) - pad) / CELL); cy <= Math.floor((Math.max(...lats) + pad) / CELL); cy++) {
      for (const lot of lotGrid.get(`${cx},${cy}`) ?? []) {
        for (let i = 1; i < pts.length; i++) {
          if (distToSeg(lot, pts[i - 1], pts[i]) <= r) {
            out.push(lot[2]);
            break;
          }
        }
      }
    }
  }
  return out;
}

function quantile(values, q) {
  const s = [...values].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
}

function inRing(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** First footprint snapshot, through 1880, whose outer-borough built-up area covers a point. */
function footprintYear(pt) {
  for (const snap of handFootprints.filter((s) => s.year <= HAND_FOOTPRINTS_UNTIL && s.other.length)) {
    if (snap.other.some((ring) => inRing(pt, ring))) return snap.year;
  }
  return Infinity;
}

const mid = (pts) => pts[Math.floor(pts.length / 2)];

// ----- Date every segment -----

let fromLots = 0;
let fromFootprint = 0;
let fromRoads = 0;
for (const seg of segments) {
  const years = lotsAlong(seg.pts);
  const lotYear = years.length >= 3 ? quantile(years, 0.15) : Infinity;
  const fpYear = Math.max(FOOTPRINT_EARLIEST, footprintYear(mid(seg.pts)));
  const roadYear = OLD_ROADS[seg.code]?.[seg.name] ?? Infinity;
  const year = Math.min(lotYear, fpYear, roadYear);
  if (year === roadYear && roadYear < Infinity) fromRoads++;
  else if (year === fpYear && fpYear < Infinity) fromFootprint++;
  else if (year < Infinity) fromLots++;
  seg.year = year;
  seg.dated = year < Infinity;
}

// Undated segments take the median year of dated neighbors within 250 m.
const segGrid = new Map();
for (const seg of segments) {
  const m = mid(seg.pts);
  const k = cellKey(m[0], m[1]);
  if (!segGrid.has(k)) segGrid.set(k, []);
  segGrid.get(k).push(seg);
}
let fromNeighbors = 0;
for (const seg of segments) {
  if (seg.year < Infinity) continue;
  const m = mid(seg.pts);
  const cx = Math.floor(m[0] / CELL);
  const cy = Math.floor(m[1] / CELL);
  const near = [];
  for (let dx = -3; dx <= 3; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      for (const other of segGrid.get(`${cx + dx},${cy + dy}`) ?? []) {
        if (other.dated) near.push(other.year);
      }
    }
  }
  if (near.length >= 3) {
    seg.year = quantile(near, 0.5);
    fromNeighbors++;
  }
}

const kept = segments.filter((s) => s.year <= TIME_MAX);
console.log(
  `dated: ${fromLots} by lots, ${fromFootprint} by footprint, ${fromRoads} old roads, ` +
    `${fromNeighbors} by neighbors; ${kept.length} of ${segments.length} built by ${TIME_MAX}`
);

// ----- Chain, simplify, tile -----

const decadeOf = (y) => Math.floor(y / 10) * 10;
const ptKey = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;

/** Joins segments of one street and decade that meet end to end. */
function chain(segs) {
  const byEnd = new Map();
  const add = (k, s) => {
    if (!byEnd.has(k)) byEnd.set(k, []);
    byEnd.get(k).push(s);
  };
  for (const s of segs) {
    add(ptKey(s.pts[0]), s);
    add(ptKey(s.pts[s.pts.length - 1]), s);
  }
  const used = new Set();
  const lines = [];
  for (const start of segs) {
    if (used.has(start)) continue;
    used.add(start);
    let line = [...start.pts];
    for (const forward of [true, false]) {
      for (;;) {
        const endPt = forward ? line[line.length - 1] : line[0];
        const next = (byEnd.get(ptKey(endPt)) ?? []).find((s) => !used.has(s));
        if (!next) break;
        used.add(next);
        const pts = ptKey(next.pts[0]) === ptKey(endPt) ? next.pts : [...next.pts].reverse();
        line = forward ? [...line, ...pts.slice(1)] : [...[...pts].reverse().slice(0, -1), ...line];
      }
    }
    lines.push(line);
  }
  return lines;
}

function simplify(pts, tol = 2.5) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let far = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distToSeg(pts[i], a, b);
    if (d > far) {
      far = d;
      idx = i;
    }
  }
  if (far <= tol) return [a, b];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

export const TILE = 0.02; // degrees, about 1.7 × 2.2 km
const Q = 1e5;

for (const [code, { key }] of Object.entries(BOROUGHS)) {
  const mine = kept.filter((s) => s.code === Number(code));
  const groups = new Map();
  for (const s of mine) {
    const g = `${s.name}|${decadeOf(s.year)}`;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(s);
  }
  const tiles = {};
  let points = 0;
  for (const [g, segs] of groups) {
    const decade = Number(g.split("|")[1]);
    for (const line of chain(segs)) {
      const pts = simplify(line);
      const tx = Math.floor(pts[0][0] / TILE);
      const ty = Math.floor(pts[0][1] / TILE);
      const ox = tx * TILE;
      const oy = ty * TILE;
      const enc = [decade];
      let px = 0;
      let py = 0;
      for (const p of pts) {
        const x = Math.round((p[0] - ox) * Q);
        const y = Math.round((p[1] - oy) * Q);
        enc.push(x - px, y - py);
        px = x;
        py = y;
      }
      points += pts.length;
      (tiles[`${tx},${ty}`] ??= []).push(enc);
    }
  }
  const file = path.join(outDir, `streets-${key}.json`);
  fs.writeFileSync(file, JSON.stringify({ tile: TILE, q: Q, tiles }));
  console.log(`${key}: ${mine.length} segments → ${points} points in ${Object.keys(tiles).length} tiles, ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}
