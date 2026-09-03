import Image from "next/image";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import {
  AirplaneTilt,
  Bed,
  Compass,
  Mosque,
  Package,
  ShieldCheck,
  Stamp,
  SunHorizon,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { images } from "@/data/images.generated";
import { services } from "@/data/services";
import { Reveal } from "@/components/motion/Reveal";

const icons = { SunHorizon, AirplaneTilt, Bed, Compass, Stamp, Mosque, ShieldCheck, Package } as const;

const duneMask: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
  maskImage: "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
};

export function ServicesChapter() {
  const t = useTranslations("Services");
  const dunes = images["plane-dunes-daylight"];

  return (
    <section id="services" className="relative isolate">
      {/* Night to daylight: the one theme switch on the page. */}
      <div className="relative h-[46vh] min-h-[280px] overflow-hidden bg-[linear-gradient(180deg,#0b1220_0%,#3b2f3a_35%,#c9955a_70%,#e8d9c1_100%)]" aria-hidden>
        <div className="absolute inset-x-[-6%] bottom-[-8%] h-[80%]" style={duneMask}>
          <Image
            src={dunes.src}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={dunes.blurDataURL}
            className="object-cover object-[50%_65%] brightness-[1.05] saturate-[0.9]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(232,217,193,0)_0%,rgba(232,217,193,0.35)_60%,#f7f2e8_100%)]" />
        </div>
      </div>

      <div className="bg-cream text-ink">
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-28 pt-6 md:px-10 md:pb-36">
          <Reveal>
            <h2 className="max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
              {t("headline")}
            </h2>
          </Reveal>

          <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:auto-rows-[190px] lg:grid-cols-12">
            {services.map((s, i) => {
              const Icon = icons[s.icon];
              const asset = s.image ? images[s.image] : null;
              const base =
                "group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-panel transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_var(--color-gold),0_22px_48px_-28px_rgba(11,18,32,0.45)]";
              const tone =
                s.tone === "photo"
                  ? "text-cream"
                  : s.tone === "sand"
                    ? "bg-sand-300/70 text-ink"
                    : "border border-ink/10 bg-white/50 text-ink";
              return (
                <li key={s.id} className={s.span}>
                  <Reveal className="h-full" delay={Math.min(i, 5) * 0.05}>
                    <Link href={s.href} className={`${base} ${tone}`}>
                      {asset ? (
                        <>
                          <div className="grade absolute inset-0">
                            <Image
                              src={asset.src}
                              alt=""
                              fill
                              sizes="(min-width: 1024px) 700px, 100vw"
                              placeholder="blur"
                              blurDataURL={asset.blurDataURL}
                              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                            />
                          </div>
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0.05)_30%,rgba(11,18,32,0.82)_100%)]" />
                        </>
                      ) : null}
                      <div className="relative mt-auto flex flex-col p-6">
                        <Icon
                          size={28}
                          weight="fill"
                          className={s.tone === "photo" ? "text-gold-300" : "text-gold-700"}
                        />
                        <span className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-xl font-medium tracking-tight">{t(`items.${s.id}.title`)}</span>
                          <ArrowUpRight
                            size={18}
                            className={`shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rtl:-scale-x-100 ${
                              s.tone === "photo" ? "text-gold-300" : "text-gold-700"
                            }`}
                          />
                        </span>
                        <span
                          className={`mt-1.5 text-[14px] leading-relaxed transition-opacity duration-500 ${
                            s.tone === "photo" ? "text-cream/85" : "text-ink-soft lg:opacity-0 lg:group-hover:opacity-100"
                          }`}
                        >
                          {t(`items.${s.id}.detail`)}
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
