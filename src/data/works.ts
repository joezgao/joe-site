// The site's list of works. Home and Work render whatever is here, in this order.
// Home pairs them in two columns; with an odd count the first is featured full width.
// Case-study copy comes from each project's own material: SPEC.md + README.md for micrograd 3D
// (~/Developer/micrograd-3d) and Eden (~/Developer/eden-film); the piece itself for Almost Ripe
// (vault 02 Projects/作品集/04 Almost Ripe/); README.md for Attention, in space (vault …/05 Attention, in space/).
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
import edenTree from '../assets/eden-tree.png';
import edenAerial from '../assets/eden-aerial.png';
import almostRipeTower from '../assets/almost-ripe-tower.png';
import almostRipeCorridor from '../assets/almost-ripe-corridor.png';
import attentionHead from '../assets/attention-head.png';
import attentionAll from '../assets/attention-all.png';

export interface Work {
  id: string;
  title: string;
  tagline: string;
  year: string;
  form: string;
  tools: string;
  status: string;
  live: boolean; // something is happening right now (gets the one point of light)
  cover: { src: ImageMetadata; alt: string; caption: string };
  extra?: { src: ImageMetadata; alt: string; caption: string };
  sections: { heading: string; body: string[] }[];
}

export const works: Work[] = [
  {
    id: 'almost-ripe',
    title: 'Almost Ripe',
    tagline: 'A night inside the Caretaker.',
    year: '2026',
    form: 'Interactive story, about three minutes',
    tools: 'three.js · Web Audio API · Claude',
    status: 'Finished, private for now',
    live: false,
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
          'An original story you walk through in the browser, with headphones, in about three minutes. Five people are left. Something keeps them: every night it rebuilds the world from what they remember, almost perfectly.',
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
  {
    id: 'attention',
    title: 'Attention, in space',
    tagline: 'Watch a tiny GPT read, in 3D, while you type.',
    year: '2026',
    form: 'Interactive, in the browser',
    tools: 'NumPy · three.js · Web Workers',
    status: 'Finished, private for now',
    live: false,
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
          'A tiny character-level GPT, trained from scratch on Shakespeare, running entirely in the browser. The letters you type sit along the bottom and four layers stack above them. Each glowing arc is a letter looking back at an earlier one, brighter the harder it looks, and the top row is the model’s guess at what comes next. It follows micrograd 3D: that piece shows a tiny network learning, this one shows a transformer reading.',
        ],
      },
      {
        heading: 'How',
        body: [
          'nanoGPT’s design, scaled down to 809,856 parameters: 4 layers, 4 heads, 64 characters of context. PyTorch could not be installed, so it is written in pure NumPy with a hand-derived backward pass, checked against finite differences, and trained in 32 minutes on 2 CPU cores to a validation loss of 1.53.',
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
    id: 'micrograd-3d',
    title: 'micrograd 3D',
    tagline: 'Watch a tiny neural network learn, one gradient at a time.',
    year: '2026',
    form: 'Interactive, in the browser',
    tools: 'TypeScript · React Three Fiber',
    status: 'v1.1 runs locally',
    live: false,
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
    id: 'eden',
    title: 'Eden for the Newborn',
    tagline: 'A memory of a world yet to come.',
    year: '2026',
    form: 'Short film, 16 seconds',
    tools: 'Blender · Python · EEVEE',
    status: 'Best-version preview, then the final 1080p render',
    live: true,
    cover: {
      src: edenTree,
      alt: 'A lone apple tree on the crest of a hill of golden grass, a low sun to its right in a pale, cloudy evening sky.',
      caption: 'Shot 7: the apple tree on the crest at golden hour. Preview still, 1920 × 1080.',
    },
    extra: {
      src: edenAerial,
      alt: 'An oblique aerial view at golden hour of a ring-shaped glass building in a wooded valley, haze thickening toward the horizon.',
      caption: 'Shot 8: the aerial over the valley, where the film ends.',
    },
    sections: [
      {
        heading: 'What',
        body: [
          'Three shots, sixteen seconds. A garage door rolls up onto golden grass. The camera pushes low through a sunset hillside, rises past a lone apple tree, and ends above a ring-shaped glass campus in golden-hour haze before fading to black.',
        ],
      },
      {
        heading: 'How',
        body: [
          'Every scene is built from Python scripts in Blender: the garage, the terrain, the grass, the sky, the valley and the campus. It renders headless with EEVEE at 1920 × 1080 and 24 frames a second, under one colour grade and a single low sun. It is an homage, so nothing comes from the original: no footage, no music, no logos. The only outside assets are Poly Haven’s CC0 models and textures, each credited.',
        ],
      },
      {
        heading: 'Next',
        body: [
          'Up close, the houses and the campus still read as CG; the last shot leans on haze, canopy and light. A best-version pass is in review; the final 1080p render follows.',
        ],
      },
    ],
  },
];
