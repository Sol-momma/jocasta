// 記事の前後（日付順）を選ぶ。下書きとサンプルは飛ばす。前＝ひとつ古い記事、次＝ひとつ新しい記事
export function adjacentPosts(post, posts) {
  const list = posts
    .filter((p) => !p.data.draft && !p.data.sample)
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime() || a.id.localeCompare(b.id));
  const i = list.findIndex((p) => p.id === post.id);
  // サンプルの記事自身には前後を出さない
  if (i < 0) return { prev: undefined, next: undefined };
  return { prev: list[i - 1], next: list[i + 1] };
}
