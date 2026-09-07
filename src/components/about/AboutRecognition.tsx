import { useTranslations } from "next-intl";
import { MapPin, SealCheck, Clock, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { company } from "@/data/company";
import { Reveal } from "@/components/motion/Reveal";

// One colour, three steps down: rich gold, then lighter, then lighter again.
// The values are fixed rather than token tints, so the ramp reads the same in
// both themes; a translucent tint would sit on a dark surface and go muddy.
// Dark type on all three keeps every step well past the contrast threshold.
const tones = [
  { box: "bg-gold", icon: "text-panel-fg" },
  { box: "bg-gold-300", icon: "text-gold-700" },
  { box: "bg-[#f9dfae]", icon: "text-gold-700" },
] as const;

// Credentials a traveller can verify somewhere other than this site: an award
// judged by the industry, an accreditation held to its standard, and a trading
// history. This is the honest substitute for testimonials, which cannot be used
// because no verifiable third-party reviews of Al-Hashar exist.
export function AboutRecognition() {
  const t = useTranslations("Recognition");
  const lines = company.group.lines;

  const credentials = [
    // The award has its own section now, so this row carries the reach instead
    // of repeating it.
    { key: "branches", Icon: MapPin, title: t("awardTitle"), detail: t("awardDetail") },
    { key: "iata", Icon: SealCheck, title: t("iataTitle"), detail: t("iataDetail") },
    {
      key: "since",
      Icon: Clock,
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
          {credentials.map(({ key, Icon, title, detail }, i) => (
            <li key={key}>
              <Reveal className="h-full" delay={0.07 * i}>
                <div className={`h-full rounded-panel p-6 text-panel-fg ${tones[i].box}`}>
                  <Icon size={30} weight="fill" className={tones[i].icon} />
                  <h3 className="mt-4 text-xl font-medium tracking-tight">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-panel-fg/80">{detail}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal>
          {/* Depth without a fourth fill competing with the gold ramp: a warm
              glow off one corner and a watermark numeral, the same device the
              brand moment uses with its 1984. The count is set once and drives
              the watermark, the sentence and the list. */}
          <div className="relative mt-4 overflow-hidden rounded-panel border border-fg/12 bg-surface-2 p-6 md:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_100%_0%,rgb(232_158_0/0.16),transparent_70%)]"
            />
            <span
              aria-hidden
              className="font-latin pointer-events-none absolute -top-10 -end-4 select-none text-[10rem] font-semibold leading-none tracking-tighter text-fg/[0.05] md:text-[14rem]"
            >
              {lines.length}
            </span>

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
              <div>
                <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">
                  {t("groupEyebrow")}
                </p>
                <h3 className="mt-3 max-w-[20ch] text-balance text-3xl font-medium leading-[1.08] tracking-tight text-fg md:text-4xl">
                  {t("groupHeadline")}
                </h3>
                <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-fg/75">
                  {t("groupBody", { founder: company.group.founder, count: lines.length })}
                </p>
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

              <ul className="flex flex-wrap content-start gap-2 lg:justify-end">
                {lines.map((line) => (
                  <li
                    key={line}
                    className="rounded-pill border border-fg/12 bg-surface/60 px-3 py-1.5 text-[13px] text-fg/80 transition-colors hover:border-gold/45 hover:text-fg"
                  >
                    {t(`lines.${line}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
