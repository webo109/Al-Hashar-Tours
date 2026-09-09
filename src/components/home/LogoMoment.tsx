"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { buttonClass, CtaArrow } from "@/components/ui/Button";
import { contours } from "./contours";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function LogoMoment() {
  const t = useTranslations("LogoMoment");
  const stories = useTranslations("Stories");
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Controlled entrance scrubbed by the scroll, then a hold before the footer.
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top 70%", end: "top 5%", scrub: 0.6 },
          })
          .from("[data-backdrop]", { opacity: 0, scale: 1.08, duration: 1.2 }, 0)
          .from("[data-contours]", { opacity: 0, scale: 0.94, duration: 1 }, 0.08)
          .from("[data-era]", { opacity: 0, y: 42, duration: 1 }, 0.1)
          .from("[data-mark]", { opacity: 0, scale: 0.82, y: 28, duration: 1 }, 0.24)
          .from("[data-line]", { opacity: 0, y: 18, duration: 0.65, stagger: 0.14 }, 0.58);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="brand" className="relative isolate overflow-hidden bg-surface">
      <div data-backdrop className="absolute inset-0" aria-hidden>
        <Image
          src="/images/dest-wahiba-dunes.webp"
          alt=""
          fill
          sizes="100vw"
          // Dunes rather than the fort that was here: the fort's windows,
          // crenellations and palms put fine detail behind the mark and the
          // headline, and a backdrop washed to a fifth of its strength cannot
          // afford any. Sand gives long smooth curves and an open sky, which is
          // what the middle of this frame needs.
          className="object-cover object-[50%_46%] opacity-80 saturate-[0.9] contrast-[1.08]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--surface-rgb)/0.82)_0%,rgb(var(--surface-rgb)/0.42)_50%,rgb(var(--surface-rgb)/0.7)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--surface-rgb)/0.58)_0%,transparent_36%,rgb(var(--surface-rgb)/0.9)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_48%_at_50%_48%,rgb(var(--surface-rgb)/0.94)_0%,rgb(var(--surface-rgb)/0.72)_48%,transparent_76%)]" />
      </div>

      <div className="relative flex min-h-[100dvh] items-center justify-center px-6 py-32 md:min-h-[920px]">
        <svg
          data-contours
          className="pointer-events-none absolute inset-0 h-full w-full text-fg"
          viewBox="0 0 1600 860"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {contours.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="1.15" opacity={0.1 - i * 0.008} />
          ))}
        </svg>

        <div
          data-era
          className="pointer-events-none absolute inset-x-0 top-[13%] flex justify-center overflow-hidden opacity-[0.09]"
          aria-hidden
        >
          <span className="font-latin text-[clamp(9rem,24vw,22rem)] font-semibold leading-none tracking-[-0.09em] text-fg">
            1984
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,transparent,var(--color-surface)_82%)]" aria-hidden />
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] w-full text-surface-3"
          viewBox="0 0 1600 220"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 185L0 142L110 131L190 145L300 111L405 129L520 93L615 118L735 77L820 98L940 57L1040 93L1165 50L1270 82L1395 42L1490 69L1600 52L1600 220L0 220Z"
            fill="currentColor"
          />
        </svg>

        <p className="absolute bottom-16 left-8 hidden font-latin text-[11px] font-medium uppercase tracking-[0.34em] text-fg/70 lg:block">
          Muscat · Sultanate of Oman
        </p>

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
          <div data-mark>
            <LogoMark className="h-48 w-48 drop-shadow-[0_16px_32px_rgba(0,0,0,0.42)] md:h-72 md:w-72" />
          </div>
          <p
            data-line
            className={`mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-fg drop-shadow-[0_2px_12px_rgb(var(--surface-rgb)/0.9)] sm:text-5xl md:mt-2 md:text-7xl ${
              locale === "ar" ? "font-arabic" : "font-latin"
            }`}
          >
            {t("tagline")}
          </p>
          <p
            data-line
            className={`mt-5 text-xl font-medium text-fg/75 md:text-2xl ${locale === "ar" ? "font-latin" : "font-arabic"}`}
            lang={locale === "ar" ? "en" : "ar"}
            dir={locale === "ar" ? "ltr" : "rtl"}
          >
            {t("taglineSecondary")}
          </p>
          <div data-line className="mt-9">
            <Link href="/tours" className={buttonClass("primary")}>
              {stories("allTours")}
              <CtaArrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
