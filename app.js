/* =========================================================
   Hashi — Works : ふるまい
   ========================================================= */
(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const LIVE = /稼働|公開|運用|納品/;

  /* ---------- HERO : タイプライター ---------- */
  function typeLead() {
    const el = $("#heroLead");
    const text = PROFILE.tagline;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }
    let i = 0;
    const caret = document.createElement("span");
    caret.className = "caret";
    const node = document.createTextNode("");
    el.append(node, caret);
    const tick = () => {
      node.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 42);
    };
    setTimeout(tick, 520);
  }

  /* ---------- HERO : 数字 ---------- */
  function renderStats() {
    const live = PROJECTS.filter((p) => LIVE.test(p.status)).length;
    const techs = new Set(PROJECTS.flatMap((p) => p.tech)).size;
    const stats = [
      { k: "Projects",   v: PROJECTS.length,          u: "本" },
      { k: "In Service", v: live,                      u: "本" },
      { k: "Tech Used",  v: techs,                     u: "種" },
      { k: "Since",      v: "2026.04",                 u: "" },
    ];
    $("#heroStats").innerHTML = stats
      .map(
        (s) => `<div class="st"><dt>${esc(s.k)}</dt><dd>${
          typeof s.v === "number" ? `<span class="count" data-to="${s.v}">0</span>` : esc(s.v)
        }${s.u ? `<small>${esc(s.u)}</small>` : ""}</dd></div>`
      )
      .join("");

    $$(".count").forEach((el) => {
      const to = +el.dataset.to;
      const dur = 1100;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 400);
    });
  }

  /* ---------- ABOUT / TIMELINE / SKILLS / CONTACT ---------- */
  function renderStatic() {
    $("#pfName").textContent = PROFILE.nameJa;
    $("#pfEn").textContent = `${PROFILE.nameEn} — ${PROFILE.role}`;
    $("#aboutBody").innerHTML = PROFILE.intro.map((p) => `<p>${esc(p)}</p>`).join("");

    $("#tl").innerHTML = TIMELINE.map(
      (t) =>
        `<li class="rv"><p class="tl-date">${esc(t.date)}</p><h3 class="tl-title">${esc(t.title)}</h3><p class="tl-note">${esc(t.note)}</p></li>`
    ).join("");

    $("#skillsGrid").innerHTML = SKILLS.map(
      (g) =>
        `<div class="sk rv"><h3>${esc(g.group)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`
    ).join("");


    $("#roots").innerHTML = ROOTS.map(
      (r) =>
        `<li><span class="rt-year">${esc(r.year)}</span><span class="rt-body"><b>${esc(r.title)}</b>${
          r.note ? `<i>${esc(r.note)}</i>` : ""
        }</span></li>`
    ).join("");

    $("#likes").innerHTML = INTERESTS.map(
      (i) =>
        `<div class="like rv"><span class="like-e" aria-hidden="true">${i.emoji}</span><div><p class="like-t">${esc(
          i.label
        )}</p><p class="like-n">${esc(i.note)}</p></div></div>`
    ).join("");

    $("#strengths").innerHTML = STRENGTHS.map(
      (t, n) =>
        `<div class="str rv"><span class="str-n">0${n + 1}</span><p class="str-t">${esc(t.title)}</p><p class="str-b">${esc(
          t.note
        )}</p></div>`
    ).join("");

    $("#exp").innerHTML = EXPERIENCE.map(
      (e) =>
        `<div class="ex rv"><div class="ex-h"><p class="ex-role">${esc(e.role)}</p><span class="badge">${esc(
          e.period
        )}</span></div><p class="ex-org">${esc(e.org)}</p><p class="ex-note">${esc(e.note)}</p></div>`
    ).join("");

    $("#careerTop").innerHTML =
      `<div class="cr-top rv"><div class="cr-goals"><div><p class="cr-k">目標</p><p class="cr-v">${esc(
        CAREER.goal
      )}</p></div><div><p class="cr-k">軸</p><p class="cr-v">${esc(
        CAREER.axis
      )}</p></div></div><p class="cr-lead">${esc(CAREER.lead)}</p></div>`;

    $("#careerGroups").innerHTML = CAREER.groups
      .map(
        (g) =>
          `<div class="cr rv"><p class="cr-label">${esc(g.label)}</p><p class="cr-note">${esc(
            g.note
          )}</p><div class="cr-items">${g.items.map((i) => `<span class="co">${esc(i)}</span>`).join("")}</div></div>`
      )
      .join("");

    $("#contacts").innerHTML = PROFILE.contacts
      .map(
        (c) =>
          `<a class="ct rv" href="${esc(c.href)}"${
            c.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""
          }><div class="ct-body"><p class="ct-label">${esc(c.label)}</p><p class="ct-val">${esc(c.value)}</p></div><span class="arw">→</span></a>`
      )
      .join("");
  }

  /* ---------- WORKS ---------- */
  function cardHTML(p, i) {
    const tags = p.tech.slice(0, 4).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
    const rest = p.tech.length > 4 ? `<span class="tag more">+${p.tech.length - 4}</span>` : "";
    return `
      <button class="card${p.featured ? " feat" : ""}" data-id="${esc(p.id)}" style="animation-delay:${i * 45}ms">
        <div class="card-top">
          <span class="card-emoji" aria-hidden="true">${p.emoji}</span>
          <span class="card-h">
            <span class="card-title">${esc(p.title)}</span>
            <span class="card-sub">${esc(p.subtitle)}</span>
          </span>
        </div>
        <div class="card-meta">
          <span class="badge${LIVE.test(p.status) ? " live" : ""}">${esc(p.status)}</span>
          <span class="badge">${esc(p.period)}</span>
        </div>
        <p class="card-sum">${esc(p.summary)}</p>
        <div class="card-tech">${tags}${rest}</div>
        <span class="card-more">詳しく見る <span class="arw">→</span></span>
      </button>`;
  }

  let current = "all";

  function renderGrid() {
    const list = current === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === current);
    $("#grid").innerHTML = list.map(cardHTML).join("");
    $("#empty").hidden = list.length > 0;
    bindTilt();
  }

  function renderFilters() {
    $("#filters").innerHTML = CATEGORIES.map((c) => {
      const n = c.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.category === c.id).length;
      return `<button class="chip${c.id === "all" ? " on" : ""}" data-cat="${esc(c.id)}">${esc(c.label)}<span class="n">${n}</span></button>`;
    }).join("");

    $("#filters").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      current = chip.dataset.cat;
      $$(".chip").forEach((c) => c.classList.toggle("on", c === chip));
      renderGrid();
    });
  }

  function bindTilt() {
    $$(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- MODAL ---------- */
  const modal = $("#modal");
  let lastFocus = null;

  function openModal(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    lastFocus = document.activeElement;

    $("#modalScroll").innerHTML = `
      <div class="m-top">
        <span class="m-emoji" aria-hidden="true">${p.emoji}</span>
        <div>
          <h3 class="m-title" id="mTitle">${esc(p.title)}</h3>
          <p class="m-sub">${esc(p.subtitle)}</p>
        </div>
      </div>
      <div class="m-meta">
        <span class="badge${LIVE.test(p.status) ? " live" : ""}">${esc(p.status)}</span>
        <span class="badge">${esc(p.period)}</span>
        <span class="badge">${esc((CATEGORIES.find((c) => c.id === p.category) || {}).label || "")}</span>
      </div>
      <p class="m-sum">${esc(p.summary)}</p>
      <div class="m-body">${p.body.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      ${
        p.highlights && p.highlights.length
          ? `<p class="m-h">HIGHLIGHTS</p><ul class="m-list">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
          : ""
      }
      <p class="m-h">TECH STACK</p>
      <div class="m-tech">${p.tech.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      ${
        p.links && p.links.length
          ? `<div class="m-links">${p.links
              .map((l) => `<a class="m-link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} <span class="arw">↗</span></a>`)
              .join("")}</div>`
          : ""
      }`;

    modal.hidden = false;
    document.body.classList.add("lock");
    $(".modal-x").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("lock");
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) return openModal(card.dataset.id);
    if (e.target.closest("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* ---------- SCROLL ---------- */
  function initScroll() {
    const nav = $("#nav");
    const bar = $("#navProgress");
    const links = $$(".nav-links a");
    const secs = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);

    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle("solid", y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;

      let active = -1;
      secs.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= 120) active = i;
      });
      links.forEach((a, i) => a.classList.toggle("active", i === active));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px" }
    );
    $$(".rv, .sec-head, .filters").forEach((el, i) => {
      el.classList.add("rv");
      el.style.transitionDelay = `${(i % 6) * 55}ms`;
      io.observe(el);
    });
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderStats();
    typeLead();
    renderStatic();
    renderFilters();
    renderGrid();
    initScroll();
  });
})();
