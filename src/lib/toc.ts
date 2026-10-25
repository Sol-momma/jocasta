// 記事の見出し(h2〜h4)を、目次用の入れ子の形にまとめる。
import type { MarkdownHeading } from 'astro';

export interface TocNode { depth: number; slug: string; text: string; children: TocNode[] }

export function buildToc(headings: MarkdownHeading[], min = 2, max = 4): TocNode[] {
  const root: TocNode[] = [];
  // 今たどっている親の列。自分より浅い見出しが親になる（h2のあと急にh4が来ても、h2の下に入れる）。
  const stack: TocNode[] = [];
  for (const h of headings) {
    if (h.depth < min || h.depth > max) continue;
    const node: TocNode = { depth: h.depth, slug: h.slug, text: h.text, children: [] };
    while (stack.length && stack[stack.length - 1].depth >= h.depth) stack.pop();
    (stack.length ? stack[stack.length - 1].children : root).push(node);
    stack.push(node);
  }
  return root;
}
