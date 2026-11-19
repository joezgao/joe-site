// Fast structural check of the production build in dist/. Run after `astro build`.
// Discovers every page (dist/**/index.html, plus dist/404.html) and fails on: a core page missing,
// a missing <title>/description/lang/<h1>, an <img> without real alt text, an internal link to a
// page that does not exist, or placeholder text.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const required = ['/', '/work', '/about', '/now', '/writing', '/404'];

const pages = {};
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name === 'index.html') pages['/' + relative(dist, dir)] = path;
    else if (name === '404.html' && relative(dist, dir) === '') pages['/404'] = path;
  }
})(dist);
const routes = Object.keys(pages).map((r) => (r === '/' ? '/' : r.replace(/\/$/, '')));
const byRoute = Object.fromEntries(Object.entries(pages).map(([r, p]) => [r === '/' ? '/' : r.replace(/\/$/, ''), p]));
const errors = [];

for (const r of required) if (!(r in byRoute)) errors.push(`${r}: missing page`);

for (const [route, path] of Object.entries(byRoute)) {
  const html = readFileSync(path, 'utf8');
  if (!/<html lang="en"/.test(html)) errors.push(`${route}: no lang`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${route}: no <title>`);
  if (!/<meta name="description" content="[^"]{15,}"/.test(html)) errors.push(`${route}: no description`);
  if (!/<h1[\s>]/.test(html)) errors.push(`${route}: no <h1>`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\salt="[^"]{10,}"/.test(img)) errors.push(`${route}: <img> without real alt: ${img.slice(0, 80)}`);
  }
  for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)/g)) {
    const target = href.replace(/\/$/, '') || '/';
    if (!routes.includes(target) && !existsSync(join(dist, href))) errors.push(`${route}: link to unknown page ${href}`);
  }
  // The host serves 404.html at whatever path was missed (/a/b/c), so a relative URL there breaks.
  if (route === '/404') {
    for (const [, url] of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
      if (!/^(\/|https?:|mailto:|#|data:)/.test(url)) errors.push(`/404: relative URL ${url} breaks on nested paths`);
    }
    if (!/<a\b[^>]*href="\/"/.test(html)) errors.push('/404: no link back to /');
  }
  if (/lorem|TODO|placeholder/i.test(html.replace(/<style[\s\S]*?<\/style>/g, ''))) errors.push(`${route}: placeholder text`);
  // Credit rule (vault 规则详解 § 作品署名): every page, and every piece on Work, says it.
  const credits = (html.match(/built with Claude for Joe Gao/g) ?? []).length;
  if (credits < 1) errors.push(`${route}: no "built with Claude for Joe Gao" credit`);
  if (route === '/work') {
    const pieces = (html.match(/<article\b/g) ?? []).length;
    if (credits < pieces + 1) errors.push(`/work: ${pieces} pieces but only ${credits} credit lines (want one per piece + footer)`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`check-site: ${routes.length} pages ok (${routes.sort().join(', ')})`);
