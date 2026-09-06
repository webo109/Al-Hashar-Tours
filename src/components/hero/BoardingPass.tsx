"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { ArrowRight, WhatsappLogo, EnvelopeSimple } from "@phosphor-icons/react";
import { LogoMark } from "@/components/brand/Logo";
import { AirportCombobox } from "@/components/booking/AirportCombobox";
import { DatePicker } from "@/components/ui/DatePicker";
import { shiftCalendarDate } from "@/lib/calendar";
import { Button, buttonClass } from "@/components/ui/Button";
import { company } from "@/data/company";
import { mailtoUrl, requestReference, whatsappUrl } from "@/lib/whatsapp";
import { burstFrom } from "@/lib/confetti";
import type { BookingTab } from "@/components/nav/FloatingNav";

const TABS: BookingTab[] = ["flights", "hotels", "omanTours", "holidays"];

type FieldName =
  | "from"
  | "to"
  | "depart"
  | "return"
  | "travellers"
  | "city"
  | "checkIn"
  | "checkOut"
  | "guests"
  | "destination"
  | "date"
  | "region"
  | "month";

type Field = {
  name: FieldName;
  type: "text" | "date" | "number" | "month";
  required: boolean;
  placeholder?: "from" | "to" | "city" | "destination" | "region";
  wide?: boolean;
};

const FIELDS: Record<BookingTab, Field[]> = {
  flights: [
    { name: "from", type: "text", required: true, placeholder: "from" },
    { name: "to", type: "text", required: true, placeholder: "to" },
    { name: "depart", type: "date", required: true },
    { name: "return", type: "date", required: false },
    { name: "travellers", type: "number", required: true, wide: true },
  ],
  hotels: [
    { name: "city", type: "text", required: true, placeholder: "city", wide: true },
    { name: "checkIn", type: "date", required: true },
    { name: "checkOut", type: "date", required: true },
    { name: "guests", type: "number", required: true, wide: true },
  ],
  omanTours: [
    {
      name: "destination",
      type: "text",
      required: true,
      placeholder: "destination",
      wide: true,
    },
    { name: "date", type: "date", required: true },
    { name: "travellers", type: "number", required: true },
  ],
  holidays: [
    { name: "region", type: "text", required: true, placeholder: "region", wide: true },
    { name: "month", type: "month", required: true },
    { name: "travellers", type: "number", required: true },
  ],
};

type Values = Partial<Record<FieldName, string>>;
type Printed = {
  reference: string;
  text: string;
  lines: { label: string; value: ReactNode }[];
};

const initialValues: Record<BookingTab, Values> = {
  flights: { from: "Muscat (MCT)", travellers: "2" },
  hotels: { guests: "2" },
  omanTours: { travellers: "2" },
  holidays: { travellers: "2" },
};

// A passport-style stamp: the quiet place for "since 1984" on the pass.
function HeritageStamp({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-16 w-16 shrink-0 -rotate-12 text-gold-700 opacity-75"
      aria-hidden
    >
      <defs>
        <path id="heritage-ring" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
      </defs>
      <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="29" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text
        className="font-latin"
        fontSize="10.5"
        fontWeight="600"
        letterSpacing="2.2"
        fill="currentColor"
      >
        <textPath href="#heritage-ring">AL-HASHAR · MUSCAT · TOURISM &amp; TRAVELS ·</textPath>
      </text>
      <text x="60" y="56" textAnchor="middle" fontSize="9" letterSpacing="1" fill="currentColor">
        {label}
      </text>
      <text className="font-latin" x="60" y="74" textAnchor="middle" fontSize="17" fontWeight="700" fill="currentColor">
        1984
      </text>
    </svg>
  );
}

export function BoardingPass() {
  const t = useTranslations("Booking");
  const trust = useTranslations("Trust");
  const fmt = useFormatter();
  const locale = useLocale();
  const [tab, setTab] = useState<BookingTab>("flights");
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [printed, setPrinted] = useState<Printed | null>(null);

  useEffect(() => {
    const onTab = (e: Event) => {
      const next = (e as CustomEvent<BookingTab>).detail;
      if (TABS.includes(next)) {
        setTab(next);
        setPrinted(null);
        setErrors({});
      }
    };
    window.addEventListener("booking:tab", onTab);
    return () => window.removeEventListener("booking:tab", onTab);
  }, []);

  const v = values[tab];

  function update(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [tab]: { ...prev[tab], [name]: value } }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  const day = (iso: string) =>
    fmt.dateTime(new Date(`${iso}T00:00:00`), {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const monthName = (iso: string) =>
    fmt.dateTime(new Date(`${iso}-01T00:00:00`), { month: "long", year: "numeric" });
  const count = (key: "travellersCount" | "guestsCount", raw?: string) =>
    t(key, { count: Number(raw ?? "1") || 1 });

  function validate(): Partial<Record<FieldName, string>> {
    const errs: Partial<Record<FieldName, string>> = {};
    for (const f of FIELDS[tab]) {
      if (f.required && !v[f.name]?.trim()) errs[f.name] = t("errors.required");
    }
    if (tab === "flights" && v.depart && v.return && v.return < v.depart) {
      errs.return = t("errors.returnBeforeDepart");
    }
    if (tab === "hotels" && v.checkIn && v.checkOut && v.checkOut <= v.checkIn) {
      errs.checkOut = t("errors.checkOutBeforeCheckIn");
    }
    return errs;
  }

  function compose(reference: string): Printed {
    const arrow = <ArrowRight size={14} weight="fill" className="mx-1 inline rtl:rotate-180" />;
    if (tab === "flights") {
      const travellers = count("travellersCount", v.travellers);
      const returnPart = v.return ? t("message.returnPart", { return: day(v.return) }) : "";
      return {
        reference,
        text: t("message.flights", {
          from: v.from ?? "",
          to: v.to ?? "",
          depart: v.depart ? day(v.depart) : "",
          returnPart,
          travellers,
        }),
        lines: [
          {
            label: t("printed.route"),
            value: (
              <>
                {v.from}
                {arrow}
                {v.to}
              </>
            ),
          },
          {
            label: t("printed.dates"),
            value: v.return
              ? t("printed.dateRange", { start: day(v.depart!), end: day(v.return) })
              : day(v.depart!),
          },
          { label: t("printed.travellers"), value: travellers },
        ],
      };
    }
    if (tab === "hotels") {
      const guests = count("guestsCount", v.guests);
      return {
        reference,
        text: t("message.hotels", {
          city: v.city ?? "",
          checkIn: v.checkIn ? day(v.checkIn) : "",
          checkOut: v.checkOut ? day(v.checkOut) : "",
          guests,
        }),
        lines: [
          { label: t("printed.stay"), value: v.city },
          {
            label: t("printed.dates"),
            value: t("printed.dateRange", { start: day(v.checkIn!), end: day(v.checkOut!) }),
          },
          { label: t("printed.travellers"), value: guests },
        ],
      };
    }
    if (tab === "omanTours") {
      const travellers = count("travellersCount", v.travellers);
      return {
        reference,
        text: t("message.omanTours", {
          destination: v.destination ?? "",
          date: v.date ? day(v.date) : "",
          travellers,
        }),
        lines: [
          { label: t("printed.journey"), value: v.destination },
          { label: t("printed.dates"), value: day(v.date!) },
          { label: t("printed.travellers"), value: travellers },
        ],
      };
    }
    const travellers = count("travellersCount", v.travellers);
    return {
      reference,
      text: t("message.holidays", {
        region: v.region ?? "",
        month: v.month ? monthName(v.month) : "",
        travellers,
      }),
      lines: [
        { label: t("printed.journey"), value: v.region },
        { label: t("printed.dates"), value: monthName(v.month!) },
        { label: t("printed.travellers"), value: travellers },
      ],
    };
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    setPrinted(compose(requestReference()));
    burstFrom((e.currentTarget as HTMLFormElement).querySelector('button[type="submit"]'));
  }

  const fullText = printed
    ? `${t("message.intro")}\n${printed.text}\n${t("message.reference", { reference: printed.reference })}`
    : "";

  return (
    <form
      id="booking"
      onSubmit={onSubmit}
      noValidate
      className="pass relative w-full rounded-panel bg-panel text-panel-fg shadow-panel"
      style={{ colorScheme: "light" }}
      aria-labelledby="booking-title"
    >
      <div className="flex items-center justify-between border-b border-panel-fg/10 px-6 pt-5 pb-4">
        <span className="inline-flex items-center gap-2">
          <LogoMark className="h-7 w-7" />
          <span className="font-latin text-[12px] font-semibold uppercase tracking-[0.2em]">
            Al-Hashar
          </span>
        </span>
        <span id="booking-title" className="text-[12px] font-medium text-panel-muted">
          {t("passTitle")}
        </span>
      </div>

      <div role="tablist" aria-label={t("passTitle")} className="flex flex-wrap gap-1 px-4 pt-4">
        {TABS.map((key) => {
          const active = key === tab;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`booking-panel-${key}`}
              id={`booking-tab-${key}`}
              onClick={() => {
                setTab(key);
                setPrinted(null);
                setErrors({});
              }}
              className={`rounded-pill px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${
                active ? "bg-panel-fg text-panel" : "text-panel-muted hover:bg-panel-fg/5 hover:text-panel-fg"
              }`}
            >
              {t(`tabs.${key}`)}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`booking-panel-${tab}`}
        aria-labelledby={`booking-tab-${tab}`}
        className="grid grid-cols-2 gap-x-3 gap-y-4 px-6 pt-5 pb-5"
      >
        {FIELDS[tab].map((f) => {
          const id = `booking-${tab}-${f.name}`;
          const error = errors[f.name];
          const airportField = tab === "flights" && (f.name === "from" || f.name === "to");
          return (
            <div key={`${tab}-${f.name}`} className={`flex min-w-0 flex-col gap-1.5 ${f.wide ? "col-span-2" : airportField ? "col-span-2 sm:col-span-1" : ""}`}>
              <label htmlFor={id} className="text-[12px] font-medium text-panel-muted">
                {t(`fields.${f.name}`)}
                {!f.required ? (
                  <span className="ms-1 font-normal opacity-70">({t("fields.optional")})</span>
                ) : null}
              </label>
              {airportField ? (
                <AirportCombobox id={id} name={f.name} label={t(`fields.${f.name}`)}
                  value={v[f.name] ?? ""} onChange={(value) => update(f.name, value)}
                  placeholder={f.placeholder ? t(`placeholders.${f.placeholder}`) : undefined} error={error} />
              ) : f.type === "date" || f.type === "month" ? (
                <DatePicker id={id} name={f.name} label={t(`fields.${f.name}`)}
                  mode={f.type} value={v[f.name] ?? ""} onChange={(value) => update(f.name, value)}
                  min={f.name === "return" ? v.depart : f.name === "checkOut" && v.checkIn ? shiftCalendarDate(v.checkIn, 1) : undefined}
                  error={error} required={f.required} />
              ) : <input
                id={id}
                name={f.name}
                type={f.type}
                inputMode={f.type === "number" ? "numeric" : undefined}
                min={f.type === "number" ? 1 : undefined}
                max={f.type === "number" ? 9 : undefined}
                value={v[f.name] ?? ""}
                onChange={(e) => update(f.name, e.target.value)}
                placeholder={f.placeholder ? t(`placeholders.${f.placeholder}`) : undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`h-11 w-full rounded-input border bg-white/70 px-3 text-[15px] text-panel-fg placeholder:text-panel-muted/60 focus:outline-none focus:ring-2 focus:ring-gold/45 ${
                  error ? "border-[#b0361f]" : "border-panel-fg/15 focus:border-gold"
                }`}
              />}
              {error ? (
                <p id={`${id}-error`} className="text-[12px] text-[#b0361f]">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="px-6 pb-6">
        <Button type="submit" className="w-full">
          {t("submit")}
        </Button>
      </div>

      <div className="relative h-0 border-t border-dashed border-panel-fg/25" aria-hidden>
        <span className="absolute -start-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-surface" />
        <span className="absolute -end-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-surface" />
      </div>

      <div className="rounded-b-panel bg-sand-300/70 px-6 pt-5 pb-6" aria-live="polite">
        {printed ? (
          <div className="stub-print">
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] font-medium text-panel-muted">{t("printed.title")}</span>
              <span className="font-latin text-[12px] tracking-[0.12em] text-panel-muted">
                {t("printed.reference")} {printed.reference}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14px]">
              {printed.lines.map((l) => (
                <div key={l.label} className="contents">
                  <dt className="text-panel-muted">{l.label}</dt>
                  <dd className="font-medium text-panel-fg">{l.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={whatsappUrl(company.whatsapp.digits, fullText)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("primary", "h-11 px-5 text-[14px]")}
              >
                <WhatsappLogo size={18} weight="fill" />
                {t("printed.whatsapp")}
              </a>
              <a
                href={mailtoUrl(company.email, `${t("printed.title")} ${printed.reference}`, fullText)}
                className={buttonClass("onCream", "h-11 px-5 text-[14px]")}
              >
                <EnvelopeSimple size={18} weight="fill" />
                {t("printed.email")}
              </a>
              <button
                type="button"
                onClick={() => setPrinted(null)}
                className="ms-auto text-[13px] text-panel-muted underline-offset-4 hover:underline"
              >
                {t("printed.edit")}
              </button>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-panel-muted">{t("printed.note")}</p>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] text-panel-muted">{t("passSubtitle")}</p>
            <div className="flex shrink-0 items-center gap-3">
              <span className="sr-only">{trust("headline")}</span>
              <HeritageStamp label={trust("sinceLabel")} />
              <svg
                className="hidden h-7 w-20 shrink-0 text-panel-fg/70 sm:block"
                viewBox="0 0 96 28"
                aria-hidden
                lang={locale}
              >
                {[2, 6, 9, 14, 17, 22, 27, 30, 36, 40, 43, 48, 52, 57, 62, 65, 70, 74, 79, 84, 88, 92].map(
                  (x, i) => (
                    <rect key={x} x={x} y="2" width={i % 3 === 0 ? 2.5 : 1.2} height="24" fill="currentColor" />
                  ),
                )}
              </svg>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
