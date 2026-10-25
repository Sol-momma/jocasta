// 下書き（draft: true）の記事が、ビルド結果 dist/ のどこにも出ていないか確かめる。
// 見るもの：記事ページのフォルダ、記事のURL（/posts/<名前>/）、タイトルの文字列。RSS（dist/rss.xml）も含む。
// 使い方：pnpm run build のあとに node scripts/check-drafts.mjs（pnpm run deploy でも自動で走る）
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const postsDir = 'src/content/posts';
const distDir = 'dist';
if (!existsSync(distDir)) { console.error('dist/ がない。先に pnpm run build する'); process.exit(1); }

const frontmatter = (text) => (text.match(/^---\r?\n([\s\S]*?)\r?\n---/) ?? [, ''])[1];
const field = (fm, name) => {
  const m = fm.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
};

const drafts = readdirSync(postsDir, { recursive: true })
  .filter((f) => extname(f) === '.md')
  .map((f) => ({ file: f, fm: frontmatter(readFileSync(join(postsDir, f), 'utf8')) }))
  .filter(({ fm }) => field(fm, 'draft') === 'true')
  .map(({ file, fm }) => ({ slug: file.replace(/\.md$/, ''), title: field(fm, 'title') }));

const files = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? files(p) : [p];
});
const textFiles = files(distDir).filter((p) => /\.(html|xml|json|txt|js|css|webmanifest)$/.test(p));

const problems = [];
for (const d of drafts) {
  if (existsSync(join(distDir, 'posts', d.slug))) problems.push(`${d.slug}: dist/posts/${d.slug}/ がある`);
  const needles = [`/posts/${d.slug}/`, d.title].filter((s) => s && s.length >= 4);
  for (const p of textFiles) {
    const body = readFileSync(p, 'utf8');
    for (const n of needles) if (body.includes(n)) problems.push(`${d.slug}: ${p} に「${n}」がある`);
  }
}

// RSS フィードがあり、下書きが入っていないこと（上のループで dist/rss.xml も見ている）
if (!existsSync(join(distDir, 'rss.xml'))) problems.push('dist/rss.xml がない');

console.log(`下書き ${drafts.length} 件、dist のファイル ${textFiles.length} 件を確認`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('OK：下書きはどこにも出ていない');
