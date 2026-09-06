import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { images } from "@/data/images.generated";
import { getVideo } from "@/data/videos.generated";
import { world, worldWithPhotos, worldWithoutPhotos } from "@/data/world";
import { formatOmr } from "@/lib/format";
import { AmbientVideo } from "@/components/media/AmbientVideo";
import { Tilt } from "@/components/motion/Tilt";
import { Reveal } from "@/components/motion/Reveal";
import { RailControls } from "./RailControls";

// International holidays as published by Al-Hashar: a horizontal rail of
// postcards, scroll-snapped, mirrored in RTL, each linking to the holidays
// request with the destination preselected.
export function WorldRail() {
  const t = useTranslations("World");
  const tours = useTranslations("Tours");
  const price = useTranslations("Price");
  const common = useTranslations("Common");
  const locale = useLocale();
  const cards = worldWithPhotos();
  const rest = worldWithoutPhotos();
  const railId = "world-rail";

  return (
    <section id="world" className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
                {t("headline")}
              </h2>
              <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-fg/80">{t("intro")}</p>
            </div>
            <RailControls target={railId} prevLabel={t("prev")} nextLabel={t("next")} />
          </div>
        </Reveal>
      </div>

      <ul
        id={railId}
        role="list"
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-6 px-6 pb-6 [scrollbar-width:none] md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((pkg, i) => {
          const asset = pkg.image ? images[pkg.image] : null;
          if (!asset) return null;
          return (
            <li key={pkg.key} className="w-[82vw] shrink-0 snap-start sm:w-[360px]">
              <Reveal delay={Math.min(i, 4) * 0.06} className="h-full">
                <Tilt className="h-full">
                  <Link
                    href={{ pathname: "/services/holidays", query: { region: pkg.key } }}
                    className="group flex h-full flex-col overflow-hidden rounded-panel border border-fg/10 bg-surface-2 transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:border-gold/45 hover:shadow-lift"
                  >
                    <div className="grade relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={asset.src}
                        alt={t(`items.${pkg.key}.name`)}
                        fill
                        sizes="(min-width: 640px) 360px, 82vw"
                        placeholder="blur"
                        blurDataURL={asset.blurDataURL}
                        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                      />
                      <AmbientVideo video={getVideo(pkg.clip)} mode="hover" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,transparent,rgb(11_18_32/0.72))]" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                        <h3 className="text-2xl font-medium tracking-tight">{t(`items.${pkg.key}.name`)}</h3>
                        <p className="mt-1 text-[14px] text-cream/80">{t(`items.${pkg.key}.cities`)}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[15px] leading-relaxed text-fg/80">{t(`items.${pkg.key}.blurb`)}</p>
                      <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                        <div>
                          <span className="block text-[12px] text-fg/60">
                            {tours("nights", { count: pkg.nights })}, {tours("days", { count: pkg.days })}
                          </span>
                          <span className="block text-2xl font-medium tracking-tight text-fg">
                            {formatOmr(locale, pkg.priceFrom, common("currency"))}
                          </span>
                          <span className="block text-[12px] text-fg/60">{price("twinShare")}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[14px] font-medium text-accent-text underline-offset-4 group-hover:underline">
                          {t("cta")}
                          <ArrowUpRight size={16} weight="bold" className="rtl:-scale-x-100" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Tilt>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {rest.length ? (
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <Reveal>
            <p className="mt-6 text-[14px] leading-relaxed text-fg/65">
              <span className="text-fg/85">{t("also")}</span>{" "}
              {rest.map((pkg, i) => (
                <span key={pkg.key}>
                  <Link
                    href={{ pathname: "/services/holidays", query: { region: pkg.key } }}
                    className="underline-offset-4 hover:text-accent-text hover:underline"
                  >
                    {t(`items.${pkg.key}.name`)}
                  </Link>
                  {i < rest.length - 1 ? t("separator") : "."}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      ) : null}
      <span className="sr-only">{world.length}</span>
    </section>
  );
}
