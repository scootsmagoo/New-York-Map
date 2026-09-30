/**
 * Steam railroads, and the rapid-transit lines later built on their
 * rights-of-way. Railroads mostly kept to their own land, so their routes
 * come from OpenStreetMap's railway ways, picked by name within a box
 * (scripts/prepare-railroads.mjs → src/data/geo/railroads.json); the few
 * that ran down a street follow the street centerlines. Today's tracks
 * stand in for the old ones where a line was rebuilt in place (the Coney
 * Island lines, the Rockaway trestle). Dates from Wikipedia's article on
 * each line.
 */
import type { InfrastructureLine } from "../types";
import type { Leg } from "./streetcars";
import geometry from "./geo/railroads.json" with { type: "json" };

export interface OsmSource {
  /** OSM way names, exactly. */
  names: string[];
  /** [west, south, east, north]: only the parts of the ways inside it. */
  box?: [number, number, number, number];
  /** Keep ways tagged service=spur (dropped by default, with yards and sidings). */
  spurs?: boolean;
  /** Leave out tunnel sections (where a subway later took the line underground). */
  noTunnel?: boolean;
}

export interface RailroadLine {
  id: string;
  name: string;
  kind: "railroad" | "elevated" | "subway";
  open: number;
  close?: number;
  osm?: OsmSource[];
  /** Centerline borough code and street legs, for a line down a street. */
  boro?: string;
  streets?: Leg[];
  entryId?: string;
}

const SI = [-74.26, 40.49, -74.05, 40.66] as const;
const box = (w: number, s: number, e: number, n: number): [number, number, number, number] => [w, s, e, n];

export const railroadLines: RailroadLine[] = [
  // ----- Staten Island -----
  { id: "sir-tottenville", name: "Staten Island Railway", kind: "railroad", open: 1860,
    entryId: "staten-island-railway",
    osm: [{ names: ["Staten Island Railway"], box: box(SI[0], SI[1], SI[2], 40.6222) }] },
  { id: "sir-st-george", name: "Staten Island Railway (to St. George)", kind: "railroad", open: 1886,
    osm: [{ names: ["Staten Island Railway"], box: box(SI[0], 40.6222, SI[2], SI[3]) }] },
  { id: "sir-north-shore", name: "North Shore Branch", kind: "railroad", open: 1886, close: 1953,
    osm: [
      { names: ["North Shore Branch"], box: box(SI[0], 40.62, SI[2], SI[3]), spurs: true },
      { names: ["Staten Island Railroad"], box: box(SI[0], 40.625, SI[2], SI[3]) },
    ] },

  // ----- Brooklyn and Queens: the Long Island Rail Road and its rivals -----
  // Brooklyn banned steam engines in 1861: the line west of East New York
  // closed, and the Cobble Hill tunnel was sealed. Trains came back as far
  // as Flatbush Avenue in 1877.
  { id: "bj-south-ferry", name: "Brooklyn and Jamaica Railroad (to South Ferry)", kind: "railroad",
    open: 1836, close: 1861, entryId: "cobble-hill-tunnel",
    boro: "3", streets: [["ATLANTIC AVE", "FURMAN ST", "FLATBUSH AVE"]] },
  { id: "lirr-atlantic-west", name: "Long Island Rail Road (Atlantic Avenue)", kind: "railroad",
    open: 1836, close: 1861,
    osm: [{ names: ["Atlantic Branch"], box: box(-73.98, 40.66, -73.9, 40.7) }] },
  { id: "lirr-atlantic-west-2", name: "Long Island Rail Road (Atlantic Avenue)", kind: "railroad", open: 1877,
    osm: [{ names: ["Atlantic Branch"], box: box(-73.98, 40.66, -73.9, 40.7) }] },
  { id: "lirr-atlantic-east", name: "Long Island Rail Road (Atlantic Avenue)", kind: "railroad", open: 1836,
    osm: [{ names: ["Atlantic Branch"], box: box(-73.9, 40.66, -73.8, 40.71) }] },
  { id: "flushing-rr", name: "Flushing Railroad", kind: "railroad", open: 1854,
    osm: [
      { names: ["Port Washington Branch"], box: box(-73.96, 40.73, -73.83, 40.77) },
      { names: ["Main Line", "LIRR Main Line"], box: box(-73.96, 40.73, -73.903, 40.76) },
    ] },
  { id: "flushing-rr-east", name: "Port Washington Branch (to Great Neck)", kind: "railroad", open: 1866,
    osm: [{ names: ["Port Washington Branch"], box: box(-73.83, 40.74, -73.7, 40.79) }] },
  { id: "rockaway-beach-branch", name: "Rockaway Beach Branch", kind: "railroad", open: 1880, close: 1962,
    osm: [{ names: ["Rockaway Beach Branch", "LIRR Rockaway Beach Branch"] }] },
  { id: "rockaway-trestle", name: "Rockaway Beach Branch (Jamaica Bay trestle)", kind: "railroad",
    open: 1880, close: 1950,
    osm: [{ names: ["IND Rockaway Line"] }] },
  // After a 1950 fire the city bought the trestle and rebuilt it for the subway.
  { id: "ind-rockaway", name: "IND Rockaway line", kind: "subway", open: 1956,
    osm: [{ names: ["IND Rockaway Line"] }] },

  // ----- Coney Island: excursion railroads that became the subway -----
  { id: "west-end-rr", name: "Brooklyn, Bath and Coney Island Railroad", kind: "railroad", open: 1864, close: 1915,
    osm: [{ names: ["BMT West End Line"] }] },
  { id: "bmt-west-end", name: "BMT West End line", kind: "elevated", open: 1916,
    osm: [{ names: ["BMT West End Line"] }] },
  { id: "culver-rr", name: "Prospect Park and Coney Island Railroad (Culver)", kind: "railroad",
    open: 1875, close: 1919,
    osm: [{ names: ["IND Culver Line"], box: box(-74.0, 40.57, -73.95, 40.637), noTunnel: true }] },
  { id: "bmt-culver", name: "BMT Culver line", kind: "elevated", open: 1920,
    osm: [{ names: ["IND Culver Line"], box: box(-74.0, 40.57, -73.95, 40.637), noTunnel: true }] },
  { id: "brighton-rr", name: "Brooklyn, Flatbush and Coney Island Railway", kind: "railroad",
    open: 1878, close: 1919,
    osm: [
      { names: ["BMT Brighton Line"], box: box(-74.0, 40.57, -73.9, 40.6615) },
      { names: ["BMT Franklin Avenue Line"] },
    ] },
  { id: "bmt-brighton", name: "BMT Brighton line", kind: "subway", open: 1920,
    osm: [{ names: ["BMT Brighton Line", "BMT Franklin Avenue Line"] }] },
  { id: "sea-beach-rr", name: "New York and Sea Beach Railroad", kind: "railroad", open: 1879, close: 1914,
    osm: [{ names: ["BMT Sea Beach Line"] }] },
  { id: "bmt-sea-beach", name: "BMT Sea Beach line", kind: "subway", open: 1915,
    osm: [{ names: ["BMT Sea Beach Line"] }] },

  // ----- Manhattan and the Bronx -----
  { id: "harlem-rr-yorkville", name: "New York and Harlem Railroad", kind: "railroad", open: 1834,
    entryId: "harlem-railroad",
    // OSM names the Park Avenue tunnel's tracks for the terminal.
    osm: [{ names: ["Hudson Line", "Grand Central Terminal"], box: box(-73.98, 40.752, -73.93, 40.785) }] },
  { id: "harlem-rr-harlem", name: "New York and Harlem Railroad", kind: "railroad", open: 1837,
    entryId: "harlem-railroad",
    osm: [{ names: ["Hudson Line", "Harlem Line"], box: box(-73.955, 40.785, -73.92, 40.8185) }] },
  { id: "harlem-rr-bronx", name: "New York and Harlem Railroad", kind: "railroad", open: 1842,
    entryId: "harlem-railroad",
    osm: [{ names: ["Harlem Line"], box: box(-73.95, 40.8185, -73.85, 40.879) }] },
  { id: "harlem-rr-north", name: "New York and Harlem Railroad", kind: "railroad", open: 1844,
    entryId: "harlem-railroad",
    osm: [{ names: ["Harlem Line"], box: box(-73.9, 40.879, -73.84, 40.915) }] },
  { id: "hudson-river-rr", name: "Hudson River Railroad", kind: "railroad", open: 1849,
    osm: [
      // In Manhattan OSM also calls the Park Avenue tracks the Hudson Line,
      // and in the Bronx the tracks along the Harlem River: boxes keep to
      // the west side and the Hudson shore.
      { names: ["Hudson Line"], box: box(-74.02, 40.755, -73.975, 40.8) },
      { names: ["Hudson Line"], box: box(-74.0, 40.8, -73.955, 40.815) },
      { names: ["Hudson Line"], box: box(-74.0, 40.815, -73.935, 40.86) },
      { names: ["Hudson Line"], box: box(-74.0, 40.86, -73.918, 40.877) },
      { names: ["Hudson Line"], box: box(-73.94, 40.877, -73.895, 40.915) },
    ] },
  { id: "high-line", name: "High Line", kind: "railroad", open: 1934,
    osm: [{ names: ["High Line", "West Side Line"], box: box(-74.02, 40.73, -73.99, 40.76) }] },
  { id: "nywb", name: "New York, Westchester and Boston Railway", kind: "railroad", open: 1912, close: 1937,
    osm: [{ names: ["IRT Dyre Avenue Line", "New York, Westchester and Boston Railway"], box: box(-73.9, 40.83, -73.8, 40.89) }] },
  { id: "irt-dyre", name: "IRT Dyre Avenue line", kind: "subway", open: 1941,
    osm: [{ names: ["IRT Dyre Avenue Line"], box: box(-73.9, 40.83, -73.8, 40.89) }] },
];

const routes = geometry as unknown as Record<string, [number, number][][]>;

/** As infrastructure lines, their legs from the built geometry. */
export const railroadInfrastructure: InfrastructureLine[] = railroadLines.map((r) => {
  const legs = routes[r.id] ?? [];
  return {
    id: r.id,
    name: r.name,
    kind: r.kind,
    open: r.open,
    close: r.close,
    entryId: r.entryId,
    pts: legs.flat(),
    legs,
  };
});
