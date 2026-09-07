"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import { company } from "@/data/company";
import {
  branchGeo,
  routeOrder,
  projectX,
  projectY,
  FULL_VIEWBOX,
  MUSCAT_VIEWBOX,
  ZOOM,
} from "@/data/branch-geo";
import { omanCoastPath, omanBorderPath, musandamPath } from "@/data/oman-outline";
import { useLenisRef } from "@/components/motion/SmoothScroll";
import { HeritageStamp } from "@/components/hero/PassMarks";
import { Reveal } from "@/components/motion/Reveal";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, useGSAP);

const PLANE_GLYPH =
  "M2.2 12.2 21.5 3.4c.5-.2 1 .3.8.8l-6.6 17.4c-.2.5-.9.6-1.2.1l-3.1-5.2-5.2-3.1c-.5-.3-.4-1 .0-1.2Z";

// Leg durations in timeline seconds: one per hop, longer for the two long
// runs inland and south so distance is felt in the hand.
const LEGS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 2];

const stops = routeOrder.map((key) => {
  const geo = branchGeo[key];
  const region = company.branchRegions.find((r) => (r.keys as readonly string[]).includes(key))?.region ?? "muscat";
  return { key, region, x: projectX(geo.lng), y: projectY(geo.lat) };
});
// The twelve keys are the twelve branches the client claims; keep the two in step.
const TOTAL = stops.length;

const routeD = stops.map((s, i) => `${i === 0 ? "M" : "L"}${s.x.toFixed(1)} ${s.y.toFixed(1)}`).join(" ");

// Cumulative length fraction at each stop, so DrawSVG and the plane agree.
const fractions = (() => {
  const seg: number[] = [0];
  for (let i = 1; i < stops.length; i++) {
    seg.push(seg[i - 1] + Math.hypot(stops[i].x - stops[i - 1].x, stops[i].y - stops[i - 1].y));
  }
  const total = seg[seg.length - 1];
  return seg.map((v) => v / total);
})();

// The signature chapter: a cream route chart of Oman on which a chart plane
// flies the twelve branches north to south as the reader scrolls. After Barka
// the chart glides in on the capital so seven pins spread out, then pulls
// back for the long run to Salalah. Everything on it comes from company.ts
// and branch-geo.ts; the chart prints no distance and calls itself schematic.
export function FlightLine() {
  const t = useTranslations("FlightLine");
  const branches = useTranslations("Branches");
  const regions = useTranslations("Regions");
  const recognition = useTranslations("Recognition");
  const trust = useTranslations("Trust");
  const locale = useLocale();
  const lenisRef = useLenisRef();

  const wrapper = useRef<HTMLDivElement>(null);
  const ledger = useRef<HTMLOListElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hud = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const labelTimes = useRef<number[]>([]);

  const last = stops[stops.length - 1];
  const prev = stops[stops.length - 2];
  const restHeading = (Math.atan2(last.y - prev.y, last.x - prev.x) * 180) / Math.PI;

  useGSAP(
    () => {
      const svg = svgRef.current;
      const wrap = wrapper.current;
      const list = ledger.current;
      if (!svg || !wrap || !list) return;

      const flown = svg.querySelector<SVGPathElement>("[data-flown]")!;
      const plane = svg.querySelector<SVGGElement>("[data-plane]")!;
      const planeInner = svg.querySelector<SVGGElement>("[data-plane-inner]")!;
      const pins = Array.from(svg.querySelectorAll<SVGGElement>("[data-pin]"));
      const plate = svg.querySelector<SVGGElement>("[data-plate]")!;
      const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-stop]"));

      const setActive = (index: number) => {
        rows.forEach((row, i) => {
          row.classList.toggle("is-active", i === index);
          if (i === index) row.setAttribute("aria-current", "step");
          else row.removeAttribute("aria-current");
          row.querySelector<SVGGElement>("[data-pin]");
        });
        pins.forEach((pin, i) => pin.classList.toggle("is-active", i === index));
        if (hud.current) {
          const stop = stops[index];
          const name = branches(stop.key);
          hud.current.textContent =
            index === TOTAL - 1
              ? t("arrived", { name })
              : `${t("stop", { n: String(index + 1).padStart(2, "0"), total: TOTAL })} · ${name} · ${regions(stop.region)}`;
        }
      };

      const build = (trigger: Element, start: string, end: string, scrub: number | boolean) => {
        gsap.set(flown, { drawSVG: "0%" });
        pins.forEach((pin, i) => {
          const s = stops[i];
          gsap.set(pin, { svgOrigin: `${s.x} ${s.y}`, scale: i === 0 ? 1 : 0 });
        });
        gsap.set(plate, { svgOrigin: "60 60", scale: 1 });
        gsap.set(planeInner, { transformOrigin: "50% 50%", scale: 1 });
        gsap.set(plane, {
          motionPath: { path: flown, align: flown, autoRotate: true, alignOrigin: [0.5, 0.5], start: 0, end: 0 },
        });

        const tl = gsap.timeline({
          scrollTrigger: { trigger, start, end, scrub, invalidateOnRefresh: true },
          onUpdate: () => {
            const now = tl.time() + 0.1;
            let idx = 0;
            labelTimes.current.forEach((time, i) => {
              if (time <= now) idx = i;
            });
            setActive(idx);
          },
        });
        tlRef.current = tl;

        const times: number[] = [0];
        let cursor = 0;
        let zoom = 1;
        tl.addLabel(stops[0].key, 0);
        tl.from(pins[0], { scale: 0, duration: 0.25, ease: "back.out(2.5)" }, 0);

        const zoomTo = (viewBox: string, factor: number, duration: number) => {
          tl.to(svg, { attr: { viewBox }, duration, ease: "power2.inOut" }, cursor);
          tl.to([...pins, plate], { scale: 1 / factor, duration, ease: "power2.inOut" }, cursor);
          tl.to(planeInner, { scale: 1 / factor, duration, ease: "power2.inOut" }, cursor);
          tl.to(flown, { attr: { "stroke-width": 2.5 / factor }, duration, ease: "power2.inOut" }, cursor);
          zoom = factor;
          cursor += duration;
        };

        for (let i = 0; i < LEGS.length; i++) {
          const d = LEGS[i];
          tl.to(flown, { drawSVG: `0% ${fractions[i + 1] * 100}%`, ease: "none", duration: d }, cursor);
          tl.to(
            plane,
            {
              motionPath: {
                path: flown,
                align: flown,
                autoRotate: true,
                alignOrigin: [0.5, 0.5],
                start: fractions[i],
                end: fractions[i + 1],
              },
              ease: "none",
              duration: d,
            },
            cursor,
          );
          const arriveScale = i + 1 >= 2 && i + 1 <= 8 ? 1 / ZOOM : 1 / zoom;
          tl.fromTo(
            pins[i + 1],
            { scale: 0 },
            { scale: arriveScale, duration: 0.25, ease: "back.out(2.5)" },
            cursor + d - 0.1,
          );
          cursor += d;
          times.push(cursor);
          tl.addLabel(stops[i + 1].key, cursor);
          // Arriving at Barka: glide into the capital. Leaving Muttrah: pull back.
          if (i === 0) zoomTo(MUSCAT_VIEWBOX, ZOOM, 0.8);
          if (i === 7) zoomTo(FULL_VIEWBOX, 1, 1);
        }
        tl.to({}, { duration: 0.5 });
        labelTimes.current = times;
        setActive(0);
        return tl;
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (min-height: 820px) and (prefers-reduced-motion: no-preference)", () => {
        build(wrap, "top top", "bottom bottom", 0.8);
      });
      mm.add("(prefers-reduced-motion: no-preference) and ((max-width: 1023px) or (max-height: 819px))", () => {
        build(list, "top 65%", "bottom 65%", true);
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      return () => {
        tlRef.current = null;
      };
    },
    { scope: wrapper },
  );

  function jumpTo(index: number) {
    const tl = tlRef.current;
    if (!tl?.scrollTrigger) return;
    const y = tl.scrollTrigger.labelToScroll(stops[index].key);
    const lenis = lenisRef?.current;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <section id="flight-line" className="relative bg-surface">
      <div ref={wrapper} className="chapter:h-[520vh]">
        <div className="chapter:sticky chapter:top-0 chapter:flex chapter:h-[100dvh] chapter:flex-col chapter:justify-center">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-20 md:px-10 chapter:py-6">
            <Reveal>
              <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
              <h2 className="mt-3 max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-5xl chapter:text-4xl">
                {recognition("awardTitle")}
              </h2>
            </Reveal>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
              {/* The chart. dir=ltr so geography never mirrors in Arabic. */}
              <div className="sticky top-[5.5rem] chapter:static" dir="ltr">
                <div className="chart-paper relative overflow-hidden rounded-panel border border-fg/12 shadow-panel">
                  <div className="flex items-center justify-between border-b border-[rgb(11_18_32/0.12)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#4a5368]">
                    <span className="font-latin">{t("plate")}</span>
                    <span ref={hud} className="font-latin normal-case tracking-normal" aria-live="polite" />
                  </div>
                  <svg
                    ref={svgRef}
                    viewBox={FULL_VIEWBOX}
                    className="block h-[42vh] w-full chapter:h-[min(64vh,620px)]"
                    role="img"
                    aria-label={`${recognition("awardTitle")}. ${t("schematic")}`}
                  >
                    <path d={omanBorderPath} fill="none" stroke="rgb(11 18 32 / 0.35)" strokeWidth="1" strokeDasharray="6 8" vectorEffect="non-scaling-stroke" />
                    <path d={omanCoastPath} fill="none" stroke="#0b1220" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    <path d={musandamPath} fill="none" stroke="#0b1220" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    {/* Planned route: dashed, static. Flown route: solid gold, drawn as the plane goes. */}
                    <path d={routeD} fill="none" stroke="rgb(232 158 0 / 0.45)" strokeWidth="1.5" strokeDasharray="4 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    <path data-flown d={routeD} fill="none" stroke="#e89e00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {stops.map((s) => {
                      const east = s.x > 600;
                      return (
                        <g key={s.key} data-pin className="[&.is-active_circle:first-child]:fill-[#b57a00]">
                          <circle cx={s.x} cy={s.y} r="6" fill="#e89e00" stroke="#f7f2e8" strokeWidth="2" />
                          <text
                            x={s.x + (east ? -11 : 11)}
                            y={s.y + 4}
                            fontSize="12"
                            textAnchor={east ? "end" : "start"}
                            fill="#0b1220"
                            className={locale === "ar" ? "font-arabic" : "font-latin"}
                          >
                            {branches(s.key)}
                          </text>
                        </g>
                      );
                    })}
                    <g data-plane transform={`translate(${last.x} ${last.y}) rotate(${restHeading})`}>
                      <g data-plane-inner>
                        <path d={PLANE_GLYPH} transform="translate(-11 -11) scale(0.92)" fill="#b57a00" />
                      </g>
                    </g>
                    <g data-plate transform="translate(40 40)">
                      <circle cx="60" cy="60" r="34" fill="none" stroke="rgb(11 18 32 / 0.5)" strokeWidth="1" />
                      <path d="M60 30 L66 60 L60 90 L54 60 Z" fill="#b57a00" />
                      <text x="60" y="24" textAnchor="middle" fontSize="11" fill="#0b1220" className="font-latin">N</text>
                    </g>
                  </svg>
                  <div className="flex items-end justify-between px-4 pb-3 pt-1">
                    <p className="max-w-[40ch] text-[11px] leading-snug text-[#4a5368]">{t("schematic")}</p>
                    <HeritageStamp label={trust("sinceLabel")} />
                  </div>
                </div>
              </div>

              {/* The ledger of stops. */}
              <ol ref={ledger} aria-label={t("ledgerLabel")} className="flex flex-col gap-1 py-2">
                {stops.map((s, i) => {
                  const isHq = s.key === company.headOffice.areaKey;
                  return (
                    <li key={s.key}>
                      <button
                        type="button"
                        data-stop={i}
                        onClick={() => jumpTo(i)}
                        className="ledger-row flex w-full items-baseline gap-4 px-4 py-3 text-start"
                      >
                        <span className="font-latin w-7 shrink-0 text-[13px] tabular-nums text-fg/55" dir="ltr">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3">
                          <span className="text-[17px] font-medium tracking-tight text-fg">{branches(s.key)}</span>
                          <span className="text-[12px] uppercase tracking-[0.14em] text-fg/55">{regions(s.region)}</span>
                          {isHq ? (
                            <span className="inline-flex items-center gap-1.5 text-[12px] text-accent-text">
                              <span aria-hidden className="h-1.5 w-1.5 rounded-pill bg-gold" />
                              {t("headOffice")}
                            </span>
                          ) : null}
                        </span>
                        <span className="sr-only">{t("jumpTo", { name: branches(s.key) })}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
