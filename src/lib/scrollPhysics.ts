/**
 * Touch-scroll physics for the timeline, after iOS: a released drag glides
 * on and slows with friction, and pulling past either end of time stretches
 * the strip against growing resistance and springs back.
 *
 * Units are screen pixels and milliseconds; velocity is px/ms, positive when
 * the content moves right (toward earlier years).
 */

/** Rubber-band stiffness, as in UIScrollView: 0.55 of the pull at first, then less. */
const RUBBER = 0.55;

/** How far the content moves for `pull` px dragged past an edge, on a strip `dim` px wide. */
export function rubberband(pull: number, dim: number): number {
  if (!pull || dim <= 0) return 0;
  const a = Math.abs(pull);
  return Math.sign(pull) * (1 - 1 / ((a * RUBBER) / dim + 1)) * dim;
}

/** The pull that stretches the strip to `offset`: rubberband's inverse. */
export function unrubberband(offset: number, dim: number): number {
  if (!offset || dim <= 0) return 0;
  const a = Math.min(Math.abs(offset), dim * 0.999);
  return Math.sign(offset) * (dim / RUBBER) * (1 / (1 - a / dim) - 1);
}

/** Friction per millisecond while gliding (UIScrollView's normal deceleration). */
export const DECELERATION = 0.998;
/** Slower than this (px/ms), a glide is over. */
export const MIN_VELOCITY = 0.02;
/** Fastest fling we honor, px/ms: a hard flick, not a teleport. */
export const MAX_VELOCITY = 6;

/** One step of a glide: the distance moved and the velocity after friction. */
export function glide(v: number, dt: number): { dx: number; v: number } {
  const after = v * Math.pow(DECELERATION, dt);
  // Distance is the integral of v·D^t over the step, not v·dt.
  const dx = Math.abs(Math.log(DECELERATION)) > 0 ? (after - v) / Math.log(DECELERATION) : v * dt;
  return { dx, v: after };
}

/** Spring that pulls an overstretched strip back, critically damped. */
const SPRING_K = 0.00035; // per ms²
const SPRING_C = 2 * Math.sqrt(SPRING_K);

/**
 * One step of the spring back from an overscroll. Returns `done` once the
 * strip is home (it never swings past the edge into the other side).
 */
export function springBack(offset: number, v: number, dt: number): { offset: number; v: number; done: boolean } {
  let o = offset;
  let vel = v;
  // Small fixed substeps keep the integration stable on slow frames.
  for (let t = 0; t < dt; t += 4) {
    const h = Math.min(4, dt - t);
    vel += (-SPRING_K * o - SPRING_C * vel) * h;
    o += vel * h;
    if (Math.sign(o) !== Math.sign(offset)) return { offset: 0, v: 0, done: true };
  }
  const done = Math.abs(o) < 0.4 && Math.abs(vel) < MIN_VELOCITY;
  return { offset: done ? 0 : o, v: done ? 0 : vel, done };
}

/** Velocity at release, from the pointer's last ~100 ms of samples. */
export function releaseVelocity(samples: { t: number; x: number }[]): number {
  if (samples.length < 2) return 0;
  const last = samples[samples.length - 1];
  const recent = samples.filter((s) => last.t - s.t <= 100);
  const first = recent[0];
  const span = last.t - first.t;
  if (span < 8) return 0;
  const v = (last.x - first.x) / span;
  return Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, v));
}
