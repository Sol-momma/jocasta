# AGENTS.md

TOEIC 学習ブログ（Astro 静的出力 → Cloudflare Workers 静的アセット）。日本語中心。

## 記事の書き方
1. `templates/post.md` を `src/content/posts/<英小文字-ハイフン>.md` にコピーする（ファイル名がURL `/posts/<名前>/` になる）。
2. frontmatter: `title` `date` `part` `questionType` `tags` `sample` `draft`。公開するときは `draft: false`（または削除）。
3. 本文の見出しは必ず「問題の種類 / 自分の答え / なぜ間違えたか / 見分け方」の4つ。
4. **問題文は載せない**（著作権）。必ず自作の似た例文に置き換える。
5. 本文は入れ子の箇条書き（Logseq風、半角スペース2つでインデント）中心で書く。子のある項目はページ上で折りたためる。
6. 絵文字・紫・グラデーションは使わない。落ち着いた見た目を保つ。

## 確認とデプロイ
- `npm run build` が通ることを確認。
- PR はドラフトで作る。main にマージされると `.github/workflows/deploy.yml` が `astro build && wrangler deploy` する（draft: false の記事だけ公開）。手元からの `npm run deploy` も可。
- PR ごとに `.github/workflows/preview.yml` が `SHOW_DRAFTS=1` でビルドし、`wrangler versions upload --preview-alias pr-<番号>` のプレビュー URL を PR にコメントする（URL を知っていれば誰でも見られる）。
- 必要な Secrets: `CLOUDFLARE_API_TOKEN`（Workers Scripts: Edit）、`CLOUDFLARE_ACCOUNT_ID`。

## スマホから書く
1. github.com（スマホブラウザかGitHubアプリ）で `src/content/posts/` に新しいファイルを作り、`templates/post.md` の中身を貼って `draft: true` のまま書く。
2. 「Create a new branch」でコミットして PR を作る。
3. PR に付くプレビュー URL で下書きを確かめる。
4. `draft: false` に直してマージすると自動で公開。
- Cloudflare 認証はボックスの既存 wrangler ログインを使う。秘密の値は表示・コミットしない。
- カスタムドメイン `blog.sol-momma.com` は `wrangler.jsonc` の `routes`（`custom_domain: true`）で設定済み。既存 DNS レコードは手で触らない。
- 無料プランの範囲で使う。課金が必要な操作が出たら止めて相談する。
- force push・rebase・`gh pr merge --admin` は禁止。
