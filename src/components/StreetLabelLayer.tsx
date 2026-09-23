import { memo, useEffect, useMemo, useState } from "react";
import type { ZoomTransform } from "d3-zoom";
import { colonialStreets, streetTier } from "../data/streets";
import {
  buildStreetLabelIndex,
  declutterLabels,
  layoutStreetLabels,
  queryStreetLabels,
  type LabelCandidate,
  type StreetLabelData,
} from "../lib/streetLabels";

interface StreetLabelLayerProps {
  project: ((c: [number, number]) => [number, number] | null) | null;
  year: number;
  /** Zoom scale, updated per level-of-detail band and when a gesture ends. */
  k: number;
  width: number;
  height: number;
  getTransform: () => ZoomTransform;
  /** Calls back when a pan or zoom settles; returns an unsubscribe. */
  onViewSettled: (fn: () => void) => () => void;
  /** Fades the layer with the rest of the street detail. */
  fade: number;
}

// Loaded once, on first use: ~180 KB gzipped, so it stays out of the main
// bundle until someone turns street names on.
let dataPromise: Promise<StreetLabelData> | null = null;
function loadStreetLabels(): Promise<StreetLabelData> {
  dataPromise ??= import("../data/geo/streetLabels.json").then(
    (m) => m.default as unknown as StreetLabelData
  );
  return dataPromise;
}

const TIER_RANK = { major: 0, secondary: 1, minor: 2 } as const;

/**
 * Every named street in the city, decluttered to what fits on screen. Labels
 * are recomputed when the year, zoom band, or settled view changes — never
 * per frame during a pan, so they cost nothing while the map moves.
 */
function StreetLabelLayerInner({
  project,
  year,
  k,
  width,
  height,
  getTransform,
  onViewSettled,
  fade,
}: StreetLabelLayerProps) {
  const [data, setData] = useState<StreetLabelData | null>(null);
  const [viewTick, setViewTick] = useState(0);

  useEffect(() => {
    let alive = true;
    loadStreetLabels().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => onViewSettled(() => setViewTick((t) => t + 1)), [onViewSettled]);

  const index = useMemo(
    () => (data && project ? buildStreetLabelIndex(data, project) : null),
    [data, project]
  );

  const labels = useMemo(() => {
    if (!project) return [];
    const t = getTransform();
    // The visible map rectangle, padded so a short pan doesn't reveal gaps.
    const x0 = -t.x / t.k;
    const y0 = -t.y / t.k;
    const w = width / t.k;
    const h = height / t.k;
    const visible = { x0, y0, x1: x0 + w, y1: y0 + h };
    const rect = { x0: x0 - w * 0.4, y0: y0 - h * 0.4, x1: x0 + w * 1.4, y1: y0 + h * 1.4 };

    // Hand-drawn colonial streets carry their own dates and win ties.
    const colonial: LabelCandidate[] = layoutStreetLabels(colonialStreets, project, year, k).map(
      (l) => ({
        key: `c-${l.street.id}`,
        // "Fulton Street (Brooklyn)" is told apart in the data, not on the map.
        text: l.street.name.replace(/ \(.*\)$/, ""),
        pos: l.pos,
        angle: l.angle,
        opacity: l.opacity,
        rank: TIER_RANK[streetTier(l.street)] - 0.5,
      })
    );
    const modern = index ? queryStreetLabels(index, rect, year, k) : [];
    return declutterLabels([...colonial, ...modern], k, 180, visible);
    // viewTick: re-query after each settled pan/zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, project, year, k, width, height, viewTick]);

  if (fade <= 0) return null;
  return (
    <g className="street-label-layer" style={{ opacity: fade }}>
      {labels.map((l) => (
        <text
          key={l.key}
          className="street-label"
          transform={`translate(${l.pos[0]},${l.pos[1]}) rotate(${l.angle}) scale(${1 / k})`}
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

export const StreetLabelLayer = memo(StreetLabelLayerInner);
