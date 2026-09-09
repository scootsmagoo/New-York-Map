import { useEffect, useRef, useState } from "react";

/**
 * Throttle a value: the returned value trails the input by at most
 * `intervalMs`, and always settles on the latest input once it stops changing.
 *
 * Unlike a debounce, this keeps updating while the input changes every frame
 * (autoplay, timeline drags), so heavy children track the playhead at a
 * steady cadence instead of freezing until the gesture ends.
 */
export function useThrottledValue<T>(value: T, intervalMs: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastCommit = useRef(0);

  useEffect(() => {
    const wait = Math.max(0, lastCommit.current + intervalMs - performance.now());
    const t = window.setTimeout(() => {
      lastCommit.current = performance.now();
      setThrottled(value);
    }, wait);
    return () => window.clearTimeout(t);
  }, [value, intervalMs]);

  return throttled;
}
