// Ambient video clips. Files already present in assets/videos-src/{key}.mp4
// (for example clips supplied by Al-Hashar) are used as they are; only missing
// ones are fetched from `url`. Presets: hero = 1280x720, 10 to 12 s, 4 MB;
// card = 960x540, 6 to 8 s, 1.5 MB. `trim.start` is in seconds.
export const videos = [
  {
    key: "hero-oman-drone",
    url: "https://videos.pexels.com/video-files/19573139/19573139-hd_1920_1080_30fps.mp4",
    page: "https://www.pexels.com/video/musandam-19573139/",
    author: "Muzammil Muhammed",
    platform: "Pexels",
    preset: "hero",
    trim: { start: 0, duration: 12 },
    position: "50% 60%",
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
  hero: { width: 1280, height: 720, fps: 24, maxDuration: 12, budgetBytes: 4 * 1024 * 1024, crf: 28 },
  card: { width: 960, height: 540, fps: 24, maxDuration: 8, budgetBytes: 1.5 * 1024 * 1024, crf: 29 },
};
