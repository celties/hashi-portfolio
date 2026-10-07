/* =========================================================
   data.js から静的ページを書き出す（依存パッケージなし）

     node build.mjs

   - works/<id>/index.html … 作品ごとのページ（検索・SNSシェアの着地先）
   - works/index.html      … 作品一覧ページ
   - index.html            … JSが動かない環境（検索エンジン・SNSのクローラー）
                             向けに主要な中身を埋め込む（<!--pre:xxx--> の間）
   - sitemap.xml / robots.txt

   data.js を直したら、push の前にこれを1回走らせる。
   シェア画像（og/*.png）は python3 tools/og.py で作り直す。
   ========================================================= */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import { loadData } from "./tools/dump-data.mjs";

const SITE = "https://celties.github.io/hashi-portfolio/";
const D = loadData(new URL("./tools/dump-data.mjs", import.meta.url));
const { PROFILE, CATEGORIES, PROJECTS, TIMELINE, SKILLS } = D;

const indexSrc = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const V = (indexSrc.match(/style\.css\?v=(\d+)/) || [, "1"])[1];
const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const catLabel = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || "";
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const jsonld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

const PERSON = {
  "@type": "Person",
  "@id": `${SITE}#person`,
  name: PROFILE.nameJa.replace(/\s/g, ""),
  alternateName: [PROFILE.nameEn, PROFILE.handle],
  url: SITE,
  image: `${SITE}og/default.png`,
  jobTitle: "理学療法学生",
  affiliation: { "@type": "CollegeOrUniversity", name: "東京都立大学" },
  knowsAbout: ["理学療法", "バスケットボール", "個人開発", "業務自動化", "動画制作"],
  sameAs: PROFILE.contacts.filter((c) => c.href.startsWith("http")).map((c) => c.href),
};

/* ---------- 共通パーツ ---------- */
function head({ title, desc, path, image, ld, rel }) {
  const url = SITE + path;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${url}" />
<meta name="theme-color" content="#E8E8E8" />
<meta property="og:site_name" content="橋本勇太 / Hashi — Works" />
<meta property="og:locale" content="ja_JP" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="${rel}apple-touch-icon.png" />
<link rel="apple-touch-icon" href="${rel}apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="${rel}style.css?v=${V}" />
${ld.map(jsonld).join("\n")}
</head>
<body class="page">
<header class="nav solid">
  <div class="nav-in">
    <a class="brand" href="${rel}">
      <span class="brand-mark">H</span>
      <span class="brand-txt">Hashi<span class="dot">.</span></span>
    </a>
    <nav class="nav-links page-links">
      <a href="${rel}#about">Profile</a>
      <a href="${rel}works/">Works</a>
      <a href="${rel}#contact">Contact</a>
    </nav>
  </div>
</header>
`;
}

function foot(rel) {
  return `
<footer class="foot">
  <div class="wrap foot-in">
    <a class="foot-mark" href="${rel}">H<span class="dot">.</span></a>
    <p>&copy; 2026 Yuta Hashimoto</p>
  </div>
</footer>
<script src="${rel}share.js?v=${V}" defer></script>
</body>
</html>
`;
}

function shareBar(url, text) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return `<div class="share" data-url="${esc(url)}" data-text="${esc(text)}">
  <p class="share-k">SHARE</p>
  <div class="share-row">
    <a class="sh" href="https://x.com/intent/post?text=${t}&amp;url=${u}" target="_blank" rel="noopener">X でポスト</a>
    <a class="sh" href="https://social-plugins.line.me/lineit/share?url=${u}" target="_blank" rel="noopener">LINE で送る</a>
    <a class="sh" href="https://b.hatena.ne.jp/entry/s/${esc(url.replace(/^https:\/\//, ""))}" target="_blank" rel="noopener">はてブ</a>
    <button class="sh" type="button" data-copy>リンクをコピー</button>
    <button class="sh sh-native" type="button" data-native hidden>その他</button>
  </div>
</div>`;
}

function authorBox(rel) {
  const ig = PROFILE.contacts.find((c) => c.label === "Instagram");
  return `<aside class="author">
  <div class="author-mark" aria-hidden="true">H</div>
  <div class="author-body">
    <p class="author-k">つくった人</p>
    <p class="author-name">${esc(PROFILE.nameJa)} <span>${esc(PROFILE.nameEn)}</span></p>
    <p class="author-txt">東京都立大学で理学療法を学ぶ学生です。目標はNBAのアスレティックトレーナー。自分の生活で困ったことを、そのつど道具にしています。</p>
    <div class="author-cta">
      <a class="btn btn-primary" href="${rel}#about">プロフィールを見る</a>
      ${ig ? `<a class="btn btn-ghost" href="${esc(ig.href)}" target="_blank" rel="noopener">Instagram ${esc(ig.value)}</a>` : ""}
    </div>
  </div>
</aside>`;
}

/* app.js の cardHTML と同じ見た目。リンク先だけ相対パスで切り替える */
function cardHTML(p, rel) {
  const tags = p.tech.slice(0, 4).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  const rest = p.tech.length > 4 ? `<span class="tag more">+${p.tech.length - 4}</span>` : "";
  return `<a class="card${p.featured ? " feat" : ""}" href="${rel}works/${esc(p.id)}/" data-id="${esc(p.id)}">
        <span class="card-top">
          <span class="card-emoji" aria-hidden="true">${p.emoji}</span>
          <span class="card-h">
            <span class="card-title">${esc(p.title)}</span>
            <span class="card-sub">${esc(p.subtitle)}</span>
          </span>
        </span>
        <span class="card-meta">
          <span class="badge">${esc(p.period)}</span>
          <span class="badge">${esc(catLabel(p.category))}</span>
        </span>
        <span class="card-sum">${esc(p.summary)}</span>
        <span class="card-tech">${tags}${rest}</span>
        <span class="card-more">詳しく見る <span class="arw">→</span></span>
      </a>`;
}

/* ---------- 作品ページ ---------- */
function workPage(p, i) {
  const rel = "../../";
  const path = `works/${p.id}/`;
  const url = SITE + path;
  const title = `${p.title}｜${p.subtitle} — 橋本勇太のつくったもの`;
  const desc = clip(p.summary, 120);
  const cat = catLabel(p.category);
  const related = PROJECTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const others = related.length < 3
    ? PROJECTS.filter((x) => x.category !== p.category && x.featured).slice(0, 3 - related.length)
    : [];
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: p.title,
      alternativeHeadline: p.subtitle,
      description: p.summary,
      url,
      image: `${SITE}og/${p.id}.png`,
      genre: cat,
      keywords: p.tech.join(", "),
      inLanguage: "ja",
      author: PERSON,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "トップ", item: SITE },
        { "@type": "ListItem", position: 2, name: "つくったもの", item: `${SITE}works/` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ],
    },
  ];

  return (
    head({ title, desc, path, image: `og/${p.id}.png`, ld, rel }) +
    `<main class="wp">
  <article class="wrap wp-in">
    <nav class="crumbs" aria-label="パンくず"><a href="${rel}">トップ</a><span>/</span><a href="${rel}works/">つくったもの</a><span>/</span><b>${esc(p.title)}</b></nav>

    <header class="m-top wp-top">
      <span class="m-emoji" aria-hidden="true">${p.emoji}</span>
      <div>
        <h1 class="m-title">${esc(p.title)}</h1>
        <p class="m-sub">${esc(p.subtitle)}</p>
      </div>
    </header>
    <div class="m-meta">
      <span class="badge">${esc(p.period)}</span>
      <a class="badge" href="${rel}works/#${esc(p.category)}">${esc(cat)}</a>
    </div>

    <p class="m-sum">${esc(p.summary)}</p>

    <h2 class="m-h">なぜ作ったか・どう作ったか</h2>
    <div class="m-body">${p.body.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
    ${
      p.highlights && p.highlights.length
        ? `<h2 class="m-h">HIGHLIGHTS</h2><ul class="m-list">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
        : ""
    }
    <h2 class="m-h">TECH STACK</h2>
    <div class="m-tech">${p.tech.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    ${
      p.links && p.links.length
        ? `<div class="m-links">${p.links
            .map((l) => `<a class="m-link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} <span class="arw">↗</span></a>`)
            .join("")}</div>`
        : ""
    }

    ${shareBar(url, `${p.title}（${p.subtitle}）｜理学療法学生がつくったもの`)}

    ${authorBox(rel)}

    <h2 class="wp-h">${related.length ? `ほかの「${esc(cat)}」の作品` : "ほかの作品"}</h2>
    <div class="grid-works wp-rel">${[...related, ...others].map((x) => cardHTML(x, rel)).join("")}</div>

    <nav class="pn" aria-label="前後の作品">
      <a class="pn-a" href="${rel}works/${esc(prev.id)}/"><span>← 前の作品</span><b>${prev.emoji} ${esc(prev.title)}</b></a>
      <a class="pn-a pn-next" href="${rel}works/${esc(next.id)}/"><span>次の作品 →</span><b>${next.emoji} ${esc(next.title)}</b></a>
    </nav>
    <p class="wp-all"><a class="btn btn-ghost" href="${rel}works/">つくったもの ${PROJECTS.length} 本をすべて見る</a></p>
  </article>
</main>` +
    foot(rel)
  );
}

/* ---------- 作品一覧ページ ---------- */
function worksIndex() {
  const rel = "../";
  const path = "works/";
  const title = `つくったもの ${PROJECTS.length} 本 — 理学療法学生のアプリ・自動化・動画ツール｜橋本勇太`;
  const desc = `理学療法学生・橋本勇太がつくってきた${PROJECTS.length}の作品の一覧。早起きトラッカー、筋トレ記録、バスケの作戦ボード、リール動画の自動生成、家計簿の自動登録など。`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description: desc,
      url: SITE + path,
      author: PERSON,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: PROJECTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}works/${p.id}/`, name: p.title })),
      },
    },
  ];
  const groups = CATEGORIES.filter((c) => c.id !== "all")
    .map((c) => {
      const list = PROJECTS.filter((p) => p.category === c.id);
      if (!list.length) return "";
      return `<section class="wi-group" id="${esc(c.id)}">
      <h2 class="wp-h">${esc(c.label)} <small>${list.length}</small></h2>
      <div class="grid-works">${list.map((p) => cardHTML(p, rel)).join("")}</div>
    </section>`;
    })
    .join("\n");
  return (
    head({ title, desc, path, image: "og/default.png", ld, rel }) +
    `<main class="wp">
  <div class="wrap wp-in wp-wide">
    <nav class="crumbs" aria-label="パンくず"><a href="${rel}">トップ</a><span>/</span><b>つくったもの</b></nav>
    <header class="sec-head">
      <p class="sec-num">Works</p>
      <h1 class="sec-title">つくったもの、ぜんぶ（${PROJECTS.length}本）</h1>
      <p class="sec-lead">自分の生活で困ったことから始まったものが大半です。それぞれのページに、なぜ作ったのか・どう作ったのかを書いています。</p>
    </header>
    <nav class="wi-jump">${CATEGORIES.filter((c) => c.id !== "all")
      .map((c) => `<a class="chip" href="#${esc(c.id)}">${esc(c.label)}</a>`)
      .join("")}</nav>
    ${groups}
    ${shareBar(SITE + path, `理学療法学生がつくったアプリ・自動化・動画ツール ${PROJECTS.length}本`)}
    ${authorBox(rel)}
  </div>
</main>` +
    foot(rel)
  );
}

/* ---------- index.html への埋め込み ---------- */
function prerender(src) {
  const blocks = {
    lead: esc(PROFILE.tagline),
    about: PROFILE.intro.map((p) => `<p>${esc(p)}</p>`).join(""),
    grid: PROJECTS.map((p) => cardHTML(p, "")).join(""),
    tl: TIMELINE.map(
      (t) => `<li><p class="tl-date">${esc(t.date)}</p><h3 class="tl-title">${esc(t.title)}</h3><p class="tl-note">${esc(t.note)}</p></li>`
    ).join(""),
    skills: SKILLS.map((g) => `<div class="sk"><h3>${esc(g.group)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join(""),
    contacts: PROFILE.contacts
      .map(
        (c) =>
          `<a class="ct" href="${esc(c.href)}"${c.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}><div class="ct-body"><p class="ct-label">${esc(
            c.label
          )}</p><p class="ct-val">${esc(c.value)}</p></div><span class="arw">→</span></a>`
      )
      .join(""),
    ld: jsonld({
      "@context": "https://schema.org",
      "@graph": [
        { ...PERSON, description: PROFILE.intro.join("") },
        { "@type": "WebSite", "@id": `${SITE}#website`, name: "橋本勇太 / Hashi — Works", url: SITE, inLanguage: "ja", author: { "@id": `${SITE}#person` } },
        {
          "@type": "ItemList",
          name: "つくったもの",
          itemListElement: PROJECTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}works/${p.id}/`, name: p.title })),
        },
      ],
    }),
  };
  let out = src;
  for (const [k, html] of Object.entries(blocks)) {
    const re = new RegExp(`(<!--pre:${k}-->)[\\s\\S]*?(<!--/pre:${k}-->)`);
    if (!re.test(out)) throw new Error(`index.html に <!--pre:${k}--> の印がありません`);
    out = out.replace(re, (_, a, b) => `${a}${html}${b}`);
  }
  return out;
}

/* ---------- 書き出し ---------- */
const worksDir = new URL("./works/", import.meta.url);
if (existsSync(worksDir)) {
  // data.js から消えた作品のページを残さない
  const ids = new Set(PROJECTS.map((p) => p.id));
  for (const d of readdirSync(worksDir, { withFileTypes: true })) {
    if (d.isDirectory() && !ids.has(d.name)) rmSync(new URL(`./${d.name}/`, worksDir), { recursive: true });
  }
}
mkdirSync(worksDir, { recursive: true });
writeFileSync(new URL("./index.html", worksDir), worksIndex());
PROJECTS.forEach((p, i) => {
  const dir = new URL(`./${p.id}/`, worksDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL("./index.html", dir), workPage(p, i));
});

writeFileSync(new URL("./index.html", import.meta.url), prerender(indexSrc));

const urls = ["", "works/", ...PROJECTS.map((p) => `works/${p.id}/`)];
writeFileSync(
  new URL("./sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join("\n")}
</urlset>
`
);
writeFileSync(new URL("./robots.txt", import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);

const missing = PROJECTS.filter((p) => !existsSync(new URL(`./og/${p.id}.png`, import.meta.url))).map((p) => p.id);
console.log(`作品ページ ${PROJECTS.length} 本・一覧・sitemap.xml・robots.txt を書き出しました`);
if (missing.length) console.log(`⚠ シェア画像がない作品: ${missing.join(", ")} → python3 tools/og.py を実行してください`);
