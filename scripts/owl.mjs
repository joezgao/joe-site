// Draws Joe's mark: a barn owl spelled in its own name, as a character mosaic.
// Run: node scripts/owl.mjs > src/data/owl.txt   (DEBUG=1 prints geometry tiers instead of letters)
// Uppercase = lit (rim of the heart-shaped facial disc, ridge, beak); lowercase = half-light
// (face); · = head and shoulders, dissolving downward; space = dark (eyes, background). Seeded, so stable.
const COLS = 46, ROWS = 39; // 46 cols keeps letters >= 12px in a 343px mobile column
const CELL_W = 0.6, CELL_H = 1.05; // Geist Mono advance and line height, in em
const UNIT = COLS * CELL_W * 0.29; // one "disc radius" in em
const DEBUG = process.env.DEBUG === '1';

let seed = 11;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// Classic parametric heart, flipped to screen space (lobes on top, point at the bottom), blended 35%
// toward an ellipse so the top notch is shallow like a barn owl's facial disc, not a Valentine heart.
const BLEND = 0.35;
const disc = [];
for (let i = 0; i < 360; i++) {
  const t = (i / 360) * 2 * Math.PI;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  disc.push([(1 - BLEND) * (x / 16) + BLEND * Math.sin(t), (1 - BLEND) * (-(y + 2) / 15) + BLEND * -Math.cos(t)]);
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

const word = 'barnowl';
let k = 0;
const letter = (upper) => (upper ? word[k++ % 7].toUpperCase() : word[k++ % 7]);

const rows = [];
for (let r = 0; r < ROWS; r++) {
  let line = '';
  for (let c = 0; c < COLS; c++) {
    const x = ((c + 0.5) * CELL_W - (COLS * CELL_W) / 2) / UNIT;
    const y = ((r + 0.5) * CELL_H) / UNIT - 1.55;

    const eye = Math.min(ellipse(x, y, -0.38, -0.04, 0.24, 0.16), ellipse(x, y, 0.38, -0.04, 0.24, 0.16));
    const inDisc = inside(x, y);
    const rim = edge(x, y) < 0.085;
    const ridge = Math.abs(x) < 0.04 && y > -0.6 && y < 0.62;
    const head = ellipse(x, y, 0, 0.0, 1.32, 1.28);
    const body = ellipse(x, y, 0, 1.9, 1.45, 1.05);

    let tier = ' ';
    if (eye < 1) tier = ' ';
    else if (eye < 1.9) tier = '#'; // lit rim around each dark eye
    else if (rim || ridge) tier = '#';
    else if (inDisc) tier = rand() < 0.93 ? '.' : ' ';
    else if (head < 1) tier = rand() < 0.42 ? ':' : ' ';
    else if (body < 1 && y > 0.9) {
      // Shoulders: dense along the outline, sparse inside, fading out downward.
      const p = (body > 0.72 ? 0.85 : 0.12) * Math.max(0, 1 - (y - 0.9) / 1.4);
      tier = rand() < p ? ':' : ' ';
    }

    // Letters only in the face; head and shoulders are a dot field, so the disc's edge stays crisp.
    line += DEBUG ? tier : tier === '#' ? letter(true) : tier === '.' ? letter(false) : tier === ':' ? '·' : ' ';
  }
  rows.push(line.replace(/\s+$/, ''));
}
while (rows.length && !rows.at(-1).trim()) rows.pop();
while (rows.length && !rows[0].trim()) rows.shift();
process.stdout.write(rows.join('\n') + '\n');
