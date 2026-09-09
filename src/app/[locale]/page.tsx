import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { resolveLocale } from "@/i18n/locale";
import { Hero } from "@/components/hero/Hero";
import { BookingBand } from "@/components/hero/BookingBand";
import { ProblemChapter } from "@/components/home/ProblemChapter";
import { WorldRail } from "@/components/home/WorldRail";
import { UmrahBand } from "@/components/home/UmrahBand";
import { ServicesChapter } from "@/components/home/ServicesChapter";
import { TrustChapter } from "@/components/home/TrustChapter";
import { LogoMoment } from "@/components/home/LogoMoment";
import { RouteTrail } from "@/components/motion/RouteTrail";
import { tourContent } from "@/data/tours.content";

type Props = { params: Promise<{ locale: string }> };

export default function HomePage({ params }: Props) {
  const locale = resolveLocale(use(params).locale);
  setRequestLocale(locale);
  const content = tourContent(locale);

  // Keep the route inside the page without turning main into a scroll container,
  // which would break the pinned story chapters.
  return (
    <main id="content" className="relative isolate overflow-clip">
      <RouteTrail />
      <Hero content={content} />
      <ProblemChapter />
      {/* Proof answers the problem straight away, rather than waiting until the
          bottom of the page, which is what the framework asks for. */}
      <TrustChapter />
      <BookingBand />
      <WorldRail />
      <UmrahBand />
      <ServicesChapter />
      <LogoMoment />
    </main>
  );
}
