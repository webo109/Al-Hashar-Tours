"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";

// Scrolls a snap rail by one card; the direction follows the writing mode.
export function RailControls({
  target,
  prevLabel,
  nextLabel,
}: {
  target: string;
  prevLabel: string;
  nextLabel: string;
}) {
  function step(direction: 1 | -1) {
    const rail = document.getElementById(target);
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("li");
    const width = (card?.offsetWidth ?? 320) + 20;
    const rtl = getComputedStyle(rail).direction === "rtl";
    rail.scrollBy({ left: direction * width * (rtl ? -1 : 1), behavior: "smooth" });
  }

  const button =
    "flex h-11 w-11 items-center justify-center rounded-pill border border-fg/15 text-fg transition-colors hover:border-gold hover:text-accent-text";

  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => step(-1)} aria-label={prevLabel} className={button}>
        <CaretLeft size={18} weight="bold" className="rtl:-scale-x-100" />
      </button>
      <button type="button" onClick={() => step(1)} aria-label={nextLabel} className={button}>
        <CaretRight size={18} weight="bold" className="rtl:-scale-x-100" />
      </button>
    </div>
  );
}
