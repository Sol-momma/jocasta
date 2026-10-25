// 編集画面（/admin）の読み込みの決まりを確かめる：外部スクリプトに integrity と crossorigin がある、インラインのスクリプトがない、/admin に CSP がある
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../public/admin/index.html', import.meta.url), 'utf8');
const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];

test('外部のスクリプトには integrity と crossorigin が付いている', () => {
  const external = scripts.filter(([, attrs]) => /src="https?:\/\//.test(attrs));
  assert.ok(external.length > 0);
  for (const [, attrs] of external) {
    assert.match(attrs, /integrity="sha(384|512)-[A-Za-z0-9+/=]+"/);
    assert.match(attrs, /crossorigin="anonymous"/);
    assert.match(attrs, /@\d+\.\d+\.\d+\//, '版を固定する');
  }
});

test('インラインのスクリプトがない（CSP で禁じているため）', () => {
  for (const [, , body] of scripts) assert.equal(body.trim(), '');
});

test('/admin に CSP が付き、インラインのスクリプトと eval を許していない', () => {
  const block = headers.split(/\n(?=\S)/).find((b) => b.startsWith('/admin/*'));
  assert.ok(block, '/admin/* の設定がある');
  const csp = block.match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
  const scriptSrc = csp.match(/script-src ([^;]+)/)?.[1] ?? '';
  assert.match(csp, /default-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.doesNotMatch(scriptSrc, /unsafe-inline|unsafe-eval/);
});
