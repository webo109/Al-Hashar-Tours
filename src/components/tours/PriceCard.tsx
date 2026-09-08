import { useLocale, useTranslations } from "next-intl";
import { SealCheck, Compass, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { buttonClass, CtaArrow } from "@/components/ui/Button";
import { company } from "@/data/company";
import type { TourBase, TourContent } from "@/data/tours";
import { formatOmr } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { PriceFrom } from "./PriceText";
import { durationLabel } from "./TourCard";

export function PriceCard({ tour, content }: { tour: TourBase; content: TourContent }) {
  const t = useTranslations("TourDetail");
  const tours = useTranslations("Tours");
  const stories = useTranslations("Stories");
  const price = useTranslations("Price");
  const regions = useTranslations("Regions");
  const common = useTranslations("Common");
  const wizard = useTranslations("Wizard");
  const locale = useLocale();

  const quoteText = wizard("message.intro", { name: content.name });

  return (
    <aside
      className="rounded-panel bg-panel p-6 text-panel-fg shadow-panel md:p-7"
      style={{ colorScheme: "light" }}
    >
      <PriceFrom tour={tour} size="detail" tone="cream" />

      {tour.priceTiers ? (
        <dl className="mt-5 grid grid-cols-[1fr_auto] gap-y-2 border-t border-panel-fg/10 pt-4 text-[14px]">
          {tour.priceTiers.map((tier) => (
            <div key={tier.tier} className="contents">
              <dt className="text-panel-muted">{price(`tiers.${tier.tier}`)}</dt>
              <dd className="font-medium">{formatOmr(locale, tier.price, common("currency"))}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-panel-fg/10 pt-4 text-[14px]">
        <div>
          <dt className="text-[12px] text-panel-muted">{stories("duration")}</dt>
          <dd className="font-medium">{durationLabel(tours, tour)}</dd>
        </div>
        <div>
          <dt className="text-[12px] text-panel-muted">{tours("region")}</dt>
          <dd className="font-medium">{tour.regions.map((r) => regions(r)).join(", ")}</dd>
        </div>
        {tour.startTime ? (
          <div className="col-span-2">
            <dt className="sr-only">{stories("duration")}</dt>
            <dd className="font-medium">
              {tour.endTime
                ? t("timing", { start: tour.startTime, end: tour.endTime })
                : t("startsAt", { start: tour.startTime })}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-6">
        {tour.priceFrom !== null ? (
          <Link href={`/book/${tour.slug}`} className={buttonClass("primary", "w-full")}>
            {t("cta")}
            <CtaArrow />
          </Link>
        ) : (
          <a
            href={whatsappUrl(company.whatsapp.digits, quoteText)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("primary", "w-full")}
          >
            <WhatsappLogo size={18} weight="fill" />
            {t("quoteCta")}
            <CtaArrow />
          </a>
        )}
      </div>

      <ul className="mt-6 flex flex-col gap-2.5 text-[13px] text-panel-muted">
        <li className="flex items-center gap-2">
          <SealCheck size={18} weight="fill" className="text-gold-700" />
          {t("reassurance.iata")}
        </li>
        <li className="flex items-center gap-2">
          <Compass size={18} weight="fill" className="text-gold-700" />
          {t("reassurance.since")}
        </li>
        <li className="flex items-center gap-2">
          <WhatsappLogo size={18} weight="fill" className="text-gold-700" />
          <span dir="ltr">{t("reassurance.whatsapp", { number: company.whatsapp.display })}</span>
        </li>
      </ul>
      <p className="mt-5 text-[12px] leading-relaxed text-panel-muted">{t("priceNote")}</p>
    </aside>
  );
}
