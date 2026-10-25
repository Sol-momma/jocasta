// 前後の記事の選び方を確かめる：日付順・端では片方だけ・下書きとサンプルは飛ばす
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adjacentPosts } from '../src/lib/adjacent.mjs';

const p = (id, date, extra = {}) => ({ id, data: { date: new Date(date), ...extra } });
const posts = [p('c', '2026-03-01'), p('a', '2026-01-01'), p('s', '2026-02-01', { sample: true }), p('d', '2026-02-15', { draft: true }), p('b', '2026-02-10')];

test('真ん中の記事は前（古い）と次（新しい）が出る。下書きとサンプルは飛ばす', () => {
  const { prev, next } = adjacentPosts(posts[4], posts);
  assert.equal(prev.id, 'a');
  assert.equal(next.id, 'c');
});
test('いちばん古い記事は次だけ、いちばん新しい記事は前だけ', () => {
  assert.deepEqual([adjacentPosts(posts[1], posts).prev, adjacentPosts(posts[1], posts).next.id], [undefined, 'b']);
  assert.deepEqual([adjacentPosts(posts[0], posts).prev.id, adjacentPosts(posts[0], posts).next], ['b', undefined]);
});
test('サンプルの記事には前後を出さない', () => {
  assert.deepEqual(adjacentPosts(posts[2], posts), { prev: undefined, next: undefined });
});
