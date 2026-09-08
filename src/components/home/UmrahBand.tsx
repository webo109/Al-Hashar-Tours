"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { images } from "@/data/images.generated";
import { buttonClass, CtaArrow } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function UmrahBand() {
  const t = useTranslations("Umrah");
  const root = useRef<HTMLElement>(null);
  const asset = images["umrah-haram-night"];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The image enters through the arch as the band scrolls in; the copy follows.
        gsap.from("[data-arch]", {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });
        gsap.from("[data-reveal]", {
          opacity: 0,
          y: 24,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="umrah" className="relative bg-surface">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-6 py-24 md:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20 lg:py-32">
        <div
          data-arch
          className="grade relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]"
          style={{ borderRadius: "50% 50% 20px 20px / 32% 32% 20px 20px", clipPath: "inset(0% 0% 0% 0%)" }}
        >
          <Image
            src={asset.src}
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            placeholder="blur"
            blurDataURL={asset.blurDataURL}
            className="object-cover"
          />
        </div>

        <div>
          <h2 data-reveal className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-5xl">
            {t("headline")}
          </h2>
          <p data-reveal className="mt-5 max-w-[48ch] text-lg leading-relaxed text-fg/80">
            {t("body")}
          </p>
          <ul data-reveal className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {(["visa", "flights", "hotels", "guidance"] as const).map((k) => (
              <li key={k} className="flex items-start gap-2.5 text-[15px] text-fg/85">
                <Check size={16} weight="bold" className="mt-1 shrink-0 text-gold" />
                {t(`inclusions.${k}`)}
              </li>
            ))}
          </ul>
          <div data-reveal>
            <Link href="/umrah" className={buttonClass("primary", "mt-9")}>
              {t("cta")}
              <CtaArrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
