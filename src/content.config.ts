import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    theme: z.string().optional(), // 記事のテーマ（例: "toeic"）。名前は src/lib/themes.ts
    part: z.string().optional(), // TOEIC の記事だけ。例: "Part 5"
    questionType: z.string().optional(), // TOEIC の記事だけ。問題の種類
    description: z.string().optional(), // あれば記事の上に1〜3行の要約として出す
    image: z.string().optional(), // あれば記事の上に大きく出すイラスト（public からのパス）
    tags: z.array(z.string()).default([]),
    sample: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});
export const collections = { posts };
