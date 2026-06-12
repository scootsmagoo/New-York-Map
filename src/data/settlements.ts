import type { PopScope, SegmentKey } from "./population";

/**
 * Approximate immigrant & community enclaves — centers and rough extents,
 * not ward boundaries. Informed by *Gotham* and standard neighborhood histories.
 */
export interface Settlement {
  id: string;
  name: string;
  primaryGroup: SegmentKey;
  groups: SegmentKey[];
  coords: [number, number];
  /** Rough radius in degrees (~0.004 ≈ 440 m at this latitude). */
  radiusDeg: number;
  from: number;
  to?: number;
  /** Visible only when population scope is Greater NY (1898+). */
  greaterNYOnly?: boolean;
  note: string;
}

export const SETTLEMENTS: Settlement[] = [
  {
    id: "collect",
    name: "Collect Pond & Five Points",
    primaryGroup: "irish",
    groups: ["irish", "free_black", "german"],
    coords: [-74.0018, 40.7135],
    radiusDeg: 0.005,
    from: 1830,
    to: 1875,
    note: "America's most notorious slum — Irish, African American, and German poor in overlapping wards.",
  },
  {
    id: "kleindeutschland",
    name: "Kleindeutschland",
    primaryGroup: "german",
    groups: ["german"],
    coords: [-73.982, 40.726],
    radiusDeg: 0.006,
    from: 1845,
    to: 1904,
    note: "Little Germany on the Lower East Side — largest German-speaking city outside Europe until the General Slocum disaster.",
  },
  {
    id: "yorkville",
    name: "Yorkville",
    primaryGroup: "german",
    groups: ["german"],
    coords: [-73.946, 40.776],
    radiusDeg: 0.005,
    from: 1870,
    note: "Upper East Side German breweries, beer gardens, and Lutheran churches.",
  },
  {
    id: "chinatown",
    name: "Chinatown",
    primaryGroup: "chinese",
    groups: ["chinese"],
    coords: [-73.9982, 40.7153],
    radiusDeg: 0.0035,
    from: 1875,
    note: "Mott, Pell, and Doyers Streets — the first large Chinese settlement on the East Coast.",
  },
  {
    id: "jewish-les",
    name: "Lower East Side (Jewish)",
    primaryGroup: "jewish",
    groups: ["jewish", "polish"],
    coords: [-73.987, 40.716],
    radiusDeg: 0.006,
    from: 1880,
    note: "Orchard, Rivington, and Hester Streets — the largest Jewish city in the world by 1910.",
  },
  {
    id: "mulberry",
    name: "Mulberry Bend / Little Italy",
    primaryGroup: "italian",
    groups: ["italian"],
    coords: [-73.997, 40.718],
    radiusDeg: 0.004,
    from: 1880,
    note: "Southern Italian tenements around Mulberry Street and the Bend.",
  },
  {
    id: "east-harlem-italian",
    name: "Italian East Harlem",
    primaryGroup: "italian",
    groups: ["italian"],
    coords: [-73.942, 40.795],
    radiusDeg: 0.005,
    from: 1890,
    note: "Pleasant Avenue and East 115th Street — 'Dago Harlem.'",
  },
  {
    id: "bowery",
    name: "Bowery lodging district",
    primaryGroup: "irish",
    groups: ["irish", "german", "chinese"],
    coords: [-73.994, 40.720],
    radiusDeg: 0.004,
    from: 1850,
    to: 1890,
    note: "Cheap lodging houses and saloons along the Bowery.",
  },
  {
    id: "african-burial",
    name: "African Burial Ground",
    primaryGroup: "free_black",
    groups: ["free_black", "enslaved"],
    coords: [-74.005, 40.7145],
    radiusDeg: 0.003,
    from: 1712,
    to: 1795,
    note: "Colonial-era burial ground for free and enslaved Africans outside the city wall.",
  },
  {
    id: "san-juan-hill",
    name: "San Juan Hill",
    primaryGroup: "free_black",
    groups: ["free_black"],
    coords: [-73.988, 40.768],
    radiusDeg: 0.004,
    from: 1890,
    to: 1940,
    note: "African American neighborhood west of Columbus Circle, later cleared for Lincoln Center.",
  },
  {
    id: "harlem-black",
    name: "Harlem",
    primaryGroup: "free_black",
    groups: ["free_black"],
    coords: [-73.945, 40.81],
    radiusDeg: 0.007,
    from: 1910,
    note: "Early stages of the Great Migration — Black New Yorkers moving uptown.",
  },
  {
    id: "vinegar-hill",
    name: "Irishtown (Vinegar Hill)",
    primaryGroup: "irish",
    groups: ["irish"],
    coords: [-73.982, 40.702],
    radiusDeg: 0.004,
    from: 1825,
    greaterNYOnly: true,
    note: "Brooklyn waterfront Irish enclave near the Navy Yard.",
  },
  {
    id: "williamsburg",
    name: "Williamsburg",
    primaryGroup: "german",
    groups: ["german", "jewish", "polish"],
    coords: [-73.958, 40.708],
    radiusDeg: 0.006,
    from: 1860,
    greaterNYOnly: true,
    note: "German, then Jewish and Polish Brooklyn — breweries and sweatshops.",
  },
  {
    id: "greenpoint",
    name: "Polish Greenpoint",
    primaryGroup: "polish",
    groups: ["polish"],
    coords: [-73.947, 40.73],
    radiusDeg: 0.005,
    from: 1890,
    greaterNYOnly: true,
    note: "Brooklyn's 'Little Poland' along Manhattan Avenue.",
  },
  {
    id: "brownsville",
    name: "Brownsville",
    primaryGroup: "jewish",
    groups: ["jewish"],
    coords: [-73.906, 40.665],
    radiusDeg: 0.005,
    from: 1895,
    greaterNYOnly: true,
    note: "Eastern European Jewish workers in Brooklyn's eastern wards.",
  },
  {
    id: "corlears-hook",
    name: "Corlears Hook",
    primaryGroup: "irish",
    groups: ["irish", "british_other"],
    coords: [-73.978, 40.712],
    radiusDeg: 0.0035,
    from: 1820,
    to: 1865,
    note: "Seamen and Irish immigrants on the East River docks — slang 'hooker' may originate here.",
  },
  {
    id: "astoria-german",
    name: "Astoria (German)",
    primaryGroup: "german",
    groups: ["german"],
    coords: [-73.926, 40.768],
    radiusDeg: 0.005,
    from: 1898,
    greaterNYOnly: true,
    note: "Queens beer gardens and German families after consolidation.",
  },
];

/** Enclaves active in a given year and population scope. */
export function settlementsAt(year: number, scope: PopScope): Settlement[] {
  return SETTLEMENTS.filter((s) => {
    if (year < s.from) return false;
    if (s.to !== undefined && year > s.to) return false;
    if (s.greaterNYOnly && scope === "manhattan") return false;
    return true;
  });
}

/** Settlements tied to a demographic group at a given year. */
export function settlementsForGroup(
  year: number,
  scope: PopScope,
  group: SegmentKey
): Settlement[] {
  return settlementsAt(year, scope).filter((s) => s.groups.includes(group));
}
