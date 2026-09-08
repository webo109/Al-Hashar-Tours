"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Button, buttonClass, CtaArrow } from "@/components/ui/Button";
import { company } from "@/data/company";
import { findRequest, type StoredRequest } from "@/lib/bookings";
import { formatDate, formatOmr } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

export function LookupForm() {
  const t = useTranslations("Lookup");
  const wizard = useTranslations("Wizard");
  const common = useTranslations("Common");
  const locale = useLocale();
  const [reference, setReference] = useState("");
  const [result, setResult] = useState<StoredRequest | null | "missing">(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = findRequest(reference);
    setResult(found ?? "missing");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form onSubmit={onSubmit} className="rounded-panel bg-panel p-6 text-panel-fg shadow-panel md:p-8" style={{ colorScheme: "light" }}>
        <label htmlFor="reference" className="text-[12px] font-medium text-panel-muted">{t("label")}</label>
        <input
          id="reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder={t("placeholder")}
          dir="ltr"
          className="mt-1.5 h-12 w-full rounded-input border border-panel-fg/15 bg-white/70 px-3 font-latin text-[16px] uppercase tracking-[0.08em] text-panel-fg placeholder:normal-case placeholder:tracking-normal placeholder:text-panel-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/45"
        />
        <Button type="submit" className="mt-4 w-full">{t("submit")}</Button>
        <p className="mt-4 text-[13px] leading-relaxed text-panel-muted">{t("hint")}</p>
        {result === "missing" ? (
          <p className="mt-3 text-[14px] text-[#b0361f]" role="alert">{t("notFound")}</p>
        ) : null}
      </form>

      {result && result !== "missing" ? (
        <article className="rounded-panel border border-fg/10 bg-surface-2 p-6 text-fg md:p-8" aria-live="polite">
          <span className="text-[12px] text-fg/55">{t("found", { reference: result.reference })}</span>
          <h2 className="mt-2 text-2xl font-medium tracking-tight">
            <Link href={`/tours/${result.slug}`} className="hover:text-accent-text">{result.name}</Link>
          </h2>
          <p className="text-[13px] text-fg/55">
            {t("madeOn", { date: formatDate(locale, result.createdAt.slice(0, 10)) })}
          </p>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[14px]">
            <dt className="text-fg/55">{wizard("review.date")}</dt>
            <dd>{formatDate(locale, result.date)}</dd>
            <dt className="text-fg/55">{wizard("review.travellers")}</dt>
            <dd>{wizard("review.adultsChildren", { adults: result.adults, children: result.children })}</dd>
            {result.estimate !== null ? (
              <>
                <dt className="text-fg/55">{wizard("review.estimate")}</dt>
                <dd>{formatOmr(locale, result.estimate, common("currency"))}</dd>
              </>
            ) : null}
          </dl>
          <a
            href={whatsappUrl(company.whatsapp.digits, result.message)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("primary", "mt-6")}
          >
            <WhatsappLogo size={18} weight="fill" />
            {t("resend")}
            <CtaArrow />
          </a>
        </article>
      ) : null}
    </div>
  );
}
