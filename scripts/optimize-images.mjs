/**
 * Turns full-resolution photos into web-ready assets.
 *
 * Camera originals are 10–20 MB. Nothing that size should reach the browser or
 * the git history, so drop originals in `source-images/` (gitignored) and run:
 *
 *     npm run images
 *
 * For each source it writes, into public/assets/images/:
 *   <name>.jpg        fallback, capped on the long edge
 *   <name>.webp       ~30% smaller, what browsers actually take
 *   <name>@2x.webp    for high-density screens
 *
 * Existing outputs are skipped unless the source is newer, so re-running is
 * cheap. Pass --force to rebuild everything.
 */
import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC = "source-images";
const OUT = "public/assets/images";

// The widest slot on the site is the section 03 plate at ~1200 CSS px, so the
// 2x variant needs ~2400 to be honest about it; 2000 is the pragmatic stop —
// it covers every other slot at true 2x and the plate at 1.7x.
const LONG_EDGE = 2000;
const LONG_EDGE_1X = 1000;

const force = process.argv.includes("--force");

if (!existsSync(SRC)) {
  console.error(`No ${SRC}/ directory. Create it and drop full-resolution photos in.`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|tiff?|webp|heic)$/i.test(f));

if (!files.length) {
  console.log(`No images in ${SRC}/.`);
  process.exit(0);
}

let built = 0;
let skipped = 0;

for (const file of files) {
  const name = path.parse(file).name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const src = path.join(SRC, file);
  const targets = [
    { out: path.join(OUT, `${name}.jpg`), width: LONG_EDGE_1X, fmt: "jpeg", opts: { quality: 82, mozjpeg: true } },
    { out: path.join(OUT, `${name}.webp`), width: LONG_EDGE_1X, fmt: "webp", opts: { quality: 80 } },
    { out: path.join(OUT, `${name}@2x.webp`), width: LONG_EDGE, fmt: "webp", opts: { quality: 72 } },
  ];

  const srcStat = await stat(src);
  const fresh = await Promise.all(
    targets.map(async (t) =>
      existsSync(t.out) ? (await stat(t.out)).mtimeMs > srcStat.mtimeMs : false
    )
  );
  if (!force && fresh.every(Boolean)) {
    skipped++;
    continue;
  }

  const meta = await sharp(src).metadata();
  console.log(`\n${file}  ${meta.width}x${meta.height}  ${(srcStat.size / 1e6).toFixed(1)} MB`);

  for (const t of targets) {
    // withoutEnlargement: never upscale a source that's already small.
    const buf = await sharp(src)
      .rotate() // honour EXIF orientation before resizing
      .resize({ width: t.width, withoutEnlargement: true })
      [t.fmt](t.opts)
      .toBuffer();
    await sharp(buf).toFile(t.out);
    console.log(`   -> ${path.basename(t.out).padEnd(28)} ${(buf.length / 1024).toFixed(0)} KB`);
    built++;
  }
}

console.log(`\n${built} file(s) written, ${skipped} source(s) already current.`);
