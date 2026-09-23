import { useRef } from "react";
import { eraForYear, formatYear } from "../data/eras";

interface CompareDividerProps {
  /** Divider position as a fraction of the map width (0–1). */
  position: number;
  onPositionChange: (p: number) => void;
  pinnedYear: number;
  liveYear: number;
  onClose: () => void;
}

const clampPos = (p: number) => Math.max(0.04, Math.min(0.96, p));

/**
 * The Then & Now seam: a draggable line with the pinned year on its left and
 * the timeline's year on its right.
 */
export function CompareDivider({
  position,
  onPositionChange,
  pinnedYear,
  liveYear,
  onClose,
}: CompareDividerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const moveTo = (clientX: number) => {
    const parent = rootRef.current?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    onPositionChange(clampPos((clientX - rect.left) / rect.width));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest(".compare-close")) return;
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if ((e.currentTarget as Element).hasPointerCapture(e.pointerId)) {
      moveTo(e.clientX);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === "ArrowLeft") onPositionChange(clampPos(position - step));
    else if (e.key === "ArrowRight") onPositionChange(clampPos(position + step));
    else if (e.key === "Escape") onClose();
    else return;
    // Keep the arrows from also panning the timeline.
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={rootRef}
      className="compare-divider"
      style={{ left: `${position * 100}%` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <div className="compare-line" />
      <div
        className="compare-knob"
        role="slider"
        tabIndex={0}
        aria-label={`Compare ${formatYear(pinnedYear)} with ${formatYear(liveYear)}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position * 100)}
        aria-valuetext={`${Math.round(position * 100)}% ${formatYear(pinnedYear)}`}
        onKeyDown={onKeyDown}
      >
        <span
          className="compare-year compare-year-pinned"
          style={{ borderColor: eraForYear(pinnedYear).color }}
          title="Pinned year"
        >
          {formatYear(pinnedYear)}
        </span>
        <span className="compare-grip" aria-hidden>
          ⟨⟩
        </span>
        <span
          className="compare-year compare-year-live"
          style={{ borderColor: eraForYear(liveYear).color }}
          title="Timeline year"
        >
          {formatYear(liveYear)}
        </span>
      </div>
      <button
        className="compare-close"
        type="button"
        onClick={onClose}
        title="Stop comparing"
        aria-label="Stop comparing years"
      >
        ×
      </button>
    </div>
  );
}
