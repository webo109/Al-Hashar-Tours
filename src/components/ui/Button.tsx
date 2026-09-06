import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "onCream" | "ghost";

const base =
  "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-pill px-6 text-[15px] font-medium transition-[transform,background-color,border-color,color] duration-300 ease-out-expo hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-panel-fg hover:bg-gold-300",
  secondary:
    "border border-fg/25 bg-transparent text-fg hover:border-gold hover:text-accent-text",
  onCream:
    "border border-panel-fg/20 bg-transparent text-panel-fg hover:border-gold-700 hover:text-gold-700",
  ghost: "h-auto px-0 text-gold hover:text-accent-text",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={buttonClass(variant, className)} {...rest}>
      {children}
    </button>
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function LinkButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a className={buttonClass(variant, className)} {...rest}>
      {children}
    </a>
  );
}
