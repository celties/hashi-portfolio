/* =========================================================
   ピクセルキャラクター "ハシ"
   これまでの情報から像を組みました：
     ヘッドバンド … 早起き（日の出前に起きる人）
     ネイビー×オレンジ … @nbatrainerfromjapan のブランドカラー
     胸の TMU … 東京都立大学
     バスケットボール … セルティックスとNBAトレーナーという目標
     頭上の BELIEVE の貼り紙 … テッド・ラッソ
   ドット絵は文字列マップなので、1文字書き換えれば見た目を直せます。
   ========================================================= */
(function () {
  "use strict";

  const PAL = {
    ".": null,
    H: "#161E2B", // 髪
    O: "#F2622E", // オレンジ（ヘッドバンド・ライン）
    S: "#F3CBA4", // 肌
    K: "#131A25", // 目・口
    N: "#12233A", // ネイビーのウェア
    W: "#F4F6F9", // 白（ショーツ・シューズ）
    G: "#5C7A9E", // ソール・影
    C: "#C8A96A", // ゴールドの差し色
    B: "#E2702F", // ボール
    D: "#8A3B14", // ボールの線
  };

  /* 立ち姿：33 × 48 */
  const BODY = [
    ".................................",
    ".................................",
    ".............HHHHHHH.............",
    "...........HHHHHHHHHHH...........",
    "..........HHHHHHHHHHHHH..........",
    "........HHHHHHHHHHHHHHHHH........",
    "........HHHHHHHHHHHHHHHHH........",
    "........HHHHHHHHHHHHHHHHH........",
    "........OOOOOOOOOOOOOOOOO........",
    "........OOOOOOOOOOOOOOOOO........",
    "........HSSSSSSSSSSSSSSSH........",
    "........HSSSSSSSSSSSSSSSH........",
    "........HSSSKKSSSSSKKSSSH........",
    "........HSSSKKSSSSSKKSSSH........",
    "........HSSSKKSSSSSKKSSSH........",
    "........HSSSSSSSSSSSSSSSH........",
    "........SSSSSSSSSSSSSSSSS........",
    "........SSSSSSSKKKSSSSSSS........",
    "........SSSSSSSSSSSSSSSSS........",
    ".............SSSSSSS.............",
    "............NNNNNNNNN............",
    ".......NNNNNNNNNNNNNNNNNNN.......",
    ".....NNNNNNNNNNNNNNNNNNNNNNN.....",
    "..SSSNNNNNNNNNNNNNNNNNNNNNNNSSS..",
    "..SSSNNOOOOONONNNNNONONNNONNSSS..",
    "..SSSNNNNONNNOONNNOONONNNONNSSS..",
    "..SSSNNNNONNNONONONONONNNONNSSS..",
    "..SSSNNNNONNNONNONNONONNNONNSSS..",
    "..SSSNNNNONNNONNNNNONONNNONNSSS..",
    "..SSSNNNNONNNONNNNNONONNNONNSSS..",
    "..SSSNNNNONNNONNNNNONNOOONNNSSS..",
    "..SSSNNNNNNNNNNNNNNNNNNNNNNNSSS..",
    "..SSSNNNNNNNNNNNNNNNNNNNNNNNSSS..",
    ".....NNNNNNNNNNNNNNNNNNNNNNN.....",
    ".......WWWWWWWWWWWWWWWWWWW.......",
    ".......WWWWWWWWWWWWWWWWWWW.......",
    ".......WWWWWWWWWWWWWWWWWWW.......",
    ".......WWWWWWWWWWWWWWWWWWW.......",
    ".........SSSSSS...SSSSSS.........",
    ".........SSSSSS...SSSSSS.........",
    ".........SSSSSS...SSSSSS.........",
    ".........SSSSSS...SSSSSS.........",
    ".........SSSSSS...SSSSSS.........",
    ".........SSSSSS...SSSSSS.........",
    ".........SSSSSS...SSSSSS.........",
    ".......WWWWWWWW...WWWWWWWW.......",
    ".......WWWWWWWW...WWWWWWWW.......",
    ".......GGGGGGGG...GGGGGGGG.......",
  ];

  /* まばたき：目の上下だけ肌に戻すと、細い線が残って自然に閉じて見える */
  const EYE_ROWS = [12, 14];
  const EYE_COLS = [12, 13, 19, 20];

  /* バスケットボール：11 × 11 */
  const BALL = [
    "...DBDBD...",
    "..DBBDBBD..",
    ".BDBBDBBDB.",
    "BDBBBDBBBDB",
    "BDBBBDBBBDB",
    "DDDDDDDDDDD",
    "BDBBBDBBBDB",
    "BDBBBDBBBDB",
    ".BDBBDBBDB.",
    "..DBBDBBD..",
    "...DBDBD...",
  ];

  function svg(map, px, cls) {
    const h = map.length, w = map[0].length;
    let rects = "";
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const c = PAL[map[y][x]];
        if (!c) continue;
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`;
      }
    }
    return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" width="${w * px}" height="${h * px}"
      shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="橋本勇太を表すドット絵のキャラクター">${rects}</svg>`;
  }

  function mount(host, px) {
    if (!host) return;
    host.innerHTML =
      `<div class="px-stage">
         <div class="px-believe" aria-hidden="true"><span>BELIEVE</span></div>
         <div class="px-body">${svg(BODY, px, "px-svg")}</div>
         <div class="px-ball">${svg(BALL, px, "px-svg")}</div>
         <div class="px-shadow"></div>
       </div>`;

    /* まばたき */
    const body = host.querySelector(".px-body");
    let shut = false;
    const redraw = () => {
      const m = BODY.slice();
      if (shut) {
        EYE_ROWS.forEach((r) => {
          const row = m[r].split("");
          EYE_COLS.forEach((c) => (row[c] = "S"));
          m[r] = row.join("");
        });
      }
      body.innerHTML = svg(m, px, "px-svg");
    };
    const blink = () => {
      shut = true; redraw();
      setTimeout(() => { shut = false; redraw(); }, 130);
      setTimeout(blink, 2600 + Math.random() * 3400);
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTimeout(blink, 1800);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    mount(document.getElementById("pxHero"), 5);
    mount(document.getElementById("pxAbout"), 4);
  });
})();
