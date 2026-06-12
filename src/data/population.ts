/**
 * Historical population snapshots for Manhattan (through 1897) and Greater New
 * York (1898–1919). Figures are rounded census totals or scholarly estimates;
 * demographic splits are approximate, informed by federal censuses and
 * Burrows & Wallace's *Gotham*.
 */

export type PopScope = "manhattan" | "greaterNY";

export type SegmentKey =
  | "lenape"
  | "enslaved"
  | "free_black"
  | "dutch_walloone"
  | "british_other"
  | "native_born_white"
  | "irish"
  | "german"
  | "italian"
  | "jewish"
  | "polish"
  | "chinese"
  | "scandinavian"
  | "other_foreign";

export const SEGMENT_META: Record<
  SegmentKey,
  { label: string; color: string }
> = {
  lenape: { label: "Lenape", color: "#5b6e4f" },
  enslaved: { label: "Enslaved", color: "#4a3728" },
  free_black: { label: "Free Black", color: "#6b5344" },
  dutch_walloone: { label: "Dutch & Walloon", color: "#c4762c" },
  british_other: { label: "British & other European", color: "#9d3b3b" },
  native_born_white: { label: "Native-born white", color: "#8a7d68" },
  irish: { label: "Irish", color: "#2e6e8e" },
  german: { label: "German", color: "#4f7a4a" },
  italian: { label: "Italian", color: "#8a6d1f" },
  jewish: { label: "Jewish", color: "#7d5ba6" },
  polish: { label: "Polish", color: "#5c4a7a" },
  chinese: { label: "Chinese", color: "#b84a4a" },
  scandinavian: { label: "Scandinavian", color: "#4a7a8c" },
  other_foreign: { label: "Other foreign-born", color: "#3f5573" },
};

/** Bottom-to-top stack order in the strip chart. */
export const SEGMENT_ORDER: SegmentKey[] = [
  "lenape",
  "enslaved",
  "free_black",
  "dutch_walloone",
  "british_other",
  "native_born_white",
  "irish",
  "german",
  "italian",
  "jewish",
  "polish",
  "chinese",
  "scandinavian",
  "other_foreign",
];

type Segments = Partial<Record<SegmentKey, number>>;

interface PopSnapshot {
  year: number;
  scope: PopScope;
  estimate?: boolean;
  segments: Segments;
}

function totalOf(segments: Segments): number {
  return Object.values(segments).reduce((s, v) => s + (v ?? 0), 0);
}

const SNAPSHOTS = [
  {
    year: -500,
    scope: "manhattan",
    estimate: true,
    segments: { lenape: 2_500 },
  },
  {
    year: 1626,
    scope: "manhattan",
    estimate: true,
    segments: {
      dutch_walloone: 180,
      enslaved: 40,
      british_other: 50,
    },
  },
  {
    year: 1664,
    scope: "manhattan",
    estimate: true,
    segments: {
      dutch_walloone: 820,
      british_other: 330,
      enslaved: 300,
      free_black: 50,
    },
  },
  {
    year: 1700,
    scope: "manhattan",
    estimate: true,
    segments: {
      native_born_white: 3_200,
      british_other: 900,
      enslaved: 700,
      free_black: 140,
    },
  },
  {
    year: 1771,
    scope: "manhattan",
    estimate: true,
    segments: {
      native_born_white: 15_500,
      british_other: 2_800,
      enslaved: 2_200,
      free_black: 520,
      irish: 350,
      german: 93,
    },
  },
  {
    year: 1790,
    scope: "manhattan",
    segments: {
      native_born_white: 25_400,
      british_other: 1_400,
      enslaved: 2_369,
      free_black: 654,
      irish: 900,
      german: 1_200,
      other_foreign: 1_208,
    },
  },
  {
    year: 1800,
    scope: "manhattan",
    segments: {
      native_born_white: 38_000,
      enslaved: 2_500,
      free_black: 1_200,
      irish: 4_500,
      german: 3_800,
      british_other: 2_200,
      other_foreign: 8_315,
    },
  },
  {
    year: 1820,
    scope: "manhattan",
    segments: {
      native_born_white: 62_000,
      free_black: 3_500,
      irish: 18_000,
      german: 8_500,
      british_other: 4_200,
      other_foreign: 27_506,
    },
  },
  {
    year: 1840,
    scope: "manhattan",
    segments: {
      native_born_white: 95_000,
      free_black: 5_500,
      irish: 133_000,
      german: 34_000,
      british_other: 12_000,
      other_foreign: 33_210,
    },
  },
  {
    year: 1860,
    scope: "manhattan",
    segments: {
      native_born_white: 280_000,
      free_black: 12_000,
      irish: 205_000,
      german: 118_000,
      british_other: 45_000,
      italian: 8_000,
      jewish: 8_000,
      chinese: 150,
      other_foreign: 137_519,
    },
  },
  {
    year: 1880,
    scope: "manhattan",
    segments: {
      native_born_white: 620_000,
      free_black: 22_000,
      irish: 210_000,
      german: 175_000,
      british_other: 38_000,
      italian: 42_000,
      jewish: 60_000,
      polish: 15_000,
      chinese: 800,
      scandinavian: 12_000,
      other_foreign: 35_499,
    },
  },
  {
    year: 1890,
    scope: "manhattan",
    segments: {
      native_born_white: 720_000,
      free_black: 28_000,
      irish: 195_000,
      german: 185_000,
      british_other: 32_000,
      italian: 78_000,
      jewish: 130_000,
      polish: 42_000,
      chinese: 2_200,
      scandinavian: 22_000,
      other_foreign: 111_101,
    },
  },
  {
    year: 1898,
    scope: "greaterNY",
    estimate: true,
    segments: {
      native_born_white: 1_650_000,
      free_black: 62_000,
      irish: 480_000,
      german: 520_000,
      british_other: 120_000,
      italian: 180_000,
      jewish: 280_000,
      polish: 95_000,
      chinese: 6_500,
      scandinavian: 85_000,
      other_foreign: 118_500,
    },
  },
  {
    year: 1910,
    scope: "greaterNY",
    segments: {
      native_born_white: 2_350_000,
      free_black: 92_000,
      irish: 520_000,
      german: 480_000,
      british_other: 95_000,
      italian: 485_000,
      jewish: 600_000,
      polish: 220_000,
      chinese: 12_000,
      scandinavian: 120_000,
      other_foreign: 203_883,
    },
  },
  {
    year: 1919,
    scope: "greaterNY",
    estimate: true,
    segments: {
      native_born_white: 2_720_000,
      free_black: 110_000,
      irish: 510_000,
      german: 450_000,
      british_other: 88_000,
      italian: 620_000,
      jewish: 720_000,
      polish: 265_000,
      chinese: 15_000,
      scandinavian: 125_000,
      other_foreign: 231_730,
    },
  },
].map((s) => ({ ...s, segments: { ...s.segments } })) as PopSnapshot[];

export interface PopulationAtYear {
  year: number;
  scope: PopScope;
  estimate: boolean;
  total: number;
  segments: { key: SegmentKey; value: number; pct: number }[];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateSegments(a: Segments, b: Segments, t: number): Segments {
  const out: Segments = {};
  for (const key of SEGMENT_ORDER) {
    const va = a[key] ?? 0;
    const vb = b[key] ?? 0;
    const v = lerp(va, vb, t);
    if (v > 0.5) out[key] = Math.round(v);
  }
  return out;
}

export function populationAt(year: number): PopulationAtYear {
  const y = Math.max(SNAPSHOTS[0].year, Math.min(SNAPSHOTS[SNAPSHOTS.length - 1].year, year));

  let i = 0;
  while (i < SNAPSHOTS.length - 1 && SNAPSHOTS[i + 1].year < y) i++;

  const a = SNAPSHOTS[i];
  const b = SNAPSHOTS[Math.min(i + 1, SNAPSHOTS.length - 1)];

  if (a.year === b.year || y <= a.year) {
    const segments = segmentList(a.segments);
    return {
      year: y,
      scope: a.scope,
      estimate: !!a.estimate,
      total: totalOf(a.segments),
      segments,
    };
  }

  if (y >= b.year) {
    const segments = segmentList(b.segments);
    return {
      year: y,
      scope: b.scope,
      estimate: !!b.estimate,
      total: totalOf(b.segments),
      segments,
    };
  }

  const t = (y - a.year) / (b.year - a.year);
  const merged = interpolateSegments(a.segments, b.segments, t);
  const scope: PopScope = y >= 1898 ? "greaterNY" : "manhattan";
  const estimate = !!(a.estimate || b.estimate);
  const total = totalOf(merged);
  const segments = segmentList(merged);

  return { year: y, scope, estimate, total, segments };
}

function segmentList(segments: Segments): PopulationAtYear["segments"] {
  const total = totalOf(segments);
  if (total <= 0) return [];
  return SEGMENT_ORDER.filter((key) => (segments[key] ?? 0) > 0).map((key) => {
    const value = segments[key] ?? 0;
    return { key, value, pct: (value / total) * 100 };
  });
}

export function formatPopulation(n: number, compact = false): string {
  if (compact) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (n >= 10_000) return `${Math.round(n / 1_000)}k`;
  }
  return Math.round(n).toLocaleString("en-US");
}

export function scopeLabel(scope: PopScope): string {
  return scope === "greaterNY" ? "Greater New York" : "Manhattan";
}
