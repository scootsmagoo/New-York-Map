import { describe, expect, it, vi } from "vitest";
import { compareYearFromHash, createCameraLink } from "../mapCamera";

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
