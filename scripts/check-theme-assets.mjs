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
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  if (html.includes('themeswitch') || html.includes('themeSwitch')) {
    const refs = [...html.matchAll(/src=\"([^\"]+)\"/g)].map(m => m[1]).filter(p => !/^https?:/.test(p));
    const path = (await import('node:path')).default;
    const fs = await import('node:fs');
    for (const r of refs) {
      const dark = r.replace(/(\.[a-z]+)$/i, '-dark$1');
      const light = r.replace(/(\.[a-z]+)$/i, '-light$1');
      const baseDir = path.dirname(f);
      const darkPath = path.resolve(baseDir, dark);
      const lightPath = path.resolve(baseDir, light);
      const darkExists = fs.existsSync(darkPath);
      const lightExists = fs.existsSync(lightPath);
      if (!darkExists && !lightExists) continue;
      if (!darkExists || !lightExists) problems.push({ file: f, issue: `missing variant for ${r} (needs both -dark and -light)` });
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
