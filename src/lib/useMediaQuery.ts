import { useSyncExternalStore } from "react";

/** Whether a CSS media query matches, following it as it changes (a phone turning). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** A phone on its side: every pixel of height goes to the map. Matches styles.css. */
export const SHORT_SCREEN = "(max-height: 500px) and (orientation: landscape)";
