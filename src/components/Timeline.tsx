import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Entry } from "../types";
import { eras, formatYear } from "../data/eras";
import { allEntries } from "../data/entries";
import {
  clampWindow,
  panWindow,
  ticksFor,
  unitOfYear,
  xToYear,
  yearToX,
  zoomWindow,
  type TimeWindow,
} from "../lib/timescale";
import { useElementSize } from "../lib/useElementSize";

interface TimelineProps {
  window: TimeWindow;
  onWindowChange: (w: TimeWindow) => void;
  onSelectEntry: (entry: Entry) => void;
  playing: boolean;
  onTogglePlay: () => void;
}

const BAND_H = 30;
const AXIS_H = 26;
const MARKS_H = 64;
const HEIGHT = BAND_H + AXIS_H + MARKS_H;

const KIND_GLYPH: Record<Entry["kind"], string> = {
  person: "●",
  place: "■",
  event: "◆",
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Timeline({
  window: win,
  onWindowChange,
  onSelectEntry,
  playing,
  onTogglePlay,
}: TimelineProps) {
  const { ref, width } = useElementSize<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const anim = useRef<number | null>(null);

  const winRef = useRef(win);
  winRef.current = win;
  const widthRef = useRef(width);
  widthRef.current = width;

  const cancelAnim = useCallback(() => {
    if (anim.current !== null) {
      cancelAnimationFrame(anim.current);
      anim.current = null;
    }
  }, []);

  const flyTo = useCallback(
    (target: TimeWindow) => {
      cancelAnim();
      const from = { ...winRef.current };
      const to = clampWindow(target);
      const t0 = performance.now();
      const duration = 650;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const e = easeInOutCubic(p);
        onWindowChange({
          u0: from.u0 + (to.u0 - from.u0) * e,
          u1: from.u1 + (to.u1 - from.u1) * e,
        });
        if (p < 1) {
          anim.current = requestAnimationFrame(step);
        } else {
          anim.current = null;
        }
      };
      anim.current = requestAnimationFrame(step);
    },
    [cancelAnim, onWindowChange]
  );

  useEffect(() => cancelAnim, [cancelAnim]);

  // Wheel needs passive:false to preventDefault, so attach manually.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelAnim();
      const w = winRef.current;
      const wd = widthRef.current;
      if (!wd) return;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (e.ctrlKey || Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const factor = Math.pow(2, -e.deltaY * (e.ctrlKey ? 0.012 : 0.0022));
        const uFixed = w.u0 + (x / wd) * (w.u1 - w.u0);
        onWindowChange(zoomWindow(w, factor, uFixed));
      } else {
        onWindowChange(panWindow(w, (e.deltaX / wd) * (w.u1 - w.u0)));
      }
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [cancelAnim, onWindowChange]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    cancelAnim();
    drag.current = { x: e.clientX, moved: false };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !width) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    drag.current.x = e.clientX;
    onWindowChange(panWindow(win, (-dx / width) * (win.u1 - win.u0)));
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag.current && !drag.current.moved && width) {
      // Treat as a click: recenter the timeline on the clicked year.
      const rect = svgRef.current!.getBoundingClientRect();
      const u = win.u0 + ((e.clientX - rect.left) / width) * (win.u1 - win.u0);
      const span = win.u1 - win.u0;
      flyTo({ u0: u - span / 2, u1: u + span / 2 });
    }
    drag.current = null;
  };

  const ticks = useMemo(
    () => (width ? ticksFor(win, width) : []),
    [win, width]
  );

  const span = win.u1 - win.u0;
  const centerX = width / 2;

  const showMarkLabels = span < 0.22;

  // Entries visible in the current window, staggered across three lanes with
  // label-width-aware collision avoidance.
  const marks = useMemo(() => {
    if (!width) return [];
    const t0 = xToYear(-20, win, width);
    const t1 = xToYear(width + 20, win, width);
    const visible = allEntries
      .filter((e) => e.year >= t0 && e.year <= t1)
      .sort((a, b) => a.year - b.year);
    const laneEnd = [-Infinity, -Infinity, -Infinity];
    return visible.map((entry, i) => {
      const x = yearToX(entry.year, win, width);
      let lane = -1;
      for (let l = 0; l < 3; l++) {
        if (laneEnd[l] <= x - 8) {
          lane = l;
          break;
        }
      }
      let labeled = false;
      if (lane === -1) {
        lane = i % 3;
      } else if (showMarkLabels) {
        labeled = true;
        laneEnd[lane] = x + entry.title.length * 6.4 + 16;
      } else {
        laneEnd[lane] = x + 8;
      }
      return { entry, x, lane, labeled };
    });
  }, [win, width, showMarkLabels]);

  const zoomBy = (factor: number) => {
    const uCenter = (win.u0 + win.u1) / 2;
    flyTo(zoomWindow(win, factor, uCenter));
  };

  return (
    <div className="timeline" ref={ref}>
      <div className="timeline-controls">
        <button
          className="tl-btn"
          onClick={onTogglePlay}
          title={playing ? "Pause" : "Play through time"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button className="tl-btn" onClick={() => zoomBy(1.6)} title="Zoom in">
          +
        </button>
        <button className="tl-btn" onClick={() => zoomBy(1 / 1.6)} title="Zoom out">
          −
        </button>
        <button
          className="tl-btn tl-btn-wide"
          onClick={() => flyTo({ u0: 0, u1: 1 })}
          title="Show all of time"
        >
          ⟲ All
        </button>
      </div>
      {width > 0 && (
        <svg
          ref={svgRef}
          className="timeline-svg"
          width={width}
          height={HEIGHT}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => (drag.current = null)}
        >
          {/* Era bands */}
          {eras.map((era) => {
            const x0 = yearToX(era.start, win, width);
            const x1 = yearToX(era.end, win, width);
            if (x1 < 0 || x0 > width) return null;
            const bw = x1 - x0;
            return (
              <g key={era.id}>
                <rect
                  className="era-band"
                  x={x0}
                  y={0}
                  width={bw}
                  height={BAND_H}
                  fill={era.color}
                  onClick={(e) => {
                    e.stopPropagation();
                    const pad = (unitOfYear(era.end) - unitOfYear(era.start)) * 0.06;
                    flyTo({
                      u0: unitOfYear(era.start) - pad,
                      u1: unitOfYear(era.end) + pad,
                    });
                  }}
                >
                  <title>
                    {era.name} ({era.subtitle})
                  </title>
                </rect>
                {(() => {
                  // Center the label within the visible portion of the band,
                  // shortening or hiding it when it doesn't fit.
                  const visW = Math.min(x1, width) - Math.max(x0, 0);
                  const full = era.name;
                  const short = era.name.split(" ")[0];
                  const label =
                    visW > full.length * 9 + 18
                      ? full
                      : visW > short.length * 9 + 18
                        ? short
                        : null;
                  if (!label) return null;
                  const cx = (Math.max(x0, 0) + Math.min(x1, width)) / 2;
                  return (
                    <text className="era-band-label" x={cx} y={BAND_H / 2 + 4}>
                      {label}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* Axis ticks */}
          <line className="axis-line" x1={0} x2={width} y1={BAND_H} y2={BAND_H} />
          {ticks.map((t) => (
            <g key={t.year} transform={`translate(${t.x},${BAND_H})`}>
              <line className="tick-line" y2={t.major ? 9 : 5} />
              {t.major && (
                <text className="tick-label" y={20}>
                  {formatYear(t.year)}
                </text>
              )}
            </g>
          ))}

          {/* Entry marks */}
          {marks.map(({ entry, x, lane, labeled }) => {
            const y = BAND_H + AXIS_H + 10 + lane * 17;
            const era = eras.find((e) => e.id === entry.era);
            return (
              <g
                key={entry.id}
                className="entry-mark"
                transform={`translate(${x},${y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEntry(entry);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <text className="entry-glyph" fill={era?.color}>
                  {KIND_GLYPH[entry.kind]}
                </text>
                {labeled && (
                  <text className="entry-label" x={7} y={1}>
                    {entry.title}
                  </text>
                )}
                <title>{`${entry.title} (${entry.yearLabel ?? formatYear(entry.year)})`}</title>
              </g>
            );
          })}

          {/* Center playhead */}
          <g transform={`translate(${centerX},0)`}>
            <line className="playhead" y1={0} y2={HEIGHT} />
            <path className="playhead-caret" d={`M -6 0 L 6 0 L 0 8 Z`} />
          </g>
        </svg>
      )}
    </div>
  );
}
