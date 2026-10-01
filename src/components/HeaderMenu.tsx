import { useEffect, useRef, useState } from "react";
import { TOUR_AREAS, tours, type Tour } from "../data/tours";
import { formatYear } from "../data/eras";
import { CopyLinkButton } from "./CopyLinkButton";
import { LAYERS, LAYER_GROUPS, type LayerId, type LayerVisibility } from "../lib/layers";

interface HeaderMenuProps {
  year: number;
  onAbout: () => void;
  onStartTour: (tour: Tour) => void;
  comparing: boolean;
  onToggleCompare: () => void;
  getViewUrl: () => string;
  overlaysEnabled: boolean;
  onOverlaysEnabledChange: (v: boolean) => void;
  overlaysAuto: boolean;
  onOverlaysAutoChange: (v: boolean) => void;
  overlayOpacity: number;
  onOverlayOpacityChange: (v: number) => void;
  overlayActiveLabel: string;
  layers: LayerVisibility;
  onLayerChange: (id: LayerId, on: boolean) => void;
}

export function HeaderMenu({
  year,
  onAbout,
  onStartTour,
  comparing,
  onToggleCompare,
  getViewUrl,
  overlaysEnabled,
  onOverlaysEnabledChange,
  overlaysAuto,
  onOverlaysAutoChange,
  overlayOpacity,
  onOverlayOpacityChange,
  overlayActiveLabel,
  layers,
  onLayerChange,
}: HeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // Hand focus back to the toggle if it was somewhere in the panel.
      if (rootRef.current?.contains(document.activeElement)) {
        rootRef.current.querySelector<HTMLButtonElement>(".header-menu-btn")?.focus();
      }
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="header-menu" ref={rootRef}>
      <button
        className="header-menu-btn"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="header-menu-panel"
        aria-label="Menu: tours, layers, and more"
        title="Menu"
      >
        ⋯
      </button>

      {open && (
        <div className="header-menu-panel" id="header-menu-panel">
          {/* A disclosure, not an ARIA menu: it holds checkboxes and a
              slider, and Tab (not arrow keys) moves through it. */}
          <button
            className="header-menu-item"
            type="button"
            onClick={() => {
              setOpen(false);
              onAbout();
            }}
          >
            About this project
          </button>

          <button
            className="header-menu-item"
            type="button"
            onClick={() => {
              setOpen(false);
              onToggleCompare();
            }}
          >
            {comparing ? "Close Then & Now" : "Then & Now"}
            <span className="header-menu-item-sub">
              {comparing
                ? "Back to a single map."
                : `Wipe between ${formatYear(year)} and an earlier year of your choosing.`}
            </span>
          </button>

          <CopyLinkButton
            className="header-menu-item"
            label="Copy link to this view"
            getUrl={getViewUrl}
          />

          <div className="header-menu-divider" role="separator" />

          <div className="header-menu-section" role="group" aria-label="Guided tours">
            <div className="header-menu-section-title">Guided tours</div>
            <p className="header-menu-section-note">
              Scripted walks through time and across the map.
            </p>
            {TOUR_AREAS.map((area) => {
              const inArea = tours.filter((t) => t.area === area.id);
              if (!inArea.length) return null;
              return (
                <details key={area.id} className="header-menu-tour-group">
                  <summary>
                    <span className="header-menu-tour-group-title">{area.title}</span>
                    <span className="header-menu-tour-group-count">{inArea.length}</span>
                  </summary>
                  {inArea.map((tour) => (
                    <button
                      key={tour.id}
                      className="header-menu-tour"
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onStartTour(tour);
                      }}
                    >
                      <span className="header-menu-tour-title">{tour.title}</span>
                      <span className="header-menu-tour-sub">{tour.subtitle}</span>
                    </button>
                  ))}
                </details>
              );
            })}
          </div>

          <div className="header-menu-divider" role="separator" />

          <div className="header-menu-section" role="group" aria-label="Map layers">
            <div className="header-menu-section-title">Map layers</div>
            {LAYER_GROUPS.map((group) => (
              <div key={group.id} className="header-menu-layer-group" role="group" aria-labelledby={`layer-group-${group.id}`}>
                <div id={`layer-group-${group.id}`} className="header-menu-layer-group-title">
                  {group.title}
                </div>
                {LAYERS.filter((l) => l.group === group.id).map((layer) => (
                  <div key={layer.id}>
                    <label className="header-menu-check">
                      <input
                        type="checkbox"
                        checked={layers[layer.id]}
                        onChange={(e) => onLayerChange(layer.id, e.target.checked)}
                      />
                      {layer.label}
                    </label>
                    <p className="header-menu-section-note">{layer.note}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="header-menu-divider" role="separator" />

          <div className="header-menu-section" role="group" aria-label="Historical map overlays">
            <div className="header-menu-section-title">Historical maps</div>
            <p className="header-menu-section-note">
              Optional georeferenced sheets: Castello, Ratzer, and Viele over Manhattan; the 1845 Coast Survey chart over Brooklyn, Queens, and Staten Island.
            </p>

            <label className="header-menu-check">
              <input
                type="checkbox"
                checked={overlaysEnabled}
                onChange={(e) => onOverlaysEnabledChange(e.target.checked)}
              />
              Show overlays
            </label>

            {overlaysEnabled && (
              <div className="header-menu-subsection">
                <label className="header-menu-check">
                  <input
                    type="checkbox"
                    checked={overlaysAuto}
                    onChange={(e) => onOverlaysAutoChange(e.target.checked)}
                  />
                  Follow timeline
                </label>

                <div className="header-menu-opacity">
                  <span className="header-menu-opacity-label">Opacity</span>
                  <input
                    type="range"
                    className="header-menu-opacity-slider"
                    min={0.15}
                    max={1}
                    step={0.05}
                    value={overlayOpacity}
                    onChange={(e) =>
                      onOverlayOpacityChange(parseFloat(e.target.value))
                    }
                    aria-valuetext={`${Math.round(overlayOpacity * 100)}%`}
                  />
                  <span className="header-menu-opacity-value">
                    {Math.round(overlayOpacity * 100)}%
                  </span>
                </div>

                <div className="header-menu-active" title="Active overlay(s) for the current year">
                  {overlayActiveLabel}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
