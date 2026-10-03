/* シェアボタン：リンクのコピーと、端末の共有メニュー（スマホ） */
(function () {
  "use strict";
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy], [data-native]");
    if (!btn) return;
    const box = btn.closest(".share");
    const url = box.dataset.url;
    if (btn.hasAttribute("data-native")) {
      try { await navigator.share({ title: document.title, text: box.dataset.text, url }); } catch (_) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {
      const t = document.createElement("textarea");
      t.value = url;
      document.body.append(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    const label = btn.textContent;
    btn.textContent = "コピーしました";
    btn.classList.add("done");
    setTimeout(() => { btn.textContent = label; btn.classList.remove("done"); }, 1800);
  });
  const reveal = () => {
    if (navigator.share) document.querySelectorAll("[data-native]").forEach((b) => (b.hidden = false));
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", reveal);
  else reveal();
})();
