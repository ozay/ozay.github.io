/* Research page: three figures, then a filterable publication list. */
(function () {
  "use strict";

  const PUBS = window.SITE_PUBLICATIONS;
  const TOPICS = window.SITE_TOPICS;
  const topicKeys = Object.keys(TOPICS);
  const seriesFor = key => `var(--series-${topicKeys.indexOf(key) + 1})`;
  const ME = /Özaydın|Ozaydin|Özaydin/;

  /* ------------------------------------------------------- derived data -- */
  function perYear() {
    const map = new Map();
    const years = PUBS.map(p => p.year);
    for (let y = Math.min(...years); y <= Math.max(...years); y++) map.set(y, 0);
    PUBS.forEach(p => map.set(p.year, map.get(p.year) + 1));
    return [...map].map(([key, value]) => ({ key, value }));
  }

  function perTopic() {
    return topicKeys
      .map(k => ({ key: Site.pick(TOPICS[k]), raw: k, value: PUBS.filter(p => p.topic === k).length, color: seriesFor(k) }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  function coauthors() {
    const map = new Map();
    PUBS.forEach(p => p.authors.forEach(a => {
      if (ME.test(a)) return;
      if (!map.has(a)) map.set(a, []);
      map.get(a).push(p.title);
    }));
    return [...map]
      .map(([name, pubs]) => ({ name, weight: pubs.length, pubs }))
      .sort((a, b) => b.weight - a.weight);
  }

  /* ------------------------------------------------------------ figures -- */
  function drawFigures() {
    const yr = perYear();
    Charts.columns(document.getElementById("fig-year"), yr, {
      height: 240, valueLabels: true, unit: Site.lang() === "tr" ? "makale" : "articles",
      aria: Site.t("figPubsYear")
    });
    const yrTableHost = document.getElementById("fig-year-table");
    yrTableHost.innerHTML = "";
    Charts.dataTable(yrTableHost, [Site.t("thYear"), Site.t("thCount")],
      yr.filter(d => d.value > 0).map(d => [d.key, d.value]),
      { show: Site.t("showTable"), hide: Site.t("hideTable") });

    const tp = perTopic();
    Charts.bars(document.getElementById("fig-topic"), tp, {
      labelWidth: 210, unit: Site.lang() === "tr" ? "makale" : "articles", aria: Site.t("figThemes")
    });
    const tpTableHost = document.getElementById("fig-topic-table");
    tpTableHost.innerHTML = "";
    Charts.dataTable(tpTableHost, [Site.t("thTheme"), Site.t("thCount")],
      tp.map(d => [d.key, d.value]),
      { show: Site.t("showTable"), hide: Site.t("hideTable") });

    const ca = coauthors();
    Charts.egoNetwork(document.getElementById("fig-network"), "ÖÖ", ca, {
      height: 520, unit: Site.lang() === "tr" ? "ortak makale" : "joint articles", aria: Site.t("figNetwork")
    });
    const caTableHost = document.getElementById("fig-network-table");
    caTableHost.innerHTML = "";
    Charts.dataTable(caTableHost, [Site.t("thCoauthor"), Site.t("thCount")],
      ca.map(d => [Site.esc(d.name), d.weight]),
      { show: Site.t("showTable"), hide: Site.t("hideTable") });
  }

  /* ------------------------------------------------------------ filters -- */
  const state = { q: "", topic: "all", year: "all", sort: "new" };

  function highlight(text, q) {
    const safe = Site.esc(text);
    if (!q) return safe;
    try {
      return safe.replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
    } catch (e) { return safe; }
  }

  function citation(p) {
    return `${p.authors.join(", ")} (${p.year}). ${p.title}. ${p.venue}${p.detail ? ", " + p.detail : ""}.`;
  }

  function card(p) {
    const n = topicKeys.indexOf(p.topic) + 1;
    const authors = p.authors.map(a =>
      ME.test(a) ? `<span class="me">${highlight(a, state.q)}</span>` : highlight(a, state.q)
    ).join(", ");
    const scholar = "https://scholar.google.com/scholar?q=" + encodeURIComponent(p.title);
    return `
      <article class="pub" style="--topic-color: var(--series-${n})">
        <div class="pub-year mono">${p.year}</div>
        <div>
          <h3>${highlight(p.title, state.q)}</h3>
          <p class="pub-authors">${authors}</p>
          <p class="pub-venue"><em>${Site.esc(p.venue)}</em>${p.detail ? " · " + Site.esc(p.detail) : ""}</p>
          <div class="pub-foot">
            <span class="chip"><i class="chip-dot" style="color:var(--series-${n})"></i>${Site.esc(Site.pick(TOPICS[p.topic]))}</span>
            ${p.tags.slice(0, 3).map(t => `<span class="chip">${Site.esc(t)}</span>`).join("")}
            <button class="btn btn-ghost btn-sm" type="button" data-copy="${Site.esc(citation(p))}" aria-label="${Site.t("copyCitation")}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>
              ${Site.t("copyCitation")}
            </button>
            ${p.doi
              ? `<a class="btn btn-ghost btn-sm" href="https://doi.org/${Site.esc(p.doi)}" target="_blank" rel="noopener">DOI</a>`
              : `<a class="btn btn-ghost btn-sm" href="${scholar}" target="_blank" rel="noopener">${Site.t("searchScholar")}</a>`}
          </div>
        </div>
      </article>`;
  }

  function apply() {
    const q = state.q.trim().toLowerCase();
    let list = PUBS.filter(p => {
      if (state.topic !== "all" && p.topic !== state.topic) return false;
      if (state.year !== "all" && String(p.year) !== state.year) return false;
      if (!q) return true;
      const hay = (p.title + " " + p.authors.join(" ") + " " + p.venue + " " + p.tags.join(" ")).toLowerCase();
      return hay.includes(q);
    });

    list = list.slice().sort((a, b) =>
      state.sort === "old" ? a.year - b.year
      : state.sort === "title" ? a.title.localeCompare(b.title)
      : b.year - a.year
    );

    const host = document.getElementById("pub-list");
    host.innerHTML = list.length
      ? list.map(card).join("")
      : `<div class="empty-state">
           <p>${Site.t("noResults")}</p>
           <button class="btn btn-ghost btn-sm" type="button" id="clear-filters" style="margin-top:1rem">${Site.t("clearFilters")}</button>
         </div>`;

    const count = document.getElementById("pub-count");
    count.textContent = list.length + " " + (list.length === 1 ? Site.t("resultsOne") : Site.t("resultsMany"));

    const clear = document.getElementById("clear-filters");
    if (clear) clear.addEventListener("click", resetFilters);
  }

  function resetFilters() {
    state.q = ""; state.topic = "all"; state.year = "all";
    document.getElementById("pub-search").value = "";
    document.getElementById("topic-filter").value = "all";
    document.getElementById("year-filter").value = "all";
    apply();
  }

  function buildFilters() {
    const topicSel = document.getElementById("topic-filter");
    const yearSel = document.getElementById("year-filter");
    const years = [...new Set(PUBS.map(p => p.year))].sort((a, b) => b - a);

    const fill = () => {
      topicSel.innerHTML = `<option value="all">${Site.t("allTopics")}</option>` +
        topicKeys.map(k => `<option value="${k}">${Site.esc(Site.pick(TOPICS[k]))}</option>`).join("");
      topicSel.value = state.topic;
      yearSel.innerHTML = `<option value="all">${Site.t("allYears")}</option>` +
        years.map(y => `<option value="${y}">${y}</option>`).join("");
      yearSel.value = state.year;
      document.querySelectorAll("[data-sort]").forEach(b => {
        b.textContent = Site.t(b.dataset.sort === "new" ? "sortNewest" : b.dataset.sort === "old" ? "sortOldest" : "sortTitle");
        b.setAttribute("aria-pressed", String(state.sort === b.dataset.sort));
      });
    };
    fill();
    document.addEventListener("langchange", fill);

    document.getElementById("pub-search").addEventListener("input", Site.debounce(function () {
      state.q = this.value; apply();
    }, 160));
    topicSel.addEventListener("change", function () { state.topic = this.value; apply(); });
    yearSel.addEventListener("change", function () { state.year = this.value; apply(); });
    document.querySelectorAll("[data-sort]").forEach(b => b.addEventListener("click", () => {
      state.sort = b.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      apply();
    }));
  }

  /* ------------------------------------------------------------- theses -- */
  function theses() {
    const host = document.getElementById("thesis-list");
    if (!host) return;
    host.innerHTML = window.SITE_THESES.map(t => {
      const title = Site.lang() === "tr" && t.titleTr ? t.titleTr : t.title;
      return `
        <article class="thesis">
          <div class="thesis-year mono">${t.year}</div>
          <div>
            <h3>${Site.esc(title)}</h3>
            <p class="thesis-meta">${Site.esc(t.student)} · ${Site.esc(t.uni)}</p>
            <div class="thesis-foot">
              <span class="chip">${Site.esc(t.degree)}</span>
              <span class="chip">${Site.esc(t.lang)}</span>
              <span class="chip">${Site.esc(t.field)}</span>
              <a class="btn btn-ghost btn-sm" href="https://tez.yok.gov.tr/UlusalTezMerkezi/tezDetay.jsp?id=${encodeURIComponent(t.id)}" target="_blank" rel="noopener">${Site.t("thesisId")} ${Site.esc(t.id)}</a>
            </div>
          </div>
        </article>`;
    }).join("");
  }

  /* --------------------------------------------------------------- boot -- */
  document.addEventListener("DOMContentLoaded", () => {
    const fromUrl = new URLSearchParams(location.search).get("topic");
    if (fromUrl && topicKeys.includes(fromUrl)) state.topic = fromUrl;
    buildFilters();
    drawFigures();
    apply();
    theses();
  });

  document.addEventListener("langchange", () => { drawFigures(); apply(); theses(); });
  document.addEventListener("themechange", drawFigures);
})();
