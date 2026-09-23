/**
 * Shareable links. The app reads these hash keys on load: year and span (the
 * timeline window), compare (Then & Now), tour, and entry.
 */
export interface ViewLink {
  year?: number;
  span?: number;
  compare?: number | null;
  entry?: string;
}

export function viewHash({ year, span, compare, entry }: ViewLink): string {
  const parts: string[] = [];
  if (year !== undefined) parts.push(`year=${Math.round(year)}`);
  if (span !== undefined) parts.push(`span=${+span.toFixed(4)}`);
  if (compare !== undefined && compare !== null) parts.push(`compare=${Math.round(compare)}`);
  if (entry) parts.push(`entry=${encodeURIComponent(entry)}`);
  return parts.length ? `#${parts.join("&")}` : "";
}

export function viewUrl(link: ViewLink): string {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}${viewHash(link)}`;
}

export function entryIdFromHash(hash: string): string | null {
  const m = hash.match(/entry=([\w%-]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/** Copy to the clipboard; resolves false where the browser refuses. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
