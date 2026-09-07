import Image from "next/image";
import { useTranslations } from "next-intl";
import { images } from "@/data/images.generated";
import { Reveal } from "@/components/motion/Reveal";

// The four pains named here are the inverse of the four promises in TrustChapter,
// so the problem stated at the top of the page is answered further down it.
const pains = ["tabs", "visa", "price", "silence"] as const;

// The quiet beat between the hero and the boarding pass: what planning a trip
// alone actually costs, before the page offers to take it off your hands.
export function ProblemChapter() {
  const t = useTranslations("Problem");
  const asset = images["extra-airport-wait"];

  return (
    <section id="problem" className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="grid gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] lg:gap-x-16 lg:gap-y-0">
          <Reveal className="lg:col-start-1 lg:row-start-1">
            <h2 className="max-w-[16ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
              {t("headline")}
            </h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-fg/80">{t("intro")}</p>
          </Reveal>

          {/* Deliberately outside the page's standard .grade: this photograph is
              muted and dimmed so it reads as mood behind the text, not as a view. */}
          <Reveal
            delay={0.1}
            className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-stretch"
            amount={0.15}
          >
            <div className="relative h-full min-h-[260px] overflow-hidden rounded-panel border border-fg/10">
              <Image
                src={asset.src}
                alt={t("imageAlt")}
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                placeholder="blur"
                blurDataURL={asset.blurDataURL}
                className="object-cover object-[50%_45%] contrast-[1.02] saturate-[0.55]"
              />
              {/* Fades into the page at the bottom edge rather than veiling the whole
                  frame: a flat scrim in the surface colour turns milky in light mode. */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_45%,rgb(var(--surface-rgb)/0.5)_100%)]" />
            </div>
          </Reveal>

          <div className="lg:col-start-1 lg:row-start-2 lg:pt-14">
            <ul className="divide-y divide-fg/10 border-y border-fg/10">
              {pains.map((key, i) => (
                <li key={key} className="py-6">
                  <Reveal delay={0.06 * i}>
                    <h3 className="text-xl font-medium tracking-tight text-fg">{t(`items.${key}.title`)}</h3>
                    <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-fg/70">
                      {t(`items.${key}.detail`)}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal delay={0.1}>
              <p className="mt-10 border-s-2 border-gold/55 ps-5 text-balance text-2xl font-medium leading-snug tracking-tight text-fg md:text-3xl">
                {t("cost")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
