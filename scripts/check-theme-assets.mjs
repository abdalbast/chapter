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
    const hasDark = /-dark\.(png|jpg|jpeg|webp|svg)/i.test(html);
    const hasLight = /-light\.(png|jpg|jpeg|webp|svg)/i.test(html);
    if (!hasDark || !hasLight) problems.push({ file: f, issue: 'missing dark/light asset variants (heuristic)' });
  }
}

if (problems.length === 0) {
  console.log('OK: Theme assets heuristic passed.');
  process.exit(0);
}
console.log('Theme assets check report:');
for (const p of problems) console.log(`- ${p.file}: ${p.issue}`);
process.exit(1);
