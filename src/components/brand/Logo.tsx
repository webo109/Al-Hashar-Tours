import { useLocale } from "next-intl";

export function LogoMark({
  className = "h-10 w-10",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M99.33 56.36 A44 44 0 1 1 71.05 22.65"
        stroke="#E89E00"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M56 30 L62.5 57.5 L90 64 L62.5 70.5 L56 98 L49.5 70.5 L22 64 L49.5 57.5 Z"
        fill="#E89E00"
      />
      <path d="M56 30 L62.5 57.5 L56 64 L49.5 57.5 Z" fill="#F7C65A" />
      <circle cx="56" cy="64" r="3.2" fill="#0B1220" />
      <path
        d="M34 88 C 50 76, 68 58, 92 34"
        stroke="#E89E00"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g transform="translate(101 25) rotate(-45)">
        <path
          d="M10 0 L4 -1.6 L-1 -1.6 L-5 -7 L-8 -7 L-6 -1.6 L-9 -1.6 L-11 -4 L-13 -4 L-11 0 L-13 4 L-11 4 L-9 1.6 L-6 1.6 L-8 7 L-5 7 L-1 1.6 L4 1.6 Z"
          fill="#E89E00"
        />
      </g>
    </svg>
  );
}

type LogoProps = {
  size?: "nav" | "footer" | "hero";
  className?: string;
};

export function Logo({ size = "nav", className = "" }: LogoProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  if (size === "nav") {
    return (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <LogoMark className="h-8 w-8 shrink-0" />
        {isAr ? (
          <span className="font-arabic text-[17px] font-semibold leading-none text-cream">
            الهاشر
          </span>
        ) : (
          <span className="font-latin text-[15px] font-semibold uppercase leading-none tracking-[0.2em] text-cream">
            Al-Hashar
          </span>
        )}
      </span>
    );
  }

  const markSize = size === "hero" ? "h-24 w-24 md:h-32 md:w-32" : "h-12 w-12";

  return (
    <span
      className={`inline-flex items-center gap-4 ${size === "hero" ? "flex-col gap-6" : ""} ${className}`}
    >
      <LogoMark className={`${markSize} shrink-0`} />
      <span
        className={`flex flex-col ${size === "hero" ? "items-center text-center" : "items-start"}`}
      >
        <span
          className="font-arabic text-[13px] leading-none text-gold"
          lang="ar"
          dir="rtl"
        >
          الهاشر للسياحة والسفر
        </span>
        <span
          className={`font-latin mt-2 font-semibold uppercase leading-none text-cream ${
            size === "hero"
              ? "text-3xl tracking-[0.18em] md:text-4xl"
              : "text-xl tracking-[0.16em]"
          }`}
          lang="en"
          dir="ltr"
        >
          Al-Hashar
        </span>
        <span
          className={`font-latin mt-2 uppercase leading-none tracking-[0.28em] text-sand ${
            size === "hero" ? "text-[11px]" : "text-[9px]"
          }`}
          lang="en"
          dir="ltr"
        >
          Tourism &amp; Travels LLC
        </span>
      </span>
    </span>
  );
}
