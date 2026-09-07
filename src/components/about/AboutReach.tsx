import { useTranslations } from "next-intl";
import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { company } from "@/data/company";
import { Reveal } from "@/components/motion/Reveal";

// Twelve branches grouped by governorate rather than listed flat, because the
// point is national coverage: a flat list reads as twelve offices in Muscat.
// The head office is marked so the grouping still says where the centre is.
export function AboutReach() {
  const t = useTranslations("Reach");
  const regions = useTranslations("Regions");
  const branches = useTranslations("Branches");
  const hq = company.headOffice.areaKey;

  return (
    <section id="reach" className="relative bg-surface pb-24 md:pb-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
          <h2 className="mt-3 max-w-[20ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-5xl">
            {t("headline")}
          </h2>
          <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-fg/75">{t("intro")}</p>
        </Reveal>

        <ul className="mt-12 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {company.branchRegions.map(({ region, keys }, i) => (
            <li key={region}>
              <Reveal className="h-full" delay={0.06 * i}>
                {/* The governorate holding the head office is tinted, so the grid
                    has a centre of gravity instead of five identical panels. */}
                <div
                  className={`h-full rounded-panel border p-6 ${
                    (keys as readonly string[]).includes(hq)
                      ? "border-gold/40 bg-gold/15"
                      : "border-fg/10 bg-surface-2"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-medium tracking-tight text-fg">{regions(region)}</h3>
                    <span className="font-latin text-[13px] text-fg/55" dir="ltr">
                      {keys.length}
                    </span>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {keys.map((key) => {
                      const isHq = key === hq;
                      return (
                        <li
                          key={key}
                          className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-[13px] ${
                            isHq
                              ? "border-gold/45 bg-gold/10 text-fg"
                              : "border-fg/12 text-fg/80"
                          }`}
                        >
                          {isHq ? <MapPin size={13} weight="fill" className="text-gold" /> : null}
                          {branches(key)}
                          {isHq ? <span className="sr-only">{t("hq")}</span> : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
