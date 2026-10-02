import { describe, expect, it } from "vitest";
import { glide, MIN_VELOCITY, releaseVelocity, rubberband, springBack, unrubberband } from "../scrollPhysics";

describe("timeline scroll physics", () => {
  it("stretches less and less the further you pull, and never past the strip", () => {
    const w = 400;
    expect(rubberband(0, w)).toBe(0);
    expect(rubberband(10, w)).toBeGreaterThan(5);
    expect(rubberband(10, w)).toBeLessThan(10);
    expect(rubberband(400, w)).toBeLessThan(rubberband(200, w) * 2);
    expect(rubberband(100000, w)).toBeLessThan(w);
    expect(rubberband(-50, w)).toBeCloseTo(-rubberband(50, w));
    for (const pull of [-300, -20, 7, 120, 900]) expect(unrubberband(rubberband(pull, w), w)).toBeCloseTo(pull, 6);
  });

  it("glides on after a fling and slows to a stop", () => {
    let v = 2;
    let travelled = 0;
    let frames = 0;
    while (Math.abs(v) >= MIN_VELOCITY && frames < 1000) {
      const s = glide(v, 16);
      travelled += s.dx;
      v = s.v;
      frames++;
    }
    expect(frames).toBeLessThan(200); // stops within ~3 s
    expect(travelled).toBeGreaterThan(300);
    expect(travelled).toBeLessThan(1000);
  });

  it("springs an overstretched strip home without overshooting", () => {
    let s = { offset: 60, v: 0, done: false };
    let frames = 0;
    while (!s.done && frames < 500) {
      s = springBack(s.offset, s.v, 16);
      expect(s.offset).toBeGreaterThanOrEqual(0);
      frames++;
    }
    expect(s.done).toBe(true);
    expect(frames).toBeLessThan(60); // home in under a second
    // A fling into the edge carries out, then comes back.
    let t = { offset: 1, v: 3, done: false };
    let peak = 0;
    while (!t.done) {
      t = springBack(t.offset, t.v, 16);
      peak = Math.max(peak, t.offset);
    }
    expect(peak).toBeGreaterThan(20);
  });

  it("measures release speed from the last moments of the drag", () => {
    const samples = [
      { t: 0, x: 0 },
      { t: 200, x: 10 }, // a pause long ago doesn't count
      { t: 250, x: 60 },
      { t: 300, x: 110 },
    ];
    expect(releaseVelocity(samples)).toBeCloseTo(1, 1);
    expect(releaseVelocity([{ t: 0, x: 0 }])).toBe(0);
    expect(releaseVelocity([{ t: 0, x: 0 }, { t: 40, x: 4000 }])).toBe(6);
  });
});
