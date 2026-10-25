// Mermaid の図の置き換えを確かめる：ためた SVG があれば図に、なければコードブロックのまま。ページに mermaid の JS を出さない
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { findMermaid, mermaidKey, figureHtml } from '../src/lib/mermaid.mjs';

test('本文から ```mermaid のブロックだけを拾う', () => {
  assert.deepEqual(findMermaid('```mermaid\ngraph LR\n  A-->B\n```\n\n```js\nx\n```\n'), ['graph LR\n  A-->B\n']);
});
test('キーは前後の空白に左右されず、中身が変われば変わる', () => {
  assert.equal(mermaidKey('graph LR\nA-->B\n'), mermaidKey('  graph LR\nA-->B'));
  assert.notEqual(mermaidKey('graph LR\nA-->B'), mermaidKey('graph LR\nA-->C'));
});
test('図は明るい用と暗い用の2枚を並べた figure になる', () => {
  assert.equal(figureHtml({ light: '<svg>L</svg>', dark: '<svg>D</svg>' }), '<figure class="mermaid"><div class="mermaid-light"><svg>L</svg></div><div class="mermaid-dark"><svg>D</svg></div></figure>');
});
test('ためた図がないブロックは、ふつうのコードブロックのまま', async () => {
  const { mermaidPlugin } = await import('../src/lib/mermaid.mjs');
  const r = await createSatteriMarkdownProcessor({ mdastPlugins: [mermaidPlugin] });
  const html = (await r.render('```mermaid\ngraph LR\n  まだない-->図\n```\n')).code;
  assert.match(html, /<pre/);
  assert.doesNotMatch(html, /<script|class="mermaid"/);
});
