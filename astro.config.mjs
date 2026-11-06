// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  build: {
    // The whole stylesheet is a few KB: inline it so no request blocks first paint.
    inlineStylesheets: 'always',
  },
});
