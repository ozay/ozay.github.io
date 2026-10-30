/* Chess page: a dashboard over the Chess.com game archive.

   Two sources, on purpose. The headline rating and record come live from the
   public API on every visit, so the top of the page is never out of date. The
   figures come from assets/data/chess.js, which is built by
   tools/chess-refresh.py — reading a thousand games in the browser would mean
   downloading several megabytes of PGN to draw one line.                      */
(function () {
  "use strict";

  const C = window.SITE_CHESS;
  if (!C) return;

  const API = "https://api.chess.com/pub/player/" + encodeURIComponent(C.username);
  const WIN = "var(--series-3)", LOSS = "var(--series-8)", DRAW = "var(--series-4)";

  /* live values start as the built snapshot and are replaced if the API answers */
  let live = {
    rating: C.snapshot.rating,
    record: C.snapshot.record,
    best: C.snapshot.best,
    fresh: false
  };

  const num = n => (n == null ? "—" : new Intl.NumberFormat(Site.lang() === "tr" ? "tr-TR" : "en-GB").format(n));
  const pct = n => (n == null ? "—" : n.toFixed(1).replace(".", Site.lang() === "tr" ? "," : ".") + "%");
  const date = s => {
    if (!s) return "";
    return new Date(s + "T12:00:00Z").toLocaleDateString(Site.lang() === "tr" ? "tr-TR" : "en-GB",
      { year: "numeric", month: "long", day: "numeric" });
  };
  const monthName = s =>
    new Date(s + "-15T12:00:00Z").toLocaleDateString(Site.lang() === "tr" ? "tr-TR" : "en-GB",
      { month: "short", year: "2-digit" });
  const dayName = i =>
    new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(Site.lang() === "tr" ? "tr-TR" : "en-GB", { weekday: "short" });

  /* Terminations arrive from the API as English phrases; the dictionary turns
     them into UI strings. Anything unmapped falls through as it came.        */
  const ENDING_KEYS = {
    "by checkmate": "endCheckmate",
    "by resignation": "endResignation",
    "on time": "endTime",
    "abandoned": "endAbandoned",
    "stalemate": "endStalemate",
    "repetition": "endRepetition",
    "agreement": "endAgreement",
    "insufficient material": "endMaterial",
    "timeout vs insufficient material": "endTimeoutMaterial",
    "50-move rule": "endFiftyMove"
  };
  const endingName = s => (ENDING_KEYS[s] ? Site.t(ENDING_KEYS[s]) : s);

  const scoreOf = r => (r.n ? (r.w + r.d / 2) / r.n * 100 : 0);
  const wld = r => `${r.w}–${r.l}–${r.d}`;
  const tableLabels = () => ({ show: Site.t("showTable"), hide: Site.t("hideTable") });

  function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  /* ------------------------------------------------------------- tiles -- */
  function tiles() {
    const t = C.totals;
    set("k-rating", num(live.rating));
    set("k-games", num(live.record ? live.record.win + live.record.loss + live.record.draw : t.n));
    set("k-record", live.record ? `${live.record.win}–${live.record.loss}–${live.record.draw}` : wld(t));
    set("k-score", pct(live.record
      ? (live.record.win + live.record.draw / 2) / (live.record.win + live.record.loss + live.record.draw) * 100
      : t.score));
    set("k-peak", num(live.best || t.peak));
    set("k-hours", num(t.hours));
    set("k-streak", num(t.longestWin));
    set("k-opponents", num(t.opponents));

    const chip = document.getElementById("live-chip");
    if (chip) chip.hidden = !live.fresh;
    set("as-of", date(live.fresh ? new Date().toISOString().slice(0, 10) : C.asOf));
    set("built-on", date(C.asOf));
  }

  /** Refresh the headline numbers from the public API. Failure is silent:
      the built snapshot is already on the page and is only days old.        */
  function refresh() {
    if (!window.fetch) return;
    fetch(API + "/stats", { mode: "cors" })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(s => {
        const r = s && s.chess_rapid;
        if (!r || !r.last) return;
        live = { rating: r.last.rating, record: r.record, best: r.best && r.best.rating, fresh: true };
        tiles();
      })
      .catch(() => { /* offline, blocked, or the API is down — keep the snapshot */ });
  }

  /* ----------------------------------------------------------- figures -- */
  function figRating() {
    const mount = document.getElementById("fig-rating");
    if (!mount) return;
    const series = C.rating.filter(p => p.d >= C.totals.runFrom);
    Charts.line(mount, series.map(p => ({ t: p.d, v: p.r })), {
      height: 300,
      aria: Site.t("figRating"),
      refs: [{ v: live.rating || series[series.length - 1].r, label: Site.t("chessNow") }],
      format: p => `<b>${p.v}</b><br><span class="t-sub">${date(p.t)}</span>`,
      monthLabel: t => monthName(t.slice(0, 7))
    });
    const host = document.getElementById("fig-rating-table");
    host.innerHTML = "";
    Charts.dataTable(host, [Site.t("thMonth"), Site.t("thRatingEnd"), Site.t("thGames")],
      C.monthly.map(m => [monthName(m.m), m.end, m.n]), tableLabels());
  }

  function figMonths() {
    const mount = document.getElementById("fig-months");
    if (!mount) return;
    Charts.stackedColumns(mount, C.monthly.map(m => ({
      key: monthName(m.m),
      parts: [
        { name: Site.t("resWin"), value: m.w, color: WIN },
        { name: Site.t("resDraw"), value: m.d, color: DRAW },
        { name: Site.t("resLoss"), value: m.l, color: LOSS }
      ]
    })), { height: 300, aria: Site.t("figMonths"), totalWord: Site.t("totalWord") });
    const legendHost = document.getElementById("fig-months-legend");
    legendHost.innerHTML = "";
    Charts.legend(legendHost, [
      { label: Site.t("resWin"), color: WIN },
      { label: Site.t("resDraw"), color: DRAW },
      { label: Site.t("resLoss"), color: LOSS }
    ]);
    const host = document.getElementById("fig-months-table");
    host.innerHTML = "";
    Charts.dataTable(host,
      [Site.t("thMonth"), Site.t("thGames"), Site.t("resWin"), Site.t("resDraw"), Site.t("resLoss"), Site.t("thScore")],
      C.monthly.map(m => [monthName(m.m), m.n, m.w, m.d, m.l, pct(m.score)]), tableLabels());
  }

  function figColour() {
    const mount = document.getElementById("fig-colour");
    if (!mount) return;
    const rows = [["white", Site.t("asWhite")], ["black", Site.t("asBlack")]];
    Charts.stackedColumns(mount, rows.map(([k, label]) => ({
      key: label,
      parts: [
        { name: Site.t("resWin"), value: C.colour[k].w, color: WIN },
        { name: Site.t("resDraw"), value: C.colour[k].d, color: DRAW },
        { name: Site.t("resLoss"), value: C.colour[k].l, color: LOSS }
      ]
    })), { height: 260, maxBarWidth: 72, aria: Site.t("figColour"), totalWord: Site.t("totalWord") });
    const legendHost = document.getElementById("fig-colour-legend");
    legendHost.innerHTML = "";
    Charts.legend(legendHost, [
      { label: Site.t("resWin"), color: WIN },
      { label: Site.t("resDraw"), color: DRAW },
      { label: Site.t("resLoss"), color: LOSS }
    ]);
    set("colour-white", pct(C.colour.white.score));
    set("colour-black", pct(C.colour.black.score));

    const host = document.getElementById("fig-moves-table");
    host.innerHTML = "";
    const moves = C.firstMoves.white.map(m => [Site.t("asWhite"), m.name, m.n, pct(m.score)])
      .concat(C.firstMoves.black.map(m => [Site.t("asBlack"), m.name, m.n, pct(m.score)]));
    Charts.dataTable(host, [Site.t("thColour"), Site.t("thMove"), Site.t("thGames"), Site.t("thScore")],
      moves, tableLabels());
  }

  function figEndings() {
    [["win", "fig-end-win", WIN], ["loss", "fig-end-loss", LOSS]].forEach(([side, id, color]) => {
      const mount = document.getElementById(id);
      if (!mount) return;
      const total = C.endings[side].reduce((a, e) => a + e.n, 0);
      Charts.bars(mount, C.endings[side].map(e => ({
        key: endingName(e.name), value: e.n, color,
        sub: pct(e.n / total * 100)
      })), {
        labelWidth: 160, rowHeight: 38, unit: Site.t("gamesWord"), aria: Site.t(side === "win" ? "figEndWin" : "figEndLoss")
      });
    });
    const host = document.getElementById("fig-end-table");
    host.innerHTML = "";
    const rows = [];
    ["win", "loss", "draw"].forEach(side => {
      C.endings[side].forEach(e => rows.push([Site.t("res" + side[0].toUpperCase() + side.slice(1)), endingName(e.name), e.n]));
    });
    Charts.dataTable(host, [Site.t("thResult"), Site.t("thEnding"), Site.t("thGames")], rows, tableLabels());
  }

  function figOpenings() {
    [["white", "fig-open-white"], ["black", "fig-open-black"]].forEach(([colour, id]) => {
      const mount = document.getElementById(id);
      if (!mount) return;
      const data = C.openings[colour];
      // the bar is the number of games; the record it hides rides along in
      // the tooltip, because 40 games at 36% is a different story from 40 at 60%
      Charts.bars(mount, data.map(o => ({
        key: o.name, value: o.n, color: "var(--series-1)",
        sub: wld(o) + " · " + pct(o.score)
      })), {
        labelWidth: 220, rowHeight: 34, unit: Site.t("gamesWord"),
        aria: Site.t(colour === "white" ? "figOpenWhite" : "figOpenBlack")
      });
    });
    const host = document.getElementById("fig-open-table");
    host.innerHTML = "";
    const rows = [];
    ["white", "black"].forEach(c => C.openings[c].forEach(o =>
      rows.push([Site.t(c === "white" ? "asWhite" : "asBlack"), o.name, o.n, wld(o), pct(o.score)])));
    Charts.dataTable(host,
      [Site.t("thColour"), Site.t("thOpening"), Site.t("thGames"), Site.t("thRecord"), Site.t("thScore")],
      rows, tableLabels());
  }

  function figWhen() {
    const hours = document.getElementById("fig-hours");
    if (hours) {
      const byHour = new Map(C.hours.map(h => [h.h, h]));
      Charts.columns(hours, Array.from({ length: 24 }, (_, h) => {
        const r = byHour.get(h);
        return { key: String(h).padStart(2, "0"), value: r ? r.n : 0, label: String(h).padStart(2, "0") + ":00" };
      }), { height: 230, maxBarWidth: 20, unit: Site.t("gamesWord"), aria: Site.t("figHours") });
    }
    const days = document.getElementById("fig-days");
    if (days) {
      Charts.columns(days, C.weekdays.map(d => ({ key: dayName(d.wd), value: d.n })), {
        height: 230, maxBarWidth: 46, valueLabels: true, unit: Site.t("gamesWord"), aria: Site.t("figDays")
      });
    }
    const host = document.getElementById("fig-when-table");
    host.innerHTML = "";
    Charts.dataTable(host, [Site.t("thHour"), Site.t("thGames"), Site.t("thScore")],
      C.hours.map(h => [String(h.h).padStart(2, "0") + ":00", h.n, pct(h.score)]), tableLabels());
  }

  function figLength() {
    const mount = document.getElementById("fig-length");
    if (!mount) return;
    const label = b => (b === 5 ? "76+" : `${b * 15 + 1}–${b * 15 + 15}`);
    Charts.columns(mount, C.lengths.map(l => ({
      key: label(l.b), value: Math.round(l.score * 10) / 10,
      label: label(l.b) + " " + Site.t("movesWord"),
      sub: l.n + " " + Site.t("gamesWord") + " · " + wld(l)
    })), {
      height: 240, maxBarWidth: 54, valueLabels: true, unit: "%", aria: Site.t("figLength")
    });
    const host = document.getElementById("fig-length-table");
    host.innerHTML = "";
    Charts.dataTable(host, [Site.t("thMoves"), Site.t("thGames"), Site.t("thRecord"), Site.t("thScore")],
      C.lengths.map(l => [label(l.b), l.n, wld(l), pct(l.score)]), tableLabels());
  }

  /* ------------------------------------------------------------ prose --- */
  /** The few numbers that are quoted inside sentences rather than drawn. */
  function inlineNumbers() {
    const t = C.totals;
    const share = (list, name) => {
      const hit = list.find(e => e.name === name);
      const all = list.reduce((a, e) => a + e.n, 0);
      return hit && all ? hit.n / all * 100 : 0;
    };
    document.querySelectorAll("[data-chess]").forEach(el => {
      const v = {
        games: num(t.n), days: num(t.days), hours: num(t.hours),
        runPeak: num(t.runPeak), runTrough: num(t.runTrough),
        peakYear: (C.snapshot.bestDate || "").slice(0, 4),
        opponents: num(t.opponents), peak: num(t.peak), trough: num(t.trough),
        score: pct(t.score), median: num(t.medianMoves),
        whiteScore: pct(C.colour.white.score), blackScore: pct(C.colour.black.score),
        resignShare: pct(share(C.endings.loss, "by resignation")),
        mateShare: pct(share(C.endings.loss, "by checkmate")),
        within15: pct(C.pairing.within15), medianGap: num(C.pairing.median),
        accN: num(C.accuracy.n), accMean: num(C.accuracy.mean),
        accWins: num(C.accuracy.wins), accLosses: num(C.accuracy.losses),
        e4Games: num((C.firstMoves.white[0] || {}).n),
        whiteGames: num(C.colour.white.n),
        e4Share: pct((C.firstMoves.white[0] || {}).n / C.colour.white.n * 100),
        shortScore: pct(C.lengths[0].score),
        longScore: pct(C.lengths[C.lengths.length - 2].score),
        puzzle: num(C.snapshot.puzzleBest), runFrom: date(t.runFrom),
        profile: C.profileUrl
      }[el.dataset.chess];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-chess-href=profile]").forEach(a => { a.href = C.profileUrl; });
  }

  function drawAll() {
    tiles();
    inlineNumbers();
    figRating();
    figMonths();
    figColour();
    figEndings();
    figOpenings();
    figWhen();
    figLength();
  }

  document.addEventListener("DOMContentLoaded", () => {
    drawAll();
    refresh();
  });
  document.addEventListener("langchange", drawAll);
  document.addEventListener("themechange", drawAll);
})();
