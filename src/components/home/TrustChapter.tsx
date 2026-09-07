import { useTranslations } from "next-intl";
import { HandHeart, ChatsCircle, Tag, Headset, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { company } from "@/data/company";
import { Reveal } from "@/components/motion/Reveal";

const promises = [
  { key: "care", Icon: HandHeart },
  { key: "counselling", Icon: ChatsCircle },
  { key: "pricing", Icon: Tag },
  { key: "assistance", Icon: Headset },
] as const;

// The promises in one colour, four steps down, so the row reads as a ramp rather
// than four identical panels. Fixed values keep it the same in both themes.
const ramp = ["bg-gold", "bg-gold-300", "bg-[#f9dfae]", "bg-[#fbedd0]"] as const;

// Proof laid out as a route: the milestones pinned along one dashed line with a
// plane at its end, the same line the paper plane draws down the page. Below it
// the four promises answer the four pains of the problem chapter.
export function TrustChapter() {
  const t = useTranslations("Trust");
  const years = company.worldTravelAwardsYears;

  const milestones = [
    { key: "founded", value: String(company.established), label: t("milestones.founded") },
    { key: "iata", value: "IATA", label: t("milestones.iata") },
    { key: "branches", value: String(company.branchesClaimed), label: t("milestones.branches") },
    ...years.map((year) => ({ key: `award-${year}`, value: String(year), label: t("milestones.award") })),
  ];

  return (
    <section id="trust" className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <h2 className="max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
            {t("headline")}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <ol
            aria-label={t("routeLabel")}
            className="relative mt-14 flex flex-col gap-8 border-s border-dashed border-gold/50 ps-7 md:mt-16 md:flex-row md:items-start md:justify-between md:gap-4 md:border-s-0 md:ps-0"
          >
            {/* The line itself on wide screens: a dashed rule behind the pins. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-[9px] hidden border-t border-dashed border-gold/50 md:block"
            />
            {milestones.map((m, i) => (
              <li key={m.key} className="relative md:flex md:flex-1 md:flex-col md:items-center md:text-center">
                <span
                  aria-hidden
                  className="absolute -start-[33px] top-1 h-[13px] w-[13px] rounded-pill border-2 border-gold bg-surface md:static md:mb-4 md:h-[19px] md:w-[19px]"
                />
                <span className="font-latin block text-3xl font-medium leading-none tracking-tight text-fg md:text-4xl" dir="ltr">
                  {m.value}
                </span>
                <span className="mt-1.5 block max-w-[16ch] text-[13px] leading-snug text-fg/65">{m.label}</span>
                {i === milestones.length - 1 ? (
                  <PaperPlaneTilt
                    aria-hidden
                    size={18}
                    weight="fill"
                    className="absolute -end-1 top-0 hidden text-gold md:block rtl:-scale-x-100"
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>

        <ul className="mt-16 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ key, Icon }, i) => (
            <li key={key}>
              <Reveal className="h-full" delay={0.07 * i}>
                <div className={`h-full rounded-panel p-6 text-panel-fg ${ramp[i]}`}>
                  <Icon size={28} weight="fill" className={i === 0 ? "text-panel-fg" : "text-gold-700"} />
                  <h3 className="mt-4 text-xl font-medium tracking-tight">{t(`promises.${key}.title`)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-panel-fg/80">{t(`promises.${key}.detail`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
