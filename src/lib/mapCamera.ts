/**
 * A shared camera for maps shown side by side (Then & Now compare): whichever
 * map the user pans or zooms publishes its transform, and the others follow.
 */
export interface CameraTransform {
  k: number;
  x: number;
  y: number;
}

/** `settled` marks the end of a gesture or flight. */
type Listener = (t: CameraTransform, source: symbol, settled: boolean) => void;

export interface CameraLink {
  /** The last published transform, so a map that mounts later can catch up. */
  readonly current: CameraTransform | null;
  publish(t: CameraTransform, source: symbol, settled?: boolean): void;
  subscribe(fn: Listener): () => void;
}

export function createCameraLink(): CameraLink {
  const listeners = new Set<Listener>();
  let current: CameraTransform | null = null;
  return {
    get current() {
      return current;
    },
    publish(t, source, settled = false) {
      current = { k: t.k, x: t.x, y: t.y };
      for (const fn of listeners) fn(current, source, settled);
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}

/** Pinned comparison year from a deep link like #year=1900&compare=1776. */
export function compareYearFromHash(hash: string): number | null {
  const m = hash.match(/compare=(-?\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * The "Then" year a compare opens with: the latest footprint snapshot at
 * least half a century back, so the two halves differ at a glance. Before the
 * snapshots begin, the Lenape world of 1500 stands in.
 */
export function defaultThenYear(now: number, snapshotYears: number[]): number {
  const earlier = snapshotYears.filter((y) => y <= now - 50);
  if (earlier.length) return Math.max(...earlier);
  return now > 1500 ? 1500 : now - 1000;
}

/** A typed year, clamped to the timeline; null if it isn't a number. */
export function parseYearInput(text: string, min: number, max: number): number | null {
  const m = text.trim().match(/^(-?\d+)\s*(bce|bc)?$/i);
  if (!m) return null;
  const n = parseInt(m[1], 10) * (m[2] ? -1 : 1);
  return Math.max(min, Math.min(max, n));
}
