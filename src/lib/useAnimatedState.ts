import {
  startTransition,
  useCallback,
  useState,
  type SetStateAction,
} from "react";

/**
 * useState whose updates always run as transitions, which is what lets a
 * <ViewTransition> around the thing it shows animate in and out. Use it for
 * panels and dialogs, never for state that changes every frame.
 */
export function useAnimatedState<T>(
  initial: T
): [T, (value: SetStateAction<T>) => void] {
  const [value, setNow] = useState(initial);
  const set = useCallback((next: SetStateAction<T>) => {
    startTransition(() => setNow(next));
  }, []);
  return [value, set];
}
