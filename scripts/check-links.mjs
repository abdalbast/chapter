import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, resolve, normalize } from 'node:path';

const ROOT = resolve('HTML_TEMPLATE');

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function isExternal(path) {
  return /^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(path);
}

function cleanRef(ref) {
  return ref.split('#')[0].split('?')[0];
}

function fileExists(baseFile, ref) {
  const cleaned = cleanRef(ref).trim();
  if (!cleaned) return true;
  let target;
  if (cleaned.startsWith('/')) {
    target = join(ROOT, cleaned.slice(1));
  } else {
    target = normalize(join(dirname(baseFile), cleaned));
  }
  try {
    return statSync(target).isFile();
  } catch {
    return false;
  }
}

function extractHtmlRefs(file) {
  const html = readFileSync(file, 'utf8');
  const refs = [];
  const attrRe = /(href|src)="([^"]+)"/g;
  let m;
  while ((m = attrRe.exec(html))) {
    const [, attr, val] = m;
    if (isExternal(val)) continue;
    refs.push({ attr, val, file });
  }
  return refs;
}

function extractCssRefs(file) {
  const css = readFileSync(file, 'utf8');
  const refs = [];
  const urlRe = /url\(([^)]+)\)/g;
  let m;
  while ((m = urlRe.exec(css))) {
    let val = m[1].trim().replace(/^['\"]/,'').replace(/['\"]$/,'');
    if (isExternal(val)) continue;
    refs.push({ attr: 'url', val, file });
  }
  return refs;
}

const allFiles = walk(ROOT);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
const cssFiles = allFiles.filter(f => f.endsWith('.css'));

const problems = [];

for (const f of htmlFiles) {
  for (const ref of extractHtmlRefs(f)) {
    if (!fileExists(f, ref.val)) problems.push(ref);
  }
}
for (const f of cssFiles) {
  for (const ref of extractCssRefs(f)) {
    if (!fileExists(f, ref.val)) problems.push(ref);
  }
}

if (problems.length === 0) {
  console.log('OK: No missing internal assets or links found.');
  process.exit(0);
}

console.log(`Found ${problems.length} missing references:`);
for (const p of problems) {
  console.log(`- ${p.attr}="${p.val}" in ${p.file}`);
}
process.exit(1);
