"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { WhatsappLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Button, buttonClass, CtaArrow } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { company } from "@/data/company";
import { mailtoUrl, requestReference, whatsappUrl } from "@/lib/whatsapp";
import { burstFrom } from "@/lib/confetti";

export type InquiryField = {
  name: string;
  label: string;
  type: "text" | "date" | "month" | "number" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
};

type Props = {
  context: string;
  title: string;
  intro?: string;
  fields?: InquiryField[];
  email?: string;
  messageOptional?: boolean;
  initialValues?: Record<string, string>;
};

const inputClass =
  "h-12 w-full rounded-input border border-panel-fg/15 bg-white/70 px-3 text-[15px] text-panel-fg placeholder:text-panel-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/45";

export function InquiryForm({
  context,
  title,
  intro,
  fields = [],
  email,
  messageOptional = false,
  initialValues,
}: Props) {
  const t = useTranslations("Contact");
  const booking = useTranslations("Booking");
  const [values, setValues] = useState<Record<string, string>>(initialValues ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ready, setReady] = useState<{ text: string; reference: string } | null>(null);

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!values.name?.trim()) errs.name = booking("errors.required");
    if (!values.phone?.trim()) errs.phone = booking("errors.required");
    if (!messageOptional && !values.message?.trim()) errs.message = booking("errors.required");
    for (const f of fields) if (f.required && !values[f.name]?.trim()) errs[f.name] = booking("errors.required");
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    const reference = requestReference("AH");
    const extras = fields
      .map((f) => {
        const raw = values[f.name];
        if (!raw) return null;
        const label = f.type === "select" ? (f.options?.find((o) => o.value === raw)?.label ?? raw) : raw;
        return `${f.label}: ${label}`;
      })
      .filter(Boolean);
    const text = [
      context,
      ...extras,
      t("message", {
        name: values.name.trim(),
        phone: values.phone.trim(),
        message: values.message?.trim() ?? "",
      }),
      booking("message.reference", { reference }),
    ].join("\n");
    setReady({ text, reference });
    burstFrom((e.currentTarget as HTMLFormElement).querySelector('button[type="submit"]'));
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-panel bg-panel p-6 text-panel-fg shadow-panel md:p-8"
      style={{ colorScheme: "light" }}
      aria-live="polite"
    >
      <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
      {intro ? <p className="mt-2 text-[14px] text-panel-muted">{intro}</p> : null}

      {ready ? (
        <div className="stub-print mt-6">
          <p className="text-[15px] font-medium">{t("form.ready")}</p>
          <pre className="mt-3 whitespace-pre-wrap rounded-input border border-panel-fg/10 bg-white/60 p-4 font-display text-[14px] leading-relaxed text-panel-muted">
            {ready.text}
          </pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={whatsappUrl(company.whatsapp.digits, ready.text)} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "h-11 ps-5 pe-1.5 text-[14px] [&_.cta-badge]:size-7")}>
              <WhatsappLogo size={18} weight="fill" />
              {t("form.whatsapp")}
              <CtaArrow />
            </a>
            <a href={mailtoUrl(email ?? company.email, `${context} ${ready.reference}`, ready.text)} className={buttonClass("onCream", "h-11 ps-5 pe-1.5 text-[14px] [&_.cta-badge]:size-7")}>
              <EnvelopeSimple size={18} weight="fill" />
              {t("form.email")}
              <CtaArrow />
            </a>
            <button type="button" onClick={() => setReady(null)} className="ms-auto text-[13px] text-panel-muted underline-offset-4 hover:underline">
              {booking("printed.edit")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1.5">
              <label htmlFor={`inq-${f.name}`} className="text-[12px] font-medium text-panel-muted">
                {f.label}
              </label>
              {f.type === "select" ? (
                <select id={`inq-${f.name}`} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} className={inputClass}>
                  <option value="" />
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : f.type === "date" || f.type === "month" ? (
                <DatePicker id={`inq-${f.name}`} name={f.name} label={f.label} mode={f.type}
                  value={values[f.name] ?? ""} onChange={(value) => set(f.name, value)}
                  required={f.required} error={errors[f.name]} className="h-12" />
              ) : (
                <input
                  id={`inq-${f.name}`}
                  type={f.type}
                  min={f.type === "number" ? 1 : undefined}
                  value={values[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputClass}
                />
              )}
              {errors[f.name] ? <p id={`inq-${f.name}-error`} className="text-[12px] text-[#b0361f]">{errors[f.name]}</p> : null}
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="inq-name" className="text-[12px] font-medium text-panel-muted">{t("form.name")}</label>
            <input id="inq-name" value={values.name ?? ""} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={inputClass} />
            {errors.name ? <p className="text-[12px] text-[#b0361f]">{errors.name}</p> : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="inq-phone" className="text-[12px] font-medium text-panel-muted">{t("form.phone")}</label>
            <input id="inq-phone" value={values.phone ?? ""} onChange={(e) => set("phone", e.target.value)} inputMode="tel" autoComplete="tel" placeholder="+968" dir="ltr" className={inputClass} />
            {errors.phone ? <p className="text-[12px] text-[#b0361f]">{errors.phone}</p> : null}
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="inq-message" className="text-[12px] font-medium text-panel-muted">{t("form.message")}</label>
            <textarea id="inq-message" rows={4} value={values.message ?? ""} onChange={(e) => set("message", e.target.value)} className={`${inputClass} h-auto py-3`} />
            {errors.message ? <p className="text-[12px] text-[#b0361f]">{errors.message}</p> : null}
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">{t("form.submit")}</Button>
          </div>
        </div>
      )}
    </form>
  );
}
