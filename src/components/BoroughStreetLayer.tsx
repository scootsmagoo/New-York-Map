import { memo, useEffect, useMemo, useState } from "react";
import type { GeoProjection } from "d3-geo";
import type { ZoomTransform } from "d3-zoom";

/** As written by scripts/prepare-borough-streets.mjs. */
interface BoroughStreetFile {
  tile: number;
  q: number;
  /** "tx,ty" → lines of [decade, x0, y0, dx1, dy1, …] from the tile corner. */
  tiles: Record<string, number[][]>;
}

/** A tile's lines, decoded to lon/lat and grouped by the decade they were built. */
type Tile = { x: number; y: number; decades: [number, [number, number][][]][] };

const BOROUGH_FILES = {
  bk: () => import("../data/geo/streets-bk.json"),
  qn: () => import("../data/geo/streets-qn.json"),
  bx: () => import("../data/geo/streets-bx.json"),
  si: () => import("../data/geo/streets-si.json"),
};

// Decoded once and kept: ~800 KB of street lines for the four boroughs,
// fetched only the first time someone zooms in past the whole-city view.
let tilesPromise: Promise<{ size: number; tiles: Map<string, Tile> }> | null = null;
function loadTiles() {
  tilesPromise ??= Promise.all(Object.values(BOROUGH_FILES).map((f) => f())).then((files) => {
    const tiles = new Map<string, Tile>();
    let size = 0.02;
    files.forEach((m, b) => {
      const data = m.default as unknown as BoroughStreetFile;
      size = data.tile;
      for (const [key, lines] of Object.entries(data.tiles)) {
        const [tx, ty] = key.split(",").map(Number);
        const ox = tx * data.tile;
        const oy = ty * data.tile;
        const byDecade = new Map<number, [number, number][][]>();
        for (const enc of lines) {
          const pts: [number, number][] = [];
          let x = 0;
          let y = 0;
          for (let i = 1; i < enc.length; i += 2) {
            x += enc[i];
            y += enc[i + 1];
            pts.push([ox + x / data.q, oy + y / data.q]);
          }
          const list = byDecade.get(enc[0]) ?? [];
          list.push(pts);
          byDecade.set(enc[0], list);
        }
        tiles.set(`${b}:${key}`, {
          x: tx,
          y: ty,
          decades: [...byDecade.entries()].sort((a, c) => a[0] - c[0]),
        });
      }
    });
    return { size, tiles };
  });
  return tilesPromise;
}

interface BoroughStreetLayerProps {
  projection: GeoProjection | null;
  year: number;
  width: number;
  height: number;
  getTransform: () => ZoomTransform;
  onViewSettled: (fn: () => void) => () => void;
  /** 0–1: shown only once zoomed in past the whole-city view. */
  fade: number;
}

/**
 * Every street in Brooklyn, Queens, the Bronx, and Staten Island, drawn as
 * its blocks were built up. Only tiles near the screen are drawn, and they
 * are chosen when a pan or zoom settles, never during one.
 */
function BoroughStreetLayerInner({
  projection,
  year,
  width,
  height,
  getTransform,
  onViewSettled,
  fade,
}: BoroughStreetLayerProps) {
  const [data, setData] = useState<{ size: number; tiles: Map<string, Tile> } | null>(null);
  const [viewTick, setViewTick] = useState(0);
  const on = fade > 0;

  useEffect(() => {
    if (!on || data) return;
    let alive = true;
    loadTiles().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, [on, data]);

  useEffect(() => onViewSettled(() => setViewTick((t) => t + 1)), [onViewSettled]);

  // Projected path strings per tile and decade, made on first sight.
  const cache = useMemo(() => new Map<string, string>(), [projection]);

  const visible = useMemo(() => {
    if (!data || !projection?.invert || !on) return [];
    const t = getTransform();
    // The screen in map units, padded by half a screen each way.
    const x0 = -t.x / t.k;
    const y0 = -t.y / t.k;
    const w = width / t.k;
    const h = height / t.k;
    const a = projection.invert([x0 - w / 2, y0 - h / 2]);
    const b = projection.invert([x0 + w * 1.5, y0 + h * 1.5]);
    if (!a || !b) return [];
    const [lon0, lon1] = [Math.min(a[0], b[0]), Math.max(a[0], b[0])];
    const [lat0, lat1] = [Math.min(a[1], b[1]), Math.max(a[1], b[1])];
    const out: [string, Tile][] = [];
    for (const [key, tile] of data.tiles) {
      const tx0 = tile.x * data.size;
      const ty0 = tile.y * data.size;
      if (tx0 > lon1 || tx0 + data.size < lon0 || ty0 > lat1 || ty0 + data.size < lat0) continue;
      out.push([key, tile]);
    }
    return out;
    // viewTick: re-cull after each settled pan or zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, projection, width, height, on, viewTick]);

  // Tiles change by the decade, so scrubbing within one costs nothing.
  const decade = Math.floor(year / 10) * 10;
  const paths = useMemo(() => {
    if (!projection) return [];
    return visible.map(([key, tile]) => {
      let d = "";
      for (const [dec, lines] of tile.decades) {
        if (dec > decade) break;
        const cacheKey = `${key}|${dec}`;
        let s = cache.get(cacheKey);
        if (s === undefined) {
          s = "";
          for (const line of lines) {
            line.forEach((c, i) => {
              const p = projection(c);
              if (p) s += `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`;
            });
          }
          cache.set(cacheKey, s);
        }
        d += s;
      }
      return { key, d };
    });
  }, [visible, decade, projection, cache]);

  if (!on) return null;
  return (
    <g className="borough-streets" style={fade < 1 ? { opacity: fade } : undefined}>
      {paths.map(({ key, d }) => (d ? <path key={key} className="borough-street" d={d} /> : null))}
    </g>
  );
}

export const BoroughStreetLayer = memo(BoroughStreetLayerInner);
