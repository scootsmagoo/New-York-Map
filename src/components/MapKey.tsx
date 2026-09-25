import { memo } from "react";
import { usePersistedState } from "../lib/usePersistedState";

/** What's drawn on the map right now; the key lists only these. */
export interface MapKeyVisible {
  builtUp: boolean;
  streets: boolean;
  survey: boolean;
  wall: boolean;
  canal: boolean;
  parks: boolean;
  parkConstruction: boolean;
  bridges: boolean;
  ferries: boolean;
  elevated: boolean;
  subway: boolean;
  aqueduct: boolean;
  people: boolean;
  places: boolean;
  events: boolean;
  ghosts: boolean;
  lenape: boolean;
  enclaves: boolean;
  lostLandscape: boolean;
  /** Label of the historical map sheet showing, if any. */
  overlay: string | null;
}

const W = 30;
const H = 16;

/** An ellipse as a path: the map's water styles target `path` elements. */
const ellipseD = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

/** A tiny drawing in the map's own classes, so the key always matches it. */
function Swatch({ children }: { children: React.ReactNode }) {
  return (
    <svg className="map-key-swatch" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
      {children}
    </svg>
  );
}

const line = (className: string, extra?: React.SVGProps<SVGPathElement>) => (
  <path className={className} d={`M2 ${H / 2} L${W - 2} ${H / 2}`} {...extra} />
);

const hatchLines = (className: string, pitch = 4) =>
  Array.from({ length: 12 }, (_, i) => (
    <line
      key={i}
      x1={-H + i * pitch}
      y1={H}
      x2={i * pitch}
      y2={0}
      className={className}
      style={{ strokeWidth: 0.6 }}
    />
  ));

function marker(kind: "person" | "place" | "event", ghost = false) {
  const s = 6;
  const shape =
    kind === "person" ? (
      <circle r={s * 0.62} />
    ) : kind === "place" ? (
      <rect x={-s * 0.55} y={-s * 0.55} width={s * 1.1} height={s * 1.1} />
    ) : (
      <path d={`M0 ${-s * 0.7} L${s * 0.7} 0 L0 ${s * 0.7} L${-s * 0.7} 0Z`} />
    );
  return (
    <g className={`marker marker-${kind}${ghost ? " marker-ghost" : ""}`} transform={`translate(${W / 2},${H / 2})`}>
      {shape}
    </g>
  );
}

interface Row {
  show: boolean;
  label: string;
  swatch: React.ReactNode;
}

function MapKeyInner({ visible: v }: { visible: MapKeyVisible }) {
  const [open, setOpen] = usePersistedState("mapKeyOpen", false);

  const clip = (id: string) => (
    <clipPath id={id}>
      <rect x={1} y={1} width={W - 2} height={H - 2} rx={2} />
    </clipPath>
  );

  const rows: Row[] = [
    {
      show: v.builtUp,
      label: "Built-up city (approximate)",
      swatch: (
        <Swatch>
          {clip("mk-built")}
          <rect className="footprint" x={1} y={1} width={W - 2} height={H - 2} rx={2} />
          <g clipPath="url(#mk-built)">{v.streets && hatchLines("hatch-line")}</g>
        </Swatch>
      ),
    },
    { show: v.streets, label: "Street", swatch: <Swatch>{line("street")}</Swatch> },
    { show: v.survey, label: "1811 grid: surveyed, not yet built", swatch: <Swatch>{line("grid-survey")}</Swatch> },
    { show: v.wall, label: "The Wall (1653–99)", swatch: <Swatch>{line("street street-wall")}</Swatch> },
    { show: v.canal, label: "Canal", swatch: <Swatch>{line("street street-canal")}</Swatch> },
    {
      show: v.parks,
      label: "Park",
      swatch: (
        <Swatch>
          <rect className="park" x={2} y={2} width={W - 4} height={H - 4} rx={2} />
        </Swatch>
      ),
    },
    {
      show: v.parkConstruction,
      label: "Park under construction",
      swatch: (
        <Swatch>
          {clip("mk-cons")}
          <g clipPath="url(#mk-cons)">
            <rect className="construction-bg" width={W} height={H} />
            {hatchLines("construction-line", 5)}
          </g>
        </Swatch>
      ),
    },
    { show: v.bridges, label: "Bridge", swatch: <Swatch>{line("bridge")}</Swatch> },
    { show: v.ferries, label: "Ferry route", swatch: <Swatch>{line("ferry")}</Swatch> },
    { show: v.elevated, label: "Elevated railway", swatch: <Swatch>{line("infra infra-elevated")}</Swatch> },
    { show: v.subway, label: "Subway", swatch: <Swatch>{line("infra infra-subway")}</Swatch> },
    { show: v.aqueduct, label: "Croton Aqueduct", swatch: <Swatch>{line("infra infra-aqueduct")}</Swatch> },
    { show: v.people, label: "Person", swatch: <Swatch>{marker("person")}</Swatch> },
    { show: v.places, label: "Place", swatch: <Swatch>{marker("place")}</Swatch> },
    { show: v.events, label: "Event", swatch: <Swatch>{marker("event")}</Swatch> },
    { show: v.ghosts, label: "Demolished building", swatch: <Swatch>{marker("place", true)}</Swatch> },
    {
      show: v.lenape,
      label: "Lenape village and trail",
      swatch: (
        <Swatch>
          <path className="lenape-trail" d={`M2 ${H - 3} L${W - 2} ${H - 3}`} />
          <g className="lenape-site" transform={`translate(${W / 2},${H / 2 - 1})`}>
            <path d="M 0 -4.5 L 4 2.5 L -4 2.5 Z" />
          </g>
        </Swatch>
      ),
    },
    {
      show: v.enclaves,
      label: "Immigrant or community enclave",
      swatch: (
        <Swatch>
          <circle className="settlement-blob" cx={W / 2} cy={H / 2} r={6} fill="#2e6e8e" stroke="#2e6e8e" />
        </Swatch>
      ),
    },
    {
      show: v.lostLandscape,
      label: "Shoreline in 1609",
      swatch: (
        <Swatch>
          <g className="lost-landscape">{line("ll-shoreline")}</g>
        </Swatch>
      ),
    },
    {
      show: v.lostLandscape,
      label: "River, filled in later",
      swatch: (
        <Swatch>
          <g className="lost-landscape">
            <rect className="ll-unfilled" x={1} y={1} width={W - 2} height={H - 2} rx={2} />
          </g>
        </Swatch>
      ),
    },
    {
      show: v.lostLandscape,
      label: "Made land (filled so far)",
      swatch: (
        <Swatch>
          {[0, 1, 2, 3, 4, 5, 6].flatMap((i) =>
            [0, 1, 2].map((j) => (
              <circle key={`${i}-${j}`} className="made-land-dot" cx={3 + i * 4 + (j % 2) * 2} cy={3.5 + j * 4.5} r={0.9} />
            ))
          )}
        </Swatch>
      ),
    },
    {
      show: v.lostLandscape,
      label: "Pond · marsh · stream",
      swatch: (
        <Swatch>
          <g className="lost-landscape">
            <g className="ll-pond">
              <path d={ellipseD(6, H / 2, 4.5, 4)} />
            </g>
            <g className="ll-marsh">
              <path d="M12 5 H19 V12 H12Z" />
            </g>
            <g className="ll-stream">
              <path d={`M21 12 Q24 4 28 6`} />
            </g>
          </g>
        </Swatch>
      ),
    },
    {
      show: v.lostLandscape,
      label: "Filled or buried: a ghost",
      swatch: (
        <Swatch>
          <g className="lost-landscape">
            <g className="ll-pond ll-gone">
              <path d={ellipseD(W / 2, H / 2, 10, 5)} />
            </g>
          </g>
        </Swatch>
      ),
    },
  ];

  const shown = rows.filter((r) => r.show);

  return (
    <div className={`map-key${open ? " map-key-open" : ""}`}>
      <button
        type="button"
        className="tl-btn map-key-btn"
        aria-expanded={open}
        aria-controls="map-key-panel"
        onClick={() => setOpen((o) => !o)}
        title={open ? "Hide the map key" : "What's on the map?"}
      >
        Key
      </button>
      {open && (
        <div id="map-key-panel" className="map-key-panel" role="region" aria-label="Map key">
          <ul>
            {shown.map((r) => (
              <li key={r.label}>
                {r.swatch}
                <span>{r.label}</span>
              </li>
            ))}
          </ul>
          {v.overlay && <p className="map-key-note">Historical map: {v.overlay}</p>}
          {!v.streets && v.builtUp && <p className="map-key-note">Zoom in for streets and more.</p>}
        </div>
      )}
    </div>
  );
}

export const MapKey = memo(MapKeyInner, (a, b) =>
  (Object.keys(a.visible) as (keyof MapKeyVisible)[]).every((k) => a.visible[k] === b.visible[k])
);
