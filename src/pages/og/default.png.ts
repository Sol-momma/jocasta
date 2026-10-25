// トップページなど記事以外で使う共通のOGP画像 /og/default.png
import type { APIRoute } from 'astro';
import { renderOg, pngResponse } from '../../lib/og';

export const GET: APIRoute = async () => pngResponse(await renderOg({ title: 'Jocasta — 学習ノート', sub: 'いろいろなテーマの学習ブログ' }));
