"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { buttonClass, CtaArrow } from "@/components/ui/Button";

export function LogoMoment() {
  const t = useTranslations("LogoMoment");
  const stories = useTranslations("Stories");
  const locale = useLocale();

  return (
    <section id="brand" className="relative isolate scroll-mt-24 overflow-hidden bg-cream px-5 py-16 text-ink md:px-12 md:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-[1fr_auto] items-end gap-5 border-b border-ink/20 pb-4 md:pb-5">
          <span className="font-latin text-[10px] font-medium uppercase tracking-[0.2em] md:text-[11px] md:tracking-[0.22em]">
            Al-Hashar · Muscat, Oman
          </span>
          <span className="max-w-[12ch] text-end text-[11px] leading-tight text-ink/60 md:max-w-none md:text-[12px]">
            {t("since")}
          </span>
        </div>
        <div className="grid items-center gap-11 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-16">
          <div className="relative z-10">
            <span className="mb-5 block h-1 w-10 bg-brand md:mb-6 md:w-12" aria-hidden />
            <h2 className={`max-w-[10ch] text-[clamp(3.25rem,13.5vw,7.5rem)] font-semibold leading-[0.94] tracking-[-0.055em] lg:text-[clamp(3.5rem,8vw,7.5rem)] ${locale === "ar" ? "font-arabic leading-[1.2] tracking-normal" : "font-latin"}`}>
              {t("tagline")}
            </h2>
            <p className={`mt-5 max-w-[28ch] text-lg leading-relaxed text-ink/65 md:mt-7 md:text-2xl ${locale === "ar" ? "font-latin" : "font-arabic"}`}
              lang={locale === "ar" ? "en" : "ar"} dir={locale === "ar" ? "ltr" : "rtl"}>
              {t("taglineSecondary")}
            </p>
            <Link href="/tours" className={buttonClass("primary", "mt-7 h-13 text-ink! md:mt-9 md:h-14")}>
              {stories("allTours")}
              <CtaArrow />
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-[520px] pb-4 pt-4 sm:w-[92%] lg:w-full lg:rotate-3 lg:pb-8 lg:pt-5">
            <div className="relative overflow-hidden rounded-t-[44%] border-[7px] border-white bg-sand shadow-[0_24px_55px_-32px_rgba(11,18,32,0.48)] md:border-[10px]">
              <div className="relative aspect-[5/6] sm:aspect-[4/5]">
                <Image src="/images/dest-wahiba-dunes.webp" alt={locale === "ar" ? "كثبان رمال الشرقية في عُمان" : "The sweeping dunes of Sharqiyah Sands, Oman"} fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/65 via-transparent to-transparent" aria-hidden />
                <span className="absolute bottom-5 start-5 font-latin text-[10px] uppercase tracking-[0.24em] text-white md:bottom-6 md:start-6 md:text-[11px]">{locale === "ar" ? "من عُمان، بكل حب." : "Oman, with love."}</span>
              </div>
              <div className="flex items-center justify-between bg-white px-4 py-3 font-latin text-[9px] uppercase tracking-[0.17em] text-ink/65 md:px-5 md:py-4 md:text-[10px] md:tracking-[0.2em]">
                <span>Al-Hashar · Oman</span>
                <span>Est. 1984</span>
              </div>
            </div>
            <div className="absolute -end-2 top-0 flex size-24 -rotate-12 flex-col items-center justify-center rounded-full border border-dashed border-ink/40 bg-cream p-3 text-center shadow-sm md:-end-5 md:size-32">
              <LogoMark className="size-10 md:size-14" />
              <span className="mt-1 font-latin text-[9px] font-semibold uppercase tracking-[0.18em] md:text-[10px] md:tracking-[0.2em]">Since 1984</span>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-4 md:mt-10" aria-hidden>
          <span className="size-2 rounded-full bg-brand" />
          <span className="h-px flex-1 bg-ink/20" />
          <svg viewBox="0 0 24 24" className="size-6 text-brand" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 10 18-7-7 18-3-8-8-3Z M11 13 21 3" /></svg>
        </div>
      </div>
    </section>
  );
}
