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
- **Before the 1890s.** What the USGS sheets already show as land is
  filled in from the U.S. Coast Survey's *Map of New-York Bay and Harbor
  and the Environs* (F. R. Hassler, published 1845), the Library of
  Congress scan on Wikimedia Commons. It is an engraving with no color to
  go by (marsh is rows of tufts, shallows are dots, upland is hatched or
  plain), so its marshes and shallows are traced by hand in the image's
  pixels (`hassler-1845.json`: the Red Hook and Gowanus marshes, Wallabout
  Bay, Greenpoint's Newtown Creek marshes, Bushwick Creek, the St. George
  waterfront). Thirteen landmarks place it (harbor forts, the Flatbush
  and Flatlands crossroads, Gravesend's square, Snug Harbor, Manhattan's
  squares), with a second-order fit and ~57 m rms error. Pieces are dated
  like the rest, never before 1847, with known dates for the Atlantic
  Docks (1847), Erie Basin (1864), and the St. George terminal (1886).
  Download the chart into `data-raw/coast-survey/` only to retrace:

  ```bash
  curl -sL -o data-raw/coast-survey/hassler-loc-1845.jpg \
    "https://upload.wikimedia.org/wikipedia/commons/7/74/Map_of_New-York_Bay_and_Harbor_and_the_environs_LOC_2004629241.jpg"
  ```
- **The South Bronx before the 1890s** comes from F. W. Beers's *Map of
  the Town of Morrisania* (Beers, Ellis & Soule, 1865), the Library of
  Congress scan, traced the same way (`beers-morrisania-1865.json`): the
  Harlem River flats below High Bridge, with their marsh islands and the
  mouth of Cromwell's Creek, and the shore down to Mott Haven, now Macombs
  Dam Park, the Yankee Stadium area, and the rail yards. A surveyed town
  plan, it is placed by an affine fit to ten landmarks (High Bridge, St.
  Ann's Church, Mott Haven street corners), ~15 m rms. Download it into
  `data-raw/beers/` only to retrace:

  ```bash
  curl -s -o data-raw/beers/morrisania-1865.jpg \
    "https://tile.loc.gov/image-services/iiif/service:gmd:gmd380:g3804:g3804n:la002330/full/5000,/0/default.jpg"
  ```
- **Manhattan's islands.** Manhattan island has its own layer (Viele),
  but the borough's islands that were made over are drawn here: Randall's
  and Ward's (Sunken Meadow joined in 1955, Little Hell Gate filled by
  1962, the meadows taken in the 1930s Triborough works), Governors (its
  southern half built of the first subway's spoil, 1901–12; traced from
  the 1845 chart, since the island lies just off the 1891 Brooklyn sheet),
  and Marble Hill (Spuyten Duyvil Creek filled in 1913). The U.S. Coast
  and Geodetic Survey's 1885 sheet of Blackwell's, Ward's and Randall's
  Islands (1:5,000, Library of Congress) is traced too
  (`cgs-islands-1885.json`), placed by its own printed graticule and four
  First Avenue corners to ~4 m; it mostly confirms the 1890s sheet there.
  Roosevelt and Liberty islands changed little and are left out, and
  "still wet" on the made-over islands is dropped as a misread. Download:

  ```bash
  curl -s -o data-raw/coast-survey/islands-1885.jpg \
    "https://tile.loc.gov/image-services/iiif/service:gmd:gmd380:g3804:g3804n:ct006632/full/6000,/0/default.jpg"
  ```
- **Older maps fill what the 1890s pass sets aside.** An area the USGS
  sheets tint wet but whose streets came first is dropped from the 1890s
  pass as land already; the traced maps subtract only what that pass kept,
  so they can date such ground themselves.
- **What it misses.** The traced maps cover Brooklyn, southern Queens,
  Staten Island's north and east shores, and the South Bronx, but not the
  rest of the Bronx or upper Queens, which show only what was filled
  after the 1890s. The traced areas are generalized, to about 100 m.
