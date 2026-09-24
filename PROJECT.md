# Gotham: A Timeline of New York City

An interactive, pannable timeline of New York City's history — from the Lenape
world through New Amsterdam, British New York, and the metropolis to 1919,
where Mike Wallace's *Greater Gotham* closes, then on through the Depression
and the Second World War to 1945. Inspired by Edwin G. Burrows & Mike
Wallace, *Gotham: A History of New York City to 1898*.

**Repo:** https://github.com/scootsmagoo/New-York-Map

---

## What it does

- A **zoomable, pannable timeline** runs along the bottom of the screen. The
  year under the center playhead drives everything else. The ~11,600 years of
  Lenapehoking are compressed into the left 14% of the strip (a polylinear
  scale); 1609–1945 gets the rest.
- A **stylized archival map** fills the screen. As the playhead moves, the
  city's rough built-up footprint grows — lower Manhattan first, then the
  ribbon up the Bowery, Brooklyn ferry towns, the 1811 grid filling north,
  Brooklyn's row-house ring, the South Bronx, Queens corridors, Staten
  Island's north shore. Footprints cross-fade between 14 hand-drawn snapshots
  (1609–1945) and are clipped to real shorelines.
- Before 1609, the map shows the **Lenape world** instead: territory names
  (Wecquaesgeek, Canarsee, Raritan…), village sites (Werpoes, Shorakapok…),
  and the Wickquasgeck trail that became Broadway. This layer fades out
  through the early Dutch period. Borough labels are era-aware (Breuckelen →
  Brooklyn, Staaten Eylandt → Staten Island, Westchester → The Bronx).
- **Nine eras** (Lenapehoking → Capital of the World) tint the whole UI with
  their own palette and carry ~190 curated **people, places, and events**,
  weighted toward what the book emphasizes (Juan Rodriguez, the Flushing
  Remonstrance, the 1741 conspiracy trials, Madame Restell, the Draft Riots,
  Henry George's 1886 campaign…).
- Clicking an era band zooms to it; **Explore this era** opens a panel of its
  entries with live Wikipedia thumbnails. Clicking any entry (timeline mark,
  map marker, or panel row) opens a detail card with a **live Wikipedia
  summary and image**, the bundled fallback blurb, and an optional
  *Gotham* margin note.
- **Zooming the map reveals street-level detail.** The 1811 Commissioners'
  Plan grid is generated procedurally: from 1811 it appears as faint dashed
  survey lines, and solid built streets chase the same northern frontier as
  the footprint — Central Park punches its hole in the grid after 1857.
  Colonial roads (Broadway, the Bowery, Boston Post Road, Brooklyn's Ferry
  Road…) are hand-drawn polylines with dates; built-up areas outside the grid
  zone get borough-angled street-hatch textures.
- **Things rise and fall.** Landmarks carry `[built, demolished]` lifespans —
  Fort Amsterdam is razed in 1790, Barnum's Museum burns in 1865, the Crystal
  Palace vanishes in 1858, the Croton Reservoir gives way to the Library.
  Bridges and ferries are dated line geometry (the Fulton Ferry dashes fade
  out after the Brooklyn Bridge lands in 1883); parks appear on acquisition,
  drawn as construction hatching until completed (Central Park 1857–1873).
- **Then & Now** (⋯ menu) pins the current year on the left of a draggable
  seam; scrub the timeline and the right half follows it. Both halves share
  one camera, so panning or zooming either moves both. Deep link:
  `#year=1900&compare=1776`.
- Autoplay (▶ or spacebar) glides through time; arrow keys pan; the map
  itself pans and zooms independently up to 16×, with detail layers fading
  in by zoom level.

## Tech stack

| Piece | Choice | Why |
| --- | --- | --- |
| App | Vite + React 19 + TypeScript | fast dev loop, typed data model, static build |
| Map | d3-geo (Mercator) rendering SVG | full artistic control for an archival look; no tile servers, works offline |
| Timeline | custom SVG + polylinear unit-space window | d3-zoom semantics don't fit a two-segment time scale; window math is ~60 lines |
| Map zoom | d3-zoom on the SVG | battle-tested pan/pinch behavior |
| Content | Wikipedia REST `page/summary` at runtime | always-current text + properly licensed images, cached 30 days in localStorage, bundled blurbs as offline fallback |
| Geometry | NYC Open Data borough boundaries + US Census counties, processed by mapshaper | detailed shorelines (East/Harlem Rivers visible) at 138 KB; public domain |

No backend. The production build is fully static and deploys to GitHub Pages.

### Architecture sketch

```
src/
  data/
    eras.ts            8 eras with palette, summary, Wikipedia article
    entries/<era>.ts   ~190 people/places/events, each with wikiTitle,
                       fallback blurb, optional coords + Gotham note
    footprints.ts      14 cumulative built-up snapshots, 1609–1945
    lenapeSites.ts     villages, territories, trails (pre-contact layer)
    geo/*.json         generated borough + surrounding-land GeoJSON
  lib/
    timescale.ts       polylinear year<->unit mapping, window pan/zoom, ticks
    wikipedia.ts       REST summary client with localStorage cache
  components/
    Timeline.tsx       era bands, adaptive ticks, staggered entry marks,
                       drag/wheel/pinch, fly-to animation, autoplay button
    MapView.tsx        water/surround/boroughs, footprint cross-fade clipped
                       to shorelines, Lenape layer, era markers, labels
    EraPanel.tsx       grouped entries with live thumbnails
    EntryModal.tsx     live summary + image + Gotham note
scripts/
  prepare-geo.mjs      downloads + simplifies source geometry (mapshaper)
  validate-wiki-titles.mjs  checks every wikiTitle against the live API
```

The single piece of state that matters is the visible time window
`{u0, u1} ⊂ [0,1]`; the current year is the window's center. Everything —
header, theme, footprint, markers, panel — derives from it.

## Data sources & honesty

- **Boundaries:** NYC Open Data "Borough Boundaries" (gthc-hcne) and US Census
  `cb_2023_us_county_500k` (surrounding NJ/NY/CT land). Modern shorelines —
  landfill means the 1660 island was slightly slimmer than drawn.
- **Street names:** NYC Open Data street centerlines (CSCL, inkn-q76z),
  processed by `scripts/prepare-streets.mjs` into ~15,000 label anchors.
  There is no dataset of street opening dates, so a name appears when the
  built-up footprint reaches it (not before 1800; Manhattan grid names not
  before 1815). Names are today's, except for a table of well-known
  renamings (Lenox Ave, 7th/8th Aves in Harlem, Columbus/Amsterdam/West End
  before 1880–90, Richmond Turnpike, East River Drive…); obscure renamings
  and a few post-1945 streets on already-built land will slip through. The
  same data places the Manhattan grid's streets and avenues.
- **Lost landscape:** Viele (1865), registered by seven landmarks (~45 m
  error); made land and marshes picked by his map colors, Collect Pond,
  Lispenard Meadows, Minetta Brook, and Stuyvesant's creek and meadows
  traced by hand. When each strip of land was made is estimated from its
  distance to the older shore — see `scripts/lost-landscape/README.md`.
  Manhattan only.
- **Neighborhood names:** hand-dated from standard neighborhood histories
  (`neighborhoods.ts`); dates mark common use, not incorporation, and
  positions are label anchors, not boundaries.
- **Built-up footprints:** hand-drawn approximations against period maps
  (Castello Plan, Ratzer, Viele, Bromley atlases from memory), deliberately
  impressionistic, clipped to real land. They are *illustrations of growth*,
  not parcel data.
- **Lenape sites:** locations are approximate, compiled from colonial deeds
  and archaeology as popularized (Werpoes at the Collect, Sapohanikan,
  Shorakapok). Spellings vary wildly in sources.
- **Text/images:** entry cards fetch live from Wikipedia under its licenses;
  the bundled blurbs and era summaries are original text informed by the
  book's coverage.

## Build log

- **2026-06-12** — Project scoped (questions answered: span to 1919, 2D
  stylized map, hybrid Wikipedia content, git with pushes, archival look).
  Scaffolded Vite/React/TS; geo pipeline (mapshaper) built; 8 eras and ~115
  entries authored; polylinear timeline, morphing map, era panel, entry
  modal, theming, autoplay all working; Wikipedia titles validated against
  the live API (10 titles corrected to canonical articles). First full visual
  pass in the browser looks right in all eras tested (Lenapehoking, New
  Amsterdam 1637, British 1739, Gilded 1880). Production build clean at
  157 KB gzipped; pushed to GitHub with a Pages deploy workflow (enable
  **Settings → Pages → Source: GitHub Actions** once).
- **2026-06-12 (later)** — Street-level detail pass. Lifespan model for
  rise-and-fall landmarks (+10 new building entries: Astor Opera House &
  Astor House, Barnum's, Croton Reservoir, the Tombs, Niblo's, St. Paul's,
  Grand Central Depot, MSG 1890, High Bridge); bridges & ferries as dated
  geometry; 18 parks with construction phases; procedural 1811 grid with
  survey-vs-built frontiers and the Central Park hole; 17 hand-drawn colonial
  roads; borough street-hatch fills; zoom-based level-of-detail framework
  (max zoom 10×→16×). Verified in-browser at 1714, 1843, and 1880 at
  multiple zooms.
- **2026-06-12 (timeline UX)** — Fixed overlapping timeline marks with a
  proper declutter pass (4 lanes, label-width reservation, hide-don't-overlap)
  and fixed the "snap back to era" bug: drags that started on an era band or
  mark were firing those elements' click handlers on release. Added deep
  links (`#year=1880&span=0.11`).
- **2026-06-12 (historical overlays)** — Castello (1660), Ratzer (1767), and
  Viele (1865) map sheets from Wikimedia Commons, georeferenced to the
  Mercator frame, clipped to Manhattan, with timeline crossfade, manual
  pick mode, and a global opacity slider (~2.8 MB compressed assets in
  `public/overlays/`).
- **2026-09-09 (Safari performance + hygiene)** — First pass by reading:
  MapView re-rendered on every animation frame and re-serialized the
  borough shorelines each time; the map-year debounce never settled during
  motion. Memoized the map, header, and population panel; hoisted static
  path strings; throttled + deferred the map year; dropped the footprint
  blend mode and the blurs floating over the map; added reduced-motion
  support. Second pass by measuring (Playwright WebKit + Chromium, wheel
  zoom / pan / autoplay / timeline drag): the real Safari cost was the
  five-path land clipPath, rasterized as a mask per frame; merged into one
  path, WebKit map zoom went 10 → 57 fps and pan 17 → 61 fps. Keyboard access for markers. Layer preferences
  persist. Vitest suite (34 tests) with a CI workflow; the suite found one
  mis-filed entry. Guided tours shipped (three stories, animated flights,
  `#tour=` deep links). d3 umbrella dependency replaced by the four
  submodules in use.
- **2026-09-23 (Then & Now + to 1945)** — Then & Now compare: a pinned
  year on the left of a draggable seam, one shared camera, `#compare=`
  deep links; WebKit pans it as fast as a single map. The timeline now
  runs to 1945: a ninth era (Capital of the World), 26 entries, eight
  bridges from the Goethals to the Whitestone, the IND lines, a 1945
  footprint, 1930/1940 population with a Puerto Rican segment, El Barrio
  and Bed-Stuy, Flushing Meadows, and a fourth tour ("The Power Broker's
  City"). Fixed deep links and jumps to late years landing a decade early.

## Lessons learned

1. **PowerShell mangles nested quotes in CLI args.** Driving mapshaper from
   the command line lost the inner quotes of `-filter` expressions (filters
   matched 0 features). Moving the pipeline into a Node script using
   mapshaper's JS API made it deterministic and reproducible.
2. **mapshaper emits a `GeometryCollection` if features have no attributes.**
   After `-dissolve2`, the surround layer lost its properties and the app
   crashed on `features.map`. Adding a dummy property via `-each` restores a
   proper FeatureCollection.
3. **Generalized national data can't draw a city.** Census 1:500k county
   outlines bridged right over the East and Harlem Rivers — Manhattan wasn't
   an island. City-published boundaries (NYC Open Data) at ~8% simplification
   keep the rivers crisp at 138 KB. Lesson: match data resolution to the
   geographic feature that carries your story.
4. **d3-geo cares about ring winding (spherically).** GeoJSON from RFC-7946
   sources renders inside-out; mapshaper's `gj2008` flag (clockwise
   exteriors) is the painless fix. Hand-authored rings drawn counterclockwise
   get reversed at load time.
5. **Clip footprints per landmass, not to "all land".** A "Manhattan built up
   to 14th St" band clipped against *all five boroughs* leaks across the East
   River into Brooklyn. Manhattan bands clip against Manhattan alone; the
   blob layer clips against the full city.
6. **Be polite to Wikipedia or it 429s you.** Six concurrent summary requests
   drew rate limits within seconds. The validator now runs sequentially with
   backoff; the app itself spreads requests naturally (and caches for 30
   days). Five titles were genuinely wrong and are now canonical — validate
   titles in CI, not in production.
7. **A polylinear scale beats both honesty and lies.** A linear timeline
   makes 10,000 years of Lenapehoking crush 310 years of city into pixels; a
   log scale distorts everything. Two linear segments with a fixed break at
   1609, plus window-based pan/zoom in unit space, reads naturally and keeps
   d3-style `rescale` complexity out entirely.
8. **Cross-fading cumulative snapshots reads as growth.** Real shape
   interpolation (flubber-style morphing) is unnecessary when each snapshot
   contains the last: draw the current one solid and fade the next one in.
9. **Borough polygons contain surprise islands.** Governors, Liberty, and
   Ellis Islands belong to Manhattan's borough polygon, so a "built up to
   14th Street" band clipped to Manhattan quietly painted the harbor islands
   brown. Geometry that's *legally* one unit isn't *visually* one unit —
   the band now starts just under the Battery.
10. **SVG clipping composes better than geometry math.** The built-street
    reveal is three nested clip paths (shoreline ∩ grid zone ∩ built
    frontier); the "everything except the grid zone" hatch uses a frame
    rectangle plus the zone ring with `clip-rule: evenodd`. Zero polygon
    boolean libraries needed.
11. **Counter-scale what should stay screen-sized.** Markers and labels use
    `scale(1/k)`, strokes use `vector-effect: non-scaling-stroke`, and
    hatch patterns put `scale(1/k)` in `patternTransform` so texture pitch
    stays constant while geometry zooms.
12. **A regular grid is data you can compute.** Generating the 1811 plan
    (29° bearing, 79 m street pitch) costs ~60 lines and zero kilobytes,
    against megabytes for real centerlines that would fight the archival
    style anyway.
13. **Browsers fire `click` after a drag.** With pointer capture, a pan that
    starts on an era band still ends with that band receiving a click —
    which flew the view right back to the era the user was trying to leave.
    Custom drag surfaces need a "was this a drag?" flag consulted by every
    click handler on them.
14. **Never draw two things in one spot; hide the loser.** The timeline's
    declutter reserves real label widths per lane and simply skips marks
    that don't fit — zooming in reveals them. An overlapped label is worse
    than an absent one.
15. **A debounce on a value that changes every frame is a freeze.** The map
    year was debounced 75 ms behind a float year that moved on every
    animation frame, so the timer never fired during autoplay or drags and
    the map snapped on release. Round to whole years and *throttle*; a
    trailing-edge throttle tracks continuous motion at a steady cadence.
16. **Measure before believing the folklore.** The Safari slowness was
    assumed to be React churn, blend modes, and blurs. A Playwright WebKit
    benchmark (wheel-zoom over the map, count animation frames) showed the
    real shape: autoplay and timeline drags ran at 60 fps everywhere, but
    map zoom ran at 10 fps in WebKit versus 60 in Chromium, and none of the
    first-round fixes moved it. Ablating layers with injected CSS found the
    culprit in minutes: hiding the footprint wash alone restored 58 fps.
17. **WebKit clips geometrically only when a `<clipPath>` holds one shape.**
    The land clip held five borough paths, so WebKit rasterized it as a mask
    on every pan/zoom frame. Concatenating the borough outlines into a
    single `<path>` (multiple subpaths, same nonzero fill) took map zoom
    from 10 fps to 57 fps and panning from 17 to 61 in WebKit. Chromium was
    already at 60. Keep every clipPath to a single path element.
18. **Content tests catch what eyes skip.** A ten-line test that checks each
    entry's year falls inside its era found St. Paul's Chapel (1766) filed
    under an era that ends in 1763. Data authored by hand deserves the same
    invariants as code.
19. **Two stacked SVGs cost two SVGs, unless each paints only its half.**
    Then & Now puts the pinned map in a clipped pane over the live one;
    WebKit still painted the whole live map underneath and panning fell from
    ~50 to ~36 fps. Clipping the live SVG to its own half (a CSS variable
    drives both clips, so dragging the seam re-renders neither map) put it
    back at ~51. Followers apply the leader's transform imperatively and
    re-render only when the leader's gesture settles.

20. **A collision box must be measured in the units it collides in.** The
    street-label declutter sized boxes in screen pixels but placed them in
    map units, so at 6× zoom every label reserved six times its real room
    and most streets went unlabeled. That, more than missing data, was why
    the layer looked spotty.
21. **Lay out by viewport when the view settles, not per frame.** The
    street layer indexes ~15,000 anchors in a spatial hash, queries the
    visible rectangle (plus a margin) only when a pan or zoom ends or the
    year changes, and caps on-screen labels at 180. WebKit pan and scrub
    frame rates match the layer switched off, with 16× the labels.

22. **Check that a scan is north-up before placing it by bounds.** The
    Viele sheet runs along the island with north to the right; stretched
    into a north-up box, it was unrecognizable, and no one noticed because
    the overlays are opt-in. Placing a sheet by landmarks (least-squares
    affine over a few known squares) fixes any rotation and gives the error
    as a number.

## Future features

- [x] Extend past 1919 — shipped to 1945: a ninth era (Capital of the
      World: Jazz Age, Depression, war), 26 entries, the Moses-era bridges,
      the IND, the els coming down, a 1945 footprint, and 1930/1940 census
      population. The books end at 1919, so these entries carry no margin
      notes.
- [ ] Carry on past 1945 (Moses's expressways, the fiscal crisis, the
      modern city).
- [x] Georeferenced historical map overlays (Castello 1660, Ratzer 1767,
      Viele 1865) with opacity blending — shipped: Wikimedia-sourced sheets,
      Manhattan clip, timeline crossfade + manual override, opacity slider.
- [x] ~~Street-grid growth rendering~~ — shipped: procedural 1811 grid with
      survey-vs-built frontier, colonial road network, street-hatch fills.
- [x] Population counter and demographic strip charts that track the playhead.
- [x] Els, subway lines, and the Croton Aqueduct as dated line geometry;
      street name labels beyond Broadway; demolition "ghost" markers.
- [x] Every named street: ~15,000 label anchors from the city's street
      centerlines, appearing as the built-up area reaches them.
- [x] Neighborhood names: ~70 villages and neighborhoods under the names
      they had then (Nieuw Haarlem, Vlissingen, Hallett's Cove, Longacre
      Square…), fading in and out with their dates.
- [x] Lost landscape: the 1609 shoreline, made land dated by decade and
      drawn as river until filled, and the island's ponds, streams, and
      marshes, from the Viele map (`scripts/lost-landscape/`).
- [ ] Fit the Ratzer and Castello overlays by landmarks, as Viele now is.
- [ ] More layers: streetcar lines, real outer-borough street lines.
- [x] Guided "tours": scripted camera+timeline paths — shipped: four tours
      (the 1811 grid marching north, crossing the East River, fire and Croton
      water, Robert Moses's bridges and fair) with animated timeline flights, map camera moves, and
      `#tour=<id>` deep links. Adding one is a data entry in `tours.ts`.
- [x] ~~Deep links~~ — shipped: `#year=1863` (optional `&span=`) opens the
      timeline there; `#entry=<id>` opens an entry; *Copy link* on entry
      cards and in the ⋯ menu.
- [x] ~~Search across entries~~ — shipped: fuzzy palette over entries and
      streets (⌘K).
- [x] Then & Now: a pinned year beside the live one, split by a draggable
      seam, with a shared camera and `#compare=<year>` deep links.
- [ ] Mobile polish: touch pinch on the timeline, bottom-sheet era panel.
- [ ] Audio: ambient soundscapes per era (gulls and surf → harbor bells →
      els and steam → ragtime).
- [ ] More *Gotham* margin notes; chapter cross-references per entry.

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static build in dist/
npm run validate:wiki   # check all Wikipedia titles still resolve
node scripts/prepare-geo.mjs  # regenerate geometry from sources
node scripts/prepare-overlays.mjs  # download & compress historical map sheets
node --experimental-strip-types scripts/prepare-streets.mjs  # street names + grid table
```

## Credits

- Edwin G. Burrows & Mike Wallace, *Gotham* (Oxford, 1999); Mike Wallace,
  *Greater Gotham* (Oxford, 2017) — inspiration and emphasis.
- Wikipedia & Wikimedia Commons — live summaries and imagery.
- NYC Open Data / Department of City Planning; U.S. Census Bureau — geometry.
- Eric W. Sanderson's *Mannahatta* project — the pre-contact island.
