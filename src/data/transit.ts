/**
 * Els and subways beyond the Manhattan trunk lines in infrastructure.ts:
 * the lines that reached Brooklyn, Queens, and the Bronx, and the postwar
 * changes. Els ran over streets and most subways under them, so routes are
 * legs along the street they followed (a street between two cross
 * streets, as for streetcars), built by scripts/prepare-transit.mjs into
 * src/data/geo/transit.json. Lines on railroad rights-of-way (the Coney
 * Island lines, the Rockaway line, Dyre Avenue) are in railroads.ts. Dates
 * from Wikipedia's articles on each line; a line built in stages is dated
 * by its main section.
 */
import type { InfrastructureLine } from "../types";
import type { Leg } from "./streetcars";
import geometry from "./geo/transit.json" with { type: "json" };

export interface TransitLine {
  id: string;
  name: string;
  kind: "elevated" | "subway";
  /** Centerline borough code: 1 Manhattan, 2 Bronx, 3 Brooklyn, 4 Queens. */
  boro: string;
  open: number;
  close?: number;
  legs: Leg[];
  entryId?: string;
}

export const transitLines: TransitLine[] = [
  // ----- Brooklyn els -----
  { id: "bk-lexington-el", name: "Lexington Avenue El", kind: "elevated", boro: "3", open: 1885, close: 1950,
    legs: [["LEXINGTON AVE", "GRAND AVE", "BROADWAY"]] },
  { id: "bk-broadway-el", name: "Broadway El", kind: "elevated", boro: "3", open: 1885,
    legs: [["BROADWAY", "KENT AVE", "JAMAICA AVE"]] },
  { id: "bk-fulton-el", name: "Fulton Street El", kind: "elevated", boro: "3", open: 1888, close: 1940,
    legs: [["FULTON ST", "ADAMS ST", "ROCKAWAY AVE"]] },
  { id: "bk-myrtle-el", name: "Myrtle Avenue El (downtown)", kind: "elevated", boro: "3", open: 1888, close: 1969,
    legs: [["MYRTLE AVE", "FLATBUSH AVE EXTENSION", "BROADWAY"]] },
  { id: "bk-myrtle-el-east", name: "Myrtle Avenue El", kind: "elevated", boro: "3", open: 1889,
    legs: [["MYRTLE AVE", "BROADWAY", "WYCKOFF AVE"]] },
  { id: "bk-fifth-ave-el", name: "Fifth Avenue El", kind: "elevated", boro: "3", open: 1889, close: 1940,
    legs: [["5 AVE", "FLATBUSH AVE", "38 ST"]] },

  // ----- Brooklyn subways -----
  { id: "bmt-fourth-ave", name: "BMT Fourth Avenue line", kind: "subway", boro: "3", open: 1915,
    legs: [["4 AVE", "ATLANTIC AVE", "95 ST"]] },
  { id: "irt-eastern-pkwy", name: "IRT Eastern Parkway line", kind: "subway", boro: "3", open: 1920,
    legs: [["EASTERN PKWY", "FLATBUSH AVE", "UTICA AVE"]] },
  { id: "irt-nostrand", name: "IRT Nostrand Avenue line", kind: "subway", boro: "3", open: 1920,
    legs: [["NOSTRAND AVE", "EASTERN PKWY", "FLATBUSH AVE"]] },
  { id: "ind-fulton", name: "IND Fulton Street line", kind: "subway", boro: "3", open: 1936,
    legs: [["FULTON ST", "ADAMS ST", "ROCKAWAY AVE"]] },

  // ----- Queens -----
  { id: "irt-flushing", name: "IRT Flushing line", kind: "elevated", boro: "4", open: 1917,
    legs: [["QUEENS BLVD", "THOMSON AVE", "ROOSEVELT AVE"], ["ROOSEVELT AVE", "QUEENS BLVD", "MAIN ST"]] },
  { id: "astoria-el", name: "Astoria line", kind: "elevated", boro: "4", open: 1917,
    legs: [["31 ST", "NORTHERN BLVD", "DITMARS BLVD"]] },
  { id: "jamaica-ave-el", name: "Jamaica Avenue El", kind: "elevated", boro: "4", open: 1918,
    legs: [["JAMAICA AVE", "WOODHAVEN BLVD", "168 ST"]] },
  { id: "ind-queens-blvd", name: "IND Queens Boulevard line", kind: "subway", boro: "4", open: 1936,
    legs: [["QUEENS BLVD", "THOMSON AVE", "UNION TPKE"]] },
  { id: "ind-hillside", name: "IND Hillside Avenue extension", kind: "subway", boro: "4", open: 1950,
    legs: [["HILLSIDE AVE", "QUEENS BLVD", "179 ST"]] },

  // ----- The Bronx -----
  { id: "bx-third-ave-el", name: "Third Avenue El (Bronx)", kind: "elevated", boro: "2", open: 1891, close: 1973,
    legs: [["3 AVE", "E 149 ST", "E FORDHAM RD"]] },
  { id: "bx-webster-el", name: "Third Avenue El (Webster Avenue)", kind: "elevated", boro: "2", open: 1920, close: 1973,
    legs: [["WEBSTER AVE", "E FORDHAM RD", "E GUN HILL RD"]] },
  { id: "irt-white-plains", name: "IRT White Plains Road line", kind: "elevated", boro: "2", open: 1917,
    legs: [["WHITE PLAINS RD", "E TREMONT AVE", "E 241 ST"]] },
  { id: "irt-jerome", name: "IRT Jerome Avenue line", kind: "elevated", boro: "2", open: 1917,
    legs: [["JEROME AVE", "E 161 ST", "E GUN HILL RD"]] },
  { id: "irt-pelham", name: "IRT Pelham line", kind: "elevated", boro: "2", open: 1920,
    legs: [["WESTCHESTER AVE", "WHITLOCK AVE", "BUHRE AVE"]] },
  { id: "ind-concourse", name: "IND Concourse line", kind: "subway", boro: "2", open: 1933,
    legs: [["GRAND CONC", "E 161 ST", "BEDFORD PARK BLVD"]] },

  // ----- Manhattan, postwar -----
  { id: "chrystie-connection", name: "Chrystie Street Connection", kind: "subway", boro: "1", open: 1967,
    legs: [["CHRYSTIE ST", "GRAND ST", "E HOUSTON ST"]] },
];

const routes = geometry as unknown as Record<string, [number, number][][]>;

/** As infrastructure lines, their legs from the built geometry. */
export const transitInfrastructure: InfrastructureLine[] = transitLines.map((t) => {
  const legs = routes[t.id] ?? [];
  return {
    id: t.id,
    name: t.name,
    kind: t.kind,
    open: t.open,
    close: t.close,
    entryId: t.entryId,
    pts: legs.flat(),
    legs,
  };
});
