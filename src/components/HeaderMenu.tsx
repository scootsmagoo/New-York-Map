import { useEffect, useRef, useState } from "react";

interface HeaderMenuProps {
  onAbout: () => void;
  overlaysEnabled: boolean;
  onOverlaysEnabledChange: (v: boolean) => void;
  overlaysAuto: boolean;
  onOverlaysAutoChange: (v: boolean) => void;
  overlayOpacity: number;
  onOverlayOpacityChange: (v: number) => void;
  overlayActiveLabel: string;
}

export function HeaderMenu({
  onAbout,
  overlaysEnabled,
  onOverlaysEnabledChange,
  overlaysAuto,
  onOverlaysAutoChange,
  overlayOpacity,
  onOverlayOpacityChange,
  overlayActiveLabel,
}: HeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
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
        aria-haspopup="menu"
        title="Menu"
      >
        ⋯
      </button>

      {open && (
        <div className="header-menu-panel" role="menu">
          <button
            className="header-menu-item"
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onAbout();
            }}
          >
            About this project
          </button>

          <div className="header-menu-divider" role="separator" />

          <div className="header-menu-section" role="group" aria-label="Historical map overlays">
            <div className="header-menu-section-title">Historical maps</div>
            <p className="header-menu-section-note">
              Optional georeferenced sheets (Castello, Ratzer, Viele) over Manhattan.
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
