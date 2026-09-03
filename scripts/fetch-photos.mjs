import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { photos } from "./photos.manifest.mjs";

const outDir = join(process.cwd(), "assets", "photos-src");
await mkdir(outDir, { recursive: true });

const only = process.argv.slice(2);
const list = only.length ? photos.filter((p) => only.includes(p.key)) : photos;

for (const photo of list) {
  const target = join(outDir, `${photo.key}.jpg`);
  try {
    const existing = await stat(target).catch(() => null);
    if (existing && existing.size > 50_000 && !process.env.FORCE) {
      console.log(`skip   ${photo.key} (${Math.round(existing.size / 1024)} KB)`);
      continue;
    }
    const res = await fetch(photo.url, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (al-hashar-demo asset fetch)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) throw new Error(`not an image: ${type}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(target, buf);
    console.log(`fetched ${photo.key} (${Math.round(buf.length / 1024)} KB, ${type})`);
  } catch (err) {
    console.log(`FAILED  ${photo.key}: ${err.message}`);
  }
}
