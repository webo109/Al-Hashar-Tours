// Approximate town-centre positions for the twelve branches, used only to
// place pins on the schematic route chart on the About page. These are
// rounded gazetteer coordinates (GeoNames), not survey data: the chart is
// labelled schematic and prints no distances.
//
// Projection (equirectangular, tuned so Oman fills an 800 x 1000 box):
//   x = (lng - 52) * 93
//   y = (26.6 - lat) * 100

export type BranchGeo = { lat: number; lng: number; source: string };

const g = (id: number) => `https://www.geonames.org/${id}`;

export const branchGeo: Record<string, BranchGeo> = {
  sohar: { lat: 24.35, lng: 56.72, source: g(286245) },
  barka: { lat: 23.68, lng: 57.89, source: g(287832) },
  mabela: { lat: 23.62, lng: 58.14, source: g(6544302) },
  seeb: { lat: 23.67, lng: 58.19, source: g(286282) },
  alKhoud: { lat: 23.59, lng: 58.17, source: g(6544300) },
  ghobra: { lat: 23.6, lng: 58.44, source: g(6544298) },
  shattiAlQurum: { lat: 23.61, lng: 58.48, source: g(6544296) },
  ruwi: { lat: 23.59, lng: 58.55, source: g(286799) },
  muttrah: { lat: 23.62, lng: 58.57, source: g(287286) },
  nizwa: { lat: 22.93, lng: 57.53, source: g(286987) },
  jalanBaniBuAli: { lat: 22.02, lng: 59.33, source: g(287561) },
  salalah: { lat: 17.02, lng: 54.09, source: g(286621) },
};

// North to south as the chart flies them: the coast first, then inland.
export const routeOrder = [
  "sohar",
  "barka",
  "mabela",
  "seeb",
  "alKhoud",
  "ghobra",
  "shattiAlQurum",
  "ruwi",
  "muttrah",
  "nizwa",
  "jalanBaniBuAli",
  "salalah",
] as const;

export const projectX = (lng: number) => (lng - 52) * 93;
export const projectY = (lat: number) => (26.6 - lat) * 100;

export const FULL_VIEWBOX = "0 0 800 1000";
// The capital, where seven of the twelve sit within a few kilometres of each
// other. Same 0.8 aspect as the full chart so the zoom is a pure scale.
export const MUSCAT_VIEWBOX = "540 225 120 150";
export const ZOOM = 800 / 120;
