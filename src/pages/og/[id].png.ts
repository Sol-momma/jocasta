// 記事ごとのOGP画像 /og/<記事名>.png。新しい記事を足すとビルド時に自動でできる
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOg, pngResponse } from '../../lib/og';
import { themeLabel } from '../../lib/themes';

export async function getStaticPaths() {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const d = props.post.data;
  return pngResponse(await renderOg({ title: d.title, sub: d.theme ? themeLabel(d.theme) : undefined }));
};
