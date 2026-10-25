// GitHub 上で記事を編集・新規作成するためのリンクを作る（ビルド時に実行）
// テンプレートはビルド時に文字列として読み込む
import template from '../../templates/post.md?raw';

const REPO = 'https://github.com/Sol-momma/jocasta';
const POSTS_DIR = 'src/content/posts';

// URL がこの長さを超えたら、本文を渡さずファイル名だけの形に戻す
const MAX_URL_LENGTH = 8000;

// 記事ファイルを GitHub の編集画面で開くURL
export const editUrl = (id: string) => `${REPO}/edit/main/${POSTS_DIR}/${id}.md`;

// templates/post.md を読み、frontmatter の先頭を draft: true にした中身を返す
export const templateBody = () => {
  const rest = template.replace(/^---\r?\n/, '').replace(/^draft:.*\r?\n/m, '');
  return `---\ndraft: true\n${rest}`;
};

// GitHub の新規ファイル画面を、テンプレートを入れた状態で開くURL
export const newPostUrl = (filename = 'new-post.md') => {
  const base = `${REPO}/new/main/${POSTS_DIR}?filename=${encodeURIComponent(filename)}`;
  const full = `${base}&value=${encodeURIComponent(templateBody())}`;
  return full.length <= MAX_URL_LENGTH ? full : base;
};
