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
      {/* The outer ring sits at r=55 in a 120 box, so it can only grow inward —
          the weight goes into the stroke rather than the radius. */}
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2.6" opacity="0.6" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.35" />
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

export function AboutAwards() {
  const t = useTranslations("Awards");
  const awards = company.worldTravelAwards;

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
              {awards.map(({ year, url }, i) => (
                <li key={year}>
                  <Reveal delay={0.08 * i}>
                    {/* The citation on the awards body's own site: a credential
                        is worth more when the visitor can go and check it. */}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center rounded-panel text-gold-300 transition-[transform,color] duration-300 ease-out-expo hover:-translate-y-1 hover:text-gold-300/80"
                    >
                      <Medallion year={year} winner={t("winner")} />
                      <span className="sr-only">{t("badgeLabel", { year })}</span>
                    </a>
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
