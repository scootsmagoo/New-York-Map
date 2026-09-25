/**
 * Hatch tiles with the angle built in. A `patternTransform` (rotate, or
 * scale(1/k) to hold the line pitch on screen) makes WebKit redraw the
 * pattern on every pan frame — the outer-borough street hatch alone cost a
 * third of the frame rate. Parallel lines at angle θ and perpendicular
 * spacing s repeat exactly in a (s / |sin θ|) × (s / |cos θ|) tile, so we
 * size that tile in map units for the current zoom and skip the transform.
 */
export interface HatchTile {
  width: number;
  height: number;
  /** Segments [x1, y1, x2, y2]; they overhang the tile, which clips them. */
  lines: [number, number, number, number][];
  strokeWidth: number;
}

/**
 * @param angleDeg line angle, clockwise from horizontal (SVG's rotate sense)
 * @param pitchPx spacing between lines on screen
 * @param strokePx line width on screen
 * @param k map zoom (screen px per map unit)
 */
export function hatchTile(angleDeg: number, pitchPx: number, strokePx: number, k: number): HatchTile {
  const s = pitchPx / k;
  const strokeWidth = strokePx / k;
  const theta = (Math.abs(angleDeg) * Math.PI) / 180;
  // Near-horizontal lines would need an enormous tile; draw them level.
  if (Math.sin(theta) < 0.02) {
    return { width: s, height: s, lines: [[-s, s / 2, 2 * s, s / 2]], strokeWidth };
  }
  const w = s / Math.sin(theta);
  const h = s / Math.cos(theta);
  // The line through the tile's corner plus its neighbors above and below,
  // so strokes that cross a tile edge aren't notched at the corners.
  const lines = [0, -h, h].map((c): [number, number, number, number] => {
    const y = (x: number) => (x * h) / w + c;
    const [x1, x2] = [-w, 2 * w];
    // Mirror for lines that climb to the right (negative angles).
    return angleDeg >= 0 ? [x1, y(x1), x2, y(x2)] : [x1, h - y(x1), x2, h - y(x2)];
  });
  return { width: w, height: h, lines, strokeWidth };
}
