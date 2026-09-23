import { describe, expect, it, vi } from "vitest";
import {
  compareYearFromHash,
  createCameraLink,
  defaultThenYear,
  parseYearInput,
} from "../mapCamera";

describe("camera link", () => {
  it("delivers transforms to every listener with their source", () => {
    const link = createCameraLink();
    const a = Symbol("a");
    const seen = vi.fn();
    link.subscribe(seen);
    link.publish({ k: 2, x: 10, y: -5 }, a);
    expect(seen).toHaveBeenCalledWith({ k: 2, x: 10, y: -5 }, a, false);
    link.publish({ k: 3, x: 0, y: 0 }, a, true);
    expect(seen).toHaveBeenLastCalledWith({ k: 3, x: 0, y: 0 }, a, true);
  });

  it("remembers the last transform for maps that mount later", () => {
    const link = createCameraLink();
    expect(link.current).toBeNull();
    link.publish({ k: 4, x: 1, y: 2 }, Symbol());
    expect(link.current).toEqual({ k: 4, x: 1, y: 2 });
  });

  it("stops notifying after unsubscribe", () => {
    const link = createCameraLink();
    const seen = vi.fn();
    const off = link.subscribe(seen);
    off();
    link.publish({ k: 1, x: 0, y: 0 }, Symbol());
    expect(seen).not.toHaveBeenCalled();
  });
});

describe("compare deep link", () => {
  it("reads the pinned year", () => {
    expect(compareYearFromHash("#year=1900&compare=1776")).toBe(1776);
    expect(compareYearFromHash("#compare=-500")).toBe(-500);
  });

  it("is null when absent", () => {
    expect(compareYearFromHash("#year=1900")).toBeNull();
    expect(compareYearFromHash("")).toBeNull();
  });
});

describe("compare defaults and input", () => {
  const snaps = [1609, 1628, 1660, 1700, 1740, 1776, 1800, 1820, 1840, 1860, 1880, 1898, 1919, 1945];

  it("opens Then at least fifty years before Now", () => {
    expect(defaultThenYear(1750, snaps)).toBe(1700);
    expect(defaultThenYear(1930, snaps)).toBe(1880);
    expect(defaultThenYear(1945, snaps)).toBe(1880);
    expect(defaultThenYear(1640, snaps)).toBe(1500);
    expect(defaultThenYear(1200, snaps)).toBe(200);
  });

  it("parses and clamps typed years", () => {
    expect(parseYearInput("1776", -10000, 1945)).toBe(1776);
    expect(parseYearInput(" 2020 ", -10000, 1945)).toBe(1945);
    expect(parseYearInput("500 BCE", -10000, 1945)).toBe(-500);
    expect(parseYearInput("-20000", -10000, 1945)).toBe(-10000);
    expect(parseYearInput("soon", -10000, 1945)).toBeNull();
    expect(parseYearInput("", -10000, 1945)).toBeNull();
  });
});
