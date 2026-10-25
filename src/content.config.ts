import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    part: z.string().optional(), // 例: "Part 5"（TOEIC以外の記事では空でよい）
    questionType: z.string().optional(), // 種類
    tags: z.array(z.string()).default([]),
    sample: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});
export const collections = { posts };
