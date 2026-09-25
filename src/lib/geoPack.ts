/** A borough as scripts/pack-geo.mjs writes it: delta-encoded 1e-5° steps. */
export interface PackedBorough {
  boro: string;
  /** Polygons → rings → [dx0, dy0, dx1, dy1, …], the first absolute. */
  p: number[][][];
}

/** Unpack to GeoJSON features with a MultiPolygon per borough. */
export function unpackBoroughs(packed: PackedBorough[]) {
  return {
    type: "FeatureCollection" as const,
    features: packed.map((b) => ({
      type: "Feature" as const,
      properties: { boro: b.boro },
      geometry: {
        type: "MultiPolygon" as const,
        coordinates: b.p.map((rings) =>
          rings.map((flat) => {
            const ring: [number, number][] = [];
            let x = 0;
            let y = 0;
            for (let i = 0; i < flat.length; i += 2) {
              x += flat[i];
              y += flat[i + 1];
              ring.push([x / 1e5, y / 1e5]);
            }
            return ring;
          })
        ),
      },
    })),
  };
}
