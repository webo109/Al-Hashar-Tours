"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { images } from "@/data/images.generated";
import { Button } from "@/components/ui/Button";
import { scrollToTarget, useLenisRef } from "@/components/motion/SmoothScroll";
import { requestBookingTab } from "@/components/nav/FloatingNav";
import { SkyLayer } from "./SkyLayer";
import { BoardingPass } from "./BoardingPass";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function mask(stops: string): CSSProperties {
  const value = `linear-gradient(to bottom, ${stops})`;
  return { WebkitMaskImage: value, maskImage: value };
}

const range = images["plane-hajar-sunset"];
const plate = images["hero-muscat-coast"];
const dunes = images["dest-wahiba-dunes"];

export function Hero() {
  const t = useTranslations("Hero");
  const root = useRef<HTMLElement>(null);
  const lenisRef = useLenisRef();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance: background first, then the planes, then the copy and the pass.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from('[data-layer="sky"]', { opacity: 0, duration: 1.4 })
          .from(
            '[data-enter="plane"]',
            { opacity: 0, y: 36, duration: 1.6, stagger: 0.14 },
            "-=0.9",
          )
          .from('[data-copy]', { opacity: 0, y: 22, duration: 1.1, stagger: 0.09 }, "-=1.1")
          .from(
            '[data-enter="pass"]',
            { opacity: 0, y: 28, scale: 0.98, duration: 1.2 },
            "-=0.9",
          );

        // Parallax: distant planes lag behind the scroll, the foreground leads it.
        const scrollTrigger = {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        };
        gsap.to('[data-parallax="range"]', { y: 130, ease: "none", scrollTrigger });
        gsap.to('[data-parallax="mist"]', { y: 100, ease: "none", scrollTrigger });
        gsap.to('[data-parallax="plate"]', { y: 70, ease: "none", scrollTrigger });
        gsap.to('[data-parallax="pass"]', { y: 36, ease: "none", scrollTrigger });
        gsap.to('[data-parallax="foreground"]', { y: -80, ease: "none", scrollTrigger });
        gsap.to('[data-copy-group]', {
          y: 60,
          opacity: 0,
          ease: "none",
          scrollTrigger: { ...scrollTrigger, end: "65% top" },
        });
      });
    },
    { scope: root },
  );

  function planJourney() {
    requestBookingTab("flights");
    scrollToTarget(lenisRef?.current, "#booking", -110);
    window.setTimeout(() => {
      document.querySelector<HTMLInputElement>("#booking input")?.focus({ preventScroll: true });
    }, 900);
  }

  function exploreOman() {
    scrollToTarget(lenisRef?.current, "#tours", 0);
  }

  return (
    <section ref={root} id="hero" className="relative isolate overflow-hidden bg-midnight">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <SkyLayer />

        <div data-parallax="range" className="absolute inset-x-0 bottom-[24%] h-[54%]">
          <div data-enter="plane" className="absolute inset-0" style={mask("transparent 0%, black 46%, black 100%")}>
            <Image
              src={range.src}
              alt=""
              fill
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL={range.blurDataURL}
              className="object-cover object-bottom brightness-[.9] saturate-[.85]"
            />
            <div className="absolute inset-0 bg-midnight/40 mix-blend-multiply" />
          </div>
        </div>

        <div data-parallax="mist" className="absolute inset-x-[-12%] bottom-[30%] h-[16%]">
          <div className="mist absolute inset-0" />
        </div>

        <div data-parallax="plate" className="absolute inset-x-0 bottom-0 h-[76%]">
          <div
            data-enter="plane"
            className="grade absolute inset-0"
            style={mask("transparent 0%, black 30%, black 100%")}
          >
            <Image
              src={plate.src}
              alt={t("imageAlt")}
              fill
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL={plate.blurDataURL}
              className="object-cover object-[50%_62%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(11,18,32,0.4)_70%,rgba(11,18,32,0.9)_100%)]" />
          </div>
        </div>

        <div className="absolute inset-y-0 start-0 w-[72%] bg-[radial-gradient(70%_60%_at_18%_52%,rgba(11,18,32,0.82),transparent_72%)] rtl:bg-[radial-gradient(70%_60%_at_82%_52%,rgba(11,18,32,0.82),transparent_72%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pt-32 pb-40 md:px-10 lg:grid-cols-[1.05fr_minmax(380px,460px)] lg:gap-16 lg:pt-24 lg:pb-36">
        <div data-copy-group className="max-w-[600px]">
          <h1
            data-copy
            className="text-balance text-5xl font-medium leading-[1.02] tracking-tight text-cream md:text-6xl lg:text-[76px]"
          >
            {t("headline")}
          </h1>
          <p data-copy className="mt-6 max-w-[36ch] text-lg leading-relaxed text-cream/82 md:text-xl">
            {t("subtext")}
          </p>
          <div data-copy className="mt-9 flex flex-wrap gap-3">
            <Button onClick={planJourney}>{t("primaryCta")}</Button>
            <Button variant="secondary" onClick={exploreOman}>
              {t("secondaryCta")}
            </Button>
          </div>
        </div>

        <div data-parallax="pass" className="relative">
          <div data-enter="pass">
            <BoardingPass />
          </div>
        </div>
      </div>

      <div
        data-parallax="foreground"
        className="pointer-events-none absolute inset-x-[-4%] bottom-[-3%] z-20 h-[40%]"
        aria-hidden
      >
        <div data-enter="plane" className="absolute inset-0" style={mask("transparent 0%, black 28%, black 100%")}>
          <Image
            src={dunes.src}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover object-[50%_40%] brightness-[.3] saturate-[.7]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(232,158,0,0.3)_0%,rgba(232,158,0,0.08)_24%,transparent_48%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,transparent,#0b1220)]" />
        </div>
      </div>
    </section>
  );
}
