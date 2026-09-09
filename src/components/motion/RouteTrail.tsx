// One continuous route threads the homepage chapters together. The path stays
// deliberately sparse and mostly near the page edges so it reads as atmosphere.
//
// A paper plane used to fly this line, its position scrubbed to the visitor's
// scroll. The plane is gone; what is left is the route itself, which needs no
// JavaScript at all — hence a plain server component where there was a client
// one carrying GSAP, a ref and a ScrollTrigger.
export function RouteTrail() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden opacity-70 rtl:-scale-x-100"
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 10000" preserveAspectRatio="none">
        <path
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
    </div>
  );
}
