// 「編集」「新しい記事」リンクの行き先。jocasta の中の編集画面 /admin（Sveltia CMS）に飛ぶ
const ADMIN = '/admin/';
const COLLECTION = 'posts';

// 記事を編集画面で開くURL（id はファイル名から .md を除いたもの）
export const editUrl = (id: string) => `${ADMIN}#/collections/${COLLECTION}/entries/${encodeURIComponent(id)}`;

// 新しい記事を編集画面で作るURL（下書き draft: true が既定）
export const newPostUrl = () => `${ADMIN}#/collections/${COLLECTION}/new`;
