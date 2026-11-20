// Design-system guard (Claude Hub/设计系统/设计系统.md §3, §5, §10 "Enforce, don't just document").
// Fails when a component uses a raw colour, an off-scale spacing value or an off-scale radius.
//   colours: only inside custom-property definitions (`--name: #hex;`), i.e. the token blocks in global.css.
//            <meta name="theme-color"> must be a literal, so it is allowed but must equal the --bg token.
//   spacing: px values in gap / padding / margin must be on the scale below; em, %, var() and clamp() are not checked.
//   radius:  0 (texture, data), 12 (panels), 999 (buttons), 50% (dots).
// Usage: node scripts/check-tokens.mjs  -> prints violations, exits 1 if any.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SPACE = new Set([0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]); // 128 = page-section rhythm (hero, case bottoms)
const RADIUS = new Set(['0', '0px', '12px', '999px', '50%']);
const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|lab|lch)\(/;
const SPACING_PROP = /^\s*((?:row-|column-)?gap|padding(?:-[a-z]+)*|margin(?:-[a-z]+)*)\s*:\s*([^;]+);?/;
const RADIUS_PROP = /^\s*(border(?:-[a-z]+)*-radius)\s*:\s*([^;]+);?/;
const TOKEN_DEF = /^\s*--[a-z0-9-]+\s*:/;

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(astro|css)$/.test(name)) files.push(p);
  }
})('src');

const bad = [];
const tokens = {};
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((raw, i) => {
    const line = raw.replace(/\/\*.*?\*\//g, '');
    const at = `${file}:${i + 1}`;
    if (TOKEN_DEF.test(line)) {
      const m = line.match(/^\s*(--bg)\s*:\s*(#[0-9a-fA-F]+)/);
      if (m && !(m[1] in tokens)) tokens[m[1]] = m[2].toLowerCase(); // first definition = dark default
      return;
    }
    if (/name="theme-color"/.test(line)) return; // checked against the tokens below
    if (COLOR.test(line)) bad.push(`${at}  raw colour; use a token (var(--…)): ${line.trim()}`);
    const s = line.match(SPACING_PROP);
    if (s) {
      for (const [, n] of s[2].matchAll(/(-?\d*\.?\d+)px/g)) {
        if (!SPACE.has(Math.abs(Number(n)))) bad.push(`${at}  ${s[1]} ${n}px is off the 4·8·12·16·24·32·48·64·96·128 scale`);
      }
    }
    const r = line.match(RADIUS_PROP);
    if (r) {
      for (const v of r[2].trim().split(/\s+/)) {
        if (!RADIUS.has(v) && !/^var\(/.test(v)) bad.push(`${at}  ${r[1]} ${v} is not 0 / 12px / 999px / 50%`);
      }
    }
  });
}

// theme-color must match the dark --bg token, so the browser chrome never disagrees with the page.
const base = readFileSync('src/layouts/Base.astro', 'utf8');
const dark = base.match(/name="theme-color" content="(#[0-9a-fA-F]+)" media="\(prefers-color-scheme: dark\)"/);
if (dark && tokens['--bg'] && dark[1].toLowerCase() !== tokens['--bg']) {
  bad.push(`src/layouts/Base.astro  dark theme-color ${dark[1]} differs from --bg ${tokens['--bg']}`);
}

for (const b of bad) console.log(b);
console.log(`check-tokens: ${files.length} files, ${bad.length} violation(s)`);
process.exit(bad.length ? 1 : 0);
