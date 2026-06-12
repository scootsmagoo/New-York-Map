import { useEffect, useRef, useState } from "react";
import type { Entry, Era } from "../types";
import { formatYear } from "../data/eras";
import { entriesForEra } from "../data/entries";
import { getWikiSummary } from "../lib/wikipedia";
import { runWikiQueued } from "../lib/wikiQueue";

interface EraPanelProps {
  era: Era;
  onClose: () => void;
  onSelectEntry: (entry: Entry) => void;
}

const GROUPS: { kind: Entry["kind"]; label: string; glyph: string }[] = [
  { kind: "person", label: "People", glyph: "●" },
  { kind: "place", label: "Places", glyph: "■" },
  { kind: "event", label: "Events", glyph: "◆" },
];

function EntryRow({
  entry,
  color,
  onSelect,
  scrollRoot,
}: {
  entry: Entry;
  color: string;
  onSelect: () => void;
  scrollRoot: React.RefObject<HTMLElement | null>;
}) {
  const rowRef = useRef<HTMLButtonElement>(null);
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    const el = rowRef.current;
    const root = scrollRoot.current;
    if (!el || thumb) return;

    const observer = new IntersectionObserver(
      ([hit]) => {
        if (!hit?.isIntersecting) return;
        observer.disconnect();
        runWikiQueued(() => getWikiSummary(entry.wikiTitle)).then((s) => {
          if (s?.thumbnailUrl) setThumb(s.thumbnailUrl);
        });
      },
      { root, rootMargin: "80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [entry.wikiTitle, scrollRoot, thumb]);

  return (
    <button className="entry-row" ref={rowRef} onClick={onSelect}>
      <span className="entry-thumb" style={{ borderColor: color }}>
        {thumb ? (
          <img src={thumb} alt="" loading="lazy" />
        ) : (
          <span className="entry-thumb-fallback" style={{ color }}>
            {entry.title.slice(0, 1)}
          </span>
        )}
      </span>
      <span className="entry-row-text">
        <span className="entry-row-title">{entry.title}</span>
        <span className="entry-row-year">
          {entry.yearLabel ?? formatYear(entry.year)}
        </span>
      </span>
    </button>
  );
}

export function EraPanel({ era, onClose, onSelectEntry }: EraPanelProps) {
  const entries = entriesForEra(era.id);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <aside className="era-panel">
      <button className="modal-close" onClick={onClose} aria-label="Close panel">
        ×
      </button>
      <div className="era-panel-scroll" ref={scrollRef}>
        <header className="era-panel-header">
          <div className="era-panel-dates" style={{ color: era.color }}>
            {era.start <= -9000 ? "Deep time" : formatYear(era.start)} —{" "}
            {formatYear(era.end)}
          </div>
          <h2>{era.name}</h2>
          <p className="era-panel-subtitle">{era.subtitle}</p>
          <p className="era-panel-summary">{era.summary}</p>
        </header>

        {GROUPS.map((g) => {
          const group = entries.filter((e) => e.kind === g.kind);
          if (!group.length) return null;
          return (
            <section key={g.kind} className="era-group">
              <h3 className="era-group-title">
                <span style={{ color: era.color }}>{g.glyph}</span> {g.label}
              </h3>
              <div className="era-group-list">
                {group.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    color={era.color}
                    scrollRoot={scrollRef}
                    onSelect={() => onSelectEntry(entry)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <footer className="era-panel-footer">
          <a
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
              era.wikiTitle.replace(/ /g, "_")
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            More on this era ↗
          </a>
        </footer>
      </div>
    </aside>
  );
}
