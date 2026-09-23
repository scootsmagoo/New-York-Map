import { describe, expect, it } from "vitest";
import { geoMercator } from "d3-geo";
import { colonialStreets } from "../../data/streets";
import {
  buildStreetLabelIndex,
  declutterLabels,
  layoutStreetLabels,
  pathMidpointAndAngle,
  queryStreetLabels,
  streetLabelOpacity,
  type LabelCandidate,
  type StreetLabelData,
} from "../streetLabels";
import realData from "../../data/geo/streetLabels.json";

const projection = geoMercator().fitExtent(
  [
    [0, 0],
    [1400, 800],
  ],
  {
    type: "Polygon",
    coordinates: [
      [
        [-74.28, 40.49],
        [-74.28, 40.94],
        [-73.69, 40.94],
        [-73.69, 40.49],
        [-74.28, 40.49],
      ],
    ],
  } as any
);
const project = (c: [number, number]) => projection(c);

describe("street label layout", () => {
  it("fades labels in by tier as the map zooms", () => {
    expect(streetLabelOpacity("major", 1)).toBe(0);
    expect(streetLabelOpacity("major", 4)).toBe(1);
    expect(streetLabelOpacity("minor", 4)).toBe(0);
    expect(streetLabelOpacity("minor", 6)).toBe(1);
  });

  it("finds the midpoint and tangent of a polyline", () => {
    const { pos, angle } = pathMidpointAndAngle([
      [0, 0],
      [10, 0],
      [20, 0],
    ]);
    expect(pos).toEqual([10, 0]);
    expect(angle).toBeCloseTo(0, 9);
  });

  it("only labels streets that exist in the given year", () => {
    const labels = layoutStreetLabels(colonialStreets, project, 1640, 8);
    for (const { street } of labels) {
      expect(street.from).toBeLessThanOrEqual(1640);
      if (street.to !== undefined) expect(street.to).toBeGreaterThanOrEqual(1640);
    }
  });

});

const toCandidate = (text: string, pos: [number, number], rank = 0): LabelCandidate => ({
  key: text,
  text,
  pos,
  angle: 0,
  opacity: 1,
  rank,
});

describe("decluttering", () => {
  it("drops a label that would touch a more important one", () => {
    const out = declutterLabels(
      [toCandidate("Minor St", [100, 100], 2), toCandidate("Major Ave", [101, 100], 0)],
      1
    );
    expect(out.map((l) => l.text)).toEqual(["Major Ave"]);
  });

  it("sizes boxes for the zoom: labels that collide at 1× fit at 8×", () => {
    const pair = [toCandidate("Pearl St", [100, 100]), toCandidate("Water St", [100, 104])];
    expect(declutterLabels(pair, 1)).toHaveLength(1);
    expect(declutterLabels(pair, 8)).toHaveLength(2);
  });

  it("stops at the cap", () => {
    const many = Array.from({ length: 500 }, (_, i) => toCandidate(`S${i}`, [i * 100, 0]));
    expect(declutterLabels(many, 1, 50)).toHaveLength(50);
  });
});

describe("street label index", () => {
  // Two anchors in lower Manhattan: one named 1850–1880, one from 1900.
  const enc = (lon: number, lat: number) => [
    Math.round((lon + 74.3) * 1e5),
    Math.round((lat - 40.45) * 1e5),
  ];
  const data: StreetLabelData = {
    names: ["Old Lane", "New Ave"],
    anchors: [
      [...enc(-74.0, 40.72), 0, 1850, 1880, 0, 0],
      [...enc(-73.99, 40.73), 90, 1900, 0, 1, 0],
    ],
  };
  const index = buildStreetLabelIndex(data, project);
  const everywhere = { x0: -1e4, y0: -1e4, x1: 1e4, y1: 1e4 };

  it("returns only streets named in the given year", () => {
    expect(queryStreetLabels(index, everywhere, 1860, 5).map((l) => l.text)).toEqual(["Old Lane"]);
    expect(queryStreetLabels(index, everywhere, 1890, 5)).toEqual([]);
    expect(queryStreetLabels(index, everywhere, 1920, 5).map((l) => l.text)).toEqual(["New Ave"]);
  });

  it("returns only anchors inside the rectangle", () => {
    const p = project([-74.0, 40.72])!;
    const tight = { x0: p[0] - 2, y0: p[1] - 2, x1: p[0] + 2, y1: p[1] + 2 };
    expect(queryStreetLabels(index, tight, 1860, 5)).toHaveLength(1);
    expect(queryStreetLabels(index, tight, 1920, 5)).toHaveLength(0);
  });

  it("turns a northbound street into upright vertical text", () => {
    const [l] = queryStreetLabels(index, everywhere, 1920, 5);
    expect(Math.abs(l.angle)).toBe(90);
  });

  it("hides everything when zoomed out", () => {
    expect(queryStreetLabels(index, everywhere, 1920, 1)).toEqual([]);
  });
});

describe("street label data", () => {
  const d = realData as unknown as StreetLabelData;
  const named = (name: string) => d.anchors.filter((a) => d.names[a[5]] === name);

  it("covers the whole city", () => {
    expect(d.anchors.length).toBeGreaterThan(10000);
    for (const a of d.anchors) {
      expect(a[3]).toBeGreaterThanOrEqual(1800);
      expect(a[3]).toBeLessThanOrEqual(1945);
      if (a[4] !== 0) expect(a[4]).toBeGreaterThanOrEqual(a[3]);
    }
  });

  it("uses names from before 1945, not today's", () => {
    expect(named("Lenox Ave").length).toBeGreaterThan(0);
    expect(named("Malcolm X Blvd")).toHaveLength(0);
    expect(named("Adam Clayton Powell Jr Blvd")).toHaveLength(0);
    // Renamed during the timeline: 9th Avenue became Columbus in 1890.
    expect(named("9th Ave").some((a) => a[4] === 1889)).toBe(true);
    expect(named("Columbus Ave").every((a) => a[3] >= 1890)).toBe(true);
  });

  it("names no grid street before the 1811 plan", () => {
    for (const a of named("W 23rd St")) expect(a[3]).toBeGreaterThanOrEqual(1815);
  });
});
