import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { resolveLocale } from "@/i18n/locale";
import { Hero } from "@/components/hero/Hero";
import { StoryStack } from "@/components/home/StoryStack";
import { UmrahBand } from "@/components/home/UmrahBand";
import { ServicesChapter } from "@/components/home/ServicesChapter";
import { TrustChapter } from "@/components/home/TrustChapter";
import { LogoMoment } from "@/components/home/LogoMoment";
import { featuredTours } from "@/data/tours";
import { tourContent } from "@/data/tours.content";

type Props = { params: Promise<{ locale: string }> };

export default function HomePage({ params }: Props) {
  const locale = resolveLocale(use(params).locale);
  setRequestLocale(locale);
  const content = tourContent(locale);
  const stories = featuredTours()
    .map((tour) => ({ tour, content: content[tour.slug] }))
    .filter((s) => Boolean(s.content));

  return (
    <main id="content">
      <Hero />
      <StoryStack items={stories} />
      <UmrahBand />
      <ServicesChapter />
      <TrustChapter />
      <LogoMoment />
    </main>
  );
}
