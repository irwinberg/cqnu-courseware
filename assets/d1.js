/* 第 1 天课件的脚本：翻页、成品墙、几个原理的交互。数据都在最上面，改内容先看这里。
   讲话稿原文取自学校给的《王书记在初等教育学院办学120周年高质量发展大会上的讲话》；公众号的数字由学校给的数据表（2026.1.1–11.13，307 篇）算出。 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 成品：一页简报（内容全部来自讲话稿原文） ---------- */
  var BRIEF = '<div class="pap"><div class="tt">王国胤书记在初等教育学院办学 120 周年高质量发展大会上的讲话</div>' +
    '<div class="mt">一页简报 · 2026 年 10 月 24 日 · 北碚校区学生活动中心 · 原文 2036 字</div>' +
    '<div class="lead" data-k="lead">120 年不是终点，是新起点：对学院未来发展提四点希望。</div>' +
    '<h4>四点希望</h4><div class="four" data-k="four"><div>一、坚持立德树人，擦亮百年师范底色</div><div>二、坚持守正创新，持续深化内涵建设</div><div>三、深化校地协同，拓展服务地方效能</div><div>四、凝聚校友力量，共筑发展共同体</div></div>' +
    '<h4>关键数字</h4><div class="nums" data-k="nums"><div><b>1906</b><span>官立川东师范学堂创办</span></div><div><b>25 万+</b><span>建校以来累计培养教师</span></div><div><b>5 万余</b><span>学院学子扎根讲台</span></div><div><b>20 所</b><span>全国首批小学卓越教师培养改革试点院校之一</span></div></div>' +
    '<h4>可以直接引用的原话</h4><blockquote data-k="quote">“深入推进数智化教育改革，推动人工智能等数字技术与教育教学深度融合。”<cite>原文第 14 段 · 逐字核对一致</cite></blockquote></div>';
  /* 原文节选：一字不改。第 12 段的“廿”在电子稿里带注音 */
  var SRC = [
    ['nums', '重庆师范大学1954年建校，办学历史可追溯至<mark>1906年</mark>创办的官立川东师范学堂。……建校以来，已累计培养<mark>超过25万名教师</mark>，为国家和区域教育事业发展作出重要贡献。'],
    ['nums', '……学院<mark>五万余名学子</mark>扎根巴渝大地三尺讲台，把教育理想播撒到城乡小学的各个角落，这是学院最厚重、最实在的办学成果。'],
    ['nums', '……学院入选教育部首批<mark>全国20个</mark>小学卓越教师培养改革试点院校之一，探索出一条具有重庆辨识度的小学教师培养路径……'],
    ['lead trap', '今天的大会，既是回望120年办学历史的大会，更是立足当下、谋划未来高质量发展的推进会。<mark>百<span class="tr">廿</span>不是终点，而是学院迈向新发展阶段的全新起点。</mark>借此机会，我代表学校党委，对初等教育学院未来发展提四点希望：'],
    ['four', '<mark>一要坚持立德树人，擦亮百年师范底色。</mark>传承120年积淀的师道精神，把红色校史、师范文化深度融入人才培养全过程……'],
    ['four quote', '<mark>二要坚持守正创新，持续深化内涵建设。</mark>……<span class="q">深入推进数智化教育改革，推动人工智能等数字技术与教育教学深度融合</span>，持续优化人才培养模式……'],
    ['four', '<mark>三要深化校地协同，拓展服务地方效能。</mark>持续深化与北碚区以及全市各区县教育部门、小学的联动合作……'],
    ['four', '<mark>四要凝聚校友力量，共筑发展共同体。</mark>持续完善校友联络服务体系，搭建交流合作平台……']
  ];
  /* ---------- 成品：公众号运营汇报（数字由数据表算出） ---------- */
  var MAVG = [4606, 3418, 3425, 3306, 4053, 5246, 5206, 3333, 7211, 5473, 2375];
  var REPORT = '<div class="pap"><div class="tt">重庆师范大学微信公众号 2026 年运营汇报</div><div class="mt">数据范围：2026 年 1 月 1 日至 11 月 13 日 · 307 篇推文 · 结论后面的数字都由数据表算出</div>' +
    '<div class="nums" style="margin-top:22px"><div><b>307</b><span>篇推文</span></div><div><b>137.6 万</b><span>总阅读</span></div><div><b>4482</b><span>篇均阅读（中位数 2949）</span></div><div><b>29</b><span>篇过万（81 篇过 5000）</span></div></div>' +
    '<h4>发现一 · 9 月最高：篇均 7211</h4><div class="chart">' + MAVG.map(function (v, i) { return '<div class="' + (i === 8 ? 'hi' : '') + '" style="height:' + (v / 7211 * 100).toFixed(0) + '%"><b>' + v + '</b><span>' + (i + 1) + ' 月</span></div>'; }).join('') + '</div>' +
    '<h4 style="margin-top:44px">发现二 · 头部集中：阅读最高的 31 篇（10%）带来 35.4% 的阅读</h4><ol class="top5"><li><b>28798</b>21年前的今天，我们来到这里</li><li><b>26852</b>重师第十届“师德标兵”里，有你认识的老师吗？</li><li><b>25643</b>你好！新同学</li><li><b>24877</b>多少分能上重庆师范大学？</li><li><b>24533</b>如期而至！重庆柴院迎来首届新生</li></ol>' +
    '<h4>发现三 · 周日发的篇均最高（6048），周五最低（3342）</h4><span class="todo">建议部分由人来写：数字是算出来的，判断是你的</span></div>';
  function skel(t) { return '<div class="pap"><div class="tt">' + t + '</div><div class="mt">版式示意</div><div class="sk"><b></b><i></i><i></i><i></i><b></b><i></i><i></i><i></i><i></i><b></b><i></i><i></i></div><span class="todo">成品由团队开课前用学校素材做好，放进这里</span></div>'; }
  var NEWS = '<div class="pap"><div class="tt">热点早报</div><div class="mt">每天 07:30 · 10 条 · 每条一句话加原文链接 · 版式示意</div><div class="sk"><b style="width:26%"></b><i></i><i></i><i></i><b style="width:26%"></b><i></i><i></i><i></i><b style="width:26%"></b><i></i><i></i></div><span class="todo">内容等信息源名单到了，开课前一周开始跑</span></div>';

  var WORKS = [
    { c: 'c1', t: '一页简报', art: '<h3>一页<br>简报</h3><div class="pg"><i></i><i></i><i></i><i></i><i></i></div><b>1</b>', today: 1, from: '王书记办学 120 周年讲话，2036 字', say: '把这份讲话做成一页简报，原话要一字不差。', tags: ['读文件', '提炼', '自查'], body: BRIEF },
    { c: 'c2', t: '热点早报', art: '<u></u><b>07:30</b><h3>热点早报</h3>', today: 1, from: '宣传部常看的公众号和网站', say: '每天早上 7:30，给我 10 条宣传和理论热点。', tags: ['联网搜索', '定时任务', '发到手机'], body: NEWS },
    { c: 'c3', t: '向上汇报的稿子', art: '<h3>年度运营<br>汇报</h3><div class="bars">' + MAVG.map(function (v, i) { return '<i class="' + (i === 8 ? 'hi' : '') + '" style="height:' + (v / 7211 * 100).toFixed(0) + '%"></i>'; }).join('') + '</div>', today: 1, from: '公众号 307 篇推文的数据表', say: '先把数算出来给我核，再写成给领导看的汇报。', tags: ['读表格', '计算', '成稿'], body: REPORT },
    { c: 'c4', t: '会议纪要和待办', art: '<h3>会议纪要</h3><div class="bub"><i style="width:150px"></i><i style="width:110px"></i><i style="width:170px"></i></div>', from: '一段会议录音的文字稿', say: '整理成纪要，待办按人列出来。', tags: ['读文件', '归类'], body: skel('会议纪要和待办') },
    { c: 'c5', t: '通知和方案', art: '<h3>通　知</h3><div class="ln"><i></i><i></i><i></i></div><i class="seal"></i>', from: '活动的时间、地点、要求', say: '按学校的公文格式写一份通知。', tags: ['公文格式', '模板'], body: skel('通知和活动方案') },
    { c: 'c6', t: '表格和台账', art: '<h3>表格<br>台账</h3><div class="gd"></div>', from: '散在几份文件里的名单和数字', say: '合成一张表，标出对不上的地方。', tags: ['读表格', '核对'], body: skel('表格和台账') },
    { c: 'c7', t: '宣讲提纲', art: '<h3>宣讲提纲</h3><div class="tree"><i></i><i></i><i></i><i></i><i></i></div>', from: '理论学习的原文', say: '列一份 15 分钟的宣讲提纲，引文标出处。', tags: ['只引原文', '标出处'], body: skel('宣讲提纲') },
    { c: 'c8', t: '汇报 PPT', art: '<h3>汇报 PPT</h3><div class="sl"><i></i><i></i></div>', from: '上面那份汇报稿', say: '做成 8 页的 PPT，用学校的模板。', tags: ['生成 PPT', '套模板'], body: skel('汇报 PPT') }
  ];
  WORKS.forEach(function (w, i) {
    var el = document.createElement('div'); el.className = 'cvr ' + w.c;
    el.innerHTML = w.art + (w.today ? '<span class="today">今天<br>做</span>' : '') + '<div class="acts2"><button data-a="open">打开</button><button data-a="info">详情</button></div>';
    el.addEventListener('click', function (e) { openWork(i, e.target.getAttribute && e.target.getAttribute('data-a') === 'open'); });
    $(i < 4 ? '#r1' : '#r2').appendChild(el);
  });
  var dt = $('#dt');
  function openWork(i, full) {
    var w = WORKS[i]; $('#dtp').innerHTML = w.body; $('#dtp').scrollTop = 0;
    $('#dtm').innerHTML = '<h2>' + w.t + '</h2><dl><div><dt>给它的材料</dt><dd>' + w.from + '</dd></div><div><dt>对它说的话</dt><dd class="q">“' + w.say + '”</dd></div><div><dt>它用到的本事</dt><dd class="tg">' + w.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</dd></div></dl>' + (w.today ? '<div><button class="btn y" id="dgo">今天亲手做 →</button></div>' : '');
    dt.className = 'dt on' + (full ? ' full' : '');
    var g = $('#dgo'); if (g) g.addEventListener('click', function () { closeWork(); go(chFirst(['案例一', '案例二', '案例三'][i])); });
  }
  function closeWork() { dt.className = 'dt'; }
  $('#dtx').addEventListener('click', closeWork);
  dt.addEventListener('click', function (e) { if (e.target === dt) closeWork(); });
  $$('.th3').forEach(function (el) { el.addEventListener('click', function () { openWork(+el.getAttribute('data-open'), false); }); });

  /* ---------- 岗位 ---------- */
  var ROLE = [['讲话稿、活动通稿', '宣传和理论热点', '公众号年度运营汇报'], ['本单位的通知、总结', '本领域动态（学工、教务、科研）', '本单位账号数据或年度工作总结'], ['一节课的教案或一篇课文', '本学科的教研动态', '学期教学总结、成绩分析'], ['一篇论文或课程笔记', '教资、考研、招聘信息', '实习总结、社团或学生会述职']];
  function role(i) { $$('#roles button').forEach(function (b, j) { b.classList.toggle('on', j === i); });
    $('#rc').innerHTML = ['读 · 一页简报', '找 · 热点早报', '写 · 向上汇报的稿子'].map(function (t, k) { return '<div><small>案例 ' + (k + 1) + '</small><h3>' + t + '</h3><p style="animation:up .6s ' + k * 70 + 'ms both">' + ROLE[i][k] + '</p></div>'; }).join(''); }
  $$('#roles button').forEach(function (b, i) { b.addEventListener('click', function () { role(i); }); }); role(0);

  /* ---------- 原理一：猜下一个词。三处要它选，其余自动接上。正确答案出自讲话稿 ---------- */
  var NT = [{ pre: '重庆师范大学的办学历史可追溯至', c: [['1906', .58], ['1954', .24], ['1902', .08], ['1936', .06], ['1898', .04]] },
    { pre: '年创办的', c: [['官立川东师范学堂', .52], ['重庆师范学堂', .22], ['四川省立师范学校', .14], ['川东道立师范', .12]] },
    { pre: '，学校于', c: [['1954', .61], ['1906', .2], ['1950', .11], ['1960', .08]] }], NTEND = '年建校。';
  var nti = 0, ntpick = [], ntx = $('#ntx'), cand = $('#cand'), temp = $('#temp'), ntv = $('#ntv');
  function probs(c) { var T = +temp.value, p = c.map(function (x) { return Math.pow(x[1], 1 / T); }), z = p.reduce(function (a, b) { return a + b; }, 0); return p.map(function (x) { return x / z; }); }
  function ntdraw() {
    var h = ''; NT.forEach(function (d, i) { if (i > nti) return; h += d.pre; if (i < nti) h += '<span class="' + (ntpick[i] === 0 ? 'g' : 'w') + '">' + d.c[ntpick[i]][0] + '</span>'; });
    var done = nti >= NT.length; if (done) h += NTEND; ntx.innerHTML = h + (done ? '' : '<i class="cur"></i>');
    if (done) { var bad = ntpick.filter(function (x) { return x !== 0; }).length; ntv.className = 'ntv' + (bad ? ' bad' : ''); ntv.textContent = bad ? '有 ' + bad + ' 处和事实不符。它照样写得很通顺：这就是幻觉。' : '这次全对。再调高温度多试几次看看。'; cand.innerHTML = ''; return; }
    ntv.className = 'ntv'; ntv.textContent = '';
    var p = probs(NT[nti].c); cand.innerHTML = NT[nti].c.map(function (x, k) { return '<button data-k="' + k + '">' + x[0] + '<i><u style="width:' + (p[k] * 100).toFixed(1) + '%"></u></i><em>' + (p[k] * 100).toFixed(0) + '%</em></button>'; }).join('');
    $$('button', cand).forEach(function (b) { b.addEventListener('click', function () { ntpick[nti] = +b.getAttribute('data-k'); nti++; ntdraw(); }); });
  }
  function sample() { var p = probs(NT[nti].c), r = Math.random(), a = 0; for (var k = 0; k < p.length; k++) { a += p[k]; if (r < a) return k; } return 0; }
  var ntT = 0;
  $('#ntauto').addEventListener('click', function () { clearInterval(ntT); ntT = setInterval(function () { if (nti >= NT.length) return clearInterval(ntT); ntpick[nti] = sample(); nti++; ntdraw(); }, 800); });
  $('#ntreset').addEventListener('click', function () { clearInterval(ntT); nti = 0; ntpick = []; ntdraw(); });
  temp.addEventListener('input', function () { if (nti < NT.length) ntdraw(); }); ntdraw();

  /* ---------- 原理二：桌子。大小是示意，一共 8 格 ---------- */
  var CAP = 8, ITEMS = [['它的基本设定', 1, 1], ['你这次的要求', 1, 1], ['讲话稿（2036 字）', 2], ['推文数据表（307 行）', 4], ['聊了 20 轮的对话', 3], ['新闻宣传工作管理规范', 3]], onDesk = [], fellOff = [];
  function dkdraw() {
    $('#pile').innerHTML = ITEMS.map(function (x, i) { return '<button data-i="' + i + '" class="' + (onDesk.indexOf(i) > -1 ? 'used' : '') + '">' + x[0] + '<small>占 ' + x[1] + ' 格</small></button>'; }).join('');
    $$('#pile button').forEach(function (b) { b.addEventListener('click', function () { var i = +b.getAttribute('data-i'); if (onDesk.indexOf(i) > -1) return; onDesk.push(i); fellOff = fellOff.filter(function (x) { return x !== i; });
      var used = function () { return onDesk.reduce(function (a, k) { return a + ITEMS[k][1]; }, 0); };
      while (used() > CAP) { var v = -1; for (var n = 0; n < onDesk.length; n++) if (!ITEMS[onDesk[n]][2] && onDesk[n] !== i) { v = n; break; } if (v < 0) break; fellOff.push(onDesk.splice(v, 1)[0]); } dkdraw(); }); });
    var u = onDesk.reduce(function (a, k) { return a + ITEMS[k][1]; }, 0); $('#dkcap').textContent = '已用 ' + u + ' / ' + CAP + ' 格';
    $('#dkon').innerHTML = onDesk.map(function (k) { return '<div class="it' + (ITEMS[k][2] ? ' pin' : '') + '" style="width:calc(' + ITEMS[k][1] * 12.5 + '% - 8px)">' + ITEMS[k][0] + '</div>'; }).join('');
    $('#fell').innerHTML = fellOff.length ? fellOff.map(function (k) { return '<span>' + ITEMS[k][0] + '</span>'; }).join('') + '<em>掉下去了：它不再看得见，但不会告诉你</em>' : '<em>放不下的，会从最早的开始掉下去</em>';
  }
  $('#dkreset').addEventListener('click', function () { onDesk = []; fellOff = []; dkdraw(); }); dkdraw();

  /* ---------- 原理四：一圈一圈的记录 ---------- */
  var LOG = [[0, '先定计划', '', '① 读原文 ② 列要点 ③ 成稿 ④ 核对', 12],
    [1, '它写出一条工具调用', '{ "tool": "read_file", "path": "讲话稿.docx" }', '', 14],
    [2, '程序去读文件', '', '读到 19 段，2036 字', 14], [3, '原文放回桌上', '', '', 40],
    [0, '读完，列要点', '', '四点希望 · 4 组数字 · 1 段可引用的原话', 46],
    [1, '再写一条工具调用', '{ "tool": "write_file", "path": "一页简报.docx" }', '', 48],
    [4, '检查点：要写文件了', '', '弹出“允许写入这个文件夹吗？”，你点了允许', 48],
    [2, '程序写入文件', '', '已保存', 50],
    [0, '回头核对', '', '原话和第 14 段逐字一致；“25 万”原文是“超过25万名”，改成“25 万+”', 58],
    [1, '改一处，再写一次', '{ "tool": "edit_file", "path": "一页简报.docx" }', '', 60],
    [0, '交付', '', '一页简报.docx，附一行：有 1 处已按原文修正', 62]], li = -1, lT = 0;
  function ldraw() {
    $$('.ring .nd').forEach(function (n) { n.classList.toggle('on', li >= 0 && +n.getAttribute('data-n') === LOG[li][0]); });
    $('#gate').classList.toggle('on', li >= 0 && LOG[li][0] === 4);
    $('#logl').innerHTML = LOG.slice(Math.max(0, li - 3), li + 1).map(function (l, k, a) { var n = li - a.length + k + 2; return '<div class="lg1' + (k === a.length - 1 ? ' cur2' : '') + '"><b>' + (n < 10 ? '0' : '') + n + '</b><div><p>' + l[1] + '</p>' + (l[2] ? '<code>' + l[2] + '</code>' : '') + (l[3] ? '<div class="rs">' + l[3] + '</div>' : '') + '</div></div>'; }).join('') || '<div class="lg1"><b>00</b><div><p>你说：把这份讲话做成一页简报</p></div></div>';
    $('#lmeter').style.width = (li < 0 ? 8 : LOG[li][4]) + '%';
  }
  $('#lnext').addEventListener('click', function () { clearInterval(lT); if (li < LOG.length - 1) li++; ldraw(); });
  $('#lprev').addEventListener('click', function () { clearInterval(lT); if (li > -1) li--; ldraw(); });
  $('#lauto').addEventListener('click', function () { clearInterval(lT); li = -1; ldraw(); lT = setInterval(function () { if (li >= LOG.length - 1) return clearInterval(lT); li++; ldraw(); }, 1500); }); ldraw();

  /* ---------- 案例一：原文和简报对着看 ---------- */
  $('#src').innerHTML = SRC.map(function (p) { return '<p data-k="' + p[0] + '">' + p[1] + '</p>'; }).join('');
  $('#bf').innerHTML = BRIEF; $('#bf3').innerHTML = REPORT;
  $$('#chk button').forEach(function (b) { b.addEventListener('click', function () {
    var c = b.getAttribute('data-c'); $$('#chk button').forEach(function (x) { x.classList.toggle('on', x === b); });
    var first = null; $$('#src p').forEach(function (p) { var hit = p.getAttribute('data-k').split(' ').indexOf(c) > -1; p.classList.toggle('hl', hit); if (hit && !first) first = p; });
    if (first) $('#src').scrollTo({ top: first.offsetTop - 30, behavior: 'smooth' });
    $$('#bf [data-k]').forEach(function (x) { x.style.outline = x.getAttribute('data-k') === c ? '5px solid #C8321F' : ''; x.style.outlineOffset = '4px'; });
    var old = $('#trapn'); if (old) old.remove();
    if (c === 'trap') { var n = document.createElement('div'); n.id = 'trapn'; n.className = 'pap'; n.style.cssText = 'position:absolute;left:0;right:0;bottom:0;min-height:0;padding:18px 24px;background:#fff'; n.innerHTML = '<div class="warn" style="margin:0;font-size:19px">电子稿里“廿”字带了注音。有的读文件工具会把这个字漏掉，读成“百不是终点”。所以原话一定要对着原稿核。</div>'; $('#bf').appendChild(n); }
  }); });

  /* ---------- 案例一：五样 ---------- */
  var FIVE = [['谁看', '读者', '读者是学院的老师，每人只有两分钟。'], ['做什么', '任务', '把讲话稿做成一页简报。'], ['材料', '放在哪', '材料是文件夹里的“讲话稿.docx”，只用这一份。'], ['标准', '怎样算好', '要有一句话主旨、四点希望、关键数字、一段原话；原话一字不差，标出第几段。'], ['交成什么样', '格式', '存成 Word，一页以内，放进“01_简报”。']];
  $('#five').innerHTML = FIVE.map(function (f, i) { return '<button data-i="' + i + '"' + (i === 1 ? ' class="on"' : '') + '>' + f[0] + '<small>' + f[1] + '</small></button>'; }).join('');
  function fdraw() { var on = $$('#five button').map(function (b) { return b.classList.contains('on'); }), n = on.filter(Boolean).length;
    $('#pbox').innerHTML = FIVE.map(function (f, i) { return '<u class="' + (on[i] ? 'on' : '') + '">' + f[2] + '</u>'; }).join('') + (n ? '' : '<em>帮我做个简报。</em>');
    $('#guess').style.width = (100 - n * 20) + '%'; $('#guessn').textContent = (5 - n) + ' / 5'; }
  $$('#five button').forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('on'); fdraw(); }); }); fdraw();

  /* ---------- 翻页 ---------- */
  var S = $$('.s'), cur = 0, CH = [];
  S.forEach(function (s) { var c = s.getAttribute('data-ch'); if (CH.indexOf(c) < 0) CH.push(c); });
  function chFirst(c) { for (var i = 0; i < S.length; i++) if (S[i].getAttribute('data-ch') === c) return i; return 0; }
  $('#chs').innerHTML = CH.map(function (c) { return '<button data-c="' + c + '">' + c + '</button>'; }).join('');
  $$('#chs button').forEach(function (b) { b.addEventListener('click', function () { go(chFirst(b.getAttribute('data-c'))); }); });
  function go(i) { cur = Math.max(0, Math.min(S.length - 1, i)); S.forEach(function (s, k) { s.classList.toggle('on', k === cur); });
    var c = S[cur].getAttribute('data-ch'); $$('#chs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-c') === c); });
    $('#cnt').textContent = (cur + 1) + ' / ' + S.length; $('#prog').style.width = ((cur + 1) / S.length * 100) + '%'; try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) {} }
  $('#pv').addEventListener('click', function () { go(cur - 1); }); $('#nx').addEventListener('click', function () { go(cur + 1); });
  addEventListener('keydown', function (e) { if (e.metaKey || e.ctrlKey || e.altKey || e.target.tagName === 'INPUT') return;
    if (dt.classList.contains('on')) { if (e.key === 'Escape') closeWork(); return; }
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(cur + 1); } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
    else if (e.key === 'f' || e.key === 'F') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } });
  function fit() { var k = Math.min(innerWidth / 1600, innerHeight / 900); $('#stage').style.transform = 'scale(' + k + ')'; }
  addEventListener('resize', fit); fit(); go((parseInt(location.hash.slice(1), 10) || 1) - 1);
})();
