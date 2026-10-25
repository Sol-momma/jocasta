# 編集画面（/admin）の読み込みとヘッダー

- 編集画面のスクリプトは版を固定し、`integrity`（SRI）と `crossorigin` を付けて読み込む。
- `/admin/*` には `public/_headers` で厳しめの Content-Security-Policy を付ける。値は Sveltia CMS の案内（https://sveltiacms.app/en/docs/security）の GitHub 向けの組み合わせをもとにしている。
- インラインのスクリプトは使わない（`public/admin/init.js` に分ける）。

## Sveltia CMS の版を上げるとき
1. `public/admin/index.html` の URL の版を書き換える。
2. npm の同じ版から integrity を計算し、書き換える。
   ```sh
   npm pack @sveltia/cms@<版> && tar xzf sveltia-cms-<版>.tgz
   echo "sha384-$(openssl dgst -sha384 -binary package/dist/sveltia-cms.js | openssl base64 -A)"
   ```
3. `pnpm test` を通し、`/admin` を開いてログイン画面が出ること・ブラウザのコンソールに CSP のエラーが出ないことを確かめる。
