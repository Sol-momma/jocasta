// 記事中の画像をその場で拡大する（自前の小さな処理。ライブラリは使わない）。
// <dialog> を開いて画像を画面いっぱいに出し、クリック・Esc・閉じるボタンで戻る。読み込みは src/components/ImageZoom.astro から、画像があるときだけ

export function setupImageZoom(imgs: HTMLImageElement[]) {
  const dialog = document.createElement('dialog');
  dialog.className = 'img-zoom';
  dialog.setAttribute('aria-label', '画像の拡大');
  const big = document.createElement('img');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'img-zoom-close';
  close.textContent = '閉じる';
  dialog.append(big, close);
  document.body.append(dialog);
  let opener: HTMLElement | null = null;
  const open = (img: HTMLImageElement) => {
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    opener = img;
    dialog.showModal();
  };
  // どこを押しても閉じる（Esc はブラウザが閉じる）。閉じたら元の画像にフォーカスを戻す
  dialog.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  for (const img of imgs) {
    // リンクの中の画像は、リンク先へ飛ぶのを優先して拡大しない
    if (img.closest('a')) continue;
    img.classList.add('zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `${img.alt || '画像'}を拡大`);
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
  }
}
