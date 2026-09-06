"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  CalendarBlank,
  Users,
  IdentificationCard,
  ClipboardText,
  Minus,
  Plus,
  WhatsappLogo,
  EnvelopeSimple,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Button, buttonClass } from "@/components/ui/Button";
import { company } from "@/data/company";
import { images } from "@/data/images.generated";
import type { TourBase, TourContent } from "@/data/tours";
import { addDays, formatDate, formatOmr, toISODate } from "@/lib/format";
import { saveRequest } from "@/lib/bookings";
import { mailtoUrl, requestReference, whatsappUrl } from "@/lib/whatsapp";
import { burstFrom } from "@/lib/confetti";
import { Calendar } from "./Calendar";

type Step = 0 | 1 | 2 | 3;
type Tier = "3star" | "4star" | "4starPlus";

const STEP_ICONS = [CalendarBlank, Users, IdentificationCard, ClipboardText] as const;
const STEP_KEYS = ["date", "travellers", "details", "review"] as const;

function nextFriday(from: Date) {
  const d = new Date(from);
  const diff = (5 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
}

export function BookingWizard({ tour, content }: { tour: TourBase; content: TourContent }) {
  const t = useTranslations("Wizard");
  const price = useTranslations("Price");
  const common = useTranslations("Common");
  const locale = useLocale();

  const [step, setStep] = useState<Step>(0);
  const [date, setDate] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [tier, setTier] = useState<Tier>("3star");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickup, setPickup] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ reference: string; text: string } | null>(null);

  const today = new Date();
  const min = toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
  const endDate = date && tour.days && tour.days > 1 ? addDays(date, tour.days - 1) : null;
  const total = adults + children;
  const vehicles = tour.priceBasis === "car" ? Math.max(1, Math.ceil(total / (tour.maxPersons ?? 4))) : null;
  const unitPrice =
    tour.priceBasis === "adultTwin"
      ? (tour.priceTiers?.find((p) => p.tier === tier)?.price ?? tour.priceFrom)
      : tour.priceFrom;
  const estimate =
    unitPrice === null
      ? null
      : tour.priceBasis === "car"
        ? unitPrice * (vehicles ?? 1)
        : unitPrice * adults;

  const quick = [
    { key: "tomorrow", iso: min },
    { key: "weekend", iso: toISODate(nextFriday(today)) },
    { key: "twoWeeks", iso: addDays(toISODate(today), 14) },
    { key: "nextMonth", iso: toISODate(new Date(today.getFullYear(), today.getMonth() + 1, 1)) },
  ] as const;

  const travellersText = t("review.adultsChildren", { adults, children });
  const tierText = tour.priceTiers ? price(`tiers.${tier}`) : "";

  function validate(current: Step) {
    const e: Record<string, string> = {};
    if (current === 0 && !date) e.date = t("errors.date");
    if (current === 2) {
      if (!name.trim()) e.name = t("errors.required");
      if (!/^\+?[0-9 ()-]{7,}$/.test(phone.trim())) e.phone = t("errors.phone");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) e.email = t("errors.email");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    setStep((s) => Math.min(3, s + 1) as Step);
  }

  function submit() {
    if (!date) return;
    const reference = requestReference("AH");
    const lines = [
      t("message.intro", { name: content.name }),
      t("message.line", {
        date: endDate
          ? `${formatDate(locale, date)} - ${formatDate(locale, endDate)}`
          : formatDate(locale, date),
        travellers: travellersText,
        tier: tierText ? t("message.tierPart", { tier: tierText }) : "",
        pickup: pickup.trim() ? t("message.pickupPart", { pickup: pickup.trim() }) : "",
      }),
      estimate !== null
        ? t("message.estimate", { amount: formatOmr(locale, estimate, common("currency")) })
        : "",
      t("message.contact", { name: name.trim(), phone: phone.trim(), email: email.trim() }),
      notes.trim() ? t("message.notes", { notes: notes.trim() }) : "",
      t("message.reference", { reference }),
    ].filter(Boolean);
    const text = lines.join("\n");
    saveRequest({
      reference,
      slug: tour.slug,
      name: content.name,
      locale,
      date,
      endDate,
      adults,
      children,
      tier: tour.priceTiers ? tier : null,
      pickup: pickup.trim(),
      contact: { name: name.trim(), phone: phone.trim(), email: email.trim() },
      notes: notes.trim(),
      estimate,
      message: text,
      createdAt: new Date().toISOString(),
    });
    setDone({ reference, text });
    burstFrom(document.activeElement);
  }

  const hero = images[tour.image];
  const field =
    "h-12 w-full rounded-input border border-panel-fg/15 bg-white/70 px-3 text-[15px] text-panel-fg placeholder:text-panel-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/45";
  const label = "text-[12px] font-medium text-panel-muted";

  const Stepper = (
    <ol className="flex items-center gap-2 overflow-x-auto pb-1">
      {STEP_KEYS.map((key, i) => {
        const Icon = STEP_ICONS[i];
        const state = i < step ? "past" : i === step ? "current" : "future";
        return (
          <li key={key} className="flex shrink-0 items-center gap-2">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-pill border ${
                state === "current"
                  ? "border-gold bg-gold text-panel-fg"
                  : state === "past"
                    ? "border-gold/50 text-accent-text"
                    : "border-fg/15 text-fg/50"
              }`}
              aria-current={state === "current" ? "step" : undefined}
            >
              <Icon size={18} weight="fill" />
            </span>
            <span className={`text-[13px] ${state === "future" ? "text-fg/50" : "text-fg"}`}>
              {t(`steps.${key}`)}
            </span>
            {i < 3 ? <span className="mx-1 h-px w-6 bg-fg/15" aria-hidden /> : null}
          </li>
        );
      })}
    </ol>
  );

  const Summary = (
    <aside className="rounded-panel border border-fg/10 bg-surface-2 p-5">
      <div className="grade relative aspect-[16/9] overflow-hidden rounded-input">
        <Image src={hero.src} alt="" fill sizes="400px" placeholder="blur" blurDataURL={hero.blurDataURL} className="object-cover" />
      </div>
      <h2 className="mt-4 text-xl font-medium tracking-tight text-fg">{content.name}</h2>
      <p className="text-[14px] text-fg/65">{content.tagline}</p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px]">
        <dt className="text-fg/55">{t("review.date")}</dt>
        <dd className="text-fg">{date ? formatDate(locale, date) : t("date.none")}</dd>
        {endDate ? (
          <>
            <dt className="text-fg/55" />
            <dd className="text-fg/75">{t("date.ends", { date: formatDate(locale, endDate) })}</dd>
          </>
        ) : null}
        <dt className="text-fg/55">{t("review.travellers")}</dt>
        <dd className="text-fg">{travellersText}</dd>
        {tour.priceTiers ? (
          <>
            <dt className="text-fg/55">{t("review.tier")}</dt>
            <dd className="text-fg">{tierText}</dd>
          </>
        ) : null}
        {vehicles ? (
          <>
            <dt className="text-fg/55" />
            <dd className="text-fg/75">{t("travellers.cars", { count: vehicles })}</dd>
          </>
        ) : null}
      </dl>
      {estimate !== null ? (
        <div className="mt-5 border-t border-fg/10 pt-4">
          <span className="block text-[12px] text-fg/55">{t("review.estimate")}</span>
          <span className="block text-3xl font-medium tracking-tight text-fg">
            {formatOmr(locale, estimate, common("currency"))}
          </span>
          <p className="mt-2 text-[12px] leading-relaxed text-fg/55">{t("review.estimateNote")}</p>
        </div>
      ) : null}
    </aside>
  );

  if (done) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-panel bg-panel p-7 text-panel-fg shadow-panel md:p-10" style={{ colorScheme: "light" }}>
          <span className="text-[12px] font-medium text-panel-muted">{t("done.reference")}</span>
          <p className="font-latin text-3xl font-semibold tracking-[0.08em]" dir="ltr">
            {done.reference}
          </p>
          <h2 className="mt-6 text-3xl font-medium tracking-tight">{t("done.title")}</h2>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-panel-muted">{t("done.body")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={whatsappUrl(company.whatsapp.digits, done.text)} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
              <WhatsappLogo size={18} weight="fill" />
              {t("done.whatsapp")}
            </a>
            <a href={mailtoUrl(company.email, `${t("title")} ${done.reference}`, done.text)} className={buttonClass("onCream")}>
              <EnvelopeSimple size={18} weight="fill" />
              {t("done.email")}
            </a>
          </div>
          <pre className="mt-6 whitespace-pre-wrap rounded-input border border-panel-fg/10 bg-white/60 p-4 font-display text-[14px] leading-relaxed text-panel-muted">
            {done.text}
          </pre>
          <p className="mt-4 text-[13px] text-panel-muted">{t("done.saved")}</p>
          <Link href="/tours" className="mt-6 inline-block text-[14px] font-medium text-gold-700 underline-offset-4 hover:underline">
            {t("done.another")}
          </Link>
        </div>
        {Summary}
      </div>
    );
  }

  return (
    <div>
      {Stepper}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-panel bg-panel p-6 text-panel-fg shadow-panel md:p-8" style={{ colorScheme: "light" }}>
          {step === 0 ? (
            <div>
              <h2 className="text-2xl font-medium tracking-tight">{t("date.title")}</h2>
              <p className="mt-2 text-[14px] text-panel-muted">{t("date.hint")}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[12px] text-panel-muted">{t("date.quick")}</span>
                {quick.map((q) => (
                  <button
                    key={q.key}
                    type="button"
                    onClick={() => setDate(q.iso)}
                    className={`rounded-pill border px-3.5 py-1.5 text-[13px] transition-colors ${
                      date === q.iso ? "border-gold bg-gold text-panel-fg" : "border-panel-fg/15 text-panel-fg hover:border-gold-700"
                    }`}
                  >
                    {t(`date.${q.key}`)}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <Calendar value={date} min={min} onChange={(iso) => { setDate(iso); setErrors({}); }} />
              </div>
              {errors.date ? <p className="mt-3 text-[13px] text-[#b0361f]">{errors.date}</p> : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div>
              <h2 className="text-2xl font-medium tracking-tight">{t("travellers.title")}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Counter label={t("travellers.adults")} value={adults} min={1} max={20} onChange={setAdults} />
                <Counter label={t("travellers.children")} value={children} min={0} max={10} onChange={setChildren} />
              </div>
              {vehicles ? (
                <p className="mt-4 text-[14px] text-panel-muted">
                  {t("travellers.cars", { count: vehicles })}. {t("travellers.carsHint", { count: tour.maxPersons ?? 4 })}
                </p>
              ) : null}
              {tour.priceTiers ? (
                <fieldset className="mt-7">
                  <legend className={label}>{t("travellers.tier")}</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {tour.priceTiers.map((p) => (
                      <label
                        key={p.tier}
                        className={`flex cursor-pointer flex-col rounded-input border px-4 py-3 transition-colors ${
                          tier === p.tier ? "border-gold bg-gold/10" : "border-panel-fg/15 hover:border-gold-700/60"
                        }`}
                      >
                        <input type="radio" name="tier" value={p.tier} checked={tier === p.tier} onChange={() => setTier(p.tier)} className="sr-only" />
                        <span className="text-[14px] font-medium">{price(`tiers.${p.tier}`)}</span>
                        <span className="text-[13px] text-panel-muted">
                          {formatOmr(locale, p.price, common("currency"))} {price("twinShare")}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="text-2xl font-medium tracking-tight">{t("details.title")}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="name" label={t("details.name")} error={errors.name}>
                  <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
                </Field>
                <Field id="phone" label={t("details.phone")} error={errors.phone}>
                  <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} inputMode="tel" autoComplete="tel" placeholder="+968" dir="ltr" />
                </Field>
                <Field id="email" label={t("details.email")} error={errors.email}>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" dir="ltr" />
                </Field>
                <Field id="pickup" label={t("details.pickup")}>
                  <input id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} className={field} />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="notes" label={t("details.notes")} hint={t("details.notesHint")}>
                    <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${field} h-auto py-3`} />
                  </Field>
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h2 className="text-2xl font-medium tracking-tight">{t("review.title")}</h2>
              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[15px]">
                <dt className="text-panel-muted">{t("review.journey")}</dt>
                <dd className="font-medium">{content.name}</dd>
                <dt className="text-panel-muted">{t("review.date")}</dt>
                <dd className="font-medium">
                  {date ? formatDate(locale, date) : ""}
                  {endDate ? ` (${t("date.ends", { date: formatDate(locale, endDate) })})` : ""}
                </dd>
                <dt className="text-panel-muted">{t("review.travellers")}</dt>
                <dd className="font-medium">{travellersText}</dd>
                {tour.priceTiers ? (
                  <>
                    <dt className="text-panel-muted">{t("review.tier")}</dt>
                    <dd className="font-medium">{tierText}</dd>
                  </>
                ) : null}
                {pickup.trim() ? (
                  <>
                    <dt className="text-panel-muted">{t("review.pickup")}</dt>
                    <dd className="font-medium">{pickup}</dd>
                  </>
                ) : null}
                <dt className="text-panel-muted">{t("details.name")}</dt>
                <dd className="font-medium">
                  {name}, <span dir="ltr">{phone}</span>, <span dir="ltr">{email}</span>
                </dd>
              </dl>
              {estimate !== null ? (
                <div className="mt-6 rounded-input border border-gold/40 bg-gold/10 px-4 py-3">
                  <span className="block text-[12px] text-panel-muted">{t("review.estimate")}</span>
                  <span className="block text-2xl font-medium">{formatOmr(locale, estimate, common("currency"))}</span>
                  <p className="mt-1 text-[12px] text-panel-muted">{t("review.estimateNote")}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-panel-fg/10 pt-6">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1) as Step)} className="inline-flex items-center gap-2 text-[14px] font-medium text-panel-muted hover:text-panel-fg">
                <ArrowLeft size={16} className="rtl:rotate-180" />
                {t("back")}
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <Button type="button" onClick={next}>{t("continue")}</Button>
            ) : (
              <Button type="button" onClick={submit}>{t("submit")}</Button>
            )}
          </div>
        </div>
        {Summary}
      </div>
    </div>
  );
}

function Counter({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-input border border-panel-fg/15 px-4 py-3">
      <span className="text-[14px] font-medium">{label}</span>
      <span className="inline-flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="-" className="flex h-9 w-9 items-center justify-center rounded-pill border border-panel-fg/15 disabled:opacity-40 hover:border-gold-700">
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-[16px] font-medium tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="+" className="flex h-9 w-9 items-center justify-center rounded-pill border border-panel-fg/15 disabled:opacity-40 hover:border-gold-700">
          <Plus size={14} />
        </button>
      </span>
    </div>
  );
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-panel-muted">{label}</label>
      {children}
      {hint && !error ? <p className="text-[12px] text-panel-muted/80">{hint}</p> : null}
      {error ? <p className="text-[12px] text-[#b0361f]">{error}</p> : null}
    </div>
  );
}
