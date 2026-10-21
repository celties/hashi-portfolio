/* =========================================================
   Hashi — Works : 動き（キネティック・タイポグラフィと UI アニメーション）
   - 見出しを1文字ずつに分けて、出てくるときに文字が躍る
   - 章番号は文字が入れ替わりながら決まる（スクランブル）
   - 流れる文字の帯は、スクロールの速さと向きに反応する
   - ボタンは指先に吸い寄せられ、押すと波紋が広がる
   - カードはカーソルの位置に合わせて立体的に傾く
   どのページでも読み込んでよい（要素がなければ何もしない）。
   OS で「視差効果を減らす」が有効なら、すべて止める。
   ========================================================= */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- 文字を1文字ずつ span に分ける ---------- */
  // 子要素（em など）は残し、その中の文字も分ける。読み上げは元の文のまま。
  function split(el) {
    if (!el || el.dataset.split) return [];
    el.dataset.split = "1";
    if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    const chars = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const c of n.textContent) {
            if (/\s/.test(c)) {
              frag.append(c);
              continue;
            }
            const s = document.createElement("span");
            s.className = "ch";
            s.setAttribute("aria-hidden", "true");
            s.textContent = c;
            frag.append(s);
            chars.push(s);
          }
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          n.setAttribute("aria-hidden", "true");
          walk(n);
        }
      });
    };
    walk(el);
    chars.forEach((c, i) => c.style.setProperty("--i", i));
    return chars;
  }

  /* ---------- ヒーローの見出し ---------- */
  function hero() {
    const title = document.querySelector(".hero-title");
    if (!title) return;
    const chars = split(title);
    // 「一瞬一瞬」はオレンジ → ゴールドを1文字ずつ塗り分ける
    const em = title.querySelector("em");
    if (em) {
      em.classList.add("em-split");
      const inEm = $$(".ch", em);
      inEm.forEach((c, i) => c.style.setProperty("--p", `${Math.round((i / Math.max(1, inEm.length - 1)) * 100)}%`));
    }
    title.classList.add("kt-hero");
    const last = chars[chars.length - 1];
    const done = () => title.classList.add("kt-done");
    if (last) last.addEventListener("animationend", done, { once: true });
    setTimeout(done, 2600); // 念のため

    // スクロールすると見出しが奥へ沈みながら薄れる
    const heroIn = document.querySelector(".hero-in");
    window.addEventListener(
      "scroll",
      () => {
        const y = Math.min(window.scrollY, window.innerHeight);
        if (heroIn) {
          heroIn.style.transform = `translate3d(0,${(y * 0.22).toFixed(1)}px,0)`;
          heroIn.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
        }
      },
      { passive: true }
    );

    // 文字にカーソルを近づけると、そっと逃げる
    if (!fine) return;
    let raf = 0;
    title.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        chars.forEach((c) => {
          const r = c.getBoundingClientRect();
          const dx = r.left + r.width / 2 - e.clientX;
          const dy = r.top + r.height / 2 - e.clientY;
          const d = Math.hypot(dx, dy);
          const f = Math.max(0, 1 - d / 140);
          c.style.translate = f ? `${(dx / (d || 1)) * f * 14}px ${(dy / (d || 1)) * f * 14}px` : "";
        });
      });
    });
    title.addEventListener("pointerleave", () => chars.forEach((c) => (c.style.translate = "")));
  }

  /* ---------- 章の見出し：見えたら1文字ずつ ---------- */
  function headings() {
    const targets = $$(".sec-title, .m-title, .sub-h, .wp-h, .story-t, .now-title");
    targets.forEach((el) => {
      split(el);
      el.classList.add("kt");
    });
    const scrambles = $$(".sec-num");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("kt-in");
          if (en.target.classList.contains("sec-num")) scramble(en.target);
          io.unobserve(en.target);
        }),
      { threshold: 0.2, rootMargin: "0px 0px -40px" }
    );
    [...targets, ...scrambles].forEach((el) => io.observe(el));
  }

  /* ---------- 文字が入れ替わりながら決まる ---------- */
  const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/";
  function scramble(el) {
    const final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    el.setAttribute("aria-label", final);
    let frame = 0;
    const total = 22;
    const tick = () => {
      frame++;
      const settled = Math.floor((frame / total) * final.length);
      el.textContent = [...final]
        .map((c, i) => (i < settled || /[\s—-]/.test(c) ? c : POOL[(Math.random() * POOL.length) | 0]))
        .join("");
      if (frame < total) requestAnimationFrame(tick);
      else el.textContent = final;
    };
    requestAnimationFrame(tick);
  }

  /* ---------- 流れる文字の帯（スクロールの速さに反応） ---------- */
  function marquees() {
    const bands = $$(".marquee");
    if (!bands.length) return;
    const state = bands.map((b) => {
      const track = b.querySelector(".mq-track");
      // 帯の幅を埋めるまで中身を複製する
      const unit = track.innerHTML;
      while (track.scrollWidth < window.innerWidth * 2.5) track.insertAdjacentHTML("beforeend", unit);
      track.insertAdjacentHTML("beforeend", track.innerHTML);
      return { b, track, x: 0, dir: b.dataset.dir === "right" ? 1 : -1, half: track.scrollWidth / 2 };
    });
    let lastY = window.scrollY;
    let vel = 0;
    let sign = 1;
    const loop = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      vel += (Math.min(60, Math.abs(dy)) - vel) * 0.12;
      if (dy) sign = dy > 0 ? 1 : -1;
      state.forEach((s) => {
        s.x += (0.6 + vel * 0.35) * s.dir * sign;
        if (s.x <= -s.half) s.x += s.half;
        if (s.x > 0) s.x -= s.half;
        s.track.style.transform = `translate3d(${s.x}px,0,0) skewX(${(-vel * 0.25 * sign * s.dir).toFixed(2)}deg)`;
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------- 吸い寄せられるボタン ---------- */
  function magnetic() {
    if (!fine) return;
    const SEL = ".btn, .sh, .chip, .brand-mark";
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest(SEL);
      $$(".is-magnet").forEach((m) => {
        if (m !== el) {
          m.classList.remove("is-magnet");
          m.style.translate = "";
        }
      });
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.28;
      const y = (e.clientY - r.top - r.height / 2) * 0.38;
      el.classList.add("is-magnet");
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
  }

  /* ---------- 押すと広がる波紋 ---------- */
  function ripple() {
    document.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".btn, .sh, .chip, .ct, .m-link");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const s = document.createElement("span");
      const size = Math.max(r.width, r.height) * 2.2;
      s.className = "ripple";
      s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      el.append(s);
      s.addEventListener("animationend", () => s.remove(), { once: true });
    });
  }

  /* ---------- カードを立体的に傾ける ---------- */
  function tilt() {
    if (!fine) return;
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card, .pl, .fav, .per, .str, .sk");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", `${(-py * 7).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(px * 9).toFixed(2)}deg`);
    });
    document.addEventListener(
      "pointerout",
      (e) => {
        const card = e.target.closest(".card, .pl, .fav, .per, .str, .sk");
        if (card && !card.contains(e.relatedTarget)) {
          card.style.removeProperty("--rx");
          card.style.removeProperty("--ry");
        }
      },
      true
    );
  }

  /* ---------- メニューの文字が上へ転がる ---------- */
  function rollLinks() {
    $$(".nav-links a").forEach((a) => {
      if (a.querySelector(".roll")) return;
      const t = a.textContent;
      a.innerHTML = `<span class="roll" data-t="${t.replace(/"/g, "&quot;")}"><span>${t}</span></span>`;
    });
  }

  function init() {
    rollLinks();
    if (reduce) return;
    document.documentElement.classList.add("motion");
    hero();
    headings();
    marquees();
    magnetic();
    ripple();
    tilt();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
