import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  type FragmentInstance,
} from "react";
import type { Entry, Era } from "../types";
import { formatYear } from "../data/eras";
import { allEntries, entriesForEra } from "../data/entries";
import { FocusTrap } from "./FocusTrap";
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
  thumb,
  onSelect,
}: {
  entry: Entry;
  color: string;
  thumb: string | undefined;
  onSelect: () => void;
}) {
  return (
    <button className="entry-row" data-entry-id={entry.id} onClick={onSelect}>
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

const byId = new Map(allEntries.map((e) => [e.id, e]));

export function EraPanel({ era, onClose, onSelectEntry }: EraPanelProps) {
  const entries = entriesForEra(era.id);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  // One observer for every row: Wikipedia thumbnails load as rows scroll
  // into view. Each group's rows are observed through a Fragment ref, so
  // rows don't each need a DOM ref and an observer of their own.
  const [observer] = useState(() =>
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (hits) => {
            for (const hit of hits) {
              if (!hit.isIntersecting) continue;
              observer?.unobserve(hit.target);
              const entry = byId.get(
                (hit.target as HTMLElement).dataset.entryId ?? "",
              );
              if (!entry) continue;
              runWikiQueued(() => getWikiSummary(entry.wikiTitle)).then(
                (summary) => {
                  const url = summary?.thumbnailUrl;
                  if (url) setThumbs((t) => ({ ...t, [entry.id]: url }));
                },
              );
            }
          },
          { rootMargin: "80px" },
        ),
  );
  useEffect(() => () => observer?.disconnect(), [observer]);
  const observeRows = useCallback(
    (rows: FragmentInstance | null) => {
      if (!rows || !observer) return;
      rows.observeUsing(observer);
      return () => rows.unobserveUsing(observer);
    },
    [observer],
  );

  return (
    <FocusTrap trap={false}>
      <aside className="era-panel">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close panel"
        >
          ×
        </button>
        <div className="era-panel-scroll">
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
                  {/* Keyed by era, so a new era's rows are observed afresh. */}
                  <Fragment key={era.id} ref={observeRows}>
                    {group.map((entry) => (
                      <EntryRow
                        key={entry.id}
                        entry={entry}
                        color={era.color}
                        thumb={thumbs[entry.id]}
                        onSelect={() => onSelectEntry(entry)}
                      />
                    ))}
                  </Fragment>
                </div>
              </section>
            );
          })}

          <footer className="era-panel-footer">
            <a
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                era.wikiTitle.replace(/ /g, "_"),
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              More on this era ↗
            </a>
          </footer>
        </div>
      </aside>
    </FocusTrap>
  );
}
