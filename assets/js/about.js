/* About page: renders the career timeline from SITE_TIMELINE. */
(function () {
  "use strict";

  const ICONS = {
    edu:      '<path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 11.5V16c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-4.5"/>',
    work:     '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
    research: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    teaching: '<path d="M4 6h16v11H4z"/><path d="M9 21h6"/><path d="M12 17v4"/>',
    service:  '<path d="m12 3 2.6 5.5 6 .9-4.3 4.3 1 6-5.3-2.9L6.7 19.7l1-6L3.4 9.4l6-.9L12 3Z"/>'
  };

  function range(item) {
    if (item.to && item.to !== item.from) return item.from + " – " + item.to;
    return String(item.from);
  }

  function render() {
    const host = document.getElementById("timeline");
    if (!host) return;
    const items = (window.SITE_TIMELINE || []).slice().sort((a, b) => a.from - b.from);

    host.innerHTML = items.map((it, i) => `
      <div class="tl-item tl-kind-${it.kind} reveal" data-reveal-delay="${Math.min(i * 50, 400)}">
        <span class="tl-dot" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[it.kind] || ICONS.work}</svg>
        </span>
        <p class="tl-year mono">${range(it)}</p>
        <h3>${Site.esc(Site.pick(it, "title"))}</h3>
        <p class="tl-org">${Site.esc(Site.pick(it, "org"))}</p>
        <p>${Site.esc(Site.pick(it, "body"))}</p>
      </div>`).join("");

    // the markup was just replaced, so the reveal observer needs re-arming
    if (Site.reduced) {
      host.querySelectorAll(".reveal").forEach(el => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          const el = en.target;
          setTimeout(() => el.classList.add("is-in"), parseInt(el.dataset.revealDelay || "0", 10));
          io.unobserve(el);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      host.querySelectorAll(".reveal").forEach(el => io.observe(el));
    }
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("langchange", render);
})();
