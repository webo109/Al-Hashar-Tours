"use client";

import { useRef } from "react";
import { CalendarPanel, type CalendarPanelProps } from "@/components/ui/CalendarPanel";

// Keying the shared calendar keeps the view aligned with the wizard's quick dates.
export function Calendar(props: CalendarPanelProps) {
  const root = useRef<HTMLDivElement>(null);
  return <div ref={root}>
    <CalendarPanel key={`${props.value ?? ""}-${props.min ?? ""}-${props.max ?? ""}`} {...props}
      onChange={(iso) => {
        props.onChange(iso);
        queueMicrotask(() => root.current?.querySelector<HTMLButtonElement>('[data-calendar-focus="true"]')?.focus({ preventScroll: true }));
      }} />
  </div>;
}
