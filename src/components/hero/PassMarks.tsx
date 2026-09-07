// The two printed marks on the boarding pass stub, kept apart from whatever the
// pass currently holds so the paper keeps its character when the contents change.

export function HeritageStamp({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-16 w-16 shrink-0 -rotate-12 text-gold-700 opacity-75"
      aria-hidden
    >
      <defs>
        <path id="heritage-ring" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
      </defs>
      <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="29" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text
        className="font-latin"
        fontSize="10.5"
        fontWeight="600"
        letterSpacing="2.2"
        fill="currentColor"
      >
        <textPath href="#heritage-ring">AL-HASHAR · MUSCAT · TOURISM &amp; TRAVELS ·</textPath>
      </text>
      <text x="60" y="56" textAnchor="middle" fontSize="9" letterSpacing="1" fill="currentColor">
        {label}
      </text>
      <text
        className="font-latin"
        x="60"
        y="74"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        fill="currentColor"
      >
        1984
      </text>
    </svg>
  );
}

export function PassBarcode({ locale }: { locale: string }) {
  return (
    <svg
      className="hidden h-7 w-20 shrink-0 text-panel-fg/70 sm:block"
      viewBox="0 0 96 28"
      aria-hidden
      lang={locale}
    >
      {[2, 6, 9, 14, 17, 22, 27, 30, 36, 40, 43, 48, 52, 57, 62, 65, 70, 74, 79, 84, 88, 92].map(
        (x, i) => (
          <rect key={x} x={x} y="2" width={i % 3 === 0 ? 2.5 : 1.2} height="24" fill="currentColor" />
        ),
      )}
    </svg>
  );
}
