import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://s2advogados.com.br',
  compressHTML: true,
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        avif: { quality: 60 },
        webp: { quality: 75 },
        jpeg: { quality: 80 },
      },
    },
  },
});
