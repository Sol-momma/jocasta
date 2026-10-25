// 「メモ」「ヒント」「注意」の囲み。GitHub と同じ書き方（引用の1行目に [!NOTE] / [!TIP] / [!WARNING]）を <aside> にする。
// :::note の書き方（directive）は使わない。Sätteri で directive を有効にすると「10:30」などの本文のコロンまで記法として読まれ、既存の記事が崩れるため。
// 1行目の残り（例: > [!NOTE] 見出し）があれば、それを見出しにする。種類が分からない引用はふつうの引用のまま
export const CALLOUTS = { NOTE: 'メモ', TIP: 'ヒント', WARNING: '注意' };

// 引用の最初の段落の頭から [!種類] と見出しを読む。当てはまらなければ null
export function parseCalloutHead(node) {
  const p = node.children?.[0];
  const t = p?.type === 'paragraph' ? p.children[0] : undefined;
  const m = t?.type === 'text' ? t.value.match(/^\[!(NOTE|TIP|WARNING)\][ \t]*([^\n]*)\n?/i) : null;
  if (!m) return null;
  const kind = m[1].toUpperCase();
  return { kind, title: m[2].trim() || CALLOUTS[kind], rest: t.value.slice(m[0].length) };
}

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// 引用を囲みに置き換えた新しいノードを作る（元のノードは書き換えられないので作り直す）
export function calloutNode(node) {
  const head = parseCalloutHead(node);
  if (!head) return null;
  const [p, ...rest] = node.children;
  const inline = [...(head.rest ? [{ type: 'text', value: head.rest }] : []), ...p.children.slice(1)];
  const first = inline.length ? [{ type: 'paragraph', children: inline }] : [];
  return {
    type: 'blockquote',
    data: { hName: 'aside', hProperties: { className: ['callout', `callout-${head.kind.toLowerCase()}`], role: 'note' } },
    children: [{ type: 'html', value: `<p class="callout-title">${esc(head.title)}</p>` }, ...first, ...rest],
  };
}

export const calloutPlugin = {
  name: 'jocasta-callout',
  blockquote(node, ctx) {
    const next = calloutNode(node);
    if (next) ctx.replaceNode(node, next);
  },
};
