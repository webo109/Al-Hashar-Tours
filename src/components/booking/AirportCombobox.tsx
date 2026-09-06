"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CaretDown, AirplaneTilt } from "@phosphor-icons/react";
import { airportLabel, indexAirports, searchAirports, type Airport, type AirportOption } from "@/lib/airport-search";

// Both inputs share one download, requested only when a visitor opens a field.
let directory: Promise<AirportOption[]> | undefined;
function loadAirports() {
  directory ??= fetch("/airports.json").then(async (response) => {
    if (!response.ok) throw new Error("Airport directory unavailable");
    const data: Airport[] = await response.json();
    if (!Array.isArray(data) || !data.length) throw new Error("Airport directory empty");
    return indexAirports(data);
  }).catch((error) => { directory = undefined; throw error; });
  return directory;
}

type Props = {
  id: string; name: string; label: string; value: string; placeholder?: string;
  error?: string; onChange: (value: string) => void;
};

export function AirportCombobox({ id, name, label, value, placeholder, error, onChange }: Props) {
  const t = useTranslations("Booking.airports");
  const locale = useLocale();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [airports, setAirports] = useState<AirportOption[]>([]);
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const options = useMemo(() => searchAirports(airports, query), [airports, query]);
  const activeOption = open ? options[active] : undefined;
  const listId = `${id}-options`;

  function placeMenu() {
    const rect = input.current?.getBoundingClientRect();
    if (!rect) return;
    const viewport = window.visualViewport;
    const top = viewport?.offsetTop ?? 0;
    const below = top + (viewport?.height ?? window.innerHeight) - rect.bottom;
    setAbove(below < 290 && rect.top - top > below);
  }

  function show() {
    placeMenu();
    setQuery(/\([A-Z]{3}\)$/.test(value) ? "" : value);
    setActive(-1);
    setOpen(true);
    if (status === "ready" || status === "loading") return;
    setStatus("loading");
    void loadAirports().then((data) => { setAirports(data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }

  function select(airport: AirportOption) {
    onChange(airportLabel(airport, locale));
    setOpen(false);
    setActive(-1);
    input.current?.focus({ preventScroll: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { show(); return; }
      if (options.length) setActive((i) => event.key === "ArrowDown" ? (i + 1) % options.length : (i <= 0 ? options.length - 1 : i - 1));
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      if (activeOption) select(activeOption);
      else if (query.trim() && options.length) select(options[0]);
      else setOpen(false);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    } else if (event.key === "Tab") setOpen(false);
  }

  useEffect(() => {
    const container = list.current;
    const option = container?.children[active] as HTMLElement | undefined;
    if (!container || !option) return;
    if (option.offsetTop < container.scrollTop) container.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > container.scrollTop + container.clientHeight)
      container.scrollTop = option.offsetTop + option.offsetHeight - container.clientHeight;
  }, [active]);

  useEffect(() => {
    if (!open) return;
    // Follow the available space when a phone keyboard opens or the page moves.
    window.addEventListener("scroll", placeMenu, true);
    window.addEventListener("resize", placeMenu);
    window.visualViewport?.addEventListener("resize", placeMenu);
    return () => {
      window.removeEventListener("scroll", placeMenu, true);
      window.removeEventListener("resize", placeMenu);
      window.visualViewport?.removeEventListener("resize", placeMenu);
    };
  }, [open]);

  const message = status === "loading" ? t("loading") : status === "error" ? t("unavailable")
    : options.length ? t("results", { count: options.length }) : t("empty");

  return (
    <div className="relative min-w-0" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <input
        ref={input} id={id} name={name} type="text" role="combobox"
        autoComplete="off" autoCapitalize="none" spellCheck={false}
        aria-autocomplete="list" aria-expanded={open} aria-controls={open ? listId : undefined}
        aria-activedescendant={activeOption ? `${listId}-${activeOption.code}` : undefined}
        aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}
        value={value} placeholder={placeholder}
        onFocus={(event) => { show(); event.currentTarget.select(); }}
        onClick={() => { if (!open) show(); }}
        onChange={(event) => { onChange(event.target.value); setQuery(event.target.value); setActive(-1); setOpen(true); }}
        onKeyDown={onKeyDown}
        className={`h-11 w-full rounded-input border bg-white/70 ps-3 pe-10 text-[15px] text-panel-fg placeholder:text-panel-muted/60 focus:outline-none focus:ring-2 focus:ring-gold/45 ${error ? "border-[#b0361f]" : "border-panel-fg/15 focus:border-gold"}`}
      />
      <button type="button" tabIndex={-1} aria-label={t("toggle", { field: label })}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => { if (open) setOpen(false); else { input.current?.focus({ preventScroll: true }); show(); } }}
        className="absolute end-0 top-0 flex h-11 w-10 items-center justify-center text-panel-muted">
        <CaretDown size={16} aria-hidden className={open ? "rotate-180" : ""} />
      </button>
      {open && (
        <div className={`absolute inset-x-0 z-30 overflow-hidden rounded-input border border-panel-fg/15 bg-panel shadow-lift ${above ? "bottom-full mb-2" : "top-full mt-2"}`}>
          <p className="border-b border-panel-fg/10 px-3 py-2 text-[11px] font-medium text-panel-muted">{query.trim() ? t("matches") : t("suggested")}</p>
          <ul ref={list} id={listId} role="listbox" aria-label={label} aria-busy={status === "loading"}
            data-lenis-prevent className="relative max-h-60 overflow-y-auto overscroll-contain p-1">
            {options.map((airport, i) => (
              <li key={airport.code} id={`${listId}-${airport.code}`} role="option" aria-selected={active === i}
                onMouseDown={(event) => event.preventDefault()} onClick={() => select(airport)}
                onMouseMove={() => setActive(i)}
                className={`flex min-h-14 cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-start ${active === i ? "bg-gold/15" : "hover:bg-panel-fg/5"}`}>
                <AirplaneTilt size={17} aria-hidden className="hidden shrink-0 text-panel-muted sm:block" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-panel-fg">{locale === "ar" && airport.cityAr ? airport.cityAr : airport.city}</span>
                  <span className="block truncate text-[11px] text-panel-muted">{airport.name} · {locale === "ar" ? airport.countryAr : airport.countryEn}</span>
                </span>
                <span dir="ltr" className="shrink-0 rounded border border-panel-fg/10 px-1.5 py-1 font-latin text-[11px] font-semibold text-panel-muted">{airport.code}</span>
              </li>
            ))}
          </ul>
          <p role="status" aria-live="polite" className={options.length ? "sr-only" : "px-3 pb-3 text-[12px] text-panel-muted"}>{message}</p>
        </div>
      )}
    </div>
  );
}
