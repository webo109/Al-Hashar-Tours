"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { images, type ImageKey } from "@/data/images.generated";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ChapterKey = "roots" | "reach" | "service" | "vision";

const chapters: Array<{ key: ChapterKey; image: ImageKey; inset: ImageKey }> = [
  { key: "roots", image: "dest-muscat-skyline", inset: "extra-al-alam-palace" },
  { key: "reach", image: "dest-muscat-mutrah", inset: "people-airport-family" },
  { key: "service", image: "plane-hajar-sunset", inset: "people-hotel-arrival" },
  { key: "vision", image: "dhow-turquoise", inset: "people-dhow-friends" },
];

function LayeredImage({ image, inset, alt }: { image: ImageKey; inset: ImageKey; alt: string }) {
  const main = images[image];
  const detail = images[inset];

  return (
    <div className="relative h-full w-full">
      <div className="grade absolute inset-0 overflow-hidden rounded-panel shadow-panel">
        <Image
          src={main.src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          placeholder="blur"
          blurDataURL={main.blurDataURL}
          className="object-cover"
        />
      </div>
      <div className="absolute -bottom-4 -start-5 w-[38%] rotate-[-4deg] rounded-[8px] bg-white p-2 pb-7 shadow-[0_24px_55px_-20px_rgba(11,18,32,0.7)] rtl:rotate-[4deg]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
          <Image
            src={detail.src}
            alt=""
            fill
            sizes="220px"
            placeholder="blur"
            blurDataURL={detail.blurDataURL}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export function AboutStory() {
  const t = useTranslations("About");
  const root = useRef<HTMLElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (min-height: 820px) and (prefers-reduced-motion: no-preference)", () => {
        const visuals = gsap.utils.toArray<HTMLElement>("[data-about-visual]");
        const copies = gsap.utils.toArray<HTMLElement>("[data-about-copy]");
        const marks = gsap.utils.toArray<HTMLElement>("[data-about-mark]");
        const behind = { scale: 0.88, opacity: 0, yPercent: 5, filter: "blur(10px) brightness(0.6)" };
        const front = { scale: 1, opacity: 1, yPercent: 0, filter: "blur(0px) brightness(1)" };
        const gone = { scale: 0.95, opacity: 0, yPercent: -4, filter: "blur(6px) brightness(0.75)" };

        gsap.set(visuals, behind);
        gsap.set(visuals[0], front);
        gsap.set(copies, { opacity: 0, y: 24, pointerEvents: "none" });
        gsap.set(copies[0], { opacity: 1, y: 0, pointerEvents: "auto" });

        let last = -1;
        const activate = (index: number) => {
          if (index !== last) {
            last = index;
            setActiveIndex(index);
          }
          marks.forEach((mark, i) => {
            mark.classList.toggle("is-active", i === index);
            if (i === index) mark.setAttribute("aria-current", "step");
            else mark.removeAttribute("aria-current");
          });
          copies.forEach((copy, i) => {
            copy.inert = i !== index;
            copy.setAttribute("aria-hidden", String(i !== index));
          });
        };
        activate(0);

        const timeline = gsap.timeline({
          onUpdate: function () {
            activate(Math.min(chapters.length - 1, Math.max(0, Math.floor(this.time() + 0.25))));
          },
          scrollTrigger: {
            trigger: stack.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        });

        for (let i = 1; i < chapters.length; i += 1) {
          const at = i - 0.65;
          timeline.to(visuals[i - 1], { ...gone, duration: 0.9, ease: "none" }, at);
          timeline.to(visuals[i], { ...front, duration: 0.9, ease: "none" }, at);
          timeline.to(copies[i - 1], { opacity: 0, y: -14, duration: 0.35, ease: "none" }, at);
          timeline.to(copies[i], { opacity: 1, y: 0, duration: 0.45, ease: "none" }, at + 0.4);
        }
        timeline.to({}, { duration: 0.5 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-surface" aria-labelledby="about-story-heading">
      <div
        ref={stack}
        className="hidden motion-reduce:hidden lg:block [@media(max-height:819px)]:!hidden"
        style={{ height: `${100 + chapters.length * 55}vh` }}
      >
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(55% 58% at 74% 48%, rgb(232 158 0 / 0.13), transparent 72%), radial-gradient(38% 42% at 16% 80%, rgb(254 124 26 / 0.08), transparent 72%)",
            }}
          />
          <div className="mx-auto grid h-full w-full max-w-[1200px] grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-16 px-10 pt-24 pb-8">
            <div className="relative">
              <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
              <h2 id="about-story-heading" className="mt-3 max-w-[13ch] text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-fg xl:text-5xl">
                {t("storyHeadline")}
              </h2>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-fg/75">{t("storyIntro")}</p>

              <ol className="mt-6 flex flex-wrap gap-2" aria-label={t("chaptersLabel") }>
                {chapters.map(({ key }) => (
                  <li key={key}>
                    <span
                      data-about-mark
                      className="story-mark inline-flex min-h-10 items-center rounded-full border border-fg/15 px-3.5 py-2 text-sm text-fg/65 [&.is-active]:border-accent-text [&.is-active]:bg-accent-text/10 [&.is-active]:text-fg"
                    >
                      {t(`chapters.${key}.label`)}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="relative mt-8 h-[300px]">
                {chapters.map(({ key }, index) => (
                  <article key={key} data-about-copy={index} className="absolute inset-0">
                    <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-accent-text">{t(`chapters.${key}.kicker`)}</p>
                    <h3 className="mt-3 max-w-[16ch] text-balance text-3xl font-medium leading-[1.08] tracking-tight text-fg xl:text-4xl">
                      {t(`chapters.${key}.title`)}
                    </h3>
                    <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-fg/80">{t(`chapters.${key}.body`)}</p>
                    <div className="mt-6 inline-flex items-baseline gap-3 rounded-full border border-accent-text/35 bg-accent-text/8 px-5 py-3">
                      <strong className="text-2xl font-semibold text-accent-text">{t(`chapters.${key}.stat`)}</strong>
                      <span className="text-sm text-fg/70">{t(`chapters.${key}.statLabel`)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/5] max-h-[76vh] w-full justify-self-end">
              {chapters.map(({ key, image, inset }, index) => (
                <div key={key} data-about-visual={index} className="absolute inset-0 will-change-transform">
                  <LayeredImage image={image} inset={inset} alt={t(`chapters.${key}.imageAlt`)} />
                </div>
              ))}
              <span className="absolute end-4 top-4 z-20 rounded-full border border-white/30 bg-[#0b1220]/55 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                {String(activeIndex + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 py-20 lg:hidden motion-reduce:block [@media(max-height:819px)]:!block">
        <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
        <h2 id="about-story-heading-mobile" className="mt-3 max-w-[13ch] text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-fg md:text-5xl">
          {t("storyHeadline")}
        </h2>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-fg/75">{t("storyIntro")}</p>

        <ol className="mt-10 flex flex-col gap-16">
          {chapters.map(({ key, image, inset }) => (
            <li key={key}>
              <div className="relative aspect-[4/5] sm:aspect-[16/10]">
                <LayeredImage image={image} inset={inset} alt={t(`chapters.${key}.imageAlt`)} />
              </div>
              <div className="mt-9">
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-accent-text">{t(`chapters.${key}.kicker`)}</p>
                <h3 className="mt-2 text-balance text-3xl font-medium leading-[1.08] tracking-tight text-fg">{t(`chapters.${key}.title`)}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-fg/80">{t(`chapters.${key}.body`)}</p>
                <div className="mt-5 inline-flex items-baseline gap-3 rounded-full border border-accent-text/35 bg-accent-text/8 px-4 py-2.5">
                  <strong className="text-xl font-semibold text-accent-text">{t(`chapters.${key}.stat`)}</strong>
                  <span className="text-sm text-fg/70">{t(`chapters.${key}.statLabel`)}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
