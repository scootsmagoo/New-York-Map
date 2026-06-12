import type { Structure } from "../types";

/**
 * Bridges and ferry routes, hand-placed. Visible while `open <= year <=
 * close`; ferries fade from the map as bridges retire them.
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
];
