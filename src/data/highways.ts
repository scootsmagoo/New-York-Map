/**
 * Parkways, expressways, and road tunnels from 1925: Robert Moses's road
 * system and what followed. Geometry comes from the city's centerlines for
 * highways, bridges, and tunnels (scripts/prepare-highways.mjs →
 * src/data/geo/highways.json), matched by the names below.
 *
 * Most were built in sections over years. `open` is when the road was
 * substantially open (its main run, or its completion where the pieces
 * were useless apart); `built` gives the span. Dates from Wikipedia's
 * articles on each road.
 */

export type HighwayKind = "parkway" | "expressway" | "tunnel";

export interface Highway {
  id: string;
  name: string;
  kind: HighwayKind;
  /** Centerline names that make it up (exact, or a prefix ending in "*"). */
  cscl: string[];
  open: number;
  /** Construction span as shown, when it differs from `open`. */
  built?: string;
  note: string;
  entryId?: string;
}

export const highways: Highway[] = [
  // ----- Parkways (the Moses system, built for cars, not trucks) -----
  {
    id: "bronx-river-pkwy",
    name: "Bronx River Parkway",
    kind: "parkway",
    cscl: ["BRONX RIVER PKWY"],
    open: 1925,
    built: "1922–25; extended south 1951",
    note: "The first parkway built for the automobile, along the cleaned-up Bronx River valley.",
  },
  {
    id: "interborough-pkwy",
    name: "Interborough Parkway",
    kind: "parkway",
    cscl: ["JACKIE ROBINSON PKWY"],
    open: 1935,
    note: "Through the cemetery belt between Brooklyn and Queens; renamed for Jackie Robinson in 1997.",
  },
  {
    id: "grand-central-pkwy",
    name: "Grand Central Parkway",
    kind: "parkway",
    cscl: ["GRAND CENTRAL PKWY"],
    open: 1936,
    note: "Opened with the Triborough Bridge to carry Manhattanites to Long Island's state parks.",
  },
  {
    id: "henry-hudson-pkwy",
    name: "Henry Hudson Parkway",
    kind: "parkway",
    cscl: ["HENRY HUDSON PKWY"],
    open: 1937,
    built: "1934–37",
    note: "Moses's West Side Improvement: parkway, park, and a roof over the New York Central's tracks along Riverside Park.",
  },
  {
    id: "mosholu-pkwy",
    name: "Mosholu Parkway",
    kind: "parkway",
    cscl: ["MOSHOLU PKWY"],
    open: 1937,
    note: "Linking Van Cortlandt Park to Bronx Park.",
  },
  {
    id: "whitestone-pkwy",
    name: "Whitestone Parkway",
    kind: "parkway",
    cscl: ["WHITESTONE EXPY"],
    open: 1939,
    note: "Built with the Bronx–Whitestone Bridge for the World's Fair; widened into an expressway in 1963.",
  },
  {
    id: "belt-pkwy",
    name: "Belt Parkway",
    kind: "parkway",
    cscl: ["BELT PKWY"],
    open: 1940,
    note: "A 35-mile ring around Brooklyn and Queens, opened in one day in June 1940 along the shore of the Narrows, Coney Island, and Jamaica Bay.",
  },
  {
    id: "cross-island-pkwy",
    name: "Cross Island Parkway",
    kind: "parkway",
    cscl: ["CROSS ISLAND PKWY"],
    open: 1940,
    note: "The Belt Parkway's leg up the Queens shore of Little Neck Bay to the Whitestone Bridge.",
  },
  {
    id: "hutchinson-pkwy",
    name: "Hutchinson River Parkway",
    kind: "parkway",
    cscl: ["HUTCHINSON RIVER PKWY"],
    open: 1941,
    built: "1924–41",
    note: "From the Whitestone Bridge north through Pelham Bay Park to Westchester.",
  },
  {
    id: "fdr-drive",
    name: "East River Drive (FDR Drive)",
    kind: "parkway",
    cscl: ["FRANKLIN D ROOSEVELT DR", "FDR DR*"],
    open: 1942,
    built: "1934–42",
    note: "Built in pieces along the East River shore, the stretch at 23rd–34th Streets on rubble of bombed Bristol, England, brought over as ships' ballast; renamed for Roosevelt in 1945.",
  },

  // ----- Expressways -----
  {
    id: "gowanus",
    name: "Gowanus Expressway",
    kind: "expressway",
    cscl: ["GOWANUS EXPY"],
    open: 1941,
    built: "1941 as a parkway; widened 1958–64",
    note: "Built as an elevated parkway over Third Avenue in Sunset Park, it cast the avenue into shadow; widened into an expressway for the Verrazzano Bridge.",
  },
  {
    id: "van-wyck",
    name: "Van Wyck Expressway",
    kind: "expressway",
    cscl: ["VAN WYCK EXPY"],
    open: 1953,
    built: "1950–53",
    note: "Built to carry traffic to the new Idlewild airport.",
  },
  {
    id: "lie",
    name: "Long Island Expressway",
    kind: "expressway",
    cscl: ["LONG ISLAND EXPY"],
    open: 1955,
    built: "1940 (Queens–Midtown) to 1972",
    note: "Opened through Queens in 1955 and pushed out across Long Island's potato fields to the new suburbs; soon called the world's longest parking lot.",
  },
  {
    id: "major-deegan",
    name: "Major Deegan Expressway",
    kind: "expressway",
    cscl: ["MAJOR DEEGAN EXPY"],
    open: 1956,
    built: "1939–56",
    note: "Along the Harlem River from the Triborough Bridge north to the new Thruway.",
  },
  {
    id: "throgs-neck-expy",
    name: "Throgs Neck Expressway",
    kind: "expressway",
    cscl: ["THROGS NECK EXPY"],
    open: 1961,
    note: "Built with the Throgs Neck Bridge.",
  },
  {
    id: "harlem-river-drive",
    name: "Harlem River Drive",
    kind: "expressway",
    cscl: ["HARLEM RIVER DR", "HARLEM RIVER DY"],
    open: 1962,
    built: "1951–62",
    note: "Continuing the East River Drive up the Harlem River to the George Washington Bridge.",
  },
  {
    id: "cross-bronx",
    name: "Cross Bronx Expressway",
    kind: "expressway",
    cscl: ["CROSS BRONX EXPY"],
    open: 1963,
    built: "1948–72",
    note: "Moses drove it straight through East Tremont and a dozen other neighborhoods, displacing thousands of families; it opened end to end in 1963.",
    entryId: "cross-bronx",
  },
  {
    id: "clearview",
    name: "Clearview Expressway",
    kind: "expressway",
    cscl: ["CLEARVIEW EXPY"],
    open: 1963,
    built: "1957–63",
    note: "Across northeast Queens from the Throgs Neck Bridge.",
  },
  {
    id: "bqe",
    name: "Brooklyn–Queens Expressway",
    kind: "expressway",
    cscl: ["BROOKLYN QUEENS EXPY*"],
    open: 1964,
    built: "1950–64",
    note: "Stitched together along the waterfront from the Gowanus to the Grand Central; in Brooklyn Heights, Moses cantilevered it under the Promenade.",
  },
  {
    id: "sie",
    name: "Staten Island Expressway",
    kind: "expressway",
    cscl: ["STATEN ISLAND EXPY"],
    open: 1964,
    note: "Across the island from the Goethals Bridge to the new Verrazzano-Narrows Bridge. With the bridge came the suburbs: Staten Island's population grew by more than half by 1980.",
  },
  {
    id: "bruckner",
    name: "Bruckner Expressway",
    kind: "expressway",
    cscl: ["BRUCKNER EXPY"],
    open: 1973,
    built: "1958–73",
    note: "Through the South Bronx and Soundview; among the last of the city's expressways built.",
  },

  // ----- Road tunnels -----
  {
    id: "holland-tunnel",
    name: "Holland Tunnel",
    kind: "tunnel",
    cscl: ["HOLLAND TUNL"],
    open: 1927,
    note: "The first mechanically ventilated underwater road tunnel.",
    entryId: "holland-tunnel",
  },
  {
    id: "lincoln-tunnel",
    name: "Lincoln Tunnel",
    kind: "tunnel",
    cscl: ["LINCOLN TUNL"],
    open: 1937,
    note: "Under the Hudson to Weehawken; its second and third tubes followed in 1945 and 1957.",
  },
  {
    id: "queens-midtown-tunnel",
    name: "Queens–Midtown Tunnel",
    kind: "tunnel",
    cscl: ["QUEENS MIDTOWN TUNL"],
    open: 1940,
    note: "Under the East River from 36th Street to Long Island City.",
  },
  {
    id: "brooklyn-battery-tunnel",
    name: "Brooklyn–Battery Tunnel",
    kind: "tunnel",
    cscl: ["HUGH L CAREY TUNL"],
    open: 1950,
    built: "1940–50",
    note: "The longest continuous underwater vehicular tunnel in North America. Moses had wanted a bridge; the War Department vetoed it.",
  },
];

/** Opacity-free visibility: a road is drawn from the year it opened. */
export const highwayOpen = (h: Highway, year: number) => year >= h.open;
