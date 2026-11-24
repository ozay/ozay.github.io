/* Manuscripts: the unlisted manuscript tracker (manuscripts.html).

   The data is assets/data/manuscripts.json — one entry per submission round,
   in the order they happened. The page reads it, and in edit mode writes it
   back by committing to the repository through the GitHub API with a token
   held in this browser only. See "The manuscript tracker" in README.md. */
(function () {
  "use strict";

  const REPO = { owner: "ozay", repo: "ozay.github.io", branch: "main", path: "assets/data/manuscripts.json" };
  const API = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}`;
  const TOKEN_KEY = "ozay-gh-token";
  const DRAFT_KEY = "ozay-ms-draft";
  const DAY = 864e5;

  /* -------------------------------------------------------- strings --- */
  Object.assign(window.I18N.en, {
    msEyebrow: "Manuscripts", msEdit: "Edit",
    msStatJournal: "With a journal now", msStatAuthors: "Waiting on the authors",
    msStatProjects: "Manuscripts tracked", msStatAttempts: "Journal submissions",
    msStatAccepted: "Manuscripts accepted", msStatRate: "Of decided submissions accepted",
    msStatMedian: "Median days to a first decision", msStatFast: "Of rejections inside 14 days",
    msUpdated: "Data last saved on", msFromGitHub: "· read from GitHub",
    msLaneJournal: "With a journal", msLaneJournalSub: "Days counted from submission.",
    msLaneAuthors: "With the authors",
    msLaneAuthorsSub: "Revisions to send and planned submissions. Days counted from the decision.",
    msLaneBetween: "Between journals",
    msLaneBetweenSub: "Last decision a rejection or withdrawal in the past twelve months, and nothing submitted since.",
    msLaneEmpty: "Nothing here.",
    msFigRoute: "Submissions over time",
    msFigRouteSub: "One row per manuscript, one bar per submission, from submission to decision. Hover a bar for the details.",
    msRange2y: "Two years", msRangeAll: "All years",
    msRouteNote: "{n} manuscripts have no dated submission in this range and are not drawn.",
    msFigYears: "Submissions by year and outcome",
    msFigYearsSub: "Each journal a manuscript went to counts once, in the year it was first submitted there. Revisions at the same journal are part of the same submission.",
    msFigWait: "Time to a first decision", msFigWaitSub: "Days from submission to the journal's first decision, of any kind.",
    msFigJournals: "Journals submitted to most", msFigJournalsSub: "Submissions per journal. Hover a bar for the outcomes.",
    msSearch: "Search titles, journals, manuscript IDs…", msExpandAll: "Open all", msCollapseAll: "Close all",
    msAllStates: "All manuscripts",
    msStateJournal: "With a journal", msStateAuthors: "With the authors", msStateBetween: "Between journals",
    msStateAccepted: "Accepted", msStateShelved: "Shelved",
    msOne: "manuscript", msMany: "manuscripts",
    msSubmissions: "submissions", msSubmission: "submission",
    msDays: "days", msDay: "day", msToday: "today", msWaiting: "waiting",
    msSince: "since", msSent: "Sent", msDecided: "Decided",
    msThRef: "Identifier", msThJournal: "Journal", msThMsid: "Manuscript ID",
    msThSubmitted: "Submitted", msThDecided: "Decision", msThDays: "Days", msThStatus: "Status",
    msThYear: "Year", msTotal: "total",
    msShowTable: "Show as a table", msHideTable: "Hide table",
    msTrack: "Track", msUpdate: "Update", msNext: "Next round",
    msLive: "Live", msLiveChecked: "checked", msLiveLast: "last activity",
    msLiveCompleted: "Reviews completed", msLiveAccepted: "Reviewers agreed", msLiveInvited: "Invitations sent",
    msLiveDecision: "Decision", msLiveRevision: "Revision", msLiveFailed: "Live status could not be fetched at the last deploy.",
    msLiveRecord: "Record this", msLiveAcceptedJ: "Accepted by the journal",
    msUnsaved: "{n} unsaved changes", msUnsavedOne: "1 unsaved change", msNoChanges: "Editing. No unsaved changes.",
    msSaving: "Saving…", msSaved: "Saved. The public page catches up in a minute or two.",
    msSaveFailed: "Save failed: {e}", msConflict: "The file on GitHub changed since this page loaded it. Overwrite it with this version?",
    msDiscardConfirm: "Throw away the unsaved changes?", msDeleteConfirm: "Delete {ref}?",
    msAdd: "New manuscript", msDownload: "Download JSON", msDiscard: "Discard changes",
    msSave: "Save to GitHub", msDisconnect: "Sign out",
    msTokenTitle: "Connect to GitHub", msToken: "Token", msCancel: "Cancel", msConnect: "Connect",
    msTokenBad: "GitHub did not accept that token.", msTokenNoPush: "That token cannot write to the repository.",
    msEditTitle: "Submission", msNewTitle: "New submission",
    msFProject: "Manuscript code", msFRef: "Identifier", msFTitle: "Title", msFJournal: "Journal",
    msFMsid: "Manuscript ID", msFStatus: "Status", msFSubmitted: "Submitted", msFDecided: "Decision date",
    msFLink: "Tracking link", msFNote: "Note",
    msDelete: "Delete", msApply: "Apply",
    msLoadFailed: "The data file could not be loaded.",
    st_planned: "Not yet submitted", st_submitted: "Submitted", st_editor: "With editor",
    st_review: "Under review", st_revision: "Revision", st_major: "Major revision",
    st_minor: "Minor revision", st_accepted: "Accepted", st_rejected: "Rejected",
    st_withdrawn: "Withdrawn", st_returned: "Returned", st_: "Not recorded",
    og_accepted: "Accepted", og_open: "Revision under way", og_journal: "With the journal",
    og_rejected: "Rejected", og_other: "Withdrawn, returned or not recorded"
  });
  Object.assign(window.I18N.tr, {
    msEyebrow: "Makaleler", msEdit: "Düzenle",
    msStatJournal: "Şu anda dergide", msStatAuthors: "Yazarları bekliyor",
    msStatProjects: "İzlenen makale", msStatAttempts: "Dergi gönderimi",
    msStatAccepted: "Kabul edilen makale", msStatRate: "Karara bağlanan gönderimlerde kabul",
    msStatMedian: "İlk karara kadar ortanca gün", msStatFast: "Retlerin 14 gün içinde gelen kısmı",
    msUpdated: "Verinin son kaydı:", msFromGitHub: "· GitHub'dan okundu",
    msLaneJournal: "Dergide", msLaneJournalSub: "Gün sayısı gönderimden itibaren.",
    msLaneAuthors: "Yazarlarda",
    msLaneAuthorsSub: "Gönderilecek revizyonlar ve planlanan gönderimler. Gün sayısı karardan itibaren.",
    msLaneBetween: "Dergi arayışında",
    msLaneBetweenSub: "Son on iki ayda son kararı ret ya da geri çekme olan ve o günden beri gönderilmemiş makaleler.",
    msLaneEmpty: "Burada bir şey yok.",
    msFigRoute: "Zaman içinde gönderimler",
    msFigRouteSub: "Her makaleye bir satır, her gönderime bir çubuk: gönderimden karara. Ayrıntı için çubuğun üzerine gelin.",
    msRange2y: "İki yıl", msRangeAll: "Tüm yıllar",
    msRouteNote: "{n} makalenin bu aralıkta tarihli gönderimi yok; çizilmedi.",
    msFigYears: "Yıla ve sonuca göre gönderimler",
    msFigYearsSub: "Bir makalenin gittiği her dergi bir kez, oraya ilk gönderildiği yılda sayılır. Aynı dergiye yapılan revizyonlar aynı gönderimin parçasıdır.",
    msFigWait: "İlk karara kadar geçen süre", msFigWaitSub: "Gönderimden derginin ilk kararına, türü ne olursa olsun, geçen gün.",
    msFigJournals: "En çok gönderilen dergiler", msFigJournalsSub: "Dergi başına gönderim. Sonuçlar için çubuğun üzerine gelin.",
    msSearch: "Başlık, dergi, makale numarası ara…", msExpandAll: "Tümünü aç", msCollapseAll: "Tümünü kapat",
    msAllStates: "Tüm makaleler",
    msStateJournal: "Dergide", msStateAuthors: "Yazarlarda", msStateBetween: "Dergi arayışında",
    msStateAccepted: "Kabul edildi", msStateShelved: "Rafta",
    msOne: "makale", msMany: "makale",
    msSubmissions: "gönderim", msSubmission: "gönderim",
    msDays: "gün", msDay: "gün", msToday: "bugün", msWaiting: "bekliyor",
    msSince: "itibaren", msSent: "Gönderildi", msDecided: "Karar",
    msThRef: "Kod", msThJournal: "Dergi", msThMsid: "Makale no.",
    msThSubmitted: "Gönderim", msThDecided: "Karar", msThDays: "Gün", msThStatus: "Durum",
    msThYear: "Yıl", msTotal: "toplam",
    msShowTable: "Tablo olarak göster", msHideTable: "Tabloyu gizle",
    msTrack: "Takip", msUpdate: "Güncelle", msNext: "Sonraki tur",
    msLive: "Canlı", msLiveChecked: "kontrol", msLiveLast: "son hareket",
    msLiveCompleted: "Tamamlanan değerlendirme", msLiveAccepted: "Kabul eden hakem", msLiveInvited: "Gönderilen davet",
    msLiveDecision: "Karar", msLiveRevision: "Revizyon", msLiveFailed: "Son yayında canlı durum alınamadı.",
    msLiveRecord: "Kaydet", msLiveAcceptedJ: "Dergi tarafından kabul edildi",
    msUnsaved: "{n} kaydedilmemiş değişiklik", msUnsavedOne: "1 kaydedilmemiş değişiklik", msNoChanges: "Düzenleme açık. Kaydedilmemiş değişiklik yok.",
    msSaving: "Kaydediliyor…", msSaved: "Kaydedildi. Herkese açık sayfa bir iki dakika içinde güncellenir.",
    msSaveFailed: "Kaydedilemedi: {e}", msConflict: "GitHub'daki dosya bu sayfa yüklendikten sonra değişmiş. Bu sürümle üzerine yazılsın mı?",
    msDiscardConfirm: "Kaydedilmemiş değişiklikler silinsin mi?", msDeleteConfirm: "{ref} silinsin mi?",
    msAdd: "Yeni makale", msDownload: "JSON indir", msDiscard: "Değişiklikleri at",
    msSave: "GitHub'a kaydet", msDisconnect: "Çıkış",
    msTokenTitle: "GitHub'a bağlan", msToken: "Anahtar", msCancel: "Vazgeç", msConnect: "Bağlan",
    msTokenBad: "GitHub bu anahtarı kabul etmedi.", msTokenNoPush: "Bu anahtarın depoya yazma izni yok.",
    msEditTitle: "Gönderim", msNewTitle: "Yeni gönderim",
    msFProject: "Makale kodu", msFRef: "Kod", msFTitle: "Başlık", msFJournal: "Dergi",
    msFMsid: "Makale no.", msFStatus: "Durum", msFSubmitted: "Gönderim tarihi", msFDecided: "Karar tarihi",
    msFLink: "Takip bağlantısı", msFNote: "Not",
    msDelete: "Sil", msApply: "Uygula",
    msLoadFailed: "Veri dosyası yüklenemedi.",
    st_planned: "Henüz gönderilmedi", st_submitted: "Gönderildi", st_editor: "Editörde",
    st_review: "Hakemde", st_revision: "Revizyon", st_major: "Büyük revizyon",
    st_minor: "Küçük revizyon", st_accepted: "Kabul", st_rejected: "Ret",
    st_withdrawn: "Geri çekildi", st_returned: "İade edildi", st_: "Kaydedilmemiş",
    og_accepted: "Kabul", og_open: "Revizyon sürüyor", og_journal: "Dergide",
    og_rejected: "Ret", og_other: "Geri çekildi, iade ya da kayıtsız"
  });

  const t = k => Site.t(k);
  const esc = s => Site.esc(s == null ? "" : s);
  const fmt = (k, o) => t(k).replace(/\{(\w+)\}/g, (_, x) => o[x]);

  /* --------------------------------------------------------- status --- */
  const STATUSES = ["planned", "submitted", "editor", "review", "revision", "major", "minor",
    "accepted", "rejected", "withdrawn", "returned", ""];
  const WITH_JOURNAL = new Set(["submitted", "editor", "review"]);
  const WITH_AUTHORS = new Set(["revision", "major", "minor", "planned"]);
  const CLOSED_BAD = new Set(["rejected", "withdrawn", "returned"]);
  /* The colour group a status belongs to. Status colours are a fixed set,
     and never carry meaning alone: every chip also has an icon and a word. */
  function tone(st) {
    if (st === "accepted") return "good";
    if (st === "revision" || st === "major" || st === "minor") return "warn";
    if (WITH_JOURNAL.has(st)) return "wait";
    if (st === "rejected") return "bad";
    return "muted";
  }
  const ICON = { good: "✓", warn: "↻", wait: "◷", bad: "✕", muted: "–" };
  const COLOR = { good: "var(--st-good)", warn: "var(--st-warn)", wait: "var(--st-wait)", bad: "var(--st-bad)", muted: "var(--st-muted)" };
  const chip = st => `<span class="ms-st ms-st-${tone(st)}"><i aria-hidden="true">${ICON[tone(st)]}</i>${esc(t("st_" + st))}</span>`;

  /* ----------------------------------------------------------- dates --- */
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const ms = iso => Date.parse(iso + "T00:00:00Z");
  const daysBetween = (a, b) => Math.round((ms(b) - ms(a)) / DAY);
  function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(ms(iso));
    return d.toLocaleDateString(Site.lang() === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  }
  const plural = (n, one, many) => `${n} ${t(n === 1 ? one : many)}`;
  // Turkish writes the sign first: %12.
  const pct = v => Site.lang() === "tr" ? "%" + Math.round(100 * v) : Math.round(100 * v) + "%";
  const median = a => {
    if (!a.length) return null;
    const s = a.slice().sort((x, y) => x - y), m = s.length >> 1;
    return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
  };

  /* ------------------------------------------------------------ state --- */
  let data = { updated: "", submissions: [] };
  let baseline = "";          // the JSON as last loaded or saved
  let remoteSha = null;       // blob sha of that version, when read through the API
  let editing = false;
  let routeRange = "730";
  let expandAll = false;
  let track = { fetched: "", items: {} };  // live review status, written at deploy time

  const serialise = d => JSON.stringify(d, null, 1);
  const dirty = () => serialise(data) !== baseline;
  const token = () => { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; } };

  /* ---------------------------------------------------------- derive --- */
  /* Groups the flat list into manuscripts and journal submissions.
     A new submission starts when the journal changes, or when the round
     before it was closed (rejected, withdrawn, returned, accepted). */
  function derive() {
    const today = todayISO();
    const subs = data.submissions.map((s, i) => Object.assign({ i }, s));
    const byProject = new Map();
    subs.forEach(s => {
      if (!byProject.has(s.project)) byProject.set(s.project, []);
      byProject.get(s.project).push(s);
    });

    const projects = [], attempts = [];
    byProject.forEach((rows, code) => {
      const atts = [];
      let lastTitle = "";
      rows.forEach((r, k) => {
        if (r.title) lastTitle = r.title;
        r.shownTitle = r.title || lastTitle;
        const prev = rows[k - 1];
        const cont = prev && prev.journal === r.journal && tone(prev.status) === "warn";
        if (cont) atts[atts.length - 1].rows.push(r);
        else atts.push({ project: code, rows: [r] });
      });
      // Backfill titles for leading rows that had none.
      rows.forEach(r => { if (!r.shownTitle) r.shownTitle = lastTitle; });

      // A row is current while it is open and nothing later supersedes it.
      // A row waiting on a journal stays current even if a parallel version
      // (a translation, say) was submitted elsewhere after it.
      const last = rows[rows.length - 1];
      rows.forEach((r, k) => {
        const isLastOfAttempt = atts.some(a => a.rows[a.rows.length - 1] === r);
        r.current = isLastOfAttempt && (WITH_JOURNAL.has(r.status) || (WITH_AUTHORS.has(r.status) && r === last));
      });

      atts.forEach(a => {
        const f = a.rows[0], l = a.rows[a.rows.length - 1];
        a.journal = f.journal;
        a.outcome = l.status;
        a.start = f.submitted || "";
        a.year = (f.submitted || f.decided || a.rows.map(r => r.submitted || r.decided).find(Boolean) || "").slice(0, 4);
        a.firstDecision = f.submitted && f.decided ? daysBetween(f.submitted, f.decided) : null;
        attempts.push(a);
      });

      const dates = rows.flatMap(r => [r.submitted, r.decided]).filter(Boolean).sort();
      const lastActivity = dates[dates.length - 1] || "";
      const current = rows.filter(r => r.current);
      let state;
      if (current.some(r => WITH_JOURNAL.has(r.status))) state = "journal";
      else if (current.length) state = "authors";
      else if (rows.some(r => r.status === "accepted")) state = "accepted";
      else if (CLOSED_BAD.has(last.status) && last.decided && daysBetween(last.decided, today) <= 365) state = "between";
      else state = "shelved";
      projects.push({ code, rows, attempts: atts, title: lastTitle || code, lastActivity, state, last });
    });

    projects.sort((a, b) => (b.lastActivity || "").localeCompare(a.lastActivity || "") || a.code.localeCompare(b.code));
    return { subs, projects, attempts, today };
  }

  /* ----------------------------------------------------------- stats --- */
  function renderStats(D) {
    const cur = D.subs.filter(s => s.current);
    const decided = D.attempts.filter(a => a.outcome === "accepted" || a.outcome === "rejected");
    const acc = decided.filter(a => a.outcome === "accepted").length;
    const firsts = D.attempts.map(a => a.firstDecision).filter(v => v != null && v >= 0);
    const rej = D.attempts.filter(a => a.outcome === "rejected" && a.rows.length === 1 && a.firstDecision != null);
    const set = (id, v) => { document.getElementById(id).textContent = v; };
    set("k-journal", cur.filter(s => WITH_JOURNAL.has(s.status)).length);
    set("k-authors", cur.filter(s => WITH_AUTHORS.has(s.status)).length);
    set("k-projects", D.projects.length);
    set("k-attempts", D.attempts.length);
    set("k-accepted", D.projects.filter(p => p.rows.some(r => r.status === "accepted")).length);
    set("k-rate", decided.length ? pct(acc / decided.length) : "—");
    const md = median(firsts);
    set("k-median", md == null ? "—" : md);
    set("k-fast", rej.length ? pct(rej.filter(a => a.firstDecision <= 14).length / rej.length) : "—");
    document.getElementById("ms-updated").textContent = fmtDate(data.updated);
    document.getElementById("ms-source").textContent = remoteSha ? t("msFromGitHub") : "";
  }

  /* ----------------------------------------------------------- lanes --- */
  /* What a service's decision means in this tracker's vocabulary, or null
     when the wording is not one we can map with confidence. */
  function liveSuggestion(r, L) {
    if (!L || !L.ok) return null;
    if (L.accepted && r.status !== "accepted") return { status: "accepted", decided: "" };
    const d = L.decision;
    if (!d || !d.date || !WITH_JOURNAL.has(r.status) || (r.submitted && d.date < r.submitted)) return null;
    const txt = (d.text || "").toLowerCase();
    const st = /reject/.test(txt) ? "rejected" : /accept/.test(txt) ? "accepted"
      : /major/.test(txt) ? "major" : /minor/.test(txt) ? "minor" : /revis/.test(txt) ? "revision" : null;
    return st ? { status: st, decided: d.date } : null;
  }

  function livePanel(r) {
    const L = r.link && track.items[r.link];
    if (!L) return "";
    if (!L.ok) return `<p class="ms-live ms-live-fail ms-edit-only">${esc(t("msLiveFailed"))}</p>`;
    const src = L.source === "elsevier" ? "Elsevier" : "Research Square";
    const nums = [["completed", "msLiveCompleted"], ["accepted", "msLiveAccepted"], ["invited", "msLiveInvited"]]
      .filter(([k]) => L.reviews && L.reviews[k] != null && L.reviews[k] !== "")
      .map(([k, key]) => `<div><dt>${esc(t(key))}</dt><dd class="mono">${esc(L.reviews[k])}</dd></div>`).join("");
    const sug = liveSuggestion(r, L);
    return `
      <div class="ms-live">
        <p class="ms-live-head"><i class="chip-dot" aria-hidden="true"></i>${esc(t("msLive"))} · ${src}
          <span class="mono">· ${esc(t("msLiveChecked"))} ${fmtDate(track.fetched.slice(0, 10))}</span></p>
        <p class="ms-live-status"><b>${esc(L.accepted ? t("msLiveAcceptedJ") : L.status)}</b>${L.lastActivity ? ` · ${esc(t("msLiveLast"))} ${fmtDate(L.lastActivity)}` : ""}${L.revision ? ` · ${esc(t("msLiveRevision"))} ${esc(L.revision)}` : ""}</p>
        ${L.decision ? `<p class="ms-live-status">${esc(t("msLiveDecision"))}: <b>${esc(L.decision.text)}</b> · ${fmtDate(L.decision.date)}</p>` : ""}
        ${nums ? `<dl class="ms-live-nums">${nums}</dl>` : ""}
        ${sug ? `<span class="ms-edit-only"><button class="btn btn-primary btn-sm" type="button" data-act="live" data-i="${r.i}"
          data-status="${sug.status}" data-decided="${esc(sug.decided)}">${esc(t("msLiveRecord"))}: ${esc(t("st_" + sug.status))}</button></span>` : ""}
      </div>`;
  }

  function card(r, sub, extra) {
    const link = r.link ? `<a class="ms-link" href="${esc(r.link)}" target="_blank" rel="noopener">${esc(t("msTrack"))} ↗</a>` : "";
    return `
      <article class="ms-card" data-i="${r.i}">
        <div class="ms-card-top">${chip(r.status)}<span class="ms-days mono">${sub}</span></div>
        <h4 class="ms-card-journal">${esc(r.journal || "—")}</h4>
        <p class="ms-card-title">${esc(r.shownTitle)}</p>
        <p class="ms-card-meta mono">${esc(r.ref)}${r.msid ? " · " + esc(r.msid) : ""}${extra || ""}</p>
        ${r.note ? `<p class="ms-card-note">${esc(r.note)}</p>` : ""}
        ${livePanel(r)}
        <div class="ms-card-foot">${link}
          <span class="ms-edit-only">
            <button class="btn btn-ghost btn-sm" type="button" data-act="edit" data-i="${r.i}">${esc(t("msUpdate"))}</button>
            <button class="btn btn-ghost btn-sm" type="button" data-act="next" data-i="${r.i}">${esc(t("msNext"))}</button>
          </span>
        </div>
      </article>`;
  }
  const daysLabel = n => n === 0 ? t("msToday") : plural(n, "msDay", "msDays");

  function renderLanes(D) {
    const cur = D.subs.filter(s => s.current);
    const journal = cur.filter(s => WITH_JOURNAL.has(s.status))
      .map(s => ({ s, d: s.submitted ? daysBetween(s.submitted, D.today) : -1 }))
      .sort((a, b) => b.d - a.d);
    // A planned submission has no decision of its own; count from the
    // decision that sent it back to the authors.
    const lastDecision = s => s.decided || (s.status !== "planned" ? null :
      D.subs.filter(x => x.project === s.project && x.i < s.i && x.decided).map(x => x.decided).pop());
    const authors = cur.filter(s => WITH_AUTHORS.has(s.status))
      .map(s => { const dd = lastDecision(s); return { s, d: dd ? daysBetween(dd, D.today) : -1 }; })
      .sort((a, b) => b.d - a.d);
    const between = D.projects.filter(p => p.state === "between")
      .map(p => ({ s: p.last, p, d: daysBetween(p.last.decided, D.today) }))
      .sort((a, b) => a.d - b.d);

    const fill = (id, nid, items, sub) => {
      document.getElementById(nid).textContent = items.length;
      document.getElementById(id).innerHTML = items.length
        ? items.map(x => card(x.s, x.d < 0 ? "" : sub(x), x.p ? ` · ${plural(x.p.attempts.length, "msSubmission", "msSubmissions")}` : "")).join("")
        : `<p class="ms-empty muted">${esc(t("msLaneEmpty"))}</p>`;
    };
    fill("lane-journal", "n-journal", journal, x => daysLabel(x.d));
    fill("lane-authors", "n-authors", authors, x => daysLabel(x.d));
    fill("lane-between", "n-between", between, x => daysLabel(x.d));
  }

  /* ------------------------------------------------------ route chart --- */
  const NS = "http://www.w3.org/2000/svg";
  function svgEl(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function renderRoute(D) {
    const mount = document.getElementById("fig-route");
    const figure = mount.closest(".figure");
    mount.innerHTML = "";
    const end = ms(D.today);
    const allStarts = D.subs.map(s => s.submitted).filter(Boolean).sort();
    const start = routeRange === "all"
      ? Date.UTC(+allStarts[0].slice(0, 4), 0, 1)
      : end - Number(routeRange) * DAY;

    // A bar runs from submission to decision. With no decision date, an open
    // round runs to today; a revision round runs to the next round's
    // submission; anything else is drawn as a short tick.
    const rowsOf = p => p.rows.map((r, k) => {
      if (!r.submitted) return null;
      let stop = r.decided;
      if (!stop) {
        const nx = p.rows[k + 1];
        if (r.current && WITH_JOURNAL.has(r.status)) stop = D.today;
        else if (tone(r.status) === "warn" && nx && nx.submitted) stop = nx.submitted;
      }
      const a = ms(r.submitted), b = stop ? ms(stop) : a;
      if (b < start) return null;
      return { r, a: Math.max(a, start), b, open: !r.decided && r.current };
    }).filter(Boolean);

    const lanes = D.projects.map(p => ({ p, bars: rowsOf(p) })).filter(l => l.bars.length);
    const hidden = D.projects.length - lanes.length;

    const W = 720, rowH = 20, labelW = 96;
    const m = { top: 22, right: 8, bottom: 8, left: labelW };
    const H = m.top + lanes.length * rowH + m.bottom;
    const x = v => m.left + ((v - start) / (end - start)) * (W - m.left - m.right);
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("msFigRoute") }, mount);

    // Year (or quarter, on the short range) gridlines.
    const y0 = new Date(start).getUTCFullYear(), y1 = new Date(end).getUTCFullYear();
    for (let y = y0; y <= y1 + 1; y++) {
      for (let q = 0; q < 12; q += routeRange === "all" ? 12 : 3) {
        const v = Date.UTC(y, q, 1);
        if (v < start || v > end) continue;
        svgEl("line", { class: q ? "grid-line ms-grid-minor" : "grid-line", x1: x(v), x2: x(v), y1: m.top - 6, y2: H - m.bottom }, svg);
        const lab = svgEl("text", { class: "tick-label", x: x(v) + 3, y: m.top - 10 }, svg);
        lab.textContent = q ? "Q" + (q / 3 + 1) : String(y);
      }
    }
    svgEl("line", { class: "ms-today", x1: x(end), x2: x(end), y1: m.top - 6, y2: H - m.bottom }, svg);

    lanes.forEach((l, k) => {
      const cy = m.top + k * rowH + rowH / 2;
      const lab = svgEl("text", { class: "tick-label", x: m.left - 8, y: cy + 3.5, "text-anchor": "end" }, svg);
      lab.textContent = l.p.code.length > 14 ? l.p.code.slice(0, 13) + "…" : l.p.code;
      svgEl("line", { class: "ms-lane-line", x1: m.left, x2: W - m.right, y1: cy, y2: cy }, svg);
      l.bars.forEach(b => {
        const xa = x(b.a), w = Math.max(4, x(b.b) - xa);
        const bar = svgEl("rect", {
          class: "bar-mark" + (b.open ? " ms-open" : ""), x: xa, y: cy - 5, width: w, height: 10, rx: 2,
          fill: COLOR[tone(b.r.status)]
        }, svg);
        const r = b.r;
        const span = r.decided ? `${fmtDate(r.submitted)} → ${fmtDate(r.decided)} · ${daysLabel(daysBetween(r.submitted, r.decided))}`
          : b.open ? `${fmtDate(r.submitted)} → · ${daysLabel(daysBetween(r.submitted, D.today))} ${t("msWaiting")}` : fmtDate(r.submitted);
        Charts.bindMark(bar, figure, () =>
          `<b>${esc(r.journal || "—")}</b><br><span class="t-sub">${esc(r.ref)} · ${esc(t("st_" + r.status))}<br>${span}<br>${esc(r.shownTitle)}</span>`);
        bar.setAttribute("aria-label", `${r.ref}, ${r.journal}, ${t("st_" + r.status)}`);
      });
    });

    const legend = document.getElementById("fig-route-legend");
    legend.innerHTML = "";
    Charts.legend(legend, ["good", "warn", "wait", "bad", "muted"].map(k => ({
      color: COLOR[k], label: { good: t("st_accepted"), warn: t("st_revision"), wait: t("og_journal"), bad: t("st_rejected"), muted: t("og_other") }[k]
    })));
    document.getElementById("fig-route-note").textContent = hidden ? fmt("msRouteNote", { n: hidden }) : "";
  }

  /* ----------------------------------------------------- other charts --- */
  function renderCharts(D) {
    // Submissions by year, stacked by outcome.
    const OUT = [
      { k: "good", label: t("og_accepted") }, { k: "warn", label: t("og_open") },
      { k: "wait", label: t("og_journal") }, { k: "bad", label: t("og_rejected") },
      { k: "muted", label: t("og_other") }
    ];
    const years = {};
    D.attempts.forEach(a => {
      if (!a.year) return;
      years[a.year] = years[a.year] || { good: 0, warn: 0, wait: 0, bad: 0, muted: 0 };
      years[a.year][tone(a.outcome)]++;
    });
    const ys = Object.keys(years).sort();
    if (ys.length) {
      const full = [];
      for (let y = +ys[0]; y <= +ys[ys.length - 1]; y++) full.push(String(y));
      const rows = full.map(y => ({ key: y, parts: OUT.map(o => ({ name: o.label, value: (years[y] || {})[o.k] || 0, color: COLOR[o.k] })) }));
      Charts.stackedColumns(document.getElementById("fig-years"), rows, { height: 280, totalWord: t("msTotal"), aria: t("msFigYears") });
      const lg = document.getElementById("fig-years-legend"); lg.innerHTML = "";
      Charts.legend(lg, OUT.map(o => ({ color: COLOR[o.k], label: o.label })));
      const tb = document.getElementById("fig-years-table"); tb.innerHTML = "";
      Charts.dataTable(tb, [t("msThYear")].concat(OUT.map(o => o.label), [t("msTotal")]),
        rows.map(r => [r.key].concat(r.parts.map(p => p.value), [r.parts.reduce((s, p) => s + p.value, 0)])),
        { show: t("msShowTable"), hide: t("msHideTable") });
    }

    // Days to a first decision.
    const B = [[0, 7, "≤7"], [8, 14, "8–14"], [15, 30, "15–30"], [31, 60, "31–60"], [61, 120, "61–120"], [121, 1e9, ">120"]];
    const firsts = D.attempts.map(a => a.firstDecision).filter(v => v != null && v >= 0);
    Charts.columns(document.getElementById("fig-wait"),
      B.map(([lo, hi, key]) => ({ key, label: `${key} ${t("msDays")}`, value: firsts.filter(v => v >= lo && v <= hi).length })),
      { height: 240, unit: t("msSubmissions"), valueLabels: true, aria: t("msFigWait") });

    // Journals submitted to most.
    const J = new Map();
    D.attempts.forEach(a => {
      if (!a.journal) return;
      const j = J.get(a.journal) || { n: 0, acc: 0, rej: 0 };
      j.n++; if (a.outcome === "accepted") j.acc++; if (a.outcome === "rejected") j.rej++;
      J.set(a.journal, j);
    });
    const top = [...J.entries()].sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0])).slice(0, 12);
    Charts.bars(document.getElementById("fig-journals"),
      top.map(([name, j]) => ({
        key: name.length > 36 ? name.slice(0, 35) + "…" : name, value: j.n,
        sub: `${j.acc} ${t("st_accepted").toLowerCase()} · ${j.rej} ${t("st_rejected").toLowerCase()}`
      })),
      { labelWidth: 250, rowHeight: 26, barHeight: 12, unit: t("msSubmissions"), aria: t("msFigJournals") });
  }

  /* ------------------------------------------------------ project list --- */
  const STATE_KEYS = ["journal", "authors", "between", "accepted", "shelved"];
  const STATE_LABEL = s => t("msState" + s[0].toUpperCase() + s.slice(1));
  const STATE_TONE = { journal: "wait", authors: "warn", between: "bad", accepted: "good", shelved: "muted" };

  function fillStateSelect(D) {
    const sel = document.getElementById("ms-state");
    const cur = sel.value;
    const n = k => D.projects.filter(p => p.state === k).length;
    sel.innerHTML = `<option value="">${esc(t("msAllStates"))} (${D.projects.length})</option>` +
      STATE_KEYS.map(k => `<option value="${k}">${esc(STATE_LABEL(k))} (${n(k)})</option>`).join("");
    sel.value = cur;
  }

  function renderProjects(D) {
    const q = document.getElementById("ms-search").value.trim().toLowerCase();
    const st = document.getElementById("ms-state").value;
    const list = D.projects.filter(p => {
      if (st && p.state !== st) return false;
      if (!q) return true;
      const hay = [p.code].concat(p.rows.flatMap(r => [r.ref, r.title, r.journal, r.msid, r.note])).join(" ").toLowerCase();
      return q.split(/\s+/).every(w => hay.includes(w));
    });
    document.getElementById("ms-count").textContent = plural(list.length, "msOne", "msMany");
    const host = document.getElementById("ms-projects");
    host.innerHTML = list.map(p => {
      const open = expandAll || !!q || p.state === "journal" || p.state === "authors";
      const rows = p.rows.slice().reverse().map(r => {
        const d = r.submitted && r.decided ? daysBetween(r.submitted, r.decided)
          : r.current && r.submitted && WITH_JOURNAL.has(r.status) ? daysBetween(r.submitted, D.today) : null;
        return `<tr>
          <td class="mono">${esc(r.ref)}</td>
          <td>${esc(r.journal || "—")}${r.title && r.title !== p.title ? `<span class="ms-alt-title">${esc(r.title)}</span>` : ""}${r.link ? ` <a class="ms-link" href="${esc(r.link)}" target="_blank" rel="noopener">${esc(t("msTrack"))} ↗</a>` : ""}</td>
          <td class="mono ms-msid">${esc(r.msid || "—")}</td>
          <td class="mono">${fmtDate(r.submitted)}</td>
          <td class="mono">${fmtDate(r.decided)}</td>
          <td class="num">${d == null ? "—" : d}</td>
          <td>${chip(r.status)}</td>
          <td class="ms-edit-only"><button class="icon-btn ms-row-edit" type="button" data-act="edit" data-i="${r.i}" aria-label="${esc(t("msEdit"))} ${esc(r.ref)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z"/></svg></button></td>
        </tr>`;
      }).join("");
      return `
        <details class="ms-proj ms-proj-${STATE_TONE[p.state]}"${open ? " open" : ""}>
          <summary>
            <span class="ms-proj-code mono">${esc(p.code)}</span>
            <span class="ms-proj-title">${esc(p.title)}</span>
            <span class="ms-proj-meta">
              <span class="ms-st ms-st-${STATE_TONE[p.state]}"><i aria-hidden="true">${ICON[STATE_TONE[p.state]]}</i>${esc(STATE_LABEL(p.state))}</span>
              <span class="mono muted">${plural(p.attempts.length, "msSubmission", "msSubmissions")}</span>
            </span>
          </summary>
          <div class="ms-table-wrap">
            <table class="data-table ms-table">
              <thead><tr><th>${esc(t("msThRef"))}</th><th>${esc(t("msThJournal"))}</th><th>${esc(t("msThMsid"))}</th>
                <th>${esc(t("msThSubmitted"))}</th><th>${esc(t("msThDecided"))}</th><th class="num">${esc(t("msThDays"))}</th>
                <th>${esc(t("msThStatus"))}</th><th class="ms-edit-only"></th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </details>`;
    }).join("") || `<p class="empty-state">—</p>`;
  }

  /* ----------------------------------------------------------- render --- */
  function render() {
    Charts.hideTip();
    const D = derive();
    renderStats(D);
    renderLanes(D);
    renderRoute(D);
    renderCharts(D);
    fillStateSelect(D);
    renderProjects(D);
    renderSavebar();
    fillDatalists(D);
  }

  /* ========================================================= editing === */
  function setEditing(on) {
    editing = on;
    document.body.classList.toggle("ms-editing", on);
    document.getElementById("ms-savebar").hidden = !on;
    renderSavebar();
  }

  let saveMsg = "";
  function renderSavebar() {
    if (!editing) return;
    const n = changeCount();
    document.getElementById("ms-savebar-msg").textContent = saveMsg ||
      (n === 0 ? t("msNoChanges") : n === 1 ? t("msUnsavedOne") : fmt("msUnsaved", { n }));
    document.getElementById("ms-save").disabled = n === 0;
    document.getElementById("ms-discard").disabled = n === 0;
  }
  /* Rows added or changed, counted against the version last loaded or saved.
     An edited row shows up once on each side, so take the larger side. */
  function changeCount() {
    if (!dirty()) return 0;
    let base;
    try { base = JSON.parse(baseline).submissions; } catch (e) { return 1; }
    const a = base.map(x => JSON.stringify(x)), b = data.submissions.map(x => JSON.stringify(x));
    const setA = new Set(a), setB = new Set(b);
    return Math.max(1, b.filter(x => !setA.has(x)).length, a.filter(x => !setB.has(x)).length);
  }

  function changed() {
    saveMsg = "";
    try {
      if (dirty()) localStorage.setItem(DRAFT_KEY, JSON.stringify({ baseline, data }));
      else localStorage.removeItem(DRAFT_KEY);
    } catch (e) { /* storage unavailable: the edit still applies to this page */ }
    render();
  }

  /* ---------------------------------------------------- edit dialog --- */
  const dlg = document.getElementById("ms-edit-dlg");
  const form = document.getElementById("ms-edit-form");
  let editIndex = null;   // index into data.submissions, or null for a new row
  let insertAfter = null; // for a new row: put it after this index

  function fillDatalists(D) {
    document.getElementById("ms-projects-list").innerHTML = D.projects.map(p => `<option value="${esc(p.code)}">`).join("");
    const js = [...new Set(data.submissions.map(s => s.journal).filter(Boolean))].sort();
    document.getElementById("ms-journals-list").innerHTML = js.map(j => `<option value="${esc(j)}">`).join("");
    document.getElementById("ms-status-select").innerHTML = STATUSES.map(s => `<option value="${s}">${esc(t("st_" + s))}</option>`).join("");
  }

  function nextRef(project) {
    const refs = data.submissions.filter(s => s.project === project).map(s => s.ref);
    const last = refs[refs.length - 1];
    if (!last) return project + "-01";
    const m = last.match(/^(.*?)(\d+)$/);
    if (!m) return last + "-2";
    return m[1] + String(+m[2] + 1).padStart(m[2].length, "0");
  }

  function openEditor(rec, idx, after) {
    editIndex = idx; insertAfter = after;
    document.getElementById("ms-edit-title").textContent = t(idx == null ? "msNewTitle" : "msEditTitle");
    ["project", "ref", "title", "journal", "msid", "status", "submitted", "decided", "link", "note"].forEach(k => {
      form.elements[k].value = rec[k] || "";
    });
    document.getElementById("ms-delete").hidden = idx == null;
    dlg.showModal();
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const rec = {};
    ["ref", "project", "msid", "title", "journal", "submitted", "decided", "status", "link", "note"].forEach(k => {
      rec[k] = form.elements[k].value.trim();
    });
    if (editIndex != null) data.submissions[editIndex] = rec;
    else if (insertAfter != null) data.submissions.splice(insertAfter + 1, 0, rec);
    else data.submissions.push(rec);
    dlg.close();
    changed();
  });
  form.elements.project.addEventListener("change", () => {
    if (editIndex == null && !form.elements.ref.value) form.elements.ref.value = nextRef(form.elements.project.value.trim());
  });
  document.getElementById("ms-delete").addEventListener("click", () => {
    const rec = data.submissions[editIndex];
    if (!confirm(fmt("msDeleteConfirm", { ref: rec.ref }))) return;
    data.submissions.splice(editIndex, 1);
    dlg.close();
    changed();
  });
  document.querySelectorAll("dialog [data-close]").forEach(b => b.addEventListener("click", () => b.closest("dialog").close()));

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-act]");
    if (!b || !editing) return;
    e.preventDefault();
    const i = +b.dataset.i, r = data.submissions[i];
    if (b.dataset.act === "edit") openEditor(r, i, null);
    if (b.dataset.act === "live") openEditor(Object.assign({}, r, { status: b.dataset.status, decided: b.dataset.decided || r.decided }), i, null);
    if (b.dataset.act === "next") {
      // After a revision request the next round goes back to the same journal;
      // after anything else it is a fresh submission somewhere new.
      const again = tone(r.status) === "warn";
      const lastIdx = data.submissions.map(s => s.project).lastIndexOf(r.project);
      openEditor({
        project: r.project, ref: nextRef(r.project), title: r.title,
        journal: again ? r.journal : "", msid: again ? r.msid : "",
        status: "submitted", submitted: todayISO()
      }, null, lastIdx);
    }
  });

  document.getElementById("ms-add").addEventListener("click", () =>
    openEditor({ status: "planned" }, null, null));

  document.getElementById("ms-discard").addEventListener("click", () => {
    if (!confirm(t("msDiscardConfirm"))) return;
    data = JSON.parse(baseline);
    changed();
  });

  document.getElementById("ms-download").addEventListener("click", () => {
    const blob = new Blob([serialise(data) + "\n"], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "manuscripts.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  document.getElementById("ms-disconnect").addEventListener("click", () => {
    if (dirty() && !confirm(t("msDiscardConfirm"))) return;
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
    location.hash = "";
    location.reload();
  });

  /* ---------------------------------------------------------- GitHub --- */
  const gh = (path, opts) => fetch(API + path, Object.assign({}, opts, {
    cache: "no-store",
    headers: Object.assign({
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token(),
      "X-GitHub-Api-Version": "2022-11-28"
    }, (opts && opts.headers) || {})
  }));

  const b64decode = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g, "")), c => c.charCodeAt(0)));
  function b64encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  async function readRemote() {
    const r = await gh(`/contents/${REPO.path}?ref=${REPO.branch}`);
    if (!r.ok) throw new Error(r.status + " " + r.statusText);
    const j = await r.json();
    return { sha: j.sha, text: b64decode(j.content) };
  }

  document.getElementById("ms-save").addEventListener("click", async () => {
    const btn = document.getElementById("ms-save");
    btn.disabled = true;
    saveMsg = t("msSaving"); renderSavebar();
    try {
      const remote = await readRemote();
      if (remote.text.trim() !== baseline.trim() && !confirm(t("msConflict"))) {
        saveMsg = ""; renderSavebar(); return;
      }
      const next = Object.assign({}, data, { updated: todayISO() });
      const text = serialise(next) + "\n";
      const r = await gh(`/contents/${REPO.path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Update the manuscript tracker", content: b64encode(text), sha: remote.sha, branch: REPO.branch })
      });
      if (!r.ok) {
        let msg = r.status + " " + r.statusText;
        try { msg = (await r.json()).message || msg; } catch (e) { /* keep status */ }
        throw new Error(msg);
      }
      const j = await r.json();
      remoteSha = j.content.sha;
      data = next;
      baseline = serialise(data);
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
      render();
      saveMsg = t("msSaved"); renderSavebar();
    } catch (err) {
      saveMsg = fmt("msSaveFailed", { e: err.message }); renderSavebar();
      btn.disabled = false;
    }
  });

  /* ---------------------------------------------------- token dialog --- */
  const tokDlg = document.getElementById("ms-token-dlg");
  document.getElementById("ms-token-form").addEventListener("submit", async e => {
    e.preventDefault();
    const err = document.getElementById("ms-token-err");
    const value = document.getElementById("ms-token-input").value.trim();
    err.textContent = "";
    try {
      const r = await fetch(API, { headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + value } });
      if (!r.ok) { err.textContent = t("msTokenBad"); return; }
      const j = await r.json();
      if (!j.permissions || !j.permissions.push) { err.textContent = t("msTokenNoPush"); return; }
      try { localStorage.setItem(TOKEN_KEY, value); } catch (e2) { /* session only */ }
      document.getElementById("ms-token-input").value = "";
      tokDlg.close();
      await load();
      setEditing(true);
    } catch (e2) { err.textContent = t("msTokenBad"); }
  });

  document.getElementById("ms-edit-btn").addEventListener("click", () => {
    if (editing) return;
    if (token()) setEditing(true);
    else tokDlg.showModal();
  });

  /* ------------------------------------------------------------ load --- */
  async function load() {
    let text = null;
    remoteSha = null;
    if (token()) {
      // Read straight from the repository, so a save shows at once rather
      // than after the next Pages deploy.
      try { const r = await readRemote(); text = r.text; remoteSha = r.sha; } catch (e) { text = null; }
    }
    if (text == null) {
      const r = await fetch("assets/data/manuscripts.json", { cache: "no-cache" });
      if (!r.ok) throw new Error(r.status);
      text = await r.text();
    }
    data = JSON.parse(text);
    // Live review status exists only on the published site; without it the
    // cards simply have no Live panel.
    try {
      const tr = await fetch("assets/data/manuscripts-track.json", { cache: "no-cache" });
      if (tr.ok) track = await tr.json();
    } catch (e) { /* no live file */ }
    baseline = serialise(data);
    // An unsaved draft from an earlier visit is restored on top.
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (d && d.data && token()) data = d.data;
    } catch (e) { /* no draft */ }
    render();
  }

  /* ------------------------------------------------------------ wire --- */
  document.getElementById("ms-search").addEventListener("input", Site.debounce(() => renderProjects(derive()), 120));
  document.getElementById("ms-state").addEventListener("change", () => renderProjects(derive()));
  document.getElementById("ms-expand").addEventListener("click", e => {
    expandAll = !expandAll;
    e.currentTarget.textContent = t(expandAll ? "msCollapseAll" : "msExpandAll");
    renderProjects(derive());
  });
  document.querySelectorAll("#route-range [data-range]").forEach(b => b.addEventListener("click", () => {
    routeRange = b.dataset.range;
    document.querySelectorAll("#route-range [data-range]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    renderRoute(derive());
  }));
  document.addEventListener("langchange", () => { if (baseline) render(); });
  window.addEventListener("beforeunload", e => { if (editing && dirty()) { e.preventDefault(); e.returnValue = ""; } });

  document.addEventListener("DOMContentLoaded", () => {
    // The Edit button is shown to whoever holds a token, or arrives at #edit.
    if (token() || location.hash === "#edit") document.getElementById("ms-edit-btn").hidden = false;
    load().then(() => { if (token() && location.hash === "#edit") setEditing(true); })
      .catch(() => {
        document.getElementById("ms-projects").innerHTML = `<p class="empty-state">${esc(t("msLoadFailed"))}</p>`;
      });
  });
})();
