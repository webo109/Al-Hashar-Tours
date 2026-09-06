// "Pick your adventure": a few taps narrow the catalog to three suggestions.
import { featuredTours, tours, type TourBase } from "./tours";
import { world, worldWithPhotos, type Mood, type WorldPackage } from "./world";

export type Place = "sea" | "mountains" | "desert" | "heritage" | "abroad";
export type Time = "halfDay" | "fullDay" | "severalDays";
export type Pace = "easy" | "active";

export const tourTags: Record<string, { places: Exclude<Place, "abroad">[]; pace: Pace }> = {
  "quickie-oman": { places: ["heritage"], pace: "easy" },
  "glimpse-oman": { places: ["desert", "heritage"], pace: "easy" },
  "authentic-oman": { places: ["desert", "sea", "heritage"], pace: "active" },
  "magnificent-oman": { places: ["mountains", "sea", "heritage"], pace: "active" },
  "historical-treasures-of-oman": { places: ["heritage"], pace: "easy" },
  "awesome-oman": { places: ["mountains", "desert", "sea", "heritage"], pace: "active" },
  "enchanting-oman": { places: ["mountains", "desert", "sea", "heritage"], pace: "active" },
  "coastal-road-tour": { places: ["sea"], pace: "active" },
  "daymaniyat-islands": { places: ["sea"], pace: "easy" },
  "dolphins-and-snorkelling": { places: ["sea"], pace: "easy" },
  "great-fort-tour": { places: ["heritage"], pace: "easy" },
  "muscat-moments": { places: ["heritage"], pace: "easy" },
  "jabal-akhdar-day-tour": { places: ["mountains"], pace: "easy" },
  "jebel-shams-grand-canyon": { places: ["mountains"], pace: "active" },
  "nakhal-and-rustaq": { places: ["heritage", "mountains"], pace: "easy" },
};

export function timeOf(tour: TourBase): Time {
  if (tour.nights) return "severalDays";
  if (tour.hours && tour.hours <= 5) return "halfDay";
  return "fullDay";
}

export function suggestTours(input: { place: Exclude<Place, "abroad">; time: Time; pace: Pace }): TourBase[] {
  const scored = tours
    .map((tour) => {
      const tags = tourTags[tour.slug];
      let score = 0;
      if (tags?.places.includes(input.place)) score += 2;
      if (timeOf(tour) === input.time) score += 2;
      if (tags?.pace === input.pace) score += 1;
      return { tour, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.tour.popularity - a.tour.popularity)
    .map((s) => s.tour);
  const picks = scored.slice(0, 3);
  return picks.length ? picks : featuredTours().slice(0, 3);
}

export function suggestWorld(mood: Mood): WorldPackage[] {
  const withPhoto = worldWithPhotos().filter((w) => w.moods.includes(mood));
  const rest = world.filter((w) => w.image === null && w.moods.includes(mood));
  return [...withPhoto, ...rest].slice(0, 3);
}
