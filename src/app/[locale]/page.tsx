import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { resolveLocale } from "@/i18n/locale";
import { Hero } from "@/components/hero/Hero";
import { BookingBand } from "@/components/hero/BookingBand";
import { StoryStack } from "@/components/home/StoryStack";
import { WorldRail } from "@/components/home/WorldRail";
import { UmrahBand } from "@/components/home/UmrahBand";
import { ServicesChapter } from "@/components/home/ServicesChapter";
import { TrustChapter } from "@/components/home/TrustChapter";
import { LogoMoment } from "@/components/home/LogoMoment";
import { PaperPlane } from "@/components/motion/PaperPlane";
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

  // Keep the route inside the page without turning main into a scroll container,
  // which would break the pinned story chapters.
  return (
    <main id="content" className="relative isolate overflow-clip">
      <PaperPlane />
      <Hero content={content} />
      <BookingBand />
      <StoryStack items={stories} />
      <WorldRail />
      <UmrahBand />
      <ServicesChapter />
      <TrustChapter />
      <LogoMoment />
    </main>
  );
}
