import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fusspflege-lena-schneider.de',
  output: 'server',
  adapter: vercel({ imageService: true }),
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  vite: {
    ssr: {
      noExternal: ['telegraf'],
    },
  },
});
