// ビルドの前に、記事の「URLだけの行」の OGP を取りに行き data/link-cards.json にためる
import { readdirSync, readFileSync } from 'node:fs';
import { findUrls, fillCache } from '../src/lib/link-card.mjs';

const dir = 'src/content/posts';
const urls = readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).flatMap((f) => findUrls(readFileSync(`${dir}/${f}`, 'utf8').replace(/^```[\s\S]*?^```/gm, '')));
const added = await fillCache(urls);
console.log(`link cards: ${urls.length} urls, ${added} fetched`);
