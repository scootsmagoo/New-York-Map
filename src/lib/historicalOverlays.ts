import {
  HISTORICAL_OVERLAYS,
  type HistoricalOverlay,
} from "../data/historicalOverlays";

export interface OverlayPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Project geographic bounds to SVG image placement (north-up). */
export function overlayPlacement(
  projection: (coords: [number, number]) => [number, number] | null,
  bounds: HistoricalOverlay["bounds"]
): OverlayPlacement | null {
  const sw = projection([bounds.west, bounds.south]);
  const ne = projection([bounds.east, bounds.north]);
  if (!sw || !ne) return null;
  return {
    x: sw[0],
    y: ne[1],
    width: ne[0] - sw[0],
    height: sw[1] - ne[1],
  };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x >= edge1 ? 1 : 0;
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Unimodal weight: ramps up to peak, then down across the overlay window. */
export function overlayAutoWeight(year: number, overlay: HistoricalOverlay): number {
  const { from, peak, to } = overlay.window;
  if (year < from || year > to) return 0;
  if (year <= peak) return smoothstep(from, peak, year);
  return 1 - smoothstep(peak, to, year);
}

/** Normalized auto weights for all overlays at a given year. */
export function overlayAutoWeights(year: number): Map<string, number> {
  const raw = HISTORICAL_OVERLAYS.map((o) => ({
    id: o.id,
    w: overlayAutoWeight(year, o),
  }));
  const sum = raw.reduce((s, x) => s + x.w, 0);
  const out = new Map<string, number>();
  if (sum <= 0) return out;
  for (const { id, w } of raw) {
    if (w > 0) out.set(id, w / sum);
  }
  return out;
}

/** Manual mode: show only the overlay whose peak year is nearest. */
export function overlayManualPick(year: number): string | null {
  let best: HistoricalOverlay | null = null;
  let bestDist = Infinity;
  for (const o of HISTORICAL_OVERLAYS) {
    const dist = Math.abs(year - o.year);
    if (dist < bestDist) {
      bestDist = dist;
      best = o;
    }
  }
  return best?.id ?? null;
}

export function activeOverlayLabel(
  year: number,
  auto: boolean,
  weights: Map<string, number>
): string {
  if (auto) {
    const entries = [...weights.entries()].filter(([, w]) => w > 0.05);
    if (entries.length === 0) return "None in range";
    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([id, w]) => {
        const o = HISTORICAL_OVERLAYS.find((x) => x.id === id)!;
        return w >= 0.95 ? o.shortLabel : `${o.shortLabel} ${Math.round(w * 100)}%`;
      })
      .join(" · ");
  }
  const id = overlayManualPick(year);
  const o = HISTORICAL_OVERLAYS.find((x) => x.id === id);
  return o?.shortLabel ?? "None";
}
