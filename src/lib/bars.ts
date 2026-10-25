// 読み進みバーの種類の一覧（ここだけで持つ）。id は html の data-rp の値（localStorage の rp）。
// 絵や動きは src/components/ReadingProgress.astro 側。svg は設定パネルの小さな見本（viewBox 0 0 40 24、細い線）。
export const bars: { id: string; name: string; svg: string }[] = [
  { id: '', name: '線', svg: '<path d="M4 12h22"/>' },
  { id: 'ruler', name: '目盛り', svg: '<path d="M4 9h32M6 9v4M10 9v2M14 9v4M18 9v2M22 9v4"/>' },
  { id: 'cat', name: '猫', svg: '<path d="M4 12h12" opacity=".4"/><path d="M17 13v-3l2-1.5h5l.8-1.5.7 1.5.7-1.5.8 1.5v2l-1.5.7h-5M18 13v1.5M24 12v2.5"/>' },
  { id: 'spiral', name: 'らせん', svg: '<path d="M4 12h14" opacity=".4"/><path d="M22 12a1 1 0 0 1 2 0 2 2 0 0 1-4 0 3 3 0 0 1 6 0"/>' },
  { id: 'arrow', name: '矢印', svg: '<path d="M4 12h16M18 9l4 3-4 3"/>' },
  { id: 'pct', name: '数字', svg: '<path d="M4 8h12" opacity=".4"/><text x="21" y="17" font-size="8" stroke="none" fill="currentColor">42%</text>' },
  { id: 'train', name: '電車', svg: '<path d="M4 15h32M10 13v4M20 13v4M30 13v4"/><path d="M12 12V8h9V6.5h3V12z"/>' },
  { id: 'rocket', name: 'ロケット', svg: '<path d="M4 12h10" opacity=".4"/><path d="M14 11.5 11 12l3 .5M15 10h8l4 2-4 2h-8z"/>' },
  { id: 'candle', name: 'ろうそく', svg: '<path d="M18 9h4v8h-4zM20 9V7"/>' },
  { id: 'pixel', name: 'ドット絵', svg: '<path d="M4 14h12" opacity=".4"/><path d="M19 7h2v2h-2zM18 9h4v3h-4zM18 12v2M22 12v2"/>' },
  { id: 'neon', name: 'ネオン', svg: '<path d="M4 12h22" stroke-width="2.4"/><path d="M4 12h22" stroke-width="5" opacity=".2"/>' },
  { id: 'snake', name: 'ヘビ', svg: '<path d="M4 12q3-3 6 0t6 0 6 0"/><circle cx="25" cy="11.5" r="2"/>' },
];
