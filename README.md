# 橋本勇太 / Hashi — Works

理学療法を学びながらつくってきたアプリ・自動化・動画ツールをまとめた個人サイトです。

**公開先:** https://celties.github.io/hashi-portfolio/

## 中身

| セクション | 内容 |
|---|---|
| Works | 17作品。カテゴリー（習慣・記録 / バスケットボール / 動画 / 自動化 / 学び）で絞り込み、カードから詳細モーダルを開けます |
| About | プロフィール、ルーツ年表、ドット絵のキャラクター |
| Interests | 好きなこと・自分の強み |
| Study | 大学で自分から起こした4つの探究と、いま進めている実験 |
| Career | これまでの仕事・活動と、考えている進路（志望14社） |
| Timeline | 2026年4月に1本目を書いてからの半年の記録 |
| Skills | 使ってきた技術 |
| Contact | 連絡先 |

## 構成

```
index.html   マークアップ
style.css    スタイル（ダークネイビー #12233A × オレンジ #F2622E）
data.js      プロフィール・作品・ルーツ・趣味・強み・経験・進路・年表・スキルのデータ
app.js       描画・絞り込み・モーダル・スクロール演出
pixel.js     ドット絵キャラクター（文字列マップからSVGを生成）
AGENTS.md    引き継ぎドキュメント（Codex が自動で読む）
CLAUDE.md    AGENTS.md を読み込むだけの1行（Claude Code 用）
```

ビルド不要の静的サイトです。依存パッケージはありません。

## ローカルで見る

```bash
python3 -m http.server 8080
```

ブラウザで http://localhost:8080 を開きます。`open index.html` でも動きます。

## 作品を追加する

`data.js` の `PROJECTS` 配列の先頭にオブジェクトを1つ足すだけで、カード・件数・絞り込み・モーダルすべてに反映されます。

```js
{
  id: "new-project",
  title: "作品名",
  subtitle: "ひとことで言うと",
  category: "habit",      // habit | basketball | video | automation | study
  period: "2026.10",
  featured: false,        // true にすると2カラム幅の大きいカードに
  emoji: "✨",
  summary: "カードに出る3行の要約。",
  body: ["モーダルに出る本文。", "段落ごとに配列の要素にします。"],
  tech: ["Next.js", "TypeScript"],
  links: [{ label: "公開サイト", href: "https://example.com" }],
  highlights: ["特徴を箇条書きで"]
}
```

## ドット絵キャラクターを直す

`pixel.js` の `BODY` は 18×26 の文字列マップです。1文字が1ドットに対応していて、
色は同ファイルの `PAL` で決まります（`H`=髪 / `O`=オレンジ / `S`=肌 / `N`=ネイビー /
`W`=白 / `G`=ソール / `K`=目・口）。行の長さを 18 に保ったまま文字を置き換えれば、
見た目だけを変えられます。ボールは `BALL`（7×7）です。
