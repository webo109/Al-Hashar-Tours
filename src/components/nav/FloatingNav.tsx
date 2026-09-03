"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { useLenisRef } from "@/components/motion/SmoothScroll";

export type BookingTab = "flights" | "hotels" | "omanTours" | "holidays";

const items = [
  { key: "flights", href: "/services/flights" },
  { key: "hotels", href: "/services/hotels" },
  { key: "omanTours", href: "/tours" },
  { key: "holidays", href: "/services/holidays" },
  { key: "umrah", href: "/umrah" },
  { key: "contact", href: "/contact" },
] as const;

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
  const [scrolled, setScrolled] = useState(false);

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

  const otherLocale = locale === "ar" ? "en" : "ar";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div id="nav-sentinel" aria-hidden className="absolute top-0 h-px w-px" />
      <a
        href="#content"
        className="sr-only z-[var(--z-sheet)] rounded-pill bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
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
              ? "border-cream/10 bg-midnight/75 shadow-lift backdrop-blur-[8px]"
              : "border-transparent bg-midnight/30 backdrop-blur-[6px]"
          }`}
        >
          <Link href="/" aria-label={t("home")} className="shrink-0 rounded-pill">
            <Logo size="nav" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-pill px-3.5 py-2 text-[14px] transition-colors duration-300 hover:bg-cream/8 hover:text-cream ${
                  isActive(item.href) ? "text-gold-300" : "text-cream/85"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href={pathname}
              locale={otherLocale}
              lang={otherLocale}
              scroll={false}
              aria-label={t("switchLocaleLabel")}
              className={`rounded-pill border border-cream/15 px-3.5 py-2 text-[14px] text-cream transition-colors duration-300 hover:border-gold hover:text-gold-300 ${
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
              className="flex h-11 w-11 items-center justify-center rounded-pill text-cream transition-colors hover:bg-cream/8 lg:hidden"
            >
              {open ? <X size={22} weight="light" /> : <List size={24} weight="light" />}
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
            className="fixed inset-0 z-[var(--z-sheet)] flex flex-col bg-midnight/95 px-6 pt-28 pb-10 backdrop-blur-[10px] lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Sections">
              {items.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-cream/10 py-4 text-3xl font-medium text-cream"
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
