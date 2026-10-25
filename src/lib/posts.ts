// 公開する記事を新しい順に取り出す
import { getCollection } from 'astro:content';

export const publishedPosts = async () =>
  (await getCollection('posts', (p) => !p.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

// 記事に使われているテーマ（重複なし、名前順）
export const usedThemes = (posts: Awaited<ReturnType<typeof publishedPosts>>) =>
  [...new Set(posts.flatMap((p) => (p.data.theme ? [p.data.theme] : [])))].sort();
