import { useTranslations } from "next-intl";
import { company } from "@/data/company";
import { Reveal } from "@/components/motion/Reveal";

// Three consecutive wins, shown as our own laurel rather than a row of the
// awards body's supplied badge artwork: a wreath around a star, with the year
// held in the middle of it. Swap in the official badge files if the client
// provides them.
//
// Seven leaves to a branch, set along an arc and turned to follow it. The right
// branch is the left one mirrored about the centre line, so the wreath stays
// symmetrical without a second set of numbers to keep in step.
const LEAF_ANGLES = [100, 120, 140, 160, 180, 200, 220];
const CENTRE_X = 60;
const CENTRE_Y = 64;
const LEAF_RADIUS = 45;

function Branch() {
  return (
    <g>
      {/* The stem, drawn just inside the leaves it carries. */}
      <path
        d="M54 98 A 34 34 0 0 1 34 42"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      {LEAF_ANGLES.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = CENTRE_X + LEAF_RADIUS * Math.cos(rad);
        const y = CENTRE_Y + LEAF_RADIUS * Math.sin(rad);
        return (
          <ellipse
            key={deg}
            cx={x}
            cy={y}
            rx="9"
            ry="4.3"
            fill="currentColor"
            transform={`rotate(${deg + 118} ${x} ${y})`}
          />
        );
      })}
    </g>
  );
}

function Medallion({ year }: { year: number }) {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 md:h-32 md:w-32" aria-hidden>
      <Branch />
      <g transform="translate(120 0) scale(-1 1)">
        <Branch />
      </g>
      {/* A star in the opening of the wreath, the year beneath it. */}
      <path
        d="M60 20 L63.5 28.7 L72.9 29.4 L65.7 35.4 L67.9 44.5 L60 39.5 L52.1 44.5 L54.3 35.4 L47.1 29.4 L56.5 28.7 Z"
        fill="currentColor"
      />
      <text
        className="font-latin"
        x="60"
        y="82"
        textAnchor="middle"
        fontSize="27"
        fontWeight="600"
        letterSpacing="-0.5"
        fill="currentColor"
      >
        {year}
      </text>
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
          <div className="relative rounded-panel border border-gold/30 bg-[linear-gradient(160deg,#16203a_0%,#0b1220_60%,#141a2c_100%)] px-6 py-14 text-cream md:px-12 md:py-20">
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
                      <Medallion year={year} />
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
