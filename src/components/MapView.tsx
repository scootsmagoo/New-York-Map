import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";
import "d3-transition";
import {
  zoom,
  zoomIdentity,
  type D3ZoomEvent,
  type ZoomBehavior,
} from "d3-zoom";
import type { Entry, FootprintSnapshot } from "../types";
import { footprintAt, frontierAt, frontierBand } from "../data/footprints";
import { lenapeSites, lenapeTerritories, lenapeTrails } from "../data/lenapeSites";
import { bridges, ferries } from "../data/structures";
import { infrastructureLines } from "../data/infrastructure";
import { parks } from "../data/parks";
import {
  colonialStreets,
  streetFeatureActive,
  streetMidpoint,
  streetTooltip,
  type ColonialStreet,
} from "../data/streets";
import { gridSegments, GRID_ZONE_RING, type Seg } from "../lib/grid";
import { allEntries } from "../data/entries";
import { eraForYear } from "../data/eras";
import { populationAt, SEGMENT_META, type SegmentKey } from "../data/population";
import { settlementsAt } from "../data/settlements";
import { HISTORICAL_OVERLAYS } from "../data/historicalOverlays";
import {
  overlayAutoWeights,
  overlayManualPick,
  overlayPlacement,
} from "../lib/historicalOverlays";
import { StreetLabelLayer } from "./StreetLabelLayer";
import { NeighborhoodLayer } from "./NeighborhoodLayer";
import { boroughLabels, type MapLabel } from "../data/mapLabels";
import type { MapFocus } from "../data/tours";
import type { CameraLink } from "../lib/mapCamera";
import { useElementSize } from "../lib/useElementSize";
import boroughsData from "../data/geo/boroughs.json";
import surroundData from "../data/geo/surround.json";

interface MapViewProps {
  year: number;
  selectedEntry: Entry | null;
  /** Bumped on every selection so re-clicking the same entry still flies the map. */
  focusToken: number;
  focusStreet?: ColonialStreet | null;
  streetFocusToken?: number;
  /** Scripted camera target (guided tours); null pulls back to the whole city. */
  focusPoint?: MapFocus | null;
  focusPointToken?: number;
  onSelectEntry: (entry: Entry) => void;
  showSettlements?: boolean;
  highlightGroup?: SegmentKey | null;
  overlaysEnabled?: boolean;
  overlaysAuto?: boolean;
  overlayOpacity?: number;
  showStreetLabels?: boolean;
  showNeighborhoods?: boolean;
  /** Keeps pan/zoom in step with other maps sharing the link (compare mode). */
  cameraLink?: CameraLink;
  /** Reset button and attribution; off for the second map in compare mode. */
  chrome?: boolean;
}

type GeoJSON = any;

/** Fixed geographic frame so layout doesn't shift as data changes. */
const FRAME: GeoJSON = {
  type: "Polygon",
  coordinates: [
    [
      [-74.28, 40.49],
      [-73.69, 40.49],
      [-73.69, 40.94],
      [-74.28, 40.94],
      [-74.28, 40.49],
    ].reverse(),
  ],
};

const KIND_SYMBOL = {
  person: (s: number) => <circle r={s * 0.62} />,
  place: (s: number) => (
    <rect x={-s * 0.55} y={-s * 0.55} width={s * 1.1} height={s * 1.1} />
  ),
  event: (s: number) => (
    <path
      d={`M 0 ${-s * 0.7} L ${s * 0.7} 0 L 0 ${s * 0.7} L ${-s * 0.7} 0 Z`}
    />
  ),
} as const;

const WATER_LABELS: MapLabel[] = [
  { text: "Hudson River", coords: [-73.984, 40.8155], rotate: -73 },
  { text: "East River", coords: [-73.9555, 40.7475], rotate: -63 },
  { text: "Harlem River", coords: [-73.9255, 40.8345], rotate: -52 },
  { text: "Upper Bay", coords: [-74.048, 40.6555] },
  { text: "Lower Bay", coords: [-74.052, 40.5215] },
  { text: "Jamaica Bay", coords: [-73.8745, 40.6065] },
  { text: "Long Island Sound", coords: [-73.7485, 40.8825], rotate: -13 },
  { text: "Newark Bay", coords: [-74.138, 40.672], rotate: -80 },
];

/** Street-hatch angles per borough, matching each grid's rough orientation. */
const HATCH_ANGLES: Record<string, number> = {
  Brooklyn: 18,
  Queens: -8,
  Bronx: 2,
  "Staten Island": 35,
};

/** Linear fade for zoom-based level of detail. */
function fade(k: number, from: number, to: number): number {
  return Math.max(0, Math.min(1, (k - from) / (to - from)));
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/**
 * Bucket zoom level so React only re-renders when level-of-detail thresholds
 * are crossed — not on every pan/zoom frame.
 */
function zoomLodBand(k: number): number {
  if (k < 1.4) return 0;
  if (k < 1.5) return 1;
  if (k < 1.8) return 2;
  if (k < 2.0) return 3;
  if (k < 2.2) return 4;
  if (k < 2.5) return 5;
  if (k < 2.8) return 6;
  if (k < 3.6) return 7;
  return 8;
}

/** Project a geographic radius to screen pixels at a point. */
function projectedRadius(
  projection: (c: [number, number]) => [number, number] | null,
  coords: [number, number],
  radiusDeg: number
): number {
  const c = projection(coords);
  const edge = projection([coords[0] + radiusDeg, coords[1]]);
  if (!c || !edge) return 8;
  return Math.max(6, Math.hypot(edge[0] - c[0], edge[1] - c[1]));
}

/** Let keyboard users activate SVG markers with Enter or Space. */
function activateOnKey(fn: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };
}

/** Fade a demolished landmark's ghost in over a few years. */
function ghostOpacity(year: number, demolished: number): number {
  return clamp01((year - demolished) / 8) * 0.55;
}

/** Fade a settlement in over a few years after it forms, out before it ends. */
function settlementOpacity(
  year: number,
  from: number,
  to?: number
): number {
  const inFade = clamp01((year - from) / 6);
  if (to === undefined) return inFade;
  const outFade = clamp01((to - year) / 6);
  return inFade * outFade;
}

/** Rings are authored counterclockwise; d3-geo wants clockwise exteriors. */
function toGeo(rings: [number, number][][]): GeoJSON {
  return {
    type: "MultiPolygon",
    coordinates: rings.map((ring) => {
      const closed = [...ring, ring[0]];
      return [closed.slice().reverse()];
    }),
  };
}

function ringCentroid(ring: [number, number][]): [number, number] {
  let x = 0;
  let y = 0;
  for (const p of ring) {
    x += p[0];
    y += p[1];
  }
  return [x / ring.length, y / ring.length];
}

function ringBboxArea(ring: [number, number][]): number {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const [x, y] of ring) {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  }
  return (x1 - x0) * (y1 - y0);
}

const MAJOR_PARK_AREA = 5e-5;

function MapViewInner({
  year,
  selectedEntry,
  focusToken,
  focusStreet = null,
  streetFocusToken = 0,
  focusPoint = null,
  focusPointToken = 0,
  onSelectEntry,
  showSettlements = false,
  highlightGroup = null,
  overlaysEnabled = false,
  overlaysAuto = true,
  overlayOpacity = 0.72,
  showStreetLabels = false,
  showNeighborhoods = false,
  cameraLink,
  chrome = true,
}: MapViewProps) {
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const transformRef = useRef(zoomIdentity);
  const lodBandRef = useRef(zoomLodBand(1));
  const [zoomK, setZoomK] = useState(1);
  const cameraId = useRef(Symbol("map")).current;
  const adoptedCamera = useRef(false);

  const applyTransform = (t: typeof zoomIdentity) => {
    transformRef.current = t;
    contentRef.current?.setAttribute("transform", t.toString());
    const band = zoomLodBand(t.k);
    if (band !== lodBandRef.current) {
      lodBandRef.current = band;
      setZoomK(t.k);
    }
  };

  // Layers that lay out by viewport (street names) re-query when the view
  // settles rather than on every frame of a pan.
  const settledListeners = useRef(new Set<() => void>());
  const onViewSettled = useCallback((fn: () => void) => {
    settledListeners.current.add(fn);
    return () => {
      settledListeners.current.delete(fn);
    };
  }, []);
  const getTransform = useCallback(() => transformRef.current, []);

  const syncZoomK = (t: typeof zoomIdentity) => {
    transformRef.current = t;
    contentRef.current?.setAttribute("transform", t.toString());
    lodBandRef.current = zoomLodBand(t.k);
    setZoomK(t.k);
    for (const fn of settledListeners.current) fn();
  };

  const projection = useMemo(() => {
    if (!width || !height) return null;
    return geoMercator().fitExtent(
      [
        [10, 10],
        [width - 10, height - 10],
      ],
      FRAME as any
    );
  }, [width, height]);

  const path = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection]
  );

  // Static geometry, serialized once per projection rather than on every
  // render: the borough shorelines alone are ~6,700 vertices and were being
  // re-stringified four times per frame during autoplay.
  const boroughPaths = useMemo(() => {
    if (!path) return [];
    return (boroughsData as any).features.map((f: any) => ({
      boro: f.properties?.boro as string,
      d: path(f) ?? "",
    }));
  }, [path]);

  const landClipD = useMemo(
    () => boroughPaths.map((b: { d: string }) => b.d).join(""),
    [boroughPaths]
  );

  const surroundPaths = useMemo(() => {
    if (!path) return [];
    return (surroundData as any).features.map((f: any) => path(f) ?? "");
  }, [path]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !width || !height) return;
    // True while applying a transform that another map published, so it
    // isn't echoed back.
    let following = false;
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 16])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (e: D3ZoomEvent<SVGSVGElement, unknown>) => {
        // Imperative transform during gesture — avoids re-rendering the full SVG tree.
        applyTransform(e.transform);
        if (!following) cameraLink?.publish(e.transform, cameraId);
      })
      .on("end", (e: D3ZoomEvent<SVGSVGElement, unknown>) => {
        // A follower settles when its leader does, not after every step.
        if (following) return;
        syncZoomK(e.transform);
        cameraLink?.publish(e.transform, cameraId, true);
      });
    zoomRef.current = behavior;
    const sel = select(svg);
    sel.call(behavior);
    syncZoomK(zoomIdentity);
    const follow = (t: { k: number; x: number; y: number }, settled: boolean) => {
      const next = zoomIdentity.translate(t.x, t.y).scale(t.k);
      following = true;
      sel.interrupt();
      behavior.transform(sel, next);
      following = false;
      if (settled) syncZoomK(next);
    };
    // A map that mounts beside another (compare mode) starts where that one
    // is. Only once: re-running on resize would cut short a flight in progress.
    if (cameraLink?.current && !adoptedCamera.current) follow(cameraLink.current, true);
    adoptedCamera.current = true;
    const unsubscribe = cameraLink?.subscribe((t, source, settled) => {
      if (source !== cameraId) follow(t, settled);
    });
    return () => {
      unsubscribe?.();
      sel.on(".zoom", null);
      sel.on(".end", null);
      zoomRef.current = null;
    };
  }, [width, height, cameraLink, cameraId]);

  // Pan/zoom to the selected entry or street.
  useEffect(() => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (!svg || !behavior || !projection || !width || !height) return;

    const coords =
      selectedEntry?.coords ??
      (focusStreet ? streetMidpoint(focusStreet) : undefined);
    if (!coords) return;

    const pos = projection(coords);
    if (!pos) return;

    const [px, py] = pos;
    const targetK = Math.max(transformRef.current.k, focusStreet ? 4.2 : 3.5);
    const next = zoomIdentity
      .scale(targetK)
      .translate(width / 2 / targetK - px, height / 2 / targetK - py);

    select(svg)
      .transition()
      .duration(500)
      .call(behavior.transform as any, next);
  }, [
    selectedEntry,
    focusStreet,
    focusToken,
    streetFocusToken,
    projection,
    width,
    height,
  ]);

  // Guided-tour camera: fly to an explicit point and zoom, or pull back.
  // A token that arrives before the map has measured itself (a #tour deep
  // link on first load) is applied once the projection exists; a resize
  // afterwards must not re-fly, hence the applied-token ref.
  const appliedFocusToken = useRef(0);
  useEffect(() => {
    if (!focusPointToken || appliedFocusToken.current === focusPointToken) return;
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (!svg || !behavior || !projection || !width || !height) return;
    appliedFocusToken.current = focusPointToken;

    let next = zoomIdentity;
    if (focusPoint) {
      const pos = projection(focusPoint.coords);
      if (!pos) return;
      const targetK = Math.max(1, Math.min(16, focusPoint.k));
      next = zoomIdentity
        .scale(targetK)
        .translate(width / 2 / targetK - pos[0], height / 2 / targetK - pos[1]);
    }
    select(svg)
      .transition()
      .duration(900)
      .call(behavior.transform as any, next);
  }, [focusPointToken, focusPoint, projection, width, height]);

  const resetZoom = () => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (!svg || !behavior) return;
    select(svg)
      .transition()
      .duration(500)
      .call(behavior.transform as any, zoomIdentity);
  };


  const k = zoomK;
  const era = eraForYear(year);

  // ----- Level-of-detail fades -----
  const roadFade = fade(k, 1.5, 2.2); // colonial streets + grid
  const ferryFade = fade(k, 1.4, 2.0);
  const infraFade = fade(k, 1.6, 2.4); // els, subway, aqueduct
  const minorParkFade = fade(k, 1.8, 2.5);
  const labelFade = fade(k, 2.8, 3.6);
  const expandMarkers = k >= 2;

  // ----- Footprint -----
  const { base, next, progress } = footprintAt(year);

  // Snapshots are shared objects, so these only recompute when the playhead
  // crosses into a new snapshot interval (14 times across the whole timeline).
  const projectSnapshot = (snapshot: FootprintSnapshot | null) => {
    if (!snapshot || !path) return { manhattan: "", other: "" };
    return {
      manhattan: snapshot.manhattan.length ? (path(toGeo(snapshot.manhattan)) ?? "") : "",
      other: snapshot.other.length ? (path(toGeo(snapshot.other)) ?? "") : "",
    };
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const basePaths = useMemo(() => projectSnapshot(base), [path, base]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nextPaths = useMemo(() => projectSnapshot(next), [path, next]);

  // The brown wash recedes as street detail fades in, so lines stay legible.
  const washFade = 1 - fade(k, 1.5, 2.6) * 0.45;

  const renderFootprint = (
    paths: { manhattan: string; other: string },
    opacity = 1
  ) => (
    <>
      {paths.manhattan && (
        <g clipPath="url(#manhattan-clip)">
          <path
            className="footprint"
            d={paths.manhattan}
            style={{ opacity: opacity * washFade }}
          />
        </g>
      )}
      {paths.other && (
        <g clipPath="url(#land-clip)">
          <path
            className="footprint"
            d={paths.other}
            style={{ opacity: opacity * washFade }}
          />
        </g>
      )}
    </>
  );

  // ----- Procedural grid -----
  const gridD = useMemo(() => {
    if (!projection) return "";
    const { streets, avenues } = gridSegments();
    const seg = (s: Seg) => {
      const a = projection(s[0])!;
      const b = projection(s[1])!;
      return `M${a[0].toFixed(1)},${a[1].toFixed(1)}L${b[0].toFixed(1)},${b[1].toFixed(1)}`;
    };
    return [...streets, ...avenues].map(seg).join("");
  }, [projection]);

  const surveyOpacity = clamp01((year - 1807) / 10) * roadFade;
  const cpHole = year >= 1857;
  const centralParkRing = parks[0].ring;

  const zoneOnlyD = useMemo(
    () => (path ? (path(toGeo([GRID_ZONE_RING])) ?? "") : ""),
    [path]
  );

  const gridZoneD = useMemo(() => {
    if (!path) return "";
    const hole = cpHole ? (path(toGeo([centralParkRing])) ?? "") : "";
    return zoneOnlyD + hole;
  }, [path, zoneOnlyD, cpHole, centralParkRing]);

  // Everything on the map EXCEPT the grid zone — clips the crooked-streets
  // hatch to downtown and the Village.
  const notGridD = useMemo(() => {
    if (!path) return "";
    return (path(FRAME) ?? "") + zoneOnlyD;
  }, [path, zoneOnlyD]);

  const builtClipD = useMemo(() => {
    if (!path) return "";
    const f = frontierAt(year);
    return path(toGeo([frontierBand(f), ...base.manhattan])) ?? "";
  }, [path, year, base]);

  // ----- Colonial streets -----
  const streetPaths = useMemo(() => {
    if (!projection) return [];
    return colonialStreets.map((s) => ({
      ...s,
      d: s.pts
        .map((p, i) => {
          const [x, y] = projection(p)!;
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(""),
    }));
  }, [projection]);

  // ----- Structures -----
  const structurePaths = useMemo(() => {
    if (!projection) return [];
    return [...ferries, ...bridges].map((s) => {
      const projected = s.pts.map((p) => projection(p)!);
      const d = projected
        .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
        .join("");
      const a = projected[0];
      const b = projected[projected.length - 1];
      let angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;
      return {
        ...s,
        d,
        mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as [number, number],
        angle,
      };
    });
  }, [projection]);

  // ----- Infrastructure (els, subway, aqueduct) -----
  const infrastructurePaths = useMemo(() => {
    if (!projection) return [];
    return infrastructureLines.map((line) => {
      const projected = line.pts.map((p) => projection(p)!);
      const d = projected
        .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
        .join("");
      const a = projected[0];
      const b = projected[projected.length - 1];
      let angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;
      return {
        ...line,
        d,
        mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as [number, number],
        angle,
      };
    });
  }, [projection]);

  // ----- Parks -----
  const parkPaths = useMemo(() => {
    if (!path || !projection) return [];
    return parks.map((p) => ({
      ...p,
      d: path(toGeo([p.ring])) ?? "",
      center: projection(ringCentroid(p.ring))!,
      major: ringBboxArea(p.ring) >= MAJOR_PARK_AREA,
    }));
  }, [path, projection]);

  // ----- Markers: era-based at low zoom, lifespan-based when zoomed -----
  const markers = useMemo(() => {
    return allEntries.filter((e) => {
      if (!e.coords) return false;
      if (e.lifespan) {
        const alive =
          year >= e.lifespan[0] &&
          (e.lifespan[1] === null || year <= e.lifespan[1]);
        if (!alive) return false;
        return expandMarkers || e.era === era.id;
      }
      return e.era === era.id;
    });
  }, [year, era.id, expandMarkers]);

  // Demolished landmarks leave faint "ghost" markers when zoomed in.
  const ghostMarkers = useMemo(() => {
    if (!expandMarkers) return [];
    return allEntries.filter((e) => {
      if (!e.coords || !e.lifespan) return false;
      const demolished = e.lifespan[1];
      return demolished !== null && year > demolished;
    });
  }, [year, expandMarkers]);

  const lenapeOpacity = year <= 1609 ? 1 : Math.max(0, 1 - (year - 1609) / 71);

  const popScope = useMemo(() => populationAt(year).scope, [year]);
  const settlementFade = fade(k, 1.2, 1.8);

  const overlayWeights = useMemo(() => {
    if (!overlaysEnabled) return new Map<string, number>();
    if (overlaysAuto) return overlayAutoWeights(year);
    const id = overlayManualPick(year);
    const weights = new Map<string, number>();
    if (id) weights.set(id, 1);
    return weights;
  }, [overlaysEnabled, overlaysAuto, year]);

  const overlayFrames = useMemo(() => {
    if (!projection || !overlaysEnabled) return [];
    return HISTORICAL_OVERLAYS.map((overlay) => ({
      overlay,
      placement: overlayPlacement(projection, overlay.bounds),
      weight: overlayWeights.get(overlay.id) ?? 0,
    })).filter((f) => f.placement && f.weight > 0);
  }, [projection, overlaysEnabled, overlayWeights]);

  const visibleSettlements = useMemo(() => {
    if (!showSettlements || !projection) return [];
    return settlementsAt(year, popScope).map((s) => {
      const pos = projection(s.coords)!;
      const r = projectedRadius(projection, s.coords, s.radiusDeg);
      const baseOpacity = settlementOpacity(year, s.from, s.to) * settlementFade;
      const highlighted =
        !highlightGroup || s.groups.includes(highlightGroup);
      const color = SEGMENT_META[s.primaryGroup].color;
      return {
        ...s,
        pos,
        r,
        color,
        opacity: highlighted ? baseOpacity : baseOpacity * 0.2,
        strokeOpacity: highlighted ? 0.85 : 0.25,
      };
    });
  }, [showSettlements, year, popScope, projection, settlementFade, highlightGroup]);

  if (!width || !height) return <div className="map-view" ref={ref} />;

  return (
    <div className="map-view" ref={ref}>
      <svg
        ref={svgRef}
        className="map-svg"
        width={width}
        height={height}
        role="img"
        aria-label={`Map of New York City in ${year}`}
      >
        <defs>
          {/* One <path> per clipPath: WebKit clips geometrically only when a
              clipPath holds a single shape, and otherwise rasterizes a mask on
              every pan/zoom frame (10 fps vs 60 fps on the footprint wash). */}
          <clipPath id="land-clip">
            <path d={landClipD} />
          </clipPath>
          <clipPath id="manhattan-clip">
            {boroughPaths
              .filter((b: { boro: string }) => b.boro === "Manhattan")
              .map((b: { boro: string; d: string }) => (
                <path key={b.boro} d={b.d} />
              ))}
          </clipPath>
          {boroughPaths
            .filter((b: { boro: string }) => b.boro !== "Manhattan")
            .map((b: { boro: string; d: string }) => (
              <clipPath key={b.boro} id={`clip-${b.boro.replace(/ /g, "-")}`}>
                <path d={b.d} />
              </clipPath>
            ))}
          <clipPath id="gridzone-clip">
            <path d={gridZoneD} clipRule="evenodd" />
          </clipPath>
          <clipPath id="notgrid-clip">
            <path d={notGridD} clipRule="evenodd" />
          </clipPath>
          <pattern
            id="hatch-Manhattan"
            width={5}
            height={5}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(8) scale(${1 / k})`}
          >
            <line x1={0} y1={2.5} x2={5} y2={2.5} className="hatch-line" />
          </pattern>
          <clipPath id="built-clip">
            <path d={builtClipD} />
          </clipPath>
          {Object.entries(HATCH_ANGLES).map(([boro, angle]) => (
            <pattern
              key={boro}
              id={`hatch-${boro.replace(/ /g, "-")}`}
              width={5}
              height={5}
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${angle}) scale(${1 / k})`}
            >
              <line x1={0} y1={2.5} x2={5} y2={2.5} className="hatch-line" />
            </pattern>
          ))}
          <pattern
            id="construction-hatch"
            width={6}
            height={6}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(45) scale(${1 / k})`}
          >
            <rect width={6} height={6} className="construction-bg" />
            <line x1={0} y1={3} x2={6} y2={3} className="construction-line" />
          </pattern>
        </defs>

        <rect className="map-water" width={width} height={height} />

        <g ref={contentRef} className="map-content">
          {/* Surrounding land */}
          {surroundPaths.map((d: string, i: number) => (
            <path key={`s${i}`} className="map-surround" d={d} />
          ))}

          {/* The five boroughs */}
          {boroughPaths.map((b: { boro: string; d: string }) => (
            <path key={b.boro} className="map-land" d={b.d}>
              <title>{b.boro}</title>
            </path>
          ))}

          {/* Built-up footprint, clipped to the real shoreline */}
          {renderFootprint(basePaths)}
          {next && renderFootprint(nextPaths, 0.25 + 0.75 * progress)}

          {/* Georeferenced historical map sheets (Manhattan only) */}
          {overlayFrames.length > 0 && (
            <g className="historical-overlays" clipPath="url(#manhattan-clip)">
              {overlayFrames.map(({ overlay, placement, weight }) => (
                <image
                  key={overlay.id}
                  className="historical-overlay"
                  href={overlay.src}
                  x={placement!.x}
                  y={placement!.y}
                  width={placement!.width}
                  height={placement!.height}
                  preserveAspectRatio="none"
                  opacity={overlayOpacity * weight}
                >
                  <title>{overlay.label}</title>
                </image>
              ))}
            </g>
          )}

          {/* Street-hatch texture over the outer-borough footprint */}
          {roadFade > 0 &&
            base.other.length > 0 &&
            Object.keys(HATCH_ANGLES).map((boro) => (
              <g
                key={boro}
                clipPath={`url(#clip-${boro.replace(/ /g, "-")})`}
                style={{ opacity: roadFade }}
              >
                <path
                  d={basePaths.other}
                  fill={`url(#hatch-${boro.replace(/ /g, "-")})`}
                  stroke="none"
                />
              </g>
            ))}

          {/* Crooked-street hatch for built Manhattan outside the grid zone */}
          {roadFade > 0 && base.manhattan.length > 0 && (
            <g clipPath="url(#manhattan-clip)" style={{ opacity: roadFade }}>
              <g clipPath="url(#notgrid-clip)">
                <path
                  d={basePaths.manhattan}
                  fill="url(#hatch-Manhattan)"
                  stroke="none"
                />
              </g>
            </g>
          )}

          {/* The 1811 grid: faint survey lines, then built streets sweeping north */}
          {surveyOpacity > 0 && (
            <g clipPath="url(#manhattan-clip)">
              <g clipPath="url(#gridzone-clip)">
                <path
                  className="grid-survey"
                  d={gridD}
                  style={{ opacity: surveyOpacity * 0.5 }}
                />
                <g clipPath="url(#built-clip)">
                  <path
                    className="grid-built"
                    d={gridD}
                    style={{ opacity: roadFade }}
                  />
                </g>
              </g>
            </g>
          )}

          {/* Colonial roads */}
          {roadFade > 0 &&
            streetPaths
              .filter((s) => year >= s.from && (s.to === undefined || year <= s.to))
              .map((s) => {
                const featureOn = streetFeatureActive(s, year);
                const focused = focusStreet?.id === s.id;
                const streetClass = [
                  "street",
                  featureOn && s.feature === "wall" ? "street-wall" : "",
                  featureOn && s.feature === "canal" ? "street-canal" : "",
                  focused ? "street-focused" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <g key={s.id} style={{ opacity: roadFade }}>
                    <path className={streetClass} d={s.d} />
                    <title>{streetTooltip(s, year)}</title>
                  </g>
                );
              })}

          {/* Parks */}
          {parkPaths
            .filter((p) => year >= p.from)
            .map((p) => {
              const constructing = p.completed !== undefined && year < p.completed;
              const visible = p.major ? 1 : minorParkFade;
              if (visible <= 0) return null;
              return (
                <g key={p.id} style={{ opacity: visible }}>
                  <path
                    className={constructing ? "park park-construction" : "park"}
                    d={p.d}
                  >
                    <title>
                      {p.name}
                      {constructing ? " (under construction)" : ""}
                    </title>
                  </path>
                  {labelFade > 0 && (
                    <text
                      className="park-label"
                      transform={`translate(${p.center[0]},${p.center[1]}) scale(${1 / k})`}
                      style={{ opacity: labelFade }}
                    >
                      {p.name}
                    </text>
                  )}
                </g>
              );
            })}

          {/* Ferries and bridges */}
          {structurePaths
            .filter(
              (s) =>
                year >= s.open && (s.close === undefined || year <= s.close)
            )
            .map((s) => {
              const opacity = s.kind === "ferry" ? ferryFade * 0.8 : 1;
              if (opacity <= 0) return null;
              const entry = s.entryId
                ? allEntries.find((e) => e.id === s.entryId)
                : undefined;
              return (
                <g key={s.id} style={{ opacity }}>
                  <path
                    className={s.kind === "ferry" ? "ferry" : "bridge"}
                    d={s.d}
                    onClick={entry ? () => onSelectEntry(entry) : undefined}
                    style={entry ? { cursor: "pointer" } : undefined}
                  />
                  <title>{s.name}</title>
                  {s.kind === "bridge" && labelFade > 0 && (
                    <text
                      className="bridge-label"
                      transform={`translate(${s.mid[0]},${s.mid[1]}) rotate(${s.angle}) scale(${1 / k})`}
                      style={{ opacity: labelFade }}
                      y={-5}
                    >
                      {s.name}
                    </text>
                  )}
                </g>
              );
            })}

          {/* Els, subway, and Croton Aqueduct */}
          {infrastructurePaths
            .filter(
              (line) =>
                year >= line.open &&
                (line.close === undefined || year <= line.close)
            )
            .map((line) => {
              if (infraFade <= 0) return null;
              const entry = line.entryId
                ? allEntries.find((e) => e.id === line.entryId)
                : undefined;
              const clip =
                line.kind === "aqueduct" ? undefined : "url(#manhattan-clip)";
              return (
                <g key={line.id} clipPath={clip} style={{ opacity: infraFade }}>
                  <path
                    className={`infra infra-${line.kind}`}
                    d={line.d}
                    onClick={entry ? () => onSelectEntry(entry) : undefined}
                    style={entry ? { cursor: "pointer" } : undefined}
                  />
                  <title>{line.name}</title>
                  {labelFade > 0 && line.kind !== "aqueduct" && (
                    <text
                      className="infra-label"
                      transform={`translate(${line.mid[0]},${line.mid[1]}) rotate(${line.angle}) scale(${1 / k})`}
                      style={{ opacity: labelFade * 0.85 }}
                      y={line.kind === "subway" ? 6 : -5}
                    >
                      {line.name}
                    </text>
                  )}
                </g>
              );
            })}

          {/* Street names — every named street, decluttered to what fits */}
          {showStreetLabels && (
            <StreetLabelLayer
              project={projection}
              year={year}
              k={k}
              width={width}
              height={height}
              getTransform={getTransform}
              onViewSettled={onViewSettled}
              fade={roadFade}
            />
          )}

          {showNeighborhoods && (
            <NeighborhoodLayer project={projection} year={year} k={k} />
          )}

          {/* Lenapehoking layer */}
          {lenapeOpacity > 0 && (
            <g className="lenape-layer" style={{ opacity: lenapeOpacity }}>
              {lenapeTrails.map((trail, i) => (
                <path
                  key={`t${i}`}
                  className="lenape-trail"
                  d={trail
                    .map((p, j) => {
                      const [x, y] = projection!(p)!;
                      return `${j === 0 ? "M" : "L"}${x},${y}`;
                    })
                    .join(" ")}
                />
              ))}
              {lenapeSites.map((site) => {
                const [x, y] = projection!(site.coords)!;
                return (
                  <g
                    key={site.name}
                    transform={`translate(${x},${y}) scale(${1 / k})`}
                    className="lenape-site"
                  >
                    <path d="M 0 -4.5 L 4 2.5 L -4 2.5 Z" />
                    <text y={-8}>{site.name}</text>
                    <title>{`${site.name} — ${site.note}`}</title>
                  </g>
                );
              })}
              {lenapeTerritories.map((t) => {
                const [x, y] = projection!(t.coords)!;
                return (
                  <text
                    key={t.name}
                    className="territory-label"
                    transform={`translate(${x},${y}) scale(${1 / k})`}
                  >
                    {t.name}
                  </text>
                );
              })}
            </g>
          )}

          {/* Borough labels fade in as the Lenape world fades out */}
          <g style={{ opacity: 1 - lenapeOpacity }}>
            {boroughLabels(year).map((l) => {
              const [x, y] = projection!(l.coords)!;
              return (
                <text
                  key={l.text}
                  className="boro-label"
                  transform={`translate(${x},${y}) rotate(${l.rotate ?? 0}) scale(${1 / k})`}
                >
                  {l.text}
                </text>
              );
            })}
          </g>

          {/* Water labels */}
          {WATER_LABELS.map((l) => {
            const [x, y] = projection!(l.coords)!;
            return (
              <text
                key={l.text}
                className="water-label"
                transform={`translate(${x},${y}) rotate(${l.rotate ?? 0}) scale(${1 / k})`}
              >
                {l.text}
              </text>
            );
          })}

          {/* Immigrant & community enclaves (population panel) */}
          {visibleSettlements.length > 0 && (
            <g className="settlement-layer">
              {visibleSettlements.map((s) => (
                <g
                  key={s.id}
                  transform={`translate(${s.pos[0]},${s.pos[1]})`}
                  style={{ opacity: s.opacity }}
                >
                  <circle
                    className="settlement-blob"
                    r={s.r}
                    fill={s.color}
                    stroke={s.color}
                    style={{ strokeOpacity: s.strokeOpacity }}
                  />
                  {labelFade > 0 && (
                    <text
                      className="settlement-label"
                      y={-s.r - 4}
                      transform={`scale(${1 / k})`}
                      style={{ opacity: labelFade }}
                    >
                      {s.name}
                    </text>
                  )}
                  <title>{`${s.name} (${s.from}${s.to ? `–${s.to}` : "–"}) — ${s.note}`}</title>
                </g>
              ))}
            </g>
          )}

          {/* Demolished landmark ghosts */}
          {ghostMarkers.map((m) => {
            const demolished = m.lifespan![1]!;
            const pos = projection!(m.coords!);
            if (!pos) return null;
            const opacity = ghostOpacity(year, demolished);
            if (opacity <= 0) return null;
            return (
              <g
                key={`ghost-${m.id}`}
                className={`marker marker-ghost marker-${m.kind}`}
                transform={`translate(${pos[0]},${pos[1]}) scale(${1 / k})`}
                style={{ opacity }}
                role="button"
                tabIndex={0}
                aria-label={`${m.title} (demolished ${demolished})`}
                onClick={() => onSelectEntry(m)}
                onKeyDown={activateOnKey(() => onSelectEntry(m))}
              >
                <circle className="marker-halo" r={11} />
                {KIND_SYMBOL[m.kind](9)}
                <text className="marker-label marker-label-ghost" y={-12}>
                  {m.title}
                </text>
                <title>{`${m.title} (demolished ${demolished})`}</title>
              </g>
            );
          })}

          {/* Entry markers */}
          {markers.map((m) => {
            const pos = projection!(m.coords!);
            if (!pos) return null;
            return (
              <g
                key={m.id}
                className={`marker marker-${m.kind}`}
                transform={`translate(${pos[0]},${pos[1]}) scale(${1 / k})`}
                role="button"
                tabIndex={0}
                aria-label={m.title}
                onClick={() => onSelectEntry(m)}
                onKeyDown={activateOnKey(() => onSelectEntry(m))}
              >
                <circle className="marker-halo" r={11} />
                {KIND_SYMBOL[m.kind](9)}
                <text className="marker-label" y={-12}>
                  {m.title}
                </text>
                <title>{m.title}</title>
              </g>
            );
          })}
        </g>
      </svg>

      {chrome && (
        <>
          <div className="map-controls">
            <button className="tl-btn" onClick={resetZoom} title="Reset map view">
              ⌖
            </button>
          </div>
          <div className="map-attribution">
            Boundaries: U.S. Census Bureau &amp; NYC Open Data · Content: Wikipedia ·
            Built-up extents, streets &amp; sites are approximate
          </div>
        </>
      )}
    </div>
  );
}

export const MapView = memo(MapViewInner);
