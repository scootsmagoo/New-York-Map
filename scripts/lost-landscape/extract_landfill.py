"""One-off: 1609 shoreline and dated landfill for Manhattan from the Viele map.

Inputs: island.npy / made.npy (2400x708 masks of Viele's 1865 island and its
"made land"), viele_affine.json (pixel -> lon/lat), the app's boroughs.json.
Output: lostLandscape.fill.json (shoreline1609 + fill bands by decade).
"""
import json, os, math
import numpy as np
from skimage import measure, morphology
from scipy import ndimage
from shapely.geometry import Polygon, MultiPolygon, LineString, box, mapping
from shapely.ops import unary_union, split
from shapely import affinity

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BUILD = os.path.join(os.path.dirname(__file__), "build")
APP = ROOT
MO, ML = 84310.0, 111320.0

aff = json.load(open(os.path.join(BUILD, "viele_affine.json")))
L, T = aff["lon"], aff["lat"]


def px_to_m(x, y):
    lon = L[0] * x + L[1] * y + L[2]
    lat = T[0] * x + T[1] * y + T[2]
    return lon * MO, lat * ML


def mask_to_poly(mask, min_area_m2=2000):
    padded = np.pad(mask, 1)
    polys = []
    for c in measure.find_contours(padded.astype(float), 0.5):
        pts = [px_to_m(x - 1, y - 1) for y, x in c]
        if len(pts) < 4:
            continue
        p = Polygon(pts).buffer(0)
        if p.area >= min_area_m2:
            polys.append(p)
    # find_contours returns outer boundaries and holes alike; even-odd union.
    out = Polygon()
    for p in sorted(polys, key=lambda p: -p.area):
        out = out.symmetric_difference(p)
    return out.buffer(0)


island = np.load(os.path.join(BUILD, "island.npy"))
made = np.load(os.path.join(BUILD, "made.npy")) & island
original = island & ~made
original = morphology.opening(original, morphology.disk(2))
lab = measure.label(original)
biggest = max(measure.regionprops(lab), key=lambda r: r.area).label
original = ndimage.binary_fill_holes(lab == biggest)
island = ndimage.binary_fill_holes(island)

p1609 = mask_to_poly(original).simplify(6)
p1865 = mask_to_poly(island).simplify(6)

# Modern Manhattan: the main island (largest polygon of the borough).
boros = json.load(open(f"{APP}/src/data/geo/boroughs.json"))
man = next(f for f in boros["features"] if f["properties"]["boro"] == "Manhattan")
parts = [Polygon([(lon * MO, lat * ML) for lon, lat in ring[0]]) for ring in man["geometry"]["coordinates"]]
modern = max(parts, key=lambda p: p.area).buffer(0)

# What the Viele sheet actually covers: the main map, not the inset of the
# island's northern tip, and not past the sheet's right edge.
cover_px = box(45, 45, 2360, 690).difference(box(2010, 350, 2350, 660))
coverage = Polygon([px_to_m(x, y) for x, y in cover_px.exterior.coords])

p1609 = p1609.intersection(modern)
p1865 = p1865.intersection(modern).union(p1609)
# Drop anything narrower than ~25 m: piers, and slivers where the scan and
# today's shoreline disagree by the fit's error rather than by landfill.
def solid(g, r=12):
    return g.buffer(-r).buffer(r)
pre = solid(modern.intersection(p1865).difference(p1609).intersection(coverage))
post = solid(modern.difference(p1865).intersection(coverage), 18)

# East vs. west side: a line from the Battery up the island's spine.
spine_ll = [(-74.0170, 40.7000), (-74.0085, 40.7110), (-73.9995, 40.7250),
            (-73.9900, 40.7420), (-73.9700, 40.7700), (-73.9450, 40.8050), (-73.9300, 40.8800)]
spine = [(lon * MO, lat * ML) for lon, lat in spine_ll]
west_half = Polygon([(-74.20 * MO, spine[0][1])] + spine + [(-74.20 * MO, spine[-1][1])])

# Distance from the old shore -> the year the land was made. Filling pushed
# out a block at a time: Water St c. 1700, Front St c. 1790, South St c. 1810
# on the East River; the Hudson side ran later (Greenwich St 1760s, West St
# by the 1850s). Post-1865 fill (the marginal way, piers, Inwood's creeks)
# dates 1870-1940; beyond ~330 m it is postwar (Battery Park City).
EAST = [(0, 1650), (70, 1700), (140, 1785), (210, 1810), (350, 1840), (700, 1864)]
WEST = [(0, 1730), (80, 1790), (160, 1830), (260, 1850), (700, 1864)]
POST = [(0, 1868), (150, 1900), (300, 1940), (330, 1975), (2000, 1985)]


def interp(table, d):
    for (d0, y0), (d1, y1) in zip(table, table[1:]):
        if d <= d1:
            return y0 + (y1 - y0) * (d - d0) / (d1 - d0)
    return table[-1][1]


STEP = 15
bands = {}  # decade -> [polygons]


def add_bands(region, shore, table):
    if region.is_empty:
        return
    prev = shore
    d = STEP
    while d <= 900 and not region.is_empty:
        ring = shore.buffer(d, join_style="mitre", mitre_limit=3)
        band = region.intersection(ring.difference(prev))
        if not band.is_empty and band.area > 20:
            year = interp(table, d - STEP / 2)
            decade = int(year // 10 * 10)
            bands.setdefault(decade, []).append(band)
        prev = ring
        d += STEP


add_bands(pre.intersection(west_half), p1609, WEST)
add_bands(pre.difference(west_half), p1609, EAST)
add_bands(post, p1865, POST)


def rings_ll(geom, tol=6, min_area=400):
    geom = geom.simplify(tol)
    polys = [geom] if isinstance(geom, Polygon) else list(getattr(geom, "geoms", []))
    out = []
    for p in polys:
        if not isinstance(p, Polygon) or p.area < min_area:
            continue
        for ring in [p.exterior, *p.interiors]:
            out.append([[round(x / MO, 5), round(y / ML, 5)] for x, y in ring.coords[:-1]])
    return out


fill = []
for decade in sorted(bands):
    merged = unary_union(bands[decade]).buffer(0.5).buffer(-0.5)
    r = rings_ll(merged)
    if r:
        fill.append({"year": decade, "rings": r})

out = {
    "shoreline1609": rings_ll(p1609, tol=5, min_area=5000),
    "fill": fill,
}
json.dump(out, open(os.path.join(BUILD, "lostLandscape.fill.json"), "w"))
print("1609 area km2", round(p1609.area / 1e6, 2), "modern", round(modern.area / 1e6, 2),
      "pre-1865 fill", round(pre.area / 1e6, 2), "post", round(post.area / 1e6, 2))
print("decades", [(f["year"], len(f["rings"])) for f in fill])
print("points", sum(len(r) for f in fill for r in f["rings"]) + sum(len(r) for r in out["shoreline1609"]))
