/**
 * Lenape settlements, territories, and trails shown during the pre-1609 era
 * and faded out through the Dutch period. Locations are approximate —
 * archaeology and colonial deeds, not GPS.
 */

export interface LenapeSite {
  name: string;
  note: string;
  coords: [number, number];
}

export interface LenapeTerritory {
  name: string;
  coords: [number, number];
}

export const lenapeSites: LenapeSite[] = [
  { name: "Werpoes", note: "village at the Collect Pond", coords: [-74.0002, 40.7166] },
  { name: "Sapohanikan", note: "shore station, Greenwich Village", coords: [-74.008, 40.7335] },
  { name: "Konaande Kongh", note: "village near today's E 98th St", coords: [-73.951, 40.787] },
  { name: "Shorakapok", note: "village at Inwood", coords: [-73.9255, 40.8722] },
  { name: "Rechtauck", note: "camp at Corlears Hook", coords: [-73.979, 40.711] },
  { name: "Marechkawick", note: "Canarsee town, downtown Brooklyn", coords: [-73.9885, 40.6925] },
  { name: "Keskachauge", note: "planting lands, Flatlands", coords: [-73.92, 40.622] },
  { name: "Equendito", note: "Canarsie shore fisheries", coords: [-73.8895, 40.632] },
  { name: "Ranachqua", note: "Siwanoy/Wecquaesgeek Bronx", coords: [-73.885, 40.825] },
  { name: "Aquehonga", note: "Raritan Staten Island", coords: [-74.14, 40.57] },
];

export const lenapeTerritories: LenapeTerritory[] = [
  { name: "WECQUAESGEEK", coords: [-73.945, 40.845] },
  { name: "MANNAHATTA", coords: [-73.978, 40.752] },
  { name: "CANARSEE", coords: [-73.93, 40.655] },
  { name: "ROCKAWAY", coords: [-73.79, 40.63] },
  { name: "MATINECOCK", coords: [-73.745, 40.78] },
  { name: "RARITAN", coords: [-74.16, 40.555] },
  { name: "HACKENSACK", coords: [-74.06, 40.77] },
];

/** Major trails, sketched as polylines of [lon, lat]. */
export const lenapeTrails: [number, number][][] = [
  [
    // Wickquasgeck trail — the spine that became Broadway
    [-74.013, 40.704],
    [-74.006, 40.713],
    [-73.999, 40.722],
    [-73.991, 40.732],
    [-73.987, 40.741],
    [-73.982, 40.755],
    [-73.976, 40.764],
    [-73.965, 40.78],
    [-73.95, 40.80],
    [-73.943, 40.815],
    [-73.937, 40.83],
    [-73.929, 40.847],
    [-73.922, 40.861],
    [-73.92, 40.872],
  ],
  [
    // Long Island trail toward the ferry crossing
    [-73.989, 40.693],
    [-73.975, 40.687],
    [-73.955, 40.679],
    [-73.935, 40.668],
    [-73.915, 40.658],
    [-73.893, 40.652],
    [-73.87, 40.648],
  ],
];
