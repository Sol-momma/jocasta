// コードブロックの指定（ファイル名・行ハイライト）の読み取りを確かめる（node --test）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { codeToHtml } from 'shiki';
import { parseLines, parseTitle, codeMeta } from '../src/lib/code-meta.mjs';

test('行の指定を読む', () => {
  assert.deepEqual([...parseLines('{2,4-5}')], [2, 4, 5]);
  assert.equal(parseLines('').size, 0);
});
test('ファイル名を読む', () => {
  assert.equal(parseTitle('title="src/a.ts" {1}'), 'src/a.ts');
  assert.equal(parseTitle('{1}'), '');
});
test('コピーボタン・ファイル名・行ハイライトが付く', async () => {
  const html = await codeToHtml('a\nb\nc', { lang: 'js', theme: 'github-light', meta: { __raw: 'title="x.js" {2}' }, transformers: [codeMeta()] });
  assert.match(html, /^<div class="code-block has-title"><div class="code-title">x\.js<\/div><button[^>]*class="code-copy"/);
  assert.equal((html.match(/class="line hl"/g) ?? []).length, 1);
});
