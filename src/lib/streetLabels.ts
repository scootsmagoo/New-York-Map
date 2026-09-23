import type { ColonialStreet, StreetTier } from "../data/streets";
import { streetTier } from "../data/streets";

function fade(k: number, from: number, to: number): number {
  return Math.max(0, Math.min(1, (k - from) / (to - from)));
}

/** Label opacity by street importance and map zoom (sparse until zoomed in). */
export function streetLabelOpacity(tier: StreetTier, k: number): number {
  switch (tier) {
    case "major":
      return fade(k, 3.2, 4.0);
    case "secondary":
      return fade(k, 4.0, 4.8);
    case "minor":
      return fade(k, 4.8, 5.8);
  }
}

const TIER_RANK: Record<StreetTier, number> = {
  major: 0,
  secondary: 1,
  minor: 2,
};

export interface StreetLabelLayout {
  street: ColonialStreet;
  pos: [number, number];
  angle: number;
  opacity: number;
}

interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Midpoint and tangent angle along a projected polyline (screen space). */
export function pathMidpointAndAngle(
  projected: [number, number][]
): { pos: [number, number]; angle: number } {
  if (projected.length === 1) {
    return { pos: projected[0], angle: 0 };
  }

  let total = 0;
  const lengths: number[] = [];
  for (let i = 0; i < projected.length - 1; i++) {
    const a = projected[i];
    const b = projected[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    lengths.push(len);
    total += len;
  }

  let remain = total / 2;
  for (let i = 0; i < lengths.length; i++) {
    const seg = lengths[i];
    if (remain <= seg || i === lengths.length - 1) {
      const t = seg > 0 ? Math.min(1, remain / seg) : 0;
      const a = projected[i];
      const b = projected[i + 1];
      let angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;
      return {
        pos: [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])],
        angle,
      };
    }
    remain -= seg;
  }

  const last = projected[projected.length - 1];
  return { pos: last, angle: 0 };
}

function overlaps(a: BBox, b: BBox): boolean {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
}

/** Candidate labels for the hand-drawn streets named in `year`, most important first. */
export function layoutStreetLabels(
  streets: ColonialStreet[],
  project: (c: [number, number]) => [number, number] | null,
  year: number,
  k: number
): StreetLabelLayout[] {
  const candidates: StreetLabelLayout[] = [];

  for (const street of streets) {
    if (year < street.from || (street.to !== undefined && year > street.to)) {
      continue;
    }
    const tier = streetTier(street);
    const opacity = streetLabelOpacity(tier, k);
    if (opacity <= 0) continue;

    const projected = street.pts
      .map((p) => project(p))
      .filter((p): p is [number, number] => p !== null);
    if (projected.length < 1) continue;

    const { pos, angle } = pathMidpointAndAngle(projected);
    candidates.push({ street, pos, angle, opacity });
  }

  return candidates.sort(
    (a, b) =>
      TIER_RANK[streetTier(a.street)] - TIER_RANK[streetTier(b.street)] ||
      b.opacity - a.opacity
  );
}

// ----- The full street-name layer (NYC street centerlines) -----

/** As written by scripts/prepare-streets.mjs. */
export interface StreetLabelData {
  names: string[];
  /** [lon, lat (1e-5° from -74.3, 40.45), angle°, from, to (0 = open), name, tier]. */
  anchors: number[][];
}

const TIERS: StreetTier[] = ["major", "secondary", "minor"];

/** Anchors projected to map (k = 1) coordinates and bucketed for lookup. */
export interface StreetLabelIndex {
  data: StreetLabelData;
  xs: Float32Array;
  ys: Float32Array;
  cell: number;
  buckets: Map<number, number[]>;
}

const bucketKey = (cx: number, cy: number) => cx * 100003 + cy;

export function buildStreetLabelIndex(
  data: StreetLabelData,
  project: (c: [number, number]) => [number, number] | null,
  cell = 40
): StreetLabelIndex {
  const n = data.anchors.length;
  const xs = new Float32Array(n);
  const ys = new Float32Array(n);
  const buckets = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const a = data.anchors[i];
    const p = project([a[0] / 1e5 - 74.3, a[1] / 1e5 + 40.45]);
    if (!p) {
      xs[i] = NaN;
      continue;
    }
    xs[i] = p[0];
    ys[i] = p[1];
    const key = bucketKey(Math.floor(p[0] / cell), Math.floor(p[1] / cell));
    let b = buckets.get(key);
    if (!b) buckets.set(key, (b = []));
    b.push(i);
  }
  return { data, xs, ys, cell, buckets };
}

export interface LabelCandidate {
  key: string;
  text: string;
  /** Map (k = 1) coordinates. */
  pos: [number, number];
  angle: number;
  opacity: number;
  /** Lower wins a collision. */
  rank: number;
  /** Average glyph width in px, for sizing the label's box (default 5.6). */
  charW?: number;
}

/** Anchors inside a map-space rectangle that are named in `year` and visible at zoom `k`. */
export function queryStreetLabels(
  index: StreetLabelIndex,
  rect: { x0: number; y0: number; x1: number; y1: number },
  year: number,
  k: number
): LabelCandidate[] {
  const { data, xs, ys, cell, buckets } = index;
  const out: LabelCandidate[] = [];
  const opacityByTier = TIERS.map((t) => streetLabelOpacity(t, k));
  const cx0 = Math.floor(rect.x0 / cell);
  const cx1 = Math.floor(rect.x1 / cell);
  const cy0 = Math.floor(rect.y0 / cell);
  const cy1 = Math.floor(rect.y1 / cell);
  for (let cx = cx0; cx <= cx1; cx++) {
    for (let cy = cy0; cy <= cy1; cy++) {
      const b = buckets.get(bucketKey(cx, cy));
      if (!b) continue;
      for (const i of b) {
        const [, , angle, from, to, name, tier] = data.anchors[i];
        if (year < from || (to !== 0 && year > to)) continue;
        const opacity = opacityByTier[tier];
        if (opacity <= 0) continue;
        const x = xs[i];
        const y = ys[i];
        if (x < rect.x0 || x > rect.x1 || y < rect.y0 || y > rect.y1) continue;
        // Mercator is conformal, so the ground angle is the screen angle
        // (flipped: screen y points down). Keep text upright.
        let a = -angle;
        if (a > 90) a -= 180;
        if (a < -90) a += 180;
        out.push({ key: `a${i}`, text: data.names[name], pos: [x, y], angle: a, opacity, rank: tier });
      }
    }
  }
  return out;
}

const CHAR_W = 5.6;
const LABEL_H = 12;
const PAD = 3;

/**
 * Keep the most important labels that fit without touching. At most `cap`
 * of them inside `visible` (map coordinates; labels in the margin beyond it
 * are kept so a short pan shows them, but don't count). Boxes are the label's
 * on-screen size (text doesn't scale with the map), rotated with the street,
 * in a spatial hash so this stays linear.
 */
export function declutterLabels(
  candidates: LabelCandidate[],
  k: number,
  cap = 180,
  visible?: { x0: number; y0: number; x1: number; y1: number }
): LabelCandidate[] {
  const sorted = [...candidates].sort((a, b) => a.rank - b.rank || b.opacity - a.opacity);
  const cell = 60;
  const grid = new Map<number, BBox[]>();
  const out: LabelCandidate[] = [];
  let shown = 0;
  for (const c of sorted) {
    const onScreen =
      !visible ||
      (c.pos[0] >= visible.x0 && c.pos[0] <= visible.x1 && c.pos[1] >= visible.y0 && c.pos[1] <= visible.y1);
    if (onScreen && shown >= cap) continue;
    if (!onScreen && out.length - shown >= cap) continue;
    const w = c.text.length * (c.charW ?? CHAR_W) + 6;
    const rad = (c.angle * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const hw = (w * cos + LABEL_H * sin) / 2 + PAD;
    const hh = (w * sin + LABEL_H * cos) / 2 + PAD;
    const sx = c.pos[0] * k;
    const sy = c.pos[1] * k;
    const box = { x0: sx - hw, y0: sy - hh, x1: sx + hw, y1: sy + hh };
    const gx0 = Math.floor(box.x0 / cell);
    const gx1 = Math.floor(box.x1 / cell);
    const gy0 = Math.floor(box.y0 / cell);
    const gy1 = Math.floor(box.y1 / cell);
    let hit = false;
    for (let gx = gx0; gx <= gx1 && !hit; gx++) {
      for (let gy = gy0; gy <= gy1 && !hit; gy++) {
        const cellBoxes = grid.get(bucketKey(gx, gy));
        if (cellBoxes?.some((p) => overlaps(p, box))) hit = true;
      }
    }
    if (hit) continue;
    for (let gx = gx0; gx <= gx1; gx++) {
      for (let gy = gy0; gy <= gy1; gy++) {
        const key = bucketKey(gx, gy);
        let cellBoxes = grid.get(key);
        if (!cellBoxes) grid.set(key, (cellBoxes = []));
        cellBoxes.push(box);
      }
    }
    if (onScreen) shown++;
    out.push(c);
  }
  return out;
}
