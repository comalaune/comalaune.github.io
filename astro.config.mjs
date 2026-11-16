import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://hugocarolin.github.io',
  base: process.env.SITE_BASE_PATH || '/ComApo.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
