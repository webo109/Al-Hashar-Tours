import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { resolveLocale } from "@/i18n/locale";
import { PageIntro } from "@/components/layout/PageIntro";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { company } from "@/data/company";
import type { ImageKey } from "@/data/images.generated";

const services = {
  flights: { image: "dest-muscat-skyline", division: null },
  hotels: { image: "dest-muscat-mutrah", division: null },
  holidays: { image: "dest-musandam-dhow", division: "holidays" },
  visa: { image: "extra-al-alam-palace", division: null },
  insurance: { image: "extra-grand-mosque-corridor", division: null },
  cargo: { image: "extra-musandam-cliffs", division: "cargo" },
} as const satisfies Record<string, { image: ImageKey; division: "holidays" | "cargo" | null }>;

type Slug = keyof typeof services;
type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  if (!(slug in services)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  const pages = await getTranslations({ locale, namespace: "Services.pages" });
  return {
    title: t("serviceTitle", { name: pages(`${slug as Slug}.title`) }),
    description: pages(`${slug as Slug}.intro`),
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  if (!(slug in services)) notFound();
  const key = slug as Slug;
  const service = services[key];
  const t = await getTranslations({ locale, namespace: "Services" });
  const contact = await getTranslations({ locale, namespace: "Contact" });
  const division = service.division ? company.divisions[service.division] : null;

  return (
    <main id="content">
      <PageIntro title={t(`pages.${key}.headline`)} intro={t(`pages.${key}.intro`)} image={service.image} />
      <section className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 pb-28 md:px-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
        <div>
          <ul className="flex flex-col gap-3">
            {(["one", "two", "three"] as const).map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-panel border border-cream/10 bg-midnight-800 px-5 py-4 text-[16px] text-cream/90">
                <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-gold" />
                {t(`pages.${key}.points.${p}`)}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-panel border border-gold/25 p-6">
            <h2 className="text-[13px] font-medium text-cream/60">{t("division")}</h2>
            <div className="mt-3 flex flex-col gap-2 text-[16px] text-cream">
              <a href={`tel:${(division ?? company).phone.tel}`} dir="ltr" className="hover:text-gold-300">
                {(division ?? company).phone.display}
              </a>
              <a href={`mailto:${division?.email ?? company.email}`} className="hover:text-gold-300">
                {division?.email ?? company.email}
              </a>
              <span className="text-[14px] text-cream/60">{contact("whatsapp")}: <span dir="ltr">{company.whatsapp.display}</span></span>
            </div>
          </div>
        </div>

        <InquiryForm
          context={t(`pages.${key}.title`)}
          title={t("requestTitle")}
          intro={t("requestIntro")}
          email={division?.email}
        />
      </section>
    </main>
  );
}
