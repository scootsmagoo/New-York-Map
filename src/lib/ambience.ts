/**
 * Ambient sound for the year on the timeline, synthesized in the browser
 * (no recordings to download): surf and wind throughout, birdsong in the
 * Lenape world, church bells and hoofbeats in the colonial and
 * nineteenth-century city, steam whistles and passing trains, then traffic,
 * car horns, and distant sirens. Off until the reader turns it on.
 *
 * Each layer's level is a function of the year (layerMix, below); steady
 * beds (surf, wind, traffic) follow it continuously, and occasional sounds
 * (a bell, a whistle) come at random, more often the louder their layer.
 */

export type Layer =
  | "surf"
  | "wind"
  | "birds"
  | "bells"
  | "hooves"
  | "whistles"
  | "trains"
  | "traffic"
  | "horns"
  | "sirens";

/** [year, level] points; the level is linear between them and flat beyond. */
const MIX: Record<Layer, [number, number][]> = {
  surf: [[1609, 1], [1900, 0.45]],
  wind: [[1609, 1], [1800, 0.5], [1900, 0.2]],
  birds: [[1609, 1], [1700, 0.6], [1850, 0.25], [1920, 0.08]],
  bells: [[1640, 0], [1700, 1], [1900, 1], [1950, 0.4]],
  hooves: [[1660, 0], [1720, 0.5], [1800, 1], [1900, 1], [1930, 0]],
  whistles: [[1810, 0], [1840, 1], [1950, 0.6], [1980, 0.3]],
  trains: [[1832, 0], [1870, 1]],
  traffic: [[1905, 0], [1945, 1]],
  horns: [[1908, 0], [1940, 1]],
  sirens: [[1945, 0], [1970, 1]],
};

function ramp(points: [number, number][], year: number): number {
  if (year <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [y1, v1] = points[i];
    if (year <= y1) {
      const [y0, v0] = points[i - 1];
      return v0 + ((v1 - v0) * (year - y0)) / (y1 - y0);
    }
  }
  return points[points.length - 1][1];
}

/** How loud each layer is in `year`, 0–1. */
export function layerMix(year: number): Record<Layer, number> {
  const out = {} as Record<Layer, number>;
  for (const k of Object.keys(MIX) as Layer[]) out[k] = ramp(MIX[k], year);
  return out;
}

/** Average seconds between occasional sounds at full level. */
const EVERY: Partial<Record<Layer, number>> = {
  birds: 2.5,
  bells: 22,
  hooves: 14,
  whistles: 26,
  trains: 30,
  horns: 9,
  sirens: 40,
};

const MASTER = 0.55;

type Bed = { gain: GainNode; level: number };

class Ambience {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private beds: Partial<Record<Layer, Bed>> = {};
  private mix = layerMix(1609);
  private timer: number | null = null;
  private white: AudioBuffer | null = null;
  private brown: AudioBuffer | null = null;
  private onVisibility = () => {
    if (!this.ctx || this.timer === null) return;
    if (document.hidden) void this.ctx.suspend();
    else void this.ctx.resume();
  };

  get running() {
    return this.timer !== null;
  }

  /** Call from the click that turns sound on: browsers only start audio on a gesture. */
  start() {
    if (this.running) return;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!this.ctx) this.build(new AC());
    const ctx = this.ctx!;
    void ctx.resume();
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.setTargetAtTime(MASTER, ctx.currentTime, 0.6);
    this.applyMix();
    this.timer = window.setInterval(() => this.tick(), 250);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  stop() {
    if (!this.ctx || this.timer === null) return;
    window.clearInterval(this.timer);
    this.timer = null;
    document.removeEventListener("visibilitychange", this.onVisibility);
    const ctx = this.ctx;
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
    window.setTimeout(() => {
      if (this.timer === null) void ctx.suspend();
    }, 1500);
  }

  setYear(year: number) {
    this.mix = layerMix(year);
    if (this.running) this.applyMix();
  }

  // ----- Setup -----

  private build(ctx: AudioContext) {
    this.ctx = ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp);
    this.white = noise(ctx, "white");
    this.brown = noise(ctx, "brown");

    // Surf: low noise swelling like waves on a shore.
    const surf = this.loop(this.brown, "lowpass", 520);
    lfo(ctx, 0.09, 0.45, surf.gain.gain);
    this.beds.surf = { gain: surf.out, level: 0.5 };
    // Wind: a wandering band of noise.
    const wind = this.loop(this.white, "bandpass", 420, 0.6);
    lfo(ctx, 0.05, 260, wind.filter.frequency);
    this.beds.wind = { gain: wind.out, level: 0.12 };
    // Traffic: the city's low, steady roar.
    const traffic = this.loop(this.brown, "lowpass", 200);
    this.beds.traffic = { gain: traffic.out, level: 0.55 };
  }

  /** A looping noise source through a filter, with a modulatable gain and an output level. */
  private loop(buf: AudioBuffer, type: BiquadFilterType, freq: number, q = 0.7) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.loopStart = Math.random() * (buf.duration - 1);
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.value = 0.6;
    const out = ctx.createGain();
    out.gain.value = 0;
    src.connect(filter).connect(gain).connect(out).connect(this.master!);
    src.start(0, src.loopStart);
    return { filter, gain, out };
  }

  private applyMix() {
    const t = this.ctx!.currentTime;
    for (const [k, bed] of Object.entries(this.beds) as [Layer, Bed][]) {
      bed.gain.gain.setTargetAtTime(this.mix[k] * bed.level, t, 0.8);
    }
  }

  // ----- Occasional sounds -----

  private tick() {
    for (const [k, every] of Object.entries(EVERY) as [Layer, number][]) {
      const level = this.mix[k];
      if (level <= 0.02) continue;
      // Poisson arrivals: chance per 250 ms tick at this layer's rate.
      if (Math.random() < (0.25 / every) * level) this.play(k, level);
    }
  }

  private play(layer: Layer, level: number) {
    const ctx = this.ctx!;
    const t = ctx.currentTime + 0.05;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    const out = ctx.createGain();
    out.gain.value = level;
    out.connect(pan).connect(this.master!);
    const sounds: Record<string, () => void> = {
      birds: () => birdsong(ctx, out, t),
      bells: () => bell(ctx, out, t),
      hooves: () => hooves(ctx, out, t, this.white!),
      whistles: () => (Math.random() < 0.5 ? whistle(ctx, out, t) : foghorn(ctx, out, t)),
      trains: () => train(ctx, out, t, this.brown!, this.white!),
      horns: () => horn(ctx, out, t),
      sirens: () => siren(ctx, out, t),
    };
    sounds[layer]?.();
    // Let the voice finish, then drop its nodes.
    window.setTimeout(() => out.disconnect(), 15000);
  }
}

// ----- Building blocks -----

function noise(ctx: AudioContext, kind: "white" | "brown"): AudioBuffer {
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === "white") d[i] = w * 0.5;
    else {
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    }
  }
  return buf;
}

/** A slow sine wobble added to a parameter. */
function lfo(ctx: AudioContext, hz: number, depth: number, param: AudioParam) {
  const osc = ctx.createOscillator();
  osc.frequency.value = hz * (0.85 + Math.random() * 0.3);
  const amt = ctx.createGain();
  amt.gain.value = depth;
  osc.connect(amt).connect(param);
  osc.start();
}

/** An envelope: rise to `peak` in `attack`, then decay over `decay` seconds. */
function env(ctx: AudioContext, dest: AudioNode, t: number, peak: number, attack: number, decay: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  g.connect(dest);
  return g;
}

function tone(
  ctx: AudioContext,
  dest: AudioNode,
  type: OscillatorType,
  freq: number,
  t: number,
  dur: number
): OscillatorNode {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.05);
  return osc;
}

function birdsong(ctx: AudioContext, out: AudioNode, t0: number) {
  const base = 2200 + Math.random() * 1800;
  const notes = 2 + Math.floor(Math.random() * 4);
  for (let i = 0; i < notes; i++) {
    const t = t0 + i * (0.11 + Math.random() * 0.08);
    const g = env(ctx, out, t, 0.05, 0.01, 0.09);
    const osc = tone(ctx, g, "sine", base, t, 0.1);
    osc.frequency.exponentialRampToValueAtTime(base * (1.2 + Math.random() * 0.5), t + 0.07);
  }
}

/** A distant church bell: inharmonic partials, struck a few times. */
function bell(ctx: AudioContext, out: AudioNode, t0: number) {
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2200;
  lp.connect(out);
  const f = 260 + Math.random() * 140;
  const strikes = 3 + Math.floor(Math.random() * 4);
  const partials: [number, number][] = [[0.5, 0.5], [1, 1], [1.19, 0.5], [1.5, 0.35], [2, 0.3], [2.51, 0.2], [3.01, 0.12]];
  for (let s = 0; s < strikes; s++) {
    const t = t0 + s * 1.9;
    for (const [ratio, amp] of partials) {
      const g = env(ctx, lp, t, 0.035 * amp, 0.005, 3.5 / ratio + 0.8);
      tone(ctx, g, "sine", f * ratio, t, 4.5);
    }
  }
}

/** A horse at a walk going by: paired knocks, passing across. */
function hooves(ctx: AudioContext, out: AudioNode, t0: number, white: AudioBuffer) {
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 900 + Math.random() * 500;
  bp.Q.value = 3;
  const swell = ctx.createGain();
  const dur = 4 + Math.random() * 3;
  swell.gain.setValueAtTime(0.0001, t0);
  swell.gain.exponentialRampToValueAtTime(1, t0 + dur / 2);
  swell.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  bp.connect(swell).connect(out);
  const step = 0.55 + Math.random() * 0.1;
  for (let t = t0; t < t0 + dur; t += step) {
    for (const dt of [0, 0.13]) {
      const src = ctx.createBufferSource();
      src.buffer = white;
      const g = env(ctx, bp, t + dt, 0.5, 0.002, 0.05);
      src.connect(g);
      src.start(t + dt, Math.random() * 3, 0.07);
    }
  }
}

/** A steam whistle: a sour chord with a little rise. */
function whistle(ctx: AudioContext, out: AudioNode, t: number) {
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1400;
  lp.connect(out);
  const dur = 1.2 + Math.random() * 1.2;
  const g = env(ctx, lp, t, 0.05, 0.15, dur);
  for (const f of [392, 466, 587]) {
    const osc = tone(ctx, g, "sawtooth", f * 0.98, t, dur + 0.2);
    osc.frequency.linearRampToValueAtTime(f, t + 0.3);
  }
}

/** A ship's horn out on the water. */
function foghorn(ctx: AudioContext, out: AudioNode, t: number) {
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 380;
  lp.connect(out);
  const g = env(ctx, lp, t, 0.12, 0.25, 2.6);
  for (const f of [98, 123]) tone(ctx, g, "sawtooth", f, t, 3);
}

/** A train passing: a rising and falling rumble with the clack of the rails. */
function train(ctx: AudioContext, out: AudioNode, t0: number, brown: AudioBuffer, white: AudioBuffer) {
  const dur = 7 + Math.random() * 3;
  const src = ctx.createBufferSource();
  src.buffer = brown;
  src.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 160;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.7, t0 + dur * 0.45);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(lp).connect(g).connect(out);
  src.start(t0);
  src.stop(t0 + dur);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2400;
  bp.Q.value = 2;
  bp.connect(g);
  for (let t = t0 + 0.5; t < t0 + dur - 0.5; t += 0.42) {
    for (const dt of [0, 0.09]) {
      const c = ctx.createBufferSource();
      c.buffer = white;
      c.connect(env(ctx, bp, t + dt, 0.25, 0.002, 0.04));
      c.start(t + dt, Math.random() * 3, 0.05);
    }
  }
}

/** A car horn a few blocks off, sometimes twice. */
function horn(ctx: AudioContext, out: AudioNode, t0: number) {
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1100;
  lp.connect(out);
  const f = 340 + Math.random() * 120;
  const beeps = Math.random() < 0.4 ? 2 : 1;
  for (let i = 0; i < beeps; i++) {
    const t = t0 + i * 0.3;
    const dur = 0.15 + Math.random() * 0.25;
    const g = env(ctx, lp, t, 0.025, 0.01, dur);
    tone(ctx, g, "square", f, t, dur);
    tone(ctx, g, "square", f * 1.26, t, dur);
  }
}

/** A siren's wail, far away. */
function siren(ctx: AudioContext, out: AudioNode, t: number) {
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1600;
  lp.connect(out);
  const dur = 5 + Math.random() * 2;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.03, t + 1.5);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(lp);
  const osc = tone(ctx, g, "triangle", 700, t, dur);
  for (let s = t; s < t + dur; s += 2.4) {
    osc.frequency.linearRampToValueAtTime(1250, s + 1.2);
    osc.frequency.linearRampToValueAtTime(700, s + 2.4);
  }
}

/** The one ambience for the page. */
export const ambience = new Ambience();
