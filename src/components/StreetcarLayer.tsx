import { memo, useMemo } from "react";
import geometry from "../data/geo/streetcars.json";
import { streetcarLines, streetcarPower } from "../data/streetcars";

interface StreetcarLayerProps {
  project: ((c: [number, number]) => [number, number] | null) | null;
  year: number;
}

const routes = geometry as unknown as Record<string, [number, number][][]>;

/**
 * Horsecar and trolley lines, each from its opening until buses replaced
 * it: dotted while horses pulled the cars, solid once they ran on
 * electricity.
 */
function StreetcarLayerInner({ project, year }: StreetcarLayerProps) {
  const paths = useMemo(() => {
    if (!project) return [];
    return streetcarLines.map((line) => ({
      line,
      d: (routes[line.id] ?? [])
        .map((leg) =>
          leg
            .map((c, i) => {
              const p = project(c);
              return p ? `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}` : "";
            })
            .join("")
        )
        .join(""),
    }));
  }, [project]);

  return (
    <g className="streetcar-layer">
      {paths.map(({ line, d }) => {
        const power = streetcarPower(line, year);
        if (!power) return null;
        const dates = `${line.open}–${line.close ?? ""}`;
        return (
          <path key={line.id} className={`streetcar streetcar-${power}`} d={d}>
            <title>{`${line.name} (${dates}, ${power === "horse" ? "horsecars" : "electric"}) — ${line.note}`}</title>
          </path>
        );
      })}
    </g>
  );
}

export const StreetcarLayer = memo(StreetcarLayerInner);
