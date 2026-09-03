import type { CSSProperties } from "react";
import { stars } from "./stars";

const SKY =
  "linear-gradient(180deg, #0b1220 0%, #0e1730 26%, #1c1d3a 42%, #3a2742 54%, #6d3a34 63%, #c2632a 71%, #e89e00 77%, #f3c47c 82%, #8a4a30 88%, #1a1826 95%, #0b1220 100%)";

export function SkyLayer() {
  return (
    <div data-layer="sky" className="absolute inset-0" style={{ background: SKY }}>
      <svg
        className="absolute inset-x-0 top-0 h-[58%] w-full"
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
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 26% at 66% 76%, rgba(254,124,26,0.42), transparent 70%)",
        }}
      />
    </div>
  );
}
