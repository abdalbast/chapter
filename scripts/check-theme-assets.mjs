import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve('HTML_TEMPLATE');

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

const files = walk(ROOT).filter(f => f.endsWith('.html'));
const problems = [];
const path = (await import('node:path')).default;
const fs = await import('node:fs');
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  if (!(html.includes('themeswitch') || html.includes('themeSwitch'))) continue;

  // Check site-logo: should have a -dark variant available
  const siteLogoMatch = html.match(/<img[^>]*class=\"[^\"]*site-logo[^\"]*\"[^>]*src=\"([^\"]+)\"/i);
  if (siteLogoMatch) {
    const src = siteLogoMatch[1];
    if (!/^https?:/.test(src)) {
      const dark = src.replace(/(\.[a-z]+)$/i, '-dark$1');
      const baseDir = path.dirname(f);
      const darkPath = path.resolve(baseDir, dark);
      if (!fs.existsSync(darkPath)) {
        problems.push({ file: f, issue: `missing dark variant for ${src}` });
      }
    }
  }

  // Check partner logos: each png should have a -dark variant
  const partnerSrcs = [...html.matchAll(/<img[^>]*class=\"[^\"]*partner-logo[^\"]*\"[^>]*src=\"([^\"]+\.png)\"/ig)]
    .map(m => m[1])
    .filter(src => !/^https?:/.test(src));
  for (const src of partnerSrcs) {
    const dark = src.replace(/(\.[a-z]+)$/i, '-dark$1');
    const baseDir = path.dirname(f);
    const darkPath = path.resolve(baseDir, dark);
    if (!fs.existsSync(darkPath)) {
      problems.push({ file: f, issue: `missing dark variant for ${src}` });
    }
  }
}

if (problems.length === 0) {
  console.log('OK: Theme assets heuristic passed.');
  process.exit(0);
}
console.log('Theme assets check report:');
for (const p of problems) console.log(`- ${p.file}: ${p.issue}`);
process.exit(1);
