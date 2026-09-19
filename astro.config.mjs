// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import webmanifest from 'astro-webmanifest';
import { redirects } from './src/data/redirects';

export default defineConfig({
  site: 'https://burnt.io',
  redirects,
  integrations: [
    mdx(),
    sitemap(),
    webmanifest({
      name: 'burnt.io',
      icon: 'public/favicon.svg',
      theme_color: "#ffcc11",
      background_color: "#222222",
    }),
  ],
  prefetch: true,
});
