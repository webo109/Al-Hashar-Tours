"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarBlank, X } from "@phosphor-icons/react";
import { CalendarPanel } from "./CalendarPanel";
import { calendarLabel, type CalendarMode } from "@/lib/calendar";
import { useLenisRef } from "@/components/motion/SmoothScroll";

type Props = {
  id: string; name: string; label: string; value: string; onChange: (value: string) => void;
  mode?: CalendarMode; min?: string; max?: string; error?: string; required?: boolean; className?: string;
};

export function DatePicker({ id, name, label, value, onChange, mode = "date", min, max, error, required, className = "" }: Props) {
  const t = useTranslations("DatePicker");
  const locale = useLocale();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const display = value ? calendarLabel(value, locale, mode) : t(mode === "date" ? "chooseDate" : "chooseMonth");

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <button ref={trigger} type="button" id={id} data-date-picker={mode}
        aria-label={`${label}: ${display}${required ? ` (${t("required")})` : ""}`} aria-haspopup="dialog" aria-expanded={open}
        aria-controls={open ? `${id}-dialog` : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => setOpen(true)}
        className={`flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-input border bg-white/70 px-3 text-start text-[15px] transition-colors focus:outline-none focus:ring-2 focus:ring-gold/45 ${error ? "border-[#b0361f]" : "border-panel-fg/15 hover:border-gold/60 focus:border-gold"} ${value ? "text-panel-fg" : "text-panel-muted/60"} ${className}`}>
        <span className="truncate">{display}</span>
        <CalendarBlank size={18} aria-hidden className="shrink-0 text-gold-700" />
      </button>
      {open && <DatePickerDialog id={id} label={label} value={value} mode={mode} min={min} max={max} trigger={trigger}
        onClose={() => setOpen(false)} onChange={(iso) => { onChange(iso); setOpen(false); }} />}
    </>
  );
}

function DatePickerDialog({ id, label, value, mode, min, max, onChange, onClose, trigger }: {
  id: string; label: string; value: string; mode: CalendarMode; min?: string; max?: string;
  onChange: (value: string) => void; onClose: () => void; trigger: RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations("DatePicker");
  const locale = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  const lenisRef = useLenisRef();

  useLayoutEffect(() => {
    const element = dialog.current;
    const anchor = trigger.current;
    if (!element || !anchor) return;
    const lenis = lenisRef?.current;
    const wasStopped = lenis?.isStopped;
    lenis?.stop();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!element.open) element.showModal();
    function position() {
      if (!element || !anchor) return;
      const box = anchor.getBoundingClientRect();
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const mobile = vw < 640;
      const left = mobile ? (vw - width) / 2 : Math.max(12, Math.min(locale === "ar" ? box.right - width : box.left, vw - width - 12));
      const preferred = box.bottom + 8 + height <= vh - 12 ? box.bottom + 8 : box.top - height - 8;
      const top = mobile ? Math.max(12, vh - height - 12) : Math.max(12, Math.min(preferred, vh - height - 12));
      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
    }
    position();
    element.querySelector<HTMLButtonElement>('[data-calendar-focus="true"]')?.focus({ preventScroll: true });
    const observer = new ResizeObserver(position);
    observer.observe(element);
    window.addEventListener("resize", position);
    window.visualViewport?.addEventListener("resize", position);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", position);
      window.visualViewport?.removeEventListener("resize", position);
      document.body.style.overflow = overflow;
      if (!wasStopped) lenis?.start();
      // The trigger is inert until React removes the modal from the top layer.
      queueMicrotask(() => { if (anchor.isConnected) anchor.focus({ preventScroll: true }); });
    };
  }, [locale, lenisRef, trigger]);

  return (
    <dialog ref={dialog} id={`${id}-dialog`} aria-labelledby={`${id}-dialog-title`} onClose={onClose}
      dir={locale === "ar" ? "rtl" : "ltr"} data-lenis-prevent
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
      }}
      className="fixed m-0 overflow-y-auto overscroll-contain rounded-[26px] border border-fg/15 bg-surface-2 p-3 text-fg shadow-panel backdrop:bg-midnight/35 backdrop:backdrop-blur-[3px]"
      style={{ width: "min(350px, calc(100vw - 24px))", maxHeight: "calc(100dvh - 24px)", inset: "auto" }}>
      <div className="mb-2 flex items-center justify-between gap-2 ps-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-accent-text">{t("eyebrow")}</p>
          <h2 id={`${id}-dialog-title`} className="mt-0.5 text-[17px] font-medium">{label}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label={t("close")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-fg/10 text-fg-muted hover:bg-fg/5 hover:text-fg">
          <X size={17} aria-hidden />
        </button>
      </div>
      <CalendarPanel value={value || null} mode={mode} min={min} max={max} onChange={onChange} />
      <div className="mt-2 flex items-center justify-between px-1">
        <button type="button" disabled={!value} onClick={() => onChange("")} className="min-h-10 rounded-full px-3 text-[12px] text-fg-muted hover:bg-fg/5 disabled:opacity-30">{t("clear")}</button>
        <button type="button" onClick={onClose} className="min-h-10 rounded-full px-4 text-[12px] font-medium text-accent-text hover:bg-gold/10">{t("cancel")}</button>
      </div>
    </dialog>
  );
}
