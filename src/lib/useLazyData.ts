import { useEffect, useState } from "react";

/** How long after mounting to fetch anyway, when the browser has no idle callback. */
const IDLE_FALLBACK_MS = 2500;

/**
 * Data a layer draws only once you zoom in: kept out of the first load, then
 * fetched as soon as it's `needed`, or when the browser is first idle,
 * whichever comes first, so zooming in rarely waits for it.
 */
export function useLazyData<T>(load: () => Promise<T>, needed: boolean): T | null {
  const [data, setData] = useState<T | null>(null);
  const [wanted, setWanted] = useState(needed);
  if (needed && !wanted) setWanted(true);

  useEffect(() => {
    if (wanted) return;
    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(() => setWanted(true), { timeout: IDLE_FALLBACK_MS * 2 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setWanted(true), IDLE_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [wanted]);

  useEffect(() => {
    if (!wanted) return;
    let alive = true;
    load().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, [wanted, load]);

  return data;
}
