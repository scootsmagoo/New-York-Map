/**
 * Procedural 1811 Commissioners' Plan grid.
 *
 * The Manhattan grid is regular enough to generate geometrically: avenues run
 * ~29° east of true north, streets perpendicular. We generate generous line
 * segments in lon/lat and let SVG clipping (Manhattan shoreline ∩ grid zone ∩
 * built frontier) carve them into the survey-vs-built street story.
 */

export type Seg = [[number, number], [number, number]];

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

/** Anchor near First Street & Second Avenue. */
const ORIGIN: [number, number] = [-73.992, 40.7245];

const STREET_PITCH_M = 79.25; // 200 ft block + 60 ft street
const AVE_PITCH_M = 281; // average avenue spacing
const STREET_COUNT = 250; // up to Inwood; clipped to the island anyway
const STREET_HALF_LEN_M = 3000;
/** Avenues extend north from the grid zone; no southern tail into the Hudson. */
const AVE_SPAN_M: [number, number] = [0, 19800];
/** Avenue offsets west (negative) and east of the origin. */
const AVE_RANGE: [number, number] = [-10, 5];

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
  const streets: Seg[] = [];
  for (let i = 0; i < STREET_COUNT; i++) {
    const c = pt(ORIGIN, AVE, i * STREET_PITCH_M);
    streets.push([
      pt(c, STREET, -STREET_HALF_LEN_M),
      pt(c, STREET, STREET_HALF_LEN_M),
    ]);
  }
  const avenues: Seg[] = [];
  for (let j = AVE_RANGE[0]; j <= AVE_RANGE[1]; j++) {
    const c = pt(ORIGIN, STREET, j * AVE_PITCH_M);
    avenues.push([pt(c, AVE, AVE_SPAN_M[0]), pt(c, AVE, AVE_SPAN_M[1])]);
  }
  cache = { streets, avenues };
  return cache;
}

/**
 * Sample points along a numbered avenue (grid index `j`, matching AVE_RANGE).
 * `fromM` / `toM` are meters along the avenue bearing from the First Street row.
 */
export function avenuePolyline(
  j: number,
  fromM: number,
  toM: number,
  stepM = 350
): [number, number][] {
  const c = pt(ORIGIN, STREET, j * AVE_PITCH_M);
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
