import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AUTOR_SLUGS } from './data/autores';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    pubDate: z.coerce.date().default(() => new Date()),
    updatedDate: z.coerce.date().optional(),
    revisadoEm: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional().default(''),
    ogImage: z.string().optional(),
    keyword: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cluster: z
      .enum(['multas', 'suspensao-cassacao', 'pontos', 'blitz', 'geral'])
      .default('geral'),
    author: z.enum(AUTOR_SLUGS).default('marcela'),
    cta: z
      .object({
        titulo: z.string().optional(),
        botao: z.string().optional(),
        mensagem: z.string().optional(),
      })
      .optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(true),
  }),
});

export const collections = { blog };
