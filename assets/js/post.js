/* Single post: fetches the markdown for the active language and renders it. */
(function () {
  "use strict";

  const POSTS = window.SITE_POSTS || [];
  const params = new URLSearchParams(location.search);
  const slug = params.get("p");
  const meta = POSTS.find(p => p.slug === slug);

  const titleEl = () => document.getElementById("post-title");
  const metaEl = () => document.getElementById("post-meta");
  const bodyEl = () => document.getElementById("post-body");
  const noticeEl = () => document.getElementById("post-notice");

  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(Site.lang() === "tr" ? "tr-TR" : "en-GB",
      { year: "numeric", month: "long", day: "numeric" });
  }

  function renderMarkdown(md) {
    if (window.marked) {
      const html = window.marked.parse(md, { mangle: false, headerIds: true });
      return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
    }
    // marked unavailable (offline / CDN blocked): show the source, readably
    const pre = document.createElement("pre");
    pre.textContent = md;
    return pre.outerHTML;
  }

  async function load() {
    if (!slug || !meta) {
      titleEl().textContent = Site.t("postMissing");
      bodyEl().innerHTML = `<p class="muted"><a href="writing.html">${Site.t("backToWriting")}</a></p>`;
      return;
    }

    const lang = Site.lang();
    const useTr = lang === "tr" && meta.hasTr;
    document.title = Site.pick(meta, "title") + " — Özay Özaydın";
    titleEl().textContent = Site.pick(meta, "title");
    metaEl().innerHTML =
      `<time datetime="${meta.date}">${fmtDate(meta.date)}</time>` +
      `<span>${meta.minutes} ${Site.t("minRead")}</span>` +
      (meta.tags || []).map(t => `<span class="chip">${Site.esc(t)}</span>`).join("");

    noticeEl().innerHTML = (lang === "tr" && !meta.hasTr)
      ? `<p class="notice">${Site.t("notTranslated")}</p>` : "";

    if (location.protocol === "file:") {
      bodyEl().innerHTML = `<p class="notice">${Site.t("fileProtocol")}</p>`;
      return;
    }

    const file = `content/posts/${slug}.${useTr ? "tr" : "en"}.md`;
    try {
      const res = await fetch(file, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      bodyEl().innerHTML = renderMarkdown(await res.text());
    } catch (err) {
      bodyEl().innerHTML = `<p class="notice">${Site.t("postMissing")}</p>`;
    }

    // previous / next within the index order
    const i = POSTS.indexOf(meta);
    const older = POSTS[i + 1], newer = POSTS[i - 1];
    document.getElementById("post-nav").innerHTML =
      (newer ? `<a class="btn btn-ghost btn-sm" href="post.html?p=${encodeURIComponent(newer.slug)}">← ${Site.esc(Site.pick(newer, "title"))}</a>` : "<span></span>") +
      (older ? `<a class="btn btn-ghost btn-sm" href="post.html?p=${encodeURIComponent(older.slug)}">${Site.esc(Site.pick(older, "title"))} →</a>` : "<span></span>");
  }

  document.addEventListener("DOMContentLoaded", load);
  document.addEventListener("langchange", load);
})();
