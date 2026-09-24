"""Step 4: merge build/ outputs into src/data/geo/lostLandscape.json for the app."""
import json, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BUILD = os.path.join(os.path.dirname(__file__), "build")
fill = json.load(open(os.path.join(BUILD, "lostLandscape.fill.json")))
water = json.load(open(os.path.join(BUILD, "lostLandscape.water.json")))
out = {
    "source": "Egbert L. Viele, Sanitary & Topographical Map of the City and Island of New York (1865); see scripts/lost-landscape/README.md",
    "shoreline1609": fill["shoreline1609"],
    "fill": fill["fill"],
    "water": water,
}
dest = os.path.join(ROOT, "src/data/geo/lostLandscape.json")
json.dump(out, open(dest, "w"), separators=(",", ":"))
print("wrote", dest, os.path.getsize(dest), "bytes")
