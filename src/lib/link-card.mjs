// URLだけの行をリンクカード（タイトル・説明・画像）にする remark プラグイン。
// OGP はビルド時に取りに行き、data/link-cards.json にためて次のビルドでは取りに行かない。
// 取れなかったときは何もしない（普通のリンクのまま）。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const CACHE = 'data/link-cards.json';
let cache;
const load = () => { if (!cache) { try { cache = JSON.parse(readFileSync(CACHE, 'utf8')); } catch { cache = {}; } } return cache; };
const save = () => { mkdirSync(dirname(CACHE), { recursive: true }); writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n'); };

const esc = (s = '') => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const decode = (s = '') => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));

// 段落が「URLだけ」ならそのURLを返す
export function soleUrl(node) {
  if (node.type !== 'paragraph' || node.children.length !== 1) return '';
  const c = node.children[0];
  if (c.type !== 'link' || !/^https?:\/\//.test(c.url)) return '';
  const t = c.children.length === 1 && c.children[0].type === 'text' ? c.children[0].value : '';
  return t === c.url ? c.url : '';
}

// HTML から OGP を読む
export function parseMeta(html, url) {
  const head = html.slice(0, 200000);
  const meta = (k) => {
    for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
      const tag = m[0];
      const key = tag.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (key === k) return decode(tag.match(/content\s*=\s*["']([^"']*)["']/i)?.[1] ?? '').trim();
    }
    return '';
  };
  const title = meta('og:title') || meta('twitter:title') || decode(head.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? '').trim();
  let image = meta('og:image') || meta('twitter:image');
  try { if (image) image = new URL(image, url).href; } catch { image = ''; }
  if (image && !image.startsWith('https://')) image = '';
  return { title, description: meta('og:description') || meta('description'), image };
}

async function fetchMeta(url) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; jocasta-link-card)', accept: 'text/html' }, redirect: 'follow', signal: AbortSignal.timeout(8000) });
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('html')) return null;
    const m = parseMeta(await res.text(), res.url || url);
    return m.title ? m : null;
  } catch { return null; }
}

export function cardHtml(url, { title, description, image }) {
  const host = new URL(url).hostname.replace(/^www\./, '');
  return `<a class="link-card" href="${esc(url)}" target="_blank" rel="noopener"><span class="link-card-body"><span class="link-card-title">${esc(title)}</span>`
    + (description ? `<span class="link-card-desc">${esc(description)}</span>` : '')
    + `<span class="link-card-host">${esc(host)}</span></span>`
    + (image ? `<img class="link-card-img" src="${esc(image)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">` : '')
    + `</a>`;
}

// 本文から「URLだけの行」のURLを拾う（ビルド前の取得用。行頭の「- 」はあってもよい）
export function findUrls(md) {
  return [...md.matchAll(/^[ \t]*(?:[-*+][ \t]+)?<?(https?:\/\/[^\s<>]+?)>?[ \t]*$/gm)].map((m) => m[1]);
}

// 足りない分を取りに行き、ためる（scripts/fetch-link-cards.mjs から呼ぶ）。失敗したURLはためず、次回また試す
export async function fillCache(urls) {
  const c = load();
  let added = 0;
  for (const url of new Set(urls)) {
    if (c[url]) continue;
    const m = await fetchMeta(url);
    if (m) { c[url] = m; added++; }
  }
  if (added) save();
  return added;
}

// Markdown の処理（Sätteri）で、URLだけの段落をカードに置き換える。ためた分だけ使い、ここでは取りに行かない
export const linkCardPlugin = {
  name: 'jocasta-link-card',
  paragraph(node, ctx) {
    const url = soleUrl(node);
    const m = url && load()[url];
    if (m) ctx.replaceNode(node, { type: 'html', value: cardHtml(url, m) });
  },
};
