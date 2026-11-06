// Draws Joe's mark: a barn owl spelled in its own name, as a character mosaic.
// Run: node scripts/owl.mjs > src/data/owl.txt   (DEBUG=1 prints geometry tiers instead of letters)
//
// It reads as an owl because of figure and ground, not detail: a solid half-light silhouette
// (lowercase: head, body, wings) holding a bright heart-shaped face (uppercase) with two dark eyes.
// A dark gap ring outlines the face; a dim ridge splits it; the breast is speckled; feet grip a perch.
// Seeded, so the output is stable.
const COLS = 40; // <= 46 keeps letters >= 12px in a 343px mobile column (Lighthouse legible-font check)
const SPAN_X = 3.4; // owl + perch width, in face radii
const CELL_W = 0.6, CELL_H = 1.05; // Geist Mono advance and line height, in em
const UNIT = (COLS * CELL_W) / SPAN_X; // one face radius, in em
const TOP = -1.12, BOTTOM = 3.62; // vertical extent, in face radii
const ROWS = Math.round(((BOTTOM - TOP) * UNIT) / CELL_H);
const DEBUG = process.env.DEBUG === '1';

let seed = 20261105;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// Heart-shaped facial disc: the classic parametric heart (lobes up, point down), blended 35% toward
// an ellipse so the top notch is shallow like a barn owl's, not a Valentine heart.
const BLEND = 0.35, FACE = 0.86, FACE_Y = 0.02;
const disc = [];
for (let i = 0; i < 360; i++) {
  const t = (i / 360) * 2 * Math.PI;
  const hx = 16 * Math.sin(t) ** 3;
  const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  const x = (1 - BLEND) * (hx / 16) + BLEND * Math.sin(t);
  const y = (1 - BLEND) * (-(hy + 2) / 15) + BLEND * -Math.cos(t);
  disc.push([x * FACE, y * FACE + FACE_Y]);
}
const inside = (px, py) => {
  let hit = false;
  for (let i = 0, j = disc.length - 1; i < disc.length; j = i++) {
    const [xi, yi] = disc[i], [xj, yj] = disc[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};
const edge = (px, py) => Math.min(...disc.map(([x, y]) => Math.hypot(px - x, py - y)));
const ellipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;

// Body: an egg, wider low down, overlapping the head.
const bodyRx = (y) => 0.95 + 0.22 * Math.max(0, Math.min(1, (y - 1.0) / 1.8));
const inBody = (x, y) => y > 0.6 && y < 3.25 && ellipse(x, y, 0, 1.95, bodyRx(y), 1.3) < 1;

const word = 'barnowl';
let k = 0;
const letter = (upper) => (upper ? word[k++ % 7].toUpperCase() : word[k++ % 7]);

const rows = [];
for (let r = 0; r < ROWS; r++) {
  let line = '';
  for (let c = 0; c < COLS; c++) {
    const x = ((c + 0.5) * CELL_W) / UNIT - SPAN_X / 2;
    const y = TOP + ((r + 0.5) * CELL_H) / UNIT;

    const head = ellipse(x, y, 0, 0.02, 1.12, 1.02) < 1;
    const face = inside(x, y);
    const ring = edge(x, y) < 0.07;
    const eye = Math.min(ellipse(x, y, -0.36, -0.02, 0.21, 0.15), ellipse(x, y, 0.36, -0.02, 0.21, 0.15)) < 1;
    const ridge = Math.abs(x) < 0.06 && y > -0.5 && y < 0.55;
    const body = inBody(x, y);
    const wingLine = body && y > 1.1 && Math.abs(Math.abs(x) - 0.62 * bodyRx(y)) < 0.07;
    const feet = y > 3.12 && y < 3.4 && (Math.abs(x + 0.3) < 0.14 || Math.abs(x - 0.3) < 0.14);
    const perch = y > 3.4 && y < 3.55 && Math.abs(x) < 1.6;

    // tiers: '#' lit, '.' half-light, ' ' dark
    let tier = ' ';
    if (face && !ring) tier = eye ? ' ' : ridge ? '.' : '#';
    else if (ring && (head || face)) tier = ' ';
    else if (feet) tier = '#';
    else if (head || body) {
      if (wingLine) tier = ' ';
      else if (body && Math.abs(x) < 0.5 * bodyRx(y) && y > 1.05) tier = rand() < 0.12 ? '#' : '.'; // speckled breast
      else tier = '.';
    } else if (perch) tier = '.';

    line += DEBUG ? tier : tier === '#' ? letter(true) : tier === '.' ? letter(false) : ' ';
  }
  rows.push(line.replace(/\s+$/, ''));
}
while (rows.length && !rows.at(-1).trim()) rows.pop();
while (rows.length && !rows[0].trim()) rows.shift();
process.stdout.write(rows.join('\n') + '\n');
