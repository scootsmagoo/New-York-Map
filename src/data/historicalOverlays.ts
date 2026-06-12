/** Geographic bounds and timeline windows for georeferenced map overlays. */

export interface HistoricalOverlay {
  id: string;
  label: string;
  shortLabel: string;
  year: number;
  /** Path under public/ (served at ./overlays/… with Vite base). */
  src: string;
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
    // Lower Manhattan — hand-tuned to Adams/Stokes redraw; shorelines are approximate.
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
    // Full sheet includes Brooklyn/Bay vignette; Manhattan clip hides the rest.
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
    bounds: { west: -74.022, south: 40.704, east: -73.928, north: 40.882 },
    window: { from: 1845, peak: 1865, to: 1895 },
    attribution:
      "Egbert L. Viele, Sanitary & Topographical Map of the City and Island of New York (1865), via Wikimedia Commons",
  },
];
