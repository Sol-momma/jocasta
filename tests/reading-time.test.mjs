// 読む時間の計算を確かめる（node --test）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readingMinutes, postMinutes } from '../src/lib/reading-time.mjs';

test('日本語は500文字で1分', () => {
  assert.equal(readingMinutes('あ'.repeat(500)), 1);
  assert.equal(readingMinutes('あ'.repeat(501)), 2);
  assert.equal(readingMinutes('漢'.repeat(2000)), 4);
});
test('英語は200語で1分', () => {
  assert.equal(readingMinutes('word '.repeat(400)), 2);
});
test('空でも1分', () => {
  assert.equal(readingMinutes(''), 1);
});
test('日本語と英語の混在は足し合わせる', () => {
  assert.equal(readingMinutes('あ'.repeat(750) + ' word'.repeat(100)), 2);
});
test('Markdownの記号とURLは数えない', () => {
  assert.equal(postMinutes('- [リンク](https://example.com/very/long/path)\n'.repeat(10)), 1);
});
