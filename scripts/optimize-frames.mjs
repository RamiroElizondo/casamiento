// scripts/optimize-frames.mjs
// Convierte los frames PNG de images/scroll/ (fuente pesada, no se sube a git) a WebP
// livianos en public/frames/, listos para el efecto scroll-scrub del hero.
// Uso: npm run optimize-frames

import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = path.resolve('images/scroll');
const OUT_DIR = path.resolve('public/frames');
const TARGET_WIDTH = 640;
const QUALITY = 72;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SRC_DIR))
    .filter((f) => /^ezgif-frame-\d+\.png$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!files.length) {
    console.error(`No se encontraron frames en ${SRC_DIR}`);
    process.exit(1);
  }

  console.log(`Procesando ${files.length} frames -> ${OUT_DIR} (ancho ${TARGET_WIDTH}px, calidad ${QUALITY})`);

  let done = 0;
  for (let i = 0; i < files.length; i++) {
    const outName = `frame-${String(i + 1).padStart(4, '0')}.webp`;
    await sharp(path.join(SRC_DIR, files[i]))
      .resize({ width: TARGET_WIDTH })
      .webp({ quality: QUALITY })
      .toFile(path.join(OUT_DIR, outName));
    done++;
    if (done % 50 === 0 || done === files.length) {
      console.log(`  ${done}/${files.length}`);
    }
  }

  console.log(`Listo. ${files.length} frames escritos en public/frames/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
