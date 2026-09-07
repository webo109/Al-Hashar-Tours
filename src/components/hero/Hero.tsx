"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { MapPin } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { images } from "@/data/images.generated";
import { featuredTours } from "@/data/tours";
import type { TourContent } from "@/data/tours";

const SLIDE_MS = 6000;

// The first screen: a slideshow that fills the viewport under the floating
// header. The photograph on show is repeated behind everything, blurred far
// past legibility, so the whole stage takes its colour from the active slide.
export function Hero({ content }: { content: Record<string, TourContent> }) {
  const t = useTranslations("Hero");
  const regions = useTranslations("Regions");
  const rail = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  const slides = featuredTours()
    .map((tour) => ({ tour, copy: content[tour.slug] }))
    .filter((slide) => slide.copy && images[slide.tour.image]);

  // Whichever card sits nearest the middle is the active one. Reading geometry
  // rather than scroll offsets keeps this correct in RTL, where the rail is
  // mirrored and scrollLeft is not comparable across browsers.
  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const middle = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0;
    let shortest = Infinity;
    Array.from(el.children).forEach((card, i) => {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - middle);
      if (distance < shortest) {
        shortest = distance;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    sync();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sync]);

  const goTo = useCallback((index: number, smooth = true) => {
    const el = rail.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({
      behavior: smooth && !reduce ? "smooth" : "auto",
      inline: "center",
      block: "nearest",
    });
  }, []);

  // Advances on its own, and stands still while a pointer or the keyboard is on
  // it, or when the reader has asked for less motion.
  useEffect(() => {
    if (held || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % slides.length;
        goTo(next);
        return current;
      });
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [held, slides.length, goTo]);

  const current = slides[active];

  return (
    <section
      id="hero"
      className="relative isolate z-[4] flex min-h-[100dvh] flex-col overflow-hidden bg-surface"
    >
      {slides.map((slide, i) => {
        const asset = images[slide.tour.image];
        return (
          <div
            key={slide.tour.slug}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out-expo ${
              i === active ? "opacity-100" : "opacity-0"
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
              className="scale-[1.15] object-cover blur-[34px]"
            />
          </div>
        );
      })}
      {/* Enough to hold white type, not so much that the slide loses its colour. */}
      <div className="absolute inset-0 bg-[rgb(11_18_32/0.42)]" aria-hidden />
      {/* The hero still has to melt into the page below it. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[12%] bg-[linear-gradient(180deg,transparent_0%,rgb(11_18_32/0.35)_45%,var(--color-surface)_100%)]"
        aria-hidden
      />

      <div
        className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-10 pt-28 md:gap-7 md:px-10 md:pt-24"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
      >
        <motion.div
          key={`copy-${active}`}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-6xl">
            {current ? current.copy.name : t("headline")}
          </h1>
          <p className="mx-auto mt-3 max-w-[46ch] text-balance text-[15px] leading-relaxed text-white/75 md:text-lg">
            {current ? current.copy.tagline : t("subtext")}
          </p>
        </motion.div>

        <ul
          ref={rail}
          role="list"
          // Card width and the rail's inline padding both come from --card-w, so
          // the first and last slide land dead centre at every size. Deriving one
          // from a guess at the other put the active card off centre.
          // The max-width keeps the frame to one card and two slivers, the way the
          // reference reads; without it a wide screen simply shows more cards.
          className="mx-auto flex w-full max-w-[calc(var(--card-w)*2.35)] snap-x snap-mandatory items-center gap-4 overflow-x-auto overscroll-x-contain px-[calc(50%-var(--card-w)/2)] [--card-w:clamp(170px,24vh,280px)] [scrollbar-width:none] md:gap-6 lg:[--card-w:clamp(190px,30vh,330px)] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, i) => {
            const asset = images[slide.tour.image];
            const isActive = i === active;
            return (
              <li
                key={slide.tour.slug}
                className={`aspect-[5/9] w-[var(--card-w)] shrink-0 snap-center transition-[transform,opacity] duration-700 ease-out-expo motion-reduce:transition-none lg:aspect-[2/3] ${
                  isActive ? "scale-100 opacity-100" : "scale-[0.96] opacity-75"
                }`}
              >
                {isActive ? (
                  <Link
                    href={`/tours/${slide.tour.slug}`}
                    aria-label={slide.copy.name}
                    className="group block h-full w-full overflow-hidden rounded-[26px] shadow-[0_30px_70px_-30px_rgb(0_0_0/0.75)]"
                  >
                    <Image
                      src={asset.src}
                      alt={slide.copy.name}
                      width={asset.width}
                      height={asset.height}
                      placeholder="blur"
                      blurDataURL={asset.blurDataURL}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={slide.copy.name}
                    className="block h-full w-full overflow-hidden rounded-[26px]"
                  >
                    <Image
                      src={asset.src}
                      alt=""
                      width={asset.width}
                      height={asset.height}
                      placeholder="blur"
                      blurDataURL={asset.blurDataURL}
                      className="h-full w-full object-cover"
                    />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center gap-4">
          <motion.div
            key={`place-${active}`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <MapPin size={20} weight="fill" className="mx-auto text-gold" />
            <p className="mt-1.5 text-[14px] font-medium text-white/85">
              {current ? regions(current.tour.regions[0]) : t("location")}
            </p>
          </motion.div>
          <div className="flex items-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.tour.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={slide.copy.name}
                aria-current={i === active}
                className={`h-1 rounded-pill transition-all duration-500 ${
                  i === active ? "w-6 bg-gold" : "w-2.5 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
