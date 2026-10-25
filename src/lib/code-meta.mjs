// コードブロックの付け足し（Shiki の transformer）。記事の ``` の後ろに書いた指定を読む
//   ```ts title="src/a.ts" {2,4-5}
//   - title="…"：上にファイル名を出す
//   - {2,4-5}：その行に色をつけて目立たせる
// どのブロックにも右上の「コピー」ボタンを付ける（押したときの動きは src/components/CodeCopy.astro）

// 「{2,4-5}」を行番号の集合にする
export function parseLines(meta = '') {
  const m = meta.match(/\{([\d,\s-]+)\}/);
  const set = new Set();
  if (!m) return set;
  for (const part of m[1].split(',')) {
    const [a, b] = part.trim().split('-').map(Number);
    if (!a) continue;
    for (let i = a; i <= (b || a); i++) set.add(i);
  }
  return set;
}

// 「title="…"」を取り出す（なければ空）
export const parseTitle = (meta = '') => meta.match(/title=["']([^"']+)["']/)?.[1] ?? '';

const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });

export function codeMeta() {
  return {
    name: 'jocasta-code-meta',
    line(node, line) {
      if (parseLines(this.options.meta?.__raw).has(line)) this.addClassToHast(node, 'hl');
    },
    root(root) {
      const pre = root.children[0];
      const title = parseTitle(this.options.meta?.__raw);
      const button = el('button', { type: 'button', className: ['code-copy'], 'aria-label': 'コードをコピー' }, [text('コピー')]);
      const children = [title ? el('div', { className: ['code-title'] }, [text(title)]) : null, button, pre].filter(Boolean);
      root.children = [el('div', { className: ['code-block', title ? 'has-title' : ''].filter(Boolean) }, children)];
    },
  };
}
