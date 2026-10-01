"""
The 1845 Coast Survey chart as a map overlay for the outer boroughs.

The overlays in src/data/historicalOverlays.ts are placed in the browser by
an affine fit, which suits sheets of one island. This chart spans the whole
harbor and needs the second-order fit its landmarks give (scripts/
lost-landscape-outer/hassler-1845.json; ~57 m rms, against ~140 m affine),
so it is warped here instead, into a north-up image with plain lon/lat
bounds.

Input: data-raw/coast-survey/hassler-loc-1845.jpg (see
scripts/lost-landscape-outer/README.md for the download).
Output: public/overlays/coast-survey-1845.webp; the bounds it prints go in
historicalOverlays.ts.
Run: .venv/bin/python scripts/prepare-coast-survey-overlay.py
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data-raw/coast-survey/hassler-loc-1845.jpg"
OUT = ROOT / "public/overlays/coast-survey-1845.webp"
# The chart stops at its top border, across Queens: fade the top this many
# pixels (~1 km) into transparency rather than ending in a hard line.
FADE = 120
TRACE = json.loads((ROOT / "scripts/lost-landscape-outer/hassler-1845.json").read_text())

# Brooklyn, southern Queens, and Staten Island, up to just inside the
# chart's top border (which runs a little off the parallel).
WEST, EAST, SOUTH, NORTH = -74.26, -73.72, 40.495, 40.740
WIDTH = 3000
M_LON, M_LAT = 84310, 111320

lm = TRACE["landmarks"]
px = np.array([l["px"] for l in lm], float)
ll = np.array([l["lonlat"] for l in lm])
L0 = ll.mean(0)


def design(x, y):
    return np.stack([np.ones_like(x), x, y, x * x, x * y, y * y], -1)


# lon/lat → chart pixel: the second-order fit, solved in that direction.
A = design((ll[:, 0] - L0[0]) * 100, (ll[:, 1] - L0[1]) * 100)
KX = np.linalg.lstsq(A, px[:, 0], rcond=None)[0]
KY = np.linalg.lstsq(A, px[:, 1], rcond=None)[0]
res = np.hypot(A @ KX - px[:, 0], A @ KY - px[:, 1])
print("landmarks", len(lm), "rms", round(float(np.sqrt((res ** 2).mean())), 1), "chart px")

height = round(WIDTH * (NORTH - SOUTH) * M_LAT / ((EAST - WEST) * M_LON))
lon = WEST + (np.arange(WIDTH) + 0.5) / WIDTH * (EAST - WEST)
lat = NORTH - (np.arange(height) + 0.5) / height * (NORTH - SOUTH)
LON, LAT = np.meshgrid(lon, lat)
G = design((LON - L0[0]) * 100, (LAT - L0[1]) * 100)
cx, cy = G @ KX, G @ KY

Image.MAX_IMAGE_PIXELS = None
chart = np.asarray(Image.open(SRC).convert("RGB"), float)
# The output is ~2.5× coarser than the chart: smooth first so engraving
# doesn't alias into moiré.
chart = ndimage.gaussian_filter(chart, sigma=(1.0, 1.0, 0))
out = np.stack(
    [ndimage.map_coordinates(chart[:, :, c], [cy, cx], order=1, mode="nearest") for c in range(3)], -1
)
alpha = np.full(out.shape[:2], 255.0)
ramp = np.clip((np.arange(height) + 0.5) / FADE, 0, 1)
alpha *= (ramp * ramp * (3 - 2 * ramp))[:, None]
rgba = np.dstack([out.clip(0, 255), alpha]).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(OUT, quality=70, method=6)
print(f"{OUT.relative_to(ROOT)}: {WIDTH}×{height}, {OUT.stat().st_size // 1024} KB")
print(f"bounds: west {WEST}, south {SOUTH}, east {EAST}, north {NORTH}")
