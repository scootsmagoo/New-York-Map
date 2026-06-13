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
  /**
   * Years the thing physically existed, for rise-and-fall map markers:
   * [built, demolished]. `null` end = still standing. Entries without a
   * lifespan fall back to era-based marker visibility.
   */
  lifespan?: [number, number | null];
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
  /**
   * Northern limit of Manhattan's solid built-up band at the Hudson (latW)
   * and East River (latE) — drives the "streets built so far" frontier.
   */
  frontier: { latW: number; latE: number };
}

/** A bridge, ferry route, or other linear structure with a service life. */
export interface Structure {
  id: string;
  name: string;
  kind: "bridge" | "ferry";
  /** Polyline of [lon, lat] points. */
  pts: [number, number][];
  open: number;
  close?: number;
  /** Optional entry id to open when clicked. */
  entryId?: string;
}

/** Els, subways, aqueducts — dated line geometry with distinct styling. */
export interface InfrastructureLine {
  id: string;
  name: string;
  kind: "aqueduct" | "elevated" | "subway";
  pts: [number, number][];
  open: number;
  close?: number;
  entryId?: string;
}

/** A park with an acquisition date and optional construction period. */
export interface Park {
  id: string;
  name: string;
  /** Polygon ring of [lon, lat] points (counterclockwise, unclosed). */
  ring: [number, number][];
  /** Year the land became (or began becoming) a park. */
  from: number;
  /** Year construction finished; between `from` and this it draws hatched. */
  completed?: number;
}

export interface WikiSummary {
  title: string;
  extract: string;
  description?: string;
  thumbnailUrl?: string;
  pageUrl: string;
}
