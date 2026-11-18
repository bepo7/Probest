/* Probest P2 — utilidades numéricas e widgets interativos. Sem dependências além do KaTeX. */
(function () {
  "use strict";

  /* ---------- Tema claro/escuro ---------- */
  var root = document.documentElement;
  try { var saved = localStorage.getItem("theme"); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest(".theme-toggle");
    if (!b) return;
    var dark = root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    document.querySelectorAll("[data-widget]").forEach(function (w) { if (w._redraw) w._redraw(); });
  });

  /* ---------- Matemática ---------- */
  var M = {};
  M.lgamma = function (x) {
    var g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - M.lgamma(1 - x);
    x -= 1; var a = c[0], t = x + g + 0.5;
    for (var i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  };
  M.lbeta = function (a, b) { return M.lgamma(a) + M.lgamma(b) - M.lgamma(a + b); };
  M.lchoose = function (n, k) { return M.lgamma(n + 1) - M.lgamma(k + 1) - M.lgamma(n - k + 1); };
  function betacf(a, b, x) {
    var MAXIT = 300, EPS = 1e-14, FPMIN = 1e-300;
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; var h = d;
    for (var m = 1; m <= MAXIT; m++) {
      var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; var del = d * c; h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }
  M.ibeta = function (x, a, b) { // regularizada I_x(a,b)
    if (x <= 0) return 0; if (x >= 1) return 1;
    var bt = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - M.lbeta(a, b));
    if (x < (a + 1) / (a + b + 2)) return bt * betacf(a, b, x) / a;
    return 1 - bt * betacf(b, a, 1 - x) / b;
  };
  M.igamma = function (a, x) { // regularizada P(a,x)
    if (x <= 0) return 0;
    var gln = M.lgamma(a);
    if (x < a + 1) {
      var ap = a, sum = 1 / a, del = sum;
      for (var n = 0; n < 500; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
      return sum * Math.exp(-x + a * Math.log(x) - gln);
    }
    var b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
    for (var i = 1; i < 500; i++) {
      var an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; var dl = d * c; h *= dl;
      if (Math.abs(dl - 1) < 1e-15) break;
    }
    return 1 - Math.exp(-x + a * Math.log(x) - gln) * h;
  };
  M.normPdf = function (x, mu, s) { mu = mu || 0; s = s || 1; var z = (x - mu) / s; return Math.exp(-0.5 * z * z) / (s * Math.sqrt(2 * Math.PI)); };
  M.normCdf = function (x, mu, s) {
    mu = mu || 0; s = s || 1; var z = (x - mu) / s;
    var p = 0.5 * M.igamma(0.5, z * z / 2);
    return z >= 0 ? 0.5 + p : 0.5 - p;
  };
  M.tCdf = function (t, df) { var x = df / (df + t * t), p = 0.5 * M.ibeta(x, df / 2, 0.5); return t >= 0 ? 1 - p : p; };
  M.tPdf = function (t, df) { return Math.exp(M.lgamma((df + 1) / 2) - M.lgamma(df / 2) - 0.5 * Math.log(df * Math.PI) - (df + 1) / 2 * Math.log(1 + t * t / df)); };
  M.chiCdf = function (x, df) { return x <= 0 ? 0 : M.igamma(df / 2, x / 2); };
  M.chiPdf = function (x, df) { if (x <= 0) return 0; return Math.exp((df / 2 - 1) * Math.log(x) - x / 2 - (df / 2) * Math.log(2) - M.lgamma(df / 2)); };
  M.betaPdf = function (x, a, b) { if (x <= 0 || x >= 1) { if ((x === 0 && a === 1) || (x === 1 && b === 1)) return Math.exp(-M.lbeta(a, b)); return 0; } return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - M.lbeta(a, b)); };
  M.betaCdf = function (x, a, b) { return M.ibeta(x, a, b); };
  M.invert = function (cdf, p, lo, hi) { // bisseção em função crescente
    for (var i = 0; i < 200; i++) { var mid = (lo + hi) / 2; if (cdf(mid) < p) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  M.normInv = function (p) { return M.invert(function (z) { return M.normCdf(z); }, p, -40, 40); };
  M.tInv = function (p, df) { return M.invert(function (t) { return M.tCdf(t, df); }, p, -1e4, 1e4); };
  M.chiInv = function (p, df) { return M.invert(function (x) { return M.chiCdf(x, df); }, p, 0, 1e4); };
  M.betaInv = function (p, a, b) { return M.invert(function (x) { return M.betaCdf(x, a, b); }, p, 0, 1); };
  window.ProbMath = M;

  /* ---------- Utilidades ---------- */
  function fmt(x, d) {
    if (!isFinite(x)) return String(x);
    if (d === undefined) d = 4;
    if (x !== 0 && Math.abs(x) < 1e-4) return x.toExponential(3);
    return (+x.toFixed(d)).toLocaleString("pt-BR", { maximumFractionDigits: d });
  }
  function num(el) { var v = String(el.value).replace(",", "."); if (v.indexOf("/") > 0) { var p = v.split("/"); return parseFloat(p[0]) / parseFloat(p[1]); } return parseFloat(v); }
  function cssVar(name) { return getComputedStyle(document.body).getPropertyValue(name).trim() || "#333"; }
  function el(tag, attrs, html) { var e = document.createElement(tag); for (var k in attrs || {}) e.setAttribute(k, attrs[k]); if (html !== undefined) e.innerHTML = html; return e; }
  function q(w, name) { return w.querySelector('[name="' + name + '"]'); }

  /* Gráfico SVG simples: curves = [{f, color, label, fill:[a,b], dash}] */
  function plot(svgHost, opts) {
    var W = 640, H = 260, L = 40, R = 12, T = 12, B = 30;
    var xmin = opts.xmin, xmax = opts.xmax, N = 400, ymax = 0;
    var curves = opts.curves.map(function (c) {
      var pts = [];
      for (var i = 0; i <= N; i++) { var x = xmin + (xmax - xmin) * i / N, y = c.f(x); if (!isFinite(y)) y = 0; pts.push([x, y]); if (y > ymax) ymax = y; }
      return { c: c, pts: pts };
    });
    if (opts.bars) opts.bars.forEach(function (b) { b.data.forEach(function (d) { if (d[1] > ymax) ymax = d[1]; }); });
    if (ymax <= 0) ymax = 1; ymax *= 1.08;
    function X(x) { return L + (W - L - R) * (x - xmin) / (xmax - xmin); }
    function Y(y) { return H - B - (H - T - B) * Math.min(y, ymax) / ymax; }
    var ink = cssVar("--muted"), line = cssVar("--line");
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + (opts.label || "gráfico") + '">';
    s += '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="' + ink + '"/>';
    var ticks = opts.ticks || 6;
    for (var i = 0; i <= ticks; i++) {
      var xv = xmin + (xmax - xmin) * i / ticks, xp = X(xv);
      s += '<line x1="' + xp + '" y1="' + (H - B) + '" x2="' + xp + '" y2="' + (H - B + 4) + '" stroke="' + ink + '"/>';
      s += '<text x="' + xp + '" y="' + (H - B + 17) + '" font-size="11" text-anchor="middle" fill="' + ink + '">' + fmt(xv, 2) + "</text>";
    }
    (opts.vlines || []).forEach(function (v) {
      s += '<line x1="' + X(v.x) + '" y1="' + T + '" x2="' + X(v.x) + '" y2="' + (H - B) + '" stroke="' + (v.color || ink) + '" stroke-dasharray="4 4"/>';
      if (v.label) s += '<text x="' + (X(v.x) + 4) + '" y="' + (T + 12) + '" font-size="11" fill="' + (v.color || ink) + '">' + v.label + "</text>";
    });
    (opts.bars || []).forEach(function (b) {
      var bw = (W - L - R) / (xmax - xmin) * (b.width || 0.6);
      b.data.forEach(function (d) { s += '<rect x="' + (X(d[0]) - bw / 2) + '" y="' + Y(d[1]) + '" width="' + bw + '" height="' + (H - B - Y(d[1])) + '" fill="' + b.color + '" fill-opacity="' + (b.opacity || 0.75) + '"/>'; });
    });
    curves.forEach(function (o) {
      var c = o.c;
      (c.fills || (c.fill ? [c.fill] : [])).forEach(function (fr) {
        var a = Math.max(fr[0], xmin), b = Math.min(fr[1], xmax); if (b <= a) return;
        var d = "M" + X(a) + "," + (H - B);
        for (var i = 0; i <= 120; i++) { var x = a + (b - a) * i / 120; d += " L" + X(x) + "," + Y(c.f(x)); }
        d += " L" + X(b) + "," + (H - B) + " Z";
        s += '<path d="' + d + '" fill="' + (fr[2] || c.color) + '" fill-opacity="0.28"/>';
      });
      var p = o.pts.map(function (pt, i) { return (i ? "L" : "M") + X(pt[0]).toFixed(1) + "," + Y(pt[1]).toFixed(1); }).join(" ");
      s += '<path d="' + p + '" fill="none" stroke="' + c.color + '" stroke-width="2.2"' + (c.dash ? ' stroke-dasharray="6 4"' : "") + "/>";
    });
    s += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '" stroke="' + line + '"/>';
    s += "</svg>";
    svgHost.innerHTML = s;
    if (opts.legend) {
      var lg = el("div", { class: "legend" });
      opts.legend.forEach(function (it) { lg.appendChild(el("span", { style: "color:" + it[1] }, it[0])); });
      svgHost.appendChild(lg);
    }
  }

  /* ---------- Widget: tabela bayesiana ---------- */
  function bayesTable(w) {
    var init = (w.getAttribute("data-rows") || "H1;1/3;1/2|H2;1/3;1/4|H3;1/3;1/8").split("|").map(function (r) { return r.split(";"); });
    w.innerHTML = '<h4>Calculadora: tabela de atualização bayesiana</h4><p class="kbd-hint">Digite prior e likelihood (aceita frações como 2/9). A prior não precisa somar 1 — ela é normalizada.</p>';
    var tw = el("div", { class: "table-wrap" }), tb = el("table");
    tb.innerHTML = '<thead><tr><th>Hipótese</th><th>Prior</th><th>Likelihood P(D|H)</th><th class="num">Numerador de Bayes</th><th class="num">Posterior</th></tr></thead><tbody></tbody><tfoot></tfoot>';
    tw.appendChild(tb); w.appendChild(tw);
    var tbody = tb.querySelector("tbody"), tfoot = tb.querySelector("tfoot");
    function addRow(r) {
      var tr = el("tr");
      tr.innerHTML = '<td><input type="text" value="' + r[0] + '"></td><td><input value="' + r[1] + '"></td><td><input value="' + r[2] + '"></td><td class="num"></td><td class="num"></td>';
      tbody.appendChild(tr);
    }
    init.forEach(addRow);
    var ctr = el("div", { class: "controls" });
    var add = el("button", { type: "button", class: "ghost" }, "+ hipótese"), rem = el("button", { type: "button", class: "ghost" }, "− hipótese");
    var seq = el("button", { type: "button" }, "Usar posterior como nova prior");
    ctr.appendChild(add); ctr.appendChild(rem); ctr.appendChild(seq); w.appendChild(ctr);
    var out = el("div", { class: "out" }); w.appendChild(out);
    function calc() {
      var rows = Array.prototype.slice.call(tbody.rows), pri = [], lik = [];
      rows.forEach(function (tr) { var i = tr.querySelectorAll("input"); pri.push(num(i[1])); lik.push(num(i[2])); });
      var ps = pri.reduce(function (a, b) { return a + (isFinite(b) ? b : 0); }, 0);
      var nums = pri.map(function (p, i) { return (p / ps) * lik[i]; });
      var tot = nums.reduce(function (a, b) { return a + (isFinite(b) ? b : 0); }, 0);
      rows.forEach(function (tr, i) { tr.cells[3].textContent = fmt(nums[i], 5); tr.cells[4].textContent = tot > 0 ? fmt(nums[i] / tot, 5) : "—"; });
      tfoot.innerHTML = '<tr class="total"><td>Total</td><td>' + fmt(ps, 4) + '</td><td>—</td><td class="num">' + fmt(tot, 5) + '</td><td class="num">1</td></tr>';
      var best = 0; nums.forEach(function (v, i) { if (v > nums[best]) best = i; });
      out.innerHTML = "Total do numerador = P(D) = <b>" + fmt(tot, 5) + "</b> (prior predictive dos dados). MAP: <b>" + rows[best].querySelector("input").value + "</b>.";
      w._post = nums.map(function (v) { return v / tot; });
    }
    tb.addEventListener("input", calc);
    add.onclick = function () { addRow(["H" + (tbody.rows.length + 1), "1", "0.5"]); calc(); };
    rem.onclick = function () { if (tbody.rows.length > 1) tbody.deleteRow(-1); calc(); };
    seq.onclick = function () { var rows = tbody.rows; for (var i = 0; i < rows.length; i++) rows[i].querySelectorAll("input")[1].value = (+w._post[i].toFixed(6)); calc(); };
    calc();
  }

  /* ---------- Widget: Beta-Binomial ---------- */
  function betaWidget(w) {
    var d = (w.getAttribute("data-init") || "2,2,6,20").split(",");
    w.innerHTML = '<h4>Explorador Beta-Binomial</h4><div class="controls">' +
      '<label>a (prior)<input name="a" value="' + d[0] + '"></label><label>b (prior)<input name="b" value="' + d[1] + '"></label>' +
      '<label>sucessos k<input name="k" value="' + d[2] + '"></label><label>tentativas n<input name="n" value="' + d[3] + '"></label></div><div class="plot"></div><div class="out"></div>';
    function draw() {
      var a = num(q(w, "a")), b = num(q(w, "b")), k = num(q(w, "k")), n = num(q(w, "n"));
      if (!(a > 0 && b > 0 && n >= k && k >= 0)) return;
      var A = a + k, B = b + n - k;
      var likC = Math.exp(-M.lbeta(k + 1, n - k + 1)); // likelihood normalizada vira Beta(k+1, n-k+1)
      plot(w.querySelector(".plot"), {
        xmin: 0, xmax: 1, label: "prior, likelihood e posterior",
        curves: [
          { f: function (x) { return M.betaPdf(x, a, b); }, color: cssVar("--c1"), dash: true },
          { f: function (x) { return M.betaPdf(x, k + 1, n - k + 1); }, color: cssVar("--c3"), dash: true },
          { f: function (x) { return M.betaPdf(x, A, B); }, color: cssVar("--c2") }
        ],
        legend: [["prior Beta(" + a + "," + b + ")", cssVar("--c1")], ["likelihood (normalizada)", cssVar("--c3")], ["posterior Beta(" + A + "," + B + ")", cssVar("--c2")]]
      });
      var map = (A > 1 && B > 1) ? fmt((A - 1) / (A + B - 2)) : "na borda (A ≤ 1 ou B ≤ 1)";
      var lo = M.betaInv(0.05, A, B), hi = M.betaInv(0.95, A, B);
      w.querySelector(".out").innerHTML = "Posterior: <b>Beta(" + fmt(A) + ", " + fmt(B) + ")</b> · média = " + fmt(A / (A + B)) + " · MAP = " + map +
        " · MLE = k/n = " + fmt(k / n) + "<br>Intervalo de probabilidade 90% (5%–95%): [" + fmt(lo) + ", " + fmt(hi) + "] · P(sucesso no próximo ensaio) = " + fmt(A / (A + B));
    }
    w.addEventListener("input", draw); w._redraw = draw; draw();
  }

  /* ---------- Widget: Normal-Normal ---------- */
  function normalWidget(w) {
    var d = (w.getAttribute("data-init") || "20,2,1,4,22.5").split(",");
    w.innerHTML = '<h4>Explorador Normal-Normal</h4><div class="controls">' +
      '<label>μ prior<input name="m0" value="' + d[0] + '"></label><label>σ prior<input name="s0" value="' + d[1] + '"></label>' +
      '<label>σ dos dados<input name="s" value="' + d[2] + '"></label><label>n<input name="n" value="' + d[3] + '"></label><label>x̄<input name="xb" value="' + d[4] + '"></label></div><div class="plot"></div><div class="out"></div>';
    function draw() {
      var m0 = num(q(w, "m0")), s0 = num(q(w, "s0")), s = num(q(w, "s")), n = num(q(w, "n")), xb = num(q(w, "xb"));
      if (!(s0 > 0 && s > 0 && n >= 1)) return;
      var a = 1 / (s0 * s0), b = n / (s * s), mp = (a * m0 + b * xb) / (a + b), vp = 1 / (a + b), sp = Math.sqrt(vp);
      var lo = Math.min(m0 - 3.5 * s0, xb - 3.5 * s / Math.sqrt(n), mp - 4 * sp), hi = Math.max(m0 + 3.5 * s0, xb + 3.5 * s / Math.sqrt(n), mp + 4 * sp);
      plot(w.querySelector(".plot"), {
        xmin: lo, xmax: hi, label: "prior e posterior normais",
        curves: [
          { f: function (x) { return M.normPdf(x, m0, s0); }, color: cssVar("--c1"), dash: true },
          { f: function (x) { return M.normPdf(x, xb, s / Math.sqrt(n)); }, color: cssVar("--c3"), dash: true },
          { f: function (x) { return M.normPdf(x, mp, sp); }, color: cssVar("--c2") }
        ],
        legend: [["prior", cssVar("--c1")], ["likelihood (normalizada)", cssVar("--c3")], ["posterior", cssVar("--c2")]]
      });
      w.querySelector(".out").innerHTML = "a = 1/σ²<sub>prior</sub> = " + fmt(a) + " · b = n/σ² = " + fmt(b) +
        "<br>Posterior: <b>N(" + fmt(mp) + ", " + fmt(vp) + ")</b> (média, variância) · desvio = " + fmt(sp) +
        "<br>Peso da prior na média: a/(a+b) = " + fmt(a / (a + b)) + " · Peso dos dados: " + fmt(b / (a + b));
    }
    w.addEventListener("input", draw); w._redraw = draw; draw();
  }

  /* ---------- Widget: intervalo de confiança ---------- */
  function ciWidget(w) {
    w.innerHTML = '<h4>Calculadora de intervalos de confiança</h4><div class="controls">' +
      '<label>Tipo<select name="t"><option value="z">Média, σ conhecido (z)</option><option value="zs">Média, n grande, usa S (z)</option><option value="t">Média, normal, σ desconhecido (t)</option><option value="v">Variância, normal (χ²)</option><option value="p">Proporção (z)</option></select></label>' +
      '<label>Confiança (%)<input name="c" value="95"></label><label>n<input name="n" value="25"></label>' +
      '<label class="lx">x̄ ou p̂<input name="x" value="10"></label><label class="ls">σ ou S (desvio)<input name="s" value="2"></label></div><div class="out"></div>';
    function draw() {
      var t = q(w, "t").value, c = num(q(w, "c")) / 100, n = num(q(w, "n")), x = num(q(w, "x")), s = num(q(w, "s")), al = 1 - c, o = "";
      w.querySelector(".ls").style.display = t === "p" ? "none" : "";
      w.querySelector(".lx").style.display = t === "v" ? "none" : "";
      if (t === "z" || t === "zs") { var z = M.normInv(1 - al / 2), m = z * s / Math.sqrt(n); o = "z<sub>α/2</sub> = " + fmt(z) + " · margem = z·σ/√n = " + fmt(m) + "<br>IC: <b>[" + fmt(x - m) + ", " + fmt(x + m) + "]</b>"; }
      if (t === "t") { var tt = M.tInv(1 - al / 2, n - 1), mt = tt * s / Math.sqrt(n); o = "t<sub>α/2, " + (n - 1) + "</sub> = " + fmt(tt) + " · margem = t·S/√n = " + fmt(mt) + "<br>IC: <b>[" + fmt(x - mt) + ", " + fmt(x + mt) + "]</b>"; }
      if (t === "v") { var cr = M.chiInv(1 - al / 2, n - 1), cl = M.chiInv(al / 2, n - 1), v = s * s; o = "χ²<sub>α/2, n−1</sub> = " + fmt(cr) + " · χ²<sub>1−α/2, n−1</sub> = " + fmt(cl) + "<br>IC para σ²: <b>[" + fmt((n - 1) * v / cr) + ", " + fmt((n - 1) * v / cl) + "]</b> · para σ: [" + fmt(Math.sqrt((n - 1) * v / cr)) + ", " + fmt(Math.sqrt((n - 1) * v / cl)) + "]"; }
      if (t === "p") { var zp = M.normInv(1 - al / 2), se = Math.sqrt(x * (1 - x) / n), mc = zp / (2 * Math.sqrt(n)); o = "Usando p̂(1−p̂): IC = <b>[" + fmt(x - zp * se) + ", " + fmt(x + zp * se) + "]</b><br>Conservador (σ ≤ 1/2): [" + fmt(x - mc) + ", " + fmt(x + mc) + "] · n para margem e: n ≥ (z/(2e))²"; }
      w.querySelector(".out").innerHTML = o;
    }
    w.addEventListener("input", draw); w.addEventListener("change", draw); draw();
  }

  /* ---------- Widget: potência do teste z ---------- */
  function powerWidget(w) {
    var d = (w.getAttribute("data-init") || "500,520,40,16,0.05,right").split(",");
    w.innerHTML = '<h4>Visualizador de α, β e potência (teste z para a média)</h4><div class="controls">' +
      '<label>μ₀ (H₀)<input name="m0" value="' + d[0] + '"></label><label>μ₁ (alternativa)<input name="m1" value="' + d[1] + '"></label>' +
      '<label>σ<input name="s" value="' + d[2] + '"></label><label>n<input name="n" value="' + d[3] + '"></label><label>α<input name="a" value="' + d[4] + '"></label>' +
      '<label>Tipo<select name="side"><option value="right">unilateral à direita</option><option value="left">unilateral à esquerda</option><option value="two">bilateral</option></select></label></div><div class="plot"></div><div class="out"></div>';
    q(w, "side").value = d[5];
    function draw() {
      var m0 = num(q(w, "m0")), m1 = num(q(w, "m1")), s = num(q(w, "s")), n = num(q(w, "n")), a = num(q(w, "a")), side = q(w, "side").value;
      if (!(s > 0 && n > 0 && a > 0 && a < 1)) return;
      var se = s / Math.sqrt(n), zc = M.normInv(1 - (side === "two" ? a / 2 : a)), lo = Math.min(m0, m1) - 4 * se, hi = Math.max(m0, m1) + 4 * se;
      var rej, power, cdesc;
      if (side === "right") { var c = m0 + zc * se; rej = [[c, hi]]; power = 1 - M.normCdf(c, m1, se); cdesc = "Rejeita H₀ se x̄ > " + fmt(c); }
      else if (side === "left") { var c2 = m0 - zc * se; rej = [[lo, c2]]; power = M.normCdf(c2, m1, se); cdesc = "Rejeita H₀ se x̄ < " + fmt(c2); }
      else { var cl = m0 - zc * se, cr = m0 + zc * se; rej = [[lo, cl], [cr, hi]]; power = M.normCdf(cl, m1, se) + 1 - M.normCdf(cr, m1, se); cdesc = "Rejeita H₀ se x̄ < " + fmt(cl) + " ou x̄ > " + fmt(cr); }
      var c0 = cssVar("--c1"), c1c = cssVar("--c2");
      plot(w.querySelector(".plot"), {
        xmin: lo, xmax: hi, label: "distribuições de x̄ sob H0 e sob a alternativa",
        curves: [
          { f: function (x) { return M.normPdf(x, m0, se); }, color: c0, fills: rej.map(function (r) { return [r[0], r[1], c0]; }) },
          { f: function (x) { return M.normPdf(x, m1, se); }, color: c1c, fills: rej.map(function (r) { return [r[0], r[1], c1c]; }) }
        ],
        vlines: rej.map(function (r) { return { x: r[0] === lo ? r[1] : r[0], label: "c" }; }),
        legend: [["x̄ sob H₀ (área sombreada = α)", c0], ["x̄ sob μ₁ (área sombreada = potência)", c1c]]
      });
      var zb = M.normInv(power > 0 && power < 1 ? 0.9 : 0.9);
      var need = Math.ceil(Math.pow((zc + M.normInv(0.9)) * s / Math.abs(m1 - m0), 2));
      w.querySelector(".out").innerHTML = "Erro padrão σ/√n = " + fmt(se) + " · z crítico = " + fmt(zc) + "<br>" + cdesc +
        "<br>Potência = 1 − β = <b>" + fmt(power) + "</b> · β = " + fmt(1 - power) +
        "<br>n aproximado para potência 0,9 contra μ₁: " + (isFinite(need) ? need : "—") + (side === "two" ? " (ignorando a cauda oposta)" : "");
    }
    w.addEventListener("input", draw); w.addEventListener("change", draw); w._redraw = draw; draw();
  }

  /* ---------- Widget: tabelas z, t, χ² ---------- */
  function tablesWidget(w) {
    w.innerHTML = '<h4>Tabelas sob demanda: Normal, t de Student e χ²</h4><div class="controls">' +
      '<label>Distribuição<select name="d"><option value="z">Normal padrão Z</option><option value="t">t de Student</option><option value="c">Qui-quadrado χ²</option></select></label>' +
      '<label class="ldf">graus de liberdade<input name="df" value="10"></label>' +
      '<label>valor x<input name="x" value="1.96"></label><label>prob. cauda direita p<input name="p" value="0.05"></label></div><div class="plot"></div><div class="out"></div>';
    function draw() {
      var d = q(w, "d").value, df = num(q(w, "df")), x = num(q(w, "x")), p = num(q(w, "p"));
      w.querySelector(".ldf").style.display = d === "z" ? "none" : "";
      var cdf, pdf, inv, lo, hi, name;
      if (d === "z") { cdf = function (v) { return M.normCdf(v); }; pdf = function (v) { return M.normPdf(v); }; inv = function (pp) { return M.normInv(pp); }; lo = -4; hi = 4; name = "Z"; }
      if (d === "t") { cdf = function (v) { return M.tCdf(v, df); }; pdf = function (v) { return M.tPdf(v, df); }; inv = function (pp) { return M.tInv(pp, df); }; lo = -5; hi = 5; name = "T(" + df + ")"; }
      if (d === "c") { cdf = function (v) { return M.chiCdf(v, df); }; pdf = function (v) { return M.chiPdf(v, df); }; inv = function (pp) { return M.chiInv(pp, df); }; lo = 0; hi = Math.max(df + 5 * Math.sqrt(2 * df), 8); name = "χ²(" + df + ")"; }
      var crit = inv(1 - p), F = cdf(x);
      plot(w.querySelector(".plot"), { xmin: lo, xmax: hi, label: "densidade", curves: [{ f: pdf, color: cssVar("--c1"), fill: [crit, hi] }], vlines: [{ x: x, label: "x", color: cssVar("--c2") }] });
      var o = "P(" + name + " ≤ " + fmt(x) + ") = <b>" + fmt(F, 5) + "</b> · P(" + name + " > " + fmt(x) + ") = <b>" + fmt(1 - F, 5) + "</b>";
      if (d !== "c") o += " · P(|" + (d === "z" ? "Z" : "T") + "| > " + fmt(Math.abs(x)) + ") = " + fmt(2 * (1 - cdf(Math.abs(x))), 5);
      o += "<br>Valor crítico com cauda direita p = " + fmt(p) + ": <b>" + fmt(crit, 4) + "</b> (área sombreada)";
      if (d === "c") o += " · cauda esquerda p: " + fmt(inv(p), 4);
      w.querySelector(".out").innerHTML = o;
    }
    w.addEventListener("input", draw); w.addEventListener("change", draw); w._redraw = draw; draw();
  }

  /* ---------- Widget: MLE (gráfico da log-verossimilhança) ---------- */
  function mleWidget(w) {
    w.innerHTML = '<h4>Veja a log-verossimilhança</h4><div class="controls">' +
      '<label>Modelo<select name="m"><option value="pois">Poisson(λ)</option><option value="bern">Bernoulli(θ)</option><option value="unif">Uniforme[0, θ]</option></select></label>' +
      '<label>Dados (separe por vírgula ou espaço)<input type="text" name="d" value="3 5 2 4 6" style="width:14rem"></label></div><div class="plot"></div><div class="out"></div>';
    function draw() {
      var m = q(w, "m").value, xs = q(w, "d").value.split(/[\s,;]+/).filter(Boolean).map(Number).filter(isFinite);
      if (!xs.length) return;
      var n = xs.length, S = xs.reduce(function (a, b) { return a + b; }, 0), mx = Math.max.apply(null, xs), f, lo, hi, est, txt, isL = true;
      if (m === "pois") { est = S / n; lo = Math.max(1e-3, est * 0.2); hi = est * 2.2 + 0.5; f = function (l) { return S * Math.log(l) - n * l; }; txt = "λ̂ = x̄ = " + fmt(est); }
      if (m === "bern") { est = S / n; lo = 0.005; hi = 0.995; f = function (t) { return S * Math.log(t) + (n - S) * Math.log(1 - t); }; txt = "θ̂ = (nº de 1s)/n = " + fmt(est) + " (use dados 0/1)"; }
      if (m === "unif") { est = mx; lo = mx * 0.5; hi = mx * 2; isL = false; f = function (t) { return t < mx ? 0 : Math.pow(t, -n); }; txt = "θ̂ = max(xᵢ) = " + fmt(est) + " — a função não tem derivada nula: ela salta no máximo e depois só decresce"; }
      var vals = []; for (var i = 0; i <= 200; i++) { var x = lo + (hi - lo) * i / 200; vals.push(f(x)); }
      var top = Math.max.apply(null, vals.filter(isFinite)), bot = Math.min.apply(null, vals.filter(isFinite));
      var g = isL ? function (x) { var v = f(x); return (v - bot) / (top - bot + 1e-12); } : function (x) { return f(x) / top; };
      plot(w.querySelector(".plot"), { xmin: lo, xmax: hi, label: "verossimilhança", curves: [{ f: g, color: cssVar("--c1") }], vlines: [{ x: est, label: "estimativa", color: cssVar("--c2") }] });
      w.querySelector(".out").innerHTML = (isL ? "Curva: ln L (reescalada para caber no gráfico). " : "Curva: L(θ) (reescalada). ") + "<b>" + txt + "</b> · n = " + n + " · Σx = " + fmt(S);
    }
    w.addEventListener("input", draw); w.addEventListener("change", draw); w._redraw = draw; draw();
  }

  var registry = { "bayes-table": bayesTable, beta: betaWidget, normal: normalWidget, ci: ciWidget, power: powerWidget, tables: tablesWidget, mle: mleWidget };
  function boot() {
    document.querySelectorAll("[data-widget]").forEach(function (w) { var f = registry[w.getAttribute("data-widget")]; w.classList.add("widget"); if (f) try { f(w); } catch (e) { w.textContent = "Erro no widget: " + e.message; } });
    if (window.renderMathInElement) {
      renderMathInElement(document.body, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }, { left: "\\(", right: "\\)", display: false }], throwOnError: false, ignoredClasses: ["widget"] });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
