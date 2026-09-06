"use client";

import { useSyncExternalStore } from "react";

// Video plays only when the visitor has not asked for less motion or less data,
// and has not paused ambient video on this site.
const EVENT = "al-hashar:media";
export const AMBIENT_KEY = "ambient-video";

type NetworkInformation = { saveData?: boolean };

function subscribe(onChange: () => void) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const data = window.matchMedia("(prefers-reduced-data: reduce)");
  motion.addEventListener("change", onChange);
  data.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    motion.removeEventListener("change", onChange);
    data.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(prefers-reduced-data: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (connection?.saveData) return false;
  try {
    if (window.localStorage.getItem(AMBIENT_KEY) === "off") return false;
  } catch {
    // storage unavailable
  }
  return true;
}

export function useMediaGate(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function setAmbientVideo(on: boolean) {
  try {
    window.localStorage.setItem(AMBIENT_KEY, on ? "on" : "off");
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(EVENT));
}

// At most two clips play at once; the oldest is paused when a third starts.
const playing: HTMLVideoElement[] = [];

export function requestPlay(el: HTMLVideoElement) {
  const idx = playing.indexOf(el);
  if (idx >= 0) playing.splice(idx, 1);
  playing.push(el);
  while (playing.length > 2) {
    const oldest = playing.shift();
    oldest?.pause();
  }
  el.muted = true;
  const attempt = el.play();
  if (attempt) attempt.catch(() => releasePlay(el));
}

export function releasePlay(el: HTMLVideoElement, rewind = false) {
  const idx = playing.indexOf(el);
  if (idx >= 0) playing.splice(idx, 1);
  el.pause();
  if (rewind) {
    try {
      el.currentTime = 0;
    } catch {
      // not seekable yet
    }
  }
}
