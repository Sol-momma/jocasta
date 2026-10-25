// 囲み（> [!NOTE] など）の変換を確かめる：3種類・見出しの指定・ふつうの引用はそのまま・本文のコロンが崩れない
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { calloutPlugin } from '../src/lib/callout.mjs';

const render = async (md) => (await (await createSatteriMarkdownProcessor({ mdastPlugins: [calloutPlugin] })).render(md)).code;

test('NOTE・TIP・WARNING が既定の見出し付きの囲みになる', async () => {
  for (const [k, title] of [['NOTE', 'メモ'], ['TIP', 'ヒント'], ['WARNING', '注意']]) {
    const html = await render(`> [!${k}]\n> 本文 **太字**\n>\n> - 項目\n`);
    assert.match(html, new RegExp(`<aside class="callout callout-${k.toLowerCase()}" role="note">\\s*<p class="callout-title">${title}</p>\\s*<p>本文 <strong>太字</strong></p>\\s*<ul>`));
  }
});
test('1行目の残りが見出しになり、HTMLはエスケープされる', async () => {
  assert.match(await render('> [!warning] 締め切り & \\<期限>\n> あ\n'), /<p class="callout-title">締め切り &amp; &lt;期限&gt;<\/p>\s*<p>あ<\/p>/);
});
test('ふつうの引用と本文のコロンは今までどおり', async () => {
  const html = await render('> 引用です\n\n開始は 10:30、a:b のまま\n');
  assert.match(html, /<blockquote>\s*<p>引用です<\/p>\s*<\/blockquote>/);
  assert.match(html, /10:30、a:b/);
  assert.doesNotMatch(html, /callout/);
});
