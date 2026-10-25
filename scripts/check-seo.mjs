// ビルド後の dist で、サイトマップ・robots.txt・各ページの canonical / description / lang を確かめる
import { readFileSync, existsSync } from 'node:fs';

const errs = [];
if (!existsSync('dist/sitemap-index.xml')) errs.push('sitemap-index.xml がない');
const robots = existsSync('dist/robots.txt') ? readFileSync('dist/robots.txt', 'utf8') : '';
if (!robots.includes('Sitemap: https://blog.sol-momma.com/sitemap-index.xml')) errs.push('robots.txt に Sitemap がない');
const urls = [...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const u of urls) {
  const path = new URL(u).pathname;
  if (/^\/(admin|guide)\//.test(path)) errs.push(`サイトマップに入れないページ: ${path}`);
  const html = readFileSync(`dist${decodeURIComponent(path)}index.html`, 'utf8');
  if (html.includes('name="robots" content="noindex')) errs.push(`サイトマップに noindex のページ: ${path}`);
  if (!html.includes(`<link rel="canonical" href="${u}"`)) errs.push(`${path}: canonical がない・違う`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errs.push(`${path}: description がない`);
  if (!html.includes('<html lang="ja"')) errs.push(`${path}: lang="ja" がない`);
}
errs.forEach((e) => console.error('NG', e));
console.log(`サイトマップの ${urls.length} ページを確認、NG ${errs.length}`);
process.exit(errs.length ? 1 : 0);
