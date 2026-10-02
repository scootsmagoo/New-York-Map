/**
 * The named waters of the lost-landscape layer, for search: small enough to
 * ship in the main bundle, where the full geometry (geo/lostLandscape.json)
 * loads only when the layer is on. Manhattan's ids match that file; the
 * other boroughs' mark areas of the USGS survey or, for land filled before
 * the 1890s, the 1845 Coast Survey chart and the 1865 map of Morrisania
 * (see `outer`). Fresh
 * Kills went under garbage from 1948 over two decades; 1958 is halfway.
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
  /**
   * Outside Manhattan: drawn from the USGS survey areas (lostLandscapeOuter)
   * rather than by id, and labeled at `coords` while still wet.
   */
  outer?: true;
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

  // ----- The other boroughs, from the USGS surveys of 1891–98 -----
  { id: "flushing-meadows", name: "Flushing Meadows", kind: "marsh", until: 1920, coords: [-73.8445, 40.7465], aka: "Flushing River Corona ash dumps valley of ashes World's Fair Queens", outer: true },
  { id: "north-beach", name: "Flushing Bay shallows", kind: "marsh", until: 1937, coords: [-73.874, 40.776], aka: "North Beach LaGuardia airport Queens", outer: true },
  { id: "barren-island", name: "Barren Island", kind: "marsh", until: 1930, coords: [-73.892, 40.588], aka: "Jamaica Bay Floyd Bennett Field Brooklyn", outer: true },
  { id: "coney-island-creek", name: "Coney Island Creek", kind: "stream", until: 1925, coords: [-73.968, 40.583], aka: "Coney Island Brooklyn Gravesend", outer: true },
  { id: "jamaica-bay-marshes", name: "Idlewild marshes", kind: "marsh", until: 1948, coords: [-73.79, 40.645], aka: "Jamaica Bay Idlewild airport JFK Kennedy Queens", outer: true },
  { id: "fresh-kills", name: "Fresh Kills marshes", kind: "marsh", until: 1958, coords: [-74.185, 40.583], aka: "Staten Island landfill Arthur Kill", outer: true },
  // ----- Before the 1890s, from the 1845 Coast Survey chart -----
  { id: "gowanus-marshes", name: "Gowanus marshes", kind: "marsh", until: 1865, coords: [-73.993, 40.676], aka: "Gowanus Creek Gowanus Canal Brooklyn", outer: true },
  { id: "red-hook-marshes", name: "Red Hook marshes", kind: "marsh", until: 1865, coords: [-74.009, 40.677], aka: "Red Hook Atlantic Docks Erie Basin Brooklyn", outer: true },
  { id: "greenpoint-marshes", name: "Greenpoint marshes", kind: "marsh", until: 1865, coords: [-73.947, 40.734], aka: "Newtown Creek Greenpoint Bushwick Creek Brooklyn", outer: true },
  { id: "little-hell-gate", name: "Little Hell Gate", kind: "stream", until: 1962, coords: [-73.9238, 40.7915], aka: "Randall's Island Ward's Island Randalls Wards Triborough", outer: true },
  { id: "sunken-meadow", name: "Sunken Meadow", kind: "marsh", until: 1955, coords: [-73.9169, 40.7926], aka: "Randall's Island Randalls Wards", outer: true },
  { id: "harlem-river-flats", name: "Harlem River flats", kind: "marsh", until: 1885, coords: [-73.9295, 40.825], aka: "Cromwell's Creek Macombs Dam Yankee Stadium Morrisania South Bronx", outer: true },
  { id: "wallabout-bay", name: "Wallabout Bay", kind: "marsh", until: 1910, coords: [-73.969, 40.702], aka: "Wallabout Navy Yard Brooklyn", outer: true },
];
