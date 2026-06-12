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

export default function App() {
  const [win, setWin] = useState<TimeWindow>({ u0: 0, u1: 1 });
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const year = useMemo(() => yearOfUnit((win.u0 + win.u1) / 2), [win]);
  const era = useMemo(() => eraForYear(year), [year]);

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

  // Keyboard: arrows pan, +/- zoom, space toggles play.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
  }, []);

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

  return (
    <div className="app" data-era={era.id} style={{ "--accent": era.color } as React.CSSProperties}>
      <Header
        year={year}
        era={era}
        onExploreEra={() => setPanelOpen((o) => !o)}
        onAbout={() => setAboutOpen(true)}
      />

      <main className="app-main">
        <MapView year={year} onSelectEntry={setSelectedEntry} />
        {panelOpen && (
          <EraPanel
            era={era}
            onClose={() => setPanelOpen(false)}
            onSelectEntry={setSelectedEntry}
          />
        )}
      </main>

      <Timeline
        window={win}
        onWindowChange={setWindowFromUser}
        onSelectEntry={setSelectedEntry}
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
    </div>
  );
}
