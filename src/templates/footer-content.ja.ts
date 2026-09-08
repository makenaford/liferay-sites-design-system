/*
 * The Japan footer's copy.
 *
 * §12 (closing CTA) and §13 (the disclaimers) are the sheet's own Japanese. **The link grid is not.**
 * The sheet's §14 points at a separate Google Sheet that was not supplied, so the columns below are a
 * draft: where `JP_Nav`'s 参考 block gives an official Japanese label — 会社概要, トラストセンター,
 * プレスリリース・イベント, 採用情報, お問い合わせ, プライバシー・ポリシー, Liferay SaaS/PaaS/Self-Hosted —
 * that label is used verbatim; the rest are translated here and need review against the real footer
 * sheet before this page is treated as final.
 */

import type { FooterContent } from './footer-content'

export const FOOTER_CONTENT_JA: FooterContent = {
  locale: 'ja',
  cta: {
    title: { lead: 'これからの未来へ。', accent: '私たちと一緒に。' },
    description:
      '数千の組織がLiferayでデジタル体験を変革しています。今すぐ無料トライアルを始めましょう。',
    emailLabel: 'メールアドレス',
    emailPlaceholder: 'メールアドレスを入力',
    trialCta: '無料トライアルを開始',
    contactCta: '営業へのお問い合わせ',
  },

  disclaimers: [
    '*記載の数値は個々のLiferay導入事例における結果であり、組織によって異なる場合があります。',
    /*
     * ⚠ The sheet requires legal review on this one, and says to use Gartner's own Japanese wording if
     * Gartner supplies it. This is the sheet's translation, unedited.
     */
    'Gartner, Voice of the Customer for Digital Experience Platforms, Peer Community Contributor, 2026年7月27日\nGartner、Peer Insights、およびCustomers’ Choiceは、Gartner, Inc.および／またはその関連会社の商標です。Gartner Peer Insightsのコンテンツは、個々のエンドユーザーが自身の経験に基づいて述べた意見で構成されており、事実の記述と解釈されるべきものではなく、またGartnerおよびその関連会社の見解を示すものでもありません。Gartnerは、本コンテンツに記載されたいかなるベンダー、製品、サービスも推奨するものではなく、本コンテンツの正確性や完全性について、商品性や特定目的への適合性の保証を含め、明示または黙示を問わずいかなる保証も行いません。',
  ],

  stats: [
    { value: '1,200', accent: '社+', label: 'エンタープライズのお客様' },
    { value: '17', accent: '年+', label: 'イノベーションの歴史' },
  ],

  legal: {
    built: 'Liferay Digital Experience Platformで構築',
    copyright: '© 2023 Liferay Inc. All Rights Reserved',
    links: ['GDPR', 'アクセシビリティ', '法的事項', 'コンプライアンス', 'プライバシー・ポリシー'],
  },

  columns: [
    [
      'はじめる',
      [
        'デモを依頼する',
        '無料トライアルを開始',
        'マーケットプレイス',
        'Liferay SaaS／PaaS／Self-Hosted',
        '導入ガイド',
      ],
    ],
    ['その他の業界', ['保険', '運輸・物流', '教育', 'ウェルスマネジメント']],
    [
      '他製品との比較',
      [
        'Liferay と Adobe',
        'Liferay と Sitecore',
        'Liferay と Optimizely',
        'Liferay と SharePoint',
        'Liferay と Magnolia',
        'Liferay と Salesforce',
      ],
    ],
    [
      'Liferayをはじめて知る方へ',
      [
        'DXPとは？',
        'SaaSとPaaSの違い',
        'Webポータルの基礎知識',
        'ポータルの事例',
        'ヘッドレスCMSガイド',
        '2分でわかるWebサイト運用スコア診断',
      ],
    ],
    ['DX（デジタル変革）', ['金融サービス', '公共・自治体', '医療・ヘルスケア', '製造業']],
  ],

  columnsBelow: [
    [
      '事例で見るLiferay',
      [
        '参考になるWebポータル事例16選',
        '製造業におけるDXの成功事例3選',
        '優れたカスタマーポータルの事例8選',
        '生産性を高める社内ポータルの事例7選',
        '製造業のセルフサービス活用事例3選',
      ],
    ],
    [
      '会社情報',
      [
        '会社概要',
        '新着情報',
        '今後の展開',
        'プレスリリース・イベント',
        '採用情報',
        '拠点一覧',
        'お問い合わせ',
      ],
    ],
    [
      '法的事項',
      [
        'トラストセンター',
        'カスタマー契約フレームワーク',
        'プライバシー・ポリシー',
        'コンプライアンス',
        'アクセシビリティ',
      ],
    ],
    [
      '開発者向け',
      [
        '開発者ブログ',
        'Liferay Discuss',
        'Liferayユーザーグループ',
        'Liferay DXPのダウンロード',
        'GitHub',
        'Liferay DXPのJakartaへのアップグレード',
        'Liferay Cloud Platform ステータス',
      ],
    ],
  ],

  /* The Japanese office, in the order a Japanese address is written. */
  address: '〒106-6116\n東京都港区六本木6-10-1\n六本木ヒルズ森タワー16階\nリフェイ株式会社',
}
