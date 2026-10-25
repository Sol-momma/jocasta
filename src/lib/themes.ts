// 記事のテーマ（frontmatter の theme）と、画面に出す名前の対応表
// 新しいテーマを足すときはここに1行足す。表にない値はそのまま名前として出す
export const THEMES: Record<string, string> = {
  toeic: 'TOEIC',
};

export const themeLabel = (theme: string) => THEMES[theme] ?? theme;

// テーマ一覧ページのURL
export const themeUrl = (theme: string) => `/themes/${encodeURIComponent(theme)}/`;
