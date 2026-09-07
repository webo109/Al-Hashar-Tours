import { useTranslations } from "next-intl";
import { Trophy, SealCheck, Clock, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { company } from "@/data/company";
import { Reveal } from "@/components/motion/Reveal";

// Three tones rather than one, so the row reads as a hierarchy: the award is
// the loudest thing they have, the accreditation supports it, the trading
// history sits quietly under both. All three hold their contrast in either theme.
const tones = {
  solid: {
    box: "border-transparent bg-gold",
    icon: "text-panel-fg",
    title: "text-panel-fg",
    detail: "text-panel-fg/80",
  },
  tinted: {
    box: "border-gold/40 bg-gold/15",
    icon: "text-gold-700",
    title: "text-fg",
    detail: "text-fg/75",
  },
  quiet: {
    box: "border-fg/10 bg-surface-2",
    icon: "text-accent-text",
    title: "text-fg",
    detail: "text-fg/75",
  },
} as const;

// Credentials a traveller can verify somewhere other than this site: an award
// judged by the industry, an accreditation held to its standard, and a trading
// history. This is the honest substitute for testimonials, which cannot be used
// because no verifiable third-party reviews of Al-Hashar exist.
export function AboutRecognition() {
  const t = useTranslations("Recognition");
  const lines = company.group.lines;

  const credentials = [
    {
      key: "award",
      Icon: Trophy,
      tone: tones.solid,
      title: t("awardTitle"),
      detail: t("awardDetail", { year: company.worldTravelAwardsYear }),
    },
    {
      key: "iata",
      Icon: SealCheck,
      tone: tones.tinted,
      title: t("iataTitle"),
      detail: t("iataDetail"),
    },
    {
      key: "since",
      Icon: Clock,
      tone: tones.quiet,
      title: t("sinceTitle", { year: company.established }),
      detail: t("sinceDetail"),
    },
  ];

  return (
    <section id="recognition" className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
          <h2 className="mt-3 max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-5xl">
            {t("headline")}
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-fg/75">{t("intro")}</p>
        </Reveal>

        <ul className="mt-12 grid auto-rows-fr gap-4 md:grid-cols-3">
          {credentials.map(({ key, Icon, tone, title, detail }, i) => (
            <li key={key}>
              <Reveal className="h-full" delay={0.07 * i}>
                <div className={`h-full rounded-panel border p-6 ${tone.box}`}>
                  <Icon size={30} weight="fill" className={tone.icon} />
                  <h3 className={`mt-4 text-xl font-medium tracking-tight ${tone.title}`}>{title}</h3>
                  <p className={`mt-2 text-[15px] leading-relaxed ${tone.detail}`}>{detail}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal>
          <div className="mt-4 rounded-panel border border-fg/10 bg-surface-2 p-6 md:p-9">
            <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">
              {t("groupEyebrow")}
            </p>
            <h3 className="mt-3 max-w-[20ch] text-balance text-3xl font-medium leading-[1.08] tracking-tight text-fg md:text-4xl">
              {t("groupHeadline")}
            </h3>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-fg/75">
              {t("groupBody", { founder: company.group.founder, count: lines.length })}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {lines.map((line) => (
                <li
                  key={line}
                  className="rounded-pill border border-fg/12 px-3 py-1.5 text-[13px] text-fg/80"
                >
                  {t(`lines.${line}`)}
                </li>
              ))}
            </ul>

            <a
              href={company.group.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-medium text-accent-text underline-offset-4 hover:underline"
            >
              {t("groupCta")}
              <ArrowUpRight size={16} weight="bold" className="rtl:-scale-x-100" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
