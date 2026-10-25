// RSS フィード（/rss.xml）。下書き（draft: true）とサンプル（sample: true）は入れない
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', (p) => !p.data.draft && !p.data.sample))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Jocasta',
    description: '学習ノート',
    site: context.site!,
    items: posts.map((p) => ({ title: p.data.title, pubDate: p.data.date, link: `/posts/${p.id}/` })),
  });
}
