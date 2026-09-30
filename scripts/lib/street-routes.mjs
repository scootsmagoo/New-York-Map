/**
 * Routes along the city's streets: a leg is a street between two cross
 * streets; buildLeg finds where the street meets each one and takes the
 * shortest path between them along the street's own centerline segments.
 * Used by prepare-streetcars.mjs and prepare-transit.mjs. Needs the
 * centerlines prepare-streets.mjs downloads into data-raw/.
 */
import fs from "node:fs";
import path from "node:path";

const rawDir = path.resolve("data-raw");
const pages = fs
  .readdirSync(rawDir)
  .filter((f) => /^cscl_\d+\.json$/.test(f))
  .map((f) => path.join(rawDir, f));
if (!pages.length) {
  console.error("No street centerlines in data-raw/. Run scripts/prepare-streets.mjs first.");
  process.exit(1);
}

const norm = (name) => name.toUpperCase().split(/\s+/).filter(Boolean).join(" ");

/** "boro|NAME" → list of polylines ([lon, lat][]). */
const streets = new Map();
for (const file of pages) {
  for (const row of JSON.parse(fs.readFileSync(file, "utf8"))) {
    if (!row.the_geom || !row.full_street_name) continue;
    const key = `${row.boroughcode}|${norm(row.full_street_name)}`;
    const list = streets.get(key) ?? [];
    for (const line of row.the_geom.coordinates) list.push(line);
    streets.set(key, list);
  }
}

// ----- Geometry (local meters) -----

const M_LAT = 111320;
const M_LON = 84310;
export const dist = (a, b) => Math.hypot((a[0] - b[0]) * M_LON, (a[1] - b[1]) * M_LAT);
const keyOf = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;

export function lines(boro, name) {
  const l = streets.get(`${boro}|${norm(name)}`);
  if (!l) throw new Error(`No street "${name}" in borough ${boro}`);
  return l;
}

/** Where two streets meet: the closest pair of their vertices. */
export function meet(a, b) {
  let best = { d: Infinity, p: null };
  for (const la of a)
    for (const pa of la)
      for (const lb of b)
        for (const pb of lb) {
          const d = dist(pa, pb);
          if (d < best.d) best = { d, p: pa };
        }
  return best;
}

/**
 * Shortest path along a street's segments. Gaps in a street's line (a plaza
 * it crosses under another name, a divided stretch) are bridged up to 400 m,
 * at a cost that keeps the path on the street wherever the street goes.
 */
export function pathAlong(streetLines, from, to) {
  const nodes = new Map(); // key → { p, edges: [key, w][] }
  const node = (p) => {
    const k = keyOf(p);
    if (!nodes.has(k)) nodes.set(k, { p, edges: [] });
    return k;
  };
  const link = (a, b, w) => {
    nodes.get(a).edges.push([b, w]);
    nodes.get(b).edges.push([a, w]);
  };
  const ends = [];
  for (const line of streetLines) {
    for (let i = 1; i < line.length; i++) link(node(line[i - 1]), node(line[i]), dist(line[i - 1], line[i]));
    ends.push(keyOf(line[0]), keyOf(line[line.length - 1]));
  }
  const all = [...nodes.keys()];
  for (const e of ends) {
    const p = nodes.get(e).p;
    for (const k of all) {
      if (k === e) continue;
      const d = dist(p, nodes.get(k).p);
      if (d < 400) link(e, k, d * 4);
    }
  }
  const nearest = (p) => all.reduce((a, k) => (dist(nodes.get(k).p, p) < dist(nodes.get(a).p, p) ? k : a));
  const start = nearest(from);
  const goal = nearest(to);
  // Dijkstra (the graphs are a few thousand nodes; a sorted frontier is fine).
  const best = new Map([[start, 0]]);
  const prev = new Map();
  const open = [[0, start]];
  const done = new Set();
  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [d, k] = open.shift();
    if (done.has(k)) continue;
    done.add(k);
    if (k === goal) break;
    for (const [n, w] of nodes.get(k).edges) {
      const nd = d + w;
      if (nd < (best.get(n) ?? Infinity)) {
        best.set(n, nd);
        prev.set(n, k);
        open.push([nd, n]);
      }
    }
  }
  if (!done.has(goal)) return null;
  const out = [];
  for (let k = goal; k !== undefined; k = prev.get(k)) out.push(nodes.get(k).p);
  return out.reverse();
}

/** Douglas–Peucker in meters. */
export function simplify(pts, tol = 4) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const ab = dist(a, b) || 1;
  let far = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    // Distance from p to the chord, via the triangle's area.
    const area = Math.abs(
      ((b[0] - a[0]) * M_LON) * ((p[1] - a[1]) * M_LAT) - ((p[0] - a[0]) * M_LON) * ((b[1] - a[1]) * M_LAT)
    );
    const d = area / ab;
    if (d > far) {
      far = d;
      idx = i;
    }
  }
  if (far <= tol) return [a, b];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

export const round = (p) => [Number(p[0].toFixed(5)), Number(p[1].toFixed(5))];


/**
 * One leg as a simplified polyline, or an error message: the street, and
 * where it meets its two cross streets (within 80 m).
 */
export function buildLeg(boro, [street, a, b]) {
  const s = lines(boro, street);
  const ma = meet(s, lines(boro, a));
  const mb = meet(s, lines(boro, b));
  if (ma.d > 80 || mb.d > 80) {
    return { error: `${street} doesn't meet ${ma.d > 80 ? a : b} (${Math.round(Math.max(ma.d, mb.d))} m)` };
  }
  const p = pathAlong(s, ma.p, mb.p);
  if (!p) return { error: `no path along ${street} from ${a} to ${b}` };
  return { pts: simplify(p).map(round) };
}

/** The point halfway along a set of legs. */
export function midpoint(legs) {
  const flat = legs.flat();
  let total = 0;
  for (let i = 1; i < flat.length; i++) total += dist(flat[i - 1], flat[i]);
  let run = 0;
  for (let i = 1; i < flat.length; i++) {
    run += dist(flat[i - 1], flat[i]);
    if (run >= total / 2) return { point: flat[i], km: total / 1000 };
  }
  return { point: flat[0], km: total / 1000 };
}
