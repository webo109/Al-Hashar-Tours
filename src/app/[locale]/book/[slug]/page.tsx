import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Link, redirect } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/locale";
import { tourBySlug, tours } from "@/data/tours";
import { tourContent } from "@/data/tours.content";
import { BookingWizard } from "@/components/booking/BookingWizard";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return tours.filter((t) => t.priceFrom !== null).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const content = tourContent(locale)[slug];
  if (!content) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("bookTitle", { name: content.name }), robots: { index: false } };
}

export default async function BookPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const tour = tourBySlug(slug);
  const content = tourContent(locale)[slug];
  if (!tour || !content) notFound();
  // Items without a published price are quoted by a consultant instead.
  if (tour.priceFrom === null) redirect({ href: `/tours/${slug}`, locale });

  const t = await getTranslations({ locale, namespace: "Wizard" });

  return (
    <main id="content" className="bg-midnight">
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-32 pb-28 md:px-10 md:pt-40">
        <Link href={`/tours/${slug}`} className="inline-flex items-center gap-2 text-[14px] text-cream/70 hover:text-cream">
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t("backToTour", { name: content.name })}
        </Link>
        <h1 className="mt-4 text-4xl font-medium tracking-tight text-cream md:text-5xl">{t("title")}</h1>
        <p className="mt-2 text-lg text-cream/70">{content.name}</p>
        <div className="mt-10">
          <BookingWizard tour={tour} content={content} />
        </div>
      </div>
    </main>
  );
}
