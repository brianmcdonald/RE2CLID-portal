// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// GitHub Pages (project site): the workflow sets SITE_URL and BASE_PATH, e.g.
//   SITE_URL=https://<user>.github.io  BASE_PATH=/<repo>
// Locally both default so `npm run dev` serves from "/".
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.github.io',
  base,
  trailingSlash: 'always',
  integrations: [svelte()],
  build: { format: 'directory' },
});
