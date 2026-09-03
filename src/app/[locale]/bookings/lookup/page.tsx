import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { PageIntro } from "@/components/layout/PageIntro";
import { LookupForm } from "@/components/booking/LookupForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("lookupTitle"), robots: { index: false } };
}

export default async function LookupPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Lookup" });
  return (
    <main id="content">
      <PageIntro title={t("title")} intro={t("intro")} compact />
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-28 md:px-10">
        <LookupForm />
      </section>
    </main>
  );
}
