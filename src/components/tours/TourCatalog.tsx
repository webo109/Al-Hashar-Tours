"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CaretDown, Check, MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react/dist/ssr";
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSortOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [sortOpen]);

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
    // Popular: featured journeys first in their featured order, then by popularity.
    if (sort === "popular")
      sorted.sort((a, b) => {
        const fa = a.tour.featured ?? Infinity;
        const fb = b.tour.featured ?? Infinity;
        if (fa !== fb) return fa - fb;
        return b.tour.popularity - a.tour.popularity;
      });
    if (sort === "priceAsc")
      sorted.sort((a, b) => (a.tour.priceFrom ?? Infinity) - (b.tour.priceFrom ?? Infinity));
    if (sort === "priceDesc")
      sorted.sort((a, b) => (b.tour.priceFrom ?? -1) - (a.tour.priceFrom ?? -1));
    if (sort === "durationAsc")
      sorted.sort((a, b) => durationHours(a.tour) - durationHours(b.tour));
    return sorted;
  }, [items, query, kind, region, sort]);

  const activeFilters = (kind !== "all" ? 1 : 0) + (region !== "all" ? 1 : 0);
  const dirty = query !== "" || activeFilters > 0 || sort !== "popular";

  const pill = (active: boolean) =>
    `shrink-0 rounded-pill border px-3.5 py-2 text-[13px] transition-colors duration-300 ${
      active
        ? "border-gold bg-gold text-panel-fg"
        : "border-fg/15 text-fg/80 hover:border-fg/40 hover:text-fg"
    }`;

  const toolButton =
    "inline-flex h-12 items-center gap-2 rounded-pill border px-4 text-[14px] transition-colors duration-300";

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">{t("search")}</span>
          <MagnifyingGlass
            size={18}
            weight="fill"
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-fg/50"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="h-12 w-full rounded-pill border border-fg/15 bg-surface-2 ps-11 pe-4 text-[15px] text-fg placeholder:text-fg/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/35"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters"
            className={`${toolButton} ${
              filtersOpen || activeFilters > 0
                ? "border-gold/60 bg-surface-2 text-fg"
                : "border-fg/15 bg-surface-2 text-fg/85 hover:border-fg/40"
            }`}
          >
            <SlidersHorizontal size={18} weight="fill" className="text-gold" />
            {t("filters")}
            {activeFilters > 0 ? (
              <span className="font-latin flex h-5 min-w-5 items-center justify-center rounded-pill bg-gold px-1.5 text-[11px] font-semibold text-panel-fg">
                {activeFilters}
              </span>
            ) : null}
          </button>

          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              className={`${toolButton} border-fg/15 bg-surface-2 text-fg hover:border-fg/40`}
            >
              <span className="text-[12px] uppercase tracking-[0.12em] text-fg/55">{t("sort")}</span>
              <span>{t(`sorts.${sort}`)}</span>
              <CaretDown size={14} className={`transition-transform duration-300 ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen ? (
              <ul
                role="listbox"
                aria-label={t("sort")}
                className="absolute end-0 top-[calc(100%+8px)] z-20 min-w-[240px] overflow-hidden rounded-panel border border-fg/15 bg-surface-2 p-1.5 shadow-lift"
              >
                {SORTS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={sort === s}
                      onClick={() => {
                        setSort(s);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-input px-3 py-2.5 text-start text-[14px] transition-colors ${
                        sort === s ? "bg-gold/15 text-accent-text" : "text-fg/85 hover:bg-fg/8 hover:text-fg"
                      }`}
                    >
                      {t(`sorts.${s}`)}
                      {sort === s ? <Check size={14} weight="bold" /> : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {filtersOpen ? (
        <div
          id="catalog-filters"
          className="mt-3 flex flex-col gap-4 rounded-panel border border-fg/10 bg-surface-2/70 px-5 py-4"
        >
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("kind")}>
            <span className="me-1 w-16 shrink-0 text-[13px] text-fg/55">{t("kind")}</span>
            {KINDS.map((k) => (
              <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} className={pill(kind === k)}>
                {t(`kinds.${k}`)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("region")}>
            <span className="me-1 w-16 shrink-0 text-[13px] text-fg/55">{t("region")}</span>
            {REGIONS.map((r) => (
              <button key={r} type="button" onClick={() => setRegion(r)} aria-pressed={region === r} className={pill(region === r)}>
                {regions(r)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between pt-7 pb-5 text-[14px] text-fg/70">
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
            className="text-accent-text underline-offset-4 hover:underline"
          >
            {t("clear")}
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <p className="rounded-panel border border-fg/10 px-6 py-14 text-center text-fg/75">{t("empty")}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-12">
          {results.map(({ tour, content }, i) => {
            const featured = i < 2 && tour.featured !== null;
            return (
              <li key={tour.slug} className={`flex ${featured ? "xl:col-span-6" : "xl:col-span-4"}`}>
                <TourCard tour={tour} content={content} featured={featured} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
