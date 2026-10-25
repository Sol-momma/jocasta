import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { linkCardPlugin } from './src/lib/link-card.mjs';
import { codeMeta } from './src/lib/code-meta.mjs';

// 下書きはページ自体を作らないのでサイトマップにも入らない。編集画面・書き方ガイド（noindex）・404 は除く
const excluded = ['/admin/', '/guide/', '/404/'];
export default defineConfig({
  site: 'https://blog.sol-momma.com',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !excluded.some((p) => new URL(page).pathname.startsWith(p)) })],
  markdown: {
    // URLだけの行をリンクカードにする（OGP は scripts/fetch-link-cards.mjs がビルド前に取り、data/link-cards.json にためる）
    processor: satteri({ mdastPlugins: [linkCardPlugin] }),
    shikiConfig: {
      // 配色ごとにコードの色を変える。どれを使うかは Base.astro の data-theme で選ぶ（背景は各配色の --code-bg）
      themes: { light: 'github-light', dark: 'github-dark', kanagawa: 'kanagawa-wave', dracula: 'dracula' },
      defaultColor: false,
      transformers: [codeMeta()],
    },
  },
});
