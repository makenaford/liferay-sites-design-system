/*
 * The product map in Japanese.
 *
 * A **translation layer** over `PRODUCT_CLUSTERS`, for the same reason `site-nav.ja.ts` is one over
 * `SITE_NAV`: which sixteen products Liferay sells, which cluster each belongs to and which icon it
 * carries is not a fact about a locale. Keeping a second list here would mean two places to add a
 * product and two chances for the Japanese page to be a release behind.
 *
 * Anything with no entry falls through to English and is listed by `UNTRANSLATED_MAP_LABELS`, which the
 * Japan page's docs entry prints.
 *
 * ## What is not translated, and why
 *
 * The acronyms stay Latin — PIM, DSR, CMS, CMP, LDP, AI Hub, SEO Studio. These are Liferay's product
 * names rather than descriptions of them, they are what the Japanese site and its sales material call
 * them, and a hexagon at this size has room for about six full-width characters. The unabbreviated name
 * goes in `description`, which is the tile's `aria-label` — so a screen reader in Japanese reads
 * 「商品情報管理」 where the tile shows `PIM`, which is better than either alone.
 */

import type { CapabilityCluster } from '../components/CapabilityMap'
import { PRODUCT_CLUSTERS } from './product-map'

/** English → Japanese, for cluster names, tile labels and the descriptions behind them. */
const JA: Record<string, string> = {
  /* The four cluster names. `\n` is a deliberate break in the source and is kept where it helps. */
  'Commerce & Sales': 'コマース・セールス',
  'Content & Experience': 'コンテンツ・エクスペリエンス',
  'Intelligence &\nAI': 'インテリジェンス・\nAI',
  'Platform & Infrastructure': 'プラットフォーム・インフラ',

  /* Commerce & Sales */
  'Product Information Management': '商品情報管理',
  /*
   * `パーソナライズ` on the tile, `パーソナライゼーション` behind it.
   *
   * The full form is eleven full-width characters and does not fit a hexagon at any width this figure
   * is drawn at — the English has the same problem, which is what the soft hyphen in `product-map.tsx`
   * is for. Japanese cannot be hyphenated, so the tile takes the shorter form of the word instead and
   * the description carries the one the nav and the capabilities section use.
   */
  'Personali­zation': 'パーソナライズ',
  Personalization: 'パーソナライゼーション',
  'Digital Sales Rooms': 'デジタルセールスルーム',
  Commerce: 'コマース',

  /* Content & Experience */
  Sites: 'サイト',
  'Content Management System': 'コンテンツ管理システム',
  'Content Marketing Platform': 'コンテンツマーケティングプラットフォーム',

  /* Intelligence & AI */
  'Liferay Data Platform': 'Liferayデータプラットフォーム',
  Search: '検索',
  Analytics: 'アナリティクス',

  /* Platform & Infrastructure */
  'Cloud Native': 'クラウドネイティブ',
  Security: 'セキュリティ',
  'Low-Code': 'ローコード',
  /* `システム連携`, matching the nav sheet — not `インテグレーション`. */
  Integration: 'システム連携',
}

/**
 * Product names left in Latin on purpose, so they are not reported as gaps.
 *
 * Distinguishing "no translation exists yet" from "this is a name" is the whole point of the gap list:
 * without it every acronym would show up as an untranslated string forever and the list would stop
 * being worth reading.
 */
const KEPT_IN_LATIN = new Set(['PIM', 'DSR', 'CMS', 'CMP', 'LDP', 'AI Hub', 'SEO Studio', 'DXP'])

const missing = new Set<string>()

function t(text?: string) {
  if (!text) return text
  if (KEPT_IN_LATIN.has(text)) return text
  const translated = JA[text]
  if (!translated) missing.add(text)
  return translated ?? text
}

export const PRODUCT_CLUSTERS_JA: CapabilityCluster[] = PRODUCT_CLUSTERS.map((cluster) => ({
  ...cluster,
  label: t(cluster.label)!,
  items: cluster.items.map((item) => ({
    ...item,
    label: t(item.label)!,
    /*
     * A tile whose label was an acronym keeps its description as the expansion; a tile whose label was
     * the full name in English no longer needs one, but translating it costs nothing and it is what the
     * tile announces.
     */
    description: t(item.description),
  })),
}))

/** Anything still in English that is not a product name. Printed by the Japan page's docs entry. */
export const UNTRANSLATED_MAP_LABELS = [...missing]
