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

export function AboutAwards() {
  const t = useTranslations("Awards");
  const years = company.worldTravelAwardsYears;

  return (
    <section id="awards" className="relative bg-surface pt-24 md:pt-32">
      <div className="relative">
        {/* The panel breaks its container and spans the window, with an
            elliptical radius so the dark form bows out at the centre and
            sweeps thin toward both edges — a wing rather than a box. The
            gold hairline follows that curve and keeps the edge readable in
            dark mode, where the panel and the page surface are close in tone. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 border-y border-gold/25 bg-[linear-gradient(160deg,#16203a_0%,#0b1220_60%,#141a2c_100%)] [border-radius:50%_/_14%]"
        />
        <Reveal>
          <div className="relative mx-auto w-full max-w-[1200px] px-6 py-16 text-cream md:px-10 md:py-24">
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
