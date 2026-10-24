/* Writing index: the post list, with tag filtering. */
(function () {
  "use strict";

  /* A post dated in the future is queued, not published: it stays off the index
     until its date arrives. Direct links to it still work. */
  const today = (function () {
    const d = new Date(), p = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  })();

  const POSTS = (window.SITE_POSTS || []).filter(p => !p.date || p.date <= today);
  let activeTag = "all";

  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(Site.lang() === "tr" ? "tr-TR" : "en-GB",
      { year: "numeric", month: "long", day: "numeric" });
  }

  function card(p) {
    return `
      <a class="card card-link post-card" href="post.html?p=${encodeURIComponent(p.slug)}">
        <time datetime="${p.date}">${fmtDate(p.date)} · ${p.minutes} ${Site.t("minRead")}</time>
        <h3>${Site.esc(Site.pick(p, "title"))}</h3>
        <p>${Site.esc(Site.pick(p, "excerpt"))}</p>
        <div class="course-tags">${(p.tags || []).map(t => `<span class="chip">${Site.esc(t)}</span>`).join("")}</div>
        <span class="read-more">${Site.t("readMore")}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        </span>
      </a>`;
  }

  function render() {
    const host = document.getElementById("post-list");
    if (!host) return;
    const list = activeTag === "all" ? POSTS : POSTS.filter(p => (p.tags || []).includes(activeTag));
    host.innerHTML = list.length
      ? list.map(card).join("")
      : `<p class="muted">${Site.t("noPosts")}</p>`;
  }

  function tags() {
    const host = document.getElementById("tag-filter");
    if (!host) return;
    const all = [...new Set(POSTS.flatMap(p => p.tags || []))];
    const build = () => {
      host.innerHTML =
        `<button type="button" class="chip" data-tag="all" aria-pressed="${activeTag === "all"}">${Site.lang() === "tr" ? "Tümü" : "All"}</button>` +
        all.map(t => `<button type="button" class="chip" data-tag="${Site.esc(t)}" aria-pressed="${activeTag === t}">${Site.esc(t)}</button>`).join("");
      host.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
        activeTag = b.dataset.tag;
        build(); render();
      }));
    };
    build();
  }

  document.addEventListener("DOMContentLoaded", () => { tags(); render(); });
  document.addEventListener("langchange", () => { tags(); render(); });
})();
