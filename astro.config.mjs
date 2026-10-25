import { defineConfig } from 'astro/config';
import { codeMeta } from './src/lib/code-meta.mjs';
export default defineConfig({
  site: 'https://blog.sol-momma.com',
  output: 'static',
  markdown: {
    shikiConfig: {
      // 配色ごとにコードの色を変える。どれを使うかは Base.astro の data-theme で選ぶ（背景は各配色の --code-bg）
      themes: { light: 'github-light', dark: 'github-dark', kanagawa: 'kanagawa-wave', dracula: 'dracula' },
      defaultColor: false,
      transformers: [codeMeta()],
    },
  },
});
