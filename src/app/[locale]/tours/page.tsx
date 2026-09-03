import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { PageIntro } from "@/components/layout/PageIntro";
import { TourCatalog } from "@/components/tours/TourCatalog";
import { tours } from "@/data/tours";
import { tourContent } from "@/data/tours.content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("toursTitle"), description: t("toursDescription") };
}

export default async function ToursPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Tours" });
  const content = tourContent(locale);
  const items = tours
    .map((tour) => ({ tour, content: content[tour.slug] }))
    .filter((i) => Boolean(i.content));

  return (
    <main id="content">
      <PageIntro title={t("title")} intro={t("intro")} image="dest-jabal-akhdar-village" position="50% 60%" />
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-28 md:px-10">
        <TourCatalog items={items} />
      </section>
    </main>
  );
}
