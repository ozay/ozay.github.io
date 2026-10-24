/* Funding: renders the pinned band (#funding-often) and the grouped,
   filterable list (#funding-groups) on the Funding page.
   Everything comes from assets/data/funding.js. */
(function () {
  "use strict";

  const ITEMS = window.SITE_FUNDING || [];
  const GROUPS = window.SITE_FUNDING_GROUPS || {};
  const KINDS = window.SITE_FUNDING_KINDS || {};

  const often = document.getElementById("funding-often");
  const host = document.getElementById("funding-groups");
  if (!host && !often) return;

  const search = document.getElementById("funding-search");
  const kindSel = document.getElementById("kind-filter");
  const countEl = document.getElementById("funding-count");

  const esc = s => Site.esc(s);
  const field = (o, base) => o[base + (Site.lang() === "tr" ? "Tr" : "En")] ?? o[base] ?? "";

  /* The host name, for the little grey line under the link. */
  const host_of = url => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; } };

  const ICON_OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10"/></svg>';

  function card(it, compact) {
    const kind = KINDS[it.kind] ? Site.pick(KINDS[it.kind]) : "";
    const what = field(it, "what");
    const note = field(it, "note");
    return `
      <a class="card card-link fund-card${compact ? " fund-compact" : ""}" href="${esc(it.url)}" target="_blank" rel="noopener">
        <div class="fund-head">
          <h3>${esc(it.name)}</h3>
          ${it.short ? `<span class="chip">${esc(it.short)}</span>` : ""}
        </div>
        ${kind ? `<span class="chip ${it.kind === "institute" ? "chip-live" : "chip-accent"} fund-kind">${esc(kind)}</span>` : ""}
        <p class="fund-what">${esc(what)}</p>
        ${note && !compact ? `<p class="fund-note">${esc(note)}</p>` : ""}
        <span class="fund-host mono">${esc(host_of(it.url))}${ICON_OUT}</span>
      </a>`;
  }

  function matches(it, q, kind) {
    if (kind && it.kind !== kind) return false;
    if (!q) return true;
    const hay = [it.name, it.short, it.tags, field(it, "what"), field(it, "note"),
      GROUPS[it.group] ? Site.pick(GROUPS[it.group]) : ""].join(" ").toLowerCase();
    return q.split(/\s+/).every(w => hay.includes(w));
  }

  function fillKinds() {
    if (!kindSel) return;
    const cur = kindSel.value;
    kindSel.innerHTML = `<option value="">${esc(Site.t("allKinds"))}</option>` +
      Object.keys(KINDS).map(k => `<option value="${esc(k)}">${esc(Site.pick(KINDS[k]))}</option>`).join("");
    kindSel.value = cur;
  }

  function render() {
    if (often) {
      often.innerHTML = ITEMS.filter(i => i.often).map(i => card(i, true)).join("");
    }
    if (!host) return;

    const q = (search && search.value.trim().toLowerCase()) || "";
    const kind = (kindSel && kindSel.value) || "";
    let shown = 0;

    host.innerHTML = Object.keys(GROUPS).map(key => {
      const list = ITEMS.filter(i => i.group === key && matches(i, q, kind));
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
          <div class="grid fund-grid">${list.map(i => card(i)).join("")}</div>
        </section>`;
    }).join("");

    if (!shown) {
      host.innerHTML = `<p class="muted" style="padding:1rem 0">${esc(Site.t("noResults"))}
        <button class="btn btn-ghost btn-sm" type="button" data-clear>${esc(Site.t("clearFilters"))}</button></p>`;
      const b = host.querySelector("[data-clear]");
      if (b) b.addEventListener("click", () => {
        if (search) search.value = "";
        if (kindSel) kindSel.value = "";
        render();
      });
    }

    if (countEl) {
      countEl.textContent = shown + " " + Site.t(shown === 1 ? "resultsOne" : "resultsMany");
    }
  }

  if (search) search.addEventListener("input", Site.debounce(render, 120));
  if (kindSel) kindSel.addEventListener("change", render);
  document.addEventListener("langchange", () => { fillKinds(); render(); });

  fillKinds();
  render();
})();
