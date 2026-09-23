import { TIME_MIN, TIME_MAX } from "../data/eras";

/**
 * The timeline is polylinear: the ~11,600 years of Lenapehoking are compressed
 * into a fixed fraction of the strip, while 1609–1945 gets the rest. Pan/zoom
 * operate on a visible window [u0, u1] in "unit space" [0, 1].
 */
export const BREAK_YEAR = 1609;
export const LENAPE_FRACTION = 0.14;

/** Narrowest allowed window in unit space (~2 years of the modern segment). */
export const MIN_WINDOW = 0.006;

const ancientSpan = BREAK_YEAR - TIME_MIN;
const modernSpan = TIME_MAX - BREAK_YEAR;

/** Year → unit position in [0, 1]. */
export function unitOfYear(year: number): number {
  if (year <= BREAK_YEAR) {
    return ((year - TIME_MIN) / ancientSpan) * LENAPE_FRACTION;
  }
  return (
    LENAPE_FRACTION + ((year - BREAK_YEAR) / modernSpan) * (1 - LENAPE_FRACTION)
  );
}

/** Unit position → year. */
export function yearOfUnit(u: number): number {
  if (u <= LENAPE_FRACTION) {
    return TIME_MIN + (u / LENAPE_FRACTION) * ancientSpan;
  }
  return (
    BREAK_YEAR + ((u - LENAPE_FRACTION) / (1 - LENAPE_FRACTION)) * modernSpan
  );
}

export interface TimeWindow {
  u0: number;
  u1: number;
}

/**
 * Limits the span, and keeps the window's center (the playhead) inside time.
 * The window itself may hang half off either end, so the first and last years
 * can sit under the playhead at any zoom.
 */
export function clampWindow(w: TimeWindow): TimeWindow {
  const span = Math.min(1, Math.max(MIN_WINDOW, w.u1 - w.u0));
  const center = Math.min(1, Math.max(0, (w.u0 + w.u1) / 2));
  return { u0: center - span / 2, u1: center + span / 2 };
}

/** Zoom the window by `factor` (>1 zooms in), keeping `uFixed` stationary at its screen position. */
export function zoomWindow(
  w: TimeWindow,
  factor: number,
  uFixed: number
): TimeWindow {
  const span = (w.u1 - w.u0) / factor;
  const rel = (uFixed - w.u0) / (w.u1 - w.u0);
  return clampWindow({ u0: uFixed - rel * span, u1: uFixed + (1 - rel) * span });
}

/** A window of `span` with `u` under the playhead. */
export function windowAround(u: number, span: number): TimeWindow {
  return clampWindow({ u0: u - span / 2, u1: u + span / 2 });
}

export function panWindow(w: TimeWindow, deltaUnits: number): TimeWindow {
  return clampWindow({ u0: w.u0 + deltaUnits, u1: w.u1 + deltaUnits });
}

export function yearToX(year: number, w: TimeWindow, width: number): number {
  return ((unitOfYear(year) - w.u0) / (w.u1 - w.u0)) * width;
}

export function xToYear(x: number, w: TimeWindow, width: number): number {
  return yearOfUnit(w.u0 + (x / width) * (w.u1 - w.u0));
}

export interface Tick {
  year: number;
  x: number;
  major: boolean;
}

const STEPS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

/**
 * Generates ticks for the visible window, treating the ancient and modern
 * segments separately since their pixels-per-year differ wildly.
 */
export function ticksFor(w: TimeWindow, width: number): Tick[] {
  const ticks: Tick[] = [];
  const pxPerUnit = width / (w.u1 - w.u0);

  const segments: { from: number; to: number; unitPerYear: number }[] = [
    { from: TIME_MIN, to: BREAK_YEAR, unitPerYear: LENAPE_FRACTION / ancientSpan },
    { from: BREAK_YEAR, to: TIME_MAX, unitPerYear: (1 - LENAPE_FRACTION) / modernSpan },
  ];

  const tVisible0 = yearOfUnit(w.u0);
  const tVisible1 = yearOfUnit(w.u1);

  for (const seg of segments) {
    const from = Math.max(seg.from, tVisible0);
    const to = Math.min(seg.to, tVisible1);
    if (from >= to) continue;
    const pxPerYear = pxPerUnit * seg.unitPerYear;
    const step =
      STEPS.find((s) => s * pxPerYear >= 72) ?? STEPS[STEPS.length - 1];
    const start = Math.ceil(from / step) * step;
    for (let year = start; year <= to; year += step) {
      ticks.push({
        year,
        x: yearToX(year, w, width),
        major: year % (step * 2) === 0,
      });
    }
  }
  return ticks;
}

export const FULL_WINDOW: TimeWindow = { u0: 0, u1: 1 };
