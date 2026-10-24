/* Talks: renders whichever of these containers the page has —
   #talks-upcoming and #talks-past (Talks page and home page), #lectures (Talks page).
   A talk counts as upcoming until its last day has passed. */
(function () {
  "use strict";

  const TALKS = window.SITE_TALKS || [];
  const LECTURES = window.SITE_LECTURES || [];
  const TYPES = window.SITE_TALK_TYPES || {};

  const L = () => Site.lang();
  // fields come as titleEn/titleTr pairs, or as one plain field when there is nothing to translate
  const field = (t, base) => t[base + (L() === "tr" ? "Tr" : "En")] ?? t[base] ?? "";
  const original = (t, base) => t[base + (t.lang === "tr" ? "Tr" : "En")] ?? t[base] ?? "";

  const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); };
  const todayKey = () => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  };
  const isUpcoming = t => (t.dateEnd || t.date) >= todayKey();

  function fmtDate(t) {
    const f = new Intl.DateTimeFormat(L() === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
    const a = parse(t.date);
    if (!t.dateEnd) return f.format(a);
    const b = parse(t.dateEnd);
    return f.formatRange ? f.formatRange(a, b) : `${f.format(a)} – ${f.format(b)}`;
  }

  const btn = (href, label, cls, icon, external) =>
    `<a class="btn ${cls} btn-sm" href="${Site.esc(href)}"${external ? ' target="_blank" rel="noopener"' : ""}>${icon || ""}${Site.esc(label)}</a>`;
  const ICON_SLIDES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 20h8M12 17v3"/></svg>';

  function card(t, compact) {
    const type = TYPES[t.type] ? Site.pick(TYPES[t.type]) : "";
    const spoken = Site.t(t.lang === "tr" ? "talkInTr" : "talkInEn");
    const title = field(t, "title"), sub = field(t, "subtitle");
    const translated = t.lang !== L();
    const event = field(t, "event");
    const withWho = (t.with || []).length
      ? (L() === "tr" ? `${t.with.join(", ")} ile` : `with ${t.with.join(", ")}`) : "";

    const links = [
      t.slides && btn(t.slides, Site.t("talkSlides"), "btn-primary", ICON_SLIDES),
      t.paper && btn("research.html?q=" + encodeURIComponent(t.paper), Site.t("talkPaper"), "btn-ghost"),
      t.pdf && btn(t.pdf, "PDF", "btn-ghost"),
      t.video && btn(t.video, Site.t("talkVideo"), "btn-ghost", "", true)
    ].filter(Boolean).join("");

    return `
      <article class="talk${compact ? " talk-compact" : ""}">
        <div class="talk-date">${Site.esc(fmtDate(t))}</div>
        <div class="talk-body">
          <div class="talk-chips">
            ${type ? `<span class="chip chip-accent">${Site.esc(type)}</span>` : ""}
            <span class="chip">${Site.esc(spoken)}</span>
          </div>
          <h3 lang="${translated ? L() : t.lang}">${Site.esc(title)}</h3>
          ${sub ? `<p class="talk-sub">${Site.esc(sub)}</p>` : ""}
          ${translated && !compact ? `<p class="talk-orig" lang="${t.lang}"><span>${Site.t("talkOriginal")}:</span> ${Site.esc(original(t, "title"))}</p>` : ""}
          <p class="talk-event">${Site.esc(event)}${t.city ? " · " + Site.esc(t.city) : ""}</p>
          ${withWho ? `<p class="talk-with">${Site.esc(withWho)}</p>` : ""}
          ${links ? `<div class="talk-links">${links}</div>` : ""}
        </div>
      </article>`;
  }

  function lectureBlocks() {
    const byCourse = {};
    LECTURES.forEach(l => { (byCourse[l.code] = byCourse[l.code] || []).push(l); });
    return Object.entries(byCourse).map(([code, list]) => {
      list.sort((a, b) => a.week - b.week);
      const terms = [...new Set(list.map(l => l.term.replace("-", "–")))].join(", ");
      return `
        <div class="card lecture-course" id="${code.toLowerCase()}">
          <p class="eyebrow">${Site.esc(code)}</p>
          <h3>${Site.esc(list[0].course)}</h3>
          <p class="muted lecture-term">${Site.esc(terms)}</p>
          <ul class="lecture-list">
            ${list.map(l => `
              <li><a href="${Site.esc(l.slides)}">
                <span class="lecture-week">${Site.t("talkWeek")} ${l.week}</span>
                <span class="lecture-title" lang="${L()}">${Site.esc(field(l, "title"))}</span>
                <span class="chip">${Site.esc(Site.t(l.lang === "tr" ? "talkInTr" : "talkInEn"))}</span>
              </a></li>`).join("")}
          </ul>
        </div>`;
    }).join("");
  }

  function render() {
    const byDateDesc = (a, b) => (a.date < b.date ? 1 : -1);
    const upcoming = TALKS.filter(isUpcoming).sort((a, b) => (a.date > b.date ? 1 : -1));   // soonest first
    const past = TALKS.filter(t => !isUpcoming(t)).sort(byDateDesc);

    const up = document.getElementById("talks-upcoming");
    if (up) {
      const section = up.closest("[data-talks-section]") || up;
      section.hidden = !upcoming.length;
      up.innerHTML = upcoming.map(t => card(t, up.dataset.compact === "true")).join("");
    }
    const pastEl = document.getElementById("talks-past");
    if (pastEl) pastEl.innerHTML = past.map(t => card(t)).join("") || `<p class="muted">—</p>`;

    const lec = document.getElementById("lectures");
    if (lec) {
      const section = lec.closest("[data-talks-section]") || lec;
      section.hidden = !LECTURES.length;
      lec.innerHTML = lectureBlocks();
    }
  }

  window.Talks = { isUpcoming, all: TALKS, lectures: LECTURES };
  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("langchange", render);
})();
