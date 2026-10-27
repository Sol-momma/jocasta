// 読み進みバーの種類の一覧（ここだけで持つ）。id は html の data-rp の値（localStorage の rp）。
// 絵や動きは src/components/ReadingProgress.astro 側。svg は設定パネルの小さな見本（viewBox 0 0 40 24、細い線）。
export const bars: { id: string; name: string; svg: string }[] = [
  { id: '', name: '線', svg: '<path d="M4 12h22"/>' },
  { id: 'ruler', name: '目盛り', svg: '<path d="M4 9h32M6 9v4M10 9v2M14 9v4M18 9v2M22 9v4"/>' },
  { id: 'cat', name: '猫', svg: '<path d="M4 12h12" opacity=".4"/><path d="M17 13v-3l2-1.5h5l.8-1.5.7 1.5.7-1.5.8 1.5v2l-1.5.7h-5M18 13v1.5M24 12v2.5"/>' },
  { id: 'spiral', name: 'らせん', svg: '<path d="M4 12h14" opacity=".4"/><path d="M22 12a1 1 0 0 1 2 0 2 2 0 0 1-4 0 3 3 0 0 1 6 0"/>' },
  { id: 'arrow', name: '矢印', svg: '<path d="M4 12h16M18 9l4 3-4 3"/>' },
  { id: 'pct', name: '数字', svg: '<path d="M4 8h12" opacity=".4"/><text x="21" y="17" font-size="8" stroke="none" fill="currentColor">42%</text>' },
  { id: 'train', name: '電車', svg: '<path d="M4 17h32M4 19h32" opacity=".5"/><path d="M12 15V8h6v2h7l2 2v3zM14 10h2v2h-2z"/><circle cx="15" cy="16" r="1.3"/><circle cx="22" cy="16" r="1.3"/>' },
  { id: 'rocket', name: 'ロケット', svg: '<path d="M4 12h10" opacity=".4"/><path d="M14 11.5 11 12l3 .5M15 10h8l4 2-4 2h-8z"/>' },
  { id: 'candle', name: 'ろうそく', svg: '<path d="M18 9h4v8h-4zM20 9V7"/>' },
  { id: 'pixel', name: 'ドット絵', svg: '<path d="M4 14h12" opacity=".4"/><path d="M19 7h2v2h-2zM18 9h4v3h-4zM18 12v2M22 12v2"/>' },
  { id: 'neon', name: 'ネオン', svg: '<path d="M4 12h22" stroke-width="2.4"/><path d="M4 12h22" stroke-width="5" opacity=".2"/>' },
  { id: 'snake', name: 'ヘビ', svg: '<path d="M4 12q3-3 6 0t6 0 6 0"/><circle cx="25" cy="11.5" r="2"/>' },
  { id: 'fish', name: '釣り', svg: '<path d="M4 6h20v6" opacity=".6"/><path d="M24 12v2a1.5 1.5 0 0 1-3 0"/><path d="M20 18c1.5-1.6 4.5-1.6 6 0-1.5 1.6-4.5 1.6-6 0zM26 18l2-1.4v2.8z"/>' },
  { id: 'plant', name: '植木鉢', svg: '<path d="M14 15h10M15 15l1 5h6l1-5M19 15V7M19 11c-2 0-3-1-3.4-2.2 2 0 3 1 3.4 2.2M19 9c2 0 3-1 3.4-2.2-2 0-3 1-3.4 2.2"/><circle cx="19" cy="5.5" r="1.4"/>' },
  { id: 'hourglass', name: '砂時計', svg: '<path d="M15 4h10M15 20h10M16 4c0 5 4 6 4 8s-4 3-4 8M24 4c0 5-4 6-4 8s4 3 4 8M17.6 19.4h4.8L20 16z"/>' },
  { id: 'coffee', name: 'コーヒー', svg: '<path d="M14 9h10v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3zM24 10.5h1.5a1.8 1.8 0 0 1 0 3.6H24M15 13h8M17.5 7c-.8-1 .8-2 0-3M20.5 7c-.8-1 .8-2 0-3"/>' },
  { id: 'plane', name: '紙飛行機', svg: '<path d="M4 13h14" stroke-dasharray="2 2" opacity=".6"/><path d="M18 13 34 8l-6 9-2-3zM26 14l8-6"/>' },
  { id: 'xlb', name: '小籠包', svg: '<path d="M10 15h20M11 15v3h18v-3"/><path d="M13 15c0-3 2-4 4-5 2 1 4 2 4 5M21 15c0-3 2-4 4-5 2 1 4 2 4 5"/><path d="M17 7c-.6-.8.6-1.6 0-2.4M25 7c-.6-.8.6-1.6 0-2.4"/>' },
  { id: 'term', name: 'ターミナル', svg: '<path d="M4 9l3 3-3 3M10 15h10"/><path d="M22 9h3v6h-3z" fill="currentColor"/>' },
  { id: 'evo', name: '進化', svg: '<circle cx="9" cy="9" r="1.4"/><path d="M8.2 10.4c-1.8.3-3 1.4-3.6 3.2M8 11l1.2 6M5 13.5 4.6 18"/><circle cx="20" cy="6.5" r="1.4"/><path d="M20 8v5M20 9.5l-2 3M20 9.5l2 3M20 13l-1.6 5M20 13l1.6 5"/><path d="M29.5 5h3v2.6h-3zM29 8.4h4v4h-4zM30 12.4V18M32 12.4V18"/>' },
];
