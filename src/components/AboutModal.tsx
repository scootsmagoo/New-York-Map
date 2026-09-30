import { useEffect } from "react";
import { FocusTrap } from "./FocusTrap";

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
      <FocusTrap>
        <article
          className="modal about-modal"
          role="dialog"
          aria-modal="true"
          aria-label="About this timeline"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
          <h2>About this timeline</h2>
          <p>
            An interactive history of New York City's five boroughs, from the
            Lenape world to the fiscal crisis of 1975. Drag the timeline and the city grows on the
            map: its shorelines, streets, parks, and neighborhoods, and the
            people, places, and events that made it.
          </p>

          <h3>How to use it</h3>
          <ul>
            <li>
              <strong>Drag, scroll, or pinch the timeline</strong> to move
              through time; click an era band to jump to it.
            </li>
            <li>
              <strong>Click a marker</strong> on the map or timeline for its
              story, and <strong>Explore this era</strong> for everything in
              it. <strong>Search</strong> finds people, places, streets,
              neighborhoods, lost waters, and more.
            </li>
            <li>
              The <strong>⋯ menu</strong> has guided tours, Then &amp; Now (two
              years side by side), map layers, and georeferenced historical
              maps.
            </li>
          </ul>

          <h3>Where it comes from</h3>
          <ul className="about-sources">
            <li>
              <strong>Stories:</strong> written for this site from standard
              histories, above all Edwin G. Burrows &amp; Mike Wallace's{" "}
              <em>Gotham</em> (1999) and Mike Wallace's <em>Greater Gotham</em>{" "}
              (2017) and <em>Gotham at War</em> (2025), which inspired it and
              are cited by chapter and page (they end in 1945; the postwar era
              is written from Wikipedia's articles); and Wikipedia, whose
              summaries and images load live under their own licenses.
            </li>
            <li>
              <strong>Shorelines and boroughs:</strong> NYC Department of City
              Planning and the U.S. Census Bureau.
            </li>
            <li>
              <strong>Streets:</strong> the city's street centerlines (NYC Open
              Data). Outside Manhattan each street appears when the buildings
              along it went up, from the city's tax-lot records (PLUTO).
            </li>
            <li>
              <strong>Parkways and expressways:</strong> the city's highway
              centerlines, each drawn from the year it opened.
            </li>
            <li>
              <strong>Railroads:</strong> track geometry © OpenStreetMap
              contributors (ODbL), with dates from Wikipedia; where a subway
              was rebuilt on an old railroad's right-of-way, today's tracks
              stand in for the old ones.
            </li>
            <li>
              <strong>Parks:</strong> NYC Parks property records outside
              Manhattan, dated by acquisition; Manhattan's squares are drawn
              by hand.
            </li>
            <li>
              <strong>Lost landscape:</strong> Egbert Viele's 1865 topographical
              map for Manhattan, and the U.S. Geological Survey's first maps of
              the city (1891–98) for the other boroughs.
            </li>
            <li>
              <strong>Historical maps:</strong> the Castello Plan (1660),
              Ratzer's Plan (1767), and Viele's map (1865), from Wikimedia
              Commons, placed by matching landmarks.
            </li>
            <li>
              <strong>Streetcars, fires, epidemics, and the waterfront:</strong>{" "}
              the <em>Gotham</em> books and Wikipedia; routes follow today's
              streets.
            </li>
            <li>
              <strong>Before 1609:</strong> Lenape villages and trails are
              placed from archaeology and colonial deeds, and only roughly.
            </li>
          </ul>

          <h3>How far to trust it</h3>
          <p>
            Dates and places are researched, but the map is a picture of
            growth, not a survey of it. The built-up area is drawn by hand
            for Manhattan, and for the other boroughs before 1880, from period
            maps and histories. Tax-lot dates describe the buildings standing
            today, so neighborhoods torn down and rebuilt read later than they
            first grew. Old maps are placed to within about half a block.
          </p>
        </article>
      </FocusTrap>
    </div>
  );
}
