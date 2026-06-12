import { useCallback, useEffect, useMemo, useState } from "react";
import type { Entry } from "./types";
import { eraForYear } from "./data/eras";
import {
  clampWindow,
  panWindow,
  unitOfYear,
  yearOfUnit,
  zoomWindow,
  type TimeWindow,
} from "./lib/timescale";
import { Header } from "./components/Header";
import { MapView } from "./components/MapView";
import { Timeline } from "./components/Timeline";
import { EraPanel } from "./components/EraPanel";
import { EntryModal } from "./components/EntryModal";
import { AboutModal } from "./components/AboutModal";
import { PopulationPanel } from "./components/PopulationPanel";
import { SearchPalette } from "./components/SearchPalette";
import type { SegmentKey } from "./data/population";
import { activeOverlayLabel, overlayAutoWeights } from "./lib/historicalOverlays";
import { useDebouncedValue } from "./lib/useDebouncedValue";

/** Initial window from a deep link like #year=1880 or #year=1880&span=0.05. */
function initialWindow(): TimeWindow {
  const hash = window.location.hash;
  const yearMatch = hash.match(/year=(-?\d+)/);
  if (!yearMatch) return { u0: 0, u1: 1 };
  const u = unitOfYear(parseInt(yearMatch[1], 10));
  const spanMatch = hash.match(/span=([\d.]+)/);
  const span = spanMatch ? parseFloat(spanMatch[1]) : 0.1;
  return clampWindow({ u0: u - span / 2, u1: u + span / 2 });
}

export default function App() {
  const [win, setWin] = useState<TimeWindow>(initialWindow);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const [showSettlements, setShowSettlements] = useState(true);
  const [highlightGroup, setHighlightGroup] = useState<SegmentKey | null>(null);
  const [focusToken, setFocusToken] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [overlaysEnabled, setOverlaysEnabled] = useState(false);
  const [overlaysAuto, setOverlaysAuto] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.72);

  const year = useMemo(() => yearOfUnit((win.u0 + win.u1) / 2), [win]);
  /** Map & population lag the playhead slightly so timeline scrub stays smooth. */
  const mapYear = useDebouncedValue(year, 75);
  const era = useMemo(() => eraForYear(year), [year]);
  const overlayActiveLabel = useMemo(
    () =>
      activeOverlayLabel(
        mapYear,
        overlaysAuto,
        overlaysAuto ? overlayAutoWeights(mapYear) : new Map()
      ),
    [mapYear, overlaysAuto]
  );

  // Window changes coming from user gestures stop the autoplay.
  const setWindowFromUser = useCallback((w: TimeWindow) => {
    setPlaying(false);
    setWin(w);
  }, []);

  // Autoplay: glide the window rightward until the end of time.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setWin((w) => {
        if (w.u1 >= 0.9999) {
          setPlaying(false);
          return w;
        }
        return panWindow(w, (w.u1 - w.u0) * 0.07 * dt);
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Keyboard: Ctrl/Cmd+K opens search; arrows pan, +/- zoom, space toggles play.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (searchOpen) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const dir = e.key === "ArrowLeft" ? -1 : 1;
        setPlaying(false);
        setWin((w) => panWindow(w, dir * (w.u1 - w.u0) * 0.08));
      } else if (e.key === "+" || e.key === "=") {
        setWin((w) => zoomWindow(w, 1.35, (w.u0 + w.u1) / 2));
      } else if (e.key === "-" || e.key === "_") {
        setWin((w) => zoomWindow(w, 1 / 1.35, (w.u0 + w.u1) / 2));
      } else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const jumpToYear = useCallback((target: number) => {
    setPlaying(false);
    setSelectedEntry(null);
    setPanelOpen(false);
    setWin((w) => {
      const span = Math.min(w.u1 - w.u0, 0.18);
      const u = unitOfYear(target);
      return clampWindow({ u0: u - span / 2, u1: u + span / 2 });
    });
  }, []);

  const selectEntry = useCallback((entry: Entry) => {
    setSelectedEntry(entry);
    setFocusToken((t) => t + 1);
  }, []);

  const goToEntry = useCallback(
    (entry: Entry) => {
      setPlaying(false);
      setPanelOpen(false);
      setSearchOpen(false);
      setWin((w) => {
        const span = Math.min(w.u1 - w.u0, 0.18);
        const u = unitOfYear(entry.year);
        return clampWindow({ u0: u - span / 2, u1: u + span / 2 });
      });
      selectEntry(entry);
    },
    [selectEntry]
  );

  return (
    <div className="app" data-era={era.id} style={{ "--accent": era.color } as React.CSSProperties}>
      <Header
        year={year}
        era={era}
        onSearch={() => setSearchOpen(true)}
        onExploreEra={() => setPanelOpen((o) => !o)}
        onAbout={() => setAboutOpen(true)}
        overlaysEnabled={overlaysEnabled}
        onOverlaysEnabledChange={setOverlaysEnabled}
        overlaysAuto={overlaysAuto}
        onOverlaysAutoChange={setOverlaysAuto}
        overlayOpacity={overlayOpacity}
        onOverlayOpacityChange={setOverlayOpacity}
        overlayActiveLabel={overlayActiveLabel}
      />

      <main className="app-main">
        <MapView
          year={mapYear}
          selectedEntry={selectedEntry}
          focusToken={focusToken}
          onSelectEntry={selectEntry}
          showSettlements={popOpen && showSettlements}
          highlightGroup={highlightGroup}
          overlaysEnabled={overlaysEnabled}
          overlaysAuto={overlaysAuto}
          overlayOpacity={overlayOpacity}
        />
        <PopulationPanel
          year={mapYear}
          showSettlements={showSettlements}
          onShowSettlementsChange={setShowSettlements}
          highlightGroup={highlightGroup}
          onHighlightGroup={setHighlightGroup}
          onOpenChange={setPopOpen}
        />
        {panelOpen && (
          <EraPanel
            era={era}
            onClose={() => setPanelOpen(false)}
            onSelectEntry={selectEntry}
          />
        )}
      </main>

      <Timeline
        window={win}
        onWindowChange={setWindowFromUser}
        onSelectEntry={selectEntry}
        playing={playing}
        onTogglePlay={() => setPlaying((p) => !p)}
      />

      {selectedEntry && (
        <EntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onJumpToYear={jumpToYear}
        />
      )}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {searchOpen && (
        <SearchPalette
          onClose={() => setSearchOpen(false)}
          onSelectEntry={goToEntry}
        />
      )}
    </div>
  );
}
