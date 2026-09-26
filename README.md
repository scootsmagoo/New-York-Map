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
- **Search** (⌘K) finds people, places, events, streets, neighborhoods (by
  any of their names: *Vlissingen* finds Flushing), and lost waters like
  the Collect Pond. Picking a neighborhood or a lost water flies there,
  moves the timeline to a year it existed, and turns its layer on.
- **Explore this era** lists the era's people, places, and events; click
  anything — timeline marks, map markers, panel rows — for the full story.
- Arrow keys pan time; `+` / `-` zoom; the map pans and zooms independently.
- **Guided tours** (⋯ menu) walk the timeline and camera through a story —
  the grid marching north, crossing the East River, fire and Croton water,
  Robert Moses's bridges and World's Fair, and the island remade by landfill.
  Deep-link one with `#tour=grid`, `#tour=east-river`, `#tour=fire-water`,
  `#tour=moses`, or `#tour=island-remade`.
- **Then & Now** (⋯ menu) wipes between two years with a draggable line.
  Type either year, or scrub the timeline to change Now. Deep-link with
  `#year=1900&compare=1776`.
- **Map layers** (⋯ menu): street names for every street in the city,
  neighborhood names as they were in each year, and the **lost landscape**:
  Manhattan's 1609 shoreline, land drawn as river until it was filled, and
  buried streams and ponds such as the Collect and Minetta Brook.
- **Share a view:** ⋯ → *Copy link to this view*, or *Copy link* on any
  entry card. `#entry=vj-day` opens that entry directly.
- **Key** (top right of the map) explains what's drawn, listing only what's
  on screen in the current year and zoom.
- Map and timeline markers are keyboard-reachable: Tab to one, Enter to open.

## Status (as of 2026-09-23)

Everything below is on `main` and live at
https://scootsmagoo.github.io/New-York-Map/. 73 unit tests and 24 browser
tests (desktop WebKit and Chromium, plus an emulated iPhone) run on every
push, and a failure stops the deploy. A pan frame-rate check runs locally
(CI has no GPU).

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

*Making it easier to understand*
- A one-time "Things to try" card pointing to tours, Then & Now, map
  layers, and search, which are all tucked away in the ⋯ menu or ⌘K.

*Keeping it working*
- Check search on a real iPhone: the keyboard should come up on the first
  tap. Emulators can't show the iOS rule this works around.

*More history*
- Lost landscape for Brooklyn and Queens (Gowanus Creek, Wallabout Bay,
  Jamaica Bay marshes), from an 1840s U.S. Coast Survey chart.
- Streetcar lines, 1832–1945.
- Real street lines outside Manhattan at high zoom, in place of the hatch
  texture.
- Even out the content: Lenapehoking has 13 entries to the Antebellum era's
  29, and 1919–1945 has no *Gotham* notes.
- Carry the timeline past 1945 (Moses's expressways, public housing, the
  fiscal crisis).
- Audio per era.

**Done: React 19.3** (2026-09-26). Upgraded from 19.2.7, following the
plan researched from the [release post](https://react.dev/blog/2026/09/09/react-19-3)
and [changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md):

- **`<ViewTransition>`:** the era panel, entry card, search, About, and
  the tour card now animate *closed* (before, they faded in but vanished).
  Tour steps slide forward or back, using `addTransitionType`. Only panel
  state is a transition (`useAnimatedState`); the map and timeline never
  are, and a browser test checks that scrubbing starts no view transitions.
  The page itself is left out of the animation, so the map stays live
  underneath. Reduced motion turns it all off.
- **Fragment refs:** a `FocusTrap` keeps keyboard focus inside dialogs
  and gives it back on close. The era panel's thumbnails share one
  IntersectionObserver through `observeUsing`, instead of one per row.
- **`<Activity>`:** search and the era panel stay mounted but hidden
  after first use, so search keeps its query and the panel its scroll.
- **`useEffectEvent`:** replaces ref workarounds and four of the five
  suppressed lint warnings.
- Costs and limits: React 19.3 adds ~9 KB gzipped to the first download.
  In Safari, a press within the ~0.2 s of a closing animation ends the
  animation instead of starting a map drag (Chrome passes it through).
  `@types/react-dom` 19.3.0 lacks `FragmentInstance.compareDocumentPosition`,
  so `FocusTrap` casts for it.
- Not used: the React Compiler (would replace our hand-tuned memoization,
  which is what keeps the map fast in Safari; try only with before/after
  WebKit numbers), `browser()` and the Server Components changes (client-
  only app), Trusted Types (needs a CSP header GitHub Pages can't set).

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
| `npm run test:e2e` | browser tests in WebKit and Chromium against the build (`npm run build` first); the pan frame-rate check runs locally only (`PERF_FLOOR=45` to hold the line) |
| `npm run validate:wiki` | verify every Wikipedia title resolves |
| `node scripts/prepare-geo.mjs` | regenerate map geometry from public sources (then packs it with `scripts/pack-geo.mjs`) |
| `node scripts/prepare-overlays.mjs` | download & compress historical map sheets |
| `node --experimental-strip-types scripts/prepare-streets.mjs` | street names and the Manhattan grid table from NYC street centerlines |

## Credits

Burrows & Wallace's *Gotham* (inspiration) · Wikipedia (content & images) ·
NYC Open Data (boundaries, street centerlines) and the U.S. Census Bureau. Built-up extents are
approximate, hand-drawn illustrations of growth — see PROJECT.md.
