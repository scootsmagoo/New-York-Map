/**
 * The 1811 Commissioners' Plan grid.
 *
 * Streets and avenues are straight lines on the grid's ~29° bearing, placed
 * where the real ones are: positions are measured from NYC's street
 * centerlines by scripts/prepare-streets.mjs (avenues are unevenly spaced,
 * and the wide crosstown streets push the numbering north). We draw generous
 * segments and let SVG clipping (Manhattan shoreline ∩ grid zone ∩ built
 * frontier) carve them into the survey-vs-built street story.
 */
import manhattanGrid from "../data/geo/manhattanGrid.json";

export type Seg = [[number, number], [number, number]];

interface GridAvenue {
  name: string;
  /** Meters across the grid (east positive) from the origin. */
  across: number;
  /** Meters along the grid where the avenue starts and ends. */
  from: number;
  to: number;
}

const BEARING = (29 * Math.PI) / 180;
/** Meters per degree at NYC's latitude. */
const M_PER_DEG_LAT = 111320;
const M_PER_DEG_LON = 84310;

/** Unit vector along avenues (NNE), in (lon, lat) degree space. */
const AVE = [
  Math.sin(BEARING) / M_PER_DEG_LON,
  Math.cos(BEARING) / M_PER_DEG_LAT,
];
/** Unit vector along streets (ESE). */
const STREET = [
  Math.cos(BEARING) / M_PER_DEG_LON,
  -Math.sin(BEARING) / M_PER_DEG_LAT,
];

/** Anchor near First Street & Second Avenue (shared with the prep script). */
const ORIGIN: [number, number] = [-73.992, 40.7245];

const STREET_HALF_LEN_M = 3000;

/** Meters along the grid for 1st through 220th Street. */
export const STREET_ALONG: number[] = manhattanGrid.streets.filter(
  (m): m is number => m !== null
);
export const GRID_AVENUES: GridAvenue[] = manhattanGrid.avenues;

function pt(
  base: [number, number],
  dir: number[],
  meters: number
): [number, number] {
  return [base[0] + dir[0] * meters, base[1] + dir[1] * meters];
}

let cache: { streets: Seg[]; avenues: Seg[] } | null = null;

export function gridSegments(): { streets: Seg[]; avenues: Seg[] } {
  if (cache) return cache;
  const streets: Seg[] = STREET_ALONG.map((along) => {
    const c = pt(ORIGIN, AVE, along);
    return [pt(c, STREET, -STREET_HALF_LEN_M), pt(c, STREET, STREET_HALF_LEN_M)];
  });
  const avenues: Seg[] = GRID_AVENUES.map((a) => {
    const c = pt(ORIGIN, STREET, a.across);
    return [pt(c, AVE, a.from), pt(c, AVE, a.to)];
  });
  cache = { streets, avenues };
  return cache;
}

/**
 * Sample points along a named avenue (e.g. "3rd Ave"). `fromM` / `toM` are
 * meters along the avenue bearing from the First Street row.
 */
export function avenuePolyline(
  name: string,
  fromM: number,
  toM: number,
  stepM = 350
): [number, number][] {
  const ave = GRID_AVENUES.find((a) => a.name === name);
  if (!ave) throw new Error(`Unknown avenue: ${name}`);
  const c = pt(ORIGIN, STREET, ave.across);
  const pts: [number, number][] = [];
  for (let m = fromM; m <= toM; m += stepM) {
    pts.push(pt(c, AVE, m));
  }
  const end = pt(c, AVE, toM);
  const last = pts[pts.length - 1];
  if (!last || last[0] !== end[0] || last[1] !== end[1]) {
    pts.push(end);
  }
  return pts;
}

/**
 * Where the 1811 plan applies: north of (stylized) Houston Street on the east
 * side and 14th Street west of Sixth Avenue — the older city and Greenwich
 * Village keep their crooked lanes. Counterclockwise, unclosed; extends into
 * water because it is intersected with the Manhattan shoreline when clipping.
 */
export const GRID_ZONE_RING: [number, number][] = [
  [-74.04, 40.7405],
  [-74.013, 40.7405],
  [-73.9942, 40.7338],
  [-73.9925, 40.7258],
  [-73.968, 40.7185],
  [-73.9, 40.73],
  [-73.9, 40.93],
  [-74.04, 40.93],
];
