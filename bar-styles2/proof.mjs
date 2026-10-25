import { chromium, devices } from 'playwright';
const out = '/workspace/jocasta-artifacts/bar-styles2', P = '/posts/sample-part5-word-form/';
const S = ['', 'ruler', 'cat', 'spiral', 'arrow', 'pct', 'train', 'rocket', 'candle', 'pixel', 'neon'];
const b = await chromium.launch();
const half = p => p.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
// 前後比較（猫・％）
for (const [tag, port] of [['before', 4342], ['after', 4341]]) for (const st of ['cat', 'pct']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 600 } }); const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${port}${P}`); await p.evaluate(s => localStorage.setItem('rp', s), st); await p.reload(); await half(p); await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/${tag}-${st}.png` }); await ctx.close();
}
// PC・スマホ 全見た目
for (const [n, o] of [['pc', { viewport: { width: 1280, height: 800 } }], ['sp', devices['iPhone 13']]]) {
  const ctx = await b.newContext(o); const p = await ctx.newPage(); await p.goto(`http://127.0.0.1:4341${P}`);
  for (const st of S.slice(6)) { await p.evaluate(s => localStorage.setItem('rp', s), st); await p.reload(); await half(p); await p.waitForTimeout(300); await p.screenshot({ path: `${out}/${n}-${st}.png` }); }
  const sizes = await p.evaluate(() => [...document.querySelectorAll('#rp-pick,.rp-pick:has(#rp-cf)')].map(e => { const r = e.getBoundingClientRect(); return (e.id||'紙吹雪label') + ' ' + Math.round(r.width) + 'x' + Math.round(r.height); }));
  console.log(n, 'tap', sizes.join(', '));
  await ctx.close();
}
// 動きを減らす設定：新しい見た目のアニメが0か
{ const ctx = await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } }); const p = await ctx.newPage(); await p.goto(`http://127.0.0.1:4341${P}`);
  for (const st of S) { await p.evaluate(s => { localStorage.setItem('rp', s); localStorage.setItem('rpc', '1'); }, st); await p.reload();
    await p.evaluate(() => scrollTo(0, 1e6)); await p.waitForTimeout(200);
    const r = await p.evaluate(() => ({ anim: document.getAnimations().filter(a => !a.timeline || a.timeline.constructor.name === 'DocumentTimeline').filter(a => a.playState === 'running').length, cf: document.querySelectorAll('.rp-cf').length }));
    console.log('reduce', st || '(線)', JSON.stringify(r)); }
  await p.screenshot({ path: `${out}/reduced-confetti.png` }); await ctx.close(); }
// 初期値：何も選んでいない人は今と同じ線
{ const ctx = await b.newContext({ viewport: { width: 1280, height: 600 } }); const p = await ctx.newPage(); await p.goto(`http://127.0.0.1:4341${P}`);
  console.log('default', await p.evaluate(() => JSON.stringify({ rp: document.documentElement.dataset.rp, rpc: document.documentElement.dataset.rpc, cf: document.getElementById('rp-cf').checked, bar: getComputedStyle(document.querySelector('.reading-progress__bar')).height })));
  await ctx.close(); }
// 録画
{ const ctx = await b.newContext({ viewport: { width: 1000, height: 640 }, recordVideo: { dir: out + '/v', size: { width: 1000, height: 640 } } }); const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:4341${P}`);
  const sc = async () => { for (let i = 0; i <= 10; i++) { await p.evaluate(i => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * i / 10), i); await p.waitForTimeout(120); } };
  for (const st of S) { await p.evaluate(() => scrollTo(0, 1e6)); await p.selectOption('#rp-pick', st); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(250); await sc(); }
  await p.evaluate(() => scrollTo(0, 1e6)); await p.check('#rp-cf'); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.selectOption('#rp-pick', 'train').catch(()=>{}); await sc(); await p.waitForTimeout(2500);
  await p.reload(); await p.waitForTimeout(500); await p.evaluate(() => scrollTo(0, 1e6)); await p.waitForTimeout(400);
  await p.locator('.rp-pick').first().scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
  console.log('after reload', await p.evaluate(() => document.getElementById('rp-pick').value + ' cf=' + document.getElementById('rp-cf').checked));
  await ctx.close(); }
await b.close();
