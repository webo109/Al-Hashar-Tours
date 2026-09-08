import { useLocale, useTranslations } from "next-intl";
import {
  AirplaneTilt,
  Bed,
  ShieldCheck,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { LogoMark } from "@/components/brand/Logo";
import { buttonClass, CtaArrow } from "@/components/ui/Button";
import { company } from "@/data/company";
import { whatsappUrl } from "@/lib/whatsapp";
import { HeritageStamp, PassBarcode } from "./PassMarks";

const sells = [
  { key: "flights", Icon: AirplaneTilt },
  { key: "hotels", Icon: Bed },
  { key: "insurance", Icon: ShieldCheck },
] as const;

// The boarding pass keeps its shell, but what it holds is now a way through to
// Safariyati, Al-Hashar's own booking platform. Flights, hotels and insurance
// are self-serve there; anything a person has to plan stays on the stub below.
export function SafariyatiPass() {
  const t = useTranslations("Safariyati");
  const booking = useTranslations("Booking");
  const trust = useTranslations("Trust");
  const locale = useLocale();

  return (
    <div
      id="booking"
      className="pass relative w-full rounded-panel bg-panel text-panel-fg shadow-panel"
      style={{ colorScheme: "light" }}
      aria-labelledby="booking-title"
    >
      <div className="flex items-center justify-between border-b border-panel-fg/10 px-6 pt-5 pb-4">
        <span className="inline-flex items-center gap-2">
          <LogoMark className="h-7 w-7" />
          <span className="font-latin text-[12px] font-semibold uppercase tracking-[0.2em]">
            Al-Hashar
          </span>
        </span>
        <span id="booking-title" className="text-[12px] font-medium text-panel-muted">
          {booking("passTitle")}
        </span>
      </div>

      <div className="px-6 pt-6 pb-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-panel-muted">
          {t("eyebrow")}
        </p>
        <p className="font-latin mt-2 text-4xl font-semibold tracking-tight text-panel-fg" dir="ltr">
          Safariyati
        </p>
        <p className="mt-2.5 max-w-[46ch] text-[15px] leading-relaxed text-panel-muted">
          {t("intro")}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {sells.map(({ key, Icon }) => (
            <li
              key={key}
              className="inline-flex items-center gap-1.5 rounded-pill border border-panel-fg/15 px-3 py-1.5 text-[13px] font-medium"
            >
              <Icon size={15} weight="fill" className="text-gold-700" />
              {t(`items.${key}`)}
            </li>
          ))}
        </ul>

        <a
          href={company.safariyati.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("primary", "mt-6 w-full")}
        >
          {t("cta")}
          <CtaArrow />
        </a>

        <div className="mt-5 border-t border-panel-fg/10 pt-4">
          <p className="text-[12px] font-medium text-panel-muted">{t("appsLabel")}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <a
              href={company.safariyati.ios}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("onCream", "h-10 ps-4 pe-1.5 text-[13px] [&_.cta-badge]:size-6 [&_.cta-badge]:[&_svg]:size-3")}
            >
              {t("appStore")}
              <CtaArrow />
            </a>
            <a
              href={company.safariyati.android}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("onCream", "h-10 ps-4 pe-1.5 text-[13px] [&_.cta-badge]:size-6 [&_.cta-badge]:[&_svg]:size-3")}
            >
              {t("googlePlay")}
              <CtaArrow />
            </a>
          </div>
        </div>
      </div>

      <div className="relative h-0 border-t border-dashed border-panel-fg/25" aria-hidden>
        <span className="absolute -start-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-surface" />
        <span className="absolute -end-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-surface" />
      </div>

      {/* Safariyati does not sell tours, holidays or Umrah, so the stub keeps the
          human route open rather than dropping those enquiries entirely. */}
      <div className="rounded-b-panel bg-sand-300/70 px-6 pt-5 pb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] leading-relaxed text-panel-muted">{t("consultant")}</p>
            <a
              href={whatsappUrl(company.whatsapp.digits, t("consultantMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-gold-700 underline-offset-4 hover:underline"
            >
              <WhatsappLogo size={16} weight="fill" />
              {t("consultantCta")}
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="sr-only">{trust("headline")}</span>
            <HeritageStamp label={trust("sinceLabel")} />
            <PassBarcode locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
