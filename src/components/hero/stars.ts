export type Star = { x: number; y: number; r: number; o: number; d: number };

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Deterministic so server and client render the same sky.
export const stars: Star[] = (() => {
  const rnd = lcg(7);
  return Array.from({ length: 110 }, () => ({
    x: Math.round(rnd() * 1600),
    y: Math.round(rnd() * rnd() * 420),
    r: Number((0.5 + rnd() * 1.4).toFixed(2)),
    o: Number((0.2 + rnd() * 0.65).toFixed(2)),
    d: Number((rnd() * 8).toFixed(2)),
  }));
})();
