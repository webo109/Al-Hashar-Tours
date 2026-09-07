"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight, MapPin } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { scrollToTarget, useLenisRef } from "@/components/motion/SmoothScroll";
import { images } from "@/data/images.generated";
import { featuredTours } from "@/data/tours";
import type { TourContent } from "@/data/tours";
import { buttonClass } from "@/components/ui/Button";
import muscatMomentsHero from "../../../public/images/hero-muscat-moments-v2.webp";
import jabalAkhdarHero from "../../../public/images/hero-jabal-akhdar-v2.webp";
import glimpseOmanHero from "../../../public/images/hero-glimpse-oman-v2.webp";

const SLIDE_MS = 6500;

// The first screen, in the shape Al-Hashar's own site uses: one photograph
// filling the frame, a line centred over it, arrows at the edges and dots
// beneath. What is different is that every slide is a real published journey,
// so it carries a name, a place and somewhere to go.
export function Hero({ content }: { content: Record<string, TourContent> }) {
  const t = useTranslations("Hero");
  const tours = useTranslations("Tours");
  const picker = useTranslations("Picker");
  const regions = useTranslations("Regions");
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const lenisRef = useLenisRef();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  // Whatever section follows the hero, rather than a hard-coded id, so the cue
  // keeps working if the running order changes.
  function scrollOn() {
    const next = root.current?.nextElementSibling;
    if (next instanceof HTMLElement) scrollToTarget(lenisRef?.current, next, -80);
  }

  // The hero prefers the close-framed shot where a tour has one, so the first
  // screen shows a place rather than a vista; cards keep the wider photograph.
  const slides = featuredTours()
    .map((tour) => ({ tour, copy: content[tour.slug], art: tour.heroImage ?? tour.image }))
    .filter((slide) => slide.copy && images[slide.art]);

  const count = slides.length;
  const step = useCallback(
    (direction: 1 | -1) => {
      setActive((current) => (current + direction + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (held || count < 2 || reduce) return;
    const id = window.setInterval(() => setActive((c) => (c + 1) % count), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [held, count, reduce]);

  const current = slides[active];

  return (
    <section
      ref={root}
      id="hero"
      className="relative isolate z-[4] min-h-[100dvh] overflow-hidden bg-surface"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      {slides.map((slide, i) => {
        const asset =
          slide.tour.slug === "muscat-moments"
            ? muscatMomentsHero
            : slide.tour.slug === "jabal-akhdar-day-tour"
            ? jabalAkhdarHero
            : slide.tour.slug === "glimpse-oman"
              ? glimpseOmanHero
            : images[slide.art];
        const isActive = i === active;
        return (
          <div
            key={slide.tour.slug}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out-expo ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          >
            <Image
              src={asset.src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={asset.blurDataURL}
              className={`object-cover ${
                slide.tour.slug === "jabal-akhdar-day-tour"
                  ? "object-[72%_center] lg:object-center"
                  : "object-center"
              }`}
              // A slow drift while the slide holds, easing back as it leaves.
              style={
                reduce
                  ? undefined
                  : {
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                      transition: isActive
                        ? `transform ${SLIDE_MS + 1200}ms linear`
                        : "transform 1200ms cubic-bezier(0.16,1,0.3,1)",
                    }
              }
            />
          </div>
        );
      })}

      {/* Dark enough at top and bottom to hold the header, the copy and the controls. */}
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_18_32/0.52)_0%,rgb(11_18_32/0.3)_38%,rgb(11_18_32/0.78)_100%)]"
        aria-hidden
      />
      {/* Slides differ wildly in brightness; this keeps the centred copy legible
          over a pale rock face as well as a dark sea. */}
      <div
        className="absolute inset-0 bg-[radial-gradient(58%_44%_at_50%_48%,rgb(11_18_32/0.5)_0%,transparent_72%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[14%] bg-[linear-gradient(180deg,transparent_0%,rgb(11_18_32/0.4)_45%,var(--color-surface)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 pb-28 pt-28 text-center md:px-16">
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/80">
            <MapPin size={14} weight="fill" className="text-gold" />
            {current ? regions(current.tour.regions[0]) : t("location")}
          </span>
          <h1 className="mt-4 max-w-[16ch] text-balance text-4xl font-medium leading-[1.03] tracking-tight text-white md:text-6xl lg:text-7xl">
            {current ? current.copy.name : t("headline")}
          </h1>
          <p className="mt-4 max-w-[52ch] text-balance text-[16px] leading-relaxed text-white/80 md:text-xl">
            {current ? current.copy.tagline : t("subtext")}
          </p>
          {current ? (
            <Link
              href={`/tours/${current.tour.slug}`}
              // The primary variant already sets a text colour, and two utilities of
              // equal specificity would tie. Tailwind v4 takes the bang as a suffix.
              className={buttonClass("primary", "glow-breathe mt-9 text-white!")}
            >
              {tours("view")}
            </Link>
          ) : null}
        </motion.div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={picker("prevJourney")}
            className="absolute start-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill text-white/70 transition-colors hover:bg-white/10 hover:text-white md:start-6"
          >
            <CaretLeft size={26} weight="light" className="rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={picker("nextJourney")}
            className="absolute end-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill text-white/70 transition-colors hover:bg-white/10 hover:text-white md:end-6"
          >
            <CaretRight size={26} weight="light" className="rtl:-scale-x-100" />
          </button>

          <div className="absolute inset-x-0 bottom-20 z-20 flex items-center justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.tour.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-label={slide.copy.name}
                aria-current={i === active}
                className="group py-2"
              >
                {i === active ? (
                  // The fill runs down with the slide's turn, and holds while the
                  // slideshow is paused under a pointer.
                  <span className="block h-1.5 w-7 overflow-hidden rounded-pill bg-white/30">
                    <span
                      key={active}
                      className="hero-dot-fill block h-full w-full rounded-pill bg-gold"
                      style={{
                        animationDuration: `${SLIDE_MS}ms`,
                        animationPlayState: held ? "paused" : "running",
                      }}
                    />
                  </span>
                ) : (
                  <span className="block h-1.5 w-1.5 rounded-pill bg-white/45 transition-colors group-hover:bg-white/80" />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollOn}
            className="group absolute inset-x-0 bottom-6 z-20 mx-auto flex w-fit flex-col items-center gap-2"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55 transition-colors group-hover:text-white/90">
              {t("scroll")}
            </span>
            <span
              className="flex h-7 w-[18px] justify-center rounded-pill border border-white/35 pt-1.5 transition-colors group-hover:border-white/70"
              aria-hidden
            >
              <span className="scroll-cue-dot h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
          </button>
        </>
      ) : null}
    </section>
  );
}
