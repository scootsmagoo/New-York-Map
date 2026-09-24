# Lost landscape pipeline

Builds `src/data/geo/lostLandscape.json`: Manhattan's 1609 shoreline, the
land made by filling (by decade), and the island's original ponds, streams,
and marshes. Everything comes from Egbert Viele's *Sanitary & Topographical
Map* (1865), which drew the island's original watercourses and marshes, and
its "made land", over the 1865 street grid.

It's a one-off: the output is committed, and the app never runs this.

## Run

```bash
node scripts/prepare-overlays.mjs          # fetches data-raw/overlays/viele_raw.jpg
python3 -m venv .venv && .venv/bin/pip install pillow numpy scipy scikit-image shapely
.venv/bin/python scripts/lost-landscape/segment.py          # masks + placement fit
.venv/bin/python scripts/lost-landscape/extract_landfill.py # 1609 shore, dated fill
.venv/bin/python scripts/lost-landscape/extract_water.py    # ponds, streams, marshes
.venv/bin/python scripts/lost-landscape/combine.py          # -> src/data/geo/
```

`vcrop.py <lon> <lat> <half-width-px> out.png` (or `px<x> <y> …` in sheet
pixels) crops the scan with a labeled pixel grid, for tracing features by
hand.

## How it works, and how far to trust it

- **Placement.** The sheet is drawn along the island, not north-up. Seven
  landmarks (the Croton reservoir, Mount Morris, and five squares) fix a
  least-squares affine map from sheet pixels to lon/lat; the fit error is
  ~45 m, about half a block. The same landmarks place the Viele overlay in
  the app (`src/data/historicalOverlays.ts`).
- **Shorelines.** Viele's island is picked by color (his greens plus the
  orange of made land). The 1609 island is that minus made land; today's
  island (NYC borough boundary) minus the 1609 island is all the made land,
  including fill after 1865 (Riverside Park, the West Side, Battery Park
  City). Anything narrower than ~25 m is dropped: piers, and slivers where
  the scan and today's shoreline disagree by the fit's error.
- **When land was made.** No dataset dates Manhattan's fill parcel by
  parcel, so each strip is dated by its distance from the older shore:
  filling pushed out a block at a time (Water Street c. 1700, Front Street
  c. 1790, South Street c. 1810; the Hudson side later, West Street by the
  1850s; post-1865 fill 1870–1940, and beyond ~330 m postwar). See the
  tables in `extract_landfill.py`.
- **Waters.** Collect Pond, the Little Collect, Lispenard Meadows, Minetta
  Brook, Stuyvesant's Creek and meadows are traced by hand from the scan;
  Sunfish Pond is placed from the record. Uptown marshes and Harlem Creek
  are picked by color. Dates of filling come from standard histories; the
  unnamed uptown marshes vanish when the built-up footprint reaches them.
- **Coverage.** Manhattan only, and not the island's northern tip, which
  Viele shows only in an inset.
