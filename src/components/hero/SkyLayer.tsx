import type { CSSProperties } from "react";
import { stars } from "./stars";

// The sky reads the theme: a midnight-to-sunset gradient at night, and a
// clear blue Oman morning that warms toward the horizon by day.
export function SkyLayer() {
  return (
    <div data-layer="sky" className="absolute inset-0" style={{ background: "var(--sky)" }}>
      <svg
        className="stars absolute inset-x-0 top-0 h-[58%] w-full"
        viewBox="0 0 1600 420"
        preserveAspectRatio="xMidYMin slice"
        aria-hidden
      >
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#F7F2E8"
            className="star"
            style={{ "--o": s.o, animationDelay: `${s.d}s` } as CSSProperties}
          />
        ))}
      </svg>
      <div className="absolute inset-0" style={{ background: "var(--sun-glow)" }} />
    </div>
  );
}
