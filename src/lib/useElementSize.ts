import { useEffect, useRef, useState } from "react";

export function useElementSize<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  width: number;
  height: number;
} {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setSize((prev) => {
        // A box that collapses for a moment (mid-rotation) keeps its last
        // size, rather than unmounting everything drawn at that size.
        const width = rect.width || prev.width;
        const height = rect.height || prev.height;
        return prev.width === width && prev.height === height ? prev : { width, height };
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, ...size };
}
