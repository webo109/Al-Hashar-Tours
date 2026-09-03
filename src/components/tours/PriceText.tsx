import { useLocale, useTranslations } from "next-intl";
import type { TourBase } from "@/data/tours";
import { approxFrom, formatOmr } from "@/lib/format";

export function basisLabel(
  t: ReturnType<typeof useTranslations<"Price">>,
  tour: Pick<TourBase, "priceBasis" | "maxPersons">,
) {
  switch (tour.priceBasis) {
    case "car":
      return t("perCar", { count: tour.maxPersons ?? 4 });
    case "adultTwin":
      return t("twinShare");
    case "adult":
      return t("perAdult");
    case "person":
      return t("perPerson");
    default:
      return "";
  }
}

export function PriceFrom({
  tour,
  size = "card",
  tone = "dark",
}: {
  tour: TourBase;
  size?: "card" | "detail";
  tone?: "dark" | "cream";
}) {
  const t = useTranslations("Price");
  const common = useTranslations("Common");
  const locale = useLocale();
  const muted = tone === "dark" ? "text-cream/60" : "text-ink-soft";
  const strong = tone === "dark" ? "text-cream" : "text-ink";

  if (tour.priceFrom === null) {
    return (
      <div>
        <span
          className={`inline-flex rounded-pill border px-3 py-1 text-[13px] font-medium ${
            tone === "dark" ? "border-gold/50 text-gold-300" : "border-gold-700/40 text-gold-700"
          }`}
        >
          {t("onRequest")}
        </span>
      </div>
    );
  }

  const approx = approxFrom(locale, tour.priceFrom);
  return (
    <div>
      <span className={`block text-[12px] ${muted}`}>{t("from")}</span>
      <span
        className={`block font-medium tracking-tight ${strong} ${
          size === "detail" ? "text-4xl md:text-5xl" : "text-2xl"
        }`}
      >
        {formatOmr(locale, tour.priceFrom, common("currency"))}
      </span>
      <span className={`block text-[12px] ${muted}`}>{basisLabel(t, tour)}</span>
      <span className={`mt-1 block text-[12px] ${muted}`}>
        {size === "detail" ? t("approxFull", approx) : t("approx", approx)}
      </span>
    </div>
  );
}
