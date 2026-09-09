import { useEffect, useState } from "react";

const PREFIX = "nycmap:settings:";

/**
 * useState that survives reloads via localStorage. Storage is best-effort:
 * private windows and blocked site data fall back to plain in-memory state.
 */
export function usePersistedState<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — persistence is a convenience.
    }
  }, [key, value]);

  return [value, setValue];
}
