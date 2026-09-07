import { projectX, projectY } from "./branch-geo";

// A deliberately simplified outline of Oman for the schematic route chart:
// roughly thirty coastal points and a handful of border points, in latitude
// and longitude, projected with the same helpers as the branch pins so the
// two agree. The coast is drawn in ink; land borders are dashed and faint so
// the chart makes no border claim. This is a sketch, not a survey.

const toPath = (points: [number, number][], close = false) =>
  points
    .map(([lat, lng], i) => `${i === 0 ? "M" : "L"}${projectX(lng).toFixed(1)} ${projectY(lat).toFixed(1)}`)
    .join(" ") + (close ? " Z" : "");

// Mainland coast, Shinas in the north round to the Yemeni border in the west.
const coast: [number, number][] = [
  [24.75, 56.47],
  [24.35, 56.72],
  [24.17, 56.89],
  [23.85, 57.44],
  [23.68, 57.89],
  [23.67, 58.19],
  [23.62, 58.57],
  [23.26, 58.93],
  [22.57, 59.53],
  [22.52, 59.8],
  [21.85, 59.6],
  [20.5, 58.5],
  [20.15, 58.2],
  [19.65, 57.7],
  [18.95, 57.8],
  [18.3, 56.6],
  [17.9, 55.6],
  [17.0, 54.7],
  [17.02, 54.09],
  [16.75, 53.4],
  [16.65, 53.1],
];

// Land borders, west to north, closing back to the coast at Shinas.
const border: [number, number][] = [
  [16.65, 53.1],
  [19.0, 52.0],
  [22.7, 55.1],
  [24.3, 55.8],
  [24.75, 56.47],
];

// The Musandam exclave, a small separate peninsula in the north.
const musandam: [number, number][] = [
  [26.38, 56.25],
  [26.15, 56.45],
  [25.72, 56.4],
  [25.65, 56.2],
  [26.0, 56.1],
];

export const omanCoastPath = toPath(coast);
export const omanBorderPath = toPath(border);
export const musandamPath = toPath(musandam, true);
