import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { PageIntro } from "@/components/layout/PageIntro";
import { FlightLine } from "@/components/about/FlightLine";
import { AboutAwards } from "@/components/about/AboutAwards";
import { AboutRecognition } from "@/components/about/AboutRecognition";
import { AboutTeam } from "@/components/about/AboutTeam";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const meta = await getTranslations({ locale, namespace: "Meta" });
  const about = await getTranslations({ locale, namespace: "About" });
  return { title: meta("aboutTitle"), description: about("intro") };
}

export default async function AboutPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <main id="content">
      <PageIntro title={t("headline")} intro={t("intro")} image="hero-muscat-coast" position="50% 48%" compact />
      {/* Strongest proof first, then the rest of the credentials. */}
      {/* The signature chapter: the twelve branches flown as one route. */}
      <FlightLine />
      <AboutAwards />
      <AboutRecognition />
      <AboutTeam />
    </main>
  );
}
