import Image from "next/image";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { HandHeart, ChatsCircle, Tag, Headset } from "@phosphor-icons/react/dist/ssr";
import { images } from "@/data/images.generated";
import { company } from "@/data/company";
import { Reveal } from "@/components/motion/Reveal";

const rangeMask: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
  maskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
};

const promises = [
  { key: "care", Icon: HandHeart },
  { key: "counselling", Icon: ChatsCircle },
  { key: "pricing", Icon: Tag },
  { key: "assistance", Icon: Headset },
] as const;

export function TrustChapter() {
  const t = useTranslations("Trust");
  const range = images["plane-hajar-sunset"];

  return (
    <section id="trust" className="relative isolate overflow-hidden">
      {/* Daylight back to dusk */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f7f2e8_0%,#d9c3a3_12%,#6d3a34_34%,#1c1d3a_58%,#0b1220_100%)]" aria-hidden />
      <div className="absolute inset-x-[-4%] bottom-0 -z-10 h-[70%]" aria-hidden style={rangeMask}>
        <Image
          src={range.src}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={range.blurDataURL}
          className="object-cover object-bottom brightness-[0.75] saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-midnight/45 mix-blend-multiply" />
        <div className="absolute inset-x-0 bottom-0 h-[35%] bg-[linear-gradient(180deg,transparent,#0b1220)]" />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 pt-40 pb-32 md:px-10 md:pt-52 md:pb-40">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-cream md:text-6xl">
              {t("headline")}
            </h2>
            <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-8">
              <div>
                <span className="block text-[13px] text-cream/60">{t("sinceLabel")}</span>
                <span className="font-latin block text-7xl font-medium leading-none tracking-tight text-cream md:text-8xl" dir="ltr">
                  {company.established}
                </span>
              </div>
              <div>
                <span className="font-latin block text-5xl font-medium leading-none tracking-tight text-gold-300 md:text-6xl" dir="ltr">
                  {company.branchesClaimed}
                </span>
                <span className="mt-2 block text-[15px] text-cream/80">
                  {t("branchesLabel", { count: company.branchesClaimed })}
                </span>
              </div>
              {company.iataAccredited ? (
                <div className="rounded-pill border border-gold/40 px-4 py-2 text-[14px] text-gold-300">
                  {t("iataLabel")}
                </div>
              ) : null}
            </div>
          </Reveal>

          <ul className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:pt-6">
            {promises.map(({ key, Icon }, i) => (
              <li key={key}>
                <Reveal delay={0.08 + i * 0.07}>
                  <Icon size={30} weight="fill" className="text-gold-300" />
                  <h3 className="mt-4 text-xl font-medium tracking-tight text-cream">{t(`promises.${key}.title`)}</h3>
                  <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-cream/75">{t(`promises.${key}.detail`)}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
