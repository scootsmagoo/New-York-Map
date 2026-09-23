import { useEffect, useRef, useState } from "react";
import { eraForYear, formatYear, TIME_MAX, TIME_MIN } from "../data/eras";
import { parseYearInput } from "../lib/mapCamera";

interface CompareDividerProps {
  /** Divider position as a fraction of the map width (0–1). */
  position: number;
  onPositionChange: (p: number) => void;
  pinnedYear: number;
  onPinnedYearChange: (year: number) => void;
  liveYear: number;
  /** Typing a Now year moves the timeline there. */
  onLiveYearChange: (year: number) => void;
  onClose: () => void;
}

const clampPos = (p: number) => Math.max(0.04, Math.min(0.96, p));

/**
 * A year you can read or retype: shows the year until focused, then takes
 * "1776" or "500 BCE" and commits on Enter or blur.
 */
function YearField({
  label,
  year,
  onCommit,
}: {
  label: string;
  year: number;
  onCommit: (year: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    const y = parseYearInput(draft, TIME_MIN, TIME_MAX);
    setDraft(null);
    if (y !== null && y !== year) onCommit(y);
  };

  return (
    <label className="compare-year" style={{ borderColor: eraForYear(year).color }}>
      <span className="compare-year-label">{label}</span>
      <input
        className="compare-year-input"
        type="text"
        inputMode="numeric"
        size={5}
        aria-label={`${label} year (${formatYear(TIME_MIN)} to ${TIME_MAX})`}
        title={`Type a year up to ${TIME_MAX}, then Enter`}
        value={draft ?? String(year)}
        onFocus={(e) => {
          setDraft(String(year));
          // Select after the click has placed its caret, or WebKit keeps the
          // caret and typing lands in the middle of the old year.
          const input = e.target;
          requestAnimationFrame(() => input.select());
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") {
            setDraft(null);
            // Leave without committing: clear the draft first, then blur.
            requestAnimationFrame(() => (e.target as HTMLInputElement).blur());
          }
        }}
      />
    </label>
  );
}

/**
 * The Then & Now seam: a draggable line with the pinned year on its left and
 * the timeline's year on its right. Both years can be typed.
 */
export function CompareDivider({
  position,
  onPositionChange,
  pinnedYear,
  onPinnedYearChange,
  liveYear,
  onLiveYearChange,
  onClose,
}: CompareDividerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // A first-time hint, gone once the user does anything with the compare.
  const [hint, setHint] = useState(true);
  const openedAt = useRef({ pinnedYear, liveYear });
  useEffect(() => {
    const o = openedAt.current;
    if (pinnedYear !== o.pinnedYear || liveYear !== o.liveYear) setHint(false);
  }, [pinnedYear, liveYear]);

  const moveTo = (clientX: number) => {
    const parent = rootRef.current?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    onPositionChange(clampPos((clientX - rect.left) / rect.width));
    setHint(false);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest(".compare-close, .compare-year")) return;
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if ((e.currentTarget as Element).hasPointerCapture(e.pointerId)) {
      moveTo(e.clientX);
    }
  };

  const onGripKey = (e: React.KeyboardEvent) => {
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
      <div className="compare-knob">
        <YearField label="Then" year={pinnedYear} onCommit={onPinnedYearChange} />
        <span
          className="compare-grip"
          role="slider"
          tabIndex={0}
          aria-label="Divider between the two years"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position * 100)}
          onKeyDown={onGripKey}
          title="Drag to compare"
        >
          ⟨⟩
        </span>
        <YearField label="Now" year={liveYear} onCommit={onLiveYearChange} />
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
      {hint && (
        <p className="compare-hint">
          Drag the line to wipe between years. Type a year above, or scrub the
          timeline to change Now.
        </p>
      )}
    </div>
  );
}
