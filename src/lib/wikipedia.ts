import type { WikiSummary } from "../types";

/**
 * Thin client for the Wikipedia REST summary endpoint (CORS-enabled, no key).
 * Results are cached in localStorage for 30 days; failures resolve to null so
 * callers fall back to the bundled blurbs.
 */
const CACHE_PREFIX = "nycwiki:v1:";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const inFlight = new Map<string, Promise<WikiSummary | null>>();

interface CacheRecord {
  t: number;
  d: WikiSummary | null;
}

function readCache(title: string): WikiSummary | null | undefined {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + title);
    if (!raw) return undefined;
    const rec = JSON.parse(raw) as CacheRecord;
    if (Date.now() - rec.t > CACHE_TTL_MS) return undefined;
    return rec.d;
  } catch {
    return undefined;
  }
}

function writeCache(title: string, d: WikiSummary | null): void {
  try {
    const rec: CacheRecord = { t: Date.now(), d };
    localStorage.setItem(CACHE_PREFIX + title, JSON.stringify(rec));
  } catch {
    // Storage full or unavailable — caching is best-effort.
  }
}

export function getWikiSummary(title: string): Promise<WikiSummary | null> {
  const cached = readCache(title);
  if (cached !== undefined) return Promise.resolve(cached);

  const existing = inFlight.get(title);
  if (existing) return existing;

  const promise = (async (): Promise<WikiSummary | null> => {
    try {
      const slug = encodeURIComponent(title.replace(/ /g, "_"));
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) {
        if (res.status === 404) writeCache(title, null);
        return null;
      }
      const json = await res.json();
      const summary: WikiSummary = {
        title: json.title ?? title,
        extract: json.extract ?? "",
        description: json.description,
        thumbnailUrl: json.thumbnail?.source,
        pageUrl:
          json.content_urls?.desktop?.page ??
          `https://en.wikipedia.org/wiki/${slug}`,
      };
      writeCache(title, summary);
      return summary;
    } catch {
      return null;
    } finally {
      inFlight.delete(title);
    }
  })();

  inFlight.set(title, promise);
  return promise;
}
