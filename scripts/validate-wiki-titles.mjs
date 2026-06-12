/**
 * Checks every wikiTitle in the data files against the Wikipedia REST API so
 * broken article titles are caught at build time, not by users.
 *
 * Run: npm run validate:wiki
 */
import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve("src/data");
const files = [
  ...fs
    .readdirSync(path.join(dataDir, "entries"))
    .filter((f) => f.endsWith(".ts"))
    .map((f) => path.join(dataDir, "entries", f)),
  path.join(dataDir, "eras.ts"),
];

const titles = new Set();
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/wikiTitle:\s*"([^"]+)"/g)) {
    titles.add(m[1]);
  }
}

console.log(`Checking ${titles.size} unique Wikipedia titles...`);

const notFound = []; // 404 / disambiguation — real data bugs
const unverified = []; // 429 / network — couldn't check, not necessarily wrong
const redirects = [];
const queue = [...titles];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function check(title, attempt = 0) {
  const slug = encodeURIComponent(title.replace(/ /g, "_"));
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`,
    { headers: { "User-Agent": "new-york-map-validator/1.0 (personal project)" } }
  );
  if (res.status === 429 && attempt < 5) {
    await sleep(3000 * (attempt + 1));
    return check(title, attempt + 1);
  }
  if (res.status === 429) {
    unverified.push({ title, status: 429 });
    return;
  }
  if (!res.ok) {
    notFound.push({ title, status: res.status });
    return;
  }
  const json = await res.json();
  if (json.type === "disambiguation") {
    notFound.push({ title, status: "disambiguation" });
  } else if (json.title && json.title !== title) {
    redirects.push({ from: title, to: json.title });
  }
}

for (const title of queue) {
  try {
    await check(title);
  } catch (err) {
    unverified.push({ title, status: String(err) });
  }
  await sleep(250);
}

if (redirects.length) {
  console.log("\nRedirected (fine, but canonical title differs):");
  for (const r of redirects) console.log(`  "${r.from}" -> "${r.to}"`);
}

if (unverified.length) {
  console.warn("\nUnverified (rate-limited or network — rerun later):");
  for (const f of unverified) console.warn(`  [${f.status}] ${f.title}`);
}

if (notFound.length) {
  console.error("\nFAILURES (article missing or ambiguous):");
  for (const f of notFound) console.error(`  [${f.status}] ${f.title}`);
  process.exit(1);
}

console.log(
  `\nDone: ${titles.size - unverified.length} verified, ${unverified.length} unverified, ${redirects.length} redirects, 0 missing.`
);
