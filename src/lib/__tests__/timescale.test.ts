import { describe, expect, it } from "vitest";
import { TIME_MAX, TIME_MIN } from "../../data/eras";
import {
  BREAK_YEAR,
  LENAPE_FRACTION,
  MIN_WINDOW,
  clampWindow,
  panWindow,
  ticksFor,
  unitOfYear,
  windowAround,
  yearOfUnit,
  yearToX,
  zoomWindow,
} from "../timescale";

describe("polylinear year <-> unit mapping", () => {
  it("maps the ends of time to the ends of unit space", () => {
    expect(unitOfYear(TIME_MIN)).toBe(0);
    expect(unitOfYear(TIME_MAX)).toBe(1);
  });

  it("puts the break year exactly at the Lenape fraction", () => {
    expect(unitOfYear(BREAK_YEAR)).toBeCloseTo(LENAPE_FRACTION, 12);
    expect(yearOfUnit(LENAPE_FRACTION)).toBeCloseTo(BREAK_YEAR, 9);
  });

  it("round-trips years on both segments", () => {
    for (const year of [-9000, -3000, 0, 1500, 1609, 1664, 1811, 1898, 1919]) {
      expect(yearOfUnit(unitOfYear(year))).toBeCloseTo(year, 8);
    }
  });

  it("is monotonic across the break", () => {
    let prev = -Infinity;
    for (let u = 0; u <= 1; u += 0.001) {
      const y = yearOfUnit(u);
      expect(y).toBeGreaterThanOrEqual(prev);
      prev = y;
    }
  });
});

describe("window math", () => {
  it("clamps to [0, 1] and enforces the minimum span", () => {
    expect(clampWindow({ u0: -0.2, u1: 0.3 })).toEqual({ u0: 0, u1: 0.5 });
    expect(clampWindow({ u0: 0.8, u1: 1.3 })).toEqual({ u0: 0.5, u1: 1 });
    const tiny = clampWindow({ u0: 0.5, u1: 0.5001 });
    expect(tiny.u1 - tiny.u0).toBeCloseTo(MIN_WINDOW, 12);
  });

  it("keeps the anchor stationary while zooming", () => {
    const w = { u0: 0.2, u1: 0.6 };
    const anchor = 0.3;
    const rel = (anchor - w.u0) / (w.u1 - w.u0);
    const z = zoomWindow(w, 2, anchor);
    expect(z.u1 - z.u0).toBeCloseTo(0.2, 12);
    expect((anchor - z.u0) / (z.u1 - z.u0)).toBeCloseTo(rel, 12);
  });

  it("pans without changing the span", () => {
    const w = { u0: 0.2, u1: 0.4 };
    const p = panWindow(w, 0.1);
    expect(p.u0).toBeCloseTo(0.3, 12);
    expect(p.u1).toBeCloseTo(0.5, 12);
  });

  it("pins the visible year to the playhead pixel", () => {
    const w = { u0: 0.3, u1: 0.5 };
    const width = 1000;
    const centerYear = yearOfUnit(0.4);
    expect(yearToX(centerYear, w, width)).toBeCloseTo(500, 6);
  });
});

describe("ticks", () => {
  it("never places two ticks closer than the readable minimum", () => {
    for (const w of [
      { u0: 0, u1: 1 },
      { u0: 0.1, u1: 0.2 },
      { u0: 0.5, u1: 0.52 },
      { u0: 0.9, u1: 1 },
    ]) {
      const ticks = ticksFor(w, 1200);
      expect(ticks.length).toBeGreaterThan(0);
      // Spacing is guaranteed within a segment; the two segments meet at the
      // break year with independent steps.
      for (const side of [(y: number) => y <= BREAK_YEAR, (y: number) => y > BREAK_YEAR]) {
        const xs = ticks.filter((t) => side(t.year)).map((t) => t.x).sort((a, b) => a - b);
        for (let i = 1; i < xs.length; i++) {
          expect(xs[i] - xs[i - 1]).toBeGreaterThanOrEqual(72 - 1e-6);
        }
      }
    }
  });

  it("only emits whole years inside the visible window", () => {
    const w = { u0: 0.4, u1: 0.6 };
    const [t0, t1] = [yearOfUnit(w.u0), yearOfUnit(w.u1)];
    for (const t of ticksFor(w, 800)) {
      expect(Number.isInteger(t.year)).toBe(true);
      expect(t.year).toBeGreaterThanOrEqual(t0);
      expect(t.year).toBeLessThanOrEqual(t1);
    }
  });
});

describe("windowAround", () => {
  it("keeps the target year under the playhead near the end of time", () => {
    const centerYear = (year: number) => {
      const w = windowAround(unitOfYear(year), 0.1);
      return Math.round(yearOfUnit((w.u0 + w.u1) / 2));
    };
    for (const year of [1919, 1940, 1944, -9000, 1609]) {
      expect(centerYear(year)).toBe(year);
    }
    // The very last year sits within half a minimum window of the edge.
    expect(centerYear(TIME_MAX)).toBeGreaterThanOrEqual(TIME_MAX - 1);
  });

  it("uses the requested span away from the ends", () => {
    const w = windowAround(unitOfYear(1776), 0.1);
    expect(w.u1 - w.u0).toBeCloseTo(0.1, 12);
  });

  it("never narrows past the minimum window", () => {
    const w = windowAround(1, 0.1);
    expect(w.u1 - w.u0).toBeCloseTo(MIN_WINDOW, 12);
    expect(w.u1).toBeLessThanOrEqual(1);
  });
});
