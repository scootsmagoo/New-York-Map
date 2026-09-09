import { useEffect } from "react";
import type { Entry } from "../types";
import type { Tour } from "../data/tours";
import { allEntries } from "../data/entries";

interface TourCardProps {
  tour: Tour;
  step: number;
  onStep: (index: number) => void;
  onClose: () => void;
  onReadMore: (entry: Entry) => void;
  /** False while a modal is up, so Escape closes the modal rather than the tour. */
  escapeCloses: boolean;
}

export function TourCard({
  tour,
  step,
  onStep,
  onClose,
  onReadMore,
  escapeCloses,
}: TourCardProps) {
  const stop = tour.stops[step];
  const last = step === tour.stops.length - 1;
  const entry = stop.entryId
    ? allEntries.find((e) => e.id === stop.entryId)
    : undefined;

  useEffect(() => {
    if (!escapeCloses) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [escapeCloses, onClose]);

  return (
    <section
      className="tour-card"
      role="dialog"
      aria-label={`Guided tour: ${tour.title}`}
      aria-live="polite"
    >
      <button className="modal-close" onClick={onClose} aria-label="End tour">
        ×
      </button>
      <div className="tour-card-kicker">
        <span className="tour-card-name">{tour.title}</span>
        <span className="tour-card-count">
          {step + 1} of {tour.stops.length}
        </span>
      </div>
      <h3 className="tour-card-title">
        <span className="tour-card-year">{stop.year}</span>
        {stop.title}
      </h3>
      <p className="tour-card-text">{stop.text}</p>
      <div className="tour-card-footer">
        <div className="tour-card-dots" aria-label="Tour stops">
          {tour.stops.map((s, i) => (
            <button
              key={s.year + s.title}
              className={`tour-dot${i === step ? " tour-dot-active" : ""}`}
              onClick={() => onStep(i)}
              aria-label={`${s.year}: ${s.title}`}
              aria-current={i === step ? "step" : undefined}
            />
          ))}
        </div>
        <div className="tour-card-nav">
          {entry && (
            <button className="tour-link" onClick={() => onReadMore(entry)}>
              Read: {entry.title}
            </button>
          )}
          <button
            className="tour-btn"
            onClick={() => onStep(step - 1)}
            disabled={step === 0}
          >
            ◀ Back
          </button>
          <button
            className="tour-btn tour-btn-primary"
            onClick={last ? onClose : () => onStep(step + 1)}
          >
            {last ? "Finish" : "Next ▶"}
          </button>
        </div>
      </div>
    </section>
  );
}
