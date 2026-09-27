/**
 * Streetcar lines, 1832–1945: the main horsecar and trolley routes, each
 * from its opening to its conversion to buses. Routes are written as legs
 * along today's streets (a street, from one cross street to another);
 * scripts/prepare-streetcars.mjs turns them into geometry from the city's
 * street centerlines, in src/data/geo/streetcars.json.
 *
 * Dates come from Wikipedia's lists of streetcar lines by borough. When
 * each line went electric mostly isn't recorded line by line, so it
 * follows its borough (see ELECTRIC_FROM) unless a line says otherwise:
 * Greater Gotham has 6,000 horses still pulling cars in 1900 and the
 * Metropolitan's 114 miles converted by 1902. Routes are the lines' main
 * streets at their longest; terminals and short jogs varied over the years.
 */
import type { BookRef } from "../types";

export type Borough = "manhattan" | "brooklyn" | "bronx" | "queens";

/** [street, from cross street, to cross street], in the city's centerline names. */
export type Leg = [string, string, string];

export interface StreetcarLine {
  id: string;
  name: string;
  borough: Borough;
  /** Year it opened (horsecars, unless it opened electric). */
  open: number;
  /** Year buses replaced it; absent = still running in 1945. */
  close?: number;
  /** Year it went electric, where known; null = horses to the end. */
  electric?: number | null;
  legs: Leg[];
  note: string;
  book?: BookRef;
}

/** Roughly when each borough's lines went electric (see the note above). */
export const ELECTRIC_FROM: Record<Borough, number> = {
  brooklyn: 1893,
  bronx: 1892,
  queens: 1895,
  manhattan: 1900,
};

export const BOROUGH_CODE: Record<Borough, string> = {
  manhattan: "1",
  bronx: "2",
  brooklyn: "3",
  queens: "4",
};

export const streetcarLines: StreetcarLine[] = [
  // ----- Manhattan -----
  {
    id: "harlem",
    name: "New York & Harlem (Fourth and Madison Avenues)",
    borough: "manhattan",
    open: 1832,
    close: 1935,
    legs: [
      ["BOWERY", "CHATHAM SQ", "COOPER SQ"],
      ["4 AVE", "COOPER SQ", "E 14 ST"],
      ["UNION SQ E", "E 14 ST", "E 17 ST"],
      ["PARK AVE S", "E 17 ST", "E 32 ST"],
      ["PARK AVE", "E 32 ST", "E 42 ST"],
      ["E 42 ST", "PARK AVE", "MADISON AVE"],
      ["MADISON AVE", "E 42 ST", "E 135 ST"],
    ],
    note: "The world's first street railway: in 1832 horse-drawn cars began running on rails up the Bowery. The line opened the East Side north toward Harlem in the 1830s.",
    book: { book: "gotham", chapter: "53. City Building", pages: "929" },
  },
  {
    id: "second-ave",
    name: "Second Avenue line",
    borough: "manhattan",
    open: 1853,
    close: 1933,
    legs: [
      ["BOWERY", "CHATHAM SQ", "E HOUSTON ST"],
      ["E HOUSTON ST", "BOWERY", "2 AVE"],
      ["2 AVE", "E HOUSTON ST", "E 122 ST"],
    ],
    note: "Horsecars up Second Avenue as far as 122nd Street, opening Yorkville and East Harlem to people who worked downtown.",
    book: { book: "gotham", chapter: "53. City Building", pages: "929" },
  },
  {
    id: "third-ave",
    name: "Third Avenue line",
    borough: "manhattan",
    open: 1853,
    legs: [
      ["BOWERY", "CHATHAM SQ", "COOPER SQ"],
      ["3 AVE", "COOPER SQ", "E 125 ST"],
      ["E 125 ST", "3 AVE", "5 AVE"],
      ["W 125 ST", "5 AVE", "AMSTERDAM AVE"],
      ["AMSTERDAM AVE", "W 125 ST", "W 186 ST"],
    ],
    note: "The Third Avenue Railroad's horsecars (their drivers struck in the 1850s) became Manhattan's last trolleys: La Guardia forced buses on it in 1945, and the cars were sold to Bombay, Vienna, and Lima.",
    book: { book: "gothamAtWar", chapter: "Planning The Postwar City", pages: "724" },
  },
  {
    id: "sixth-ave",
    name: "Sixth Avenue line",
    borough: "manhattan",
    open: 1852,
    close: 1936,
    legs: [
      ["W BROADWAY", "CHAMBERS ST", "CANAL ST"],
      ["AVE OF THE AMERICAS", "CANAL ST", "CENTRAL PARK S"],
    ],
    note: "One of the first two avenue lines, chartered in 1852 with the Eighth Avenue line; it ran up West Broadway and Sixth Avenue to Central Park.",
  },
  {
    id: "seventh-ave",
    name: "Broadway and Seventh Avenue line",
    borough: "manhattan",
    open: 1864,
    close: 1936,
    legs: [
      ["GREENWICH AVE", "AVE OF THE AMERICAS", "7 AVE"],
      ["7 AVE", "GREENWICH AVE", "CENTRAL PARK S"],
    ],
    note: "Jacob Sharp's line, running from Union Square to 59th Street. For thirty years he schemed for the right to run it down lower Broadway.",
    book: { book: "gotham", chapter: "59. Manhattan, Inc.", pages: "1057" },
  },
  {
    id: "broadway-surface",
    name: "Lower Broadway line",
    borough: "manhattan",
    open: 1885,
    close: 1936,
    legs: [["BROADWAY", "BATTERY PL", "E 14 ST"]],
    note: "Sharp won his lower Broadway franchise in 1884 with some $200,000 to state legislators and half a million to the aldermen; his rails ran down to the Battery the next year.",
    book: { book: "gotham", chapter: "59. Manhattan, Inc.", pages: "1057" },
  },
  {
    id: "eighth-ave",
    name: "Eighth Avenue line",
    borough: "manhattan",
    open: 1852,
    close: 1935,
    legs: [
      ["HUDSON ST", "CANAL ST", "8 AVE"],
      ["8 AVE", "HUDSON ST", "CENTRAL PARK S"],
      ["CENTRAL PARK W", "CENTRAL PARK S", "CATHEDRAL PKWY"],
      ["FREDERICK DOUGLASS BLVD", "CATHEDRAL PKWY", "W 155 ST"],
    ],
    note: "In the 1860s a single horsecar trudged up Eighth Avenue to 84th Street, gave up, and turned back; the West Side's 'Badlands' were otherwise reached by stagecoach.",
    book: { book: "gotham", chapter: "52. Reconstructing New York", pages: "923" },
  },
  {
    id: "ninth-ave",
    name: "Ninth Avenue line",
    borough: "manhattan",
    open: 1859,
    close: 1935,
    legs: [
      ["GREENWICH ST", "RECTOR ST", "GANSEVOORT ST"],
      ["9 AVE", "GANSEVOORT ST", "W 59 ST"],
      ["COLUMBUS AVE", "W 60 ST", "CATHEDRAL PKWY"],
    ],
    note: "Horsecars from the Cortlandt Street ferry up Greenwich Street and Ninth Avenue, later on up Columbus Avenue to Morningside Heights.",
  },
  {
    id: "bleecker",
    name: "Bleecker Street line",
    borough: "manhattan",
    open: 1864,
    close: 1917,
    electric: null,
    legs: [["BLEECKER ST", "BOWERY", "8 AVE"]],
    note: "Never electrified: when it closed on July 26, 1917, it was the last horsecar line in New York.",
  },

  // ----- Brooklyn -----
  {
    id: "fulton-bk",
    name: "Fulton Street line",
    borough: "brooklyn",
    open: 1854,
    close: 1941,
    legs: [
      ["OLD FULTON ST", "FURMAN ST", "CADMAN PLZ W"],
      ["FULTON ST", "ADAMS ST", "VAN SICLEN AVE"],
    ],
    note: "The Brooklyn City Railroad's forty-passenger horsecars ran from the Fulton Ferry out Fulton Avenue from 1854, and Bedford's farmland began selling off to speculators.",
    book: { book: "gotham", chapter: "41. Life Above Bleecker", pages: "719" },
  },
  {
    id: "myrtle",
    name: "Myrtle Avenue line",
    borough: "brooklyn",
    open: 1854,
    electric: 1893,
    legs: [["MYRTLE AVE", "FLATBUSH AVE EXTENSION", "WYCKOFF AVE"]],
    note: "Brooklyn's first streetcar line, opened with Fulton Street's by the Brooklyn City Railroad in 1854; electric trolleys replaced its horses by July 1893.",
    book: { book: "gotham", chapter: "41. Life Above Bleecker", pages: "719" },
  },
  {
    id: "flushing-ave",
    name: "Flushing Avenue line",
    borough: "brooklyn",
    open: 1854,
    legs: [["FLUSHING AVE", "NAVY ST", "WYCKOFF AVE"]],
    note: "Past the Navy Yard gate and out through Williamsburg's factories toward Maspeth.",
  },
  {
    id: "third-ave-bk",
    name: "Third Avenue line (Brooklyn)",
    borough: "brooklyn",
    open: 1854,
    close: 1942,
    legs: [["3 AVE", "ATLANTIC AVE", "95 ST"]],
    note: "Along the South Brooklyn waterfront to Bay Ridge and Fort Hamilton, beside the docks and the Bush Terminal.",
  },
  {
    id: "broadway-bk",
    name: "Broadway line (Brooklyn)",
    borough: "brooklyn",
    open: 1859,
    legs: [["BROADWAY", "KENT AVE", "JAMAICA AVE"]],
    note: "From the Williamsburg ferries out Broadway to East New York and Cypress Hills, later under the el.",
  },
  {
    id: "flatbush",
    name: "Flatbush Avenue line",
    borough: "brooklyn",
    open: 1860,
    legs: [["FLATBUSH AVE", "ATLANTIC AVE", "AVE U"]],
    note: "Down Flatbush Avenue past Prospect Park to the old Dutch town of Flatbush and on to Marine Park.",
  },
  {
    id: "dekalb",
    name: "DeKalb Avenue line",
    borough: "brooklyn",
    open: 1862,
    legs: [["DEKALB AVE", "FLATBUSH AVE EXTENSION", "WYCKOFF AVE"]],
    note: "Through Fort Greene and Bedford to Ridgewood. In 1895 Brooklyn's trolley men struck every line in the city, and the militia rode the cars.",
    book: { book: "gotham", chapter: "67. Good Government", pages: "1202" },
  },
  {
    id: "smith",
    name: "Smith Street line",
    borough: "brooklyn",
    open: 1866,
    legs: [
      ["SMITH ST", "LIVINGSTON ST", "9 ST"],
      ["9 ST", "SMITH ST", "PROSPECT PARK W"],
    ],
    note: "Down Smith Street, over the Gowanus Canal on Ninth Street, and up the hill to Prospect Park.",
  },
  {
    id: "coney-island-ave",
    name: "Coney Island Avenue line",
    borough: "brooklyn",
    open: 1890,
    legs: [["CONEY ISLAND AVE", "PARK CIR", "BRIGHTON BEACH AVE"]],
    note: "One of the trolley routes that carried summer crowds from Prospect Park to the beach.",
  },
  {
    id: "nostrand",
    name: "Nostrand Avenue line",
    borough: "brooklyn",
    open: 1895,
    legs: [["NOSTRAND AVE", "FLUSHING AVE", "EMMONS AVE"]],
    note: "Opened in 1895 as Brooklyn's lines went electric; it ran nearly the length of the borough, from Williamsburg to Sheepshead Bay.",
  },

  // ----- The Bronx -----
  {
    id: "huckleberry",
    name: "Third Avenue line (the 'Huckleberry')",
    borough: "bronx",
    open: 1865,
    legs: [["3 AVE", "E 138 ST", "E FORDHAM RD"]],
    note: "Since the 1860s horsecars ran now and then from the Harlem Bridge up Third Avenue to Fordham; in the delays riders hopped off to pick huckleberries, and the line took the name.",
    book: { book: "greaterGotham", chapter: "10. Housing › The Bronx: Instant City" },
  },
  {
    id: "westchester-ave",
    name: "Westchester Avenue line",
    borough: "bronx",
    open: 1892,
    legs: [["WESTCHESTER AVE", "3 AVE", "E TREMONT AVE"]],
    note: "Out from the Hub to Westchester Square, one of the Union Railway's trolley lines of the 1890s.",
  },
  {
    id: "webster",
    name: "Webster Avenue line",
    borough: "bronx",
    open: 1892,
    legs: [["WEBSTER AVE", "E 165 ST", "E GUN HILL RD"]],
    note: "North along Webster Avenue to Williamsbridge and on to Wakefield at the city line.",
  },

  // ----- Queens -----
  {
    id: "steinway",
    name: "Steinway line",
    borough: "queens",
    open: 1883,
    close: 1939,
    legs: [["STEINWAY ST", "NORTHERN BLVD", "20 AVE"]],
    note: "Built for the piano maker's company town at Astoria, carrying workers along Steinway Street to the factory.",
  },
  {
    id: "jamaica-ave",
    name: "Jamaica Avenue line",
    borough: "queens",
    open: 1863,
    legs: [["JAMAICA AVE", "WOODHAVEN BLVD", "168 ST"]],
    note: "Opened by the East New York and Jamaica Railroad in 1863, along the old turnpike to the village of Jamaica.",
  },
];

/** Horse or electric in `year`, or null when the line isn't running. */
export function streetcarPower(line: StreetcarLine, year: number): "horse" | "electric" | null {
  if (year < line.open) return null;
  if (line.close !== undefined && year >= line.close) return null;
  const electric = line.electric === undefined ? ELECTRIC_FROM[line.borough] : line.electric;
  return electric !== null && year >= Math.max(electric, line.open) ? "electric" : "horse";
}
