// A short burst of gold and cream paper from a point on screen, drawn on a
// single throw-away canvas. No-op under reduced motion or when the tab is hidden.
const COLOURS = ["#e89e00", "#f7c65a", "#fe7c1a", "#f7f2e8", "#d9c3a3"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  colour: string;
  life: number;
};

export function burst(origin?: { x: number; y: number }, count = 80) {
  if (typeof window === "undefined" || document.hidden) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "69",
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const x0 = origin?.x ?? window.innerWidth / 2;
  const y0 = origin?.y ?? window.innerHeight / 2;
  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
    const speed = 7 + Math.random() * 9;
    return {
      x: x0,
      y: y0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 5 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      life: 1,
    };
  });

  const started = performance.now();
  const duration = 1150;

  function frame(now: number) {
    const t = (now - started) / duration;
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of particles) {
      p.vy += 0.32;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = 1 - t;
      ctx!.save();
      ctx!.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rot);
      ctx!.fillStyle = p.colour;
      ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx!.restore();
    }
    if (t < 1) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
}

// Convenience: burst from the centre of an element (a submit button, a result panel).
export function burstFrom(el: Element | null | undefined, count?: number) {
  if (!el) return burst(undefined, count);
  const r = el.getBoundingClientRect();
  burst({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, count);
}
