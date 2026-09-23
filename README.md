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
  the grid marching north, crossing the East River, fire and Croton water.
  Deep-link one with `#tour=grid`, `#tour=east-river`, `#tour=fire-water`,
  or `#tour=moses`.
- **Then & Now** (⋯ menu) pins the current year on the left of a draggable
  seam; scrub the timeline to compare. Deep-link with `#year=1900&compare=1776`.
- Map and timeline markers are keyboard-reachable: Tab to one, Enter to open.

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
| `npm test` | unit tests (timescale, grid, label layout, content integrity, tours) |
| `npm run validate:wiki` | verify every Wikipedia title resolves |
| `node scripts/prepare-geo.mjs` | regenerate map geometry from public sources |
| `node scripts/prepare-overlays.mjs` | download & compress historical map sheets |

## Credits

Burrows & Wallace's *Gotham* (inspiration) · Wikipedia (content & images) ·
NYC Open Data and the U.S. Census Bureau (boundaries). Built-up extents are
approximate, hand-drawn illustrations of growth — see PROJECT.md.
