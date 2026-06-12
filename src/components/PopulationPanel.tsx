import { useMemo, useState } from "react";
import {
  formatPopulation,
  populationAt,
  scopeLabel,
  SEGMENT_META,
  type SegmentKey,
} from "../data/population";
import { settlementsForGroup } from "../data/settlements";

interface PopulationPanelProps {
  year: number;
  showSettlements: boolean;
  onShowSettlementsChange: (v: boolean) => void;
  highlightGroup: SegmentKey | null;
  onHighlightGroup: (g: SegmentKey | null) => void;
  onOpenChange: (open: boolean) => void;
}

const MIN_PCT = 1;

export function PopulationPanel({
  year,
  showSettlements,
  onShowSettlementsChange,
  highlightGroup,
  onHighlightGroup,
  onOpenChange,
}: PopulationPanelProps) {
  const [open, setOpen] = useState(false);
  const pop = useMemo(() => populationAt(year), [year]);

  const toggleOpen = () => {
    setOpen((o) => {
      const next = !o;
      onOpenChange(next);
      return next;
    });
  };

  const hoveredSettlements = useMemo(() => {
    if (!highlightGroup || !open) return [];
    return settlementsForGroup(year, pop.scope, highlightGroup);
  }, [highlightGroup, open, year, pop.scope]);

  return (
    <div className={`population-panel${open ? " population-panel-open" : ""}`}>
      <button
        className="population-toggle"
        onClick={toggleOpen}
        aria-expanded={open}
        title={open ? "Hide population" : "Show population"}
      >
        <span className="population-toggle-icon" aria-hidden>
          ◉
        </span>
        <span className="population-toggle-text">
          {pop.estimate ? "~" : ""}
          {formatPopulation(pop.total, !open)}
        </span>
        <span className="population-toggle-caret" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
      </button>

      {open && (
        <div className="population-body">
          <div className="population-header">
            <span className="population-title">Population</span>
            <span className="population-scope">{scopeLabel(pop.scope)}</span>
          </div>

          <div className="population-total">
            {pop.estimate && <span className="population-est">~</span>}
            {formatPopulation(pop.total)}
          </div>

          {pop.segments.length > 0 && (
            <>
              <div
                className="population-strip"
                role="img"
                aria-label={`Demographic composition in ${year}`}
              >
                {pop.segments.map((s) => (
                  <div
                    key={s.key}
                    className={`population-strip-seg${
                      highlightGroup && highlightGroup !== s.key
                        ? " population-strip-seg-dim"
                        : ""
                    }`}
                    style={{
                      flex: s.value,
                      background: SEGMENT_META[s.key].color,
                    }}
                    title={`${SEGMENT_META[s.key].label}: ${formatPopulation(s.value)} (${s.pct.toFixed(1)}%)`}
                  />
                ))}
              </div>

              <ul className="population-legend">
                {pop.segments
                  .filter((s) => s.pct >= MIN_PCT)
                  .map((s) => (
                    <LegendRow
                      key={s.key}
                      segmentKey={s.key}
                      value={s.value}
                      pct={s.pct}
                      active={highlightGroup === s.key}
                      onEnter={() => onHighlightGroup(s.key)}
                      onLeave={() => onHighlightGroup(null)}
                    />
                  ))}
              </ul>
            </>
          )}

          <label className="population-map-toggle">
            <input
              type="checkbox"
              checked={showSettlements}
              onChange={(e) => onShowSettlementsChange(e.target.checked)}
            />
            Show enclaves on map
          </label>

          {highlightGroup && hoveredSettlements.length > 0 && (
            <div className="population-enclaves">
              <div className="population-enclaves-title">
                {SEGMENT_META[highlightGroup].label} enclaves
              </div>
              <ul>
                {hoveredSettlements.map((s) => (
                  <li key={s.id}>
                    <strong>{s.name}</strong>
                    <span>{s.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="population-note">
            Census &amp; scholarly estimates; enclave locations are approximate.
          </p>
        </div>
      )}
    </div>
  );
}

function LegendRow({
  segmentKey,
  value,
  pct,
  active,
  onEnter,
  onLeave,
}: {
  segmentKey: SegmentKey;
  value: number;
  pct: number;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const meta = SEGMENT_META[segmentKey];
  return (
    <li
      className={`population-legend-row${active ? " population-legend-row-active" : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span
        className="population-swatch"
        style={{ background: meta.color }}
      />
      <span className="population-legend-label">{meta.label}</span>
      <span className="population-legend-count">{formatPopulation(value, true)}</span>
      <span className="population-legend-pct">{pct.toFixed(1)}%</span>
    </li>
  );
}
