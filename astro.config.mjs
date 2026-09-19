// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { redirects } from './src/data/redirects';

export default defineConfig({
  site: 'https://burnt.io',
  redirects,
  integrations: [
    mdx(),
    sitemap(),
  ],
  prefetch: true,
});
