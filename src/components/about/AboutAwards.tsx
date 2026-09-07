import { useTranslations } from "next-intl";
import { company } from "@/data/company";
import { Reveal } from "@/components/motion/Reveal";

// Three consecutive wins, shown as our own medallions rather than a row of the
// awards body's supplied badge artwork: the ring-and-year shape echoes the
// heritage stamp on the boarding pass, so the page states the fact in its own
// voice. Swap in the official badge files if the client provides them.
function Medallion({ year, winner }: { year: number; winner: string }) {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 md:h-32 md:w-32" aria-hidden>
      <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <circle cx="60" cy="60" r="47" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.3" />
      <text
        x="60"
        y="48"
        textAnchor="middle"
        fontSize="9"
        letterSpacing="3"
        fill="currentColor"
        opacity="0.8"
      >
        {winner.toUpperCase()}
      </text>
      <text
        className="font-latin"
        x="60"
        y="79"
        textAnchor="middle"
        fontSize="30"
        fontWeight="600"
        letterSpacing="-0.5"
        fill="currentColor"
      >
        {year}
      </text>
    </svg>
  );
}

// One blade, drawn to stretch: the root spans the panel's middle band at full
// height, the tip is a third as tall and sits above centre, and both edges bow
// on the way out. preserveAspectRatio="none" lets the same path fit any window.
function Wing({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  const d = left
    ? "M100,0 C68,3 34,13 0,27 L0,58 C34,78 68,91 100,100 Z"
    : "M0,0 C32,3 66,13 100,27 L100,58 C66,78 32,91 0,100 Z";
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute top-[27%] hidden h-[46%] w-[calc(50vw-560px)] xl:block ${
        left ? "right-full" : "left-full"
      }`}
    >
      <path d={d} fill="#0f1830" stroke="rgb(232 158 0 / 0.28)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function AboutAwards() {
  const t = useTranslations("Awards");
  const years = company.worldTravelAwardsYears;

  return (
    <section id="awards" className="relative bg-surface pt-24 md:pt-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          {/* A body with two blades. The panel is the fuselage; from the middle
              of each side a swept blade reaches the edge of the window, thinning
              toward a tip that sits a little above centre so the whole form
              reads as lifted. The blades only exist from xl up, where the panel
              stops at 1120px and there is window either side of it; their width
              is exactly that remaining half, so each tip lands on the edge. */}
          <div className="relative rounded-panel border border-gold/30 bg-[linear-gradient(160deg,#16203a_0%,#0b1220_60%,#141a2c_100%)] px-6 py-14 text-cream md:px-12 md:py-20">
            <Wing side="left" />
            <Wing side="right" />
            <div className="mx-auto max-w-[46ch] text-center">
              <p className="text-[12px] uppercase tracking-[0.24em] text-gold-300">{t("eyebrow")}</p>
              <h2 className="mt-3 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-cream md:text-5xl">
                {t("headline")}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-cream/75">{t("intro")}</p>
            </div>

            <ul className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-14">
              {years.map((year, i) => (
                <li key={year}>
                  <Reveal delay={0.08 * i}>
                    <span className="flex flex-col items-center text-gold-300">
                      <Medallion year={year} winner={t("winner")} />
                      <span className="sr-only">{t("badgeLabel", { year })}</span>
                    </span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
