import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, X, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/locale";
import { images } from "@/data/images.generated";
import { tourBySlug, tours } from "@/data/tours";
import { tourContent } from "@/data/tours.content";
import { PriceCard } from "@/components/tours/PriceCard";
import { Itinerary } from "@/components/tours/Itinerary";
import { TourCard } from "@/components/tours/TourCard";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const content = tourContent(locale)[slug];
  if (!content) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("tourTitle", { name: content.name }), description: content.summary };
}

export default async function TourPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const tour = tourBySlug(slug);
  const allContent = tourContent(locale);
  const content = allContent[slug];
  if (!tour || !content) notFound();

  const t = await getTranslations({ locale, namespace: "TourDetail" });
  const kinds = await getTranslations({ locale, namespace: "Tours" });
  const regions = await getTranslations({ locale, namespace: "Regions" });
  const hero = images[tour.image];
  const more = tours
    .filter((x) => x.slug !== tour.slug && x.regions.some((r) => tour.regions.includes(r)))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);
  const gallery = tour.gallery.filter((g) => g !== tour.image).slice(0, 3);

  return (
    <main id="content" className="bg-surface">
      <section className="relative isolate overflow-hidden">
        <div className="grade relative h-[62vh] min-h-[420px] w-full">
          <Image
            src={hero.src}
            alt={content.name}
            fill
            sizes="100vw"
            priority
            placeholder="blur"
            blurDataURL={hero.blurDataURL}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--surface-rgb)/0.55)_0%,transparent_35%,rgb(var(--surface-rgb)/0.75)_80%,var(--color-surface)_100%)]" />
        </div>

        <div className="relative mx-auto -mt-40 w-full max-w-[1200px] px-6 md:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-fg/70">
            <Link href="/" className="hover:text-fg">{t("breadcrumbHome")}</Link>
            <CaretRight size={12} className="rtl:rotate-180" />
            <Link href="/tours" className="hover:text-fg">{t("breadcrumbTours")}</Link>
            <CaretRight size={12} className="rtl:rotate-180" />
            <span className="text-fg">{content.name}</span>
          </nav>
          <div className="mt-5 flex flex-wrap gap-1.5">
            <span className="rounded-pill border border-gold/40 bg-surface/60 px-2.5 py-1 text-[12px] text-accent-text backdrop-blur-[4px]">
              {kinds(`kinds.${tour.kind}`)}
            </span>
            {tour.regions.map((r) => (
              <span key={r} className="rounded-pill border border-fg/20 bg-surface/60 px-2.5 py-1 text-[12px] text-fg/85 backdrop-blur-[4px]">
                {regions(r)}
              </span>
            ))}
          </div>
          <h1 className="mt-4 max-w-[16ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
            {content.name}
          </h1>
          <p className="mt-3 text-xl text-fg/80">{content.tagline}</p>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 pt-14 pb-28 md:px-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="flex flex-col gap-14">
          <section>
            <h2 className="text-2xl font-medium tracking-tight text-fg">{t("overview")}</h2>
            <p className="mt-4 max-w-[64ch] text-lg leading-relaxed text-fg/80">{content.summary}</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium tracking-tight text-fg">{t("highlights")}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {content.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 rounded-panel border border-fg/10 bg-surface-2 px-4 py-3.5 text-[15px] text-fg/85">
                  <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-gold" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium tracking-tight text-fg">
              {tour.kind === "package" ? t("itinerary") : t("itineraryDay")}
            </h2>
            <div className="mt-7">
              <Itinerary steps={content.itinerary} />
            </div>
          </section>

          <section className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-medium tracking-tight text-fg">{t("included")}</h2>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-fg/85">
                {content.included.map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={16} weight="bold" className="mt-1 shrink-0 text-gold" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight text-fg">{t("excluded")}</h2>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-fg/70">
                {content.excluded.map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <X size={16} weight="bold" className="mt-1 shrink-0 text-fg/40" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {content.hotels ? (
            <section>
              <h2 className="text-2xl font-medium tracking-tight text-fg">{t("hotels")}</h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {content.hotels.map((h) => (
                  <div key={h.place} className="rounded-panel border border-fg/10 bg-surface-2 p-5">
                    <dt className="font-medium text-fg">{h.place}</dt>
                    <dd className="mt-2 flex flex-col gap-1 text-[14px] text-fg/75">
                      {h.options.map((o) => (
                        <span key={o}>{o}</span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <section>
            <h2 className="text-2xl font-medium tracking-tight text-fg">{t("notes")}</h2>
            <ul className="mt-4 flex max-w-[64ch] flex-col gap-2.5 text-[15px] leading-relaxed text-fg/75">
              {content.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>

          {gallery.length ? (
            <section>
              <h2 className="text-2xl font-medium tracking-tight text-fg">{t("gallery")}</h2>
              <div className={`mt-5 grid gap-4 ${gallery.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {gallery.map((key, i) => {
                  const asset = images[key];
                  return (
                    <div
                      key={key}
                      className={`grade relative overflow-hidden rounded-panel ${
                        i === 0 && gallery.length === 3 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                      }`}
                    >
                      <Image
                        src={asset.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 800px, 100vw"
                        placeholder="blur"
                        blurDataURL={asset.blurDataURL}
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <PriceCard tour={tour} content={content} />
        </div>
      </div>

      {more.length ? (
        <section className="border-t border-fg/10">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-20 md:px-10">
            <h2 className="text-3xl font-medium tracking-tight text-fg">{t("moreTours")}</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {more.map((m) => (
                <li key={m.slug}>
                  <TourCard tour={m} content={allContent[m.slug]} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}
