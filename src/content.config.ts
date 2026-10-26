import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const common = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  demo: z.boolean().default(false),
};

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...common,
    category: z.string().default('随手记'),
    updated: z.coerce.date().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...common,
    status: z.enum(['进行中', '已完成', '构想中']).default('进行中'),
    cover: z.string().default('/images/project-notes.svg'),
    stack: z.array(z.string()).default([]),
    repository: z.url().optional(),
    link: z.url().optional(),
    order: z.number().default(10),
  }),
});

export const collections = { notes, projects };
