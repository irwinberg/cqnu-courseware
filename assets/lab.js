/* 概念图示：点各天“先讲清楚”后面的词打开。每个图示一个函数：返回 HTML，再绑交互。Esc 或右上角关闭。 */
(function () {
  'use strict';
  var lab = document.getElementById('lab'); if (!lab) return;
  var body = document.getElementById('labb'), tabs = document.getElementById('labt');
  var $$ = function (s, r) { return [].slice.call((r || body).querySelectorAll(s)); }, $ = function (s, r) { return (r || body).querySelector(s); };
  var timers = [], later = function (f, ms) { timers.push(setTimeout(f, ms)); }, stop = function () { timers.forEach(clearTimeout); timers = []; };
  var GROUPS = [['agent', 'mcp', 'skill'], ['diffuse', 'prompt'], ['vtypes', 'camera'], ['flow'], ['harness']];
  var NAME = { agent: 'Agent', mcp: 'MCP', skill: 'Skill', diffuse: '生图原理', prompt: '提示词六要素', vtypes: '视频生成的几类', camera: '镜头语言', flow: '工作流和检查点', harness: '模型和底盘' };
  var IC = {
    doc: '<svg class="xic" viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7"/></svg>',
    chart: '<svg class="xic" viewBox="0 0 24 24"><path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/></svg>',
    cal: '<svg class="xic" viewBox="0 0 24 24"><path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"/></svg>',
    dir: '<svg class="xic" viewBox="0 0 24 24"><path d="M3 6h7l2 3h9v10H3z"/></svg>',
    web: '<svg class="xic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
    bot: '<svg class="xic" viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="11"/><path d="M12 8V4M9 13v2M15 13v2"/></svg>'
  };
  function toggle(sel, fn) { $$(sel + ' button').forEach(function (b) { b.addEventListener('click', function () { $$(sel + ' button').forEach(function (x) { x.classList.toggle('on', x === b); }); fn(b.getAttribute('data-v'), b); }); }); }
  function head(t, tg) { return '<div class="xh"><h2>' + t + '</h2>' + (tg ? '<div class="xt" id="xt">' + tg.map(function (x, i) { return '<button type="button" data-v="' + i + '"' + (i === (tg.def || 0) ? ' class="on"' : '') + '>' + x + '</button>'; }).join('') + '</div>' : '') + '</div>'; }
  function foot(a) { return '<div class="xf">' + a.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>'; }
  var D1 = ['<b>模型</b>大脑', '<b>Agent</b>会动手的人', '<b>MCP</b>接到哪里', '<b>Skill</b>会哪些套路'];
  var X = {};

  /* ---------- Agent ---------- */
  X.agent = function () {
    var tg = ['聊天 AI', 'Agent']; tg.def = 1;
    body.innerHTML = head('Agent <small>= 给目标，它自己干完</small>', tg) +
      '<div class="xs"><div class="ag" data-m="agent">' +
      '<div class="agr ag-c"><div class="xn you">把讲话稿做成一页简报<small>你</small></div><i class="xa"></i><div class="xn">模型<small>只会回答</small></div><i class="xa"></i><div class="xn">一段文字<small>自己复制、排版、核对</small></div></div>' +
      '<div class="agr ag-a"><div class="xn you">把讲话稿做成一页简报<small>你 · 只说目标</small></div><i class="xa"></i>' +
      '<div class="xn" data-s="0">计划<small>拆成几步</small></div><i class="xa"></i><div class="xn" data-s="1">动手<small>调用工具</small></div><i class="xa"></i><div class="xn" data-s="2">检查<small>不对就重做</small></div><i class="xa"></i><div class="xn" data-s="3">交付<small>一页简报.docx</small></div></div>' +
      '<div class="agt ag-a"><span data-t="0">' + IC.dir + '读文件</span><span data-t="1">' + IC.web + '搜索</span><span data-t="2">' + IC.doc + '写文档</span><span data-t="3">' + IC.chart + '做表格</span></div>' +
      '<div class="agl ag-a" id="agl"></div><div class="agr ag-a"><button type="button" class="xrun" id="run">▶ 跑一遍</button></div></div></div>' + foot(D1);
    var ag = $('.ag'), log = $('#agl');
    toggle('#xt', function (v) { stop(); ag.setAttribute('data-m', v === '0' ? 'chat' : 'agent'); });
    var S = [[0, -1, '① 读原文 ② 提要点 ③ 排一页 ④ 核对'], [1, 0, '读取：讲话稿.docx'], [1, 2, '写入：一页简报.docx'], [2, -1, '核对人名、时间、数字…有一处不符'], [1, 2, '改好，重新写入'], [2, -1, '核对通过'], [3, -1, '交付：一页简报.docx']];
    function ap(st) { $$('.xn[data-s]').forEach(function (n) { n.classList.toggle('on', +n.getAttribute('data-s') === st[0]); }); $$('.agt span').forEach(function (n) { n.classList.toggle('on', +n.getAttribute('data-t') === st[1]); }); log.textContent = st[2]; }
    var ak = 0;
    $('#run').addEventListener('click', function () { stop(); ak = 0; S.forEach(function (st, i) { later(function () { ap(st); ak = i + 1; }, i * 2600); }); });
    X.agent.down = function () { stop(); if (ak < S.length) ap(S[ak++]); };
    X.agent.up = function () { stop(); if (ak > 1) { ak--; ap(S[ak - 1]); } };
  };

  /* ---------- MCP ---------- */
  X.mcp = function () {
    var L = ['WorkBuddy', 'DeepSeek Harness', '别的 AI 助手'], R = [['doc', '飞书文档', '找出上个月的活动通稿', '找到 6 篇'], ['chart', '公众号数据', '上周哪篇阅读最高？', '拿到 7 天的数据'], ['cal', '校历', '下周有什么节点？', '拿到 3 个日期'], ['dir', '电脑里的文件夹', '把照片按活动归类', '整理了 48 张'], ['web', '浏览器', '查教育部最新通知', '打开了 3 个网页']];
    var tg = ['没有 MCP', '有 MCP']; tg.def = 1;
    body.innerHTML = head('MCP <small>= AI 的统一插口</small>', tg) +
      '<div class="xs"><div class="mc" data-m="1"><svg></svg><b class="mcn"></b><i class="mcdot"></i>' +
      '<div class="mccol l">' + L.map(function (x) { return '<div class="xn">' + IC.bot + x + '</div>'; }).join('') + '</div>' +
      '<div class="mcmid">MCP<small>一种接法</small></div>' +
      '<div class="mccol r">' + R.map(function (x, i) { return '<div class="xn" data-i="' + i + '">' + IC[x[0]] + x[1] + '</div>'; }).join('') + '</div>' +
      '<div class="mcq"><em>点右边任意一个，看它怎么接上</em></div></div></div>' + foot(D1);
    var mc = $('.mc'), svg = $('svg', mc), mode = 1, dot = $('.mcdot'), q = $('.mcq');
    function pt(el, side) { var r = el.getBoundingClientRect(), b = mc.getBoundingClientRect(); return [(side === 'r' ? r.right : side === 'l' ? r.left : r.left + r.width / 2) - b.left, r.top + r.height / 2 - b.top]; }
    function curve(a, b) { var m = (a[0] + b[0]) / 2; return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' C' + m.toFixed(1) + ' ' + a[1].toFixed(1) + ' ' + m.toFixed(1) + ' ' + b[1].toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); }
    function draw() {
      var ls = $$('.mccol.l .xn'), rs = $$('.mccol.r .xn'), mid = $('.mcmid'), h = '';
      if (mode) { var mr = mid.getBoundingClientRect(), b = mc.getBoundingClientRect();
        ls.forEach(function (l, i) { h += '<path class="m" data-l="' + i + '" d="' + curve(pt(l, 'r'), [mr.left - b.left, mr.top - b.top + mr.height * (i + 1) / (ls.length + 1)]) + '"/>'; });
        rs.forEach(function (r, i) { h += '<path class="m" data-r="' + i + '" d="' + curve([mr.right - b.left, mr.top - b.top + mr.height * (i + 1) / (rs.length + 1)], pt(r, 'l')) + '"/>'; });
      } else ls.forEach(function (l, i) { rs.forEach(function (r, j) { h += '<path data-l="' + i + '" data-r="' + j + '" d="' + curve(pt(l, 'r'), pt(r, 'l')) + '"/>'; }); });
      svg.innerHTML = h; $('.mcn').textContent = mode ? '3 + 5 = 8 根线' : '3 × 5 = 15 根线，每根单独开发';
    }
    toggle('#xt', function (v) { stop(); mode = +v; mc.setAttribute('data-m', v); q.innerHTML = '<em>' + (mode ? '点右边任意一个，看它怎么接上' : '每多一个软件，就要再接一遍') + '</em>'; later(draw, mode ? 420 : 0); });
    $$('.mccol.r .xn').forEach(function (n) { n.addEventListener('click', function () {
      if (!mode) return; stop(); var i = +n.getAttribute('data-i'), ps = [$('path[data-l="0"]', svg), $('path[data-r="' + i + '"]', svg)];
      $$('path', svg).forEach(function (p) { p.classList.toggle('hot', ps.indexOf(p) > -1); });
      $$('.mccol.r .xn').forEach(function (x) { x.classList.toggle('on', x === n); });
      q.innerHTML = '<b>' + R[i][2] + '</b>';
      var t0 = performance.now(), l0 = ps[0].getTotalLength(), l1 = ps[1].getTotalLength();
      dot.style.opacity = 1;
      (function tick(now) { var p = (now - t0) / 1500; if (!lab.classList.contains('on')) return;
        var k = p < 1 ? p : 2 - p; if (p >= 2) { dot.style.opacity = 0; q.innerHTML = '<b>' + R[i][2] + '</b><em>→</em><i>' + R[i][3] + '</i>'; return; }
        var d = k * (l0 + l1), P = d < l0 ? ps[0].getPointAtLength(d) : ps[1].getPointAtLength(d - l0);
        dot.style.transform = 'translate(' + P.x + 'px,' + P.y + 'px)'; requestAnimationFrame(tick); })(t0);
    }); });
    later(draw, 60); X.mcp.redraw = draw;
  };

  /* ---------- Skill ---------- */
  X.skill = function () {
    var req = ['标题不超过 20 字', '导语写清时间、地点、人物', '领导职务写全称', '引用讲话用原文', '800 字以内', '落款：党委宣传部', '附 3 个备选标题', '最后列出待核对的事实'];
    var tg = ['每次重说', '装上技能']; tg.def = 1;
    var docs = [[62, 100, 88, 70, 94, 40], [84, 76, 100, 52, 90, 66], [48, 92, 70, 100, 60, 82]], same = [56, 100, 94, 100, 88, 62];
    body.innerHTML = head('Skill <small>= 写好的做事说明书</small>', tg) +
      '<div class="xs"><div class="sk" data-m="1"><div class="skin"><div class="skp">写一篇活动通稿。<br>' + req.map(function (x, i) { return '<u style="--i:' + i + '">' + x + '</u>'; }).join('') + '</div>' +
      '<div class="skc"><h4>' + IC.dir + '新闻通稿 · 技能</h4><ul><li><b>步骤</b>读材料 → 列要点 → 成稿 → 自查</li><li><b>模板</b>标题、导语、正文、落款</li><li><b>检查</b>人名、职务、时间、数字</li></ul></div></div>' +
      '<i class="xa"></i><div class="sko">' + docs.map(function () { return '<div class="skd"><i class="t"></i><i></i><i></i><i></i><i></i><i></i></div>'; }).join('') + '<div class="skl"></div></div></div></div>' + foot(D1);
    var sk = $('.sk');
    function set(m) { sk.setAttribute('data-m', m);
      $$('.skd').forEach(function (d, k) { var w = +m ? same : docs[k]; $$('i', d).forEach(function (l, j) { l.style.width = w[j] + '%'; }); d.style.transform = +m ? 'none' : 'rotate(' + [-3, 2, -1.5][k] + 'deg) translateY(' + [6, -8, 10][k] + 'px)'; });
      $('.skl').textContent = +m ? '一句话，次次一个样' : '每次打一大段，出来还不一样'; }
    toggle('#xt', set); set(1);
  };

  /* ---------- 生图原理 ---------- */
  X.diffuse = function () {
    var IM = ['img/campus/c09.jpg', 'img/campus/c12.jpg', 'img/campus/c18.jpg'], seed = 0, N = 30;
    body.innerHTML = head('生图 <small>= 从一团噪点，一步步去噪</small>') +
      '<div class="xs"><div class="df"><div class="dfv"><img src="' + IM[0] + '" alt=""><canvas width="160" height="120"></canvas></div><div class="dfs">' +
      '<div class="dfp"><div class="xn" data-k="0">提示词</div><i class="xa"></i><div class="xn" data-k="1">随机噪点</div><i class="xa"></i><div class="xn" data-k="2">去噪 × ' + N + ' 步</div><i class="xa"></i><div class="xn" data-k="3">图片</div></div>' +
      '<div class="dfq"><b>提示词</b>校园风景，秋天，晨光，纪实摄影</div>' +
      '<div class="dfr"><span>第</span><input type="range" min="0" max="' + N + '" value="0" step="1"><output>0 步</output></div>' +
      '<div class="dfb"><button type="button" class="xrun" id="run">▶ 生成</button><div class="xt"><button type="button" id="seed">换一颗种子</button></div></div></div></div></div>' +
      foot(['<b>每一步</b>模型猜“哪些是噪点”，擦掉一点', '<b>提示词</b>决定往哪个方向擦', '<b>种子</b>不同，同一句话出的图也不同']);
    var img = $('.dfv img'), cv = $('canvas'), cx = cv.getContext('2d'), rg = $('input'), out = $('output');
    function noise() { var d = cx.createImageData(160, 120), a = d.data, s = (seed + 1) * 9301; for (var i = 0; i < a.length; i += 4) { s = (s * 16807 + 11) % 2147483647; a[i] = s & 255; a[i + 1] = (s >> 8) & 255; a[i + 2] = (s >> 16) & 255; a[i + 3] = 255; } cx.putImageData(d, 0, 0); }
    function set(v) { var t = v / N, e = t * t; rg.value = v; out.textContent = v + ' 步'; cv.style.opacity = (1 - e).toFixed(3);
      img.style.filter = 'blur(' + ((1 - t) * 26).toFixed(1) + 'px) saturate(' + (.3 + .7 * t).toFixed(2) + ') contrast(' + (.7 + .3 * t).toFixed(2) + ')';
      var k = v === 0 ? 1 : v >= N ? 3 : 2; $$('.dfp .xn').forEach(function (n) { n.classList.toggle('on', +n.getAttribute('data-k') === k); }); }
    function run() { stop(); for (var i = 0; i <= N; i++) (function (i) { later(function () { set(i); }, 300 + i * 420); })(i); }
    function walk(d) { stop(); var v0 = +rg.value, v1 = Math.max(0, Math.min(N, v0 + d * 5)), n = Math.abs(v1 - v0); for (var k = 1; k <= n; k++) (function (k) { later(function () { set(v0 + (d > 0 ? k : -k)); }, k * 380); })(k); }
    X.diffuse.down = function () { walk(1); }; X.diffuse.up = function () { walk(-1); };
    rg.addEventListener('input', function () { stop(); set(+rg.value); });
    $('#run').addEventListener('click', run);
    $('#seed').addEventListener('click', function () { seed = (seed + 1) % IM.length; img.src = IM[seed]; noise(); set(0); });
    noise(); set(0);
  };

  /* ---------- 提示词六要素 ---------- */
  X.prompt = function () {
    var K = [['主体', '画什么', '一张学术讲座海报'], ['场景', '在哪里、什么时候', '秋天的校园，图书馆前'], ['构图', '怎么摆', '竖版 3:4，上方留白放标题'], ['光线和色彩', '什么色调', '晨光，学校的标准蓝为主色'], ['风格', '像什么', '简洁的扁平插画'], ['文字和限制', '写什么、不要什么', '标题“新闻宣传活动月”，不要出现校徽']];
    body.innerHTML = head('提示词 <small>= 把这六件事说清楚</small>') +
      '<div class="xs"><div class="pr"><div class="prl"><div class="prk">' + K.map(function (k, i) { return '<button type="button" data-i="' + i + '"' + (i === 0 ? ' class="on"' : '') + '>' + k[0] + '<small>' + k[1] + '</small></button>'; }).join('') + '</div>' +
      '<div class="prt">' + K.map(function (k, i) { return '<u data-i="' + i + '"' + (i === 0 ? ' class="on"' : '') + '>' + k[2] + (i < 5 ? '，' : '。') + '</u>'; }).join('') + '</div></div>' +
      '<div class="prv"><img src="img/poster/p03.jpg" alt=""><b>1 / 6</b></div></div></div>' + foot(['<b>说得越全</b>越接近你要的', '<b>校徽、校名字体</b>不让 AI 画，后期贴官方文件']);
    function upd() { var n = $$('.prk .on').length; $('.prv b').textContent = n + ' / 6'; $('.prv img').style.filter = 'blur(' + (6 - n) * 5 + 'px) saturate(' + (.35 + n * .11).toFixed(2) + ')'; }
    $$('.prk button').forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('on'); $('.prt u[data-i="' + b.getAttribute('data-i') + '"]').classList.toggle('on', b.classList.contains('on')); upd(); }); });
    upd();
  };

  /* ---------- 视频生成的几类 ---------- */
  X.vtypes = function () {
    var wave = function (c) { var h = ''; for (var i = 0; i < 9; i++) h += '<i style="--i:' + i + '"></i>'; return '<div class="' + c + '">' + h + '</div>'; };
    var txt = function (l, t) { return '<div class="vtc"><small>' + l + '</small>' + t + '</div>'; }, pic = function (l, s, p) { return '<div class="vtc' + (p ? ' p' : '') + '" style="background-image:url(' + s + ')"><small>' + l + '</small></div>'; };
    var T = [
      ['文生视频', 0, txt('一句话', '银杏大道，落叶，镜头缓慢推进'), '<img class="kb" src="img/campus/c09.jpg" alt="">', ['<b>适合</b>空镜、意境画面', '<b>注意</b>画面不好控制，要多抽几次']],
      ['图生视频', 1, pic('一张图', 'img/campus/c18.jpg') + txt('一句话', '云在动，镜头向右平移'), '<img class="pan" src="img/campus/c18.jpg" alt="">', ['<b>适合</b>让校园照片、老照片动起来', '<b>课上</b>主要用这一类']],
      ['首尾帧', 1, pic('第一帧', 'img/old/o1.jpg') + pic('最后一帧', 'img/campus/c01.jpg'), '<img src="img/old/o1.jpg" alt=""><img class="fd" src="img/campus/c01.jpg" alt="">', ['<b>适合</b>今昔对比、转场', '<b>AI 补</b>中间的变化过程']],
      ['参考生视频', 0, pic('人物或物品参考', 'img/badge/avatar.png', 1) + txt('一句话', '他走进图书馆，回头微笑'), '<img class="kb" src="img/campus/c12.jpg" alt="">', ['<b>适合</b>同一个角色出现在多个镜头', '<b>注意</b>真人形象要本人同意']],
      ['数字人', 1, pic('一张正面照', 'img/badge/avatar.png', 1) + '<div class="vtc wave"><small>一段文字或录音</small>' + wave('').replace(/<\/?div[^>]*>/g, '') + '</div>', '<img src="img/campus/c16.jpg" alt="" style="filter:blur(3px) brightness(.7)">' + wave('talk'), ['<b>适合</b>新闻播报、微课、通知', '<b>注意</b>对外发布要加 AI 标识']],
      ['视频改视频', 0, pic('一段视频', 'img/video/v1.jpg') + txt('一句话', '改成水彩风格'), '<img class="sty" src="img/video/v1.jpg" alt="">', ['<b>适合</b>换风格、换背景、延长', '<b>了解</b>即可']]
    ];
    body.innerHTML = head('视频生成 <small>= 看你给它什么</small>') + '<div class="xs"><div class="vt"><div class="xt vtt" id="xt">' + T.map(function (t, i) { return '<button type="button" data-v="' + i + '"' + (i === 1 ? ' class="on"' : '') + '>' + t[0] + (t[1] ? '<sup></sup>' : '') + '</button>'; }).join('') + '</div>' +
      '<div class="vts"><div class="vti"></div><i class="xa"></i><div class="vto"></div></div></div></div><div class="xf"></div>';
    function set(i) { var t = T[i]; $('.vti').innerHTML = t[2]; $('.vto').innerHTML = t[3] + '<i class="bar"></i>'; $('.xf').innerHTML = t[4].map(function (x) { return '<span>' + x + '</span>'; }).join('') + '<span><b style="color:var(--red,#B8321F)">●</b>课上会做</span>'; }
    toggle('#xt', function (v) { set(+v); }); set(1);
  };

  /* ---------- 镜头语言 ---------- */
  X.camera = function () {
    var K = [['推', '镜头缓慢推进', 'scale(1)', 'scale(1.45)'], ['拉', '镜头缓慢拉远', 'scale(1.45)', 'scale(1)'], ['摇', '镜头从左摇到右', 'translateX(9%)', 'translateX(-9%)'], ['移', '镜头向右平移', 'translateX(-9%) scale(1.1)', 'translateX(9%) scale(1.1)'], ['升', '镜头缓缓升起', 'translateY(-9%)', 'translateY(9%)'], ['环绕', '镜头环绕主体', 'perspective(900px) rotateY(-9deg) scale(1.15)', 'perspective(900px) rotateY(9deg) scale(1.15)']];
    body.innerHTML = head('镜头语言 <small>= 写进提示词的六个词</small>') +
      '<div class="xs"><div class="cm"><div class="cmv"><img src="img/campus/c09.jpg" alt=""></div><div><div class="cmk">' + K.map(function (k, i) { return '<button type="button" data-i="' + i + '">' + k[0] + '<small>' + k[1] + '</small></button>'; }).join('') + '</div>' +
      '<div class="dfq cmq"><b>写进提示词</b><span id="cmq"></span></div></div></div></div>' + foot(['<b>一个镜头</b>只用一种运动', '<b>慢</b>比快稳，AI 更不容易出错']);
    var img = $('.cmv img'), an;
    function play(i) { var k = K[i]; $$('.cmk button').forEach(function (b, j) { b.classList.toggle('on', j === i); }); $('#cmq').textContent = '校园银杏大道，' + k[1];
      if (an) an.cancel(); an = img.animate([{ transform: k[2] }, { transform: k[3] }], { duration: 3600, easing: 'ease-in-out', iterations: Infinity, direction: 'alternate' }); }
    $$('.cmk button').forEach(function (b) { b.addEventListener('click', function () { play(+b.getAttribute('data-i')); }); });
    play(0);
  };

  /* ---------- 工作流和检查点 ---------- */
  X.flow = function () {
    var S = [['素材', '通稿、照片', 0], ['文稿', '新闻稿、推文', 0], ['人审', '点一下通过', 1], ['海报', '主图、长图', 0], ['短视频', '15 秒', 0], ['审核清单', '四项都勾上', 2], ['发布', '', 0]], CK = ['事实', '表述', '版权和肖像', 'AI 标识'];
    body.innerHTML = head('工作流 <small>= AI 跑流程，人守检查点</small>') +
      '<div class="xs"><div class="fl"><div class="flr">' + S.map(function (s, i) { return (i ? '<i class="xa"></i>' : '') + '<div class="xn' + (s[2] ? ' ck' : '') + '" data-i="' + i + '">' + s[0] + '<small>' + s[1] + '</small></div>'; }).join('') + '</div>' +
      '<div class="flc"></div><button type="button" class="xrun" id="run">▶ 跑一遍</button></div></div>' + foot(['<b>工作流</b>把一件事拆成固定的几步', '<b>检查点</b>AI 停下来，等人确认', '<b>审核清单</b>发布前逐项核对']);
    var ns = $$('.flr .xn'), flc = $('.flc'), cur = -1;
    function go(i) { stop(); cur = i; ns.forEach(function (n, j) { n.classList.toggle('on', j === i && !S[j][2]); n.classList.toggle('done', j < i && !S[j][2]); n.classList.toggle('ok', j < i && !!S[j][2]); n.classList.toggle('wait', j === i && !!S[j][2]); });
      flc.innerHTML = ''; if (i >= S.length) return;
      if (S[i][2] === 2) { flc.innerHTML = CK.map(function (c) { return '<label>' + c + '</label>'; }).join(''); $$('label', flc).forEach(function (l) { l.addEventListener('click', function () { l.classList.add('on'); if ($$('label.on', flc).length === CK.length) later(function () { go(i + 1); }, 500); }); }); }
      }
    X.flow.down = function () { if (cur < 0) return go(0); if (cur >= S.length) return; if (S[cur][2] === 2) { var l = $('label:not(.on)', flc); if (l) l.click(); return; } go(cur + 1); };
    X.flow.up = function () { if (cur > 0) go(cur - 1); };
    ns.forEach(function (n, j) { n.addEventListener('click', function () { if (j === cur && S[j][2] === 1) go(j + 1); }); });
    $('#run').addEventListener('click', function () { go(0); });
    later(function () { go(0); }, 700);
  };

  /* ---------- 模型和底盘 ---------- */
  X.harness = function () {
    body.innerHTML = head('模型是大脑，<small>底盘让它干活</small>') +
      '<div class="xs"><div class="hn"><div class="hns">' +
      '<div class="hnl hn0"><b>模型<br>可以换</b><div id="md"><button type="button" class="on">DeepSeek</button><button type="button">其他云端模型</button><button type="button">装在本机的模型</button></div></div>' +
      '<div class="hnl"><b>底盘<br>Harness</b><div><span>工具</span><span>记忆</span><span>权限</span><span>工作区（一个文件夹）</span></div></div>' +
      '<div class="hnl"><b>插件<br>点一下装上</b><div id="pg"><button type="button" class="pl">公文格式</button><button type="button" class="pl">选题库</button><button type="button" class="pl">VI 规范初审</button><button type="button" class="pl">新闻问答</button></div></div></div>' +
      '<div class="hnm"><small>数据在哪里</small><p><b>留在本机</b><i>文件、记录、插件</i></p><p class="out" id="hout"><b>会发出去</b><i>你发给模型的那段内容</i></p></div></div></div>' +
      foot(['<b>WorkBuddy</b>开箱即用，别人搭好的', '<b>DeepSeek Harness</b>开源，自己搭一个', '<b>红线不变</b>涉密、未公开的内容不进联网 AI']);
    $$('#md button').forEach(function (b, i) { b.addEventListener('click', function () { $$('#md button').forEach(function (x) { x.classList.toggle('on', x === b); });
      var o = $('#hout'); o.className = i === 2 ? '' : 'out'; o.innerHTML = i === 2 ? '<b>留在本机</b><i>模型也在这台电脑上，内容不出去</i>' : '<b>会发出去</b><i>你发给模型的那段内容</i>'; }); });
    $$('#pg button').forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('on'); }); });
  };

  /* ---------- 打开、关闭 ---------- */
  var cur = '';
  function open(id) {
    if (!X[id]) return; stop(); cur = id;
    var g = GROUPS.filter(function (x) { return x.indexOf(id) > -1; })[0];
    tabs.innerHTML = g.map(function (k) { return '<button type="button" data-x="' + k + '"' + (k === id ? ' class="on"' : '') + '>' + NAME[k] + '</button>'; }).join('');
    X[id](); lab.classList.add('on'); lab.setAttribute('aria-hidden', 'false');
    var hk = document.getElementById('labk'); if (!hk) { hk = document.createElement('span'); hk.id = 'labk'; hk.className = 'labk'; tabs.parentNode.insertBefore(hk, document.getElementById('labx')); } hk.textContent = X[id].down ? '按 ↓ 一步一步走，↑ 退回' : '';
  }
  function close() { stop(); cur = ''; lab.classList.remove('on'); lab.setAttribute('aria-hidden', 'true'); }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-x]'); if (b) open(b.getAttribute('data-x')); });
  document.getElementById('labx').addEventListener('click', close);
  window.addEventListener('keydown', function (e) {
    if (!cur) return; e.stopImmediatePropagation();
    var g = GROUPS.filter(function (x) { return x.indexOf(cur) > -1; })[0], i = g.indexOf(cur);
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight' && g[i + 1]) open(g[i + 1]); else if (e.key === 'ArrowLeft' && g[i - 1]) open(g[i - 1]);
    else if (e.key === 'ArrowDown' && X[cur].down) { e.preventDefault(); X[cur].down(); } else if (e.key === 'ArrowUp' && X[cur].up) { e.preventDefault(); X[cur].up(); }
  }, true);
  window.addEventListener('wheel', function (e) { if (cur) { e.stopImmediatePropagation(); e.preventDefault(); } }, { capture: true, passive: false });
  window.addEventListener('resize', function () { if (cur === 'mcp' && X.mcp.redraw) X.mcp.redraw(); });
  window.addEventListener('acts:close', close);
  var cx = document.getElementById('conx');                 // day.html：侧栏里放当天的入口
  if (cx) { var dd = +(/[?&]d=(\d)/.exec(location.search) || [0, 0])[1], gg = GROUPS[dd - 1]; if (gg) cx.innerHTML = '<span>先讲清楚</span>' + gg.map(function (k) { return '<button type="button" data-x="' + k + '">' + NAME[k] + ' ▸</button>'; }).join(''); }
  var m = /[?&]x=(\w+)/.exec(location.search); if (m) setTimeout(function () { open(m[1]); }, 400);
})();
