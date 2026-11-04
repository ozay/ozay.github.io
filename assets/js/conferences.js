/* Conferences: renders the Conferences page from assets/data/conferences.js.

   Five containers, each optional — the page shows whichever it has:
     #conf-stats     the derived numbers in the band
     #conf-calls     editions whose deadline has not passed
     #conf-upcoming  editions still to come
     #conf-groups    the series directory, grouped and searchable
     #conf-record    past editions you had a role in

   The sections for calls, upcoming and record hide themselves when they are
   empty, the way the Upcoming section on the Talks page does. An edition with
   no `roles` is a listing; an edition with roles is part of the record. */
(function () {
  "use strict";

  const SERIES   = window.SITE_CONF_SERIES || [];
  const EDITIONS = window.SITE_CONF_EDITIONS || [];
  const GROUPS   = window.SITE_CONF_GROUPS || {};
  const ROLES    = window.SITE_CONF_ROLES || {};
  const TALKS    = window.SITE_TALKS || [];
  const CHECKED  = window.SITE_CONF_CHECKED || "";

  const host = document.getElementById("conf-groups");
  if (!host) return;

  const search  = document.getElementById("conf-search");
  const countEl = document.getElementById("conf-count");
  const esc = s => Site.esc(s);
  const L = () => Site.lang();
  const field = (o, base) => o[base + (L() === "tr" ? "Tr" : "En")] ?? o[base] ?? "";

  const byKey = {};
  SERIES.forEach(s => { byKey[s.key] = s; });

  /* ------------------------------------------------------------- dates -- */

  const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); };
  const todayKey = () => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  };
  const thisYear = () => new Date().getFullYear();

  /* An edition with dates is upcoming until its last day has passed. One with
     only a year is upcoming only in a later year — we do not know its month,
     so claiming it is still to come inside its own year would be a guess. */
  function isUpcoming(e) {
    if (e.date) return (e.dateEnd || e.date) >= todayKey();
    return e.year > thisYear();
  }
  const isOpen = e => e.deadline && e.deadline >= todayKey();

  function fmtDay(iso) {
    return new Intl.DateTimeFormat(L() === "tr" ? "tr-TR" : "en-GB",
      { day: "numeric", month: "long", year: "numeric" }).format(parse(iso));
  }
  function fmtWhen(e) {
    if (!e.date) return String(e.year);
    const f = new Intl.DateTimeFormat(L() === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
    const a = parse(e.date);
    if (!e.dateEnd) return f.format(a);
    const b = parse(e.dateEnd);
    return f.formatRange ? f.formatRange(a, b) : `${f.format(a)} – ${f.format(b)}`;
  }

  /* ------------------------------------------------------------- cards -- */

  const ICON_OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10"/></svg>';
  const ICON_SLIDES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 20h8M12 17v3"/></svg>';

  const hostOf = url => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; } };
  const btn = (href, label, cls, icon, external) =>
    `<a class="btn ${cls} btn-sm" href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ""}>${icon || ""}${esc(label)}</a>`;

  /* The series card. A link card, like the ones on the Funding page. */
  function seriesCard(s, compact) {
    const next = EDITIONS
      .filter(e => e.series === s.key && isUpcoming(e))
      .sort((a, b) => (a.date || String(a.year)) < (b.date || String(b.year)) ? -1 : 1)[0];
    const meta = [field(s, "freq"), field(s, "when")].filter(Boolean).join(" · ");
    const note = field(s, "note");
    return `
      <a class="card card-link fund-card${compact ? " fund-compact" : ""}" href="${esc(s.url)}" target="_blank" rel="noopener">
        <div class="fund-head">
          <h3>${esc(s.name)}</h3>
          ${s.short ? `<span class="chip">${esc(s.short)}</span>` : ""}
        </div>
        ${meta ? `<span class="chip chip-accent fund-kind">${esc(meta)}</span>` : ""}
        <p class="fund-what">${esc(field(s, "what"))}</p>
        ${note && !compact ? `<p class="fund-note">${esc(note)}</p>` : ""}
        ${next ? `<p class="fund-note"><strong>${esc(Site.t("confNext"))}:</strong> ${esc(next.city)}, ${esc(fmtWhen(next))}</p>` : ""}
        <span class="fund-host mono">${esc(hostOf(s.url))}${ICON_OUT}</span>
      </a>`;
  }

  /* The edition card, built on the same markup as a talk. */
  function editionCard(e) {
    const s = byKey[e.series] || { name: e.series, short: "" };
    const roles = (e.roles || []).filter(r => ROLES[r]);
    const place = [e.city, field(e, "country")].filter(Boolean).join(", ");
    const sub = [field(e, "edition"), place].filter(Boolean).join(" · ");
    const note = field(e, "note");
    const talk = e.talk && TALKS.find(t => t.date === e.talk);

    const links = [
      e.url && btn(e.url, Site.t("confSite"), "btn-ghost", "", true),
      talk && talk.slides && btn(talk.slides, Site.t("talkSlides"), "btn-primary", ICON_SLIDES),
      !e.url && s.url && btn(s.url, Site.t("confSeriesSite"), "btn-ghost", "", true)
    ].filter(Boolean).join("");

    return `
      <article class="talk">
        <div class="talk-date">${esc(fmtWhen(e))}</div>
        <div class="talk-body">
          <div class="talk-chips">
            ${roles.map(r => `<span class="chip chip-accent">${esc(Site.pick(ROLES[r]))}</span>`).join("")}
            ${isOpen(e) ? `<span class="chip chip-live">${esc(Site.t("confDeadline"))}: ${esc(fmtDay(e.deadline))}</span>` : ""}
          </div>
          <h3>${esc(s.name)}</h3>
          ${sub ? `<p class="talk-sub">${esc(sub)}</p>` : ""}
          ${note ? `<p class="talk-with">${esc(note)}</p>` : ""}
          ${talk ? `<p class="talk-event">${esc(Site.pick(talk, "title"))}</p>` : ""}
          ${links ? `<div class="talk-links">${links}</div>` : ""}
        </div>
      </article>`;
  }

  /* ----------------------------------------------------------- sections -- */

  function fill(id, html) {
    const el = document.getElementById(id);
    if (!el) return;
    const section = el.closest("[data-conf-section]") || el;
    section.hidden = !html;
    el.innerHTML = html;
  }

  function matches(s, q) {
    if (!q) return true;
    const hay = [s.name, s.short, s.tags, field(s, "what"), field(s, "note"),
      field(s, "freq"), field(s, "when"),
      GROUPS[s.group] ? Site.pick(GROUPS[s.group]) : ""].join(" ").toLowerCase();
    return q.split(/\s+/).every(w => hay.includes(w));
  }

  function stats() {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const record = EDITIONS.filter(e => (e.roles || []).length);
    const countries = new Set(EDITIONS.map(e => e.country).filter(Boolean));
    set("n-series", SERIES.length);
    set("n-editions", EDITIONS.length);
    set("n-record", record.length);
    set("n-countries", countries.size);
    if (CHECKED) document.querySelectorAll("[data-conf-checked]")
      .forEach(el => { el.textContent = fmtDay(CHECKED); });
  }

  function render() {
    stats();

    const sortSoonest = (a, b) => ((a.date || String(a.year)) < (b.date || String(b.year)) ? -1 : 1);
    const sortLatest  = (a, b) => ((a.date || String(a.year)) < (b.date || String(b.year)) ? 1 : -1);

    fill("conf-calls",
      EDITIONS.filter(isOpen).sort((a, b) => (a.deadline < b.deadline ? -1 : 1)).map(editionCard).join(""));

    fill("conf-upcoming",
      EDITIONS.filter(isUpcoming).sort(sortSoonest).map(editionCard).join(""));

    fill("conf-record",
      EDITIONS.filter(e => !isUpcoming(e) && (e.roles || []).length).sort(sortLatest).map(editionCard).join(""));

    const often = document.getElementById("conf-often");
    if (often) often.innerHTML = SERIES.filter(s => s.often).map(s => seriesCard(s, true)).join("");

    const q = (search && search.value.trim().toLowerCase()) || "";
    let shown = 0;

    host.innerHTML = Object.keys(GROUPS).map(key => {
      const list = SERIES.filter(s => s.group === key && matches(s, q));
      if (!list.length) return "";
      shown += list.length;
      const g = GROUPS[key];
      const blurb = field(g, "blurb");
      return `
        <section class="fund-group" id="group-${esc(key)}">
          <div class="section-head">
            <h2>${esc(Site.pick(g))}</h2>
            ${blurb ? `<p class="lede">${esc(blurb)}</p>` : ""}
          </div>
          <div class="grid fund-grid">${list.map(s => seriesCard(s)).join("")}</div>
        </section>`;
    }).join("");

    if (!shown) {
      host.innerHTML = `<p class="muted" style="padding:1rem 0">${esc(Site.t("noResults"))}
        <button class="btn btn-ghost btn-sm" type="button" data-clear>${esc(Site.t("clearFilters"))}</button></p>`;
      const b = host.querySelector("[data-clear]");
      if (b) b.addEventListener("click", () => { if (search) search.value = ""; render(); });
    }

    if (countEl) countEl.textContent = shown + " " + Site.t(shown === 1 ? "resultsOne" : "resultsMany");
  }

  if (search) search.addEventListener("input", Site.debounce(render, 120));
  document.addEventListener("langchange", render);
  render();
})();
