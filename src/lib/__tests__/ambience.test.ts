import { describe, expect, it } from "vitest";
import { layerMix } from "../ambience";

describe("sounds of the time", () => {
  it("hears each period's own sounds and not the later ones", () => {
    const lenape = layerMix(-3000);
    expect(lenape.birds).toBe(1);
    for (const k of ["bells", "hooves", "whistles", "trains", "traffic", "horns", "sirens"] as const)
      expect(lenape[k], k).toBe(0);

    const colonial = layerMix(1750);
    expect(colonial.bells).toBe(1);
    expect(colonial.hooves).toBeGreaterThan(0.5);
    expect(colonial.trains).toBe(0);

    const gilded = layerMix(1885);
    expect(gilded.trains).toBe(1);
    expect(gilded.whistles).toBeGreaterThan(0.5);
    expect(gilded.traffic).toBe(0);

    const today = layerMix(2025);
    expect(today.traffic).toBe(1);
    expect(today.sirens).toBe(1);
    expect(today.hooves).toBe(0);
  });

  it("changes smoothly from year to year", () => {
    for (let y = 1600; y < 2025; y++) {
      const a = layerMix(y);
      const b = layerMix(y + 1);
      for (const k of Object.keys(a) as (keyof typeof a)[]) expect(Math.abs(a[k] - b[k]), `${k} ${y}`).toBeLessThan(0.05);
    }
  });
});
