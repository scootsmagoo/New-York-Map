export type EntryKind = "person" | "place" | "event";

export interface Era {
  id: string;
  name: string;
  subtitle: string;
  /** Inclusive start year (negative = BCE). */
  start: number;
  /** Exclusive end year. */
  end: number;
  /** Era accent color used for bands, chips, and theming. */
  color: string;
  /** Bundled two-to-three sentence introduction (no network needed). */
  summary: string;
  /** Wikipedia article that best covers the era. */
  wikiTitle: string;
}

export interface Entry {
  id: string;
  era: string;
  kind: EntryKind;
  /** Display title (may differ from the Wikipedia article title). */
  title: string;
  /** Exact English Wikipedia article title, used for live summary/image fetch. */
  wikiTitle: string;
  /** Representative year for timeline placement and sorting. */
  year: number;
  /** Friendly date label, e.g. "1641–1664" or "c. 1643". */
  yearLabel?: string;
  /** Bundled one-to-two sentence fallback description. */
  blurb: string;
  /** [longitude, latitude] — places (and some events) get a map marker. */
  coords?: [number, number];
  /** Optional note on how Burrows & Wallace's Gotham treats the subject. */
  gotham?: string;
}

export interface FootprintSnapshot {
  /** Year the snapshot represents; snapshots are cumulative. */
  year: number;
  /**
   * Rough built-up area as polygon rings of [lon, lat] pairs. Manhattan rings
   * are kept separate so wide "built up to this street" bands can be clipped
   * to Manhattan island alone and not bleed across the East River.
   */
  manhattan: [number, number][][];
  /** Built-up rings for the other four boroughs, clipped to all city land. */
  other: [number, number][][];
}

export interface WikiSummary {
  title: string;
  extract: string;
  description?: string;
  thumbnailUrl?: string;
  pageUrl: string;
}
