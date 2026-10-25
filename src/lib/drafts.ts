// プレビュー用ビルド（SHOW_DRAFTS=1）のときだけ draft: true の記事も含める。
export const showDrafts = process.env.SHOW_DRAFTS === '1';
export const isVisible = (p: { data: { draft: boolean } }) => showDrafts || !p.data.draft;
