// Smoke-test battery: fetches every route and records the real HTTP status.
// Usage: node scripts/smoke.mjs [baseUrl]   (default http://localhost:3001)
import { readFile, writeFile } from "node:fs/promises";

const base = (process.argv[2] ?? "http://localhost:3001").replace(/\/$/, "");
const toursSource = await readFile(new URL("../src/data/tours.ts", import.meta.url), "utf8");
const slugs = [...toursSource.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const priced = [...toursSource.matchAll(/slug:\s*"([^"]+)"[\s\S]*?priceFrom:\s*(null|\d+)/g)]
  .filter((m) => m[2] !== "null")
  .map((m) => m[1]);
const services = ["flights", "hotels", "holidays", "visa", "insurance", "cargo"];

const routes = [
  { path: "/", cls: "Root redirect", expect: [307, 308] },
  { path: "/en", cls: "Home", expect: [200] },
  { path: "/ar", cls: "Home", expect: [200] },
  { path: "/en/tours", cls: "Catalog", expect: [200] },
  { path: "/ar/tours", cls: "Catalog", expect: [200] },
  ...slugs.flatMap((s) => [
    { path: `/en/tours/${s}`, cls: "Tour pages", expect: [200] },
    { path: `/ar/tours/${s}`, cls: "Tour pages", expect: [200] },
  ]),
  ...priced.flatMap((s) => [
    { path: `/en/book/${s}`, cls: "Booking wizard", expect: [200] },
    { path: `/ar/book/${s}`, cls: "Booking wizard", expect: [200] },
  ]),
  { path: "/en/bookings/lookup", cls: "Lookup", expect: [200] },
  { path: "/ar/bookings/lookup", cls: "Lookup", expect: [200] },
  { path: "/en/umrah", cls: "Umrah", expect: [200] },
  { path: "/ar/umrah", cls: "Umrah", expect: [200] },
  ...services.flatMap((s) => [
    { path: `/en/services/${s}`, cls: "Service pages", expect: [200] },
    { path: `/ar/services/${s}`, cls: "Service pages", expect: [200] },
  ]),
  { path: "/en/contact", cls: "Contact", expect: [200] },
  { path: "/ar/contact", cls: "Contact", expect: [200] },
  { path: "/en/does-not-exist", cls: "404 page", expect: [404] },
  { path: "/en/tours/not-a-tour", cls: "404 page", expect: [404] },
  { path: "/test-report", cls: "Internal", expect: [200] },
  { path: "/admin-preview", cls: "Internal", expect: [200] },
];

const results = [];
for (const route of routes) {
  const started = performance.now();
  let status = 0;
  let location = null;
  try {
    const res = await fetch(base + route.path, { redirect: "manual" });
    status = res.status;
    location = res.headers.get("location");
    await res.arrayBuffer();
  } catch (err) {
    status = -1;
    location = err.message;
  }
  const ms = Math.round(performance.now() - started);
  const pass = route.expect.includes(status);
  results.push({ path: route.path, cls: route.cls, status, ms, pass, location });
  console.log(`${pass ? "ok  " : "FAIL"} ${status} ${String(ms).padStart(5)}ms ${route.path}`);
}

const out = {
  base,
  generatedAt: new Date().toISOString(),
  total: results.length,
  passed: results.filter((r) => r.pass).length,
  results,
};
await writeFile(new URL("../src/data/smoke.generated.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(`\n${out.passed}/${out.total} passed against ${base}`);
process.exit(out.passed === out.total ? 0 : 1);
