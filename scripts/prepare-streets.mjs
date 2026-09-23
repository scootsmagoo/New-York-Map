/**
 * Builds the street-name layer and the Manhattan grid table from NYC's street
 * centerlines (CSCL, NYC Open Data inkn-q76z, street segments only).
 *
 * Outputs:
 *   src/data/geo/streetLabels.json — label anchors for every named street:
 *     a few points along each street, with its angle, the year it appears,
 *     and a label tier. Loaded only when the street-names layer is on.
 *   src/data/geo/manhattanGrid.json — where the real grid streets and
 *     avenues sit, measured along and across the 29° grid, so the drawn
 *     grid and its labels line up with the real city.
 *
 * A street's year is when the built-up footprint (src/data/footprints.ts)
 * first reaches it — there is no dataset of street opening dates. Modern
 * renamings are mapped back to their pre-1945 names below.
 *
 * Run: node --experimental-strip-types scripts/prepare-streets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { footprints, frontierAt, frontierBand } from "../src/data/footprints.ts";
import { colonialStreets } from "../src/data/streets.ts";

const URL = "https://data.cityofnewyork.us/resource/inkn-q76z.json";
const rawDir = path.resolve("data-raw");
const outDir = path.resolve("src/data/geo");
fs.mkdirSync(rawDir, { recursive: true });

// ----- Download (street segments only: rw_type 1) -----

async function downloadPage(offset) {
  const dest = path.join(rawDir, `cscl_${offset}.json`);
  if (fs.existsSync(dest)) return JSON.parse(fs.readFileSync(dest, "utf8"));
  console.log(`Downloading street centerlines from ${offset}...`);
  const q = new URLSearchParams({
    $select: "the_geom,stname_label,full_street_name,boroughcode,rw_type,streetwidth,status",
    $where: "rw_type='1'",
    $order: "objectid",
    $limit: "50000",
    $offset: String(offset),
  });
  const res = await fetch(`${URL}?${q}`);
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const rows = await res.json();
  fs.writeFileSync(dest, JSON.stringify(rows));
  return rows;
}

const rows = [];
for (let offset = 0; ; offset += 50000) {
  const page = await downloadPage(offset);
  rows.push(...page);
  if (page.length < 50000) break;
}
console.log(`${rows.length} street segments`);

// ----- Geometry helpers (local meters) -----

const M_PER_DEG_LAT = 111320;
const M_PER_DEG_LON = 84310;
const BEARING = (29 * Math.PI) / 180;
/** Same anchor as src/lib/grid.ts. */
const ORIGIN = [-73.992, 40.7245];

function gridCoords([lon, lat]) {
  const x = (lon - ORIGIN[0]) * M_PER_DEG_LON;
  const y = (lat - ORIGIN[1]) * M_PER_DEG_LAT;
  return {
    along: x * Math.sin(BEARING) + y * Math.cos(BEARING),
    across: x * Math.cos(BEARING) - y * Math.sin(BEARING),
  };
}

function metersBetween(a, b) {
  return Math.hypot((b[0] - a[0]) * M_PER_DEG_LON, (b[1] - a[1]) * M_PER_DEG_LAT);
}

function inRing(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

// ----- Names -----

const BORO_MANHATTAN = "1";
const BORO_QUEENS = "4";

/** Modern names → what the street was called through 1945. */
const RENAMED = {
  "1|ADAM CLAYTON POWELL JR BLVD": "7th Ave",
  "1|FREDERICK DOUGLASS BLVD": "8th Ave",
  "1|MALCOLM X BLVD": "Lenox Ave",
  "1|AVE OF THE AMERICAS": "6th Ave",
  "1|PARK AVE S": "4th Ave",
  "3|MALCOLM X BLVD": "Reid Ave",
  "3|MARCUS GARVEY BLVD": "Sumner Ave",
  "3|MOTHER GASTON BLVD": "Stone Ave",
  "4|GUY R BREWER BLVD": "New York Blvd",
  "5|FATHER CAPODANNO BLVD": "Seaside Blvd",
};

/** Renamed before 1945: [modern name, earlier name, year of the change]. */
const RENAMED_DURING = {
  "1|CENTRAL PARK W": ["8th Ave", 1883],
  "1|COLUMBUS AVE": ["9th Ave", 1890],
  "1|AMSTERDAM AVE": ["10th Ave", 1890],
  "1|W END AVE": ["11th Ave", 1880],
  "5|VICTORY BLVD": ["Richmond Turnpike", 1923],
  "1|FRANKLIN D ROOSEVELT DR": ["East River Dr", 1945],
};

/** Streets that took their names (or were laid out) later than the land filled in. */
const NAMED_FROM = {
  "2|GRAND CONC": 1909,
  "4|QUEENS BLVD": 1913,
  "1|FRANKLIN D ROOSEVELT DR": 1937,
};

/** Commissioners' Plan names in Manhattan: none before the 1811 grid. */
const GRID_NAME = /^([EW] )?\d+ (ST|AVE)$|^AVE [A-D]$|^(MADISON|LEXINGTON|PARK) AVE$/;

/** Post-1945 streets on land that was already built up (rail yards, projects). */
const POSTWAR = new Set([
  "1|RIVERSIDE BLVD", "1|FREEDOM PL", "1|FREEDOM PL S", "1|DUKE ELLINGTON BLVD",
  // Roosevelt Island's streets date from its 1970s rebuilding.
  "1|MAIN ST", "1|EAST RD", "1|WEST RD", "1|RIVER RD",
  "2|CONCOURSE VLG E", "2|CONCOURSE VLG W",
]);

const SUFFIX = {
  ST: "St", AVE: "Ave", BLVD: "Blvd", RD: "Rd", PL: "Pl", DR: "Dr", LN: "Ln",
  CT: "Ct", TER: "Ter", PKWY: "Pkwy", HWY: "Hwy", SQ: "Sq", WAY: "Way",
  CIR: "Cir", LOOP: "Loop", PLZ: "Plaza", EXPY: "Expy", WALK: "Walk",
  CONC: "Concourse", VLG: "Village",
  SLIP: "Slip", ROW: "Row", CRES: "Cres", ALY: "Alley", BCH: "Beach",
  N: "N", S: "S", E: "E", W: "W",
};

function ordinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${{ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th"}`;
}

function titleWord(w) {
  if (SUFFIX[w]) return SUFFIX[w];
  if (/^\d+$/.test(w)) return w;
  if (/^MC[A-Z]/.test(w)) return "Mc" + w[2] + w.slice(3).toLowerCase();
  if (/^O'[A-Z]/.test(w)) return "O'" + w[2] + w.slice(3).toLowerCase();
  return w
    .toLowerCase()
    .replace(/(^|[-'])([a-z])/g, (_, p, c) => p + c.toUpperCase());
}

/** "W 23 ST" → "W 23rd St"; "BCH 45 ST" → "Beach 45th St"; "AVE M" stays. */
export function prettyName(raw) {
  const words = raw.trim().split(/\s+/);
  return words
    .map((w, i) => {
      // "W END AVE" is West End Avenue, not the west end of End Avenue.
      if (words[i + 1] === "END" && { N: 1, S: 1, E: 1, W: 1 }[w]) {
        return { N: "North", S: "South", E: "East", W: "West" }[w];
      }
      if (/^\d+$/.test(w)) {
        const next = words[i + 1];
        // Numbered streets, avenues, roads… take an ordinal; "AVE 3" does not.
        if (next && SUFFIX[next] && !["N", "S", "E", "W"].includes(next)) return ordinal(+w);
        return w;
      }
      return titleWord(w);
    })
    .join(" ");
}

const colonialKey = (name) =>
  name.toUpperCase().replace(/\bSTREET\b/, "ST").replace(/\bAVENUE\b/, "AVE");
const colonialManhattan = new Set(
  colonialStreets.map((s) => colonialKey(s.name))
);

// ----- Group segments into streets -----

const streets = new Map();
for (const r of rows) {
  const label = r.stname_label;
  if (!label || / TO |ENTRANCE|EXIT|CONNECTOR|RAMP|APPROACH| EN | EX |^I \d|OVERPASS|UNDERPASS|PEDESTRIAN|RDWY|METROTECH|BIKE|PATH\b/.test(label)) continue;
  const key = `${r.boroughcode}|${label}`;
  if (POSTWAR.has(key)) continue;
  let s = streets.get(key);
  if (!s) {
    s = { key, boro: r.boroughcode, raw: label, segs: [], length: 0, width: [] };
    streets.set(key, s);
  }
  for (const line of r.the_geom.coordinates) {
    for (let i = 0; i < line.length - 1; i++) {
      const a = line[i];
      const b = line[i + 1];
      const len = metersBetween(a, b);
      if (len < 1) continue;
      s.segs.push({ a, b, len });
      s.length += len;
    }
  }
  if (r.streetwidth) s.width.push(+r.streetwidth);
}
console.log(`${streets.size} named streets`);

// ----- The year the built-up area reaches a point -----

const firstYear = footprints[0].year;
const lastYear = footprints[footprints.length - 1].year;

/**
 * Manhattan's solid city grows continuously with the frontier; its outlying
 * villages and the other boroughs grow by snapshot. Whichever comes first.
 */
function builtYear(pt, manhattan) {
  const bySnapshot = snapshotYear(pt, manhattan);
  if (!manhattan) return bySnapshot;
  for (let y = firstYear; y <= lastYear; y++) {
    if (bySnapshot !== null && y >= bySnapshot) break;
    if (inRing(pt, frontierBand(frontierAt(y)))) return y;
  }
  return bySnapshot;
}

function snapshotYear(pt, manhattan) {
  for (let i = 0; i < footprints.length; i++) {
    const f = footprints[i];
    const rings = manhattan ? f.manhattan : f.other;
    if (rings.some((ring) => inRing(pt, ring))) {
      // Snapshots cross-fade in from the previous one; appear halfway.
      const prev = footprints[i - 1];
      return prev ? Math.round((prev.year + f.year) / 2) : f.year;
    }
  }
  return null;
}

// ----- Anchors -----

function tierOf(s) {
  const width = s.width.length ? median(s.width) : 0;
  const arterial = /\b(AVE|BLVD|PKWY|BROADWAY|CONCOURSE|HWY)\b/.test(s.raw);
  if ((arterial && s.length >= 3000) || width >= 90) return 0; // major
  if (s.length >= 1200 || width >= 60) return 1; // secondary
  return 2; // minor
}

const SPACING = [700, 500, 350];
const MIN_SEG = 40;

const names = [];
const nameIndex = new Map();
const anchors = [];
let skippedEarly = 0;

for (const s of streets.values()) {
  const manhattan = s.boro === BORO_MANHATTAN;
  // Colonial streets carry their own dates and survive in the hand-drawn set.
  if (manhattan && colonialManhattan.has(s.raw)) continue;

  const tier = tierOf(s);
  const spacing = SPACING[tier];
  const renamed = RENAMED[s.key];
  const during = RENAMED_DURING[s.key];
  const modern = renamed ?? prettyName(s.raw);

  // Longest segments first: they hold a label's angle best.
  const segs = [...s.segs].sort((x, y) => y.len - x.len);
  const chosen = [];
  for (const seg of segs) {
    if (seg.len < MIN_SEG && chosen.length) continue;
    const mid = [(seg.a[0] + seg.b[0]) / 2, (seg.a[1] + seg.b[1]) / 2];
    if (chosen.some((c) => metersBetween(c, mid) < spacing)) continue;
    chosen.push(mid);

    let year = builtYear(mid, manhattan);
    if (year === null) continue;
    // Modern names only once the old city gives way; colonial streets cover
    // the earlier years.
    year = Math.max(year, 1800, NAMED_FROM[s.key] ?? 0);
    if (manhattan && GRID_NAME.test(s.raw)) year = Math.max(year, 1815);
    if (s.boro === BORO_QUEENS && /^\d/.test(s.raw)) year = Math.max(year, 1925);

    const dx = (seg.b[0] - seg.a[0]) * M_PER_DEG_LON;
    const dy = (seg.b[1] - seg.a[1]) * M_PER_DEG_LAT;
    let angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);

    const push = (name, from, to) => {
      if (to !== undefined && to < from) return;
      let idx = nameIndex.get(name);
      if (idx === undefined) {
        idx = names.length;
        names.push(name);
        nameIndex.set(name, idx);
      }
      anchors.push([
        Math.round((mid[0] + 74.3) * 1e5),
        Math.round((mid[1] - 40.45) * 1e5),
        angle,
        from,
        to ?? 0,
        idx,
        tier,
      ]);
    };
    if (during) {
      const [older, changed] = during;
      push(older, year, changed - 1);
      push(modern, Math.max(year, changed));
    } else {
      push(modern, year);
    }
  }
  if (!chosen.length) skippedEarly++;
}

anchors.sort((a, b) => a[6] - b[6] || a[3] - b[3]);
fs.writeFileSync(
  path.join(outDir, "streetLabels.json"),
  JSON.stringify({
    // Each anchor: [lon, lat] as 1e-5° offsets from (-74.3, 40.45), angle in
    // degrees (east = 0, counterclockwise), from year, to year (0 = still
    // named so), name index, tier (0 major … 2 minor).
    names,
    anchors,
  })
);
console.log(`${anchors.length} label anchors, ${names.length} names`);

// ----- Manhattan grid table -----

const numbered = new Map();
const avenueAcross = new Map();
const AVENUES = [
  ["12 AVE", "12th Ave"], ["11 AVE", "11th Ave"], ["10 AVE", "10th Ave"],
  ["9 AVE", "9th Ave"], ["8 AVE", "8th Ave"], ["7 AVE", "7th Ave"],
  ["AVE OF THE AMERICAS", "6th Ave"], ["5 AVE", "5th Ave"],
  ["MADISON AVE", "Madison Ave"], ["PARK AVE", "Park Ave"],
  ["LEXINGTON AVE", "Lexington Ave"], ["3 AVE", "3rd Ave"],
  ["2 AVE", "2nd Ave"], ["1 AVE", "1st Ave"], ["AVE A", "Ave A"],
  ["AVE B", "Ave B"], ["AVE C", "Ave C"], ["AVE D", "Ave D"],
];
const aveNames = new Map(AVENUES);
for (const r of rows) {
  if (r.boroughcode !== BORO_MANHATTAN) continue;
  const m = r.stname_label?.match(/^[EW]? ?(\d+) ST$/);
  for (const line of r.the_geom.coordinates) {
    for (const p of line) {
      const g = gridCoords(p);
      if (m) {
        const n = +m[1];
        if (!numbered.has(n)) numbered.set(n, []);
        numbered.get(n).push(g.along);
      }
      if (aveNames.has(r.stname_label)) {
        if (!avenueAcross.has(r.stname_label)) avenueAcross.set(r.stname_label, { across: [], along: [] });
        const a = avenueAcross.get(r.stname_label);
        a.across.push(g.across);
        a.along.push(g.along);
      }
    }
  }
}

// York Avenue continues Avenue A north of 59th; the west-side avenues run on
// as Central Park West, Columbus, Amsterdam, and West End.
const streetsAlong = [];
for (let n = 1; n <= 220; n++) {
  const pts = numbered.get(n);
  streetsAlong.push(pts && pts.length >= 2 ? Math.round(median(pts)) : null);
}
// Fill gaps (streets that don't exist today) by interpolating neighbors.
for (let i = 0; i < streetsAlong.length; i++) {
  if (streetsAlong[i] !== null) continue;
  let lo = i - 1;
  while (lo >= 0 && streetsAlong[lo] === null) lo--;
  let hi = i + 1;
  while (hi < streetsAlong.length && streetsAlong[hi] === null) hi++;
  if (lo < 0 || hi >= streetsAlong.length) continue;
  streetsAlong[i] = Math.round(
    streetsAlong[lo] + ((streetsAlong[hi] - streetsAlong[lo]) * (i - lo)) / (hi - lo)
  );
}
// Monotonic: a street never sits south of the one before it.
for (let i = 1; i < streetsAlong.length; i++) {
  if (streetsAlong[i] !== null && streetsAlong[i - 1] !== null && streetsAlong[i] <= streetsAlong[i - 1]) {
    streetsAlong[i] = streetsAlong[i - 1] + 40;
  }
}

const avenues = AVENUES.filter(([raw]) => avenueAcross.has(raw)).map(([raw, name]) => {
  const a = avenueAcross.get(raw);
  const sorted = [...a.along].sort((x, y) => x - y);
  return {
    name,
    across: Math.round(median(a.across)),
    from: Math.round(sorted[0]),
    to: Math.round(sorted[sorted.length - 1]),
  };
});
// The west-side avenues continue uptown under their later names; York
// Avenue carries Avenue A's line north.
const extendTo = { "8th Ave": "CENTRAL PARK W", "9th Ave": "COLUMBUS AVE", "10th Ave": "AMSTERDAM AVE", "11th Ave": "W END AVE", "Ave A": "YORK AVE" };
for (const ave of avenues) {
  const cont = extendTo[ave.name];
  if (!cont) continue;
  const alongs = rows
    .filter((r) => r.boroughcode === BORO_MANHATTAN && r.stname_label === cont)
    .flatMap((r) => r.the_geom.coordinates.flat().map((p) => gridCoords(p).along));
  if (alongs.length) ave.to = Math.max(ave.to, Math.round(Math.max(...alongs)));
}

fs.writeFileSync(
  path.join(outDir, "manhattanGrid.json"),
  JSON.stringify({ streets: streetsAlong, avenues }, null, 1)
);
console.log(`Manhattan grid: ${streetsAlong.filter((s) => s !== null).length} streets, ${avenues.length} avenues`);
console.log(`(${skippedEarly} streets with no anchor)`);
