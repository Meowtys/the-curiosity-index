import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        subtitle: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        timeline: z.string(),
        status: z.enum(['Live', 'Open Beta', 'In Development', 'Archived']),
        category: z.enum(['Software', 'Hardware', 'Experiment']),
        role: z.string(),
        tags: z.array(z.string()).min(1),
        featured: z.boolean().default(true),
        order: z.number().int(),
        liveUrl: z.url().optional(),
        repoUrl: z.url().optional(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        gallery: z
          .array(
            z.object({
              src: image(),
              alt: z.string().trim().min(1),
              caption: z.string().trim().min(1),
            }),
          )
          .optional(),
      })
      .refine((data) => !data.cover || Boolean(data.coverAlt?.trim()), {
        message: 'coverAlt is required whenever cover is provided',
        path: ['coverAlt'],
      }),
});

export const collections = { projects };
