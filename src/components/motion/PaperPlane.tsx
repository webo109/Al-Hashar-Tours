"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

// One continuous route threads the homepage chapters together. The path stays
// deliberately sparse and mostly near the page edges so it reads as atmosphere,
// while the plane's position quietly reflects the visitor's scroll progress.
export function PaperPlane() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-plane]", {
          motionPath: {
            path: "[data-plane-path]",
            align: "[data-plane-path]",
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
          },
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden opacity-70 rtl:-scale-x-100"
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 10000" preserveAspectRatio="none">
        <path
          data-plane-path
          d="M-70 380
             C 250 180, 620 650, 1660 330
             C 1400 1160, 340 720, -60 1510
             C 320 2240, 1280 1720, 1650 2540
             C 1280 3260, 280 2820, -70 3670
             C 300 4490, 1310 3990, 1650 4860
             C 1300 5640, 260 5240, -60 6140
             C 360 6980, 1260 6510, 1650 7440
             C 1270 8280, 310 7820, -60 8730
             C 330 9440, 1190 9180, 1660 9680"
          fill="none"
          stroke="rgb(232 158 0 / 0.35)"
          strokeWidth="2"
          strokeDasharray="4 12"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        data-plane
        className="absolute left-0 top-0 h-8 w-8 text-gold drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)] motion-reduce:hidden"
        viewBox="0 0 24 24"
      >
        <path d="M2.2 12.2 21.5 3.4c.5-.2 1 .3.8.8l-6.6 17.4c-.2.5-.9.6-1.2.1l-3.1-5.2-5.2-3.1c-.5-.3-.4-1 .0-1.2Z" fill="currentColor" />
        <path d="M11.4 16.5 21 4.3" stroke="rgb(11 18 32 / 0.35)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
