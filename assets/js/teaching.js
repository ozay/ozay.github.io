/* Teaching page: load-by-year and by-institution figures, then a course explorer. */
(function () {
  "use strict";

  const COURSES = window.SITE_COURSES;
  const THEMES = window.SITE_THEMES;
  const UNIS = window.SITE_UNIVERSITIES;
  const themeKeys = Object.keys(THEMES);
  const themeColor = k => `var(--series-${themeKeys.indexOf(k) + 1})`;
  const ACTIVE = window.SITE_ACTIVE_TERM;

  const yearOf = term => term.split(" ")[0];               // "2024-2025 Fall" -> "2024-2025"
  const allYears = () => [...new Set(COURSES.flatMap(c => c.terms.map(yearOf)))]
    .sort((a, b) => parseInt(a) - parseInt(b));

  /* ------------------------------------------------------- derived data -- */
  function loadByYear() {
    const years = allYears();
    return years.map(y => {
      const ug = COURSES.filter(c => c.level === "ug").reduce((s, c) => s + c.terms.filter(t => yearOf(t) === y).length, 0);
      const gr = COURSES.filter(c => c.level === "grad").reduce((s, c) => s + c.terms.filter(t => yearOf(t) === y).length, 0);
      return {
        key: y.replace("-", "–"),
        parts: [
          { name: Site.t("thUg"), value: ug, color: "var(--series-1)" },
          { name: Site.t("thGrad"), value: gr, color: "var(--series-2)" }
        ]
      };
    });
  }

  function byUniversity() {
    return Object.keys(UNIS)
      .map(k => ({
        key: UNIS[k].name,
        value: COURSES.filter(c => c.uni === k).reduce((s, c) => s + c.terms.length, 0),
        color: "var(--series-1)"
      }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  /* ------------------------------------------------------------ figures -- */
  function drawFigures() {
    const ly = loadByYear();
    Charts.stackedColumns(document.getElementById("fig-load"), ly, {
      height: 300, aria: Site.t("figLoad"), totalWord: Site.lang() === "tr" ? "toplam" : "total"
    });
    const legendHost = document.getElementById("fig-load-legend");
    legendHost.innerHTML = "";
    Charts.legend(legendHost, [
      { label: Site.t("thUg"), color: "var(--series-1)" },
      { label: Site.t("thGrad"), color: "var(--series-2)" }
    ]);
    const tableHost = document.getElementById("fig-load-table");
    tableHost.innerHTML = "";
    Charts.dataTable(tableHost, [Site.t("thTerm"), Site.t("thUg"), Site.t("thGrad")],
      ly.map(d => [d.key, d.parts[0].value, d.parts[1].value]),
      { show: Site.t("showTable"), hide: Site.t("hideTable") });

    const bu = byUniversity();
    Charts.bars(document.getElementById("fig-uni"), bu, {
      labelWidth: 215, unit: Site.lang() === "tr" ? "ders" : "deliveries", aria: Site.t("figUnis")
    });
    const uniTable = document.getElementById("fig-uni-table");
    uniTable.innerHTML = "";
    Charts.dataTable(uniTable, [Site.t("thUni"), Site.t("thDeliveries")],
      bu.map(d => [Site.esc(d.key), d.value]),
      { show: Site.t("showTable"), hide: Site.t("hideTable") });
  }

  /* ------------------------------------------------------------ filters -- */
  const state = { q: "", level: "all", lang: "all", uni: "all", theme: "all" };

  function sparkline(c) {
    // one tick per academic year in the whole record; filled where the course ran
    const years = allYears();
    const ran = new Set(c.terms.map(yearOf));
    return `<div class="course-spark" aria-hidden="true">${years.map(y =>
      `<i class="${ran.has(y) ? "on" : ""}"></i>`).join("")}</div>`;
  }

  // one deck links straight to it; several link to the course's list on the Talks page
  function slidesLink(c) {
    const decks = (window.SITE_LECTURES || []).filter(l => l.course === c.title);
    if (!decks.length) return "";
    const href = decks.length === 1 ? decks[0].slides : "talks.html#" + decks[0].code.toLowerCase();
    return `<a class="btn btn-ghost btn-sm" href="${Site.esc(href)}" style="align-self:flex-start;margin-top:.3rem">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 20h8M12 17v3"/></svg>
      ${Site.t("lectureSlides")}</a>`;
  }

  function card(c) {
    const n = themeKeys.indexOf(c.theme) + 1;
    const isActive = c.terms.includes(ACTIVE);
    const count = c.terms.length;
    const first = c.terms[c.terms.length - 1];
    const latest = c.terms[0];
    return `
      <article class="course" style="--theme-color: var(--series-${n})">
        <div style="display:flex;gap:.5rem;align-items:flex-start;justify-content:space-between">
          <h3>${Site.esc(c.title)}</h3>
          ${isActive ? `<span class="chip chip-live" style="flex:none"><i class="chip-dot"></i>${Site.t("active")}</span>` : ""}
        </div>
        <p class="course-org">${Site.esc(UNIS[c.uni].name)} · ${Site.esc(c.dept)}</p>
        <p class="course-terms">
          <b>${count}</b> ${count === 1 ? Site.t("taughtTimes") : Site.t("taughtTimesMany")}
          · ${Site.t("mostRecent")}: ${Site.esc(latest.replace("-", "–"))}
          ${count > 1 ? `· ${Site.t("firstTaught")}: ${Site.esc(first.replace("-", "–"))}` : ""}
        </p>
        ${sparkline(c)}
        <div class="course-tags">
          <span class="chip"><i class="chip-dot" style="color:var(--series-${n})"></i>${Site.esc(Site.pick(THEMES[c.theme]))}</span>
          <span class="chip">${c.level === "ug" ? Site.t("levelUg") : Site.t("levelGrad")}</span>
          <span class="chip">${c.lang === "en" ? Site.t("langEn") : Site.t("langTr")}</span>
        </div>
        ${slidesLink(c)}
      </article>`;
  }

  function apply() {
    const q = state.q.trim().toLowerCase();
    const list = COURSES.filter(c => {
      if (state.level !== "all" && c.level !== state.level) return false;
      if (state.lang !== "all" && c.lang !== state.lang) return false;
      if (state.uni !== "all" && c.uni !== state.uni) return false;
      if (state.theme !== "all" && c.theme !== state.theme) return false;
      if (!q) return true;
      return (c.title + " " + c.dept + " " + UNIS[c.uni].name + " " + c.terms.join(" ")).toLowerCase().includes(q);
    });

    const host = document.getElementById("course-grid");
    host.innerHTML = list.length
      ? list.map(card).join("")
      : `<div class="empty-state" style="grid-column:1/-1">
           <p>${Site.t("noResults")}</p>
           <button class="btn btn-ghost btn-sm" type="button" id="clear-filters" style="margin-top:1rem">${Site.t("clearFilters")}</button>
         </div>`;

    document.getElementById("course-count").textContent =
      list.length + " " + (list.length === 1 ? Site.t("resultsOne") : Site.t("resultsMany"));

    const clear = document.getElementById("clear-filters");
    if (clear) clear.addEventListener("click", reset);
  }

  function reset() {
    state.q = ""; state.level = "all"; state.lang = "all"; state.uni = "all"; state.theme = "all";
    document.getElementById("course-search").value = "";
    ["level-filter", "lang-filter", "uni-filter", "theme-filter"].forEach(id => { document.getElementById(id).value = "all"; });
    apply();
  }

  function buildFilters() {
    const level = document.getElementById("level-filter");
    const lang = document.getElementById("lang-filter");
    const uni = document.getElementById("uni-filter");
    const theme = document.getElementById("theme-filter");

    const fill = () => {
      level.innerHTML = `<option value="all">${Site.t("allLevels")}</option>
        <option value="ug">${Site.t("levelUg")}</option><option value="grad">${Site.t("levelGrad")}</option>`;
      level.value = state.level;
      lang.innerHTML = `<option value="all">${Site.t("allLangs")}</option>
        <option value="en">${Site.t("langEn")}</option><option value="tr">${Site.t("langTr")}</option>`;
      lang.value = state.lang;
      uni.innerHTML = `<option value="all">${Site.t("allUnis")}</option>` +
        Object.keys(UNIS).map(k => `<option value="${k}">${Site.esc(UNIS[k].name)}</option>`).join("");
      uni.value = state.uni;
      theme.innerHTML = `<option value="all">${Site.t("allThemes")}</option>` +
        themeKeys.map(k => `<option value="${k}">${Site.esc(Site.pick(THEMES[k]))}</option>`).join("");
      theme.value = state.theme;
    };
    fill();
    document.addEventListener("langchange", fill);

    document.getElementById("course-search").addEventListener("input", Site.debounce(function () {
      state.q = this.value; apply();
    }, 160));
    level.addEventListener("change", function () { state.level = this.value; apply(); });
    lang.addEventListener("change", function () { state.lang = this.value; apply(); });
    uni.addEventListener("change", function () { state.uni = this.value; apply(); });
    theme.addEventListener("change", function () { state.theme = this.value; apply(); });
  }

  /* --------------------------------------------------------------- boot -- */
  document.addEventListener("DOMContentLoaded", () => {
    const p = new URLSearchParams(location.search);
    if (themeKeys.includes(p.get("theme"))) state.theme = p.get("theme");
    if (["ug", "grad"].includes(p.get("level"))) state.level = p.get("level");
    buildFilters();
    drawFigures();
    apply();

    // headline numbers derived from the data, so they never drift
    const deliveries = COURSES.reduce((s, c) => s + c.terms.length, 0);
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.dataset.countTo = v; };
    set("n-courses", COURSES.length);
    set("n-deliveries", deliveries);
    set("n-unis", new Set(COURSES.map(c => c.uni)).size);
    set("n-years", allYears().length);
    Site.counters();   // the attributes only exist now, so re-scan for them
  });

  document.addEventListener("langchange", () => { drawFigures(); apply(); });
  document.addEventListener("themechange", drawFigures);
})();
