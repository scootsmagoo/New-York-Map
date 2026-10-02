/**
 * Historical population snapshots for Manhattan (through 1897) and Greater New
 * York (1898–2020). Figures are rounded census totals or scholarly estimates;
 * demographic splits are approximate, informed by federal censuses and
 * Burrows & Wallace's *Gotham*. From 1980 the splits follow the census's
 * own categories (see `segmentLabel`): the European groups fold into
 * non-Hispanic white, and the Chinese segment becomes Asian.
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
  | "puerto_rican"
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
  puerto_rican: { label: "Puerto Rican", color: "#c0873a" },
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
  "puerto_rican",
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
  {
    // 1930 census total (6,930,446); the split continues the rough
    // proportions above and is an estimate.
    year: 1930,
    scope: "greaterNY",
    estimate: true,
    segments: {
      native_born_white: 3_250_000,
      free_black: 328_000,
      puerto_rican: 45_000,
      irish: 470_000,
      german: 420_000,
      british_other: 80_000,
      italian: 820_000,
      jewish: 900_000,
      polish: 240_000,
      chinese: 8_500,
      scandinavian: 125_000,
      other_foreign: 243_946,
    },
  },
  {
    // 1940 census total (7,454,995); Black and Puerto Rican counts follow
    // the census, the rest is an estimate.
    year: 1940,
    scope: "greaterNY",
    estimate: true,
    segments: {
      native_born_white: 3_643_295,
      free_black: 458_000,
      puerto_rican: 61_000,
      irish: 420_000,
      german: 380_000,
      british_other: 75_000,
      italian: 860_000,
      jewish: 950_000,
      polish: 230_000,
      chinese: 12_700,
      scandinavian: 115_000,
      other_foreign: 250_000,
    },
  },
  {
    // 1950–1970: census totals, and the census counts of Black, Puerto
    // Rican, and Chinese New Yorkers; the European groups (as above, the
    // foreign-born and their children, roughly) are estimates. After 1965
    // "other foreign-born" is mostly Caribbean, Latin American, and Asian.
    year: 1950,
    scope: "greaterNY",
    estimate: true,
    segments: {
      native_born_white: 3_884_957,
      free_black: 748_000,
      puerto_rican: 246_000,
      irish: 340_000,
      german: 300_000,
      british_other: 70_000,
      italian: 780_000,
      jewish: 900_000,
      polish: 210_000,
      chinese: 18_000,
      scandinavian: 95_000,
      other_foreign: 300_000,
    },
  },
  {
    year: 1960,
    scope: "greaterNY",
    estimate: true,
    segments: {
      native_born_white: 3_342_984,
      free_black: 1_088_000,
      puerto_rican: 613_000,
      irish: 270_000,
      german: 240_000,
      british_other: 60_000,
      italian: 700_000,
      jewish: 800_000,
      polish: 180_000,
      chinese: 33_000,
      scandinavian: 75_000,
      other_foreign: 380_000,
    },
  },
  {
    year: 1970,
    scope: "greaterNY",
    estimate: true,
    segments: {
      native_born_white: 2_860_862,
      free_black: 1_668_000,
      puerto_rican: 812_000,
      irish: 200_000,
      german: 180_000,
      british_other: 50_000,
      italian: 600_000,
      jewish: 650_000,
      polish: 150_000,
      chinese: 69_000,
      scandinavian: 55_000,
      other_foreign: 600_000,
    },
  },
  {
    // 1980: the census total; the split is an estimate halfway between 1970
    // and 1990 (Puerto Rican count from the census). From here on the
    // segments are the census's categories: non-Hispanic white, Black,
    // Puerto Rican, Asian, and other (other Hispanic, and everyone else).
    year: 1980,
    scope: "greaterNY",
    estimate: true,
    segments: {
      native_born_white: 3_619_000,
      free_black: 1_621_000,
      puerto_rican: 860_552,
      chinese: 276_000,
      other_foreign: 695_087,
    },
  },
  {
    // 1990: census total and shares (non-Hispanic white 43.3%, Hispanic
    // 24.0%, Asian 7.0%); Black as the remainder.
    year: 1990,
    scope: "greaterNY",
    estimate: true,
    segments: {
      native_born_white: 3_170_670,
      free_black: 1_845_287,
      puerto_rican: 896_763,
      chinese: 512_579,
      other_foreign: 897_265,
    },
  },
  {
    // 2000–2020: census counts (Hispanic of any race; the others
    // non-Hispanic). "Other" is non-Puerto Rican Hispanics plus Native,
    // Pacific Islander, other, and multiracial New Yorkers.
    year: 2000,
    scope: "greaterNY",
    segments: {
      native_born_white: 2_801_267,
      free_black: 1_962_154,
      puerto_rican: 789_172,
      chinese: 780_229,
      other_foreign: 1_675_456,
    },
  },
  {
    year: 2010,
    scope: "greaterNY",
    segments: {
      native_born_white: 2_722_904,
      free_black: 1_861_295,
      puerto_rican: 723_621,
      chinese: 1_028_119,
      other_foreign: 1_839_194,
    },
  },
  {
    year: 2020,
    scope: "greaterNY",
    segments: {
      native_born_white: 2_719_856,
      free_black: 1_776_891,
      puerto_rican: 595_535,
      chinese: 1_373_502,
      other_foreign: 2_338_406,
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

/** "Free Black" only means something while slavery is legal (to 1827 in New York). */
export function segmentLabel(key: SegmentKey, year: number): string {
  if (key === "free_black" && year >= 1827) return "Black";
  // From 1980 the segments are the census's categories.
  if (year >= 1980) {
    if (key === "native_born_white") return "White (non-Hispanic)";
    if (key === "chinese") return "Asian";
    if (key === "other_foreign") return "Other Hispanic & other";
  }
  return SEGMENT_META[key].label;
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
