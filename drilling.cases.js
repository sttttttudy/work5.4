/* =========================================================
   钻井环节 5 个案例（d1—d5）
   ---------------------------------------------------------
   每个案例三块内容：
     ① 专业背景   —— 5 张图讲物理概念 + WHAT/WHY/HOW 三联
     ② 案例流程   —— 5 步，每步一张步骤图 + 一句要点
     ③ 可运行示范 —— 动手算一遍，看数据怎么变
   ========================================================= */
(function () {
  'use strict';

  var PV = window.PV, K = window.K, DK = window.DK;
  var F = K.figure, C = PV.C;
  var H = null;   /* 当前挂载的示范句柄 */

  /* =========================================================
     d1 · 钻速预测与参数优化
     ========================================================= */

  /* 图 1：钻压—钻速三段 */
  function d1Curve() {
    var w = 620, h = 216, x0 = 64, x1 = w - 178, y0 = 34, y1 = h - 40;
    function X(u) { return x0 + u * (x1 - x0); }
    function Y(v) { return y1 - v * (y1 - y0); }

    var s = '';
    s += PV.r(x0, y0, X(.30) - x0, y1 - y0, { fill: C.badL, fo: .5 });
    s += PV.r(X(.50), y0, X(.76) - X(.50), y1 - y0, { fill: C.jadeL, fo: .8 });
    s += PV.t((x0 + X(.30)) / 2, y0 + 14, '现场常用', { sz: 8.2, a: 'middle', f: C.bad, w: 600 });
    s += PV.t(X(.63), y0 + 14, '甜点区', { sz: 8.2, a: 'middle', f: C.jadeD, w: 600 });
    s += PV.l(x0, y1, x1, y1, { stroke: C.line3 });
    s += PV.l(x0, y1, x0, y0, { stroke: C.line3 });
    s += PV.t(x1, y1 + 16, '钻压 WOB →', { sz: 8.4, a: 'end', f: C.ink4, m: 1 });
    s += PV.t(x0, y0 - 8, '机械钻速 ROP ↑', { sz: 8.4, f: C.ink4, m: 1 });

    var pts = [], i;
    for (i = 0; i <= 90; i++) {
      var u = i / 90, v;
      if (u <= .58) v = .80 * (u / .58);
      else { var q = (u - .58) / .42; v = .80 + .13 * q - .58 * q * q; }
      pts.push([X(u), Y(Math.max(.06, v))]);
    }
    s += PV.path(pts, { stroke: C.ink2, sw: 1.7, join: 'round' });

    s += PV.l(X(.626), y0, X(.626), y1, { stroke: C.clay, dash: '3 3', so: .75 });
    s += PV.c(X(.626), Y(.80), 3.2, { fill: C.clay });
    s += PV.t(X(.626), y1 + 16, 'founder', { sz: 8, a: 'middle', f: C.clay, m: 1 });

    [['① 线性段', '钻压加一档，钻速近似线性上升'],
     ['② 拐点', '岩屑清不出去，钻头重复破碎'],
     ['③ 下降段', '再加压只会加速钻头磨损']].forEach(function (n, k) {
      var yy = y0 + 30 + k * 48;
      s += PV.t(x1 + 20, yy, n[0], { sz: 9, w: 600, f: C.ink });
      s += PV.t(x1 + 20, yy + 13, n[1], { sz: 8.2, f: C.ink3 });
    });

    return PV.wrap(w, h, s, '钻压与机械钻速的关系');
  }

  /* 示范：可行域网格 + 当前方案 + 最优 */
  function d1Demo(root) {
    var WS = 26, TQL = 34, SPL = 24, FR = 1.30, E0 = 1.245;
    var W0 = 6, W1 = 44, R0 = 40, R1 = 160;
    var CO = 19, RO = 12, CW = 22, CH = 15, CX = 24, CY = 18;
    var SW = CX * 2 + CO * CW, SH = CY + RO * CH + 46;

    function tq(w, r) { return 6 + .55 * w * r / 120; }
    function spp(r) { return 6 + r * .09; }
    function ecd(w, r) { return E0 + r * .00035 + w * .0005; }

    /* 钻速模型：低钻压下近似与钻压成正比，过 founder 点后衰减 */
    function rop(w, r) {
      var eff = w <= WS ? 1 : Math.max(.16, 1 - .92 * Math.pow((w - WS) / 20, 1.5));
      return 30 * (r / 120) * (1 - Math.exp(-w / 12)) * eff;
    }

    function mg(w, r) {
      return {
        tq: (TQL - tq(w, r)) / TQL,
        sp: (SPL - spp(r)) / SPL,
        ec: (FR - ecd(w, r)) / .06
      };
    }

    function ok(w, r) {
      var m = mg(w, r);
      return m.tq >= .15 && m.sp >= .10 && m.ec > 0;
    }

    function cell(i, j) {
      return {
        w: W0 + (i + .5) * (W1 - W0) / CO,
        r: R0 + (j + .5) * (R1 - R0) / RO
      };
    }

    /* 预计算：最大值 / 最优可行解 / 可行解个数 */
    var mx = 0, nOK = 0, best = { w: 30, r: 120, v: -1 }, i, j;
    for (i = 0; i < CO; i++) {
      for (j = 0; j < RO; j++) {
        var cc = cell(i, j);
        var vv = rop(cc.w, cc.r);
        if (vv > mx) mx = vv;
        if (!ok(cc.w, cc.r)) continue;
        nOK++;
        if (vv > best.v) best = { w: cc.w, r: cc.r, v: vv };
      }
    }

    function chart(st) {
      var s = '', px, py, bx, by, good;
      var ci, cj;

      s += PV.t(CX, 10, 'WOB →', { sz: 8, f: C.ink4, m: 1 });

      for (ci = 0; ci < CO; ci++) {
        for (cj = 0; cj < RO; cj++) {
          var x = CX + ci * CW;
          var y = CY + (RO - 1 - cj) * CH;
          var p = cell(ci, cj);
          good = ok(p.w, p.r);
          var rel = rop(p.w, p.r) / mx;

          if (good) {
            s += PV.r(x, y, CW - 1.5, CH - 1.5,
              { fill: C.jade, fo: .10 + rel * .62, rx: 2 });
          } else {
            s += PV.r(x, y, CW - 1.5, CH - 1.5, { fill: C.line, rx: 2 });
            s += PV.l(x + 3, y + CH - 4, x + CW - 4, y + 3,
              { stroke: C.line3, sw: .8, so: .7 });
          }
        }
      }

      /* 当前方案 */
      px = CX + (st.wob - W0) / (W1 - W0) * CO * CW;
      py = CY + (1 - (st.rpm - R0) / (R1 - R0)) * RO * CH;
      good = ok(st.wob, st.rpm);
      s += PV.c(px, py, 7, { stroke: good ? C.ink : C.bad, sw: 2 });
      s += PV.c(px, py, 2.6, { fill: good ? C.ink : C.bad });

      /* 最优可行解 */
      bx = CX + (best.w - W0) / (W1 - W0) * CO * CW;
      by = CY + (1 - (best.r - R0) / (R1 - R0)) * RO * CH;
      s += '<path d="M' + bx.toFixed(1) + ' ' + (by - 6).toFixed(1) +
        'l6 6l-6 6l-6-6z" fill="' + C.clay + '" fill-opacity=".85"/>';

      /* 轴刻度 */
      [6, 16, 26, 36, 44].forEach(function (v) {
        s += PV.t(CX + (v - W0) / (W1 - W0) * CO * CW,
          CY + RO * CH + 13, v,
          { sz: 7.4, a: 'middle', f: C.ink4, m: 1 });
      });
      [40, 80, 120, 160].forEach(function (v) {
        s += PV.t(CX - 5,
          CY + (1 - (v - R0) / (R1 - R0)) * RO * CH + 3, v,
          { sz: 7.4, a: 'end', f: C.ink4, m: 1 });
      });

      s += PV.t(CX, SH - 8, '灰格 = 超出安全余量，不可行',
        { sz: 8, f: C.ink4 });

      return PV.wrap(SW, SH, s, '钻压-转速参数空间');
    }

    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 可行域搜索',
      title: '在安全边界内找最高钻速',
      desc: '横轴钻压、纵轴转速。颜色越深钻速越高，灰格是超出扭矩 / 立压 / ECD 余量的不可行解。拖滑杆移动方案点，或点「自动寻优」让优化器在可行域里搜索——它只在绿格里找，从不越界。',
      action: '自动寻优',
      ctrls: [
        { k: 'wob', label: '钻压 kN', min: 8, max: 42, step: 1, value: 22 },
        { k: 'rpm', label: '转速 rpm', min: 40, max: 160, step: 2, value: 110 }
      ],
      onRun: function (st, paint, rt) {
        st.wob = Math.round(best.w);
        st.rpm = Math.round(best.r);

        var a = rt.querySelector('input[data-k="wob"]');
        var b = rt.querySelector('input[data-k="rpm"]');
        if (a) a.value = st.wob;
        if (b) b.value = st.rpm;

        var la = rt.querySelector('[data-v="wob"]');
        var lb = rt.querySelector('[data-v="rpm"]');
        if (la) la.textContent = st.wob;
        if (lb) lb.textContent = st.rpm;

        paint();
      },
      render: function (st) {
        var m = mg(st.wob, st.rpm);
        var good = ok(st.wob, st.rpm);
        var rv = rop(st.wob, st.rpm);

        return '<div class="dk-grid">' +
          '<div class="dk-stage">' + chart(st) +
            DK.legend([
              { c: C.jade, t: '可行域（越深钻速越高）' },
              { c: C.line3, t: '不可行' },
              { c: C.ink, t: '当前方案' },
              { c: C.clay, t: '搜索到的最优' }
            ]) +
          '</div>' +
          '<div class="dk-side">' +
            DK.metrics([
              { l: '预测 ROP', v: rv.toFixed(1), u: 'm/h', cls: rv > 20 ? 'good' : '' },
              { l: '可行域最优', v: best.v.toFixed(1), u: 'm/h' },
              { l: '扭矩余量', v: (m.tq * 100).toFixed(0), u: '%', cls: m.tq >= .15 ? 'good' : 'bad' },
              { l: '立压余量', v: (m.sp * 100).toFixed(0), u: '%', cls: m.sp >= .10 ? 'good' : 'bad' }
            ]) +
            DK.verdict(
              good
                ? '当前方案在可行域内。同样的钻头，最优解比它再快 <b>' +
                  (((best.v - rv) / rv) * 100).toFixed(0) +
                  '%</b>——这部分差距就是"参数没贴着地层走"的代价。'
                : '当前方案<b>不可行</b>：至少一项余量已经为负。优化器不会考虑它，因为它在现场会变成卡钻或井漏。',
              good ? 'ok' : 'bad'
            ) +
            '<div class="dk-card"><h5>搜索空间</h5>' +
              DK.table(null, [
                ['网格总数', CO * RO],
                ['可行解', { v: nOK, cls: 'ok' }],
                ['被约束剔除', { v: CO * RO - nOK, cls: 'bad' }],
                ['当前 ECD', { v: ecd(st.wob, st.rpm).toFixed(3),
                  cls: m.ec > 0 ? 'ok' : 'bad' }]
              ]) +
            '</div>' +
          '</div></div>';
      }
    });
  }

  /* WHAT / WHY / HOW */
  function d1W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '梯度提升回归 + 约束优化',
        p: '<p>三个部件：逐米 ROP 预测器（给 μ 和 σ）、约束检查器（扭矩 / 立压 / ECD）、网格或贝叶斯搜索器。</p>',
        svg: PV.flow([
          { tag: '01', title: 'ROP 预测', lines: ['μ + σ'], tone: 'jade' },
          { tag: '02', title: '约束检查', lines: ['越界即丢弃'], tone: 'bad' },
          { tag: '03', title: '搜索最优', lines: ['可行域内'], tone: 'clay' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '人力试错太慢且有风险',
        p: '<p>现场每调一次参数要等钻时反馈，一天只能试几次；而参数空间有几百个格点。<b>让机器在约束内穷举，比让人冒险试要安全</b>。</p>',
        svg: PV.bars([
          ['人工试钻', 4, 'gray', '4 次/班'],
          ['网格搜索', 228, 'jade', '228 格'],
          ['可行解', 96, 'clay', '96 格']
        ], { w: 300, left: 78, lh: 24 })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '约束是闸门，不是打分项',
        p: '<p>先算预测，再用三条硬约束过滤，最后在剩下的格里取最大——<b>超界的解根本进不了排序</b>，所以模型学不会冒险。</p>',
        svg: PV.check([
          ['扭矩余量 ≥ 15%', 1],
          ['立压余量 ≥ 10%', 1],
          ['ECD 未超破裂压力', 1]
        ], { w: 300, head: 'GATE · 全部通过才采纳' })
      }
    ]);
  }

  window.Cases.register({
    id: 'drill-rop',
    sceneId: 'd1',
    title: '钻速预测与参数优化',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '时序回归 + 约束优化', desc: '逐米预测 ROP，再在安全边界内搜参数' },
          { label: '数据门槛', value: '3—5 口井', desc: '高频参数 1—10 s，按井分组' },
          { label: '收益', value: 'ROP +15%—30%', desc: '同等进尺少用钻时（示例值）' },
          { label: '难度', value: '高', html: K.dtag('高'), desc: '闭环涉及井下安全，外推风险高' }
        ],
        lede: '机械钻速（ROP）是钻头在井底破碎岩石的速度，现场按 m/h 计。它由两类变量决定：司钻能调的钻压、转速、排量，和司钻改不了的地层可钻性、岩性、围压。钻速优化的本质，是在一个有硬边界的参数空间里找局部最优。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>钻压从低往高加，钻速先近似线性上升；到某个点后井底岩屑来不及被泥浆冲走，钻头出现"重复破碎"，钻速反而往下走——这个拐点叫 <b>founder point</b>。</p>' +
            F(d1Curve(), 1, '钻压—钻速的三段：线性段、拐点、下降段。现场为了避开卡钻与憋跳，长期停在线性段左侧，把 20%—30% 的钻速留在了桌上。') +
            '<p>更麻烦的是钻速没有绝对值：同一套参数在泥岩和砂岩里能差一倍，邻井经验换一口井就失效。</p>' +
            F(PV.bars([
              ['保守参数下', 62, 'bad', '62%'],
              ['优化窗口内', 88, 'jade', '88%'],
              ['理论最优', 100, 'gray', '100%']
            ], { w: 620, left: 130, note: '同一井段、同一钻头的相对钻速（示例）' }), 2,
              '差距不在钻头，而在参数有没有贴着地层走。**理论最优不可达**：它意味着扭矩与立压都没有余量。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>把钻速看成"参数 × 地层"的函数：先用高频数据学一个逐米的 ROP 预测器，再在带约束的优化器里搜下一段参数。</p>' +
            F(PV.flow([
              { tag: '01 · INPUT', title: '高频参数', lines: ['钻压 / 转速', '扭矩 / 立压'], tone: 'gray' },
              { tag: '02 · FEATURE', title: '逐米特征', lines: ['机械比能 MSE', 'd-exponent'], tone: 'opt' },
              { tag: '03 · MODEL', title: 'ROP 预测', lines: ['给 μ 和 σ'], tone: 'jade' },
              { tag: '04 · OPT', title: '约束寻优', lines: ['三条硬边界'], tone: 'clay' },
              { tag: '05 · HUMAN', title: '司钻确认', lines: ['可采纳可回退'], tone: 'kg' }
            ], { note: '算法只输出"建议"，不直接下指令——这是钻井场景能落地的前提' }), 3,
              '第 4 步是分水岭：**没有约束的优化不是优化，是事故**。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">钻井数据不难拿，难的是对齐：扭矩是 1 秒一个点，分层是几米一个界面，班报是 12 小时一条。</p>' +
            K.checklist([
              ['高频钻井参数', '1—10 s 采样，单井 10 万—100 万条', '无需逐条标注'],
              ['地质分层与岩性', '来自录井与测井', '作为分段标签'],
              ['复杂情况记录', '卡钻 / 井漏 / 气侵', '事件级标注'],
              ['钻头与钻具台账', '型号、起下钻时间', '用于分段']
            ]) +
            F(PV.freq([
              ['立管压力', 1, 5, '1—5 s', 'jade'],
              ['扭矩 / 转速', 1, 10, '1—10 s', 'jade'],
              ['钻时', 300, 900, '5—15 min', 'clay'],
              ['地质分层', 1800, 7200, '按层段', 'opt'],
              ['班报与事件', 43200, 43200, '12 h', 'gray']
            ], { head: 'SAMPLING · 多源数据的时间尺度', note: '第一步永远是把这些点对齐到同一条深度轴' }), 4,
              '频次差三个数量级时，**先重采样再谈模型**。把 12 小时的班报插值到秒级只会制造假信号。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('高') + '<span class="small muted">数据现成、任务清晰；卡点全在闭环安全与跨区迁移。</span></div>' +
            F(PV.score([
              ['数据可得性', 1, '高频参数现成'],
              ['标签成本', 2, '分层与事件靠人工'],
              ['闭环风险', 3, '误建议可能导致卡钻'],
              ['跨区迁移', 3, '地层一变模型就偏']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '两项是 3 格 → **先做"建议 + 人工确认"的半闭环**，不要一上来就自动送钻。') +
            '<p style="margin-top:14px">推进顺序：单井离线复现 → 同区块 A/B → 新井建议模式 → 半自动。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['时序回归', '贝叶斯优化', '代理模型', '安全约束优化'], '#/method/opt')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>这个案例的 AI 不是"一个更大的模型"，而是三个部件的组合。<b>把方法拆开看，才知道每一块在替代人的哪一步</b>。</p>' + d1W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一口水平井的钻速优化试点',
        lead: [
          '目标不是"做一个 ROP 模型"，而是**在同一口井的同一层段，把机械钻速从 16.9 m/h 提到 20 m/h 以上，且不增加复杂情况**。',
          '五步里第 1 步和第 4 步不涉及任何模型，却决定了模型能不能用。'
        ],
        stats: [['样本井', '5', true], ['高频采样', '1 s'], ['目标 ROP', '+18%'], ['约束', '扭矩 / 立压 / ECD']],
        steps: [
          PV.step('数据对齐与清洗', '工程环节',
            '把 5 口井的参数统一到 1 s、深度归位，剔除接单根与起下钻段，按**井**划分训练 / 验证集。',
            '同一口井只出现在一个集合里', '按样本随机划分会让精度虚高 20% 以上',
            PV.check([
              ['深度基准统一到井口', 1],
              ['重采样到 1 s', 1],
              ['剔除接单根与起下钻', 1],
              ['按井划分训练 / 验证', 1]
            ], { head: 'CLEANING · 四条硬规则', note: '样本量看着大，独立样本只有几口井' }),
            '四条任意一条没做，后面的指标都不可信。'),

          PV.step('特征工程', '算法核心',
            '不要直接把原始通道喂给模型。先算**机械比能 MSE**（破岩效率）、d-exponent（压实趋势）和滑窗统计量。',
            '把"参数"变成"效率"', '只用原始参数，模型学到的其实是钻机型号',
            PV.io({
              in: ['钻压 WOB', '转速 RPM', '扭矩', '立管压力'],
              out: ['机械比能 MSE', 'd-exponent', '滑窗方差'],
              mid: '逐米重算', h: 132,
              note: 'MSE 越低，同样的能量切下的岩石越多'
            }),
            'MSE 是这行的"通用货币"：把不同钻机、不同参数折算成同一个效率量。'),

          PV.step('建立 ROP 预测模型', '算法核心',
            '用梯度提升或时序网络预测下一米的 ROP，同时输出不确定度 σ。',
            '知道"哪里不敢保证"', '只给点预测，优化器会专挑模型外推的区域',
            PV.scatter({
              pts: [
                [.18, .22], [.26, .24], [.34, .31], [.41, .44], [.47, .42],
                [.55, .58], [.61, .55], [.66, .71], [.72, .68], [.78, .82],
                [.84, .79], [.9, .93]
              ],
              note: '越靠右上，σ 越小',
              xlab: '实测 ROP', ylab: '预测 ROP'
            }),
            '点越靠近对角线越好；**σ 大的区域不要拿去优化**，那是模型在猜。'),

          PV.step('约束优化', '效果关键',
            '在扭矩余量 ≥15%、立压余量 ≥10%、ECD 不超破裂压力的可行域里，搜使 ROP 最大的参数组合。',
            '把"更快"限制在"更安全"之内', '先优化后加约束，等于让模型先学会冒险',
            PV.check([
              ['扭矩余量 ≥ 15%', 1, '78%'],
              ['立压余量 ≥ 10%', 1, '84%'],
              ['ECD 未超破裂压力', 1, '余 .04'],
              ['ROP 提升 ≥ 15%', 1, '+19%']
            ], { head: 'CONSTRAINTS · 四条同时成立', note: '任意一条不满足，建议直接丢弃' }),
            '四条同时成立才下发。**约束不是打分项，是闸门**。'),

          PV.step('现场试点与回流', '闭环',
            '先在 3 口井上用"建议模式"，司钻可采纳可忽略；采纳与忽略都回流成训练样本。',
            '每口新井都在改进下一口', '没有回流机制，模型三个月后就过期',
            PV.bars([
              ['试点井', 100, 'jade', '20.1 m/h'],
              ['同层段邻井', 84, 'gray', '16.9 m/h'],
              ['目标', 92, 'clay', '19.4 m/h']
            ], { w: 340, left: 96, note: '示例数据 · 同层段、同类钻头' }),
            '先看"有没有到目标"，再看"多出来的钻速有没有带来复杂情况"。')
        ],
        metrics: {
          title: '怎么算"优化成功"',
          html: '<p>不能只看平均 ROP，要把**复杂情况率**和**钻头磨损**一起看，否则钻速是靠透支钻头换的。</p>' +
            '<p>口径也要一致：ROP 必须在**同一层段、同一钻头类型、同一井眼尺寸**下比较。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['ROP 提升', '试点井 vs 同层段邻井', '+19%'],
              ['复杂情况率', '每千米复杂事件数', '0（未增加）'],
              ['建议采纳率', '司钻采纳占比', '64%'],
              ['预测偏差', 'ROP 预测 MAPE', '11%']
            ])
        },
        fails: [
          { name: '外推区被当成机会', why: '模型在训练没覆盖的区间给出高 ROP 预测，优化器专挑这种点。解决方向：把 σ 作为优化目标的一部分。' },
          { name: '钻机差异被学成地层差异', why: '不同钻机送钻能力不同，模型会把钻机当地层。解决方向：加入钻机固定效应。' },
          { name: '标签滞后', why: 'ROP 按米统计，深度归位差 0.5 m 就错位。解决方向：用钻时与迟到时间反算深度。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { d1Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

  /* =========================================================
     d2 · 井下复杂事故前兆预警
     ========================================================= */

  function d2Well() {
    return PV.wellbore({
      w: 300, h: 320,
      layers: [
        ['表层套管段', 2, '#efece1'],
        ['泥岩', 3, '#e7eef9'],
        ['砂岩 · 目的层', 2, '#f8ecdf'],
        ['泥岩', 2, '#e7eef9']
      ],
      casing: .34,
      arrows: 4,
      marks: [
        { at: .28, label: '井漏：液柱压裂地层', sub: '立压↓ 返出↓', tone: 'clay' },
        { at: .52, label: '气侵：地层气进入井筒', sub: '返出↑ 密度↓', tone: 'nlp' },
        { at: .74, label: '卡钻：压差吸住钻柱', sub: '扭矩↑ 摩阻↑', tone: 'bad' }
      ]
    });
  }

  function d2TraceFig() {
    return PV.trace({
      w: 620, h: 190, left: 24, right: 24, top: 30, bottom: 30,
      bands: [{ from: .52, to: .66, tone: 'warn', label: '前兆窗口' }],
      fn: function (u) {
        var v = .42 + Math.sin(u * 22) * .04 + Math.sin(u * 7) * .03;
        if (u > .52) v += (u - .52) * .55;
        if (u > .7) v += (u - .7) * 1.4;
        return Math.min(.96, v);
      },
      marks: [
        { at: .52, label: '偏离基线', v: .42, tone: 'warn' },
        { at: .70, label: '人工发现', v: .78, tone: 'clay' },
        { at: .86, label: '事故发生', v: .95, tone: 'bad', down: true }
      ],
      xlab: '时间 →', ylab: '扭矩'
    });
  }

  /* 示范：三通道残差预警 vs 固定阈值 */
  function d2Demo(root) {
    var N = 220, T0 = 96;

    function seed(a) {
      return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function gauss(rnd) {
      var u = 0, v = 0;
      while (u === 0) u = rnd();
      while (v === 0) v = rnd();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function median(a) {
      var b = a.slice().sort(function (x, y) { return x - y; });
      var m = b.length >> 1;
      return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
    }

    /* 造三条通道：前兆从 T0 开始逐渐显现 */
    function build(st) {
      var rnd = seed(st.seed || 7);
      var noise = st.noise / 100;
      var pre = st.pre / 100;
      var ch = { tq: [], sp: [], fl: [] };
      var i;

      for (i = 0; i < N; i++) {
        var ramp = i > T0 ? Math.min(1, (i - T0) / 55) : 0;
        ch.tq.push(12 + gauss(rnd) * 1.0 * (0.4 + noise * 2.6) + ramp * 3.4 * pre);
        ch.sp.push(18 + gauss(rnd) * 0.8 * (0.4 + noise * 2.6) + ramp * 1.5 * pre);
        ch.fl.push(30 + gauss(rnd) * 0.7 * (0.4 + noise * 2.6) - ramp * 2.1 * pre);
      }
      return ch;
    }

    /* 滑动中位数基线 + MAD 标准化残差 */
    function detect(arr, w) {
      var base = [], z = [], i;
      for (i = 0; i < arr.length; i++) {
        var a = Math.max(0, i - w);
        var seg = arr.slice(a, i + 1);
        var med = median(seg);
        var dev = seg.map(function (v) { return Math.abs(v - med); });
        var sd = Math.max(0.35, median(dev) * 1.4826);
        base.push(med);
        z.push(Math.abs(arr[i] - med) / sd);
      }
      return { base: base, z: z };
    }

    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 残差预警',
      title: '报警能比人早多少，代价是多少',
      desc: '三条通道各自用滑动中位数做自适应基线，偏离量标准化成 z 分数。综合 z 连续两点超 4 就算报警。把噪声拉高会逼出误报，把前兆调弱会让报警推迟——这两个旋钮就是这类系统的全部取舍。',
      action: '换一段数据',
      ctrls: [
        { k: 'noise', label: '噪声水平', min: 20, max: 180, step: 5, value: 100,
          fmt: function (v) { return v + '%'; } },
        { k: 'pre', label: '前兆强度', min: 30, max: 150, step: 5, value: 100,
          fmt: function (v) { return v + '%'; } }
      ],
      state: { seed: 7 },
      onRun: function (st, paint) {
        st.seed = Math.floor(Math.random() * 1e6) + 1;
        paint();
      },
      render: function (st) {
        var ch = build(st);
        var d = {
          tq: detect(ch.tq, 21),
          sp: detect(ch.sp, 21),
          fl: detect(ch.fl, 21)
        };

        /* 综合 z */
        var zs = [], i;
        for (i = 0; i < N; i++) {
          zs.push(d.tq.z[i] * 0.42 + d.sp.z[i] * 0.33 + d.fl.z[i] * 0.25);
        }

        var aiAlarm = -1;
        for (i = 2; i < N; i++) {
          if (zs[i] > 4 && zs[i - 1] > 4) { aiAlarm = i; break; }
        }

        /* 固定阈值（模拟人工设定值）：前 60 点估全局均值与标准差 */
        var mu = 0, i2;
        for (i2 = 0; i2 < 60; i2++) mu += ch.tq[i2];
        mu /= 60;
        var vr = 0;
        for (i2 = 0; i2 < 60; i2++) vr += (ch.tq[i2] - mu) * (ch.tq[i2] - mu);
        var sd0 = Math.sqrt(vr / 60);

        var manAlarm = -1;
        for (i = 60; i < N; i++) {
          if (ch.tq[i] > mu + 3 * sd0) { manAlarm = i; break; }
        }

        var lead = (aiAlarm > 0 && manAlarm > 0) ? (manAlarm - aiAlarm) : 0;
        var min = lead * 0.5;

        /* 报警时刻的通道贡献 */
        var at = aiAlarm > 0 ? aiAlarm : N - 1;
        var contrib = [
          ['扭矩', d.tq.z[at] * 0.42],
          ['立管压力', d.sp.z[at] * 0.33],
          ['返出流量', d.fl.z[at] * 0.25]
        ];
        var tot = contrib.reduce(function (a, b) { return a + b[1]; }, 0) || 1;

        /* 画三条通道 */
        var SW = 620, TOP = 20, RH = 58, GAPY = 12;
        var SH = TOP + 3 * RH + 2 * GAPY + 32;
        var x0 = 44, x1 = SW - 14;
        var s = '';

        function XX(k) { return x0 + k / (N - 1) * (x1 - x0); }

        ['tq', 'sp', 'fl'].forEach(function (key, row) {
          var arr = ch[key], dd = d[key];
          var lo = Math.min.apply(null, arr);
          var hi = Math.max.apply(null, arr);
          var pad = (hi - lo) * 0.16 + 0.3;
          lo -= pad; hi += pad;

          function YY(v) {
            return TOP + row * (RH + GAPY) + RH - (v - lo) / (hi - lo) * RH;
          }

          s += PV.t(4, TOP + row * (RH + GAPY) + 10,
            ['扭矩', '立管压力', '返出流量'][row],
            { sz: 8.4, f: C.ink3, w: 600 });

          /* 基线带 */
          var bnd = (hi - lo) * 0.10;
          var up = [], dn = [], k;
          for (k = 0; k < N; k++) {
            up.push([XX(k), YY(dd.base[k] + bnd)]);
            dn.push([XX(k), YY(dd.base[k] - bnd)]);
          }
          s += PV.path(up.concat(dn.reverse()), { fill: C.jade, fo: .09, close: true });
          s += PV.path(dd.base.map(function (v, kk) { return [XX(kk), YY(v)]; }),
            { stroke: C.jade, sw: 1, dash: '4 3', so: .7 });

          /* 曲线 */
          s += PV.path(arr.map(function (v, kk) { return [XX(kk), YY(v)]; }),
            { stroke: C.ink2, sw: 1.3, join: 'round' });

          /* 报警线 */
          if (aiAlarm > 0) {
            s += PV.l(XX(aiAlarm), TOP + row * (RH + GAPY), XX(aiAlarm),
              TOP + row * (RH + GAPY) + RH, { stroke: C.jade, sw: 1.4, dash: '3 3' });
          }
          if (manAlarm > 0) {
            s += PV.l(XX(manAlarm), TOP + row * (RH + GAPY), XX(manAlarm),
              TOP + row * (RH + GAPY) + RH, { stroke: C.clay, sw: 1.2, dash: '2 4', so: .8 });
          }
        });

        s += PV.t(XX(aiAlarm > 0 ? aiAlarm : 10), SH - 20, 'AI 报警',
          { sz: 8, f: C.jadeD, w: 600 });
        s += PV.t(XX(manAlarm > 0 ? manAlarm : 200), SH - 8, '固定阈值报警',
          { sz: 8, f: C.clay, w: 600, a: 'end' });
        s += PV.t(x1, SH - 8, '时间 →', { sz: 7.8, a: 'end', f: C.ink4, m: 1 });

        return '<div class="dk-grid">' +
          '<div class="dk-stage">' + PV.wrap(SW, SH, s, '三通道预警') +
            DK.legend([
              { c: C.ink2, t: '实测' },
              { c: C.jade, t: '自适应基线 ± 带' },
              { c: C.jade, t: 'AI 报警（z>4 连续两点）' },
              { c: C.clay, t: '固定阈值报警' }
            ]) +
          '</div>' +
          '<div class="dk-side">' +
            DK.metrics([
              { l: '平均提前', v: min > 0 ? min.toFixed(0) : '0', u: 'min',
                cls: min >= 10 ? 'good' : 'warn' },
              { l: 'AI 报警点', v: aiAlarm > 0 ? aiAlarm : '—', u: '' },
              { l: '固定阈值点', v: manAlarm > 0 ? manAlarm : '—', u: '' },
              { l: '综合 z 峰值', v: Math.max.apply(null, zs).toFixed(1), u: '' }
            ]) +
            DK.verdict(
              lead > 0
                ? '残差法比固定阈值<b>早 ' + min.toFixed(0) +
                  ' 分钟</b>。这段时间就是处置窗口——早 15 分钟能降排量循环，晚 5 分钟只能起钻。'
                : '这段数据里两者几乎同时触发。<b>试试把前兆调弱、噪声调低</b>：固定阈值会失效，残差法还会响。',
              lead > 0 ? 'ok' : 'warn'
            ) +
            '<div class="dk-card"><h5>报警时刻的通道贡献</h5>' +
              PV.bars(contrib.map(function (cj) {
                var pct = Math.round(cj[1] / tot * 100);
                return [cj[0], pct, pct > 35 ? 'bad' : 'jade', pct + '%'];
              }), { w: 240, left: 62, lh: 21 }) +
              '<p style="font-size:10.5px;color:var(--ink-4);margin-top:6px;line-height:1.6">' +
              '说出"谁在报警"，司钻才会信第二次。</p>' +
            '</div>' +
          '</div></div>';
      }
    });
  }

  function d2W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '滑动分位数基线 + 标准化残差',
        p: '<p>不是分类器，而是<b>无监督的偏差检测</b>：每通道跑一条滚动中位数与 MAD，把偏离折成 z 分数再加权。</p>',
        svg: PV.flow([
          { tag: '01', title: '分工况基线', lines: ['滚动分位数'], tone: 'opt' },
          { tag: '02', title: '标准化残差', lines: ['z 分数'], tone: 'jade' },
          { tag: '03', title: '分级 + 冷却', lines: ['去重抑制'], tone: 'clay' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '异常样本太少，学不了"事故"',
        p: '<p>一年几十起事故，正负样本差两个数量级。<b>但"正常"永远够用</b>——所以学正常、看偏离，比学事故更现实。</p>',
        svg: PV.stack([
          ['正常工况', 99.4, 'jade'],
          ['复杂前兆', 0.6, 'bad']
        ], { w: 300 })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '先报得早，再报得少',
        p: '<p>灵敏度靠自适应基线（噪声大时带子自动变宽），可用性靠三级报警与冷却窗口。<b>两件事必须一起调</b>。</p>',
        svg: PV.bars([
          ['固定阈值', 120, 'bad', '120 次'],
          ['残差 + 冷却', 31, 'jade', '31 次']
        ], { w: 300, left: 92, lh: 24, note: '同样的命中数，报警量差 4 倍' })
      }
    ]);
  }

  window.Cases.register({
    id: 'drill-stuck',
    sceneId: 'd2',
    title: '井下复杂事故前兆预警',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '多变量异常检测', desc: '在正常波动里分出异常前兆' },
          { label: '数据门槛', value: '10+ 通道高频', desc: '扭矩 / 立压 / 流量 / 转速' },
          { label: '收益', value: '提前 10—30 min', desc: '把处置窗口从"事后"拉到"事前"' },
          { label: '难度', value: '高', html: K.dtag('高'), desc: '异常样本极少，误报代价高' }
        ],
        lede: '井筒里同时发生三件事：钻柱在转、泥浆在循环、地层在往外渗流体。当这三者的平衡被打破，扭矩、立管压力、返出流量会先于事故本身出现偏离。预警要做的，就是把这点偏离从正常波动里分出来。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>三类复杂情况机制完全不同，但都会先扰动同一组参数：<b>井漏</b>是液柱压力超过破裂压力；<b>气侵</b>是液柱压力低于孔隙压力；<b>卡钻</b>是压差把钻柱压在井壁上。</p>' +
            F(d2Well(), 1, '同一口井、三种事故、三组前兆。**图上每组箭头方向，就是模型要抓的特征**。') +
            '<p>问题是这些前兆很弱：扭矩正常波动就有 ±8%，前兆可能只有 +5%。司钻同时盯十几条曲线，靠肉眼往往等征兆变成事故才反应过来。</p>' +
            F(d2TraceFig(), 2, '预警的全部价值，就是**"偏离基线"和"人工发现"之间的那段时间**。这段越宽，处置选项越多。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>不去直接学"事故长什么样"（样本太少），而是学"正常长什么样"，再看当前偏离了多少。</p>' +
            F(PV.flow([
              { tag: '01 · STATE', title: '工况分段', lines: ['钻进 / 接单根'], tone: 'gray' },
              { tag: '02 · BASE', title: '正常基线', lines: ['分工况分位数'], tone: 'opt' },
              { tag: '03 · RESIDUAL', title: '残差打分', lines: ['多通道加权'], tone: 'jade' },
              { tag: '04 · ALARM', title: '分级预警', lines: ['冷却与去重'], tone: 'clay' },
              { tag: '05 · ACTION', title: '处置建议', lines: ['降排量 / 加重'], tone: 'kg' }
            ], { note: '残差法比"直接分类"更适合小样本：正常段永远够用' }), 3,
              '第 3 步是关键：**必须能说出是哪条通道在报警**。说不出理由的预警，司钻不会信第二次。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">这个任务是"极不均衡"的典型：一年的高频数据里，真正的前兆可能只有几十段。</p>' +
            K.checklist([
              ['多通道钻井时序', '扭矩、立压、流量、转速等 10+ 通道', '正常段充足，异常段稀少'],
              ['事故台账', '时间、类型、处理过程', '单区块数十起'],
              ['工况标签', '钻进 / 接单根 / 起下钻', '可由参数规则自动划分'],
              ['井身结构', '套管程序、井眼尺寸', '用于分井段建模']
            ]) +
            F(PV.stack([
              ['正常工况', 99.4, 'jade'],
              ['复杂前兆', 0.6, 'bad']
            ], { w: 620, label: '样本比例' }), 4,
              '正负样本差两个数量级。**任何"准确率"在这里都会骗人**，只能看召回与误报率。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('高') + '<span class="small muted">模型不是难点，让司钻相信它才是。</span></div>' +
            F(PV.score([
              ['数据可得性', 1, '高频通道现成'],
              ['标签成本', 3, '事故少且记录粗'],
              ['误报代价', 3, '报警疲劳会毁掉系统'],
              ['可解释性', 3, '必须说清哪条通道']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '三项 3 格：这类系统的成败**不在 AUC，而在误报率**。') +
            '<p style="margin-top:14px">建议先做"单一事故类型 + 单井段"的窄模型，跑通一条从预警到处置的链路，再横向扩类型。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['多变量异常检测', '不均衡学习', '可解释预警', '流式推理'], '#/method/ts')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>这个案例最反直觉的地方：<b>它根本不是一个"事故识别模型"</b>。它学的是正常，然后把偏离翻译成人能用的报警。</p>' + d2W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一个区块的卡钻前兆预警',
        lead: [
          '目标：把卡钻的**平均发现时间提前 15 分钟以上**，同时把每日报警条数压到 5 条以内。',
          '第二个指标比第一个更难，也更决定这套系统能不能活下来。'
        ],
        stats: [['样本井', '12', true], ['通道数', '14'], ['事故样本', '23 起'], ['每日报警上限', '5 条']],
        steps: [
          PV.step('工况分段', '工程环节',
            '先用参数规则把时间轴切成"钻进 / 接单根 / 起下钻"，不同工况分开建模。',
            '把"正常"定义清楚', '混在一起建模，接单根会被当成异常',
            PV.seq([
              ['钻进', 52, 'jade'],
              ['接单根', 8, 'clay'],
              ['钻进', 22, 'jade'],
              ['起下钻', 12, 'opt'],
              ['钻进', 6, 'jade']
            ], { head: 'STATE · 一条时间轴上的四种工况', note: '接单根时流量归零，是"正常异常"' }),
            '接单根引起的流量突变是最大的误报源，**先分段再建模**能直接消掉一半。'),

          PV.step('基线建模', '算法核心',
            '对每个工况、每个通道，用滑动分位数估计正常带，而不是假设正态分布。',
            '给出"正常"的上下界', '用全局均值做基线，遇到地层变化就整段失效',
            PV.trace({
              w: 340, h: 140, left: 12, right: 12, top: 24, bottom: 24,
              bands: [{ from: 0, to: 1, tone: 'jade', label: '正常带' }],
              fn: function (u) {
                return .5 + Math.sin(u * 12) * .12 + Math.sin(u * 31) * .05;
              },
              marks: [{ at: .72, label: '越界', v: .78, tone: 'bad' }]
            }),
            '带子随井深缓慢移动，所以叫"自适应基线"。固定阈值在深部一定失效。'),

          PV.step('残差与通道贡献', '算法核心',
            '把每通道偏离标准化后加权求和，同时保留"谁贡献了多少"。',
            '给出可解释的报警理由', '只给 0—1 的分数，司钻无法判断真假',
            PV.bars([
              ['扭矩', 42, 'bad', '42%'],
              ['立管压力', 27, 'clay', '27%'],
              ['返出流量', 19, 'jade', '19%'],
              ['转速', 12, 'gray', '12%']
            ], { w: 340, left: 84, note: '本次报警的通道贡献（示例）' }),
            '"扭矩贡献 42%"比"异常分数 0.87"有用得多——**前者能指导处置**。'),

          PV.step('分级预警与误报抑制', '效果关键',
            '设三级：提示（只记录）、预警（推送）、报警（要求处置），并加冷却窗口与去重。',
            '把报警量控制在人能处理的范围内', '所有异常都报警，三天后没人再看',
            PV.compare([
              {
                tag: 'A · 单一阈值', title: '报警 120 次', tone: 'bad',
                body: function (x, y, w) {
                  var s = '', i;
                  for (i = 0; i < 10; i++) {
                    s += PV.r(x + i * (w / 10), y + 6, w / 10 - 3, 8,
                      { rx: 2, fill: C.bad, fo: .35 + (i % 3) * .15 });
                  }
                  return s + PV.t(x, y + 30, '命中 22 次', { sz: 8.4, f: C.bad, w: 600 });
                }
              },
              {
                tag: 'B · 残差 + 冷却', title: '报警 31 次', tone: 'jade',
                body: function (x, y, w) {
                  var s = '', i;
                  for (i = 0; i < 4; i++) {
                    s += PV.r(x + i * (w / 4.6), y + 6, w / 8, 8,
                      { rx: 2, fill: C.jade, fo: .8 });
                  }
                  return s + PV.t(x, y + 30, '命中 20 次', { sz: 8.4, f: C.jade, w: 600 });
                }
              }
            ], { w: 340, h: 96 }),
            '同样的命中数，报警量差 4 倍。**这才是这个任务真正的 KPI**。'),

          PV.step('现场验证与标签回流', '闭环',
            '每次报警都记录"司钻怎么处置、事后确认是什么"，这些记录成为下一轮的标签。',
            '把处置行为变成训练数据', '只记录"是不是事故"，丢掉了最有价值的处置信息',
            PV.check([
              ['报警与处置时间已记录', 1],
              ['事后确认类型已回填', 1],
              ['未处置的报警也留档', 1],
              ['冷却参数可调', 1]
            ], { head: 'FEEDBACK · 每条报警都要能追溯', note: '"没处置"本身就是重要样本' }),
            '未处置的报警往往是最值钱的负样本：它说明模型把正常当成了异常。')
        ],
        metrics: {
          title: '怎么算"预警有效"',
          html: '<p>这类系统不能用准确率评价。要看的是**在可接受的报警量下，能提前多久、抓住多少**。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['平均提前量', '报警到事故的时间差', '18 min'],
              ['召回率', '事故里被提前预警的比例', '0.83'],
              ['误报率', '每日无效报警条数', '3.1 条 / 日'],
              ['可解释率', '能指出主贡献通道的报警占比', '100%']
            ])
        },
        fails: [
          { name: '把接单根当异常', why: '接单根时流量归零、立压下降，与井漏前兆相似。解决方向：工况分段 + 冷却窗口。' },
          { name: '基线跟着异常跑', why: '滑动窗口太长时前兆被吸收进基线，永远不越界。解决方向：用分位数 + 限制窗口长度。' },
          { name: '报警疲劳', why: '同一段异常反复报警，司钻最终会关掉提示。解决方向：事件级去重。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { d2Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

  /* =========================================================
     d3 · 井眼轨迹智能控制
     ========================================================= */

  function d3Traj() {
    var w = 620, h = 250, s = '';
    var gx0 = 40, gx1 = 430, gy0 = 20, gy1 = h - 30;

    s += PV.l(gx0, gy0, gx0, gy1, { stroke: C.line2 });
    s += PV.l(gx0, gy1, gx1, gy1, { stroke: C.line2 });
    s += PV.t(gx0 - 6, gy0 + 4, '垂深', { sz: 8, a: 'end', f: C.ink4 });
    s += PV.t(gx1, gy1 + 16, '水平位移 →', { sz: 8, a: 'end', f: C.ink4 });

    var d;
    for (d = 1; d <= 4; d++) {
      var yy = gy0 + d / 5 * (gy1 - gy0);
      s += PV.l(gx0, yy, gx1, yy, { stroke: C.line, dash: '2 4' });
    }

    /* 设计轨迹 */
    var plan = [], i;
    for (i = 0; i <= 60; i++) {
      var u = i / 60;
      plan.push([gx0 + u * u * (gx1 - gx0 - 30), gy0 + u * (gy1 - gy0 - 40)]);
    }
    s += PV.path(plan, { stroke: C.jade, sw: 1.8, dash: '5 4' });

    /* 实钻轨迹（锯齿） */
    var act = [], j;
    for (j = 0; j <= 90; j++) {
      var v = j / 90;
      act.push([
        gx0 + v * v * (gx1 - gx0 - 30) + Math.sin(v * 26) * 9,
        gy0 + v * (gy1 - gy0 - 40)
      ]);
    }
    s += PV.path(act, { stroke: C.clay, sw: 1.6 });

    /* 靶区 */
    s += PV.r(gx1 - 42, gy1 - 34, 34, 24, { fill: C.jadeL, stroke: C.jade, so: .5 });
    s += PV.t(gx1 - 44, gy1 - 40, '靶区窗口', { sz: 8, a: 'end', f: C.jadeD, w: 600 });

    s += PV.t(gx0 + 8, gy0 + 12, '设计轨迹', { sz: 8.2, f: C.jade, w: 600 });
    s += PV.t(gx0 + 8, gy0 + 26, '实钻轨迹', { sz: 8.2, f: C.clay, w: 600 });
    s += PV.t(gx0 + 8, gy0 + 44, '锯齿 = 反复纠偏', { sz: 7.8, f: C.ink4 });

    /* 工具面盘 */
    var cx = 530, cy = 118, rr = 52;
    s += PV.c(cx, cy, rr, { fill: '#fdfcf9', stroke: C.line2 });
    s += PV.c(cx, cy, rr - 12, { stroke: C.line, dash: '3 3' });

    ['上', '右', '下', '左'].forEach(function (lb, k) {
      var ang = (k * 90 - 90) * Math.PI / 180;
      s += PV.t(cx + Math.cos(ang) * (rr + 12),
        cy + Math.sin(ang) * (rr + 12) + 3, lb,
        { sz: 8, a: 'middle', f: C.ink4 });
    });

    s += PV.ar(cx, cy,
      cx + Math.cos(-50 * Math.PI / 180) * 36,
      cy + Math.sin(-50 * Math.PI / 180) * 36,
      { stroke: C.clay, sw: 2, h: 6 });
    s += PV.t(cx, cy + rr + 26, '工具面角 50°',
      { sz: 9, a: 'middle', f: C.clayD, w: 600 });
    s += PV.t(cx, cy + rr + 40, '决定往哪拐',
      { sz: 8, a: 'middle', f: C.ink4 });
    s += PV.t(530, 26, 'TOOLFACE',
      { sz: 7.6, a: 'middle', m: 1, ls: '.1em', f: C.ink4 });

    return PV.wrap(w, h, s, '井眼轨迹与工具面角');
  }

  /* 示范：开环 vs 滚动优化 */
  function d3Demo(root) {
    var TARGET = 88, SEGS = 10;

    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 滚动优化',
      title: '一次算到底，还是每段重算',
      desc: '地层真实响应与设计假设不一致时，两种策略的差别。滑杆控制"实际造斜率 / 设计造斜率"的比值：1.0 表示地层完全按设计响应，偏离越多，一次性规划越跑偏。',
      action: '换一次地层',
      ctrls: [
        { k: 'resp', label: '地层响应比', min: 50, max: 150, step: 5, value: 130,
          fmt: function (v) { return (v / 100).toFixed(2); } }
      ],
      onRun: function (st, paint, rt) {
        st.resp = 50 + Math.round(Math.random() * 20) * 5;
        var inp = rt.querySelector('input[data-k="resp"]');
        if (inp) inp.value = st.resp;
        var lab = rt.querySelector('[data-v="resp"]');
        if (lab) lab.textContent = (st.resp / 100).toFixed(2);
        paint();
      },
      render: function (st) {
        var resp = st.resp / 100;
        var need = TARGET / SEGS;
        var blind = [0], recede = [0], est = 1, i;

        /* 开环：按响应比 1.0 规划恒定造斜率，然后乘真实响应 */
        for (i = 0; i < SEGS; i++) {
          blind.push(Math.min(160, blind[i] + need * resp));
        }

        /* 滚动：每段用当前响应估计重算剩余需求 */
        for (i = 0; i < SEGS; i++) {
          var remain = SEGS - i;
          var cmd = (TARGET - recede[i]) / remain;
          recede.push(Math.min(160, recede[i] + cmd * (est * 0.55 + resp * 0.45)));
          est = est * 0.5 + resp * 0.5;
        }

        var errB = Math.abs(blind[SEGS] - TARGET);
        var errR = Math.abs(recede[SEGS] - TARGET);

        /* 画图 */
        var SW = 620, SH = 240, x0 = 46, x1 = SW - 16, y0 = 24, y1 = SH - 34;
        function X(k) { return x0 + k / SEGS * (x1 - x0); }
        function Y(v) { return y1 - Math.min(1.15, v / 120) * (y1 - y0); }

        var s = '';

        [0, 30, 60, 90, 120].forEach(function (v) {
          s += PV.l(x0, Y(v), x1, Y(v), { stroke: C.line, dash: '2 4' });
          s += PV.t(x0 - 6, Y(v) + 3, v, { sz: 7.6, a: 'end', f: C.ink4, m: 1 });
        });

        s += PV.r(x0, Y(TARGET + 2), x1 - x0, Y(TARGET - 2) - Y(TARGET + 2),
          { fill: C.jadeL, fo: .8 });
        s += PV.t(x1 - 4, Y(TARGET) - 6, '靶区 ' + TARGET + '°',
          { sz: 8, a: 'end', f: C.jadeD, w: 600 });

        s += PV.l(x0, y1, x1, y1, { stroke: C.line2 });
        s += PV.t(x1, SH - 8, '分段 →', { sz: 7.8, a: 'end', f: C.ink4, m: 1 });
        s += PV.t(2, y0 - 8, '井斜角 °', { sz: 7.8, f: C.ink4 });

        var pb = [], pr = [], k;
        for (k = 0; k <= SEGS; k++) {
          pb.push([X(k), Y(blind[k])]);
          pr.push([X(k), Y(recede[k])]);
        }
        s += PV.path(pb, { stroke: C.bad, sw: 1.9 });
        s += PV.path(pr, { stroke: C.jade, sw: 1.9 });

        for (k = 1; k <= SEGS; k++) {
          s += PV.c(X(k), Y(blind[k]), 2.4, { fill: C.bad });
          s += PV.c(X(k), Y(recede[k]), 2.4, { fill: C.jade });
        }

        s += PV.t(X(SEGS) - 4, Y(blind[SEGS]) + 15, errB.toFixed(1) + '°',
          { sz: 8.4, a: 'end', f: C.bad, w: 600 });
        s += PV.t(X(SEGS) - 4, Y(recede[SEGS]) - 7, errR.toFixed(1) + '°',
          { sz: 8.4, a: 'end', f: C.jade, w: 600 });

        return '<div class="dk-grid">' +
          '<div class="dk-stage">' + PV.wrap(SW, SH, s, '两种策略的井斜收敛') +
            DK.legend([
              { c: C.bad, t: '一次算到底（开环）' },
              { c: C.jade, t: '每段重算（滚动优化）' },
              { c: C.jade, t: '靶区' }
            ]) +
          '</div>' +
          '<div class="dk-side">' +
            DK.metrics([
              { l: '开环末段偏差', v: errB.toFixed(1), u: '°', cls: errB > 6 ? 'bad' : 'warn' },
              { l: '滚动末段偏差', v: errR.toFixed(1), u: '°', cls: errR <= 6 ? 'good' : 'warn' },
              { l: '地层响应比', v: resp.toFixed(2), u: '' },
              { l: '需要重算', v: SEGS, u: '次' }
            ]) +
            DK.verdict(
              errR < errB
                ? '滚动优化把末段偏差从 <b>' + errB.toFixed(1) + '° 压到 ' +
                  errR.toFixed(1) + '°</b>。代价是算 ' + SEGS + ' 次而不是 1 次——' +
                  '<b>在钻井里，这个代价可以忽略</b>。'
                : '这次地层几乎按设计响应，开环也能打准。<b>把响应比拉到 0.6 或 1.4 再看</b>——那就是真实井下的常态。',
              errR < errB ? 'ok' : 'warn'
            ) +
            '<div class="dk-card"><h5>为什么开环会偏</h5>' +
              '<p style="font-size:10.6px;color:var(--ink-4);line-height:1.65">' +
              '开环假设"下 8.8° 就真转 8.8°"。当实际只转 5.7°（响应比 0.65），' +
              '误差会沿井段<b>逐段累加</b>，而开环没有任何机制能发现它。</p>' +
            '</div>' +
          '</div></div>';
      }
    });
  }

  function d3W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '模型预测控制（MPC）+ 系统辨识',
        p: '<p>核心是两个东西：一个能预测"这一柱滑下去会转多少度"的<b>响应模型</b>，和一个每段重算的<b>滚动优化器</b>。</p>',
        svg: PV.flow([
          { tag: '01', title: '辨识响应', lines: ['工具面→造斜率'], tone: 'opt' },
          { tag: '02', title: '预测未来', lines: ['3—5 个立柱'], tone: 'jade' },
          { tag: '03', title: '只执行首段', lines: ['下段重算'], tone: 'clay' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '地层不是一个常数',
        p: '<p>同一工具面在砂岩和泥岩里造斜率不同，而且<b>打之前不知道是哪种</b>。开环规划必然累积误差。</p>',
        svg: PV.bars([
          ['开环偏差', 14, 'bad', '14.0°'],
          ['滚动偏差', 2, 'jade', '2.1°']
        ], { w: 300, left: 84, lh: 24, note: '响应比 1.3 时的末段落点偏差' })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '用反馈抵消未知',
        p: '<p>每段测斜后，用实测姿态更新状态、用实测/预测之比更新响应估计，再重算剩余段。<b>误差不会累积，只会被吸收</b>。</p>',
        svg: PV.check([
          ['每段更新姿态', 1],
          ['每段更新响应估计', 1],
          ['只执行第一段', 1]
        ], { w: 300, head: 'LOOP · 三段闭环' })
      }
    ]);
  }

  window.Cases.register({
    id: 'drill-trajectory',
    sceneId: 'd3',
    title: '井眼轨迹智能控制',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '预测控制 / 优化', desc: '在约束下求工具面与滑动长度' },
          { label: '数据门槛', value: '随钻测量 + 工具面', desc: '每 10—30 m 一个测点' },
          { label: '收益', value: '靶区命中率 ↑', desc: '减少纠偏与滑动进尺' },
          { label: '难度', value: '高', html: K.dtag('高'), desc: '闭环涉安全，目前多停在建议层' }
        ],
        lede: '井眼轨迹是三维空间里的一条曲线。钻头本身不会拐弯，能让它拐弯的是"工具面角"——滑动钻进时钻柱朝向哪个方向，井眼就往哪个方向偏。控制目标不是走直线，而是在靶区窗口内少走弯路。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>定向井的轨迹控制靠三件事：测斜（每 10—30 m 一次）、调整工具面、决定滑动还是旋转。滑动能造斜但效率极低；旋转钻得快但不控方向。</p>' +
            F(d3Traj(), 1, '左侧是轨迹剖面：**设计轨迹光滑，实钻轨迹锯齿**，每道锯齿都是一次"偏了再纠"。右侧是工具面盘：指针指向哪，井眼就往哪偏。') +
            '<p>锯齿不只是难看：每一次纠偏都增加井眼曲率（狗腿度），带来额外摩阻与起下钻困难。要优化的是"**总曲率**"，不是"某一点的偏差"。</p>' +
            F(PV.bars([
              ['旋转钻进', 100, 'jade', '快，不控方向'],
              ['滑动钻进', 38, 'clay', '能造斜，进尺慢'],
              ['滑动占比（典型）', 30, 'gray', '占钻时 45%']
            ], { w: 620, left: 148, note: '相对机械钻速（示意）' }), 2,
              '滑动效率只有旋转的三分之一。**轨迹控制的本质，是用尽量少的滑动换来尽量准的落点**。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>把控制问题写成"滚动时域优化"：每次测得新姿态后，用井下响应模型预测未来几十米，在约束下求最优工具面与滑动长度，执行一段再重算。</p>' +
            F(PV.flow([
              { tag: '01 · MEASURE', title: '测斜', lines: ['井斜 / 方位'], tone: 'gray' },
              { tag: '02 · ESTIMATE', title: '姿态估计', lines: ['插值 + 不确定性'], tone: 'opt' },
              { tag: '03 · MODEL', title: '地层响应', lines: ['工具面→造斜率'], tone: 'jade' },
              { tag: '04 · MPC', title: '滚动优化', lines: ['约束靶区 / DLS'], tone: 'clay' },
              { tag: '05 · ACT', title: '下发建议', lines: ['工具面 + 滑动长度'], tone: 'kg' }
            ], { note: '第 3 步是全部难点：同样的工具面，不同地层造斜率不一样' }), 3,
              '算法输出的是"这一柱怎么滑"，而不是"整口井怎么打"。**滚动优化的价值在于能纠偏**。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">轨迹控制的数据特点是"姿态稀疏、参数密集"：姿态十几米才一个点，钻井参数每秒都有。</p>' +
            K.checklist([
              ['随钻测量轨迹', '井斜、方位、深度的测点序列', '无需标注'],
              ['工具面与滑动记录', '按立柱记录', '作为动作标签'],
              ['钻井参数', '钻压、转速、排量', '高频，判断工况'],
              ['地层与邻井', '地层倾角、邻井轨迹', '作为扰动因素']
            ]) +
            F(PV.freq([
              ['工具面 / 滑动', 600, 1800, '按立柱', 'clay'],
              ['随钻测量', 1200, 3600, '10—30 m', 'opt'],
              ['钻井参数', 1, 5, '1—5 s', 'jade'],
              ['设计靶区', 86400, 86400, '单井一次', 'gray']
            ], { head: 'SAMPLING · 姿态稀疏，参数密集' }), 4,
              '测点之间是插值出来的，**插值误差会直接变成控制误差**。这就是为什么轨迹控制必须带不确定性。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('高') + '<span class="small muted">算法不是瓶颈，井下响应辨识与安全责任才是。</span></div>' +
            F(PV.score([
              ['数据可得性', 2, '测点稀疏'],
              ['模型辨识', 3, '地层响应随井段变'],
              ['闭环风险', 3, '自动送钻责任重大'],
              ['可解释性', 2, '需说明为什么这样滑']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '适合**先做"建议"再谈"闭环"**：把工具面与滑动长度算准，已经能省掉大量试错。') +
            '<p style="margin-top:14px">技术路线上，MPC 比端到端强化学习更现实：它需要的是可辨识的响应模型，不是黑箱策略。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['模型预测控制', '系统辨识', '模仿学习', '状态估计'], '#/method/opt')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>这个案例最能说明一件事：<b>不是所有问题都该交给强化学习</b>。当你能测量、能建模、能重算时，经典控制 + 少量学习反而更稳。</p>' + d3W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一个定向井段的滑动优化',
        lead: [
          '目标：在保证**靶区命中**的前提下，把定向段的滑动占比从 30% 降到 20% 以下。',
          '注意这不是"打得准"的问题，而是"用多少次纠偏换来的准"的问题。'
        ],
        stats: [['井段', '1200—2100 m'], ['滑动占比', '30% → 19%'], ['靶区偏差', '≤ 8 m'], ['DLS 上限', '3°/30m']],
        steps: [
          PV.step('测斜数据校正', '工程环节',
            '把测斜数据按井深对齐，剔除明显异常点，统一到同一套坐标与深度基准。',
            '得到可信的姿态序列', '测点稀疏时，异常点会被插值放大成整段偏移',
            PV.check([
              ['深度基准统一', 1],
              ['井斜 / 方位单位统一', 1],
              ['异常测点已剔除', 1],
              ['测点间距已记录', 1]
            ], { head: 'CLEANING · 四条硬规则' }),
            '测斜只有几十个点，**一个坏点就能毁掉整段轨迹**。'),

          PV.step('轨迹插值与不确定性', '算法核心',
            '用最小曲率法插值，同时给出每个位置的置信区间，而不是一条确定的线。',
            '知道"轨迹可能在哪个范围里"', '把插值结果当成真值，后续控制全是错的',
            PV.compare([
              {
                tag: 'A · 单条曲线', title: '看起来确定', tone: 'gray',
                body: function (x, y, w, h) {
                  return PV.path([
                    [x, y],
                    [x + w * .5, y + h * .4],
                    [x + w * .8, y + h * .9]
                  ], { stroke: C.ink3, sw: 1.6 });
                }
              },
              {
                tag: 'B · 带区间', title: '知道不确定', tone: 'jade',
                body: function (x, y, w, h) {
                  var a = [
                    [x, y],
                    [x + w * .5, y + h * .4],
                    [x + w * .8, y + h * .9]
                  ];
                  var b = [
                    [x + 8, y],
                    [x + w * .5 + 10, y + h * .4],
                    [x + w * .8 + 14, y + h * .9]
                  ];
                  return PV.path(a.concat(b.reverse()), { fill: C.jadeL, close: true }) +
                    PV.path(a, { stroke: C.jade, sw: 1.5 });
                }
              }
            ], { w: 340, h: 130 }),
            '区间越往下越宽。**控制决策应基于区间，而不是那条中心线**。'),

          PV.step('地层响应辨识', '算法核心',
            '从历史滑动记录里学"工具面 → 实际造斜率"的映射，并按井段分开建模。',
            '知道这一柱滑下去会拐多少', '用一口井的响应去指导另一口井',
            PV.scatter({
              pts: [
                [.1, .12], [.25, .3], [.35, .28], [.45, .5], [.55, .48],
                [.62, .68], [.72, .66], [.8, .85], [.88, .82], [.95, .95], [.4, .42]
              ],
              xlab: '工具面有效分量', ylab: '实际造斜率'
            }),
            '散点越散，说明同一工具面在不同井段的响应差别越大——**这正是要按井段建模的理由**。'),

          PV.step('滚动优化求解', '效果关键',
            '在 DLS 与靶区约束下，求未来 3—5 个立柱的最优工具面与滑动长度，只执行第一个。',
            '每柱都能纠偏', '一次算完整口井，中途地层一变全部作废',
            PV.trace({
              w: 340, h: 140, left: 12, right: 12, top: 24, bottom: 24,
              bands: [{ from: .5, to: 1, tone: 'opt', label: '预测段' }],
              fn: function (u) {
                return .2 + u * .55 + (u > .5 ? Math.sin((u - .5) * 9) * .02 : 0);
              },
              marks: [{ at: .5, label: '当前', v: .48, tone: 'jade' }]
            }),
            '实线是已钻，右侧是每次重算的预测。**预测段永远只执行第一步**，这是 MPC 的核心。'),

          PV.step('建议下发与人工执行', '闭环',
            '把工具面角与滑动长度以司钻能读的形式下发，并记录实际执行与偏差。',
            '把执行偏差变成下一轮输入', '下发一张曲线图，司钻无法照着操作',
            PV.io({
              in: ['靶区坐标', '当前姿态', 'DLS 余量'],
              out: ['工具面 52°', '滑动 6.8 m', '预计造斜 1.4°'],
              mid: '每柱一次', h: 132,
              note: '输出必须是"可执行的数"'
            }),
            '执行偏差（实际滑了 8 m 而不是 6.8 m）本身就是最宝贵的数据。')
        ],
        metrics: {
          title: '怎么算"控得好"',
          html: '<p>不能只看最终落点，要把**滑动占比**（成本）和**狗腿度**（副作用）一起看。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['靶区偏差', '到靶区中心的距离', '6.2 m'],
              ['滑动占比', '滑动进尺 / 总进尺', '19%'],
              ['最大狗腿度', '单位井段角度变化', '2.6° / 30m'],
              ['预测偏差', '预测造斜率与实际的差', '0.23°']
            ])
        },
        fails: [
          { name: '把地层当成常数', why: '同一工具面在砂岩与泥岩里造斜率不同。解决方向：按井段分段辨识响应。' },
          { name: '忽略执行偏差', why: '实际滑动长度与建议不符，模型却按建议更新状态。解决方向：用实测姿态更新。' },
          { name: '过度纠偏', why: '每柱追求零偏差，导致轨迹锯齿、摩阻上升。解决方向：把 DLS 作为惩罚项。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { d3Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

  /* =========================================================
     d4 · 钻具失效预测
     ========================================================= */

  function d4Fatigue() {
    var w = 620, h = 230, s = '';
    var x0 = 54, x1 = 330, y0 = 26, y1 = h - 40;

    /* 左：S—N 曲线 */
    s += PV.l(x0, y1, x1, y1, { stroke: C.line3 });
    s += PV.l(x0, y1, x0, y0, { stroke: C.line3 });
    s += PV.t(x1, y1 + 16, '循环次数 N（对数）→', { sz: 8, a: 'end', f: C.ink4 });
    s += PV.t(x0, y0 - 8, '应力幅 S（对数）↑', { sz: 8, f: C.ink4 });

    var pts = [], i;
    for (i = 0; i <= 40; i++) {
      var u = i / 40;
      pts.push([x0 + 8 + u * (x1 - x0 - 16),
        y0 + 10 + Math.pow(u, .75) * (y1 - y0 - 24)]);
    }
    s += PV.path(pts, { stroke: C.ink2, sw: 1.7 });
    s += PV.t(x0 + 14, y0 + 30, '高应力 · 少循环', { sz: 8, f: C.ink3 });
    s += PV.t(x1 - 10, y1 - 18, '低应力 · 多循环', { sz: 8, f: C.ink3, a: 'end' });
    s += PV.t(x0 + 46, y1 - 46, 'S—N 曲线', { sz: 8, f: C.clay, w: 600 });

    /* 右：损伤累积条 */
    var bx = 380, bw = 210, by = 40;
    s += PV.t(bx, 26, 'DAMAGE · 损伤累积', { sz: 7.6, m: 1, ls: '.1em', f: C.ink4 });
    s += PV.t(bx, by + 4, 'D = Σ (nᵢ / Nᵢ)', { sz: 11, m: 1, f: C.ink });

    [
      ['井段 A · 直井段', .18, 'jade'],
      ['井段 B · 造斜段', .42, 'clay'],
      ['井段 C · 狗腿严重', .78, 'warn'],
      ['井段 D · 振动超标', 1.06, 'bad']
    ].forEach(function (rw, k) {
      var yy = by + 34 + k * 34;
      s += PV.t(bx, yy, rw[0], { sz: 8.6, f: C.ink2 });
      s += PV.r(bx, yy + 6, bw, 9, { rx: 4, fill: C.line });
      s += PV.r(bx, yy + 6, Math.min(bw, bw * rw[1]), 9,
        { rx: 4, fill: PV.tone(rw[2])[0], fo: .9 });
      s += PV.t(bx + bw + 6, yy + 14, rw[1].toFixed(2),
        { sz: 8.4, m: 1, f: PV.tone(rw[2])[0], w: 600 });
    });

    s += PV.l(bx - 2, by + 34 + 2 * 34 + 15, bx + bw, by + 34 + 2 * 34 + 15,
      { stroke: C.bad, dash: '4 3', sw: 1.4 });
    s += PV.t(bx + bw, by + 34 + 2 * 34 + 30, 'D = 1.0 → 理论失效',
      { sz: 8, a: 'end', f: C.bad, w: 600 });

    return PV.wrap(w, h, s, '疲劳寿命与损伤累积');
  }

  /* 示范：雨流计数 → 损伤贡献 */
  function d4Demo(root) {
    var AMP = [5, 10, 15, 20, 30];
    var SHAPE = [0.46, 0.28, 0.15, 0.08, 0.03];
    var NREF = [4.0e6, 5.0e5, 1.5e5, 6.0e4, 1.8e4];

    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 雨流计数 + Miner',
      title: '次数最多的，往往不是最伤寿命的',
      desc: '左边是某 100 m 进尺的循环谱（次数），右边是同样这些循环各自贡献的损伤。把幅值倍率拉大，看损伤怎么从"小循环为主"翻转到"大循环为主"。',
      ctrls: [
        { k: 'amp', label: '幅值倍率', min: 60, max: 160, step: 5, value: 100,
          fmt: function (v) { return (v / 100).toFixed(2); } },
        { k: 'cyc', label: '循环密度', min: 60, max: 220, step: 10, value: 120,
          fmt: function (v) { return v + '/100m'; } },
        { k: 'dls', label: '狗腿度', min: 1, max: 5, step: 0.5, value: 3,
          fmt: function (v) { return v.toFixed(1) + '°/30m'; } }
      ],
      render: function (st) {
        var amp = st.amp / 100, cyc = st.cyc, dlsf = st.dls / 3;
        var n = [], d = [], total = 0, i;

        for (i = 0; i < AMP.length; i++) {
          var Nf = NREF[i] / Math.pow(dlsf, 1.6) / Math.pow(amp, 3);
          n.push(SHAPE[i] * cyc * 10);
          var di = n[i] / Math.max(1, Nf) * 12;
          d.push(di);
          total += di;
        }

        var remain = total > 0 ? (1 / total) * 100 : 9999;
        var maxN = Math.max.apply(null, n) || 1;
        var maxD = Math.max.apply(null, d) || 1e-9;
        var dominant = d.indexOf(maxD);

        function chartN() {
          var SW = 300, SH = 168, x0 = 46, y0 = 18, y1 = SH - 26;
          var bwid = (SW - x0 - 14) / AMP.length;
          var s = PV.t(0, 12, '循环次数 / 100 m',
            { sz: 7.6, m: 1, ls: '.08em', f: C.ink4 });
          for (i = 0; i < AMP.length; i++) {
            var hgt = (n[i] / maxN) * (y1 - y0);
            s += PV.r(x0 + i * bwid + 3, y1 - hgt, bwid - 8, hgt,
              { fill: C.opt, rx: 2, fo: .35 + .5 * (n[i] / maxN) });
            s += PV.t(x0 + i * bwid + bwid / 2 - 1, y1 - hgt - 5, Math.round(n[i]),
              { sz: 7.8, a: 'middle', m: 1, f: C.ink3 });
            s += PV.t(x0 + i * bwid + bwid / 2 - 1, y1 + 13,
              '±' + Math.round(AMP[i] * amp),
              { sz: 7.6, a: 'middle', m: 1, f: C.ink4 });
          }
          s += PV.l(x0 - 4, y1, SW - 10, y1, { stroke: C.line2 });
          return PV.wrap(SW, SH, s, '循环谱');
        }

        function chartD() {
          var SW = 300, SH = 168, x0 = 46, y0 = 18, y1 = SH - 26;
          var bwid = (SW - x0 - 14) / AMP.length;
          var s = PV.t(0, 12, '损伤贡献（相对）',
            { sz: 7.6, m: 1, ls: '.08em', f: C.ink4 });
          for (i = 0; i < AMP.length; i++) {
            var hgt = (d[i] / maxD) * (y1 - y0);
            var pct = Math.round(d[i] / total * 100);
            s += PV.r(x0 + i * bwid + 3, y1 - hgt, bwid - 8, hgt, {
              fill: pct > 35 ? C.bad : C.jade,
              rx: 2, fo: .35 + .5 * (d[i] / maxD)
            });
            s += PV.t(x0 + i * bwid + bwid / 2 - 1, y1 - hgt - 5, pct + '%',
              { sz: 7.8, a: 'middle', m: 1, f: pct > 35 ? C.bad : C.ink3 });
            s += PV.t(x0 + i * bwid + bwid / 2 - 1, y1 + 13,
              '±' + Math.round(AMP[i] * amp),
              { sz: 7.6, a: 'middle', m: 1, f: C.ink4 });
          }
          s += PV.l(x0 - 4, y1, SW - 10, y1, { stroke: C.line2 });
          return PV.wrap(SW, SH, s, '损伤贡献');
        }

        return '<div class="dk-grid">' +
          '<div class="dk-stage" style="padding-bottom:4px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
              chartN() + chartD() +
            '</div>' +
            DK.legend([
              { c: C.opt, t: '循环次数' },
              { c: C.jade, t: '损伤贡献（低）' },
              { c: C.bad, t: '损伤贡献（高）' }
            ]) +
          '</div>' +
          '<div class="dk-side">' +
            DK.metrics([
              { l: 'D / 100 m', v: total.toFixed(3), u: '',
                cls: total > .08 ? 'bad' : total > .04 ? 'warn' : 'good' },
              { l: '剩余进尺', v: remain > 999 ? '>999' : remain.toFixed(0), u: 'm' },
              { l: '最大单组损伤', v: Math.round(d[dominant] / total * 100), u: '%' },
              { l: '最伤寿命的是', v: '±' + Math.round(AMP[dominant] * amp), u: '' }
            ]) +
            DK.verdict(
              '次数最多的是 <b>±' + Math.round(AMP[0] * amp) + '</b>（' +
              Math.round(n[0]) + ' 次），但最伤寿命的是 <b>±' +
              Math.round(AMP[dominant] * amp) + '</b>（占 ' +
              Math.round(d[dominant] / total * 100) +
              '%）。<b>这就是为什么不能看峰值，必须做雨流计数</b>。',
              total > .08 ? 'bad' : 'ok'
            ) +
            '<div class="dk-card"><h5>寿命换算</h5>' +
              '<p style="font-size:10.6px;color:var(--ink-4);line-height:1.65">' +
              'Nᵢ 按 S—N 曲线取，并按狗腿度与幅值倍率缩放。D=1 是 Miner 法则的理论失效点，' +
              '工程上通常取 0.6—0.8 就开始排起钻窗口。</p>' +
            '</div>' +
          '</div></div>';
      }
    });
  }

  function d4W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '雨流计数 + S—N/Miner + 校准模型',
        p: '<p>物理模型负责"讲道理"（损伤怎么累加），数据模型负责"校准参数"（这批钻具的分散系数与实测偏差）。</p>',
        svg: PV.flow([
          { tag: '01', title: '雨流计数', lines: ['幅值—次数'], tone: 'opt' },
          { tag: '02', title: 'Miner 累加', lines: ['Σ nᵢ/Nᵢ'], tone: 'jade' },
          { tag: '03', title: '探伤校准', lines: ['分散系数'], tone: 'clay' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '失效样本不到 1%',
        p: '<p>一年只有几起断钻具，纯监督学习没有足够样本。<b>但疲劳机理是成熟的</b>，所以物理打底、数据校准。</p>',
        svg: PV.stack([
          ['正常服役', 97.2, 'jade'],
          ['接近失效', 2.3, 'warn'],
          ['已失效', 0.5, 'bad']
        ], { w: 300 })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '从"按进尺"变成"按损伤"',
        p: '<p>同样一千米，直井段和狗腿段消耗的寿命差六倍。按损伤排起钻窗口，<b>起钻次数能减半而安全性不降</b>。</p>',
        svg: PV.bars([
          ['按固定进尺', 6, 'gray', '6 次/年'],
          ['按损伤窗口', 3, 'jade', '3 次/年']
        ], { w: 300, left: 90, lh: 24 })
      }
    ]);
  }

  window.Cases.register({
    id: 'drill-fatigue',
    sceneId: 'd4',
    title: '钻具失效预测',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '剩余寿命预测', desc: '物理模型 + 数据驱动的混合建模' },
          { label: '数据门槛', value: '振动 + 扭矩 + 台账', desc: '失效事件少，靠物理先验补' },
          { label: '收益', value: '减少断钻具', desc: '避免数十万元级打捞作业' },
          { label: '难度', value: '中', html: K.dtag('中'), desc: '失效样本稀少，但机理清楚' }
        ],
        lede: '钻具在井下不是"用久了坏"，而是"累了才坏"。每一次弯曲都是一次载荷循环，损伤按 Miner 法则线性累加——这解释了为什么同样的进尺，在狗腿严重的井段损伤会快好几倍。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>钻杆在井下同时承受拉、扭、弯。转盘一转，钻杆就经历一次拉—压交变，这就是一次**疲劳循环**。累积到材料上限，裂纹就出现了——而且往往在接头螺纹这种应力集中的地方。</p>' +
            F(d4Fatigue(), 1, '左边是 S—N 曲线：应力越大，能承受的循环越少。右边是 **Miner 法则**：把每个井段消耗的寿命加起来，超过 1.0 就理论失效。') +
            '<p>问题在于现场按"进尺"或"纯钻时间"估寿命，把两种完全不同的工况当成一回事。</p>' +
            F(PV.bars([
              ['直井段', 18, 'jade', '0.18'],
              ['造斜段', 42, 'clay', '0.42'],
              ['狗腿严重段', 78, 'warn', '0.78'],
              ['振动超标段', 106, 'bad', '1.06']
            ], { w: 620, left: 120, max: 110, note: '同一批钻具、同等进尺下的损伤消耗（示意）' }), 2,
              '同样一千米，**损伤可以差六倍**。按进尺估寿命，等于把最危险的一段平均掉了。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>不去预测"哪天断"，而是预测"还剩多少寿命"。输出的是可行动的窗口，而不是一个无法验证的日子。</p>' +
            F(PV.flow([
              { tag: '01 · SIGNAL', title: '振动 / 扭矩', lines: ['高频时序'], tone: 'gray' },
              { tag: '02 · CYCLE', title: '雨流计数', lines: ['幅值—次数谱'], tone: 'opt' },
              { tag: '03 · DAMAGE', title: '损伤累积', lines: ['S—N + Miner'], tone: 'jade' },
              { tag: '04 · LIFE', title: '剩余寿命', lines: ['给区间'], tone: 'clay' },
              { tag: '05 · ACTION', title: '起钻窗口', lines: ['结合探伤'], tone: 'kg' }
            ], { note: '物理负责讲道理，数据负责校准参数——这是混合建模' }), 3,
              '第 2 步是全部关键：**雨流计数把一条乱糟糟的振动曲线，压成一张可计算的循环谱**。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">数据特点：高频通道很多，但"失效"这个标签一年也没几个。</p>' +
            K.checklist([
              ['钻具振动与扭矩', '三轴振动、扭矩、转速', '无需标注'],
              ['钻具台账', '型号、服役历史、探伤记录', '失效事件标注'],
              ['起钻检查结果', '探伤与磨损测量', '作为寿命标签'],
              ['井眼轨迹', '狗腿度、井斜', '用于分段计算损伤']
            ]) +
            F(PV.stack([
              ['正常服役', 97.2, 'jade'],
              ['接近失效', 2.3, 'warn'],
              ['已失效', 0.5, 'bad']
            ], { w: 620, label: '样本比例' }), 4,
              '失效样本不到 1%。**所以这条路线一定是"物理打底、数据校准"**，纯监督学习没有足够样本。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('中') + '<span class="small muted">机理清楚、数据可得；难在失效样本稀少与探伤反馈不及时。</span></div>' +
            F(PV.score([
              ['数据可得性', 1, '振动与扭矩现成'],
              ['标签成本', 3, '失效事件极少'],
              ['机理清晰度', 1, 'S—N + Miner 成熟'],
              ['反馈周期', 2, '起钻才能探伤']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '机理清晰是最大优势：**没有标签时，物理模型仍然能给出可用答案**。') +
            '<p style="margin-top:14px">落地顺序：先做"损伤仪表盘"（只算不预测），让工程师认可损伤分布，再加剩余寿命区间。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['雨流计数', '剩余寿命预测', '混合建模', '可靠性评估'], '#/method/ts')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>这是全站最典型的一个"<b>物理约束 + 数据校准</b>"案例。它说明 AI 不一定是主角，有时它只是把机理模型掰到这批设备上。</p>' + d4W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一批钻杆的剩余寿命管理',
        lead: [
          '目标：把**非计划起钻（断钻具）次数**从每年 4 次降到 1 次以内，同时不增加计划外起钻。',
          '换句话说，既要少断，也不能因为怕断而频繁起钻。'
        ],
        stats: [['钻具批次', '2 批'], ['监测井', '18 口'], ['失效事件', '9 起'], ['目标', '≤1 次/年']],
        steps: [
          PV.step('高频振动采集与清洗', '工程环节',
            '把三轴振动、扭矩按统一采样率落库，剔除传感器掉线与明显削顶的片段。',
            '得到可计算的载荷序列', '削顶信号会低估幅值，直接低估损伤',
            PV.check([
              ['采样率统一', 1],
              ['削顶与掉线已剔除', 1],
              ['传感器安装位置已记录', 1],
              ['按钻具批次分组', 1]
            ], { head: 'CLEANING · 四条硬规则' }),
            '"安装位置"很重要：**不同位置的振动幅值不可比**，混在一起算损伤会失真。'),

          PV.step('雨流计数与等效载荷', '算法核心',
            '用雨流计数把随机振动拆成若干"幅值—次数"对，形成循环谱。',
            '把连续信号压成可累加的量', '直接对原始信号求均值，会完全丢掉损伤信息',
            PV.bars([
              ['±5 kN', 120, 'jade', '120 次'],
              ['±10 kN', 78, 'jade', '78'],
              ['±15 kN', 46, 'clay', '46'],
              ['±20 kN', 21, 'warn', '21'],
              ['±30 kN', 7, 'bad', '7']
            ], { w: 340, left: 64, note: '循环谱：大幅值次数少，但损伤占大头' }),
            '注意最后一行：**7 次大幅值循环，损伤可能超过前面 120 次小循环的总和**。'),

          PV.step('损伤累积与剩余寿命', '算法核心',
            '按 Miner 法则逐段累加 D，输出剩余寿命的中位数与 80% 区间。',
            '给出区间而不只是点估计', '只报"还剩 30 天"，无法用于排作业计划',
            PV.trace({
              w: 340, h: 140, left: 12, right: 12, top: 24, bottom: 24,
              bands: [{ from: .78, to: 1, tone: 'bad', label: '失效区' }],
              fn: function (u) { return Math.min(.98, Math.pow(u, 1.25) * .95); },
              marks: [{ at: .5, label: '当前 D=0.52', v: .3, tone: 'jade' }],
              xlab: '累计钻时 →', ylab: 'D'
            }),
            '曲线不是直线：**前期损伤慢，后期裂纹扩展快**。所以剩余寿命要用区间表达。'),

          PV.step('起钻窗口与阈值', '效果关键',
            '把剩余寿命与钻井计划、探伤资源结合，给出"建议起钻窗口"而不是"立即起钻"。',
            '让建议可执行', '报警说"马上起钻"，现场不会照做',
            PV.compare([
              {
                tag: 'A · 到点就起', title: '按固定进尺', tone: 'gray',
                body: function (x, y, w) {
                  return PV.r(x, y + 8, w, 8, { rx: 3, fill: C.line3 }) +
                    PV.t(x, y + 28, '起钻 6 次 / 年', { sz: 8.4, f: C.ink3 });
                }
              },
              {
                tag: 'B · 按损伤起钻', title: '窗口内择机', tone: 'jade',
                body: function (x, y, w) {
                  return PV.r(x, y + 8, w * .45, 8, { rx: 3, fill: C.jade, fo: .8 }) +
                    PV.r(x + w * .62, y + 8, w * .2, 8, { rx: 3, fill: C.clay, fo: .8 }) +
                    PV.t(x, y + 28, '起钻 3 次 / 年', { sz: 8.4, f: C.jade, w: 600 });
                }
              }
            ], { w: 340, h: 100 }),
            '同样的安全性，起钻从 6 次降到 3 次。**优化的不是"更早"，而是"更准"**。'),

          PV.step('探伤结果回流标定', '闭环',
            '每次起钻的探伤结果回填，用来校准 S—N 曲线的分散系数与模型偏差。',
            '让物理模型适配这批钻具', '永远用教材参数，模型会系统性偏乐观',
            PV.check([
              ['探伤结果已结构化回填', 1],
              ['失效位置与预测位置比对', 1],
              ['按批次校准分散系数', 1],
              ['偏差趋势纳入监控', 1]
            ], { head: 'CALIBRATION · 每次起钻都是一次标定' }),
            '探伤是最贵的标签，**每一次都别浪费**。')
        ],
        metrics: {
          title: '怎么算"管得住"',
          html: '<p>核心是**用更少的起钻换来更少的失效**，两个指标必须一起看。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['失效次数', '每年断钻具事件数', '1 次 / 年'],
              ['计划外起钻', '非计划起钻次数', '0'],
              ['寿命预测偏差', '预测与实际的相对误差', '18%'],
              ['探伤命中率', '高风险段中实际有缺陷的比例', '0.71']
            ])
        },
        fails: [
          { name: '把振动幅值当损伤', why: '幅值大但循环少，损伤可能不如小幅值长期累积。解决方向：必须走雨流计数。' },
          { name: '忽略安装位置', why: '不同位置的幅值不可比，混算会拉平差异。解决方向：按位置分组标定。' },
          { name: '预测过于乐观', why: '直接用教材 S—N 曲线，忽略制造分散性。解决方向：用探伤数据校准。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { d4Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

  /* =========================================================
     d5 · 钻井液性能智能调控
     ========================================================= */

  function d5WindowFig() {
    return PV.pressWindow({
      w: 620, h: 262,
      pore: [[0, .18], [.2, .24], [.4, .30], [.6, .38], [.8, .46], [1, .52]],
      frac: [[0, .74], [.2, .72], [.4, .66], [.6, .60], [.8, .56], [1, .54]],
      mud: [[0, .50], [.2, .52], [.4, .54], [.6, .55], [.8, .56], [1, .57]],
      narrow: { from: .62, to: .96, label: '窄窗口段', sub: '余量 < 0.04' },
      depthNote: '垂深 ↓',
      label: '孔隙压力 / 破裂压力与钻井液密度窗口'
    });
  }

  /* 示范：密度窗口 + ECD 随排量 */
  function d5Demo(root) {
    var DMIN = 1.25, DMAX = 1.62;
    var DEP0 = 3200, DEP1 = 4100;

    function pore(d) { return 1.34 + (d - 3200) / 900 * 0.16; }
    function frac(d) { return 1.52 - (d - 3200) / 900 * 0.06; }

    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 密度窗口',
      title: '窗口只有 0.04 时，调密度的余地有多大',
      desc: '绿色带是安全窗口：下界孔隙压力（低一点气侵），上界破裂压力（高一点井漏）。拖密度与排量，看 ECD 怎么在窗口里挤——排量越大 ECD 越高，这就是"循环时比静止时更容易漏"的原因。',
      ctrls: [
        { k: 'mw', label: '密度 g/cm³', min: 120, max: 140, step: 1, value: 130,
          fmt: function (v) { return (v / 100).toFixed(2); } },
        { k: 'rate', label: '排量 L/s', min: 28, max: 60, step: 2, value: 42 },
        { k: 'depth', label: '井深 m', min: 3200, max: 4100, step: 50, value: 3800,
          fmt: function (v) { return v + ' m'; } }
      ],
      render: function (st) {
        var mw = st.mw / 100, d = st.depth;
        var ecd = mw + st.rate * 0.0011;
        var p = pore(d), f = frac(d);
        var win = f - p;

        var state, label;
        if (ecd < p) { state = 'bad'; label = '气侵风险'; }
        else if (ecd > f) { state = 'bad'; label = '井漏风险'; }
        else if (ecd - p < 0.02 || f - ecd < 0.02) { state = 'warn'; label = '余量偏小'; }
        else { state = 'ok'; label = '窗口内'; }

        /* 画图 */
        var SW = 620, SH = 262;
        var L = 52, R = 24, T = 22, B = 34;
        var x0 = L, x1 = SW - R, y0 = T, y1 = SH - B;

        function X(v) { return x0 + (v - DMIN) / (DMAX - DMIN) * (x1 - x0); }
        function Y(dep) { return y0 + (dep - DEP0) / (DEP1 - DEP0) * (y1 - y0); }

        var s = '', i, n = 16;

        /* 密度网格 + 刻度 */
        [1.25, 1.35, 1.45, 1.55].forEach(function (v) {
          s += PV.l(X(v), y0, X(v), y1, { stroke: C.line, dash: '2 4' });
          s += PV.t(X(v), y1 + 16, v.toFixed(2),
            { sz: 7.6, a: 'middle', f: C.ink4, m: 1 });
        });
        s += PV.l(x0, y1, x1, y1, { stroke: C.line2 });
        s += PV.l(x0, y0, x0, y1, { stroke: C.line2 });

        /* 安全窗口填充 */
        var up = [], dn = [];
        for (i = 0; i <= n; i++) {
          var dd = DEP0 + (DEP1 - DEP0) * i / n;
          up.push([X(pore(dd)), Y(dd)]);
          dn.push([X(frac(dd)), Y(dd)]);
        }
        s += PV.path(up.concat(dn.reverse()), { fill: C.jadeL, close: true });

        /* 三条曲线 */
        s += PV.path(up, { stroke: C.opt, sw: 1.6 });
        s += PV.path(dn, { stroke: C.clay, sw: 1.6 });

        var mud = [];
        for (i = 0; i <= n; i++) {
          var d2 = DEP0 + (DEP1 - DEP0) * i / n;
          mud.push([X(ecd), Y(d2)]);
        }
        s += PV.path(mud, { stroke: state === 'bad' ? C.bad : C.jade, sw: 1.9, dash: '5 3' });

        /* 当前井深 */
        s += PV.l(x0, Y(d), x1, Y(d), { stroke: C.ink3, dash: '3 4', so: .6 });
        s += PV.t(x1 - 2, Y(d) - 6, d + ' m',
          { sz: 8, a: 'end', f: C.ink3, m: 1 });
        s += PV.c(X(ecd), Y(d), 4, { fill: state === 'bad' ? C.bad : C.jade, stroke: '#fff', sw: 1.2 });

        /* 图例 */
        [['孔隙压力', C.opt], ['破裂压力', C.clay], ['ECD', C.jade]]
          .forEach(function (lg, k) {
            var ly = y0 + 14 + k * 16;
            s += PV.l(x1 - 108, ly - 3, x1 - 92, ly - 3, { stroke: lg[1], sw: 2 });
            s += PV.t(x1 - 86, ly, lg[0], { sz: 8, f: C.ink3 });
          });

        s += PV.t(4, y0 - 8, '井深 ↓', { sz: 7.8, f: C.ink4, m: 1 });
        s += PV.t(x1, SH - 6, '当量密度 g/cm³ →',
          { sz: 7.8, a: 'end', f: C.ink4, m: 1 });

        return '<div class="dk-grid">' +
          '<div class="dk-stage">' + PV.wrap(SW, SH, s, '密度窗口') +
            DK.legend([
              { c: C.jade, t: '安全窗口' },
              { c: C.jade, t: 'ECD（密度 + 循环附加）' },
              { c: C.ink3, t: '当前井深' }
            ]) +
          '</div>' +
          '<div class="dk-side">' +
            DK.metrics([
              { l: '窗口宽度', v: win.toFixed(3), u: '',
                cls: win < 0.05 ? 'bad' : win < 0.09 ? 'warn' : 'good' },
              { l: 'ECD', v: ecd.toFixed(3), u: '' },
              { l: '下界余量', v: (ecd - p).toFixed(3), u: '',
                cls: ecd - p > 0 ? 'good' : 'bad' },
              { l: '上界余量', v: (f - ecd).toFixed(3), u: '',
                cls: f - ecd > 0 ? 'good' : 'bad' }
            ]) +
            DK.verdict(
              '当前状态：<b>' + label + '</b>。' +
              (state === 'ok'
                ? 'ECD 落在窗口内，但注意<b>排量一升 ECD 就上去</b>——静止时安全不代表循环时安全。'
                : state === 'bad'
                  ? 'ECD 已经出窗，现场要么漏要么侵。<b>这就是窄窗口段最难的地方：容错只有 0.04。</b>'
                  : '余量已经小于 0.02，属于"能过但没余地"。这时应该降排量或微调密度，而不是等下一次班测。'),
              state
            ) +
            '<div class="dk-card"><h5>同一密度、不同排量</h5>' +
              PV.bars([
                ['28 L/s', 100, 'jade', (mw + 0.031).toFixed(3)],
                ['42 L/s', 100, 'clay', (mw + 0.046).toFixed(3)],
                ['60 L/s', 100, 'bad', (mw + 0.066).toFixed(3)]
              ], { w: 240, left: 56, lh: 21, max: 100, note: '右列为对应的 ECD' }) +
            '</div>' +
          '</div></div>';
      }
    });
  }

  function d5W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '机理骨架 + 软测量 + 约束推荐',
        p: '<p>密度用质量/体积直接算，ECD 用排量换算，<b>只有残差交给数据模型</b>。推荐环节限制单次调整幅度。</p>',
        svg: PV.flow([
          { tag: '01', title: '机理骨架', lines: ['质量/体积'], tone: 'opt' },
          { tag: '02', title: '残差补正', lines: ['数据模型'], tone: 'jade' },
          { tag: '03', title: '分次推荐', lines: ['限幅'], tone: 'clay' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '测量稀疏到 10000:1',
        p: '<p>循环参数每秒一个点，性能测量每 12 小时 1—2 次。<b>纯数据驱动必然过拟合</b>，必须先用机理把维度压下来。</p>',
        svg: PV.freq([
          ['循环参数', 1, 10, '1—10 s', 'jade'],
          ['性能测量', 43200, 43200, '12 h', 'clay']
        ], { w: 300, left: 72, right: 46, lh: 22 })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '每次班测都是免费校准',
        p: '<p>预测 → 班测比对 → 超阈值就校准。系统自己不产生标签，但<b>会用自己的预测去等下一次实测</b>。</p>',
        svg: PV.check([
          ['预测值已落库', 1],
          ['班测自动比对', 1],
          ['偏差超阈值触发校准', 1]
        ], { w: 300, head: 'LOOP · 闭环三件事' })
      }
    ]);
  }

  window.Cases.register({
    id: 'drill-mud',
    sceneId: 'd5',
    title: '钻井液性能智能调控',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '软测量 + 推荐', desc: '从循环参数反推性能，再推加量' },
          { label: '数据门槛', value: '班测 + 高频循环', desc: '性能测量每班只有 1—2 次' },
          { label: '收益', value: '减少井漏与过调', desc: '把"事后补救"变成"事前微调"' },
          { label: '难度', value: '中', html: K.dtag('中'), desc: '测量稀疏，需多源融合' }
        ],
        lede: '钻井液在井筒里承担三件事：压住地层、带出岩屑、冷却钻头。它的密度决定井底压力，而安全区间常常只有 0.05 g/cm³ 宽——高一点压漏地层，低一点地层流体就进来。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>井底压力由两件事决定：钻井液的**静液柱压力**，和循环时额外增加的**当量循环密度 ECD**。安全条件是三个压力排好队：孔隙压力 &lt; 液柱压力 &lt; 破裂压力。中间这段就是"密度窗口"。</p>' +
            F(d5WindowFig(), 1, '绿色带是安全窗口：下界孔隙压力，上界破裂压力。**窗口随井深变窄**——到深部余量可能只剩 0.04 g/cm³。') +
            '<p>难点在于性能不是连续测的。密度、黏度、滤失量按班测量，每 12 小时才 1—2 个点；而井下工况每几分钟就在变。</p>' +
            F(PV.trace({
              w: 620, h: 180, left: 24, right: 24, top: 28, bottom: 26,
              bands: [{ from: .62, to: .78, tone: 'bad', label: '未被测量的偏离' }],
              fn: function (u) {
                var base = .42 + Math.sin(u * 8) * .03;
                var step = Math.floor(u * 6) / 6;
                return base + (Math.abs(u - step) < .04 ? .12 : 0) +
                  (u > .62 && u < .78 ? (u - .62) * .9 : 0);
              },
              marks: [
                { at: .16, label: '班测', tone: 'jade', v: .55 },
                { at: .5, label: '班测', tone: 'jade', v: .6 }
              ],
              xlab: '时间 →', ylab: '密度'
            }), 2, '阶梯是"按班测量"的结果，平滑线是真实变化。**测量点之间那段，就是控制滞后的来源**。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>把"测不到"变成"算得出"：用高频循环参数与稀疏实验室测量训练软测量模型，再往前推一步做趋势预测。</p>' +
            F(PV.flow([
              { tag: '01 · FUSE', title: '多源融合', lines: ['循环参数 + 班测'], tone: 'gray' },
              { tag: '02 · SOFT', title: '性能软测量', lines: ['密度 / 黏度'], tone: 'opt' },
              { tag: '03 · TREND', title: '趋势预测', lines: ['未来 12 h'], tone: 'jade' },
              { tag: '04 · DOSE', title: '加量推荐', lines: ['限幅分次'], tone: 'clay' },
              { tag: '05 · VERIFY', title: '复测校准', lines: ['自动纠偏'], tone: 'kg' }
            ], { note: '软测量输出必须带置信区间，否则工程师不敢用' }), 3,
              '第 5 步不能省：**每次班测都是对软测量的一次免费校准**，这是小样本场景最划算的数据来源。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">典型"高频参数 + 稀疏标签"，两者比例可能到 10000:1。</p>' +
            K.checklist([
              ['钻井液性能测量', '密度、黏度、滤失、含砂', '每班 1—2 次'],
              ['循环与返出参数', '流量、温度、立压、池体积', '高频'],
              ['处理剂加量记录', '类型、加量、时间', '作为动作标签'],
              ['井身结构与地层压力', '套管程序、压力剖面', '用于计算窗口']
            ]) +
            F(PV.freq([
              ['循环参数', 1, 10, '1—10 s', 'jade'],
              ['池体积', 60, 300, '1—5 min', 'opt'],
              ['性能测量', 43200, 43200, '12 h', 'clay'],
              ['加量记录', 3600, 21600, '按次', 'gray']
            ], { head: 'SAMPLING · 一万个参数点，一个标签' }), 4,
              '**这类问题不要用监督学习直接做**。先用机理关系约束，再用少量测量校准。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('中') + '<span class="small muted">机理清楚、参数高频；难在测量稀疏与"过调"的振荡。</span></div>' +
            F(PV.score([
              ['数据可得性', 1, '循环参数高频'],
              ['标签稀疏度', 3, '每班 1—2 次'],
              ['闭环风险', 2, '加错剂量代价可控'],
              ['可解释性', 2, '需说明为什么加']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '风险相对可控，是钻井环节里**最适合先做闭环**的一类：加错剂量可以稀释回调，不像轨迹那样不可逆。') +
            '<p style="margin-top:14px">建议先做"软测量 + 趋势"，让工程师看到"算出来的密度和实测对得上"，再谈加量推荐。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['软测量', '多源融合', '推荐系统', '机理约束建模'], '#/method/opt')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>这个案例的 AI 份额其实很小：<b>八成工作是把机理模型搭对，两成是让残差被数据修正</b>。这是很多工业场景的真实比例。</p>' + d5W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一个窄窗口井段的钻井液调控',
        lead: [
          '目标：在密度窗口只有 0.04 g/cm³ 的井段，把**井漏次数从 3 次降到 0**，同时把处理剂加量波动压到 ±15% 以内。',
          '"波动"这个指标常被忽略，但它正是过调的直接体现。'
        ],
        stats: [['井段', '3200—4100 m'], ['窗口宽度', '0.04'], ['井漏', '3 → 0'], ['加量波动', '±15%']],
        steps: [
          PV.step('多源融合与迟到校正', '工程环节',
            '把返出参数按迟到时间对齐到井深，再把班测结果挂到对应时刻。',
            '让"测量"和"参数"落在同一时间点', '迟到时间算错，等于把标签整体平移',
            PV.io({
              in: ['流量 / 温度', '立压 / 池体积', '班测密度'],
              out: ['按井深对齐的', '参数—性能序列'],
              mid: '迟到校正', h: 132,
              note: '迟到时间 = 井深 / 返速，随排量变化'
            }),
            '这是最"土"却最关键的一步：**它错了，后面所有模型都在学错位的关系**。'),

          PV.step('性能软测量', '算法核心',
            '用机理关系做骨架，用数据模型补残差。',
            '把每班 1 个点变成每分钟 1 个点', '纯数据驱动在标签稀疏时必然过拟合',
            PV.scatter({
              pts: [
                [.2, .22], [.3, .29], [.38, .4], [.45, .43], [.52, .55],
                [.6, .58], [.68, .7], [.75, .73], [.82, .84], [.9, .88], [.96, .94]
              ],
              xlab: '实测密度', ylab: '软测量密度'
            }),
            '验收标准很朴素：**在班测点上误差要小于窗口宽度的三分之一**。否则算出来的值没有决策价值。'),

          PV.step('趋势预测', '算法核心',
            '预测未来 12 小时的密度与滤失趋势并给出区间，标出"何时会出窗口"。',
            '把控制从事后变成事前', '只报当前值，等于没有提前量',
            PV.trace({
              w: 340, h: 140, left: 12, right: 12, top: 24, bottom: 24,
              bands: [
                { from: .55, to: 1, tone: 'opt', label: '预测' },
                { from: .5, to: .6, tone: 'bad', label: '出窗' }
              ],
              fn: function (u) { return .4 + u * .34 + Math.sin(u * 6) * .02; },
              marks: [{ at: .55, label: '当前', v: .58, tone: 'jade' }]
            }),
            '关键是"出窗"那段：**模型要能提前说出"再这样下去两小时后会超破裂压力"**。'),

          PV.step('处理剂加量推荐', '效果关键',
            '按"先稀释、后加重"的顺序给出建议，并限制单次调整幅度。',
            '避免过调造成的振荡', '一次加太多，下一班又要回调，越调越乱',
            PV.bars([
              ['加重剂', 62, 'clay', '+0.02'],
              ['降滤失剂', 28, 'jade', '+0.3%'],
              ['稀释剂', 10, 'opt', '+0.1%']
            ], { w: 340, left: 84, note: '本次建议（示例）：小幅、分次' }),
            '"小幅、分次"是这类推荐系统的默认策略：**宁可两次调到位，也不要一次调过头**。'),

          PV.step('复测与模型更新', '闭环',
            '下一次班测后自动比对预测与实测，偏差超阈值就触发校准。',
            '模型随井况自动漂移', '没有闭环，软测量三个月后就不可信',
            PV.check([
              ['预测 vs 实测偏差已记录', 1],
              ['偏差超阈值触发校准', 1],
              ['加量记录已关联效果', 1],
              ['窗口余量同步更新', 1]
            ], { head: 'LOOP · 每次班测都是一次免费校准' }),
            '这类系统的寿命，取决于**它能不能自己发现"我偏了"**。')
        ],
        metrics: {
          title: '怎么算"调得稳"',
          html: '<p>不要只看"有没有漏"。要看**在窗口内待了多久**，以及**调整幅度是否收敛**。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['出窗时长', '密度落在窗口外的小时数', '0 h'],
              ['井漏次数', '井段内漏失事件', '0'],
              ['加量波动', '相邻两次调整幅度的变异系数', '±13%'],
              ['软测量误差', '班测点上的相对误差', '4.1%']
            ])
        },
        fails: [
          { name: '迟到时间错位', why: '排量变化后迟到时间随之变化。解决方向：按排量实时计算迟到时间。' },
          { name: '过调振荡', why: '一次加足剂量，下一班又回调。解决方向：限制单次调整幅度 + 分次到位。' },
          { name: '窗口用了旧数据', why: '破裂压力来自邻井或设计值，实际可能低很多。解决方向：把漏失事件作为上界修正依据。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { d5Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

})();
