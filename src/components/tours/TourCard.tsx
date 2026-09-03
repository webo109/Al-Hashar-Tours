import Image from "next/image";
import { useTranslations } from "next-intl";
import { Clock, MapPin, Users, CarSimple, Star } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { images } from "@/data/images.generated";
import type { TourBase, TourContent } from "@/data/tours";
import { PriceFrom } from "./PriceText";

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

  // Featured journeys carry a gold edge light and a soft glow so they read
  // as the lit windows of the catalog; the rest stay in the dark.
  const spotlight = featured;
  const surface = spotlight
    ? "border-gold/60 bg-[radial-gradient(120%_90%_at_0%_0%,rgba(232,158,0,0.16),transparent_58%),linear-gradient(180deg,#182338,#111a2c)] shadow-[0_0_0_1px_rgba(232,158,0,0.35),0_26px_70px_-30px_rgba(232,158,0,0.45)] hover:shadow-[0_0_0_1px_rgba(232,158,0,0.7),0_30px_80px_-28px_rgba(232,158,0,0.6)]"
    : "border-cream/10 bg-midnight-800 hover:border-gold/45 hover:shadow-lift";

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className={`group relative flex w-full overflow-hidden rounded-panel border transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 ${surface} ${
        wide ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`grade relative shrink-0 overflow-hidden ${
          wide ? "aspect-[16/10] md:aspect-auto md:w-[52%]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={asset.src}
          alt={content.name}
          fill
          sizes={wide ? "(min-width: 1024px) 600px, 100vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"}
          placeholder="blur"
          blurDataURL={asset.blurDataURL}
          className={`object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] ${
            spotlight ? "brightness-[1.06]" : ""
          }`}
        />
        {spotlight ? (
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(232,158,0,0.18),transparent_45%)] rtl:bg-[linear-gradient(270deg,rgba(232,158,0,0.18),transparent_45%)]"
            aria-hidden
          />
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col p-6 ${wide ? "md:p-8" : ""}`}>
        <div className="flex flex-wrap gap-1.5">
          {featured ? (
            <span className="inline-flex items-center gap-1 rounded-pill bg-gold px-2.5 py-1 text-[12px] font-medium text-ink">
              <Star size={12} weight="fill" />
              {t("featured")}
            </span>
          ) : null}
          <span className="rounded-pill border border-gold/40 px-2.5 py-1 text-[12px] text-gold-300">
            {t(`kinds.${tour.kind}`)}
          </span>
          {tour.regions.slice(0, 2).map((r) => (
            <span key={r} className="rounded-pill border border-cream/15 px-2.5 py-1 text-[12px] text-cream/75">
              {regions(r)}
            </span>
          ))}
        </div>

        <h3 className={`mt-4 font-medium tracking-tight text-cream ${wide ? "text-3xl" : "text-2xl"}`}>
          {content.name}
        </h3>
        <p className="mt-1 text-[15px] text-cream/70">{content.tagline}</p>
        {wide ? (
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-cream/80">{content.summary}</p>
        ) : null}

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-cream/75">
          <li className="inline-flex items-center gap-1.5">
            <Clock size={16} weight="light" className="text-gold" />
            {durationLabel(t, tour)}
          </li>
          <li className="inline-flex items-center gap-1.5">
            {tour.priceBasis === "car" ? (
              <CarSimple size={16} weight="light" className="text-gold" />
            ) : (
              <Users size={16} weight="light" className="text-gold" />
            )}
            {tour.priceBasis === "car"
              ? t("upTo", { count: tour.maxPersons ?? 4 })
              : tour.kind === "sea"
                ? t("sharing")
                : t("privateVehicle")}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <MapPin size={16} weight="light" className="text-gold" />
            {regions(tour.regions[0])}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <PriceFrom tour={tour} />
          <span className="text-[14px] font-medium text-gold-300 underline-offset-4 group-hover:underline">
            {t("view")}
          </span>
        </div>
      </div>
    </Link>
  );
}
