/* ===========================================================================
   Small SVG chart builders. No dependencies.

   House rules followed here (dataviz):
   - thin marks, 4px rounded data-ends anchored to the baseline
   - 2px surface-coloured gap between adjacent / stacked fills
   - recessive grid and axes; text wears ink tokens, never the series colour
   - a legend whenever there are >= 2 series; single-series charts get none
   - a hover tooltip on every plotted mark, plus an optional data table
   - one y-axis, always
   =========================================================================== */
(function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const SERIES = n => `var(--series-${n})`;

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  /* ----------------------------------------------------------- tooltip -- */
  let tip;
  function tipEl() {
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "tooltip";
      tip.setAttribute("role", "status");
      document.body.appendChild(tip);
    }
    return tip;
  }
  function showTip(html, evt) {
    const t = tipEl();
    t.innerHTML = html;
    t.classList.add("is-on");
    const r = t.getBoundingClientRect();
    let x = evt.clientX + 14, y = evt.clientY - r.height - 10;
    if (x + r.width > window.innerWidth - 8) x = evt.clientX - r.width - 14;
    if (y < 8) y = evt.clientY + 18;
    t.style.left = x + "px";
    t.style.top = y + "px";
  }
  function hideTip() {
    if (!tip) return;
    tip.classList.remove("is-on");
    document.querySelectorAll(".figure.is-hovering").forEach(f => {
      f.classList.remove("is-hovering");
      f.querySelectorAll(".is-hot").forEach(m => m.classList.remove("is-hot"));
    });
  }
  // A mark can lose the pointer without a mouseleave (scrolling, a tap
  // elsewhere), which would otherwise strand the tooltip on screen.
  window.addEventListener("scroll", () => { if (tip && tip.classList.contains("is-on")) hideTip(); }, { passive: true });
  window.addEventListener("blur", hideTip);

  /** Wire hover/focus on a mark: highlights siblings and shows the tooltip. */
  function bindMark(node, figure, html) {
    const on = e => { figure.classList.add("is-hovering"); node.classList.add("is-hot"); showTip(html(), e); };
    const off = () => { figure.classList.remove("is-hovering"); node.classList.remove("is-hot"); hideTip(); };
    node.addEventListener("mouseenter", on);
    node.addEventListener("mousemove", e => showTip(html(), e));
    node.addEventListener("mouseleave", off);
    node.addEventListener("focus", e => {
      const r = node.getBoundingClientRect();
      on({ clientX: r.left + r.width / 2, clientY: r.top });
    });
    node.addEventListener("blur", off);
    node.setAttribute("tabindex", "0");
    node.setAttribute("role", "img");
  }

  /* ------------------------------------------------------------ legend -- */
  function legend(container, items) {
    const box = document.createElement("div");
    box.className = "legend";
    items.forEach(it => {
      const s = document.createElement("span");
      s.className = "legend-item";
      s.innerHTML = `<i class="legend-swatch" style="background:${it.color}"></i>${it.label}`;
      box.appendChild(s);
    });
    container.appendChild(box);
    return box;
  }

  /* -------------------------------------------------------- data table -- */
  function dataTable(container, headers, rows, labels) {
    const wrapper = document.createElement("div");
    const btn = document.createElement("button");
    btn.className = "btn btn-ghost btn-sm table-toggle";
    btn.type = "button";
    btn.textContent = labels.show;
    const tbl = document.createElement("table");
    tbl.className = "data-table";
    tbl.hidden = true;
    tbl.innerHTML =
      "<thead><tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr></thead><tbody>" +
      rows.map(r => "<tr>" + r.map((c, i) => `<td class="${i ? "num" : ""}">${c}</td>`).join("") + "</tr>").join("") +
      "</tbody>";
    btn.addEventListener("click", () => {
      tbl.hidden = !tbl.hidden;
      btn.textContent = tbl.hidden ? labels.show : labels.hide;
    });
    wrapper.appendChild(btn);
    wrapper.appendChild(tbl);
    container.appendChild(wrapper);
  }

  /* ===================================================== column chart === */
  /**
   * Vertical columns for a single magnitude series over an ordered axis.
   * data: [{ key, value, label? }]
   */
  function columns(mount, data, opts) {
    opts = opts || {};
    const figure = mount.closest(".figure") || mount;
    mount.innerHTML = "";

    const W = 720, H = opts.height || 260;
    const m = { top: 18, right: 6, bottom: 30, left: 30 };
    const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
    const max = Math.max(1, ...data.map(d => d.value));
    const ticks = niceTicks(max, 4);
    const top = ticks[ticks.length - 1];
    const y = v => m.top + ih - (v / top) * ih;

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": opts.aria || "" }, mount);

    ticks.forEach(t => {
      el("line", { class: "grid-line", x1: m.left, x2: W - m.right, y1: y(t), y2: y(t) }, svg);
      const lab = el("text", { class: "tick-label", x: m.left - 7, y: y(t) + 3.5, "text-anchor": "end" }, svg);
      lab.textContent = t;
    });
    el("line", { class: "baseline", x1: m.left, x2: W - m.right, y1: y(0), y2: y(0) }, svg);

    const slot = iw / data.length;
    const bw = Math.min(opts.maxBarWidth || 34, slot - 6);

    data.forEach((d, i) => {
      const cx = m.left + slot * i + slot / 2;
      const h = (d.value / top) * ih;
      const color = d.color || SERIES(1);

      if (d.value > 0) {
        // 4px rounded data-end, square foot on the baseline
        const r = Math.min(4, h);
        const x0 = cx - bw / 2, y0 = y(d.value);
        const path = `M${x0},${y(0)} L${x0},${y0 + r} Q${x0},${y0} ${x0 + r},${y0}
                      L${x0 + bw - r},${y0} Q${x0 + bw},${y0} ${x0 + bw},${y0 + r}
                      L${x0 + bw},${y(0)} Z`;
        const bar = el("path", { class: "bar-mark", d: path, fill: color }, svg);
        bindMark(bar, figure, () =>
          `<b>${d.label || d.key}</b><br><span class="t-sub">${d.value} ${opts.unit || ""}${d.sub ? " · " + d.sub : ""}</span>`);
        bar.setAttribute("aria-label", `${d.label || d.key}: ${d.value}${d.sub ? ", " + d.sub : ""}`);

        if (opts.valueLabels) {
          const vl = el("text", { class: "value-label", x: cx, y: y0 - 6, "text-anchor": "middle" }, svg);
          vl.textContent = d.value;
        }
      }

      const xl = el("text", { class: "tick-label", x: cx, y: H - 10, "text-anchor": "middle" }, svg);
      xl.textContent = d.key;
    });

    return svg;
  }


  /* ======================================================= line chart === */
  /**
   * One value over time. Points carry a date, so a month of heavy play takes
   * the width it earned rather than being evened out with a quiet one.
   * data: [{ t: "YYYY-MM-DD", v: number }]
   * opts: { height, unit, aria, refs: [{ v, label }], format }
   */
  function line(mount, data, opts) {
    opts = opts || {};
    const figure = mount.closest(".figure") || mount;
    mount.innerHTML = "";
    if (!data.length) return null;

    const W = 720, H = opts.height || 280;
    const m = { top: 16, right: 10, bottom: 30, left: 38 };
    const iw = W - m.left - m.right, ih = H - m.top - m.bottom;

    const ms = d => Date.parse(d + "T00:00:00Z");
    const t0 = ms(data[0].t), t1 = ms(data[data.length - 1].t);
    const span = Math.max(1, t1 - t0);
    const x = d => m.left + ((ms(d) - t0) / span) * iw;

    const vals = data.map(d => d.v).concat((opts.refs || []).map(r => r.v));
    const lo = Math.min(...vals), hi = Math.max(...vals);
    // Round the band outwards to a round number so the gridlines read cleanly.
    const step = Math.max(10, Math.round((hi - lo) / 4 / 50) * 50 || 50);
    const bot = Math.floor((lo - step * .35) / step) * step;
    const topv = Math.ceil((hi + step * .35) / step) * step;
    const y = v => m.top + ih - ((v - bot) / Math.max(1, topv - bot)) * ih;

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": opts.aria || "" }, mount);

    for (let v = bot; v <= topv + 1e-9; v += step) {
      el("line", { class: "grid-line", x1: m.left, x2: W - m.right, y1: y(v), y2: y(v) }, svg);
      const lab = el("text", { class: "tick-label", x: m.left - 7, y: y(v) + 3.5, "text-anchor": "end" }, svg);
      lab.textContent = v;
    }

    // One x tick per month, labelled at the first point of each month.
    let lastMonth = "";
    data.forEach(d => {
      const mo = d.t.slice(0, 7);
      if (mo === lastMonth) return;
      lastMonth = mo;
      const cx = x(d.t);
      if (cx > W - m.right - 18) return;
      el("line", { class: "grid-line", x1: cx, x2: cx, y1: m.top, y2: m.top + ih, opacity: .55 }, svg);
      const lab = el("text", { class: "tick-label", x: cx, y: H - 10, "text-anchor": "middle" }, svg);
      lab.textContent = (opts.monthLabel || (s => s.slice(5) + "/" + s.slice(2, 4)))(d.t);
    });

    (opts.refs || []).forEach(r => {
      el("line", {
        x1: m.left, x2: W - m.right, y1: y(r.v), y2: y(r.v),
        stroke: "var(--ink-3)", "stroke-width": 1, "stroke-dasharray": "3 4", opacity: .7
      }, svg);
      const lab = el("text", {
        class: "tick-label", x: W - m.right, y: y(r.v) - 5, "text-anchor": "end"
      }, svg);
      lab.textContent = r.label;
    });

    const d = data.map((p, i) => (i ? "L" : "M") + x(p.t).toFixed(1) + "," + y(p.v).toFixed(1)).join(" ");
    el("path", {
      d: d + ` L${x(data[data.length - 1].t).toFixed(1)},${y(bot)} L${x(data[0].t).toFixed(1)},${y(bot)} Z`,
      fill: SERIES(1), opacity: .08
    }, svg);
    el("path", {
      d, fill: "none", stroke: SERIES(1), "stroke-width": 2,
      "stroke-linejoin": "round", "stroke-linecap": "round"
    }, svg);

    /* --- hover: a guide, a dot and the tooltip, driven by the nearest point */
    const guide = el("line", {
      y1: m.top, y2: m.top + ih, stroke: "var(--line-2)", "stroke-width": 1, opacity: 0
    }, svg);
    const dotRing = el("circle", { r: 5.5, fill: "var(--surface-1)", opacity: 0 }, svg);
    const dot = el("circle", { r: 3.5, fill: SERIES(1), opacity: 0 }, svg);
    const fmt = opts.format || (p => `<b>${p.v}</b><br><span class="t-sub">${p.t}</span>`);

    function nearest(clientX) {
      const r = svg.getBoundingClientRect();
      const px = m.left + ((clientX - r.left) / r.width) * W - m.left;
      const want = t0 + (px / iw) * span;
      let best = data[0], bd = Infinity;
      for (const p of data) {
        const dd = Math.abs(ms(p.t) - want);
        if (dd < bd) { bd = dd; best = p; }
      }
      return best;
    }
    function place(p, evt) {
      const cx = x(p.t), cy = y(p.v);
      guide.setAttribute("x1", cx); guide.setAttribute("x2", cx); guide.setAttribute("opacity", 1);
      [dotRing, dot].forEach(n => { n.setAttribute("cx", cx); n.setAttribute("cy", cy); n.setAttribute("opacity", 1); });
      showTip(fmt(p), evt);
    }
    function clear() {
      guide.setAttribute("opacity", 0);
      dotRing.setAttribute("opacity", 0);
      dot.setAttribute("opacity", 0);
      hideTip();
    }
    const hit = el("rect", {
      x: m.left, y: m.top, width: iw, height: ih, fill: "transparent", style: "cursor:crosshair"
    }, svg);
    hit.addEventListener("mousemove", e => place(nearest(e.clientX), e));
    hit.addEventListener("mouseleave", clear);
    hit.addEventListener("touchstart", e => {
      if (e.touches[0]) place(nearest(e.touches[0].clientX), e.touches[0]);
    }, { passive: true });
    hit.addEventListener("touchmove", e => {
      if (e.touches[0]) place(nearest(e.touches[0].clientX), e.touches[0]);
    }, { passive: true });
    hit.addEventListener("touchend", clear);
    figure.addEventListener("mouseleave", clear);

    return svg;
  }

  /* ============================================== stacked column chart === */
  /**
   * data: [{ key, parts: [{ name, value, color }] }]
   * A 2px surface gap separates stacked segments.
   */
  function stackedColumns(mount, data, opts) {
    opts = opts || {};
    const figure = mount.closest(".figure") || mount;
    mount.innerHTML = "";

    const W = 720, H = opts.height || 280;
    // The tick labels are rotated 45°, so the bottom margin has to clear their
    // diagonal extent rather than just their line height.
    const m = { top: 18, right: 6, bottom: 78, left: 30 };
    const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
    const totals = data.map(d => d.parts.reduce((s, p) => s + p.value, 0));
    const ticks = niceTicks(Math.max(1, ...totals), 4);
    const top = ticks[ticks.length - 1];
    const y = v => m.top + ih - (v / top) * ih;

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": opts.aria || "" }, mount);

    ticks.forEach(t => {
      el("line", { class: "grid-line", x1: m.left, x2: W - m.right, y1: y(t), y2: y(t) }, svg);
      const lab = el("text", { class: "tick-label", x: m.left - 7, y: y(t) + 3.5, "text-anchor": "end" }, svg);
      lab.textContent = t;
    });
    el("line", { class: "baseline", x1: m.left, x2: W - m.right, y1: y(0), y2: y(0) }, svg);

    const slot = iw / data.length;
    const bw = Math.min(opts.maxBarWidth || 30, slot - 5);
    const GAP = 2;

    data.forEach((d, i) => {
      const cx = m.left + slot * i + slot / 2;
      const x0 = cx - bw / 2;
      let acc = 0;
      const total = totals[i];

      d.parts.forEach((p, pi) => {
        if (p.value <= 0) return;
        const isTop = d.parts.slice(pi + 1).every(q => q.value <= 0);
        const yTop = y(acc + p.value);
        const yBot = y(acc) - (acc > 0 ? GAP : 0);
        const h = Math.max(1, yBot - yTop);
        const r = isTop ? Math.min(4, h) : 0;
        const path = r
          ? `M${x0},${yBot} L${x0},${yTop + r} Q${x0},${yTop} ${x0 + r},${yTop}
             L${x0 + bw - r},${yTop} Q${x0 + bw},${yTop} ${x0 + bw},${yTop + r} L${x0 + bw},${yBot} Z`
          : `M${x0},${yBot} L${x0},${yTop} L${x0 + bw},${yTop} L${x0 + bw},${yBot} Z`;
        const seg = el("path", { class: "bar-mark", d: path, fill: p.color }, svg);
        bindMark(seg, figure, () =>
          `<b>${d.key}</b><br><span class="t-sub">${p.name}: ${p.value}${total ? ` · ${opts.totalWord || "total"} ${total}` : ""}</span>`);
        seg.setAttribute("aria-label", `${d.key}, ${p.name}: ${p.value}`);
        acc += p.value;
      });

      const ly = m.top + ih + 16;
      const xl = el("text", {
        class: "tick-label", x: cx, y: ly, "text-anchor": "end",
        transform: `rotate(-45 ${cx} ${ly})`
      }, svg);
      xl.textContent = d.key;
    });

    return svg;
  }

  /* ======================================================== bar chart === */
  /** Horizontal bars — the right form when category names are words. */
  function bars(mount, data, opts) {
    opts = opts || {};
    const figure = mount.closest(".figure") || mount;
    mount.innerHTML = "";

    const rowH = opts.rowHeight || 34;
    const W = 720, H = data.length * rowH + 14;
    const labelW = opts.labelWidth || 190;
    const m = { top: 4, right: 44, bottom: 10, left: labelW };
    const iw = W - m.left - m.right;
    const max = Math.max(1, ...data.map(d => d.value));

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": opts.aria || "" }, mount);

    data.forEach((d, i) => {
      const cy = m.top + i * rowH + rowH / 2;
      const bh = Math.min(opts.barHeight || 16, rowH - 8);
      const w = Math.max(2, (d.value / max) * iw);
      const color = d.color || SERIES(1);
      const r = Math.min(4, w);

      const label = el("text", {
        class: "tick-label", x: m.left - 12, y: cy + 3.5, "text-anchor": "end"
      }, svg);
      label.textContent = d.key;

      const path = `M${m.left},${cy - bh / 2} L${m.left + w - r},${cy - bh / 2}
                    Q${m.left + w},${cy - bh / 2} ${m.left + w},${cy - bh / 2 + r}
                    L${m.left + w},${cy + bh / 2 - r} Q${m.left + w},${cy + bh / 2} ${m.left + w - r},${cy + bh / 2}
                    L${m.left},${cy + bh / 2} Z`;
      const bar = el("path", { class: "bar-mark", d: path, fill: color }, svg);
      bindMark(bar, figure, () =>
        `<b>${d.key}</b><br><span class="t-sub">${d.value} ${opts.unit || ""}${d.sub ? " · " + d.sub : ""}</span>`);
      bar.setAttribute("aria-label", `${d.key}: ${d.value}${d.sub ? ", " + d.sub : ""}`);

      const vl = el("text", { class: "value-label", x: m.left + w + 8, y: cy + 3.5 }, svg);
      vl.textContent = d.value;
    });

    el("line", { class: "baseline", x1: m.left, x2: m.left, y1: m.top, y2: H - m.bottom }, svg);
    return svg;
  }

  /* ==================================================== radial network === */
  /**
   * Ego network: one centre node, collaborators on a ring, sized by weight.
   * nodes: [{ name, weight, pubs: [titles] }]
   */
  function egoNetwork(mount, centre, nodes, opts) {
    opts = opts || {};
    const figure = mount.closest(".figure") || mount;
    mount.innerHTML = "";

    const W = 720, H = opts.height || 480;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) / 2 - 92;
    const maxW = Math.max(...nodes.map(n => n.weight));
    const rOf = w => 7 + Math.sqrt(w / maxW) * 17;

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": opts.aria || "" }, mount);
    const edges = el("g", {}, svg);
    const marks = el("g", {}, svg);

    const placed = nodes.map((n, i) => {
      const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      return { ...n, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, a };
    });

    // spokes: thickness carries the number of joint papers
    placed.forEach(n => {
      el("line", {
        x1: cx, y1: cy, x2: n.x, y2: n.y,
        stroke: "var(--line-2)", "stroke-width": Math.max(1, n.weight / maxW * 3),
        "stroke-linecap": "round", opacity: .55
      }, edges);
    });

    // centre
    el("circle", { cx, cy, r: 26, fill: "var(--accent)" }, marks);
    const ct = el("text", {
      x: cx, y: cy + 4, "text-anchor": "middle",
      "font-family": "var(--font-mono)", "font-size": 12, "font-weight": 600, fill: "var(--bg-2)"
    }, marks);
    ct.textContent = centre;

    placed.forEach(n => {
      const g = el("g", { class: "node-mark" }, marks);
      // 2px surface ring keeps overlapping marks legible
      el("circle", { cx: n.x, cy: n.y, r: rOf(n.weight) + 2, fill: "var(--surface-1)" }, g);
      el("circle", { cx: n.x, cy: n.y, r: rOf(n.weight), fill: SERIES(1) }, g);

      // Near the top and bottom of the ring a side label runs into its
      // neighbour, so those sit above / below the node instead.
      const cos = Math.cos(n.a), sin = Math.sin(n.a);
      const vertical = Math.abs(cos) < 0.35;
      const attrs = vertical
        ? { x: n.x, y: n.y + (sin < 0 ? -(rOf(n.weight) + 9) : rOf(n.weight) + 16), "text-anchor": "middle" }
        : { x: n.x + (cos > 0 ? 1 : -1) * (rOf(n.weight) + 8), y: n.y + 3.5, "text-anchor": cos > 0 ? "start" : "end" };
      const t = el("text", Object.assign({
        "font-family": "var(--font-body)", "font-size": 11, fill: "var(--ink-2)"
      }, attrs), g);
      t.textContent = n.name;

      bindMark(g, figure, () => {
        const list = n.pubs.slice(0, 4).map(p => `· ${p}`).join("<br>");
        const more = n.pubs.length > 4 ? `<br><span class="t-sub">+${n.pubs.length - 4} more</span>` : "";
        return `<b>${n.name}</b><br><span class="t-sub">${n.weight} ${opts.unit || "joint articles"}</span><br>${list}${more}`;
      });
      g.setAttribute("aria-label", `${n.name}: ${n.weight}`);
    });

    return svg;
  }

  /* ----------------------------------------------------------- helpers -- */
  function niceTicks(max, count) {
    const raw = max / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
    const out = [];
    for (let v = 0; v <= Math.ceil(max / step) * step + 1e-9; v += step) out.push(Math.round(v * 1000) / 1000);
    return out;
  }

  window.Charts = { columns, stackedColumns, bars, line, egoNetwork, legend, dataTable, series: SERIES, hideTip };
})();
