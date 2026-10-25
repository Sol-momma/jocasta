import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 下書きはページ自体を作らないのでサイトマップにも入らない。編集画面・書き方ガイド（noindex）・404 は除く
const excluded = ['/admin/', '/guide/', '/404/'];
export default defineConfig({
  site: 'https://blog.sol-momma.com',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !excluded.some((p) => new URL(page).pathname.startsWith(p)) })],
});
