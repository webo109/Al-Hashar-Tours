import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { airportLabel, indexAirports, normalizeAirportText, searchAirports } from "../src/lib/airport-search.ts";

const raw = JSON.parse(await readFile(new URL("../public/airports.json", import.meta.url), "utf8"));
const airports = indexAirports(raw);
test("directory contains unique IATA codes and Muscat", () => {
  assert.ok(airports.length > 1000);
  assert.equal(new Set(airports.map((a) => a.code)).size, airports.length);
  assert.ok(airports.some((a) => a.code === "MCT"));
});
test("empty fields show suggested airports, starting with Muscat", () => {
  assert.equal(searchAirports(airports, "")[0].code, "MCT");
  assert.equal(searchAirports(airports, "  ").length, 8);
});
test("a single letter finds matching cities", () => {
  assert.ok(searchAirports(airports, "d").some((a) => a.code === "DXB"));
});
test("exact airport code ranks first, regardless of case", () => {
  assert.equal(searchAirports(airports, "dxb")[0].code, "DXB");
  assert.equal(searchAirports(airports, "sll")[0].code, "SLL");
});
test("city, airport name, and multiple words work", () => {
  assert.equal(searchAirports(airports, "Dubai")[0].code, "DXB");
  assert.equal(searchAirports(airports, "Heathrow")[0].code, "LHR");
  assert.equal(searchAirports(airports, "muscat oman")[0].code, "MCT");
});
test("Arabic city names and country names work", () => {
  assert.equal(searchAirports(airports, "مسقط")[0].code, "MCT");
  assert.equal(searchAirports(airports, "دبي")[0].code, "DXB");
  assert.ok(searchAirports(airports, "عُمان").some((a) => a.code === "MCT"));
  assert.equal(normalizeAirportText("أبوظبي"), normalizeAirportText("ابوظبي"));
});
test("unmatched queries return an empty list", () => {
  assert.deepEqual(searchAirports(airports, "zzzznoairport"), []);
});
test("selection labels retain the unambiguous airport code", () => {
  const muscat = airports.find((a) => a.code === "MCT");
  assert.equal(airportLabel(muscat, "en"), "Muscat/Seeb (MCT)");
  assert.equal(airportLabel(muscat, "ar"), "مسقط (MCT)");
});
