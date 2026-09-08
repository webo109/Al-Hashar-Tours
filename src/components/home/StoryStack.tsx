"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { images } from "@/data/images.generated";
import type { TourBase, TourContent } from "@/data/tours";
import { buttonClass, CtaArrow } from "@/components/ui/Button";
import { PriceFrom } from "@/components/tours/PriceText";
import { durationLabel } from "@/components/tours/TourCard";
import { useLenisRef } from "@/components/motion/SmoothScroll";
import { AmbientVideo } from "@/components/media/AmbientVideo";
import { getVideo } from "@/data/videos.generated";
import { tourClips, tourPeople } from "@/data/tour-media";
import type { ImageKey } from "@/data/images.generated";

// A family-or-friends moment pinned to the corner of the destination like a polaroid.
function peopleAsset(slug: string) {
  const key = tourPeople[slug];
  return key && key in images ? images[key as ImageKey] : null;
}

function Polaroid({ slug, name }: { slug: string; name: string }) {
  const asset = peopleAsset(slug);
  if (!asset) return null;
  return (
    <div
      className="pointer-events-none absolute -bottom-3 -start-3 z-10 w-[34%] max-w-[190px] -rotate-6 rounded-[6px] bg-white p-1.5 pb-6 shadow-[0_18px_40px_-16px_rgba(11,18,32,0.6)] transition-transform duration-500 ease-out-expo group-hover:-rotate-3"
      aria-hidden
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[3px]">
        <Image src={asset.src} alt={name} fill sizes="200px" placeholder="blur" blurDataURL={asset.blurDataURL} className="object-cover" />
      </div>
    </div>
  );
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type StoryItem = { tour: TourBase; content: TourContent };

const DESKTOP_SCROLL_VH_PER_STORY = 65;

export function StoryStack({ items }: { items: StoryItem[] }) {
  const t = useTranslations("Stories");
  const tours = useTranslations("Tours");
  const regions = useTranslations("Regions");
  const root = useRef<HTMLElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const lenisRef = useLenisRef();
  const n = items.length;
  // Which story faces the viewer; only that pane's clip plays.
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (min-height: 820px) and (prefers-reduced-motion: no-preference)", () => {
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

        let last = -1;
        const setActive = (idx: number) => {
          if (idx !== last) {
            last = idx;
            setActiveIndex(idx);
          }
          marks.forEach((m, i) => {
            m.classList.toggle("is-active", i === idx);
            if (i === idx) m.setAttribute("aria-current", "true");
            else m.removeAttribute("aria-current");
          });
          copies.forEach((copy, i) => {
            copy.inert = i !== idx;
            copy.setAttribute("aria-hidden", String(i !== idx));
          });
        };
        setActive(0);

        // One scrubbed timeline: the next image walks toward the viewer while
        // the previous one recedes, and the copy crossfades with it.
        const tl = gsap.timeline({
          onUpdate: function () {
            setActive(Math.min(n - 1, Math.max(0, Math.floor(this.time() + 0.25))));
          },
          scrollTrigger: {
            trigger: stack.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        });
        for (let i = 1; i < n; i += 1) {
          // Bring the second journey in sooner so the opening story does not
          // require a full viewport of scrolling before anything changes.
          const at = i - 0.65;
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
    // Land after the chosen tour has fully appeared, before the next fade.
    const timelineDuration = n - 0.15;
    const tourTime = i === 0 ? 0.1 : i + 0.23;
    const y = top + travel * tourTime / timelineDuration;
    const lenis = lenisRef?.current;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <section ref={root} id="tours" className="relative bg-surface">
      <div
        ref={stack}
        className="hidden motion-reduce:hidden lg:block [@media(max-height:819px)]:!hidden"
        style={{ height: `${100 + n * DESKTOP_SCROLL_VH_PER_STORY}vh` }}
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
              <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-accent-text xl:text-[42px]">
                {t("headline")}
              </h2>
              <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-fg/75">{t("intro")}</p>

              <nav className="mt-5" aria-label={t("chooseTour")}>
                <p className="mb-2 text-sm font-medium text-fg/70">{t("chooseTour")}</p>
                <ol className="flex flex-wrap gap-2">
                  {items.map(({ tour, content }, i) => (
                    <li key={tour.slug}>
                      <button
                        type="button"
                        data-story-mark
                        onClick={() => jump(i)}
                        className="story-mark min-h-10 rounded-full border border-fg/15 px-3 py-2 text-sm text-fg/70 transition-colors hover:border-accent-text hover:text-fg [&.is-active]:border-accent-text [&.is-active]:bg-accent-text/10"
                      >
                        {content.name}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="relative mt-6 h-[350px]">
                {items.map(({ tour, content }, i) => (
                  <article key={tour.slug} data-story-copy={i} className="absolute inset-0">
                    <h3 className="text-balance text-3xl font-medium leading-[1.1] tracking-tight text-fg xl:text-4xl">
                      {content.name}
                    </h3>
                    <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-fg/80">
                      {content.story?.text ?? content.summary}
                    </p>
                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[14px]">
                      <div>
                        <dt className="text-fg/50">{t("location")}</dt>
                        <dd className="text-fg">{tour.regions.map((r) => regions(r)).join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="text-fg/50">{t("duration")}</dt>
                        <dd className="text-fg">{durationLabel(tours, tour)}</dd>
                      </div>
                      <div>
                        <PriceFrom tour={tour} />
                      </div>
                    </dl>
                    <Link href={`/tours/${tour.slug}`} className={buttonClass("primary", "mt-7")}>
                      {t("cta")}
                      <CtaArrow />
                    </Link>
                  </article>
                ))}
              </div>

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
                    <AmbientVideo video={getVideo(tourClips[tour.slug])} mode="inview" active={i === activeIndex} />
                    <Polaroid slug={tour.slug} name={content.name} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 py-24 lg:hidden motion-reduce:block [@media(max-height:819px)]:!block">
        <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
        <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-accent-text md:text-5xl">{t("headline")}</h2>
        <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-fg/75">{t("intro")}</p>
        <nav className="mt-6" aria-label={t("chooseTour")}>
          <p className="mb-3 text-sm font-medium text-fg/70">{t("chooseTour")}</p>
          <ol className="flex flex-wrap gap-2">
            {items.map(({ tour, content }) => (
              <li key={tour.slug}>
                <a href={`#preview-${tour.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-fg/20 px-4 py-2 text-sm text-fg/80 transition-colors hover:border-accent-text hover:text-accent-text">
                  {content.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <ol className="mt-10 flex flex-col gap-14">
          {items.map(({ tour, content }) => {
            const asset = images[tour.image];
            return (
              <li key={tour.slug} id={`preview-${tour.slug}`} className="scroll-mt-28 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
                <div className="grade relative aspect-[4/5] overflow-hidden rounded-panel sm:aspect-[16/10]">
                  <Image src={asset.src} alt={content.name} fill sizes="100vw" placeholder="blur" blurDataURL={asset.blurDataURL} className="object-cover" />
                  <AmbientVideo video={getVideo(tourClips[tour.slug])} mode="inview" />
                  <Polaroid slug={tour.slug} name={content.name} />
                </div>
                <div>
                <h3 className="mt-6 text-balance text-3xl font-medium leading-[1.08] tracking-tight text-fg lg:mt-0">
                  {content.name}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-fg/80">{content.story?.text ?? content.summary}</p>
                <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <div>
                    <dt className="text-fg/50">{t("location")}</dt>
                    <dd className="text-fg">{tour.regions.map((r) => regions(r)).join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="text-fg/50">{t("duration")}</dt>
                    <dd className="text-fg">{durationLabel(tours, tour)}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <PriceFrom tour={tour} />
                  <Link href={`/tours/${tour.slug}`} className={buttonClass("secondary")}>
                    {t("cta")}
                    <CtaArrow />
                  </Link>
                </div>
                </div>
              </li>
            );
          })}
        </ol>
        <Link href="/tours" className="mt-12 inline-block text-[15px] font-medium text-accent-text underline-offset-4 hover:underline">
          {t("allTours")}
        </Link>
      </div>
    </section>
  );
}
