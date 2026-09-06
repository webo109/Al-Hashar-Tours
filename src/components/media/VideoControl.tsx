"use client";

import { useSyncExternalStore } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { AMBIENT_KEY, setAmbientVideo } from "@/lib/media";

const EVENT = "al-hashar:media";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function isOn() {
  try {
    return window.localStorage.getItem(AMBIENT_KEY) !== "off";
  } catch {
    return true;
  }
}

// Lets the visitor stop the moving background (WCAG 2.2.2); the choice sticks.
export function VideoControl({
  pauseLabel,
  playLabel,
  className = "",
}: {
  pauseLabel: string;
  playLabel: string;
  className?: string;
}) {
  const on = useSyncExternalStore(subscribe, isOn, () => true);
  const label = on ? pauseLabel : playLabel;
  return (
    <button
      type="button"
      onClick={() => setAmbientVideo(!on)}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-pill border border-fg/20 bg-surface/55 text-fg/85 backdrop-blur-[6px] transition-colors hover:border-gold hover:text-accent-text ${className}`}
    >
      {on ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
    </button>
  );
}
