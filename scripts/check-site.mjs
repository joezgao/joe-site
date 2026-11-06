// Fast structural check of the production build in dist/. Run after `astro build`.
// Fails on: a missing page, missing <title>/description/lang, an <img> without alt,
// an internal link to a page that does not exist, or placeholder text.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const pages = { '/': 'index.html', '/work': 'work/index.html', '/about': 'about/index.html', '/now': 'now/index.html' };
const errors = [];

for (const [route, file] of Object.entries(pages)) {
  const path = join(dist, file);
  if (!existsSync(path)) {
    errors.push(`${route}: missing ${file}`);
    continue;
  }
  const html = readFileSync(path, 'utf8');
  if (!/<html lang="en"/.test(html)) errors.push(`${route}: no lang`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${route}: no <title>`);
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) errors.push(`${route}: no description`);
  if (!/<h1[\s>]/.test(html)) errors.push(`${route}: no <h1>`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\salt="[^"]{10,}"/.test(img)) errors.push(`${route}: <img> without real alt: ${img.slice(0, 80)}`);
  }
  for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/[^"#]*)/g)) {
    const target = href.replace(/\/$/, '') || '/';
    if (!(target in pages)) errors.push(`${route}: link to unknown page ${href}`);
  }
  if (/lorem|TODO|placeholder/i.test(html.replace(/<style[\s\S]*?<\/style>/g, ''))) errors.push(`${route}: placeholder text`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`check-site: ${Object.keys(pages).length} pages ok`);
