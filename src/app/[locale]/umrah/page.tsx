import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { resolveLocale } from "@/i18n/locale";
import { PageIntro } from "@/components/layout/PageIntro";
import { InquiryForm } from "@/components/forms/InquiryForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  const u = await getTranslations({ locale, namespace: "Umrah" });
  return { title: t("umrahTitle"), description: u("body") };
}

export default async function UmrahPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Umrah" });

  return (
    <main id="content">
      <PageIntro title={t("headline")} intro={t("page.intro")} image="umrah-haram-night" position="50% 40%" />
      <section className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 pb-28 md:px-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
        <div className="flex flex-col gap-12">
          <ul className="grid gap-3 sm:grid-cols-2">
            {(["visa", "flights", "hotels", "guidance"] as const).map((k) => (
              <li key={k} className="flex items-start gap-3 rounded-panel border border-cream/10 bg-midnight-800 px-5 py-4 text-[16px] text-cream/90">
                <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-gold" />
                {t(`inclusions.${k}`)}
              </li>
            ))}
          </ul>

          <div>
            <h2 className="text-2xl font-medium tracking-tight text-cream">{t("page.stepsTitle")}</h2>
            <ol className="mt-6 grid gap-6 md:grid-cols-3">
              {(["one", "two", "three"] as const).map((k) => (
                <li key={k} className="border-t border-gold/40 pt-4">
                  <h3 className="text-lg font-medium text-cream">{t(`page.steps.${k}.title`)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-cream/75">{t(`page.steps.${k}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <InquiryForm
          context={t("cta")}
          title={t("page.formTitle")}
          messageOptional
          fields={[
            { name: "month", label: t("page.month"), type: "month", required: true },
            { name: "pilgrims", label: t("page.pilgrims"), type: "number", required: true },
            {
              name: "hotel",
              label: t("page.hotelPreference"),
              type: "select",
              options: [
                { value: "standard", label: t("page.hotelOptions.standard") },
                { value: "nearHaram", label: t("page.hotelOptions.nearHaram") },
                { value: "premium", label: t("page.hotelOptions.premium") },
              ],
            },
          ]}
        />
      </section>
    </main>
  );
}
