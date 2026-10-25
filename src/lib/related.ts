import type { CollectionEntry } from 'astro:content';
type Post = CollectionEntry<'posts'>;
// 関連記事：タグ（テーマも1つのタグとして数える）の重なりが多い順、同点なら新しい順に上位を返す。ビルド時に計算する
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const keys = (p: Post) => new Set([p.data.theme && `theme:${p.data.theme}`, ...(p.data.tags ?? [])].filter(Boolean) as string[]);
  const mine = keys(post);
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, score: [...keys(p)].filter((k) => mine.has(k)).length }))
    .sort((a, b) => b.score - a.score || b.p.data.date.valueOf() - a.p.data.date.valueOf())
    .slice(0, limit)
    .map(({ p }) => p);
}
