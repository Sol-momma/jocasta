// 記事の ```mermaid のブロックを、前もって作っておいた SVG の図に置き換える（ページでは JS を読まない）。
// 図は scripts/render-mermaid.mjs が手元のブラウザで描き、data/mermaid.json にためてコミットする。
// ビルド（Cloudflare 側の自動ビルドを含む）ではブラウザを使わず、ためた SVG を読むだけ。ためていない図はふつうのコードブロックのまま出す
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export const CACHE = 'data/mermaid.json';

// 図の中身から決まるキー。中身を1文字でも変えたら描き直しになる
export const mermaidKey = (src) => createHash('sha256').update(src.trim()).digest('hex').slice(0, 16);

// 記事の本文から ```mermaid のブロックの中身を拾う
export function findMermaid(md) {
  return [...md.matchAll(/^```mermaid[^\n]*\n([\s\S]*?)^```/gm)].map((m) => m[1]);
}

// 明るい配色用と暗い配色用の2枚を並べ、どちらを見せるかは CSS（Base.astro の .mermaid）で切り替える
export const figureHtml = ({ light, dark }) =>
  `<figure class="mermaid"><div class="mermaid-light">${light}</div><div class="mermaid-dark">${dark}</div></figure>`;

let cache;
const load = () => { if (!cache) { try { cache = JSON.parse(readFileSync(CACHE, 'utf8')); } catch { cache = {}; } } return cache; };

export const mermaidPlugin = {
  name: 'jocasta-mermaid',
  code(node, ctx) {
    if (node.lang !== 'mermaid') return;
    const svg = load()[mermaidKey(node.value)];
    if (svg) ctx.replaceNode(node, { type: 'html', value: figureHtml(svg) });
  },
};
