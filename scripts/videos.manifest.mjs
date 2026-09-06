// Ambient video clips. Files already present in assets/videos-src/{key}.mp4
// (for example clips supplied by Al-Hashar) are used as they are; only missing
// ones are fetched from `url`. Presets: hero = 1920x1080, up to 12 s, best
// quality (crf 18) under a 12 MB ceiling; card = 960x540, 6 to 8 s, 1.5 MB.
// `trim.start` is in seconds.
export const videos = [
  {
    key: "hero-oman-drone",
    // Source supplied by the user (assets/videos-src/hero-oman-drone.mp4); Pexels video 4055997.
    url: null,
    page: "https://www.pexels.com/video/4055997/",
    author: "Pexels contributor, video 4055997",
    platform: "Pexels",
    preset: "hero",
    trim: { start: 0, duration: 12 },
    position: "50% 50%",
  },
  {
    key: "clip-muscat",
    url: "https://videos.pexels.com/video-files/31070834/13277942_2560_1440_30fps.mp4",
    page: "https://www.pexels.com/video/aerial-night-shot-of-illuminated-palace-architecture-31070834/",
    author: "Djimmer Koster",
    platform: "Pexels",
    preset: "card",
    trim: { start: 1, duration: 8 },
    position: "50% 50%",
  },
  {
    key: "clip-wadi-shab",
    url: "https://videos.pexels.com/video-files/36310939/15399874_1080_1920_60fps.mp4",
    page: "https://www.pexels.com/video/scenic-wadi-in-oman-with-turquoise-waters-36310939/",
    author: "Irene Lidia Wang",
    platform: "Pexels",
    preset: "card",
    trim: { start: 0, duration: 8 },
    position: "50% 55%",
  },
];

export const presets = {
  // High quality background loop: native 1080p, low CRF, generous budget.
  hero: { width: 1920, height: 1080, fps: 25, maxDuration: 12, budgetBytes: 12 * 1024 * 1024, crf: 18 },
  card: { width: 960, height: 540, fps: 24, maxDuration: 8, budgetBytes: 1.5 * 1024 * 1024, crf: 29 },
};
