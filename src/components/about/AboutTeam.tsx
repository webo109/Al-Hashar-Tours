import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { images } from "@/data/images.generated";
import { team } from "@/data/team";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";

// The team as a slow marquee of portraits in full colour. Under the pointer a
// card grows and lifts, its portrait zooms, and the rail holds still; the rail
// fades at both edges so it reads as passing rather than cut off. The seven
// are Al-Hashar's published Key Persons — see src/data/team.ts.
export function AboutTeam() {
  const t = useTranslations("Team");
  const locale = useLocale();
  const arabic = locale === "ar";

  return (
    <section id="team" className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <div className="mx-auto max-w-[52ch] text-center">
            <p className="text-[12px] uppercase tracking-[0.2em] text-accent-text">{t("eyebrow")}</p>
            <h2 className="mt-3 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-5xl">
              {t("headline")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-fg/75">{t("intro")}</p>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-24 bg-gradient-to-r from-surface to-transparent rtl:bg-gradient-to-l md:w-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-24 bg-gradient-to-l from-surface to-transparent rtl:bg-gradient-to-r md:w-40"
        />
        {/* Vertical room so a card can grow on hover without the rail clipping it;
            the rail itself still pauses under the pointer. */}
        <Marquee className="[--gap:1.25rem] py-6">
          {team.map((member) => {
            const asset = images[member.image];
            const name = arabic ? member.name.ar : member.name.en;
            return (
              <figure
                key={member.image}
                className="group relative h-[22rem] w-64 shrink-0 overflow-hidden rounded-panel border border-fg/10 bg-surface-2 transition-[transform,box-shadow] duration-500 ease-out-expo hover:z-10 hover:scale-[1.07] hover:shadow-lift"
              >
                <Image
                  src={asset.src}
                  alt={name}
                  fill
                  sizes="256px"
                  placeholder="blur"
                  blurDataURL={asset.blurDataURL}
                  className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.08]"
                />
                <figcaption className="absolute inset-x-3 bottom-3 rounded-[14px] bg-surface/88 px-4 py-3 backdrop-blur-sm">
                  <span className="block text-[15px] font-medium text-fg">{name}</span>
                  <span className="block text-[13px] text-fg/65">{t(`roles.${member.role}`)}</span>
                </figcaption>
              </figure>
            );
          })}
        </Marquee>
      </div>

      {/* The seven are real, so the section says where they come from. The
          invented customer quote that used to sit here is gone with the
          placeholder people. */}
      <p className="mx-auto mt-10 w-full max-w-[1200px] px-6 text-center text-[12px] uppercase tracking-[0.18em] text-fg/50 md:px-10">
        {t("source")}
      </p>
    </section>
  );
}
