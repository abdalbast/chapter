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

function getHead(html) {
  const m = html.match(/<head[\s\S]*?<\/head>/i);
  return m ? m[0] : '';
}

function has(head, re) {
  return re.test(head);
}

const required = {
  title: /<title>[\s\S]*?<\/title>/i,
  description: /<meta[^>]+name=["']description["'][^>]*>/i,
  ogTitle: /<meta[^>]+property=["']og:title["'][^>]*>/i,
  ogDesc: /<meta[^>]+property=["']og:description["'][^>]*>/i,
  ogType: /<meta[^>]+property=["']og:type["'][^>]*>/i,
  ogUrl: /<meta[^>]+property=["']og:url["'][^>]*>/i,
  ogImage: /<meta[^>]+property=["']og:image["'][^>]*>/i,
  twitterCard: /<meta[^>]+name=["']twitter:card["'][^>]*>/i,
  twitterTitle: /<meta[^>]+name=["']twitter:title["'][^>]*>/i,
  twitterDesc: /<meta[^>]+name=["']twitter:description["'][^>]*>/i,
  twitterImage: /<meta[^>]+name=["']twitter:image["'][^>]*>/i,
  canonical: /<link[^>]+rel=["']canonical["'][^>]*>/i
};

const files = walk(ROOT).filter(f => f.endsWith('.html'));
const report = [];

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const head = getHead(html);
  const missing = Object.entries(required)
    .filter(([, re]) => !has(head, re))
    .map(([k]) => k);
  if (missing.length) report.push({ file: f, missing });
}

if (report.length === 0) {
  console.log('OK: All pages have standard SEO tags.');
  process.exit(0);
}

console.log('SEO check report:');
for (const r of report) {
  console.log(`- ${r.file}`);
  console.log(`  missing: ${r.missing.join(', ')}`);
}
process.exit(1);
