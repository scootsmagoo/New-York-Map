import type { InfrastructureLine } from "../types";
import { avenuePolyline } from "../lib/grid";

/**
 * Dated linear infrastructure — els, early subway, and the Croton Aqueduct.
 * Els and subway routes are sampled from the 1811 grid bearing so they track
 * real avenue corridors; the aqueduct is hand-placed north of the city.
 */

/** Meters along-avenue from the First Street row. */
const DOWNTOWN = -900;
const MIDTOWN = 6500;
const HARLEM = 12500;
const INWOOD = 16800;

export const infrastructureLines: InfrastructureLine[] = [
  {
    id: "croton-aqueduct",
    name: "Croton Aqueduct",
    kind: "aqueduct",
    open: 1842,
    entryId: "croton",
    pts: [
      [-73.858, 41.02],
      [-73.872, 40.96],
      [-73.885, 40.91],
      [-73.898, 40.87],
      [-73.912, 40.845],
      [-73.9255, 40.8405],
      [-73.9325, 40.8405],
      [-73.938, 40.838],
      [-73.945, 40.832],
      [-73.952, 40.822],
      [-73.958, 40.81],
      [-73.965, 40.798],
      [-73.972, 40.786],
      [-73.9765, 40.7795],
    ],
  },
  {
    id: "ninth-ave-el",
    name: "Ninth Avenue El",
    kind: "elevated",
    open: 1868,
    close: 1940,
    entryId: "el-railroads",
    // grid j=-7 ≈ 9th Ave
    pts: avenuePolyline(-7, DOWNTOWN, HARLEM),
  },
  {
    id: "sixth-ave-el",
    name: "Sixth Avenue El",
    kind: "elevated",
    open: 1878,
    close: 1938,
    entryId: "el-railroads",
    pts: avenuePolyline(-4, DOWNTOWN, MIDTOWN),
  },
  {
    id: "third-ave-el",
    name: "Third Avenue El",
    kind: "elevated",
    open: 1878,
    close: 1955,
    entryId: "el-railroads",
    pts: avenuePolyline(1, DOWNTOWN, INWOOD),
  },
  {
    id: "second-ave-el",
    name: "Second Avenue El",
    kind: "elevated",
    open: 1880,
    close: 1942,
    entryId: "el-railroads",
    pts: avenuePolyline(0, DOWNTOWN, HARLEM),
  },
  {
    id: "irt-broadway",
    name: "IRT Broadway line",
    kind: "subway",
    open: 1904,
    entryId: "subway-opens",
    // Broadway / 7th Ave corridor between 6th and 8th
    pts: avenuePolyline(-5, DOWNTOWN, HARLEM),
  },
  {
    id: "irt-lexington",
    name: "IRT Lexington Ave line",
    kind: "subway",
    open: 1904,
    entryId: "subway-opens",
    pts: avenuePolyline(2, DOWNTOWN, HARLEM),
  },
];
