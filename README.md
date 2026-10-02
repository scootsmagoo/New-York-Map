# Gotham — A Timeline of New York City

An interactive, pannable timeline of New York City's history, from
Lenapehoking to the fiscal crisis of 1975. Pan through time and watch the
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
  the Collect Pond, and fires and epidemics. Picking a neighborhood, a
  lost water, a fire, or an epidemic flies there,
  moves the timeline to a year it existed, and turns its layer on.
- **Explore this era** lists the era's people, places, and events; click
  anything — timeline marks, map markers, panel rows — for the full story.
- Arrow keys pan time; `+` / `-` zoom; the map pans and zooms independently.
- **Guided tours** (⋯ menu) walk the timeline and camera through a story —
  the grid marching north, crossing the East River, fire and Croton water,
  Robert Moses's bridges and World's Fair, the island remade by landfill,
  slavery and freedom, the war years, the riots, the rich moving uptown,
  horsecar to bus, and one for each of the other boroughs (Brooklyn,
  Queens, the Bronx, Staten Island). Deep-link one with `#tour=grid`,
  `#tour=brooklyn`, and so on.
- **Then & Now** (⋯ menu) wipes between two years with a draggable line.
  Type either year, or scrub the timeline to change Now. Deep-link with
  `#year=1900&compare=1776`.
- **Map layers** (⋯ menu): street names for every street in the city,
  neighborhood names as they were in each year, and the **lost landscape**:
  Manhattan's 1609 shoreline, land drawn as river until it was filled, and
  buried streams and ponds such as the Collect and Minetta Brook; in the
  other boroughs, the tidal marshes and shallows of the 1890s surveys
  (Flushing Meadows, Barren Island, Jamaica Bay, Fresh Kills) until they
  were filled. Zoomed in, Brooklyn, Queens, the Bronx, and Staten Island
  show every street, appearing as its blocks were built up.
  **Fires & epidemics** draws the great fires' burned districts (1776,
  1835, 1845) and the epidemics' worst-hit blocks (yellow fever 1798 and
  1822, cholera 1832 and 1849, the 1903 "lung block") in the years they
  struck, each with a note cited to *Gotham*. The *Fire and Water* tour
  turns it on. **Working waterfront** marks markets, docks, shipyards, and
  sugar houses while they worked. **Streetcars** draws 24 horsecar and
  trolley lines from 1832 until buses replaced them, dotted while horses
  pulled the cars and solid once they ran on electricity.
- **Things to try:** a first visit gets a small card pointing to a tour,
  Then & Now, search, and the map layers. It shows once.
- **Share a view:** ⋯ → *Copy link to this view*, or *Copy link* on any
  entry card. `#entry=vj-day` opens that entry directly.
- **Key** (top right of the map) explains what's drawn, listing only what's
  on screen in the current year and zoom.
- Map and timeline markers are keyboard-reachable: Tab to one, Enter to open.

## Status (as of 2026-10-01)

Everything below is on `main` and live at
https://scootsmagoo.github.io/New-York-Map/. 104 unit tests and 57 browser
tests (122 runs across desktop WebKit and Chromium and an emulated iPhone,
upright and on its side) run on every push, in Playwright's own container
image, and a failure stops the deploy. A pan frame-rate check runs locally
(CI has no GPU).

**Where things stand**

- The timeline runs from Lenapehoking to 1975 across ten eras, with about
  420 entries. The tenth, **The Postwar City (1945–1975)**, carries
  every layer on: expressways, parkways, and the Verrazzano as they open,
  the suburbs of Queens and Staten Island filling in, the last trolleys,
  Lincoln Center, Stonewall, and the fiscal crisis.
- **All five boroughs in detail.** Manhattan's grid as it was opened and
  every outer-borough street dated block by block, with the built-up areas
  drawn from them; 35 to 130 markers per borough; and a borough filter in
  *Explore this era* and search.
- **How the city moved:** els and subways in four boroughs, railroads from
  1834 (drawn with cross ties), streetcars, 18 ferries and 34 bridges,
  parkways and expressways, each appearing and disappearing on its dates.
- **Layers** (⋯ menu): street and neighborhood names, the lost landscape
  of every borough, the working waterfront, streetcars, public housing,
  and fires & epidemics.
- **Phones, either way up.** Turned on its side, a phone gets a one-row
  header and a slimmer timeline so the map has most of the screen; tour
  cards dock to the side. Turning the phone keeps the map where it was.
  The map runs under an iPhone's notch; the controls stay clear of it.
- **Built on the *Gotham* trilogy.** Entry cards cite the chapter and
  pages that cover them in *Gotham*, *Greater Gotham*, or *Gotham at War*
  ("Read more:"), and margin notes say how that volume treats the subject.
  The 1920s fall between the volumes and have neither. Blurbs were
  checked against the books; see
  [docs/BOOK_REFERENCE.md](docs/BOOK_REFERENCE.md). Entries beyond the
  books (the postwar city, much of the outer boroughs) are written from
  Wikipedia.
- **Accessibility (WCAG 2.2 AA pass, 2026-09-26).** Every main screen is
  checked by axe in the browser tests. Text and map labels meet 4.5:1
  contrast, the timeline's playhead is a keyboard slider (arrows, Page
  Up/Down, Home/End) that reads out the year and era, search follows the
  combobox pattern, tours announce each stop, and single-key shortcuts
  work only when the map or timeline has focus.
- **Seventeen tours** (⋯ menu, by borough, or `#tour=<id>`): the grid, the
  East River, fire and water, Moses, horsecar to bus, one for each outer
  borough, the postwar city, the island remade, *Slavery and Freedom*,
  *New York at War*, *A City of Riots*, *The Rich Move Uptown*,
  *Crossing the Hudson*, and *Marsh to Runway*.
- **Then & Now** compares any two years. It opens on two different years,
  and both can be typed.
- On phones: pinch the timeline with two fingers, and *Explore this era*
  opens as a bottom sheet.

**Next up** (details in PROJECT.md → Future features)

*Keeping it working*
- Check search on a real iPhone: the keyboard should come up on the first
  tap. Emulators can't show the iOS rule this works around.

*More history*
- More entries from the candidate list in docs/BOOK_REFERENCE.md,
  especially *Greater Gotham*'s people and places for 1898–1919.
- Past 1975: the city's comeback, the 1977 blackout, the modern city.
- Audio per era.

**Done**, newest first:

*Done 2026-10-02 (night):* six entries from *Gotham* (Vauxhall Garden, the
Park Theater, Frances Wright's Hall of Science, the 1834 riots against the
abolitionists, Cooper Union, Josephine Shaw Lowell), the riot linked from
the *City of Riots* tour; and the lost landscape of Manhattan's made-over
islands: Little Hell Gate and Sunken Meadow at Randall's and Ward's,
Governors Island's southern half, and Spuyten Duyvil Creek at Marble Hill.

*Done 2026-10-02 (later):* the South Bronx before the 1890s, traced from
F. W. Beers's 1865 map of Morrisania: the Harlem River flats below High
Bridge and the shore to Mott Haven (search "Harlem River flats"); a fix
that let the older maps date ground the 1890s pass had set aside (half a
km² more in Brooklyn too); and the 1845 chart now fades out across Queens
instead of ending in a hard line.

*Done 2026-10-02:* six entries for 1933–45 cited to *Gotham at War*
(Washington Heights' "Fourth Reich," the 1941 bus boycott, Minton's, the
dim-out, Art of This Century, Sinatra at the Paramount); a *Marsh to
Runway* tour of the outer boroughs' filled shores; and a fix for tours
opened from a link, whose first stop never flew the camera.

*Done 2026-10-01 (late):* 12 entries for 1898–1919 cited to *Greater
Gotham* (the Tenderloin riot, the Panic of 1907, the Hudson tubes, the
Singer and Met Life towers, Tin Pan Alley, Mabel Dodge's salon, the
Paterson Pageant, the Rosenthal murder…), and the 1845 Coast Survey chart as a historical map
over Brooklyn, southern Queens, and Staten Island (⋯ → Show overlays),
the first sheet outside Manhattan.

*Done 2026-10-01 (night):* the lost landscape before the 1890s outside
Manhattan, traced by hand from the U.S. Coast Survey's 1845 chart of New
York Bay: the Red Hook and Gowanus marshes, Wallabout Bay, Greenpoint's
marshes on Newtown Creek, and the St. George waterfront, each dated by
when the streets reached it (search "Gowanus marshes"). Also a health
check (one moved Wikipedia title fixed, a Brooklyn scene in the frame-rate
check, the first load re-measured) and the LIRR's 1861 Main Line and 1870
Lower Montauk.

*Done 2026-10-01 (last):* 17 early-Brooklyn entries (Nieuw Amersfoort,
Lady Deborah Moody's Gravesend, New Utrecht, Boswijck, Erasmus Hall, Fort
Hamilton, Williamsburgh, Brooklyn's City Hall, Manhattan Beach, the
Promenade…) and a *Crossing the Hudson* tour, from Stuyvesant's
Communipaw ferry to the last Hudson ferry in 1967.

*Done 2026-10-01 (later):* 21 more Staten Island and Queens entries, from
the Lenape burial ground at Ward's Point and the island's oldest house to
the valley of ashes, Big Allis, and the Staten Island Mall; and the 1916
polio epidemic, drawn on the fires & epidemics layer over the old South
Brooklyn section where it began.

*Done 2026-10-01:* 13 more ferries (Paulus Hook, Hoboken, Pavonia,
Communipaw, Catharine, Wall Street, Hamilton Avenue, and others, each
fading as bridges and tunnels retired it) and 14 more bridges (the Harlem
River's from Madison Avenue to Broadway, City Island, Pelham, Carroll
Street, Cross Bay); CI now runs in Playwright's own image, so a slow
Ubuntu mirror can't stall a deploy.

*Done 2026-09-30 (night):* railroads, 1834–1975 (the Harlem, Hudson River, Long
Island, and Staten Island lines, the Cobble Hill tunnel, the Coney Island
excursion lines that became the BMT, the Westchester & Boston, the High
Line), drawn with cross ties from OpenStreetMap track geometry; and 22
entries that had no marker (Nellie Bly at the Blackwell's Island asylum,
Stieglitz's 291, the draft office the 1863 rioters burned…) placed where
their stories happen.

*Done 2026-09-30 (last):* els and subways in Brooklyn, Queens, and the
Bronx (23 lines, 1885–1975, each opening and coming down on its own
date, including the Rockaway line and the Chrystie Street Connection),
and 20 Bronx entries from Throgs Neck (1642) to 1520 Sedgwick Avenue
(1973), taking the Bronx from 22 markers to 42.

*Done 2026-09-30 (later):* a Public housing layer (185 Housing Authority
developments, 1935–75), a borough filter in Explore this era and search,
and 25 more Staten Island and Queens entries.

*Done 2026-09-30:* the timeline carried to 1975 (a Postwar City era, 38
entries, parkways and expressways, five bridges, a Postwar City tour,
the Moses tour to 1968); the map key leads with the layers you turned on.

*Done 2026-09-29:* tours of Brooklyn, Queens, the Bronx, and Staten
Island; real outlines for 90 parks there; 65 more neighborhood names.

*Done 2026-09-28:* the outer boroughs brought up toward Manhattan's
detail: every street in Brooklyn, Queens, the Bronx, and Staten Island,
dated block by block; the built-up areas drawn from them; their marshes
and shallows in the lost landscape; 78 new entries; and the map layers
grouped in the ⋯ menu.

*Done 2026-09-26/27:* the "Things to try" card, *Fires & epidemics*,
*Working waterfront*, *Streetcars* (with a tour), and 14 entries evening
out the early eras.

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

- Phone layouts are tested in emulated iPhones (WebKit), which can't show
  a real notch or Safari's toolbars moving. Worth a look on a real phone
  on its side.

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
See [docs/BOOK_REFERENCE.md](docs/BOOK_REFERENCE.md) before adding content:
it maps *Gotham* and *Greater Gotham* chapters to eras, explains how to
search your own copies of the books with citations, and lists candidate
additions.

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
| `node --experimental-strip-types scripts/prepare-streetcars.mjs` | streetcar routes from the legs in `src/data/streetcars.ts` (uses the centerlines `prepare-streets` downloads) |
| `node --experimental-strip-types scripts/prepare-railroads.mjs` | railroad routes from `src/data/railroads.ts`, using an OpenStreetMap export in `data-raw/osm_rail.json` (the download command is in the script's header) |
| `python3 scripts/books/extract-epub.py <epub> <slug>` / `scripts/books/find.py "<regex>"` | extract your own copy of a book to gitignored text, then search it with chapter/page citations |

## Credits

Stories from standard histories, above all Burrows & Wallace's *Gotham* and
Wallace's *Greater Gotham* and *Gotham at War* (cited by chapter and page),
and Wikipedia (live summaries and images). Geometry from NYC Open Data
(borough boundaries, street centerlines, PLUTO tax lots, NYC Parks
properties), railroad tracks © OpenStreetMap contributors (ODbL), the
U.S. Census Bureau, and the U.S. Geological Survey's
1891–98 topographic maps; historical map sheets from Wikimedia Commons;
the pre-contact island from Eric W. Sanderson's *Mannahatta*. What is
drawn by hand, and how far to trust each layer: PROJECT.md → Data sources
& honesty, and the About page on the site.
