import { useTranslations } from "next-intl";
import { Globe, IdentificationCard, CreditCard, Headset } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/motion/Reveal";

// The four pains, each the inverse of a promise in TrustChapter, so the problem
// named here is answered further down the page.
const pains = [
  { key: "tabs", Icon: Globe },
  { key: "visa", Icon: IdentificationCard },
  { key: "price", Icon: CreditCard },
  { key: "silence", Icon: Headset },
] as const;

// The problem as a phone at two in the morning. Instead of a list beside a
// photograph, the four pains arrive as notifications on a lock screen — the
// moment the last pain describes. The copy is unchanged; only the vessel is.
export function ProblemChapter() {
  const t = useTranslations("Problem");

  return (
    <section id="problem" className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
          <Reveal>
            <h2 className="max-w-[16ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
              {t("headline")}
            </h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-fg/80">{t("intro")}</p>
            <p className="mt-10 max-w-[30ch] border-s-2 border-gold/55 ps-5 text-balance text-2xl font-medium leading-snug tracking-tight text-fg md:text-3xl">
              {t("cost")}
            </p>
          </Reveal>

          <Reveal delay={0.1} amount={0.2}>
            <figure className="mx-auto w-full max-w-[360px]" aria-label={t("phoneLabel")}>
              {/* The handset: a fixed dark so it reads as an object in both themes. */}
              <div className="relative rounded-[2.6rem] border border-white/12 bg-[linear-gradient(170deg,#1a2238_0%,#0b1220_55%,#0e1526_100%)] p-3 shadow-[0_40px_90px_-40px_rgb(0_0_0/0.7)]">
                <div className="rounded-[2rem] bg-[#0b1220] px-4 pb-6 pt-5">
                  <div aria-hidden className="mx-auto h-1.5 w-20 rounded-pill bg-white/15" />
                  <div className="mt-8 text-center">
                    <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/55">
                      {t("phoneDate")}
                    </p>
                    <p className="font-latin mt-1 text-6xl font-semibold leading-none tracking-tight text-white" dir="ltr">
                      {t("phoneTime")}
                    </p>
                  </div>

                  <p className="mt-8 px-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                    {t("notifications")}
                  </p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {pains.map(({ key, Icon }, i) => (
                      <li key={key}>
                        <Reveal delay={0.25 + i * 0.14} y={14} amount={0.4}>
                          <div className="flex gap-3 rounded-[18px] border border-white/10 bg-white/[0.07] px-3.5 py-3 backdrop-blur-sm">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gold/90 text-panel-fg">
                              <Icon size={17} weight="fill" />
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-baseline justify-between gap-3">
                                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
                                  {t(`apps.${key}`)}
                                </span>
                                <span className="font-latin text-[11px] text-white/40" dir="ltr">
                                  {t("phoneTime")}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[14px] font-medium leading-snug text-white">
                                {t(`items.${key}.title`)}
                              </p>
                              <p className="mt-0.5 text-[12.5px] leading-snug text-white/70">
                                {t(`items.${key}.detail`)}
                              </p>
                            </div>
                          </div>
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
