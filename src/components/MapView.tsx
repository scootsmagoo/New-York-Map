import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";
import "d3-transition";
import {
  zoom,
  zoomIdentity,
  type D3ZoomEvent,
  type ZoomBehavior,
} from "d3-zoom";
import type { Entry } from "../types";
import { footprintAt } from "../data/footprints";
import { lenapeSites, lenapeTerritories, lenapeTrails } from "../data/lenapeSites";
import { useElementSize } from "../lib/useElementSize";
import boroughsData from "../data/geo/boroughs.json";
import surroundData from "../data/geo/surround.json";

interface MapViewProps {
  year: number;
  markers: Entry[];
  onSelectEntry: (entry: Entry) => void;
}

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

type GeoJSON = any;

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

interface MapLabel {
  text: string;
  coords: [number, number];
  rotate?: number;
  cls?: string;
}

function boroughLabels(year: number): MapLabel[] {
  if (year < 1609) return [];
  const labels: MapLabel[] = [
    { text: "MANHATTAN", coords: [-73.9619, 40.79], rotate: -61 },
    { text: year < 1664 ? "BREUCKELEN" : "BROOKLYN", coords: [-73.946, 40.6395] },
    { text: year < 1664 ? "STAATEN EYLANDT" : "STATEN ISLAND", coords: [-74.1525, 40.5715] },
  ];
  if (year >= 1683) {
    labels.push({ text: "QUEENS", coords: [-73.7945, 40.733] });
    labels.push({
      text: year < 1874 ? "WESTCHESTER" : "THE BRONX",
      coords: [-73.8585, 40.8655],
    });
  }
  return labels;
}

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

export function MapView({ year, markers, onSelectEntry }: MapViewProps) {
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [transform, setTransform] = useState(zoomIdentity);

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

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !width || !height) return;
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (e: D3ZoomEvent<SVGSVGElement, unknown>) =>
        setTransform(e.transform)
      );
    zoomRef.current = behavior;
    const sel = select(svg);
    sel.call(behavior);
    return () => {
      sel.on(".zoom", null);
      zoomRef.current = null;
    };
  }, [width, height]);

  const resetZoom = () => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (!svg || !behavior) return;
    select(svg)
      .transition()
      .duration(500)
      .call(behavior.transform as any, zoomIdentity);
  };

  const { base, next, progress } = footprintAt(year);

  // Rings are authored counterclockwise; d3-geo wants clockwise exteriors.
  const toGeo = (rings: [number, number][][]): GeoJSON => ({
    type: "MultiPolygon",
    coordinates: rings.map((ring) => {
      const closed = [...ring, ring[0]];
      return [closed.slice().reverse()];
    }),
  });

  const renderFootprint = (
    snapshot: { manhattan: [number, number][][]; other: [number, number][][] },
    opacity?: number
  ) => (
    <>
      {snapshot.manhattan.length > 0 && (
        <g clipPath="url(#manhattan-clip)">
          <path
            className="footprint"
            d={path!(toGeo(snapshot.manhattan)) ?? undefined}
            style={opacity !== undefined ? { opacity } : undefined}
          />
        </g>
      )}
      {snapshot.other.length > 0 && (
        <g clipPath="url(#land-clip)">
          <path
            className="footprint"
            d={path!(toGeo(snapshot.other)) ?? undefined}
            style={opacity !== undefined ? { opacity } : undefined}
          />
        </g>
      )}
    </>
  );

  // Lenape layer fades from full at 1609 to nothing by 1680.
  const lenapeOpacity =
    year <= 1609 ? 1 : Math.max(0, 1 - (year - 1609) / 71);

  const k = transform.k;

  if (!width || !height) return <div className="map-view" ref={ref} />;

  return (
    <div className="map-view" ref={ref}>
      <svg ref={svgRef} className="map-svg" width={width} height={height}>
        <defs>
          <clipPath id="land-clip">
            {(boroughsData as any).features.map((f: any, i: number) => (
              <path key={i} d={path!(f) ?? undefined} />
            ))}
          </clipPath>
          <clipPath id="manhattan-clip">
            {(boroughsData as any).features
              .filter((f: any) => f.properties?.boro === "Manhattan")
              .map((f: any, i: number) => (
                <path key={i} d={path!(f) ?? undefined} />
              ))}
          </clipPath>
        </defs>

        <rect className="map-water" width={width} height={height} />

        <g transform={transform.toString()}>
          {/* Surrounding land */}
          {(surroundData as any).features.map((f: any, i: number) => (
            <path key={`s${i}`} className="map-surround" d={path!(f) ?? undefined} />
          ))}

          {/* The five boroughs */}
          {(boroughsData as any).features.map((f: any, i: number) => (
            <path key={`b${i}`} className="map-land" d={path!(f) ?? undefined}>
              <title>{f.properties?.boro}</title>
            </path>
          ))}

          {/* Built-up footprint, clipped to the real shoreline */}
          {renderFootprint(base)}
          {next && renderFootprint(next, 0.25 + 0.75 * progress)}

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

          {/* Era markers */}
          {markers.map((m) => {
            const pos = projection!(m.coords!);
            if (!pos) return null;
            return (
              <g
                key={m.id}
                className={`marker marker-${m.kind}`}
                transform={`translate(${pos[0]},${pos[1]}) scale(${1 / k})`}
                onClick={() => onSelectEntry(m)}
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

      <div className="map-controls">
        <button className="tl-btn" onClick={resetZoom} title="Reset map view">
          ⌖
        </button>
      </div>
      <div className="map-attribution">
        Boundaries: U.S. Census Bureau · Content: Wikipedia · Built-up extents are
        approximate
      </div>
    </div>
  );
}
