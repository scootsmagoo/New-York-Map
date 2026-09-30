"""
Draws the outer boroughs' built-up areas for 1880 and later from the dated
street lines (src/data/geo/streets-*.json, from prepare-borough-streets.mjs),
so the tan built-up wash and the streets agree. Manhattan's footprints, and
the outer boroughs' before 1880, stay hand-drawn in src/data/footprints.ts.

A ~120 m cell counts as built in a year when enough street built by then
runs through it; gaps of a block are closed, small specks dropped,
traced into outlines, simplified, and kept off Manhattan.

Output: src/data/geo/outerFootprints.json — { "q": 10000, "years":
{ "1880": [polygon, …], … } }, each polygon [outline, hole, …] and each
ring delta-encoded [dx0, dy0, dx1, dy1, …] in 1/q-degree steps
(lib/geoPack.ts unpackRing). The holes
matter: Staten Island's shore towns ringed an empty interior.

Run: .venv/bin/python scripts/borough-footprints/build.py
"""
import json
from pathlib import Path

import numpy as np
from scipy import ndimage
from shapely.geometry import Polygon, shape
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
from skimage.measure import find_contours

ROOT = Path(__file__).resolve().parents[2]
GEO = ROOT / "src/data/geo"
YEARS = [1880, 1898, 1919, 1930, 1945, 1960, 1975]  # the footprint snapshots from 1880 on
LON0, LON1, LAT0, LAT1 = -74.27, -73.69, 40.49, 40.92
CELL_LON, CELL_LAT = 0.0015, 0.0011  # about 125 × 122 m
DECADE_SHOWS_AT = 4  # a decade's streets count from its fifth year (BoroughStreetLayer.tsx)
MIN_LENGTH_M = 150  # street length in a cell for it to count as built
M_LON, M_LAT = 84310, 111320
Q = 10000  # output precision: 1e-4° (about 10 m)


def pack(pts):
    out, px, py = [], 0, 0
    for x, y in pts:
        X, Y = round(x * Q), round(y * Q)
        out += [X - px, Y - py]
        px, py = X, Y
    return out

nx = int((LON1 - LON0) / CELL_LON) + 1
ny = int((LAT1 - LAT0) / CELL_LAT) + 1


def decode(key):
    d = json.loads((GEO / f"streets-{key}.json").read_text())
    t, q = d["tile"], d["q"]
    for tk, lines in d["tiles"].items():
        tx, ty = map(int, tk.split(","))
        x = y = 0
        for enc in lines:
            pts, x, y = [], 0, 0
            for i in range(1, len(enc), 2):
                x += enc[i]
                y += enc[i + 1]
                pts.append((tx * t + x / q, ty * t + y / q))
            yield enc[0], pts


lines = [ln for key in ("bk", "qn", "bx", "si") for ln in decode(key)]

# Street length per cell, by decade.
decades = sorted({d for d, _ in lines})
length = {d: np.zeros((ny, nx)) for d in decades}
for dec, pts in lines:
    grid = length[dec]
    for (ax, ay), (bx, by) in zip(pts, pts[1:]):
        seg = np.hypot((bx - ax) * M_LON, (by - ay) * M_LAT)
        steps = max(1, int(seg / 20))
        for s in range(steps):
            t = (s + 0.5) / steps
            x, y = ax + (bx - ax) * t, ay + (by - ay) * t
            i, j = int((y - LAT0) / CELL_LAT), int((x - LON0) / CELL_LON)
            if 0 <= i < ny and 0 <= j < nx:
                grid[i, j] += seg / steps

# A coarse outline of the four boroughs' land: the map clips the wash to the
# real shoreline when it draws it, so this only keeps outlines from spilling
# across a river onto Manhattan, without copying the coast's detail in here.
land = unary_union(
    [shape(f["geometry"]) for f in json.loads((GEO / "boroughs.json").read_text())["features"]
     if f["properties"].get("boro") != "Manhattan"]
).buffer(0.002).simplify(0.001)

out = {}
for year in YEARS:
    # Streets are kept by decade; count a decade from its middle, as the map does.
    total = sum(length[d] for d in decades if d + DECADE_SHOWS_AT <= year)
    built = total >= MIN_LENGTH_M
    # Close gaps of a block or so; no hole filling, which would fill in all of
    # Staten Island once its shore towns ringed it.
    built = ndimage.binary_closing(built, structure=np.ones((3, 3)), iterations=1)
    labels, n = ndimage.label(built)
    sizes = ndimage.sum(built, labels, range(1, n + 1))
    built = np.isin(labels, [i + 1 for i, s in enumerate(sizes) if s >= 6])
    padded = np.pad(built.astype(float), 1)
    rings = []
    for c in find_contours(padded, 0.5):
        ring = [(LON0 + (col - 1 + 0.5) * CELL_LON, LAT0 + (row - 1 + 0.5) * CELL_LAT) for row, col in c]
        if len(ring) >= 4:
            p = Polygon(ring).buffer(0)
            if p.area > 0:
                rings.append(p)
    # The tracer returns outlines and holes alike; a ring inside an odd number
    # of others is a hole in the smallest one around it.
    rings.sort(key=lambda p: -p.area)
    depth = [sum(1 for o in rings[:i] if o.contains(r.representative_point())) for i, r in enumerate(rings)]
    polys = []
    for i, r in enumerate(rings):
        if depth[i] % 2:
            continue
        holes = [h for j, h in enumerate(rings) if depth[j] == depth[i] + 1 and r.contains(h.representative_point())]
        polys.append(r.difference(unary_union(holes)) if holes else r)
    area = unary_union(polys).simplify(0.0004).intersection(land)
    polygons = []
    for g in getattr(area, "geoms", [area]):
        if g.geom_type != "Polygon" or g.area < 2e-6:
            continue
        # Outline counterclockwise, holes clockwise (the map reverses both
        # for d3's spherical winding, as it does the hand-drawn rings).
        g = orient(g, 1.0)
        ring = lambda r: pack([(x, y) for x, y in list(r.coords)[:-1]])
        holes = [ring(h) for h in g.interiors if Polygon(h).area >= 2e-6]
        polygons.append([ring(g.exterior), *holes])
    out[str(year)] = polygons  # packed rings
    print(year, len(polygons), "polygons,", sum(len(p) - 1 for p in polygons), "holes,",
          sum(len(r) // 2 for p in polygons for r in p), "points")

(GEO / "outerFootprints.json").write_text(json.dumps({"q": Q, "years": out}, separators=(",", ":")))
