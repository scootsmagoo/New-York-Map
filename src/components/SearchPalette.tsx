import { useEffect, useMemo, useRef, useState } from "react";
import type { Entry } from "../types";
import type { ColonialStreet } from "../data/streets";
import {
  groupSearchHits,
  searchEntries,
  type SearchHit,
  type SearchItemKind,
} from "../lib/search";
import { useDebouncedValue } from "../lib/useDebouncedValue";

const KIND_GLYPH: Record<SearchItemKind, string> = {
  person: "●",
  place: "■",
  event: "◆",
  street: "╱",
};

interface SearchPaletteProps {
  onClose: () => void;
  onSelectEntry: (entry: Entry) => void;
  onSelectStreet: (street: ColonialStreet) => void;
}

function selectHit(
  hit: SearchHit,
  onSelectEntry: (entry: Entry) => void,
  onSelectStreet: (street: ColonialStreet) => void
) {
  if (hit.item.source.type === "entry") {
    onSelectEntry(hit.item.source.entry);
  } else {
    onSelectStreet(hit.item.source.street);
  }
}

export function SearchPalette({
  onClose,
  onSelectEntry,
  onSelectStreet,
}: SearchPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const debouncedQuery = useDebouncedValue(query, 120);

  const groups = useMemo(
    () => groupSearchHits(searchEntries(debouncedQuery)),
    [debouncedQuery]
  );
  const flat = useMemo(() => groups.flatMap((g) => g.hits), [groups]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (flat.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % flat.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const hit = flat[activeIndex];
        if (hit) selectHit(hit, onSelectEntry, onSelectStreet);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flat, activeIndex, onClose, onSelectEntry, onSelectStreet]);

  useEffect(() => {
    const el = document.querySelector(".search-result.is-active");
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let row = 0;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div
        className="search-palette"
        role="dialog"
        aria-label="Search Gotham"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-input-wrap">
          <span className="search-input-icon" aria-hidden>
            ⌕
          </span>
          <input
            ref={inputRef}
            className="search-input"
            type="search"
            enterKeyHint="search"
            placeholder="People, places, events, streets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-autocomplete="list"
            aria-controls="search-results"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            className="search-close"
            type="button"
            onClick={onClose}
            aria-label="Close search"
          >
            ×
          </button>
        </div>

        <div id="search-results" className="search-results" role="listbox">
          {!query.trim() && (
            <p className="search-empty">
              Search people, places, events, and streets — try{" "}
              <em>Pearl Street</em>, <em>Wall Street</em>, or <em>Tweed</em>.
            </p>
          )}
          {query.trim() && flat.length === 0 && (
            <p className="search-empty">No matches for “{query.trim()}”.</p>
          )}
          {groups.map((group) => (
            <section key={group.kind} className="search-group">
              <h3 className="search-group-title">
                <span aria-hidden>{KIND_GLYPH[group.kind]}</span> {group.label}
              </h3>
              <ul className="search-group-list">
                {group.hits.map((hit) => {
                  const index = row++;
                  const active = index === activeIndex;
                  return (
                    <li key={hit.item.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        className={`search-result${active ? " is-active" : ""}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectHit(hit, onSelectEntry, onSelectStreet)}
                      >
                        <span className="search-result-title">{hit.item.title}</span>
                        <span className="search-result-sub">{hit.item.subtitle}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <footer className="search-hint">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </footer>
      </div>
    </div>
  );
}
