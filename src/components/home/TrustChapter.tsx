import { useTranslations } from "next-intl";
import { HandHeart, ChatsCircle, Tag, Headset, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { company } from "@/data/company";
import { Reveal } from "@/components/motion/Reveal";

const promises = [
  { key: "care", Icon: HandHeart },
  { key: "counselling", Icon: ChatsCircle },
  { key: "pricing", Icon: Tag },
  { key: "assistance", Icon: Headset },
] as const;

const box = "rounded-panel border border-fg/10 bg-surface-2 p-6";

// Built from boxes rather than photography: the mountain plate that used to sit
// behind this ran dark exactly where the figures and the last two promises are,
// and swallowed them. Type on a plain surface stays legible in both themes.
export function TrustChapter() {
  const t = useTranslations("Trust");

  return (
    <section id="trust" className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <h2 className="max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
            {t("headline")}
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <Reveal className="h-full">
              <div className={`${box} h-full`}>
                <span className="block text-[13px] text-fg/60">{t("sinceLabel")}</span>
                <span
                  className="font-latin mt-1 block text-6xl font-medium leading-none tracking-tight text-fg md:text-7xl"
                  dir="ltr"
                >
                  {company.established}
                </span>
              </div>
            </Reveal>
          </li>
          <li>
            <Reveal className="h-full" delay={0.07}>
              <div className={`${box} h-full`}>
                <span
                  className="font-latin block text-6xl font-medium leading-none tracking-tight text-accent-text md:text-7xl"
                  dir="ltr"
                >
                  {company.branchesClaimed}
                </span>
                <span className="mt-2 block text-[15px] text-fg/80">
                  {t("branchesLabel", { count: company.branchesClaimed })}
                </span>
              </div>
            </Reveal>
          </li>
          {company.iataAccredited ? (
            <li className="sm:col-span-2 lg:col-span-1">
              <Reveal className="h-full" delay={0.14}>
                <div className={`${box} flex h-full flex-col justify-center gap-3`}>
                  <SealCheck size={34} weight="fill" className="text-gold" />
                  <span className="text-xl font-medium tracking-tight text-fg">{t("iataLabel")}</span>
                </div>
              </Reveal>
            </li>
          ) : null}
        </ul>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ key, Icon }, i) => (
            <li key={key}>
              <Reveal className="h-full" delay={0.07 * i}>
                <div className={`${box} h-full`}>
                  <Icon size={30} weight="fill" className="text-accent-text" />
                  <h3 className="mt-4 text-xl font-medium tracking-tight text-fg">
                    {t(`promises.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg/75">
                    {t(`promises.${key}.detail`)}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
