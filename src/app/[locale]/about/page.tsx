import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { PageIntro } from "@/components/layout/PageIntro";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutRecognition } from "@/components/about/AboutRecognition";

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
      <AboutStory />
      <AboutRecognition />
    </main>
  );
}
