"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { images } from "@/data/images.generated";
import { company } from "@/data/company";
import type { TourContent } from "@/data/tours";
import { getVideo } from "@/data/videos.generated";
import { whatsappUrl } from "@/lib/whatsapp";
import { scrollToTarget, useLenisRef } from "@/components/motion/SmoothScroll";
import { requestBookingTab } from "@/components/nav/FloatingNav";
import { AmbientVideo } from "@/components/media/AmbientVideo";
import { VideoControl } from "@/components/media/VideoControl";
import { PickerFlow } from "@/components/home/AdventurePicker";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const heroClip = getVideo("hero-oman-drone");
const still = images["dest-nizwa-fort-palms"];
const socialIcon = { instagram: InstagramLogo, facebook: FacebookLogo, linkedin: LinkedinLogo } as const;

// One crisp full-bleed clip, and over it a frosted glass card that holds the
// picker. The photograph stays sharp outside the card and is blurred and
// darkened only behind it.
export function Hero({ content }: { content: Record<string, TourContent> }) {
  const t = useTranslations("Hero");
  const picker = useTranslations("Picker");
  const root = useRef<HTMLElement>(null);
  const lenisRef = useLenisRef();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance: the photograph settles, then the glass rises and its contents follow.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-bg]", { scale: 1.06, opacity: 0.6, duration: 2.2 })
          .from("[data-glass]", { opacity: 0, y: 40, duration: 1.3 }, "-=1.7")
          .from("[data-glass-item]", { opacity: 0, y: 16, duration: 0.9, stagger: 0.08 }, "-=1.0");

        // Depth on scroll: the photograph lags, the glass leads.
        const scrollTrigger = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-bg]", { y: 70, ease: "none", scrollTrigger });
        gsap.to("[data-glass]", { y: -28, ease: "none", scrollTrigger });
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

  return (
    <section ref={root} id="hero" className="relative isolate z-[4] overflow-hidden bg-surface">
      <div data-bg className="absolute inset-0 will-change-transform" aria-hidden>
        {heroClip ? (
          <Image
            src={heroClip.poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: heroClip.position }}
          />
        ) : (
          <Image
            src={still.src}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={still.blurDataURL}
            className="object-cover object-[50%_40%]"
          />
        )}
        <AmbientVideo video={heroClip} mode="ambient" />
        <div className="absolute inset-x-0 bottom-0 h-[14%] bg-[linear-gradient(180deg,transparent,var(--color-surface))]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1200px] items-center justify-center px-4 pt-28 pb-16 md:items-start md:px-10 md:pt-24 md:pb-8">
        <div data-glass className="glass hero-glass-copy w-full max-w-[860px] p-6 md:p-8">
          <p data-glass-item className="text-[14px] font-medium text-white/75">{t("headline")}</p>
          <h1 data-glass-item className="mt-2 text-balance text-4xl font-medium leading-[1.02] tracking-tight text-white md:text-6xl">
            {picker("headline")}
          </h1>
          <p data-glass-item className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-white/75 md:text-lg">
            {picker("intro")}
          </p>

          <div data-glass-item className="mt-7 md:mt-5">
            <PickerFlow content={content} variant="glass" />
          </div>

          <div data-glass-item className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/12 pt-5 md:mt-5 md:pt-4">
            <span className="inline-flex items-center gap-2 rounded-pill border border-white/25 px-3.5 py-1.5 text-[13px] text-white/85">
              <MapPin size={14} weight="fill" className="text-gold" />
              {t("location")}
            </span>
            <div className="flex items-center gap-0.5">
              {company.socials.map((s) => {
                const Icon = socialIcon[s.key as keyof typeof socialIcon];
                return Icon ? (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-pill text-white/75 transition-colors hover:text-accent-text"
                  >
                    <Icon size={18} weight="fill" />
                  </a>
                ) : null;
              })}
              <a
                href={whatsappUrl(company.whatsapp.digits, "")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-pill text-white/75 transition-colors hover:text-accent-text"
              >
                <WhatsappLogo size={18} weight="fill" />
              </a>
            </div>
            <button
              type="button"
              onClick={planJourney}
              className="ms-auto inline-flex items-center gap-1.5 text-[14px] font-medium text-accent-text underline-offset-4 hover:underline"
            >
              {t("primaryCta")}
              <ArrowRight size={14} weight="bold" className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {heroClip ? (
        <VideoControl
          className="absolute bottom-5 start-5 z-30 md:bottom-8 md:start-8"
          pauseLabel={t("pauseVideo")}
          playLabel={t("playVideo")}
        />
      ) : null}
    </section>
  );
}
