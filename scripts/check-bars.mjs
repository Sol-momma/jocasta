// 読み進みバー全種類の見た目と動きを Playwright で確かめる（#58 の合格条件）。手元で `pnpm run check:bars`
// 先に `pnpm run build && pnpm preview` を立てておく。BASE（既定 http://localhost:4321）と PLAYWRIGHT_CHROMIUM で変えられる
// 確かめること：
//  1. 頭の絵が下端が帯（ヘッダー下〜--rpb）に収まり、本文に重ならない（右下・左下に固定の % とろうそくは除く）
//  2. どの配色でも、バーの色が地の色と違う
//  3. 止まっている間、ずっと動く絵（時間で進むアニメーション）が動いていない
//  4. 動きを減らす設定では、ずっと動く絵が0
//  5. 読み込んで0.4秒の時点で、定規の目盛りとヘビの体に幅がある
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:4321';
const PAGE = '/posts/start-1/';
const BARS = [...readFileSync('src/lib/bars.ts', 'utf8').matchAll(/id: '([a-z]*)'/g)].map((m) => m[1]);
const THEMES = ['', 'dark', 'cream', 'kanagawa', 'dracula', 'grid', 'chalk', 'letter'];
const FIXED = new Set(['pct', 'candle']);
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const fails = [];
const ng = (msg) => { fails.push(msg); console.log('NG', msg); };

async function open(rp, theme, width, reduced = false) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 720 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await ctx.addInitScript(([rp, theme]) => { localStorage.setItem('rp', rp); if (theme) localStorage.setItem('theme', theme); else localStorage.removeItem('theme'); }, [rp, theme]);
  const page = await ctx.newPage();
  await page.goto(BASE + PAGE);
  return { ctx, page };
}
// 時間で進む（スクロールで進まない）くり返しのアニメーションのうち、動いているものの数
const running = (page) => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.timeline instanceof DocumentTimeline && a.effect?.getTiming().iterations === Infinity).length);

for (const rp of BARS) {
  const name = rp || 'line';
  for (const width of [390, 1280]) {
    const { ctx, page } = await open(rp, '', width);
    await page.waitForTimeout(400);
    if (rp === 'ruler' && !(await page.evaluate(() => document.querySelector('.rp-ruler svg')?.getBoundingClientRect().width > 0))) ng(`${name} ${width}: 0.4秒で目盛りの幅が0`);
    if (rp === 'snake' && !(await page.evaluate(() => document.querySelector('.rp-snake')?.getBoundingClientRect().width >= 0 && document.querySelector('.rp-sn')?.getBoundingClientRect().width > 0))) ng(`${name} ${width}: 0.4秒でヘビが出ていない`);
    await page.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
    await page.waitForTimeout(1500);
    if (!FIXED.has(rp)) {
      const r = await page.evaluate(() => {
        const rp = document.querySelector('.reading-progress'); const top = rp.getBoundingClientRect().top; const rpb = parseFloat(getComputedStyle(rp).getPropertyValue('--rpb')) || 0; const band = { top, bottom: top + Math.max(rpb, rp.getBoundingClientRect().height) };
        const head = [...document.querySelectorAll('.rp-head svg, .rp-head')].filter((e) => getComputedStyle(e).display !== 'none').map((e) => e.getBoundingClientRect()).filter((b) => b.height > 0);
        return { band: [band.top, band.bottom], heads: head.map((b) => [b.top, b.bottom]) };
      });
      for (const [t, b] of r.heads) if (b > r.band[1] + 1) ng(`${name} ${width}: 頭 ${t.toFixed(1)}〜${b.toFixed(1)} が帯 ${r.band[0].toFixed(1)}〜${r.band[1].toFixed(1)} からはみ出す`);
    }
    const n = await running(page);
    if (n) ng(`${name} ${width}: 止まっているのに ${n} 個動いている`);
    await ctx.close();
  }
  for (const theme of THEMES) {
    const { ctx, page } = await open(rp, theme, 1280);
    await page.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
    await page.waitForTimeout(600);
    const same = await page.evaluate(() => {
      const bg = getComputedStyle(document.body).backgroundColor;
      const els = [...document.querySelectorAll('.reading-progress__bar, .rp-head, .rp-head svg, .rp-snake svg')].filter((e) => getComputedStyle(e).display !== 'none');
      const cols = els.flatMap((e) => { const s = getComputedStyle(e); return [s.color, s.backgroundColor, s.stroke, s.fill]; }).filter((c) => c && c !== 'none' && !/rgba\(0, 0, 0, 0\)|transparent/.test(c));
      return { bg, ok: cols.some((c) => c !== bg) };
    });
    if (!same.ok) ng(`${name} ${theme || 'white'}: バーの色が地の色と見分けられない`);
    await ctx.close();
  }
  const { ctx, page } = await open(rp, '', 1280, true);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(200);
  const n = await running(page);
  if (n) ng(`${name}: 動きを減らす設定で ${n} 個動いている`);
  await ctx.close();
  console.log('checked', name);
}
await browser.close();
console.log(fails.length ? `${fails.length} NG` : `all OK (${BARS.length} bars × 390/1280 × ${THEMES.length} themes)`);
process.exit(fails.length ? 1 : 0);
