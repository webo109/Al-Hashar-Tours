import type { CSSProperties, ReactNode } from "react";

// A track that scrolls its children sideways without end. The children are
// rendered twice so the loop has no seam: the animation carries the first
// copy out and the second into its place. It pauses under a pointer, reverses
// in RTL so the writing direction and the travel agree, and the stylesheet's
// reduced-motion guard stops it entirely.
export function Marquee({
  children,
  className = "",
  seconds = 42,
}: {
  children: ReactNode;
  className?: string;
  seconds?: number;
}) {
  return (
    <div
      className={`group flex overflow-hidden ${className}`}
      style={{ "--marquee-seconds": `${seconds}s` } as CSSProperties}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 ? true : undefined}
          className="marquee-track flex shrink-0 gap-[var(--gap,1.5rem)] pe-[var(--gap,1.5rem)] group-hover:[animation-play-state:paused]"
        >
          {children}
        </div>
      ))}
    </div>
  );
}
