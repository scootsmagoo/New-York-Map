/**
 * On a phone the map's corner panels (population, key) would cover each
 * other, so opening one closes the others. Each panel announces when it
 * opens and listens for the rest.
 */
const EVENT = "gotham:map-panel-open";

const narrow = () =>
  typeof window !== "undefined" && window.matchMedia?.("(max-width: 640px)").matches;

export function announcePanelOpen(name: string) {
  if (narrow()) window.dispatchEvent(new CustomEvent(EVENT, { detail: name }));
}

/** Calls `close` when another panel opens on a narrow screen; returns an unsubscribe. */
export function onOtherPanelOpen(name: string, close: () => void): () => void {
  const handler = (e: Event) => {
    if ((e as CustomEvent).detail !== name) close();
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
