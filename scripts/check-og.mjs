// ビルド後の dist で、全ページに og:image などが入り、指す PNG が 1200x630 で存在するか確かめる
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const pages = [];
const walk = (dir) => readdirSync(dir).forEach((f) => {
  const p = join(dir, f);
  if (statSync(p).isDirectory()) walk(p); else if (f === 'index.html' && !p.startsWith('dist/admin')) pages.push(p); // /admin は編集画面なので対象外
});
walk('dist');
let bad = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const img = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  const errs = [];
  if (!img) errs.push('og:image がない');
  for (const k of ['og:title', 'og:description']) if (!html.includes(`property="${k}"`)) errs.push(`${k} がない`);
  if (!html.includes('name="twitter:card" content="summary_large_image"')) errs.push('twitter:card がない');
  if (img) {
    const file = join('dist', new URL(img).pathname);
    if (!existsSync(file)) errs.push(`画像がない: ${file}`);
    else {
      // PNG の頭（IHDR）から幅と高さを読む
      const b = readFileSync(file);
      const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
      if (w !== 1200 || h !== 630) errs.push(`画像の大きさが ${w}x${h}`);
    }
  }
  if (errs.length) { bad++; console.error(`NG ${page}: ${errs.join(', ')}`); }
}
console.log(`${pages.length} ページを確認、NG ${bad}`);
process.exit(bad ? 1 : 0);
