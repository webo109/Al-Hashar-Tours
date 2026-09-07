import { useTranslations } from "next-intl";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/motion/Reveal";

const items = ["where", "reach", "prices", "visa", "umrah", "cargo"] as const;

// Questions as luggage tags: each a tagged, numbered strip that opens on its
// own. Native details/summary, so it works without a script and the open state
// is keyboard-accessible for free. Every answer is checkable against company.ts.
export function Faq() {
  const t = useTranslations("Faq");

  return (
    <section id="faq" className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
          <h2 className="mt-3 max-w-[14ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
            {t("headline")}
          </h2>
          <p className="mt-4 max-w-[40ch] text-lg leading-relaxed text-fg/75">{t("intro")}</p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {items.map((key, i) => (
            <Reveal key={key} delay={0.05 * i}>
              <details className="group rounded-panel border border-fg/10 bg-surface-2 [&[open]>summary_svg]:rotate-180">
                <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 md:px-6 md:py-5 [&::-webkit-details-marker]:hidden">
                  {/* The tag: a hole-punched chip with the number, like a luggage label. */}
                  <span className="relative flex h-9 w-12 shrink-0 items-center justify-center rounded-[8px] border border-gold/45 bg-gold/12">
                    <span aria-hidden className="absolute start-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-pill bg-surface ring-1 ring-gold/45" />
                    <span className="font-latin ps-2 text-[13px] font-semibold text-gold-700" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="flex-1 text-[17px] font-medium tracking-tight text-fg">{t(`items.${key}.q`)}</span>
                  <CaretDown size={18} weight="bold" className="shrink-0 text-fg/55 transition-transform duration-300" />
                </summary>
                <p className="border-t border-dashed border-fg/12 px-5 pb-5 pt-4 text-[15px] leading-relaxed text-fg/75 md:px-6 md:ps-[5.5rem]">
                  {t(`items.${key}.a`)}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
