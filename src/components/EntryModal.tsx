import { useEffect, useState } from "react";
import type { Entry, WikiSummary } from "../types";
import { eras, formatYear } from "../data/eras";
import { getWikiSummary } from "../lib/wikipedia";
import { viewUrl } from "../lib/viewLink";
import { CopyLinkButton } from "./CopyLinkButton";
import { FocusTrap } from "./FocusTrap";

interface EntryModalProps {
  entry: Entry;
  onClose: () => void;
  onJumpToYear: (year: number) => void;
}

const KIND_LABEL: Record<Entry["kind"], string> = {
  person: "Person",
  place: "Place",
  event: "Event",
};

export function EntryModal({ entry, onClose, onJumpToYear }: EntryModalProps) {
  const [summary, setSummary] = useState<WikiSummary | null>(null);
  const [wikiLoading, setWikiLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setWikiLoading(true);
    setSummary(null);
    getWikiSummary(entry.wikiTitle).then((s) => {
      if (!alive) return;
      setSummary(s);
      setWikiLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [entry]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const era = eras.find((e) => e.id === entry.era);

  return (
    <div className="overlay" onClick={onClose}>
      <FocusTrap>
        <article
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="entry-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
          <header className="modal-header">
            <div className="modal-meta">
              <span
                className={`kind-badge kind-${entry.kind}`}
                style={{ background: era?.color }}
              >
                {KIND_LABEL[entry.kind]}
              </span>
              <button
                className="year-chip"
                onClick={() => onJumpToYear(entry.year)}
                title="Center the timeline here"
              >
                {entry.yearLabel ?? formatYear(entry.year)}
              </button>
            </div>
            <h2 id="entry-modal-title">{entry.title}</h2>
            {summary?.description && (
              <p className="modal-description">{summary.description}</p>
            )}
          </header>

          <div className="modal-body">
            {summary?.thumbnailUrl && (
              <img
                className="modal-image"
                src={summary.thumbnailUrl}
                alt={entry.title}
                loading="lazy"
              />
            )}
            <p className="modal-extract">{summary?.extract || entry.blurb}</p>
            {wikiLoading && !summary?.extract && (
              <p className="modal-extract modal-loading">
                Fetching live Wikipedia summary…
              </p>
            )}
            {!wikiLoading &&
              summary?.extract &&
              summary.extract !== entry.blurb && (
                <p className="modal-blurb">{entry.blurb}</p>
              )}
            {entry.gotham && (
              <p className="modal-gotham">
                <span className="gotham-mark">Gotham:</span> {entry.gotham}
              </p>
            )}
          </div>

          <footer className="modal-footer">
            <a
              href={
                summary?.pageUrl ??
                `https://en.wikipedia.org/wiki/${encodeURIComponent(
                  entry.wikiTitle.replace(/ /g, "_")
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Read on Wikipedia ↗
            </a>
            <CopyLinkButton
              className="modal-link-btn"
              label="Copy link"
              getUrl={() => viewUrl({ entry: entry.id })}
            />
          </footer>
        </article>
      </FocusTrap>
    </div>
  );
}
