// Refresh the local, public-domain OurAirports snapshot used by flight inputs.
// Run manually with: node scripts/update-airports.mjs
import { writeFile } from "node:fs/promises";

const source = "https://davidmegginson.github.io/ourairports-data/airports.csv";
const response = await fetch(source);
if (!response.ok) throw new Error(`Airport download failed: ${response.status}`);
const csv = await response.text();

// CSV supports quoted commas, escaped quotes, and embedded newlines.
const rows = [];
let row = [], field = "", quoted = false;
for (let i = 0; i < csv.length; i++) {
  const char = csv[i];
  if (char === '"') {
    if (quoted && csv[i + 1] === '"') { field += '"'; i++; }
    else quoted = !quoted;
  } else if (char === "," && !quoted) {
    row.push(field); field = "";
  } else if (char === "\n" && !quoted) {
    row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = "";
  } else field += char;
}
if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
const headers = rows.shift();
const records = rows.map((values) => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? ""])));
const seen = new Set();
const airports = records
  .filter((a) => a.scheduled_service === "yes" && /^[A-Z]{3}$/.test(a.iata_code) && a.type !== "closed")
  .sort((a, b) => Number(b.type === "large_airport") - Number(a.type === "large_airport") || a.name.localeCompare(b.name))
  .filter((a) => { if (seen.has(a.iata_code)) return false; seen.add(a.iata_code); return true; })
  .map((a) => ({ code: a.iata_code, city: a.municipality || a.name, name: a.name, country: a.iso_country }));
if (airports.length < 1000 || !airports.some((a) => a.code === "MCT")) throw new Error("Unexpected airport dataset; no files updated.");
await writeFile(new URL("../public/airports.json", import.meta.url), JSON.stringify(airports) + "\n");
await writeFile(new URL("../public/airports-source.json", import.meta.url), JSON.stringify({
  source, license: "Public domain", terms: "https://ourairports.com/data/", generatedAt: new Date().toISOString(),
  count: airports.length, filter: "Airports marked scheduled_service=yes with a three-letter IATA code. Not a live route or availability feed.",
}, null, 2) + "\n");
console.log(`Saved ${airports.length} airports.`);
