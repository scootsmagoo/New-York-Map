import { tours, type Tour } from "../data/tours";

interface TipsCardProps {
  onStartTour: (tour: Tour) => void;
  onCompare: () => void;
  onSearch: () => void;
  /** Called by every button: the card shows once, until any of them is used. */
  onDismiss: () => void;
}

/**
 * A first-visit card pointing to the features tucked away in the ⋯ menu
 * and ⌘K. Not a dialog: the map stays usable around it.
 */
export function TipsCard({ onStartTour, onCompare, onSearch, onDismiss }: TipsCardProps) {
  const tour = tours[0];
  const act = (fn: () => void) => () => {
    onDismiss();
    fn();
  };
  // The layers live in the ⋯ menu; open it rather than describe the way there.
  const openMenu = () => {
    const btn = document.querySelector<HTMLButtonElement>(".header-menu-btn");
    btn?.focus();
    btn?.click();
  };

  return (
    <section className="tour-card tips-card" role="region" aria-label="Things to try">
      <button className="modal-close" onClick={onDismiss} aria-label="Close tips">
        ×
      </button>
      <div className="tour-card-kicker">New here? Things to try</div>
      <p className="tour-card-text tips-card-lead">
        Drag the timeline at the bottom and watch the city grow, from the
        Lenape world to 1945. Click a marker for its story.
      </p>
      <ul className="tips-card-list">
        <li>
          <button className="tips-card-btn" onClick={act(() => onStartTour(tour))}>
            <span className="tips-card-btn-title">Take a guided tour</span>
            <span className="tips-card-btn-sub">
              {tour.title}, in {tour.stops.length} stops
            </span>
          </button>
        </li>
        <li>
          <button className="tips-card-btn" onClick={act(onCompare)}>
            <span className="tips-card-btn-title">Then &amp; Now</span>
            <span className="tips-card-btn-sub">Split the map between two years</span>
          </button>
        </li>
        <li>
          <button className="tips-card-btn" onClick={act(onSearch)}>
            <span className="tips-card-btn-title">Search</span>
            <span className="tips-card-btn-sub">People, places, streets, lost ponds</span>
          </button>
        </li>
        <li>
          <button className="tips-card-btn" onClick={act(openMenu)}>
            <span className="tips-card-btn-title">Map layers</span>
            <span className="tips-card-btn-sub">Street names, neighborhoods, old maps, more tours</span>
          </button>
        </li>
      </ul>
    </section>
  );
}
