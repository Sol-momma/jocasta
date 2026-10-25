// 記事の ```mermaid の図を SVG にして data/mermaid.json にためる（手元で `pnpm run mermaid`）。
// ブラウザ（Playwright の Chromium）で mermaid を動かして描く。明るい配色用と暗い配色用の2枚を作る。
// Chromium の場所は PLAYWRIGHT_CHROMIUM（なければ Playwright の既定の場所）。使われなくなった図は消す
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';
import { CACHE, findMermaid, mermaidKey } from '../src/lib/mermaid.mjs';

const dir = 'src/content/posts';
const sources = [
  ...readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).flatMap((f) => findMermaid(readFileSync(`${dir}/${f}`, 'utf8'))),
  // 書き方ガイド（/guide/）の見本の図
  readFileSync('src/pages/guide/_mermaid-example.mmd', 'utf8'),
];
let old = {};
try { old = JSON.parse(readFileSync(CACHE, 'utf8')); } catch {}
const next = {};
const todo = [];
for (const src of sources) { const k = mermaidKey(src); if (old[k]) next[k] = old[k]; else todo.push([k, src]); }

if (todo.length) {
  const mermaidJs = readFileSync(createRequire(import.meta.url).resolve('mermaid/dist/mermaid.min.js'), 'utf8');
  const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
  const page = await browser.newPage();
  await page.setContent('<!doctype html><body></body>');
  await page.addScriptTag({ content: mermaidJs });
  for (const [k, src] of todo) {
    const out = {};
    for (const [mode, theme] of [['light', 'neutral'], ['dark', 'dark']]) {
      out[mode] = await page.evaluate(async ({ src, theme, id }) => {
        // 書体はブログの本文とそろえ、図の背景は透明にする（地の色は配色に任せる）。文字は SVG の text で描き、描いたときと書体の幅が違っても枠で切れないようにする
        window.mermaid.initialize({ startOnLoad: false, theme, securityLevel: 'strict', fontFamily: '"Hiragino Sans","Noto Sans JP",system-ui,sans-serif', themeVariables: { background: 'transparent' }, htmlLabels: false, flowchart: { htmlLabels: false, padding: 16 } });
        return (await window.mermaid.render(id, src)).svg;
      }, { src, theme, id: `m${k}${mode}` });
    }
    next[k] = out;
  }
  await browser.close();
}
writeFileSync(CACHE, JSON.stringify(next, null, 2) + '\n');
console.log(`mermaid: ${sources.length} diagrams, ${todo.length} rendered`);
