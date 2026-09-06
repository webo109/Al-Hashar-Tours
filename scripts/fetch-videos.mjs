// Downloads source clips into assets/videos-src/{key}.mp4 unless a file with
// that name already exists (drop your own clips there to skip the download).
import { mkdir, stat, writeFile } from "node:fs/promises";
import { videos } from "./videos.manifest.mjs";

const dir = new URL("../assets/videos-src/", import.meta.url);
await mkdir(dir, { recursive: true });
const force = process.argv.includes("--force");
const only = process.argv.filter((a) => !a.startsWith("--")).slice(2);

for (const clip of videos) {
  if (only.length && !only.includes(clip.key)) continue;
  const target = new URL(`${clip.key}.mp4`, dir);
  try {
    const existing = await stat(target);
    if (existing.size > 0 && !force) {
      console.log(`skip  ${clip.key} (present, ${(existing.size / 1e6).toFixed(1)} MB)`);
      continue;
    }
  } catch {
    // not present
  }
  if (!clip.url) {
    console.log(`miss  ${clip.key} (no url and no file)`);
    continue;
  }
  process.stdout.write(`fetch ${clip.key} ... `);
  const res = await fetch(clip.url, { headers: { "user-agent": "al-hashar-demo/1.0" } });
  if (!res.ok) {
    console.log(`HTTP ${res.status}`);
    continue;
  }
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("video/") && !type.includes("octet-stream")) {
    console.log(`unexpected content-type ${type}`);
    continue;
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  await writeFile(target, bytes);
  console.log(`${(bytes.length / 1e6).toFixed(1)} MB`);
}
