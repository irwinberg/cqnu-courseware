/* 第 3 天每一页的画面（AI 视频）。键 = “章名｜页标题”或“页标题”，和 课程内容_v1.md 卷三的标题一一对应。
   公共部件：viz-kit.js（VK）、day1.js 的 window.DK、day2.js 的 window.D2K（RunningHub 界面、分步提示词、核对卡片）。版式在 day3.css。
   视频都在 img/d3/：两条教学短片是团队做好的真实成片；其余是 ffmpeg 用照片加运镜做的示意（ref/d3-make.py），
   团队用 RunningHub 实跑后用同名 .mp4 覆盖即可，封面图同名 .jpg。清单见《第3天_待准备素材.md》。
   第 3 天只用 RunningHub；提示词都在 PROMPT 里，和《第3天_提示词.md》是同一份。 */
(function () {
  'use strict';
  var DAY = +(new URLSearchParams(location.search).get('d')) || 0;
  if (DAY !== 3 || !window.DK || !window.D2K) return;
  var VIZ = window.VIZ = window.VIZ || {}, VK = window.VK, q = VK.q, qa = VK.qa, K = window.DK, K2 = window.D2K;
  var ic = K.ic, pr = K.pr, bind = K.bind, st = K.st, cks = K.cks, bindCk = K.bindCk, av = K.av, RN = K.RN, mark = K.mark, raw = K.raw;
  var rh = K2.rh, flow = K2.flow, check = K2.check, doNow = K2.doNow;
  var P3 = function (n) { return 'img/d3/' + n; };
  /* 一段视频：静音循环自动播放；sound=1 时带声音、点一下播放 */
  function vid(n, cls, sound) { return '<video class="d3-vd ' + (cls || '') + '" src="' + P3(n + '.mp4') + '" poster="' + P3(n + '.jpg') + '" playsinline preload="metadata"' + (sound ? ' controls' : ' muted loop autoplay') + '></video>'; }
  var CASE = [['动', '老照片动起来'], ['剪', '15 秒校园短片'], ['说', '让吉祥物开口说话']];
  var ROLE = [['校史展览、纪念日推送', '活动预告、专业宣传短片', '新生指南、展馆讲解'], ['院史回顾、学院年会', '学院招生短片', '学院形象讲解'], ['课堂导入、历史课素材', '课程预告片', '课程导学、知识讲解'], ['家庭老照片', '社团招新短片', '社团吉祥物讲解']];
  var MOVES = [['推', '镜头向前推近，突出主体', 'm-in'], ['拉', '镜头向后拉远，交代环境', 'm-out'], ['摇', '机位不动，镜头左右转动', 'm-pan'], ['移', '机位平移，画面横向展开', 'm-truck'], ['升', '机位升高，视野逐渐打开', 'm-up']];

  /* ================= 提示词（实测后在这里改） ================= */
  var PROMPT = {
    p1move: '镜头缓慢向前推进，画面中的人物自然地小幅走动，树叶随风轻轻摆动。保持建筑、人物外貌和服装不变，不添加新的人物和物体，保留老照片的色调和质感。时长 5 秒。',
    p1still: '人物保持静止，只有镜头缓慢推进，天空中的云和树叶轻微移动。',
    p1slow: '动作幅度再小一些，速度再慢一些，避免人物面部和手部变形。',
    p2board: '镜头 1（0–5 秒）：【图 1 的画面】，【运镜】\n镜头 2（5–10 秒）：【图 2 的画面】，【运镜】\n镜头 3（10–15 秒）：【图 3 的画面】，【运镜】\n配乐：【风格】',
    p2film: '根据上传的三张校园照片，生成一条 15 秒的校园宣传短片，横版 16:9，分三个镜头：\n镜头 1（0–5 秒）：图 1，航拍视角，镜头缓慢向前推进；\n镜头 2（5–10 秒）：图 2，镜头从左向右平移；\n镜头 3（10–15 秒）：图 3，镜头缓慢拉远，夕阳氛围。\n镜头之间自然过渡，配轻快的钢琴背景音乐。不要字幕，不要任何文字。建筑外观与照片保持一致。',
    p2one: '只重新生成镜头 2，其余两个镜头保持不变。',
    p2music: '配乐改为舒缓的弦乐，节奏慢一些。',
    p2vert: '改为竖版 9:16，用于视频号，镜头内容不变。',
    p2tpl: '根据上传的【数量】张照片，生成一条【时长】秒的【主题】短片，【横版 16:9 / 竖版 9:16】，分【数量】个镜头：\n镜头 1：图 1，【运镜】；\n镜头 2：图 2，【运镜】；\n镜头 3：图 3，【运镜】。\n镜头之间自然过渡，配【配乐风格】。不要字幕，不要任何文字。建筑外观与照片保持一致。',
    p3script: '大家好，我是学院的吉祥物小熊猫。重庆师范大学 1954 年建校，建校以来累计培养教师超过 25 万名。欢迎你来到重师，和我们一起，做一名好老师。',
    p3voice: '音色：活泼、亲切的青年声音\n语速：正常偏慢\n读法：“1954”读作“一九五四”，“25 万”读作“二十五万”',
    p3dh: '上传：吉祥物定妆图（第 2 天的成果）+ 第二步生成的配音\n文案：粘贴讲解词\n声音选项：使用上传的配音（不克隆）'
  };
  window.D3_PROMPT = PROMPT;
  var CAP = [['大家好，我是学院的吉祥物小熊猫。', 0, 3.28], ['重庆师范大学 1954 年建校，', 3.53, 6.45], ['建校以来累计培养教师超过 25 万名。', 6.7, 10.37], ['欢迎你来到重师，', 10.62, 12.14], ['和我们一起，做一名好老师。', 12.39, 15.1]];
  /* 带字幕的吉祥物讲解：字幕跟着视频时间走 */
  function talk(cls) { return '<div class="d3-tk ' + (cls || '') + '">' + vid('v-mascot', '', 1) + '<div class="d3-cap"></div></div>'; }
  function bindTalk(el) { qa('.d3-tk', el).forEach(function (t) { var v = q('video', t), c = q('.d3-cap', t); v.addEventListener('timeupdate', function () { var x = CAP.filter(function (k) { return v.currentTime >= k[1] && v.currentTime <= k[2]; })[0]; c.textContent = x ? x[0] : ''; c.classList.toggle('on', !!x); }); }); }
  function useFor(el, k, big, txt) { el.innerHTML = '<div><div class="d-us">' + RN.map(function (r, i) { return '<div class="d-us-i in" style="--i:' + i + '">' + av(i) + '<span class="d-k">' + r + '</span><h3>' + ROLE[i][k] + '</h3></div>'; }).join('') + '</div><div class="d-us-s in" style="--i:5"><b>' + big + '</b><span>' + txt + '</span></div></div>'; }
  function lst(L) { return '<ol class="d-ls">' + L.map(function (p, i) { return '<li data-i="' + i + '"><span class="d-n">' + (i + 1) + '</span><div><h3>' + p[0] + '</h3><p>' + p[1] + '</p></div></li>'; }).join('') + '</ol>'; }
  function pinPage(el, dev, P, w) { var W = (w || 840) - 26;
    el.innerHTML = '<div class="d-pp"><div class="d-pp-d">' + VK.lap(dev, w || 840, 1440) + P.map(function (p, i) { return '<button class="d-pin" data-i="' + i + '" style="left:' + (13 + W * p[0] / 100).toFixed(0) + 'px;top:' + (13 + W * .625 * p[1] / 100).toFixed(0) + 'px">' + (i + 1) + '</button>'; }).join('') + '</div>' + lst(P.map(function (p) { return [p[2], p[3]]; })) + '</div>';
    var s = VK.steps(el, P.length, function (i) { qa('.d-pin', el).forEach(function (p, k) { p.classList.toggle('on', k === i); }); qa('.d-ls li', el).forEach(function (l, k) { l.classList.toggle('on', k === i); }); });
    qa('.d-pin,.d-ls li', el).forEach(function (p) { p.addEventListener('click', function (e) { e.stopPropagation(); s.go(+p.getAttribute('data-i')); }); }); }
  /* 一张照片上演示运镜（CSS 动画），换照片换动作 */
  function moveBox(src, m) { return '<div class="d3-mv nozoom"><img class="' + (m || '') + '" src="' + src + '" alt=""></div>'; }
  function setMove(box, src, m) { var im = q('img', box); im.className = ''; void im.offsetWidth; if (src) im.src = src; im.className = m || ''; }

  /* ================= 八件作品 ================= */
  function cvv(n) { return '<img class="cvi" src="' + P3(n + '.jpg') + '" alt=""><video class="cvv" src="' + P3(n + '.mp4') + '" muted loop playsinline preload="none"></video>'; }
  var WORKS = [
    { cls: 'ci', cover: '苏轼的一生', art: cvv('v-sushi'), name: '《苏轼的一生》', from: '团队编写的讲稿，年份逐条核对', say: '93 秒教学短片，用于课堂导入。', tags: ['图生视频', '配音', '字幕'], v: 'v-sushi' },
    { cls: 'ci', cover: '桃花源记', art: cvv('v-taohua'), name: '《桃花源记》', from: '课文原文', say: '60 秒课文短片，字幕与原文一致。', tags: ['图生视频', '配音', '字幕'], v: 'v-taohua' },
    { cls: 'ci', cover: '老照片<br>动起来', art: cvv('v-old1'), today: 1, name: '老照片动起来', from: '第 2 天修复的校史老照片', say: '镜头缓慢推进，画面自然动起来。', tags: ['图生视频'], v: 'v-old1' },
    { cls: 'ci', cover: '15 秒<br>校园短片', art: cvv('v-short'), today: 1, name: '15 秒校园短片', from: '三张校园照片', say: '三个镜头，三种运镜。', tags: ['多图参考', '运镜'], v: 'v-short' },
    { cls: 'ci w', cover: '吉祥物讲解', art: cvv('v-mascot'), today: 1, name: '吉祥物讲解', from: '第 2 天的吉祥物、讲解词', say: '配音后用数字人应用驱动口型。', tags: ['语音合成', '数字人'], v: 'talk' },
    { cls: 'ci', cover: '冬至<br>节气祝福', art: cvv('v-solar'), name: '节气祝福', from: '第 2 天的冬至海报', say: '竖版，镜头缓慢上升。', tags: ['图生视频', '竖版'], v: 'v-solar' },
    { cls: 'ci', cover: '绘本动画', art: cvv('v-book'), name: '绘本动画', from: '第 2 天的绘本插画', say: '镜头横移，讲一页故事。', tags: ['图生视频'], v: 'v-book' },
    { cls: 'ci', cover: '航拍校园', art: cvv('s1'), name: '航拍校园', from: '学校航拍照片', say: '航拍视角，镜头向前推进。', tags: ['图生视频', '运镜'], v: 's1' }];
  function openWork(el, i) { var w = WORKS[i];
    var m = VK.modal(el, '<div class="d3-mo">' + (w.v === 'talk' ? talk('big') : '<video src="' + P3(w.v + '.mp4') + '" poster="' + P3(w.v + '.jpg') + '" controls autoplay playsinline></video>') + '</div>'); bindTalk(m); var v = q('video', m); if (v && w.v === 'talk') v.play(); }

  /* ================= 篇一 成果展示 ================= */
  VIZ['今日安排'] = function (el) {
    var A = [['上午', [['10:00', '成果展示', '作业回顾与成果一览'], ['10:20', 'AI 视频的关键', '原理、镜头语言与规范'], ['11:00', 'RunningHub 视频功能', '模型、应用与计费']]], ['下午', [['14:00', '案例一', '老照片动起来'], ['14:40', '案例二', '15 秒校园短片'], ['15:40', '案例三', '让吉祥物开口说话'], ['16:30', '首映会与总结', '观看投票、作业']]]];
    el.innerHTML = '<div class="d-ag">' + A.map(function (r, k) { return '<div class="d-ag-r in" style="--i:' + k * 2 + '"><span class="d-ag-k">' + r[0] + '</span><div class="d-ag-l">' + r[1].map(function (t) { return '<div class="d-ag-i"><b>' + t[0] + '</b><h3>' + t[1] + '</h3><p>' + t[2] + '</p></div>'; }).join('') + '</div></div>'; }).join('') +
      '<div class="d-ag-o in" style="--i:5"><span class="d-k">今日成果</span><span class="d-pill y">动起来的老照片</span><span class="d-pill y">15 秒校园短片</span><span class="d-pill y">吉祥物讲解</span><span class="d-pill k">首映会</span></div></div>';
  };
  VIZ['第 2 天作业回顾'] = function (el) {
    var P = [[2, '第 2 名', 'hw-2'], [1, '第 1 名', 'hw-1'], [3, '第 3 名', 'hw-3']];
    el.innerHTML = '<div class="d2-pd">' + P.map(function (p, i) { return '<div class="d2-pd-c in r' + p[0] + '" style="--i:' + i + '"><div class="d2-pd-i">' + VK.slot(p[2], '第 2 天作业截图（前三名）', '<div class="d2-pd-ph">' + ic('photo') + '</div>').replace('img/d1/', 'img/d3/') + '</div><div class="d2-pd-b"><b>' + p[0] + '</b><span>' + p[1] + '</span></div></div>'; }).join('') + '</div><div class="d-line in" style="--i:4;margin-top:26px">每份作业由作者用 <b>1 分钟</b>说明做法</div>';
    qa('.slot', el).forEach(function (s) { var n = s.getAttribute('data-slot'), im = new Image(); im.onload = function () { im.className = 'slot-i'; s.appendChild(im); s.classList.add('ok'); }; im.src = P3(n + '.jpg'); });
  };
  VIZ['视频创作成果展示'] = function (el) {
    VK.wall(el, WORKS, ['成果展示', '视频创作成果展示', ''], function (i) { openWork(el, i); });
    qa('.alb', el).forEach(function (a) { var v = q('.af .cvv', a); if (!v) return; a.addEventListener('pointerenter', function () { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); v.classList.add('on'); }); a.addEventListener('pointerleave', function () { if (!a.classList.contains('act')) { v.pause(); v.classList.remove('on'); } }); });
  };
  VIZ['今日实操案例'] = function (el) {
    var D = [vid('v-old1'), vid('v-short'), talk()], T = ['照片变成 5 秒动态画面', '三张照片合成一条短片', '配音加口型驱动'];
    el.innerHTML = '<div class="d3-tri">' + D.map(function (d, i) { return '<div class="d3-tri-c in" style="--i:' + i + '"><div class="d3-tri-v' + (i === 2 ? ' w' : '') + '">' + d + '</div><div class="d-tri-t"><i>' + CASE[i][0] + '</i><div><h3>' + CASE[i][1] + '</h3><p>' + T[i] + '</p></div></div></div>'; }).join('') + '</div>';
    bindTalk(el);
  };
  VIZ['岗位适配'] = function (el) {
    el.innerHTML = '<div class="d-rl"><div class="d-rl-a">' + RN.map(function (r, i) { return '<button class="d-rl-b in" style="--i:' + i + '" data-i="' + i + '">' + av(i) + r + '</button>'; }).join('') + '</div><div class="d-rl-c">' + CASE.map(function (c, k) { return '<div class="d-rl-i in" style="--i:' + (k + 4) + '"><div class="d-k"><b>' + c[0] + '</b>案例' + '一二三'[k] + ' · ' + c[1] + '</div><h3></h3></div>'; }).join('') + '</div></div>';
    function set(i) { qa('.d-rl-b', el).forEach(function (b, k) { b.classList.toggle('on', k === i); }); qa('.d-rl-i h3', el).forEach(function (h, k) { h.style.opacity = 0; VK.later(function () { h.textContent = ROLE[i][k]; h.style.opacity = 1; }, 220); }); }
    var s = VK.steps(el, 4, set); qa('.d-rl-b', el).forEach(function (b, i) { b.addEventListener('click', function () { s.go(i); }); });
  };

  /* ================= 篇二 AI 视频的关键 ================= */
  VIZ['同一场景的两种生成'] = function (el) {
    var T = [['画面是 AI 想象的校园', '建筑不是我们的学校', '每次生成差别很大'], ['第一帧是学校的真实照片', '建筑和环境保持一致', '只需描述动作和运镜']];
    el.innerHTML = '<div class="d3-two" data-s="0"><div class="a"><span class="d-pill t">文生视频 · 一句话</span><div class="d3-fr">' + vid('v-t2v') + '</div><div class="d2-tl">' + T[0].map(function (t, i) { return '<span class="d-pill r" style="--i:' + i + '">✕ ' + t + '</span>'; }).join('') + '</div></div><div class="b"><span class="d-pill y">图生视频 · 照片 + 一句话</span><div class="d3-fr">' + vid('v-i2v') + '</div><div class="d2-tl">' + T[1].map(function (t, i) { return '<span class="d-pill g" style="--i:' + i + '">✓ ' + t + '</span>'; }).join('') + '</div></div></div>';
    VK.steps(el, 3, function (i) { q('.d3-two', el).setAttribute('data-s', i); });
  };
  VIZ['视频生成的原理'] = function (el) {
    var S = [['一段视频，是一张张连续的画面', '每秒约 25 张。5 秒的镜头，就是 125 张画面。'], ['图生视频：第一张是你给的照片', '画面里的建筑、人物、颜色，都从这一张出发。'], ['后面每一张，都参照前一张', '既要接近上一张，又要朝提示词描述的动作变化一点。'], ['时间越长，偏差越大', '每一张的小偏差会累积，人脸、建筑可能慢慢走样。单个镜头控制在 5 秒左右。']];
    el.innerHTML = '<div class="d3-pr"><div class="d3-fs">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<div class="d3-fm" style="--i:' + i + '"><img src="' + P3('f' + i + '.jpg') + '" alt=""><span>' + (i ? '第 ' + (i * 15 + 1) + ' 张' : '第 1 张') + '</span><i>→</i></div>'; }).join('') + '</div><div class="d3-pr-b"><div class="d3-fr s">' + vid('v-short') + '</div><div><h3></h3><p class="d-p"></p></div></div></div>';
    VK.steps(el, S.length, function (i) { var r = q('.d3-pr', el); r.setAttribute('data-s', i); q('.d3-pr-b h3', el).textContent = S[i][0]; q('.d3-pr-b .d-p', el).textContent = S[i][1]; });
  };
  VIZ['镜头语言：景别与运镜'] = function (el) {
    var JB = [['远景', 1, '50% 50%'], ['全景', 1.6, '0% 25%'], ['中景', 2.4, '10% 33%'], ['近景', 3.4, '17% 36%'], ['特写', 5, '21% 38%']], src = 'img/campus/c06.jpg';
    el.innerHTML = '<div class="d3-ln"><div class="d3-jb">' + JB.map(function (j, i) { return '<div class="d3-jb-i in" style="--i:' + i + '"><div style="background-image:url(' + src + ');background-size:' + (j[1] * 100) + '% auto;background-position:' + j[2] + '"></div><b>' + j[0] + '</b></div>'; }).join('') + '</div><div class="d3-ln-m">' + moveBox(src, '') + '<div class="d3-ln-r"><div class="d-k">运镜</div><div class="d3-mt">' + MOVES.map(function (m, i) { return '<button data-i="' + i + '"><b>' + m[0] + '</b><span>' + m[1] + '</span></button>'; }).join('') + '</div></div></div></div>';
    var box = q('.d3-mv', el), s = VK.steps(el, MOVES.length, function (i) { qa('.d3-mt button', el).forEach(function (b, k) { b.classList.toggle('on', k === i); }); setMove(box, null, MOVES[i][2]); });
    qa('.d3-mt button', el).forEach(function (b) { b.addEventListener('click', function () { s.go(+b.getAttribute('data-i')); }); });
  };
  VIZ['一个镜头的提示词'] = function (el) {
    var E = [['主体', '重庆师范大学图书馆和门前的湖面'], ['动作', '湖面泛起微波，树叶随风轻轻摆动'], ['运镜', '镜头缓慢向前推进'], ['氛围', '清晨，柔和的阳光'], ['时长', '5 秒']];
    el.innerHTML = '<div class="d3-sp"><div class="d3-fr">' + vid('s1') + '</div><div class="d3-sp-r"><div class="d-k">一个镜头的五要素</div><div class="d3-sp-l">' + E.map(function (e, i) { return '<div data-i="' + i + '"><b>' + e[0] + '</b><span>' + e[1] + '</span></div>'; }).join('') + '</div><div class="d3-sp-p"><span class="d-k">完整提示词</span><p></p></div></div></div>';
    var s = VK.steps(el, E.length, function (i) { qa('.d3-sp-l>div', el).forEach(function (d, k) { d.classList.toggle('on', k <= i); d.classList.toggle('nw', k === i); }); q('.d3-sp-p p', el).innerHTML = E.slice(0, i + 1).map(function (e, k) { return '<span class="' + (k === i ? 'nw' : '') + '">' + e[1] + '</span>'; }).join('，') + '。'; });
    qa('.d3-sp-l>div', el).forEach(function (d) { d.addEventListener('click', function () { s.go(+d.getAttribute('data-i')); }); });
  };
  VIZ['当前的能力边界'] = function (el) {
    check(el, [['人', '人物一致', '同一个人在多个镜头中容易“换脸”', '对策：用同一张参考图，镜头拆短'], ['手', '复杂动作', '手部、奔跑、舞蹈等动作容易变形', '对策：动作幅度小，以运镜为主'], ['字', '字幕与口型', '画面中的中文常出现乱码', '对策：不让模型写字，字幕另加'], ['片', '一键成片', '长视频难以一次生成到位', '对策：拆成 5 秒镜头，由人来把关']]);
  };
  VIZ['声音：配音、配乐与数字人'] = function (el) {
    el.innerHTML = '<div class="d3-snd"><div class="d3-snd-c in"><span class="d3-ic">♪</span><h3>配音</h3><p>语音合成：选音色、调语速和停顿。声音克隆须本人同意。</p><audio src="' + P3('voice.m4a') + '" controls preload="metadata"></audio></div><div class="d3-snd-c in" style="--i:1"><span class="d3-ic">♫</span><h3>配乐</h3><p>按风格生成背景音乐。对外发布注意版权和使用范围。</p><div class="d3-eq">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { return '<i style="--i:' + i + '"></i>'; }).join('') + '</div></div><div class="d3-snd-c in w" style="--i:2"><span class="d3-ic">☺</span><h3>数字人</h3><p>形象 + 配音 + 口型驱动。优先使用虚拟形象。</p>' + talk('sm') + '</div></div>';
    bindTalk(el);
  };
  VIZ['课堂互动：猜运镜'] = function (el) {
    var R = [['img/campus/c07.jpg', 0], ['img/campus/c09.jpg', 3], ['img/campus/c12.jpg', 1], ['img/campus/c01.jpg', 4]];
    el.innerHTML = '<div class="d3-gs"><div><div class="d-k" style="margin:0 0 12px 6px"></div>' + moveBox(R[0][0], '') + '</div><div class="d3-gs-r"><div class="d3-mt sm">' + MOVES.map(function (m) { return '<button disabled><b>' + m[0] + '</b><span>' + m[1] + '</span></button>'; }).join('') + '</div><div style="display:flex;gap:10px;margin-top:20px"><button class="d-btn" data-g="wheel:num" data-gt="抽取一位老师作答">抽取答题人</button><button class="d-btn w" data-g="timer:1" data-gt="30 秒作答">计时</button></div></div></div>';
    var box = q('.d3-mv', el);
    VK.steps(el, R.length * 2, function (i) { var r = R[i >> 1], show = i % 2; q('.d3-gs .d-k', el).textContent = '第 ' + ((i >> 1) + 1) + ' 轮 · 这是哪一种运镜？';
      if (!show) setMove(box, r[0], MOVES[r[1]][2]); qa('.d3-mt button', el).forEach(function (b, k) { b.classList.toggle('on', show && k === r[1]); }); });
  };

  /* ================= 篇三 RunningHub 的视频功能（官网截图，2026 年 11 月） ================= */
  VIZ['常用视频模型'] = function (el) {
    var M = [['Seedance 2.5', '多模态参考', '可上传多张图片、视频、音频作参考，生成较长的视频'], ['MiniMax H3', '多镜头叙事', '面向长时序、多镜头的视频生成'], ['WAN 3.0', '图生视频', '常用的开源视频模型，很多 AI 应用基于它'], ['RH Upscale', '视频超分', '把视频放大、变清晰']];
    el.innerHTML = '<div class="d3-md"><div>' + VK.lap(VK.shot('img/d2/rh-home.jpg', 1), 640) + '</div><div class="d3-md-c">' + M.map(function (m, i) { return '<div class="in" style="--i:' + i + '"><h3>' + m[0] + '</h3><span class="d-pill ' + (i ? 't' : 'y') + '">' + m[1] + '</span><p>' + m[2] + '</p></div>'; }).join('') + '<div class="d-tip in" style="--i:5"><b>课堂</b>使用封装好的 AI 应用即可，不必自己选模型。</div></div></div>';
  };
  VIZ['图生视频的使用界面'] = function (el) { pinPage(el, rh({ title: '老照片动起来', tags: '图生视频', star: 7, like: 1, runs: '186', fields: [['image', P3('../d2/old1-after.jpg')], ['text', PROMPT.p1move, 'txt']], res: [vid('v-old1')] }), [[10, 33, '上传第一帧', '修复后的老照片，或校园照片'], [18, 60, '动作和运镜', '写清画面怎么动、镜头怎么动'], [29.5, 71.5, '计费说明', '按生成时长计费'], [13, 78, '立即运行', '一般需要几分钟，可以离开页面'], [62, 50, '我的生成', '播放、下载生成的视频']]); };
  VIZ['多图参考与首尾帧'] = function (el) {
    el.innerHTML = '<div class="d-2"><div class="in"><div class="d-stage" style="--b:340px">' + VK.lap(VK.shot(P3('rh-dv_sd.jpg'), 1), 600) + '</div><h3>多图参考</h3><p>上传几张图，在一条视频中依次用到，适合把几张照片串成短片。</p></div><div class="in" style="--i:1"><div class="d3-ff"><div><img src="img/campus/c09.jpg" alt=""><span class="d-pill">首帧</span></div><div class="d3-ff-m">' + vid('v-ff') + '<span class="d-pill y">模型补出中间过程</span></div><div><img src="img/campus/c12.jpg" alt=""><span class="d-pill">尾帧</span></div></div><h3>首尾帧</h3><p>给定开头和结尾两张图，由模型补出中间的过程。</p></div></div>';
  };
  VIZ['数字人与配音'] = function (el) {
    el.innerHTML = '<div class="d-ws"><div>' + VK.lap(rh({ title: '数字人对口型', tags: '音频生成 · 图生视频 · 数字人', star: 12, like: 3, runs: '299', fields: [['音频', '吉祥物讲解配音.mp3', 'aud'], ['图片', 'img/d2/mascot.jpg'], ['文案', PROMPT.p3script, 'txt']], res: [talk()] }), 760, 1440) + '</div><div class="d-rw">' + [['photo', '一张形象图', '优先使用虚拟形象，例如第 2 天的吉祥物'], ['say', '一段配音', '用语音合成应用生成，也可以上传录音'], ['loop', '口型驱动', '模型让形象的口型跟着声音动起来']].map(function (r, i) { return '<div class="in" style="--i:' + i + '">' + ic(r[0]) + '<div><h3>' + r[1] + '</h3><p>' + r[2] + '</p></div></div>'; }).join('') + '</div></div>';
    bindTalk(el);
  };
  VIZ['计费方式'] = function (el) {
    el.innerHTML = '<div class="d2-sm">' + [['clock', '按时长计费', '生成的视频越长，费用越高'], ['star', '先试 5 秒', '效果满意后，再生成完整长度'], ['check', '运行前查看', '每个应用都有“计费说明”']].map(function (c, i) { return '<div class="in" style="--i:' + i + '">' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div><div class="d-line in" style="--i:4;margin-top:40px">时长越长，费用越高，<b>也越容易走样</b>。</div>';
    q('.d2-sm', el).classList.add('d3-ic3');
  };
  VIZ['收藏今日应用'] = function (el) { el.innerHTML = '<div class="d-ok"><div>' + cks(['老照片动起来（图生视频）', '多图参考视频（Seedance 2.5 多模态）', '语音合成', '数字人对口型']) + '</div><div class="d-ok-b"><button class="d-big" data-g="timer:5" data-gt="收藏今日应用" data-gn="搜索并收藏四个应用">计时<small>5 分钟</small></button></div></div>'; bindCk(el); };

  /* ================= 篇四 案例一：老照片动起来 ================= */
  var C1 = '案例一：老照片动起来｜';
  VIZ[C1 + '案例介绍'] = function (el) {
    el.innerHTML = '<div class="d3-in"><div class="d3-in-a in"><img class="zimg" src="img/d2/old1-after.jpg" alt=""><span class="d-pill">修复后的老照片</span></div><div class="d-arr in" style="--i:1">→</div><div class="d3-in-b in" style="--i:2"><div class="d3-fr">' + vid('v-old1') + '</div><span class="d-pill y">5 秒动态画面</span></div></div>';
  };
  VIZ[C1 + '应用场景'] = function (el) { useFor(el, 0, '一张照片 → 5 秒', '同类任务：校史展览、纪念日推送、课堂导入'); };
  VIZ[C1 + '操作步骤'] = function (el) { el.innerHTML = '<div class="d-hw"><div>' + st([['搜索“老照片动起来”，打开应用', '先看运行次数和示例作品'], ['上传第 2 天修复后的照片'], ['填写动作和运镜', '复制右侧的提示词'], ['选择 5 秒，点击“立即运行”', '在“我的生成”中播放、下载', 1]]) + '</div>' + pr('填写到应用的提示词框', PROMPT.p1move, 'b') + '</div>'; q('.d-pr', el).style.cssText = 'flex:none;align-self:center'; bind(el); };
  VIZ[C1 + '课堂实操'] = function (el) { doNow(el, 10, '完成一段 5 秒动态画面', ['“我的生成”中出现视频', '人物和建筑没有变形', '已下载到本机'], VK.lap(rh({ title: '老照片动起来', tags: '图生视频', star: 7, like: 1, runs: '186', fields: [['image', 'img/d2/old2-after.jpg'], ['text', PROMPT.p1move, 'txt']], res: [vid('v-old2')] }), 760, 1440)); };
  VIZ[C1 + '成果核对'] = function (el) { check(el, [['脸', '人物面部', '五官没有变形、没有“换脸”'], ['楼', '建筑', '线条没有扭曲、没有融化'], ['增', '有无添加', '没有出现原图中没有的人和物'], ['动', '动作', '动作自然、幅度适中']]); };
  VIZ[C1 + '迭代优化'] = function (el) { var U = [['动作幅度调小', PROMPT.p1slow], ['只动镜头', PROMPT.p1still], ['换一个应用对比', '同一张照片，在另一个“图生视频”应用中再生成一次，挑选更自然的一段']];
    el.innerHTML = '<div class="d-up d2-up-w">' + U.map(function (u, i) { return '<div class="in" style="--i:' + i + '"><h3><span class="d-n">' + (i + 1) + '</span>' + u[0] + '</h3>' + (i < 2 ? '<div class="d-ub" data-raw="' + raw(u[1]) + '">' + mark(u[1]) + '<button type="button" class="d-cp">复制</button></div>' : '<div class="d-ub" style="padding-right:30px">' + u[1] + '</div>') + '</div>'; }).join('') + '</div>'; bind(el); };

  /* ================= 篇五 案例二：15 秒校园短片 ================= */
  var C2 = '案例二：15 秒校园短片｜', SB = [['c01', '航拍校园全貌', '推', '0–5 秒'], ['c09', '泛月桥与湖面', '移', '5–10 秒'], ['c12', '夕阳下的教学楼', '拉', '10–15 秒']];
  function board(on) { return '<div class="d3-sb">' + SB.map(function (b, i) { return '<div class="d3-sb-r' + (on != null && i > on ? ' off' : '') + '"><b>' + (i + 1) + '</b><img src="img/campus/' + b[0] + '.jpg" alt=""><div><h4>' + b[1] + '</h4><span>' + b[3] + '</span></div><span class="d-pill y">' + b[2] + '</span></div>'; }).join('') + '</div>'; }
  VIZ[C2 + '案例介绍'] = function (el) {
    el.innerHTML = '<div class="d3-in"><div class="in">' + board() + '</div><div class="d-arr in" style="--i:1">→</div><div class="d3-in-b in" style="--i:2"><div class="d3-fr">' + vid('v-short') + '</div><span class="d-pill y">15 秒短片</span></div></div>';
  };
  VIZ[C2 + '应用场景'] = function (el) { useFor(el, 1, '3 张照片 → 15 秒', '同类任务：专业介绍、活动预告、招生短片'); };
  VIZ[C2 + '操作步骤'] = function (el) { flow(el, [['写分镜表', '镜号、画面、运镜、时长，每个镜头一种运镜', '<div class="in">' + board() + '<div class="d-tip" style="margin-top:14px"><b>要点</b>一个镜头只做一件事，5 秒左右。</div></div>'], ['上传三张照片，填写提示词', 'Seedance 2.5 多模态应用：按顺序上传图 1、图 2、图 3', '第二步 · 填写到多图参考应用', PROMPT.p2film, 'b'], ['核对后下载', '对照分镜表检查镜头顺序', '<div class="d2-ck4 in"><div class="d3-fr s">' + vid('v-short') + '</div><div>' + cks(['镜头顺序与分镜一致', '建筑与实景一致', '画面中没有乱码文字']) + '</div></div>']]); };
  VIZ[C2 + '课堂实操'] = function (el) { doNow(el, 15, '完成一条 15 秒短片', ['分镜表已写好', '三个镜头按顺序出现', '已下载到本机'], VK.lap(rh({ title: 'Seedance2.5多模态视频', tags: '视频生视频 · 图生视频', star: 128, like: 39, runs: '3547', mode: 'Lite', fields: [['上传图片1', 'img/campus/c01.jpg'], ['提示词', PROMPT.p2film, 'txt']], res: [vid('v-short')] }), 760, 1440)); };
  VIZ[C2 + '成果核对'] = function (el) { check(el, [['景', '建筑与实景', '与照片中的学校建筑一致'], ['序', '镜头顺序', '与分镜表一致，过渡自然'], ['字', '画面文字', '没有出现乱码文字'], ['乐', '配乐', '确认可以用于对外发布']]); };
  VIZ[C2 + '迭代优化'] = function (el) { var U = [['只改一个镜头', PROMPT.p2one], ['换一种配乐', PROMPT.p2music], ['改为竖版', PROMPT.p2vert]];
    el.innerHTML = '<div class="d-up d2-up-w">' + U.map(function (u, i) { return '<div class="in" style="--i:' + i + '"><h3><span class="d-n">' + (i + 1) + '</span>' + u[0] + '</h3><div class="d-ub" data-raw="' + raw(u[1]) + '">' + mark(u[1]) + '<button type="button" class="d-cp">复制</button></div></div>'; }).join('') + '</div>'; bind(el); };
  VIZ[C2 + '沉淀为模板'] = function (el) { el.innerHTML = '<div class="d-hw"><div>' + st([['把会变的部分标出来', '照片数量、时长、主题、运镜、配乐'], ['收藏多图参考应用'], ['下次换照片，只改【】里的内容', '镜头结构保持一致', 1]]) + '</div>' + pr('分镜提示词模板 · 【】里换成新内容', PROMPT.p2tpl, 's') + '</div>'; q('.d-pr', el).style.cssText = 'flex:none;align-self:center'; bind(el); };

  /* ================= 篇六 案例三：让吉祥物开口说话 ================= */
  var C3 = '案例三：让吉祥物开口说话｜';
  VIZ[C3 + '案例介绍'] = function (el) {
    el.innerHTML = '<div class="d3-in"><div class="d3-tk3">' + [['img/d2/mascot.jpg', '形象图', '第 2 天的吉祥物'], ['', '讲解词', '30 秒约 120 字'], ['', '配音', '语音合成']].map(function (x, i) { return '<div class="in" style="--i:' + i + '">' + (x[0] ? '<img src="' + x[0] + '" alt="">' : i === 1 ? '<p class="d3-scr">' + PROMPT.p3script + '</p>' : '<audio src="' + P3('voice.m4a') + '" controls preload="metadata"></audio>') + '<b>' + x[1] + '</b><span>' + x[2] + '</span></div>'; }).join('') + '</div><div class="d-arr in" style="--i:3">→</div><div class="d3-in-b in" style="--i:4">' + talk() + '<span class="d-pill y">讲解视频</span></div></div>';
    bindTalk(el);
  };
  VIZ[C3 + '应用场景'] = function (el) { useFor(el, 2, '一个形象，开口讲解', '同类任务：新生入学指南、展馆讲解、课程导学'); };
  VIZ[C3 + '操作步骤'] = function (el) { flow(el, [['写讲解词', '30 秒约 120 字；年份、数字先核对', '第一步 · 讲解词', PROMPT.p3script, 'b'], ['生成配音', '语音合成应用：粘贴讲解词，选择音色，下载 MP3', '第二步 · 配音设置', PROMPT.p3voice, 'b'], ['口型驱动', '数字人对口型应用：上传形象图和配音', '第三步 · 数字人对口型', PROMPT.p3dh, 'b']]); };
  VIZ[C3 + '成果核对'] = function (el) { check(el, [['实', '事实', '年份、数字、名称准确'], ['读', '读音', '多音字、数字读法正确'], ['口', '口型', '口型与声音对齐'], ['形', '形象', '吉祥物没有走样']]); };
  VIZ[C3 + '课后完成'] = function (el) { el.innerHTML = '<div><div class="d-fl" style="grid-template-columns:repeat(3,1fr)">' + [['TXT', '讲解词', '已核对事实'], ['MP3', '配音', '读音已检查'], ['MP4', '讲解视频', '30 秒以内']].map(function (f, i) { return '<div class="in" style="--i:' + i + '"><span class="d-fi">' + f[0] + '</span><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div>'; }).join('') + '</div><div class="d-line in" style="--i:5;margin-top:44px">课后完成，<b>通过工牌提交</b>。</div></div>'; };

  /* ================= 篇七 首映会与总结 ================= */
  VIZ['首映会'] = function (el) { el.innerHTML = '<div class="d-ok"><div><div class="d-k" style="margin-bottom:14px">每部作品播放一遍</div>' + cks(['作者用一句话介绍作品', '看完用工牌投票，每人每部一票']) + '<div style="display:flex;gap:10px;margin-top:28px"><button class="d-btn w" data-g="timer:1" data-gt="作者介绍">计时</button></div></div><div class="d-ok-b"><button class="d-big" data-g="wheel:num" data-gt="抽取下一部作品">抽取<small>播放顺序</small></button></div></div>'; bindCk(el); };
  VIZ['今日小结'] = function (el) { el.innerHTML = '<div><div class="d3-sm3">' + [vid('v-old1'), vid('v-short'), talk()].map(function (d, i) { return '<div class="in" style="--i:' + i + '"><div class="d3-sm3-v">' + d + '</div><h3>' + ['动起来的老照片', '15 秒校园短片', '吉祥物讲解'][i] + '</h3><p>' + ['图生视频', '多图参考', '配音 + 口型驱动'][i] + '</p></div>'; }).join('') + '</div><div class="d-six in" style="--i:4"><span class="d-k" style="align-self:center;margin-right:6px">一个镜头的五要素</span>' + ['主体', '动作', '运镜', '氛围', '时长'].map(function (s) { return '<span class="d-pill">' + s + '</span>'; }).join('') + '</div></div>'; bindTalk(el); };
  VIZ['课后作业'] = function (el) { el.innerHTML = '<div class="d-hm"><div class="d-hm-n in"><b>3</b><span>段视频</span></div><div><div class="d-chips in" style="--i:1;justify-content:flex-start;margin-bottom:22px;padding-left:10px"><span class="d-pill">姓名_老照片</span><span class="d-pill">姓名_校园短片</span><span class="d-pill">姓名_讲解</span></div>' + st([['在工牌上选择“交作业”', '屏幕显示上传二维码'], ['微信扫码，上传文件', '提示上传成功'], ['次日上课前查看工牌', '显示成绩与排名', 1]]) + '</div></div>'; };
  VIZ['次日准备'] = function (el) { el.innerHTML = '<div><div class="d-sm" style="grid-template-columns:1fr 1fr;max-width:1000px;margin:0 auto">' + [['doc', '想好一场活动', '本单位最近举办或即将举办的'], ['folder', '带上活动材料', '通知或新闻稿、几张现场照片']].map(function (c, i) { return '<div class="in" style="--i:' + i + '">' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div><div class="d-line in" style="--i:3;margin-top:44px"><b>第 4 天</b>一场活动的宣传，一次出齐</div></div>'; };
})();
