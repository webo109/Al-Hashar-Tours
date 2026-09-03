export type Review = {
  id: string;
  name: string;
  platform: "Google" | "TripAdvisor" | "Facebook";
  rating: number;
  quote: { en: string; ar: string };
  url: string;
};

// Only verified third-party reviews belong here. Research in September 2026
// found per-branch Google listings but no accessible individual reviews, so the
// reviews chapter stays hidden until real ones are added.
export const reviews: Review[] = [];
