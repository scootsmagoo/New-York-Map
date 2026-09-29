import type { Park } from "../types";
import outerParks from "./geo/outerParks.json";
import { unpackRing } from "../lib/geoPack";

type Ring = [number, number][];

/** Octagonal blob for the rounder parks; counterclockwise like all rings. */
function blob(cx: number, cy: number, rx: number, ry = rx * 0.8): Ring {
  const k = 0.7071;
  return [
    [cx + rx, cy],
    [cx + rx * k, cy + ry * k],
    [cx, cy + ry],
    [cx - rx * k, cy + ry * k],
    [cx - rx, cy],
    [cx - rx * k, cy - ry * k],
    [cx, cy - ry],
    [cx + rx * k, cy - ry * k],
  ];
}

/** Central Park's ring is shared with the grid layer (it punches the hole). */
export const CENTRAL_PARK_RING: Ring = [
  [-73.9812, 40.7682],
  [-73.9731, 40.7644],
  [-73.9496, 40.7968],
  [-73.958, 40.8003],
];

/** Hand-drawn: Manhattan's parks, and Green-Wood. */
const handParks: Park[] = [
  {
    id: "central-park",
    name: "Central Park",
    ring: CENTRAL_PARK_RING,
    from: 1857,
    completed: 1873,
  },
  {
    id: "city-hall-park",
    name: "City Hall Park",
    ring: [
      [-74.0093, 40.7122],
      [-74.0042, 40.7115],
      [-74.0028, 40.714],
      [-74.007, 40.7155],
    ],
    from: 1730,
  },
  {
    id: "bowling-green",
    name: "Bowling Green",
    ring: [
      [-74.014, 40.7043],
      [-74.0128, 40.7043],
      [-74.0128, 40.7053],
      [-74.014, 40.7053],
    ],
    from: 1733,
  },
  {
    id: "battery",
    name: "The Battery",
    ring: [
      [-74.0175, 40.703],
      [-74.0157, 40.7003],
      [-74.013, 40.701],
      [-74.014, 40.704],
    ],
    from: 1790,
  },
  {
    id: "washington-square",
    name: "Washington Square",
    ring: [
      [-74.0005, 40.7298],
      [-73.9958, 40.7298],
      [-73.9958, 40.732],
      [-74.0005, 40.732],
    ],
    from: 1827,
  },
  {
    id: "tompkins-square",
    name: "Tompkins Square",
    ring: [
      [-73.984, 40.7248],
      [-73.9795, 40.7248],
      [-73.9795, 40.7282],
      [-73.984, 40.7282],
    ],
    from: 1834,
  },
  {
    id: "union-square",
    name: "Union Square",
    ring: [
      [-73.9925, 40.7345],
      [-73.9885, 40.7345],
      [-73.9885, 40.7375],
      [-73.9925, 40.7375],
    ],
    from: 1839,
  },
  {
    id: "madison-square",
    name: "Madison Square",
    ring: [
      [-73.989, 40.7405],
      [-73.9855, 40.7405],
      [-73.9855, 40.7442],
      [-73.989, 40.7442],
    ],
    from: 1847,
  },
  {
    id: "bryant-park",
    name: "Reservoir Square",
    ring: [
      [-73.9855, 40.7528],
      [-73.9832, 40.7528],
      [-73.9832, 40.7545],
      [-73.9855, 40.7545],
    ],
    from: 1847,
  },
  {
    id: "mount-morris",
    name: "Mount Morris Square",
    ring: [
      [-73.946, 40.803],
      [-73.9425, 40.803],
      [-73.9425, 40.806],
      [-73.946, 40.806],
    ],
    from: 1840,
  },
  {
    id: "green-wood",
    name: "Green-Wood Cemetery",
    ring: blob(-73.9933, 40.6526, 0.0062, 0.0048),
    from: 1838,
  },
  {
    id: "riverside-park",
    name: "Riverside Park",
    ring: [
      [-73.9875, 40.78],
      [-73.9845, 40.7812],
      [-73.9618, 40.8175],
      [-73.9648, 40.8188],
    ],
    from: 1875,
    completed: 1910,
  },
];

/**
 * The other boroughs' parks, with real outlines from NYC Parks' property
 * records (scripts/prepare-parks.mjs), dated by acquisition.
 */
const packedParks = outerParks as unknown as {
  q: number;
  parks: { id: string; name: string; from: number; completed?: number; rings: number[][] }[];
};
const recordedParks: Park[] = packedParks.parks.map(({ rings, ...p }) => {
  const unpacked = rings.map((flat) => unpackRing(flat, packedParks.q));
  return { ...p, ring: unpacked[0], extraRings: unpacked.slice(1) };
});

export const parks: Park[] = [...handParks, ...recordedParks];
