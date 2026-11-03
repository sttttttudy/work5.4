/* =========================================================
   石油案例可视化工具箱 PV
   ---------------------------------------------------------
   · 理论概念图：条形 / 频次 / 构成 / 曲线 / 井筒 / 压力窗口 …
   · 流程步骤图：flow / io / check / seq / compare …
   · WHAT-WHY-HOW 三联：PV.triptych
   同时把 K.pipeline 换成支持"每步一张图"的版本。
   纯字符串拼接，无依赖；颜色与 tokens.css 一致。
   ========================================================= */
(function (global) {
  'use strict';

  var FM = 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';

  /* ---------- 调色板（与 tokens.css 对齐） ---------- */
  var C = {
    ink: '#242b2e', ink2: '#4d565b', ink3: '#79828a', ink4: '#9ba3a9',
    line: '#e9e4d8', line2: '#ddd7c8', line3: '#c9c2b0',
    jade: '#2f7d6b', jadeD: '#235f51', jadeL: '#e6f1ec',
    clay: '#b26a39', clayD: '#8e5229', clayL: '#f8ecdf',
    opt: '#41699b', optL: '#e7eef9',
    nlp: '#7e5a8d', nlpL: '#efe9f4',
    kg: '#767a2e', kgL: '#f1f1dd',
    ok: '#3f8560', okL: '#e7f3ea',
    warn: '#a97a1c', warnL: '#f9efd7',
    bad: '#b05a51', badL: '#f9e9e5'
  };

  var TONE = {
    jade: [C.jade, C.jadeL], clay: [C.clay, C.clayL],
    opt: [C.opt, C.optL], nlp: [C.nlp, C.nlpL], kg: [C.kg, C.kgL],
    ok: [C.ok, C.okL], warn: [C.warn, C.warnL], bad: [C.bad, C.badL],
    ink: [C.ink2, '#f5f2ea'], gray: [C.ink4, '#f7f5ef']
  };

  function tone(k) { return TONE[k] || TONE.gray; }

  /* ---------- 基础工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 粗略估宽：中文按 1em，拉丁按 0.52—0.62em */
  function tw(s, size) {
    s = String(s == null ? '' : s);
    var w = 0;
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i), code = s.charCodeAt(i);
      if (code > 255) w += size;
      else if (/[iIlj.,;:'!|]/.test(ch)) w += size * 0.34;
      else if (/[A-Z0-9]/.test(ch)) w += size * 0.62;
      else if (ch === ' ') w += size * 0.30;
      else w += size * 0.52;
    }
    return w;
  }

  function wrap(w, h, body, label) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img" aria-label="' + esc(label || '示意图') + '">' +
      '<rect width="' + w + '" height="' + h + '" fill="#ffffff"/>' + body + '</svg>';
  }

  /* ---------- 图元 ---------- */
  function t(x, y, str, o) {
    o = o || {};
    var sz = o.sz || 9.5;
    var a = '<text x="' + x + '" y="' + y + '" font-size="' + sz +
      '" fill="' + (o.f || C.ink2) + '"';
    if (o.a) a += ' text-anchor="' + o.a + '"';
    if (o.w) a += ' font-weight="' + o.w + '"';
    if (o.m) a += ' font-family="' + FM + '"';
    if (o.ls) a += ' letter-spacing="' + o.ls + '"';
    if (o.op != null) a += ' opacity="' + o.op + '"';
    if (o.rot) a += ' transform="rotate(' + o.rot + ' ' + x + ' ' + y + ')"';
    return a + '>' + esc(str) + '</text>';
  }

  function l(x1, y1, x2, y2, o) {
    o = o || {};
    var a = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="' + (o.stroke || C.line) + '" stroke-width="' + (o.sw || 1) + '"';
    if (o.so != null) a += ' stroke-opacity="' + o.so + '"';
    if (o.dash) a += ' stroke-dasharray="' + o.dash + '"';
    if (o.cap) a += ' stroke-linecap="' + o.cap + '"';
    return a + '/>';
  }

  function r(x, y, w, h, o) {
    o = o || {};
    var a = '<rect x="' + x + '" y="' + y +
      '" width="' + Math.max(0, w).toFixed(1) +
      '" height="' + Math.max(0, h).toFixed(1) + '"';
    if (o.rx != null) a += ' rx="' + o.rx + '"';
    a += ' fill="' + (o.fill || 'none') + '"';
    if (o.fo != null) a += ' fill-opacity="' + o.fo + '"';
    if (o.stroke) {
      a += ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 1) + '"';
      if (o.so != null) a += ' stroke-opacity="' + o.so + '"';
    }
    if (o.dash) a += ' stroke-dasharray="' + o.dash + '"';
    return a + '/>';
  }

  function c(cx, cy, rad, o) {
    o = o || {};
    var a = '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) +
      '" r="' + rad.toFixed(2) + '" fill="' + (o.fill || 'none') + '"';
    if (o.fo != null) a += ' fill-opacity="' + o.fo + '"';
    if (o.stroke) a += ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 1) + '"';
    if (o.so != null) a += ' stroke-opacity="' + o.so + '"';
    return a + '/>';
  }

  function path(pts, o) {
    o = o || {};
    if (!pts || !pts.length) return '';
    var d = pts.map(function (p, i) {
      return (i ? 'L' : 'M') + (+p[0]).toFixed(1) + ' ' + (+p[1]).toFixed(1);
    }).join('');
    if (o.close) d += 'Z';
    var a = '<path d="' + d + '" fill="' + (o.fill || 'none') + '"';
    if (o.stroke) {
      a += ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 1) + '"';
      if (o.so != null) a += ' stroke-opacity="' + o.so + '"';
      if (o.cap) a += ' stroke-linecap="' + o.cap + '"';
      if (o.join) a += ' stroke-linejoin="' + o.join + '"';
    }
    if (o.dash) a += ' stroke-dasharray="' + o.dash + '"';
    return a + '/>';
  }

  function ar(x1, y1, x2, y2, o) {
    o = o || {};
    var col = o.stroke || C.line3, hd = o.h || 4.5;
    var ang = Math.atan2(y2 - y1, x2 - x1);
    var bx = x2 - Math.cos(ang) * hd, by = y2 - Math.sin(ang) * hd;
    var p2 = [
      bx + Math.cos(ang + Math.PI / 2) * hd * 0.62,
      by + Math.sin(ang + Math.PI / 2) * hd * 0.62
    ];
    var p3 = [
      bx + Math.cos(ang - Math.PI / 2) * hd * 0.62,
      by + Math.sin(ang - Math.PI / 2) * hd * 0.62
    ];
    return l(x1, y1, bx, by, { stroke: col, sw: o.sw || 1.2, dash: o.dash }) +
      '<path d="M' + x2.toFixed(1) + ' ' + y2.toFixed(1) +
      'L' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) +
      'L' + p3[0].toFixed(1) + ' ' + p3[1].toFixed(1) +
      'Z" fill="' + col + '"/>';
  }

  function up(x, y, len, col) {
    return l(x, y + len, x, y + 2, { stroke: col, sw: 1, so: .85 }) +
      '<path d="M' + x + ' ' + y + 'l-2.8 4.4h5.6z" fill="' + col + '" fill-opacity=".85"/>';
  }

  function chipW(label, sz, pad) {
    return tw(label, sz) + (pad == null ? 5 : pad) * 2;
  }

  function chip(x, y, label, o) {
    o = o || {};
    var sz = o.sz || 8.4, pad = o.pad == null ? 5 : o.pad;
    var w = chipW(label, sz, pad), h = sz + 8;
    var tc = tone(o.tone || 'jade');
    return r(x, y, w, h, {
      fill: o.solid ? tc[0] : tc[1],
      stroke: tc[0], so: o.solid ? .95 : .26, rx: 3
    }) + t(x + w / 2, y + h / 2 + sz * .36, label, {
      sz: sz, a: 'middle', m: 1, w: 600, f: o.solid ? '#fff' : tc[0]
    });
  }

  /* =========================================================
     一、五格流程条
     ========================================================= */
  function flow(items, o) {
    o = o || {};
    var w = o.w || 620, pad = o.pad || 8, gap = o.gap || 11, n = items.length;
    var cw = (w - pad * 2 - gap * (n - 1)) / n;
    var maxLines = 0;
    items.forEach(function (it) {
      maxLines = Math.max(maxLines, (it.lines || []).length);
    });
    var bh = o.bh || (48 + maxLines * 13);
    var y = o.y || (o.head ? 26 : 12);
    var h = o.h || (y + bh + (o.note ? 28 : 14));
    var s = '';

    if (o.head) s += t(pad, 12, o.head, { sz: 8, m: 1, ls: '.1em', f: C.ink4 });

    items.forEach(function (it, i) {
      var x = pad + i * (cw + gap), tc = tone(it.tone || 'jade');
      s += r(x, y, cw, bh, { fill: it.fill || '#fff', stroke: tc[0], so: .3, rx: 8 });
      s += r(x, y, cw, 3, { fill: tc[0], rx: 1.5, fo: .95 });
      s += t(x + 9, y + 18, it.tag || ('0' + (i + 1)), { sz: 7.4, m: 1, ls: '.07em', f: tc[0] });
      s += t(x + 9, y + 34, it.title, { sz: Math.min(10.6, cw / 8), w: 600, f: C.ink });
      (it.lines || []).forEach(function (ln, k) {
        s += t(x + 9, y + 50 + k * 13, ln, { sz: Math.min(8.6, cw / 10.4), f: C.ink3 });
      });
      if (i < n - 1) {
        s += ar(x + cw + 1, y + bh / 2, x + cw + gap - 1, y + bh / 2,
          { stroke: C.line3, h: 3.6 });
      }
    });

    if (o.note) s += t(w / 2, h - 8, o.note, { sz: 8.4, f: C.ink4, a: 'middle' });
    return wrap(w, h, s, o.label || '流程示意');
  }

  /* =========================================================
     二、横向条形对比
     ========================================================= */
  function bars(rows, o) {
    o = o || {};
    var w = o.w || 340, lh = o.lh || 25;
    var left = o.left || 108, right = o.right || 58;
    var top = o.head ? 22 : 8;
    var h = o.h || (top + rows.length * lh + (o.note ? 18 : 8));
    var max = o.max || Math.max.apply(null, rows.map(function (x) {
      return x[1] || 0;
    })) || 1;
    var s = '';

    if (o.head) s += t(0, 12, o.head, { sz: 7.6, m: 1, ls: '.1em', f: C.ink4 });

    rows.forEach(function (rw, i) {
      var y = top + i * lh, tc = tone(rw[2] || 'jade');
      s += t(left - 8, y + lh * 0.62, rw[0], { sz: 8.8, f: C.ink2, a: 'end' });
      var bw = Math.max(2, (w - left - right) * (rw[1] || 0) / max);
      s += r(left, y + 3, bw, lh - 11, { fill: tc[0], rx: 2.5, fo: .88 });
      s += t(left + bw + 6, y + lh * 0.62,
        rw[3] != null ? rw[3] : rw[1], { sz: 8.4, m: 1, f: C.ink3 });
    });

    if (o.note) s += t(0, h - 4, o.note, { sz: 8, f: C.ink4 });
    return wrap(w, h, s, o.label || '对比条');
  }

  /* =========================================================
     三、三格刻度（难度分解）
     ========================================================= */
  function score(rows, o) {
    o = o || {};
    var w = o.w || 340, lh = 25, left = o.left || 86;
    var top = o.head ? 22 : 8;
    var h = o.h || (top + rows.length * lh + (o.note ? 18 : 8));
    var s = '';

    if (o.head) s += t(0, 12, o.head, { sz: 7.6, m: 1, ls: '.1em', f: C.ink4 });

    rows.forEach(function (rw, i) {
      var y = top + i * lh, lv = rw[1] || 2;
      var col = lv >= 3 ? C.bad : lv === 2 ? C.warn : C.ok;
      s += t(left - 8, y + lh * 0.62, rw[0], { sz: 8.8, f: C.ink2, a: 'end' });
      for (var k = 0; k < 3; k++) {
        s += r(left + k * 24, y + 6, 19, 10, {
          rx: 2.5,
          fill: k < lv ? col : C.line,
          fo: k < lv ? .9 : 1
        });
      }
      if (rw[2]) s += t(left + 3 * 24 + 8, y + lh * 0.62, rw[2], { sz: 8.2, f: C.ink4 });
    });

    if (o.note) s += t(0, h - 4, o.note, { sz: 8, f: C.ink4 });
    return wrap(w, h, s, o.label || '难度分解');
  }

  /* =========================================================
     四、采样频次阶梯（对数时间轴）
     ========================================================= */
  function freq(rows, o) {
    o = o || {};
    var w = o.w || 620, lh = 24;
    var left = o.left || 106, right = o.right || 94;
    var top = o.head ? 26 : 10;
    var h = o.h || (top + rows.length * lh + 34);
    var x0 = left, x1 = w - right;
    var hi = Math.log10(30 * 86400);

    function X(sec) {
      return x0 + Math.log10(Math.max(1, sec)) / hi * (x1 - x0);
    }

    var s = '';
    if (o.head) s += t(0, 12, o.head, { sz: 7.6, m: 1, ls: '.1em', f: C.ink4 });

    [[1, '1s'], [60, '1m'], [3600, '1h'], [86400, '1d'], [30 * 86400, '30d']]
      .forEach(function (tk) {
        s += l(X(tk[0]), top - 4, X(tk[0]), top + rows.length * lh,
          { stroke: C.line, dash: '2 4' });
        s += t(X(tk[0]), top + rows.length * lh + 14, tk[1],
          { sz: 7.4, a: 'middle', f: C.ink4, m: 1 });
      });

    rows.forEach(function (rw, i) {
      var y = top + i * lh + lh / 2, tc = tone(rw[4] || 'jade');
      s += t(left - 8, y + 3.2, rw[0], { sz: 8.8, a: 'end', f: C.ink2 });
      var a = X(rw[1]), b = X(rw[2] || rw[1]);
      if (b - a < 4) b = a + 4;
      s += l(a, y, b, y, { stroke: tc[0], sw: 3.2, cap: 'round' });
      s += c(a, y, 2.4, { fill: tc[0] });
      if (rw[3]) s += t(x1 + 8, y + 3.2, rw[3], { sz: 8, m: 1, f: C.ink4 });
    });

    return wrap(w, h, s, o.label || '数据频次');
  }

  /* =========================================================
     五、构成堆叠条
     ========================================================= */
  function stack(parts, o) {
    o = o || {};
    var w = o.w || 340, pad = o.pad || 8, y = o.y || 10, bh = o.bh || 18;
    var aw = w - pad * 2, tot = 0;
    parts.forEach(function (p) { tot += (p[1] || 1); });

    var s = '', x = pad;
    parts.forEach(function (p) {
      var pw = aw * (p[1] || 1) / tot, tc = tone(p[2] || 'jade');
      s += r(x, y, Math.max(1, pw - 1.5), bh, { fill: tc[0], rx: 3, fo: .9 });
      if (pw > 34) {
        s += t(x + pw / 2, y + bh / 2 + 3.4, p[1] + '%',
          { sz: 8.2, a: 'middle', m: 1, f: '#fff', w: 600 });
      }
      x += pw;
    });

    var lx = pad, ly = y + bh + 17;
    parts.forEach(function (p) {
      var tc = tone(p[2] || 'jade'), need = tw(p[0], 8.2) + 22;
      if (lx + need > w - pad) { lx = pad; ly += 15; }
      s += r(lx, ly - 6, 7, 7, { rx: 2, fill: tc[0] });
      s += t(lx + 11, ly, p[0], { sz: 8.2, f: C.ink3 });
      lx += need;
    });

    return wrap(w, ly + 8, s, o.label || '构成');
  }

  /* =========================================================
     六、时间 / 工序序列条
     ========================================================= */
  function seq(parts, o) {
    o = o || {};
    var w = o.w || 340, pad = o.pad || 8, y = o.y || 30, bh = o.bh || 22, tot = 0;
    parts.forEach(function (p) { tot += (p[1] || 1); });

    var aw = w - pad * 2, s = '', x = pad;
    if (o.head) s += t(pad, 14, o.head, { sz: 7.6, m: 1, ls: '.1em', f: C.ink4 });

    parts.forEach(function (p) {
      var pw = aw * (p[1] || 1) / tot, tc = tone(p[2] || 'jade');
      s += r(x, y, Math.max(1, pw - 1.5), bh, { fill: tc[0], rx: 2.5, fo: .85 });
      if (pw > 34) {
        s += t(x + pw / 2, y + bh / 2 + 3.4, p[0],
          { sz: 8, a: 'middle', f: '#fff', w: 600 });
      } else {
        s += t(x + pw / 2, y + bh + 12, p[0], { sz: 7.4, a: 'middle', f: tc[0] });
      }
      x += pw;
    });

    if (o.note) s += t(w / 2, y + bh + 26, o.note, { sz: 8, a: 'middle', f: C.ink4 });
    return wrap(w, o.h || (y + bh + (o.note ? 34 : 18)), s, o.label || '序列');
  }

  /* =========================================================
     七、双栏对比
     ========================================================= */
  function compare(panels, o) {
    o = o || {};
    var w = o.w || 340, gap = o.gap || 8, pad = o.pad || 6;
    var n = panels.length;
    var cw = (w - pad * 2 - gap * (n - 1)) / n;
    var h = o.h || 150, top = 6;
    var s = '';

    panels.forEach(function (p, i) {
      var x = pad + i * (cw + gap), tc = tone(p.tone || 'gray');
      s += r(x, top, cw, h - top - 6, {
        fill: p.fill || '#fff', stroke: tc[0], so: .26, rx: 7
      });
      s += t(x + 9, top + 15, p.tag || '', { sz: 7.4, m: 1, ls: '.08em', f: tc[0] });
      s += t(x + 9, top + 29, p.title || '', { sz: 10, w: 600, f: C.ink });
      if (p.body) s += p.body(x, top + 37, cw - 18, h - top - 50, tc);
    });

    return wrap(w, h, s, o.label || '对比示意');
  }

  /* =========================================================
     八、曲线（带背景带与标记）
     ========================================================= */
  function trace(o) {
    o = o || {};
    var w = o.w || 340, h = o.h || 150;
    var L = o.left == null ? 14 : o.left;
    var R = o.right == null ? 14 : o.right;
    var T = o.top == null ? 22 : o.top;
    var B = o.bottom == null ? 24 : o.bottom;
    var x0 = L, x1 = w - R, y0 = T, y1 = h - B;
    var s = '';

    (o.bands || []).forEach(function (b) {
      var bx = x0 + b.from * (x1 - x0);
      var bw = (b.to - b.from) * (x1 - x0);
      var tc = tone(b.tone || 'jade');
      s += r(bx, y0, bw, y1 - y0, { fill: tc[0], fo: .1 });
      if (b.label) {
        s += t(bx + bw / 2, y0 + 11, b.label,
          { sz: 8, a: 'middle', f: tc[0], w: 600 });
      }
    });

    (o.grid || []).forEach(function (g) {
      var gy = y1 - g * (y1 - y0);
      s += l(x0, gy, x1, gy, { stroke: C.line, dash: '2 4' });
    });

    s += l(x0, y1, x1, y1, { stroke: C.line2 });

    var n = o.n || 180, pts = [];
    for (var i = 0; i <= n; i++) {
      var u = i / n, v = o.fn(u, i);
      pts.push([x0 + u * (x1 - x0), y1 - Math.max(0, Math.min(1, v)) * (y1 - y0)]);
    }
    s += path(pts, { stroke: o.stroke || C.ink2, sw: o.sw || 1.4, join: 'round' });

    (o.marks || []).forEach(function (m) {
      var mx = x0 + m.at * (x1 - x0), tc = tone(m.tone || 'clay');
      s += l(mx, y0, mx, y1, { stroke: tc[0], so: .45, dash: '3 3' });
      if (m.v != null) s += c(mx, y1 - m.v * (y1 - y0), 2.6, { fill: tc[0] });
      s += t(mx + (m.dx || 0),
        m.down ? y1 + 14 : y0 - 6 + (m.dy || 0),
        m.label,
        { sz: 8, a: m.a || 'middle', f: tc[0], w: 600 });
    });

    if (o.xlab) s += t(x1, h - 6, o.xlab, { sz: 7.8, a: 'end', f: C.ink4, m: 1 });
    if (o.ylab) s += t(2, y0 - 8, o.ylab, { sz: 7.8, f: C.ink4, m: 1 });

    return wrap(w, h, s, o.label || '曲线示意');
  }

  /* =========================================================
     九、预测—实测散点
     ========================================================= */
  function scatter(o) {
    o = o || {};
    var w = o.w || 340, h = o.h || 150;
    var x0 = 30, x1 = w - 12, y0 = 20, y1 = h - 22;
    var s = '';

    s += r(x0, y0, x1 - x0, y1 - y0, { fill: '#fdfcf9', stroke: C.line });
    s += l(x0, y1, x1, y0, { stroke: C.line3, dash: '4 4' });

    (o.pts || []).forEach(function (p) {
      s += c(x0 + p[0] * (x1 - x0), y1 - p[1] * (y1 - y0),
        o.rad || 2.3, { fill: o.color || C.jade, fo: .7 });
    });

    s += t(x1, h - 6, o.xlab || '实测', { sz: 7.8, a: 'end', f: C.ink4 });
    s += t(2, y0 - 6, o.ylab || '预测', { sz: 7.8, f: C.ink4 });
    if (o.note) s += t(x0 + 6, y0 + 14, o.note, { sz: 7.8, f: C.ink4 });

    return wrap(w, h, s, o.label || '预测—实测');
  }

  /* =========================================================
     十、输入 / 输出两栏
     ========================================================= */
  function io(o) {
    o = o || {};
    var w = o.w || 340, h = o.h || 132;
    var ins = o.in || [], outs = o.out || [];
    var rows = Math.max(ins.length, outs.length);
    var lx = 10, rx = w - 10;
    var s = '';

    s += t(lx, 14, o.inLabel || '输入', { sz: 7.6, m: 1, ls: '.08em', f: C.ink4 });
    s += t(rx, 14, o.outLabel || '输出', { sz: 7.6, m: 1, ls: '.08em', f: C.ink4, a: 'end' });

    ins.forEach(function (it, i) {
      var y = 30 + i * 19;
      s += c(lx + 3, y - 3, 2.4, { fill: tone(o.inTone || 'gray')[0] });
      s += t(lx + 11, y, it, { sz: 8.8, f: C.ink2 });
    });

    outs.forEach(function (it, i) {
      var y = 30 + i * 19;
      s += c(rx - 3, y - 3, 2.4, { fill: tone(o.outTone || 'jade')[0] });
      s += t(rx - 11, y, it, { sz: 8.8, f: C.ink, a: 'end' });
    });

    var mx = w / 2, my = 34 + rows * 19 / 2;
    s += ar(mx - 24, my, mx + 24, my, { stroke: C.line3, h: 4 });
    if (o.mid) s += t(mx, my - 8, o.mid, { sz: 8.2, a: 'middle', f: C.jadeD, w: 600 });
    if (o.note) s += t(w / 2, h - 6, o.note, { sz: 8, a: 'middle', f: C.ink4 });

    return wrap(w, h, s, o.label || '输入输出');
  }

  /* =========================================================
     十一、勾选清单
     ========================================================= */
  function check(items, o) {
    o = o || {};
    var w = o.w || 340, lh = o.lh || 22;
    var top = o.head ? 22 : 8;
    var h = o.h || (top + items.length * lh + 10);
    var s = '';

    if (o.head) s += t(0, 12, o.head, { sz: 7.6, m: 1, ls: '.1em', f: C.ink4 });

    items.forEach(function (it, i) {
      var y = top + i * lh, ok = it[1];
      var bx = 6, by = y + (lh - 12) / 2;
      s += r(bx, by, 12, 12, {
        rx: 3,
        fill: ok ? C.okL : '#fff',
        stroke: ok ? C.ok : C.line2
      });
      if (ok) {
        s += path([
          [bx + 3, by + 6],
          [bx + 5.4, by + 9],
          [bx + 9, by + 3]
        ], { stroke: C.ok, sw: 1.6, cap: 'round', join: 'round' });
      }
      s += t(26, y + lh * 0.66, it[0], { sz: 8.8, f: ok ? C.ink2 : C.ink4 });
      if (it[2]) {
        s += t(w - 6, y + lh * 0.66, it[2], { sz: 8, f: C.ink4, a: 'end', m: 1 });
      }
    });

    return wrap(w, h, s, o.label || '检查表');
  }

  /* =========================================================
     十二、井筒示意
     ========================================================= */
  function wellbore(o) {
    o = o || {};
    var w = o.w || 300, h = o.h || 320;
    var cx = o.cx || Math.round(w * 0.52);
    var top = o.top || 14, bot = h - (o.bot || 22);
    var layers = o.layers || [['地层', 1, '#f5f2ea']];
    var tot = 0;
    layers.forEach(function (L) { tot += (L[1] || 1); });

    var s = '', y = top;
    layers.forEach(function (L) {
      var hh = (bot - top) * (L[1] || 1) / tot;
      s += r(6, y, w - 12, hh, { fill: L[2] || '#f5f2ea', fo: .6 });
      s += l(6, y, w - 6, y, { stroke: C.line });
      if (L[0]) s += t(13, y + 12.5, L[0], { sz: 8.2, f: C.ink3 });
      y += hh;
    });
    s += l(6, bot, w - 6, bot, { stroke: C.line2 });

    /* 套管 + 钻柱 + 钻头 */
    var cEnd = top + (bot - top) * (o.casing == null ? 0.34 : o.casing);
    s += l(cx - 11, top, cx - 11, bot, { stroke: C.line2 });
    s += l(cx + 11, top, cx + 11, bot, { stroke: C.line2 });
    s += l(cx - 11, top, cx - 11, cEnd, { stroke: C.ink3, sw: 2.6 });
    s += l(cx + 11, top, cx + 11, cEnd, { stroke: C.ink3, sw: 2.6 });
    s += l(cx - 15, cEnd, cx + 15, cEnd, { stroke: C.ink3, sw: 2 });
    s += l(cx - 2.6, top, cx - 2.6, bot - 12, { stroke: C.ink2, sw: 1.5 });
    s += l(cx + 2.6, top, cx + 2.6, bot - 12, { stroke: C.ink2, sw: 1.5 });
    s += '<path d="M' + (cx - 8) + ' ' + (bot - 13) + 'h16l-3 11h-10z" fill="' +
      C.clay + '" fill-opacity=".9"/>';

    /* 上返箭头 */
    var n = o.arrows == null ? 4 : o.arrows;
    for (var k = 0; k < n; k++) {
      var span = (bot - 26) - (cEnd + 10);
      var ay = cEnd + 10 + span * (n <= 1 ? 0 : k / (n - 1));
      s += up(cx + 15, ay, 12, C.jade);
    }

    /* 标注 */
    (o.marks || []).forEach(function (m) {
      var my = top + m.at * (bot - top);
      var tc = tone(m.tone || 'clay');
      var side = m.side || 'right';
      if (side === 'right') {
        s += l(cx + 12, my, w - 8, my, { stroke: tc[0], so: .5, dash: '3 3' });
        s += t(cx + 16, my - 4, m.label, { sz: 8, f: tc[0], w: 600 });
        if (m.sub) s += t(cx + 16, my + 8, m.sub, { sz: 7.8, f: C.ink4 });
      } else {
        s += l(8, my, cx - 12, my, { stroke: tc[0], so: .5, dash: '3 3' });
        s += t(cx - 16, my - 4, m.label, { sz: 8, f: tc[0], w: 600, a: 'end' });
      }
    });

    if (o.note) s += t(w / 2, h - 6, o.note, { sz: 8, a: 'middle', f: C.ink4 });
    return wrap(w, h, s, o.label || '井筒示意');
  }

  /* =========================================================
     十三、压力窗口（孔隙 / 破裂 / ECD）
     ========================================================= */
  function pressWindow(o) {
    o = o || {};
    var w = o.w || 620, h = o.h || 250;
    var L = o.left || 54, R = o.right || 118;
    var T = o.top || 24, B = o.bottom || 30;
    var x0 = L, x1 = w - R, y0 = T, y1 = h - B;

    function X(v) { return x0 + v * (x1 - x0); }
    function Y(d) { return y0 + d * (y1 - y0); }

    var s = '';

    /* 网格与密度刻度 */
    [0, .25, .5, .75, 1].forEach(function (v) {
      s += l(X(v), y0, X(v), y1, { stroke: C.line, dash: '2 4' });
      s += t(X(v), y1 + 16, (1.0 + v * 1.2).toFixed(1),
        { sz: 7.6, a: 'middle', f: C.ink4, m: 1 });
    });
    s += l(x0, y1, x1, y1, { stroke: C.line2 });

    /* 安全窗口填充 */
    var a = o.pore.map(function (p) { return [X(p[1]), Y(p[0])]; });
    var b = o.frac.map(function (p) { return [X(p[1]), Y(p[0])]; }).reverse();
    s += path(a.concat(b), { fill: C.jadeL, close: true });

    /* 三条曲线 */
    s += path(o.pore.map(function (p) { return [X(p[1]), Y(p[0])]; }),
      { stroke: C.opt, sw: 1.6 });
    s += path(o.frac.map(function (p) { return [X(p[1]), Y(p[0])]; }),
      { stroke: C.clay, sw: 1.6 });
    s += path((o.mud || []).map(function (p) { return [X(p[1]), Y(p[0])]; }),
      { stroke: C.jade, sw: 1.8, dash: '5 3' });

    /* 窄窗口标注 */
    if (o.narrow) {
      var ny0 = Y(o.narrow.from), ny1 = Y(o.narrow.to);
      s += l(x1 + 8, ny0, x1 + 8, ny1, { stroke: C.bad, sw: 2 });
      s += l(x1 + 4, ny0, x1 + 12, ny0, { stroke: C.bad, sw: 1.4 });
      s += l(x1 + 4, ny1, x1 + 12, ny1, { stroke: C.bad, sw: 1.4 });
      s += t(x1 + 16, (ny0 + ny1) / 2 - 3, o.narrow.label,
        { sz: 8, f: C.bad, w: 600 });
      s += t(x1 + 16, (ny0 + ny1) / 2 + 9, o.narrow.sub || '',
        { sz: 7.6, f: C.ink4 });
    }

    /* 图例 */
    [['孔隙压力', C.opt], ['破裂压力', C.clay], ['钻井液 / ECD', C.jade]]
      .forEach(function (lg, i) {
        var ly = y0 + 14 + i * 16;
        s += l(x1 + 12, ly - 3, x1 + 26, ly - 3, { stroke: lg[1], sw: 2 });
        s += t(x1 + 32, ly, lg[0], { sz: 8, f: C.ink3 });
      });

    if (o.depthNote) {
      s += t(8, y0 - 8, o.depthNote, { sz: 7.8, f: C.ink4, m: 1 });
    }
    s += t(x1, h - 6, '当量密度 g/cm³ →', { sz: 7.8, a: 'end', f: C.ink4, m: 1 });

    return wrap(w, h, s, o.label || '压力窗口');
  }

  /* =========================================================
     十四、WHAT / WHY / HOW 三联
     ========================================================= */
  function triptych(cards) {
    return '<div class="w3">' + cards.map(function (c2) {
      return '<div>' +
        '<div class="wk">' + esc(c2.k) + '</div>' +
        '<h4>' + esc(c2.t) + '</h4>' +
        (c2.p || '') +
        (c2.svg || '') +
        '</div>';
    }).join('') + '</div>';
  }

  /* =========================================================
     十五、注册辅助
     ========================================================= */
  function sec(no, en, title, html) {
    return { no: no, en: en, title: title, html: html };
  }

  function step(name, role, do_, effect, trap, fig, cap) {
    return {
      name: name, role: role, do: do_,
      effect: effect, trap: trap,
      fig: fig, figcap: cap
    };
  }

  /* =========================================================
     十六、扩展 K.pipeline：支持每步一张图
     ---------------------------------------------------------
     不改 ui.css、不改 shell.js —— 只在运行时包一层。
     步骤对象带 fig 时走新版式，否则退回原实现。
     ========================================================= */
  if (global.K && typeof global.K.pipeline === 'function') {
    var basePipe = global.K.pipeline;

    global.K.pipeline = function (steps) {
      var any = false;
      (steps || []).forEach(function (s) {
        if (s && s.fig) any = true;
      });
      if (!any) return basePipe(steps);

      return '<div class="pipeline">' + steps.map(function (s, i) {
        var body = '<div class="pdo">' + K.rich(s.do) + '</div>' +
          (s.effect
            ? '<div class="peff"><span class="k">预期效果</span><span>' +
              K.rich(s.effect) + '</span></div>'
            : '') +
          (s.trap
            ? '<div class="peff" style="border-top-color:rgba(176,90,81,.2)">' +
              '<span class="k" style="color:var(--bad)">常见坑</span><span>' +
              K.rich(s.trap) + '</span></div>'
            : '');

        var fig = s.fig
          ? '<div class="pfig">' + s.fig +
            (s.figcap
              ? '<div class="pfigcap">' + K.rich(s.figcap) + '</div>'
              : '') +
            '</div>'
          : '';

        return '<div class="pstep">' +
          '<div class="pn">' + K.pad(i + 1) + '</div>' +
          '<div class="pc">' +
            '<h4>' + esc(s.name) +
              (s.role ? '<span class="role">' + esc(s.role) + '</span>' : '') +
            '</h4>' +
            (fig
              ? '<div class="pc-body"><div class="pc-txt">' + body + '</div>' + fig + '</div>'
              : body) +
          '</div></div>';
      }).join('') + '</div>';
    };
  }

  /* =========================================================
     十七、对外接口
     ========================================================= */
  global.PV = {
    C: C,
    tone: tone,
    esc: esc,
    wrap: wrap,
    tw: tw,

    t: t,
    l: l,
    r: r,
    c: c,
    path: path,
    ar: ar,
    up: up,
    chip: chip,
    chipW: chipW,

    flow: flow,
    bars: bars,
    score: score,
    freq: freq,
    stack: stack,
    seq: seq,
    compare: compare,
    trace: trace,
    scatter: scatter,
    io: io,
    check: check,
    wellbore: wellbore,
    pressWindow: pressWindow,
    triptych: triptych,

    sec: sec,
    step: step
  };

})(window);
