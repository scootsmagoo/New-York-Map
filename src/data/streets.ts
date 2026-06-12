/**
 * Hand-drawn pre-grid roads — the colonial street skeleton. The 1811 grid is
 * generated procedurally in lib/grid.ts; these are the crooked survivors and
 * country roads that predate it. Coordinates are stylized.
 */

export type StreetTier = "major" | "secondary" | "minor";

/** Special linear features that later became ordinary streets. */
export type StreetFeature = "street" | "canal" | "wall";

export interface ColonialStreet {
  id: string;
  name: string;
  pts: [number, number][];
  from: number;
  /** Year the road effectively disappeared (e.g., absorbed by the grid). */
  to?: number;
  /** Label priority — major arteries appear at lower zoom. */
  tier?: StreetTier;
  feature?: StreetFeature;
  /** Year a canal was filled or a wall dismantled (feature styling ends). */
  featureUntil?: number;
  /** Earlier Dutch or colonial names for search & tooltips. */
  historicalNames?: string[];
  /** Extra tokens for search (e.g. "financial district"). */
  searchTerms?: string[];
}

export const colonialStreets: ColonialStreet[] = [
  {
    id: "broadway",
    name: "Broadway",
    from: 1642,
    tier: "major",
    historicalNames: ["Heere Straat", "Wickquasgeck Trail"],
    searchTerms: ["wickquasgeck", "main street"],
    pts: [
      [-74.0135, 40.7045],
      [-74.0092, 40.7113],
      [-74.005, 40.719],
      [-74.0008, 40.7255],
      [-73.996, 40.731],
      [-73.989, 40.7425],
      [-73.9847, 40.75],
      [-73.9818, 40.756],
      [-73.9819, 40.7681],
      [-73.9818, 40.779],
      [-73.976, 40.787],
      [-73.972, 40.794],
      [-73.9665, 40.802],
      [-73.9626, 40.8075],
      [-73.9586, 40.8138],
      [-73.9525, 40.8267],
      [-73.9446, 40.835],
      [-73.9395, 40.8415],
      [-73.932, 40.852],
      [-73.9258, 40.8615],
      [-73.9195, 40.868],
      [-73.9135, 40.874],
    ],
  },
  {
    id: "pearl-street",
    name: "Pearl Street",
    from: 1633,
    tier: "major",
    historicalNames: ["Parel Straat", "Queen Street"],
    pts: [
      [-74.014, 40.7035],
      [-74.01, 40.7028],
      [-74.005, 40.7045],
      [-74.0008, 40.7085],
      [-73.9985, 40.712],
      [-73.9965, 40.7155],
    ],
  },
  {
    id: "wall-street",
    name: "Wall Street",
    from: 1653,
    tier: "major",
    feature: "wall",
    featureUntil: 1699,
    historicalNames: ["De Waal Straat"],
    searchTerms: ["city wall", "stock exchange"],
    pts: [
      [-74.0118, 40.7081],
      [-74.0045, 40.7045],
    ],
  },
  {
    id: "bowery",
    name: "Bowery",
    from: 1651,
    tier: "major",
    historicalNames: ["Bowery Lane", "Bouwerij road"],
    pts: [
      [-73.9985, 40.714],
      [-73.993, 40.7235],
      [-73.9905, 40.729],
      [-73.989, 40.7345],
    ],
  },
  {
    id: "water-street",
    name: "Water Street",
    from: 1658,
    tier: "major",
    historicalNames: ["Waterside"],
    pts: [
      [-74.0078, 40.7032],
      [-74.0042, 40.7055],
      [-74.0012, 40.7092],
      [-73.9982, 40.7132],
      [-73.9962, 40.7168],
    ],
  },
  {
    id: "broad-street",
    name: "Broad Street",
    from: 1646,
    tier: "major",
    feature: "canal",
    featureUntil: 1676,
    historicalNames: ["Heere Gracht", "Broad Canal"],
    pts: [
      [-74.0111, 40.706],
      [-74.0117, 40.7018],
    ],
  },
  {
    id: "canal-street",
    name: "Canal Street",
    from: 1805,
    tier: "major",
    feature: "canal",
    featureUntil: 1819,
    searchTerms: ["collect pond", "lispenard"],
    pts: [
      [-74.0105, 40.7182],
      [-74.002, 40.7192],
      [-73.9935, 40.7202],
      [-73.985, 40.721],
    ],
  },
  {
    id: "greenwich-street",
    name: "Greenwich Street",
    from: 1739,
    tier: "major",
    pts: [
      [-74.0152, 40.7045],
      [-74.0118, 40.715],
      [-74.0095, 40.7245],
      [-74.0078, 40.733],
      [-74.006, 40.739],
    ],
  },
  {
    id: "fulton-street",
    name: "Fulton Street",
    from: 1730,
    tier: "major",
    pts: [
      [-74.0092, 40.7113],
      [-74.0035, 40.7075],
      [-73.998, 40.7055],
    ],
  },
  {
    id: "park-row",
    name: "Park Row",
    from: 1670,
    tier: "major",
    historicalNames: ["Chatham Street"],
    pts: [
      [-74.0078, 40.7115],
      [-74.004, 40.7128],
      [-73.9985, 40.714],
    ],
  },
  {
    id: "front-street",
    name: "Front Street",
    from: 1660,
    tier: "secondary",
    pts: [
      [-74.0098, 40.704],
      [-74.0062, 40.7062],
      [-74.0032, 40.7102],
      [-74.0002, 40.7142],
    ],
  },
  {
    id: "south-street",
    name: "South Street",
    from: 1790,
    tier: "secondary",
    searchTerms: ["seaport", "east river piers"],
    pts: [
      [-74.0065, 40.7028],
      [-74.0025, 40.7058],
      [-73.9995, 40.7098],
      [-73.9968, 40.7138],
    ],
  },
  {
    id: "beaver-street",
    name: "Beaver Street",
    from: 1670,
    tier: "secondary",
    pts: [
      [-74.0115, 40.7055],
      [-74.0062, 40.7058],
    ],
  },
  {
    id: "stone-street",
    name: "Stone Street",
    from: 1658,
    tier: "secondary",
    historicalNames: ["Brewers Street", "Hoogh Straat"],
    pts: [
      [-74.0105, 40.7048],
      [-74.0072, 40.7051],
    ],
  },
  {
    id: "nassau-street",
    name: "Nassau Street",
    from: 1697,
    tier: "secondary",
    pts: [
      [-74.0088, 40.7112],
      [-74.0092, 40.7075],
      [-74.0098, 40.7042],
    ],
  },
  {
    id: "william-street",
    name: "William Street",
    from: 1697,
    tier: "secondary",
    pts: [
      [-74.0068, 40.711],
      [-74.0072, 40.7072],
      [-74.0078, 40.704],
    ],
  },
  {
    id: "john-street",
    name: "John Street",
    from: 1728,
    tier: "secondary",
    pts: [
      [-74.0095, 40.7085],
      [-74.0045, 40.7088],
    ],
  },
  {
    id: "maiden-lane",
    name: "Maiden Lane",
    from: 1696,
    tier: "secondary",
    pts: [
      [-74.0108, 40.709],
      [-74.004, 40.7065],
    ],
  },
  {
    id: "cherry-street",
    name: "Cherry Street",
    from: 1736,
    tier: "secondary",
    pts: [
      [-74.0, 40.7095],
      [-73.993, 40.7125],
      [-73.988, 40.7155],
    ],
  },
  {
    id: "church-street",
    name: "Church Street",
    from: 1766,
    tier: "secondary",
    pts: [
      [-74.0098, 40.7155],
      [-74.0085, 40.7105],
      [-74.0075, 40.7065],
    ],
  },
  {
    id: "division-street",
    name: "Division Street",
    from: 1685,
    tier: "secondary",
    pts: [
      [-73.9925, 40.7148],
      [-73.9875, 40.7152],
    ],
  },
  {
    id: "rector-street",
    name: "Rector Street",
    from: 1788,
    tier: "secondary",
    pts: [
      [-74.0135, 40.7082],
      [-74.0065, 40.7085],
    ],
  },
  {
    id: "trinity-place",
    name: "Trinity Place",
    from: 1789,
    tier: "secondary",
    pts: [
      [-74.0128, 40.7095],
      [-74.0115, 40.7055],
    ],
  },
  {
    id: "cedar-street",
    name: "Cedar Street",
    from: 1721,
    tier: "secondary",
    pts: [
      [-74.0112, 40.7072],
      [-74.0055, 40.7075],
    ],
  },
  {
    id: "liberty-street",
    name: "Liberty Street",
    from: 1797,
    tier: "secondary",
    pts: [
      [-74.0108, 40.7088],
      [-74.0048, 40.7092],
    ],
  },
  {
    id: "thames-street",
    name: "Thames Street",
    from: 1760,
    tier: "secondary",
    pts: [
      [-74.0125, 40.7065],
      [-74.0085, 40.7068],
    ],
  },
  {
    id: "whitehall-street",
    name: "Whitehall Street",
    from: 1640,
    tier: "minor",
    historicalNames: ["Het Marckvelt"],
    pts: [
      [-74.0135, 40.7038],
      [-74.0122, 40.7055],
    ],
  },
  {
    id: "bridge-street",
    name: "Bridge Street",
    from: 1640,
    tier: "minor",
    pts: [
      [-74.0125, 40.7042],
      [-74.0115, 40.7058],
    ],
  },
  {
    id: "state-street",
    name: "State Street",
    from: 1790,
    tier: "minor",
    searchTerms: ["battery", "custom house"],
    pts: [
      [-74.0145, 40.7032],
      [-74.0125, 40.7042],
    ],
  },
  {
    id: "exchange-place",
    name: "Exchange Place",
    from: 1790,
    tier: "minor",
    pts: [
      [-74.0108, 40.7068],
      [-74.0085, 40.707],
    ],
  },
  {
    id: "marketfield-street",
    name: "Marketfield Street",
    from: 1690,
    tier: "minor",
    pts: [
      [-74.0138, 40.7058],
      [-74.0125, 40.7068],
    ],
  },
  {
    id: "hanover-street",
    name: "Hanover Street",
    from: 1710,
    tier: "minor",
    pts: [
      [-74.0095, 40.7055],
      [-74.0088, 40.7078],
    ],
  },
  {
    id: "market-street",
    name: "Market Street",
    from: 1735,
    tier: "minor",
    pts: [
      [-74.0082, 40.7098],
      [-74.0055, 40.7102],
    ],
  },
  {
    id: "catherine-street",
    name: "Catherine Street",
    from: 1785,
    tier: "minor",
    pts: [
      [-73.9955, 40.7135],
      [-73.9915, 40.7138],
    ],
  },
  {
    id: "oliver-street",
    name: "Oliver Street",
    from: 1775,
    tier: "minor",
    pts: [
      [-73.9945, 40.7125],
      [-73.9905, 40.7128],
    ],
  },
  {
    id: "roosevelt-street",
    name: "Roosevelt Street",
    from: 1789,
    to: 1919,
    tier: "minor",
    pts: [
      [-74.0035, 40.7078],
      [-73.9985, 40.7082],
    ],
  },
  {
    id: "coenties-slip",
    name: "Coenties Slip",
    from: 1690,
    tier: "minor",
    pts: [
      [-74.0118, 40.7045],
      [-74.0105, 40.7062],
    ],
  },
  {
    id: "christopher-street",
    name: "Christopher Street",
    from: 1799,
    tier: "secondary",
    pts: [
      [-74.0105, 40.7332],
      [-74.0, 40.7338],
    ],
  },
  {
    id: "boston-post-road",
    name: "Boston Post Road",
    from: 1672,
    to: 1865,
    tier: "major",
    pts: [
      [-73.989, 40.7345],
      [-73.9835, 40.744],
      [-73.976, 40.753],
      [-73.971, 40.7615],
      [-73.965, 40.769],
      [-73.957, 40.78],
      [-73.952, 40.79],
      [-73.9505, 40.7965],
      [-73.943, 40.8035],
      [-73.939, 40.8085],
    ],
  },
  {
    id: "kingsbridge-road",
    name: "Kingsbridge Road",
    from: 1693,
    tier: "secondary",
    pts: [
      [-73.939, 40.8085],
      [-73.933, 40.823],
      [-73.9282, 40.835],
      [-73.922, 40.852],
      [-73.918, 40.864],
      [-73.9135, 40.874],
    ],
  },
  {
    id: "brooklyn-ferry-road",
    name: "Fulton Street (Brooklyn)",
    from: 1704,
    tier: "major",
    historicalNames: ["Ferry Road", "Brooklyn Ferry Road"],
    searchTerms: ["brooklyn fulton"],
    pts: [
      [-73.9962, 40.7036],
      [-73.9895, 40.6925],
      [-73.983, 40.688],
      [-73.975, 40.683],
      [-73.965, 40.681],
      [-73.955, 40.679],
      [-73.945, 40.678],
      [-73.93, 40.6775],
      [-73.915, 40.678],
      [-73.9, 40.681],
      [-73.887, 40.687],
    ],
  },
  {
    id: "flatbush-road",
    name: "Flatbush Road",
    from: 1652,
    tier: "secondary",
    pts: [
      [-73.9895, 40.6925],
      [-73.983, 40.68],
      [-73.976, 40.67],
      [-73.97, 40.662],
      [-73.964, 40.653],
      [-73.9615, 40.6495],
    ],
  },
  {
    id: "jamaica-road",
    name: "Jamaica Road",
    from: 1704,
    tier: "secondary",
    pts: [
      [-73.887, 40.687],
      [-73.86, 40.695],
      [-73.83, 40.7],
      [-73.805, 40.702],
    ],
  },
  {
    id: "richmond-road",
    name: "Richmond Road",
    from: 1700,
    tier: "secondary",
    pts: [
      [-74.076, 40.642],
      [-74.087, 40.628],
      [-74.101, 40.613],
      [-74.118, 40.598],
      [-74.145, 40.58],
    ],
  },
];

export function streetTier(street: ColonialStreet): StreetTier {
  return street.tier ?? "secondary";
}

export function streetMidpoint(street: ColonialStreet): [number, number] {
  const pts = street.pts;
  const mid = Math.floor(pts.length / 2);
  if (pts.length === 1) return pts[0];
  if (pts.length % 2 === 1) return pts[mid];
  const a = pts[mid - 1];
  const b = pts[mid];
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

export function streetActive(street: ColonialStreet, year: number): boolean {
  return year >= street.from && (street.to === undefined || year <= street.to);
}

export function streetFeatureActive(
  street: ColonialStreet,
  year: number
): boolean {
  if (!street.feature || street.feature === "street") return false;
  const until = street.featureUntil ?? Infinity;
  return streetActive(street, year) && year < until;
}

export function streetTooltip(street: ColonialStreet, year: number): string {
  const parts = [street.name];
  if (street.historicalNames?.length) {
    parts.push(`formerly ${street.historicalNames.join(", ")}`);
  }
  if (street.feature === "wall" && streetFeatureActive(street, year)) {
    parts.push("city wall");
  }
  if (street.feature === "canal" && streetFeatureActive(street, year)) {
    parts.push("canal");
  }
  return parts.join(" · ");
}
