// 自由なタグ（frontmatter の tags）の集計とURL。テーマ（theme）は別で、/themes/ に飛ぶ
// 記事の多い順、同じ数なら名前順に並べる
export function tagCounts(posts) {
  const counts = new Map();
  for (const p of posts) for (const t of new Set(p.data.tags ?? [])) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ja'));
}

// タグごとの一覧ページのURL。日本語のタグも壊れないよう符号化する
export const tagUrl = (tag) => `/tags/${encodeURIComponent(tag)}/`;
