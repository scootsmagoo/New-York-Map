"""Streams, ponds, and marshes from the Viele map: hand-traced downtown (in
2400-px sheet coordinates), color-picked uptown, all converted to lon/lat."""
import json, os, math
import numpy as np
from skimage import measure, morphology
from shapely.geometry import Polygon, LineString
from shapely.ops import unary_union

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BUILD = os.path.join(os.path.dirname(__file__), "build")
MO, ML = 84310.0, 111320.0
aff = json.load(open(os.path.join(BUILD, "viele_affine.json"))); L, T = aff["lon"], aff["lat"]
def ll(x, y): return [round(L[0]*x + L[1]*y + L[2], 5), round(T[0]*x + T[1]*y + T[2], 5)]
def ring(pts): return [ll(x, y) for x, y in pts]

features = []
def add(kind, id, name, until, geom, note):
    features.append({"kind": kind, "id": id, "name": name, "until": until, "note": note, **geom})

add("pond", "collect", "Collect Pond", 1811, {"rings": [ring([
    (304,402),(311,401.5),(317,404),(322,408.5),(324,414),(323,419.5),(319,423.5),(313,425.2),(306,425),
    (300.5,424),(297,424),(294.5,427),(292.5,431),(289,433.5),(285.5,433),(284.5,430),(286.5,426.5),
    (291,422),(294.5,418.5),(298,414),(300,407)])]},
    "The Fresh Water: the city's drinking pond, fouled by tanneries and breweries, filled 1803–1811. The Tombs rose on the site; Five Points grew on the sinking ground.")
add("pond", "little-collect", "Little Collect", 1805, {"rings": [ring([
    (285,399),(290,404),(291.5,412),(290,417),(285,420.5),(280,419.5),(276.5,414),(278.5,406.5),(282,401.5)])]},
    "The Collect's small southern twin, filled first.")
add("marsh", "lispenard", "Lispenard Meadows", 1810, {"rings": [ring([
    (271.3,316.3),(276.7,309.6),(288.7,307.6),(304.7,305.9),(319.3,304.5),(338,298.3),(351.3,290.9),
    (364.7,284.3),(364.7,362.9),(346,356.3),(324.7,352.3),(311.3,349.6),(284.7,348.3),(275.3,338.9),(270,329.6)])]},
    "Salt meadow draining the Collect to the Hudson, ditched along today's Canal Street and filled by the 1810s.")
add("stream", "minetta", "Minetta Brook", 1825, {"lines": [
    [ll(*p) for p in [(639.3,358.3),(608.6,359.5),(583.1,363.9),(567.7,368.5),(558.8,363.4),(552.4,344.2),(549.8,342.9),
      (537.1,346.8),(519.2,354.4),(506.4,348.6),(491.1,340.9),(475.7,334),(460.4,326.3),(445.1,320.4),(440.3,307.2),
      (433,299.9),(425.7,291.3),(415.9,285.2),(408.6,281.5),(402.4,275.4),(396.3,270.5),(392.7,268.7)]],
    [ll(*p) for p in [(593.3,322.5),(572.8,330.2),(552.4,340.4),(549.8,342.9)]]]},
    "The Village's trout stream, from near Madison Square past Washington Square to the Hudson. Buried in the 1820s; it still runs under the streets.")
add("stream", "stuyvesant-creek", "Stuyvesant's Creek", 1830, {"lines": [
    [ll(*p) for p in [(672.4,389.3),(663.1,402.7),(654.2,411.6),(649.8,424.9),(640.9,440.4),(627.6,453.8),
      (616.4,467.1),(609.8,478.2),(603.1,487.1),(597.6,493.8)]]]},
    "Rose near Gramercy Park and ran down through Stuyvesant's farm to the East River.")
add("marsh", "stuyvesant-meadow", "Stuyvesant Meadows", 1835, {"rings": [
    ring([(498.7,487.1),(518.7,484.9),(534.2,489.3),(552,493.8),(563.1,504.9),(565.3,522.7),(562,540.4),
          (562,549.3),(556.4,562.7),(552,589.3),(485.3,589.3),(485.3,522.7),(494.2,500.4)]),
    ring([(580.9,449.3),(587.6,456),(585.3,473.8),(589.8,487.1),(598.7,493.8),(589.8,513.8),(578.7,527.1),
          (569.8,522.7),(567.6,500.4),(565.3,478.2),(569.8,460.4)])]},
    "Salt meadow where Tompkins Square and Alphabet City now stand, filled as the grid came through in the 1830s.")

# Sunfish Pond: small, placed from the record (Fourth Avenue, 31st–33rd St).
cx, cy, rx, ry = -73.9832, 40.7462, 0.0009, 0.0005
add("pond", "sunfish", "Sunfish Pond", 1839, {"rings": [[[round(cx + rx*math.cos(t), 5), round(cy + ry*math.sin(t), 5)]
    for t in np.linspace(0, 2*math.pi, 13)[:-1]]]},
    "A Murray Hill pond fed by Stuyvesant's creek, filled when Fourth Avenue was graded.")

# Uptown: color-picked marshes and open water from the scan.
def mask_rings(mask, min_px=60, tol_m=12):
    out = []
    for c in measure.find_contours(np.pad(mask, 1).astype(float), 0.5):
        pts = [(x - 1, y - 1) for y, x in c]
        if len(pts) < 6: continue
        poly = Polygon([(p[0], p[1]) for p in pts])
        if poly.area < min_px: continue
        m = Polygon([(ll(*p)[0] * MO, ll(*p)[1] * ML) for p in pts]).buffer(0).simplify(tol_m)
        if m.is_empty or m.geom_type != "Polygon": continue
        out.append([[round(x / MO, 5), round(y / ML, 5)] for x, y in m.exterior.coords[:-1]])
    return out

marsh = np.load(os.path.join(BUILD, "marsh.npy")); water = np.load(os.path.join(BUILD, "water.npy"))
north = np.zeros_like(marsh); north[:, 1150:2000] = True   # uptown, not the inset
up_marsh = morphology.closing(marsh & north, morphology.disk(3))
lab = measure.label(up_marsh)
for i, r in enumerate(sorted(measure.regionprops(lab), key=lambda r: -r.area)):
    if r.area < 120: continue
    rings = mask_rings(lab == r.label)
    if rings:
        add("marsh", f"uptown-marsh-{i}", "Marsh", None, {"rings": rings},
            "Wet ground on Viele's survey of the island's original landscape.")
wlab = measure.label(morphology.closing(water & north, morphology.disk(2)))
for r in measure.regionprops(wlab):
    y0, x0, y1, x1 = r.bbox
    if r.area < 60 or (1195 < x0 < 1300 and y0 < 330):  # skip the Croton reservoir
        continue
    rings = mask_rings(wlab == r.label, min_px=40, tol_m=8)
    if rings:
        add("pond", f"harlem-water-{r.label}", "Harlem Creek", 1880, {"rings": rings},
            "Harlem Creek's lower course through the flats east of the park, filled as Harlem was built up.")

json.dump(features, open(os.path.join(BUILD, "lostLandscape.water.json"), "w"))
for f in features:
    n = len(f.get("rings", f.get("lines", [])))
    print(f["kind"], f["id"], f["until"], n)
