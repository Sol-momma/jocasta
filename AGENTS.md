# AGENTS.md

いろいろなテーマの学習ブログ（Astro 静的出力 → Cloudflare Workers 静的アセット）。日本語中心。

## 記事の書き方
- ふだんは編集画面 `/admin`（Sveltia CMS、設定は `public/admin/config.yml`）で書く。保存すると `main` にコミットされる。
1. `templates/post.md` を `src/content/posts/<英小文字-ハイフン>.md` にコピーする（ファイル名がURL `/posts/<名前>/` になる）。
2. frontmatter: `title` `date` `theme`（例: `toeic`。名前は `src/lib/themes.ts`、なくても表示は壊れない） `part` `questionType`（TOEIC の記事だけ） `tags` `sample` `draft`。公開するときは `draft: false`（または削除）。
3. TOEIC の記事では、本文の見出しは「問題の種類 / 自分の答え / なぜ間違えたか / 見分け方」の4つ。
4. TOEIC の記事では **問題文は載せない**（著作権）。必ず自作の似た例文に置き換える。
5. 本文は入れ子の箇条書き（Logseq風、半角スペース2つでインデント）中心で書く。子のある項目はページ上で折りたためる。
6. 絵文字・紫・グラデーションは使わない。落ち着いた見た目を保つ。

## 確認とデプロイ
- パッケージ管理は pnpm（`packageManager` で版を固定、`pnpm-lock.yaml` をコミット）。npm/yarn/bun でインストールしない。
- `pnpm run build` が通ることを確認。
- PR はドラフトで作り、マージ後に `pnpm run deploy`（= `astro build && wrangler deploy`）。
- Cloudflare 認証はボックスの既存 wrangler ログインを使う。秘密の値は表示・コミットしない。
- カスタムドメイン `blog.sol-momma.com` は `wrangler.jsonc` の `routes`（`custom_domain: true`）で設定済み。既存 DNS レコードは手で触らない。
- 無料プランの範囲で使う。課金が必要な操作が出たら止めて相談する。
- force push・rebase・`gh pr merge --admin` は禁止。
