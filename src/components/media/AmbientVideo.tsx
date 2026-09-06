"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoAsset } from "@/data/videos.generated";
import { releasePlay, requestPlay, useMediaGate } from "@/lib/media";

type Mode = "ambient" | "hover" | "inview";

type Props = {
  video: VideoAsset | null;
  mode: Mode;
  active?: boolean;
  className?: string;
  objectPosition?: string;
};

// A muted looping clip layered over its poster photograph. Renders nothing
// when the visitor prefers reduced motion or data. Ambient clips wait for the
// page to load; hover clips load on first intent; in-view clips play when
// visible or when `active` says so.
export function AmbientVideo({ video, mode, active, className = "", objectPosition }: Props) {
  const allowed = useMediaGate();
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(mode !== "ambient");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mode !== "ambient" || armed) return;
    let idle = 0;
    const arm = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
      if (w.requestIdleCallback) idle = w.requestIdleCallback(() => setArmed(true));
      else idle = window.setTimeout(() => setArmed(true), 600);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      window.clearTimeout(idle);
    };
  }, [mode, armed]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed || !armed) return;
    // Pause while the tab is hidden and resume when it returns, if still in view.
    let inView = false;
    const onVisibility = () => {
      if (document.hidden) releasePlay(el);
      else if (inView) requestPlay(el);
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (mode === "ambient") {
      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView && !document.hidden) requestPlay(el);
          else releasePlay(el);
        },
        { threshold: 0.1 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        releasePlay(el);
      };
    }

    const host = el.closest<HTMLElement>("[data-clip-host]") ?? el.parentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (mode === "hover" && finePointer && host) {
      const start = () => requestPlay(el);
      const stop = () => releasePlay(el, true);
      host.addEventListener("pointerenter", start);
      host.addEventListener("pointerleave", stop);
      host.addEventListener("focusin", start);
      host.addEventListener("focusout", stop);
      return () => {
        host.removeEventListener("pointerenter", start);
        host.removeEventListener("pointerleave", stop);
        host.removeEventListener("focusin", start);
        host.removeEventListener("focusout", stop);
        document.removeEventListener("visibilitychange", onVisibility);
        releasePlay(el);
      };
    }

    // In view (and touch devices in hover mode): play while mostly visible.
    if (active === false) {
      releasePlay(el);
      document.removeEventListener("visibilitychange", onVisibility);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) requestPlay(el);
        else releasePlay(el);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      releasePlay(el);
    };
  }, [allowed, armed, mode, active]);

  if (!video || !allowed || !armed) return null;

  return (
    <video
      ref={(el) => {
        ref.current = el;
        if (el) el.muted = true;
      }}
      muted
      playsInline
      loop
      preload={mode === "ambient" ? "auto" : "none"}
      poster={video.poster}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
      className={`ambient-video ${ready ? "is-ready" : ""} ${className}`}
      style={{ objectPosition: objectPosition ?? video.position }}
    >
      {video.webm ? <source src={video.webm} type="video/webm" /> : null}
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}
