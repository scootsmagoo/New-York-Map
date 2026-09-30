import { memo, useEffect, useMemo, useState } from "react";
import { unpackRing } from "../lib/geoPack";

/** As written by scripts/prepare-housing.mjs. */
interface HousingData {
  q: number;
  developments: { name: string; year: number; apartments: number; rings: number[][] }[];
}

let dataPromise: Promise<HousingData> | null = null;
function loadHousing() {
  dataPromise ??= import("../data/geo/housing.json").then((m) => m.default as unknown as HousingData);
  return dataPromise;
}

interface HousingLayerProps {
  project: ((c: [number, number]) => [number, number] | null) | null;
  year: number;
}

/** The Housing Authority's developments, each from the year it was completed. */
function HousingLayerInner({ project, year }: HousingLayerProps) {
  const [data, setData] = useState<HousingData | null>(null);
  useEffect(() => {
    let alive = true;
    loadHousing().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);

  const shapes = useMemo(() => {
    if (!data || !project) return [];
    return data.developments.map((dev) => ({
      dev,
      d: dev.rings
        .map((flat) => {
          let s = "";
          unpackRing(flat, data.q).forEach((c, i) => {
            const p = project(c);
            if (p) s += `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`;
          });
          return s + "Z";
        })
        .join(""),
    }));
  }, [data, project]);

  return (
    <g className="housing-layer">
      {shapes
        .filter(({ dev }) => year >= dev.year)
        .map(({ dev, d }) => (
          <path key={dev.name} className="housing" d={d}>
            <title>{`${dev.name} (${dev.year}): ${dev.apartments.toLocaleString("en-US")} apartments`}</title>
          </path>
        ))}
    </g>
  );
}

export const HousingLayer = memo(HousingLayerInner);
