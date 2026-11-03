/* =========================================================
   录井环节 5 个案例（m1—m5）
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
     m1 · 岩屑岩性自动识别
     ========================================================= */

  /* 图 1：从钻头到描述表的五道手 */
  function m1Loop() {
    var w = 620, h = 268, s = '', cx = 92, k;

    /* 井筒 */
    s += PV.l(cx - 9, 26, cx - 9, h - 34, { stroke: C.line2 });
    s += PV.l(cx + 9, 26, cx + 9, h - 34, { stroke: C.line2 });
    s += PV.l(cx - 2.4, 26, cx - 2.4, h - 44, { stroke: C.ink2, sw: 1.4 });
    s += PV.l(cx + 2.4, 26, cx + 2.4, h - 44, { stroke: C.ink2, sw: 1.4 });
    s += '<path d="M' + (cx - 8) + ' ' + (h - 44) + 'h16l-3 11h-10z" fill="' +
      C.clay + '" fill-opacity=".9"/>';

    for (k = 0; k < 5; k++) s += PV.up(cx + 15, 60 + k * 34, 14, C.jade);

    s += PV.t(cx, 18, '井筒', { sz: 8, a: 'middle', f: C.ink4 });
    s += PV.t(cx + 22, h - 62, '钻头破碎', { sz: 8, f: C.clay, w: 600 });
    s += PV.t(cx + 22, h - 50, '岩屑上返', { sz: 8, f: C.jade });

    /* 地面五道手 */
    [
      ['振动筛', '岩屑分离', 'gray'],
      ['捞样', '每 1—2 m', 'opt'],
      ['洗样 · 烘干', '去泥浆', 'opt'],
      ['显微镜', '目估粒级', 'clay'],
      ['描述表', '岩性 + 含油', 'jade']
    ].forEach(function (it, i) {
      var y = 34 + i * 44, x = 220, tc = PV.tone(it[2]);
      s += PV.r(x, y, 320, 34, { fill: '#fff', stroke: tc[0], so: .3, rx: 7 });
      s += PV.r(x, y, 3, 34, { fill: tc[0], rx: 1.5, fo: .9 });
      s += PV.t(x + 12, y + 15, it[0], { sz: 10, w: 600, f: C.ink });
      s += PV.t(x + 12, y + 27, it[1], { sz: 8.2, f: C.ink3 });
      if (i < 4) {
        s += PV.ar(x + 336, y + 17, x + 352, y + 17, { stroke: C.line3, h: 3.4 });
      }
    });

    s += PV.t(220, h - 14,
      '迟到时间 = 井深 / 返速：岩屑返到地面时，钻头又往下钻了几米',
      { sz: 8, f: C.ink4 });

    return PV.wrap(w, h, s, '岩屑从井底到描述表的路径');
  }

  /* 图 2：四类岩屑的形态差异 */
  function m1Grains() {
    var w = 620, h = 176, s = '', cw = (w - 32) / 4;

    [
      ['砂岩', '#c99a56', 3.4],
      ['粉砂岩', '#a3855f', 2.2],
      ['泥岩', '#6b89a3', 1.5],
      ['富有机质泥岩', '#8878ab', 1.2]
    ].forEach(function (ct, i) {
      var x = 12 + i * cw;
      s += PV.r(x, 10, cw - 10, 132, { fill: '#fdfcf9', stroke: C.line, rx: 7 });
      s += PV.t(x + 10, 28, ct[0], { sz: 9.4, w: 600, f: C.ink });

      var n = 0, y, xx;
      for (y = 40; y < 124; y += 9) {
        for (xx = x + 12; xx < x + cw - 26; xx += 9) {
          n++;
          s += PV.c(
            xx + ((n * 37) % 5) * 0.8,
            y + ((n * 53) % 4) * 0.9,
            ct[2] * (0.75 + ((n * 17) % 5) * 0.08),
            { fill: ct[1], fo: .78 }
          );
        }
      }

      s += PV.t(x + 10, 134,
        ct[2] > 3 ? '粒粗 · 好钻' : ct[2] > 2 ? '中间过渡' : '粒细 · 致密',
        { sz: 8, f: C.ink4 });
    });

    s += PV.t(w / 2, h - 8, '四类岩性的差别主要就是颗粒大小与颜色',
      { sz: 8, a: 'middle', f: C.ink4 });

    return PV.wrap(w, h, s, '四类岩屑的形态差异');
  }

  /* 示范：特征空间里的类间重叠 */
  function m1Demo(root) {
    var CLS = [
      { n: '泥岩', fx: .18, fy: .30, c: '#6b89a3' },
      { n: '粉砂岩', fx: .45, fy: .52, c: '#a3855f' },
      { n: '细砂岩', fx: .72, fy: .62, c: '#c99a56' },
      { n: '灰岩', fx: .55, fy: .85, c: '#b8c2c9' }
    ];

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

    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 特征空间',
      title: '为什么砂岩和粉砂岩总是分不开',
      desc: '每个点是一颗岩屑在特征空间的投影（横轴粒度、纵轴亮度）。光照越不稳定，点云越散，两个相邻类的重叠就越多——这时"提高模型容量"没用，该去改成像条件。',
      ctrls: [
        { k: 'illum', label: '光照波动', min: 0, max: 100, step: 5, value: 25,
          fmt: function (v) { return v + '%'; } },
        { k: 'silt', label: '粉砂岩占比', min: 10, max: 70, step: 5, value: 30,
          fmt: function (v) { return v + '%'; } }
      ],
      render: function (st) {
        var sd = 0.035 + st.illum / 100 * 0.155;

        /* 各类先验权重：随"粉砂岩占比"变化 */
        var wts = [
          1 - st.silt / 100 - 0.2,
          st.silt / 100,
          0.12,
          0.08
        ];
        var sumW = 0, i;
        for (i = 0; i < wts.length; i++) {
          if (wts[i] < 0.02) wts[i] = 0.02;
          sumW += wts[i];
        }

        /* 成对重叠 → 单类召回 */
        var rec = CLS.map(function (a, ai) {
          var r = 0.97;
          CLS.forEach(function (b, bi) {
            if (ai === bi) return;
            var dx = a.fx - b.fx, dy = a.fy - b.fy;
            var dist2 = dx * dx + dy * dy;
            var ov = Math.exp(-dist2 / (7.5 * sd * sd + 1e-6));
            r *= (1 - ov * 0.92);
          });
          return Math.max(0.18, Math.min(0.99, r));
        });

        var accSum = 0;
        for (i = 0; i < CLS.length; i++) accSum += wts[i] * rec[i];
        var acc = accSum / sumW;
        var compErr = (1 - acc) * 46;

        /* 画特征空间 */
        var SW = 340, SH = 300;
        var x0 = 34, y0 = 16, x1 = SW - 14, y1 = SH - 30;
        function X(v) { return x0 + v * (x1 - x0); }
        function Y(v) { return y1 - v * (y1 - y0); }

        var s = '';
        s += PV.r(x0, y0, x1 - x0, y1 - y0, { fill: '#fdfcf9', stroke: C.line });
        s += PV.t((x0 + x1) / 2, SH - 10, '粒度特征 →',
          { sz: 8, a: 'middle', f: C.ink4 });
        s += PV.t(4, y0 + 40, '亮', { sz: 8, f: C.ink4 });
        s += PV.t(4, y0 + 56, '度', { sz: 8, f: C.ink4 });

        CLS.forEach(function (cl, ci) {
          var rnd = seed(100 + ci * 37);
          var rad = Math.max(6, sd * (x1 - x0) * 1.6);

          /* ±1σ 圈 */
          s += PV.c(X(cl.fx), Y(cl.fy), rad,
            { stroke: cl.c, sw: 1, so: .55 });

          /* 点云 */
          for (var k = 0; k < 26; k++) {
            var px = cl.fx + gauss(rnd) * sd * 0.62;
            var py = cl.fy + gauss(rnd) * sd * 0.62;
            s += PV.c(
              X(Math.max(.02, Math.min(.98, px))),
              Y(Math.max(.02, Math.min(.98, py))),
              1.9, { fill: cl.c, fo: .62 }
            );
          }

          /* 类中心 */
          s += PV.c(X(cl.fx), Y(cl.fy), 3.4,
            { fill: cl.c, stroke: '#fff', sw: 1.2 });
          s += PV.t(X(cl.fx) + 6, Y(cl.fy) - 6, cl.n,
            { sz: 8.4, w: 600, f: C.ink3 });
        });

        /* 易混区示意线 */
        s += PV.l(X(.33), y0 + 6, X(.62), y1 - 6,
          { stroke: C.bad, so: .35, dash: '4 4' });
        s += PV.t(X(.62) + 2, y1 - 14, '易混区',
          { sz: 8, f: C.bad, w: 600, a: 'end' });

        var worst = Math.min.apply(null, rec);

        return '<div class="dk-grid">' +
          '<div class="dk-stage" style="max-width:392px">' +
            PV.wrap(SW, SH, s, '特征空间与点云') +
          '</div>' +
          '<div class="dk-side" style="min-width:0">' +
            DK.metrics([
              { l: '综合准确率', v: (acc * 100).toFixed(0), u: '%',
                cls: acc > .85 ? 'good' : acc > .7 ? 'warn' : 'bad' },
              { l: '组分误差', v: compErr.toFixed(0), u: '%',
                cls: compErr < 8 ? 'good' : 'warn' },
              { l: '点云半径 σ', v: sd.toFixed(3), u: '' },
              { l: '最差类召回', v: (worst * 100).toFixed(0), u: '%',
                cls: worst > .8 ? 'good' : worst > .6 ? 'warn' : 'bad' }
            ]) +
            DK.verdict(
              acc > .85
                ? '点云分离得开，模型够用。<b>但注意最差类召回</b>——整体准确率会把它平均掉。'
                : '相邻两类已经糊在一起。<b>这时换更大的网络没用</b>——该去做成像标准化，或者补困难样本。',
              acc > .85 ? 'ok' : acc > .7 ? 'warn' : 'bad'
            ) +
            '<div class="dk-card"><h5>各类召回</h5>' +
              PV.bars(CLS.map(function (cl, ci) {
                return [
                  cl.n,
                  Math.round(rec[ci] * 100),
                  rec[ci] > .8 ? 'jade' : rec[ci] > .6 ? 'warn' : 'bad',
                  Math.round(rec[ci] * 100) + '%'
                ];
              }), { w: 232, left: 62, lh: 21 }) +
            '</div>' +
          '</div></div>';
      }
    });
  }

  function m1W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '细粒度分类 + 多标签组分回归',
        p: '<p>两个输出头：一个判主导岩性（细粒度分类），一个出各组分比例（多标签 + 归一化约束）。</p>',
        svg: PV.flow([
          { tag: '01', title: '显微图像', lines: ['固定光照'], tone: 'gray' },
          { tag: '02', title: '细粒度分类', lines: ['注意力 + 多尺度'], tone: 'jade' },
          { tag: '03', title: '组分归一', lines: ['和 = 100%'], tone: 'clay' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '人眼在这里本来就不稳',
        p: '<p>砂岩与粉砂岩只差半个粒级，两个录井工对同一样品的一致率只有 0.72。<b>这正是算法能稳定输出的地方</b>。</p>',
        svg: PV.bars([
          ['人与人', 72, 'gray', '0.72'],
          ['人机', 89, 'jade', '0.89']
        ], { w: 300, left: 68, lh: 24, max: 100 })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '把"目估"变成"配比"',
        p: '<p>输出 70% 砂岩 + 25% 泥岩，比输出"砂岩"信息量大得多——<b>混样是常态，单标签会把它抹平</b>。</p>',
        svg: PV.stack([
          ['砂岩', 70, 'clay'],
          ['粉砂岩', 18, 'jade'],
          ['泥岩', 12, 'opt']
        ], { w: 300 })
      }
    ]);
  }

  window.Cases.register({
    id: 'mudlog-cuttings',
    sceneId: 'm1',
    title: '岩屑岩性自动识别',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '细粒度分类 + 多标签', desc: '既判类别，也估组分比例' },
          { label: '数据门槛', value: '单井 300—800 张', desc: '每类岩性 ≥ 500 张' },
          { label: '收益', value: '描述一致性', desc: '减少"不同人不同结论"' },
          { label: '难度', value: '高', html: K.dtag('高'), desc: '类间差异小，混样与污染多' }
        ],
        lede: '岩屑是钻头在井底切下来的岩石碎块，随钻井液返到地面。捞一勺、洗净、烘干、放在显微镜下看——这是录井工判断"现在钻到什么了"最直接的办法，也是整条链上最依赖眼睛的一步。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>岩屑要经过一条很长的路才能到显微镜下：从井底被切下，随泥浆上返几百到几千米，在振动筛分离，人工捞样、洗掉泥浆、烘干，最后制片观察。**每一步都会改变它**。</p>' +
            F(m1Loop(), 1, '从钻头到描述表的五道手。其中"迟到时间"决定这份岩屑对应哪个井深——**算错了，整张描述表都错位**。') +
            '<p>真正的难点不是分辨"砂岩和泥岩"，而是分辨"砂岩和粉砂岩"：颗粒只差一档，颜色几乎一样。</p>' +
            F(m1Grains(), 2, '四类岩性的差别主要是**颗粒大小与颜色**。砂岩与粉砂岩只差半个量级——这就是模型最容易错的地方。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>把识别拆成两层：先判"这张图里有哪些岩性"（多标签），再估"各占多少"（组分回归）。输出不是单一名，而是一张比例表。</p>' +
            F(PV.flow([
              { tag: '01 · IMAGE', title: '显微图像', lines: ['带标尺'], tone: 'gray' },
              { tag: '02 · SEG', title: '颗粒分割', lines: ['给粒度'], tone: 'opt' },
              { tag: '03 · CLS', title: '细粒度分类', lines: ['四类 + 概率'], tone: 'jade' },
              { tag: '04 · MIX', title: '组分回归', lines: ['和 = 100%'], tone: 'clay' },
              { tag: '05 · LOG', title: '描述表', lines: ['人工复核'], tone: 'kg' }
            ], { note: '输出"70% 砂岩 + 25% 泥岩"比输出"砂岩"更有用' }), 3,
              '第 4 步是分水岭：**约束"比例之和为 100%"**，能让模型自己纠掉一部分错误。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">"类别不均衡 + 标签噪声"的双重典型：泥岩到处都是，富有机质泥岩很少见；人工描述本身就有分歧。</p>' +
            K.checklist([
              ['岩屑显微图像', '固定光照、带标尺，单井 300—800 张', '每类 ≥ 500 张'],
              ['岩屑描述表', '井深、岩性、含油级别', '作为标签，需清洗'],
              ['洗样与混样记录', '样品处理条件', '用于分组，避免泄漏'],
              ['岩心标定', '取心段岩性', '提高标签可信度']
            ]) +
            F(PV.stack([
              ['泥岩', 52, 'opt'],
              ['砂岩', 28, 'clay'],
              ['粉砂岩', 14, 'jade'],
              ['富有机质泥岩', 6, 'nlp']
            ], { w: 620, label: '类别分布' }), 4,
              '最少的类只有 6%。**不做重采样或类别加权，模型会把富有机质泥岩整个忽略**——而它恰恰最有经济价值。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('高') + '<span class="small muted">图像任务本身不难，难在标签质量与类间差异。</span></div>' +
            F(PV.score([
              ['数据可得性', 1, '每口井都有岩屑'],
              ['标签质量', 3, '人工描述本身有分歧'],
              ['类间差异', 3, '砂岩 / 粉砂岩几乎同色'],
              ['类别均衡', 3, '最少类仅 6%']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '三项 3 格，且都是**数据问题不是模型问题**。时间应该 70% 花在采样与标注规范上。') +
            '<p style="margin-top:14px">先做"砂岩 / 泥岩"二分类，跑通再上四分类。别一上来就追求全类别。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['细粒度分类', '小样本学习', '类别不均衡', '多标签学习'], '#/method/cv')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>这个案例的难点<b>不在模型结构</b>，而在"你要它输出什么"。把单标签改成组分比例，整件事就变了。</p>' + m1W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一个区块的岩屑识别试点',
        lead: [
          '目标：把岩性描述的**人与人一致率**从 0.72 提到 0.9 以上，同时不降低薄层识别能力。',
          '"一致率"比"准确率"更适合这个任务——因为本来就没有唯一答案。'
        ],
        stats: [['样本图像', '2400 张'], ['井数', '6'], ['类别', '4'], ['目标一致率', '≥0.90']],
        steps: [
          PV.step('捞样与洗样标准化', '工程环节',
            '固定捞样间距、洗样流程与烘干条件，并记录每份样品的处理参数。',
            '让图像之间可比', '洗样不彻底，泥浆会被当成基质',
            PV.check([
              ['捞样间距统一（1—2 m）', 1],
              ['洗样流程书面化', 1],
              ['烘干温度与时间固定', 1],
              ['处理参数随样品记录', 1]
            ], { head: 'PROTOCOL · 先统一流程，再谈模型' }),
            '这一步不做，后面所有图像都在"拍不同的东西"。'),

          PV.step('图像采集与标尺', '工程环节',
            '用固定支架、固定光照、固定放大倍率拍摄，每张图带标尺。',
            '让"颗粒大小"可测量', '手持拍摄，同一岩性拍出十种样子',
            PV.compare([
              {
                tag: 'A · 随手拍', title: '光照倍率不定', tone: 'bad',
                body: function (x, y, w) {
                  return PV.r(x, y, w, 46, { rx: 4, fill: '#f2ece0' }) +
                    PV.c(x + w * .3, y + 22, 8, { fill: '#c99a56', fo: .5 }) +
                    PV.c(x + w * .6, y + 30, 5, { fill: '#a3855f', fo: .7 }) +
                    PV.t(x, y + 62, '无法比较', { sz: 8.2, f: C.bad, w: 600 });
                }
              },
              {
                tag: 'B · 固定支架', title: '可测量', tone: 'jade',
                body: function (x, y, w) {
                  return PV.r(x, y, w, 46, { rx: 4, fill: '#fdfcf9', stroke: C.line }) +
                    PV.c(x + w * .3, y + 22, 6, { fill: '#c99a56' }) +
                    PV.c(x + w * .62, y + 28, 4, { fill: '#a3855f' }) +
                    PV.l(x + w - 26, y + 8, x + w - 26, y + 38, { stroke: C.ink3 }) +
                    PV.t(x, y + 62, '可量粒度与比例', { sz: 8.2, f: C.jade, w: 600 });
                }
              }
            ], { w: 340, h: 110 }),
            '标尺不只是为了好看：**没有标尺，粒度特征就进不了模型**。'),

          PV.step('细粒度分类', '算法核心',
            '用带类别权重的卷积网络做四分类，重点看砂岩 / 粉砂岩这一对。',
            '把最容易混的一对分开', '整体准确率 0.9，但粉砂岩召回只有 0.5',
            PV.bars([
              ['泥岩', 93, 'opt', '0.93'],
              ['砂岩', 86, 'clay', '0.86'],
              ['粉砂岩', 61, 'warn', '0.61'],
              ['富有机质泥岩', 58, 'nlp', '0.58']
            ], { w: 340, left: 104, max: 100, note: '各类召回率（示例）' }),
            '整体准确率会骗人。**必须按类看召回**，否则最有价值的薄层类会被平均掉。'),

          PV.step('组分比例回归', '算法核心',
            '从分割结果估各类面积占比，约束"总和为 100%"，输出比例与区间。',
            '输出比例表而不是单一标签', '只给单一名，混样段的信息全丢',
            PV.stack([
              ['砂岩', 70, 'clay'],
              ['粉砂岩', 18, 'jade'],
              ['泥岩', 12, 'opt']
            ], { w: 340, label: '某个样品的组分估计' }),
            '混样是常态。**输出比例，才能表达"这一米有 70% 是砂岩"**。'),

          PV.step('人工复核与回流', '闭环',
            '录井工在比例表上直接改，修正结果回流；每月抽样做一致性评估。',
            '把人的经验变成标准', '只回流图像不回流理由，模型学不到"为什么"',
            PV.check([
              ['修正可追溯到人', 1],
              ['修正理由可选填', 1],
              ['每月做一致率抽检', 1],
              ['分歧样本单独归档', 1]
            ], { head: 'FEEDBACK · 分歧样本最有价值' }),
            '模型与人工分歧的那批样品，**才是下一轮最该标注的数据**。')
        ],
        metrics: {
          title: '怎么算"识别得对"',
          html: '<p>这个任务没有绝对真值，所以主指标是**一致性**，不是准确率。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['人与人一致率', '两位录井工结论相同比例', '0.72'],
              ['人机一致率', '模型与复核结论相同比例', '0.89'],
              ['粉砂岩召回', '粉砂岩被正确识别比例', '0.61'],
              ['组分误差', '比例估计平均绝对误差', '7.4%']
            ])
        },
        fails: [
          { name: '混样当成单一岩性', why: '一段样品里其实有三种岩性，模型被要求给一个答案。解决方向：改成多标签 + 比例回归。' },
          { name: '照明条件不一致', why: '不同班次对同一岩性拍出不同颜色。解决方向：固定支架 + 白平衡校准。' },
          { name: '薄层被平均掉', why: '几十厘米的薄层在一个样品里只占 5%，分类时被忽略。解决方向：看组分比例而不是类别。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { m1Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

  /* =========================================================
     m2 · 气测异常智能解释
     ========================================================= */

  function m2Rig() {
    var w = 620, h = 264, s = '', i;

    /* 地面设备链 */
    [
      ['井口返出', '钻井液 + 气体', 'gray', 24],
      ['脱气器', '搅拌脱气', 'opt', 168],
      ['色谱', 'C1—C5 组分', 'nlp', 312],
      ['记录', '全烃 + 组分', 'jade', 456]
    ].forEach(function (b, k) {
      var tc = PV.tone(b[2]);
      s += PV.r(b[3], 20, 124, 40, { fill: '#fff', stroke: tc[0], so: .3, rx: 7 });
      s += PV.t(b[3] + 10, 36, b[0], { sz: 9.4, w: 600, f: C.ink });
      s += PV.t(b[3] + 10, 50, b[1], { sz: 8, f: C.ink3 });
      if (k < 3) {
        s += PV.ar(b[3] + 126, 40, b[3] + 140, 40, { stroke: C.line3, h: 3.6 });
      }
    });

    /* 全烃曲线 */
    var x0 = 40, x1 = w - 40, y0 = 92, y1 = h - 46;
    s += PV.l(x0, y1, x1, y1, { stroke: C.line2 });
    s += PV.t(x0, y0 - 6, '全烃', { sz: 8, f: C.ink4, m: 1 });

    var pts = [];
    for (i = 0; i <= 200; i++) {
      var u = i / 200;
      var v = .12 + Math.sin(u * 34) * .02 + Math.sin(u * 9) * .02;
      if (u > .18 && u < .26) v += .55 * Math.sin((u - .18) / .08 * Math.PI);
      if (u > .42 && u < .46) v += .22;
      if (u > .58 && u < .70) v += .38 * Math.sin((u - .58) / .12 * Math.PI);
      if (u > .84 && u < .88) v += .18;
      pts.push([x0 + u * (x1 - x0), y1 - Math.min(.95, v) * (y1 - y0)]);
    }
    s += PV.path(pts, { stroke: C.ink2, sw: 1.4, join: 'round' });

    /* 四类峰标注 */
    [
      ['油气层', .22, 'jade'],
      ['接单根气', .44, 'clay'],
      ['后效气', .64, 'nlp'],
      ['背景波动', .86, 'gray']
    ].forEach(function (m) {
      var mx = x0 + m[1] * (x1 - x0), tc = PV.tone(m[2]);
      s += PV.l(mx, y0, mx, y1, { stroke: tc[0], so: .5, dash: '3 3' });
      s += PV.t(mx, y0 + 8, m[0], { sz: 8, a: 'middle', f: tc[0], w: 600 });
    });

    s += PV.t(x1, y1 + 15, '井深 / 时间 →', { sz: 8, a: 'end', f: C.ink4, m: 1 });

    return PV.wrap(w, h, s, '气测录井的地面流程与全烃曲线');
  }

  function m2Pixler() {
    var w = 620, h = 220;
    var x0 = 60, x1 = w - 120, y0 = 24, y1 = h - 34;
    var s = '';

    s += PV.r(x0, y0, x1 - x0, y1 - y0, { fill: '#fdfcf9', stroke: C.line });
    s += PV.r(x0, y1 - (y1 - y0) * .38, (x1 - x0) * .34, (y1 - y0) * .38,
      { fill: C.clayL, fo: .7 });
    s += PV.r(x0 + (x1 - x0) * .34, y0, (x1 - x0) * .30, (y1 - y0),
      { fill: C.jadeL, fo: .7 });
    s += PV.r(x0 + (x1 - x0) * .64, y1 - (y1 - y0) * .30, (x1 - x0) * .36, (y1 - y0) * .30,
      { fill: C.optL, fo: .8 });

    s += PV.t(x0 + 14, y1 - 14, '水层', { sz: 10, w: 600, f: C.opt });
    s += PV.t(x0 + (x1 - x0) * .49, y0 + 20, '气层',
      { sz: 10, w: 600, f: C.jadeD, a: 'middle' });
    s += PV.t(x1 - 14, y1 - 14, '油层',
      { sz: 10, w: 600, f: C.clayD, a: 'end' });

    [
      [.18, .2], [.24, .3], [.3, .26], [.44, .55], [.5, .62],
      [.56, .7], [.66, .78], [.74, .66], [.8, .82], [.86, .72]
    ].forEach(function (p) {
      s += PV.c(x0 + p[0] * (x1 - x0), y1 - p[1] * (y1 - y0), 3,
        { fill: C.ink2, fo: .55 });
    });

    s += PV.t((x0 + x1) / 2, h - 8, '湿度系数（C2—C5 占比）→',
      { sz: 8, a: 'middle', f: C.ink4 });
    s += PV.t(12, y0 + 40, 'C1/C2', { sz: 8, f: C.ink4, m: 1 });

    return PV.wrap(w, h, s, '组分比判别示意');
  }

  /* 示范：固定阈值 vs 分段判别 */
  function m2Demo(root) {
    var N = 210, X0 = 46;

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

    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 分段 + 判别',
      title: '四种峰，一个阈值捉不住',
      desc: '全烃曲线上的四个隆起分别来自：油气层、接单根气、后效气、薄层。把干扰强度拉大，固定阈值会把干扰也判成显示；把薄层调薄，它会被背景吞掉。',
      ctrls: [
        { k: 'interf', label: '干扰强度', min: 0, max: 120, step: 10, value: 60,
          fmt: function (v) { return v + '%'; } },
        { k: 'thin', label: '薄层幅度', min: 5, max: 60, step: 5, value: 22,
          fmt: function (v) { return v + '%'; } }
      ],
      render: function (st) {
        var rnd = seed(31), nz = [], i;
        for (i = 0; i < N; i++) nz.push(gauss(rnd));

        /* 四个峰：前两个必检（真显示），后两个是干扰 */
        var peaks = [
          { at: 46, w: 11, amp: 46, tone: 'jade', n: '油气层', real: 1 },
          { at: 92, w: 6, amp: 20 * st.interf / 60, tone: 'clay', n: '接单根气', real: 0 },
          { at: 134, w: 16, amp: 34 * st.interf / 60, tone: 'nlp', n: '后效气', real: 0 },
          { at: 168, w: 3, amp: st.thin * 0.9, tone: 'bad', n: '薄层', real: 1 }
        ];

        var sig = [];
        for (i = 0; i < N; i++) {
          var v = 3 + nz[i] * 1.2;
          peaks.forEach(function (p) {
            v += p.amp * Math.exp(-Math.pow((i - p.at) / p.w, 2));
          });
          sig.push(Math.max(0.5, v));
        }

        /* 固定阈值：前 30 点估基线 */
        var base = 0;
        for (i = 0; i < 30; i++) base += sig[i];
        base /= 30;
        var TH = base + 9;

        /* 检出段 */
        var runs = [], inRun = false, s0 = 0;
        for (i = 0; i < N; i++) {
          if (sig[i] > TH) {
            if (!inRun) { inRun = true; s0 = i; }
          } else if (inRun) {
            inRun = false;
            if (i - s0 >= 2) runs.push([s0, i - 1]);
          }
        }
        if (inRun) runs.push([s0, N - 1]);

        /* 与真峰匹配 */
        function matched(p) {
          return runs.some(function (r) {
            return p.at >= r[0] - 4 && p.at <= r[1] + 4;
          });
        }
        var hit = peaks.map(matched);
        var falseRuns = runs.filter(function (r) {
          return !peaks.some(function (p) {
            return p.at >= r[0] - 4 && p.at <= r[1] + 4;
          });
        }).length;

        var realHit = peaks.filter(function (p, k) {
          return p.real && hit[k];
        }).length;
        var realTotal = peaks.filter(function (p) { return p.real; }).length;
        var recall = realHit / realTotal;
        var thinHit = hit[3] ? 1 : 0;

        /* 画图 */
        var SW = 620, SH = 220, y0 = 26, y1 = SH - 34;
        var hi = Math.max.apply(null, sig) * 1.08;
        function XX(k) { return X0 + k / (N - 1) * (SW - X0 - 16); }
        function YY(v) { return y1 - (v / hi) * (y1 - y0); }

        var s = '';
        runs.forEach(function (r) {
          s += PV.r(XX(r[0]), y0, Math.max(2, XX(r[1]) - XX(r[0])),
            y1 - y0, { fill: C.jade, fo: .09, rx: 2 });
        });

        s += PV.l(X0, YY(TH), SW - 16, YY(TH),
          { stroke: C.bad, dash: '5 3', sw: 1.3 });
        s += PV.t(SW - 18, YY(TH) - 5, '固定阈值 ' + TH.toFixed(1),
          { sz: 8, a: 'end', f: C.bad, w: 600 });

        s += PV.path(sig.map(function (v, k) { return [XX(k), YY(v)]; }),
          { stroke: C.ink2, sw: 1.35, join: 'round' });

        peaks.forEach(function (p, k) {
          var col = hit[k] ? PV.tone(p.tone)[0] : C.ink4;
          s += PV.l(XX(p.at), y0, XX(p.at), y1,
            { stroke: col, so: .45, dash: '2 4' });
          s += PV.t(XX(p.at), y0 - 6, p.n,
            { sz: 8.2, a: 'middle', f: col, w: 600 });
          s += PV.c(XX(p.at), YY(sig[p.at]), 3, { fill: col });
        });

        s += PV.t(SW - 16, SH - 8, '井深 / 时间 →',
          { sz: 7.8, a: 'end', f: C.ink4, m: 1 });

        return '<div class="dk-grid">' +
          '<div class="dk-stage">' + PV.wrap(SW, SH, s, '全烃曲线与检出段') +
            DK.legend([
              { c: C.ink2, t: '全烃曲线' },
              { c: C.jade, t: '检出段' },
              { c: C.bad, t: '固定阈值' },
              { c: C.ink4, t: '漏检峰' }
            ]) +
          '</div>' +
          '<div class="dk-side">' +
            DK.metrics([
              { l: '显示段召回', v: (recall * 100).toFixed(0), u: '%',
                cls: recall === 1 ? 'good' : recall >= .5 ? 'warn' : 'bad' },
              { l: '薄层', v: thinHit ? '检出' : '漏检', u: '',
                cls: thinHit ? 'good' : 'bad' },
              { l: '误报段', v: falseRuns, u: '',
                cls: falseRuns ? 'warn' : 'good' },
              { l: '检出总段数', v: runs.length, u: '' }
            ]) +
            DK.verdict(
              thinHit === 0
                ? '薄层被背景吞了。<b>把"薄层幅度"拉回去看它什么时候能浮出阈值</b>——这就是为什么解释员会漏薄层。'
                : falseRuns > 0
                  ? '薄层检出了，但也把干扰判成了显示（误报 ' + falseRuns +
                    ' 段）。<b>真实场景里这部分要靠与钻时、接单根记录联动剔除</b>。'
                  : '全部命中且无误报。真实数据里很难这么干净——干扰与显示在形态上确实相似。',
              thinHit && !falseRuns ? 'ok' : 'warn'
            ) +
            '<div class="dk-card"><h5>分段结果</h5>' +
              DK.table(['段', '峰值', '判定'], runs.slice(0, 5).map(function (r, k) {
                var pk = peaks.filter(function (p) {
                  return p.at >= r[0] - 4 && p.at <= r[1] + 4;
                })[0];
                return [
                  '#' + (k + 1) + ' · ' + r[0],
                  sig[r[0]].toFixed(1),
                  { v: pk ? pk.n : '干扰', cls: pk ? 'ok' : 'bad' }
                ];
              })) +
            '</div>' +
          '</div></div>';
      }
    });
  }

  function m2W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '基线校正 + 变点分段 + 组分分类',
        p: '<p>三段式：先扣掉钻井液造成的基线漂移，再在曲线上找"段"，最后用组分比判油 / 气 / 水。</p>',
        svg: PV.flow([
          { tag: '01', title: '基线校正', lines: ['去密度影响'], tone: 'gray' },
          { tag: '02', title: '异常段检测', lines: ['形态 + 幅度'], tone: 'jade' },
          { tag: '03', title: '流体判别', lines: ['组分比'], tone: 'clay' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '四种峰长得太像',
        p: '<p>油气层、接单根气、后效气在曲线上几乎同形，人靠经验也常常判错。<b>但它们的组分比与钻时关系不同</b>——这才是可学的信号。</p>',
        svg: PV.bars([
          ['只看峰值', 58, 'bad', '58%'],
          ['峰值 + 组分比', 83, 'jade', '83%']
        ], { w: 300, left: 96, lh: 24, max: 100, note: '流体判别准确率（示例）' })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '先分段，再分类',
        p: '<p>解释的单位是"段"不是"点"。<b>分段错了，后面的组分判别再准也没用</b>。</p>',
        svg: PV.check([
          ['基线已扣除', 1],
          ['段边界已给出', 1],
          ['薄层单独统计', 1]
        ], { w: 300, head: 'ORDER · 顺序不能颠倒' })
      }
    ]);
  }

  window.Cases.register({
    id: 'mudlog-gas',
    sceneId: 'm2',
    title: '气测异常智能解释',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '序列分段 + 分类', desc: '先找异常段，再判流体性质' },
          { label: '数据门槛', value: '异常段 200—500 段', desc: '真值只能靠试油验证' },
          { label: '收益', value: '显示段不漏', desc: '薄油气层不再被背景气掩盖' },
          { label: '难度', value: '中', html: K.dtag('中'), desc: '干扰因素多，标签成本高' }
        ],
        lede: '把返出钻井液里的气体脱出来测浓度，就是气测。钻遇油气层时全烃会抬起来——但接单根、钻井液密度变化、后效气也会让它抬起来。解释的核心不是"看到峰"，而是"分清这是哪个峰"。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>气测的物理链条很短：返出钻井液 → 脱气器把溶解气搅出来 → 色谱测组分 → 记录仪画曲线。钻遇油气层时全烃明显抬升，这是发现油气最快的手段。</p>' +
            F(m2Rig(), 1, '上面是地面设备链，下面是同期的全烃曲线。**四种峰长得很像**：油气层、接单根气、后效气、背景波动。') +
            '<p>麻烦在于解释依据不是"峰有多高"，而是"峰的形态 + 组分比例 + 与钻时的关系"。人工解释要把三样放在一起看，一致性很差。</p>' +
            F(m2Pixler(), 2, '用组分比可以把油、气、水分开：**湿度系数越高越偏油，C1/C2 越高越偏气**。真实边界要用本区块试油数据标定。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>把解释拆成两步：先在曲线上找"值得解释的段"（分段），再对每段判流体性质（分类）。两步分开，比端到端更容易验证。</p>' +
            F(PV.flow([
              { tag: '01 · FIX', title: '基线校正', lines: ['扣钻井液影响'], tone: 'gray' },
              { tag: '02 · SEG', title: '异常段检测', lines: ['形态 + 幅度'], tone: 'opt' },
              { tag: '03 · FEAT', title: '组分特征', lines: ['C1/C2 · 湿度'], tone: 'jade' },
              { tag: '04 · CLS', title: '流体判别', lines: ['油 / 气 / 水'], tone: 'clay' },
              { tag: '05 · CHECK', title: '交叉验证', lines: ['测井 / 试油'], tone: 'kg' }
            ], { note: '先分段再分类：段错了，后面的分类再准也没用' }), 3,
              '第 1 步最容易被跳过：**不扣掉密度变化带来的基线漂移，后面所有阈值都是错的**。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">气测标签成本很高：一个层段到底是油是气，最终要靠试油。</p>' +
            K.checklist([
              ['气测全烃与组分', '1—5 m 一点，单井数千点', '异常段解释 200—500 段'],
              ['钻井液与工况参数', '密度、排量、钻时', '用于校正'],
              ['试油 / 生产验证', '层段与产能', '真正的标签'],
              ['录井描述', '荧光、岩屑含油', '辅助证据']
            ]) +
            F(PV.freq([
              ['色谱组分', 30, 120, '30 s—2 min', 'nlp'],
              ['全烃', 60, 300, '1—5 min', 'jade'],
              ['钻时', 300, 900, '5—15 min', 'clay'],
              ['试油结论', 2592000, 2592000, '按月', 'gray']
            ], { head: 'SAMPLING · 从 30 秒到一个月' }), 4,
              '标签的时间尺度比特征大三个数量级。**关键不是模型，而是把"层段"这个单位对齐**。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('中') + '<span class="small muted">任务清晰、数据规整；难在干扰因素与标签成本。</span></div>' +
            F(PV.score([
              ['数据可得性', 1, '气测每口井都有'],
              ['标签成本', 3, '真值靠试油'],
              ['干扰因素', 2, '接单根 / 后效 / 密度'],
              ['可解释性', 2, '需给组分依据']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '标签是最大瓶颈。**建议先用"弱标签"起步**：用测井解释结论代替试油，等样本够了再换真值。') +
            '<p style="margin-top:14px">分段用变点检测比深度网络更稳；分类用梯度提升就够，样本量撑不起大模型。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['序列分段', '基线校正', '弱标签学习', '多源融合'], '#/method/ts')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>这个案例最值钱的不是分类器，而是<b>那个把"点"变成"段"的分段步骤</b>。解释的单位错了，后面全错。</p>' + m2W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一个区块的气测解释复核',
        lead: [
          '目标：把**薄油气层（<2 m）的漏判率**从 30% 降到 10% 以下，同时不显著增加误判。',
          '薄层是最实际的痛点：它不是不存在，是被背景气盖住了。'
        ],
        stats: [['井数', '14'], ['解释段', '386'], ['薄层漏判', '30% → 10%'], ['试油验证', '42 段']],
        steps: [
          PV.step('迟到时间与基线校正', '工程环节',
            '先按排量算迟到时间，再扣掉钻井液密度变化带来的基线漂移。',
            '让曲线只反映地层', '不校正，密度一变整条曲线就整体抬高',
            PV.trace({
              w: 340, h: 140, left: 12, right: 12, top: 24, bottom: 24,
              bands: [{ from: .3, to: .62, tone: 'warn', label: '密度变化造成的假抬升' }],
              fn: function (u) {
                var v = .3 + Math.sin(u * 11) * .03;
                if (u > .3 && u < .62) v += (u - .3) * .5;
                if (u > .62) v -= (u - .62) * .45;
                return Math.max(.12, Math.min(.9, v));
              }
            }),
            '中间那段抬升不是油气显示，是**钻井液密度下调**造成的。'),

          PV.step('异常段检测', '算法核心',
            '用形态特征（上升沿、平台、衰减）+ 幅度阈值找段，而不是逐点判阈值。',
            '给出"段"而不是"点"', '逐点判阈值，一个峰会被切成几十个碎片',
            PV.trace({
              w: 340, h: 140, left: 12, right: 12, top: 24, bottom: 24,
              bands: [
                { from: .18, to: .3, tone: 'jade', label: '段 1' },
                { from: .56, to: .72, tone: 'jade', label: '段 2' }
              ],
              fn: function (u) {
                var v = .2 + Math.sin(u * 30) * .02;
                if (u > .18 && u < .3) v += .45 * Math.sin((u - .18) / .12 * Math.PI);
                if (u > .56 && u < .72) v += .32 * Math.sin((u - .56) / .16 * Math.PI);
                return v;
              }
            }),
            '解释的单位是"段"，不是"点"。**分段错了，后面的判别再准也没用**。'),

          PV.step('组分特征与流体判别', '算法核心',
            '算 C1/C2、湿度系数、平衡比，再做三分类。',
            '把"峰"翻译成"流体"', '只看全烃峰值，油和气分不开',
            PV.io({
              in: ['C1—C5 组分', '全烃峰值', '峰宽 / 衰减'],
              out: ['油层 / 气层 / 水层', '置信度'],
              mid: '组分比', h: 132,
              note: '组分比比绝对浓度更有判别力'
            }),
            '绝对浓度受钻井液影响大；**组分比才是相对稳定的判别依据**。'),

          PV.step('与测井 / 试油交叉验证', '效果关键',
            '把气测解释与测井解释、试油结论逐段比对，找出系统性分歧。',
            '知道模型在哪类层上会错', '只看总体一致率，掩盖了薄层的系统性漏判',
            PV.check([
              ['与测井不一致的段已列出', 1],
              ['与试油不一致的段已归因', 1],
              ['薄层单独统计', 1],
              ['分歧按类型归类', 1]
            ], { head: 'CROSS-CHECK · 分歧要归类，不要只计数' }),
            '分歧不是失败，是**最有价值的标注线索**。'),

          PV.step('解释结果回流', '闭环',
            '把人工复核后的段与理由回填，作为下一轮的训练样本。',
            '让模型学到"为什么"', '只回流结论不回流理由',
            PV.check([
              ['每段有结论', 1],
              ['每段有依据', 1],
              ['复核人可追溯', 1],
              ['薄层样本单独加权', 1]
            ], { head: 'FEEDBACK · 理由是更贵的标签' }),
            '在样本稀缺的任务里，**"理由"的信息量远大于"结论"**。')
        ],
        metrics: {
          title: '怎么算"解释得准"',
          html: '<p>主指标是**按段**的召回与精确率，薄层要单独统计。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['段级召回', '真实显示段中被识别的比例', '0.91'],
              ['薄层召回', '厚度 <2 m 的显示段召回', '0.88'],
              ['段级精确率', '识别出的段中真实的比例', '0.79'],
              ['流体判别准确率', '油气水三分类准确率', '0.83']
            ])
        },
        fails: [
          { name: '把接单根气当显示', why: '接单根时气体集中返出形成尖峰。解决方向：与钻时、接单根记录联动剔除。' },
          { name: '基线漂移未扣除', why: '密度调整会让全烃整体抬高。解决方向：用密度与排量做回归校正。' },
          { name: '薄层被平滑掉', why: '为抑制噪声做了强平滑，几十厘米的薄层直接消失。解决方向：分段用形态而不是幅度。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { m2Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

  /* =========================================================
     m3 · 荧光图像智能判读
     ========================================================= */

  function m3Swatch() {
    var w = 620, h = 226, s = '';

    /* 列头 */
    [1, 2, 3, 4].forEach(function (lv, i) {
      s += PV.t(136 + i * 108 + 48, 18, '荧光 ' + lv + ' 级',
        { sz: 8.4, a: 'middle', f: C.ink3, m: 1 });
    });

    /* 三行油质 × 四列级别 */
    [
      ['轻质油', '#f4e6a8', '淡黄 / 月光白'],
      ['中质油', '#e0b455', '金黄'],
      ['重质油', '#a9713c', '棕褐']
    ].forEach(function (oil, r) {
      var y = 30 + r * 62;
      s += PV.t(12, y + 26, oil[0], { sz: 9.4, w: 600, f: C.ink });
      s += PV.t(12, y + 40, oil[2], { sz: 8, f: C.ink4 });

      [1, 2, 3, 4].forEach(function (lv, i) {
        var x = 136 + i * 108;
        s += PV.r(x, y, 96, 46, {
          rx: 6,
          fill: oil[1],
          fo: .18 + lv * .2,
          stroke: C.line,
          sw: 1
        });
        s += PV.c(x + 48, y + 23, 6 + lv * 2.2,
          { fill: '#fff', fo: .35 + lv * .13 });
      });
    });

    s += PV.t(w / 2, h - 8,
      '亮度随级别升高，颜色随油质变化——**这两件事必须分开建模**',
      { sz: 8, a: 'middle', f: C.ink4 });

    return PV.wrap(w, h, s, '荧光级别与油质对照');
  }

  /* 示范：灯源功率 → 判级漂移，标准化后归位 */
  function m3Demo(root) {
    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 成像标准化',
      title: '灯越亮，判级就越高——这不是模型的问题',
      desc: '同一块样品，灯源功率一变，亮度就变，判级跟着变。左边是不做标准化的结果，右边是除以灯源系数之后的结果。这个旋钮就是"为什么先修成像，再谈算法"。',
      ctrls: [
        { k: 'lamp', label: '灯源功率', min: 60, max: 160, step: 5, value: 100,
          fmt: function (v) { return (v / 100).toFixed(2) + '×'; } },
        { k: 'level', label: '真实含油级别', min: 1, max: 4, step: 1, value: 2,
          fmt: function (v) { return v + ' 级'; } }
      ],
      render: function (st) {
        var lamp = st.lamp / 100, truth = st.level;
        var emit = truth * lamp;                       /* 测到的亮度 */
        var raw = Math.max(1, Math.min(4, Math.round(emit)));
        var norm = Math.max(1, Math.min(4, Math.round(emit / lamp)));
        var errRaw = Math.abs(raw - truth);
        var errNorm = Math.abs(norm - truth);

        /* 三档灯下的判级对照 */
        var rows = [0.6, 1.0, 1.6].map(function (lf) {
          var e = truth * lf;
          return [
            '灯 ' + lf.toFixed(1) + '×',
            Math.max(1, Math.min(4, Math.round(e))),
            Math.max(1, Math.min(4, Math.round(e / lf)))
          ];
        });

        /* 画两块视野 + 两条判级条 */
        var SW = 340, SH = 190, s = '';

        s += PV.r(16, 20, 130, 120, { rx: 8, fill: '#111', stroke: C.line2 });
        s += PV.c(81, 80, 26 + truth * 5, {
          fill: '#f4e6a8',
          fo: Math.min(.95, .18 + emit * .17)
        });
        s += PV.t(81, 154, '未标准化视野', { sz: 8.4, a: 'middle', f: C.ink3 });
        s += PV.t(81, 166, '亮度随灯变', { sz: 8, a: 'middle', f: C.bad });

        s += PV.r(190, 20, 130, 120, { rx: 8, fill: '#111', stroke: C.line2 });
        s += PV.c(255, 80, 26 + truth * 5, {
          fill: '#f4e6a8',
          fo: Math.min(.95, .18 + (emit / lamp) * .17)
        });
        s += PV.t(255, 154, '标准化后', { sz: 8.4, a: 'middle', f: C.ink3 });
        s += PV.t(255, 166, '亮度只反映含油性', { sz: 8, a: 'middle', f: C.jade });

        [
          [30, '未标准化', raw, errRaw, C.bad],
          [90, '标准化后', norm, errNorm, C.jade]
        ].forEach(function (row) {
          var x = 30, y = row[0] + 118;
          s += PV.t(x, y + 12, row[1], { sz: 8.4, f: C.ink3, w: 600 });

          for (var k = 1; k <= 4; k++) {
            var on = k <= row[2];
            s += PV.r(x + 62 + (k - 1) * 40, y, 34, 20, {
              rx: 3,
              fill: on ? row[4] : '#f5f2ea',
              fo: on ? .28 + k * .18 : 1,
              stroke: on ? row[4] : C.line2
            });
            s += PV.t(x + 62 + (k - 1) * 40 + 17, y + 14, k, {
              sz: 9, a: 'middle', m: 1,
              f: on ? row[4] : C.ink4, w: 600
            });
          }

          s += PV.t(x + 62 + 4 * 40 + 8, y + 14,
            row[2] + ' 级' + (row[3] ? '（错 ' + row[3] + '）' : ' ✓'),
            { sz: 8.4, f: row[4], w: 600 });
        });

        s += PV.t(30, SH - 4, '真实级别 = ' + truth,
          { sz: 8.4, f: C.ink2, w: 600 });

        return '<div class="dk-grid">' +
          '<div class="dk-stage">' + PV.wrap(SW, SH, s, '标准化前后') +
          '</div>' +
          '<div class="dk-side">' +
            DK.metrics([
              { l: '未标准化判级', v: raw, u: '级', cls: errRaw ? 'bad' : 'good' },
              { l: '标准化后', v: norm, u: '级', cls: errNorm ? 'warn' : 'good' },
              { l: '判级误差', v: errNorm, u: '级', cls: errNorm === 0 ? 'good' : 'bad' },
              { l: '灯源系数', v: lamp.toFixed(2), u: '×' }
            ]) +
            DK.verdict(
              errRaw > 0
                ? '灯功率 ' + lamp.toFixed(2) + '× 时，未标准化会把 ' + truth +
                  ' 级判成 <b>' + raw + ' 级</b>。<b>这不是模型不准，是模型在量"灯有多亮"</b>。'
                : '灯刚好在标定功率上，两者一致。把灯拉到 1.5× 再看——差异立刻出现。',
              errRaw > 0 ? 'bad' : 'ok'
            ) +
            '<div class="dk-card"><h5>三档灯下的判级</h5>' +
              DK.table(['灯功率', '未标准化', '标准化'], rows.map(function (r) {
                return [
                  r[0],
                  { v: r[1] + ' 级', cls: r[1] === truth ? 'ok' : 'bad' },
                  { v: r[2] + ' 级', cls: r[2] === truth ? 'ok' : 'bad' }
                ];
              })) +
            '</div>' +
          '</div></div>';
      }
    });
  }

  function m3W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '成像标准化 + 双头分类',
        p: '<p>先对图像做白平衡与曝光归一，再把"亮度 → 级别"和"色相 → 油质"拆成两个独立输出。</p>',
        svg: PV.flow([
          { tag: '01', title: '标准化', lines: ['参考色卡'], tone: 'gray' },
          { tag: '02', title: '亮→级别', lines: ['序回归'], tone: 'jade' },
          { tag: '03', title: '色→油质', lines: ['三分类'], tone: 'clay' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '干扰比信号还强',
        p: '<p>影响"亮度"的因素里，灯源、距离、曝光、湿度都比油质本身更强。<b>不控制前四项，模型学的就是灯</b>。</p>',
        svg: PV.bars([
          ['灯源功率', 82, 'bad', '强'],
          ['照射距离', 74, 'bad', '强'],
          ['油质本身', 90, 'jade', '信号']
        ], { w: 300, left: 76, lh: 22 })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '先修数据，再谈模型',
        p: '<p>除以灯源系数之后，判级误差直接归零。<b>这一步的收益，比换十个模型都大</b>。</p>',
        svg: PV.check([
          ['固定支架 + 参考色卡', 1],
          ['按灯源系数归一', 1],
          ['级别与油质分开输出', 1]
        ], { w: 300, head: 'ORDER · 先数据后算法' })
      }
    ]);
  }

  window.Cases.register({
    id: 'mudlog-fluor',
    sceneId: 'm3',
    title: '荧光图像智能判读',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '图像分类 + 序回归', desc: '级别分类 + 发光强度回归' },
          { label: '数据门槛', value: '单井 200—600 张', desc: '需按含油级别分级标注' },
          { label: '收益', value: '分级一致性', desc: '减少"同一块样品两个结论"' },
          { label: '难度', value: '中', html: K.dtag('中'), desc: '成像条件难统一，跨井迁移差' }
        ],
        lede: '紫外灯照在岩屑上，含油部分会发荧光。发什么颜色、有多亮，能大致判断油质和含油级别——这是井场上最快的一次"含油性体检"，也是主观性最强的一步。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>荧光判读看两件事：**颜色**（判断油质）和**亮度**（判断含油级别）。颜色相对客观；亮度则强烈依赖灯源功率、照射距离、曝光时间，甚至岩屑表面湿度。</p>' +
            F(m3Swatch(), 1, '同一油质下，级别越高越亮；同一级别下，油质越重颜色越深。**这是两个正交维度**，混在一起判就会出错。') +
            '<p>现场典型问题是"同一块样品，两个人给两个级别"。这不是态度问题，是光照不一致导致的可比性问题。</p>' +
            F(PV.bars([
              ['灯源功率', 82, 'bad', '强'],
              ['照射距离', 74, 'bad', '强'],
              ['曝光时间', 68, 'warn', '中'],
              ['岩屑湿度', 45, 'clay', '中'],
              ['油质本身', 90, 'jade', '真实信号']
            ], { w: 620, left: 118, note: '影响发光强度的因素排序（示意）' }), 2,
              '前四项都是"干扰"，只有最后一项是"信号"。**不控制前四项，模型学到的就是灯有多亮**。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>把任务拆成两个输出：级别分类（1—4 级）与油质分类（轻/中/重），并在成像端做标准化。</p>' +
            F(PV.flow([
              { tag: '01 · FIX', title: '成像标准化', lines: ['白平衡 / 曝光'], tone: 'gray' },
              { tag: '02 · SEG', title: '区域提取', lines: ['分离岩屑'], tone: 'opt' },
              { tag: '03 · COLOR', title: '颜色特征', lines: ['色相 / 面积'], tone: 'jade' },
              { tag: '04 · LEVEL', title: '级别 + 油质', lines: ['两个独立头'], tone: 'clay' },
              { tag: '05 · CHECK', title: '与气测对照', lines: ['交叉验证'], tone: 'kg' }
            ], { note: '级别和油质必须分成两个输出，否则模型会把"亮"当成"重"' }), 3,
              '第 1 步的价值最大也最容易被忽略：**标准化做好，问题就解决了一半**。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">荧光图像不多，但"分级"有行业口径，标注反而比岩屑好做一点。</p>' +
            K.checklist([
              ['荧光岩屑图像', '固定紫外灯源与曝光，单井 200—600 张', '按含油级别分级'],
              ['对应岩屑描述', '含油级别、油质', '作为标签'],
              ['成像参数', '灯源、距离、曝光', '必须记录，用于归一化'],
              ['试油验证', '层段产液性质', '少量真值']
            ]) +
            F(PV.stack([
              ['荧光 1 级', 34, 'gray'],
              ['荧光 2 级', 28, 'jade'],
              ['荧光 3 级', 24, 'clay'],
              ['荧光 4 级', 14, 'nlp']
            ], { w: 620, label: '级别分布（典型）' }), 4,
              '级别越高样本越少——因为好显示本来就少。**这是典型的"重要类别样本少"**。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('中') + '<span class="small muted">图像任务不难，难在成像条件与跨井可比性。</span></div>' +
            F(PV.score([
              ['数据可得性', 1, '每口井都有荧光'],
              ['成像一致性', 3, '灯源 / 距离 / 曝光'],
              ['类别均衡', 2, '高级别样本少'],
              ['可解释性', 2, '需给颜色依据']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '唯一 3 格是"成像一致性"。**这是工程问题，不是算法问题**，但决定算法上限。') +
            '<p style="margin-top:14px">先做"有显示 / 无显示"二分类，再上四级。级别边界本身有主观性，四级标签噪声会大得多。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['图像分类', '颜色特征工程', '成像标准化', '序回归'], '#/method/cv')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>如果你只想从这 10 个案例里记一件事，记这个：<b>先修数据，再谈模型</b>。这个案例里，一个除法就顶得上半年的调参。</p>' + m3W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一个井组的荧光判读标准化',
        lead: [
          '目标：把**级别判读的人机一致率**提到 0.85 以上，把 1 级与 2 级的分界误差压到半个级别以内。',
          '难度不在"分级"，在"1 级和 2 级之间那条线"。'
        ],
        stats: [['图像', '1860 张'], ['井数', '5'], ['级别', '4'], ['目标一致率', '≥0.85']],
        steps: [
          PV.step('成像标准化', '工程环节',
            '固定紫外灯源、照射距离、曝光与白平衡，每张图带参考色卡。',
            '让亮度只反映含油性', '不同班次拍的图，模型会学成"班次差异"',
            PV.compare([
              {
                tag: 'A · 现场随手拍', title: '亮度不可比', tone: 'bad',
                body: function (x, y, w) {
                  return PV.c(x + w * .35, y + 24, 18, { fill: '#e0b455', fo: .35 }) +
                    PV.c(x + w * .65, y + 30, 14, { fill: '#e0b455', fo: .85 }) +
                    PV.t(x, y + 62, '同一级别，两种亮度', { sz: 8, f: C.bad });
                }
              },
              {
                tag: 'B · 固定支架', title: '亮度可比', tone: 'jade',
                body: function (x, y, w) {
                  return PV.c(x + w * .35, y + 24, 18, { fill: '#e0b455', fo: .6 }) +
                    PV.c(x + w * .65, y + 30, 14, { fill: '#e0b455', fo: .6 }) +
                    PV.t(x, y + 62, '同一级别，同一亮度', { sz: 8, f: C.jade });
                }
              }
            ], { w: 340, h: 110 }),
            '参考色卡是关键：**它让"亮度"有了绝对参照**。'),

          PV.step('区域提取', '算法核心',
            '把岩屑从背景与泥浆里分出来，只统计岩屑表面的发光。',
            '避免背景荧光干扰', '泥浆里的油也会发光，会被误算进去',
            PV.io({
              in: ['原始图像', '参考色卡', '成像参数'],
              out: ['岩屑掩膜', '发光面积比'],
              mid: '分割', h: 132,
              note: '油基泥浆的荧光干扰要单独处理'
            }),
            '油基泥浆会让整张图发亮。**这一步不做，模型学到的是"用了什么泥浆"**。'),

          PV.step('级别分类', '算法核心',
            '把"亮度"与"颜色"解耦：亮度进级别分支，颜色进油质分支。',
            '两个维度分开建模', '一个头同时判，模型会把"亮"当成"重"',
            PV.bars([
              ['荧光 4 级', 88, 'nlp', '0.88'],
              ['荧光 3 级', 81, 'clay', '0.81'],
              ['荧光 2 级', 64, 'jade', '0.64'],
              ['荧光 1 级', 57, 'gray', '0.57']
            ], { w: 340, left: 96, max: 100, note: '各级召回（示例）' }),
            '分级任务的老规律：**极值好分，中间难分**。'),

          PV.step('与气测 / 地化交叉', '效果关键',
            '把荧光级别与气测全烃、地化指标放在一起看，找出矛盾段。',
            '用多证据压住主观性', '只看荧光，重质油会被低估',
            PV.check([
              ['荧光与气测显示一致', 1],
              ['矛盾段已单独列出', 1],
              ['重质油样本单独评估', 1],
              ['低级别段抽检', 1]
            ], { head: 'CROSS-CHECK · 矛盾段最该看' }),
            '重质油荧光弱但含油可能很高——**这是荧光判读的固有盲区**。'),

          PV.step('复核与回流', '闭环',
            '复核人给出级别与理由，分歧样本进入下一轮标注。',
            '把"边界判断"沉淀下来', '只回流级别，不回流边界依据',
            PV.check([
              ['修正含理由', 1],
              ['分歧样本单独归档', 1],
              ['每月复评一致率', 1],
              ['参考色卡定期校准', 1]
            ], { head: 'FEEDBACK · 边界样本最贵' }),
            '1 级与 2 级之间的样本，**价值是普通样本的好几倍**。')
        ],
        metrics: {
          title: '怎么算"判得稳"',
          html: '<p>主指标是**人机一致率**与**相邻级别混淆率**，不是整体准确率。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['人机一致率', '模型与复核完全相同比例', '0.86'],
              ['相邻级混淆率', '被判成相邻级别的比例', '0.21'],
              ['油质分类准确率', '轻 / 中 / 重三分类', '0.78'],
              ['重质油召回', '重质油被正确识别比例', '0.62']
            ])
        },
        fails: [
          { name: '把亮度当含油性', why: '灯更强时所有样品都更亮。解决方向：固定成像 + 参考色卡归一化。' },
          { name: '油基泥浆干扰', why: '泥浆本身发荧光，整张图变亮。解决方向：先分割岩屑，只统计掩膜内发光。' },
          { name: '重质油被低估', why: '重质油荧光弱，容易判成低级别。解决方向：油质作为单独输出。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { m3Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

  /* =========================================================
     m4 · 钻时曲线地层划分
     ========================================================= */

  function m4Track() {
    var w = 620, h = 260, x0 = 40, x1 = 300, y0 = 26, y1 = h - 34, s = '';

    s += PV.l(x0, y0, x0, y1, { stroke: C.line2 });
    s += PV.l(x0, y1, x1, y1, { stroke: C.line2 });
    s += PV.t(x0, y0 - 8, '钻时（min/m）→', { sz: 8, f: C.ink4 });

    var layers = [
      ['泥岩', .0, .26, '#6b89a3', 1],
      ['砂岩', .26, .48, '#c99a56', .55],
      ['泥岩', .48, .62, '#6b89a3', .9],
      ['粉砂岩', .62, .76, '#a3855f', .68],
      ['砂岩', .76, 1, '#c99a56', .5]
    ];

    /* 钻时曲线 */
    var pts = [], i;
    for (i = 0; i <= 160; i++) {
      var u = i / 160, v = .5;
      layers.forEach(function (L) {
        if (u >= L[1] && u < L[2]) v = L[4];
      });
      v += Math.sin(u * 90) * .03 + Math.sin(u * 31) * .02;
      pts.push([x0 + u * (x1 - x0), y0 + u * (y1 - y0)]);
    }
    s += PV.path(pts, { stroke: C.ink2, sw: 1.5, join: 'round' });

    /* 岩性柱 */
    var lx = 350, lw = 54;
    layers.forEach(function (L) {
      var ya = y0 + L[1] * (y1 - y0);
      var yb = y0 + L[2] * (y1 - y0);
      s += PV.r(lx, ya, lw, yb - ya, { fill: L[3], fo: .55, stroke: C.line });
      s += PV.t(lx + lw + 8, (ya + yb) / 2 + 3, L[0], { sz: 8.4, f: C.ink2 });
      s += PV.l(lx - 6, ya, lx, ya, { stroke: C.line3, dash: '2 3' });
    });

    s += PV.t(lx + lw / 2, y0 - 8, '岩性', { sz: 8, a: 'middle', f: C.ink4 });
    s += PV.t(lx + lw + 8, y1 + 16, '界面就是层段边界',
      { sz: 8, f: C.jadeD, w: 600 });

    return PV.wrap(w, h, s, '钻时曲线与岩性柱');
  }

  /* 示范：归一化 + 变点检测（DP） */
  function m4Demo(root) {
    var N = 200;
    var TRUE = [0, 52, 96, 140, 172, 200];
    var VALS = [1.0, 0.55, 0.9, 0.68, 0.5];

    /* 简单确定性伪随机 */
    function makeNoise(seed) {
      var r = seed | 0;
      return function () {
        r = (r * 9301 + 49297) % 233280;
        return r / 233280;
      };
    }

    /* 最优分段：候选边界每 4 点一个，DP + 惩罚项 */
    function segment(sig, beta) {
      var n = sig.length, i, k, e, st;

      var s1 = [0], s2 = [0];
      for (i = 0; i < n; i++) {
        s1.push(s1[i] + sig[i]);
        s2.push(s2[i] + sig[i] * sig[i]);
      }
      function cost(a, b) {
        var cnt = b - a;
        if (cnt <= 0) return 0;
        var su = s1[b] - s1[a];
        return s2[b] - s2[a] - su * su / cnt;
      }

      /* 候选点 */
      var pts = [];
      for (i = 0; i < n; i += 4) pts.push(i);
      if (pts[pts.length - 1] !== n) pts.push(n);
      var K = pts.length;
      var MAXS = Math.min(12, K - 1);
      var INF = 1e18;

      var dp = [], prev = [];
      for (k = 0; k <= MAXS; k++) {
        dp.push([]);
        prev.push([]);
        for (i = 0; i < K; i++) { dp[k].push(INF); prev[k].push(-1); }
      }
      dp[0][0] = 0;

      for (k = 1; k <= MAXS; k++) {
        for (e = k; e < K; e++) {
          var best = INF, bp = -1;
          for (st = k - 1; st < e; st++) {
            if (dp[k - 1][st] >= INF) continue;
            var v = dp[k - 1][st] + cost(pts[st], pts[e]) + beta;
            if (v < best) { best = v; bp = st; }
          }
          dp[k][e] = best;
          prev[k][e] = bp;
        }
      }

      var bk = 1, bv = INF;
      for (k = 1; k <= MAXS; k++) {
        if (dp[k][K - 1] < bv) { bv = dp[k][K - 1]; bk = k; }
      }

      var bounds = [], cur = K - 1, kk = bk;
      while (kk > 1 && cur > 0) {
        var p = prev[kk][cur];
        if (p <= 0) break;
        bounds.push(pts[p]);
        cur = p; kk--;
      }
      return bounds.reverse();
    }

    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 归一化 + 变点检测',
      title: '不归一化，你找到的是钻压，不是地层',
      desc: '钻时曲线随岩性变化，但也随钻压变化。关掉归一化，曲线中段会出现一个"假界面"——那不是地层，是司钻提了钻压。惩罚 β 控制层数：太小噪声变界面，太大薄层被合并。',
      ctrls: [
        { k: 'beta', label: '惩罚 β', min: 5, max: 90, step: 5, value: 30,
          fmt: function (v) { return (v / 10).toFixed(1); } },
        { k: 'norm', label: '工况归一化', type: 'tog', value: 1 },
        { k: 'opn', label: '钻压扰动', min: 0, max: 100, step: 10, value: 60,
          fmt: function (v) { return v + '%'; } }
      ],
      render: function (st) {
        var rr = makeNoise(7);
        var sig = [], i, k;

        for (i = 0; i < N; i++) {
          var li = 0;
          for (k = 0; k < TRUE.length - 1; k++) {
            if (i >= TRUE[k] && i < TRUE[k + 1]) li = k;
          }
          var v = VALS[li] + (rr() - .5) * .055;
          /* 关掉归一化时，钻压变化会让钻时整体下降 */
          if (!st.norm && i > 100) v -= st.opn / 100 * 0.34;
          sig.push(v);
        }

        var bounds = segment(sig, st.beta / 10);
        var truB = TRUE.slice(1, -1);
        var tol = 5;
        var tp = 0;

        truB.forEach(function (b) {
          if (bounds.some(function (x) { return Math.abs(x - b) <= tol; })) tp++;
        });

        var prec = bounds.length ? tp / bounds.length : 1;
        var rec = tp / truB.length;

        /* 画图 */
        var SW = 620, SH = 240, X0 = 34;
        var y0 = 22, y1 = SH - 34;
        var lo = Math.min.apply(null, sig) - .05;
        var hi = Math.max.apply(null, sig) + .05;

        function XX(idx) { return X0 + idx / (N - 1) * (SW - X0 - 60); }
        function YY(val) { return y1 - (val - lo) / (hi - lo) * (y1 - y0); }

        var s = '';
        s += PV.l(X0, y1, SW - 56, y1, { stroke: C.line2 });
        s += PV.t(X0, y0 - 4, '钻时（相对）→', { sz: 7.8, f: C.ink4 });

        truB.forEach(function (b) {
          s += PV.l(XX(b), y0, XX(b), y1,
            { stroke: C.jade, dash: '4 4', so: .55, sw: 1.2 });
          s += PV.t(XX(b) + 2, y0 + 8, '真', { sz: 7.4, f: C.jade });
        });

        bounds.forEach(function (b) {
          s += PV.l(XX(b), y0, XX(b), y1, { stroke: C.clay, sw: 1.6 });
          s += PV.t(XX(b) + 2, y1 - 6, '测', { sz: 7.4, f: C.clay });
        });

        s += PV.path(sig.map(function (val, idx) {
          return [XX(idx), YY(val)];
        }), { stroke: C.ink2, sw: 1.3, join: 'round' });

        /* 假界面提示 */
        if (!st.norm && st.opn > 0) {
          s += PV.r(XX(98), y0, XX(112) - XX(98), y1 - y0,
            { fill: C.bad, fo: .08, rx: 2 });
          s += PV.t(XX(105), y0 + 20, '假界面（钻压）',
            { sz: 8, a: 'middle', f: C.bad, w: 600 });
        }

        return '<div class="dk-grid">' +
          '<div class="dk-stage">' + PV.wrap(SW, SH, s, '钻时曲线与界面') +
            DK.legend([
              { c: C.ink2, t: '钻时曲线' },
              { c: C.jade, t: '真实界面' },
              { c: C.clay, t: '检出界面' }
            ]) +
          '</div>' +
          '<div class="dk-side">' +
            DK.metrics([
              { l: '检出界面', v: bounds.length, u: '个' },
              { l: '召回', v: (rec * 100).toFixed(0), u: '%',
                cls: rec > .9 ? 'good' : rec > .6 ? 'warn' : 'bad' },
              { l: '精确率', v: (prec * 100).toFixed(0), u: '%',
                cls: prec > .8 ? 'good' : 'warn' },
              { l: '层数', v: bounds.length + 1, u: '层' }
            ]) +
            DK.verdict(
              !st.norm
                ? '归一化关掉了：曲线中段那个台阶来自<b>钻压变化</b>，但变点检测会把它当成地层界面。这就是为什么第 2 步不能省。'
                : rec < .9
                  ? '惩罚 β 偏大，薄层被合并了。<b>往左拉一点</b>——这就是"过分割 / 欠分割"的分界。'
                  : '界面基本对齐（召回 ' + (rec * 100).toFixed(0) + '%，精确 ' +
                    (prec * 100).toFixed(0) +
                    '%）。真实场景里还要和岩屑、气测交叉验证才敢采信。',
              !st.norm || rec < .9 ? 'warn' : 'ok'
            ) +
            '<div class="dk-card"><h5>界面口径</h5>' +
              '<p style="font-size:10.6px;color:var(--ink-4);line-height:1.65">' +
              '容差 ±5 个采样点（约 ±0.5 m）。<b>分层是"界面是否落在容差内"的问题，不是逐点分类</b>。</p>' +
            '</div>' +
          '</div></div>';
      }
    });
  }

  function m4W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '工况归一化 + 最优分段',
        p: '<p>先用钻井参数把钻时折算到基准工况，再用带惩罚项的最优分段找界面。</p>',
        svg: PV.flow([
          { tag: '01', title: '迟到校正', lines: ['归位到井深'], tone: 'gray' },
          { tag: '02', title: '工况归一', lines: ['扣钻压影响'], tone: 'opt' },
          { tag: '03', title: '最优分段', lines: ['惩罚项控层数'], tone: 'jade' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '单曲线信息不够',
        p: '<p>钻时被操作参数污染，人眼分不清"岩性变了"还是"钻压变了"。<b>归一化把这两个来源分开</b>。</p>',
        svg: PV.bars([
          ['不归一化', 46, 'bad', '46%'],
          ['归一化后', 92, 'jade', '92%']
        ], { w: 300, left: 84, lh: 24, max: 100, note: '界面精确率（示例）' })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '做"提示"而不是"决定"',
        p: '<p>宁可多给候选，也不漏真界面。召回优先，人工只做删减——<b>删比补快得多</b>。</p>',
        svg: PV.check([
          ['召回 ≥ 95%', 1],
          ['候选数可控', 1],
          ['多源交叉验证', 1]
        ], { w: 300, head: 'TARGET · 提示模式的目标' })
      }
    ]);
  }

  window.Cases.register({
    id: 'mudlog-drtime',
    sceneId: 'm4',
    title: '钻时曲线地层划分',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '序列分割 / 变点检测', desc: '找界面，不是逐点分类' },
          { label: '数据门槛', value: '30—50 口井', desc: '人工划分界面作标签' },
          { label: '收益', value: '界面候选', desc: '少一次"回头重划"' },
          { label: '难度', value: '中', html: K.dtag('中'), desc: '单曲线信息少，必须多源交叉' }
        ],
        lede: '钻时是"每钻进一米花了多少分钟"。泥岩致密难钻、砂岩疏松好钻，所以钻时曲线会随岩性变化——但它同时也随钻压、转速、排量变化，这是它不能单独使用的原因。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>钻时曲线是录井里最"便宜"的一条曲线：不需要额外仪器，钻进过程自然产生。它反映岩石的**可钻性**——越难钻，钻时越大。</p>' +
            F(m4Track(), 1, '左边是钻时曲线，右边是岩性柱。**两者形状确实对应**：泥岩段钻时高，砂岩段钻时低。') +
            '<p>但钻时不是纯地层信号。钻压一提，钻时立刻下降，看起来就像"进入砂岩"。</p>' +
            F(PV.compare([
              {
                tag: 'A · 原始钻时', title: '假界面', tone: 'bad',
                body: function (x, y, w, h) {
                  var pts = [], i;
                  for (i = 0; i <= 40; i++) {
                    var u = i / 40, v = .55;
                    if (u > .45) v = .35;
                    pts.push([x + u * w, y + v * h]);
                  }
                  return PV.path(pts, { stroke: C.ink2, sw: 1.6 }) +
                    PV.l(x + .45 * w, y, x + .45 * w, y + h,
                      { stroke: C.bad, dash: '3 3' }) +
                    PV.t(x + .45 * w + 4, y + 12, '假界面',
                      { sz: 8, f: C.bad, w: 600 });
                }
              },
              {
                tag: 'B · 归一化后', title: '假界面消失', tone: 'jade',
                body: function (x, y, w, h) {
                  var pts = [], i;
                  for (i = 0; i <= 40; i++) {
                    var u = i / 40, v = .5 + Math.sin(u * 9) * .04;
                    pts.push([x + u * w, y + v * h]);
                  }
                  return PV.path(pts, { stroke: C.jade, sw: 1.6 });
                }
              }
            ], { w: 620, h: 150 }), 2,
              'A 图那个"台阶"是**钻压提高**造成的，与地层无关。归一化的目的就是把这类台阶压掉。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>把钻时归一化到统一工况后，用变点检测找界面，再和岩屑、气测、测井交叉验证。</p>' +
            F(PV.flow([
              { tag: '01 · FIX', title: '迟到校正', lines: ['归位到井深'], tone: 'gray' },
              { tag: '02 · NORM', title: '工况归一化', lines: ['扣钻压 / 转速'], tone: 'opt' },
              { tag: '03 · CPD', title: '变点检测', lines: ['滑窗 + 最优分段'], tone: 'jade' },
              { tag: '04 · CROSS', title: '多源交叉', lines: ['岩屑 / 气测'], tone: 'clay' },
              { tag: '05 · OUT', title: '界面输出', lines: ['深度 + 置信度'], tone: 'kg' }
            ], { note: '第 2 步决定上限：归一化没做好，变点检测只是在找操作痕迹' }), 3,
              '钻时是一条"被污染"的曲线。**归一化不是为了好看，是为了让变点对应地层**。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">门槛不高，但有一个硬要求：必须同时有钻时和钻井参数，否则无法归一化。</p>' +
            K.checklist([
              ['钻时曲线', '0.5—1 m 一点', '人工划分界面 30—50 口井'],
              ['钻井参数', '钻压、转速、排量', '用于归一化'],
              ['岩屑与气测', '同井段资料', '交叉验证'],
              ['测井曲线', 'GR 等', '作为独立参照']
            ]) +
            F(PV.check([
              ['钻时与井深已对齐', 1],
              ['钻压 / 转速同步记录', 1],
              ['迟到时间已校正', 1],
              ['岩屑描述覆盖同井段', 1]
            ], { head: 'REQUIRED · 缺一项就不能归一化' }), 4,
              '第三条经常被忽略：**迟到时间不对，钻时与岩屑根本不在同一个深度上**。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('中') + '<span class="small muted">方法成熟，难点在归一化与界面口径。</span></div>' +
            F(PV.score([
              ['数据可得性', 1, '钻时天然产生'],
              ['归一化难度', 2, '需钻井参数'],
              ['标签一致性', 2, '界面口径不一'],
              ['信息量', 3, '单曲线信息有限']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '唯一 3 格是"信息量"：**单靠钻时永远不够，必须多源**。这也是它适合做"辅助"而不是"替代"的原因。') +
            '<p style="margin-top:14px">定位建议：不要做"自动分层"，做"候选界面提示"。前者要求 100% 正确，后者只需要"不漏"。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['变点检测', '多源融合', '迟到时间校正', '序列分割'], '#/method/ts')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>这个案例是"<b>目标定得对，比模型选得好更重要</b>"的典型：从"自动分层"退成"候选提示"，项目立刻就能落地。</p>' + m4W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一个区块的钻时界面提示',
        lead: [
          '目标不是"自动分层"，而是**把候选界面推给解释员，漏检率低于 5%**。',
          '这个目标刻意降低了：宁可多给候选，也不能漏掉真界面。'
        ],
        stats: [['井数', '36'], ['界面', '8 个标志层'], ['漏检率', '<5%'], ['候选/井', '约 14 个']],
        steps: [
          PV.step('迟到时间校正', '工程环节',
            '把钻时按迟到时间归位到真实井深，排量变化时逐段重算。',
            '让钻时与岩屑对齐', '固定迟到时间，排量一变就整体错位',
            PV.trace({
              w: 340, h: 140, left: 12, right: 12, top: 24, bottom: 24,
              bands: [{ from: .4, to: .55, tone: 'bad', label: '错位段' }],
              fn: function (u) {
                return .45 + Math.sin(u * 14) * .05 + (u > .4 && u < .55 ? .12 : 0);
              }
            }),
            '错位段在图上表现为"钻时与岩屑对不上"。**这一步做错，后面所有界面都会偏**。'),

          PV.step('参数归一化', '算法核心',
            '用钻压、转速、排量把钻时折算到统一基准工况。',
            '把"操作变化"从曲线里去掉', '不归一化，模型会学成"钻压越高地层越砂岩"',
            PV.io({
              in: ['原始钻时', '钻压 / 转速', '排量'],
              out: ['归一化钻时', '可钻性指标'],
              mid: '折算', h: 132,
              note: '归一化后，台阶只应来自地层'
            }),
            '验收方式很直观：**同一层段在不同井上，归一化后的钻时应该接近**。'),

          PV.step('变点检测', '算法核心',
            '用滑窗均值差 + 最优分段找候选界面，惩罚项控制层数。',
            '把曲线切成层段', '惩罚太大薄层被合并；太小噪声变界面',
            PV.trace({
              w: 340, h: 140, left: 12, right: 12, top: 24, bottom: 24,
              bands: [
                { from: .22, to: .24, tone: 'jade' },
                { from: .5, to: .52, tone: 'jade' },
                { from: .74, to: .76, tone: 'jade' }
              ],
              fn: function (u) {
                var v = .4;
                if (u > .24) v = .6;
                if (u > .52) v = .36;
                if (u > .76) v = .52;
                return v + Math.sin(u * 80) * .015;
              },
              marks: [
                { at: .23, label: '界面', tone: 'jade', v: .5 },
                { at: .51, label: '界面', tone: 'jade', v: .48 }
              ]
            }),
            '三条竖线是检出的界面。**界面永远落在"均值跳变"处，不是极值点**。'),

          PV.step('多源交叉验证', '效果关键',
            '把候选界面与岩屑描述、气测异常、GR 曲线比对，剔除孤立界面。',
            '把"数学界面"变成"地质界面"', '只用钻时，孤立噪声会被当成层',
            PV.check([
              ['岩屑描述在同深度有变化', 1],
              ['气测或 GR 有响应', 1],
              ['层序与区域方案一致', 1],
              ['孤立界面已剔除', 1]
            ], { head: 'CROSS-CHECK · 四条至少满足两条' }),
            '四条全满足的界面可以直接采信；**只满足一条的要人工看**。'),

          PV.step('界面输出与回写', '闭环',
            '输出候选界面与置信度，解释员增删改后回写训练集。',
            '每口井都在改进下一口', '没有回写，模型会一直重复同样的错',
            PV.io({
              in: ['候选界面', '置信度', '交叉验证结果'],
              out: ['分层表', '采纳 / 修改记录'],
              mid: '人工确认', h: 132,
              note: '"修改"比"采纳"信息量更大'
            }),
            '解释员删掉的那个界面，**说明模型把什么当成了地层**——这是最值钱的反馈。')
        ],
        metrics: {
          title: '怎么算"提示得好"',
          html: '<p>按"界面是否落在容差内"评价，不用逐点准确率。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['界面召回', '真界面中被提示到的比例', '0.96'],
              ['界面精确率', '提示的界面中真实的比例', '0.68'],
              ['平均偏差', '命中界面的深度误差均值', '0.42 m'],
              ['每井候选数', '平均提示的界面个数', '14']
            ])
        },
        fails: [
          { name: '假界面来自操作变化', why: '钻压、转速调整在曲线上与地层变化相似。解决方向：先归一化，再检测。' },
          { name: '薄层被惩罚项合并', why: '最小层厚设得太大，几十厘米的层直接消失。解决方向：分层建模，先粗后细。' },
          { name: '迟到时间错位', why: '排量变化后迟到时间改变。解决方向：按排量逐段重算。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { m4Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

  /* =========================================================
     m5 · 录井报告自动生成
     ========================================================= */

  function m5Report() {
    var w = 620, h = 280, s = '';

    /* 左：报告纸的五块 */
    s += PV.r(30, 16, 320, 244, { fill: '#fff', stroke: C.line2, rx: 6 });
    s += PV.t(46, 36, '综合录井报告', { sz: 11, w: 600, f: C.ink });
    s += PV.l(46, 44, 334, 44, { stroke: C.line2 });

    [
      ['① 基础数据', '井号 / 井深 / 日期', 52, 30, 'gray'],
      ['② 地层分层表', '层号 / 顶底深 / 厚度', 86, 46, 'jade'],
      ['③ 油气水显示', '井段 / 级别 / 组分', 136, 40, 'clay'],
      ['④ 工况与异常', '复杂情况 / 处理', 180, 34, 'opt'],
      ['⑤ 结论与建议', '试油建议 / 风险提示', 218, 30, 'nlp']
    ].forEach(function (z) {
      var tc = PV.tone(z[4]);
      s += PV.r(46, z[2], 288, z[3],
        { fill: tc[1], fo: .55, stroke: tc[0], so: .2, rx: 4 });
      s += PV.t(54, z[2] + 14, z[0], { sz: 9, w: 600, f: tc[0] });
      s += PV.t(54, z[2] + 26, z[1], { sz: 8, f: C.ink3 });
    });

    /* 右：五张源表 */
    [
      ['钻井班报', 'gray'],
      ['录井分层表', 'jade'],
      ['气测 / 荧光', 'clay'],
      ['复杂情况台账', 'opt'],
      ['解释员判断', 'nlp']
    ].forEach(function (src, i) {
      var y = 52 + i * 44, tc = PV.tone(src[1]);
      s += PV.r(392, y, 198, 28,
        { fill: '#fff', stroke: tc[0], so: .3, rx: 6 });
      s += PV.t(402, y + 18, src[0], { sz: 8.8, f: C.ink2 });
      s += PV.ar(368, y + 14, 388, y + 14, { stroke: tc[0], h: 3.4 });
    });

    s += PV.t(w / 2, h - 6,
      '报告的每一块都由一张固定的表喂出来——这就是它能被自动生成的原因',
      { sz: 8, a: 'middle', f: C.ink4 });

    return PV.wrap(w, h, s, '录井报告的结构与数据来源');
  }

  /* 示范：槽位填充 vs 自由生成 */
  function m5Demo(root) {
    var BLOCKS = [
      {
        n: '① 基础数据',
        slots: [['井号', 'LH-38'], ['完钻井深', '4186.5 m'], ['完钻日期', '2026-09-14']]
      },
      {
        n: '② 地层分层',
        slots: [['层数', '8 层'], ['底界最深', '4186.5 m'], ['厚度合计', '4186.5 m']]
      },
      {
        n: '③ 油气显示',
        slots: [['显示段数', '6 段'], ['最高级别', '油浸'], ['全烃峰值', '38.2%']]
      },
      {
        n: '④ 工况异常',
        slots: [['复杂次数', '2 次'], ['漏失量', '18.4 m³'], ['处理方式', '桥堵']]
      },
      {
        n: '⑤ 结论建议',
        slots: [['试油层位', '3 层'], ['风险提示', '井壁稳定'], ['结论', '待试油']]
      }
    ];
    var SEEDS = [7, 13, 29, 41, 53];
    var TOT = 15;

    function seed(a) {
      return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function fakeVal(k) {
      if (/深|厚度|合计/.test(k)) return '约 4100 m';
      if (/日期/.test(k)) return '2026-09';
      if (/量|峰值/.test(k)) return '35 左右';
      if (/方式|提示|结论/.test(k)) return '按常规处理';
      return '—';
    }

    H = DK.mount(root, {
      kicker: 'INTERACTIVE · 槽位填充 + 一致性校验',
      title: '让模型自由写，还是让它只填格子',
      desc: '左边是报告骨架。数据完整度一降，就会出现缺失字段——此时若允许"自由生成"，模型会给出看起来合理但不可追溯的值。打开右下角的开关对比两种做法的代价。',
      ctrls: [
        { k: 'fill', label: '数据完整度', min: 40, max: 100, step: 5, value: 85,
          fmt: function (v) { return v + '%'; } },
        { k: 'free', label: '允许自由生成', type: 'tog', value: 0 }
      ],
      render: function (st) {
        var missing = 0, faked = 0;
        var html = '';

        BLOCKS.forEach(function (b, bi) {
          var rnd = seed(SEEDS[bi]);
          html += '<div class="dk-card" style="padding:8px 10px">' +
            '<h5>' + b.n + '</h5><div class="dk-slots">';

          b.slots.forEach(function (sl) {
            var present = rnd() * 100 < st.fill;
            if (present) {
              html += '<div class="dk-slot"><span class="k">' + sl[0] + '</span>' +
                '<span class="v ok">' + sl[1] + '</span></div>';
            } else if (st.free) {
              faked++;
              html += '<div class="dk-slot"><span class="k">' + sl[0] + '</span>' +
                '<span class="v fake">' + fakeVal(sl[0]) + ' · 不可追溯</span></div>';
            } else {
              missing++;
              html += '<div class="dk-slot"><span class="k">' + sl[0] + '</span>' +
                '<span class="v gap">待补 · 已标红</span></div>';
            }
          });

          html += '</div></div>';
        });

        var trace = st.free ? (TOT - faked) / TOT : 1;
        var dirty = st.free && faked > 0;

        return '<div class="dk-grid">' +
          '<div class="dk-stage">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
              html +
            '</div>' +
          '</div>' +
          '<div class="dk-side">' +
            DK.metrics([
              { l: '可追溯率', v: (trace * 100).toFixed(0), u: '%',
                cls: trace === 1 ? 'good' : 'bad' },
              { l: '待补字段', v: missing, u: '', cls: missing ? 'warn' : 'good' },
              { l: '编造字段', v: faked, u: '', cls: faked ? 'bad' : 'good' },
              { l: '人工复核', v: st.free ? '全部' : '仅标红', u: '' }
            ]) +
            DK.verdict(
              st.free
                ? '开了自由生成：报告读起来通顺，但有 <b>' + faked +
                  ' 个字段是编的</b>，而且<b>无法指回源表</b>。签发人要为这些数字负责。'
                : '关掉自由生成：缺失字段被标红留空。<b>报告不完整，但每个数字都能追溯</b>——这才是能签发的状态。',
              st.free ? 'bad' : 'ok'
            ) +
            '<div class="dk-card"><h5>一致性校验</h5>' +
              DK.table(null, [
                ['顶底深与分层表一致',
                  { v: dirty ? '可能不一致' : '✓', cls: dirty ? 'bad' : 'ok' }],
                ['厚度加和 = 井段长度',
                  { v: dirty ? '可能不一致' : '✓', cls: dirty ? 'bad' : 'ok' }],
                ['显示级别与峰值匹配',
                  { v: dirty ? '需人工核' : '✓', cls: dirty ? 'bad' : 'ok' }],
                ['每个数字可指回源表',
                  { v: dirty ? '否' : '✓', cls: dirty ? 'bad' : 'ok' }]
              ]) +
            '</div>' +
          '</div></div>';
      }
    });
  }

  function m5W3() {
    return PV.triptych([
      {
        k: 'WHAT · 用了什么',
        t: '要素抽取 + 槽位模板 + 校验',
        p: '<p>不做"自由写作"。数值走规则抽取，叙述走固定句式，最后跑四条机器可查的一致性规则。</p>',
        svg: PV.flow([
          { tag: '01', title: '要素抽取', lines: ['表格→字段'], tone: 'gray' },
          { tag: '02', title: '槽位填充', lines: ['固定句式'], tone: 'jade' },
          { tag: '03', title: '一致性校验', lines: ['四条规则'], tone: 'bad' }
        ], { w: 300, h: 118 })
      },
      {
        k: 'WHY · 为什么',
        t: '报告的价值在"可追溯"',
        p: '<p>一份报告要有人签字。签字的含义是"每个数字我都能指回源表"。<b>自由生成会直接摧毁这个前提</b>。</p>',
        svg: PV.bars([
          ['自由生成', 62, 'bad', '62%'],
          ['槽位填充', 100, 'jade', '100%']
        ], { w: 300, left: 84, lh: 24, max: 100, note: '可追溯率' })
      },
      {
        k: 'HOW · 怎么起作用',
        t: '把 88% 的"找和对"消掉',
        p: '<p>人工时间里只有 12% 是判断。模板 + 校验把其余 88% 消掉，<b>人只复核该看的地方</b>。</p>',
        svg: PV.stack([
          ['核对与对齐', 35, 'opt'],
          ['分层整理', 25, 'jade'],
          ['显示描述', 20, 'clay'],
          ['结论撰写', 12, 'nlp'],
          ['排版', 8, 'gray']
        ], { w: 300 })
      }
    ]);
  }

  window.Cases.register({
    id: 'mudlog-report',
    sceneId: 'm5',
    title: '录井报告自动生成',
    status: 'ready',
    version: '2.0.0',
    updated: '2026-10-24',
    tabs: {
      background: {
        label: '专业背景',
        judge: [
          { label: '任务类型', value: '信息抽取 + 模板生成', desc: '结构化数据 → 报告初稿' },
          { label: '数据门槛', value: '历史报告 100—300 份', desc: '标注要素与段落对应' },
          { label: '收益', value: '6 h → 40 min', desc: '只剩复核与签发' },
          { label: '难度', value: '中', html: K.dtag('中'), desc: '需要行业语料与可追溯性' }
        ],
        lede: '一口井打完，录井工程师要把散在十几张表里的数据汇编成一份报告。这份报告的结构其实非常固定——固定到可以拆成"数据槽位 + 句式模板"，这正是语言模型最擅长的形状。',
        sections: [
          PV.sec(1, 'PROBLEM', '当前做法与问题',
            '<p>综合录井报告不是"写作文"，而是**把数据翻译成叙述**：分层表要写成层段描述，气测异常要写成显示评价，复杂情况要写成处理过程。</p>' +
            F(m5Report(), 1, '报告的五个区块，各自对应一张固定的源表。**结构越固定，越适合自动化**——这跟"自由写作"是两件事。') +
            '<p>人工汇编的时间大部分不在"写"，而在"找"和"对"：同一个井深在三四张表里出现，数值必须一致。</p>' +
            F(PV.bars([
              ['数据核对与对齐', 35, 'opt', '35%'],
              ['分层表整理', 25, 'jade', '25%'],
              ['显示段描述', 20, 'clay', '20%'],
              ['结论撰写', 12, 'nlp', '12%'],
              ['格式排版', 8, 'gray', '8%']
            ], { w: 620, left: 128, note: '6 小时里各环节的占比（示意）' }), 2,
              '真正需要"判断"的只有结论那 12%。**其余 88% 是可以被结构化 + 模板消掉的**。')),

          PV.sec(2, 'INTERVENTION', 'AI 能做什么',
            '<p>不做"让模型写报告"，而做"让模型填槽位"：先把源数据抽成结构化要素，再按模板组装句子，最后做一致性校验。</p>' +
            F(PV.flow([
              { tag: '01 · EXTRACT', title: '要素抽取', lines: ['表格 / 文本'], tone: 'gray' },
              { tag: '02 · SLOT', title: '槽位填充', lines: ['字段对齐'], tone: 'opt' },
              { tag: '03 · TEMPLATE', title: '模板生成', lines: ['固定句式'], tone: 'jade' },
              { tag: '04 · CHECK', title: '一致性校验', lines: ['数值交叉核对'], tone: 'clay' },
              { tag: '05 · SIGN', title: '人工签发', lines: ['复核结论段'], tone: 'kg' }
            ], { note: '第 4 步是能不能上生产的关键：没有校验，生成得再顺也不敢用' }), 3,
              '把"生成"限制在槽位里，幻觉的空间就被压掉了。**可追溯比文采重要一百倍**。')),

          PV.sec(3, 'DATA', '你需要准备什么',
            '<p style="margin-bottom:14px">这类任务的数据不是"越多越好"，而是"越对齐越好"。</p>' +
            K.checklist([
              ['结构化录井数据', '分层、显示、工况记录', '无需标注'],
              ['历史报告文本', '同区块 100—300 份', '标注要素与段落对应'],
              ['报告模板与规范', '企业标准', '作为生成约束'],
              ['术语表', '地层名、工艺名', '统一口径']
            ]) +
            F(PV.freq([
              ['分层数据', 1800, 7200, '按层段', 'jade'],
              ['显示段', 600, 3600, '按段', 'clay'],
              ['工况记录', 3600, 21600, '按次', 'opt'],
              ['报告', 1728000, 1728000, '每井一份', 'gray']
            ], { head: 'SAMPLING · 一份报告吃掉几百条记录' }), 4,
              '报告的"原料"是几百条结构化记录。**先把这些记录对齐，模板才有东西可填**。')),

          PV.sec(4, 'DIFFICULTY', '技术难度与参考方向',
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:2px">' +
            K.dtag('中') + '<span class="small muted">技术难度不高，难在术语规范与责任边界。</span></div>' +
            F(PV.score([
              ['数据可得性', 2, '历史报告需整理'],
              ['术语规范', 2, '跨区块不一致'],
              ['幻觉风险', 3, '数值说错代价大'],
              ['责任边界', 3, '必须有人签发']
            ], { w: 620, left: 110, head: 'WHY HARD · 难度来自哪一项' }), 5,
              '两个 3 格都不是技术问题，是**工程与责任问题**：所以这类系统必须是"填槽 + 校验 + 签发"。') +
            '<p style="margin-top:14px">技术路线上，检索增强（RAG）比微调更合适：让模型引用具体表格与历史段落，错了能查。</p>' +
            '<p style="margin-top:18px"><span class="kicker plain" style="color:var(--ink-4)">可借鉴的通用技术</span></p>' +
            K.refs(['信息抽取', '模板化生成', '检索增强生成', '一致性校验'], '#/method/nlp')),

          PV.sec(5, 'WHAT · WHY · HOW', 'AI 方法拆解：用了什么、为什么、怎么起作用',
            '<p>这个案例值得记住的是一条边界：<b>能用规则定死的，就不要交给模型</b>。模型的价值在"从非结构化里抽取"，不在"编一个数字"。</p>' + m5W3())
        ]
      },

      workflow: {
        label: '案例流程',
        title: '案例：一个区块的报告初稿生成',
        lead: [
          '目标：把单井报告编制时间从 **6 小时压到 40 分钟**，且初稿的数值错误率为 0。',
          '"数值错误率为 0"是硬指标：报告里的井深、厚度写错，后面全部作废。'
        ],
        stats: [['历史报告', '186 份'], ['模板区块', '5'], ['工时', '6 h → 40 min'], ['数值错误', '0']],
        steps: [
          PV.step('数据源清点与对齐', '工程环节',
            '列出报告每一块对应的源表，确认字段、单位、井深口径一致。',
            '先解决"数据从哪来"', '源表口径不一致，模板填进去就是错的',
            PV.check([
              ['五个区块的源表已确定', 1],
              ['井深口径统一', 1],
              ['单位统一', 1],
              ['缺失字段有兜底', 1]
            ], { head: 'SOURCE MAP · 先画数据地图' }),
            '这一步做完，报告生成的 60% 工作量其实已经解决了。'),

          PV.step('要素抽取', '算法核心',
            '从表格与历史文本里抽出井深、层位、显示级别等要素，转成结构化字段。',
            '把"文本"变成"字段"', '直接让模型读表，数字会被读错',
            PV.io({
              in: ['分层表', '气测记录', '工况台账'],
              out: ['井深 / 层位', '显示级别', '异常类型'],
              mid: '抽取', h: 132,
              note: '数值字段一律走规则，不走模型'
            }),
            '关键原则：**数值走高置信规则，叙述走模型**。混在一起就会出"井深 3200 写成 320"这种事。'),

          PV.step('槽位与模板', '算法核心',
            '把每一段话拆成固定句式 + 槽位，模型只负责选词，不负责编数。',
            '把生成限制在可控范围', '让模型自由写，一定会写出不存在的层',
            PV.compare([
              {
                tag: 'A · 自由生成', title: '顺，但不可控', tone: 'bad',
                body: function (x, y, w) {
                  return PV.r(x, y, w, 40, { rx: 4, fill: '#fdfcf9', stroke: C.line }) +
                    PV.t(x + 8, y + 16, '本段见油气显示…', { sz: 8.2, f: C.ink3 }) +
                    PV.t(x + 8, y + 30, '（层号可能编错）', { sz: 8, f: C.bad });
                }
              },
              {
                tag: 'B · 槽位填充', title: '句式固定，可查', tone: 'jade',
                body: function (x, y, w) {
                  return PV.r(x, y, w, 40, { rx: 4, fill: '#fdfcf9', stroke: C.line }) +
                    PV.t(x + 8, y + 16, '第 {层号} 段，{顶深}—{底深}',
                      { sz: 8.2, f: C.ink3 }) +
                    PV.t(x + 8, y + 30, '见 {级别} 级荧光显示', { sz: 8.2, f: C.jade });
                }
              }
            ], { w: 340, h: 110 }),
            '代价是文字略"模板化"，**换来的是每个数字都能追溯**。这笔交易很划算。'),

          PV.step('一致性校验', '效果关键',
            '跨区块核对：井深与分层表一致、厚度加和等于井段、显示级别与气测峰值匹配。',
            '把错误挡在签发之前', '不校验，模型会把"看起来对"的错误送出去',
            PV.check([
              ['顶底深与分层表一致', 1, '✓'],
              ['厚度加和 = 井段长度', 1, '✓'],
              ['显示级别与峰值匹配', 1, '✓'],
              ['层序与区域方案一致', 1, '✓']
            ], { head: 'VALIDATION · 四条机器可查的规则', note: '任意一条不过，报告标红不签发' }),
            '这四条规则不需要 AI，但**没有它们，AI 生成的报告没人敢签**。'),

          PV.step('人工签发与回流', '闭环',
            '解释员只复核结论段与标红项，签发后把修改回填为模板改进依据。',
            '把人的判断留在最后一环', '让人从头读一遍，等于没省时间',
            PV.io({
              in: ['初稿', '标红项', '源数据引用'],
              out: ['签发版', '修改记录'],
              mid: '复核 40 min', h: 132,
              note: '只让人看"需要判断"的部分'
            }),
            '复核从 6 小时降到 40 分钟的关键，不是生成快，而是**人只需要看该看的地方**。')
        ],
        metrics: {
          title: '怎么算"生成得对"',
          html: '<p>分两类指标：**数值类必须零错**，叙述类看人工修改率。</p>' +
            K.dtable(['指标', '定义', '本例取值'], [
              ['数值错误率', '井深 / 厚度 / 级别写错比例', '0'],
              ['段落采纳率', '初稿段落未被修改的比例', '0.74'],
              ['编制工时', '从数据齐备到签发', '40 min'],
              ['可追溯率', '每个数字都能指回源表', '100%']
            ])
        },
        fails: [
          { name: '数值被模型改写', why: '让模型自由生成时会把 3200 m 写成 320 m。解决方向：数值走规则，模型只填槽位。' },
          { name: '术语跨区块不一致', why: '同一层在不同区块叫法不同。解决方向：维护术语表 + 按区块切模板。' },
          { name: '缺数据时编造', why: '源表缺字段时模型会"补一个合理的值"。解决方向：缺失即留空并标红，不允许补。' }
        ]
      },

      demo: {
        label: '可运行示范',
        mount: function (root) { m5Demo(root); },
        unmount: function () { if (H) { H.unmount(); H = null; } }
      }
    }
  });

})();
