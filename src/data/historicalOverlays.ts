/** Geographic bounds and timeline windows for georeferenced map overlays. */

export interface HistoricalOverlay {
  id: string;
  label: string;
  shortLabel: string;
  year: number;
  /** Path under public/ (served at ./overlays/… with Vite base). */
  src: string;
  /**
   * Ground control points for sheets that aren't drawn north-up: image
   * pixels (in `size` units) matched to known places. When present they
   * place the image by a least-squares affine fit, and `bounds` is only a
   * rough extent.
   */
  gcps?: { px: [number, number]; lonlat: [number, number]; place: string }[];
  /** Image size in pixels, required with `gcps`. */
  size?: [number, number];
  /** Axis-aligned bounds in lon/lat, north-up image. */
  bounds: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
  /** Year range where this overlay is eligible for auto crossfade. */
  window: { from: number; peak: number; to: number };
  attribution: string;
}

export const HISTORICAL_OVERLAYS: HistoricalOverlay[] = [
  {
    id: "castello",
    label: "Castello Plan (1660)",
    shortLabel: "Castello",
    year: 1660,
    src: "./overlays/castello.jpg",
    // A bird's-eye view, but close to a plan: placed by landmarks, fit error
    // ≤ 22 m. The sheet's "up" is about 32° off north.
    size: [1323, 1800],
    gcps: [
      { place: "Fort Amsterdam (the Custom House today)", px: [545, 1345], lonlat: [-74.0137, 40.70415] },
      { place: "Land gate: the wall at Broadway", px: [385, 432], lonlat: [-74.0114, 40.7075] },
      { place: "Water gate: the wall at Pearl Street", px: [1225, 432], lonlat: [-74.00745, 40.70583] },
      { place: "Heere Gracht mouth: Broad and Pearl Streets", px: [968, 1193], lonlat: [-74.0112, 40.7034] },
    ],
    bounds: { west: -74.0178, south: 40.7008, east: -73.9685, north: 40.7162 },
    window: { from: 1635, peak: 1660, to: 1710 },
    attribution: "Castello Plan redraw, Adams & Stokes (1916), via Wikimedia Commons",
  },
  {
    id: "ratzer",
    label: "Ratzer Plan (1767)",
    shortLabel: "Ratzer",
    year: 1767,
    src: "./overlays/ratzer.jpg",
    // Drawn about 8° off north. Placed by landmarks; fit error ≤ 45 m.
    // The Brooklyn shore on the sheet is hidden by the Manhattan clip.
    size: [2000, 1313],
    gcps: [
      { place: "Fort George (the Custom House today)", px: [329, 991], lonlat: [-74.0137, 40.7042] },
      { place: "Trinity Church", px: [418, 810], lonlat: [-74.0121, 40.7081] },
      { place: "St. Paul's Chapel", px: [505, 645], lonlat: [-74.0091, 40.7113] },
      { place: "Collect Pond (the Fresh Water)", px: [855, 455], lonlat: [-74.0004, 40.7156] },
      { place: "Brooklyn ferry landing", px: [1052, 1167], lonlat: [-73.9945, 40.7032] },
    ],
    bounds: { west: -74.048, south: 40.618, east: -73.878, north: 40.848 },
    window: { from: 1745, peak: 1767, to: 1835 },
    attribution: "Bernard Ratzer, Plan of the City of New York (1776 state), via Wikimedia Commons",
  },
  {
    id: "viele",
    label: "Viele Map (1865)",
    shortLabel: "Viele",
    year: 1865,
    src: "./overlays/viele.jpg",
    // Drawn along the island (north to the right), so it is placed by
    // landmarks, not bounds. Fit error is ~45 m (about half a block).
    size: [2400, 708],
    gcps: [
      { place: "Croton Receiving Reservoir, 79th–86th St", px: [1241.6, 306.7], lonlat: [-73.96665, 40.78119] },
      { place: "Mount Morris, 120th–124th St", px: [1622, 360], lonlat: [-73.94283, 40.80414] },
      { place: "Union Square", px: [588.3, 383.3], lonlat: [-73.9903, 40.7359] },
      { place: "Madison Square", px: [680.7, 365], lonlat: [-73.9878, 40.7421] },
      { place: "Stuyvesant Square", px: [596.7, 451.7], lonlat: [-73.9837, 40.7337] },
      { place: "Tompkins Square", px: [521.7, 518.3], lonlat: [-73.9818, 40.7265] },
      { place: "Washington Square", px: [493.3, 340], lonlat: [-73.9973, 40.7308] },
    ],
    bounds: { west: -74.022, south: 40.704, east: -73.928, north: 40.882 },
    window: { from: 1845, peak: 1865, to: 1895 },
    attribution:
      "Egbert L. Viele, Sanitary & Topographical Map of the City and Island of New York (1865), via Wikimedia Commons",
  },
];
