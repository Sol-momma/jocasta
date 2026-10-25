// アーカイブ（/archives/）用に、記事を年→月でまとめる。新しい順。下書きとサンプルは出さない
// 年月は日付（UTC）で決める。一覧の日付表示（toISOString）とそろえるため
export function groupByYearMonth(posts) {
  const list = posts
    .filter((p) => !p.data.draft && !p.data.sample)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const years = [];
  for (const p of list) {
    const y = p.data.date.getUTCFullYear();
    const m = p.data.date.getUTCMonth() + 1;
    let year = years.at(-1);
    if (!year || year.year !== y) years.push((year = { year: y, months: [] }));
    let month = year.months.at(-1);
    if (!month || month.month !== m) year.months.push((month = { month: m, posts: [] }));
    month.posts.push(p);
  }
  return years;
}
