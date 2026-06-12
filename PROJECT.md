# Gotham: A Timeline of New York City

An interactive, pannable timeline of New York City's history — from the Lenape
world through New Amsterdam, British New York, and the metropolis, ending in
1919 where Mike Wallace's *Greater Gotham* closes. Inspired by Edwin G.
Burrows & Mike Wallace, *Gotham: A History of New York City to 1898*.

**Repo:** https://github.com/scootsmagoo/New-York-Map

---

## What it does

- A **zoomable, pannable timeline** runs along the bottom of the screen. The
  year under the center playhead drives everything else. The ~11,600 years of
  Lenapehoking are compressed into the left 14% of the strip (a polylinear
  scale); 1609–1919 gets the rest.
- A **stylized archival map** fills the screen. As the playhead moves, the
  city's rough built-up footprint grows — lower Manhattan first, then the
  ribbon up the Bowery, Brooklyn ferry towns, the 1811 grid filling north,
  Brooklyn's row-house ring, the South Bronx, Queens corridors, Staten
  Island's north shore. Footprints cross-fade between 13 hand-drawn snapshots
  (1609–1919) and are clipped to real shorelines.
- Before 1609, the map shows the **Lenape world** instead: territory names
  (Wecquaesgeek, Canarsee, Raritan…), village sites (Werpoes, Shorakapok…),
  and the Wickquasgeck trail that became Broadway. This layer fades out
  through the early Dutch period. Borough labels are era-aware (Breuckelen →
  Brooklyn, Staaten Eylandt → Staten Island, Westchester → The Bronx).
- **Eight eras** (Lenapehoking → Greater New York) tint the whole UI with
  their own palette and carry ~115 curated **people, places, and events**,
  weighted toward what the book emphasizes (Juan Rodriguez, the Flushing
  Remonstrance, the 1741 conspiracy trials, Madame Restell, the Draft Riots,
  Henry George's 1886 campaign…).
- Clicking an era band zooms to it; **Explore this era** opens a panel of its
  entries with live Wikipedia thumbnails. Clicking any entry (timeline mark,
  map marker, or panel row) opens a detail card with a **live Wikipedia
  summary and image**, the bundled fallback blurb, and an optional
  *Gotham* margin note.
- Autoplay (▶ or spacebar) glides through time; arrow keys pan; the map
  itself pans and zooms independently.

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
    entries/<era>.ts   ~115 people/places/events, each with wikiTitle,
                       fallback blurb, optional coords + Gotham note
    footprints.ts      13 cumulative built-up snapshots, 1609–1919
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
  the live API. First full visual pass in the browser looks right in all
  eras tested (Lenapehoking, New Amsterdam 1637, British 1739, Gilded 1880).

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

## Future features

- [ ] Extend past 1919 (Depression/War, Moses era, fiscal crisis, modern
      city) — the era/entry model already supports it.
- [ ] Georeferenced historical map overlays (Castello 1660, Ratzer 1767,
      Viele 1865) with opacity blending.
- [ ] Population counter and demographic strip charts that track the playhead.
- [ ] Street-grid growth rendering (the 1811 grid materializing block by block).
- [ ] Guided "tours": scripted camera+timeline paths (e.g., follow the Erie
      Canal money, or Whitman's ferry commute).
- [ ] Search across entries; deep links (`?year=1863`) for sharing.
- [ ] Mobile polish: touch pinch on the timeline, bottom-sheet era panel.
- [ ] Optional 2.5D mode (extruded massing by era) — evaluated three.js for
      v1 and chose 2D: no credible 3D data exists before ~1900, and the
      2D archival look serves the story better.
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
```

## Credits

- Edwin G. Burrows & Mike Wallace, *Gotham* (Oxford, 1999); Mike Wallace,
  *Greater Gotham* (Oxford, 2017) — inspiration and emphasis.
- Wikipedia & Wikimedia Commons — live summaries and imagery.
- NYC Open Data / Department of City Planning; U.S. Census Bureau — geometry.
- Eric W. Sanderson's *Mannahatta* project — the pre-contact island.
