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
      {[
        { angle: 0, colour: "#8CBF26" },
        { angle: 56, colour: "#E72E28" },
        { angle: 226, colour: "#0878C9" },
        { angle: 270, colour: "#E66F0B" },
        { angle: 314, colour: "#D7C70B" },
      ].map(({ angle, colour }) => (
        <g key={angle} transform={`rotate(${angle} 60 60)`}>
          <path
            d="M52 57 V34 H43 L60 14 L77 34 H68 V57 L60 64 Z"
            fill={colour}
          />
          <path
            d="M57 47 V31 H51 L60 21 L69 31 H63 V47"
            stroke="#FFFDF6"
            strokeWidth="4.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </g>
      ))}
      <circle cx="60" cy="60" r="5" fill="#0B1220" />
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
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <LogoMark className="h-10 w-10 shrink-0 md:h-11 md:w-11" />
        {isAr ? (
          <span className="font-arabic text-[17px] font-semibold leading-none text-fg">
            الحشار
          </span>
        ) : (
          <span className="font-latin text-[18px] font-extrabold italic leading-none tracking-[-0.02em] text-fg">
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
          الحشار للسياحة والسفر
        </span>
        <span
          className={`font-latin mt-2 font-extrabold italic leading-none text-fg ${
            size === "hero"
              ? "text-4xl tracking-[-0.03em] md:text-5xl"
              : "text-2xl tracking-[-0.02em]"
          }`}
          lang="en"
          dir="ltr"
        >
          Al-Hashar
        </span>
        <span
          className={`font-latin mt-2 italic leading-none tracking-[0.08em] text-fg-muted ${
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
