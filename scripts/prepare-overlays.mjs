/**
 * Downloads and compresses the three historical map overlays.
 *
 * Sources (public domain via Wikimedia Commons):
 *   - Castello Plan redraw (Adams & Stokes, 1916) — north rotated upright
 *   - Bernard Ratzer, Plan of the City of New York (1776 state)
 *   - Egbert Viele, Topographical Map of the City of New York (1865)
 *
 * Outputs: public/overlays/{castello,ratzer,viele}.jpg
 *
 * Run: node scripts/prepare-overlays.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const SOURCES = [
  {
    id: "castello",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Castelloplan.jpg",
    rotate: 270, // original has north to the right
    maxPx: 1800,
  },
  {
    id: "ratzer",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/58/Plan_of_the_city_of_New_York_by_Ratzer%2C_1776.jpg",
    rotate: 0,
    maxPx: 2000,
  },
  {
    id: "viele",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Viele_Map_1865.jpg",
    rotate: 0,
    maxPx: 2400,
  },
];

const rawDir = path.resolve("data-raw/overlays");
const outDir = path.resolve("public/overlays");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

function hasSips() {
  try {
    execSync("which sips", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function download(url, dest) {
  if (fs.existsSync(dest)) return;
  console.log(`  downloading…`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

function processImage(src, dest, { rotate, maxPx }) {
  if (!hasSips()) {
    console.warn("  sips not found — copying without resize (macOS only tool)");
    fs.copyFileSync(src, dest);
    return;
  }

  const tmp = `${dest}.work.jpg`;
  fs.copyFileSync(src, tmp);

  if (rotate) {
    execSync(`sips -r ${rotate} "${tmp}" --out "${tmp}"`, { stdio: "ignore" });
  }

  const dimOut = execSync(`sips -g pixelWidth -g pixelHeight "${tmp}"`, {
    encoding: "utf8",
  });
  const w = Number(dimOut.match(/pixelWidth: (\d+)/)?.[1] ?? 0);
  const h = Number(dimOut.match(/pixelHeight: (\d+)/)?.[1] ?? 0);
  const scale = Math.min(1, maxPx / Math.max(w, h));
  if (scale < 1) {
    const nw = Math.round(w * scale);
    const nh = Math.round(h * scale);
    execSync(`sips -z ${nh} ${nw} "${tmp}" --out "${tmp}"`, { stdio: "ignore" });
  }

  // JPEG re-encode for smaller bundles.
  execSync(
    `sips -s format jpeg -s formatOptions 78 "${tmp}" --out "${dest}"`,
    { stdio: "ignore" }
  );
  fs.unlinkSync(tmp);
}

for (const src of SOURCES) {
  const raw = path.join(rawDir, `${src.id}_raw.jpg`);
  const out = path.join(outDir, `${src.id}.jpg`);
  console.log(src.id);
  await download(src.url, raw);
  processImage(raw, out, src);
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`  → ${path.relative(process.cwd(), out)} (${kb} KB)`);
}

console.log("Done.");
