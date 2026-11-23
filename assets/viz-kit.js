/* 图示页的公共脚本（window.VK）：样机、WorkBuddy 界面还原、成品墙、按 ↓ 逐步推进、课堂游戏。
   - 按键：↓ 走这一页的下一步，↑ 退一步；← → 翻页（在 deck.js 里）。空格在游戏里是“开始”。
   - 等放真实截图的位置：VK.slot('名字', '说明', 备用画面)。把图放到 img/d1/名字.jpg（或 .png）就自动换上，红色小标签消失。 */
(function () {
  'use strict';
  var VK = window.VK = {};
  var q = VK.q = function (s, r) { return (r || document).querySelector(s); }, qa = VK.qa = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var timers = [], loops = [], prevStop = window.VIZ_STOP;
  VK.later = function (f, ms) { var t = setTimeout(f, ms); timers.push(t); return t; };
  VK.every = function (f, ms) { var t = setInterval(f, ms); timers.push(t); return t; };
  VK.loop = function (f) { var o = { on: true }, last = performance.now(); loops.push(o); (function tick(now) { if (!o.on) return; f(Math.min(.034, (now - last) / 1000), now); last = now; requestAnimationFrame(tick); })(last); return o; };
  window.VIZ_STOP = function () { if (prevStop) prevStop(); timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; loops.forEach(function (o) { o.on = false; }); loops = []; window.VIZ_STEP = null; window.VIZ_ESC = null; };
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };

  /* ---------- 按 ↓ 逐步推进 ---------- */
  VK.dots = function (el, n) {                                  // 页脚中间的小圆点：这一页一共几步、走到第几步（只是提示，不能点）
    var sl = el.closest('.sl') || el, h = q('.stdots', sl); if (!h) { h = document.createElement('div'); h.className = 'stdots'; sl.appendChild(h); }
    return function (i) { var t = ''; for (var k = 0; k < n; k++) t += '<i class="' + (k <= i ? 'on' : '') + '"></i>'; h.innerHTML = t; };
  };
  VK.steps = function (el, n, render, opt) {
    opt = opt || {}; var i = opt.start || 0, dots = VK.dots(el, n);
    function show(d) { dots(i); render(i, d || 0); }
    window.VIZ_STEP = function (d) { var j = clamp(i + d, 0, n - 1); if (j === i) return false; i = j; show(d); return true; };
    show(0);
    return { go: function (j) { i = clamp(j, 0, n - 1); show(0); }, at: function () { return i; }, n: n };
  };

  /* ---------- 样机 ---------- */
  VK.lap = function (inner, w, vw, ar) { return '<div class="lap" style="--wn:' + w + (vw ? ';--vw:' + vw : '') + (ar ? ';--ar:' + ar : '') + '"><div class="lap-s"><div class="lap-c"><div class="vp">' + inner + '</div></div></div><div class="lap-b"></div></div>'; };
  VK.win = function (inner, w) { return '<div class="winf" style="--wn:' + w + '"><div class="vp">' + inner + '</div></div>'; };
  VK.pho = function (inner, w) { return '<div class="pho" style="--wn:' + w + '"><div class="pho-c"><div class="vp">' + inner + '</div></div></div>'; };
  VK.shot = function (src, fit, pos) { return '<img class="vshot' + (fit ? ' fit' : '') + '" src="' + src + '" alt=""' + (pos ? ' style="object-position:' + pos + '"' : '') + '>'; };
  VK.slot = function (name, label, fallback, quiet) { return '<div class="slot" data-slot="' + name + '">' + (fallback || '') + (quiet ? '' : '<span class="slot-t"><b>待准备 · 放真实截图</b>' + label + '<i>img/d1/' + name + '.jpg</i></span>') + '</div>'; };
  VK.fill = function (root) { qa('.slot:not(.tried)', root).forEach(function (s) { s.classList.add('tried'); var n = s.getAttribute('data-slot'), ex = ['jpg', 'png'], k = 0; (function tr() { if (k >= ex.length) return; var im = new Image(); im.onload = function () { im.className = 'slot-i'; s.appendChild(im); s.classList.add('ok'); }; im.onerror = function () { k++; tr(); }; im.src = 'img/d1/' + n + '.' + ex[k]; })(); }); };
  VK.modal = function (el, html, cap) { var sl = el.closest('.sl'), m = document.createElement('div'); m.className = 'vmod on'; m.innerHTML = '<button class="vmod-x" aria-label="关闭">×</button>' + html + (cap ? '<div class="vmod-c">' + cap + '</div>' : ''); sl.appendChild(m); VK.fill(m);
    var old = window.VIZ_ESC; function close() { m.remove(); window.VIZ_ESC = old || null; } q('.vmod-x', m).addEventListener('click', close); m.addEventListener('click', function (e) { if (e.target === m) close(); }); window.VIZ_ESC = close; return m; };

  /* ---------- WorkBuddy 界面还原 ---------- */
  var NAV = [['新建任务', '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'], ['助理', '<circle cx="12" cy="9" r="3.4"/><path d="M5 20c1-4.4 4-6 7-6s6 1.6 7 6"/>', 'BETA'], ['专家·技能·连接器', '<path d="M4 8l8-4 8 4-8 4zM4 12l8 4 8-4M4 16l8 4 8-4"/>'], ['定时任务', '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M8 3L5 5M16 3l3 2"/>'], ['资料库', '<path d="M4 5h7v14H4zM13 5h7v14h-7z"/>'], ['更多', '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>']];
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function inputBar(o) { return '<div class="bt"><b>+</b>' + (o.plan ? '<span class="wb-tag g">计划 Plan ×</span>' : '') + (o.skill ? '<span class="wb-tag">技能：' + o.skill + '</span>' : '') + '<span class="sp">' + (o.model || 'Hy4 preview') + ' ▾</span><span class="snd' + (o.prompt ? ' on' : '') + '">↑</span></div>'; }
  VK.wb = function (o) {
    o = o || {}; var tasks = o.tasks || [];
    var side = '<div class="wb-sd"><div class="wb-lg"><b>WorkBuddy<small>5.7.7</small></b><span>发现应用 ▾</span></div>' + NAV.map(function (n) { return '<div class="wb-n' + (o.nav === n[0] ? ' on' : '') + (o.hot === n[0] ? ' hot' : '') + '" data-nav="' + n[0] + '"><svg viewBox="0 0 24 24">' + n[1] + '</svg>' + n[0] + (n[2] ? '<em>' + n[2] + '</em>' : '') + '</div>'; }).join('') +
      '<div class="wb-h">任务 (' + tasks.length + ')</div>' + tasks.map(function (t, i) { return '<div class="wb-t' + (o.task === i ? ' on' : '') + '"><span>' + t + '</span></div>'; }).join('') +
      '<div class="wb-h">空间 (1)</div><div class="wb-t"><span>' + (o.ws || '我的AI工作台') + '</span><small>本地</small></div><div class="wb-ft"><img src="img/tool/wb.svg" alt=""><span>' + (o.user || '') + '</span></div></div>', main;
    if (o.html) main = o.html;
    else if (o.ms) {
      main = '<div class="wb-cv" style="--pw:' + (o.panel ? (o.pw || 470) + 'px' : '0px') + '"><div class="wb-cl"><div class="wb-ct">' + (o.title || '') + '</div><div class="wb-ms">' + o.ms.map(function (m) {
        if (m.u != null) return '<div class="wb-u">' + (m.files || []).map(function (f) { return '<span class="wb-fc">📄 ' + f + '</span>'; }).join('') + (m.files ? '<br>' : '') + esc(m.u) + '</div>';
        return '<div class="wb-a"><div class="who"><img src="img/tool/wb.svg" alt="">WorkBuddy<small>' + (m.st || '已完成 ›') + '</small></div>' + (m.steps || []).map(function (s) { return '<div class="wb-stp' + (s[0] ? ' ok' : '') + '">' + s[1] + '</div>'; }).join('') + (m.a || '') + (m.file ? '<div class="wb-fl"><i class="' + (m.file[0] === 'X' ? 'x' : '') + '">' + m.file[0] + '</i>' + m.file[1] + '<span>↗</span></div><div class="wb-lnk">查看所有产物 (1) ›　查看所有变更 ›</div>' : '') + '</div>';
      }).join('') + '</div><div class="wb-ib">今天帮你做些什么？@ 引用对话文件，/ 调用技能与指令<div class="bt"><span>Craft ▾</span><span>' + (o.model || 'Auto') + ' ▾</span><span>技能 ▾</span><span>默认权限 ▾</span></div></div></div>' +
        (o.panel ? '<div class="wb-pn"><div class="wb-ph"><b>产物</b>概览<span>' + (o.pname || '') + '</span></div><div class="wb-pb" style="--ps:' + (o.ps || .5) + '">' + o.panel + '</div></div>' : '') + '</div>';
    } else {
      main = '<div class="wb-hm"><h1>WorkBuddy, 我帮你</h1><div class="wb-sg"><span class="on">日常办公</span><span>代码开发</span><span>设计创意</span></div><div class="wb-ch"><span>文档处理</span><span>金融服务</span><span>数据分析及可视化</span><span>个人工作台</span><span>幻灯片</span></div>' +
        '<div class="wb-in">' + (o.files || []).map(function (f) { return '<span class="wb-fc" style="align-self:flex-start">📄 ' + f + '</span>'; }).join('') + (o.prompt ? '<div class="tx">' + esc(o.prompt) + '</div>' : '<div class="ph">今天帮你做些什么？@ 添加上下文，/调用技能与指令</div>') + inputBar(o) + '</div>' +
        '<div class="wb-un"><span' + (o.wsOn ? ' style="color:#111"' : '') + '>📁 ' + (o.wsOn ? '<b>' + (o.ws || '我的AI工作台') + '</b>' : '选择工作空间') + ' ▾</span><span>✓ ' + (o.perm || '默认权限') + ' ▾</span></div></div>';
    }
    return '<div class="wb' + (o.noside ? ' ns' : '') + '"><div class="wb-tb"><i></i><span>编辑(E)</span><span>窗口(W)</span><span>帮助(H)</span><span>关于(A)</span><span class="ctl"><span>─</span><span>☐</span><span>✕</span></span></div><div class="wb-m">' + side + '<div class="wb-mn">' + main + (o.over || '') + '</div></div></div>';
  };

  /* ---------- 两份真实成品（内容出自学校给的讲话稿和数据表） ---------- */
  var MAVG = VK.MAVG = [4606, 3418, 3425, 3306, 4053, 5246, 5206, 3333, 7211, 5473, 2375];
  VK.BRIEF = '<div class="pap"><div class="tt">王国胤书记在初等教育学院办学 120 周年高质量发展大会上的讲话</div><div class="mt">一页简报 · 2026 年 10 月 24 日 · 北碚校区学生活动中心 · 原文 2036 字</div>' +
    '<div class="lead" data-k="lead">120 年不是终点，是新起点：对学院未来发展提四点希望。</div><h5>四点希望</h5><div class="four" data-k="four"><div>一、坚持立德树人，擦亮百年师范底色</div><div>二、坚持守正创新，持续深化内涵建设</div><div>三、深化校地协同，拓展服务地方效能</div><div>四、凝聚校友力量，共筑发展共同体</div></div>' +
    '<h5>关键数字</h5><div class="nums" data-k="nums"><div><b>1906</b><span>官立川东师范学堂创办</span></div><div><b>25 万+</b><span>建校以来累计培养教师</span></div><div><b>5 万余</b><span>学院学子扎根讲台</span></div><div><b>20 所</b><span>全国首批小学卓越教师培养改革试点院校之一</span></div></div>' +
    '<h5>可以直接引用的原话</h5><blockquote data-k="quote">“深入推进数智化教育改革，推动人工智能等数字技术与教育教学深度融合。”<cite>原文第 14 段 · 逐字核对一致</cite></blockquote></div>';
  VK.REPORT = '<div class="pap"><div class="tt">重庆师范大学微信公众号 2026 年运营汇报</div><div class="mt">数据范围：2026 年 1 月 1 日至 11 月 13 日 · 307 篇推文 · 数字都由数据表算出</div>' +
    '<div class="nums" style="margin-top:20px"><div><b>307</b><span>篇推文</span></div><div><b>137.6 万</b><span>总阅读</span></div><div><b>4482</b><span>篇均阅读（中位数 2949）</span></div><div><b>29</b><span>篇过万（81 篇过 5000）</span></div></div>' +
    '<h5>发现一 · 9 月最高：篇均 7211</h5><div class="chart">' + MAVG.map(function (v, i) { return '<div class="' + (i === 8 ? 'hi' : '') + '" style="height:' + (v / 7211 * 100).toFixed(0) + '%"><b>' + v + '</b><span>' + (i + 1) + ' 月</span></div>'; }).join('') + '</div>' +
    '<h5>发现二 · 头部集中：阅读最高的 31 篇（10%）带来 35.4% 的阅读</h5><ol class="top5"><li><b>28798</b>21年前的今天，我们来到这里</li><li><b>26852</b>重师第十届“师德标兵”里，有你认识的老师吗？</li><li><b>25643</b>你好！新同学</li><li><b>24877</b>多少分能上重庆师范大学？</li><li><b>24533</b>如期而至！重庆柴院迎来首届新生</li></ol>' +
    '<h5>发现三 · 周日发的篇均最高（6048），周五最低（3342）</h5><span class="todo">建议部分由人来写：数字是算出来的，判断是你的</span></div>';
  VK.ROWS = [['21年前的今天，我们来到这里', '20261029', '28798'], ['重师第十届“师德标兵”里，有你认识的老师吗？', '20261004', '26852'], ['你好！新同学', '20260913', '25643'], ['多少分能上重庆师范大学？', '20260627', '24877'], ['如期而至！重庆柴院迎来首届新生', '20260916', '24533'], ['诚聘海内外优秀人才', '20260513', '22855'], ['他们从重师出发！首届优师奔赴乡村讲台', '20260921', '18568'], ['重庆师范大学2027年硕士研究生招生章程', '20261002', '17396']];
  VK.xls = function (n) { return '<div class="xls"><div class="xls-bar">重庆师范大学微信公众号数据概况（2026年1月1日至11月13日）.xls<b>开始　插入　页面布局　公式　数据</b></div><table><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr><tr class="h"><td class="r">3</td><td>序号</td><td>公众号推文标题</td><td>发表日期</td><td>阅读量</td></tr>' +
    VK.ROWS.slice(0, n || 8).map(function (r, i) { return '<tr><td class="r">' + (i + 4) + '</td><td class="n">' + (i + 1) + '</td><td>' + r[0] + '</td><td class="n">' + r[1] + '</td><td class="n">' + r[2] + '</td></tr>'; }).join('') + '<tr><td class="r">…</td><td colspan="4" style="color:#888">一共 307 行，按阅读量从高到低排</td></tr></table></div>'; };

  /* ---------- 成品墙 ---------- */
  function sp(k, c, x) { return { x: x || 0, v: 0, t: x || 0, k: k, c: c }; }
  function st(s, dt) { for (var n = 0; n < 2; n++) { var a = -s.k * (s.x - s.t) - s.c * s.v; s.v += a * dt / 2; s.x += s.v * dt / 2; } return s.x; }
  VK.wall = function (el, W, title, onOpen) {
    var sl = el.closest('.sl'); if (sl) sl.classList.add('bleed');
    var pts = []; for (var k = 0; k < 72; k++) { var th = k / 72 * 6.2832, r = 50 * (1 - .075 * (1 + Math.cos(12 * th)) / 2); pts.push((50 + r * Math.cos(th)).toFixed(1) + '% ' + (50 + r * Math.sin(th)).toFixed(1) + '%'); }
    el.innerHTML = '<div class="wl" style="--stk:polygon(' + pts.join(',') + ')"><div class="wl-hd"><span class="tag">' + title[0] + '</span><h3>' + title[1] + '</h3></div><p class="wl-tip">' + title[2] + '</p><div class="wl-sc"><i class="shf" style="top:430px"></i><i class="shf" style="top:770px"></i><div class="wl-veil"></div></div><div class="wl-ab"><button data-a="flip">翻面</button><button class="y" data-a="open">查看成果</button><button class="k" data-a="back">返回</button></div></div>';
    var wl = q('.wl', el), sc = q('.wl-sc', el), S = 240, act = null, A = [];
    W.forEach(function (w, i) {
      var per = Math.ceil(W.length / 2), col = i % per, row = (i / per) | 0, gap = (1260 - per * S) / (per - 1), x = 170 + col * (S + gap), B = row ? 772 : 432;
      var cover = '<div class="cv ' + w.cls + '"><h4>' + w.cover + '</h4>' + w.art + '</div>';
      var d = document.createElement('div'); d.className = 'alb'; d.style.cssText = 'left:' + x + 'px;top:' + (B - S) + 'px;opacity:0';
      d.innerHTML = '<i class="alb-sh"></i><div class="alb-rf">' + cover + '</div><div class="alb-b"><div class="af">' + cover + '<i class="gl"></i>' + (w.today ? '<span class="stk" style="clip-path:var(--stk)"><span>本节<br>实操</span></span>' : '') + '</div>' +
        '<div class="ab"><h4>' + w.name + '</h4><dl><dt>输入材料</dt><dd>' + w.from + '</dd><dt>任务指令</dt><dd class="q">“' + w.say + '”</dd><dt>用到的能力</dt><dd class="tg">' + w.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</dd></dl><div class="ft"><span>' + (w.today ? '本节实操案例' : '课后拓展案例') + '</span><b>0' + (i + 1) + '</b></div></div>' +
        '<i class="ae l"></i><i class="ae r"></i><i class="ae t"></i><i class="ae d"></i></div><div class="alb-go"><button data-a="open">查看成果</button><button data-a="info">详情</button></div>';
      sc.appendChild(d);
      var a = { el: d, b: q('.alb-b', d), i: i, cx: x + S / 2, cy: B - S / 2, y: sp(70, 13, -90), z: sp(70, 13), rx: sp(80, 6, 6), ry: sp(80, 8), fl: sp(42, 12.5), dx: sp(55, 13), dy: sp(55, 13), s: sp(60, 13, .7), hov: false, tx: 0, ty: 0, flip: false };
      A.push(a);
      VK.later(function () { d.style.opacity = 1; a.in = true; }, 250 + i * 95);
      d.addEventListener('pointerenter', function () { if (act) return; a.hov = true; d.classList.add('up', 'play'); });
      d.addEventListener('pointerleave', function () { a.hov = false; a.tx = a.ty = 0; if (act !== a) d.classList.remove('up', 'play'); });
      d.addEventListener('pointermove', function (e) { var r = d.getBoundingClientRect(); a.tx = ((e.clientX - r.left) / r.width - .5) * 18; a.ty = -((e.clientY - r.top) / r.height - .5) * 12; });
      d.addEventListener('click', function (e) { var k2 = e.target.getAttribute('data-a'); if (k2 === 'open') return onOpen(i); if (act === a) { a.flip = !a.flip; return; } if (!act) activate(a); });
    });
    function activate(a) { act = a; a.flip = false; wl.classList.add('has-act'); a.el.classList.add('act', 'up', 'play'); VK.later(function () { if (act === a) a.flip = true; }, 1100); window.VIZ_ESC = back; }
    function back() { if (!act) return; var a = act; act = null; a.flip = false; wl.classList.remove('has-act'); a.el.classList.remove('act'); if (!a.hov) a.el.classList.remove('up', 'play'); window.VIZ_ESC = null; }
    q('.wl-veil', el).addEventListener('click', back);
    q('.wl-ab', el).addEventListener('click', function (e) { var k2 = e.target.getAttribute('data-a'); if (!act || !k2) return; if (k2 === 'flip') act.flip = !act.flip; else if (k2 === 'open') onOpen(act.i); else back(); });
    VK.loop(function (dt, now) {
      A.forEach(function (a) {
        if (!a.in) return;
        if (act === a) { a.dx.t = 800 - a.cx; a.dy.t = 424 - a.cy; a.y.t = 0; a.z.t = 400; a.rx.t = a.ty * .4; a.ry.t = a.tx * .4; a.fl.t = a.flip ? 180 : 0; a.s.t = 1.6; }
        else if (a.hov && !act) { a.dx.t = a.dy.t = 0; a.y.t = -30; a.z.t = 72; a.rx.t = a.ty; a.ry.t = a.tx; a.fl.t = 0; a.s.t = 1; }
        else { a.dx.t = a.dy.t = 0; a.y.t = 0; a.z.t = 0; a.rx.t = 6; a.ry.t = 0; a.fl.t = 0; a.s.t = 1; }
        var ry = st(a.ry, dt) + st(a.fl, dt), rx = st(a.rx, dt);
        a.b.style.transform = 'translate3d(' + st(a.dx, dt).toFixed(2) + 'px,' + (st(a.y, dt) + st(a.dy, dt)).toFixed(2) + 'px,' + st(a.z, dt).toFixed(2) + 'px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(' + st(a.s, dt).toFixed(4) + ')';
        a.b.style.setProperty('--gx', (50 - a.ry.x * 5).toFixed(1) + '%'); a.b.style.setProperty('--h', (a.ry.x * 10 + rx * 10 + now / 30).toFixed(0));
      });
    });
  };

  /* ---------- 课堂游戏 ---------- */
  var TASKS = ['分享这节课遇到的一个问题', '用一句话总结这节课的收获', '说出最实用的一项要素', '投屏展示你的成果', '朗读一段 AI 生成的开场白', '再抽一次', '指定一位同事回答', '免答，掌声通过'];   // “小任务”转盘上的内容，可以改
  var LS = function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : +v; } catch (e) { return d; } }, LSS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var gm = null;
  function shell() { if (gm) return gm; gm = document.createElement('div'); gm.className = 'gm'; gm.innerHTML = '<div class="gm-h"></div><div class="gm-b"></div><div class="gm-f"></div>'; document.body.appendChild(gm); return gm; }
  function closeGame() { if (!gm) return; gm.classList.remove('on'); document.body.classList.remove('gaming'); if (gm._stop) gm._stop(); gm._key = null; }
  function confetti(box) { for (var i = 0; i < 70; i++) { var c = document.createElement('i'); c.className = 'cft'; c.style.cssText = 'left:' + Math.random() * 100 + '%;background:' + ['#FFC400', '#fff', '#ff5a45', '#35f29a'][i % 4] + ';animation-duration:' + (2 + Math.random() * 2.5) + 's;animation-delay:' + Math.random() * .6 + 's'; box.appendChild(c); (function (c) { setTimeout(function () { c.remove(); }, 5500); })(c); } }
  VK.game = function (kind, opt) {
    opt = opt || {}; var g = shell(), H = q('.gm-h', g), B = q('.gm-b', g), F = q('.gm-f', g); if (g._stop) g._stop(); g._stop = null;
    g.classList.add('on'); document.body.classList.add('gaming');
    if (kind === 'timer') return timer(g, H, B, F, opt);
    var mode = opt.mode || 'num', N = LS('cq-n', 30), G = LS('cq-g', 6), ang = -Math.PI / 2, spinning = false, used = {}, hist = [], raf = 0;
    H.innerHTML = '<h3>' + (opt.title || '转盘') + '</h3><button data-m="num">抽号</button><button data-m="grp">抽组</button><button data-m="task">小任务</button><button data-x="1">关闭 Esc</button>';
    B.innerHTML = '<div class="whl"><div class="whl-w"><i class="whl-p"></i><canvas width="620" height="620" style="width:min(66vh,680px);height:min(66vh,680px)"></canvas></div><div class="whl-r"><small></small><b>?</b><p></p><div class="hist"></div></div></div>';
    var cv = q('canvas', B), c = cv.getContext('2d'), out = q('.whl-r b', B), sub = q('.whl-r p', B), lab = q('.whl-r small', B);
    function items() { var a = [], i; if (mode === 'num') for (i = 1; i <= N; i++) a.push(String(i)); else if (mode === 'grp') for (i = 1; i <= G; i++) a.push('第 ' + i + ' 组'); else a = TASKS.slice(); return a; }
    function draw() { var it = items(), n = it.length, R = 310, seg = 6.2832 / n; c.clearRect(0, 0, 620, 620);
      for (var i = 0; i < n; i++) { var a0 = ang + i * seg, dead = mode !== 'task' && used[mode + i]; c.beginPath(); c.moveTo(R, R); c.arc(R, R, R, a0, a0 + seg); c.closePath(); var ci = (n % 3 === 1 && i === n - 1) ? 1 : i % 3; c.fillStyle = dead ? '#3a3a3a' : ['#FFC400', '#ffffff', '#1c1c1c'][ci]; c.fill(); c.strokeStyle = '#111'; c.lineWidth = 2; c.stroke();
        c.save(); c.translate(R, R); c.rotate(a0 + seg / 2); c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillStyle = dead ? '#777' : (ci === 2 ? '#FFC400' : '#111'); c.font = '800 ' + (mode === 'task' ? 21 : n > 24 ? 22 : n > 12 ? 30 : 38) + 'px "Inter Tight","PingFang SC","Microsoft YaHei",sans-serif'; c.fillText(it[i], R - 22, 0); c.restore(); }
      c.beginPath(); c.arc(R, R, 46, 0, 6.2832); c.fillStyle = '#111'; c.fill(); c.strokeStyle = '#FFC400'; c.lineWidth = 5; c.stroke(); }
    function foot() { F.innerHTML = '<button class="big" data-s="1">转！<kbd>空格</kbd></button>' + (mode === 'num' ? '<button data-n="-1">人数 −</button><button disabled style="opacity:.8">' + N + ' 人</button><button data-n="1">人数 +</button>' : mode === 'grp' ? '<button data-n="-1">组数 −</button><button disabled style="opacity:.8">' + G + ' 组</button><button data-n="1">组数 +</button>' : '') + '<button data-r="1">重置</button>';
      qa('.gm-h button[data-m]', g).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-m') === mode); }); lab.textContent = { num: '抽到的号码', grp: '抽到的小组', task: '你的小任务' }[mode]; q('.hist', B).innerHTML = hist.map(function (h) { return '<span>' + h + '</span>'; }).join(''); }
    function spin() { if (spinning) return; var it = items(), n = it.length, free = []; for (var i = 0; i < n; i++) if (mode === 'task' || !used[mode + i]) free.push(i); if (!free.length) { used = {}; free = it.map(function (_, i) { return i; }); }
      var pick = free[(Math.random() * free.length) | 0], seg = 6.2832 / n, target = -Math.PI / 2 - (pick + .5 + (Math.random() - .5) * .6) * seg, a0 = ang, turns = 6 + ((Math.random() * 3) | 0), a1 = target - 6.2832 * turns; while (a1 > a0 - 6.2832 * 5) a1 -= 6.2832;
      spinning = true; out.className = ''; out.textContent = '…'; sub.textContent = ''; var t0 = performance.now(), D = 6800;
      (function tick(now) { var p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 4); ang = a0 + (a1 - a0) * e; draw(); if (p < 1) { raf = requestAnimationFrame(tick); return; }
        spinning = false; ang = ang % 6.2832; if (mode !== 'task') { used[mode + pick] = 1; hist.push(it[pick]); } out.textContent = it[pick]; out.className = 'pop' + (mode === 'task' || mode === 'grp' ? ' txt' : ''); sub.textContent = opt.after || (mode === 'num' ? '请这位老师发言。已抽中的号码不再重复。' : mode === 'grp' ? '请该组推选一位代表。' : ''); draw(); foot(); confetti(B); })(t0); }
    g._stop = function () { cancelAnimationFrame(raf); spinning = false; };
    g._key = function (k) { if (k === ' ' || k === 'Enter' || k === 'ArrowDown') spin(); };
    g.onclick = function (e) { var t = e.target.closest('button'); if (!t) return; if (t.getAttribute('data-x')) return closeGame(); if (t.getAttribute('data-s')) return spin(); if (spinning) return;
      var m = t.getAttribute('data-m'), dn = t.getAttribute('data-n'); if (m) { mode = m; out.textContent = '?'; out.className = ''; sub.textContent = ''; } if (dn) { if (mode === 'num') { N = clamp(N + (+dn), 2, 60); LSS('cq-n', N); } else { G = clamp(G + (+dn), 2, 12); LSS('cq-g', G); } used = {}; hist = []; } if (t.getAttribute('data-r')) { used = {}; hist = []; out.textContent = '?'; out.className = ''; } draw(); foot(); };
    draw(); foot();
  };
  function timer(g, H, B, F, opt) {
    var total = (opt.min || 5) * 60, left = total, run = false, endAt = 0, iv = 0;
    H.innerHTML = '<h3>' + (opt.title || '计时') + '</h3><button data-x="1">关闭 Esc</button>';
    B.innerHTML = '<div class="tmr"><b></b><i><u></u></i><p></p></div>';
    var box = q('.tmr', B), d = q('b', box), bar = q('u', box), msg = q('p', box);
    function show() { var m = (left / 60) | 0, s = left % 60; d.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; bar.style.width = (left / total * 100) + '%'; box.className = 'tmr' + (left === 0 ? ' end' : left <= 60 && run ? ' warn' : ''); msg.textContent = left === 0 ? '时间到' : left <= 60 && run ? '最后一分钟' : (opt.note || ''); }
    function foot() { F.innerHTML = '<button class="big" data-s="1">' + (run ? '暂停' : left === total ? '开始' : '继续') + '<kbd>空格</kbd></button>' + [3, 5, 8, 10, 15].map(function (m) { return '<button data-min="' + m + '"' + (total === m * 60 ? ' class="on"' : '') + '>' + m + ' 分钟</button>'; }).join('') + '<button data-r="1">重置</button>'; }
    function tick() { left = Math.max(0, Math.round((endAt - Date.now()) / 1000)); show(); if (left === 0) { clearInterval(iv); run = false; foot(); confetti(B); } }
    function toggle() { if (left === 0) return; run = !run; clearInterval(iv); if (run) { endAt = Date.now() + left * 1000; iv = setInterval(tick, 250); } show(); foot(); }
    g._stop = function () { clearInterval(iv); }; g._key = function (k) { if (k === ' ' || k === 'Enter' || k === 'ArrowDown') toggle(); };
    g.onclick = function (e) { var t = e.target.closest('button'); if (!t) return; if (t.getAttribute('data-x')) return closeGame(); if (t.getAttribute('data-s')) return toggle(); var m = t.getAttribute('data-min'); if (m || t.getAttribute('data-r')) { clearInterval(iv); run = false; if (m) total = (+m) * 60; left = total; show(); foot(); } };
    show(); foot();
  }
  /* ---------- 点样机或图片：放大看；再点一下或按 Esc 关掉 ---------- */
  VK.zoom = function (node) {
    var sl = q('#slide .sl'); if (!sl) return; var k0 = sl.getBoundingClientRect().width / 1600, r = node.getBoundingClientRect(), w = r.width / k0, h = r.height / k0, k = Math.min(1420 / w, 770 / h, 4);
    var m = document.createElement('div'); m.className = 'vmod on zm'; m.innerHTML = '<div class="zm-b" style="width:' + (w * k).toFixed(0) + 'px;height:' + (h * k).toFixed(0) + 'px"><div class="zm-i" style="width:' + w.toFixed(1) + 'px;height:' + h.toFixed(1) + 'px;transform:scale(' + k.toFixed(4) + ')"></div></div>';
    var c = node.cloneNode(true); c.classList.remove('in'); c.style.cssText += ';margin:0;animation:none;transform:none;position:relative;left:auto;top:auto'; q('.zm-i', m).appendChild(c); sl.appendChild(m);
    var old = window.VIZ_ESC; function close() { m.remove(); window.VIZ_ESC = old || null; } m.addEventListener('click', function (e) { e.stopPropagation(); close(); }); window.VIZ_ESC = close;
  };
  document.addEventListener('click', function (e) { var t = e.target; if (!t.closest || t.closest('.vmod,button,a,input,.nozoom,.wl,.gm')) return; var n = t.closest('#slide .vb .lap,#slide .vb .pho,#slide .vb .zimg'); if (n) VK.zoom(n); });
  if (/[?&]prep=1/.test(location.search)) document.documentElement.classList.add('prepq');      // 地址加 ?prep=1 才显示“待准备”的红标签
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-g]'); if (!b) return; var k = b.getAttribute('data-g').split(':'); VK.game(k[0], { mode: k[1], min: +k[1] || undefined, title: b.getAttribute('data-gt') || undefined, note: b.getAttribute('data-gn') || undefined }); });
  window.addEventListener('keydown', function (e) { if (!document.body.classList.contains('gaming')) return; e.stopImmediatePropagation(); e.preventDefault(); if (e.key === 'Escape') closeGame(); else if (gm && gm._key) gm._key(e.key); }, true);
})();

/* 工牌真实效果（样式在 badge.css）：VK.badge({ w: 宽度, lany: 带挂绳, still: 不转, name: 名字, view: 屏幕内容 HTML（不给就是主页：头像、名字、Token 值） }) */
window.VK.badge = function (o) {
  o = o || {}; var w = o.w || 300;
  var home = '<div class="who"><img src="img/badge/avatar.png" alt=""><div><strong>' + (o.name || '示例学员') + '</strong><span>Token值</span><b>' + (o.token || 666) + '</b><i><u></u></i><small>/ 40000</small></div></div><div class="tiles"><span class="on">GAME<svg viewBox="0 0 24 24"><path d="M6 3l15 9-15 9z"/></svg></span><span>IMAGE<svg viewBox="0 0 24 24"><path d="M2 4h20v16H2z M5 17l5-6 4 4 2-2 3 4z"/></svg></span></div>';
  var lany = o.lany ? '<div class="lany"><i class="s1"><em>QIEMAN · CQNU AI · QIEMAN · CQNU AI · QIEMAN · CQNU AI</em></i><i class="s2"><em>CQNU AI · QIEMAN · CQNU AI · QIEMAN · CQNU AI · QIEMAN</em></i><i class="buckle"></i><i class="ring"></i><i class="hook"></i></div>' : '';
  return '<div class="bdg' + (o.still ? ' still' : '') + '" style="--bw:' + w + 'px"><div class="' + (o.lany ? 'hang' : 'hang0') + '">' + lany + '<div class="pp3"><div class="pp"><i class="ppb"></i><i class="ppe e1"></i><i class="ppe e2"></i><i class="ppe e3"></i><i class="ppe e4"></i><i class="ppe e5"></i><div class="ppf"><i class="scw a"></i><i class="scw b"></i><i class="scw c"></i><i class="scw d"></i><i class="led"></i><i class="knob"></i><i class="usb"></i><i class="wire"></i><div class="bez"><div class="scr"><div class="st"><b>' + (o.time || '09:40') + '</b><span>MON</span><em><u></u>85%</em></div><div class="vw on">' + (o.view || home) + '</div></div></div><div class="plate"><i></i><span>The Open Wearable AI Passport</span></div><i class="spk"></i></div><div class="ppg"><i class="slot"></i><i class="sbtn b1"></i><i class="sbtn b2"></i><i class="sbtn b3"></i></div></div></div></div></div>';
};
