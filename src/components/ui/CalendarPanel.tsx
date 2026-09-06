"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CaretLeft, CaretRight, CaretDown } from "@phosphor-icons/react";
import {
  calendarCells, calendarDate, calendarInRange, calendarISO, calendarLabel,
  calendarLocale, clampCalendarDate, shiftCalendarDate, shiftCalendarMonth, type CalendarMode,
} from "@/lib/calendar";

export type CalendarPanelProps = {
  value: string | null; min?: string; max?: string; mode?: CalendarMode;
  onChange: (iso: string) => void;
};

export function CalendarPanel({ value, min, max, mode = "date", onChange }: CalendarPanelProps) {
  const t = useTranslations("DatePicker");
  const locale = useLocale();
  const intl = calendarLocale(locale);
  const today = calendarISO(new Date());
  const minDate = min?.length === 7 ? `${min}-01` : min;
  const maxDate = max?.length === 7 ? calendarISO(new Date(Number(max.slice(0, 4)), Number(max.slice(5, 7)), 0)) : max;
  const initial = clampCalendarDate(value ? (value.length === 7 ? `${value}-01` : value) : today,
    minDate, maxDate);
  const [focusDate, setFocusDate] = useState(initial);
  const [month, setMonth] = useState(initial.slice(0, 7));
  const [view, setView] = useState<"days" | "months">(mode === "month" ? "months" : "days");
  const grid = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);
  const heading = useId();
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;
  const cells = calendarCells(year, monthIndex);
  const weekdayFormat = new Intl.DateTimeFormat(intl, { weekday: "short" });
  const fullDateFormat = new Intl.DateTimeFormat(intl, { dateStyle: "full" });
  const monthFormat = new Intl.DateTimeFormat(intl, { month: "long" });
  const navClass = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-fg/10 text-fg transition-colors hover:border-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-25";

  function browse(amount: number) {
    const next = shiftCalendarMonth(`${month}-01`, amount * (view === "months" ? 12 : 1));
    setMonth(next.slice(0, 7));
    const candidate = clampCalendarDate(next, minDate, maxDate);
    setFocusDate(candidate);
  }

  function keyNavigate(event: KeyboardEvent<HTMLButtonElement>, iso: string, months = false) {
    let next: string | undefined;
    const direction = locale === "ar" ? -1 : 1;
    if (event.key === "ArrowRight") next = months ? shiftCalendarMonth(iso, direction) : shiftCalendarDate(iso, direction);
    if (event.key === "ArrowLeft") next = months ? shiftCalendarMonth(iso, -direction) : shiftCalendarDate(iso, -direction);
    if (event.key === "ArrowDown") next = months ? shiftCalendarMonth(iso, 3) : shiftCalendarDate(iso, 7);
    if (event.key === "ArrowUp") next = months ? shiftCalendarMonth(iso, -3) : shiftCalendarDate(iso, -7);
    if (event.key === "PageDown") next = shiftCalendarMonth(iso, months || event.shiftKey ? 12 : 1);
    if (event.key === "PageUp") next = shiftCalendarMonth(iso, months || event.shiftKey ? -12 : -1);
    if (event.key === "Home") next = months ? `${iso.slice(0, 4)}-01-01` : shiftCalendarDate(iso, -calendarDate(iso).getDay());
    if (event.key === "End") next = months ? `${iso.slice(0, 4)}-12-01` : shiftCalendarDate(iso, 6 - calendarDate(iso).getDay());
    if (!next) return;
    event.preventDefault();
    next = clampCalendarDate(next, minDate, maxDate);
    moveFocus.current = true;
    setFocusDate(next);
    setMonth(next.slice(0, 7));
  }

  useEffect(() => {
    if (!moveFocus.current) return;
    grid.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus({ preventScroll: true });
    moveFocus.current = false;
  }, [focusDate, view]);

  const previousDisabled = view === "months" ? !!min && year <= Number(min.slice(0, 4))
    : !!min && month <= min.slice(0, 7);
  const nextDisabled = view === "months" ? !!max && year >= Number(max.slice(0, 4))
    : !!max && month >= max.slice(0, 7);

  return (
    <div className="overflow-hidden rounded-[20px] border border-fg/10 bg-surface-2 text-fg" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between gap-2 border-b border-fg/8 bg-gold/5 px-3 py-3">
        <button type="button" aria-label={t(view === "months" ? "previousYear" : "previousMonth")} disabled={previousDisabled} onClick={() => browse(-1)} className={navClass}>
          <CaretLeft size={17} aria-hidden className="rtl:rotate-180" />
        </button>
        <button type="button" id={heading} onClick={() => { if (mode === "date") setView(view === "days" ? "months" : "days"); }}
          aria-label={view === "days" ? t("chooseMonthYear") : undefined}
          className="flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-[16px] font-medium tracking-tight hover:bg-fg/5">
          <span aria-live="polite">{view === "months" ? year : `${monthFormat.format(new Date(year, monthIndex, 1))} ${year}`}</span>
          {mode === "date" && <CaretDown size={13} aria-hidden className={view === "months" ? "rotate-180" : ""} />}
        </button>
        <button type="button" aria-label={t(view === "months" ? "nextYear" : "nextMonth")} disabled={nextDisabled} onClick={() => browse(1)} className={navClass}>
          <CaretRight size={17} aria-hidden className="rtl:rotate-180" />
        </button>
      </div>
      <div ref={grid} role="grid" aria-label={view === "months" ? String(year) : `${monthFormat.format(new Date(year, monthIndex, 1))} ${year}`} className="p-3">
        {view === "days" ? <>
          <div role="row" className="mb-1 grid grid-cols-7 text-center">
            {Array.from({ length: 7 }, (_, i) => <span key={i} role="columnheader" className="py-2 text-[10px] font-medium text-fg-muted">{weekdayFormat.format(new Date(2024, 8, 1 + i))}</span>)}
          </div>
          {Array.from({ length: 6 }, (_, row) => <div key={row} role="row" className="grid grid-cols-7 gap-0.5">
            {cells.slice(row * 7, row * 7 + 7).map((iso, i) => {
              if (!iso) return <div key={`empty-${i}`} role="gridcell" />;
              const selected = iso === value;
              const disabled = !calendarInRange(iso, min, max);
              return <div key={iso} role="gridcell" aria-selected={selected}>
                <button type="button" aria-label={fullDateFormat.format(calendarDate(iso))} aria-current={iso === today ? "date" : undefined}
                  disabled={disabled} tabIndex={iso === focusDate ? 0 : -1} data-calendar-focus={iso === focusDate ? "true" : undefined}
                  onClick={() => onChange(iso)} onKeyDown={(e) => keyNavigate(e, iso)}
                  className={`relative flex h-10 w-full items-center justify-center rounded-full text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold ${selected ? "bg-gold font-semibold text-ink shadow-sm" : disabled ? "text-fg/20" : "text-fg hover:bg-gold/15"} ${iso === today && !selected ? "ring-1 ring-inset ring-gold/60" : ""}`}>
                  {Number(iso.slice(-2))}
                </button>
              </div>;
            })}
          </div>)}
        </> : Array.from({ length: 4 }, (_, row) => <div key={row} role="row" className="grid grid-cols-3 gap-2 py-1">
          {Array.from({ length: 3 }, (_, col) => {
            const m = row * 3 + col;
            const iso = `${year}-${String(m + 1).padStart(2, "0")}`;
            const selected = value?.slice(0, 7) === iso;
            return <div key={iso} role="gridcell" aria-selected={selected}>
              <button type="button" disabled={!calendarInRange(iso, min, max)}
                tabIndex={focusDate.slice(0, 7) === iso ? 0 : -1} data-calendar-focus={focusDate.slice(0, 7) === iso ? "true" : undefined}
                onKeyDown={(e) => keyNavigate(e, `${iso}-01`, true)}
                onClick={() => { if (mode === "month") onChange(iso); else { const next = clampCalendarDate(`${iso}-01`, minDate, maxDate); setMonth(iso); setFocusDate(next); setView("days"); moveFocus.current = true; } }}
                className={`min-h-12 w-full rounded-xl px-1 text-[12px] transition-colors disabled:opacity-20 ${selected ? "bg-gold font-semibold text-ink" : "hover:bg-gold/15"}`}>
                {monthFormat.format(new Date(year, m, 1))}
              </button>
            </div>;
          })}
        </div>)}
      </div>
      <div className="flex min-h-14 items-center justify-between gap-2 border-t border-fg/8 px-4 py-2">
        <p className="text-[11px] text-fg-muted">{value ? calendarLabel(value, locale, mode) : t(mode === "month" ? "chooseMonth" : "chooseDate")}</p>
        <button type="button" disabled={!calendarInRange(mode === "month" ? today.slice(0, 7) : today, min, max)}
          onClick={() => onChange(mode === "month" ? today.slice(0, 7) : today)}
          className="min-h-9 shrink-0 rounded-full px-3 text-[12px] font-medium text-accent-text hover:bg-gold/10 disabled:opacity-25">
          {t(mode === "month" ? "thisMonth" : "today")}
        </button>
      </div>
    </div>
  );
}
