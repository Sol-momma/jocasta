// リンクカード（URLだけの行）の判定とOGPの読み取りを確かめる（node --test）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { soleUrl, parseMeta, cardHtml } from '../src/lib/link-card.mjs';

const link = (url, text = url) => ({ type: 'paragraph', children: [{ type: 'link', url, children: [{ type: 'text', value: text }] }] });
test('URLだけの段落だけを拾う', () => {
  assert.equal(soleUrl(link('https://a.example/x')), 'https://a.example/x');
  assert.equal(soleUrl(link('https://a.example/x', '説明つき')), '');
  assert.equal(soleUrl({ type: 'paragraph', children: [{ type: 'text', value: '前 ' }, link('https://a.example').children[0]] }), '');
});
test('OGPを読む（相対画像・http画像・title だけ）', () => {
  const m = parseMeta('<title>T</title><meta property="og:title" content="A &amp; B"><meta name="description" content="D"><meta property="og:image" content="/i.png">', 'https://a.example/p');
  assert.deepEqual(m, { title: 'A & B', description: 'D', image: 'https://a.example/i.png' });
  assert.equal(parseMeta('<title>Only</title><meta property="og:image" content="http://x/i.png">', 'https://a.example').image, '');
  assert.equal(parseMeta('<title>Only</title>', 'https://a.example').title, 'Only');
});
test('カードのHTMLは中身をエスケープする', () => {
  const h = cardHtml('https://www.a.example/', { title: '<b>', description: '', image: '' });
  assert.match(h, /&lt;b&gt;/);
  assert.match(h, /a\.example<\/span>/);
});
test('本文からURLだけの行を拾う', async () => {
  const { findUrls } = await import('../src/lib/link-card.mjs');
  assert.deepEqual(findUrls('https://a.example/x\n- https://b.example\n文の中 https://c.example\n  - <https://d.example/>'), ['https://a.example/x', 'https://b.example', 'https://d.example/']);
});
