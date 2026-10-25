import { test } from 'node:test';
import assert from 'node:assert/strict';
import { excerpt } from '../src/lib/excerpt.mjs';

test('記号を外して先頭を取る', () => {
  assert.equal(excerpt('## 見出し\n\n- **太字** と [リンク](https://example.com)\n  - 子'), '見出し 太字 と リンク 子');
});
test('コードブロックと画像は入れない', () => {
  assert.equal(excerpt('前\n```js\nconst a = 1;\n```\n![x](/a.png)後'), '前 後');
});
test('長いときは切って … を付ける', () => {
  assert.equal(excerpt('あ'.repeat(130), 120), `${'あ'.repeat(120)}…`);
});
