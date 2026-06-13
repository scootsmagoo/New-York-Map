import type { ColonialStreet, StreetTier } from "../data/streets";
import { streetTier } from "../data/streets";
import { gridSegments, type Seg } from "./grid";

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

export interface GridLabelLayout {
  text: string;
  pos: [number, number];
  angle: number;
  opacity: number;
  tier: StreetTier;
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

function labelBBox(pos: [number, number], name: string, k: number): BBox {
  const w = Math.min(120, name.length * 5.6 + 6);
  const h = 12;
  const pad = 3 / k;
  return {
    x0: pos[0] - w / 2 - pad,
    y0: pos[1] - h / 2 - pad,
    x1: pos[0] + w / 2 + pad,
    y1: pos[1] + h / 2 + pad,
  };
}

function overlaps(a: BBox, b: BBox): boolean {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
}

/** Pick non-overlapping labels; higher tiers win. */
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

  candidates.sort(
    (a, b) =>
      TIER_RANK[streetTier(a.street)] - TIER_RANK[streetTier(b.street)] ||
      b.opacity - a.opacity
  );

  const placed: BBox[] = [];
  const out: StreetLabelLayout[] = [];

  for (const layout of candidates) {
    const box = labelBBox(layout.pos, layout.street.name, k);
    if (placed.some((p) => overlaps(p, box))) continue;
    placed.push(box);
    out.push(layout);
  }

  return out;
}

/** Avenue index (grid `j`) to display name. */
const AVE_NAMES: Record<number, string> = {
  [-8]: "10th Ave",
  [-6]: "8th Ave",
  [-4]: "6th Ave",
  [-2]: "4th Ave",
  [0]: "2nd Ave",
  [1]: "3rd Ave",
  [2]: "Lexington Ave",
  [3]: "5th Ave",
  [4]: "Madison Ave",
};

function segMidpoint(seg: Seg): [number, number] {
  return [(seg[0][0] + seg[1][0]) / 2, (seg[0][1] + seg[1][1]) / 2];
}

function segAngle(
  project: (c: [number, number]) => [number, number] | null,
  seg: Seg
): { pos: [number, number]; angle: number } | null {
  const a = project(seg[0]);
  const b = project(seg[1]);
  if (!a || !b) return null;
  let angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  if (angle > 90) angle -= 180;
  if (angle < -90) angle += 180;
  return {
    pos: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
    angle,
  };
}

/**
 * Labels for the procedural 1811 grid — avenues and every 10th street.
 * Only meaningful once the grid exists (1811+) and the user is zoomed in.
 */
export function layoutGridLabels(
  project: (c: [number, number]) => [number, number] | null,
  year: number,
  k: number,
  maxLat: number
): GridLabelLayout[] {
  if (year < 1811) return [];

  const { streets, avenues } = gridSegments();
  const candidates: GridLabelLayout[] = [];

  for (const [j, name] of Object.entries(AVE_NAMES)) {
    const idx = parseInt(j, 10);
    const aveSeg = avenues[idx + 10];
    if (!aveSeg) continue;
    const mid = segMidpoint(aveSeg);
    if (mid[1] > maxLat) continue;
    const layout = segAngle(project, aveSeg);
    if (!layout) continue;
    const opacity = streetLabelOpacity("major", k);
    if (opacity <= 0) continue;
    candidates.push({ text: name, ...layout, opacity, tier: "major" });
  }

  for (let i = 9; i < streets.length; i += 10) {
    const streetNum = i + 1;
    const seg = streets[i];
    const mid = segMidpoint(seg);
    if (mid[1] > maxLat) continue;
    const layout = segAngle(project, seg);
    if (!layout) continue;
    const tier: StreetTier = streetNum % 20 === 0 ? "secondary" : "minor";
    const opacity = streetLabelOpacity(tier, k);
    if (opacity <= 0) continue;
    candidates.push({
      text: `${streetNum}th St`,
      ...layout,
      opacity,
      tier,
    });
  }

  candidates.sort(
    (a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || b.opacity - a.opacity
  );

  const placed: BBox[] = [];
  const out: GridLabelLayout[] = [];

  for (const layout of candidates) {
    const box = labelBBox(layout.pos, layout.text, k);
    if (placed.some((p) => overlaps(p, box))) continue;
    placed.push(box);
    out.push(layout);
  }

  return out;
}
