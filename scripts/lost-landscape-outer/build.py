"""
The outer boroughs' lost landscape: marshes and shallows of the 1890s that
are land today, each dated by when it was filled.

Source: the U.S. Geological Survey's first topographic survey of the city,
1:62,500 sheets published already georeferenced (National Map Historical
Topographic Map Collection): Brooklyn 1891, Harlem 1897, Staten Island
1898, Hempstead 1897. On these sheets water and tidal marsh are tinted
blue-green (open water darker, with water-lining; marsh paler, with tufts),
land is left cream or yellow. So:

  wet in the 1890s  = tinted (green minus red, averaged over ~100 m)
  open water        = the darker tint
  made land         = wet in the 1890s, but land in the borough outlines today

Each piece of made land (cut into ~400 m cells) is dated by when the city's
streets reached it (the dated street lines from prepare-borough-streets.mjs),
or by a known date for big fills with no streets (airports, parks, rail
yards, the Navy Yard, the postwar landfills), and otherwise stays wet
through 1975, as much of Jamaica Bay still is.

Land made before the 1890s comes from older maps, traced by hand and
placed by landmarks: the U.S. Coast Survey's Map of New-York Bay and Harbor
and the Environs (Hassler, 1845; hassler-1845.json) for the Red Hook and
Gowanus marshes, Wallabout Bay, Greenpoint's Newtown Creek marshes, and
the St. George waterfront; and F. W. Beers's map of the town of Morrisania
(1865; beers-morrisania-1865.json) for the Harlem River flats of the South
Bronx. Upper Queens and the rest of the Bronx still start in the 1890s.
Manhattan has its own layer (Viele, 1865).

Downloads (data-raw/usgs/, gitignored): see README.md.
Output: src/data/geo/lostLandscapeOuter.json
Run: .venv/bin/python scripts/lost-landscape-outer/build.py
"""
import json
from pathlib import Path

import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.warp import transform_geom
from scipy import ndimage
from shapely.geometry import Point, Polygon, box, shape
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[2]
GEO = ROOT / "src/data/geo"
RAW = ROOT / "data-raw/usgs"

# Sheet file, its neat line (the quadrangle's own lon/lat corners), survey
# year, and how its printing shows water: green minus red (averaged over
# ~100 m) above `wet` is marsh or water, above `water` open water; on the
# Staten Island sheet open water is told from marsh by being darker. The
# numbers come from clustering each sheet's colors (land, marsh, water).
SHEETS = [
    ("NY_Brooklyn_8033120_1891_62500_geo.tif", (-74.0, 40.5, -73.75, 40.75), 1891, dict(wet=9, water=23)),
    ("NY_Harlem_129722_1897_62500_geo.tif", (-74.0, 40.75, -73.75, 41.0), 1897, dict(wet=22, water=50)),
    ("NJ_Staten_Island_255388_1898_62500_geo.tif", (-74.25, 40.5, -74.0, 40.75), 1898, dict(wet=5, dark=170)),
    ("NY_Hempstead_129886_1897_62500_geo.tif", (-73.75, 40.5, -73.5, 40.75), 1897, dict(wet=12, water=32)),
]
DOWN = 4  # 5.3 m pixels → ~21 m
TIME_MAX = 1975

# Big fills with no streets to date them: [name, year, (lon0, lat0, lon1, lat1)].
KNOWN_FILLS = [
    ("Floyd Bennett Field (Barren Island joined to Brooklyn)", 1930, (-73.905, 40.575, -73.875, 40.6)),
    ("North Beach airport (LaGuardia)", 1937, (-73.895, 40.765, -73.855, 40.787)),
    ("Flushing Meadows (the Corona ash dumps, then the World's Fair)", 1920, (-73.855, 40.725, -73.825, 40.768)),
    ("Orchard Beach", 1936, (-73.805, 40.86, -73.78, 40.878)),
    ("Sunnyside Yard", 1908, (-73.945, 40.74, -73.912, 40.756)),
    ("The Navy Yard's Wallabout fill", 1910, (-73.978, 40.698, -73.962, 40.707)),
    ("Bush Terminal piers", 1905, (-74.02, 40.648, -74.0, 40.662)),
    ("Brooklyn Army Base", 1918, (-74.03, 40.64, -74.018, 40.65)),
    # Manhattan's islands and Marble Hill. The first match wins, so the
    # specific fills come before Randall's and Ward's as a whole.
    ("Governors Island's southern half, built of the first subway's spoil", 1910, (-74.028, 40.682, -74.012, 40.6905)),
    ("Sunken Meadow and the waters east of it, joined to Randall's Island", 1955, (-73.9195, 40.789, -73.905, 40.8)),
    ("Little Hell Gate, between Randall's and Ward's", 1962, (-73.928, 40.784, -73.9195, 40.7955)),
    ("Spuyten Duyvil Creek at Marble Hill", 1913, (-73.918, 40.87, -73.905, 40.882)),
    ("Randall's and Ward's meadows, gone with the Triborough works", 1936, (-73.94, 40.778, -73.9, 40.802)),
    # Before the 1890s (the 1845 chart)
    ("The Atlantic Docks", 1847, (-74.016, 40.681, -74.004, 40.691)),
    ("Erie Basin", 1864, (-74.022, 40.665, -74.005, 40.678)),
    ("St. George ferry and railroad terminal", 1886, (-74.08, 40.636, -74.066, 40.648)),
    # Postwar
    ("Idlewild airport, on the Jamaica Bay marshes", 1948, (-73.83, 40.62, -73.74, 40.67)),
    # A landfill from 1948; the marsh went under garbage over the next two
    # decades, so this dates it halfway.
    ("Fresh Kills landfill", 1958, (-74.215, 40.555, -74.155, 40.605)),
    ("Great Kills Park (a landfill, 1944–49)", 1949, (-74.13, 40.535, -74.1, 40.56)),
    ("Ferry Point Park (a landfill)", 1960, (-73.84, 40.8, -73.82, 40.815)),
]

# Lakes inside today's land that the sheets tint like marsh.
LAKES = [
    (-73.9685, 40.6545, 450),  # Prospect Park Lake
    (-73.8883, 40.6882, 350),  # Ridgewood Reservoir
    (-73.8935, 40.8775, 550),  # Jerome Park Reservoir
    (-73.8905, 40.8935, 350),  # Van Cortlandt Lake
    (-73.8075, 40.7445, 250),  # Kissena Lake
    (-74.1005, 40.6275, 450),  # Silver Lake
    (-74.1165, 40.6185, 350),  # Clove Lakes
    (-73.835, 40.7355, 700),   # Meadow Lake (1939)
    (-73.832, 40.7245, 450),   # Willow Lake
]

M_LON, M_LAT = 84310, 111320


def sheet_masks(fname, neat, rule):
    with rasterio.open(RAW / fname) as r:
        a = r.read(out_shape=(3, r.height // DOWN, r.width // DOWN), resampling=rasterio.enums.Resampling.average)
        t = r.transform * r.transform.scale(r.width / a.shape[2], r.height / a.shape[1])
        crs = r.crs
    a = a.astype(float)
    gr = ndimage.uniform_filter(a[1] - a[0], 5)
    wet = gr > rule["wet"]
    if "dark" in rule:
        water = wet & (ndimage.uniform_filter(a.mean(0), 5) < rule["dark"])
    else:
        water = gr > rule["water"]
    # Labels and linework punch small holes in the tint; close them.
    wet = ndimage.binary_closing(wet, iterations=2)
    # Water-lining breaks open water into strokes; merge them, and drop
    # specks under ~60 m that are lining, not water.
    water = ndimage.binary_opening(ndimage.binary_closing(water, iterations=2), iterations=1) & wet

    def vectorize(mask):
        geoms = []
        for g, v in shapes(mask.astype(np.uint8), mask=mask, transform=t):
            geoms.append(shape(transform_geom(crs, "EPSG:4326", g)))
        return unary_union(geoms).intersection(box(*neat))

    return vectorize(wet), vectorize(water)


wet_parts, water_parts = [], []
for fname, neat, year, rule in SHEETS:
    w, o = sheet_masks(fname, neat, rule)
    wet_parts.append(w)
    water_parts.append(o)
    print(fname, "wet km²", round(w.area * M_LON * M_LAT / 1e6, 1))
wet = unary_union(wet_parts)
water = unary_union(water_parts)

features = json.loads((GEO / "boroughs.json").read_text())["features"]
# Manhattan island has its own layer (Viele). Of the rest of the borough,
# the pieces that were greatly made over are drawn here with the other
# boroughs: Randall's and Ward's, Governors, and Marble Hill. Roosevelt and
# Liberty islands changed little, and the sheets' tint misreads them.
manhattan = next(shape(f["geometry"]) for f in features if f["properties"]["boro"] == "Manhattan")
MADE_OVER = [(-73.9215, 40.7917), (-74.0194, 40.6877), (-73.9107, 40.8754)]
manhattan_made_over = [
    g for g in getattr(manhattan, "geoms", [manhattan])
    if any(g.buffer(0.002).contains(Point(x, y)) for x, y in MADE_OVER)
]
land = unary_union(
    [shape(f["geometry"]) for f in features if f["properties"]["boro"] != "Manhattan"] + manhattan_made_over
)
made_over_islands = unary_union(manhattan_made_over)

deg = lambda m: m / M_LAT
lakes = unary_union([Point(x, y).buffer(deg(r)) for x, y, r in LAKES])
made = land.intersection(wet).difference(lakes)
# Drop slivers under ~40 m wide: where the survey and today's shoreline
# disagree by the sheets' registration error, not real fill.
made = made.buffer(-deg(20)).buffer(deg(20))
print("made land since the 1890s, km²", round(made.area * M_LON * M_LAT / 1e6, 1))

# ----- Dating -----

def decode(key):
    d = json.loads((GEO / f"streets-{key}.json").read_text())
    t, q = d["tile"], d["q"]
    for tk, lines in d["tiles"].items():
        tx, ty = map(int, tk.split(","))
        for enc in lines:
            pts, x, y = [], 0, 0
            for i in range(1, len(enc), 2):
                x += enc[i]
                y += enc[i + 1]
                pts.append((tx * t + x / q, ty * t + y / q))
            yield enc[0], pts

# Street points on a fine grid: cell → earliest decade with 3+ points.
SC = 0.0008
street_cells = {}
for dec, pts in (ln for k in ("bk", "qn", "bx", "si") for ln in decode(k)):
    for (ax, ay), (bx, by) in zip(pts, pts[1:]):
        n = max(1, int(np.hypot((bx - ax) * M_LON, (by - ay) * M_LAT) / 25))
        for s in range(n):
            x = ax + (bx - ax) * (s + 0.5) / n
            y = ay + (by - ay) * (s + 0.5) / n
            street_cells.setdefault((int(x // SC), int(y // SC)), []).append(dec)


def street_year(geom):
    x0, y0, x1, y1 = geom.bounds
    decs = []
    for i in range(int(x0 // SC), int(x1 // SC) + 1):
        for j in range(int(y0 // SC), int(y1 // SC) + 1):
            c = box(i * SC, j * SC, (i + 1) * SC, (j + 1) * SC)
            if geom.intersects(c):
                decs += street_cells.get((i, j), [])
    if len(decs) < 6:
        return None
    return int(np.percentile(decs, 25)) + 5  # mid-decade, as the map shows streets


CELL = 0.005
fill, marsh = [], []


def date_cells(made, water, survey_of):
    """Date each ~400 m cell of `made`; returns the pieces kept."""
    kept = []
    x0, y0, x1, y1 = made.bounds
    for i in range(int(x0 // CELL), int(x1 // CELL) + 1):
        for j in range(int(y0 // CELL), int(y1 // CELL) + 1):
            cell = box(i * CELL, j * CELL, (i + 1) * CELL, (j + 1) * CELL)
            piece = made.intersection(cell)
            if piece.is_empty or piece.area * M_LON * M_LAT < 4000:
                continue
            year = None
            for name, y, b in KNOWN_FILLS:
                if piece.representative_point().within(box(*b)):
                    year = y
                    break
            survey = survey_of(piece)
            streets = street_year(piece)
            # Streets laid out well before the survey mean the source misled
            # us: it was land already (a pale lawn, a causeway, a slip in
            # registration or tracing).
            if year is None and streets is not None and streets < survey - 5:
                continue
            year = year or (max(streets, survey + 2) if streets else None)
            until = year if year and year <= TIME_MAX else None
            kept.append(piece)
            for kind, part in (("water", piece.intersection(water)), ("marsh", piece.difference(water))):
                # Manhattan's made-over islands are all built on by 1975;
                # wet there is a misread, not marsh that survived.
                if not until:
                    part = part.difference(made_over_islands)
                if part.is_empty:
                    continue
                (fill if until else marsh).append({"until": until, "kind": kind, "geom": part})
    return kept


kept90 = date_cells(made, water, lambda piece: next(y for f, b, y, _ in SHEETS if piece.representative_point().within(box(*b))))

# ----- Before the 1890s: older maps, traced by hand -----

# Each source: its tracing (pixel rings and landmarks), the year it shows,
# and the fit that places it. The 1845 chart spans the harbor and needs a
# second-order fit; the 1865 Morrisania map is a surveyed town plan, and an
# affine fit places it to ~15 m. Each adds only what nothing newer shows wet.
TRACED = [
    ("hassler-1845.json", 1845, 2),  # Brooklyn, southern Queens, Staten Island
    ("beers-morrisania-1865.json", 1865, 1),  # the South Bronx
    ("cgs-islands-1885.json", 1885, 1),  # Randall's and Ward's islands
]


def placer(trace, order):
    """Map pixels → lon/lat, fitted to the tracing's landmarks. A landmark
    may fix only one coordinate (a graticule tick: [lon, null] or [null,
    lat]), so longitude and latitude are fitted separately."""
    lm = trace["landmarks"]

    def design(x, y):
        cols = [np.ones_like(x), x, y]
        if order == 2:
            cols += [x * x, x * y, y * y]
        return np.stack(cols, -1)

    def solve(axis):
        pts = [l for l in lm if l["lonlat"][axis] is not None]
        px = np.array([l["px"] for l in pts], float)
        B = design(px[:, 0] / 1000, px[:, 1] / 1000)
        v = np.array([l["lonlat"][axis] for l in pts])
        c = np.linalg.lstsq(B, v, rcond=None)[0]
        return c, (B @ c - v) * (M_LON if axis == 0 else M_LAT)

    cx, rx = solve(0)
    cy, ry = solve(1)
    rms = float(np.sqrt((np.concatenate([rx, ry]) ** 2).mean()))
    print(" placed by", len(lm), "landmarks, rms", round(rms), "m")

    def place(ring):
        r = np.array(ring, float)
        b = design(r[:, 0] / 1000, r[:, 1] / 1000)
        return list(zip(b @ cx, b @ cy))
    return place


# What the 1890s pass kept is spoken for. Wet areas it set aside because
# streets came first were land by then, and an older map may date them.
covered = unary_union(kept90)
for fname, shown, order in TRACED:
    trace = json.loads((Path(__file__).parent / fname).read_text())
    print(fname, end="")
    place = placer(trace, order)
    # Hand-traced rings can cross themselves; buffer(0) repairs them.
    areas = [(a["kind"], Polygon(place(a["ring"]), [place(h) for h in a.get("holes", [])]).buffer(0)) for a in trace["areas"]]
    wet_t = unary_union([g for _, g in areas])
    water_t = unary_union([g for k, g in areas if k == "water"])
    made_t = land.intersection(wet_t).difference(covered).difference(lakes)
    made_t = made_t.buffer(-deg(20)).buffer(deg(20))
    print(f" made land {shown}–1890s, km²", round(made_t.area * M_LON * M_LAT / 1e6, 1))
    kept = date_cells(made_t, water_t, lambda piece, shown=shown: shown)
    covered = covered.union(unary_union(kept)) if kept else covered


# Merge the cells that share a year and kind, so no seams show between
# them. Rings are outlines then holes, drawn with the even-odd rule.
def merge(items, key):
    groups = {}
    for it in items:
        groups.setdefault((it[key], it["kind"]), []).append(it["geom"])
    out = []
    for (k, kind), geoms in sorted(groups.items(), key=lambda kv: (kv[0][0] or 9999, kv[0][1])):
        area = unary_union(geoms).buffer(deg(1)).simplify(0.00015)
        rings = []
        for g in getattr(area, "geoms", [area]):
            if g.geom_type != "Polygon" or g.area * M_LON * M_LAT < 3000:
                continue
            for r in [g.exterior, *[h for h in g.interiors if Polygon(h).area * M_LON * M_LAT >= 3000]]:
                rings.append([[round(x, 4), round(y, 4)] for x, y in r.coords[:-1]])
        if rings:
            out.append({key: k, "kind": kind, "rings": rings})
    return out

out = {"fill": merge(fill, "until"), "stillWet": merge(marsh, "until")}
for g in out["stillWet"]:
    del g["until"]
(GEO / "lostLandscapeOuter.json").write_text(json.dumps(out))
km2 = lambda items: round(sum(abs(sum((a[0] * b[1] - b[0] * a[1]) for a, b in zip(r, r[1:] + r[:1])) / 2) for it in items for r in it["rings"]) * M_LON * M_LAT / 1e6, 1)
print("filled by", TIME_MAX, "km²", km2(out["fill"]), "in", len(out["fill"]), "groups; still wet in", TIME_MAX, "km²", km2(out["stillWet"]))
for g in out["fill"]:
    print("  ", g["until"], g["kind"], len(g["rings"]))
print("bytes", (GEO / "lostLandscapeOuter.json").stat().st_size)
