import type { TourContent } from "./tours";
import { toursEn } from "./tours.en";
import { toursAr } from "./tours.ar";

export function tourContent(locale: string): Record<string, TourContent> {
  return locale === "ar" ? toursAr : toursEn;
}

export function tourText(locale: string, slug: string): TourContent | undefined {
  return tourContent(locale)[slug];
}
