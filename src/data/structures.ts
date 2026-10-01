import type { Structure } from "../types";

/**
 * Bridges and ferry routes. Visible while `open <= year <= close`; ferries
 * fade from the map as bridges and tunnels retire them. The first entries
 * in each list are hand-placed.
 */
export const bridges: Structure[] = [
  {
    id: "high-bridge",
    name: "High Bridge",
    kind: "bridge",
    pts: [
      [-73.9325, 40.8405],
      [-73.9255, 40.8445],
    ],
    open: 1848,
    entryId: "highbridge",
  },
  {
    id: "brooklyn-bridge",
    name: "Brooklyn Bridge",
    kind: "bridge",
    pts: [
      [-74.0038, 40.7117],
      [-73.9897, 40.7012],
    ],
    open: 1883,
    entryId: "brooklyn-bridge-opens",
  },
  {
    id: "macombs-dam",
    name: "Macombs Dam Bridge",
    kind: "bridge",
    pts: [
      [-73.9362, 40.8285],
      [-73.9282, 40.8298],
    ],
    open: 1895,
  },
  {
    id: "williamsburg-bridge",
    name: "Williamsburg Bridge",
    kind: "bridge",
    pts: [
      [-73.9787, 40.7136],
      [-73.9618, 40.7108],
    ],
    open: 1903,
  },
  {
    id: "manhattan-bridge",
    name: "Manhattan Bridge",
    kind: "bridge",
    pts: [
      [-73.9928, 40.7118],
      [-73.9815, 40.7012],
    ],
    open: 1909,
  },
  {
    id: "queensboro-bridge",
    name: "Queensboro Bridge",
    kind: "bridge",
    pts: [
      [-73.9622, 40.7593],
      [-73.9398, 40.751],
    ],
    open: 1909,
  },
  {
    id: "hell-gate",
    name: "Hell Gate Bridge",
    kind: "bridge",
    pts: [
      [-73.9222, 40.7818],
      [-73.9302, 40.7892],
    ],
    open: 1916,
  },
  {
    id: "goethals",
    name: "Goethals Bridge",
    kind: "bridge",
    pts: [
      [-74.1955, 40.6325],
      [-74.202, 40.639],
    ],
    open: 1928,
  },
  {
    id: "outerbridge",
    name: "Outerbridge Crossing",
    kind: "bridge",
    pts: [
      [-74.2475, 40.5225],
      [-74.2575, 40.5265],
    ],
    open: 1928,
  },
  {
    id: "gw-bridge",
    name: "George Washington Bridge",
    kind: "bridge",
    pts: [
      [-73.9475, 40.8505],
      [-73.965, 40.8535],
    ],
    open: 1931,
    entryId: "gw-bridge",
  },
  {
    id: "bayonne-bridge",
    name: "Bayonne Bridge",
    kind: "bridge",
    pts: [
      [-74.1405, 40.6385],
      [-74.142, 40.6475],
    ],
    open: 1931,
  },
  {
    id: "triborough",
    name: "Triborough Bridge",
    kind: "bridge",
    pts: [
      [-73.9205, 40.779],
      [-73.927, 40.784],
      [-73.9245, 40.7985],
      [-73.935, 40.802],
    ],
    open: 1936,
    entryId: "triborough",
  },
  {
    id: "henry-hudson",
    name: "Henry Hudson Bridge",
    kind: "bridge",
    pts: [
      [-73.9215, 40.8745],
      [-73.9195, 40.8795],
    ],
    open: 1936,
  },
  {
    id: "marine-parkway",
    name: "Marine Parkway Bridge",
    kind: "bridge",
    pts: [
      [-73.885, 40.581],
      [-73.884, 40.57],
    ],
    open: 1937,
  },
  {
    id: "whitestone",
    name: "Bronx–Whitestone Bridge",
    kind: "bridge",
    pts: [
      [-73.8275, 40.8055],
      [-73.8295, 40.793],
    ],
    open: 1939,
  },
  {
    id: "kosciuszko",
    name: "Kosciuszko Bridge",
    kind: "bridge",
    pts: [
      [-73.925, 40.732],
      [-73.9338, 40.7251],
    ],
    open: 1939,
  },
  {
    id: "pulaski",
    name: "Pulaski Bridge",
    kind: "bridge",
    pts: [
      [-73.9513, 40.7433],
      [-73.9527, 40.7355],
    ],
    open: 1954,
  },
  {
    id: "throgs-neck",
    name: "Throgs Neck Bridge",
    kind: "bridge",
    pts: [
      [-73.7926, 40.7906],
      [-73.7973, 40.8158],
    ],
    open: 1961,
  },
  {
    id: "alexander-hamilton",
    name: "Alexander Hamilton Bridge",
    kind: "bridge",
    pts: [
      [-73.9305, 40.8461],
      [-73.9247, 40.8448],
    ],
    open: 1963,
  },
  {
    id: "verrazzano",
    name: "Verrazzano-Narrows Bridge",
    kind: "bridge",
    pts: [
      [-74.036, 40.6093],
      [-74.0535, 40.6036],
    ],
    open: 1964,
    entryId: "verrazzano-bridge",
  },
  // From the city's bridge centerlines; dates from Wikipedia.
  {
    id: "third-ave-bridge",
    name: "Third Avenue Bridge",
    kind: "bridge",
    pts: [
      [-73.93434, 40.80677],
      [-73.93149, 40.80801],
    ],
    open: 1898,
  },
  {
    id: "madison-ave-bridge",
    name: "Madison Avenue Bridge",
    kind: "bridge",
    pts: [
      [-73.93527, 40.81301],
      [-73.93455, 40.81397],
      [-73.93431, 40.81408],
      [-73.9322, 40.81405],
      [-73.93141, 40.81367],
    ],
    open: 1884,
  },
  {
    id: "washington-bridge",
    name: "Washington Bridge",
    kind: "bridge",
    pts: [
      [-73.92257, 40.84513],
      [-73.9238, 40.84512],
      [-73.9244, 40.84526],
      [-73.93089, 40.84813],
    ],
    open: 1888,
  },
  {
    id: "carroll-st-bridge",
    name: "Carroll Street Bridge",
    kind: "bridge",
    pts: [
      [-73.98932, 40.67826],
      [-73.98901, 40.67814],
    ],
    open: 1889,
  },
  {
    id: "broadway-bridge",
    name: "Broadway Bridge",
    kind: "bridge",
    pts: [
      [-73.91164, 40.87331],
      [-73.9106, 40.8741],
    ],
    open: 1895,
  },
  {
    id: "willis-ave-bridge",
    name: "Willis Avenue Bridge",
    kind: "bridge",
    pts: [
      [-73.93025, 40.80283],
      [-73.92707, 40.8044],
      [-73.92571, 40.80523],
      [-73.92428, 40.80719],
    ],
    open: 1901,
  },
  {
    id: "city-island-bridge",
    name: "City Island Bridge",
    kind: "bridge",
    pts: [
      [-73.79249, 40.85596],
      [-73.79836, 40.85814],
      [-73.8009, 40.85956],
    ],
    open: 1901,
  },
  {
    id: "grand-st-bridge",
    name: "Grand Street Bridge",
    kind: "bridge",
    pts: [
      [-73.92308, 40.7164],
      [-73.92233, 40.7166],
    ],
    open: 1902,
  },
  {
    id: "145th-st-bridge",
    name: "145th Street Bridge",
    kind: "bridge",
    pts: [
      [-73.9307, 40.81937],
      [-73.93383, 40.8195],
      [-73.9344, 40.81968],
    ],
    open: 1905,
  },
  {
    id: "university-heights-bridge",
    name: "University Heights Bridge",
    kind: "bridge",
    pts: [
      [-73.91343, 40.86215],
      [-73.91706, 40.8637],
    ],
    open: 1908,
  },
  {
    id: "pelham-bridge",
    name: "Pelham Bridge",
    kind: "bridge",
    pts: [
      [-73.81642, 40.86119],
      [-73.8151, 40.86307],
    ],
    open: 1908,
  },
  {
    id: "cross-bay-bridge",
    name: "Cross Bay Bridge",
    kind: "bridge",
    pts: [
      [-73.81948, 40.59085],
      [-73.82066, 40.59528],
    ],
    open: 1925,
  },
  {
    id: "roosevelt-island-bridge",
    name: "Welfare Island Bridge",
    kind: "bridge",
    pts: [
      [-73.94437, 40.76272],
      [-73.9467, 40.76391],
    ],
    open: 1955,
  },
  {
    id: "rikers-island-bridge",
    name: "Rikers Island Bridge",
    kind: "bridge",
    pts: [
      [-73.89235, 40.77586],
      [-73.88495, 40.78705],
    ],
    open: 1966,
  },
];

export const ferries: Structure[] = [
  {
    id: "fulton-ferry",
    name: "Fulton Ferry",
    kind: "ferry",
    pts: [
      [-74.0029, 40.7068],
      [-73.9962, 40.7036],
    ],
    open: 1642,
    close: 1924,
  },
  {
    id: "south-ferry",
    name: "South Ferry (Atlantic Av.)",
    kind: "ferry",
    pts: [
      [-74.0125, 40.7015],
      [-73.998, 40.69],
    ],
    open: 1836,
    close: 1933,
  },
  {
    id: "si-ferry",
    name: "Staten Island Ferry",
    kind: "ferry",
    pts: [
      [-74.0125, 40.7008],
      [-74.0728, 40.6438],
    ],
    open: 1817,
  },
  {
    id: "williamsburg-ferry",
    name: "Williamsburgh Ferry",
    kind: "ferry",
    pts: [
      [-74.0008, 40.7085],
      [-73.972, 40.7085],
      [-73.9658, 40.7125],
    ],
    open: 1818,
    close: 1908,
  },
  {
    id: "hunters-point-ferry",
    name: "34th St. Ferry",
    kind: "ferry",
    pts: [
      [-73.9715, 40.7438],
      [-73.9582, 40.7415],
    ],
    open: 1859,
    close: 1925,
  },
  // Ends at the street or terminal each used, set just off the shore as
  // the map draws it; dates from Wikipedia's lists of East and Hudson
  // River ferries.
  {
    id: "communipaw-ferry",
    name: "Communipaw Ferry",
    kind: "ferry",
    pts: [
      [-74.01854, 40.71016],
      [-74.03457, 40.70722],
    ],
    open: 1661,
    close: 1967,
  },
  {
    id: "paulus-hook",
    name: "Paulus Hook Ferry (Jersey City)",
    kind: "ferry",
    pts: [
      [-74.01836, 40.71086],
      [-74.03051, 40.71611],
    ],
    open: 1764,
    close: 1949,
  },
  {
    id: "catharine-ferry",
    name: "Catharine Ferry",
    kind: "ferry",
    pts: [
      [-73.99551, 40.7088],
      [-73.99108, 40.70424],
    ],
    open: 1795,
    close: 1912,
  },
  {
    id: "hoboken-ferry",
    name: "Hoboken Ferry (Barclay St.)",
    kind: "ferry",
    pts: [
      [-74.01765, 40.71444],
      [-74.01932, 40.735],
    ],
    open: 1821,
    close: 1967,
  },
  {
    id: "peck-slip-ferry",
    name: "Peck Slip Ferry",
    kind: "ferry",
    pts: [
      [-74.00054, 40.70698],
      [-73.9935, 40.7058],
      [-73.98, 40.7062],
      [-73.9735, 40.708],
      [-73.96991, 40.71073],
    ],
    open: 1836,
    close: 1860,
  },
  {
    id: "christopher-ferry",
    name: "Christopher St. Ferry",
    kind: "ferry",
    pts: [
      [-74.0148, 40.7329],
      [-74.01932, 40.735],
    ],
    open: 1838,
    close: 1955,
  },
  {
    id: "hamilton-ave-ferry",
    name: "Hamilton Avenue Ferry",
    kind: "ferry",
    pts: [
      [-74.01214, 40.70048],
      [-74.0085, 40.693],
      [-74.01164, 40.68466],
    ],
    open: 1846,
    close: 1942,
  },
  {
    id: "wall-street-ferry",
    name: "Wall Street Ferry",
    kind: "ferry",
    pts: [
      [-74.00574, 40.70383],
      [-73.99985, 40.69603],
    ],
    open: 1853,
    close: 1912,
  },
  {
    id: "pavonia-ferry",
    name: "Pavonia Ferry (Chambers St.)",
    kind: "ferry",
    pts: [
      [-74.01708, 40.71773],
      [-74.02135, 40.72668],
    ],
    open: 1856,
    close: 1958,
  },
  {
    id: "desbrosses-ferry",
    name: "Desbrosses St. Ferry",
    kind: "ferry",
    pts: [
      [-74.01236, 40.72352],
      [-74.03051, 40.71611],
    ],
    open: 1862,
    close: 1930,
  },
  {
    id: "weehawken-ferry",
    name: "Weehawken Ferry (42nd St.)",
    kind: "ferry",
    pts: [
      [-74.0045, 40.764],
      [-74.00583, 40.7685],
    ],
    open: 1884,
    close: 1959,
  },
  {
    id: "edgewater-ferry",
    name: "125th St. Ferry",
    kind: "ferry",
    pts: [
      [-73.96229, 40.81813],
      [-73.96978, 40.818],
    ],
    open: 1903,
    close: 1941,
  },
  {
    id: "englewood-ferry",
    name: "Englewood Ferry (Dyckman St.)",
    kind: "ferry",
    pts: [
      [-73.93284, 40.86727],
      [-73.94221, 40.868],
    ],
    open: 1915,
    close: 1942,
  },
];
