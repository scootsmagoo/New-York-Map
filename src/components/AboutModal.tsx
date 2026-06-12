import { useEffect } from "react";

export function AboutModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <article className="modal about-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>About this timeline</h2>
        <p>
          An interactive history of New York City, from the Lenape world
          through the consolidation of Greater New York and the close of the
          First World War — the span covered by Edwin G. Burrows &amp; Mike
          Wallace's <em>Gotham: A History of New York City to 1898</em> and
          Mike Wallace's <em>Greater Gotham (1898–1919)</em>, which inspired
          this project.
        </p>
        <h3>How to use it</h3>
        <ul>
          <li>
            <strong>Pan and zoom the timeline</strong> (drag, scroll, or pinch)
            — the map redraws the city's rough built-up extent as the years
            pass under the center line.
          </li>
          <li>
            <strong>Click an era band</strong> to zoom to it, and{" "}
            <strong>Explore this era</strong> for its people, places, and
            events.
          </li>
          <li>
            <strong>Click marks</strong> on the timeline or map for the full
            story, with live summaries and images from Wikipedia.
          </li>
        </ul>
        <h3>Sources &amp; caveats</h3>
        <p>
          Era and entry notes are original summaries informed by{" "}
          <em>Gotham</em>'s coverage; detail text and images load from
          Wikipedia under their respective licenses. Coastlines come from U.S.
          Census cartographic boundary files (modern shorelines — landfill
          means the 17th-century island was a touch slimmer). Built-up
          footprints and Lenape sites are deliberately impressionistic:
          painted from period maps and archaeology, not surveyed.
        </p>
      </article>
    </div>
  );
}
