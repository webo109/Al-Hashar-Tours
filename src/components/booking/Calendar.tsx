"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { toISODate } from "@/lib/format";

type Props = {
  value: string | null;
  min: string;
  onChange: (iso: string) => void;
};

export function Calendar({ value, min, onChange }: Props) {
  const t = useTranslations("Wizard.date");
  const locale = useLocale();
  const intl = locale === "ar" ? "ar-OM-u-nu-latn" : "en-OM";
  const initial = value ? new Date(`${value}T00:00:00`) : new Date(`${min}T00:00:00`);
  const [view, setView] = useState({ y: initial.getFullYear(), m: initial.getMonth() });

  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intl, { weekday: "narrow" });
    // Week starts on Sunday, as in Oman.
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 8, 1 + i)));
  }, [intl]);

  const monthLabel = new Intl.DateTimeFormat(intl, { month: "long", year: "numeric" }).format(
    new Date(view.y, view.m, 1),
  );

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const offset = first.getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const list: (string | null)[] = Array.from({ length: offset }, () => null);
    for (let d = 1; d <= daysInMonth; d += 1) list.push(toISODate(new Date(view.y, view.m, d)));
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [view]);

  const today = toISODate(new Date());

  return (
    <div className="rounded-panel border border-ink/10 bg-white/60 p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }))}
          aria-label={t("prevMonth")}
          className="flex h-9 w-9 items-center justify-center rounded-pill hover:bg-ink/5"
        >
          <CaretLeft size={16} className="rtl:rotate-180" />
        </button>
        <span className="text-[15px] font-medium text-ink">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }))}
          aria-label={t("nextMonthLabel")}
          className="flex h-9 w-9 items-center justify-center rounded-pill hover:bg-ink/5"
        >
          <CaretRight size={16} className="rtl:rotate-180" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-ink-soft" aria-hidden>
        {weekdays.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1" role="grid">
        {cells.map((iso, i) => {
          if (!iso) return <span key={`empty-${i}`} />;
          const disabled = iso < min;
          const selected = iso === value;
          const isToday = iso === today;
          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              aria-selected={selected}
              disabled={disabled}
              onClick={() => onChange(iso)}
              className={`flex h-10 items-center justify-center rounded-pill text-[14px] transition-colors ${
                selected
                  ? "bg-gold font-medium text-ink"
                  : disabled
                    ? "text-ink/25"
                    : "text-ink hover:bg-gold/20"
              } ${isToday && !selected ? "ring-1 ring-gold-700/60" : ""}`}
            >
              {Number(iso.slice(-2))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
