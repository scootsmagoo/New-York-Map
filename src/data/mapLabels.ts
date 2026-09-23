/** Borough names on the map, era-aware (Breuckelen → Brooklyn, Westchester → The Bronx). */
export interface MapLabel {
  text: string;
  coords: [number, number];
  rotate?: number;
}

export function boroughLabels(year: number): MapLabel[] {
  if (year < 1609) return [];
  const labels: MapLabel[] = [
    { text: "MANHATTAN", coords: [-73.9619, 40.79], rotate: -61 },
    { text: year < 1664 ? "BREUCKELEN" : "BROOKLYN", coords: [-73.946, 40.6395] },
    { text: year < 1664 ? "STAATEN EYLANDT" : "STATEN ISLAND", coords: [-74.1525, 40.5715] },
  ];
  if (year >= 1683) {
    labels.push({ text: "QUEENS", coords: [-73.7945, 40.733] });
    labels.push({
      text: year < 1874 ? "WESTCHESTER" : "THE BRONX",
      coords: [-73.8585, 40.8655],
    });
  }
  return labels;
}
