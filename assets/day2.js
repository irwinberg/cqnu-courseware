/* 第 2 天每一页的画面。键 = “章名｜页标题”或“页标题”，和 课程内容_v1.md 卷二的标题一一对应。
   公共部件：viz-kit.js（VK：样机、成果墙、转盘计时）、day1.js 导出的 window.DK（图标、提示词卡、步骤、勾选、人物头像）。版式在 day1.css + day2.css。
   操作：→ 或 ↓ 走这一页的下一步（走完翻页），← 或 ↑ 退一步；按住 Shift 直接翻页。点电脑、手机、图片可以放大。
   图片都在 img/d2/。示意图（Codex 生成）换成 RunningHub 实跑的结果时，用同名 .jpg 覆盖即可，清单见《第2天_待准备素材.md》。
   第 2 天只用 RunningHub；提示词都在下面的 PROMPT 里，和《第2天_提示词.md》是同一份。画面上不放“AI 生成”标识（用户定的）。 */
(function () {
  'use strict';
  var DAY = +(new URLSearchParams(location.search).get('d')) || 0;
  if (!window.DK) return;
  var VIZ = DAY === 2 ? (window.VIZ = window.VIZ || {}) : {}, VK = window.VK, q = VK.q, qa = VK.qa, K = window.DK;
  var ic = K.ic, pr = K.pr, bind = K.bind, st = K.st, cks = K.cks, bindCk = K.bindCk, av = K.av, RN = K.RN, mark = K.mark, raw = K.raw;
  var G = function (n) { return n.indexOf('/') > -1 ? n : 'img/d2/' + n + '.jpg'; };      // 带路径的原样用（第 3 天起传完整路径）
  var img = function (n, cls) { return '<img class="zimg ' + (cls || '') + '" src="' + G(n) + '" alt="">'; };
  var CASE = [['修', '老照片修复'], ['设', '活动海报'], ['创', '吉祥物与表情包']];
  var ROLE = [['校史馆老照片', '校庆、讲座活动海报', '学校或学院吉祥物'], ['院史资料照片', '学院活动、招生海报', '学院形象 IP'], ['课件中的历史图片', '课堂活动、比赛海报', '课件中的引导角色'], ['家庭老照片', '社团活动海报', '社团吉祥物、个人头像']];

  /* ================= 提示词（实测后在这里改） ================= */
  var PROMPT = {
    p1fix: '修复照片中的划痕、污渍、折痕和褪色，并进行自然上色。保持人物五官、表情、服装、建筑和构图完全不变，不添加原图中没有的任何内容，保留老照片的胶片质感。',
    p1bw: '只修复划痕、污渍和折痕，不要上色，保持黑白照片的原貌。',
    p1face: '人物面部保持原样，不要美化，不要改变五官和年龄感。',
    p2poster: '竖版校园活动海报，3:4。画面：清晨阳光下的大学校园与古朴教学楼，远处有桥和湖面倒影，前景是翻开的书本与飘落的银杏叶，暖金色与重师红点缀，写实摄影风格。画面上方三分之一是干净的天空，居中写主标题“弦歌百廿 立范育人”（白色宋体，加粗），下方一行小字副标题“重庆师范大学初等教育学院办学120周年”。除标题和副标题外不要任何文字，不要任何标志。',
    p2badge: '把第二张图（学校官方校徽校名组合）放在第一张海报的底部居中，宽度约为画面的 40%。校徽必须保持原图的形状、比例、颜色和文字，不能重画、不能变形；海报的其他部分保持不变。',
    p2season: '保持画面构图、建筑和视角不变，把季节改为冬日雪后的清晨：屋顶、树枝和桥上覆盖薄雪，柔和的蓝白色光线，部分窗户透出暖光。上方三分之一保持干净的天空。不要任何文字和标志。',
    p2tpl: '竖版校园活动海报，3:4。画面：【季节和时间】的大学校园与【主体建筑】，前景是【和活动相关的物品】，【主色】点缀，写实摄影风格。画面上方三分之一是干净的天空，居中写主标题“【主标题】”（白色宋体，加粗），下方一行小字副标题“【副标题】”。除标题和副标题外不要任何文字，不要任何标志。',
    p3need: '形象：【一种动物或物品，和学院特色有关】\n代表色：【优先使用学校标准色，例如重师红】\n标志物：【一件能代表学院的小物件，例如书本、学士帽】\n\n想好以后，把这三项替换进第二步的提示词。',
    p3design: 'Q 版吉祥物设计，一只圆滚滚的小熊猫，戴学士帽，围一条重师红色围巾，胸前挂一本小书，大眼睛，表情友善，扁平插画风，粗描边，纯白背景，正面全身，角色设定图',
    p3emoji: '同一个角色，8 个表情：收到、加油、点赞、谢谢、开心、震惊、在吗、晚安。白底，表情包风格，每个表情下方配对应的文字，排成 4×2 的网格。'
  };
  window.D2_PROMPT = PROMPT;

  /* ================= 公共部件 ================= */
  /* 一张海报：画面 + 标题 + 官方校徽文件（layers 控制显示哪几层）。示意图的标题是叠上去的，实际由模型直接生成 */
  function poster(base, layers) { var L = layers || [1, 1, 1, 1];
    return '<div class="d2-pt">' + (L[0] ? '<img class="b" src="' + G(base || 'poster-base') + '" alt="">' : '<div class="b0"></div>') + (L[1] ? '<div class="t"><b>弦歌百廿 立范育人</b><span>重庆师范大学初等教育学院办学120周年</span></div>' : '') + (L[2] ? '<img class="lg" src="img/brand/cqnu-combo-white.png" alt="">' : '') + '</div>'; }
  /* 拖动对比：左边是处理前，右边是处理后 */
  function compare(a, b, la, lb) { return '<div class="d2-cmp nozoom" style="--p:50%"><img src="' + G(b) + '" alt=""><div class="a"><img src="' + G(a) + '" alt=""></div><i class="h"><b>⟷</b></i><span class="la">' + (la || '修复前') + '</span><span class="lb">' + (lb || '修复后') + '</span></div>'; }
  function bindCompare(el) { qa('.d2-cmp', el).forEach(function (c) { var drag = false; function set(e) { var r = c.getBoundingClientRect(); c.style.setProperty('--p', Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)).toFixed(1) + '%'); }
    c.addEventListener('pointerdown', function (e) { drag = true; c.classList.add('drag'); c.setPointerCapture(e.pointerId); set(e); }); c.addEventListener('pointermove', function (e) { if (drag) set(e); }); c.addEventListener('pointerup', function () { drag = false; c.classList.remove('drag'); }); }); }
  /* RunningHub 的 AI 应用页面（照 2026 年 11 月的官网还原）：o.title、o.tags、o.runs、o.fields[[标签, 图片名或文字]]、o.mode、o.res[图片名]、o.pick */
  function rh(o) {
    var f = (o.fields || []).map(function (x) { return '<div class="fl"><h5>' + x[0] + '<i>⌄</i></h5>' + (x[2] === 'txt' ? '<div class="tx">' + x[1] + '</div>' : x[2] === 'aud' ? '<div class="au"><b>♪</b><span>' + x[1] + '</span><em>MP3 WAV ≤ 20MB</em></div>' : '<div class="up"><img src="' + G(x[1]) + '" alt=""><i>✎</i></div>') + '</div>'; }).join('');
    var res = o.res ? '<div class="gen"><div class="gh"><span>' + (o.busy ? '生成中…' : '已完成') + '</span><small>' + (o.res.length) + ' 张</small></div><div class="gr n' + o.res.length + '">' + o.res.map(function (r, i) { return '<div class="gi' + (o.pick === i ? ' on' : '') + '" data-i="' + i + '">' + (r.charAt(0) === '<' ? r : '<img src="' + G(r) + '" alt="">') + '<span>下载</span></div>'; }).join('') + '</div></div>' : '<div class="intro"><img src="' + G(o.intro || 'rh-app-old') + '" alt=""></div>';
    return '<div class="d2-rh"><div class="hd"><b>RunningHub</b><span>| 应用详情</span><em>分享有礼</em><em>API调用</em><em>开通会员</em><u>' + (o.user || '我的头像') + '</u></div><div class="bd"><div class="lt"><div class="tt"><h4>' + o.title + '</h4><span>☆ ' + (o.star || 43) + '</span><span>♡ ' + (o.like || 9) + '</span><em>' + (o.runs || '1330') + ' 次运行</em></div><div class="tg">' + (o.tags || '') + '</div>' + f +
      '<div class="cost"><span>费用以实际用量结算</span><span>计费说明 ⓘ</span></div><div class="run"><b>立即运行</b><span>' + (o.mode || 'Standard') + ' ▾</span></div></div><div class="rt"><div class="tb"><span' + (o.res ? '' : ' class="on"') + '>应用详情</span><span' + (o.res ? ' class="on"' : '') + '>我的生成</span></div>' + res + '</div></div></div>';
  }
  function useFor(el, k, big, txt) { el.innerHTML = '<div><div class="d-us">' + RN.map(function (r, i) { return '<div class="d-us-i in" style="--i:' + i + '">' + av(i) + '<span class="d-k">' + r + '</span><h3>' + ROLE[i][k] + '</h3></div>'; }).join('') + '</div><div class="d-us-s in" style="--i:5"><b>' + big + '</b><span>' + txt + '</span></div></div>'; }
  function check(el, list) { el.innerHTML = '<div class="d-cq" style="--n:' + list.length + '">' + list.map(function (c, i) { return '<div class="d-cq-c in" style="--i:' + i + '"><i>' + c[0] + '</i><h3>' + c[1] + '</h3><p>' + c[2] + '</p>' + (c[3] ? '<em>' + c[3] + '</em>' : '') + '</div>'; }).join('') + '</div>'; bindCk(el); }
  function doNow(el, min, title, checks, dev) { el.innerHTML = '<div class="d-nw"><div class="d-nw-l"><h3>' + title + '</h3>' + cks(checks) + '<div class="d-row"><button class="d-btn" data-g="timer:' + min + '" data-gt="' + title + '">计时 ' + min + ' 分钟</button><button class="d-btn w" data-g="wheel:num" data-gt="抽取一位老师展示成果">抽取展示</button></div></div><div>' + dev + '</div></div>'; bindCk(el); }
  /* 分步操作：左边步骤，右边跟着换成这一步要发的提示词 */
  function flow(el, S) {
    el.innerHTML = '<div class="d2-fw"><ol class="d-ls">' + S.map(function (s, i) { return '<li data-i="' + i + '"><span class="d-n">' + (i + 1) + '</span><div><h3>' + s[0] + '</h3><p>' + s[1] + '</p></div></li>'; }).join('') + '</ol><div class="d2-fw-r"></div></div>';
    var s = VK.steps(el, S.length, function (i) { qa('.d-ls li', el).forEach(function (l, k) { l.classList.toggle('on', k === i); }); var x = S[i], R = q('.d2-fw-r', el);
      R.innerHTML = x[3] ? pr(x[2], x[3], x[4] || '') : x[2]; R.firstElementChild && R.firstElementChild.classList.add('in'); bind(R); bindCk(R); });
    qa('.d-ls li', el).forEach(function (l) { l.addEventListener('click', function () { s.go(+l.getAttribute('data-i')); }); });
  }

  window.D2K = { G: G, rh: rh, flow: flow, check: check, doNow: doNow, compare: compare, bindCompare: bindCompare, poster: poster };
  if (DAY !== 2) return;

  /* ================= 八件成果 ================= */
  function cv(n) { return '<img class="cvi" src="' + G(n) + '" alt="">'; }
  var WORKS = [
    { cls: 'ci', cover: '老照片<br>修复', art: cv('old1-after'), today: 1, name: '老照片修复', from: '校史馆老照片翻拍件', say: '修复划痕和褪色，自然上色，不添加原图没有的内容。', tags: ['修复上色', '高清放大'], big: ['old1', 'old1-after'] },
    { cls: 'ci', cover: '活动海报', art: '<div class="cvp">' + poster('poster-base') + '</div>', today: 1, name: '活动海报', from: '活动新闻稿、官方校徽文件', say: '生成带标题的海报，再叠加官方校徽。', tags: ['文生图', '图像编辑'], poster: 1 },
    { cls: 'ci w', cover: '学院<br>吉祥物', art: cv('mascot'), today: 1, name: '吉祥物与表情包', from: '学院简介、学校标准色', say: '先定形象，再以定妆图为参考生成表情包。', tags: ['文生图', '参考图一致性'], big: ['mascot-emoji'] },
    { cls: 'ci w', cover: '表情包', art: cv('mascot-emoji'), name: '表情包', from: '吉祥物定妆图', say: '同一个角色，8 个常用表情。', tags: ['参考图一致性'], big: ['mascot-emoji'] },
    { cls: 'ci', cover: '冬至<br>节气海报', art: cv('solar-dongzhi'), name: '节气海报', from: '校历、校园实景', say: '冬至主题，上方留白放标题。', tags: ['文生图', '系列化'], big: ['solar-dongzhi'] },
    { cls: 'ci', cover: '绘本插画', art: cv('book-page'), name: '6 页绘本', from: '团队编写的故事', say: '同一个角色，连续生成 6 页插画。', tags: ['参考图一致性', '分镜'], big: ['book-page'] },
    { cls: 'ci', cover: '古诗<br>场景图', art: cv('poem-lushan'), name: '古诗场景图', from: '《望庐山瀑布》原诗', say: '水墨风格，用于课堂导入。', tags: ['文生图', '风格控制'], big: ['poem-lushan'] },
    { cls: 'ci', cover: '校园插画', art: cv('i2i-water'), name: '校园插画', from: '校园航拍照片', say: '保持构图，转为水彩风格。', tags: ['图生图'], big: ['scene1', 'i2i-water'] }];
  function openWork(el, i) { var w = WORKS[i];
    if (w.poster) return VK.modal(el, '<div class="d2-mo">' + poster('poster-base') + '</div>');
    if (w.big.length === 2) return VK.modal(el, '<div class="d2-mo w">' + compare(w.big[0], w.big[1], '原图', i ? '处理后' : '修复后') + '</div>');
    return VK.modal(el, '<div class="d2-mo"><img src="' + G(w.big[0]) + '" alt=""></div>'); }

  /* ================= 篇一 成果展示 ================= */
  VIZ['今日安排'] = function (el) {
    var A = [['上午', [['10:00', '成果展示', '作业回顾与成果一览'], ['10:20', 'AI 生图的关键', '原理、要素与规范'], ['11:00', '认识 RunningHub', '注册、计费与使用']]], ['下午', [['14:00', '案例一', '老照片修复'], ['14:40', '案例二', '活动海报'], ['15:40', '案例三', '吉祥物与表情包'], ['16:30', '总结与分组', '成果点评、组队']]]];
    el.innerHTML = '<div class="d-ag">' + A.map(function (r, k) { return '<div class="d-ag-r in" style="--i:' + k * 2 + '"><span class="d-ag-k">' + r[0] + '</span><div class="d-ag-l">' + r[1].map(function (t) { return '<div class="d-ag-i"><b>' + t[0] + '</b><h3>' + t[1] + '</h3><p>' + t[2] + '</p></div>'; }).join('') + '</div></div>'; }).join('') +
      '<div class="d-ag-o in" style="--i:5"><span class="d-k">今日成果</span><span class="d-pill y">修复的老照片</span><span class="d-pill y">活动海报</span><span class="d-pill y">吉祥物与表情包</span><span class="d-pill k">学习小组</span></div></div>';
  };
  VIZ['第 1 天作业回顾'] = function (el) {
    var P = [[2, '第 2 名', 'hw-2'], [1, '第 1 名', 'hw-1'], [3, '第 3 名', 'hw-3']];
    el.innerHTML = '<div class="d2-pd">' + P.map(function (p, i) { return '<div class="d2-pd-c in r' + p[0] + '" style="--i:' + i + '"><div class="d2-pd-i">' + VK.slot(p[2], '第 1 天作业截图（前三名）', '<div class="d2-pd-ph">' + ic('doc') + '</div>') + '</div><div class="d2-pd-b"><b>' + p[0] + '</b><span>' + p[1] + '</span></div></div>'; }).join('') + '</div><div class="d-line in" style="--i:4;margin-top:26px">每份作业由作者用 <b>1 分钟</b>说明做法</div>';
    VK.fill(el);
  };
  VIZ['视觉创作成果展示'] = function (el) { VK.wall(el, WORKS, ['成果展示', '视觉创作成果展示', ''], function (i) { openWork(el, i); }); };
  VIZ['今日实操案例'] = function (el) {
    var D = ['<div class="d2-tr-i">' + compare('old1', 'old1-after') + '</div>', '<div class="d2-tr-i p">' + poster('poster-base') + '</div>', '<div class="d2-tr-i"><img class="zimg" src="' + G('mascot-emoji') + '" alt=""></div>'], T = ['在原图基础上修复、上色', '生成海报，叠加官方校徽', '设计形象，并保持一致'];
    el.innerHTML = '<div class="d2-tri">' + D.map(function (d, i) { return '<div class="d2-tri-c in" style="--i:' + i + '">' + d + '<div class="d-tri-t"><i>' + CASE[i][0] + '</i><div><h3>' + CASE[i][1] + '</h3><p>' + T[i] + '</p></div></div></div>'; }).join('') + '</div>';
    bindCompare(el); q('.d2-tr-i.p', el).addEventListener('click', function () { openWork(el, 1); });
  };
  VIZ['岗位适配'] = function (el) {
    el.innerHTML = '<div class="d-rl"><div class="d-rl-a">' + RN.map(function (r, i) { return '<button class="d-rl-b in" style="--i:' + i + '" data-i="' + i + '">' + av(i) + r + '</button>'; }).join('') + '</div><div class="d-rl-c">' + CASE.map(function (c, k) { return '<div class="d-rl-i in" style="--i:' + (k + 4) + '"><div class="d-k"><b>' + c[0] + '</b>案例' + '一二三'[k] + ' · ' + c[1] + '</div><h3></h3></div>'; }).join('') + '</div></div>';
    function set(i) { qa('.d-rl-b', el).forEach(function (b, k) { b.classList.toggle('on', k === i); }); qa('.d-rl-i h3', el).forEach(function (h, k) { h.style.opacity = 0; VK.later(function () { h.textContent = ROLE[i][k]; h.style.opacity = 1; }, 220); }); }
    var s = VK.steps(el, 4, set); qa('.d-rl-b', el).forEach(function (b, i) { b.addEventListener('click', function () { s.go(i); }); });
  };

  /* ================= 篇二 AI 生图的关键 ================= */
  VIZ['同一主题的两种出图'] = function (el) {
    var T = [['没有提供素材图，校徽由 AI 凭空绘制', '与官方校徽不符，不能发布'], ['上传官方校徽图片，要求直接使用', '提示词写明主体、构图和风格', '标题文字逐字核对']];
    el.innerHTML = '<div class="d2-two" data-s="0"><div class="a"><span class="d-pill t">未提供素材图</span><div class="d2-pf">' + img('poster-fakebadge') + '</div><div class="d2-tl">' + T[0].map(function (t, i) { return '<span class="d-pill r" style="--i:' + i + '">✕ ' + t + '</span>'; }).join('') + '</div></div><div class="b"><span class="d-pill y">提供官方素材图</span><div class="d2-pf" data-good="1">' + poster('poster-base') + '</div><div class="d2-tl">' + T[1].map(function (t, i) { return '<span class="d-pill g" style="--i:' + i + '">✓ ' + t + '</span>'; }).join('') + '</div></div></div>';
    var gd = new Image(); gd.onload = function () { q('[data-good]', el).innerHTML = '<img class="zimg" src="' + gd.src + '" alt="" style="width:100%;height:100%;object-fit:cover">'; }; gd.src = G('poster-good');   // 讲师生成的成品图放到 img/d2/poster-good.jpg 就替换
    VK.steps(el, 3, function (i) { q('.d2-two', el).setAttribute('data-s', i); });
  };
  /* 扩散模型示意：同一团噪点逐步去掉；换提示词、换随机种子。只用叠加绘制，不读像素（双击打开 file:// 时也能用） */
  VIZ['生图的原理：从噪点到图像'] = function (el) {
    var S = [[1, 'poster-base', '从一张随机噪点图开始', '画面里什么都没有，只有随机的噪点。'], [.78, 'poster-base', '第 1 步：去掉一部分噪点', '模型根据提示词，判断噪点里“应该”出现什么。'], [.52, 'poster-base', '第 2 步：轮廓出现', '大的明暗和构图先出现：天空、建筑、湖面。'], [.28, 'poster-base', '第 3 步：细节出现', '每一步都朝提示词描述的方向修正一点。'], [0, 'poster-base', '完成：得到一张图', '通常要走几十步，这里只画了 4 步。'], [0, 'poster-winter', '同一团噪点，换一句提示词', '把“清晨阳光”改成“冬日雪后”，结果随之改变。'], [-1, '', '同一句提示词，换一团噪点', '随机种子不同，每次的结果都不一样，所以要多出几张再挑选。']];
    el.innerHTML = '<div class="d2-df"><div class="d2-df-c"><canvas width="600" height="900"></canvas><div class="d2-df-g">' + ['poster-base', 'poster-v2', 'poster-v3', 'poster-v4'].map(function (n) { return '<img src="' + G(n) + '" alt="">'; }).join('') + '</div></div><div class="d2-df-r"><div class="d2-df-p"><span class="d-k">提示词</span><p></p></div><h3></h3><p class="d-p"></p><div class="d2-df-m"><span>随机种子</span><b></b></div></div></div>';
    var cv = q('canvas', el), c = cv.getContext('2d'), N = document.createElement('canvas'); N.width = 300; N.height = 450; var nc = N.getContext('2d'), nd = nc.createImageData(300, 450), seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var k = 0; k < nd.data.length; k += 4) { var v = rnd() * 255; nd.data[k] = v * (.85 + rnd() * .3); nd.data[k + 1] = v; nd.data[k + 2] = v * (.85 + rnd() * .3); nd.data[k + 3] = 255; } nc.putImageData(nd, 0, 0);
    var IM = {}; ['poster-base', 'poster-winter'].forEach(function (n) { var im = new Image(); im.onload = function () { IM[n] = im; paint(cur, curT); }; im.src = G(n); IM[n + '_'] = im; });
    var cur = 'poster-base', curT = 1, anim = 0, P1 = '竖版校园活动海报底图，<b>清晨阳光下</b>的大学校园与古朴教学楼，远处有桥和湖面倒影，前景是翻开的书本与飘落的银杏叶，上方留白，写实摄影风格', P2 = P1.replace('<b>清晨阳光下</b>', '<b>冬日雪后</b>');
    function paint(n, t) { c.clearRect(0, 0, 600, 900); var im = IM[n]; if (im && t < 1) { c.save(); c.filter = 'blur(' + (t * 22).toFixed(1) + 'px) saturate(' + (1 - t * .6).toFixed(2) + ')'; var r = Math.max(600 / im.width, 900 / im.height), w = im.width * r, h = im.height * r; c.drawImage(im, (600 - w) / 2, (900 - h) / 2, w, h); c.restore(); }
      c.globalAlpha = t; c.imageSmoothingEnabled = false; c.drawImage(N, 0, 0, 600, 900); c.globalAlpha = 1; }
    function go(n, t) { cancelAnimationFrame(anim); var t0 = performance.now(), from = n === cur ? curT : 1; cur = n; (function f(now) { var p = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - p, 3); curT = from + (t - from) * e; paint(n, curT); if (p < 1) anim = requestAnimationFrame(f); })(t0); }
    VK.steps(el, S.length, function (i) { var s = S[i]; q('.d2-df', el).classList.toggle('grid', s[0] < 0); q('.d2-df-r h3', el).textContent = s[2]; q('.d2-df-r .d-p', el).textContent = s[3]; q('.d2-df-p p', el).innerHTML = i === 5 ? P2 : P1; q('.d2-df-m b', el).textContent = s[0] < 0 ? '四次不同' : '同一个'; q('.d2-df-p', el).classList.toggle('hl', i === 5);
      if (s[0] >= 0) { if (i === 5 && cur !== 'poster-winter') { curT = 1; } go(s[1], s[0]); } });
    window.VIZ_STOP = (function (o) { return function () { cancelAnimationFrame(anim); if (o) o(); }; })(window.VIZ_STOP);
  };
  /* 六个要素：逐项补充，右边的画面和完整提示词跟着变（画面是一张接一张改出来的） */
  var EL = [['say', '主体', '画什么', '一座图书馆', '只有主体：画面普通，没有场景'], ['photo', '场景', '在哪里、有什么', '秋天的大学校园，门前银杏大道，三两学生', '有了场景：交代了时间和环境'], ['star', '风格', '什么画法', '温暖的水彩插画风', '有了风格：画法统一'], ['plan', '构图', '怎么取景', '低机位仰视，建筑居中，上方三分之一留白', '有了构图：预留标题位置'], ['bolt', '光线', '什么光', '傍晚金色逆光，窗内亮灯', '有了光线：氛围更温暖'], ['phone', '画幅', '多大比例', '竖版 3:4，用于手机海报', '有了画幅：适合发布渠道']];
  VIZ['提示词的六个要素'] = function (el) {
    el.innerHTML = '<div class="d2-el"><div class="d-sw">' + EL.map(function (s, i) { return '<div class="d-sx"><button class="d-sw-i" data-i="' + i + '">' + ic(s[0]) + '<div><h3>' + s[1] + '</h3><p>' + s[2] + '</p></div><i></i></button></div>'; }).join('') + '</div><div class="d2-el-r"><div class="d2-el-f"><img alt=""></div><div class="d2-el-p"><span class="d-k">完整提示词</span><p></p></div></div></div>';
    var n = 0, s = VK.steps(el, 6, function (i) { n = i;
      qa('.d-sw-i', el).forEach(function (b, k) { b.classList.toggle('on', k <= i); });
      var f = q('.d2-el-f', el), im = q('img', f); f.classList.remove('d-glow'); void f.offsetWidth; f.classList.add('d-glow'); im.src = G('el' + (i + 1)); f.classList.toggle('v', i === 5);
      q('.d2-el-p p', el).innerHTML = EL.slice(0, i + 1).map(function (e, k) { return '<span class="' + (k === i ? 'nw' : '') + '">' + e[3] + '</span>'; }).join('，'); });
    qa('.d-sw-i', el).forEach(function (b) { b.addEventListener('click', function () { s.go(+b.getAttribute('data-i')); }); });
  };
  VIZ['五种常用方法'] = function (el) {
    var M = [['文生图', '从文字生成图片', '海报画面、插画', ['txt', '竖版校园海报画面，清晨阳光下的大学校园与古朴教学楼，远处有桥和湖面倒影，前景是翻开的书本与飘落的银杏叶，写实摄影风格'], 'poster-base'], ['图生图', '按原图改变风格', '校园照片转插画', 'scene1', 'i2i-water'], ['局部重绘', '只修改画面的一部分', '换天空、去杂物', 'scene1', 'inpaint-sky'], ['参考图一致性', '以一张图为参考，保持形象一致', '吉祥物、绘本角色', 'mascot', 'mascot-emoji'], ['修复上色', '修复破损，黑白转彩色', '校史老照片', 'old1', 'old1-after']];
    el.innerHTML = '<div class="d2-m5"><div class="d-md-t">' + M.map(function (m, i) { return '<button data-i="' + i + '"><b>' + (i + 1) + '</b>' + m[0] + '</button>'; }).join('') + '</div><div class="d2-m5-b"><div class="d2-m5-a"></div><div class="d-arr">→</div><div class="d2-m5-z"></div></div><div class="d2-m5-t"><h3></h3><span class="d-pill y"></span></div></div>';
    var s = VK.steps(el, M.length, function (i) { var m = M[i]; qa('.d-md-t button', el).forEach(function (b, k) { b.className = k === i ? 'on' : k < i ? 'done' : ''; });
      q('.d2-m5-a', el).innerHTML = Array.isArray(m[3]) ? '<div class="d2-m5-x"><span class="d-k">提示词</span><p>' + m[3][1] + '</p></div>' : '<div class="d2-m5-i' + (i === 2 ? ' mask' : '') + '"><img class="zimg" src="' + G(m[3]) + '" alt="">' + (i === 2 ? '<i class="mk">重绘区域：天空</i>' : '') + '</div>';
      q('.d2-m5-z', el).innerHTML = '<div class="d2-m5-i in"><img class="zimg" src="' + G(m[4]) + '" alt=""></div>';
      q('.d2-m5-t h3', el).textContent = m[1]; q('.d2-m5-t .d-pill', el).textContent = '适用：' + m[2]; });
    qa('.d-md-t button', el).forEach(function (b) { b.addEventListener('click', function () { s.go(+b.getAttribute('data-i')); }); });
  };
  VIZ['视觉规范与发布要求'] = function (el) {
    check(el, [['徽', '校徽与标准字', '只使用官方文件，不变形、不改色、不让 AI 重绘'], ['色', '标准色', '主色使用学校标准色'], ['字', '文字', '标题、时间、地点、单位名称逐字核对'], ['史', '历史影像', '只修复，不生成虚构的历史照片'], ['肖', '人物肖像', '使用真人照片须经本人同意'], ['权', '版权', '不使用教材插图等有版权的图片']]);
    q('.d-cq', el).style.cssText = '--n:3;row-gap:26px'; q('.d-cq', el).classList.add('d2-cq-sm'); el.insertAdjacentHTML('beforeend', '<div class="d-line in" style="--i:7;margin-top:26px">依据：<b>学校视觉识别系统（VIS）</b></div>');
  };
  VIZ['课堂互动：实拍还是 AI 生成'] = function (el) {
    var R = [['fake-campus1', '../campus/c06', 0], ['../campus/c14', 'fake-campus2', 1]], CL = ['结构不合理：栏杆、窗格、倒影对不上', '细节过于光滑、干净，缺少真实的杂物和磨损', '文字、标识变形或无法辨认'];
    el.innerHTML = '<div class="d2-gm"><div class="d2-gm-p"></div><div class="d2-gm-r"><div class="d-k">判断依据</div>' + CL.map(function (c, i) { return '<p class="in" style="--i:' + i + '"><b>' + (i + 1) + '</b>' + c + '</p>'; }).join('') + '<p class="in k" style="--i:3"><b>✓</b>最可靠的方法：向拍摄者核实原图</p><div style="display:flex;gap:10px;margin-top:16px"><button class="d-btn" data-g="wheel:num" data-gt="抽取一位老师判断">抽取答题人</button><button class="d-btn w" data-g="timer:1" data-gt="30 秒作答">计时</button></div></div></div>';
    VK.steps(el, R.length * 2, function (i) { var r = R[i >> 1], show = i % 2;
      q('.d2-gm-p', el).innerHTML = '<div class="d-k" style="margin:0 0 10px 6px">第 ' + ((i >> 1) + 1) + ' 轮 · 哪一张是 AI 生成的？</div><div class="d2-gm-two">' + [0, 1].map(function (k) { var ai = r[2] === k; return '<div class="d2-gm-c' + (show ? (ai ? ' ai' : ' real') : '') + '"><img class="zimg" src="' + G(r[k]) + '" alt=""><b>' + 'AB'[k] + '</b>' + (show ? '<span class="d-pill ' + (ai ? 'r' : 'g') + '">' + (ai ? 'AI 生成' : '实拍') + '</span>' : '') + '</div>'; }).join('') + '</div>'; });
  };

  /* ================= 篇三 认识 RunningHub（画面为官网截图，2026 年 11 月） ================= */
  function lst(L) { return '<ol class="d-ls">' + L.map(function (p, i) { return '<li data-i="' + i + '"><span class="d-n">' + (i + 1) + '</span><div><h3>' + p[0] + '</h3><p>' + p[1] + '</p></div></li>'; }).join('') + '</ol>'; }
  function pins(el, shot, P, w) { var W = (w || 840) - 26;
    el.innerHTML = '<div class="d-pp"><div class="d-pp-d">' + VK.lap(VK.shot(shot, 1), w || 840) + P.map(function (p, i) { return '<button class="d-pin" data-i="' + i + '" style="left:' + (13 + W * p[0] / 100).toFixed(0) + 'px;top:' + (13 + W * .625 * p[1] / 100).toFixed(0) + 'px">' + (i + 1) + '</button>'; }).join('') + '</div>' + lst(P.map(function (p) { return [p[2], p[3]]; })) + '</div>';
    var s = VK.steps(el, P.length, function (i) { qa('.d-pin', el).forEach(function (p, k) { p.classList.toggle('on', k === i); }); qa('.d-ls li', el).forEach(function (l, k) { l.classList.toggle('on', k === i); }); });
    qa('.d-pin,.d-ls li', el).forEach(function (p) { p.addEventListener('click', function (e) { e.stopPropagation(); s.go(+p.getAttribute('data-i')); }); }); }
  VIZ['平台总览'] = function (el) { pins(el, G('rh-home'), [[44.3, 7.1, 'AI 应用', '他人封装好的创作流程，上传素材即可运行，课堂主要使用'], [33.5, 7.1, '快捷创作', '选择模型，直接生成图片和视频'], [58.2, 7.1, 'ComfyUI 工作流', '由节点组成的流程，可以查看和修改'], [65.5, 7.1, '搜索', '按功能查找，例如“老照片修复”'], [90, 7.1, '登录领积分', '登录后领取积分，用于运行']]); };
  VIZ['注册与登录'] = function (el) {
    el.innerHTML = '<div class="d-ws"><div>' + VK.lap(VK.shot(G('rh-login'), 1), 700) + '</div><div>' + st([['在浏览器中访问 runninghub.cn', '无需下载安装'], ['点击右上角“登录领积分”'], ['使用微信扫码，或手机验证码登录', '登录后右上角显示个人头像', 1]]) + '<div class="d-tip in" style="--i:4"><b>建议</b>使用 Chrome 或 Edge 浏览器，登录后保持登录状态。</div></div></div>';
  };
  VIZ['计费方式'] = function (el) {
    var T = [['积分', 'RH 币', ['运行时按实际用量扣除', '运行前可查看计费说明', '登录可领取免费积分'], 'y'], ['运行模式', 'Lite · Standard · Plus', ['模式越高，速度越快', '显存更大，费用更高', '课堂案例使用默认模式'], 'k'], ['会员', '按月开通', ['每月发放积分', '部分模型享会员价', '需要大量出图时再开通'], '']];
    el.innerHTML = '<div class="d-pl" style="grid-template-columns:repeat(3,1fr)">' + T.map(function (t, i) { return '<div class="d-pl-c in ' + t[3] + '" style="--i:' + i + '"><h3>' + t[0] + '</h3><div class="pp" style="font-size:34px;margin-top:16px">' + t[1] + '</div><ul class="d2-ul">' + t[2].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div><div class="d-line in" style="--i:4;margin-top:30px">费用以实际用量结算。<b>先用一张图试跑，确认效果和费用后再批量生成。</b></div>';
  };
  VIZ['三种使用方式'] = function (el) {
    var C = [['rh-apps', 'AI 应用', ['填空即用', '课堂主用'], '他人封装好的流程：上传素材、填写说明，点击运行。'], ['rh-feat', '快捷创作', ['选模型', '直接生成'], '选择一个模型，输入提示词或上传参考图，直接生成。'], ['rh-wf', 'ComfyUI 工作流', ['节点组成', '进阶使用'], '可以查看、修改每一个节点，适合定制流程。']];
    el.innerHTML = '<div class="d-o3">' + C.map(function (c, i) { return '<div class="d-o3-c in" style="--i:' + i + '"><div class="d-o3-i zimg"><img src="' + G(c[0]) + '" alt="" style="object-position:50% 0"></div><h3>' + c[1] + '</h3><div class="d-o3-o">' + c[2].map(function (o, k) { return '<span class="d-pill' + (i === 0 && k === 1 ? ' y' : ' t') + '">' + o + '</span>'; }).join('') + '</div><p>' + c[3] + '</p></div>'; }).join('') + '</div>';
  };
  VIZ['AI 应用的使用界面'] = function (el) { pins(el, G('rh-app-old'), [[10.4, 33.6, '上传素材', '点击或拖入图片；不同应用需要的素材不同'], [18, 58, '提示词', '写明要求；部分应用可以不填'], [29.7, 82.8, '计费说明', '运行前查看费用'], [30, 90.6, '运行模式', '默认即可；模式越高越快、费用越高'], [14.4, 90.6, '立即运行', '提交后排队生成，可以离开页面'], [45.9, 12.7, '我的生成', '查看结果、下载；右侧“历史记录”保留以往结果']]); };
  VIZ['选择合适的应用'] = function (el) {
    el.innerHTML = '<div class="d-ws"><div>' + VK.lap(VK.shot(G('rh-search'), 1), 700) + '</div><div class="d-rw">' + [['次', '运行次数', '用的人越多，效果越稳定'], ['藏', '收藏数', '收藏多说明值得反复使用'], ['例', '示例作品', '看示例是否接近你要的效果'], ['标', '标签', '确认功能，例如“修复上色”“高清放大”']].map(function (r, i) { return '<div class="in" style="--i:' + i + '"><span class="d2-ci">' + r[0] + '</span><div><h3>' + r[1] + '</h3><p>' + r[2] + '</p></div></div>'; }).join('') + '<div class="d-tip in" style="--i:5;margin-top:6px"><b>建议</b>先用一张图试跑，效果满意再批量使用。</div></div></div>';
  };
  VIZ['账号检查'] = function (el) { el.innerHTML = '<div class="d-ok"><div>' + cks(['已登录：右上角显示个人头像', '已领取积分', '已收藏今天要用的三个应用']) + '</div><div class="d-ok-b"><button class="d-tm" data-g="timer:8" data-gt="账号检查" data-gn="登录、领取积分、收藏应用">计时</button></div></div>'; bindCk(el); };

  /* ================= 篇四 案例一：老照片修复 ================= */
  var C1 = '案例一：老照片修复｜';
  VIZ[C1 + '案例介绍'] = function (el) {
    el.innerHTML = '<div class="d2-in1"><div class="d2-in1-c">' + compare('old1', 'old1-after') + '</div><div class="d-f3">' + [['photo', '输入', '校史馆老照片的翻拍件'], ['loop', '处理', '修复划痕、污渍，自然上色'], ['check', '原则', '只修复，不添加原图没有的内容']].map(function (f, i) { return '<div class="in" style="--i:' + (i + 1) + '">' + ic(f[0]) + '<div><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div></div>'; }).join('') + '</div></div>';
    bindCompare(el); var c = q('.d2-cmp', el);
    VK.steps(el, 3, function (i) { c.classList.add('anim'); c.style.setProperty('--p', ['100%', '50%', '0%'][i]); VK.later(function () { c.classList.remove('anim'); }, 1300); });
  };
  VIZ[C1 + '应用场景'] = function (el) { useFor(el, 0, '褪色 → 清晰', '同类任务：证件照修复、模糊图片放大'); };
  VIZ[C1 + '操作步骤'] = function (el) {
    el.innerHTML = '<div class="d-hw"><div>' + st([['搜索“老照片修复上色”，打开应用', '先看运行次数和示例作品'], ['上传照片', '翻拍件尽量正对、无反光'], ['在提示词中写明“只修复、不添加”', '复制右侧的提示词'], ['点击“立即运行”，在“我的生成”中下载', '一般 1–2 分钟完成', 1]]) + '</div><div style="display:flex;flex-direction:column;gap:16px;min-height:0">' + VK.lap(VK.shot(G('rh-app-old'), 1), 640) + pr('填写到应用的“提示词”', PROMPT.p1fix, 's') + '</div></div>'; bind(el); };
  VIZ[C1 + '课堂实操'] = function (el) { doNow(el, 10, '完成一张老照片修复', ['“我的生成”中出现修复后的照片', '人物五官和建筑没有改变', '已下载到本机'], VK.lap(rh({ title: '老照片修复上色破损划痕高清修复…', tags: '老照片修复 · 高清放大 · 图生图', fields: [['上传照片', 'old2'], ['提示词可不填', PROMPT.p1fix, 'txt']], res: ['old2-after'] }), 760, 1440)); };
  VIZ[C1 + '成果核对'] = function (el) { check(el, [['貌', '人物五官', '与原图对照，五官、表情、年龄感没有改变'], ['增', '有无添加', '没有出现原图中没有的人、物、文字'], ['色', '色彩', '色彩自然，符合年代特征'], ['源', '出处', '注明原图的年代、地点和来源']]); };
  VIZ[C1 + '迭代优化'] = function (el) { var U = [['同一张图运行两次', '每次结果不同，挑选更接近原貌的一张'], ['只修复，不上色', PROMPT.p1bw], ['保持人物原貌', PROMPT.p1face]];
    el.innerHTML = '<div class="d-up d2-up-w">' + U.map(function (u, i) { return '<div class="in" style="--i:' + i + '"><h3><span class="d-n">' + (i + 1) + '</span>' + u[0] + '</h3>' + (i ? '<div class="d-ub" data-raw="' + raw(u[1]) + '">' + mark(u[1]) + '<button type="button" class="d-cp">复制</button></div>' : '<div class="d-ub" style="padding-right:30px">' + u[1] + '</div>') + '</div>'; }).join('') + '</div>'; bind(el); };
  VIZ[C1 + '收藏与复用'] = function (el) { el.innerHTML = '<div class="d-2"><div class="in"><div class="d-stage" style="--b:340px">' + VK.lap(VK.shot(G('rh-app-old'), 1, '50% 0'), 600) + '</div><h3>收藏应用</h3><p>应用名称旁的 ☆ 加入收藏；下次从“个人中心”的收藏中直接打开。</p></div><div class="in" style="--i:1"><div class="d-stage" style="--b:340px">' + VK.lap(rh({ title: '老照片修复上色破损划痕高清修复…', tags: '老照片修复 · 高清放大 · 图生图', fields: [['上传照片', 'old1']], res: ['old1-after', 'old2-after'] }), 600, 1440) + '</div><h3>我的生成与历史记录</h3><p>每次运行的结果都会保留，可以随时回看、下载。</p></div></div>'; };

  /* ================= 篇五 案例二：活动海报 ================= */
  var C2 = '案例二：活动海报｜';
  VIZ[C2 + '案例介绍'] = function (el) {
    var LY = [['画面', 'RunningHub 生成'], ['标题', 'RunningHub 生成，逐字核对'], ['校徽', '官方文件，用图像编辑叠加']];
    el.innerHTML = '<div class="d2-ly"><div class="d2-ly-s"><div class="d2-ly-k"><div class="d2-ly-l l0"><img src="' + G('poster-base') + '" alt=""></div><div class="d2-ly-l l1"><div class="d2-pt o"><div class="t"><b>弦歌百廿 立范育人</b><span>重庆师范大学初等教育学院办学120周年</span></div></div></div><div class="d2-ly-l l2"><div class="d2-pt o"><img class="lg" src="img/brand/cqnu-combo-white.png" alt=""></div></div></div></div><ol class="d-ls">' + LY.map(function (l, i) { return '<li><span class="d-n">' + (i + 1) + '</span><div><h3>' + l[0] + '</h3><p style="display:block">' + l[1] + '</p></div></li>'; }).join('') + '</ol></div>';
    VK.steps(el, 4, function (i) { var k = q('.d2-ly-k', el); k.setAttribute('data-s', i); qa('.d-ls li', el).forEach(function (l, j) { l.classList.toggle('on', j <= i); }); });
  };
  VIZ[C2 + '应用场景'] = function (el) { useFor(el, 1, '一张海报 = 三层', '同类任务：节日节气海报、讲座预告、招生宣传图'); };
  VIZ[C2 + '操作步骤'] = function (el) { flow(el, [['确定文案', '主标题、副标题以活动新闻稿为准', '<div class="d2-cp in"><div class="d-k">第一步 · 确定文案</div><dl><dt>主标题</dt><dd>弦歌百廿 立范育人</dd><dt>副标题</dt><dd>重庆师范大学初等教育学院办学120周年</dd></dl><p>出自活动新闻稿。文字确定后再出图，出图后逐字核对。</p></div>'], ['生成海报', 'RunningHub 快捷创作：竖版 3:4，一次出 4 张', '第二步 · 填写到 RunningHub 快捷创作', PROMPT.p2poster, 'b'], ['叠加校徽', 'RunningHub 全能图像编辑：上传海报和官方校徽文件', '第三步 · 填写到图像编辑应用', PROMPT.p2badge, 'b'], ['核对发布', '对照三项核对，再发布', '<div class="d2-ck4 in">' + poster('poster-base') + '<div>' + cks(['校徽与官方文件一致，未变形、未改色', '标题与文案逐字一致', '画面中无异常的手、面部和多余文字']) + '</div></div>']]); };
  VIZ[C2 + '课堂实操'] = function (el) {
    doNow(el, 15, '完成一张活动海报', ['一次出 4 张，挑选 1 张', '标题与文案逐字一致', '已叠加官方校徽并下载'], VK.lap(rh({ title: 'Seedream 5.5 · 文生图', tags: '快捷创作 · 竖版 3:4', star: 128, like: 36, runs: '2.1万', fields: [['提示词', PROMPT.p2poster, 'txt']], res: ['poster-base', 'poster-v2', 'poster-v3', 'poster-v4'].map(function (n) { return poster(n, [1, 1, 0]); }), pick: 0 }), 760, 1440));
    qa('.gi', el).forEach(function (g) { g.addEventListener('click', function (e) { e.stopPropagation(); qa('.gi', el).forEach(function (x) { x.classList.toggle('on', x === g); }); }); });
  };
  VIZ[C2 + '成果核对'] = function (el) { check(el, [['徽', '校徽', '与官方文件对照：形状、比例、颜色、文字一致'], ['字', '文字', '标题、副标题与文案逐字一致'], ['形', '画面', '无异常的手、面部，无多余文字']]); };
  VIZ[C2 + '迭代优化'] = function (el) {
    el.innerHTML = '<div class="d-hw"><div class="d2-ss"><div class="d2-ss-c"><img class="zimg" src="' + G('poster-base') + '" alt=""><span class="d-pill">清晨阳光</span></div><div class="d-arr">→</div><div class="d2-ss-c"><img class="zimg" src="' + G('poster-winter') + '" alt=""><span class="d-pill y">冬日雪后</span></div></div><div style="display:flex;flex-direction:column;gap:16px;justify-content:center">' + pr('填写到 RunningHub（图生图，上传第一张作参考）', PROMPT.p2season, 'b') + '<div class="d-rw">' + [['star', '改变一个要素重新生成', '季节、光线、风格，一次只改一项'], ['photo', '用校园实景作参考图', '画面更接近学校真实的建筑']].map(function (r, i) { return '<div class="in" style="--i:' + (i + 2) + '">' + ic(r[0]) + '<div><h3>' + r[1] + '</h3><p>' + r[2] + '</p></div></div>'; }).join('') + '</div></div></div>'; q('.d-pr', el).style.flex = 'none'; bind(el); };
  VIZ[C2 + '沉淀为模板'] = function (el) { el.innerHTML = '<div class="d-hw"><div>' + st([['把提示词中会变的部分标出来', '活动名称、季节、主体建筑、主色'], ['收藏这次用到的两个应用', '快捷创作的模型、全能图像编辑'], ['下次只改【】里的内容', '风格与这一张保持一致，形成系列', 1]]) + '</div>' + pr('提示词模板 · 【】里换成新活动的内容', PROMPT.p2tpl, 'b') + '</div>'; q('.d-pr', el).style.cssText = 'flex:none;align-self:center'; bind(el); };

  /* ================= 篇六 案例三：吉祥物与表情包 ================= */
  var C3 = '案例三：吉祥物与表情包｜';
  VIZ[C3 + '案例介绍'] = function (el) {
    var S = [['mascot', '定妆图', '确定形象'], ['mascot-3view', '三视图', '锁定外形'], ['mascot-emoji', '表情包', '保持一致']];
    el.innerHTML = '<div class="d2-m3">' + S.map(function (s, i) { return (i ? '<div class="d-arr">→</div>' : '') + '<div class="d2-m3-c" data-i="' + i + '"><div class="d2-m3-i' + (i ? ' w' : '') + '"><img class="zimg" src="' + G(s[0]) + '" alt=""></div><h3><span class="d-n">' + (i + 1) + '</span>' + s[1] + '</h3><p>' + s[2] + '</p></div>'; }).join('') + '</div>';
    VK.steps(el, 3, function (i) { qa('.d2-m3-c', el).forEach(function (c, k) { c.classList.toggle('on', k <= i); }); qa('.d2-m3 .d-arr', el).forEach(function (a, k) { a.classList.toggle('on', k < i); }); });
  };
  VIZ[C3 + '应用场景'] = function (el) { useFor(el, 2, '一个形象，多处使用', '同类任务：绘本角色、课件人物、活动 IP'); };
  VIZ[C3 + '操作步骤'] = function (el) { flow(el, [['确定三项要素', '形象、代表色、标志物，和学院特色相关', '第一步 · 先想好三项要素', PROMPT.p3need, 'b'], ['生成定妆图', 'RunningHub 快捷创作：1:1，一次出 4 张，挑选 1 张', '第二步 · 填写到 RunningHub（替换成你的三项要素）', PROMPT.p3design, 'b'], ['三视图与表情包', 'RunningHub AI 应用：上传定妆图作参考', '第三步 · 填写到表情包应用', PROMPT.p3emoji, 'b']]); };
  VIZ[C3 + '成果核对：形象一致'] = function (el) {
    var F = ['颜色', '服饰', '标志物'];
    el.innerHTML = '<div class="d2-cs"><div class="d2-cs-c a"><span class="d-pill t">未使用参考图</span><div class="d2-cs-i"><img class="zimg" src="' + G('mascot') + '" alt=""><img class="zimg" src="' + G('mascot-drift') + '" alt=""></div><div class="d2-cs-f">' + F.map(function (f) { return '<span class="d-pill r">✕ ' + f + '有出入</span>'; }).join('') + '</div></div><div class="d2-cs-c b"><span class="d-pill y">以定妆图为参考</span><div class="d2-cs-i w"><img class="zimg" src="' + G('mascot-emoji') + '" alt=""></div><div class="d2-cs-f">' + F.map(function (f) { return '<span class="d-pill g">✓ ' + f + '一致</span>'; }).join('') + '</div></div></div>';
    VK.steps(el, 2, function (i) { q('.d2-cs', el).setAttribute('data-s', i); });
  };
  VIZ[C3 + '课后完成'] = function (el) { el.innerHTML = '<div><div class="d-fl">' + [['PNG', '定妆图', '一张正面全身图'], ['PNG', '三视图', '正面、侧面、背面'], ['PNG', '表情包总览', '8 个表情拼成一张'], ['ZIP', '8 张单独表情', '可直接发送使用']].map(function (f, i) { return '<div class="in" style="--i:' + i + '"><span class="d-fi">' + f[0] + '</span><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div>'; }).join('') + '</div><div class="d-line in" style="--i:5;margin-top:44px">课后完成，<b>通过工牌提交</b>；吉祥物为课堂练习，未经学校认定不对外使用。</div></div>'; };

  /* ================= 篇七 总结与分组 ================= */
  VIZ['成果展示与点评'] = function (el) { el.innerHTML = '<div class="d-ok"><div><div class="d-k" style="margin-bottom:14px">抽到的老师投屏 1 分钟</div>' + cks(['展示今天完成的一份成果', '说明用了哪种方法、改了几次']) + '<div style="display:flex;gap:10px;margin-top:28px"><button class="d-btn w" data-g="wheel:task" data-gt="互动任务">互动任务</button><button class="d-btn w" data-g="timer:3" data-gt="成果展示">计时</button></div></div><div class="d-ok-b"><button class="d-big" data-g="wheel:num" data-gt="抽取一位老师展示成果">抽取<small>展示人</small></button></div></div>'; bindCk(el); };
  VIZ['今日小结'] = function (el) { el.innerHTML = '<div><div class="d2-sm">' + [['old1-after', '修复的老照片', '只修复，不添加'], ['', '活动海报', '生成海报，叠加官方校徽'], ['mascot', '吉祥物与表情包', '以定妆图保持一致']].map(function (c, i) { return '<div class="in" style="--i:' + i + '"><div class="d2-sm-i' + (c[0] ? '' : ' p') + '">' + (c[0] ? '<img class="zimg" src="' + G(c[0]) + '" alt="">' : poster('poster-base')) + '</div><h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div><div class="d-six in" style="--i:4"><span class="d-k" style="align-self:center;margin-right:6px">六个要素</span>' + EL.map(function (s) { return '<span class="d-pill">' + s[1] + '</span>'; }).join('') + '</div></div>'; };
  VIZ['分组组队'] = function (el) { el.innerHTML = '<div class="d-ok"><div><div class="d2-gp">' + [['4–5', '人一组'], ['10', '分钟'], ['1+1', '队名 + 口号']].map(function (g, i) { return '<div class="in" style="--i:' + i + '"><b>' + g[0] + '</b><span>' + g[1] + '</span></div>'; }).join('') + '</div>' + cks(['确定队名和口号，各组依次展示', '工牌切换到参赛模式']) + '<div style="display:flex;gap:10px;margin-top:24px"><button class="d-btn w" data-g="wheel:grp" data-gt="抽取展示的小组">抽组</button></div></div><div class="d-ok-b"><button class="d-big" data-g="timer:10" data-gt="分组组队" data-gn="确定队名和口号">计时<small>10 分钟</small></button></div></div>'; bindCk(el); };
  VIZ['课后作业'] = function (el) { el.innerHTML = '<div class="d-hm"><div class="d-hm-n in"><b>3</b><span>份成果</span></div><div><div class="d-chips in" style="--i:1;justify-content:flex-start;margin-bottom:22px;padding-left:10px"><span class="d-pill">姓名_修复照片</span><span class="d-pill">姓名_活动海报</span><span class="d-pill">姓名_表情包</span></div>' + st([['在工牌上选择“交作业”', '屏幕显示上传二维码'], ['微信扫码，上传文件', '提示上传成功'], ['次日上课前查看工牌', '显示成绩与排名', 1]]) + '</div></div>'; };
  VIZ['次日准备'] = function (el) { el.innerHTML = '<div><div class="d-sm" style="grid-template-columns:1fr 1fr;max-width:1000px;margin:0 auto">' + [['photo', '准备 3 张校园照片', '横版，光线清晰'], ['say', '想好一条 15 秒短片', '讲什么、给谁看']].map(function (c, i) { return '<div class="in" style="--i:' + i + '">' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div><div class="d-line in" style="--i:3;margin-top:44px"><b>第 3 天</b>AI 视频创作：一个人完成一条宣传短片</div></div>'; };
})();
