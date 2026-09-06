import { test } from "node:test";
import assert from "node:assert/strict";
import { calendarCells, calendarDate, calendarInRange, calendarISO, calendarLabel, clampCalendarDate, shiftCalendarDate, shiftCalendarMonth } from "../src/lib/calendar.ts";

test("six-week grids retain weekday alignment", () => {
  const cells = calendarCells(2026, 8);
  assert.equal(cells.length, 42);
  assert.deepEqual(cells.slice(0, 3), [null, null, "2026-09-01"]);
  assert.equal(cells.filter(Boolean).length, 30);
});
test("leap years and non-leap February", () => {
  assert.equal(calendarCells(2028, 1).filter(Boolean).length, 29);
  assert.equal(calendarCells(2027, 1).filter(Boolean).length, 28);
});
test("day arithmetic crosses month and year boundaries", () => {
  assert.equal(shiftCalendarDate("2026-12-31", 1), "2027-01-01");
  assert.equal(shiftCalendarDate("2028-03-01", -1), "2028-02-29");
});
test("month navigation clamps end-of-month dates", () => {
  assert.equal(shiftCalendarMonth("2026-01-31", 1), "2026-02-28");
  assert.equal(shiftCalendarMonth("2028-01-31", 1), "2028-02-29");
  assert.equal(shiftCalendarMonth("2026-12-15", 1), "2027-01-15");
});
test("return and checkout date bounds stay inclusive", () => {
  assert.equal(calendarInRange("2026-09-03", "2026-09-04"), false);
  assert.equal(calendarInRange("2026-09-04", "2026-09-04"), true);
  assert.equal(calendarInRange("2026-09-06", undefined, "2026-09-05"), false);
});
test("month constraints compare whole months", () => {
  assert.equal(calendarInRange("2026-09", "2026-09-15"), true);
  assert.equal(calendarInRange("2026-08", "2026-09-15"), false);
});
test("focus stays inside allowed range", () => {
  assert.equal(clampCalendarDate("2026-09-01", "2026-09-04"), "2026-09-04");
  assert.equal(clampCalendarDate("2026-10-01", undefined, "2026-09-30"), "2026-09-30");
});
test("date-only values round trip without UTC conversion", () => {
  assert.equal(calendarISO(calendarDate("2026-09-04")), "2026-09-04");
  assert.equal(calendarISO(calendarDate("2026-09")), "2026-09-01");
});
test("both locales format Gregorian dates and month-only values", () => {
  assert.match(calendarLabel("2026-09-04", "en"), /2026/);
  assert.match(calendarLabel("2026-09-04", "ar"), /2026/);
  assert.equal(calendarLabel("2026-09", "en", "month"), "Sept 2026");
});
