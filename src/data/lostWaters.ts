/**
 * The named waters of the lost-landscape layer, for search: small enough to
 * ship in the main bundle, where the full geometry (geo/lostLandscape.json)
 * loads only when the layer is on. Ids match that file.
 */
export interface LostWater {
  id: string;
  name: string;
  kind: "pond" | "marsh" | "stream";
  /** Year it was filled or buried. */
  until: number;
  /** Where to fly to: the middle of the pond, marsh, or stream. */
  coords: [number, number];
  /** Other names and words people might search for. */
  aka?: string;
}

export const lostWaters: LostWater[] = [
  { id: "collect", name: "Collect Pond", kind: "pond", until: 1811, coords: [-74.0004, 40.71559], aka: "Fresh Water Kalck Hoek Five Points Tombs" },
  { id: "little-collect", name: "Little Collect", kind: "pond", until: 1805, coords: [-74.00205, 40.71472] },
  { id: "lispenard", name: "Lispenard Meadows", kind: "marsh", until: 1810, coords: [-74.00813, 40.71963], aka: "Canal Street swamp" },
  { id: "minetta", name: "Minetta Brook", kind: "stream", until: 1825, coords: [-73.99958, 40.72995], aka: "Minetta Water Greenwich Village Washington Square" },
  { id: "stuyvesant-creek", name: "Stuyvesant's Creek", kind: "stream", until: 1830, coords: [-73.98218, 40.7357], aka: "Gramercy" },
  { id: "stuyvesant-meadow", name: "Stuyvesant Meadows", kind: "marsh", until: 1835, coords: [-73.98095, 40.72901], aka: "Tompkins Square Alphabet City" },
  { id: "sunfish", name: "Sunfish Pond", kind: "pond", until: 1839, coords: [-73.9832, 40.7462], aka: "Murray Hill" },
  { id: "harlem-water-3", name: "Harlem Creek", kind: "stream", until: 1880, coords: [-73.94741, 40.79328], aka: "Harlem Mill Creek East Harlem" },
];
