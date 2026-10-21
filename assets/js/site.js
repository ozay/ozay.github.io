/* ===========================================================================
   Shared behaviour: theme, language, nav, scroll progress, reveals, counters.
   Loaded on every page, before the page-specific script.
   =========================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- theme --- */
  const THEME_KEY = "ozay-theme";
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    document.querySelectorAll("[data-theme-toggle]").forEach(b => {
      b.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
      b.setAttribute("aria-pressed", String(t === "dark"));
    });
  }
  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* private mode */ }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(stored || (prefersDark ? "dark" : "light"));
  }
  function toggleTheme() {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    document.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  }

  /* ------------------------------------------------------- language --- */
  const LANG_KEY = "ozay-lang";
  function applyLang(l) {
    root.setAttribute("lang", l);
    document.querySelectorAll("[data-lang-btn]").forEach(b => {
      b.setAttribute("aria-pressed", String(b.dataset.langBtn === l));
    });
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const v = window.I18N && window.I18N[l] && window.I18N[l][el.dataset.i18n];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      // format: "placeholder:searchPubs" or "aria-label:menu"
      el.dataset.i18nAttr.split(";").forEach(pair => {
        const [attr, key] = pair.split(":");
        const v = window.I18N && window.I18N[l] && window.I18N[l][key];
        if (v != null) el.setAttribute(attr, v);
      });
    });
    document.title = titleFor(l);
    document.dispatchEvent(new CustomEvent("langchange", { detail: l }));
  }
  function titleFor(l) {
    const base = document.body.dataset["title" + (l === "tr" ? "Tr" : "En")];
    return base || document.title;
  }
  function initLang() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    let stored = null;
    try { stored = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
    const l = (fromUrl === "tr" || fromUrl === "en") ? fromUrl
            : (stored === "tr" || stored === "en") ? stored
            : (navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "en";
    applyLang(l);
  }
  function setLang(l) {
    applyLang(l);
    try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------ nav --- */
  function initNav() {
    const nav = document.querySelector(".nav");
    const toggle = document.querySelector("[data-nav-toggle]");
    const links = document.querySelector(".nav-links");
    const progress = document.querySelector(".progress");

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.addEventListener("click", e => {
        if (e.target.closest("a")) { links.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
      });
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (nav) nav.classList.toggle("is-stuck", y > 8);
        if (progress) {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + "%";
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // mark the current page in the nav
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(a => {
      const target = a.getAttribute("href").split("?")[0];
      if (target === here || (here === "" && target === "index.html")) a.setAttribute("aria-current", "page");
    });
  }

  /* --------------------------------------------------------- reveals --- */
  function initReveals() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const delay = parseInt(el.dataset.revealDelay || "0", 10);
        setTimeout(() => el.classList.add("is-in"), delay);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(el => io.observe(el));

    // Backstop: anything still hidden after a few seconds is shown regardless.
    // A missed observer callback must never cost the reader the content.
    setTimeout(() => items.forEach(el => el.classList.add("is-in")), 2500);
  }

  /* -------------------------------------------------------- counters --- */
  function initCounters() {
    const nums = document.querySelectorAll("[data-count-to]");
    if (!nums.length) return;
    const run = el => {
      const to = parseFloat(el.dataset.countTo);
      if (reduced) { el.textContent = String(to); return; }
      // A background or non-composited page never delivers an animation
      // frame, so write the real number if the first frame does not arrive.
      el.dataset.counted = "1";
      let started = false;
      const fallback = setTimeout(() => { if (!started) el.textContent = String(to); }, 500);
      const dur = 1100, t0 = performance.now();
      const step = now => {
        started = true;
        clearTimeout(fallback);
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    nums.forEach(el => {
      io.observe(el);
      // These are figures, not decoration. If the observer never delivers —
      // a background render, an aborted paint — the real number must still
      // appear rather than leaving a placeholder on screen.
      setTimeout(() => {
        if (!el.dataset.counted) { el.dataset.counted = "1"; el.textContent = el.dataset.countTo; }
      }, 1200);
    });
  }

  /* ---------------------------------------------------- hero rotator --- */
  function initRotator() {
    const el = document.querySelector("[data-rotator]");
    if (!el) return;
    const render = () => {
      const lang = root.getAttribute("lang");
      const list = (window.I18N[lang] && window.I18N[lang].rotator) || [];
      if (!list.length) return;
      let i = 0;
      el.innerHTML = "<b>" + list[0] + "</b>";
      if (reduced) return;
      clearInterval(el._timer);
      el._timer = setInterval(() => {
        i = (i + 1) % list.length;
        el.innerHTML = "<b>" + list[i] + "</b>";
      }, 2600);
    };
    render();
    document.addEventListener("langchange", render);
  }

  /* ------------------------------------------------------ copy-to-clip -- */
  function initCopy() {
    document.addEventListener("click", async e => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const old = btn.getAttribute("aria-label");
        btn.setAttribute("aria-label", "Copied");
        btn.classList.add("is-copied");
        setTimeout(() => { btn.setAttribute("aria-label", old || ""); btn.classList.remove("is-copied"); }, 1400);
      } catch (err) { /* clipboard unavailable */ }
    });
  }

  /* ------------------------------------------------------------ year --- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(el => { el.textContent = String(new Date().getFullYear()); });
  }

  /* ------------------------------------------------------------- boot --- */
  initTheme();   // before paint-sensitive work
  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initNav();
    initReveals();
    initCounters();
    initRotator();
    initCopy();
    initYear();
    document.querySelectorAll("[data-theme-toggle]").forEach(b => b.addEventListener("click", toggleTheme));
    document.querySelectorAll("[data-lang-btn]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.langBtn)));
  });

  /* -------------------------------------------------------- utilities --- */
  window.Site = {
    lang: () => root.getAttribute("lang") || "en",
    reduced,
    t(key) { const l = this.lang(); return (window.I18N[l] && window.I18N[l][key]) || key; },
    /** Pick the right field from an {en,tr} pair or an object with en/tr suffixes. */
    pick(obj, base) {
      if (!obj) return "";
      const l = this.lang();
      if (obj[base + (l === "tr" ? "Tr" : "En")] != null) return obj[base + (l === "tr" ? "Tr" : "En")];
      return obj[l] != null ? obj[l] : (obj.en != null ? obj.en : "");
    },
    esc(s) {
      return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    },
    /** Re-scan for [data-count-to] after a page script has injected values. */
    counters() { initCounters(); },
    debounce(fn, ms) {
      let t; return function () { clearTimeout(t); const a = arguments, c = this; t = setTimeout(() => fn.apply(c, a), ms); };
    }
  };
})();
