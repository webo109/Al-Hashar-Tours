"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown, List, X } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { useLenisRef } from "@/components/motion/SmoothScroll";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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
                className={`rounded-pill px-3.5 py-2 text-[14px] transition-colors duration-300 hover:bg-fg/8 hover:text-fg ${
                  isActive(item.href) ? "text-accent-text" : "text-fg/85"
                }`}
              >
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
            <ThemeToggle />
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
