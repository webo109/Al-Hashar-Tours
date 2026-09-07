import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

const steps = ["tell", "arrange", "travel"] as const;

// How it works as a departures board: three rows, each a stop with a status,
// on a dark panel in the brand's latin face. The board is the one thing every
// traveller reads without being asked to, which is what a process section wants.
export function HowItWorks() {
  const t = useTranslations("HowItWorks");

  return (
    <section id="how" className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
          <h2 className="mt-3 max-w-[16ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
            {t("headline")}
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-fg/75">{t("intro")}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-panel border border-gold/25 bg-[linear-gradient(160deg,#16203a_0%,#0b1220_60%,#141a2c_100%)] text-cream">
            <div
              className="font-latin grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/10 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-gold-300/80 md:grid-cols-[5rem_minmax(0,1fr)_9rem] md:px-8"
              aria-hidden
            >
              <span>{t("board.step")}</span>
              <span>{t("board.stop")}</span>
              <span className="text-end">{t("board.status")}</span>
            </div>
            <ol>
              {steps.map((step, i) => (
                <li
                  key={step}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-start gap-4 border-b border-white/8 px-5 py-6 last:border-b-0 md:grid-cols-[5rem_minmax(0,1fr)_9rem] md:px-8 md:py-8"
                >
                  <span className="font-latin text-2xl font-semibold leading-none tracking-tight text-gold-300 md:text-3xl" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xl font-medium tracking-tight text-cream md:text-2xl">
                      {t(`steps.${step}.title`)}
                    </h3>
                    <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-cream/70">
                      {t(`steps.${step}.body`)}
                    </p>
                  </div>
                  <span className="justify-self-end whitespace-nowrap rounded-pill border border-gold/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-gold-300">
                    {t(`steps.${step}.status`)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
