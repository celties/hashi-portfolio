/* =========================================================
   全作品データ
   新しい作品は PROJECTS の先頭に足すだけで反映されます。
   ========================================================= */

const PROFILE = {
  nameJa: "橋本 勇太",
  nameEn: "Yuta Hashimoto",
  handle: "Hashi",
  role: "理学療法学生 / つくる人",
  tagline: "身体 × データ で、毎日をちょっとだけ良くする道具をつくる。",
  intro: [
    "東京都立大学で理学療法を学びながら、「あったら自分が助かる」と思ったものを片っ端からつくっています。",
    "早起きが続かないからトラッカーを、家計簿が面倒だから自動登録を、バスケをもっと知りたいから図鑑を。動機はいつも自分の生活で、そこから実家の手伝いで毎日使われるアプリまで広がりました。",
    "目標はNBAのアスレティックトレーナー。身体のことを深く理解する力と、道具を自分でつくれる力の両方を持った人になりたいと思っています。",
  ],
  contacts: [
    { label: "Email", value: "0222yuuta@gmail.com", href: "mailto:0222yuuta@gmail.com" },
    { label: "GitHub", value: "@celties", href: "https://github.com/celties" },
    { label: "Instagram", value: "@nbatrainerfromjapan", href: "https://www.instagram.com/nbatrainerfromjapan/" },
  ],
};

const CATEGORIES = [
  { id: "all",        label: "すべて" },
  { id: "habit",      label: "習慣・記録" },
  { id: "basketball", label: "バスケットボール" },
  { id: "video",      label: "動画・クリエイティブ" },
  { id: "automation", label: "自動化" },
  { id: "study",      label: "学び・キャリア" },
];

const PROJECTS = [
  /* ---------- 習慣・記録 ---------- */
  {
    id: "nihon-okoshi",
    title: "日本は俺が起こす",
    subtitle: "早起き習慣トラッカー",
    category: "habit",
    period: "2026.05 —",
    status: "稼働中",
    featured: true,
    emoji: "🌅",
    summary:
      "日の出時刻より前に起きられたかを毎朝記録して、ストリークとグレードで可視化する習慣アプリ。Mac用デスクトップ版とWeb版の二系統を持ちます。",
    body: [
      "最初はPythonとTkで約2,700行のMacアプリとして書きました。Open-Meteo APIでその日の日の出時刻を取り、起床時刻と比べてS/A/B/Cのグレードを出します。夜の準備チェックリストを終えないと朝の解除ができない「起床ロック」や、バッジ、週次スコアカードも入っています。",
      "外出先でも使いたくなったので、同じ機能をNext.js + Notion APIで再実装してVercelに公開しました。同じNotion DBを読むので、MacアプリとWeb版を並行して使えます。",
      "launchdで毎晩23時に夜準備画面、朝はMacを開いた瞬間にホーム画面が自動で立ち上がります。",
    ],
    tech: ["Python 3.13", "Tkinter", "Next.js 16", "React 19", "Notion API", "Vercel", "launchd"],
    links: [{ label: "公開サイト", href: "https://nihon-okoshi.vercel.app" }],
    highlights: ["日の出APIと連動したグレード判定", "夜×朝のチェックリストによる起床ロック", "仲間タブでランキング共有", "Mac版とWeb版で同じNotion DBを共有"],
  },
  {
    id: "kintore-dojo",
    title: "筋トレ道場",
    subtitle: "筋トレ記録Webアプリ",
    category: "habit",
    period: "2026.06 —",
    status: "公開中",
    featured: true,
    emoji: "🏋️",
    summary:
      "種目・重量・セット・レップを記録して、部位別の履歴と重量推移グラフで伸びを追う筋トレアプリ。食事写真のカロリー推定とジム滞在時間の記録まで入っています。",
    body: [
      "「Kintore Memo.みたいなものを自分で作りたい」が出発点。記録はすべてNotionのデータベースに入るので、アプリの外からも見返せます。",
      "フェーズ1で記録・履歴・グラフ・テンプレート、フェーズ2で食事タブとジムタブを追加しました。食事タブは写真をアップすると Claude Vision がカロリーとタンパク質を推定してフォームに流し込みます。",
      "アカウント機能は作らず、ニックネームをブラウザに保存する方式で「みんな」タブを実装。URLを友達に渡すだけで記録を共有できます。PWA対応なのでホーム画面から全画面で開けます。",
    ],
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Notion API", "Recharts", "Claude Vision API", "PWA"],
    links: [{ label: "公開サイト", href: "https://kintore-dojo.vercel.app" }],
    highlights: ["7タブ構成（記録/履歴/グラフ/テンプレ/食事/ジム/みんな）", "写真1枚からカロリー・タンパク質を推定", "ニックネームだけで成立する共有機能", "ダーク＋赤金の道場テーマとPWAアイコン"],
  },
  {
    id: "magical-journal",
    title: "魔法の日記帳",
    subtitle: "ホグワーツ風の日記PWA",
    category: "habit",
    period: "2026.06",
    status: "完成",
    emoji: "🕯️",
    summary:
      "本を開くアニメーションから始まる、ダークファンタジー世界観の日記アプリ。書いた内容はNotionに保存され、手書きページはOCRで取り込めます。",
    body: [
      "黒地にゴールドのUIで、ローソクの灯りとパーティクルが揺れるカバー画面から日記画面へ遷移します。世界観を優先して、UI・スタイル・ロジックをすべて1枚のHTML（1,352行）に収めました。",
      "保存先はNotion。Vercel Serverless Functions 経由でNotion APIとOCR APIを叩いています。PWA対応でスマホのホーム画面に置けます。",
    ],
    tech: ["HTML/CSS/JS (単一ファイル)", "Vercel Serverless Functions", "Notion API", "OCR", "PWA", "Service Worker"],
    links: [],
    highlights: ["本が開くカバーアニメーション", "ローソク・パーティクル演出", "手書きページのOCR取り込み"],
  },

  /* ---------- バスケットボール ---------- */
  {
    id: "basketball-playbook",
    title: "バスケ作戦版",
    subtitle: "プレイブック作成・管理アプリ",
    category: "basketball",
    period: "2026.06",
    status: "公開中",
    featured: true,
    emoji: "🏀",
    summary:
      "コート上に選手とカット・パス・スクリーンを描いてプレイを設計し、ステップごとにアニメーション再生できるプレイブックアプリ。",
    body: [
      "ハーフコートオフェンスと、サイドライン／エンドラインのインバウンズプレイを登録・管理できます。プレイをステップに分割すると、そのまま動きを再生して確認できます。",
      "V/O/D/C/P/B/S/G のキーボードショートカットで、ツールを持ち替えずに素早く作図できるようにしました。",
      "バスケのプレイ写真やスクショをアップロードすると、AIが選手位置を読み取って自動配置する機能も入れています。YouTubeの試合動画を横に並べ、タイムスタンプを記録しながら作図することもできます。",
    ],
    tech: ["Next.js", "TypeScript", "Canvas", "LocalStorage", "Claude Vision API", "YouTube API"],
    links: [{ label: "GitHub", href: "https://github.com/celties/basketball-playbook" }],
    highlights: ["カット・パス・ドリブルを線種で描き分け", "ステップ分割してアニメーション再生", "写真から選手位置をAIが自動配置", "YouTube動画と並べて作図"],
  },
  {
    id: "basketball-stats",
    title: "basketball-stats",
    subtitle: "試合スタッツ記録アプリ",
    category: "basketball",
    period: "2026.06 — 2026.08",
    status: "開発中",
    emoji: "📊",
    summary:
      "試合中にスタッツを打ち込み、チーム・選手・キャリア単位で集計するモバイルアプリ。React Native（Expo）でiOS・Android・Webを1つのコードベースから出しています。",
    body: [
      "試合画面、チーム管理、選手のキャリア推移、観戦モード、履歴画面などを持つ本格的な構成です。データはFirebase（Firestore）に置き、ログインして複数端末から使えるようにしています。",
      "Expo Router でファイルベースのルーティングを組み、Web書き出しはVercelにデプロイする運用です。",
    ],
    tech: ["React Native", "Expo", "Expo Router", "TypeScript", "Firebase / Firestore", "Vercel"],
    links: [],
    highlights: ["iOS / Android / Web を1コードベースで", "Firestoreでの永続化と認証", "試合・チーム・キャリアの3階層で集計"],
  },
  {
    id: "celtics-zukan",
    title: "セルティックス図鑑",
    subtitle: "ボストン・セルティックス百科事典",
    category: "basketball",
    period: "2026.06",
    status: "公開中",
    emoji: "☘️",
    summary:
      "現役選手8名、レジェンド10名、優勝18回ぶんの歴史を日本語でまとめたファン向けの事典アプリ。",
    body: [
      "「セルティックスについて日本一詳しくなる」ための自分用の学習ツールとして作りました。現役選手・レジェンド・優勝歴の3タブ構成で、名前でも出身地でも実績の文章でもリアルタイムに検索できます。",
      "カードをクリックするとモーダルでプロフィール・スタッツ・実績・エピソードが開きます。ダークなセルティックグリーンとゴールドで配色しました。",
    ],
    tech: ["HTML", "CSS", "Vanilla JavaScript", "Vercel"],
    links: [{ label: "公開サイト", href: "https://celtics-zukan.vercel.app" }],
    highlights: ["現役8名・レジェンド10名・優勝18回を収録", "全文リアルタイム検索", "時代別にグループ化した優勝年表"],
  },
  {
    id: "worldcup-party",
    title: "観戦予想アプリ",
    subtitle: "日本 vs ブラジル",
    category: "basketball",
    period: "2026.06",
    status: "完成",
    emoji: "⚽️",
    summary:
      "試合をみんなで観るときに、スコアや得点者を予想して盛り上がるための1ページアプリ。",
    body: [
      "観戦パーティー用に一晩で作った小品です。日本とブラジルのチームカラーをそのままテーマカラーにして、ライト／ダークどちらでも読めるように配色を組みました。",
      "外部ライブラリなしの単一HTMLなので、URLを送るだけで全員の手元で動きます。",
    ],
    tech: ["HTML", "CSS (ダークモード対応)", "Vanilla JavaScript"],
    links: [],
    highlights: ["単一HTMLで完結・共有が簡単", "prefers-color-scheme でのダーク対応"],
  },

  /* ---------- 動画・クリエイティブ ---------- */
  {
    id: "reelmaker",
    title: "ReelMaker",
    subtitle: "写真 → リール動画 自動生成",
    category: "video",
    period: "2026.05",
    status: "稼働中",
    featured: true,
    emoji: "🎬",
    summary:
      "写真フォルダを指定するだけで、Ken Burns・クロスフェード・ビート同期つきの縦型リール動画を書き出すローカルWebアプリ。",
    body: [
      "ブラウザで写真を並べ替え、アスペクト比（9:16 / 1:1 / 16:9）と字幕とBGMを決めると、サーバー側でMP4を生成します。書き出しはバックグラウンドで走り、進捗バーで状況が見えます。",
      "librosaでBGMのビートを検出して、その拍に合わせて写真を切り替えるビートシンクを実装しました。EXIFから撮影日を読んで日付テロップを重ねることもできます。",
      "字幕はキーボード入力のほか、Web Speech APIの音声入力でも打ち込めます。",
    ],
    tech: ["Python", "FastAPI", "uvicorn", "moviepy", "librosa", "Pillow / piexif", "Tailwind", "SortableJS"],
    links: [],
    highlights: ["librosaによるビート同期カット", "Ken Burns＋クロスフェード", "EXIF撮影日の自動テロップ", "音声入力で字幕を作成"],
  },
  {
    id: "journal-reel",
    title: "journal-reel",
    subtitle: "手書きジャーナル → タイピング動画",
    category: "video",
    period: "2026.08",
    status: "稼働中",
    emoji: "✍️",
    summary:
      "手書きのジャーナル写真から、Notionのページに1文字ずつ打ち込まれていく10秒の縦型動画を生成するツール。Vlogリールの末尾に差し込んでいます。",
    body: [
      "Notion AIに相談したら「1文字ずつのタイピング動画はNotionではできないのでCapCutかCanvaで」と言われた部分を、ローカルで完全自動化しました。",
      "Pillowで1フレームずつ描画してffmpegにrawvideoでパイプし、MP4にします。白背景・広い余白・ヒラギノ角ゴでNotionの見た目を再現しました。",
      "こだわりはフェードを一切使わないこと。日付もタイトルも本文も英訳も、すべてタイピングと区切り線のドローイングだけで表現します。最後はカーソルが点滅したまま静止します。",
      "生成したMP4は Notion の File Upload API を直接叩いて、その日のページに自動で添付されます。",
    ],
    tech: ["Python", "Pillow", "ffmpeg", "Notion File Upload API"],
    links: [],
    highlights: ["フェードゼロ、全部タイピングで見せる設計", "9:16 / 10秒 / タイムラインはJSONで調整", "生成からNotionページへの添付まで1コマンド"],
  },
  {
    id: "nba-reel",
    title: "nba-reel",
    subtitle: "Remotion製リール動画テンプレート",
    category: "video",
    period: "2026.09 —",
    status: "運用中",
    emoji: "📱",
    summary:
      "台本のJSONを書くだけで、Instagram用の縦型リール（1080×1920）が1本書き上がる動画生成基盤。Reactで動画を組んでいます。",
    body: [
      "Remotionを使い、動画をReactコンポーネントとして記述しています。シーンの型・テーマカラー・図解パーツを部品化してあるので、新しい戦術解説を作るときは台本を差し替えるだけで済みます。",
      "全リール共通の署名として、左下にオレンジのプログレスバーを入れています。カルーセル（フィード投稿）用のコンポーネントも同じテーマを共有しています。",
    ],
    tech: ["Remotion", "React 19", "TypeScript", "@remotion/google-fonts"],
    links: [],
    highlights: ["台本JSONだけで1本完成", "シーン型・図解を部品化", "リールとカルーセルでテーマ共通化"],
  },
  {
    id: "instagram",
    title: "@nbatrainerfromjapan",
    subtitle: "Instagramアカウント運用",
    category: "video",
    period: "2026.09 —",
    status: "運用中",
    emoji: "🧡",
    summary:
      "理学療法とバスケットボールをつなぐ発信アカウント。ブランドカラー・投稿フォーマット・制作パイプラインまで自分で設計して運用しています。",
    body: [
      "コートネイビー #12233A とコートオレンジ #F2622E を基調にしたブランドを定義し、フィードは10ページ構成（表紙・導入・本編6枚・まとめ・保存導線）、リールは3秒フック＋20〜45秒という型に統一しました。",
      "運用は二層構造にしています。週1〜2本の資産投稿（PTの知識とバスケ戦術を結ぶ解説）と、毎日のday◯日記シリーズです。",
      "制作はCanvaのテンプレート複製とRemotion、原稿管理はNotionという分担で、1本あたりの制作時間を短く保っています。",
    ],
    tech: ["Canva", "Remotion", "Notion", "ブランドガイドライン設計"],
    links: [{ label: "Instagram", href: "https://www.instagram.com/nbatrainerfromjapan/" }],
    highlights: ["5色のブランドカラーを定義", "フィード10枚の固定フォーマット", "資産投稿＋日記の二層運用"],
  },

  /* ---------- 自動化 ---------- */
  {
    id: "kakeibo-mail",
    title: "家計簿 自動登録（メール）",
    subtitle: "クレカ利用通知 → Notion",
    category: "automation",
    period: "2026.07 —",
    status: "毎日稼働中",
    featured: true,
    emoji: "💳",
    summary:
      "カード会社からの利用通知メールを毎日自動で読み取り、Notionの支出データベースにページを作る仕組み。1年近く手を触れずに動き続けています。",
    body: [
      "IMAPでGmailを取得し、行ラベル方式のパーサーで店名・金額・日付を抜き出してNotionに登録します。店名のキーワードからカテゴリーとページ絵文字まで自動で決まります。",
      "楽天カードの「速報版」は金額しか届かないので、いったん仮登録しておき、後日届く確定メールで同じページの店名とカテゴリーを上書きする二段構えにしました。",
      "実運用でぶつかった問題がそのまま設計になっています。NotionのDB自動化がAPI作成直後の日付を上書きするので10秒待って再設定する、launchdはDownloads配下を読めないので実行ファイルをホーム直下へ置く、macOSのバックグラウンド管理に拒否されて起動しなくなる——こうした落とし穴を1つずつ潰しました。",
    ],
    tech: ["Python", "IMAP", "Notion API", "launchd", "状態管理JSON"],
    links: [],
    highlights: ["毎日21:30に自動実行、取りこぼしは7日遡って回収", "速報メール→確定メールの二段更新", "同額・同日・同店の二重登録を防止", "カテゴリーと絵文字の自動付与"],
  },
  {
    id: "kakeibo-receipt",
    title: "家計簿 自動登録（レシート）",
    subtitle: "写真1枚 → Notion",
    category: "automation",
    period: "2026.04",
    status: "稼働中",
    emoji: "🧾",
    summary:
      "レシートを撮るだけでNotionの家計簿に支出が入るショートカット。OCRはmacOS内蔵のVision frameworkを使うので、APIキーも費用も要りません。",
    body: [
      "iPhoneやMacのショートカットから写真を渡すと、HEICをJPEGに変換してVision OCRにかけ、店名・金額・日付を抽出してNotionにページを作ります。",
      "カテゴリーはキーワードで判定し、「その他」になったときだけ手元で選ばせます。ショートカット経由のときは確認をスキップして通知だけ返します。",
      "メール通知が来ないPayPay残高払いは、この仕組みで補完しています。",
    ],
    tech: ["Python", "macOS Vision Framework (pyobjc)", "Notion API", "Apple Shortcuts", "sips"],
    links: [],
    highlights: ["OCRは端末内で完結、APIコストゼロ", "HEIC→JPEG自動変換", "ショートカット3ステップで完了"],
  },
  {
    id: "naegi-order",
    title: "苗木注文書管理システム",
    subtitle: "実家の手伝いから生まれた業務アプリ",
    category: "automation",
    period: "2026.09",
    status: "運用中",
    featured: true,
    emoji: "🌱",
    summary:
      "手書きの注文書を撮影するとAIが読み取り、商品マスタと照合して集計まで行う業務アプリ。実家の手伝いで紙の注文書を捌いていたのが出発点で、自分以外の人が毎日使う道具を作ったはじめての経験になりました。",
    body: [
      "紙の注文書の写真をアップロードすると、Gemini が品名・数量・注文者を読み取ります。表記ゆれは商品マスタとのあいまい照合で吸収し、確認しやすい形に整えてから集計します。",
      "複数枚を同時に処理できるよう並列実行にし、HEICのまま撮った写真もそのまま受け付けます。日次の稼働監視スクリプトも付けました。",
      "使う人が業務の途中で迷わないよう、サイドバーを消して画面を一本道にし、和やかな緑基調のUIにしています。パソコンに慣れていない人でも、写真を選んで待つだけで終わります。",
    ],
    tech: ["Python", "Streamlit", "Google Gemini API", "pandas", "Pillow / pillow-heif"],
    links: [{ label: "GitHub", href: "https://github.com/celties/naegi-order" }],
    highlights: ["手書き注文書をAIで読み取り", "商品マスタとのあいまい照合で表記ゆれを吸収", "複数枚の並列処理とHEIC対応", "実家の現場でそのまま使われている"],
  },
  {
    id: "task-manager",
    title: "タスク管理 自動化",
    subtitle: "繰り返しタスクとリマインド",
    category: "automation",
    period: "2026.05",
    status: "稼働中",
    emoji: "🔁",
    summary:
      "Notionで管理しているタスクを毎日点検し、繰り返しタスクの次回分を自動生成して、期限が近いものをmacOSの通知で知らせるスクリプト。",
    body: [
      "完了済みの繰り返しタスクを見つけて次の回を作り直します。毎日・毎週・毎月の間隔は設定ファイルで指定できます。",
      "期限切れ・今日・明日のタスクはmacOSの通知センターに流すので、Notionを開いていなくても気づけます。",
    ],
    tech: ["Python", "Notion API", "python-dateutil", "macOS 通知"],
    links: [],
    highlights: ["繰り返しタスクの自動生成", "期限リマインダーをOS通知で"],
  },

  /* ---------- 学び・キャリア ---------- */
  {
    id: "pt-atlas",
    title: "PT Atlas",
    subtitle: "3D人体解剖アトラス",
    category: "study",
    period: "2026.06",
    status: "開発中",
    featured: true,
    emoji: "🦴",
    summary:
      "骨・筋・神経のレイヤーを切り替えながら3Dの人体を回して学ぶ、理学療法学生のための解剖アトラス。",
    body: [
      "ブラウザ上の3Dモデルをドラッグで回し、見たい構造のレイヤーだけを表示して確認できます。部位を選ぶと、起始・停止や支配神経といった情報がサイドパネルに出ます。",
      "検索モーダルから名称で直接飛べるほか、AIに質問して解説を引き出すリサーチパネルも組み込みました。",
      "授業で覚えることを、教科書の図より自分の手で動かして確かめたかったのが動機です。",
    ],
    tech: ["Next.js 14", "React Three Fiber", "three.js", "TypeScript", "Zustand", "Framer Motion", "Gemini API", "Tailwind"],
    links: [],
    highlights: ["骨・筋・神経のレイヤー切り替え", "3Dモデルを回して部位を選択", "名称検索とAIリサーチパネル"],
  },
  {
    id: "shukatsu",
    title: "就活 企業研究システム",
    subtitle: "Notion + 週次自動チェック",
    category: "study",
    period: "2026.07 —",
    status: "稼働中",
    emoji: "🔍",
    summary:
      "志望企業をNotionのデータベースで管理し、毎週月曜の朝に新着募集を自動で巡回して追記する仕組み。14社を継続ウォッチしています。",
    body: [
      "企業ページは「基本情報 → 企業理念 → 特色・強み → 採用・選考情報 → ニュース・IR → 自分用整理欄 → 新着ログ」という固定テンプレートにしました。",
      "設計の軸は「検索・整理・監視はAI、本質理解は自分」。自分用整理欄だけはAIに書かせず、自分の言葉で埋める場所として空けてあります。",
      "スポーツ用品メーカー、身体×AIのスタートアップ、PT/OT向け人材サービスの3層で14社を追っています。この巡回から「日系大手の夏プログラムは締切済みで秋冬が本命」「外資系とスタートアップは新卒一括採用がほぼなく通年ウォッチが必須」といった判断材料が出てきました。",
    ],
    tech: ["Notion API", "スケジュール自動実行", "Web調査エージェント"],
    links: [],
    highlights: ["毎週月曜8時に自動巡回", "14社を固定テンプレートで比較可能に", "AIと自分の役割分担を明示した設計"],
  },
];

const TIMELINE = [
  { date: "2024.04", title: "東京都立大学 入学", note: "理学療法を学び始める" },
  { date: "2026.04", title: "ものづくりを始める", note: "レシート写真から家計簿を自動登録する仕組みが1本目" },
  { date: "2026.05", title: "習慣と動画に広げる", note: "早起きトラッカーのMac版、ReelMaker、タスク自動化" },
  { date: "2026.06", title: "つくる月", note: "セルティックス図鑑・PT Atlas・筋トレ道場・バスケ作戦版を相次いで公開" },
  { date: "2026.07", title: "自動で回る仕組みへ", note: "家計簿のメール版と就活企業研究の週次巡回が常時稼働に" },
  { date: "2026.08", title: "記録を作品にする", note: "journal-reel、早起きトラッカーのWeb版公開、スタッツアプリ" },
  { date: "2026.09", title: "自分の外へ", note: "Instagram運用を開始し、実家の手伝いから生まれた業務アプリを現場へ" },
];

const SKILLS = [
  { group: "フロントエンド", items: ["Next.js / React", "TypeScript", "Tailwind CSS", "React Native (Expo)", "Three.js / R3F", "Remotion", "PWA"] },
  { group: "バックエンド・スクリプト", items: ["Python", "FastAPI", "Streamlit", "Node.js", "Firebase / Firestore", "IMAP", "launchd"] },
  { group: "AI・データ", items: ["Claude API (Vision)", "Gemini API", "macOS Vision OCR", "librosa", "pandas", "Pillow / ffmpeg"] },
  { group: "つなぐ・届ける", items: ["Notion API", "Vercel", "GitHub", "Apple Shortcuts", "Canva", "ブランド設計"] },
];

/* =========================================================
   プロフィール詳細（生い立ち・趣味・特技・アルバイト・志望先）
   ※ 下の「要確認」印のところは本人に聞いて埋める欄です。
   ========================================================= */

const ROOTS = [
  { year: "2006", title: "生まれる", note: "" },
  { year: "2024.04", title: "東京都立大学 健康福祉学部 理学療法学科 入学", note: "身体のしくみを学び始める" },
  { year: "2026.04", title: "3回生 / つくることを始める", note: "困りごとを自分でツールにするようになる" },
  { year: "2028.03", title: "卒業予定（28卒）", note: "理学療法士 国家資格の取得を目指す" },
];

const INTERESTS = [
  { emoji: "🏀", label: "バスケットボール", note: "NBAを追いかけて10年来。ボストン・セルティックス一筋で、図鑑アプリを作るほど。" },
  { emoji: "🏋️", label: "筋トレ", note: "ジムに通って記録を取る。伸びが数字で見えるのが楽しい。" },
  { emoji: "🌅", label: "早起き", note: "日の出前に起きる生活を習慣に。そのためのトラッカーを自作した。" },
  { emoji: "🛠", label: "個人開発", note: "「面倒だな」と思った瞬間がだいたい作りはじめる合図。" },
  { emoji: "🎬", label: "動画づくり", note: "リール制作とInstagramでの発信。設計から編集まで自分で。" },
  { emoji: "📓", label: "ジャーナリング", note: "手書きで書いてNotionに残す。書いた日記は動画にもしている。" },
];

const STRENGTHS = [
  { title: "困りごとを道具にする", note: "不便を我慢せず、その日のうちに動くものを作って回し始める。このサイトに並ぶ17本はほぼ全部その産物。" },
  { title: "続く仕組みをつくる", note: "気合いではなく仕組みで続ける。毎日決まった時間に走る自動化を、1年近く止めずに運用している。" },
  { title: "身体とデータの両方を見る", note: "理学療法で学ぶ身体の知識と、記録・可視化の技術をつなげて考えられる。" },
  { title: "ひとりで最後まで運ぶ", note: "企画・設計・実装・デザイン・公開・運用まで、ひと通り自分で通せる。" },
];

const EXPERIENCE = [
  {
    role: "苗木注文書管理システムの開発",
    org: "実家の手伝い（園芸業）",
    period: "2026.09",
    note: "実家の手伝いで紙の注文書を扱っていたところから、手書きの注文書をAIで読み取って集計する業務アプリを自分で作り、現場に入れた。要件を決めるところから運用まで、ひと通り自分で担当している。",
  },
  {
    role: "Instagram アカウント運用",
    org: "@nbatrainerfromjapan",
    period: "2026.09 —",
    note: "理学療法 × バスケットボールの発信。ブランド設計・投稿フォーマットの型づくり・制作パイプラインの構築まで自分で。",
  },
];

const CAREER = {
  goal: "NBAのアスレティックトレーナー",
  axis: "身体 × データ / AI",
  lead:
    "理学療法士の国家資格を取ったうえで、身体のことをデータで扱える場所に行きたいと考えています。具体的な企業名はここには書いていませんが、大きく3つの方向で継続的に調べています。",
  groups: [
    {
      label: "スポーツ用品メーカー",
      note: "身体の知識をプロダクトに還元する方向。日系は秋冬インターン、外資は通年でのウォッチが必要だと分かってきた。",
    },
    {
      label: "身体 × AI のスタートアップ",
      note: "動作解析やリハビリ支援など、身体をデータで扱う領域。新卒一括採用が少なく、長期インターンとカジュアル面談が実質のルートになる。",
    },
    {
      label: "PT / OT 向けの人材サービス",
      note: "医療職のキャリアを支える側から業界全体を見る方向。",
    },
  ],
};
