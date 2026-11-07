// The site's list of works. Home and Work render whatever is here, in this order.
// Home pairs them in two columns; with an odd count the first is featured full width.
// Case-study copy comes from each project's own material: SPEC.md + README.md for micrograd 3D
// (the micrograd-3d repo); the piece itself for Almost Ripe; README.md for the others
// (each in its own repo).
// Works with a `series` belong to the trilogy (how AI learns, thinks, creates); Home shows them first,
// side by side as a triptych. Works with `section: 'research'` follow under "Research · How AI sees scale",
// then the rest ("Stories").
// Keep it factual: no claims that the specs, commits, renders or the piece don't back up.
//
// To add a work:
//   1. copy its stills into src/assets/ (16:9 or wider reads best; 1920 px wide if available);
//   2. import them below and add one entry to `works` with id, title, tagline, year, form, tools,
//      status, live, cover (+ optional extra) and What / How / Next sections;
//   3. `npm test`: check-site fails on a missing alt text or a broken link.
// No placeholder entries: a work appears only when it has real images and facts.
import type { ImageMetadata } from 'astro';
import micrograd from '../assets/micrograd-3d.png';
import microgradNetwork from '../assets/micrograd-3d-network.png';
import almostRipeTower from '../assets/almost-ripe-tower.png';
import almostRipeCorridor from '../assets/almost-ripe-corridor.png';
import attentionHead from '../assets/attention-head.png';
import attentionAll from '../assets/attention-all.png';
import noiseKnot from '../assets/noise-knot.png';
import noiseGuess from '../assets/noise-guess.png';
import atwdLeaf from '../assets/atwd-leaf.png';
import atwdStoma from '../assets/atwd-stoma.png';
import almostRipePoster from '../assets/loops/almost-ripe-poster.png';
import attentionPoster from '../assets/loops/attention-poster.png';
import noisePoster from '../assets/loops/noise-undone-poster.png';
import atwdPoster from '../assets/loops/all-the-way-down-poster.png';
import twelvePoster from '../assets/loops/seen-from-twelve-sides-poster.png';
import readsPoster from '../assets/loops/how-a-model-reads-poster.png';
import twelveCameras from '../assets/twelve-cameras.png';
import twelveHeldout from '../assets/twelve-heldout.png';
import reads2000 from '../assets/reads-2000.png';
import reads12 from '../assets/reads-12.png';

export interface Work {
  id: string;
  title: string;
  tagline: string;
  year: string;
  form: string;
  tools: string;
  status: string;
  live: boolean; // something is happening right now (gets the one point of light)
  series?: { part: 1 | 2 | 3; verb: 'Learns' | 'Thinks' | 'Creates' }; // the trilogy
  section?: 'research';
  /** Research works: what the study looks at, e.g. "How AI sees scale". */
  question?: string;
  cover: { src: ImageMetadata; alt: string; caption: string };
  extra?: { src: ImageMetadata; alt: string; caption: string };
  /** A short silent loop shown instead of the cover still (cards and the Work cover). Video in public/loops/. */
  loop?: { src: string; poster: ImageMetadata; label: string };
  sections: { heading: string; body: string[] }[];
}

export const trilogy = { title: 'How AI learns, thinks, creates', numerals: ['I', 'II', 'III'] } as const;

export const research = { title: 'Research' } as const;
export const isResearch = (w: Work) => w.section === 'research';

export type SeriesWork = Work & { series: NonNullable<Work['series']> };
export const isSeries = (w: Work): w is SeriesWork => w.series !== undefined;
/** "I · Learns" for a trilogy work. */
export const seriesLabel = (w: SeriesWork) => `${trilogy.numerals[w.series.part - 1]} · ${w.series.verb}`;

export const works: Work[] = [
  {
    id: 'micrograd-3d',
    title: 'micrograd 3D',
    tagline: 'Watch a tiny neural network learn, one gradient at a time.',
    year: '2026',
    form: 'Interactive, in the browser',
    tools: 'TypeScript · React Three Fiber',
    status: 'v1.1 runs locally',
    live: false,
    series: { part: 1, verb: 'Learns' },
    cover: {
      src: microgradNetwork,
      alt: 'A small neural network in 3D: grey spheres joined by thin lines, a few lines glowing warm orange where the gradient is largest.',
      caption: 'Step 98 on two moons. The warm lines carry the largest gradients.',
    },
    extra: {
      src: micrograd,
      alt: 'micrograd 3D in backprop mode: one neuron bright in the 3D network with its incoming weights glowing, and a panel on the right working through the chain rule for hidden layer 2, neuron 2, step 4 of 20, above the two-moons plot with the traced point circled.',
      caption: 'v1.1, stepping through backprop: hidden layer 2, neuron 2, with the chain rule written out.',
    },
    sections: [
      {
        heading: 'What',
        body: [
          'An interactive page that shows a neural network learning in real time. The engine is Andrej Karpathy’s micrograd, rewritten from scratch in TypeScript: a scalar Value that records every operation, and a backward() that walks the graph in reverse to hand each weight its gradient. It is made for CS students meeting backprop for the first time.',
        ],
      },
      {
        heading: 'How',
        body: [
          'A 2 → 8 → 8 → 1 network learns the two-moons dataset with hinge loss and plain gradient descent. Every neuron is a sphere and every one of its 88 weights is a line. A line glows warm in proportion to the gradient backprop just sent through it, so you see where learning flows rather than what the weights are.',
          'Beside it, the decision boundary bends through the data and a loss curve falls on a log scale. Play, pause, step, or run it at up to 120 steps a second. Pause at any moment to step through one point’s backward pass, neuron by neuron, with the chain rule written out. Tests check the gradients against values worked out by hand and against finite differences.',
        ],
      },
      {
        heading: 'Next',
        body: [
          'A public demo.',
        ],
      },
    ],
  },
  {
    id: 'attention',
    title: 'Attention, in space',
    tagline: 'Watch a tiny GPT read, in 3D, while you type.',
    year: '2026',
    form: 'Interactive, in the browser',
    tools: 'NumPy · three.js · Web Workers',
    status: 'Finished, private for now',
    live: false,
    loop: { src: '/loops/attention.mp4', poster: attentionPoster, label: 'Golden arcs of attention rising between letters across four layers while the model reads and writes.' },
    series: { part: 2, verb: 'Thinks' },
    cover: {
      src: attentionHead,
      alt: 'Letters of a line of text along the bottom and four layers above them; in layer 2 a bright golden fan of arcs sweeps from one letter back across the earlier ones.',
      caption: 'Layer 2, head 3: a word-boundary head, looking back to the last space or line break.',
    },
    extra: {
      src: attentionAll,
      alt: 'All four layers at once: hundreds of thin golden arcs rising between the letters of “LEONTES: She is, let me, but”, with the model’s next-letter guesses along the top.',
      caption: 'All layers, heads averaged, while the model writes.',
    },
    sections: [
      {
        heading: 'What',
        body: [
          'A tiny character-level GPT, trained from scratch on Shakespeare (tiny-shakespeare, from Andrej Karpathy’s char-rnn), running entirely in the browser. The letters you type sit along the bottom and four layers stack above them. Each glowing arc is a letter looking back at an earlier one, brighter the harder it looks, and the top row is the model’s guess at what comes next. It follows micrograd 3D: that piece shows a tiny network learning, this one shows a transformer reading.',
        ],
      },
      {
        heading: 'How',
        body: [
          'Andrej Karpathy’s nanoGPT design, scaled down to 809,856 parameters: 4 layers, 4 heads, 64 characters of context. PyTorch could not be installed, so it is written in pure NumPy with a hand-written backward pass (no autograd), checked against finite differences, and trained in 32 minutes on 2 CPU cores to a validation loss of 1.53.',
          'The weights ship as int8 inside the page. The forward pass runs in a Web Worker so the 3D view never waits, and every arc is one ribbon in a single mesh, its width set on the GPU.',
        ],
      },
      {
        heading: 'Next',
        body: [
          'Its spelling is mostly right and it has the shape of a play, but the meaning is nonsense. 60 frames a second still needs checking on real hardware; so far it has only run under software WebGL.',
        ],
      },
    ],
  },
  {
    id: 'noise-undone',
    title: 'Noise, undone',
    tagline: 'Watch 4,000 points of noise become a knot.',
    year: '2026',
    form: 'Interactive, in the browser',
    tools: 'NumPy · three.js · Web Workers',
    status: 'Finished, private for now',
    live: false,
    loop: { src: '/loops/noise-undone.mp4', poster: noisePoster, label: 'Thousands of cyan points gathering out of noise into a trefoil knot, then dissolving back into noise.' },
    series: { part: 3, verb: 'Creates' },
    cover: {
      src: noiseKnot,
      alt: 'Thousands of pale cyan points traced into a trefoil knot on black, each trailing faint lines from where it came.',
      caption: 't = 0: the knot. Each point trails its last few steps.',
    },
    extra: {
      src: noiseGuess,
      alt: 'Faint gray points scattered in a cloud, and bright cyan dots tracing a trefoil knot through it, with thin lines joining some points to their dots.',
      caption: 'Guess at t = 20: the points are still a cloud (median 0.35 from the knot’s centre line), but the network’s guesses already trace the knot (0.083). Each line runs from a point to its guess, the denoising direction there.',
    },
    sections: [
      {
        heading: 'What',
        body: [
          'A tiny diffusion model, trained from scratch, running entirely in the browser. It starts with 4,000 points of pure Gaussian noise and moves them, step by step, into a trefoil knot, in 3D. Scrub from noise to knot, re-noise it and watch the model draw a new one, or turn on Guess to see, for every point, the network’s estimate of the clean point it came from. The network sees the knot long before the points do.',
        ],
      },
      {
        heading: 'How',
        body: [
          'A DDPM (Ho, Jain & Abbeel 2020) with 100 steps and the cosine schedule of Nichol & Dhariwal (2021), sampled with DDIM (Song, Meng & Ermon 2020). The network, a 42,627-parameter MLP, learns one thing: look at a noisy point and predict the noise that was added. It is written in NumPy with a hand-written backward pass, checked against finite differences, and trained in 23 minutes on 2 CPU cores.',
          'Under the cosine schedule the knot only becomes legible in the last 10–15 of the 100 steps. So the scrubber and playback move evenly in log noise level, not in t: t = 10 sits in the middle of the track, and the readout always shows the true step.',
          'The weights ship as float16 inside a page of about 160 kB, and the reverse process runs in Web Workers. Measured on those shipped weights, the median sample lands 0.027 from the knot’s centre line, and no part of the knot is left uncovered.',
        ],
      },
      {
        heading: 'Next',
        body: [
          'The data is one fixed shape with no conditioning: a small, faithful DDPM, not a demonstration of scale. The frame rate still needs measuring on real hardware.',
        ],
      },
    ],
  },
  {
    id: 'all-the-way-down',
    title: 'All the way down',
    tagline: 'One maple leaf, from the whole leaf down to a single stoma.',
    year: '2026',
    form: 'Interactive, in the browser',
    tools: 'WebGL · three.js · Web Workers',
    status: 'Finished',
    live: false,
    loop: { src: '/loops/all-the-way-down.mp4', poster: atwdPoster, label: 'A zoom through an autumn maple leaf, from the whole leaf down to a single stoma between its guard cells.' },
    section: 'research',
    question: 'How AI sees scale',
    cover: {
      src: atwdLeaf,
      alt: 'An autumn maple leaf, orange with pale veins, alone on a black background.',
      caption: 'Level 0: the whole leaf, a 24 cm field.',
    },
    extra: {
      src: atwdStoma,
      alt: 'Close up of a single stoma: a dark slit-shaped pore between two curved rows of pale guard cells on an orange surface.',
      caption: 'Four decades in: one stoma, a 24 µm field, with its guard cells and pore.',
    },
    sections: [
      {
        heading: 'What',
        body: [
          'A multi-scale 3D viewer that runs in the browser. One autumn maple leaf at five scales, each ten times finer than the last: the leaf, its veins, the areoles, the pavement cells and a single stoma, 4.5 orders of magnitude to scroll or pinch through. It implements the scale-aware opacity modulation of WonderZoom (Jin Cao, Hong-Xing Yu and Jiajun Wu, WonderZoom: Multi-Scale 3D World Generation, arXiv 2512.09164, 2025): every surfel remembers the scale it was made at and fades, in log scale, as you move away from it. A toggle turns modulation off, so you can see what the method prevents.',
        ],
      },
      {
        heading: 'How',
        body: [
          'WonderZoom’s released scenes could not be downloaded where this was built, so the scene is a procedural test scene, not a WonderZoom output: 288,556 surfels over five levels, each deeper level a local patch, as a zoom-in would generate. The WebGL renderer is written from scratch. Each surfel is a flattened Gaussian projected in the vertex shader; on every camera move the CPU computes each surfel’s opacity, culls the ones that have faded out, sorts the rest by depth and uploads only what is drawn. The cross-fade checks out numerically, 0.50 and 0.50 at the midpoint between two levels, and a spatial feather, an extension of the paper’s equation, keeps the weights summing to 1 at the edge of each patch.',
        ],
      },
      {
        heading: 'Measured',
        body: [
          'Timed with the piece’s own Measure routine in Chrome 157 on a Mac with an Apple M5 Pro GPU (WebGL through ANGLE on Metal), at an 1800 × 1226 drawing buffer, 120 frames per mode. With the whole leaf in view, modulation draws 50,363 of the 288,556 surfels and runs at about 500 fps; without it, about 54 fps, roughly 9× slower. At the areoles it is about 680 fps against 180. At the stoma, frustum culling already removes most coarse surfels and both run at about 610 fps; there the gain is visual, because without modulation the coarse surfels blur over the fine ones.',
        ],
      },
      {
        heading: 'Next',
        body: [
          'A converter for WonderZoom’s released scenes, so a real one opens from a link. The memory figures the page shows are an estimate from a stated model; WebGL cannot report GPU memory.',
        ],
      },
    ],
  },
  {
    id: 'seen-from-twelve-sides',
    title: 'Seen from twelve sides',
    tagline: 'Twelve photographs of a stone become 4,000 Gaussians.',
    year: '2026',
    form: 'Interactive, in the browser',
    tools: 'NumPy · three.js',
    status: 'Finished',
    live: false,
    loop: { src: '/loops/seen-from-twelve-sides.mp4', poster: twelvePoster, label: 'A grey blur of Gaussians tightening into a stone as training runs, then the cameras that photographed it appearing around it.' },
    section: 'research',
    question: 'How AI sees shape',
    cover: {
      src: twelveCameras,
      alt: 'A small grey stone with a pale quartz band in the middle of a ring of wireframe cameras, each holding the photograph it took.',
      caption: 'Step 3,000: the fitted stone and the twelve training cameras, each holding its photograph.',
    },
    extra: {
      src: twelveHeldout,
      alt: 'Three views of the stone side by side: a held-out photograph, the Gaussians rendered from the same pose, and a dark difference image where only the outline and the quartz band glow.',
      caption: 'A camera training never saw: its photograph, the Gaussians from the same pose, and the difference (×4).',
    },
    sections: [
      {
        heading: 'What',
        body: [
          'A 3D Gaussian Splatting fit written from scratch in plain NumPy, shown in the browser. Twelve rendered photographs of a procedural stone go in; a cloud of 4,000 Gaussians comes out. Scrub through training and watch the grey cloud become the stone, draw the training cameras with their photographs, and hold H to compare a camera that training never saw with the Gaussians rendered from the same pose.',
        ],
      },
      {
        heading: 'How',
        body: [
          'The representation and rendering follow 3D Gaussian Splatting (Kerbl, Kopanas, Leimkühler & Drettakis, SIGGRAPH 2023), with the EWA projection of Zwicker, Pfister, van Baar & Gross (2001). The rasterizer, its hand-written backward pass and the gradient check (worst relative error 1.9e-8) were written for this piece with Claude in NumPy, not copied from an implementation. Training runs 3,000 steps of Adam, one 96 px view per step, in about 26 minutes on two shared CPU cores; the page eases between 14 logged snapshots.',
        ],
      },
      {
        heading: 'Measured',
        body: [
          'At the end, whole-image PSNR is 33.60 dB on the twelve training views and 28.45 dB on the four held-out ones. Counting only the pixels the stone covers: 31.91 and 27.21 dB.',
        ],
      },
      {
        heading: 'Next',
        body: [
          'The gap between training and held-out views is overfitting to twelve photographs. These photographs are synthetic and perfectly posed; real captures need camera poses from structure-from-motion, view-dependent colour and far more Gaussians.',
        ],
      },
    ],
  },
  {
    id: 'how-a-model-reads',
    title: 'How a model reads',
    tagline: 'Watch text break into tokens, merge by merge.',
    year: '2026',
    form: 'Interactive, in the browser',
    tools: 'Python · JavaScript',
    status: 'Finished',
    live: false,
    loop: { src: '/loops/how-a-model-reads.mp4', poster: readsPoster, label: 'Text split into coloured token pills that slide together as merges are applied, with the list of merges beside it.' },
    section: 'research',
    question: 'How AI reads text',
    cover: {
      src: reads2000,
      alt: 'Three lines of text split into rounded coloured pills, one per token: whole words like “the”, “of” and “York”, and pieces like “disc” plus “ont” plus “ent”.',
      caption: 'After all 2,000 merges: 125 characters in 44 tokens.',
    },
    extra: {
      src: reads12,
      alt: 'The same three lines after only 12 merges: nearly every character is still its own pill, with a few pairs such as “the” joined.',
      caption: 'The same text after 12 merges: 111 tokens, still mostly single characters.',
    },
    sections: [
      {
        heading: 'What',
        body: [
          'A byte-pair encoding (BPE) tokenizer learned from scratch in plain Python on tiny-shakespeare, from Andrej Karpathy’s char-rnn. Type or paste text and it splits into coloured pills, one colour per token. A slider runs from 0 merges, single characters, to all 2,000; as you scrub, neighbouring pills slide together and take the new token’s colour.',
        ],
      },
      {
        heading: 'How',
        body: [
          'The merge loop of Sennrich, Haddow & Birch (2016), on Philip Gage’s pair-replacement idea (1994), with a GPT-2-style pre-split that keeps a word’s leading space and never merges across words. It starts from the 65 characters in the text, not from bytes. 2,000 merges over 1,115,394 characters take about 3 seconds. The page encodes with the same earliest-merge-first rule; a test runs 3,444 cases through the shipped page, and all 3,444 match the Python reference exactly.',
        ],
      },
      {
        heading: 'Measured',
        body: [
          'On the training text, characters per token rise from 1.02 after one merge to 2.21 after 500 and 2.90 after 2,000. Merge 1 joins a space and t; merge 12 makes “ the”; the longest token is NORTHUMBERLAND.',
        ],
      },
      {
        heading: 'Next',
        body: [
          'The vocabulary is shaped by the script format: speaker names in capitals take merges that modern text never uses, and modern words fall apart (smartphone becomes s m art p h one). Characters never seen in training stay single, where a byte-level tokenizer would merge their bytes.',
        ],
      },
    ],
  },
  {
    id: 'almost-ripe',
    title: 'Almost Ripe',
    tagline: 'A night inside the Caretaker.',
    year: '2026',
    form: 'Interactive story, about three minutes',
    tools: 'three.js · Web Audio API · Claude',
    status: 'Finished, private for now',
    live: false,
    loop: { src: '/loops/almost-ripe.mp4', poster: almostRipePoster, label: 'A lone apple tree on a hill of golden grass; the world breaks into triangles and opens onto a dark corridor of blinking lights.' },
    cover: {
      src: almostRipeTower,
      alt: 'A dark monolithic tower under a moonlit, cloudy sky, a thin beam of light sweeping from its top. Two choices float above a small figure: “look away” and “keep walking”.',
      caption: 'The tower, and the choice: look away, or keep walking.',
    },
    extra: {
      src: almostRipeCorridor,
      alt: 'A long dark corridor between walls of tiny blinking blue and amber lights, the tower glowing at its far end.',
      caption: 'The corridor.',
    },
    sections: [
      {
        heading: 'What',
        body: [
          'A story you walk through in the browser, with headphones, in about three minutes, inspired by Harlan Ellison’s short story I Have No Mouth, and I Must Scream (1967). Five people are left. Something keeps them: every night it rebuilds the world from what they remember, almost perfectly.',
        ],
      },
      {
        heading: 'How',
        body: [
          'Built with Claude, three.js and the Web Audio API. Every surface, light and sound in the piece is generated in code. You walk with the keyboard or by holding a finger down, and look by dragging. At one point the piece asks you to choose: look away, or keep walking.',
        ],
      },
      {
        heading: 'Next',
        body: ['Finished after two polish rounds on the tree, the grass and the shatter. Private for now.'],
      },
    ],
  },
];
