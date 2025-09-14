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

const rules = [
  { name: 'img-alt', re: /<img\b[^>]*\balt=\s*"[^"]*"/i, selector: /<img\b/i },
  { name: 'lang-attr', re: /<html\b[^>]*\blang=\s*"[^"]+"/i, selector: /<html\b/i },
  { name: 'viewport', re: /<meta[^>]+name=\s*"viewport"/i, selector: /<head[\s\S]*?<\/head>/i },
  { name: 'title', re: /<title>[\s\S]*?<\/title>/i, selector: /<head[\s\S]*?<\/head>/i },
  { name: 'label-for', re: /<label\b[^>]*\bfor=\s*"[^"]+"/i, selector: /<label\b/i }
];

const files = walk(ROOT).filter(f => f.endsWith('.html'));
const problems = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const r of rules) {
    if (r.selector.test(html) && !r.re.test(html)) problems.push({ file: f, rule: r.name });
  }
}

if (problems.length === 0) {
  console.log('OK: Basic accessibility checks passed.');
  process.exit(0);
}
console.log('Accessibility check report:');
for (const p of problems) console.log(`- ${p.file}: ${p.rule}`);
process.exit(1);
