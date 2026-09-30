import { memo, useMemo } from "react";
import geometry from "../data/geo/highways.json";
import { highwayOpen, highways } from "../data/highways";
import type { Entry } from "../types";
import { allEntries } from "../data/entries";
import { unpackRing } from "../lib/geoPack";

const packed = geometry as unknown as { q: number; roads: Record<string, number[][]> };

interface HighwayLayerProps {
  project: ((c: [number, number]) => [number, number] | null) | null;
  year: number;
  /** 0–1: roads fade in as you zoom past the whole-city view. */
  fade: number;
  onSelectEntry: (entry: Entry) => void;
}

/** Parkways, expressways, and road tunnels, each from the year it opened. */
function HighwayLayerInner({ project, year, fade, onSelectEntry }: HighwayLayerProps) {
  const roads = useMemo(() => {
    if (!project) return [];
    return highways.map((h) => ({
      h,
      entry: h.entryId ? allEntries.find((e) => e.id === h.entryId) : undefined,
      d: (packed.roads[h.id] ?? [])
        .map((flat) =>
          unpackRing(flat, packed.q)
            .map((c, i) => {
              const p = project(c);
              return p ? `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}` : "";
            })
            .join("")
        )
        .join(""),
    }));
  }, [project]);

  if (fade <= 0) return null;
  const open = roads.filter(({ h }) => highwayOpen(h, year));
  return (
    <g className="highway-layer" style={fade < 1 ? { opacity: fade } : undefined}>
      {open.map(({ h, d, entry }) => (
        <g key={h.id} className={`highway highway-${h.kind}`}>
          {h.kind === "expressway" && <path className="highway-casing" d={d} />}
          <path
            className="highway-line"
            d={d}
            onClick={entry ? () => onSelectEntry(entry) : undefined}
            style={entry ? { cursor: "pointer", pointerEvents: "stroke" } : undefined}
          >
            <title>{`${h.name} (${h.built ?? h.open}) — ${h.note}`}</title>
          </path>
        </g>
      ))}
    </g>
  );
}

export const HighwayLayer = memo(HighwayLayerInner);
