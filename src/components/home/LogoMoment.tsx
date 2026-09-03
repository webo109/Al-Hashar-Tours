"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLocale, useTranslations } from "next-intl";
import { LogoMark } from "@/components/brand/Logo";
import { contours } from "./contours";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function LogoMoment() {
  const t = useTranslations("LogoMoment");
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
          .from("[data-contours]", { opacity: 0, scale: 0.9, duration: 1 }, 0)
          .from("[data-mark]", { opacity: 0, scale: 0.84, y: 24, duration: 1 }, 0.1)
          .from("[data-line]", { opacity: 0, y: 18, duration: 0.6, stagger: 0.15 }, 0.55);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="brand" className="relative isolate overflow-hidden bg-midnight">
      <div className="relative flex min-h-[100dvh] items-center justify-center px-6 py-32">
        <svg
          data-contours
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1600 860"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {contours.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#E89E00" strokeWidth="1" opacity={0.09 - i * 0.006} />
          ))}
        </svg>
        <div className="light-sweep pointer-events-none absolute inset-y-0 w-[60%]" aria-hidden />

        <div className="relative flex flex-col items-center text-center">
          <div data-mark>
            <LogoMark className="h-32 w-32 drop-shadow-[0_0_40px_rgba(232,158,0,0.35)] md:h-44 md:w-44" />
          </div>
          <p
            data-line
            className={`mt-10 text-balance text-4xl font-medium tracking-tight text-cream md:text-6xl ${
              locale === "ar" ? "font-arabic" : "font-latin"
            }`}
          >
            {t("tagline")}
          </p>
          <p
            data-line
            className={`mt-4 text-xl text-cream/60 md:text-2xl ${locale === "ar" ? "font-latin" : "font-arabic"}`}
            lang={locale === "ar" ? "en" : "ar"}
            dir={locale === "ar" ? "ltr" : "rtl"}
          >
            {t("taglineSecondary")}
          </p>
        </div>
      </div>
    </section>
  );
}
