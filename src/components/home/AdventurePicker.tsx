"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
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
import { TourCard } from "@/components/tours/TourCard";
import { images } from "@/data/images.generated";
import type { TourContent } from "@/data/tours";
import type { Mood, WorldPackage } from "@/data/world";
import { suggestTours, suggestWorld, type Pace, type Place, type Time } from "@/data/adventure";
import { formatOmr } from "@/lib/format";
import { burstFrom } from "@/lib/confetti";

type Step = "place" | "time" | "pace" | "mood" | "results";

const placeIcons = { sea: Waves, mountains: Mountains, desert: SunHorizon, heritage: CastleTurret, abroad: AirplaneTilt } as const;
const timeIcons = { halfDay: SunHorizon, fullDay: SunHorizon, severalDays: Tree } as const;
const paceIcons = { easy: PersonSimpleWalk, active: PersonSimpleHike } as const;
const moodIcons = { beach: Island, city: Buildings, nature: Tree, culture: CastleTurret } as const;

const PLACES: Place[] = ["sea", "mountains", "desert", "heritage", "abroad"];
const TIMES: Time[] = ["halfDay", "fullDay", "severalDays"];
const PACES: Pace[] = ["easy", "active"];
const MOODS: Mood[] = ["beach", "city", "nature", "culture"];

export function AdventurePicker({ content }: { content: Record<string, TourContent> }) {
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
    legendRef.current?.focus({ preventScroll: true });
  }, [step]);

  function go(next: Step, forward = true) {
    setDirection(forward ? 1 : -1);
    setStep(next);
  }

  function choosePlace(p: Place) {
    setPlace(p);
    go(p === "abroad" ? "mood" : "time");
  }

  function back() {
    const prev = order[Math.max(0, stepIndex - 1)];
    go(prev, false);
  }

  function reset() {
    setPlace(null);
    setTime(null);
    setPace(null);
    setMood(null);
    go("place", false);
  }

  const tourResults = step === "results" && place && place !== "abroad" && time && pace ? suggestTours({ place, time, pace }) : [];
  const worldResults = step === "results" && place === "abroad" && mood ? suggestWorld(mood) : [];

  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: 40 * d * dir }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: -40 * d * dir }),
  };

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
          <div className="flex items-center justify-between gap-4 text-[13px] text-fg/60">
            <span id={liveId} aria-live="polite">
              {step === "results" ? t("resultsLabel") : t("stepLabel", { step: stepIndex + 1, total })}
            </span>
            <span className="flex gap-1.5" aria-hidden>
              {order.slice(0, -1).map((s, i) => (
                <span key={s} className={`h-1.5 w-7 rounded-pill ${i <= Math.min(stepIndex, total - 1) ? "bg-gold" : "bg-fg/15"}`} />
              ))}
            </span>
          </div>

          <div className="relative mt-6 min-h-[260px]">
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
                    legendRef={legendRef}
                    title={t("steps.place")}
                    options={PLACES.map((p) => ({ value: p, label: t(`options.place.${p}`), Icon: placeIcons[p] }))}
                    value={place}
                    onPick={(v) => choosePlace(v as Place)}
                  />
                ) : null}
                {step === "time" ? (
                  <Choice
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
                    <h3 ref={legendRef} tabIndex={-1} className="text-2xl font-medium tracking-tight text-fg outline-none">
                      {place === "abroad" ? t("resultsAbroad") : t("resultsTitle")}
                    </h3>
                    {place === "abroad" ? (
                      <ul className="mt-6 grid gap-5 md:grid-cols-3">
                        {worldResults.map((pkg) => (
                          <li key={pkg.key}>
                            <WorldMiniCard pkg={pkg} name={world(`items.${pkg.key}.name`)} cities={world(`items.${pkg.key}.cities`)} nights={tours("nights", { count: pkg.nights })} priceText={formatOmr(locale, pkg.priceFrom, common("currency"))} basis={price("twinShare")} cta={world("cta")} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="mt-6 grid gap-5 md:grid-cols-3">
                        {tourResults.map((tour) => {
                          const c = content[tour.slug];
                          return c ? (
                            <li key={tour.slug} className="flex">
                              <TourCard tour={tour} content={c} />
                            </li>
                          ) : null;
                        })}
                      </ul>
                    )}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      {place === "abroad" ? (
                        <Link href={{ pathname: "/services/holidays", query: worldResults[0] ? { region: worldResults[0].key } : undefined }} className={buttonClass("primary")}>
                          {t("holidayCta")}
                          <ArrowRight size={16} weight="bold" className="rtl:rotate-180" />
                        </Link>
                      ) : (
                        <Link href="/tours" className={buttonClass("primary")}>
                          {t("seeAll")}
                          <ArrowRight size={16} weight="bold" className="rtl:rotate-180" />
                        </Link>
                      )}
                      <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-[14px] font-medium text-fg/70 hover:text-fg">
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
            <button type="button" onClick={back} className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-fg/70 hover:text-fg">
              <ArrowLeft size={16} weight="bold" className="rtl:rotate-180" />
              {t("back")}
            </button>
          ) : null}
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
}: {
  title: string;
  options: Option[];
  value: string | null;
  onPick: (value: string) => void;
  legendRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const rtl = document.documentElement.dir === "rtl";
    const forward = e.key === (rtl ? "ArrowLeft" : "ArrowRight") || e.key === "ArrowDown";
    const backward = e.key === (rtl ? "ArrowRight" : "ArrowLeft") || e.key === "ArrowUp";
    if (!forward && !backward) return;
    e.preventDefault();
    const next = (i + (forward ? 1 : -1) + options.length) % options.length;
    refs.current[next]?.focus();
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="sr-only">{title}</legend>
      <h3 ref={legendRef} tabIndex={-1} className="text-2xl font-medium tracking-tight text-fg outline-none md:text-3xl">
        {title}
      </h3>
      <div role="radiogroup" aria-label={title} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              className={`flex min-h-16 items-center gap-3 rounded-panel border px-5 py-4 text-start text-[16px] font-medium transition-[transform,border-color,background-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-gold ${
                selected ? "border-gold bg-gold/12 text-fg" : "border-fg/12 bg-surface text-fg/90"
              }`}
            >
              <o.Icon size={24} weight="fill" className="shrink-0 text-gold" />
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function WorldMiniCard({
  pkg,
  name,
  cities,
  nights,
  priceText,
  basis,
  cta,
}: {
  pkg: WorldPackage;
  name: string;
  cities: string;
  nights: string;
  priceText: string;
  basis: string;
  cta: string;
}): ReactNode {
  const asset = pkg.image ? images[pkg.image] : null;
  return (
    <Link
      href={{ pathname: "/services/holidays", query: { region: pkg.key } }}
      className="group flex h-full flex-col overflow-hidden rounded-panel border border-fg/10 bg-surface transition-[transform,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-gold/45"
    >
      {asset ? (
        <div className="grade relative aspect-[16/10] overflow-hidden">
          <Image src={asset.src} alt={name} fill sizes="(min-width: 768px) 360px, 100vw" placeholder="blur" blurDataURL={asset.blurDataURL} className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <h4 className="text-xl font-medium tracking-tight text-fg">{name}</h4>
        <p className="mt-1 text-[14px] text-fg/70">{cities}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <span className="block text-[12px] text-fg/60">{nights}</span>
            <span className="block text-xl font-medium text-fg">{priceText}</span>
            <span className="block text-[12px] text-fg/60">{basis}</span>
          </div>
          <span className="text-[14px] font-medium text-accent-text underline-offset-4 group-hover:underline">{cta}</span>
        </div>
      </div>
    </Link>
  );
}
