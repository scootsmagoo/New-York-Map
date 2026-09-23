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
