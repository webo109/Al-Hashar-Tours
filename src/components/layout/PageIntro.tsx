import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { images, type ImageKey } from "@/data/images.generated";

// The photo band fades out before the section edge so the boundary with the
// next section is pure midnight and never reads as a line.
const mask: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 82%)",
  maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 82%)",
};

type Props = {
  title: string;
  intro?: string;
  image?: ImageKey;
  position?: string;
  children?: ReactNode;
  compact?: boolean;
};

export function PageIntro({
  title,
  intro,
  image,
  position = "50% 50%",
  children,
  compact = false,
}: Props) {
  const asset = image ? images[image] : null;
  return (
    <section
      className={`relative isolate overflow-hidden bg-midnight ${
        compact ? "pt-32 pb-12 md:pt-40 md:pb-14" : "pt-40 pb-16 md:pt-52 md:pb-20"
      }`}
    >
      {asset ? (
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grade absolute inset-0" style={mask}>
            <Image
              src={asset.src}
              alt=""
              fill
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL={asset.blurDataURL}
              className="object-cover"
              style={{ objectPosition: position }}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0.62),rgba(11,18,32,0.3)_40%,#0b1220_84%)]" />
        </div>
      ) : null}
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <h1 className="max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight text-cream md:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-cream/80">{intro}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
