"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AirplaneTilt,
  ArrowLeft,
  ArrowCounterClockwise,
  ArrowRight,
  Buildings,
  CastleTurret,
  Island,
  Mountains,
  PersonSimpleHike,
  PersonSimpleWalk,
  SunHorizon,
  Tree,
  Waves,
} from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/Button";
import { durationLabel } from "@/components/tours/TourCard";
import { images, type ImageKey } from "@/data/images.generated";
import type { TourContent } from "@/data/tours";
import type { Mood } from "@/data/world";
import { suggestTours, suggestWorld, type Pace, type Place, type Time } from "@/data/adventure";
import { formatOmr } from "@/lib/format";
import { burstFrom } from "@/lib/confetti";
import { JourneyCarousel, type Journey } from "./JourneyCarousel";

type Step = "place" | "time" | "pace" | "mood" | "results";
type Variant = "glass" | "panel";
type Result = Journey;

const placeIcons = { sea: Waves, mountains: Mountains, desert: SunHorizon, heritage: CastleTurret, abroad: AirplaneTilt } as const;
const timeIcons = { halfDay: SunHorizon, fullDay: SunHorizon, severalDays: Tree } as const;
const paceIcons = { easy: PersonSimpleWalk, active: PersonSimpleHike } as const;
const moodIcons = { beach: Island, city: Buildings, nature: Tree, culture: CastleTurret } as const;

const PLACES: Place[] = ["sea", "mountains", "desert", "heritage", "abroad"];
const TIMES: Time[] = ["halfDay", "fullDay", "severalDays"];
const PACES: Pace[] = ["easy", "active"];
const MOODS: Mood[] = ["beach", "city", "nature", "culture"];

// The interactive core: three taps, then three suggestions. Rendered inside
// the hero's glass card or in a standalone panel. In the glass variant the
// results become a carousel and `onActive` reports the journey on show, so the
// hero can put that photograph behind the stage.
export function PickerFlow({
  content,
  variant = "panel",
  onActive,
}: {
  content: Record<string, TourContent>;
  variant?: Variant;
  onActive?: (image: ImageKey | null) => void;
}) {
  const t = useTranslations("Picker");
  const world = useTranslations("World");
  const tours = useTranslations("Tours");
  const price = useTranslations("Price");
  const common = useTranslations("Common");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const dir = locale === "ar" ? -1 : 1;
  const liveId = useId();

  const [step, setStep] = useState<Step>("place");
  const [place, setPlace] = useState<Place | null>(null);
  const [time, setTime] = useState<Time | null>(null);
  const [pace, setPace] = useState<Pace | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [direction, setDirection] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLHeadingElement>(null);

  const order: Step[] = place === "abroad" ? ["place", "mood", "results"] : ["place", "time", "pace", "results"];
  const stepIndex = order.indexOf(step);
  const total = order.length - 1;

  useEffect(() => {
    if (step === "results") burstFrom(resultsRef.current, 90);
    if (step !== "place") legendRef.current?.focus({ preventScroll: true });
    // Stepping back or starting over hands the stage back to the video.
    if (step !== "results") onActive?.(null);
  }, [step, onActive]);

  function go(next: Step, forward = true) {
    setDirection(forward ? 1 : -1);
    setStep(next);
  }

  function back() {
    go(order[Math.max(0, stepIndex - 1)], false);
  }

  function reset() {
    setPlace(null);
    setTime(null);
    setPace(null);
    setMood(null);
    go("place", false);
  }

  const results: Result[] =
    step !== "results"
      ? []
      : place === "abroad" && mood
        ? suggestWorld(mood).map((pkg) => ({
            key: pkg.key,
            image: pkg.image,
            title: world(`items.${pkg.key}.name`),
            line: world(`items.${pkg.key}.cities`),
            meta: `${tours("nights", { count: pkg.nights })}, ${tours("days", { count: pkg.days })}`,
            price: formatOmr(locale, pkg.priceFrom, common("currency")),
            basis: price("twinShare"),
            href: { pathname: "/services/holidays", query: { region: pkg.key } },
            cta: world("cta"),
          }))
        : place && place !== "abroad" && time && pace
          ? suggestTours({ place, time, pace }).map((tour) => {
              const c = content[tour.slug];
              const basis =
                tour.priceBasis === "car"
                  ? price("perCar", { count: tour.maxPersons ?? 4 })
                  : tour.priceBasis === "adultTwin"
                    ? price("twinShare")
                    : tour.priceBasis === "adult"
                      ? price("perAdult")
                      : price("perPerson");
              return {
                key: tour.slug,
                image: tour.image,
                title: c?.name ?? tour.slug,
                line: c?.tagline ?? "",
                meta: durationLabel(tours, tour),
                price: tour.priceFrom === null ? price("onRequest") : formatOmr(locale, tour.priceFrom, common("currency")),
                basis: tour.priceFrom === null ? "" : basis,
                href: `/tours/${tour.slug}`,
                cta: tours("view"),
              };
            })
          : [];

  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: 40 * d * dir }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: -40 * d * dir }),
  };

  const glass = variant === "glass";
  const tick = glass ? "bg-white/20" : "bg-fg/15";
  const quietText = glass ? "text-white/65" : "text-fg/60";

  return (
    <div>
      <div className={`flex items-center justify-between gap-4 text-[13px] ${quietText}`}>
        <span id={liveId} aria-live="polite">
          {step === "results" ? t("resultsLabel") : t("stepLabel", { step: stepIndex + 1, total })}
        </span>
        <span className="flex gap-1.5" aria-hidden>
          {order.slice(0, -1).map((s, i) => (
            <span key={s} className={`h-1.5 w-7 rounded-pill ${i <= Math.min(stepIndex, total - 1) ? "bg-gold" : tick}`} />
          ))}
        </span>
      </div>

      <div className="relative mt-5 min-h-[220px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === "place" ? (
              <Choice
                variant={variant}
                legendRef={legendRef}
                title={t("steps.place")}
                options={PLACES.map((p) => ({ value: p, label: t(`options.place.${p}`), Icon: placeIcons[p] }))}
                value={place}
                onPick={(v) => {
                  setPlace(v as Place);
                  go(v === "abroad" ? "mood" : "time");
                }}
              />
            ) : null}
            {step === "time" ? (
              <Choice
                variant={variant}
                legendRef={legendRef}
                title={t("steps.time")}
                options={TIMES.map((v) => ({ value: v, label: t(`options.time.${v}`), Icon: timeIcons[v] }))}
                value={time}
                onPick={(v) => {
                  setTime(v as Time);
                  go("pace");
                }}
              />
            ) : null}
            {step === "pace" ? (
              <Choice
                variant={variant}
                legendRef={legendRef}
                title={t("steps.pace")}
                options={PACES.map((v) => ({ value: v, label: t(`options.pace.${v}`), Icon: paceIcons[v] }))}
                value={pace}
                onPick={(v) => {
                  setPace(v as Pace);
                  go("results");
                }}
              />
            ) : null}
            {step === "mood" ? (
              <Choice
                variant={variant}
                legendRef={legendRef}
                title={t("steps.mood")}
                options={MOODS.map((v) => ({ value: v, label: t(`options.mood.${v}`), Icon: moodIcons[v] }))}
                value={mood}
                onPick={(v) => {
                  setMood(v as Mood);
                  go("results");
                }}
              />
            ) : null}
            {step === "results" ? (
              <div ref={resultsRef}>
                <h3 ref={legendRef} tabIndex={-1} className={`text-2xl font-medium tracking-tight outline-none ${glass ? "text-white" : "text-fg"}`}>
                  {place === "abroad" ? t("resultsAbroad") : t("resultsTitle")}
                </h3>
                {glass ? (
                  <div className="mt-6 md:mt-5">
                    <JourneyCarousel
                      journeys={results}
                      labels={{ prev: t("prevJourney"), next: t("nextJourney") }}
                      onActive={onActive}
                    />
                  </div>
                ) : (
                  <ul className="mt-5 grid gap-4 md:mt-3 md:grid-cols-3 md:gap-3">
                    {results.map((r) => (
                      <li key={r.key} className="flex">
                        <ResultCard result={r} variant={variant} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-4">
                  {place === "abroad" ? (
                    <Link href={{ pathname: "/services/holidays", query: results[0] ? { region: results[0].key } : undefined }} className={buttonClass("primary")}>
                      {t("holidayCta")}
                      <ArrowRight size={16} weight="bold" className="rtl:rotate-180" />
                    </Link>
                  ) : (
                    <Link href="/tours" className={buttonClass("primary")}>
                      {t("seeAll")}
                      <ArrowRight size={16} weight="bold" className="rtl:rotate-180" />
                    </Link>
                  )}
                  <button type="button" onClick={reset} className={`inline-flex items-center gap-2 text-[14px] font-medium ${glass ? "text-white/75 hover:text-white" : "text-fg/70 hover:text-fg"}`}>
                    <ArrowCounterClockwise size={16} weight="bold" />
                    {t("startOver")}
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {step !== "place" && step !== "results" ? (
        <button type="button" onClick={back} className={`mt-5 inline-flex items-center gap-2 text-[14px] font-medium ${glass ? "text-white/75 hover:text-white" : "text-fg/70 hover:text-fg"}`}>
          <ArrowLeft size={16} weight="bold" className="rtl:rotate-180" />
          {t("back")}
        </button>
      ) : null}
    </div>
  );
}

// Standalone chapter version (not on the home page since the picker moved into the hero).
export function AdventurePicker({ content }: { content: Record<string, TourContent> }) {
  const t = useTranslations("Picker");
  return (
    <section id="picker" className="relative isolate overflow-hidden bg-surface py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{ background: "radial-gradient(60% 50% at 50% 0%, rgb(232 158 0 / 0.12), transparent 70%)" }}
      />
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <h2 className="max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
          {t("headline")}
        </h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-fg/80">{t("intro")}</p>
        <div className="mt-10 rounded-panel border border-fg/10 bg-surface-2 p-6 md:p-10">
          <PickerFlow content={content} variant="panel" />
        </div>
      </div>
    </section>
  );
}

type Option = { value: string; label: string; Icon: typeof Waves };

function Choice({
  title,
  options,
  value,
  onPick,
  legendRef,
  variant,
}: {
  title: string;
  options: Option[];
  value: string | null;
  onPick: (value: string) => void;
  legendRef: React.RefObject<HTMLHeadingElement | null>;
  variant: Variant;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const rtl = document.documentElement.dir === "rtl";
    const forward = e.key === (rtl ? "ArrowLeft" : "ArrowRight") || e.key === "ArrowDown";
    const backward = e.key === (rtl ? "ArrowRight" : "ArrowLeft") || e.key === "ArrowUp";
    if (!forward && !backward) return;
    e.preventDefault();
    refs.current[(i + (forward ? 1 : -1) + options.length) % options.length]?.focus();
  }

  const idle =
    variant === "glass"
      ? "glass-chip text-white/95 hover:border-gold"
      : "border-fg/12 bg-surface text-fg/90 hover:border-gold";

  return (
    <fieldset className="border-0 p-0">
      <legend className="sr-only">{title}</legend>
      <h3 ref={legendRef} tabIndex={-1} className={`text-2xl font-medium tracking-tight outline-none md:text-3xl ${variant === "glass" ? "text-white" : "text-fg"}`}>
        {title}
      </h3>
      <div role="radiogroup" aria-label={title} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o, i) => {
          const selected = value === o.value;
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={i === 0 || selected ? 0 : -1}
              onClick={() => onPick(o.value)}
              onKeyDown={(e) => onKey(e, i)}
              className={`flex min-h-16 items-center gap-3 rounded-[16px] border px-5 py-4 text-start text-[16px] font-medium transition-[transform,border-color,background-color] duration-300 ease-out-expo hover:-translate-y-0.5 ${
                selected ? "border-gold bg-gold text-panel-fg" : idle
              }`}
            >
              <o.Icon size={24} weight="fill" className={`shrink-0 ${selected ? "text-panel-fg" : "text-gold"}`} />
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// A compact suggestion: crisp photo, name, one line, duration and price.
function ResultCard({ result, variant }: { result: Result; variant: Variant }) {
  const asset = result.image ? images[result.image] : null;
  const surface = variant === "glass" ? "glass-chip" : "border-fg/10 bg-surface";
  const glass = variant === "glass";
  return (
    <Link
      href={result.href}
      className={`group flex w-full flex-col overflow-hidden rounded-[16px] border transition-[transform,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-gold ${surface}`}
    >
      {asset ? (
        <div className={`grade relative aspect-[16/10] overflow-hidden ${glass ? "md:aspect-[16/7]" : ""}`}>
          <Image
            src={asset.src}
            alt={result.title}
            fill
            sizes="(min-width: 768px) 280px, 100vw"
            placeholder="blur"
            blurDataURL={asset.blurDataURL}
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
          />
        </div>
      ) : null}
      <div className={`flex flex-1 flex-col ${glass ? "p-3" : "p-4"}`}>
        <h4 className={`text-lg font-medium leading-tight tracking-tight ${glass ? "text-white" : "text-fg"}`}>{result.title}</h4>
        <p className={`mt-1 line-clamp-2 text-[13px] ${glass ? "text-white/70 md:line-clamp-1" : "text-fg/70"}`}>{result.line}</p>
        <div className={`mt-auto flex items-end justify-between gap-3 ${glass ? "pt-3" : "pt-4"}`}>
          <div>
            <span className={`block text-[12px] ${glass ? "text-white/60" : "text-fg/60"}`}>{result.meta}</span>
            <span className={`block text-xl font-medium tracking-tight ${glass ? "text-white" : "text-fg"}`}>{result.price}</span>
            {result.basis ? <span className={`block text-[12px] ${glass ? "text-white/60" : "text-fg/60"}`}>{result.basis}</span> : null}
          </div>
          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-text underline-offset-4 group-hover:underline">
            {result.cta}
            <ArrowRight size={14} weight="bold" className="rtl:rotate-180" />
          </span>
        </div>
      </div>
    </Link>
  );
}
