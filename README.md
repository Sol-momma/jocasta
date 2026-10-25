# Jocasta

TOEIC の間違いを記録する学習ブログ。名前は Star Wars のジェダイ記録係 Jocasta Nu から。

公開URL: https://blog.sol-momma.com

- Astro（静的出力）＋ Markdown 記事（`src/content/posts/*.md`）
- Cloudflare Workers（静的アセット）に wrangler でデプロイ

## 著作権について

**問題文（公式問題集・アプリ・模試などの文）は載せません。** 記事では、同じポイントを説明できる**自作の似た例文**だけを使います。

## 記事の型

`templates/post.md` をコピーして使います。見出しは次の4つ。

1. 問題の種類
2. 自分の答え
3. なぜ間違えたか
4. 見分け方

## 使い方

```sh
npm install
npm run dev      # http://localhost:4321
npm run build
npm run deploy   # build + wrangler deploy
```

詳しくは [AGENTS.md](./AGENTS.md)。
