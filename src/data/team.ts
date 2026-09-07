import type { ImageKey } from "./images.generated";

export type TeamRole =
  | "ceo"
  | "operations"
  | "bizdev"
  | "salesGovt"
  | "finance"
  | "corporates"
  | "branches";

export type TeamMember = {
  image: ImageKey;
  name: { en: string; ar: string };
  role: TeamRole;
};

// The seven Key Persons exactly as Al-Hashar publish them on
// alhashartravels.com/about-us (September 2026): names, titles and the order
// they appear in. The photographs are theirs, fetched from that page, so the
// person-to-portrait mapping is the client's own, not a guess. Arabic names are
// transliterations; the client has not published Arabic forms.
export const team: TeamMember[] = [
  { image: "team-mehmood", name: { en: "M. Mehmood", ar: "م. محمود" }, role: "ceo" },
  { image: "team-manjula-kamath", name: { en: "Manjula Kamath", ar: "مانجولا كاماث" }, role: "operations" },
  { image: "team-yasir-al-amri", name: { en: "Yasir Al Amri", ar: "ياسر العامري" }, role: "bizdev" },
  { image: "team-yousuf-al-balushi", name: { en: "Yousuf Al Balushi", ar: "يوسف البلوشي" }, role: "salesGovt" },
  { image: "team-nouman-nasir", name: { en: "Nouman Nasir", ar: "نعمان ناصر" }, role: "finance" },
  { image: "team-shaji-sajsha", name: { en: "Muhammed Shaji Sajsha", ar: "محمد شاجي ساجشا" }, role: "corporates" },
  { image: "team-vinod-pillai", name: { en: "Vinod Pillai", ar: "فينود بيلاي" }, role: "branches" },
];
