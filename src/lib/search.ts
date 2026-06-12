import type { Entry, EntryKind } from "../types";
import type { ColonialStreet } from "../data/streets";
import {
  colonialStreets,
  streetMidpoint,
  streetTier,
} from "../data/streets";
import { eras, formatYear } from "../data/eras";
import { allEntries } from "../data/entries";

export type SearchItemKind = EntryKind | "street";

/** A single searchable record — extend `source` as new map content types ship. */
export interface SearchItem {
  id: string;
  kind: SearchItemKind;
  title: string;
  subtitle: string;
  /** Lowercased tokens used for fuzzy matching. */
  haystack: string;
  source:
    | { type: "entry"; entry: Entry }
    | { type: "street"; street: ColonialStreet };
}

export interface SearchHit {
  item: SearchItem;
  score: number;
}

const KIND_ORDER: SearchItemKind[] = ["person", "place", "event", "street"];

const KIND_LABEL: Record<SearchItemKind, string> = {
  person: "People",
  place: "Places",
  event: "Events",
  street: "Streets",
};

const eraName = new Map(eras.map((e) => [e.id, e.name]));

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''']/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Score how well `query` matches a single field (0 = no match). */
function scoreField(query: string, field: string): number {
  if (!query || !field) return 0;
  const q = normalize(query);
  const t = normalize(field);
  if (!t) return 0;

  const idx = t.indexOf(q);
  if (idx >= 0) {
    const wordStart = idx === 0 || t[idx - 1] === " ";
    return 120 + (wordStart ? 25 : 0) - idx * 0.15;
  }

  let qi = 0;
  let spread = 0;
  let consecutive = 0;
  let maxConsecutive = 0;
  let last = -1;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      if (last >= 0) spread += ti - last - 1;
      consecutive = last === ti - 1 ? consecutive + 1 : 1;
      maxConsecutive = Math.max(maxConsecutive, consecutive);
      last = ti;
      qi++;
    }
  }
  if (qi < q.length) return 0;

  return 45 + maxConsecutive * 10 - spread * 1.5 - (t.length - q.length) * 0.08;
}

function scoreItem(query: string, item: SearchItem): number {
  const words = normalize(query).split(" ").filter(Boolean);
  if (words.length === 0) return 0;

  const phrase = Math.max(
    scoreField(query, item.title) * 1.4,
    scoreField(query, item.haystack) * 0.7
  );

  let tokens = 0;
  for (const word of words) {
    const w = Math.max(
      scoreField(word, item.title) * 1.25,
      scoreField(word, item.subtitle) * 0.9,
      scoreField(word, item.haystack) * 0.55
    );
    if (w <= 0) return 0;
    tokens += w;
  }

  const tokenScore = tokens * (words.length > 1 ? 0.92 : 1);
  let score = Math.max(phrase, tokenScore);
  if (item.kind === "street") score *= 0.92;
  return score;
}

function streetSearchItem(street: ColonialStreet): SearchItem {
  const tier = streetTier(street);
  const span =
    street.to !== undefined
      ? `${formatYear(street.from)}–${formatYear(street.to)}`
      : `from ${formatYear(street.from)}`;
  const former = street.historicalNames?.length
    ? ` · formerly ${street.historicalNames.join(", ")}`
    : "";
  return {
    id: `street:${street.id}`,
    kind: "street",
    title: street.name,
    subtitle: `${span}${former}`,
    haystack: [
      street.name,
      street.historicalNames?.join(" "),
      street.searchTerms?.join(" "),
      street.id.replace(/-/g, " "),
      tier,
      "street road avenue lane slip",
    ]
      .filter(Boolean)
      .join(" "),
    source: { type: "street", street },
  };
}

/** Build the search index from all registered content sources. */
export function buildSearchIndex(): SearchItem[] {
  const entries = allEntries.map((entry) => {
    const era = eraName.get(entry.era) ?? entry.era;
    const year = entry.yearLabel ?? formatYear(entry.year);
    return {
      id: entry.id,
      kind: entry.kind as EntryKind,
      title: entry.title,
      subtitle: `${year} · ${era}`,
      haystack: [
        entry.title,
        entry.wikiTitle,
        entry.blurb,
        entry.gotham,
        era,
        entry.kind,
        year,
      ]
        .filter(Boolean)
        .join(" "),
      source: { type: "entry" as const, entry },
    };
  });
  return [...entries, ...colonialStreets.map(streetSearchItem)];
}

const INDEX = buildSearchIndex();

export function searchEntries(query: string, limit = 24): SearchHit[] {
  const q = query.trim();
  if (!q) return [];

  return INDEX.map((item) => ({ item, score: scoreItem(q, item) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit);
}

export interface SearchGroup {
  kind: SearchItemKind;
  label: string;
  hits: SearchHit[];
}

export function groupSearchHits(hits: SearchHit[]): SearchGroup[] {
  const buckets = new Map<SearchItemKind, SearchHit[]>();
  for (const hit of hits) {
    const list = buckets.get(hit.item.kind) ?? [];
    list.push(hit);
    buckets.set(hit.item.kind, list);
  }
  return KIND_ORDER.filter((k) => buckets.has(k))
    .map((kind) => ({
      kind,
      label: KIND_LABEL[kind],
      hits: buckets.get(kind)!,
    }))
    .sort(
      (a, b) =>
        Math.max(...b.hits.map((h) => h.score)) -
        Math.max(...a.hits.map((h) => h.score))
    );
}

export { streetMidpoint };
