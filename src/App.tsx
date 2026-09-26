import {
  useCallback,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react";
import type { Entry } from "./types";
import type { ColonialStreet } from "./data/streets";
import { eraForYear } from "./data/eras";
import {
  clampWindow,
  panWindow,
  windowAround,
  unitOfYear,
  yearOfUnit,
  zoomWindow,
  type TimeWindow,
} from "./lib/timescale";
import { Header } from "./components/Header";

// Nothing on screen at first load needs these; they load when first opened,
// which keeps them (and the search index) out of the first download.
const named = <K extends string, M extends Record<K, React.ComponentType<any>>>(
  load: () => Promise<M>,
  name: K
) => lazy(() => load().then((m) => ({ default: m[name] })));
const EraPanel = named(() => import("./components/EraPanel"), "EraPanel");
const EntryModal = named(() => import("./components/EntryModal"), "EntryModal");
const AboutModal = named(() => import("./components/AboutModal"), "AboutModal");
const SearchPalette = named(() => import("./components/SearchPalette"), "SearchPalette");
const TourCard = named(() => import("./components/TourCard"), "TourCard");
const CompareDivider = named(() => import("./components/CompareDivider"), "CompareDivider");
import { MapView } from "./components/MapView";
import { Timeline } from "./components/Timeline";
import { PopulationPanel } from "./components/PopulationPanel";
import {
  compareYearFromHash,
  createCameraLink,
  defaultThenYear,
} from "./lib/mapCamera";
import { footprints } from "./data/footprints";
import { entryIdFromHash, viewUrl } from "./lib/viewLink";
import { allEntries } from "./data/entries";
import { tourById, type MapFocus, type Tour } from "./data/tours";
import type { MapLocation } from "./lib/search";
import type { SegmentKey } from "./data/population";
import { activeOverlayLabel, overlayAutoWeights } from "./lib/historicalOverlays";
import { useThrottledValue } from "./lib/useThrottledValue";
import { usePersistedState } from "./lib/usePersistedState";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Initial window from a deep link like #year=1880 or #year=1880&span=0.05. */
function initialWindow(): TimeWindow {
  const hash = window.location.hash;
  const yearMatch = hash.match(/year=(-?\d+)/);
  if (!yearMatch) return { u0: 0, u1: 1 };
  const u = unitOfYear(parseInt(yearMatch[1], 10));
  const spanMatch = hash.match(/span=([\d.]+)/);
  const span = spanMatch ? parseFloat(spanMatch[1]) : 0.1;
  return windowAround(u, span);
}

export default function App() {
  const [win, setWin] = useState<TimeWindow>(initialWindow);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const [showSettlements, setShowSettlements] = usePersistedState("settlements", true);
  const [highlightGroup, setHighlightGroup] = useState<SegmentKey | null>(null);
  const [focusToken, setFocusToken] = useState(0);
  const [focusStreet, setFocusStreet] = useState<ColonialStreet | null>(null);
  const [streetFocusToken, setStreetFocusToken] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  // Layer preferences survive reloads; everything else starts fresh.
  const [overlaysEnabled, setOverlaysEnabled] = usePersistedState("overlays", false);
  const [overlaysAuto, setOverlaysAuto] = usePersistedState("overlaysAuto", true);
  const [overlayOpacity, setOverlayOpacity] = usePersistedState("overlayOpacity", 0.72);
  const [showStreetLabels, setShowStreetLabels] = usePersistedState("streetLabels", false);
  const [showNeighborhoods, setShowNeighborhoods] = usePersistedState("neighborhoods", false);
  const [showLostLandscape, setShowLostLandscape] = usePersistedState("lostLandscape", false);
  const [tour, setTour] = useState<{ tour: Tour; step: number } | null>(null);
  const [focusPoint, setFocusPoint] = useState<MapFocus | null>(null);
  const [focusPointToken, setFocusPointToken] = useState(0);
  // Then & Now: a pinned year on the left of a draggable seam.
  const [compareYear, setCompareYear] = useState<number | null>(() =>
    compareYearFromHash(window.location.hash)
  );
  const [comparePos, setComparePos] = useState(0.5);
  const cameraLink = useMemo(() => createCameraLink(), []);

  // iOS raises the keyboard only for a focus() made during the tap itself,
  // and the search box appears a moment later. Focus a hidden field now;
  // the keyboard stays up as focus moves on to the real one.
  const focusProxy = useRef<HTMLInputElement>(null);
  const openSearch = useCallback(() => {
    focusProxy.current?.focus({ preventScroll: true });
    setSearchOpen(true);
  }, []);
  const compareRef = useRef(compareYear);
  compareRef.current = compareYear;

  // Animated timeline flights (tours). Any user gesture cancels one in progress.
  const winRef = useRef(win);
  winRef.current = win;
  const flyAnim = useRef<number | null>(null);
  const cancelFly = useCallback(() => {
    if (flyAnim.current !== null) {
      cancelAnimationFrame(flyAnim.current);
      flyAnim.current = null;
    }
  }, []);
  const flyWindow = useCallback(
    (target: TimeWindow, duration = 900) => {
      cancelFly();
      const from = { ...winRef.current };
      const to = clampWindow(target);
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const e = easeInOutCubic(p);
        setWin({
          u0: from.u0 + (to.u0 - from.u0) * e,
          u1: from.u1 + (to.u1 - from.u1) * e,
        });
        flyAnim.current = p < 1 ? requestAnimationFrame(step) : null;
      };
      flyAnim.current = requestAnimationFrame(step);
    },
    [cancelFly]
  );
  useEffect(() => cancelFly, [cancelFly]);

  // Whole years only: the window moves every frame, but nothing downstream
  // (header, era, map) needs sub-year precision, and integer years let
  // memoized children skip most frames entirely.
  const year = useMemo(() => Math.round(yearOfUnit((win.u0 + win.u1) / 2)), [win]);
  /**
   * Map & population lag the playhead slightly so timeline scrub stays smooth:
   * throttled to a steady cadence, and deferred so a slow map render never
   * blocks the timeline's own frame.
   */
  const mapYear = useDeferredValue(useThrottledValue(year, 75));
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
  const setWindowFromUser = useCallback(
    (w: TimeWindow) => {
      cancelFly();
      setPlaying(false);
      setWin(w);
    },
    [cancelFly]
  );

  // Autoplay: glide the window rightward until the end of time.
  useEffect(() => {
    if (!playing) return;
    cancelFly();
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setWin((w) => {
        if ((w.u0 + w.u1) / 2 >= 0.9999) {
          setPlaying(false);
          return w;
        }
        return panWindow(w, (w.u1 - w.u0) * 0.07 * dt);
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, cancelFly]);

  // Trackpad pinch (ctrl+wheel) outside the map zooms the whole browser page,
  // which scrolls the header out of view. Keep pinch app-only; the map's own
  // d3-zoom still receives the event and handles pinch-zoom over the SVG.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };
    const onGesture = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", onWheel, { passive: false });
    // Safari fires proprietary gesture events for pinch.
    window.addEventListener("gesturestart", onGesture);
    window.addEventListener("gesturechange", onGesture);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("gesturestart", onGesture);
      window.removeEventListener("gesturechange", onGesture);
    };
  }, []);

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
        cancelFly();
        setPlaying(false);
        setWin((w) => panWindow(w, dir * (w.u1 - w.u0) * 0.08));
      } else if (e.key === "+" || e.key === "=") {
        cancelFly();
        setWin((w) => zoomWindow(w, 1.35, (w.u0 + w.u1) / 2));
      } else if (e.key === "-" || e.key === "_") {
        cancelFly();
        setWin((w) => zoomWindow(w, 1 / 1.35, (w.u0 + w.u1) / 2));
      } else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, cancelFly]);

  // ----- Guided tours -----
  const showTourStop = useCallback(
    (t: Tour, index: number) => {
      const stop = t.stops[index];
      const span = stop.span ?? 0.05;
      const u = unitOfYear(stop.year);
      flyWindow(windowAround(u, span));
      setFocusPoint(stop.focus ?? null);
      setFocusPointToken((n) => n + 1);
    },
    [flyWindow]
  );

  const startTour = useCallback(
    (t: Tour) => {
      setPlaying(false);
      setPanelOpen(false);
      setSearchOpen(false);
      setSelectedEntry(null);
      setFocusStreet(null);
      setCompareYear(null);
      for (const layer of t.layers ?? []) {
        if (layer === "lostLandscape") setShowLostLandscape(true);
        else if (layer === "neighborhoods") setShowNeighborhoods(true);
        else setShowStreetLabels(true);
      }
      setTour({ tour: t, step: 0 });
      showTourStop(t, 0);
    },
    [showTourStop, setShowLostLandscape, setShowNeighborhoods, setShowStreetLabels]
  );

  const stepTour = useCallback(
    (index: number) => {
      if (!tour) return;
      if (index < 0 || index >= tour.tour.stops.length) return;
      setSelectedEntry(null);
      setTour({ tour: tour.tour, step: index });
      showTourStop(tour.tour, index);
    },
    [tour, showTourStop]
  );

  const endTour = useCallback(() => setTour(null), []);

  // #tour=<id> deep link starts a tour on load; #entry=<id> opens an entry.
  const openDeepLink = useEffectEvent(() => {
    const m = window.location.hash.match(/tour=([\w-]+)/);
    const t = m ? tourById(m[1]) : undefined;
    if (t) startTour(t);
    const entryId = entryIdFromHash(window.location.hash);
    const entry = entryId ? allEntries.find((e) => e.id === entryId) : undefined;
    if (entry && !t) goToEntry(entry);
  });
  useEffect(() => openDeepLink(), []);

  const toggleCompare = useCallback(() => {
    setCompareYear((c) =>
      c === null ? defaultThenYear(year, footprints.map((f) => f.year)) : null
    );
    setComparePos(0.5);
  }, [year]);

  // Typing a Now year moves the timeline there at the current zoom.
  const setLiveYear = useCallback(
    (y: number) => {
      const w = winRef.current;
      setWindowFromUser(windowAround(unitOfYear(y), w.u1 - w.u0));
    },
    [setWindowFromUser]
  );

  // Read through refs so the header's memo isn't broken on every frame.
  const getViewUrl = useCallback(() => {
    const w = winRef.current;
    return viewUrl({
      year: yearOfUnit((w.u0 + w.u1) / 2),
      span: w.u1 - w.u0,
      compare: compareRef.current,
    });
  }, []);

  const jumpToYear = useCallback((target: number) => {
    setPlaying(false);
    setSelectedEntry(null);
    setPanelOpen(false);
    setWin((w) => {
      const span = Math.min(w.u1 - w.u0, 0.18);
      const u = unitOfYear(target);
      return windowAround(u, span);
    });
  }, []);

  const selectEntry = useCallback((entry: Entry) => {
    setFocusStreet(null);
    setSelectedEntry(entry);
    setFocusToken((t) => t + 1);
  }, []);

  const goToStreet = useCallback(
    (street: ColonialStreet) => {
      setPlaying(false);
      setPanelOpen(false);
      setSearchOpen(false);
      setSelectedEntry(null);
      setShowStreetLabels(true);
      const targetYear = Math.max(year, street.from);
      setWin((w) => {
        const span = Math.min(w.u1 - w.u0, 0.18);
        const u = unitOfYear(targetYear);
        return windowAround(u, span);
      });
      setFocusStreet(street);
      setStreetFocusToken((t) => t + 1);
    },
    [year]
  );

  // Search results from the map layers: fly there, move the timeline into
  // the years it exists if it isn't on the map now, and show its layer.
  const goToLocation = useCallback(
    (loc: MapLocation) => {
      setPlaying(false);
      setSearchOpen(false);
      setSelectedEntry(null);
      setFocusStreet(null);
      if (loc.layer === "neighborhoods") setShowNeighborhoods(true);
      else setShowLostLandscape(true);
      if (year < loc.range[0] || year > loc.range[1]) {
        setWin((w) => windowAround(unitOfYear(loc.year), Math.min(w.u1 - w.u0, 0.18)));
      }
      setFocusPoint({ coords: loc.coords, k: loc.k });
      setFocusPointToken((n) => n + 1);
    },
    [year, setShowNeighborhoods, setShowLostLandscape]
  );

  const goToEntry = useCallback(
    (entry: Entry) => {
      setPlaying(false);
      setPanelOpen(false);
      setSearchOpen(false);
      setWin((w) => {
        const span = Math.min(w.u1 - w.u0, 0.18);
        const u = unitOfYear(entry.year);
        return windowAround(u, span);
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
        onSearch={openSearch}
        onExploreEra={() => setPanelOpen((o) => !o)}
        onAbout={() => setAboutOpen(true)}
        onStartTour={startTour}
        comparing={compareYear !== null}
        onToggleCompare={toggleCompare}
        getViewUrl={getViewUrl}
        overlaysEnabled={overlaysEnabled}
        onOverlaysEnabledChange={setOverlaysEnabled}
        overlaysAuto={overlaysAuto}
        onOverlaysAutoChange={setOverlaysAuto}
        overlayOpacity={overlayOpacity}
        onOverlayOpacityChange={setOverlayOpacity}
        overlayActiveLabel={overlayActiveLabel}
        showStreetLabels={showStreetLabels}
        onShowStreetLabelsChange={setShowStreetLabels}
        showNeighborhoods={showNeighborhoods}
        onShowNeighborhoodsChange={setShowNeighborhoods}
        showLostLandscape={showLostLandscape}
        onShowLostLandscapeChange={setShowLostLandscape}
      />

      <main
        className={`app-main${tour ? " app-main-touring" : ""}${
          compareYear !== null ? " app-main-comparing" : ""
        }`}
        style={{ "--compare-pos": `${comparePos * 100}%` } as React.CSSProperties}
      >
        <MapView
          year={mapYear}
          selectedEntry={selectedEntry}
          focusToken={focusToken}
          focusStreet={focusStreet}
          streetFocusToken={streetFocusToken}
          focusPoint={focusPoint}
          focusPointToken={focusPointToken}
          onSelectEntry={selectEntry}
          showSettlements={popOpen && showSettlements}
          highlightGroup={highlightGroup}
          overlaysEnabled={overlaysEnabled}
          overlaysAuto={overlaysAuto}
          overlayOpacity={overlayOpacity}
          showStreetLabels={showStreetLabels}
          showNeighborhoods={showNeighborhoods}
          showLostLandscape={showLostLandscape}
          cameraLink={cameraLink}
        />
        {compareYear !== null && (
          <>
            <div
              className="compare-pane"
              data-era={eraForYear(compareYear).id}
              style={
                {
                  "--accent": eraForYear(compareYear).color,
                } as React.CSSProperties
              }
            >
              <MapView
                year={compareYear}
                selectedEntry={null}
                focusToken={0}
                onSelectEntry={selectEntry}
                overlaysEnabled={overlaysEnabled}
                overlaysAuto={overlaysAuto}
                overlayOpacity={overlayOpacity}
                showStreetLabels={showStreetLabels}
                showNeighborhoods={showNeighborhoods}
                showLostLandscape={showLostLandscape}
                cameraLink={cameraLink}
                chrome={false}
              />
            </div>
            <Suspense fallback={null}>
              <CompareDivider
                position={comparePos}
                onPositionChange={setComparePos}
                pinnedYear={compareYear}
                onPinnedYearChange={setCompareYear}
                liveYear={year}
                onLiveYearChange={setLiveYear}
                onClose={() => setCompareYear(null)}
              />
            </Suspense>
          </>
        )}
        <PopulationPanel
          year={mapYear}
          showSettlements={showSettlements}
          onShowSettlementsChange={setShowSettlements}
          highlightGroup={highlightGroup}
          onHighlightGroup={setHighlightGroup}
          onOpenChange={setPopOpen}
        />
        {tour && (
          <Suspense fallback={null}>
            <TourCard
              tour={tour.tour}
              step={tour.step}
              onStep={stepTour}
              onClose={endTour}
              onReadMore={selectEntry}
              escapeCloses={!selectedEntry && !aboutOpen && !searchOpen}
            />
          </Suspense>
        )}
        {panelOpen && (
          <Suspense fallback={null}>
            <EraPanel
              era={era}
              onClose={() => setPanelOpen(false)}
              onSelectEntry={selectEntry}
            />
          </Suspense>
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
        <Suspense fallback={null}>
          <EntryModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onJumpToYear={jumpToYear}
          />
        </Suspense>
      )}
      <input
        ref={focusProxy}
        className="focus-proxy"
        type="text"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
      />
      {aboutOpen && (
        <Suspense fallback={null}>
          <AboutModal onClose={() => setAboutOpen(false)} />
        </Suspense>
      )}
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchPalette
            onClose={() => setSearchOpen(false)}
            onSelectEntry={goToEntry}
            onSelectStreet={goToStreet}
            onSelectLocation={goToLocation}
          />
        </Suspense>
      )}
    </div>
  );
}
