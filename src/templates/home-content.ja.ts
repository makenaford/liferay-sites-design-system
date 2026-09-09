/*
 * The Japan home page's copy — `JP_Homepage_Nav_Content.xlsx`, sheet `Homepage Copy JP`.
 *
 * Transcribed from the sheet's `Copy (JP) 日本語コピー` column, section by section, rather than
 * translated here. Where the sheet's `JP Notes 備考` column marks a row ⚑ (JP-specific copy that
 * deliberately differs from the global page) or ⚠ (a gap — no Japanese destination exists yet), the
 * note is carried into the comment above that entry so the divergence stays visible in the code.
 *
 * **Destinations are not wired.** Every link on this page is `href="#"`, exactly as the global page's
 * are — the design system draws the page, it does not route it — so the sheet's `JP URL` column is
 * recorded in the Storybook docs page rather than here.
 */

import type { HomeContent } from './home-content'

export const HOME_CONTENT_JA: HomeContent = {
  locale: 'ja',

  hero: {
    finder: {
      label: 'カスタマイズされたソリューションを見る',
      industryLabel: '業種',
      industries: [
        { value: 'financial-services', label: '金融サービス' },
        { value: 'public-sector', label: '公共・自治体' },
        { value: 'manufacturing', label: '製造業' },
        { value: 'healthcare', label: '医療・ヘルスケア' },
      ],
      useCaseLabel: 'ソリューション',
      useCases: [
        { value: 'kms', label: 'ナレッジマネジメントシステム' },
        { value: 'customer-portals', label: 'カスタマーポータル' },
        { value: 'commerce', label: 'デジタルコマース' },
        { value: 'intranets', label: '社内ポータル' },
      ],
      cta: '次へ',
    },
    /*
     * 「成果を生み、拡張し、成長し続けるデジタル体験を。」 split at the comma the sheet writes, so the
     * gradient lands on the closing clause the way the design draws it. The sheet caps the H1 at 25
     * characters; this is 24.
     */
    title: { lead: '成果を生み、拡張し、', accent: '成長し続けるデジタル体験を。' },
    description: {
      lead: 'Liferay DXPなら、コンテンツ制作の自動化、グローバル市場向けのローカライズ、ポータル構築、統合コマースストアフロントの立ち上げ、SEO／AEO対策までを、',
      strong: 'エージェント型AIを備えた単一のヘッドレスCMS基盤で実現できます。',
    },
    emailLabel: 'メールアドレス',
    emailPlaceholder: 'メールアドレスを入力',
    trialCta: '無料トライアルを開始',
    demoCta: 'デモを依頼する',
    rating: '4.6',
    /*
     * The node's new sentence, translated here rather than taken from the sheet — the sheet predates
     * this row, so this string is the one thing on the page a Japanese reader should check. The figure
     * and the date are the global page's, since they describe the same Gartner listing.
     */
    ratingSource: '2026年5月時点、認証済みユーザー64名の評価　出典：Gartner Peer Insights™',
    /* The badges are Gartner's and G2's own marks, so the artwork is not localized — only the alt text. */
    badges: [
      { alt: 'Gartner Peer Insights カスタマーズチョイス 2026' },
      { alt: 'G2 2026年秋 リーダー（エンタープライズ）' },
    ],
    marks: ['SOC 2 Type 2', 'ISO/IEC 27001', 'HIPAA', 'CSTAR'],
    mediaAlt: 'Liferay DXPでページを構成しているところ',
  },

  /*
   * §2 のJP備考が国内ロゴへの差し替えを推奨しており、その6社をそのまま置いています。ロゴ自体は
   * 他社の商標なのでこのリポジトリにはなく、`Wordmark` が描く社名のスタンドインです。
   */
  logos: {
    label: 'Liferayをご利用のお客様',
    names: [
      'パナソニック コネクト',
      '横河電機',
      '東京海上日動',
      '郵船ロジスティクス',
      '住友商事',
      '名古屋大学',
    ],
  },

  /*
   * §3 — all eight cards are ⚑ JP-specific: the sheet replaces the global benefits with portal- and
   * intranet-led ones for the Japanese market. The global page's card artwork is unchanged, which the
   * sheet flags (`※列Fのビジュアル指示はEN版ベネフィット向け`) as needing new visuals.
   */
  goals: {
    title: 'AIがチームにもたらす可能性',
    tabs: [
      { value: 'marketers', label: 'マーケター' },
      { value: 'developers', label: 'IT・開発者' },
    ],
    items: {
      marketers: [
        {
          title: '全社ポータルのコンテンツを一元管理',
          alt: 'ロケットと公開ボタンの並ぶキャンペーンボード',
        },
        {
          title: '一人ひとりに合わせたポータル体験で、利用を促進',
          alt: '企業の購買担当とリピート顧客を切り替えるセグメントルール',
        },
        {
          title: '社内・取引先とのナレッジ共有を効率化',
          alt: '営業担当を介さずに注文が確定した、交渉済み価格のカタログ',
        },
        {
          title: '分析とインサイトを、すぐに次のアクションへ',
          alt: 'セグメント別キャンペーンを促す分析ダッシュボード',
        },
      ],
      developers: [
        {
          title: '既存システムとレガシー基盤を、すべて統合',
          alt: '営業担当を介さずに注文が確定した、交渉済み価格のカタログ',
        },
        {
          title: 'ローコードで、レガシーグループウェアを刷新',
          alt: '企業の購買担当とリピート顧客を切り替えるセグメントルール',
        },
        {
          title: 'アクセスを保護し、複数ポータルのガバナンスをシンプルに',
          alt: 'セグメント別キャンペーンを促す分析ダッシュボード',
        },
        {
          title: '分散したポータルを、ひとつの基盤に統合',
          alt: 'ロケットと公開ボタンの並ぶキャンペーンボード',
        },
      ],
    },
  },

  /*
   * §4 — the eight customer stories. Company names stay in the Latin alphabet where the sheet keeps
   * them and are transliterated where it does (ウィーン市, ユニリーバ, エアバス). The sheet notes that
   * a Japanese case-study page with an official translation should win over these renderings.
   */
  stories: {
    title: { accent: '1,200社以上の企業', trail: 'が、Liferayで成果を上げています' },
    label: '導入事例',
    items: [
      {
        customer: 'Sky TV',
        hue: 214,
        value: '140',
        suffix: '%',
        label: 'セルフサービス利用率の向上',
        quote:
          'Liferayなら、自動でもスケジュール実行でも、以前よりはるかに迅速にスケールできます。',
        name: 'Jacques Hefer氏',
        title: 'ソリューションアーキテクト',
      },
      {
        customer: 'City of Vienna',
        hue: 0,
        value: '1億',
        prefix: '+',
        label: '月間ページビュー',
        quote:
          'Liferayの標準機能により、最先端のコミュニケーション手法を、迅速かつ手軽に提供できるようになりました。',
        name: 'Nikolaus Reisel氏',
        title: 'GBSグループリーダー（基幹システム・プラットフォーム担当）',
      },
      {
        customer: 'Broadcom',
        hue: 300,
        value: '845',
        label: '実装した機能の数',
        quote:
          '私たちはLiferayをベンダーではなく、パートナーだと考えています。カスタマーセルフサービスで実現したかったことは、すべて形になりました。',
        name: 'Erica Callaghan氏',
        title: 'コミュニケーション・UX責任者（グローバルテクノロジー部門）',
      },
      {
        customer: 'Unilever',
        hue: 228,
        value: '133',
        suffix: '%',
        label: '市場投入までの期間を短縮',
        quote:
          'Liferayの採用は、私たちにとって迷う余地のない選択でした。デジタルジャーニー全体が、統一された形で設計されています。',
        name: 'Srikant Chandrasekharan氏',
        title: 'エンタープライズプラットフォーム・製品担当シニアデリバリーリード',
      },
      {
        customer: 'Airbus',
        hue: 196,
        value: '24,000',
        label: 'ポータル利用者数',
        quote:
          'Keycopterは、ヘリコプター運航事業者に効率性と自律性をもたらします。Liferayで一貫したオンラインサービスを提供することで、お客様は機体を良好な状態に保ちやすくなります。',
        name: 'Jérôme Chauvin氏',
        title: 'IMプロジェクトマネージャー',
      },
      {
        customer: 'Mueller, Inc.',
        hue: 264,
        value: '73',
        suffix: '%',
        label: '見積依頼数の増加',
        quote:
          'Liferayの標準機能と開発ツールにより、お客様がどこにいても接点を持ち、購買プロセス全体をオンラインで完結できる——そうした顧客体験の実現に近づいています。',
        name: 'Hab Adkins氏',
        title: 'コーポレートテクノロジーマネージャー',
      },
      {
        customer: 'Jose Cuervo',
        hue: 24,
        value: '7',
        label: '社内ポータルで統合したチーム数',
        quote:
          '新しい社内コミュニケーション基盤には、高い実効性と優れたユーザー体験が求められていました。Liferayでようやくそれが実現しました。',
        name: 'Loria Saviñon氏',
        title: '人事マネージャー',
      },
      {
        customer: 'MacDon',
        hue: 156,
        value: '50',
        suffix: '%',
        label: 'オンライン取引の増加',
        quote:
          'ちょうど刷新すべき時期でした。今では毎週のように、顧客体験について熱のこもった高い評価をいただいています。',
        name: 'Derek Boonstra氏',
        title: 'ビジネスシステム担当マネージャー',
      },
    ],
  },

  /*
   * §5 — the three audience panels. Unlike the global page, every figure here is the sheet's own and
   * differs per tab, which is why the metrics moved onto the panel.
   */
  teams: {
    title: { lead: '異なるチーム。', accent: 'ひとつのAI搭載プラットフォーム。' },
    description:
      'キャンペーンを推進する方も、インフラを構築する方も、パートナービジネスを広げる方も。Liferayがその成功を支えます。',
    mediaAlt: 'LiferayでAIエージェントを構築する2人の同僚',
    panels: {
      marketers: {
        label: 'マーケター',
        title: 'もっと速く立ち上げ、もっと成果を。',
        description: 'キャンペーン、コンテンツ、顧客体験を担うチームのために。',
        metrics: [
          { value: 596, label: '公開されたWebサイト' },
          { value: 24, label: '対応業種' },
          { value: 77, label: '導入国' },
        ],
        items: [
          {
            q: 'より賢いコンテンツで、より多くの訪問者をコンバージョンへ',
            a: 'AIでコンテンツの作成・管理を高速化。AIエージェントがアセットの自動タグ付け、ページの翻訳、リアルタイムの訪問者セグメント化を行い、すべてのコンテンツが自動的に最適な相手へ届きます。',
            link: 'AI Hubを見る',
          },
          {
            q: 'IT部門を待たずに、キャンペーンを立ち上げる',
            a: 'ドラッグ＆ドロップのエディタで、ランディングページ、マイクロサイト、デジタル体験全体を構築・公開。開発者は必要ありません。チームは必要なスピードで動けます。',
            link: 'ページビルダーを見る',
          },
          {
            q: 'すべての訪問者に、最適なメッセージを',
            a: '訪問者の行動・セグメント・履歴に基づき、パーソナライズされたコンテンツ、レコメンド、オファーを提供します。AIと既存システムのリアルタイムデータがそれを支えます。',
            link: 'パーソナライゼーションを見る',
          },
          {
            q: 'すべてのチャネルで、コンテンツとアセットの一貫性を保つ',
            a: '一度作れば、どこへでも。構造化コンテンツとデジタルアセットをAIが自動でタグ付け・集約し、ひとつのライブラリで一元管理。サイト、キャンペーン、言語、地域を越えて、重複作業もブランド統制の乱れもなく展開できます。',
            link: 'DAMを見る',
          },
          {
            q: '自社サイトを、BtoBの収益エンジンへ',
            a: '取引先企業がオンラインで製品を探し、仕様を選び、購入できる環境を。企業別カタログ、交渉済み価格、受注管理を初日から標準搭載しています。',
            link: 'BtoBコマースを見る',
          },
        ],
      },
      it: {
        label: 'IT・開発者',
        title: '一度作れば、すべてつながる。',
        description:
          'エンタープライズ基盤を構築・運用する、アーキテクト、エンジニア、IT責任者のために。',
        metrics: [
          { value: 1041, label: 'ポータル・社内ポータルの構築数' },
          { value: 700, label: '接続したアプリケーション*' },
          { value: 92, label: '開発期間の短縮率*' },
        ],
        items: [
          {
            q: 'カスタムミドルウェアなしで、あらゆるシステムを接続',
            a: 'ERP、CRM、レガシーアプリケーション、そして各種LLMを、事前構築済みコネクタ、オープンAPI、Liferay独自のMCPで統合。デジタル体験は常に最新の状態を保ちます。',
            link: 'システム連携を見る',
          },
          {
            q: 'すべてを作り直さずに、ヘッドレスへ',
            a: 'RESTおよびGraphQL APIでコンテンツとサービスを公開。既存のフロントエンド、モバイルアプリ、新しいデジタルチャネルへ、全面移行や作り直しなしで配信できます。',
            link: 'ヘッドレスCMSを見る',
          },
          {
            q: 'エンタープライズグレードのセキュリティで、どこにでも展開',
            a: 'SaaS、PaaS、自社運用のいずれにも対応。SSO、AIにも配慮したロールベースアクセス制御、暗号化、各種コンプライアンス認証を標準装備し、厳格なエンタープライズIT要件に応えます。',
            link: 'セキュリティを見る',
          },
          {
            q: 'ローコードで、複雑なポータルをすばやく構築',
            a: 'フォーム、ワークフロー、データモデルをビジュアルに作成し、必要に応じてカスタムコードで拡張。ローコードは開発期間を短縮しつつ、ブラックボックス化を招きません。',
            link: 'ローコードを見る',
          },
        ],
      },
      partners: {
        label: 'パートナー',
        title: 'もっと成長を、もっと速いデリバリーを。',
        description:
          'Liferayとともに、またLiferay上で構築する、ソリューションパートナー、テクノロジーパートナー、OEMパートナーのために。',
        metrics: [
          { value: 450, label: '世界のアクティブパートナー' },
          { value: 2100, label: '有効な認定資格' },
          { value: 1600, label: '共同で立ち上げたプロジェクト' },
        ],
        items: [
          {
            q: 'Liferayの案件を、5倍のサービス収益機会へ',
            a: 'Liferayライセンス1に対し、ソリューションパートナーは平均して5倍のサービス売上を生み出しています。案件登録制度、共同販売支援、各種インセンティブで、パートナービジネスの成長を後押しします。',
            link: 'ソリューションパートナーになる',
          },
          {
            q: 'エンタープライズグレードのDXPで、事業拡大を加速',
            a: 'Liferayを自社ソフトウェアに組み込み、市場投入までの時間を大幅に短縮。セルフサービスポータル、高度なコンテンツ管理、シームレスなコマースを、ゼロから作らずに提供できます。',
            link: 'OEMパートナーになる',
          },
          {
            q: '自社製品を、エンタープライズのお客様へ',
            a: 'コネクタを開発してリファラルを獲得。あるいはLiferayの営業と協働して案件を獲得。デジタル体験に投資する大企業のチームに、自社テクノロジーを届けられます。',
            link: 'テクノロジーパートナーになる',
          },
          {
            q: 'トレーニングと認定で、デリバリー体制を整える',
            a: 'オンライントレーニング、認定資格、共同マーケティング資料、そしてパイプラインと共同ブランド素材を管理する専用パートナーポータルまで、Liferayの支援体制をフル活用できます。',
            link: 'パートナーになる',
          },
        ],
      },
    },
  },

  /* §6 — all six cards written out, which the global page's sheet never did. */
  industries: {
    title: { lead: '業界に合わせて設計し、', accent: '成長のために構築。' },
    solutionsCta: '{industry}向けソリューション',
    transformationCta: '{industry}におけるDX',
    mediaAlt: 'スマートフォンからアカウントにサインインしているところ',
    panels: [
      {
        label: '金融サービス',
        description:
          '顧客とアドバイザーのデータを統合し、あらゆる金融体験をパーソナライズ。セキュリティを強化しコンプライアンス対応を簡素化することで、長期的な信頼と競争優位を築きます。',
        metrics: [
          { value: '45%', label: '読み込み速度の向上' },
          { value: '96%', label: '相談対応時間の削減', down: true },
          { value: '30%', label: 'データ入力時間の削減*', down: true },
        ],
      },
      {
        label: 'エネルギー・公益事業',
        description:
          'セルフサービスツールで顧客の利便性を高め、システムを横断してデータを統合。デジタルワークプレイスを効率化し、満足度向上とサービスコスト削減を同時に実現します。',
        metrics: [
          { value: '170万', label: '対応した顧客数' },
          { value: '50%', label: 'オンライン決済の増加' },
          { value: '750%', label: '月間処理リクエスト数の増加*' },
        ],
      },
      {
        label: '製造業',
        description:
          '業務をデジタル化し、BtoB購買を簡素化。サプライチェーンを強化することで、コスト削減と売上拡大を実現し、市場の変化にも揺るがない体制を築きます。',
        metrics: [
          { value: '80%', label: 'ユーザー登録・オンボーディングの高速化' },
          { value: '50%', label: 'オンライン取引の増加' },
          { value: '50%', label: 'カタログ制作時間の削減*', down: true },
        ],
      },
      {
        label: '公共・自治体',
        description:
          '住民向けセルフサービスポータルを提供し、機微情報を保護。レガシーシステムを刷新することで、待ち時間と業務負荷を削減し、行政への信頼を高めます。',
        metrics: [
          { value: '200', label: '統合したアプリケーション' },
          { value: '25,000', label: '1日あたりの社内ポータル利用者' },
          { value: '256,000', label: '月間ページビュー*' },
        ],
      },
      {
        label: '医療・ヘルスケア',
        description:
          '患者・医療従事者向けの安全でパーソナライズされたセルフサービスポータルを提供。レガシーシステムを連携し、コンプライアンス対応を簡素化することで、医療の質と成果を高めます。',
        metrics: [
          { value: '10倍', label: '市場投入までの期間を短縮' },
          { value: '8カ月', label: '導入完了までの期間' },
          { value: '0', label: '移行時のダウンタイム*' },
        ],
      },
      {
        label: 'すべての業界',
        description:
          '金融サービス、製造業、公共・自治体、医療、エネルギー、教育、保険をはじめ、あらゆる業界に対応する柔軟なデジタルソリューションをご覧ください。',
        metrics: [
          { value: '200倍', label: '取引量' },
          { value: '6カ月', label: '移行完了までの期間' },
          { value: '400%', label: 'サイト訪問数の増加*' },
        ],
      },
    ],
  },

  platformMap: {
    title: { lead: '必要なすべてが、', accent: 'ひとつのプラットフォームに' },
    hubLabel: 'DXP',
  },

  /*
   * §8 — the sheet reuses this section 1:1 and changes only the CTAs, whose Japanese destinations are
   * all singular (`/solutions/customer-portal`, not `-portals`). The panel titles and descriptions are
   * not in the JP sheet, so they are translated from the global page's and should be reviewed.
   */
  capabilities: {
    title: 'エンタープライズに必要な、あらゆる機能',
    mediaAlt: 'Liferayで構築された金融サービスのWebサイト',
    panels: [
      {
        value: 'customer-portals',
        label: 'カスタマーポータル',
        title: 'お客様のあらゆる手続きを、ひとつの場所で。',
        description:
          '問い合わせの電話をせずに、答えを見つけ、ケースを起票し、アカウントを管理できる場所を。サイトと同じコンテンツ基盤の上で動きます。',
        cta: 'カスタマーポータルを見る',
      },
      {
        value: 'supplier-portals',
        label: 'サプライヤーポータル',
        title: 'サプライヤーのオンボーディングを、四半期から数日へ。',
        description:
          '書類の収集、コンプライアンスの追跡、請求処理をひとつの場所に。承認フローは経理部門が今使っているものをそのまま利用できます。',
        cta: 'サプライヤーポータルを見る',
      },
      {
        value: 'partner-portals',
        label: 'パートナーポータル',
        title: 'パートナーに、売るために必要なものを。',
        description:
          '案件登録、共同ブランドの素材、支援コンテンツをひとつのログインの内側に。パートナーのランクに応じてパーソナライズされます。',
        cta: 'パートナーポータルを見る',
      },
      {
        value: 'enterprise-websites',
        label: 'エンタープライズWebサイト',
        title: '訪問者を惹きつけ、リードを生み、成長を加速する。',
        description:
          'パーソナライズされ、スケールするWebサイトで、訪問をコンバージョンに、コンバージョンを顧客と長期的な支持者に変えます。',
        cta: 'エンタープライズWebサイトを見る',
      },
      {
        value: 'intranets',
        label: '社内ポータル',
        title: '社員が実際に集まる、ひとつの場所。',
        description:
          '社内ニュース、必要な文書、提出すべき申請書を、ひとつの検索インデックスとひとつのログインの内側に。',
        cta: '社内ポータルを見る',
      },
      {
        value: 'digital-commerce',
        label: 'デジタルコマース',
        title: '買い手の買い方に、そのまま合わせて売る。',
        description:
          '交渉済み価格、セルフサービスの再注文、見積から入金までを、マーケティングサイトと同じコンテンツツリーの上で。',
        cta: 'デジタルコマースを見る',
      },
    ],
  },

  integrations: {
    title: { lead: 'プラットフォームを拡張し、', accent: '制限なくつながる。' },
    description: 'Liferayは、チームが日々利用するプラットフォームやベンダーと柔軟に連携します。',
    cta: 'システム連携機能を見る',
    label: 'システム連携',
  },

  trending: {
    title: '注目のコンテンツ',
    description: 'Liferayの最新のインサイトとリソース。',
    items: [
      {
        tag: 'ガイド',
        title: 'AIトランスフォーメーションとは？',
        alt: '回路とデータの青いオーバーレイの下で、ノートPCのキーボードに置かれた手',
      },
      {
        tag: 'ブログ',
        title: 'ナレッジマネジメントシステムの目的とは？',
        alt: '電球、動画プレーヤー、メッセージカードと並ぶ女性のフラットイラスト',
      },
      {
        tag: 'ブログ',
        title: 'ローコード・ノーコードとは？メリット・デメリットや活用例を解説',
        alt: 'モニターに映るコードを読む人',
      },
      {
        tag: '記事',
        title: 'デジタル戦略とは？',
        alt: '付箋で埋まったホワイトボードの前に立つ2人の同僚',
      },
      {
        tag: 'ブログ',
        title: '参考になるWebポータル事例16選',
        alt: '作成・検索・共有・信頼・改善のタイルに囲まれた、光るプラットフォームの3Dレンダリング',
      },
      {
        tag: 'ブログ',
        title: 'BtoB ECとは？',
        alt: '真上から見たノートPCのキーボードと、その上に置かれた手',
      },
    ],
  },

  /* §11 — the sheet marks all three report titles as provisional translations (暫定訳). */
  research: {
    title: '最新の調査データとレポート',
    description: 'より良い意思決定を支える、新しい調査レポート。',
    items: [
      { tag: 'CMSトレンド', title: 'Liferay 2026年版 デジタルコンテンツ管理レポート' },
      {
        tag: 'エージェント型AI',
        title: 'Liferay 2026年版 エージェント型AIの導入とガバナンスに関するレポート',
      },
      { tag: 'デジタルトラスト', title: 'Liferay 2026年版 信頼喪失レポート' },
    ],
  },
}
