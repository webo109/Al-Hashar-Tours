// Topographic rings for the logo moment: nested, slightly irregular loops.
function ring(cx: number, cy: number, r: number, stretch: number, seed: number) {
  const pts: string[] = [];
  for (let a = 0; a <= 360; a += 4) {
    const rad = (a * Math.PI) / 180;
    const wobble =
      1 + 0.07 * Math.sin(3 * rad + seed) + 0.045 * Math.cos(5 * rad - seed * 1.7) + 0.03 * Math.sin(8 * rad + seed * 0.4);
    const x = cx + Math.cos(rad) * r * wobble * stretch;
    const y = cy + Math.sin(rad) * r * wobble;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

// Five rings, spread wide. There were nine packed close together, which read as
// a field of texture behind the mark rather than a halo around it.
export const contours = Array.from({ length: 5 }, (_, i) =>
  ring(800, 430, 150 + i * 108, 1.75, i * 0.9),
);
