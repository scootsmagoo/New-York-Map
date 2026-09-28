import {
  HISTORICAL_OVERLAYS,
  type HistoricalOverlay,
} from "../data/historicalOverlays";

export interface OverlayPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
  /** SVG transform for sheets placed by control points. */
  transform?: string;
}

/**
 * Least-squares affine map from points `from` to `to`: returns [a, b, c, d,
 * e, f] with x' = a·x + c·y + e and y' = b·x + d·y + f (SVG matrix order).
 */
export function fitAffine(
  from: [number, number][],
  to: [number, number][]
): [number, number, number, number, number, number] | null {
  if (from.length < 3 || from.length !== to.length) return null;
  // Normal equations for [p, q, r] in out = p·x + q·y + r.
  const m = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const bx = [0, 0, 0];
  const by = [0, 0, 0];
  from.forEach(([x, y], i) => {
    const row = [x, y, 1];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) m[r][c] += row[r] * row[c];
      bx[r] += row[r] * to[i][0];
      by[r] += row[r] * to[i][1];
    }
  });
  const solve = (b: number[]) => {
    const a = m.map((row, i) => [...row, b[i]]);
    for (let i = 0; i < 3; i++) {
      let piv = i;
      for (let r = i + 1; r < 3; r++) if (Math.abs(a[r][i]) > Math.abs(a[piv][i])) piv = r;
      [a[i], a[piv]] = [a[piv], a[i]];
      if (Math.abs(a[i][i]) < 1e-12) return null;
      for (let r = 0; r < 3; r++) {
        if (r === i) continue;
        const f = a[r][i] / a[i][i];
        for (let c = i; c < 4; c++) a[r][c] -= f * a[i][c];
      }
    }
    return [a[0][3] / a[0][0], a[1][3] / a[1][1], a[2][3] / a[2][2]];
  };
  const px = solve(bx);
  const py = solve(by);
  if (!px || !py) return null;
  return [px[0], py[0], px[1], py[1], px[2], py[2]];
}

/** Project an overlay to SVG image placement: by control points, else north-up bounds. */
export function overlayPlacement(
  projection: (coords: [number, number]) => [number, number] | null,
  overlay: Pick<HistoricalOverlay, "bounds" | "gcps" | "size">
): OverlayPlacement | null {
  if (overlay.gcps && overlay.size) {
    const screen = overlay.gcps.map((g) => projection(g.lonlat));
    if (screen.some((p) => !p)) return null;
    const m = fitAffine(
      overlay.gcps.map((g) => g.px),
      screen as [number, number][]
    );
    if (!m) return null;
    return {
      x: 0,
      y: 0,
      width: overlay.size[0],
      height: overlay.size[1],
      transform: `matrix(${m.join(",")})`,
    };
  }
  const { bounds } = overlay;
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

/**
 * Auto weights for all overlays at a given year. Each sheet eases in toward
 * its date and out after; only where two windows overlap are they scaled
 * down to share. (Scaling a lone sheet up to 1 made it pop on and off at
 * the edges of its window.)
 */
export function overlayAutoWeights(year: number): Map<string, number> {
  const raw = HISTORICAL_OVERLAYS.map((o) => ({
    id: o.id,
    w: overlayAutoWeight(year, o),
  }));
  const sum = raw.reduce((s, x) => s + x.w, 0);
  const out = new Map<string, number>();
  if (sum <= 0) return out;
  const scale = sum > 1 ? 1 / sum : 1;
  for (const { id, w } of raw) {
    if (w > 0) out.set(id, w * scale);
  }
  return out;
}

/** Years over which manual mode crossfades from one sheet to the next. */
const MANUAL_CROSSFADE = 16;

/**
 * Manual mode: always a sheet, the nearest by date, crossfading into the
 * next over the years around the midpoint between them.
 */
export function overlayManualWeights(year: number): Map<string, number> {
  const sheets = [...HISTORICAL_OVERLAYS].sort((a, b) => a.year - b.year);
  const out = new Map<string, number>();
  for (let i = 0; i < sheets.length; i++) {
    const prev = sheets[i - 1];
    const next = sheets[i + 1];
    // Fully on between the midpoints to its neighbors, fading across each.
    const rise = prev ? smoothstep(mid(prev, sheets[i]) - MANUAL_CROSSFADE / 2, mid(prev, sheets[i]) + MANUAL_CROSSFADE / 2, year) : 1;
    const fall = next ? 1 - smoothstep(mid(sheets[i], next) - MANUAL_CROSSFADE / 2, mid(sheets[i], next) + MANUAL_CROSSFADE / 2, year) : 1;
    const w = Math.min(rise, fall);
    if (w > 0) out.set(sheets[i].id, w);
  }
  return out;
}

const mid = (a: HistoricalOverlay, b: HistoricalOverlay) => (a.year + b.year) / 2;

/** Manual mode's main sheet: the one whose date is nearest. */
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
