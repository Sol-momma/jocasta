// アーカイブのまとめ方を確かめる：年→月の新しい順・下書きとサンプルは出ない
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupByYearMonth } from '../src/lib/archive.mjs';

const p = (id, date, extra = {}) => ({ id, data: { date: new Date(date), ...extra } });
test('年→月の順に新しい順でまとめ、下書きとサンプルは出さない', () => {
  const g = groupByYearMonth([p('a', '2025-12-01'), p('b', '2026-10-01'), p('c', '2026-10-20'), p('d', '2026-03-05'), p('s', '2026-10-25', { sample: true }), p('x', '2026-10-26', { draft: true })]);
  assert.deepEqual(g.map((y) => [y.year, y.months.map((m) => [m.month, m.posts.map((q) => q.id)])]), [
    [2026, [[10, ['c', 'b']], [3, ['d']]]],
    [2025, [[12, ['a']]]],
  ]);
});
test('記事がなければ空', () => assert.deepEqual(groupByYearMonth([]), []));
