// Case-study copy is written from each project's SPEC.md (~/Developer/micrograd-3d, ~/Developer/eden-film).
// Keep it factual: no claims that the specs, commits or renders don't back up.
import type { ImageMetadata } from 'astro';
import micrograd from '../assets/micrograd-3d.png';
import microgradNetwork from '../assets/micrograd-3d-network.png';
import edenTree from '../assets/eden-tree.png';
import edenAerial from '../assets/eden-aerial.png';

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
    id: 'micrograd-3d',
    title: 'micrograd 3D',
    tagline: 'Watch a tiny neural network learn, one gradient at a time.',
    year: '2026',
    form: 'Interactive, in the browser',
    tools: 'TypeScript · React Three Fiber',
    status: 'v1 runs locally',
    live: false,
    cover: {
      src: microgradNetwork,
      alt: 'A small neural network in 3D: grey spheres joined by thin lines, a few lines glowing warm orange where the gradient is largest.',
      caption: 'Step 98 on two moons. The warm lines carry the largest gradients.',
    },
    extra: {
      src: micrograd,
      alt: 'The whole micrograd 3D page: the 3D network on the left; on the right, play, step and reset controls, a speed slider, step, loss and accuracy readouts, a loss curve and the two-moons data plot with its decision boundary.',
      caption: 'The whole page: controls, loss curve, and the decision boundary bending through the data (99% accuracy).',
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
          'Beside it, the decision boundary bends through the data and a loss curve falls on a log scale. Play, pause, step, or run it at up to 120 steps a second. Tests check the gradients against values worked out by hand and against finite differences.',
        ],
      },
      {
        heading: 'Next',
        body: [
          'A mode that replays the backward pass node by node, then a public demo.',
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
    status: 'Final 1080p render in progress',
    live: true,
    cover: {
      src: edenTree,
      alt: 'A lone apple tree with red apples on a hillside of tall golden grass, backlit by a low sun in a warm hazy sky.',
      caption: 'Shot 7: the apple tree at golden hour. Approved still, 1920 × 1080.',
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
          'Up close, the houses and the campus still read as CG; the last shot leans on haze, canopy and light. The final render is running now.',
        ],
      },
    ],
  },
];
