import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "onCream" | "ghost";

// `ps-6 pe-2` rather than an even `px-6`: the badge is a filled disc that carries
// its own optical weight, so it sits closer to the rim than the label does.
const base =
  "group/cta inline-flex h-12 items-center justify-center gap-3 whitespace-nowrap rounded-pill ps-6 pe-2 text-[15px] font-medium transition-[transform,background-color,border-color,color] duration-300 ease-out-expo hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

// Each variant also states the two colours its badge wears — the disc and the
// glyph inside it — so changing a call-to-action colour is a one-line edit here
// rather than a hunt through fifteen call sites.
const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-600 [&_.cta-badge]:bg-cream [&_.cta-badge]:text-brand",
  secondary:
    "border border-fg/25 bg-transparent text-fg hover:border-brand hover:text-brand [&_.cta-badge]:bg-brand [&_.cta-badge]:text-cream",
  onCream:
    "border border-panel-fg/20 bg-transparent text-panel-fg hover:border-brand hover:text-brand [&_.cta-badge]:bg-brand [&_.cta-badge]:text-cream",
  ghost: "h-auto gap-2 px-0 text-brand hover:text-brand-600 [&_.cta-badge]:hidden",
};

/**
 * Base utilities a call site is allowed to replace, each paired with the shape
 * of the class that replaces it.
 *
 * Tailwind settles two rules for the same property by where they land in the
 * stylesheet, not by the order of the class attribute — utilities are emitted
 * in ascending order of their value, so `h-12` here quietly outranked an
 * `h-10` passed in by a caller. Dropping the base class is the only way to let
 * the caller's win.
 *
 * Only an unprefixed override counts: `md:h-14` narrows a breakpoint and still
 * needs `h-12` underneath it, while a bare `h-13` means to replace it outright.
 */
const overridable: ReadonlyArray<readonly [string, RegExp]> = [
  ["h-12", /(?:^|\s)h-\S+/],
  ["gap-3", /(?:^|\s)gap-\S+/],
  ["ps-6", /(?:^|\s)(?:ps|px)-\S+/],
  ["pe-2", /(?:^|\s)(?:pe|px)-\S+/],
  ["rounded-pill", /(?:^|\s)rounded-\S+/],
  ["text-[15px]", /(?:^|\s)text-(?:\[[\d.]+(?:px|rem|em)\]|xs|sm|base|lg|[2-9]?xl)(?:\s|$)/],
];

export function buttonClass(variant: Variant = "primary", extra = "") {
  const trimmed = extra.trim();
  const foundation = trimmed
    ? overridable.reduce(
        (acc, [cls, pattern]) =>
          pattern.test(trimmed) ? acc.replace(` ${cls} `, " ") : acc,
        ` ${base} `,
      )
    : base;

  return `${foundation.trim()} ${variants[variant]} ${trimmed}`.trim();
}

/**
 * The disc-and-arrow that closes every call to action. Colours come from the
 * variant on the button above; this only owns the shape and the hover nudge.
 * Mirrored in Arabic so the arrow still points away from the reading edge.
 */
export function CtaArrow() {
  return (
    <span
      className="cta-badge inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out-expo group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 rtl:group-hover/cta:-translate-x-0.5"
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 rtl:-scale-x-100"
      >
        <path d="M7 7h10v10" />
        <path d="M7 17 17 7" />
      </svg>
    </span>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
};

// Without a badge the pill wants its end padding back: `base` runs the end in
// tight so the disc can sit near the rim, which leaves a bare label lopsided.
const noArrow = "pe-6";

/**
 * A control that acts where it stands — submitting, advancing a step. It wears
 * no arrow by default: the badge points up and away, which promises navigation
 * this button does not perform.
 */
export function Button({
  variant = "primary",
  className = "",
  arrow = false,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClass(variant, `${arrow ? "" : noArrow} ${className}`)}
      {...rest}
    >
      {children}
      {arrow ? <CtaArrow /> : null}
    </button>
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
};

/** A link dressed as a button. It goes somewhere, so it keeps the arrow. */
export function LinkButton({
  variant = "primary",
  className = "",
  arrow = true,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      className={buttonClass(variant, `${arrow ? "" : noArrow} ${className}`)}
      {...rest}
    >
      {children}
      {arrow ? <CtaArrow /> : null}
    </a>
  );
}
