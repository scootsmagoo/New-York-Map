import { memo } from "react";
import type { Era } from "../types";
import { formatYear } from "../data/eras";
import { HeaderMenu } from "./HeaderMenu";
import type { Tour } from "../data/tours";

interface HeaderProps {
  year: number;
  era: Era;
  onSearch: () => void;
  onExploreEra: () => void;
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
  showStreetLabels: boolean;
  onShowStreetLabelsChange: (v: boolean) => void;
  showNeighborhoods: boolean;
  onShowNeighborhoodsChange: (v: boolean) => void;
}

function HeaderInner({
  year,
  era,
  onSearch,
  onExploreEra,
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
  showStreetLabels,
  onShowStreetLabelsChange,
  showNeighborhoods,
  onShowNeighborhoodsChange,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <h1>Gotham</h1>
        <span className="brand-sub">A Timeline of New York City</span>
      </div>

      <div className="year-display">
        <div className="year-now">{formatYear(year)}</div>
        <div className="era-now">
          <span className="era-now-name" style={{ color: era.color }}>
            {era.name}
          </span>
          <span className="era-now-sub">{era.subtitle}</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="search-btn"
          type="button"
          onClick={onSearch}
          title="Search (Ctrl+K)"
          aria-label="Search people, places, and events"
        >
          <span className="search-btn-icon" aria-hidden>
            ⌕
          </span>
          <span className="search-btn-label">Search</span>
          <kbd className="search-kbd" aria-hidden>
            ⌘K
          </kbd>
        </button>
        <button
          className="explore-btn"
          style={{ background: era.color }}
          onClick={onExploreEra}
        >
          Explore this era
        </button>
        <HeaderMenu
          year={year}
          onAbout={onAbout}
          onStartTour={onStartTour}
          comparing={comparing}
          onToggleCompare={onToggleCompare}
          getViewUrl={getViewUrl}
          overlaysEnabled={overlaysEnabled}
          onOverlaysEnabledChange={onOverlaysEnabledChange}
          overlaysAuto={overlaysAuto}
          onOverlaysAutoChange={onOverlaysAutoChange}
          overlayOpacity={overlayOpacity}
          onOverlayOpacityChange={onOverlayOpacityChange}
          overlayActiveLabel={overlayActiveLabel}
          showStreetLabels={showStreetLabels}
          onShowStreetLabelsChange={onShowStreetLabelsChange}
          showNeighborhoods={showNeighborhoods}
          onShowNeighborhoodsChange={onShowNeighborhoodsChange}
        />
      </div>
    </header>
  );
}

export const Header = memo(HeaderInner);
