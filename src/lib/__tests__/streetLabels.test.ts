import { describe, expect, it } from "vitest";
import { geoMercator } from "d3-geo";
import { colonialStreets } from "../../data/streets";
import {
  layoutGridLabels,
  layoutStreetLabels,
  pathMidpointAndAngle,
  streetLabelOpacity,
} from "../streetLabels";

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

  it("never places two labels on top of each other", () => {
    const k = 6;
    const year = 1780;
    const labels = layoutStreetLabels(colonialStreets, project, year, k);
    expect(labels.length).toBeGreaterThan(3);
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i].pos;
        const b = labels[j].pos;
        expect(Math.hypot(a[0] - b[0], a[1] - b[1])).toBeGreaterThan(1);
      }
    }
  });

  it("only labels streets that exist in the given year", () => {
    const labels = layoutStreetLabels(colonialStreets, project, 1640, 8);
    for (const { street } of labels) {
      expect(street.from).toBeLessThanOrEqual(1640);
      if (street.to !== undefined) expect(street.to).toBeGreaterThanOrEqual(1640);
    }
  });

  it("does not label grid streets before the 1811 plan", () => {
    expect(layoutGridLabels(project, 1800, 8, 40.8)).toEqual([]);
  });
});
