/**
 * The working waterfront: markets, shipyards, sugar houses, and docks as
 * dated points along the shore. The Navy Yard, the Atlantic Docks, and
 * the Meal Market (the slave market) are left out: entries already mark
 * them on the map. Places
 * come from the city's street centerlines where the sources name a
 * corner, and are otherwise set on the site.
 */
import type { BookRef } from "../types";

export type WaterfrontKind = "market" | "shipyard" | "sugar" | "dock";

export interface WaterfrontSite {
  id: string;
  kind: WaterfrontKind;
  name: string;
  coords: [number, number];
  from: number;
  /** Year it closed or came down; absent = still working at the timeline's end. */
  to?: number;
  /** Dates as shown, when the numbers need a "c." or a range. */
  dates?: string;
  note: string;
  aka?: string;
  book?: BookRef;
}

export const WATERFRONT_KIND_LABEL: Record<WaterfrontKind, string> = {
  market: "Market",
  shipyard: "Shipyard or ironworks",
  sugar: "Sugar house or refinery",
  dock: "Docks and piers",
};

export const waterfront: WaterfrontSite[] = [
  // ----- Markets -----
  {
    id: "fly-market",
    kind: "market",
    name: "Fly Market",
    coords: [-74.00552, 40.7058],
    from: 1699,
    to: 1821,
    note: "The town's great covered market at the foot of Maiden Lane, for meat, fish, and country produce. Press gangs raided through it in 1756; it closed in 1821.",
    aka: "Vly Maiden Lane",
    book: { book: "gotham", chapter: "27. The Canal Era", pages: "451" },
  },
  {
    id: "fulton-market",
    kind: "market",
    name: "Fulton Market",
    coords: [-74.003, 40.7065],
    from: 1822,
    to: 2005,
    note: "Opened in 1822 to replace the Fly Market; its fish wing became the Fulton Fish Market, where the East River's catch landed for nearly two centuries, until the fish market moved to Hunts Point in 2005.",
    aka: "Fulton Fish Market South Street Seaport",
    book: { book: "gotham", chapter: "27. The Canal Era", pages: "451" },
  },
  {
    id: "washington-market",
    kind: "market",
    name: "Washington Market",
    coords: [-74.0133, 40.7125],
    from: 1812,
    to: 1967,
    note: "The city's produce market on the Hudson, at Fulton, Vesey, Washington, and West streets: by the 1830s the most lucrative of its twelve markets, with a wholesale district spreading north toward Canal. It moved to Hunts Point in the Bronx in 1967, and the World Trade Center rose on its site.",
    aka: "produce Tribeca Bear Market",
    book: { book: "greaterGotham", chapter: "8. Arteries › Food In" },
  },

  // ----- Docks and piers -----
  {
    id: "black-ball",
    kind: "dock",
    name: "Black Ball Line",
    coords: [-74.00233, 40.70672],
    from: 1818,
    to: 1878,
    note: "In January 1818 the first packet sailed from here for Liverpool on a fixed day, full or not: the first scheduled service across the Atlantic, and the start of South Street's reign as the 'street of ships'.",
    aka: "packet ships Liverpool South Street",
    book: { book: "gotham", chapter: "27. The Canal Era", pages: "433" },
  },
  {
    id: "erie-basin",
    kind: "dock",
    name: "Erie Basin",
    coords: [-74.0165, 40.6725],
    from: 1864,
    note: "Red Hook's great harbor, where steam grain elevators moved barged-in Midwestern grain straight into Liverpool steamers; dry docks and ship repair grew up around it.",
    aka: "Red Hook grain elevators",
    book: { book: "gotham", chapter: "53. City Building", pages: "949" },
  },
  {
    id: "bush-terminal",
    kind: "dock",
    name: "Bush Terminal",
    coords: [-74.0175, 40.6565],
    from: 1902,
    note: "Irving Bush's private port in Sunset Park tied piers, warehouses, factories, and rail together on one site; in 1939 Chinese New Yorkers picketed its scrap-iron ships bound for Japan.",
    aka: "Industry City Sunset Park",
    book: { book: "greaterGotham", chapter: "8. Arteries › Moving Freight" },
  },
  {
    id: "chelsea-piers",
    kind: "dock",
    name: "Chelsea Piers",
    coords: [-74.009, 40.7465],
    from: 1910,
    note: "Built for the big transatlantic liners that outgrew the old piers. The Lusitania sailed from here; the Carpathia brought the Titanic's survivors here in 1912. Since 1995 the piers have been a sports complex.",
    aka: "ocean liners Lusitania Titanic",
    book: { book: "greaterGotham", chapter: "8. Arteries › Boats and Docks" },
  },
  {
    id: "army-base",
    kind: "dock",
    name: "Brooklyn Army Base",
    coords: [-74.0265, 40.6455],
    from: 1919,
    to: 1966,
    note: "Cass Gilbert's concrete supply base, finished just after the Armistice. In the Second World War it was a main gateway for troops and supplies bound overseas.",
    aka: "Brooklyn Army Terminal Sunset Park",
    book: { book: "greaterGotham", chapter: "24. Over Here" },
  },

  // ----- Shipyards and ironworks -----
  {
    id: "webb-yard",
    kind: "shipyard",
    name: "Webb shipyard",
    coords: [-73.9745, 40.7215],
    from: 1840,
    to: 1869,
    note: "William H. Webb's yards ran from 5th to 7th streets on the East River, one of a string of yards there; his clipper Challenge made San Francisco in 110 days.",
    aka: "clipper ships Dry Dock East River shipbuilding",
    book: { book: "gotham", chapter: "38. Full Steam Ahead", pages: "651" },
  },
  {
    id: "novelty-iron",
    kind: "shipyard",
    name: "Novelty Iron Works",
    coords: [-73.9725, 40.7255],
    from: 1830,
    to: 1870,
    note: "A five-acre maze at the foot of 12th Street building marine engines and boilers; with some 1,200 workers in the 1850s, an acknowledged wonder of the age.",
    aka: "marine engines steam",
    book: { book: "gotham", chapter: "38. Full Steam Ahead", pages: "659–60" },
  },
  {
    id: "continental-iron",
    kind: "shipyard",
    name: "Continental Iron Works",
    coords: [-73.9588, 40.7269],
    from: 1861,
    to: 1928,
    note: "Thomas Rowland's Greenpoint works at Calyer and West streets built John Ericsson's ironclad Monitor in 1861–62, then turned to gas holders when the war ended. The company was liquidated in 1928.",
    aka: "USS Monitor ironclad Greenpoint Civil War",
    book: { book: "gotham", chapter: "49. Civil Wars", pages: "874" },
  },

  // ----- Sugar -----
  {
    id: "livingston-sugar",
    kind: "sugar",
    name: "Livingston sugar house",
    coords: [-74.0092, 40.7085],
    from: 1754,
    to: 1840,
    dates: "c. 1754–1840",
    note: "A cavernous Liberty Street refinery. During the British occupation hundreds of American prisoners were packed inside, starving and freezing.",
    aka: "Liberty Street prison Revolution",
    book: { book: "gotham", chapter: "16. The Gibraltar of North America", pages: "252" },
  },
  {
    id: "rhinelander-sugar",
    kind: "sugar",
    name: "Rhinelander sugar house",
    coords: [-74.0017, 40.7125],
    from: 1763,
    to: 1892,
    note: "At Rose and Duane streets; another of the occupation's prisons. It stood until 1892, and one barred window survives beside Police Plaza.",
    aka: "prison Revolution Duane Street",
    book: { book: "gotham", chapter: "16. The Gibraltar of North America", pages: "252" },
  },
  {
    id: "havemeyer",
    kind: "sugar",
    name: "Havemeyer refinery",
    coords: [-73.968, 40.714],
    from: 1858,
    to: 2004,
    note: "The Havemeyers moved sugar refining from a Vandam Street shop to a million-dollar Williamsburg plant with its own docks; by 1860 Brooklyn was the world's greatest sugar-refining center. Later the Domino refinery, it refined its last sugar in 2004; its buildings, dating from 1882, are now the center of apartment towers and Domino Park.",
    aka: "Domino Sugar Williamsburg American Sugar Refining",
    book: { book: "gotham", chapter: "38. Full Steam Ahead", pages: "660–61" },
  },
];

/** 0 before a site opens, fading in over three years; gone once it closes. */
export function waterfrontOpacity(s: WaterfrontSite, year: number): number {
  if (year < s.from) return 0;
  if (s.to !== undefined && year > s.to) return 0;
  return Math.min(1, (year - s.from + 1) / 3);
}

export function waterfrontDates(s: WaterfrontSite): string {
  return s.dates ?? (s.to ? `${s.from}–${s.to}` : `from ${s.from}`);
}
