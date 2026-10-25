import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { linkCardPlugin } from './src/lib/link-card.mjs';
import { codeMeta } from './src/lib/code-meta.mjs';
import { calloutPlugin } from './src/lib/callout.mjs';
import { readdirSync, readFileSync } from 'node:fs';

// 下書きはページ自体を作らないのでサイトマップにも入らない。編集画面・書き方ガイド（noindex）・404 は除く
const excluded = ['/admin/', '/guide/', '/404/'];
// サンプル記事（frontmatter に sample: true）も検索エンジン向けの一覧から外す。記事ページ自体は noindex 付きで残す
const samplePaths = readdirSync('./src/content/posts')
  .filter((f) => f.endsWith('.md') && /^sample:\s*true\s*$/m.test(readFileSync(`./src/content/posts/${f}`, 'utf8').split(/^---\s*$/m)[1] ?? ''))
  .map((f) => `/posts/${f.replace(/\.md$/, '')}/`);
export default defineConfig({
  site: 'https://blog.sol-momma.com',
  output: 'static',
  integrations: [sitemap({ filter: (page) => { const path = new URL(page).pathname; return !excluded.some((p) => path.startsWith(p)) && !samplePaths.includes(path); } })],
  markdown: {
    // 「> [!NOTE]」などの引用を囲みにする（src/lib/callout.mjs）
    // URLだけの行をリンクカードにする（OGP は scripts/fetch-link-cards.mjs がビルド前に取り、data/link-cards.json にためる）
    processor: satteri({ mdastPlugins: [linkCardPlugin, calloutPlugin] }),
    shikiConfig: {
      // 配色ごとにコードの色を変える。どれを使うかは Base.astro の data-theme で選ぶ（背景は各配色の --code-bg）
      themes: { light: 'github-light', dark: 'github-dark', kanagawa: 'kanagawa-wave', dracula: 'dracula' },
      defaultColor: false,
      transformers: [codeMeta()],
    },
  },
});
