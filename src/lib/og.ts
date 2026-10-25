// OGP画像（1200x630 の PNG）をビルド時に作る。X や Slack に記事URLを貼ったときに出る画像
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';

// 同梱の日本語フォント（Noto Sans JP Bold、OFL。licenses/NotoSansJP-OFL.txt）
// ビルドはリポジトリの一番上で動くので、そこからの相対パスで読む
const fontPath = 'src/assets/fonts/NotoSansJP-Bold.otf';
let font: Buffer | undefined;

// サイトの白い配色に合わせる（紫・グラデーションは使わない）
const colors = { bg: '#fcfcfb', fg: '#151515', muted: '#6f6f6f', line: '#e6e6e6', link: '#2463c4' };

export async function renderOg({ title, sub }: { title: string; sub?: string }) {
  font ??= await readFile(fontPath);
  // 長いタイトルは文字を小さくして3行ほどに収める
  const size = title.length > 40 ? 52 : title.length > 22 ? 62 : 72;
  const svg = await satori(
    {
      // satori は padding を外側に足すので、幅と高さを数字で決めて上の帯・本文の箱を並べる
      type: 'div',
      props: {
        style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: colors.bg, fontFamily: 'Noto Sans JP' },
        children: [
          { type: 'div', props: { style: { width: 1200, height: 16, background: colors.link } } },
          { type: 'div', props: {
            style: { width: 1040, height: 494, margin: '56px 80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
            children: [
              { type: 'div', props: { style: { fontSize: 30, color: colors.muted }, children: sub ?? '学習ノート' } },
              { type: 'div', props: { style: { width: 1040, fontSize: size, lineHeight: 1.35, color: colors.fg, display: 'flex', flexWrap: 'wrap' }, children: title } },
              { type: 'div', props: { style: { width: 1040, display: 'flex', justifyContent: 'space-between', borderTop: `2px solid ${colors.line}`,
                paddingTop: 24, fontSize: 30, color: colors.fg },
                children: [{ type: 'div', props: { children: 'Jocasta' } },
                  { type: 'div', props: { style: { color: colors.muted }, children: 'blog.sol-momma.com' } }] } },
            ] } },
        ],
      },
    },
    { width: 1200, height: 630, fonts: [{ name: 'Noto Sans JP', data: font, weight: 700, style: 'normal' }] },
  );
  return new Resvg(svg).render().asPng();
}

export const pngResponse = (png: Uint8Array) =>
  new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
