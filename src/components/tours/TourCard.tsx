import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Clock, MapPin, Users, CarSimple, Star } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { images } from "@/data/images.generated";
import type { TourBase, TourContent } from "@/data/tours";
import { PriceFrom } from "./PriceText";
import { AmbientVideo } from "@/components/media/AmbientVideo";
import { Tilt } from "@/components/motion/Tilt";
import { getVideo } from "@/data/videos.generated";
import { tourClips } from "@/data/tour-media";

export function durationLabel(
  t: ReturnType<typeof useTranslations<"Tours">>,
  tour: TourBase,
) {
  if (tour.nights) return `${t("nights", { count: tour.nights })}, ${t("days", { count: tour.days ?? tour.nights + 1 })}`;
  if (tour.hours && tour.hours <= 5) return `${t("halfDay")}, ${t("hours", { count: tour.hours })}`;
  if (tour.hours) return `${t("fullDay")}, ${t("hours", { count: Math.round(tour.hours) })}`;
  return t("fullDay");
}

export function TourCard({
  tour,
  content,
  variant = "tall",
  featured = false,
}: {
  tour: TourBase;
  content: TourContent;
  variant?: "tall" | "wide";
  featured?: boolean;
}) {
  const t = useTranslations("Tours");
  const regions = useTranslations("Regions");
  const asset = images[tour.image];
  const wide = variant === "wide";

  // Featured journeys keep the same surface as the rest of the grid. A gold
  // rim and ambient glow signal priority without changing the card's palette.
  const spotlight = featured;
  const surface = spotlight
    ? "border-gold/70 bg-surface-2 shadow-[0_0_0_1px_rgba(232,158,0,0.28),0_0_42px_-12px_rgba(232,158,0,0.48),0_22px_52px_-30px_rgba(120,76,0,0.3)] hover:border-gold hover:shadow-[0_0_0_1px_rgba(232,158,0,0.52),0_0_56px_-10px_rgba(232,158,0,0.62),0_28px_60px_-28px_rgba(120,76,0,0.36)]"
    : "border-fg/10 bg-surface-2 hover:border-gold/45 hover:shadow-lift";
  // Featured journeys come alive on hover with a short muted clip.
  const clip = featured ? getVideo(tourClips[tour.slug]) : null;

  return (
    <Tilt className="flex w-full">
    <Link
      href={`/tours/${tour.slug}`}
      className={`group relative flex min-w-0 w-full overflow-hidden rounded-panel border transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 ${surface} ${
        wide ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`grade relative shrink-0 overflow-hidden ${
          wide ? "aspect-[16/10] md:aspect-auto md:w-[52%]" : "aspect-[16/10] sm:aspect-[4/3]"
        }`}
      >
        <Image
          src={asset.src}
          alt={content.name}
          fill
          sizes={wide ? "(min-width: 1024px) 600px, 100vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"}
          placeholder="blur"
          blurDataURL={asset.blurDataURL}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
        <AmbientVideo video={clip} mode="hover" className="hidden md:block" />
      </div>

      <div className={`flex flex-1 flex-col p-[18px] sm:p-6 ${wide ? "md:p-8" : ""}`}>
        <div className="flex flex-wrap gap-1.5">
          {featured ? (
            <span className="inline-flex items-center gap-1 rounded-pill bg-gold px-2.5 py-1 text-[11px] font-medium text-panel-fg sm:text-[12px]">
              <Star size={12} weight="fill" />
              {t("featured")}
            </span>
          ) : null}
          <span className="rounded-pill border border-gold/40 px-2.5 py-1 text-[11px] text-accent-text sm:text-[12px]">
            {t(`kinds.${tour.kind}`)}
          </span>
          {tour.regions.slice(0, 2).map((r) => (
            <span key={r} className="rounded-pill border border-fg/15 px-2.5 py-1 text-[11px] text-fg/75 sm:text-[12px]">
              {regions(r)}
            </span>
          ))}
        </div>

        <h3 className={`mt-3.5 font-medium tracking-tight text-fg sm:mt-4 ${wide ? "text-3xl" : "text-[22px] sm:text-2xl"}`}>
          {content.name}
        </h3>
        <p className="mt-1 text-[14px] leading-snug text-fg/70 sm:text-[15px]">{content.tagline}</p>
        {wide ? (
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-fg/80">{content.summary}</p>
        ) : null}

        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px] leading-snug text-fg/75 sm:mt-5 sm:flex sm:flex-wrap sm:gap-x-5 sm:text-[13px]">
          <li className="col-span-2 inline-flex items-center gap-1.5 sm:col-span-1">
            <Clock size={16} weight="fill" className="text-gold" />
            {durationLabel(t, tour)}
          </li>
          <li className="inline-flex items-center gap-1.5">
            {tour.priceBasis === "car" ? (
              <CarSimple size={16} weight="fill" className="text-gold" />
            ) : (
              <Users size={16} weight="fill" className="text-gold" />
            )}
            {tour.priceBasis === "car"
              ? t("upTo", { count: tour.maxPersons ?? 4 })
              : tour.kind === "sea"
                ? t("sharing")
                : t("privateVehicle")}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <MapPin size={16} weight="fill" className="text-gold" />
            {regions(tour.regions[0])}
          </li>
        </ul>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-fg/10 pt-4 sm:mt-auto sm:border-0 sm:pt-6">
          <PriceFrom tour={tour} tone="dark" />
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-accent-text underline-offset-4 group-hover:underline sm:text-[14px]">
            {t("view")}
            <ArrowUpRight size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
          </span>
        </div>
      </div>
    </Link>
    </Tilt>
  );
}
