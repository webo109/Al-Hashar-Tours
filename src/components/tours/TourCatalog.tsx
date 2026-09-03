"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import type { RegionKey, TourBase, TourContent, TourKind } from "@/data/tours";
import { TourCard } from "./TourCard";

type Item = { tour: TourBase; content: TourContent };
type Kind = TourKind | "all";
type Region = RegionKey | "all";
type Sort = "popular" | "priceAsc" | "priceDesc" | "durationAsc";

const KINDS: Kind[] = ["all", "package", "day", "sea"];
const REGIONS: Region[] = ["all", "muscat", "dakhiliyah", "sharqiyah", "batinah", "acrossOman"];
const SORTS: Sort[] = ["popular", "priceAsc", "priceDesc", "durationAsc"];

function durationHours(tour: TourBase) {
  if (tour.nights) return tour.nights * 24;
  return tour.hours ?? 8;
}

export function TourCatalog({ items }: { items: Item[] }) {
  const t = useTranslations("Tours");
  const regions = useTranslations("Regions");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind>("all");
  const [region, setRegion] = useState<Region>("all");
  const [sort, setSort] = useState<Sort>("popular");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter(({ tour, content }) => {
      if (kind !== "all" && tour.kind !== kind) return false;
      if (region !== "all" && !tour.regions.includes(region)) return false;
      if (!q) return true;
      const hay = [content.name, content.tagline, content.summary, ...content.highlights]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    const sorted = [...list];
    if (sort === "popular") sorted.sort((a, b) => b.tour.popularity - a.tour.popularity);
    if (sort === "priceAsc")
      sorted.sort((a, b) => (a.tour.priceFrom ?? Infinity) - (b.tour.priceFrom ?? Infinity));
    if (sort === "priceDesc")
      sorted.sort((a, b) => (b.tour.priceFrom ?? -1) - (a.tour.priceFrom ?? -1));
    if (sort === "durationAsc")
      sorted.sort((a, b) => durationHours(a.tour) - durationHours(b.tour));
    return sorted;
  }, [items, query, kind, region, sort]);

  const dirty = query !== "" || kind !== "all" || region !== "all" || sort !== "popular";

  const pill = (active: boolean) =>
    `shrink-0 rounded-pill border px-3.5 py-2 text-[13px] transition-colors duration-300 ${
      active
        ? "border-gold bg-gold text-ink"
        : "border-cream/15 text-cream/80 hover:border-cream/40 hover:text-cream"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-cream/10 pb-6">
        <label className="relative block">
          <span className="sr-only">{t("search")}</span>
          <MagnifyingGlass
            size={18}
            weight="light"
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-cream/50"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="h-12 w-full rounded-pill border border-cream/15 bg-midnight-800 ps-11 pe-4 text-[15px] text-cream placeholder:text-cream/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/35"
          />
        </label>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 overflow-x-auto pb-1" role="group" aria-label={t("kind")}>
            <span className="shrink-0 text-[13px] text-cream/55">{t("kind")}</span>
            {KINDS.map((k) => (
              <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} className={pill(kind === k)}>
                {t(`kinds.${k}`)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-1" role="group" aria-label={t("region")}>
            <span className="shrink-0 text-[13px] text-cream/55">{t("region")}</span>
            {REGIONS.map((r) => (
              <button key={r} type="button" onClick={() => setRegion(r)} aria-pressed={region === r} className={pill(region === r)}>
                {regions(r)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-1" role="group" aria-label={t("sort")}>
            <span className="shrink-0 text-[13px] text-cream/55">{t("sort")}</span>
            {SORTS.map((s) => (
              <button key={s} type="button" onClick={() => setSort(s)} aria-pressed={sort === s} className={pill(sort === s)}>
                {t(`sorts.${s}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 text-[14px] text-cream/70">
        <span aria-live="polite">{t("count", { count: results.length })}</span>
        {dirty ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setKind("all");
              setRegion("all");
              setSort("popular");
            }}
            className="text-gold-300 underline-offset-4 hover:underline"
          >
            {t("clear")}
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <p className="rounded-panel border border-cream/10 px-6 py-14 text-center text-cream/75">{t("empty")}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          {results.map(({ tour, content }, i) => {
            const wide = i < 2;
            return (
              <li key={tour.slug} className={wide ? "md:col-span-2 lg:col-span-3" : "lg:col-span-2"}>
                <TourCard tour={tour} content={content} variant={wide ? "wide" : "tall"} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
