# Lost landscape: Brooklyn, Queens, the Bronx, Staten Island

Builds `src/data/geo/lostLandscapeOuter.json`: the tidal marshes and
shallows of the 1890s that are land today, each with the year it was filled
(or none, if it was still wet in 1975). Manhattan's lost landscape comes
from the Viele map instead (`scripts/lost-landscape/`).

It's a one-off: the output is committed, and the app never runs this.

## Run

```bash
python3 -m venv .venv && .venv/bin/pip install numpy scipy shapely rasterio
mkdir -p data-raw/usgs && cd data-raw/usgs
for f in NY/NY_Brooklyn_8033120_1891_62500_geo.tif NY/NY_Harlem_129722_1897_62500_geo.tif \
         "NY/NJ_Staten%20Island_255388_1898_62500_geo.tif" NY/NY_Hempstead_129886_1897_62500_geo.tif; do
  curl -sO "https://prd-tnm.s3.amazonaws.com/StagedProducts/Maps/HistoricalTopo/GeoTIFF/$f"
done
mv "NJ_Staten%20Island_255388_1898_62500_geo.tif" NJ_Staten_Island_255388_1898_62500_geo.tif
cd ../..
.venv/bin/python scripts/lost-landscape-outer/build.py
```

It needs the dated street lines, so run `scripts/prepare-borough-streets.mjs`
first.

## How it works, and how far to trust it

- **Source.** The U.S. Geological Survey's first topographic maps of the
  city, 1:62,500 (Brooklyn 1891, Harlem 1897, Staten Island 1898,
  Hempstead 1897), from the National Map's Historical Topographic Map
  Collection. They come georeferenced, so no landmarks are needed; each is
  clipped to its quadrangle's corners. Expect errors of about 50 m.
- **Wet or dry.** The sheets tint water and marsh blue-green and leave land
  cream or yellow. Green minus red, averaged over ~100 m, separates them;
  each sheet's printing differs, so each has its own threshold, found by
  clustering its colors (see `SHEETS`). Open water is the darker tint.
  Lakes still there today are cut out by hand (`LAKES`).
- **Made land** is what was wet then and is inside today's borough outlines,
  less slivers under ~40 m wide (registration error, not fill).
- **When it was filled.** Each ~400 m cell is dated by when the city's
  streets reached it (a quarter of its street segments built, from
  `prepare-borough-streets`), never before the survey. Cells with streets
  dated well before the survey are dropped as misread land. Big fills
  without streets have known dates (`KNOWN_FILLS`: airports, parks, the
  Navy Yard, Sunnyside Yard, the Brooklyn waterfront terminals, and the
  postwar fills: Idlewild airport, 1948; Great Kills Park and Ferry Point
  Park, landfills; and the Fresh Kills landfill, begun in 1948, dated to
  1958 because it buried the marsh over two decades). The rest stays wet
  through 1975, as much of Jamaica Bay still is.
- **What it misses.** Anything filled before the 1890s (most of Brooklyn's
  older waterfront, Gowanus's marshes) was already land on these maps.
