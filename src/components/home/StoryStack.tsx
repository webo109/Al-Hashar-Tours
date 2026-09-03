"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { images } from "@/data/images.generated";
import type { TourBase, TourContent } from "@/data/tours";
import { buttonClass } from "@/components/ui/Button";
import { PriceFrom } from "@/components/tours/PriceText";
import { durationLabel } from "@/components/tours/TourCard";
import { useLenisRef } from "@/components/motion/SmoothScroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type StoryItem = { tour: TourBase; content: TourContent };

export function StoryStack({ items }: { items: StoryItem[] }) {
  const t = useTranslations("Stories");
  const tours = useTranslations("Tours");
  const regions = useTranslations("Regions");
  const root = useRef<HTMLElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const lenisRef = useLenisRef();
  const n = items.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const imgs = gsap.utils.toArray<HTMLElement>("[data-story-img]");
        const copies = gsap.utils.toArray<HTMLElement>("[data-story-copy]");
        const marks = gsap.utils.toArray<HTMLElement>("[data-story-mark]");
        const behind = { scale: 0.86, opacity: 0, yPercent: 5, filter: "blur(10px) brightness(0.55)" };
        const front = { scale: 1, opacity: 1, yPercent: 0, filter: "blur(0px) brightness(1)" };
        const gone = { scale: 0.94, opacity: 0, yPercent: -4, filter: "blur(6px) brightness(0.7)" };

        gsap.set(imgs, behind);
        gsap.set(imgs[0], front);
        gsap.set(copies, { opacity: 0, y: 26, pointerEvents: "none" });
        gsap.set(copies[0], { opacity: 1, y: 0, pointerEvents: "auto" });

        const setActive = (idx: number) => {
          marks.forEach((m, i) => m.classList.toggle("is-active", i === idx));
        };
        setActive(0);

        // One scrubbed timeline: the next image walks toward the viewer while
        // the previous one recedes, and the copy crossfades with it.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stack.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
          },
        });
        for (let i = 1; i < n; i += 1) {
          const at = i - 0.45;
          tl.to(imgs[i - 1], { ...gone, duration: 0.9, ease: "none" }, at);
          tl.to(imgs[i], { ...front, duration: 0.9, ease: "none" }, at);
          tl.to(copies[i - 1], { opacity: 0, y: -14, pointerEvents: "none", duration: 0.35, ease: "none" }, at);
          tl.to(copies[i], { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.45, ease: "none" }, at + 0.4);
        }
        tl.to({}, { duration: 0.6 });
      });
    },
    { scope: root },
  );

  function jump(i: number) {
    const el = stack.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const y = top + (travel * (i + 0.5)) / n;
    const lenis = lenisRef?.current;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <section ref={root} id="tours" className="relative bg-midnight">
      <div
        ref={stack}
        className="hidden motion-reduce:hidden lg:block"
        style={{ height: `calc(${n + 1} * 100vh)` }}
      >
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(55% 60% at 72% 50%, rgba(232,158,0,0.12), transparent 70%), radial-gradient(40% 40% at 20% 80%, rgba(254,124,26,0.08), transparent 70%)",
            }}
          />
          <div className="mx-auto grid h-full w-full max-w-[1200px] grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-16 px-10 pt-24 pb-8">
            <div className="relative">
              <p className="text-[12px] uppercase tracking-[0.2em] text-gold-300">{t("eyebrow")}</p>
              <h2 className="mt-3 text-balance text-3xl font-medium tracking-tight text-cream md:text-4xl">
                {t("headline")}
              </h2>

              <div className="relative mt-10 h-[360px]">
                {items.map(({ tour, content }, i) => (
                  <article key={tour.slug} data-story-copy={i} className="absolute inset-0">
                    <h3 className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-cream xl:text-5xl">
                      {content.story?.headline ?? content.tagline}
                    </h3>
                    <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-cream/80">
                      {content.story?.text ?? content.summary}
                    </p>
                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[14px]">
                      <div>
                        <dt className="text-cream/50">{t("location")}</dt>
                        <dd className="text-cream">{tour.regions.map((r) => regions(r)).join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="text-cream/50">{t("duration")}</dt>
                        <dd className="text-cream">{durationLabel(tours, tour)}</dd>
                      </div>
                      <div>
                        <PriceFrom tour={tour} />
                      </div>
                    </dl>
                    <Link href={`/tours/${tour.slug}`} className={buttonClass("primary", "mt-7")}>
                      {t("cta")}
                      <ArrowRight size={16} className="rtl:rotate-180" />
                    </Link>
                  </article>
                ))}
              </div>

              <ol className="mt-10 flex flex-wrap gap-x-6 gap-y-2" aria-label={t("eyebrow")}>
                {items.map(({ tour, content }, i) => (
                  <li key={tour.slug}>
                    <button
                      type="button"
                      data-story-mark
                      onClick={() => jump(i)}
                      className="story-mark text-[14px] text-cream/45 transition-colors duration-300 hover:text-cream"
                    >
                      {content.name}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative aspect-[4/5] max-h-[78vh] w-full justify-self-end">
              {items.map(({ tour, content }, i) => {
                const asset = images[tour.image];
                return (
                  <div
                    key={tour.slug}
                    data-story-img={i}
                    className="grade absolute inset-0 overflow-hidden rounded-panel will-change-transform"
                  >
                    <Image
                      src={asset.src}
                      alt={content.name}
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      placeholder="blur"
                      blurDataURL={asset.blurDataURL}
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 py-24 lg:hidden motion-reduce:block">
        <p className="text-[12px] uppercase tracking-[0.2em] text-gold-300">{t("eyebrow")}</p>
        <h2 className="mt-3 text-balance text-3xl font-medium tracking-tight text-cream md:text-4xl">{t("headline")}</h2>
        <ol className="mt-10 flex flex-col gap-14">
          {items.map(({ tour, content }) => {
            const asset = images[tour.image];
            return (
              <li key={tour.slug}>
                <div className="grade relative aspect-[4/5] overflow-hidden rounded-panel sm:aspect-[16/10]">
                  <Image src={asset.src} alt={content.name} fill sizes="100vw" placeholder="blur" blurDataURL={asset.blurDataURL} className="object-cover" />
                </div>
                <h3 className="mt-6 text-balance text-3xl font-medium leading-[1.08] tracking-tight text-cream">
                  {content.story?.headline ?? content.tagline}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-cream/80">{content.story?.text ?? content.summary}</p>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <PriceFrom tour={tour} />
                  <Link href={`/tours/${tour.slug}`} className={buttonClass("secondary")}>
                    {t("cta")}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
        <Link href="/tours" className="mt-12 inline-block text-[15px] font-medium text-gold-300 underline-offset-4 hover:underline">
          {t("allTours")}
        </Link>
      </div>
    </section>
  );
}
