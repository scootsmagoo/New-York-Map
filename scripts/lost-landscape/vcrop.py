"""Annotated Viele crop around a lon/lat, with a pixel grid (2400-space) for tracing."""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BUILD = os.path.join(os.path.dirname(__file__), "build")
aff = json.load(open(os.path.join(BUILD, "viele_affine.json"))); L, T = aff["lon"], aff["lat"]
A = np.array([[L[0], L[1]], [T[0], T[1]]]); b = np.array([L[2], T[2]])
def to_px(lon, lat): return np.linalg.solve(A, np.array([lon, lat]) - b)
raw = Image.open(os.path.join(ROOT, "data-raw/overlays/viele_raw.jpg")).convert("RGB")
S = raw.size[0] / 2400
a1, a2, half, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
if a1.startswith("px"):
    cx, cy = float(a1[2:]), float(a2)
else:
    cx, cy = to_px(float(a1), float(a2))
x0, y0, x1, y1 = cx - half, cy - half, cx + half, cy + half
crop = raw.crop((int(x0 * S), int(y0 * S), int(x1 * S), int(y1 * S)))
scale = 900 / crop.size[0]
crop = crop.resize((900, int(crop.size[1] * scale)))
d = ImageDraw.Draw(crop)
k = 900 / (x1 - x0)
step = 10 if half <= 60 else 20
for gx in range(int(x0 // step * step), int(x1) + 1, step):
    X = (gx - x0) * k
    d.line([(X, 0), (X, crop.size[1])], fill=(255, 0, 0) if gx % (step * 5) == 0 else (255, 150, 150), width=1)
    if gx % (step * 5) == 0: d.text((X + 2, 2), str(gx), fill=(200, 0, 0))
for gy in range(int(y0 // step * step), int(y1) + 1, step):
    Y = (gy - y0) * k
    d.line([(0, Y), (900, Y)], fill=(0, 0, 255) if gy % (step * 5) == 0 else (150, 150, 255), width=1)
    if gy % (step * 5) == 0: d.text((2, Y + 2), str(gy), fill=(0, 0, 200))
crop.save(out)
print("center px", round(cx, 1), round(cy, 1))
