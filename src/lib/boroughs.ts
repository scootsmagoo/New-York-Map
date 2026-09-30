import packedBoroughs from "../data/geo/boroughs.packed.json";
import { unpackBoroughs } from "./geoPack";

export type Borough = "Manhattan" | "Brooklyn" | "Queens" | "Bronx" | "Staten Island";

/** Filter choices, in the order the chips show. */
export const BOROUGHS: { id: Borough; label: string }[] = [
  { id: "Manhattan", label: "Manhattan" },
  { id: "Brooklyn", label: "Brooklyn" },
  { id: "Queens", label: "Queens" },
  { id: "Bronx", label: "The Bronx" },
  { id: "Staten Island", label: "Staten Island" },
];

type Ring = [number, number][];
const shapes: { boro: Borough; rings: Ring[] }[] = unpackBoroughs(
  packedBoroughs as Parameters<typeof unpackBoroughs>[0]
).features.map((f) => ({
  boro: f.properties.boro as Borough,
  rings: f.geometry.coordinates.map((poly) => poly[0]),
}));

function inRing(p: [number, number], ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Offshore points (a pier, a ship, Castle Clinton) belong to the nearest shore within this. */
const NEAR_DEG = 0.008; // about 700–900 m

const cache = new Map<string, Borough | null>();

/** The borough a point is in, or nearest to just offshore; null in New Jersey or open water. */
export function boroughOf(coords: [number, number]): Borough | null {
  const key = `${coords[0]},${coords[1]}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  let found: Borough | null = null;
  for (const s of shapes) {
    if (s.rings.some((r) => inRing(coords, r))) {
      found = s.boro;
      break;
    }
  }
  if (!found) {
    let best = NEAR_DEG;
    for (const s of shapes) {
      for (const r of s.rings) {
        for (const [x, y] of r) {
          const d = Math.hypot((x - coords[0]) * 0.76, y - coords[1]);
          if (d < best) {
            best = d;
            found = s.boro;
          }
        }
      }
    }
  }
  cache.set(key, found);
  return found;
}
