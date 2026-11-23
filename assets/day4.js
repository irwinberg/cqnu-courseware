/* 第四节每一页的画面（活动出整套 · 数字员工 · 黑客松）。键 = “章名｜页标题”或“页标题”，和 课程内容_v1.md 卷四一一对应。
   公共部件：viz-kit.js（VK）、day1.js 的 DK、day2.js 的 D2K（RunningHub 界面、分步指令、核对卡片）。版式在 day4.css（d4- 开头）。
   指令都在 PROMPT 里，和《第四节_指令.md》是同一份。图片放 img/d4/，同名替换即可。 */
(function () {
  'use strict';
  var DAY = +(new URLSearchParams(location.search).get('d')) || 0;
  if (DAY !== 4 || !window.DK || !window.D2K) return;
  var VIZ = window.VIZ = window.VIZ || {}, VK = window.VK, q = VK.q, qa = VK.qa, K = window.DK, K2 = window.D2K;
  var ic = K.ic, pr = K.pr, bind = K.bind, st = K.st, cks = K.cks, bindCk = K.bindCk, av = K.av, RN = K.RN;
  var rh = K2.rh, flow = K2.flow, doNow = K2.doNow;
  var G = function (d) { return '<svg viewBox="0 0 24 24">' + d + '</svg>'; };
  var CASE = [['套', '一场活动出整套'], ['员', '数字员工'], ['赛', '黑客松']];
  var ROLE = [['校庆、讲座的全套宣传', '早报、校历节点提醒', '宣传类工具或整套作品'], ['学院活动的通稿和推文', '本单位周报、截止日期提醒', '本单位的办公小工具'], ['公开课、教研活动宣传', '备课资料、作业提醒', '学生能用的学习小工具'], ['社团活动的全套宣传', '考试、报名提醒', '试讲和微格教学练习']];

  /* ================= 指令（实测后在这里改） ================= */
  var PROMPT = {
    s1: '请读取工作空间“活动素材”文件夹里的全部材料，为这场活动出一整套宣传品。\n动手之前，先问我 3–5 个问题：发布平台、主要读者、需要突出什么、有没有不宜公开的内容。\n我回答后，依次写出：\n1. 新闻稿（800 字以内，标题 + 导语 + 正文）\n2. 简讯（150 字以内）\n3. 公众号推文（3 个备选标题、导语、正文、文末评论引导）\n4. 采访提纲（5 个问题）\n5. 置顶评论（3 条）\n6. 海报指令（竖版 3:4，画面描述 + 主标题 + 副标题）\n7. 短视频指令（15 秒，三个镜头，每个镜头写清主体、动作、运镜）\n人名、职务、时间、数字只能来自材料，材料中没有的写“【待补充】”。全部保存到“活动出整套”文件夹。',
    s2: '请对照工作空间里的《专有名词表》和以下审核清单，逐项检查“活动出整套”文件夹里的文稿：\n事实与数字、人名职务、时间地点、政治表述、引文出处、校徽和标准色、版权和肖像。\n不要直接修改文稿。把需要人工核对的地方整理成表格：所在文件、原文、问题、依据、建议。保存为《审核清单.xlsx》。',
    rerun: '按“活动出整套”来做，素材在“第二场活动”文件夹。',
    save: '把我们刚才的做法保存为两个技能：\n技能一“活动出整套”：读取素材、先提问，再写出七样文稿和画面描述；\n技能二“宣传审核”：对照专有名词表和审核清单，列出需要人工核对的地方。\n保存后告诉我调用方式。',
    de: '请读取工作空间“校历”文件夹里的本学年校历，找出 10 天后的节点（开学、放假、考试周、节假日、重要纪念日）。\n每个节点给出 3 个选题角度，每个角度一句话。\n没有节点时，回复“近 10 天无校历节点”。\n设为定时任务：每个工作日 8:00 运行，结果推送到我的手机。',
    crisis: '以下是一个虚构的涉校舆情场景：【突发卡内容】\n请先列出需要我补充核实的事实，再分别起草：\n1. 情况通报（300 字以内，只写已核实的事实和处置措施）\n2. 问答口径（5 问 5 答）\n3. 回应文案（适合在官方账号发布）\n不得编造事实、数字和人名；措辞稳妥、诚恳。',
    readme: '作品名称：【名称】\n帮谁、做什么：【这个作品帮哪些人，解决什么问题】\n怎么用：【第一步……第二步……】\n做不到什么：【已知的限制，需要人工把关的地方】'
  };
  window.D4_PROMPT = PROMPT;

  /* ================= 公共部件 ================= */
  var OUT = [['新闻稿', 'W', 'doc'], ['简讯', 'W', 'say'], ['推文', 'W', 'phone'], ['采访提纲', 'W', 'plan'], ['置顶评论', 'W', 'say'], ['海报', 'R', 'photo'], ['短视频', 'R', 'bolt']];
  function wbOut(i) {
    var ms = [{ u: '请读取“活动素材”文件夹里的全部材料，为这场活动出一整套宣传品。动手之前，先问我 3–5 个问题。……', files: ['开幕式致辞.docx', '周书记讲话.docx', '新闻稿初稿.docx'] }];
    if (i >= 1) ms.push({ a: '<p>开始之前，想先确认四件事：</p><p>1. 主要发布在哪些平台？<br>2. 读者以校内师生为主，还是校友和社会公众？<br>3. 这次最想突出哪一点？<br>4. 有没有不宜公开的内容？</p>' });
    if (i >= 2) ms.push({ u: '学校官网和公众号；读者以校内师生为主；突出学生的参与；现场照片中的学生可以使用。' });
    if (i >= 3) ms.push({ st: '已完成 ›', steps: [[1, '读取 3 份材料'], [1, '写入 5 份文稿'], [1, '写入海报和短视频的画面描述'], [1, '标出 2 处“【待补充】”']], a: '七样都已完成，保存在“活动出整套”文件夹。有 2 处材料中没有的信息，标了“【待补充】”。', file: ['W', '新闻稿.docx'] });
    return VK.wb({ noside: 1, tasks: ['活动出整套'], task: 0, title: '活动出整套', ms: ms });
  }
  function folder(list, title) { return '<div class="d4-fd in"><div class="d4-fd-h">' + G('<path d="M3 6h7l2 3h9v10H3z"/>') + '<b>' + title + '</b></div>' + list.map(function (f, i) { var t = f[1] || 'W'; return '<div class="d4-fd-i in" style="--i:' + (i + 1) + '"><span class="' + t + '">' + (t === 'P' ? '图' : t) + '</span>' + f[0] + '</div>'; }).join('') + '</div>'; }
  function phone(o, w) { return VK.pho('<div class="d4-ph"><div class="d4-ph-t">9:41</div><div class="d4-ph-d">' + (o.date || '11 月 24 日 星期一') + '</div>' + o.list.map(function (m, i) { return '<div class="d4-nt' + (m[3] ? ' on' : '') + '" style="--i:' + i + '"><div class="d4-nt-h"><i>' + m[0].charAt(0) + '</i><b>' + m[0] + '</b><small>' + m[1] + '</small></div><p>' + m[2] + '</p></div>'; }).join('') + '</div>', w || 300); }
  /* 翻牌：点一张翻开一张，牌面随机 */
  function cards(el, list, back) {
    var idx = list.map(function (_, i) { return i; }).sort(function () { return Math.random() - .5; });
    q('.d4-cd', el).innerHTML = list.map(function (_, i) { return '<button class="d4-cv in" style="--i:' + i + '"><div class="f b">' + back + '<small>点击翻开</small></div><div class="f r"></div></button>'; }).join('');
    qa('.d4-cv', el).forEach(function (c, i) { c.addEventListener('click', function (e) { e.stopPropagation(); if (c.classList.contains('on')) return; var t = list[idx[i]]; q('.r', c).innerHTML = '<span class="d-k">' + t[0] + '</span><h3>' + t[1] + '</h3>' + (t[2] ? '<p>' + t[2] + '</p>' : ''); c.classList.add('on'); }); });
  }
  function card(k, t, dark) { return '<div class="d4-cv on sm' + (dark ? ' k' : '') + '"><div class="f r"><span class="d-k">' + k + '</span><h3>' + t + '</h3></div></div>'; }
  function slotImg(n, label, fb) { return VK.slot(n, label, fb).replace('img/d1/', 'img/d4/'); }
  function fillD4(el) { qa('.slot', el).forEach(function (s) { var n = s.getAttribute('data-slot'), im = new Image(); im.onload = function () { im.className = 'slot-i'; s.appendChild(im); s.classList.add('ok'); }; im.src = 'img/d4/' + n + '.jpg'; }); }

  /* ================= 篇一 成果展示 ================= */
  VIZ['本节安排'] = function (el) {
    var A = [['前半节', [['10:00', '成果展示', '首映会结果'], ['10:20', '从单件到整套', '工具接力与审核清单'], ['10:50', '案例一', '一场活动出整套']]], ['后半节', [['14:00', '案例二', '数字员工'], ['14:30', '案例三', '黑客松'], ['16:30', '中期展示', '每组 2 分钟']]]];
    el.innerHTML = '<div class="d-ag">' + A.map(function (r, k) { return '<div class="d-ag-r in" style="--i:' + k * 2 + '"><span class="d-ag-k">' + r[0] + '</span><div class="d-ag-l">' + r[1].map(function (t) { return '<div class="d-ag-i"><b>' + t[0] + '</b><h3>' + t[1] + '</h3><p>' + t[2] + '</p></div>'; }).join('') + '</div></div>'; }).join('') +
      '<div class="d-ag-o in" style="--i:5"><span class="d-k">本节成果</span><span class="d-pill y">一套活动宣传品</span><span class="d-pill y">三个数字员工</span><span class="d-pill y">黑客松作品</span><span class="d-pill k">中期展示</span></div></div>';
  };
  VIZ['首映会结果'] = function (el) {
    var P = [[2, '第 2 名', 'hw-2'], [1, '第 1 名', 'hw-1'], [3, '第 3 名', 'hw-3']];
    el.innerHTML = '<div class="d2-pd">' + P.map(function (p, i) { return '<div class="d2-pd-c in r' + p[0] + '" style="--i:' + i + '"><div class="d2-pd-i">' + slotImg(p[2], '首映会前三名作品截图', '<div class="d2-pd-ph">' + ic('star') + '</div>') + '</div><div class="d2-pd-b"><b>' + p[0] + '</b><span>' + p[1] + '</span></div></div>'; }).join('') + '</div><div class="d-line in" style="--i:4;margin-top:26px">每部作品由作者用 <b>1 分钟</b>说明做法</div>';
    fillD4(el);
  };
  VIZ['本节实操案例'] = function (el) {
    var A = '<div class="d4-t1"><img src="img/d2/poster-v2.jpg" alt=""><img src="img/d2/poster-winter.jpg" alt=""><div class="d4-mini"><b>新闻稿</b><i></i><i></i><i class="s"></i></div><div class="d4-mini"><b>推文</b><i></i><i class="s"></i></div></div>';
    var B = '<div class="d4-t2">' + [['热点早报', '7:30'], ['校历节点提醒', '8:00'], ['每周台账', '每周 17:00']].map(function (m) { return '<div><i>' + m[0].charAt(0) + '</i><b>' + m[0] + '</b><small>' + m[1] + '</small></div>'; }).join('') + '</div>';
    var C = '<div class="d4-t3">' + card('主题卡', '迎新季') + card('形式', '不限', 1) + '</div>';
    var T = ['一份材料，七样宣传品', '技能 + 定时任务', '分组完成一个作品'];
    el.innerHTML = '<div class="d4-tri">' + [A, B, C].map(function (d, i) { return '<div class="d4-tri-c in" style="--i:' + i + '"><div class="d4-tri-v">' + d + '</div><div class="d-tri-t"><i>' + CASE[i][0] + '</i><div><h3>' + CASE[i][1] + '</h3><p>' + T[i] + '</p></div></div></div>'; }).join('') + '</div>';
  };
  VIZ['岗位适配'] = function (el) {
    el.innerHTML = '<div class="d-rl"><div class="d-rl-a">' + RN.map(function (r, i) { return '<button class="d-rl-b in" style="--i:' + i + '" data-i="' + i + '">' + av(i) + r + '</button>'; }).join('') + '</div><div class="d-rl-c">' + CASE.map(function (c, k) { return '<div class="d-rl-i in" style="--i:' + (k + 4) + '"><div class="d-k"><b>' + c[0] + '</b>案例' + '一二三'[k] + ' · ' + c[1] + '</div><h3></h3></div>'; }).join('') + '</div></div>';
    function set(i) { qa('.d-rl-b', el).forEach(function (b, k) { b.classList.toggle('on', k === i); }); qa('.d-rl-i h3', el).forEach(function (h, k) { h.style.opacity = 0; VK.later(function () { h.textContent = ROLE[i][k]; h.style.opacity = 1; }, 220); }); }
    var s = VK.steps(el, 4, set); qa('.d-rl-b', el).forEach(function (b, i) { b.addEventListener('click', function () { s.go(i); }); });
  };

  /* ================= 篇二 从单件到整套 ================= */
  VIZ['一场活动，七样产出'] = function (el) {
    var n = OUT.length, P = OUT.map(function (o, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [Math.cos(a) * 520, Math.sin(a) * 250]; });
    el.innerHTML = '<div class="d4-hub"><svg class="d4-hub-l" viewBox="-700 -320 1400 640">' + P.map(function (p) { return '<line x1="0" y1="0" x2="' + p[0].toFixed(0) + '" y2="' + p[1].toFixed(0) + '"/>'; }).join('') + '</svg><div class="d4-hub-c">' + ic('folder') + '<b>一份活动材料</b><small>通知 · 讲话稿 · 照片</small></div>' +
      OUT.map(function (o, i) { return '<div class="d4-hub-o" style="--x:' + P[i][0].toFixed(0) + 'px;--y:' + P[i][1].toFixed(0) + 'px">' + ic(o[2]) + '<div><b>' + o[0] + '</b><small class="' + o[1] + '">' + (o[1] === 'W' ? 'WorkBuddy' : 'RunningHub') + '</small></div></div>'; }).join('') + '</div>';
    VK.steps(el, n + 1, function (k) { qa('.d4-hub-o', el).forEach(function (o, j) { o.classList.toggle('on', j < k); }); qa('.d4-hub-l line', el).forEach(function (o, j) { o.classList.toggle('on', j < k); }); });
  };
  VIZ['工具接力'] = function (el) {
    flow(el, [
      ['WorkBuddy 写文稿和画面描述', '读材料，先提问，再写', VK.lap(wbOut(3), 760, 1440)],
      ['RunningHub 出海报和短视频', '复制画面描述里的指令', VK.lap(rh({ title: '活动海报', tags: '文生图 · 图像编辑', runs: '2.1万', fields: [['text', '竖版校园活动海报，3:4。画面：清晨阳光下的大学校园……', 'txt']], res: ['poster-v2', 'poster-v3'], pick: 0 }), 760, 1440)],
      ['WorkBuddy 审核，列出核对项', '对照专有名词表和审核清单', VK.lap(VK.wb({ noside: 1, tasks: ['宣传审核'], task: 0, title: '宣传审核', ms: [{ u: '请对照《专有名词表》和审核清单，逐项检查“活动出整套”文件夹里的文稿……' }, { st: '已完成 ›', steps: [[1, '读取 5 份文稿'], [1, '对照专有名词表'], [1, '写入 <code>审核清单.xlsx</code>']], a: '共列出 6 处需要人工核对：职务 2 处、时间 1 处、引文 1 处、待补充 2 处。', file: ['X', '审核清单.xlsx'] }] }), 760, 1440)]
    ]);
  };
  VIZ['三个检查点'] = function (el) {
    var S = [['素材进来时', '是不是最终版', 'folder'], ['初稿出来时', '事实、数字、人名', 'doc'], ['发布之前', '逐项过审核清单', 'check']];
    el.innerHTML = '<div class="d4-cp"><div class="d4-cp-r">' + ['素材', 'AI 写稿', '出图出视频', '发布'].map(function (t, i) { return '<span class="in" style="--i:' + i + '">' + t + '</span>' + (i < 3 ? '<i class="in" style="--i:' + i + '"></i>' : ''); }).join('') + '</div><div class="d4-cp-k">' + S.map(function (s) { return '<div>' + ic(s[2]) + '<h3>' + s[0] + '</h3><p>' + s[1] + '</p></div>'; }).join('') + '</div></div>';
    VK.steps(el, 4, function (k) { qa('.d4-cp-k>div', el).forEach(function (o, j) { o.classList.toggle('on', j < k); }); qa('.d4-cp-r i', el).forEach(function (o, j) { o.classList.toggle('on', [0, 1, 2][j] < k); }); });
  };
  VIZ['审核清单'] = function (el) {
    var L = [['事实与数字', '与原始材料逐一对照'], ['人名职务', '对照专有名词表'], ['时间地点', '日期、星期、场地名称'], ['政治表述', '规范提法，不自行改写'], ['引文出处', '原话逐字核对'], ['校徽和标准色', '使用官方文件，不重画'], ['版权和肖像', '照片、音乐、人物授权']];
    el.innerHTML = '<div class="d4-ck">' + L.map(function (c, i) { return '<div class="d-ck in" style="--i:' + i + '"><i></i><div><h3>' + c[0] + '</h3><p>' + c[1] + '</p></div></div>'; }).join('') + '</div>';
    bindCk(el);
  };

  /* ================= 篇三 案例一 ================= */
  var C1 = '案例一：一场活动出整套｜';
  VIZ[C1 + '案例介绍'] = function (el) {
    el.innerHTML = '<div class="d4-in">' + folder([['开幕式致辞.docx'], ['周书记讲话.docx'], ['新闻稿初稿.docx']], '活动素材 · 红旗漫卷艺术作品展') + '<div class="d-arr in" style="--i:4">→</div><div class="d4-in-o">' + OUT.map(function (o, i) { return '<div class="d4-in-i in" style="--i:' + (i + 5) + '">' + (o[1] === 'R' ? '<img src="' + (i === 5 ? 'img/d2/poster-v2.jpg' : 'img/d3/v-short.jpg') + '" alt="">' : '<div class="pg"><i></i><i></i><i class="s"></i></div>') + '<b>' + o[0] + '</b></div>'; }).join('') + '<div class="d4-in-i in k" style="--i:12"><div class="pg x">' + ic('check') + '</div><b>审核清单</b></div></div></div>';
  };
  VIZ[C1 + '技能一：文稿与画面描述'] = function (el) {
    flow(el, [
      ['放入活动材料', '放进“活动素材”文件夹', folder([['开幕式致辞.docx'], ['周书记讲话.docx'], ['新闻稿初稿.docx']], '我的AI工作台 / 活动素材')],
      ['发送指令', '它会先提问，再动手', '完整指令', PROMPT.s1, 'b'],
      ['回答它的问题', '发布平台、读者、重点', VK.lap(wbOut(2), 760, 1440)],
      ['打开产物', '七样文稿和画面描述', VK.lap(wbOut(3), 760, 1440)]
    ]);
  };
  VIZ[C1 + '课堂实操'] = function (el) { doNow(el, 15, '完成文稿和画面描述', ['“活动出整套”文件夹中有 7 份产物', '标出了“【待补充】”的地方', '用海报指令在 RunningHub 生成一张海报'], VK.lap(wbOut(3), 760, 1440)); };
  VIZ[C1 + '技能二：审核'] = function (el) {
    var T = '<div class="d4-tb in"><div class="h"><span>所在文件</span><span>原文</span><span>问题</span><span>建议</span></div>' + [['新闻稿', '王书记', '职务需核对', '对照名词表'], ['推文', '10 月 24 日（周五）', '日期与星期需核对', '核对校历'], ['新闻稿', '“立德树人……”', '引文需核对原稿', '对照讲话稿'], ['简讯', '【待补充】', '参会人数缺失', '向主办方确认']].map(function (r) { return '<div>' + r.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>'; }).join('') + '</div>';
    flow(el, [
      ['放入专有名词表', '人名、职务、机构的规范写法', folder([['专有名词表.xlsx', 'X'], ['新闻稿.docx'], ['推文.docx'], ['简讯.docx']], '我的AI工作台 / 活动出整套')],
      ['发送指令', '只列问题，不直接改稿', '完整指令', PROMPT.s2, 'b'],
      ['逐项人工核对', '打开《审核清单.xlsx》', T]
    ]);
  };
  VIZ[C1 + '换一场活动验证'] = function (el) {
    el.innerHTML = '<div class="d4-vs">' + pr('只说一句', PROMPT.rerun) + '<div class="d4-vs-c">' + [['比原稿好的地方', 'y'], ['不如原稿的地方', 'k']].map(function (c, i) { return '<div class="d4-vs-i in ' + c[1] + '" style="--i:' + (i + 1) + '"><span class="d-k">' + c[0] + '</span><div class="d4-ed" contenteditable="true" spellcheck="false"></div></div>'; }).join('') + '</div></div>';
    bind(el); qa('.d4-ed', el).forEach(function (e) { e.addEventListener('keydown', function (ev) { ev.stopPropagation(); }); e.addEventListener('click', function (ev) { ev.stopPropagation(); }); });
  };
  VIZ[C1 + '保存为技能'] = function (el) { el.innerHTML = '<div class="d-hw"><div>' + st([['发送保存技能的指令', '一次保存两个技能'], ['在技能列表中确认', '“活动出整套”“宣传审核”'], ['换一场活动，一句话调用', '结果格式一致即保存成功', 1]]) + '</div>' + pr('保存技能的指令', PROMPT.save, 'b') + '</div>'; (q('.d-pr', el) || { style: {} }).style.cssText = 'flex:none;align-self:center'; bind(el); };

  /* ================= 篇四 案例二 数字员工 ================= */
  var C2 = '案例二：数字员工｜';
  var PUSH = [['热点早报', '7:30', '今日早报已生成，共 8 条：学校相关 2 条、高教动态 3 条、理论热点 3 条。'], ['校历节点提醒', '8:00', '10 天后：元旦。3 个选题角度：新年献词、一年回顾、师生寄语。'], ['每周台账', '每周 17:00', '本周发稿 12 篇，已填入台账，有 2 篇缺少作者信息。']];
  VIZ[C2 + '案例介绍'] = function (el) {
    el.innerHTML = '<div class="d4-de"><div class="d4-de-l"><div class="d4-eq in"><span class="d-pill">技能</span><b>+</b><span class="d-pill">定时任务</span><b>=</b><span class="d-pill y">数字员工</span></div><div class="d-line in" style="--i:2">到点自动运行，结果推送到手机</div></div><div class="d4-de-r in" style="--i:1">' + phone({ list: PUSH }, 250) + '</div></div>';
    VK.steps(el, 4, function (k) { qa('.d4-nt', el).forEach(function (o, j) { o.classList.toggle('on', j < k); }); });
  };
  VIZ[C2 + '三个数字员工'] = function (el) {
    var E = [['热点早报', '每个工作日 7:30', '检索宣传和理论热点，整理 10 条', '第一节已设置', 'web'], ['校历节点提醒', '每个工作日 8:00', '提醒 10 天后的校历节点，给出 3 个选题角度', '课上设置', 'clock'], ['每周台账', '每周五 17:00', '汇总本周发稿，填入台账', '这节课设置', 'plan']];
    el.innerHTML = '<div class="d4-id">' + E.map(function (e, i) { return '<div class="d4-id-c in" style="--i:' + i + '"><div class="d4-id-h">' + ic(e[4]) + '<span class="d-k">岗位说明</span></div><h3>' + e[0] + '</h3><dl><dt>工作时间</dt><dd>' + e[1] + '</dd><dt>工作内容</dt><dd>' + e[2] + '</dd></dl><span class="d-pill ' + (i ? 'y' : '') + '">' + e[3] + '</span></div>'; }).join('') + '</div>';
  };
  VIZ[C2 + '操作步骤'] = function (el) { el.innerHTML = '<div class="d-hw"><div>' + st([['放入本学年校历', '“校历”文件夹'], ['发送指令', '和大家一起梳理要求'], ['确认定时任务', '先“立即运行”一次验证', 1]]) + '</div>' + pr('完整指令', PROMPT.de, 'b') + '</div>'; (q('.d-pr', el) || { style: {} }).style.cssText = 'flex:none;align-self:center'; bind(el); };
  VIZ[C2 + '一周的运行结果'] = function (el) {
    var N = ['校历节点提醒', '8:00', '近 10 天无校历节点。'], W = [['第 1 次', [PUSH[0], N]], ['第 2 次', [PUSH[0], PUSH[1]]], ['第 3 次', [PUSH[0], ['校历节点提醒', '8:00', '10 天后：期末考试周开始。3 个选题角度：复习攻略、图书馆的夜晚、考风考纪。']]], ['第 4 次', [PUSH[0], N]], ['第 5 次', [PUSH[0], N, PUSH[2]]]];
    el.innerHTML = '<div class="d4-wk"><div class="d4-wk-t">' + W.map(function (w, i) { return '<button data-i="' + i + '">' + w[0] + '</button>'; }).join('') + '</div><div class="d4-wk-p"></div></div>';
    var s = VK.steps(el, 5, function (i) { qa('.d4-wk-t button', el).forEach(function (b, k) { b.classList.toggle('on', k === i); }); q('.d4-wk-p', el).innerHTML = phone({ list: W[i][1].map(function (p) { return [p[0], p[1], p[2], 1]; }) }, 250); });
    qa('.d4-wk-t button', el).forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); s.go(+b.getAttribute('data-i')); }); });
  };

  /* ================= 篇五 案例三 黑客松：主题自选、形式不限 ================= */
  var C3 = '案例三：黑客松｜';
  var TH = [['迎新季', '欢迎新同学', '报到指南、迎新海报、新生短片'], ['校园开放日', '走进重师', '校园导览、开放日海报、招生推文'], ['教师节', '致敬身边的好老师', '人物海报、祝福视频、推文'], ['毕业季', '说给母校的话', '毕业海报、毕业短片、纪念推文'], ['社团招新', '找到你的同好', '招新海报、社团宣传片、报名表'], ['校园文化节', '一场活动的整套宣传', '活动预告、现场快讯、回顾短片']];
  VIZ[C3 + '选一个主题'] = function (el) {
    el.innerHTML = '<div class="d4-dr"><div class="d4-cd"></div><div class="d-chips in" style="--i:7;margin-top:34px"><button class="d-btn w" data-g="wheel:grp" data-gt="抽取小组顺序">抽取小组顺序</button></div></div>';
    cards(el, TH.map(function (t) { return ['主题', t[0], t[1]]; }), '<b>主题卡</b>');
  };
  VIZ[C3 + '形式不限'] = function (el) {
    var F = [['photo', '海报', 'RunningHub'], ['bolt', '短视频', 'RunningHub + 剪映'], ['doc', '推文', 'WorkBuddy'], ['folder', '一整套宣传品', '两个工具组合'], ['web', '一个小工具', 'WorkBuddy']];
    el.innerHTML = '<div style="width:100%"><div class="d5-tl4" style="grid-template-columns:repeat(5,1fr)">' + F.map(function (f, i) { return '<div class="in" style="--i:' + i + ';align-items:center;text-align:center">' + ic(f[0]) + '<h3>' + f[1] + '</h3><p>' + f[2] + '</p></div>'; }).join('') + '</div><div class="d4-thx in" style="--i:6">' + TH.map(function (t) { return '<div><b>' + t[0] + '</b><span>' + t[2] + '</span></div>'; }).join('') + '</div></div>';
  };
  VIZ[C3 + '时间安排'] = function (el) {
    var T = [['0′', '开始', '选主题、定形式'], ['30′', '第一轮指导', '需求是否写清楚'], ['90′', '第二轮指导', '老师当用户试用'], ['105′', '停手', '写作品说明'], ['120′', '中期展示', '每组 2 分钟']];
    el.innerHTML = '<div style="width:100%"><div class="d4-tl" style="grid-template-columns:repeat(5,1fr)">' + T.map(function (t, i) { return '<div class="d4-tl-i in' + (i === 3 ? ' k' : '') + '" style="--i:' + i + '"><b>' + t[0] + '</b><i></i><h3>' + t[1] + '</h3><p>' + t[2] + '</p></div>'; }).join('') + '</div><div class="d-chips in" style="--i:7;margin-top:56px"><button class="d-tm" data-g="timer:15" data-gt="黑客松">计时</button></div></div>';
  };
  VIZ[C3 + '作品说明'] = function (el) {
    el.innerHTML = '<div class="d-hw"><div><div class="d4-rd">' + [['hand', '帮谁、做什么'], ['plan', '怎么用'], ['check', '做不到什么']].map(function (c, i) { return '<div class="in" style="--i:' + i + '">' + ic(c[0]) + '<h3>' + c[1] + '</h3></div>'; }).join('') + '</div></div>' + pr('说明模板', PROMPT.readme, 'b') + '</div>';
    (q('.d-pr', el) || { style: {} }).style.cssText = 'flex:none;align-self:center'; bind(el);
  };

  /* ================= 篇六 中期展示与下节准备 ================= */
  VIZ['中期展示'] = function (el) { el.innerHTML = '<div class="d-ok"><div><div class="d-k" style="margin-bottom:14px">每组 2 分钟</div>' + cks(['演示作品，现场跑一遍', '说明还差什么、下节课怎么补']) + '<div style="display:flex;gap:10px;margin-top:28px"><button class="d-btn w" data-g="timer:2" data-gt="中期展示">计时 2 分钟</button></div></div><div class="d-ok-b"><button class="d-big" data-g="wheel:grp" data-gt="抽取展示小组">抽取<small>展示顺序</small></button></div></div>'; bindCk(el); };
  VIZ['本节小结'] = function (el) {
    var V = ['<img src="img/d2/poster-v2.jpg" alt="">', '<div class="d4-t2">' + PUSH.map(function (m) { return '<div><i>' + m[0].charAt(0) + '</i><b>' + m[0] + '</b><small>' + m[1] + '</small></div>'; }).join('') + '</div>', '<div class="d4-t3">' + card('主题卡', '迎新季') + '</div>'];
    el.innerHTML = '<div class="d4-sm3">' + V.map(function (v, i) { return '<div class="in" style="--i:' + i + '"><div class="d4-sm3-v">' + v + '</div><h3>' + ['一套活动宣传品', '三个数字员工', '黑客松作品'][i] + '</h3><p>' + ['两个技能 + 审核清单', '技能 + 定时任务', '作品 + 说明'][i] + '</p></div>'; }).join('') + '</div>';
  };
  VIZ['下节准备'] = function (el) { el.innerHTML = '<div><div class="d-k in" style="text-align:center;margin-bottom:26px;font-size:22px">每组一位 · 3 分钟路演</div><div class="d-sm">' + [['hand', '解决什么问题', '帮谁、做什么'], ['bolt', '现场演示一遍', '提前准备好材料'], ['plan', '怎么做的', '用了哪些工具和指令']].map(function (c, i) { return '<div class="in" style="--i:' + i + '">' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div><div class="d-line in" style="--i:4;margin-top:44px"><b>第五节</b>带走属于你的 AI 工作台</div></div>'; };
})();
