// RSS フィード（/rss.xml）。下書き（draft: true）とサンプル（sample: true）は入れない
// 各記事に要約（frontmatter の description、なければ本文の先頭）とテーマ（categories）を入れる
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { themeLabel } from '../lib/themes';
import { excerpt } from '../lib/excerpt.mjs';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', (p) => !p.data.draft && !p.data.sample))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Jocasta',
    description: '学習ノート',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      link: `/posts/${p.id}/`,
      description: p.data.description ?? excerpt(p.body ?? ''),
      categories: p.data.theme ? [themeLabel(p.data.theme)] : undefined,
    })),
  });
}
