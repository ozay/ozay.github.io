/* Home page: the three most recent publications and the two latest posts. */
(function () {
  "use strict";

  function pubCard(p) {
    const authors = p.authors.map(a =>
      /Özaydın|Ozaydin/.test(a) ? `<span class="me">${Site.esc(a)}</span>` : Site.esc(a)
    ).join(", ");
    const topic = window.SITE_TOPICS[p.topic];
    const n = Object.keys(window.SITE_TOPICS).indexOf(p.topic) + 1;
    return `
      <article class="pub" style="--topic-color: var(--series-${n})">
        <div class="pub-year mono">${p.year}</div>
        <div>
          <h3>${Site.esc(p.title)}</h3>
          <p class="pub-authors">${authors}</p>
          <p class="pub-venue"><em>${Site.esc(p.venue)}</em>${p.detail ? " · " + Site.esc(p.detail) : ""}</p>
          <div class="pub-foot">
            <span class="chip"><i class="chip-dot" style="color:var(--series-${n})"></i>${Site.esc(Site.pick(topic))}</span>
          </div>
        </div>
      </article>`;
  }

  function postCard(p) {
    const title = Site.pick(p, "title");
    const excerpt = Site.pick(p, "excerpt");
    const d = new Date(p.date + "T00:00:00");
    const date = d.toLocaleDateString(Site.lang() === "tr" ? "tr-TR" : "en-GB",
      { year: "numeric", month: "long", day: "numeric" });
    return `
      <a class="card card-link post-card" href="post.html?p=${encodeURIComponent(p.slug)}">
        <time datetime="${p.date}">${date} · ${p.minutes} ${Site.t("minRead")}</time>
        <h3>${Site.esc(title)}</h3>
        <p>${Site.esc(excerpt)}</p>
        <span class="read-more">${Site.t("readMore")}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        </span>
      </a>`;
  }

  function render() {
    const pubs = document.getElementById("recent-pubs");
    if (pubs) pubs.innerHTML = window.SITE_PUBLICATIONS.slice(0, 3).map(pubCard).join("");

    const posts = document.getElementById("recent-posts");
    if (posts) {
      const list = window.SITE_POSTS || [];
      posts.innerHTML = list.length
        ? list.slice(0, 3).map(postCard).join("")
        : `<p class="muted">${Site.t("noPosts")}</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("langchange", render);
})();
