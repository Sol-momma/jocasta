// 拡大の対象にする画像（記事の本文の画像。リンクカードの画像は除く）。ImageZoom.astro が先に読む小さな部分
export const ZOOM_SELECTOR = '.prose img:not(.link-card-img)';
