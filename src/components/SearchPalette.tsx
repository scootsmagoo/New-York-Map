import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Entry } from "../types";
import type { ColonialStreet } from "../data/streets";
import {
  groupSearchHits,
  searchEntries,
  type MapLocation,
  type SearchHit,
  type SearchItemKind,
} from "../lib/search";
import { useDebouncedValue } from "../lib/useDebouncedValue";
import { FocusTrap } from "./FocusTrap";

const KIND_GLYPH: Record<SearchItemKind, string> = {
  person: "●",
  place: "■",
  event: "◆",
  street: "╱",
  neighborhood: "⌂",
  water: "≈",
};

interface SearchPaletteProps {
  onClose: () => void;
  onSelectEntry: (entry: Entry) => void;
  onSelectStreet: (street: ColonialStreet) => void;
  onSelectLocation: (location: MapLocation) => void;
  /** What had focus before search opened, to give it back on close. */
  returnFocusTo?: HTMLElement | null;
  /** Letters typed before the box appeared (into the iOS keyboard proxy). */
  takeTyped?: () => string;
}

type Handlers = Pick<
  SearchPaletteProps,
  "onSelectEntry" | "onSelectStreet" | "onSelectLocation"
>;

function selectHit(hit: SearchHit, h: Handlers) {
  const src = hit.item.source;
  if (src.type === "entry") h.onSelectEntry(src.entry);
  else if (src.type === "street") h.onSelectStreet(src.street);
  else h.onSelectLocation(src.location);
}

export function SearchPalette({
  onClose,
  onSelectEntry,
  onSelectStreet,
  onSelectLocation,
  returnFocusTo,
  takeTyped,
}: SearchPaletteProps) {
  const handlers = { onSelectEntry, onSelectStreet, onSelectLocation };
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const debouncedQuery = useDebouncedValue(query, 120);

  const groups = useMemo(
    () => groupSearchHits(searchEntries(debouncedQuery)),
    [debouncedQuery]
  );
  const flat = useMemo(() => groups.flatMap((g) => g.hits), [groups]);

  // A layout effect: passive effects wait for any view transition to finish,
  // and keystrokes in between would be lost.
  // Runs each time search appears: it stays mounted but hidden between
  // uses (an <Activity> in App), keeping the last query. Letters typed
  // before it appeared went to the keyboard proxy and replace that query;
  // otherwise the old query is selected, so typing replaces it.
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const typed = takeTyped?.();
    if (typed) setQuery(typed);
    input.focus();
    if (!typed) input.select();
  }, [takeTyped]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  // Reads the latest results and selection without re-subscribing on each
  // keystroke.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
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
      if (hit) selectHit(hit, handlers);
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const el = document.querySelector(".search-result.is-active");
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let row = 0;

  return (
    <div className="search-overlay" onClick={onClose}>
      <FocusTrap returnFocusTo={returnFocusTo}>
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
              placeholder="People, places, events, streets, neighborhoods…"
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
                Search people, places, events, streets, neighborhoods, and lost
                waters — try <em>Tweed</em>, <em>Five Points</em>, or{" "}
                <em>Collect Pond</em>.
              </p>
            )}
            {query.trim() && flat.length === 0 && (
              <p className="search-empty">No matches for “{query.trim()}”.</p>
            )}
            {groups.map((group) => (
              <section key={group.kind} className="search-group">
                <h3 className="search-group-title">
                  <span aria-hidden>{KIND_GLYPH[group.kind]}</span>{" "}
                  {group.label}
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
                          onClick={() => selectHit(hit, handlers)}
                        >
                          <span className="search-result-title">
                            {hit.item.title}
                          </span>
                          <span className="search-result-sub">
                            {hit.item.subtitle}
                          </span>
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
      </FocusTrap>
    </div>
  );
}
