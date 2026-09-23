import { memo, useMemo } from "react";
import {
  neighborhoodName,
  neighborhoodOpacity,
  neighborhoods,
} from "../data/neighborhoods";
import { declutterLabels, type LabelCandidate } from "../lib/streetLabels";
import { boroughLabels } from "../data/mapLabels";

interface NeighborhoodLayerProps {
  project: ((c: [number, number]) => [number, number] | null) | null;
  year: number;
  k: number;
}

function fade(k: number, from: number, to: number): number {
  return Math.max(0, Math.min(1, (k - from) / (to - from)));
}

/** Neighborhood and village names as they were in `year`; major places first. */
function NeighborhoodLayerInner({ project, year, k }: NeighborhoodLayerProps) {
  const labels = useMemo(() => {
    if (!project) return [];
    const majorFade = fade(k, 1.2, 1.7);
    const minorFade = fade(k, 2.1, 2.8);
    // Borough names are drawn elsewhere; entered here only as obstacles, so a
    // neighborhood never lands on BROOKLYN. Unrotated ones only: a tilted
    // box would block a whole swath of Manhattan.
    const candidates: LabelCandidate[] = [];
    for (const b of boroughLabels(year)) {
      const pos = project(b.coords);
      if (!pos || b.rotate) continue;
      candidates.push({ key: `boro-${b.text}`, text: b.text, pos, angle: 0, opacity: 1, rank: -1, charW: 13 });
    }
    for (const nb of neighborhoods) {
      const name = neighborhoodName(nb, year);
      if (!name) continue;
      const opacity = neighborhoodOpacity(nb, year) * (nb.major ? majorFade : minorFade);
      if (opacity <= 0.02) continue;
      const pos = project(nb.coords);
      if (!pos) continue;
      candidates.push({
        key: nb.id,
        text: name,
        pos,
        angle: 0,
        opacity,
        rank: nb.major ? 0 : 1,
        charW: 7.4,
      });
    }
    return declutterLabels(candidates, k).filter((l) => l.rank >= 0);
  }, [project, year, k]);

  return (
    <g className="neighborhood-layer">
      {labels.map((l) => (
        <text
          key={l.key}
          className="neighborhood-label"
          transform={`translate(${l.pos[0]},${l.pos[1]}) scale(${1 / k})`}
          textAnchor="middle"
          dominantBaseline="middle"
          style={l.opacity < 1 ? { opacity: l.opacity } : undefined}
        >
          {l.text}
        </text>
      ))}
    </g>
  );
}

export const NeighborhoodLayer = memo(NeighborhoodLayerInner);
