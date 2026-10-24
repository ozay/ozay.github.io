/* ===========================================================================
   Shared slide engine for the decks on ozay.github.io.

   A deck is one element marked [data-deck] whose children are
   <section class="slide" data-title="…">. Load deck.css in <head> and this
   script at the end of <body>, before any script of the deck's own.
   talks/_template/ is a working starter.

   Options, as attributes on the [data-deck] element
     data-back="../../research.html"   link at the left of the bar
     data-back-label="Research"
     data-label="ENMU2050 · Week 1"    shown in the bar, if the deck styles it
     data-themes="light dark"          offer a light/dark toggle
     data-author="Özay Özaydın"        name shown by .deck-brand
     data-url="https://…"              address for .deck-qr (else the canonical link)

   Inside slides
     <aside class="notes">…</aside>    speaker notes, shown in the presenter view only
     <div class="deck-qr"></div>        QR code to the deck's address
     <div class="deck-brand"></div>     logo and name
     <button data-go="5">…</button>    jump to slide 5

   For the deck's own scripts (window.Deck)
     Deck.go(n)  Deck.next()  Deck.prev()  Deck.current  Deck.count
     Deck.onEnter(n, fn)   run fn each time slide n (1-based) becomes current
     The same moment is also a 'deck:enter' event on document, detail {index, slide}.
   =========================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const deckEl = document.querySelector("[data-deck]");
  if (!deckEl) return;

  // Captured now: currentScript is only set while this file first runs.
  const BASE = (document.currentScript && document.currentScript.src) || new URL("assets/deck/deck.js", location.href).href;
  const asset = p => new URL(p, BASE).href;

  const params = new URLSearchParams(location.search);
  const MODE = params.has("presenter") ? "presenter" : params.has("embed") ? "embed" : "deck";
  const PAGE_URL = location.href.split(/[?#]/)[0];

  const slides = [...deckEl.children].filter(el => el.classList.contains("slide"));
  const N = slides.length;
  if (!N) return;

  const TR = (root.lang || "").toLowerCase().startsWith("tr");
  const T = TR ? {
    prev: "Önceki slayt", next: "Sonraki slayt", slides: "Slaytlar", all: "Tüm slaytlar", close: "Kapat",
    presenter: "Sunucu", fs: "Tam ekran", fsExit: "Tam ekrandan çık", dark: "Koyu", light: "Açık",
    slide: "Slayt", of: "/", popup: "Sunucu görünümü için açılır pencerelere izin verin.",
    current: "Şimdiki", upNext: "Sıradaki", notes: "Notlar", noNotes: "Bu slayt için not yok.",
    end: "Sunumun sonu", pause: "Duraklat", resume: "Sürdür", reset: "Sıfırla",
    keys: ["sonraki / önceki", "slaytlar", "tam ekran", "sunucu görünümü", "siyah ekran", "o slayta git", "kapat"]
  } : {
    prev: "Previous slide", next: "Next slide", slides: "Slides", all: "All slides", close: "Close",
    presenter: "Presenter", fs: "Full screen", fsExit: "Exit full screen", dark: "Dark", light: "Light",
    slide: "Slide", of: "of", popup: "Allow pop-ups for this site to open the presenter view.",
    current: "Current", upNext: "Next", notes: "Notes", noNotes: "No notes for this slide.",
    end: "End of deck", pause: "Pause", resume: "Resume", reset: "Reset",
    keys: ["next / previous", "all slides", "full screen", "presenter view", "black screen", "go to that slide", "close"]
  };

  const titleOf = (s, i) =>
    s.dataset.title || (s.querySelector("h1, h2, h3") || {}).textContent?.trim() || `${T.slide} ${i + 1}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let cur = 0;                // 1-based once the deck starts
  const hooks = {};

  /* ------------------------------------------------------------ theme --- */
  const themes = (deckEl.dataset.themes || "").split(/\s+/);
  const canDark = themes.includes("dark");
  if (canDark) {
    try { const t = localStorage.getItem("ozay-theme"); if (t && !root.dataset.theme) root.dataset.theme = t; } catch (e) { /* storage off */ }
  }
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;

  /* ------------------------------------------------------------ shell --- */
  root.classList.add("deck-html");
  document.body.classList.add("deck-body");
  const shell = document.createElement("div");
  shell.className = "deck-root";
  shell.dataset.mode = MODE;
  deckEl.parentNode.insertBefore(shell, deckEl);
  shell.appendChild(deckEl);
  deckEl.classList.add("deck-stage");
  deckEl.setAttribute("tabindex", "-1");

  const backHref = deckEl.dataset.back;
  const bar = document.createElement("nav");
  bar.className = "deck-bar";
  bar.setAttribute("aria-label", TR ? "Slayt gezinme" : "Slide navigation");
  bar.innerHTML =
    (backHref ? `<a class="deck-back" href="${esc(backHref)}"><span aria-hidden="true">←</span><span class="deck-back-label">${esc(deckEl.dataset.backLabel || "Back")}</span></a>` : "") +
    `<button class="deck-btn deck-prev" type="button" aria-label="${T.prev}">‹</button>` +
    `<div class="deck-track"><div class="deck-track-fill"></div><div class="deck-stops"></div><div class="deck-marker" aria-hidden="true"></div></div>` +
    `<span class="deck-count"></span>` +
    `<button class="deck-btn deck-next" type="button" aria-label="${T.next}">›</button>` +
    `<span class="deck-where"><span class="deck-label">${esc(deckEl.dataset.label || "")}</span><b class="deck-slide-title"></b></span>` +
    `<button class="deck-tool" type="button" data-act="overview">${T.slides}</button>` +
    `<button class="deck-tool hide-sm" type="button" data-act="presenter">${T.presenter}</button>` +
    (canDark ? `<button class="deck-tool" type="button" data-act="theme"></button>` : "") +
    `<button class="deck-tool hide-sm" type="button" data-act="fullscreen">${T.fs}</button>`;
  shell.appendChild(bar);

  const $b = sel => bar.querySelector(sel);
  const track = $b(".deck-track"), fill = $b(".deck-track-fill"), stopsEl = $b(".deck-stops"),
        marker = $b(".deck-marker"), countEl = $b(".deck-count"), titleEl = $b(".deck-slide-title"),
        prevBtn = $b(".deck-prev"), nextBtn = $b(".deck-next");

  // a deck can supply its own progress marker (the Kapıkule deck drives a truck)
  const tpl = document.getElementById("deck-marker");
  if (tpl && tpl.content) marker.appendChild(tpl.content.cloneNode(true));

  const pct = i => (N > 1 ? (i / (N - 1)) * 100 : 0);
  slides.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "deck-stop";
    b.style.left = pct(i) + "%";
    b.setAttribute("aria-label", `${T.slide} ${i + 1}: ${titleOf(s, i)}`);
    b.dataset.go = String(i + 1);
    stopsEl.appendChild(b);
  });
  const stops = [...stopsEl.children];
  track.addEventListener("click", e => {
    if (e.target.closest(".deck-stop")) return;
    const r = track.getBoundingClientRect();
    go(Math.round(((e.clientX - r.left) / r.width) * (N - 1)) + 1);
  });

  /* --------------------------------------------------------- overview --- */
  const ov = document.createElement("div");
  ov.className = "deck-overview";
  ov.hidden = true;
  ov.setAttribute("role", "dialog");
  ov.setAttribute("aria-label", T.all);
  ov.innerHTML =
    `<div class="deck-ov-head"><h2>${T.all}</h2><button type="button" data-act="overview-close">${T.close}</button></div>` +
    `<div class="deck-ov-grid">${slides.map((s, i) => `<button type="button" data-go="${i + 1}"><small>${i + 1}</small>${esc(titleOf(s, i))}</button>`).join("")}</div>` +
    `<p class="deck-ov-keys"><kbd>→</kbd><kbd>←</kbd>${T.keys[0]} &nbsp; <kbd>O</kbd>${T.keys[1]} &nbsp; <kbd>F</kbd>${T.keys[2]} &nbsp; ` +
    `<kbd>P</kbd>${T.keys[3]} &nbsp; <kbd>B</kbd>${T.keys[4]} &nbsp; <kbd>1</kbd><kbd>2</kbd><kbd>↵</kbd>${T.keys[5]} &nbsp; <kbd>Esc</kbd>${T.keys[6]}</p>`;
  shell.appendChild(ov);

  function toggleOverview(open) {
    open = open === undefined ? ov.hidden : open;
    ov.hidden = !open;
    if (open) {
      [...ov.querySelectorAll(".deck-ov-grid button")].forEach((b, i) => b.classList.toggle("is-current", i === cur - 1));
      const c = ov.querySelector(".is-current"); c && c.focus();
    } else {
      deckEl.focus({ preventScroll: true });
    }
  }

  /* -------------------------------------------- blackout, toast, live --- */
  const black = document.createElement("div");
  black.className = "deck-blackout";
  black.hidden = true;
  black.addEventListener("click", () => toggleBlack(false));
  document.body.appendChild(black);
  function toggleBlack(on) { black.hidden = on === undefined ? !black.hidden : !on; }

  const toastEl = document.createElement("div");
  toastEl.className = "deck-toast";
  toastEl.hidden = true;
  toastEl.setAttribute("role", "status");
  document.body.appendChild(toastEl);
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 4000);
  }

  const live = document.createElement("div");
  live.className = "deck-live";
  live.setAttribute("aria-live", "polite");
  document.body.appendChild(live);

  /* --------------------------------------------------------------- go --- */
  function go(n, opts) {
    opts = opts || {};
    n = Math.max(1, Math.min(N, Math.round(+n) || 1));
    const changed = n !== cur;
    cur = n;

    slides.forEach((s, i) => {
      const on = i === n - 1;
      s.classList.toggle("is-active", on);
      s.classList.toggle("is-past", i < n - 1);
      s.setAttribute("aria-hidden", String(!on));
      if (on) s.removeAttribute("inert"); else s.setAttribute("inert", "");
    });
    slides[n - 1].scrollTop = 0;

    fill.style.width = pct(n - 1) + "%";
    marker.style.left = pct(n - 1) + "%";
    stops.forEach((b, i) => b.classList.toggle("on", i <= n - 1));
    countEl.textContent = `${n} / ${N}`;
    titleEl.textContent = titleOf(slides[n - 1], n - 1);
    prevBtn.disabled = n === 1;
    nextBtn.disabled = n === N;

    if (MODE !== "embed" && !opts.silentHash) {
      try { history.replaceState(null, "", "#" + n); } catch (e) { /* file:// in some browsers */ }
    }
    if (MODE === "deck" && changed) live.textContent = `${T.slide} ${n} ${T.of} ${N}: ${titleOf(slides[n - 1], n - 1)}`;

    if (changed || opts.force) {
      if (MODE !== "presenter") {
        (hooks[n] || []).forEach(fn => { try { fn(slides[n - 1]); } catch (err) { console.error(err); } });
        const ev = new CustomEvent("deck:enter", { detail: { index: n, slide: slides[n - 1] } });
        slides[n - 1].dispatchEvent(ev);
        document.dispatchEvent(new CustomEvent("deck:enter", { detail: { index: n, slide: slides[n - 1] } }));
      }
      if (MODE === "presenter") updatePresenter();
      if (!opts.remote) broadcast(n);
    }
  }
  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return 1;
    if (/^\d+$/.test(h)) return +h;
    const m = /^[sp](\d+)$/.exec(h);              // older links: #s3 (Kapıkule), #p3 (lectures)
    if (m) return +m[1];
    const byId = slides.findIndex(s => s.id === h);
    return byId >= 0 ? byId + 1 : 1;
  }
  addEventListener("hashchange", () => { const n = fromHash(); if (n !== cur) go(n); });

  /* ------------------------------------------------------- controls --- */
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  document.addEventListener("click", e => {
    const act = e.target.closest("[data-act]");
    if (act && (bar.contains(act) || ov.contains(act))) {
      const a = act.dataset.act;
      if (a === "overview") toggleOverview();
      else if (a === "overview-close") toggleOverview(false);
      else if (a === "presenter") openPresenter();
      else if (a === "fullscreen") fullscreen();
      else if (a === "theme") toggleTheme();
      return;
    }
    const g = e.target.closest("[data-go]");
    if (g && (deckEl.contains(g) || ov.contains(g) || stopsEl.contains(g))) {
      e.preventDefault();
      if (!ov.hidden) toggleOverview(false);
      go(+g.dataset.go);
    }
  });

  let digits = "", digitTimer;
  document.addEventListener("keydown", e => {
    if (MODE === "embed" || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t.closest && t.closest("input, textarea, select, [contenteditable='true']")) return;
    const k = e.key;

    if (!ov.hidden) {
      if (k === "Escape" || k === "o" || k === "O") { e.preventDefault(); toggleOverview(false); }
      return;
    }
    if (!black.hidden) {
      if (["b", "B", ".", "Escape"].includes(k)) { e.preventDefault(); toggleBlack(false); }
      return;
    }
    const onButton = t.closest && t.closest("button, a, summary, [role='button']");

    if (k === "ArrowRight" || k === "PageDown" || (k === " " && !e.shiftKey && !onButton)) { e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "PageUp" || (k === " " && e.shiftKey && !onButton)) { e.preventDefault(); prev(); }
    else if (k === "Home") { e.preventDefault(); go(1); }
    else if (k === "End") { e.preventDefault(); go(N); }
    else if (MODE === "deck" && (k === "o" || k === "O")) toggleOverview();
    else if (MODE === "deck" && (k === "f" || k === "F")) fullscreen();
    else if (MODE === "deck" && (k === "p" || k === "P")) openPresenter();
    else if (MODE === "deck" && (k === "b" || k === "B" || k === ".")) toggleBlack();
    else if (/^[0-9]$/.test(k)) {
      digits += k;
      clearTimeout(digitTimer);
      digitTimer = setTimeout(() => { digits = ""; }, 1600);
    } else if (k === "Enter" && digits) {
      e.preventDefault();
      go(+digits);
      digits = "";
    }
  });

  // swipe on touch screens, unless the gesture starts on something that drags or scrolls sideways
  let touch = null;
  deckEl.addEventListener("touchstart", e => {
    touch = null;
    if (e.touches.length !== 1) return;
    const t = e.target;
    if (t.closest("input, textarea, select, svg, canvas, [data-noswipe]")) return;
    for (let el = t; el && el !== deckEl; el = el.parentElement) {
      if (el.scrollWidth > el.clientWidth + 1 && /(auto|scroll)/.test(getComputedStyle(el).overflowX)) return;
    }
    touch = [e.touches[0].clientX, e.touches[0].clientY];
  }, { passive: true });
  deckEl.addEventListener("touchend", e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch[0], dy = e.changedTouches[0].clientY - touch[1];
    if (Math.abs(dx) > 60 && Math.abs(dx) > 1.5 * Math.abs(dy)) (dx < 0 ? next : prev)();
    touch = null;
  }, { passive: true });

  /* -------------------------------------------- full screen and theme --- */
  const fsBtn = bar.querySelector('[data-act="fullscreen"]');
  if (!root.requestFullscreen) fsBtn.hidden = true;
  function fullscreen() {
    if (!root.requestFullscreen) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else root.requestFullscreen().catch(() => {});
  }
  document.addEventListener("fullscreenchange", () => {
    fsBtn.textContent = document.fullscreenElement ? T.fsExit : T.fs;
  });

  const themeBtn = bar.querySelector('[data-act="theme"]');
  const labelTheme = () => { if (themeBtn) themeBtn.textContent = isDark() ? T.light : T.dark; };
  function toggleTheme() {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("ozay-theme", root.dataset.theme); } catch (e) { /* storage off */ }
    labelTheme();
  }
  labelTheme();

  // a printed deck is for paper and PDFs, so print the light version
  let themeBeforePrint;
  addEventListener("beforeprint", () => {
    if (!canDark) return;
    themeBeforePrint = root.dataset.theme;
    root.dataset.theme = "light";
  });
  addEventListener("afterprint", () => {
    if (!canDark) return;
    if (themeBeforePrint === undefined) delete root.dataset.theme; else root.dataset.theme = themeBeforePrint;
  });

  /* --------------------------------------------------- brand and QR --- */
  const author = deckEl.dataset.author || "Özay Özaydın";
  document.querySelectorAll(".deck-brand").forEach(b => {
    if (b.children.length) return;
    b.innerHTML = `<img src="${asset("../img/logo.svg")}" alt="" width="36" height="24"><span>${esc(author)}</span>`;
  });

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const qrHolders = document.querySelectorAll(".deck-qr");
  if (qrHolders.length) {
    const canon = document.querySelector('link[rel="canonical"]');
    const url = deckEl.dataset.url || (canon && canon.href) || PAGE_URL;
    const shortUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    loadScript(asset("vendor/qrcode.min.js")).then(() => {
      qrHolders.forEach(h => {
        const qr = window.qrcode(0, "M");
        qr.addData(url);
        qr.make();
        // a four-module quiet zone, as the QR spec asks, so it scans off a dark slide too
        h.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true, alt: url }) +
          (h.dataset.label === "off" ? "" : `<span class="deck-qr-url">${esc(shortUrl)}</span>`);
      });
    }).catch(() => { /* the QR is a convenience; the deck works without it */ });
  }

  /* ------------------------------------------------ presenter sync --- */
  // The audience window and the presenter window keep each other on the same
  // slide. Messages carry nothing but a slide number, and each side accepts
  // them only from the one window it is paired with.
  let presWin = null;
  function broadcast(n) {
    try {
      if (MODE === "deck" && presWin && !presWin.closed) presWin.postMessage({ deck: "go", n }, "*");
      if (MODE === "presenter" && window.opener && !window.opener.closed) window.opener.postMessage({ deck: "go", n }, "*");
    } catch (e) { /* the other window went away */ }
  }
  addEventListener("message", e => {
    const d = e.data;
    if (!d || d.deck !== "go") return;
    if ((MODE === "deck" && e.source === presWin) || (MODE === "presenter" && e.source === window.opener)) go(d.n, { remote: true });
  });

  function openPresenter() {
    if (MODE !== "deck") return;
    if (presWin && !presWin.closed) { presWin.focus(); return; }
    presWin = window.open(`${PAGE_URL}?presenter#${cur}`, "deck-presenter", "width=1280,height=800");
    if (!presWin) toast(T.popup);
  }

  /* ----------------------------------------------- presenter window --- */
  let P = null;
  function buildPresenter() {
    document.body.classList.add("deck-presenter-body");
    document.title = `${T.presenter} — ${document.title}`;

    // the frames show slides at the audience window's size, scaled down
    let W = 1280, H = 720;
    try { if (window.opener && window.opener.innerWidth) { W = window.opener.innerWidth; H = window.opener.innerHeight; } } catch (e) { /* other origin */ }

    const el = document.createElement("div");
    el.className = "deck-presenter";
    el.innerHTML =
      `<header class="p-head">` +
        `<div class="p-timer"><span class="p-elapsed">00:00</span>` +
        `<button type="button" data-p="pause">${T.pause}</button><button type="button" data-p="reset">${T.reset}</button></div>` +
        `<div class="p-clock"></div>` +
        `<div class="p-nav"><button type="button" data-p="prev" aria-label="${T.prev}">‹</button><span class="p-count"></span>` +
        `<button type="button" data-p="next" aria-label="${T.next}">›</button></div>` +
      `</header>` +
      `<section class="p-cur"><p class="p-label">${T.current}</p><div class="p-frame" data-f="cur"><iframe title="${T.current}" tabindex="-1"></iframe></div></section>` +
      `<section class="p-side"><p class="p-label">${T.upNext}</p><div class="p-frame" data-f="next" data-msg="${T.end}"><iframe title="${T.upNext}" tabindex="-1"></iframe></div>` +
      `<p class="p-label" style="margin-top:10px">${T.notes}</p><div class="p-notes"></div></section>`;
    document.body.appendChild(el);

    const frames = [...el.querySelectorAll(".p-frame")];
    frames.forEach(f => {
      f.style.aspectRatio = `${W} / ${H}`;
      const ifr = f.querySelector("iframe");
      ifr.width = W;
      ifr.height = H;
      ifr.src = `${PAGE_URL}?embed#1`;
    });
    const fit = () => frames.forEach(f => {
      f.querySelector("iframe").style.transform = `scale(${f.clientWidth / W})`;
    });
    new ResizeObserver(fit).observe(el);
    fit();

    // timer
    let started = Date.now(), pausedAt = null, offset = 0;
    const elapsedEl = el.querySelector(".p-elapsed"), clockEl = el.querySelector(".p-clock");
    const pauseBtn = el.querySelector('[data-p="pause"]');
    const two = n => String(n).padStart(2, "0");
    const tick = () => {
      const ms = (pausedAt || Date.now()) - started - offset;
      const s = Math.max(0, Math.floor(ms / 1000));
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
      elapsedEl.textContent = (h ? h + ":" + two(m) : two(m)) + ":" + two(s % 60);
      const now = new Date();
      clockEl.textContent = two(now.getHours()) + ":" + two(now.getMinutes());
    };
    setInterval(tick, 500);
    tick();
    el.addEventListener("click", e => {
      const b = e.target.closest("[data-p]");
      if (!b) return;
      const p = b.dataset.p;
      if (p === "prev") prev();
      else if (p === "next") next();
      else if (p === "pause") {
        if (pausedAt) { offset += Date.now() - pausedAt; pausedAt = null; }
        else pausedAt = Date.now();
        pauseBtn.textContent = pausedAt ? T.resume : T.pause;
        elapsedEl.classList.toggle("is-paused", !!pausedAt);
      } else if (p === "reset") { started = Date.now(); offset = 0; if (pausedAt) pausedAt = Date.now(); tick(); }
    });

    P = { el, frames, count: el.querySelector(".p-count"), notes: el.querySelector(".p-notes") };
  }

  function updatePresenter() {
    if (!P) return;
    const [curF, nextF] = P.frames;
    curF.querySelector("iframe").src = `${PAGE_URL}?embed#${cur}`;
    const hasNext = cur < N;
    nextF.classList.toggle("p-done", !hasNext);
    if (hasNext) nextF.querySelector("iframe").src = `${PAGE_URL}?embed#${cur + 1}`;
    P.count.textContent = `${cur} / ${N}`;
    const notes = slides[cur - 1].querySelector(".notes");
    P.notes.innerHTML = notes && notes.innerHTML.trim() ? notes.innerHTML : `<p class="p-empty">${T.noNotes}</p>`;
  }

  /* ------------------------------------------------------------ start --- */
  // Waits for DOMContentLoaded so that a deck's own script, which runs after
  // this one, has registered its Deck.onEnter hooks before the first slide.
  function start() {
    if (MODE === "presenter") buildPresenter();
    go(fromHash(), { force: true, remote: true, silentHash: MODE === "embed" });
    deckEl.scrollTop = 0;
    deckEl.scrollLeft = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => shell.classList.add("is-ready")));
  }

  window.Deck = {
    go: n => go(n),
    next,
    prev,
    get current() { return cur; },
    count: N,
    mode: MODE,
    onEnter(n, fn) { (hooks[n] = hooks[n] || []).push(fn); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else setTimeout(start, 0);
})();
