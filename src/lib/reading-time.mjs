// 読む時間（分）を記事の Markdown 本文から数える
// Astro 7 の標準 Markdown 処理（Sätteri）は remark プラグインを使えないため、本文の文字列から直接数える
// 日本語（かな・漢字など）は1分あたり約500文字、英語などは1分あたり約200語として足し合わせる
const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff66-\uff9f]/g;
const JA_PER_MIN = 500;
const WORDS_PER_MIN = 200;

// 本文の文字列から分を出す。短くても最低1分
export function readingMinutes(text) {
  const ja = (text.match(CJK) ?? []).length;
  const words = (text.replace(CJK, ' ').match(/[A-Za-z0-9][\w'’-]*/g) ?? []).length;
  return Math.max(1, Math.ceil(ja / JA_PER_MIN + words / WORDS_PER_MIN));
}

// Markdown の記号（見出しの#、箇条書きの-、リンクのURLなど）を除いてから数える
export function postMinutes(body = '') {
  const text = body
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_`~|\-\[\]]/g, ' ');
  return readingMinutes(text);
}
