"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "@phosphor-icons/react";

type Theme = "light" | "dark";
const EVENT = "al-hashar:theme";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Theme {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

// Light is the default experience. A deliberate visitor choice is remembered
// and applied before paint by the inline script in the layout.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("Nav");
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "light" ? "dark" : "light";
  const label = next === "light" ? t("themeToLight") : t("themeToDark");

  function toggle() {
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Private mode: the choice lasts for this page view only.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex h-11 w-11 items-center justify-center rounded-pill text-fg transition-colors hover:bg-fg/8 hover:text-accent-text ${className}`}
    >
      {next === "light" ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
    </button>
  );
}
