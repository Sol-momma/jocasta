// タグの集計とURLを確かめる：記事数・並び順・同じ記事内の重複・日本語タグのURL
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tagCounts, tagUrl } from '../src/lib/tags.mjs';

const p = (tags) => ({ data: { tags } });
test('タグごとの記事数を、多い順・同じ数なら名前順で返す。同じ記事の重複は1回と数える', () => {
  assert.deepEqual(tagCounts([p(['副詞', '品詞']), p(['品詞', '品詞']), p([])]), [{ tag: '品詞', count: 2 }, { tag: '副詞', count: 1 }]);
});
test('日本語やスペースのあるタグもURLが壊れない', () => {
  assert.equal(tagUrl('品詞'), '/tags/%E5%93%81%E8%A9%9E/');
  assert.equal(decodeURIComponent(tagUrl('a b/c')), '/tags/a b/c/');
  assert.equal(tagUrl('a b/c'), '/tags/a%20b%2Fc/');
});
