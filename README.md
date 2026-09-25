# Gotham — A Timeline of New York City

An interactive, pannable timeline of New York City's history, from
Lenapehoking to V-J Day (1945). Pan through time and watch the
city's built-up footprint spread across the five boroughs; click into any era
for its people, places, and events, with live summaries and images from
Wikipedia.

Inspired by *Gotham: A History of New York City to 1898* by Edwin G. Burrows
and Mike Wallace, and its sequel *Greater Gotham* by Mike Wallace.

## Quick start

```bash
npm install
npm run dev      # open http://localhost:5173
```

## How to use

- **Drag / scroll / pinch the timeline** at the bottom; the year under the
  center line drives the map.
- **Click an era band** to zoom to that era; press **▶** (or space) to play
  through time.
- **Explore this era** lists the era's people, places, and events; click
  anything — timeline marks, map markers, panel rows — for the full story.
- Arrow keys pan time; `+` / `-` zoom; the map pans and zooms independently.
- **Guided tours** (⋯ menu) walk the timeline and camera through a story —
  the grid marching north, crossing the East River, fire and Croton water,
  and Robert Moses's bridges and World's Fair.
  Deep-link one with `#tour=grid`, `#tour=east-river`, `#tour=fire-water`,
  or `#tour=moses`.
- **Then & Now** (⋯ menu) wipes between two years with a draggable line.
  Type either year, or scrub the timeline to change Now. Deep-link with
  `#year=1900&compare=1776`.
- **Map layers** (⋯ menu): street names for every street in the city,
  neighborhood names as they were in each year, and the **lost landscape**:
  Manhattan's 1609 shoreline, land drawn as river until it was filled, and
  buried streams and ponds such as the Collect and Minetta Brook.
- **Share a view:** ⋯ → *Copy link to this view*, or *Copy link* on any
  entry card. `#entry=vj-day` opens that entry directly.
- Map and timeline markers are keyboard-reachable: Tab to one, Enter to open.

## Status (as of 2026-09-23)

Everything below is on `main` and live at
https://scootsmagoo.github.io/New-York-Map/. 57 unit tests pass.

**Where things stand**

- The timeline runs from Lenapehoking to 1945 across nine eras. The last
  era, *Capital of the World* (1919–1945), goes past the *Gotham* books, so
  its entries have no margin notes.
- **Then & Now** compares any two years. It opens on two different years,
  and both can be typed.
- **Street names** cover every named street in all five boroughs, from
  NYC's street centerlines. A name appears when the built-up area reaches
  it, so the timing is approximate. Well-known renamings show their older
  names; obscure ones may not.
- **Neighborhood names** (about 70 places) use the names of their day.
- The Manhattan grid, elevated trains, and subways sit on the real avenues
  and streets.
- On phones: pinch the timeline with two fingers, and *Explore this era*
  opens as a bottom sheet.
- Street and neighborhood names had no measurable effect on panning or
  scrubbing speed in Safari's engine.

**Next up** (candidates; details in PROJECT.md → Future features)

- Streetcar lines, 1832–1945.
- Real street lines outside Manhattan at high zoom, in place of the hatch
  texture.
- Carry the timeline past 1945 (Moses's expressways, the fiscal crisis).
- Audio per era; more *Gotham* margin notes.

**Known rough edges**

- Some early-colonial comparisons in Then & Now look alike at whole-city
  zoom, because the city was tiny. Zoom into lower Manhattan to see them.
- The 1930 and 1940 population breakdowns (apart from the Black and Puerto
  Rican counts) are estimates.
- `npm run validate:wiki` often gets rate-limited by Wikipedia (HTTP 429).
  Rerun it later, or recheck the unverified titles one at a time.

## Deploying

Pushes to `main` build and publish automatically via GitHub Actions. One-time
setup: in the repo's **Settings → Pages**, set *Source* to **GitHub Actions**.
The site will be served at `https://scootsmagoo.github.io/New-York-Map/`.

## Documentation

See [PROJECT.md](PROJECT.md) for the project outline, architecture, data
sources and caveats, lessons learned, and the future-features roadmap.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | typecheck + static production build (`dist/`) |
| `npm run preview` | serve the production build locally |
| `npm test` | unit tests (timescale, grid, labels, compare, links, content, tours, neighborhoods) |
| `npm run validate:wiki` | verify every Wikipedia title resolves |
| `node scripts/prepare-geo.mjs` | regenerate map geometry from public sources |
| `node scripts/prepare-overlays.mjs` | download & compress historical map sheets |
| `node --experimental-strip-types scripts/prepare-streets.mjs` | street names and the Manhattan grid table from NYC street centerlines |

## Credits

Burrows & Wallace's *Gotham* (inspiration) · Wikipedia (content & images) ·
NYC Open Data (boundaries, street centerlines) and the U.S. Census Bureau. Built-up extents are
approximate, hand-drawn illustrations of growth — see PROJECT.md.
