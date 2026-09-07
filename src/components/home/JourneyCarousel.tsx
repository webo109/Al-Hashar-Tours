"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { images, type ImageKey } from "@/data/images.generated";

export type Journey = {
  key: string;
  image: ImageKey | null;
  title: string;
  line: string;
  meta: string;
  price: string;
  basis: string;
  href: React.ComponentProps<typeof Link>["href"];
  cta: string;
};

// The picker's payoff: the suggested journeys as a centre-focused rail, the
// active one full size with its neighbours peeking in at both edges. The hero
// listens for the active card so it can blur that journey's own photograph
// behind the whole stage.
export function JourneyCarousel({
  journeys,
  labels,
  onActive,
}: {
  journeys: Journey[];
  labels: { prev: string; next: string };
  onActive?: (image: ImageKey | null) => void;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // Whichever card sits nearest the middle of the rail is the active one. This
  // reads the same in RTL, where the rail is mirrored but the geometry is not.
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

  // Only the photograph matters to the hero, so this fires when the card in the
  // middle changes rather than on every render of a freshly built list.
  const activeImage = journeys[active]?.image ?? null;
  useEffect(() => {
    onActive?.(activeImage);
  }, [activeImage, onActive]);

  function step(direction: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const width = (card?.offsetWidth ?? 288) + 16;
    const rtl = getComputedStyle(el).direction === "rtl";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * width * (rtl ? -1 : 1), behavior: reduce ? "auto" : "smooth" });
  }

  const arrow =
    "flex h-10 w-10 items-center justify-center rounded-pill border border-white/25 text-white/80 transition-colors hover:border-gold hover:text-accent-text";

  return (
    <div className="relative">
      <ul
        ref={rail}
        role="list"
        // The inline padding is half the rail minus half a card, so the first and
        // last journey can still settle in the middle.
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[calc(50%-9rem)] pb-1 [scrollbar-width:none] sm:px-[calc(50%-10.5rem)] [&::-webkit-scrollbar]:hidden"
      >
        {journeys.map((journey, i) => {
          const asset = journey.image ? images[journey.image] : null;
          const isActive = i === active;
          return (
            <li
              key={journey.key}
              className={`w-72 shrink-0 snap-center transition-[transform,opacity] duration-500 ease-out-expo motion-reduce:transition-none sm:w-[21rem] ${
                isActive ? "scale-100 opacity-100" : "scale-[0.92] opacity-55"
              }`}
            >
              <Link
                href={journey.href}
                tabIndex={isActive ? 0 : -1}
                className="group block overflow-hidden rounded-[22px] border border-white/20"
              >
                <div className="grade relative aspect-[3/4]">
                  {asset ? (
                    <Image
                      src={asset.src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 336px, 288px"
                      placeholder="blur"
                      blurDataURL={asset.blurDataURL}
                      className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 h-[68%] bg-[linear-gradient(180deg,transparent,rgb(11_18_32/0.55)_45%,rgb(11_18_32/0.92))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h4 className="text-xl font-medium leading-tight tracking-tight text-white">{journey.title}</h4>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-white/75">{journey.line}</p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <span className="block text-[12px] text-white/65">{journey.meta}</span>
                        <span className="block text-xl font-medium tracking-tight text-white">{journey.price}</span>
                        {journey.basis ? <span className="block text-[12px] text-white/65">{journey.basis}</span> : null}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-text underline-offset-4 group-hover:underline">
                        {journey.cta}
                        <ArrowRight size={14} weight="bold" className="rtl:rotate-180" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Touch swipes the rail; a pointer needs something to press. */}
      <div className="mt-5 hidden items-center justify-center gap-2 sm:flex">
        <button type="button" onClick={() => step(-1)} aria-label={labels.prev} className={arrow}>
          <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" />
        </button>
        <div className="flex items-center gap-1.5 px-2">
          {journeys.map((journey, i) => (
            <span
              key={journey.key}
              aria-hidden
              className={`h-1 rounded-pill transition-all duration-500 ${
                i === active ? "w-6 bg-gold" : "w-2.5 bg-white/30"
              }`}
            />
          ))}
        </div>
        <button type="button" onClick={() => step(1)} aria-label={labels.next} className={arrow}>
          <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
}
