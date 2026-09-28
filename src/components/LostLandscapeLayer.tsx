import { memo, useEffect, useMemo, useState } from "react";
import { footprintAt, frontierAt, frontierBand } from "../data/footprints";
import { lostWaters } from "../data/lostWaters";

/** As written by scripts/lost-landscape (see its README). */
interface LostLandscapeData {
  shoreline1609: [number, number][][];
  /** Land made by filling, by decade it was made. */
  fill: { year: number; rings: [number, number][][] }[];
  water: {
    kind: "pond" | "marsh" | "stream";
    id: string;
    name: string;
    /** Year filled or buried; null = when the built-up city reached it. */
    until: number | null;
    note: string;
    rings?: [number, number][][];
    lines?: [number, number][][];
  }[];
}

interface LostLandscapeLayerProps {
  project: ((c: [number, number]) => [number, number] | null) | null;
  year: number;
  k: number;
}

/**
 * The other four boroughs, from the USGS surveys of 1891–98
 * (scripts/lost-landscape-outer): marsh and water then that is land now,
 * with the year it was filled, or none if still wet in 1945.
 */
interface OuterLostLandscapeData {
  fill: { until: number; kind: "water" | "marsh"; rings: [number, number][][] }[];
  wet1945: { kind: "water" | "marsh"; rings: [number, number][][] }[];
}

let dataPromise: Promise<[LostLandscapeData, OuterLostLandscapeData]> | null = null;
function loadLostLandscape() {
  dataPromise ??= Promise.all([
    import("../data/geo/lostLandscape.json").then((m) => m.default as unknown as LostLandscapeData),
    import("../data/geo/lostLandscapeOuter.json").then(
      (m) => m.default as unknown as OuterLostLandscapeData
    ),
  ]);
  return dataPromise;
}

function inRing(pt: [number, number], ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** When the built-up city reached a point — the fate of unnamed marshes. */
function builtOverYear(pt: [number, number]): number {
  for (let y = 1609; y <= 1945; y++) {
    if (inRing(pt, frontierBand(frontierAt(y)))) return y;
    if (footprintAt(y).base.manhattan.some((r) => inRing(pt, r))) return y;
  }
  return 9999;
}

function centroid(ring: [number, number][]): [number, number] {
  let x = 0;
  let y = 0;
  for (const p of ring) {
    x += p[0];
    y += p[1];
  }
  return [x / ring.length, y / ring.length];
}

/** How long a filled pond or buried stream lingers as a ghost outline. */
const FADE_YEARS = 6;

/**
 * Manhattan's original shoreline and waters, from the Viele map (1865):
 * unfilled land drawn as water until the year it was made, ponds and
 * streams until they were filled or buried, then as faint ghosts. The
 * other boroughs' marshes and shallows of the 1890s, from the USGS
 * surveys, drawn the same way until filled.
 */
function LostLandscapeLayerInner({ project, year, k }: LostLandscapeLayerProps) {
  const [data, setData] = useState<LostLandscapeData | null>(null);
  const [outer, setOuter] = useState<OuterLostLandscapeData | null>(null);

  useEffect(() => {
    let alive = true;
    loadLostLandscape().then(([d, o]) => {
      if (!alive) return;
      setData(d);
      setOuter(o);
    });
    return () => {
      alive = false;
    };
  }, []);

  const paths = useMemo(() => {
    if (!data || !project) return null;
    const ringD = (ring: [number, number][]) => {
      let d = "";
      for (let i = 0; i < ring.length; i++) {
        const p = project(ring[i]);
        if (!p) continue;
        d += `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`;
      }
      return d + "Z";
    };
    const lineD = (line: [number, number][]) =>
      line
        .map((c, i) => {
          const p = project(c)!;
          return `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`;
        })
        .join("");
    const outerFill = (outer?.fill ?? []).map((f) => ({ ...f, d: f.rings.map(ringD).join("") }));
    const outerWet = (outer?.wet1945 ?? []).map((f) => ({ ...f, d: f.rings.map(ringD).join("") }));
    return {
      outerFill,
      outerWet,
      shoreline: data.shoreline1609.map(ringD).join(""),
      fill: data.fill.map((f) => ({ year: f.year, d: f.rings.map(ringD).join("") })),
      water: data.water.map((w) => {
        const until =
          w.until ?? (w.rings ? builtOverYear(centroid(w.rings[0])) : 9999);
        const labelAt = w.rings
          ? project(centroid(w.rings[0]))
          : w.lines
            ? project(w.lines[0][Math.floor(w.lines[0].length / 2)])
            : null;
        return {
          ...w,
          until,
          labelAt,
          d: w.rings ? w.rings.map(ringD).join("") : (w.lines ?? []).map(lineD).join(""),
        };
      }),
    };
  }, [data, outer, project]);

  // Land not yet made in `year` is still river (or, outside Manhattan, the
  // marsh it was); land already made is stippled.
  const { unfilled, made, marsh } = useMemo(() => {
    if (!paths) return { unfilled: "", made: "", marsh: "" };
    let unfilled = "";
    let made = "";
    let marsh = "";
    for (const f of paths.fill) {
      if (f.year > year) unfilled += f.d;
      else made += f.d;
    }
    for (const f of paths.outerFill) {
      if (f.until > year) {
        if (f.kind === "water") unfilled += f.d;
        else marsh += f.d;
      } else made += f.d;
    }
    for (const f of paths.outerWet) {
      if (f.kind === "water") unfilled += f.d;
      else marsh += f.d;
    }
    return { unfilled, made, marsh };
  }, [paths, year]);

  // Named outer-borough waters, labeled while still wet.
  const outerLabels = useMemo(
    () =>
      project
        ? lostWaters
            .filter((w) => w.outer && year <= w.until)
            .map((w) => ({ w, at: project(w.coords) }))
        : [],
    [project, year]
  );

  if (!paths) return null;
  const labelOpacity = Math.max(0, Math.min(1, (k - 2.6) / 0.8));

  return (
    <g className="lost-landscape">
      {made && <path className="ll-made" d={made} />}
      {unfilled && <path className="ll-unfilled" d={unfilled} />}
      {marsh && (
        <g className="ll-marsh ll-outer-marsh">
          <path d={marsh}>
            <title>Tidal marsh in the U.S. Geological Survey of the 1890s, later filled</title>
          </path>
        </g>
      )}
      <path className="ll-shoreline" d={paths.shoreline} />
      {paths.water.map((w) => {
        const gone = year > w.until;
        const ghost = gone ? Math.max(0.35, 1 - (year - w.until) / FADE_YEARS) : 1;
        return (
          <g
            key={w.id}
            className={`ll-${w.kind}${gone ? " ll-gone" : ""}`}
            style={ghost < 1 ? { opacity: ghost } : undefined}
          >
            <path d={w.d}>
              <title>
                {`${w.name}${w.until < 9999 ? (gone ? ` (gone ${w.until})` : ` (until ${w.until})`) : ""} — ${w.note}`}
              </title>
            </path>
            {labelOpacity > 0 && w.labelAt && w.name !== "Marsh" && (
              <text
                className="ll-label"
                transform={`translate(${w.labelAt[0]},${w.labelAt[1]}) scale(${1 / k})`}
                style={{ opacity: labelOpacity }}
              >
                {w.name}
              </text>
            )}
          </g>
        );
      })}
      {labelOpacity > 0 &&
        outerLabels.map(
          ({ w, at }) =>
            at && (
              <text
                key={w.id}
                className="ll-label"
                transform={`translate(${at[0]},${at[1]}) scale(${1 / k})`}
                style={{ opacity: labelOpacity }}
              >
                {w.name}
              </text>
            )
        )}
    </g>
  );
}

export const LostLandscapeLayer = memo(LostLandscapeLayerInner);
