// 画像の拡大の決まりを確かめる：対象は本文の画像だけ（リンクカードは除く）、拡大の処理は画像があるときだけ読み込む
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const selector = readFileSync(new URL('../src/lib/image-zoom-selector.ts', import.meta.url), 'utf8');
const component = readFileSync(new URL('../src/components/ImageZoom.astro', import.meta.url), 'utf8');

test('対象は本文の画像で、リンクカードの画像は外す', () => {
  assert.match(selector, /'\.prose img:not\(\.link-card-img\)'/);
});
test('拡大の処理は、画像があるときだけ後から読み込む（静的な import をしない）', () => {
  assert.match(component, /if \(imgs\.length\) import\('\.\.\/lib\/image-zoom'\)/);
  assert.doesNotMatch(component, /import \{[^}]*setupImageZoom/);
});
test('動きを減らす設定のときはアニメーションを付けない', () => {
  assert.match(component, /@media \(prefers-reduced-motion: no-preference\) \{\s*dialog\.img-zoom\[open\] img \{ animation/);
});
