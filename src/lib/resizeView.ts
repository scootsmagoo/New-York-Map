/**
 * The map refits its projection to the box whenever the box changes size
 * (a phone turning, a window resized). Without help that throws away the
 * view; this keeps the same place in the middle at the same zoom.
 */
export interface ViewTransform {
  k: number;
  x: number;
  y: number;
}

type Projection = {
  (c: [number, number]): [number, number] | null;
  invert?: (p: [number, number]) => [number, number] | null;
};

export function carryViewAcrossResize(
  t: ViewTransform,
  before: { projection: Projection; width: number; height: number },
  after: { projection: Projection; width: number; height: number }
): ViewTransform {
  // The point under the middle of the old box, in the old projection's plane…
  const px = (before.width / 2 - t.x) / t.k;
  const py = (before.height / 2 - t.y) / t.k;
  const geo = before.projection.invert?.([px, py]);
  const p = geo ? after.projection(geo) : null;
  if (!p) return { k: 1, x: 0, y: 0 };
  // …goes under the middle of the new one.
  return { k: t.k, x: after.width / 2 - p[0] * t.k, y: after.height / 2 - p[1] * t.k };
}
