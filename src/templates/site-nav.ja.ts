/*
 * The Japanese nav — `JP_Homepage_Nav_Content.xlsx`, sheet `JP_Nav`.
 *
 * A **translation layer**, not a second nav. The structure — which menus exist, which columns they
 * hold, which tiles head them, what the icons are — stays in `site-nav.ts`, and this file maps each
 * English string to the sheet's Japanese one. Two navigations kept side by side would drift the first
 * time a menu changed; this one cannot, because it only ever renames what is already there.
 *
 * Anything the sheet does not translate falls through to English and is listed by
 * `UNTRANSLATED_NAV_LABELS`, which the Japan page's docs entry prints, so a gap shows up as a gap
 * rather than as silence.
 *
 * The sheet's `JP URL` column is not applied: every destination in the library's nav is a real
 * liferay.com URL and the Japanese ones are a mix of published pages, pages `JP_page_plan` has yet to
 * create, and provisional stand-ins. Swapping in half-real URLs would make the nav look wired when it
 * is not. See the Japan page's docs entry for the mapping as the sheet gives it.
 */

import { SITE_NAV, type NavLink, type NavMenu } from './site-nav'

/** English string → the sheet's Japanese. Menu labels, column headings, link titles and subtexts. */
const JA: Record<string, string> = {
  /* Menu labels */
  Platform: 'プラットフォーム',
  Solutions: 'ソリューション',
  Resources: 'リソース',
  Partners: 'パートナー',

  /* Platform — column headings */
  'Digital Experience': 'デジタルエクスペリエンス',
  'Content Management': 'コンテンツ管理',
  'Digital Commerce': 'デジタルコマース',
  Capabilities: '機能',

  /* Platform — Digital Experience */
  'Platform Overview': 'プラットフォーム概要',
  'Explore the complete digital experience platform.':
    'デジタルエクスペリエンスプラットフォームのすべてをご紹介します。',
  'Content Marketing Platform': 'コンテンツマーケティングプラットフォーム',
  'Plan and deliver marketing campaigns.': 'マーケティングキャンペーンの企画から配信までを一元化。',
  'Digital Asset Management': 'デジタルアセット管理（DAM）',
  'Organize and publish assets in one place.': 'デジタルアセットを一元管理し、すばやく公開。',
  Personalization: 'パーソナライゼーション',
  'Deliver personalized content to every visitor.':
    'すべての訪問者にパーソナライズされたコンテンツを配信。',
  Sites: 'サイト',
  'Build and manage on-brand websites fast.': 'ブランドに沿ったWebサイトを迅速に構築・運用。',
  'Analytics & Optimization': 'アナリティクス＆最適化',
  'Track engagement and optimize experiences.': 'エンゲージメントを可視化し、体験を最適化。',

  /* Platform — Content Management */
  'CMS Overview': 'CMS概要',
  'Create and publish content with ease.': 'コンテンツの作成から公開までをシンプルに。',
  Enterprise: 'エンタープライズ',
  'Govern content across global teams.': 'グローバルチーム全体のコンテンツを統制。',
  Headless: 'ヘッドレス',
  'Deliver content anywhere via API.': 'APIであらゆるチャネルにコンテンツを配信。',
  'AI Search & SEO': 'AI検索・SEO',
  'Optimize content for AI and search.': 'AI検索と検索エンジンの両方に最適化。',
  Intranet: 'イントラネット',
  'Keep employees informed and connected.': '従業員に必要な情報とつながりを届ける。',
  'Open-Source': 'オープンソース',
  'API-first, open source, built to scale.': 'APIファースト、オープンソース、拡張性も万全。',

  /* Platform — Digital Commerce */
  'Commerce Overview': 'コマース概要',
  'End-to-end commerce, built into your DXP.': 'DXPに統合されたエンドツーエンドのコマース。',
  'B2B Commerce Platform': 'BtoBコマースプラットフォーム',
  'Simplify complex B2B buying journeys.': '複雑なBtoBの購買プロセスをシンプルに。',
  'Digital Storefronts': 'デジタルストアフロント',
  'Launch storefronts that convert.': '成果につながるストアフロントをすばやく公開。',
  'Composable Commerce Platform': 'コンポーザブルコマースプラットフォーム',
  'Mix and match your commerce stack.': '必要な機能を自由に組み合わせるコマース基盤。',
  'Headless Commerce': 'ヘッドレスコマース',
  'Power commerce through flexible APIs.': '柔軟なAPIでコマースを支える。',
  'Product Information Management': '商品情報管理（PIM）',
  'Centralize product data for every channel.': '全チャネルの商品情報を一元管理。',

  /* Platform — Capabilities */
  'AI Agent Builder': 'AIエージェントビルダー',
  'Build and deploy smart AI agents fast.': 'AIエージェントをすばやく構築・展開。',
  'Internal Search': 'エンタープライズサーチ',
  'Help users find answers instantly.': '必要な情報を瞬時に見つけられる。',
  Integration: 'システム連携',
  'Connect Liferay to your existing systems.': '既存システムとLiferayをシームレスに連携。',
  'Low-Code': 'ローコード',
  'Build apps and workflows without code.': 'コード不要でアプリと業務フローを構築。',
  Security: 'セキュリティ',
  'Enterprise-grade security, built in.': 'エンタープライズグレードのセキュリティを標準装備。',
  'Content Delivery Network': 'コンテンツデリバリーネットワーク（CDN）',
  'Deliver content fast, worldwide.': '世界中に高速でコンテンツを配信。',

  /* Platform — the strip across the bottom */
  'Ready to Evaluate?': '導入をご検討ですか？',
  'See Subscription & Deployment Options': 'サブスクリプションと導入形態を見る',

  /* Solutions — the prompt, the tiles and their columns */
  'What are you looking to achieve?': '何を実現したいですか？',
  'Improve SEO & AEO': 'SEO・AEOを強化する',
  'Manage every layer of SEO in one CMS.': 'SEOのあらゆる要素を1つのCMSで管理。',
  'Build Portals & Intranets': 'ポータル・社内ポータルを構築する',
  'Centralize Systems': 'サイロ化した業務システムを統合する',
  'Attract more traffic with a modern site.': 'モダンなサイトで、より多くの流入を。',
  'Customize Experiences': '業界別の体験をつくる',
  'Tailored solutions for your industry.': '業界ごとに最適化されたソリューション。',

  'AI Search': 'AI検索',
  'Get found and cited by AI search engines.': 'AI検索エンジンに見つけられ、引用される。',
  'Technical & Events': 'テクニカルSEO',
  'Fix technical SEO, no developer needed.': '開発者不要でテクニカルSEOを改善。',
  Multilingual: '多言語対応',
  'Reach global audiences in 50+ languages.': '50以上の言語でグローバルな顧客にリーチ。',
  Audit: 'SEO監査',
  'Catch SEO and accessibility issues early.': 'SEOとアクセシビリティの課題を早期に発見。',

  'Customer Portals': 'カスタマーポータル',
  'Help customers self-serve and succeed.': '顧客のセルフサービスと成功を後押し。',
  'Partner Portals': 'パートナーポータル',
  'Simplify how partners work with you.': 'パートナーとの協業をシンプルに。',
  'Supplier Portals': 'サプライヤーポータル',
  'Centralize supplier communication.': 'サプライヤーとのやり取りを一元化。',
  Intranets: '社内ポータル（イントラネット）',
  'Give employees a connected digital home.': '従業員がつながるデジタルの拠点を提供。',

  'Enterprise Websites': 'エンタープライズWebサイト',
  'Launch and manage websites at scale.': '大規模なWebサイトを構築・運用。',
  'Integrate siloed enterprise applications': 'サイロ化した業務システムを統合する',
  'Unify your CRM, ERP, and legacy systems on one platform':
    'CRM・ERP・レガシーシステムを1つの基盤に統合。',
  'Modernize Legacy Infrastructure': 'レガシー基盤をモダナイズする',
  'Migrate on your terms while keeping the business running.':
    '業務を止めずに、自社のペースで移行。',
  'Personalized experiences at scale': '大規模なパーソナライズ体験を実現する',
  "Personalize without IT delays, and prove it's working.":
    'IT部門を待たずにパーソナライズし、効果を可視化。',

  'Financial Services': '金融サービス',
  'Secure and compliant solutions for financial services.':
    '金融業界に求められる安全性とコンプライアンスに対応。',
  Manufacturing: '製造業',
  'Modernize operations and B2B buying./Drive revenue and reduce costs with digitized operations.':
    '業務とBtoB購買をモダナイズ。デジタル化で売上拡大とコスト削減を実現。',
  'Public Sector': '公共・自治体',
  'Deliver secure digital citizen services.': '安全な行政デジタルサービスを提供。',
  'Energy & Utilities': 'エネルギー・公益事業',
  'Offer intuitive and cost-effective customer experiences.':
    '直感的でコスト効率の高い顧客体験を提供。',

  "Skoda Auto's Intranet Serves 40,000 Employees":
    'Škoda Auto：4万人の従業員へパーソナライズされた体験を提供するイントラネット',
  'Inside Škoda personalized employee experience':
    'Škodaのパーソナライズされた従業員体験の舞台裏。',
  '11 Building Blocks for a High-Performing Supplier Portal':
    '効果的なサプライヤーポータルを構築するためのガイド',
  'Checklist: Automate workflows, boost efficiency.':
    'チェックリスト：ワークフローを自動化し、効率を向上。',

  /* Resources */
  'Knowledge Center': 'ナレッジセンター',
  'Resource Hub': 'リソースハブ',
  'Explore guides, ebooks, and whitepapers.': 'ガイド、eBook、ホワイトペーパーを閲覧。',
  'Webinars & Events': 'ウェビナー・イベント',
  'Save your seat for our next session, live or in person.':
    '次回のオンライン／対面セッションにお申し込みください。',
  Blog: 'ブログ',
  'Insights on digital strategy and customer experience.': 'デジタル戦略と顧客体験に関する知見。',
  Documentation: 'ドキュメント',
  'All in one spot: Official guides for Liferay DXP.':
    'Liferay DXPの公式ガイドをまとめて確認。',
  'Online Courses': 'オンライン講座',
  'Master Liferay DXP, self-paced and in-depth.': '自分のペースでLiferay DXPを深く学ぶ。',
  'In-Person Training': '集合研修（公式トレーニング）',
  'Get hands-on with instructor-led training.': '講師による実践型トレーニングに参加。',

  /*
   * The sheet's `AI & Digital Strategy` column is three *different* Japanese articles rather than
   * translations of the English three — the JP site has its own set. Mapped one-for-one by position.
   */
  'AI & Digital Strategy': 'AI・デジタル戦略',
  'AI For Your Enterprise Needs': '生成AIとLLMでコンテンツ管理システムを刷新',
  'Purpose-built agents, grounded in your data.': '自社データに基づく、目的特化型のエージェント。',
  'Operationalizing an AI Governance Framework': 'エージェント型AI：AIの次なる進化',
  'AI governance: from strategy to execution.': 'AIガバナンスを、戦略から実行へ。',
  'How the AI Governance Maturity Model Works': 'AI導入を成功させるには：3つの重要ポイント',
  'The five levels of AI governance maturity.': 'AIガバナンス成熟度の5段階。',

  'Technical Insights': '技術情報',
  'Headless CMS vs Traditional CMS': '従来型 vs ヘッドレス —— 最適なCMSアーキテクチャの選び方',
  'Find the right fit for your team.': '自社チームに最適な選択肢を見つける。',
  "DXP vs CMS: What's the Difference?": 'デジタルエクスペリエンスプラットフォーム（DXP）とは？',
  'One manages content. The other does a lot more.': '一方はコンテンツ管理、もう一方はその先まで。',
  'Composable Architecture Guide': 'コンポーザブルアーキテクチャガイド',

  'Customer Stories': '導入事例',
  'Unilever Achieves 133% Faster Go to Market': 'ユニリーバ社｜導入事例',
  'How a platform overhaul sped up new product rollouts.': '基盤刷新により新製品の展開を加速。',
  'Petrobras creates better experiences for employees and customers': 'ペトロブラス｜導入事例',
  'See how Petrobras unified sites for 4M+ users.': '400万人以上が利用するサイトを統合した事例。',
  'Lenovo increases partner satisfaction and sales': 'Lenovo 360 Partner Hub｜導入事例',
  'How one unified hub set partners up for success.': '統合ハブがパートナーの成功を後押し。',
  'See All Customer Stories': '導入事例をすべて見る',

  /* Partners */
  'Partner Directory': 'パートナーを探す',
  'Find a certified Liferay partner.': '認定Liferayパートナーを探す。',
  'Partner Portal': 'パートナーポータル（ログイン）',
  'Partner resources and support in one place.': 'パートナー向け資料とサポートを一元提供。',
  'Become a Partner': 'パートナーになる',
  'Solution Partner': 'ソリューションパートナー',
  'Become a certified Solution Partner.': '認定ソリューションパートナーになる。',
  'OEM Partner': 'OEMパートナー',
  'License Liferay and make it part of your product.': 'Liferayをライセンスし、自社製品に組み込む。',
  'Technology Partner': 'テクノロジーパートナー',
  'Join our growing ecosystem.': '拡大するエコシステムに参加。',
  'Liferay Services': 'Liferayのサービス',
  'Global Services': 'グローバルサービス（コンサルティング）',
  'Expert consulting for your DXP project.': 'DXPプロジェクトを専門家が支援。',
  'Technical Account Management': 'テクニカルアカウントマネジメント',
  'Get hands-on guidance from launch onward.': '導入後も伴走する実践的な支援。',
  'Managed Services': 'マネージドサービス',
  'Let Liferay manage your DXP for you.': 'LiferayがDXPの運用を代行。',
  'Customer Support Portal': 'カスタマーサポートポータル',
  'Get help and manage support tickets.': 'サポートチケットの管理と問い合わせ。',
  "Techem's Customer Portal Goes Live in 18 Countries": 'Techem｜導入事例',
  'Faster billing, better visibility, built-in compliance.':
    '18カ国で稼働するカスタマーポータル。',
  'Maschio Gaspardo Builds a Single Source of Truth for Product Data':
    'Maschio Gaspardo｜導入事例',
  'From 6,000 printed catalogs a year to just 100.': '年間6,000部の印刷カタログを100部に削減。',
}

/**
 * The four industry links the sheet adds for Japan only — 【JP追加】 in `JP_Nav`.
 *
 * Healthcare and Logistics are live Japanese industry pages that the new global nav has no room for,
 * and the JP site wants them in `Customize Experiences` alongside the four it shares.
 */
const JA_INDUSTRY_ADDITIONS: NavLink[] = [
  {
    title: '医療・ヘルスケア',
    href: 'https://www.liferay.com/industries/healthcare',
    description: '医療機関のデジタル化と患者体験の向上を支援。',
    icon: 'IconBuilding1',
    standin: true,
  },
  {
    title: '物流・ロジスティクス',
    href: 'https://www.liferay.com/industries/logistics',
    description: '物流のシステム統合とDXを支援。',
    icon: 'IconTruck',
  },
]

/** Every English string this file was asked for and had no entry for. */
const missing = new Set<string>()

function t(text?: string) {
  if (!text) return text
  const translated = JA[text]
  if (!translated) missing.add(text)
  return translated ?? text
}

const link = (l: NavLink): NavLink => ({ ...l, title: t(l.title)!, description: t(l.description) })

export const SITE_NAV_JA: NavMenu[] = SITE_NAV.map((menu) => ({
  ...menu,
  label: t(menu.label)!,
  heading: t(menu.heading),
  tiles: menu.tiles?.map(link),
  columns: menu.columns.map((column) => ({
    ...column,
    heading: t(column.heading),
    links:
      /* The JP-only industries join the column the sheet puts them in. */
      column.heading === 'Customize Experiences'
        ? [...column.links.map(link), ...JA_INDUSTRY_ADDITIONS]
        : column.links.map(link),
  })),
  featured: menu.featured?.map(link),
  featuredHeading: t(menu.featuredHeading),
  featuredMore: menu.featuredMore
    ? { ...menu.featuredMore, label: t(menu.featuredMore.label)! }
    : undefined,
  cta: menu.cta
    ? { ...menu.cta, label: t(menu.cta.label)!, prompt: t(menu.cta.prompt) }
    : undefined,
}))

/**
 * Strings still showing in English, in the order the nav asked for them.
 *
 * Read after `SITE_NAV_JA` has been built — which the module has, by the time anything can import
 * this. The Japan page's docs entry prints it, so an untranslated nav item is visible in Storybook
 * rather than only in the rendered menu.
 */
export const UNTRANSLATED_NAV_LABELS = [...missing]

/** The bar's right-hand cluster, and the same controls at the foot of the mobile drawer. */
export const JA_DRAWER_LANGUAGE = {
  label: '日本語',
  value: 'ja-JP',
  options: [
    { value: 'ja-JP', label: '日本語' },
    { value: 'en-US', label: 'EN (US)' },
    { value: 'zh-CN', label: '中文' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'es-ES', label: 'Español' },
    { value: 'pt-BR', label: 'Português (BR)' },
    { value: 'it-IT', label: 'Italiano' },
  ],
}

export const JA_LOGIN_LABEL = 'ログイン'
export const JA_CONTACT_LABEL = '営業へのお問い合わせ'
