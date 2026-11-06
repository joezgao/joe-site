// Content collections. https://docs.astro.build/en/guides/content-collections/
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Essays copied verbatim from Joe's drafts; only the H1 and the italic
// "On …" line move into `title` / `dek`. `intro` (order 0) opens the Writing page.
// `draft: true` until Joe approves the two first-person opinions in the essays.
const writing = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    dek: z.string().optional(),
    order: z.number().int(),
    work: z.string().optional(), // id in src/data/works.ts
    draft: z.boolean(),
  }),
});

export const collections = { writing };
