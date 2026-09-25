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
https://scootsmagoo.github.io/New-York-Map/. 73 unit tests and 14 browser
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

**Planned: upgrade to React 19.3** (researched 2026-09-26; not started)

We're on React 19.2.7. [React 19.3](https://react.dev/blog/2026/09/09/react-19-3)
(2026-09-09) has no breaking changes. Its two headline features,
[`<ViewTransition>`](https://react.dev/reference/react/ViewTransition) and
[Fragment refs](https://react.dev/reference/react/Fragment), are now stable.
Full list in the [changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md).
Steps, in order, each its own commit, with `npm test`, `npm run test:e2e`,
and the local WebKit pan check (`PERF_FLOOR=45`) after each:

1. **Bump the packages.** `react`, `react-dom`, `@types/react`,
   `@types/react-dom` to `19.3.0`; `@vitejs/plugin-react` 6.0.2 → 6.1.1.
   Nothing in our code should need changing. Fixes we benefit from without
   doing anything:
   - a fix for `useDeferredValue` getting stuck, which is how the map
     follows the timeline;
   - Fast Refresh now works with `lazy()` components, which the dialogs
     now are;
   - transitions render independently, so a slow one no longer holds up
     the others.
2. **`useEffectEvent`** (stable since 19.2; 19.3 fixes it inside `memo()`
   components like MapView). Replace the "copy the latest value into a
   ref" workarounds that effects read from: `winRef` and `widthRef` in
   Timeline's wheel handler, the zoom setup in MapView, and the load-time
   deep-link effect in App. Also remove most of the five
   `eslint-disable exhaustive-deps` comments. Keep refs that are read in
   ordinary event handlers (for example `getViewUrl`), since
   `useEffectEvent` is only for effects.
3. **Fragment refs for keyboard focus in dialogs.** The entry card,
   search, About, and the era panel don't keep keyboard focus inside while
   open, and don't return it to where it was when they close. A small
   `FocusTrap` built on `<Fragment ref>` (its `focus()` and `focusLast()`
   go to the first and last focusable elements, with no wrapper element)
   fixes that. Add browser tests that tab through each dialog. Elsewhere
   the app already has the wrapper elements Fragment refs would replace
   (for example `useElementSize`'s div), so nothing else changes.
4. **`<ViewTransition>` for panels, not the map.** It animates only
   updates wrapped in `startTransition`, and while it runs the page is a
   still snapshot. So:
   - Use it on discrete UI: the era panel, entry card, search, map key,
     and Then & Now opening and *closing*. Today they fade in but vanish
     instantly on close.
   - Tour steps slide forward or back using `addTransitionType("next" |
     "back")`.
   - **Never** on timeline scrubbing, autoplay, or map pan/zoom. Those
     update every frame and must stay urgent (not transitions).
   - Keep the rest of the page out of the animation
     (`view-transition-name: none` on the root), so the map stays live
     under an opening panel.
   - Add reduced-motion rules for the `::view-transition-*`
     pseudo-elements. React doesn't honor `prefers-reduced-motion` on its
     own, and our existing `*` rule doesn't reach those pseudo-elements.
   - Delete the CSS keyframes this replaces.
   - Browser support: Chrome 111+, Safari and iOS 18+ (18.2 for classes
     and types), Firefox 144+. Older browsers skip the animation with no
     errors.
   - Measure WebKit frame rate while a panel animates over a zoomed map.
5. **`<Activity>`** (stable since 19.2): keep search and the era panel
   mounted but hidden when closed, so a reopened search keeps its query
   and the era panel keeps its scroll position. Hidden trees clean up
   their effects, so search's key listeners won't stay active. Optionally
   pre-render search in a hidden Activity so its first open is instant.
   The iOS focus proxy stays, because a hidden input can't take focus.

*Doesn't apply here:* `browser()` and the Server Components changes (this
is a client-only app); Trusted Types (only matters with a CSP header, which
GitHub Pages can't set). *Optional, separately:* the React Compiler
(supported by `@vitejs/plugin-react` 6.1) could replace our hand-written
`memo`/`useMemo`/`useCallback`. That memoization is what keeps the map fast
in Safari, so only with before-and-after WebKit measurements.

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
