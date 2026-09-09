"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown, List, X } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { useLenisRef } from "@/components/motion/SmoothScroll";

export type BookingTab = "flights" | "hotels" | "omanTours" | "holidays";

const primaryItems = [
  { key: "flights", href: "/services/flights" },
  { key: "omanTours", href: "/tours" },
  { key: "contact", href: "/contact" },
] as const;

const moreItems = [
  { key: "hotels", href: "/services/hotels" },
  { key: "holidays", href: "/services/holidays" },
  { key: "umrah", href: "/umrah" },
  { key: "about", href: "/about" },
] as const;

const mobileItems = [primaryItems[0], moreItems[0], primaryItems[1], moreItems[1], moreItems[2], primaryItems[2], moreItems[3]] as const;

export function requestBookingTab(tab: BookingTab) {
  window.dispatchEvent(new CustomEvent("booking:tab", { detail: tab }));
}

// The house mascot: the same paper plane that flies the page, hanging under the
// open page's nav item with its nose pointing up at it. There is no room above
// the header — it sits 12px from the top of the window — so it perches below.
// It pops in once the page has been scrolled, and glides between items on the
// shared layoutId rather than jumping.
function NavPlane({ scrolled, reduce }: { scrolled: boolean; reduce: boolean }) {
  return (
    <motion.span
      layoutId="nav-plane"
      aria-hidden
      // Centred by the flex parent, not a transform: Motion drives transforms on
      // a layout-animated element, and a CSS translate here would fight it.
      className="pointer-events-none absolute inset-x-0 -bottom-8 flex justify-center"
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
    >
      <motion.span
        className="text-gold drop-shadow-[0_4px_8px_rgb(0_0_0/0.35)]"
        initial={false}
        animate={
          reduce
            ? { opacity: scrolled ? 1 : 0 }
            : {
                opacity: scrolled ? 1 : 0,
                scale: scrolled ? 1 : 0.4,
                y: scrolled ? [0, -2.5, 0] : -8,
              }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                opacity: { type: "spring", stiffness: 500, damping: 24 },
                scale: { type: "spring", stiffness: 500, damping: 18 },
                y: scrolled
                  ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                  : { type: "spring", stiffness: 500, damping: 24 },
              }
        }
      >
        {/* Rotated so the nose points up at the item it marks. */}
        <svg viewBox="0 0 24 24" className="h-4 w-4 -rotate-45" fill="currentColor">
          <path d="M2.2 12.2 21.5 3.4c.5-.2 1 .3.8.8l-6.6 17.4c-.2.5-.9.6-1.2.1l-3.1-5.2-5.2-3.1c-.5-.3-.4-1 .0-1.2Z" />
          <path d="M11.4 16.5 21 4.3" stroke="rgb(11 18 32 / 0.35)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </motion.span>
    </motion.span>
  );
}

export function FloatingNav() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const lenisRef = useLenisRef();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = document.getElementById("nav-sentinel");
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      rootMargin: "-1px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const lenis = lenisRef?.current;
    lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenisRef]);

  useEffect(() => {
    if (!moreOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMoreOpen(false);
      moreButtonRef.current?.focus();
    };
    window.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [moreOpen]);

  const otherLocale = locale === "ar" ? "en" : "ar";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div id="nav-sentinel" aria-hidden className="absolute top-0 h-px w-px" />
      <a
        href="#content"
        className="sr-only z-[var(--z-sheet)] rounded-pill bg-gold px-4 py-2 text-panel-fg focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t("skipToContent")}
      </a>

      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-nav)] flex justify-center px-3 pt-3 md:px-6 md:pt-5"
        aria-label="Primary"
      >
        <div
          className={`pointer-events-auto flex h-16 w-full max-w-[1200px] items-center justify-between rounded-pill border ps-4 pe-2 transition-[background-color,border-color,box-shadow] duration-500 ease-out-expo ${
            scrolled
              ? "border-fg/10 bg-surface/75 shadow-lift backdrop-blur-[8px]"
              : "border-transparent bg-surface/30 backdrop-blur-[6px]"
          }`}
        >
          <Link href="/" aria-label={t("home")} className="shrink-0 rounded-pill">
            <Logo size="nav" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
            {primaryItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative rounded-pill px-3.5 py-2 text-[14px] transition-colors duration-300 hover:text-fg ${
                  isActive(item.href) ? "text-accent-text" : "text-fg/85 hover:bg-fg/8"
                }`}
              >
                {/* One shared layoutId means the marker glides from the old page's
                    item to the new one instead of blinking between them. */}
                {isActive(item.href) ? (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-pill border border-gold/35 bg-gold/12"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                ) : null}
                {isActive(item.href) ? <NavPlane scrolled={scrolled} reduce={!!reduce} /> : null}
                {t(item.key)}
              </Link>
            ))}

            <div ref={moreRef} className="relative">
              <button
                ref={moreButtonRef}
                type="button"
                aria-expanded={moreOpen}
                aria-controls="more-navigation"
                onClick={() => setMoreOpen((value) => !value)}
                className={`flex items-center gap-1 rounded-pill px-3.5 py-2 text-[14px] transition-colors duration-300 hover:bg-fg/8 hover:text-fg ${
                  moreItems.some((item) => isActive(item.href)) ? "text-accent-text" : "text-fg/85"
                }`}
              >
                {t("more")}
                <CaretDown size={14} className={`transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {moreOpen ? (
                  <motion.nav
                    id="more-navigation"
                    aria-label={t("more")}
                    initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute end-0 top-full mt-2 w-52 overflow-hidden rounded-[16px] border border-fg/12 bg-surface-2/95 p-2 shadow-panel backdrop-blur-[10px]"
                  >
                    {moreItems.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        onClick={() => setMoreOpen(false)}
                        className={`flex min-h-11 items-center rounded-[11px] px-3.5 text-[14px] transition-colors hover:bg-fg/8 hover:text-fg ${
                          isActive(item.href) ? "bg-accent-text/10 text-accent-text" : "text-fg/85"
                        }`}
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </motion.nav>
                ) : null}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href={pathname}
              locale={otherLocale}
              lang={otherLocale}
              scroll={false}
              aria-label={t("switchLocaleLabel")}
              className={`rounded-pill border border-fg/15 px-3.5 py-2 text-[14px] text-fg transition-colors duration-300 hover:border-gold hover:text-accent-text ${
                otherLocale === "ar" ? "font-arabic" : "font-latin"
              }`}
            >
              {t("switchLocale")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-sheet"
              aria-label={open ? t("closeMenu") : t("openMenu")}
              className="flex h-11 w-11 items-center justify-center rounded-pill text-fg transition-colors hover:bg-fg/8 lg:hidden"
            >
              {open ? <X size={22} weight="regular" /> : <List size={26} weight="regular" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-sheet"
            role="dialog"
            aria-modal="true"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[var(--z-sheet)] flex flex-col bg-surface/95 px-6 pt-28 pb-10 backdrop-blur-[10px] lg:hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("closeMenu")}
              className="absolute end-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-fg/20 bg-surface/70 text-fg transition-colors hover:border-gold hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <X size={25} weight="bold" aria-hidden />
            </button>
            <nav className="flex flex-col gap-1" aria-label="Sections">
              {mobileItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-fg/10 py-4 text-3xl font-medium text-fg"
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
