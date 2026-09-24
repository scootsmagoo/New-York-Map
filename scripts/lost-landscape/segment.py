"""Step 1: color-segment the Viele map and fit its placement.

Reads data-raw/overlays/viele_raw.jpg (from scripts/prepare-overlays.mjs) and
writes, into build/: island.npy (the 1865 island), made.npy (Viele's "made
land"), marsh.npy and water.npy (uptown marsh and open water), all on the
2400 px sheet the app displays, plus viele_affine.json (sheet px -> lon/lat,
least squares on the landmarks below, ~45 m error).
"""
import json, os, math
import numpy as np
from PIL import Image, ImageFilter
from skimage import color, measure, morphology
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BUILD = os.path.join(os.path.dirname(__file__), "build")
os.makedirs(BUILD, exist_ok=True)
Image.MAX_IMAGE_PIXELS = None

# Landmarks: sheet px (2400-wide) -> lon/lat. Kept in step with the Viele
# entry in src/data/historicalOverlays.ts.
GCPS = [
    ((1241.6, 306.7), (-73.96665, 40.78119)),  # Croton Receiving Reservoir
    ((1622, 360), (-73.94283, 40.80414)),      # Mount Morris
    ((588.3, 383.3), (-73.9903, 40.7359)),     # Union Square
    ((680.7, 365), (-73.9878, 40.7421)),       # Madison Square
    ((596.7, 451.7), (-73.9837, 40.7337)),     # Stuyvesant Square
    ((521.7, 518.3), (-73.9818, 40.7265)),     # Tompkins Square
    ((493.3, 340), (-73.9973, 40.7308)),       # Washington Square
]
X = np.array([[x, y, 1] for (x, y), _ in GCPS])
L, *_ = np.linalg.lstsq(X, np.array([g[1][0] for g in GCPS]), rcond=None)
T, *_ = np.linalg.lstsq(X, np.array([g[1][1] for g in GCPS]), rcond=None)
json.dump({"lon": list(L), "lat": list(T)}, open(os.path.join(BUILD, "viele_affine.json"), "w"))

raw = Image.open(os.path.join(ROOT, "data-raw/overlays/viele_raw.jpg")).convert("RGB")
W, H = 2400, 708
sheet = raw.resize((W, H), Image.LANCZOS)
smooth = sheet.filter(ImageFilter.MedianFilter(5))
hsv = color.rgb2hsv(np.asarray(smooth).astype(float) / 255)
h, s, v = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]

# Made land: the legend's orange (about RGB 224/181/134).
made = (h > 18) & (h < 42) & (s > 0.30) & (v > 0.6)
made = morphology.closing(made, morphology.disk(3))
made = morphology.remove_small_objects(made, max_size=400)
made = morphology.remove_small_holes(made, max_size=300)

# The island: Viele's greens plus made land, the piece holding the meadows.
green = (h > 55) & (h < 155) & (s > 0.07)
land = morphology.closing(morphology.opening(green | made, morphology.disk(2)), morphology.disk(3))
lab = measure.label(land)
island = ndimage.binary_fill_holes(lab == lab[250, 1100])

# Uptown marsh (saturated mid-green) and open water (teal-blue).
marsh = (h > 95) & (h < 150) & (s > 0.2) & (v < 0.72) & island
marsh = morphology.closing(morphology.opening(marsh, morphology.disk(2)), morphology.disk(4))
marsh = morphology.remove_small_objects(marsh, max_size=150)
hs = color.rgb2hsv(np.asarray(sheet).astype(float) / 255)
inner = ndimage.binary_erosion(island, iterations=6)
water = (hs[..., 0] * 360 > 165) & (hs[..., 0] * 360 < 215) & (hs[..., 1] > 0.28) & (hs[..., 2] > 0.35) & inner
water = morphology.remove_small_objects(water, max_size=6)

for name, m in [("island", island), ("made", made), ("marsh", marsh), ("water", water)]:
    np.save(os.path.join(BUILD, f"{name}.npy"), m)
print("segmented; affine residuals (m):")
for (px, ll) in GCPS:
    lon = L @ [px[0], px[1], 1]; lat = T @ [px[0], px[1], 1]
    print(f"  {math.hypot((lon - ll[0]) * 84310, (lat - ll[1]) * 111320):5.0f}")
