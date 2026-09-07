import type { ImageKey } from "./images.generated";

export type TeamRole = "gm" | "holidays" | "corporate" | "umrah" | "cargo" | "care";

export type TeamMember = {
  image: ImageKey;
  name: { en: string; ar: string };
  role: TeamRole;
};

// PLACEHOLDER — every entry here is invented.
//
// Al-Hashar publishes no staff names or photographs. The portraits are stock
// photographs from Pexels and the names are made up, so the About page can
// show the team section as a layout in the demo. This was chosen knowingly for
// the pitch; before the site goes to the client as anything more than a
// mock-up, replace all six with real people, and remove this note.
export const team: TeamMember[] = [
  { image: "team-portrait-1", name: { en: "Khalid Al Busaidi", ar: "خالد البوسعيدي" }, role: "gm" },
  { image: "team-portrait-3", name: { en: "Maryam Al Balushi", ar: "مريم البلوشي" }, role: "holidays" },
  { image: "team-portrait-2", name: { en: "Salim Al Harthi", ar: "سالم الحارثي" }, role: "corporate" },
  { image: "team-portrait-6", name: { en: "Fatma Al Lawati", ar: "فاطمة اللواتي" }, role: "umrah" },
  { image: "team-portrait-5", name: { en: "Ahmed Al Rawahi", ar: "أحمد الرواحي" }, role: "cargo" },
  { image: "team-portrait-4", name: { en: "Noor Al Zadjali", ar: "نور الزدجالي" }, role: "care" },
];
