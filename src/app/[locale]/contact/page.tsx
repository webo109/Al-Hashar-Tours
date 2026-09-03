import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone, WhatsappLogo, EnvelopeSimple, MapPin } from "@phosphor-icons/react/dist/ssr";
import { resolveLocale } from "@/i18n/locale";
import { PageIntro } from "@/components/layout/PageIntro";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { company } from "@/data/company";
import { whatsappUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  const c = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("contactTitle"), description: c("body") };
}

export default async function ContactPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });
  const branches = await getTranslations({ locale, namespace: "Branches" });
  const nav = await getTranslations({ locale, namespace: "Nav" });

  const channel = "flex items-center gap-3 rounded-panel border border-cream/10 bg-midnight-800 px-5 py-4 text-cream hover:border-gold/45";

  return (
    <main id="content">
      <PageIntro title={t("headline")} intro={t("body")} image="dest-muscat-mutrah" position="50% 70%" compact />
      <section className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 pb-28 md:px-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
        <div className="flex flex-col gap-12">
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <a href={`tel:${company.phone.tel}`} className={channel}>
                <Phone size={22} weight="fill" className="shrink-0 text-gold" />
                <span className="flex flex-col">
                  <span className="text-[12px] text-cream/55">{t("phone")}</span>
                  <span dir="ltr" className="text-[16px]">{company.phone.display}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={whatsappUrl(company.whatsapp.digits, "")} target="_blank" rel="noopener noreferrer" className={channel}>
                <WhatsappLogo size={22} weight="fill" className="shrink-0 text-gold" />
                <span className="flex flex-col">
                  <span className="text-[12px] text-cream/55">{t("whatsapp")}</span>
                  <span dir="ltr" className="text-[16px]">{company.whatsapp.display}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className={channel}>
                <EnvelopeSimple size={22} weight="fill" className="shrink-0 text-gold" />
                <span className="flex flex-col">
                  <span className="text-[12px] text-cream/55">{t("email")}</span>
                  <span className="text-[16px]">{company.email}</span>
                </span>
              </a>
            </li>
            <li>
              <div className={channel}>
                <MapPin size={22} weight="fill" className="shrink-0 text-gold" />
                <span className="flex flex-col">
                  <span className="text-[12px] text-cream/55">{t("headOffice")}</span>
                  <span className="text-[15px]">
                    {branches(company.headOffice.areaKey)}, {company.headOffice.postal}
                  </span>
                </span>
              </div>
            </li>
          </ul>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-panel border border-cream/10 p-5">
              <h2 className="text-[13px] font-medium text-cream/60">{t("holidaysDivision")}</h2>
              <a href={`tel:${company.divisions.holidays.phone.tel}`} dir="ltr" className="mt-2 block text-cream hover:text-gold-300">{company.divisions.holidays.phone.display}</a>
              <a href={`mailto:${company.divisions.holidays.email}`} className="block text-cream/80 hover:text-gold-300">{company.divisions.holidays.email}</a>
            </div>
            <div className="rounded-panel border border-cream/10 p-5">
              <h2 className="text-[13px] font-medium text-cream/60">{t("cargoDivision")}</h2>
              <a href={`tel:${company.divisions.cargo.phone.tel}`} dir="ltr" className="mt-2 block text-cream hover:text-gold-300">{company.divisions.cargo.phone.display}</a>
              <a href={`mailto:${company.divisions.cargo.email}`} className="block text-cream/80 hover:text-gold-300">{company.divisions.cargo.email}</a>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-medium tracking-tight text-cream">{t("branches")}</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] text-cream/85 sm:grid-cols-3">
              <li className="text-gold-300">{branches(company.headOffice.areaKey)}</li>
              {company.branchKeys.map((b) => (
                <li key={b}>{branches(b)}</li>
              ))}
            </ul>
          </div>
        </div>

        <InquiryForm context={nav("contact")} title={t("headline")} />
      </section>
    </main>
  );
}
