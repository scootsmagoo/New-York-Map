import { memo, useMemo } from "react";
import type { Entry } from "../types";
import { calamities, calamityCenter, calamityOpacity } from "../data/calamities";
import { allEntries } from "../data/entries";

interface CalamityLayerProps {
  project: ((c: [number, number]) => [number, number] | null) | null;
  year: number;
  k: number;
  onSelectEntry: (entry: Entry) => void;
}

/**
 * Great fires' burned districts and epidemics' worst-hit quarters, shown
 * in their years and fading after. A burned district stays while its ruins
 * did.
 */
function CalamityLayerInner({ project, year, k, onSelectEntry }: CalamityLayerProps) {
  const shapes = useMemo(() => {
    if (!project) return [];
    return calamities.map((c) => {
      let d = "";
      let x0 = Infinity;
      let x1 = -Infinity;
      c.ring.forEach((pt, i) => {
        const p = project(pt);
        if (!p) return;
        d += `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`;
        x0 = Math.min(x0, p[0]);
        x1 = Math.max(x1, p[0]);
      });
      return {
        c,
        d: d + "Z",
        width: x1 - x0,
        labelAt: project(c.label ?? calamityCenter(c)),
        entry: c.entryId ? allEntries.find((e) => e.id === c.entryId) : undefined,
      };
    });
  }, [project]);

  return (
    <g className="calamity-layer">
      {shapes.map(({ c, d, width, labelAt, entry }) => {
        const opacity = calamityOpacity(c, year);
        if (opacity <= 0) return null;
        // Name an area once it's big enough on screen to see what the name
        // belongs to: the areas run from one block to a mile.
        const labelFade = Math.max(0, Math.min(1, (width * k - 30) / 10));
        return (
          <g key={c.id} className={`calamity calamity-${c.kind}`} style={opacity < 1 ? { opacity } : undefined}>
            <path
              d={d}
              onClick={entry ? () => onSelectEntry(entry) : undefined}
              style={entry ? { cursor: "pointer" } : undefined}
            >
              <title>{`${c.name} — ${c.note}`}</title>
            </path>
            {labelFade > 0 && labelAt && (
              <text
                className="calamity-label"
                transform={`translate(${labelAt[0]},${labelAt[1]}) scale(${1 / k})`}
                style={{ opacity: labelFade }}
              >
                {c.name}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export const CalamityLayer = memo(CalamityLayerInner);
