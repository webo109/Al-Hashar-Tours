import { approxRates } from "@/data/tours";

function intlLocale(locale: string) {
  return locale === "ar" ? "ar-OM-u-nu-latn" : "en-OM";
}

export function formatNumber(
  locale: string,
  value: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function formatOmr(locale: string, value: number, currency: string) {
  const n = formatNumber(locale, value);
  return locale === "ar" ? `${n} ${currency}` : `${currency} ${n}`;
}

export function approxFrom(locale: string, omr: number) {
  return {
    usd: formatNumber(locale, Math.round(omr * approxRates.USD)),
    eur: formatNumber(locale, Math.round(omr * approxRates.EUR)),
    gbp: formatNumber(locale, Math.round(omr * approxRates.GBP)),
  };
}

export function formatDate(
  locale: string,
  iso: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
) {
  return new Intl.DateTimeFormat(intlLocale(locale), options).format(
    new Date(`${iso}T00:00:00`),
  );
}

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
