// Date-only arithmetic uses local calendar dates, never UTC conversion.
export type CalendarMode = "date" | "month";

export function calendarISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function calendarDate(iso: string) {
  return new Date(`${iso.length === 7 ? `${iso}-01` : iso}T12:00:00`);
}

export function calendarCells(year: number, month: number) {
  const offset = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: 42 }, (_, i) => i < offset || i >= offset + count
    ? null : calendarISO(new Date(year, month, i - offset + 1)));
}

export function shiftCalendarDate(iso: string, days: number) {
  const date = calendarDate(iso);
  date.setDate(date.getDate() + days);
  return calendarISO(date);
}

export function shiftCalendarMonth(iso: string, months: number) {
  const date = calendarDate(iso);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  date.setDate(Math.min(day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()));
  return calendarISO(date);
}

export function calendarInRange(iso: string, min?: string, max?: string) {
  const length = iso.length;
  return (!min || iso >= min.slice(0, length)) && (!max || iso <= max.slice(0, length));
}

export function clampCalendarDate(iso: string, min?: string, max?: string) {
  return min && iso < min ? min : max && iso > max ? max : iso;
}

export function calendarLocale(locale: string) {
  // Dates stored by the forms are Gregorian in both languages.
  return locale === "ar" ? "ar-OM-u-ca-gregory-nu-latn" : "en-GB-u-ca-gregory";
}

export function calendarLabel(value: string, locale: string, mode: CalendarMode = "date") {
  return new Intl.DateTimeFormat(calendarLocale(locale), {
    day: mode === "date" ? "numeric" : undefined, month: "short", year: "numeric",
  }).format(calendarDate(value));
}
