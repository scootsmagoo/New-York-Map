import type { FootprintSnapshot } from "../types";

type Ring = [number, number][];

/**
 * Octagonal blob centered on a point — building block for village/neighborhood
 * footprints. rx/ry in degrees (~0.012 lon ≈ 1 km at this latitude).
 */
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

/**
 * Manhattan "built up to here" band. The island tilts northeast, so a given
 * street sits at a higher latitude on the west side; `latW`/`latE` are the
 * northern limit at the Hudson and East River respectively. Rendered shapes
 * are clipped to Manhattan's actual shoreline, so bands are drawn generously
 * wide.
 */
function manhattanBelow(latW: number, latE: number): Ring {
  return [
    [-74.05, 40.69],
    [-73.9, 40.69],
    [-73.9, latE],
    [-74.013, latW],
    [-74.05, latW],
  ];
}

// Everything below is cumulative: each snapshot describes the FULL built
// extent at that date, so consecutive snapshots can simply be cross-faded.

const snapshots: FootprintSnapshot[] = [
  { year: 1609, manhattan: [], other: [] },

  {
    year: 1628,
    manhattan: [manhattanBelow(40.7045, 40.7035)],
    other: [],
  },

  {
    year: 1660,
    manhattan: [manhattanBelow(40.7085, 40.7068)], // town below the Wall
    other: [
      blob(-73.9905, 40.6952, 0.005), // Breuckelen
      blob(-73.939, 40.8085, 0.004), // Nieuw Haarlem
      blob(-73.961, 40.6505, 0.0035), // Midwout (Flatbush)
      blob(-73.935, 40.6215, 0.0035), // Nieuw Amersfoort (Flatlands)
      blob(-73.9735, 40.5955, 0.0035), // Gravesend
      blob(-74.117, 40.6285, 0.003), // Oude Dorp, Staten Island
    ],
  },

  {
    year: 1700,
    manhattan: [manhattanBelow(40.7135, 40.7105)],
    other: [
      blob(-73.9905, 40.6952, 0.0055),
      blob(-73.939, 40.8085, 0.0045),
      blob(-73.961, 40.6505, 0.004),
      blob(-73.935, 40.6215, 0.004),
      blob(-73.9735, 40.5955, 0.004),
      blob(-74.117, 40.6285, 0.0035),
      blob(-73.83, 40.7635, 0.004), // Vlissingen (Flushing)
      blob(-73.8, 40.702, 0.004), // Jamaica
    ],
  },

  {
    year: 1740,
    manhattan: [manhattanBelow(40.7185, 40.7135)],
    other: [
      blob(-73.9905, 40.6952, 0.006),
      blob(-73.939, 40.8085, 0.005),
      blob(-73.961, 40.6505, 0.0045),
      blob(-73.935, 40.6215, 0.0045),
      blob(-73.9735, 40.5955, 0.0045),
      blob(-74.117, 40.6285, 0.004),
      blob(-73.83, 40.7635, 0.0045),
      blob(-73.8, 40.702, 0.0045),
      blob(-73.9, 40.875, 0.0035), // Kingsbridge
    ],
  },

  {
    year: 1776,
    manhattan: [
      manhattanBelow(40.722, 40.716),
      [
        // ribbon of building up the Bowery road
        [-73.999, 40.714],
        [-73.989, 40.714],
        [-73.989, 40.7245],
        [-73.999, 40.7245],
      ],
    ],
    other: [
      blob(-73.9925, 40.696, 0.0075), // Brooklyn ferry town
      blob(-73.939, 40.8085, 0.005),
      blob(-73.961, 40.6505, 0.0045),
      blob(-73.935, 40.6215, 0.0045),
      blob(-73.9735, 40.5955, 0.0045),
      blob(-74.117, 40.6285, 0.004),
      blob(-74.0755, 40.641, 0.004), // SI ferry landing
      blob(-73.83, 40.7635, 0.0045),
      blob(-73.8, 40.702, 0.0045),
      blob(-73.9, 40.875, 0.0035),
    ],
  },

  {
    year: 1800,
    manhattan: [
      manhattanBelow(40.7265, 40.7205),
      blob(-74.0035, 40.7335, 0.005, 0.0035), // Greenwich Village
    ],
    other: [
      blob(-73.9925, 40.6965, 0.009),
      blob(-73.9715, 40.7005, 0.004), // Navy Yard fringe
      blob(-73.939, 40.8085, 0.005),
      blob(-73.961, 40.6505, 0.005),
      blob(-73.935, 40.6215, 0.005),
      blob(-73.9735, 40.5955, 0.005),
      blob(-74.117, 40.6285, 0.0045),
      blob(-74.0755, 40.641, 0.0045),
      blob(-73.83, 40.7635, 0.005),
      blob(-73.8, 40.702, 0.005),
      blob(-73.9, 40.875, 0.004),
    ],
  },

  {
    year: 1820,
    manhattan: [
      manhattanBelow(40.7325, 40.7235),
      blob(-74.0035, 40.7345, 0.0075, 0.005),
    ],
    other: [
      blob(-73.9925, 40.697, 0.011),
      blob(-73.9715, 40.7005, 0.005),
      blob(-73.9585, 40.7135, 0.0045), // Williamsburgh
      blob(-73.939, 40.8085, 0.0055),
      blob(-73.961, 40.6505, 0.005),
      blob(-73.935, 40.6215, 0.005),
      blob(-73.9735, 40.5955, 0.005),
      blob(-74.117, 40.6285, 0.005),
      blob(-74.0755, 40.6395, 0.0055),
      blob(-73.83, 40.7635, 0.005),
      blob(-73.8, 40.702, 0.005),
      blob(-73.9, 40.875, 0.004),
    ],
  },

  {
    year: 1840,
    manhattan: [manhattanBelow(40.7415, 40.7285)], // to ~14th Street
    other: [
      [
        // downtown Brooklyn from the Heights toward Fort Greene
        [-74.005, 40.688],
        [-73.984, 40.688],
        [-73.9725, 40.694],
        [-73.9735, 40.7035],
        [-73.9985, 40.7045],
      ],
      blob(-73.9585, 40.7135, 0.0085), // Williamsburgh city
      blob(-73.9265, 40.772, 0.0045), // Astoria
      blob(-73.939, 40.8085, 0.006),
      blob(-73.9055, 40.8265, 0.0035), // Morrisania begins
      blob(-73.961, 40.6505, 0.0055),
      blob(-73.935, 40.6215, 0.005),
      blob(-73.9735, 40.5955, 0.005),
      blob(-74.117, 40.6325, 0.0065),
      blob(-74.0775, 40.637, 0.0075), // Tompkinsville–Stapleton
      blob(-73.83, 40.7635, 0.0055),
      blob(-73.8, 40.702, 0.0055),
      blob(-73.9, 40.875, 0.004),
    ],
  },

  {
    year: 1860,
    manhattan: [
      manhattanBelow(40.7625, 40.746), // to ~42nd Street
      blob(-73.947, 40.7775, 0.005), // Yorkville
      blob(-73.9565, 40.8165, 0.0045), // Manhattanville
      blob(-73.9385, 40.8065, 0.0065), // Harlem village
    ],
    other: [
      [
        // Brooklyn: Heights/Red Hook around to Williamsburg & Greenpoint
        [-74.02, 40.665],
        [-74.003, 40.6605],
        [-73.9835, 40.6565],
        [-73.9655, 40.6655],
        [-73.9475, 40.674],
        [-73.9345, 40.684],
        [-73.9295, 40.696],
        [-73.9365, 40.711],
        [-73.9445, 40.7295],
        [-73.9565, 40.7385],
        [-73.9685, 40.7295],
        [-73.9745, 40.7115],
        [-73.9985, 40.7065],
        [-74.0185, 40.685],
      ],
      blob(-73.9165, 40.6975, 0.0075), // Bushwick
      blob(-73.945, 40.7455, 0.0065), // Hunters Point / LIC
      blob(-73.9245, 40.772, 0.0065),
      blob(-73.9245, 40.8085, 0.0065), // Mott Haven
      blob(-73.9055, 40.8265, 0.0065),
      blob(-73.8795, 40.8415, 0.0045), // West Farms
      blob(-73.9615, 40.6495, 0.006),
      blob(-73.935, 40.6215, 0.0055),
      blob(-73.9735, 40.5955, 0.0055),
      blob(-74.0975, 40.6405, 0.0075), // New Brighton–St George
      blob(-74.0775, 40.6265, 0.0065),
      blob(-74.1345, 40.6345, 0.0055), // Port Richmond
      blob(-73.83, 40.7635, 0.0065),
      blob(-73.8, 40.7025, 0.0065),
      blob(-73.9, 40.8765, 0.0045),
    ],
  },

  {
    year: 1880,
    manhattan: [
      manhattanBelow(40.7855, 40.7705), // to ~86th/79th, els pushing north
      blob(-73.9395, 40.8085, 0.011, 0.007), // Harlem filling in
      blob(-73.9525, 40.819, 0.006),
    ],
    other: [
      [
        // Brooklyn pushes inland: Bed-Stuy, Crown Heights, Park Slope
        [-74.0235, 40.666],
        [-74.005, 40.6565],
        [-73.985, 40.649],
        [-73.9625, 40.6525],
        [-73.9415, 40.6595],
        [-73.9215, 40.6675],
        [-73.9105, 40.679],
        [-73.9065, 40.6935],
        [-73.9165, 40.706],
        [-73.9365, 40.7125],
        [-73.9445, 40.7305],
        [-73.9575, 40.739],
        [-73.97, 40.73],
        [-73.9755, 40.7115],
        [-73.999, 40.7065],
        [-74.0195, 40.6855],
      ],
      blob(-73.8825, 40.6745, 0.006), // East New York
      blob(-73.9575, 40.6485, 0.0065), // Flatbush
      blob(-74.0265, 40.6335, 0.0055), // Bay Ridge
      blob(-73.9965, 40.577, 0.009, 0.005), // Coney Island resorts
      [
        // South Bronx mass
        [-73.934, 40.7965],
        [-73.9135, 40.7925],
        [-73.8915, 40.7985],
        [-73.8825, 40.8165],
        [-73.8925, 40.8375],
        [-73.9125, 40.8435],
        [-73.9305, 40.8335],
      ],
      blob(-73.8975, 40.861, 0.0055), // Fordham
      blob(-73.84, 40.8395, 0.005), // Westchester village
      blob(-73.9405, 40.7505, 0.0105, 0.0075), // LIC consolidated
      blob(-73.9225, 40.7725, 0.008),
      blob(-73.906, 40.7005, 0.0065), // Ridgewood
      blob(-73.8455, 40.786, 0.0045), // College Point
      blob(-73.83, 40.7635, 0.008),
      blob(-73.7995, 40.7035, 0.008),
      blob(-73.9615, 40.6495, 0.0065),
      blob(-73.935, 40.6215, 0.006),
      blob(-74.0975, 40.6405, 0.0095),
      blob(-74.0775, 40.6245, 0.0075),
      blob(-74.1345, 40.6345, 0.0065),
      blob(-74.115, 40.6375, 0.0065),
      blob(-73.9, 40.8765, 0.005),
    ],
  },

  {
    year: 1898,
    manhattan: [
      manhattanBelow(40.8225, 40.8045), // solid to ~125th
      blob(-73.9405, 40.8425, 0.0115, 0.009), // Washington Heights spotty
      blob(-73.9255, 40.8675, 0.0075), // Inwood fringe
    ],
    other: [
      [
        // Brooklyn: the great ring of row-house wards
        [-74.0315, 40.6485],
        [-74.0125, 40.6375],
        [-73.9855, 40.6305],
        [-73.9585, 40.6345],
        [-73.9345, 40.6415],
        [-73.9085, 40.6505],
        [-73.8845, 40.659],
        [-73.8705, 40.6745],
        [-73.8755, 40.694],
        [-73.8985, 40.7065],
        [-73.9215, 40.7115],
        [-73.9385, 40.7185],
        [-73.9455, 40.7315],
        [-73.9585, 40.7395],
        [-73.9705, 40.7305],
        [-73.9765, 40.7115],
        [-74.0005, 40.7065],
        [-74.0215, 40.6865],
      ],
      blob(-73.9575, 40.645, 0.0105, 0.008), // Flatbush
      blob(-73.9965, 40.5765, 0.0125, 0.006), // Coney
      blob(-74.0035, 40.6065, 0.0075), // Bensonhurst/New Utrecht
      [
        // Bronx below Tremont plus the central corridor
        [-73.9345, 40.7925],
        [-73.9075, 40.7875],
        [-73.8795, 40.7925],
        [-73.8585, 40.8085],
        [-73.8625, 40.8325],
        [-73.8825, 40.8525],
        [-73.9035, 40.8665],
        [-73.9255, 40.8625],
        [-73.9345, 40.8385],
      ],
      blob(-73.8665, 40.8895, 0.0065), // Williamsbridge
      blob(-73.8405, 40.8395, 0.0065),
      [
        // LIC–Astoria mass
        [-73.9585, 40.7375],
        [-73.9365, 40.7335],
        [-73.9185, 40.7445],
        [-73.9105, 40.7625],
        [-73.9205, 40.7795],
        [-73.9425, 40.7815],
        [-73.9565, 40.7625],
      ],
      blob(-73.906, 40.7025, 0.009), // Ridgewood–Glendale
      blob(-73.8775, 40.7375, 0.0065), // Newtown/Elmhurst
      blob(-73.8625, 40.7495, 0.0055), // Corona
      blob(-73.8295, 40.7645, 0.0105, 0.0075),
      blob(-73.7975, 40.7045, 0.0105, 0.0075),
      blob(-73.8455, 40.786, 0.0055),
      blob(-73.7565, 40.6045, 0.0075, 0.005), // Far Rockaway
      blob(-74.0915, 40.6395, 0.0115, 0.0085), // SI north shore
      blob(-74.0775, 40.6205, 0.0085),
      blob(-74.1345, 40.6345, 0.0085),
      blob(-74.1685, 40.6395, 0.0065), // Mariners Harbor
      blob(-74.2465, 40.5125, 0.0055), // Tottenville
    ],
  },

  {
    year: 1919,
    manhattan: [manhattanBelow(40.879, 40.875)], // the whole island
    other: [
      [
        // Brooklyn nearly full
        [-74.042, 40.6285],
        [-74.0205, 40.6085],
        [-73.9985, 40.5945],
        [-73.9715, 40.5865],
        [-73.9445, 40.5845],
        [-73.9165, 40.6125],
        [-73.8925, 40.6305],
        [-73.8645, 40.6505],
        [-73.8565, 40.6755],
        [-73.8705, 40.6975],
        [-73.8985, 40.7085],
        [-73.9255, 40.7145],
        [-73.9405, 40.7225],
        [-73.9485, 40.7345],
        [-73.9605, 40.7405],
        [-73.9725, 40.7305],
        [-73.9785, 40.7115],
        [-74.0025, 40.7065],
        [-74.0245, 40.6855],
        [-74.0405, 40.652],
      ],
      blob(-73.9965, 40.5765, 0.0145, 0.0065),
      [
        // Bronx solid to Fordham, corridors to the city line
        [-73.9355, 40.7905],
        [-73.9035, 40.785],
        [-73.8705, 40.7895],
        [-73.8455, 40.8045],
        [-73.8345, 40.8265],
        [-73.8445, 40.855],
        [-73.8585, 40.8765],
        [-73.8785, 40.8985],
        [-73.9055, 40.9035],
        [-73.9255, 40.8905],
        [-73.9325, 40.8625],
        [-73.9365, 40.8325],
      ],
      [
        // Queens: the subway-and-el corridor through Sunnyside to Corona
        [-73.9585, 40.7355],
        [-73.9285, 40.7295],
        [-73.8985, 40.7335],
        [-73.8625, 40.7395],
        [-73.8465, 40.7485],
        [-73.8565, 40.7665],
        [-73.8885, 40.7665],
        [-73.9105, 40.7745],
        [-73.9205, 40.7865],
        [-73.9425, 40.7865],
        [-73.9605, 40.7665],
      ],
      [
        // Ridgewood through Richmond Hill to Jamaica
        [-73.9185, 40.6945],
        [-73.8925, 40.6885],
        [-73.8625, 40.6855],
        [-73.8305, 40.6855],
        [-73.7905, 40.6905],
        [-73.7625, 40.6945],
        [-73.7585, 40.7165],
        [-73.7905, 40.7245],
        [-73.8345, 40.7185],
        [-73.8705, 40.7145],
        [-73.9105, 40.7145],
      ],
      blob(-73.8295, 40.7655, 0.0135, 0.0095),
      blob(-73.8455, 40.7875, 0.0075),
      blob(-73.7705, 40.7475, 0.0065), // Bayside fringe
      [
        // Rockaway peninsula strip
        [-73.9395, 40.5505],
        [-73.8625, 40.5705],
        [-73.7705, 40.5905],
        [-73.7405, 40.5985],
        [-73.7405, 40.6165],
        [-73.7905, 40.6105],
        [-73.8705, 40.5905],
        [-73.9345, 40.5705],
      ],
      [
        // Staten Island north shore band
        [-74.2065, 40.6315],
        [-74.1565, 40.6225],
        [-74.1145, 40.6185],
        [-74.0765, 40.6075],
        [-74.0625, 40.6125],
        [-74.0705, 40.6385],
        [-74.1145, 40.6485],
        [-74.1685, 40.6525],
        [-74.2065, 40.6485],
      ],
      blob(-74.0765, 40.5945, 0.0085, 0.0065), // South/Midland Beach
      blob(-74.2465, 40.5125, 0.0065),
    ],
  },
];

export const footprints = snapshots;

/**
 * Returns the two snapshots bracketing `year` plus the interpolation progress
 * between them (0 = entirely the earlier one, 1 = entirely the later one).
 */
export function footprintAt(year: number): {
  base: FootprintSnapshot;
  next: FootprintSnapshot | null;
  progress: number;
} {
  if (year <= footprints[0].year) {
    return { base: footprints[0], next: null, progress: 0 };
  }
  for (let i = footprints.length - 1; i >= 0; i--) {
    if (year >= footprints[i].year) {
      const base = footprints[i];
      const next = footprints[i + 1] ?? null;
      const progress = next ? (year - base.year) / (next.year - base.year) : 0;
      return { base, next, progress };
    }
  }
  return { base: footprints[0], next: null, progress: 0 };
}
