import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname, extname, basename } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve('HTML_TEMPLATE/image');
const OUT = resolve('HTML_TEMPLATE/image');

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const images = walk(ROOT).filter(f => /\.(png|jpe?g)$/i.test(f));

async function processFile(file) {
  const ext = extname(file).toLowerCase();
  const base = basename(file, ext);
  const dir = dirname(file);
  const webpPath = join(dir, base + '.webp');
  try {
    const buf = readFileSync(file);
    const img = sharp(buf).rotate();
    const webpBuf = await img.webp({ quality: 82 }).toBuffer();
    writeFileSync(webpPath, webpBuf);
    console.log('Optimised:', file, '→', webpPath);
  } catch (e) {
    console.error('Failed:', file, e.message);
  }
}

const tasks = images.map(processFile);
await Promise.all(tasks);
console.log('Done.');
