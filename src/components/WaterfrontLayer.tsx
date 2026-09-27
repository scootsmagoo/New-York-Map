import { memo, useMemo } from "react";
import {
  waterfront,
  waterfrontDates,
  waterfrontOpacity,
  type WaterfrontKind,
} from "../data/waterfront";
import { declutterLabels, type LabelCandidate } from "../lib/streetLabels";

interface WaterfrontLayerProps {
  project: ((c: [number, number]) => [number, number] | null) | null;
  year: number;
  k: number;
}

/** A small symbol per kind, drawn at screen size (the caller scales by 1/k). */
export function WaterfrontGlyph({ kind }: { kind: WaterfrontKind }) {
  switch (kind) {
    case "market": // a market stall's awning
      return <path d="M-5 -1 L0 -5 L5 -1 Z M-4 -1 H4 V4 H-4 Z" />;
    case "shipyard": // a hull on the ways
      return <path d="M-6 -1 H6 L3.5 3.5 H-3.5 Z M-0.8 -6 H0.8 V-1 H-0.8 Z" />;
    case "sugar": // a sugar loaf
      return <path d="M0 -6 L4 4 H-4 Z" />;
    case "dock": // a pier running out from the bulkhead
      return <path d="M-6 -4 H-3 V4 H-6 Z M-3 -1.5 H6 V1.5 H-3 Z" />;
  }
}

function fade(k: number, from: number, to: number): number {
  return Math.max(0, Math.min(1, (k - from) / (to - from)));
}

/** Markets, shipyards, sugar houses, and docks, each while it worked. */
function WaterfrontLayerInner({ project, year, k }: WaterfrontLayerProps) {
  const sites = useMemo(() => {
    if (!project) return [];
    return waterfront
      .map((s) => ({ s, opacity: waterfrontOpacity(s, year), pos: project(s.coords) }))
      .filter((v): v is typeof v & { pos: [number, number] } => v.opacity > 0 && v.pos !== null);
  }, [project, year]);

  // Names once zoomed toward the shore, decluttered; symbols always.
  const labelFade = fade(k, 2.4, 3.2);
  const labels = useMemo(() => {
    if (labelFade <= 0) return [];
    const candidates: LabelCandidate[] = sites.map(({ s, pos, opacity }) => ({
      key: s.id,
      text: s.name,
      // Set below the symbol: 12 screen px, in map units.
      pos: [pos[0], pos[1] + 12 / k],
      angle: 0,
      opacity,
      rank: 0,
      charW: 6,
    }));
    return declutterLabels(candidates, k);
  }, [sites, k, labelFade]);

  return (
    <g className="waterfront-layer">
      {sites.map(({ s, pos, opacity }) => (
        <g
          key={s.id}
          className={`waterfront-site waterfront-${s.kind}`}
          transform={`translate(${pos[0]},${pos[1]}) scale(${1 / k})`}
          style={opacity < 1 ? { opacity } : undefined}
        >
          <WaterfrontGlyph kind={s.kind} />
          <title>{`${s.name} (${waterfrontDates(s)}) — ${s.note}`}</title>
        </g>
      ))}
      {labels.map((l) => (
        <text
          key={l.key}
          className="waterfront-label"
          transform={`translate(${l.pos[0]},${l.pos[1]}) scale(${1 / k})`}
          style={{ opacity: labelFade * l.opacity }}
        >
          {l.text}
        </text>
      ))}
    </g>
  );
}

export const WaterfrontLayer = memo(WaterfrontLayerInner);
