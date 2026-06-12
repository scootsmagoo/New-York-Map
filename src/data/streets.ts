/**
 * Hand-drawn pre-grid roads — the colonial street skeleton. The 1811 grid is
 * generated procedurally in lib/grid.ts; these are the crooked survivors and
 * country roads that predate it. Coordinates are stylized.
 */

export interface ColonialStreet {
  id: string;
  name: string;
  pts: [number, number][];
  from: number;
  /** Year the road effectively disappeared (e.g., absorbed by the grid). */
  to?: number;
  /** Render a name label along the path at high zoom. */
  labeled?: boolean;
}

export const colonialStreets: ColonialStreet[] = [
  {
    id: "broadway",
    name: "Broadway",
    from: 1642,
    labeled: true,
    pts: [
      [-74.0135, 40.7045],
      [-74.0092, 40.7113],
      [-74.005, 40.719],
      [-74.0008, 40.7255],
      [-73.996, 40.731],
      [-73.989, 40.7425],
      [-73.9847, 40.75],
      [-73.9818, 40.756],
      [-73.9819, 40.7681],
      [-73.9818, 40.779],
      [-73.976, 40.787],
      [-73.972, 40.794],
      [-73.9665, 40.802],
      [-73.9626, 40.8075],
      [-73.9586, 40.8138],
      [-73.9525, 40.8267],
      [-73.9446, 40.835],
      [-73.9395, 40.8415],
      [-73.932, 40.852],
      [-73.9258, 40.8615],
      [-73.9195, 40.868],
      [-73.9135, 40.874],
    ],
  },
  {
    id: "bowery",
    name: "The Bowery",
    from: 1651,
    pts: [
      [-73.9985, 40.714],
      [-73.993, 40.7235],
      [-73.9905, 40.729],
      [-73.989, 40.7345],
    ],
  },
  {
    id: "boston-post-road",
    name: "Boston Post Road",
    from: 1672,
    to: 1865,
    labeled: true,
    pts: [
      [-73.989, 40.7345],
      [-73.9835, 40.744],
      [-73.976, 40.753],
      [-73.971, 40.7615],
      [-73.965, 40.769],
      [-73.957, 40.78],
      [-73.952, 40.79],
      [-73.9505, 40.7965],
      [-73.943, 40.8035],
      [-73.939, 40.8085],
    ],
  },
  {
    id: "wall-street",
    name: "Wall Street",
    from: 1653,
    pts: [
      [-74.0118, 40.7081],
      [-74.0045, 40.7045],
    ],
  },
  {
    id: "broad-street",
    name: "Broad Street",
    from: 1646,
    pts: [
      [-74.0111, 40.706],
      [-74.0117, 40.7018],
    ],
  },
  {
    id: "pearl-street",
    name: "Pearl Street",
    from: 1633,
    pts: [
      [-74.014, 40.7035],
      [-74.01, 40.7028],
      [-74.005, 40.7045],
      [-74.0008, 40.7085],
      [-73.9985, 40.712],
    ],
  },
  {
    id: "park-row",
    name: "Park Row",
    from: 1670,
    pts: [
      [-74.0078, 40.7115],
      [-74.004, 40.7128],
      [-73.9985, 40.714],
    ],
  },
  {
    id: "greenwich-street",
    name: "Greenwich Street",
    from: 1739,
    pts: [
      [-74.0152, 40.7045],
      [-74.0118, 40.715],
      [-74.0095, 40.7245],
      [-74.0078, 40.733],
      [-74.006, 40.739],
    ],
  },
  {
    id: "christopher-street",
    name: "Christopher Street",
    from: 1799,
    pts: [
      [-74.0105, 40.7332],
      [-74.0, 40.7338],
    ],
  },
  {
    id: "cherry-street",
    name: "Cherry Street",
    from: 1736,
    pts: [
      [-74.0, 40.7095],
      [-73.993, 40.7125],
      [-73.988, 40.7155],
    ],
  },
  {
    id: "maiden-lane",
    name: "Maiden Lane",
    from: 1696,
    pts: [
      [-74.0108, 40.709],
      [-74.004, 40.7065],
    ],
  },
  {
    id: "fulton-street",
    name: "Fulton Street",
    from: 1730,
    pts: [
      [-74.0092, 40.7113],
      [-74.0035, 40.7075],
    ],
  },
  {
    id: "kingsbridge-road",
    name: "Kingsbridge Road",
    from: 1693,
    pts: [
      [-73.939, 40.8085],
      [-73.933, 40.823],
      [-73.9282, 40.835],
      [-73.922, 40.852],
      [-73.918, 40.864],
      [-73.9135, 40.874],
    ],
  },
  {
    id: "brooklyn-ferry-road",
    name: "Ferry Road (Fulton St.)",
    from: 1704,
    labeled: true,
    pts: [
      [-73.9962, 40.7036],
      [-73.9895, 40.6925],
      [-73.983, 40.688],
      [-73.975, 40.683],
      [-73.965, 40.681],
      [-73.955, 40.679],
      [-73.945, 40.678],
      [-73.93, 40.6775],
      [-73.915, 40.678],
      [-73.9, 40.681],
      [-73.887, 40.687],
    ],
  },
  {
    id: "jamaica-road",
    name: "Jamaica Road",
    from: 1704,
    pts: [
      [-73.887, 40.687],
      [-73.86, 40.695],
      [-73.83, 40.7],
      [-73.805, 40.702],
    ],
  },
  {
    id: "flatbush-road",
    name: "Flatbush Road",
    from: 1652,
    pts: [
      [-73.9895, 40.6925],
      [-73.983, 40.68],
      [-73.976, 40.67],
      [-73.97, 40.662],
      [-73.964, 40.653],
      [-73.9615, 40.6495],
    ],
  },
  {
    id: "richmond-road",
    name: "Richmond Road",
    from: 1700,
    pts: [
      [-74.076, 40.642],
      [-74.087, 40.628],
      [-74.101, 40.613],
      [-74.118, 40.598],
      [-74.145, 40.58],
    ],
  },
];
