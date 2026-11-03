/* =========================================================
   示范脚手架 DK (Demo Kit)
   ---------------------------------------------------------
   把"滑杆 → 重算 → 重绘"这套样板收进来：
     案例只写 render(state) 返回一段 HTML，
     控件、重绘、清理、错误兜底都由 DK 负责。

   用法：
     var h = DK.mount(root, {
       kicker: 'INTERACTIVE · 某某',
       title:  '这张图让读者验证什么',
       desc:   '一段说明，可含 HTML',
       action: '换一批数据',                // 可选，出现按钮
       ctrls:  [{ k:'x', label:'X', min:0, max:100, step:5, value:40,
                  fmt: function(v){ return v + '%'; } },
                { k:'on', label:'开', type:'tog', value:1 }],
       state:  { seed: 7 },                  // 可选，额外初始状态
       onRun:  function(st, paint, rt){ … }, // 按钮点击
       render: function(st){ return '…HTML…'; },
       after:  function(body, st, paint, rt) { … } // 每次重绘后
     });
     h.unmount();     // 切页时调用

   配套的 CSS 类在 case-viz.css 里：
     .demo / .demo-head / .demo-ctl / .ctl / .metrics /
     .dk-grid / .dk-stage / .dk-side / .dk-verdict /
     .dk-legend / .dk-card / .dk-tbl / .dk-slots
   ========================================================= */
(function (global) {
  'use strict';

  /* ---------------------------------------------------------
     小工具
     --------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 控件值的显示文本：有 fmt 用 fmt，否则原样 */
  function disp(ctl, v) {
    if (typeof ctl.fmt === 'function') {
      try { return ctl.fmt(v); } catch (e) { return String(v); }
    }
    return String(v);
  }

  /* ---------------------------------------------------------
     控件片段
     --------------------------------------------------------- */
  function ctlHTML(ctl) {
    if (ctl.type === 'tog') {
      return '<label class="ctl tog' + (ctl.value ? ' on' : '') +
        '" data-tog="' + esc(ctl.k) + '"><i></i>' + esc(ctl.label) + '</label>';
    }
    return '<div class="ctl">' +
      '<label>' + esc(ctl.label) + '</label>' +
      '<input type="range" data-k="' + esc(ctl.k) + '"' +
        ' min="' + ctl.min + '" max="' + ctl.max + '"' +
        ' step="' + (ctl.step == null ? 1 : ctl.step) + '"' +
        ' value="' + ctl.value + '">' +
      '<span class="val" data-v="' + esc(ctl.k) + '">' + esc(disp(ctl, ctl.value)) + '</span>' +
      '</div>';
  }

  /* ---------------------------------------------------------
     指标卡：items = [{ l, v, u, cls }]
       l   —— 标签（等宽小字）
       v   —— 值（可直接给 HTML 片段）
       u   —— 单位（可省略）
       cls —— 'good' | 'warn' | 'bad'
     --------------------------------------------------------- */
  function metrics(items) {
    return '<div class="metrics">' + items.map(function (it) {
      return '<div class="metric ' + (it.cls || '') + '">' +
        '<div class="l">' + esc(it.l) + '</div>' +
        '<div class="v">' + (it.v == null ? '—' : it.v) +
          (it.u ? '<small>' + esc(it.u) + '</small>' : '') +
        '</div></div>';
    }).join('') + '</div>';
  }

  /* ---------------------------------------------------------
     判词条：一句话结论，左侧竖线随 kind 变色
     --------------------------------------------------------- */
  function verdict(html, kind) {
    return '<div class="dk-verdict ' + (kind || '') + '">' + (html || '') + '</div>';
  }

  /* ---------------------------------------------------------
     图例：items = [{ c, t, dash }]
     --------------------------------------------------------- */
  function legend(items) {
    return '<div class="dk-legend">' + items.map(function (it) {
      var style = it.dash
        ? 'color:' + (it.c || '#79828a')
        : 'background:' + (it.c || '#79828a');
      return '<span><i class="' + (it.dash ? 'dash' : '') +
        '" style="' + style + '"></i>' + esc(it.t) + '</span>';
    }).join('') + '</div>';
  }

  /* ---------------------------------------------------------
     表格：head = ['列1','列2'], rows = [['a','b'], …]
     单元格可以是 HTML 片段；给第 3 个元素做 class：
       rows = [[{ v:'✓', cls:'ok' }, 'x']]
     --------------------------------------------------------- */
  function table(head, rows) {
    var h = '';
    if (head && head.length) {
      h += '<thead><tr>' + head.map(function (x) {
        return '<th>' + esc(x) + '</th>';
      }).join('') + '</tr></thead>';
    }
    var body = rows.map(function (row) {
      return '<tr>' + row.map(function (cell) {
        var v = cell, cls = '';
        if (cell && typeof cell === 'object' && !Array.isArray(cell)) {
          v = cell.v; cls = cell.cls || '';
        }
        return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + (v == null ? '' : v) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<table class="dk-tbl">' + h + '<tbody>' + body + '</tbody></table>';
  }

  /* ---------------------------------------------------------
     槽位条：items = [{ k, v, state }]
       state: 'ok' | 'gap' | 'fake'
     --------------------------------------------------------- */
  function slots(items) {
    return '<div class="dk-slots">' + items.map(function (it) {
      return '<div class="dk-slot">' +
        '<span class="k">' + esc(it.k) + '</span>' +
        '<span class="v ' + (it.state || 'ok') + '">' + (it.v || '') + '</span>' +
        '</div>';
    }).join('') + '</div>';
  }

  /* ---------------------------------------------------------
     兜底错误块（render 抛错时不要让整个 tab 空白）
     --------------------------------------------------------- */
  function errBox(msg, detail) {
    return '<div class="callout warn" style="margin:12px 14px">' +
      '<span class="ci">错误</span><span><b>' + esc(msg) + '</b>' +
      (detail ? '<br>' + esc(detail) : '') + '</span></div>';
  }

  /* =========================================================
     挂载
     ========================================================= */
  function mount(root, cfg) {
    if (!root) return { unmount: function () { } };
    cfg = cfg || {};

    var ctrls = cfg.ctrls || [];
    var st = {};

    /* 1. 初始状态：控件默认值 → cfg.state 覆盖 */
    ctrls.forEach(function (c) {
      st[c.k] = c.type === 'tog' ? (c.value ? 1 : 0) : Number(c.value);
    });
    if (cfg.state) {
      Object.keys(cfg.state).forEach(function (k) { st[k] = cfg.state[k]; });
    }

    /* 2. 骨架 */
    root.innerHTML =
      '<div class="demo">' +
        '<div class="demo-head">' +
          '<div>' +
            '<span class="kicker">' + esc(cfg.kicker || 'INTERACTIVE') + '</span>' +
            '<h3 style="margin-top:8px">' + esc(cfg.title || '') + '</h3>' +
            '<p>' + (cfg.desc || '') + '</p>' +
          '</div>' +
          (cfg.action
            ? '<button class="btn primary" data-run type="button">' +
              esc(cfg.action) + '</button>'
            : '') +
        '</div>' +
        (ctrls.length
          ? '<div class="demo-ctl">' + ctrls.map(ctlHTML).join('') + '</div>'
          : '') +
        '<div data-body></div>' +
      '</div>';

    var body = root.querySelector('[data-body]');
    var destroyed = false;

    /* 3. 重绘 */
    function paint() {
      if (destroyed || !body) return;
      var html = '';
      try {
        html = cfg.render ? cfg.render(st) : '';
      } catch (e) {
        html = errBox('示范渲染失败', (e && e.message) || String(e));
        if (global.console && console.error) {
          console.error('[DK] render 抛错：', e);
        }
      }
      body.innerHTML = html;

      if (cfg.after) {
        try {
          cfg.after(body, st, paint, root);
        } catch (e2) {
          if (global.console && console.error) {
            console.error('[DK] after 抛错：', e2);
          }
        }
      }
    }

    /* 4. 控件事件（具名函数，便于卸载） */
    var rangeHandlers = [];
    [].forEach.call(root.querySelectorAll('.demo-ctl input[type=range]'), function (inp) {
      var k = inp.getAttribute('data-k');
      var ctl = null;
      for (var i = 0; i < ctrls.length; i++) {
        if (ctrls[i].k === k) { ctl = ctrls[i]; break; }
      }

      function onInput() {
        var v = Number(inp.value);
        st[k] = v;
        var lab = root.querySelector('[data-v="' + k + '"]');
        if (lab) lab.textContent = ctl ? disp(ctl, v) : String(v);
        paint();
      }

      inp.addEventListener('input', onInput);
      rangeHandlers.push([inp, onInput]);
    });

    var togHandlers = [];
    [].forEach.call(root.querySelectorAll('[data-tog]'), function (lab) {
      var k = lab.getAttribute('data-tog');

      function onClick() {
        st[k] = st[k] ? 0 : 1;
        lab.classList.toggle('on', !!st[k]);
        paint();
      }

      lab.addEventListener('click', onClick);
      togHandlers.push([lab, onClick]);
    });

    var runBtn = root.querySelector('[data-run]');
    var runHandler = null;
    if (runBtn && typeof cfg.onRun === 'function') {
      runHandler = function () {
        try {
          cfg.onRun(st, paint, root);
        } catch (e) {
          if (global.console && console.error) {
            console.error('[DK] onRun 抛错：', e);
          }
          paint();
        }
      };
      runBtn.addEventListener('click', runHandler);
    }

    /* 5. 首绘 */
    paint();

    /* 6. 对外句柄 */
    return {
      state: st,
      paint: paint,
      unmount: function () {
        if (destroyed) return;
        destroyed = true;

        rangeHandlers.forEach(function (p) {
          try { p[0].removeEventListener('input', p[1]); } catch (e) { }
        });
        togHandlers.forEach(function (p) {
          try { p[0].removeEventListener('click', p[1]); } catch (e) { }
        });
        if (runBtn && runHandler) {
          try { runBtn.removeEventListener('click', runHandler); } catch (e) { }
        }
        rangeHandlers = [];
        togHandlers = [];

        if (typeof cfg.destroy === 'function') {
          try { cfg.destroy(); } catch (e) { }
        }

        try { root.innerHTML = ''; } catch (e) { }
        body = null;
      }
    };
  }

  /* =========================================================
     对外接口
     ========================================================= */
  global.DK = {
    mount: mount,
    metrics: metrics,
    verdict: verdict,
    legend: legend,
    table: table,
    slots: slots,
    esc: esc,
    disp: disp
  };

})(window);
