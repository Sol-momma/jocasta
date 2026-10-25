// Markdown の本文から、記号を外した先頭の文を取り出す（RSS の要約用）
export function excerpt(md, max = 120) {
  const text = md
    .replace(/```[\s\S]*?```/g, ' ') // コードブロック
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '') // 見出し・引用・箇条書きの記号
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 画像
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // リンクは文字だけ
    .replace(/<[^>]+>/g, '') // HTML タグ
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
