/* 第 1 天每一页的图示（新版）。键 = “章名｜页标题”或“页标题”，和 课程内容_v1.md 里的标题一一对应。
   公共部件在 viz-kit.js（VK）；几页老的交互在 viz-d1-base.js，这里按新标题接过来。
   写给 WorkBuddy 的提示词都在本文件最上面的 PROMPT 里，和《第1天_提示词.md》是同一份，改一处记得改另一处。 */
(function () {
  'use strict';
  var OLD = window.VIZ || {}, VIZ = window.VIZ = {}, VK = window.VK, q = VK.q, qa = VK.qa;
  var I = { doc: '<path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7"/>', folder: '<path d="M3 6h7l2 3h9v10H3z"/>', ask: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16v1"/>', check: '<path d="M5 4h14v16H5z"/><path d="M8 9l2 2 3-3M8 15l2 2 3-3M15 10h2M15 16h2"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>', star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>', bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>', photo: '<rect x="3" y="5" width="18" height="14"/><path d="M6 16l4-5 4 4 2-2 3 3"/>', say: '<path d="M4 5h16v11H10l-5 4v-4H4z"/>', hand: '<path d="M14 5l5 5-10 10H4v-5z"/><path d="M12 7l5 5"/>', plan: '<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>', loop: '<path d="M5 10a7 7 0 0 1 12-4l2 2M19 4v4h-4M19 14a7 7 0 0 1-12 4l-2-2M5 20v-4h4"/>', save: '<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>' };
  var ic = function (k) { return '<span class="ic"><svg viewBox="0 0 24 24">' + I[k] + '</svg></span>'; };
  function cards(list, n, ex) { return '<div class="cards' + (ex ? ' ' + ex : '') + '" style="--n:' + (n || list.length) + '">' + list.map(function (c, i) { return '<div class="card in ' + (c[4] || '') + '" style="--i:' + i + '">' + (c[0] ? (I[c[0]] ? ic(c[0]) : '<div class="big">' + c[0] + '</div>') : '') + (c[1] ? '<div class="en">' + c[1] + '</div>' : '') + '<h3>' + c[2] + '</h3>' + (c[3] ? '<p>' + c[3] + '</p>' : '') + '</div>'; }).join('') + '</div>'; }
  function steps(list, ex) { return '<ol class="stp' + (ex ? ' ' + ex : '') + '">' + list.map(function (s, i) { return '<li class="in ' + (s[2] || '') + '" style="--i:' + i + '"><b>' + (s[4] || i + 1) + '</b><h3>' + s[0] + '</h3><p><em>' + (s[3] || '做完会看到') + '</em>' + s[1] + '</p></li>'; }).join('') + '</ol>'; }
  function pc(to, text, ex) { return '<div class="pc in' + (ex ? ' ' + ex : '') + '"><div class="pch"><span><i>提示词</i>' + to + '</span><button type="button" class="cp">复制</button></div><div class="pcb pre" data-raw="' + text.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '">' + text.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }).replace(/【(.+?)】/g, '<u>【$1】</u>') + '</div></div>'; }
  function bindCopy(el) { qa('.cp', el).forEach(function (b) { b.addEventListener('click', function () { var t = q('.pcb', b.closest('.pc')).getAttribute('data-raw'); try { navigator.clipboard.writeText(t); } catch (e) { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } b.textContent = '已复制'; setTimeout(function () { b.textContent = '复制'; }, 1400); }); }); }
  function call(k, t, r) { return '<div class="call in' + (r ? ' r' : '') + '" style="--i:4"><b>' + k + '</b><span>' + t + '</span></div>'; }
  function doc(html, s) { return '<div class="docv" style="--s:' + (s || 1.42) + '">' + html + '</div>'; }
  var RN = ['宣传部', '二级部门', '教学岗', '学生'], ROLE = [['讲话稿、活动通稿', '宣传和理论热点', '公众号年度运营汇报'], ['本单位的通知、总结', '本领域动态（学工、教务、科研）', '本单位账号数据或年度工作总结'], ['一节课的教案或一篇课文', '本学科的教研动态', '学期教学总结、成绩分析'], ['一篇论文或课程笔记', '教资、考研、招聘信息', '实习总结、社团或学生会述职']];

  /* ================= 写给 WorkBuddy 的提示词（待你实测后改） ================= */
  var PROMPT = {
    c1: '请把工作空间里的《王书记在初等教育学院办学120周年高质量发展大会上的讲话.docx》做成一页简报。\n\n读者：学院的老师，每人只有两分钟。\n\n内容要有四块：\n1. 一句话主旨（不超过 30 个字）\n2. 讲话提出的几点希望（用原文的小标题，不要改写）\n3. 关键数字（3 到 5 个，每个带一句说明，保留“超过”“余”“首批”这类限定词）\n4. 一段可以直接引用的原话（加引号，一字不差，标出在原文第几段）\n\n要求：\n- 只用这份讲话稿，不要补充稿子里没有的内容\n- 做完自己对照原文核对一遍：职务、日期、数字、原话\n- 存成 Word 文档《一页简报.docx》，一页以内，放在当前工作空间\n- 最后告诉我：你核对了哪几项，有没有拿不准的地方',
    c1ask: '先别动手。关于这份简报，你还有哪些拿不准的地方？一次问我 3 个问题，等我答完再做。',
    c1fix: '第二块的四点希望，每点后面补一句话说明，从原文里摘，不要自己概括。其他地方不要动。',
    c1rule: '把我这几次提的修改意见整理成 3 条规则，以后做简报都照这个来。先列给我看，我确认后你再记住。',
    c1skill: '请帮我创建一个技能，名字叫“一页简报”。\n\n触发：我说“做成一页简报”，并给你一份材料（讲话稿、通稿、通知、总结都可以）。\n流程：读材料 → 列要点 → 成稿 → 对照原文自查。\n格式：一句话主旨、几点要点（用原文小标题）、关键数字、一段原话（一字不差，标段落）。一页以内，存成 Word。\n规矩：只用给的材料；职务、日期、数字、原话必须核对；拿不准的地方单独列出来。',
    c2: '请帮我做一份今天的《宣传和理论热点早报》。\n\n读者：学校党委宣传部的老师，早上用手机看，3 分钟看完。\n\n来源（只看这些）：【教育部官网、中国教育报、重庆市教委官网、人民日报、新华社、本校官网和官方公众号】\n\n内容：一共 10 条，分三块：学校相关、高教动态、理论热点。\n每条的写法：一句话说清是什么事（不超过 40 字）＋ 发布单位和日期 ＋ 原文链接。\n\n规则：\n- 只收最近 24 小时内发布的；不够 10 条就有几条写几条，不要拿旧闻凑数\n- 每条必须有能打开的原文链接\n- 理论类只引原文的标题和原句，不要自己概括\n- 找不到出处的不要写\n\n做完把正文直接发给我，同时存成《早报_今天的日期.md》，放在当前工作空间的“02_早报”文件夹。',
    c2rule: '以后做早报，加这三条规则：\n1. 【只收 24 小时内的】\n2. 【每条必须附能打开的原文链接】\n3. 【理论类只引原文，不概括】\n按新规则把今天的早报重做一遍。',
    c2auto: '请帮我创建一个定时任务：每个工作日早上 7:30，按刚才的要求和规则生成当天的《宣传和理论热点早报》，【发到我的微信】。',
    c3a: '工作空间里有一份《重庆师范大学微信公众号数据概况（2026年1月1日至11月13日）.xls》。先不要写稿，只做三件事：\n\n1. 告诉我：这张表有哪几列、一共多少行数据、时间范围是哪天到哪天\n2. 算出下面这些数，列成一张表：\n   - 总篇数、总阅读量、篇均阅读量、中位数\n   - 阅读过万的篇数、过 5000 的篇数\n   - 每个月的发文篇数和篇均阅读量\n   - 周一到周日，每天的篇均阅读量\n   - 阅读量最高的 10 篇\n3. 每个数后面写明是怎么算的（用了哪一列、怎么算）\n\n把结果存成《数据核对表.xlsx》。在我确认之前，不要往下做。',
    c3b: '数据我核对过了。现在根据《数据核对表.xlsx》写一份给校领导看的《公众号 2026 年运营汇报》。\n\n结构：一页结论（3 句话）→ 三个发现（每个发现后面必须跟数字）→ 两条建议（标明“建议”，由我来改）。\n\n要求：\n- 不要用表里没有的数字\n- 不要写“显著提升”“效果良好”这类没有数字支撑的话\n- 一千字以内，存成《公众号运营汇报.docx》'
  };
  window.D1_PROMPT = PROMPT;

  /* ================= 八件成品 ================= */
  var bars = '<div class="bars">' + VK.MAVG.map(function (v, i) { return '<i class="' + (i === 8 ? 'hi' : '') + '" style="height:' + (v / 7211 * 100).toFixed(0) + '%;--i:' + i + '"></i>'; }).join('') + '</div>';
  var grid = '<div class="g">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(function (i) { return '<i class="' + (i < 4 ? 'h' : i === 9 ? 'y' : '') + '" style="--i:' + i + '"></i>'; }).join('') + '</div>';
  var WORKS = [
    { cls: 'c1', cover: '一页<br>简报', art: '<span class="n">1</span><i class="p p1"><i></i><i></i><i></i><i></i><i></i><i></i></i><i class="p p2"><i></i><i></i><i></i><i></i><i></i></i><i class="p p3"><i></i><i class="y"></i><i></i><i></i><i></i></i>', today: 1, name: '一页简报', from: '王书记办学 120 周年讲话，2036 字', say: '把这份讲话做成一页简报，原话要一字不差。', tags: ['读文件', '提炼', '自查'] },
    { cls: 'c2', cover: '热点早报', art: '<i class="sun"></i><span class="t">07:30</span><i class="cd d1"></i><i class="cd d2"></i><i class="cd d3"></i>', today: 1, name: '热点早报', from: '宣传部常看的公众号和网站', say: '每个工作日早上 7:30，给我 10 条宣传和理论热点。', tags: ['联网搜索', '定时任务', '发到手机'] },
    { cls: 'c3', cover: '年度运营<br>汇报', art: '<span class="nm3">137.6 万<small>307 篇 · 总阅读</small></span>' + bars, today: 1, name: '向上汇报的稿子', from: '公众号 307 篇推文的数据表', say: '先把数算出来给我核，再写成给领导看的汇报。', tags: ['读表格', '计算', '成稿'] },
    { cls: 'c4', cover: '会议纪要', art: '<i class="bb b1"></i><i class="bb r b2"></i><i class="bb b3"></i><span class="tdo">待办 3 项，已分到人</span>', name: '会议纪要和待办', from: '一段会议录音的文字稿', say: '整理成纪要，待办按人列出来。', tags: ['读文件', '归类'] },
    { cls: 'c5', cover: '通　知', art: '<i class="rl"></i><i class="ln l1"></i><i class="ln l2"></i><i class="ln l3"></i><span class="seal">章</span>', name: '通知和方案', from: '活动的时间、地点、要求', say: '按学校的公文格式写一份通知。', tags: ['公文格式', '模板'] },
    { cls: 'c6', cover: '表格<br>台账', art: grid, name: '表格和台账', from: '散在几份文件里的名单和数字', say: '合成一张表，标出对不上的地方。', tags: ['读表格', '核对'] },
    { cls: 'c7', cover: '宣讲提纲', art: '<div class="tr"><i style="--i:0"></i><i class="s" style="--i:1"></i><i class="s" style="--i:2"></i><i style="--i:3"></i><i class="s" style="--i:4"></i></div>', name: '宣讲提纲', from: '理论学习的原文', say: '列一份 15 分钟的宣讲提纲，引文标出处。', tags: ['只引原文', '标出处'] },
    { cls: 'c8', cover: '汇报 PPT', art: '<i class="sd s1"></i><i class="sd s2"></i><i class="sd s3"></i>', name: '汇报 PPT', from: '上面那份汇报稿', say: '做成 8 页的 PPT，用学校的模板。', tags: ['生成 PPT', '套模板'] }];
  var TASKS = ['把讲话稿做成一页简报', '宣传和理论热点早报', '公众号 2026 年运营汇报'];
  function wbBrief(ns) { return VK.wb({ noside: ns, pw: ns ? 520 : 470, nav: '', tasks: TASKS, task: 0, title: '把讲话稿做成一页简报', ms: [{ u: PROMPT.c1.split('\n\n')[0] + '\n读者：学院的老师，每人只有两分钟。……', files: ['王书记…讲话.docx'] }, { steps: [[1, '读取 <code>王书记…讲话.docx</code>　19 段，2036 字'], [1, '列要点：四点希望、4 组数字、1 段原话'], [1, '写入 <code>一页简报.docx</code>'], [1, '对照原文核对：职务、日期、数字、原话']], a: '做好了。核对了 4 项，有 1 处已按原文修正：“25 万”原文是“超过25万名”。', file: ['W', '一页简报.docx'] }], panel: VK.BRIEF, pname: '一页简报.docx', ps: ns ? .56 : .5 }); }
  function wbReport() { return VK.wb({ nav: '', tasks: TASKS, task: 2, title: '公众号 2026 年运营汇报', ms: [{ u: '数据我核对过了。现在根据《数据核对表.xlsx》写一份给校领导看的《公众号 2026 年运营汇报》。……' }, { steps: [[1, '读取 <code>数据核对表.xlsx</code>'], [1, '三个发现，每个都对上了表里的数字'], [1, '写入 <code>公众号运营汇报.docx</code>']], a: '写好了。两条建议标了“建议”，等你来改。', file: ['W', '公众号运营汇报.docx'] }], panel: VK.REPORT, pname: '公众号运营汇报.docx', ps: .5 }); }
  function wxNews() { return '<div class="wx"><div class="wx-h">WorkBuddy 助理</div><div class="wx-b"><div class="wx-tm">周一 07:30</div><div class="wx-m"><img src="img/tool/wb.svg" alt=""><div><h6>宣传和理论热点早报</h6><div class="sec">学校相关</div><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a><div class="sec">高教动态</div><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a><div class="sec">理论热点</div><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a></div></div><div class="wx-m me"><i style="background:#d9d9d9"></i><div>第 3 条展开讲讲</div></div></div><div class="wx-f"></div></div>'; }
  function openWork(el, i) {
    if (i === 0) return VK.modal(el, VK.lap(VK.slot('work-1', '', wbBrief(), 1), 1180), '真实成品：内容全部出自讲话稿原文，数字和原话都核对过。');
    if (i === 2) return VK.modal(el, VK.lap(VK.slot('work-3', '', wbReport(), 1), 1180), '真实成品：数字都由学校给的 307 篇数据表算出。');
    if (i === 1) return VK.modal(el, VK.pho(VK.slot('zaobao-phone', '手机上收到早报的截图', wxNews()), 330), '版式示意。等信息源名单到了，开课前一周开始跑，换成真实的截图。');
    var w = WORKS[i]; return VK.modal(el, VK.lap(VK.slot('work-' + (i + 1), w.name + '的成品截图（WorkBuddy 窗口，右边打开产物）', VK.wb({ tasks: [w.name], task: 0, title: w.name, ms: [{ u: w.say }, { steps: [[1, '处理中的步骤'], [1, '已生成文件']], a: '做好了。', file: ['W', w.name + '.docx'] }] })), 1180), '这件成品还没做：请用学校的素材在 WorkBuddy 里做一遍，截图放进来。');
  }

  /* ================= 篇一 先看成品 ================= */
  VIZ['今天的安排'] = function (el) { var A = [['上午', ['先看成品：AI 都能做成什么样', '为什么我做不出来：六个开关', '认识 WorkBuddy，全员装好']], ['下午', ['案例一 · 一页简报', '案例二 · 热点早报', '案例三 · 向上汇报的稿子']], ['穿插着来', ['游戏：找开关、抽人展示', '每个案例做完，存成技能', '用工牌交作业']]], n = 0;
    el.innerHTML = '<div class="agd">' + A.map(function (c, k) { return '<div class="in" style="--i:' + k + '"><h3>' + c[0] + '</h3><ol>' + c[1].map(function (t) { n++; return '<li><b>0' + n + '</b>' + t + '</li>'; }).join('') + '</ol></div>'; }).join('') + '</div>' + call('今天带走', '一页简报 · 每天推到手机的早报 · 一份汇报稿 · 自己的技能'); };
  VIZ['这些，都是 AI 做的'] = function (el) { VK.wall(el, WORKS, ['先看成品', '这些，都是 AI 做的', '鼠标移上去 · 点一下看背面 · “打开”看成品'], function (i) { openWork(el, i); }); };
  VIZ['今天亲手做这三个'] = function (el) {
    var L = [['读', '一页简报', '给它一份长材料，交回一页', 1, VK.lap(doc(VK.BRIEF, 1), 440, 900)], ['找', '热点早报', '它自己去找，每天定时交到手机', 2, VK.pho(VK.slot('zaobao-phone', '手机上收到早报的截图', wxNews()), 160)], ['写', '向上汇报的稿子', '给它一堆数据，算出结论，写成稿', 3, VK.lap(doc(VK.REPORT, 1), 440, 900)]];
    el.innerHTML = '<div class="tri">' + L.map(function (l, i) { return '<div class="tri-c in" style="--i:' + i + '" data-i="' + i + '"><div class="tri-d">' + l[4] + '</div><div class="tri-t"><span class="vz1">' + l[0] + '</span><div><h3>' + l[1] + '</h3><p>' + l[2] + '</p></div><span class="lv">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= l[3] ? 'f' : '') + '"></i>'; }).join('') + '</span></div></div>'; }).join('') + '</div>' + call('为什么是这三个', '办公室里和文字打交道，就是读、找、写三件事。26 条需求里文字类的 13 条，都落在这三件上。');
    VK.fill(el); qa('.tri-c', el).forEach(function (c) { c.addEventListener('click', function () { openWork(el, +c.getAttribute('data-i')); }); });
  };
  VIZ['换成你自己的'] = OLD['1-05'];

  /* ================= 篇二 为什么我做不出来 ================= */
  VIZ['同一件事，两种结果'] = function (el) {
    var bad = VK.wb({ noside: 1, tasks: ['做个简报'], task: 0, title: '做个简报', ms: [{ u: '帮我把王书记的讲话做个简报' }, { st: '已完成 ›', a: '<p>好的！以下是为您整理的简报：</p><p><b>一、会议概况</b><br>大会在热烈的氛围中隆重召开，全面回顾了学院的光辉历程……</p><p><b>二、主要内容</b><br>讲话强调要加强学科建设、提升科研水平、推进国际交流，累计培养教师约 <mark>20 万名</mark>……</p><p><b>三、重要意义</b><br>本次讲话高屋建瓴、内涵丰富，为今后发展指明了方向……</p><p style="color:#999">（共 3 页，未生成文件）</p>' }] });
    el.innerHTML = '<div class="two"><div class="two-c"><div class="two-h bad">平时：随口说一句</div>' + VK.lap(bad, 620, 760) + '<div class="tags"><span>没读原文</span><span>数字是编的</span><span>三页，没人看</span><span>还得自己存文件</span></div></div><div class="two-c"><div class="two-h good">我们的成品</div>' + VK.lap(wbBrief(1), 620, 1000) + '<div class="tags g"><span>读了原文</span><span>数字对得上</span><span>一页</span><span>直接是 Word</span></div></div></div><div class="cap two-q">同一个软件，同一份讲话。<b>差在哪？</b></div>';
    VK.steps(el, 3, function (i) { el.querySelector('.two').setAttribute('data-s', i); q('.two-q', el).innerHTML = ['同一个软件，同一份讲话。<b>差在哪？</b>', '左边的四个毛病，你是不是都遇到过？', '<b>差的不是软件，是你给它的东西。</b>往下看是哪几样。'][i]; }, { label: function (i) { return ['看左边哪里不对', '所以差在哪'][i]; } });
  };
  VIZ['你卡在哪一步'] = function (el) {
    var P = [['bolt', '工具用不起来', '装好了，不知道让它干什么', '它够不着你的文件，也没有趁手的工具'], ['say', '不知道怎么跟它说', '说一句，它回一堆，都不是我要的', '你没说清楚给谁看、要什么、交成什么样'], ['star', '做出来不如别人的', '看别人的案例很好，自己做就不行', '少了材料、少了检查、少了攒下来的规则']];
    el.innerHTML = '<div class="pain">' + P.map(function (p, i) { return '<div class="pain-c in" style="--i:' + i + '"><div class="pf">' + ic(p[0]) + '<h3>' + p[1] + '</h3><p>“' + p[2] + '”</p><button class="vbtn hand">我也是 ✋ <b>0</b></button></div><div class="pb"><div class="en">其实是</div><h3>' + p[3] + '</h3></div></div>'; }).join('') + '</div>' + '<div class="cap" style="margin-top:18px;text-align:center">先举手：你中了哪一条？点卡片上的按钮记个数。再按 ↓ 看原因。</div>';
    qa('.hand', el).forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); var n = q('b', b); n.textContent = +n.textContent + 1; }); });
    VK.steps(el, 4, function (i) { qa('.pain-c', el).forEach(function (c, k) { c.classList.toggle('flip', k < i); }); }, { label: function (i) { return '翻开第 ' + (i + 1) + ' 张'; }, end: '三条都翻开了，按 → 看怎么解决' });
  };
  /* 六个开关：全关的时候是“平时的结果”，一个一个打开，变成我们的成品 */
  var SW = [['say', '说清楚', '给谁看、要什么、交成什么样', '太长，没人看得完'], ['doc', '给材料', '把原文放到它面前', '数字是编的'], ['hand', '给工具', '让它能读文件、写文件', '只回一段话，没有文件'], ['plan', '先看方案', '大事先让它说打算怎么做', '写成了新闻稿'], ['loop', '让它自查', '做完对照原文核一遍', '引号里的话被改写了'], ['save', '存成规则', '把做法存下来，下次一句话', '下次还得从头说']];
  VIZ['差的不是工具，是六个开关'] = function (el) {
    var on = [0, 0, 0, 0, 0, 0];
    el.innerHTML = '<div class="con"><div class="con-l">' + SW.map(function (s, i) { return '<div class="sw" data-i="' + i + '">' + ic(s[0]) + '<div><h3>' + s[1] + '</h3><p>' + s[2] + '</p></div><i class="tg"></i></div>'; }).join('') + '</div><div class="con-r">' + VK.lap('', 780, 1000) + '<div class="con-s"><b></b><span></span></div></div></div>';
    function brief() { var long = !on[0], fake = !on[1], news = !on[3], alt = !on[4];
      return '<div class="pap">' + '<div class="tt">' + (news ? '<mark class="bd">【新闻稿】</mark>我校初等教育学院隆重举行办学 120 周年大会' : '王国胤书记在初等教育学院办学 120 周年高质量发展大会上的讲话') + '</div><div class="mt">' + (long ? '<mark class="bd">第 1 页 / 共 3 页</mark>' : '一页简报') + ' · 2026 年 10 月 24 日</div>' +
        '<div class="lead">120 年不是终点，是新起点：对学院未来发展提四点希望。</div><h5>四点希望</h5><div class="four"><div>一、坚持立德树人，擦亮百年师范底色</div><div>二、坚持守正创新，持续深化内涵建设</div><div>三、深化校地协同，拓展服务地方效能</div><div>四、凝聚校友力量，共筑发展共同体</div></div>' +
        '<h5>关键数字</h5><div class="nums">' + (fake ? '<div><b><mark class="bd">1905</mark></b><span>学堂创办</span></div><div><b><mark class="bd">约 20 万</mark></b><span>累计培养教师</span></div><div><b><mark class="bd">3 万</mark></b><span>学院学子</span></div><div><b><mark class="bd">首批</mark></b><span>试点院校</span></div>' : '<div><b>1906</b><span>官立川东师范学堂创办</span></div><div><b>25 万+</b><span>建校以来累计培养教师</span></div><div><b>5 万余</b><span>学院学子扎根讲台</span></div><div><b>20 所</b><span>全国首批试点院校之一</span></div>') + '</div>' +
        '<h5>可以直接引用的原话</h5><blockquote>' + (alt ? '“<mark class="bd">要大力推进人工智能与教育的全面融合</mark>。”<cite>原稿里找不到这句话</cite>' : '“深入推进数智化教育改革，推动人工智能等数字技术与教育教学深度融合。”<cite>原文第 14 段 · 逐字核对一致</cite>') + '</blockquote>' + (long ? '<h5>三、重要意义</h5><p style="font:400 17px/1.8 sans-serif;color:#555">本次讲话高屋建瓴、内涵丰富，为今后发展指明了方向……（后面还有两页）</p>' : '') + '</div>'; }
    function draw() {
      var n = on.filter(Boolean).length, u = on[0] ? '读者：学院的老师，每人两分钟。把讲话稿做成一页简报：一句话主旨、四点希望、关键数字、一段原话。' : '帮我把王书记的讲话做个简报';
      var st2 = []; if (on[3]) st2.push([1, '方案：① 读原文 ② 列要点 ③ 成稿 ④ 核对　你点了“开始执行”']); if (on[1] && on[2]) st2.push([1, '读取 <code>讲话稿.docx</code>　19 段，2036 字']); if (on[2]) st2.push([1, '写入 <code>一页简报.docx</code>']); if (on[4]) st2.push([1, '对照原文核对：1 处数字已按原文修正']); if (on[5]) st2.push([1, '已存为技能“一页简报”，下次一句话调用']);
      var o = { noside: 1, pw: 520, tasks: ['做个简报'], task: 0, title: '做个简报', plan: on[3], ms: [{ u: u, files: on[1] ? ['讲话稿.docx'] : null }, { st: '已完成 ›', steps: st2, a: on[2] ? '做好了。' : '<p>好的，以下是简报内容：（一大段文字，要你自己复制到 Word 里排版）</p>', file: on[2] ? ['W', '一页简报.docx'] : null }], panel: brief(), pname: on[2] ? '一页简报.docx' : '对话里的文字', ps: .56 };
      q('.vp', el).innerHTML = VK.wb(o);
      qa('.sw', el).forEach(function (s, i) { s.classList.toggle('on', !!on[i]); });
      q('.con-s b', el).textContent = 6 - n; q('.con-s span', el).innerHTML = n === 6 ? '和我们的成品一样了' : '步，才到我们的成品<em>' + SW.filter(function (_, i) { return !on[i]; }).map(function (s) { return s[3]; }).join(' · ') + '</em>'; q('.con-s', el).classList.toggle('ok', n === 6);
    }
    qa('.sw', el).forEach(function (s, i) { s.addEventListener('click', function () { on[i] = on[i] ? 0 : 1; draw(); }); });
    VK.steps(el, 7, function (i) { for (var k = 0; k < 6; k++) on[k] = k < i ? 1 : 0; draw(); }, { label: function (i) { return '打开：' + SW[i][1]; }, end: '六个都开了。按 → 看它们为什么管用' });
  };
  /* AI 接到一件事的全过程：左边是结构，右边是它桌上的东西越堆越多；六个开关各管哪一处 */
  VIZ['AI 接到一件事，是这样干完的'] = function (el) {
    var N = { you: ['你', '说目标', 16, 14, 150, 86], mem: ['记忆', '习惯、技能', 388, 14, 150, 86], desk: ['桌子', '它看得见的全部', 150, 150, 254, 86], brain: ['大脑', '模型：决定下一步', 16, 300, 186, 92], hand: ['手', '工具：读、写、搜', 352, 300, 186, 92], out: ['交付', '一份文件', 16, 446, 186, 76] };
    var BD = [['you', 0, 150, 4], ['desk', 1, 396, 146], ['hand', 2, 500, 384], ['brain', 3, 0, 392], ['loop', 4, 216, 262], ['mem', 5, 500, 4]];
    var L = [[['you'], 0, 'u', '你', '把这份讲话做成一页简报，读者是学院老师……', '', 12], [['desk'], 1, 't', '上桌', '讲话稿.docx 放到它面前：19 段，2036 字', '', 36], [['brain'], 3, 'm', '大脑', '先出方案：① 读原文 ② 列要点 ③ 成稿 ④ 核对。等你点头', '', 40], [['brain', 'hand'], 2, 'm', '大脑', '它不动手，只写出要用哪个工具', '{ "tool": "read_file", "path": "讲话稿.docx" }', 42], [['hand', 'desk'], 2, 't', '手', '程序真去读文件，把读到的内容放回桌上', '', 48],
      [['brain'], -1, 'm', '大脑', '读完，列出：四点希望 · 4 组数字 · 1 段原话', '', 52], [['hand'], 2, 'g', '检查点', '要写文件了，先问你：允许写入这个文件夹吗？你点了允许', '{ "tool": "write_file", "path": "一页简报.docx" }', 54], [['brain', 'desk'], 4, 'm', '大脑', '回头核对：原话和第 14 段逐字一致；“25 万”原文是“超过25万名”，改', '', 60], [['out'], -1, 'm', '交付', '一页简报.docx，附一行“有 1 处已按原文修正”', '', 62], [['mem'], 5, 't', '记忆', '把这次的做法存成技能，下次一句话调用', '', 62]];
    el.innerHTML = '<div class="fl2"><div class="fl2-d"><svg viewBox="0 0 554 540"><defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs><g fill="none" stroke="#111" stroke-width="2.2" marker-end="url(#fa)"><path d="M166 70Q210 80 232 146"/><path d="M388 70Q344 80 322 146"/><path d="M190 238Q130 250 116 296"/><path d="M204 346H348"/><path d="M446 298Q440 250 372 238"/><path d="M108 394V442"/></g><path d="M204 484Q470 520 462 104" fill="none" stroke="#999" stroke-width="2" stroke-dasharray="6 6" marker-end="url(#fa)"/></svg>' +
      Object.keys(N).map(function (k) { var n = N[k]; return '<div class="nd fn" data-k="' + k + '" style="left:' + n[2] + 'px;top:' + n[3] + 'px;width:' + n[4] + 'px;height:' + n[5] + 'px">' + n[0] + '<small>' + n[1] + '</small></div>'; }).join('') + '<div class="fgate">检查点</div><div class="floop">一圈一圈转，直到做完</div>' +
      BD.map(function (b) { return '<span class="fbd" data-b="' + b[1] + '" style="left:' + b[2] + 'px;top:' + b[3] + 'px">' + SW[b[1]][1] + '</span>'; }).join('') + '</div>' +
      '<div class="tr2"><div class="hd3"><span>它桌上的东西：每转一圈，都把这一整摞重新读一遍 <span class="demo" style="color:#ccc;border-color:#777">示意</span></span><span class="n2"></span></div><div class="msgs"></div><div class="lb" style="padding:0 12px 6px">桌面占用</div><div class="mt2"><u></u></div></div></div>';
    VK.steps(el, L.length, function (i) { var c = L[i]; qa('.fn', el).forEach(function (n) { n.classList.toggle('on', c[0].indexOf(n.getAttribute('data-k')) > -1); }); qa('.fbd', el).forEach(function (b) { var k = +b.getAttribute('data-b'); b.classList.toggle('on', k === c[1]); b.classList.toggle('done', L.slice(0, i).some(function (x) { return x[1] === k; })); });
      q('.fgate', el).classList.toggle('on', c[2] === 'g');
      q('.msgs', el).innerHTML = L.slice(Math.max(0, i - 3), i + 1).map(function (m, k, a) { return '<div class="ms ' + m[2] + (k === a.length - 1 ? ' cu' : '') + '"><b>' + m[3] + '</b><div><p>' + m[4] + '</p>' + (m[5] ? '<code>' + m[5] + '</code>' : '') + '</div></div>'; }).join('');
      q('.mt2 u', el).style.width = c[6] + '%'; q('.n2', el).textContent = '第 ' + (i + 1) + ' / ' + L.length + ' 步'; }, { label: function (i) { var b = L[i + 1][1]; return b >= 0 ? '下一步 · 这里是开关：' + SW[b][1] : '下一步'; } });
  };
  /* 放大看大脑：一句话在模型里走一趟。注意力的粗细、概率都是示意；正确答案出自讲话稿 */
  var TK = ['重庆', '师范', '大学', '的', '办学', '历史', '可', '追溯', '至'], ATT = [.09, .07, .05, .01, .2, .26, .02, .3];
  var CH = [{ c: [['1906', .58], ['1954', .24], ['1902', .08], ['1936', .06], ['1898', .04]], aft: ['年', '创办', '的'] }, { c: [['官立川东师范学堂', .52], ['重庆师范学堂', .22], ['四川省立师范学校', .14], ['川东道立师范', .12]], aft: ['，', '学校', '于'] }, { c: [['1954', .61], ['1906', .2], ['1950', .11], ['1960', .08]], aft: ['年', '建校', '。'] }];
  VIZ['放大看大脑：它只会猜下一个词'] = function (el) {
    var ST = ['切成词片', '变成数字', '互相看一眼', '算出概率', '抽一个，接上'], CAP = ['模型不认识句子，只认识一个个<b>词片</b>。你的话先被切开，每片有一个编号。', '每个词片换成<b>一长串数字</b>。意思相近的词，数字也相近。这里只画 6 个，真实的有上千个。', '最后一个词回头看前面<b>所有的词</b>，决定谁更要紧。线越粗，看得越重。这一步叫注意力。点别的词看看。', '看完，它给词表里<b>每一个词</b>打分，得到下一个词的概率。它没有“不知道”这个选项。', '按概率<b>抽一个</b>接在后面，再把整句话从头走一遍。文章就是这样一个词一个词接出来的。'];
    var SEQ = [0, 1, 2, 3, 4, 3, 4, 3, 4], picks = [], sel = TK.length - 1, busy = false;
    el.innerHTML = '<div class="tabs5">' + ST.map(function (s, i) { return '<button data-i="' + i + '"><b>' + (i + 1) + '</b>' + s + '</button>'; }).join('') + '</div><div class="mdl"><div class="mst"><svg></svg><div class="toks"></div><div class="mcap"></div></div><div class="mside"><div class="lb">下一个词的候选 <span class="demo">数值为示意</span></div><div class="cand"></div><div class="tmp"><span>稳</span><input type="range" min="0.3" max="2" step="0.05" value="1"><span>放得开</span></div><div class="lb">随机程度（温度）：越高，小概率的词越容易被抽中。<br>WorkBuddy 里你调不了它，但它一直在起作用。</div><div class="verd"></div></div></div>';
    var toks = q('.toks', el), svg = q('svg', el), tmp = q('input', el), cand = q('.cand', el), verd = q('.verd', el), stp;
    function round(i) { var r = 0; for (var k = 0; k <= i; k++) if (SEQ[k] === 4) r++; return r; }
    function seq(r) { var a = TK.map(function (t) { return { t: t }; }); for (var k = 0; k < r; k++) { a.push({ t: CH[k].c[picks[k]][0], n: 1, bad: picks[k] !== 0 }); CH[k].aft.forEach(function (t) { a.push({ t: t, n: 1 }); }); } return a; }
    function probs(r) { var c = CH[r].c, T = +tmp.value, p = c.map(function (x) { return Math.pow(x[1], 1 / T); }), z = p.reduce(function (a, b) { return a + b; }, 0); return p.map(function (x) { return x / z; }); }
    function sample(r) { var p = probs(r), x = Math.random(), a = 0; for (var i = 0; i < p.length; i++) { a += p[i]; if (x < a) return i; } return 0; }
    function draw(i, hi) {
      var s = SEQ[i], r = round(i), shown = s === 4 ? r - (busy ? 1 : 0) : r, a = seq(shown), small = a.length > 12, cr = Math.min(CH.length - 1, s === 4 ? r - 1 : r), done = i === SEQ.length - 1 && !busy;
      qa('.tabs5 button', el).forEach(function (b, k) { b.className = k === s ? 'on' : k < s || i > 4 ? 'done' : ''; });
      toks.style.flexWrap = small ? 'wrap' : ''; toks.style.top = small ? '36px' : s === 1 ? '200px' : '170px';
      toks.innerHTML = a.map(function (x, k) { var v = ''; if (s === 1 && !small) { v = '<span class="vec">'; for (var m = 0; m < 6; m++) v += '<i class="' + (m % 2 ? 'n' : '') + '" style="height:' + (((k * 37 + m * 53 + x.t.charCodeAt(0)) % 60) + 10) + 'px;animation-delay:' + (k * 90 + m * 60) + 'ms"></i>'; v += '</span>'; }
        return '<span class="tok' + (x.bad ? ' bad' : x.n ? ' new' : '') + (s === 2 && k === sel && !small ? ' sel' : '') + '" data-i="' + k + '" style="' + (small ? 'font-size:23px;padding:9px 9px' : '') + '">' + (s === 0 && !small ? '<small>#' + (1000 + (x.t.charCodeAt(0) * 7 + k * 131) % 8999) + '</small>' : '') + x.t + v + '</span>'; }).join('');
      svg.innerHTML = '';
      if (s === 2 && !small) { var box = q('.mst', el), R = box.getBoundingClientRect(), kk = R.width / box.offsetWidth, els = qa('.tok', toks), c = function (e) { var b = e.getBoundingClientRect(); return [(b.left + b.width / 2 - R.left) / kk, (b.top - R.top) / kk]; }, to = c(els[sel]), h = '';
        els.forEach(function (e, k) { if (k >= sel) return; var w = sel === TK.length - 1 ? ATT[k] : (((k * 29 + sel * 17) % 23) + 2) / 100 * (1 + (sel - k < 3 ? 1.6 : 0)), f = c(e), my = Math.min(f[1], to[1]) - 30 - (to[0] - f[0]) * .22; h += '<path class="att" style="animation-delay:' + (k * 130) + 'ms" d="M' + f[0] + ' ' + f[1] + ' Q' + (f[0] + to[0]) / 2 + ' ' + my + ' ' + to[0] + ' ' + to[1] + '" fill="none" stroke="' + (w > .15 ? '#111' : '#aaa') + '" stroke-width="' + (1 + w * 26).toFixed(1) + '" opacity="' + (.35 + w * 2).toFixed(2) + '"/>'; }); svg.innerHTML = h;
        qa('.tok', toks).forEach(function (e) { e.style.cursor = 'pointer'; e.addEventListener('click', function () { var k = +e.getAttribute('data-i'); if (k > 0) { sel = k; draw(i); } }); }); }
      q('.mcap', el).innerHTML = done ? '它没有回头检查，也不知道自己写的对不对。<b>对错要靠你核。</b>' : CAP[s];
      var p = probs(cr), act = s >= 3; cand.innerHTML = CH[cr].c.map(function (x, k) { return '<button disabled class="' + (hi === k ? 'hi' : '') + (s === 4 && !busy && picks[cr] === k ? ' pk' : '') + '" style="opacity:' + (act ? 1 : .3) + '">' + x[0] + '<i><u style="width:' + (p[k] * 100).toFixed(1) + '%"></u></i><em>' + (p[k] * 100).toFixed(0) + '%</em></button>'; }).join('');
      if (done) { var bad = picks.filter(function (x) { return x !== 0; }).length; verd.className = 'verd' + (bad ? ' bad' : ''); verd.textContent = bad ? '有 ' + bad + ' 处和事实不符，它照样写得很通顺。这就是幻觉。' : '这次全对。按 ↑ 退回去，把随机程度调高再抽几次。'; } else { verd.className = 'verd'; verd.textContent = ''; }
    }
    stp = VK.steps(el, SEQ.length, function (i, d) {
      if (SEQ[i] === 4 && d > 0) { var r = round(i) - 1, pk = sample(r), n = CH[r].c.length, k = 0, total = 14 + pk; picks[r] = pk; picks.length = r + 1; busy = true; draw(i, 0);       // 候选上的高亮一格一格慢下来，停在抽中的那个
        (function hop() { if (k >= total) { busy = false; VK.later(function () { draw(i); }, 500); return; } draw(i, k % n); k++; VK.later(hop, 110 + k * k * 1.6); })(); return; }
      busy = false; draw(i); }, { label: function (i) { return ['把它变成数字', '看它怎么互相看', '算下一个词的概率', '抽一个', '再走一遍：算概率', '抽一个', '再走一遍：算概率', '抽一个'][i]; }, end: '这句话写完了。按 → 往下' });
    var realStep = window.VIZ_STEP; window.VIZ_STEP = function (d) { if (busy) return true; return realStep(d); };
    tmp.addEventListener('input', function () { if (!busy) draw(stp.at()); });
  };
  VIZ['所以：没给材料，它就编'] = OLD['1-07'];
  VIZ['所以：它只看得见桌上的东西'] = OLD['1-08'];
  VIZ['对症下药'] = function (el) {
    var P = [['工具用不起来', [1, 2], '第三节：认识 WorkBuddy，把文件夹交给它'], ['不知道怎么跟它说', [0, 3], '案例一：照着提示词做一遍，再改成自己的'], ['做出来不如别人的', [1, 4, 5], '每个案例后面：核对、把问题写成规则、存成技能']];
    el.innerHTML = '<div class="rx"><div class="rx-l">' + P.map(function (p, i) { return '<button class="rx-p" data-i="' + i + '"><small>卡点 ' + (i + 1) + '</small>' + p[0] + '</button>'; }).join('') + '</div><div class="rx-m">→</div><div class="rx-r"><div class="lb">要拧的开关</div><div class="rx-s">' + SW.map(function (s, i) { return '<div class="rx-w" data-i="' + i + '">' + ic(s[0]) + '<b>' + s[1] + '</b></div>'; }).join('') + '</div><div class="rx-t"></div></div></div>';
    function set(i) { qa('.rx-p', el).forEach(function (b, k) { b.classList.toggle('on', k === i); }); qa('.rx-w', el).forEach(function (w, k) { w.classList.toggle('on', P[i][1].indexOf(k) > -1); }); q('.rx-t', el).innerHTML = '<b>今天在哪练</b>' + P[i][2]; }
    qa('.rx-p', el).forEach(function (b, i) { b.addEventListener('click', function () { st.go(i); }); }); var st = VK.steps(el, 3, set, { label: function (i) { return '看下一个卡点'; }, end: '三个卡点都有解。按 → 玩个游戏' });
  };
  VIZ['游戏：找开关'] = function (el) {
    var Q = [['你只说“写一份王书记讲话的简报”，没给讲话稿。它写得头头是道，数字全是编的。', 1], ['它回了你三千字。领导只有两分钟。', 0], ['它说“请把文件内容粘贴给我”。你手里有 20 份文件。', 2], ['它埋头做了半小时，交上来是一篇新闻稿，你要的是简报。', 3], ['简报里引号里的那句话，原稿里找不到。', 4], ['上周教过它的格式，这周又得从头说一遍。', 5]], score = 0, done = {};
    el.innerHTML = '<div class="qz"><div class="qz-q"><small></small><p></p></div><div class="qz-o">' + SW.map(function (s, i) { return '<button data-i="' + i + '">' + ic(s[0]) + s[1] + '</button>'; }).join('') + '</div><div class="qz-f"><span class="qz-s">答对 <b>0</b> / ' + Q.length + '</span><button class="vbtn k" data-g="wheel:num" data-gt="抽一位来答">抽一位来答</button><span class="qz-a"></span></div></div>';
    var cur = 0; function show(i) { cur = i; q('.qz-q small', el).textContent = '翻车现场 ' + (i + 1) + ' / ' + Q.length + ' · 哪个开关没拧好？'; q('.qz-q p', el).textContent = Q[i][0]; qa('.qz-o button', el).forEach(function (b) { b.className = ''; }); q('.qz-a', el).textContent = ''; }
    qa('.qz-o button', el).forEach(function (b, i) { b.addEventListener('click', function () { var ok = i === Q[cur][1]; b.className = ok ? 'ok' : 'no'; if (!ok) qa('.qz-o button', el)[Q[cur][1]].className = 'ok'; if (ok && !done[cur]) { done[cur] = 1; score++; q('.qz-s b', el).textContent = score; } q('.qz-a', el).textContent = (ok ? '对了：' : '应该是：') + SW[Q[cur][1]][1] + '。' + SW[Q[cur][1]][2] + '。'; }); });
    VK.steps(el, Q.length, show, { label: function () { return '下一题'; }, end: '答完了，按 → 认识 WorkBuddy' });
  };

  /* ================= 篇三 认识 WorkBuddy（画面是官方文档的截图） ================= */
  var SRC = '<div class="src-n">画面：WorkBuddy 官方文档截图（2026 年 11 月）。可以换成自己电脑上的截图。</div>';
  function pinPage(el, img, pins, w) { el.innerHTML = '<div class="pn"><div><div class="pn-d">' + VK.lap(VK.shot(img, 1), w || 840) + pins.map(function (p, i) { var W = (w || 840) - 26; return '<i class="pin" data-i="' + i + '" style="left:' + (13 + W * p[0] / 100).toFixed(0) + 'px;top:' + (13 + W * .625 * p[1] / 100).toFixed(0) + 'px">' + (i + 1) + '</i>'; }).join('') + '</div>' + SRC + '</div><ol class="pn-l">' + pins.map(function (p, i) { return '<li data-i="' + i + '"><b>' + (i + 1) + '</b><div><h3>' + p[2] + '</h3><p>' + p[3] + '</p></div></li>'; }).join('') + '</ol></div>';
    function set(i) { qa('.pin', el).forEach(function (p, k) { p.classList.toggle('on', k === i); }); qa('.pn-l li', el).forEach(function (l, k) { l.classList.toggle('on', k === i); }); }
    var st = VK.steps(el, pins.length, set, { label: function (i) { return '看第 ' + (i + 2) + ' 处'; } }); qa('.pin,.pn-l li', el).forEach(function (p) { p.addEventListener('click', function () { st.go(+p.getAttribute('data-i')); }); }); }
  VIZ['WorkBuddy 长这样'] = function (el) { pinPage(el, 'img/wb/home.jpg', [[16, 25, '左边：导航和任务', '新建任务、定时任务、技能都从这里进。做过的任务排在下面。'], [59, 51, '中间：说话的地方', '在这里用大白话说你要什么。@ 可以带上文件。'], [41, 61.5, '输入框下面：工作空间和权限', '告诉它在哪个文件夹里干活，能动到什么程度。'], [76, 56, '模型', '不确定就用默认的。难的事可以换强一点的。'], [8.8, 93, '左下角：你的账号', '套餐、积分余额、设置都在头像里。']]); };
  VIZ['下载、安装、登录'] = function (el) {
    var S = [['打开 workbuddy.cn，点“立即下载”', '选 Windows x64', 'img/wb/download.jpg'], ['双击安装包，一路下一步', '建议勾上“创建桌面快捷方式”', 'img/wb/login.jpg'], ['点“登录”，用微信扫码', '浏览器里扫完码，回到软件就能用', 'img/wb/home.jpg']];
    el.innerHTML = '<div class="pn"><div><div class="pn-d">' + VK.lap('<div class="sw3">' + S.map(function (s, i) { return '<img class="vshot fit" data-i="' + i + '" src="' + s[2] + '" alt="">'; }).join('') + '</div>', 800) + '</div>' + SRC + '</div><div><ol class="pn-l">' + S.map(function (s, i) { return '<li data-i="' + i + '"><b>' + (i + 1) + '</b><div><h3>' + s[0] + '</h3><p>' + s[1] + '</p></div></li>'; }).join('') + '</ol>' + call('装不上', '只支持 Windows 10 以上的 64 位系统。被火绒、360、电脑管家拦了，先临时退出。', 1) + call('点登录没反应', '没设默认浏览器。点“复制链接”，自己粘到浏览器里打开。', 1) + '</div></div>';
    VK.steps(el, 3, function (i) { qa('.sw3 img', el).forEach(function (m, k) { m.classList.toggle('on', k === i); }); qa('.pn-l li', el).forEach(function (l, k) { l.classList.toggle('on', k === i); }); }, { label: function (i) { return '第 ' + (i + 2) + ' 步'; } });
  };
  VIZ['要不要付费'] = function (el) {
    var T = [['体验版', '免费', '', '500', '3 个', '系统自动选模型', '先用它跑通今天', 'y'], ['标准版', '99 元 / 月', '连续包月 70 元 / 月', '4,000', '15 个', '全部模型可选', '想跟完五天，开一个月', 'k'], ['高级版', '199 元 / 月', '连续包月 140 元 / 月', '9,000', '30 个', '全部模型可选', '天天重度用再考虑', ''], ['旗舰版', '999 元 / 月', '连续包月 700 元 / 月', '50,000', '99 个', '全部模型可选', '团队级用量', '']];
    el.innerHTML = '<div class="prc">' + T.map(function (t, i) { return '<div class="pr-c in ' + t[7] + '" style="--i:' + i + '"><h3>' + t[0] + '</h3><div class="pr-p">' + t[1] + '<small>' + (t[2] || '&nbsp;') + '</small></div><dl><dt>每月积分</dt><dd><b>' + t[3] + '</b></dd><dt>定时任务</dt><dd>' + t[4] + '</dd><dt>模型</dt><dd>' + t[5] + '</dd></dl><div class="pr-a">' + t[6] + '</div></div>'; }).join('') + '</div>' +
      '<div class="vrow" style="margin-top:14px;align-items:stretch"><div class="call" style="flex:1;margin:0"><b>我们的建议</b><span>课上先用体验版，不用付钱。想把五天的案例都做完，开一个月标准版；连续包月会自动续费，课后记得取消。</span></div><div class="call r" style="flex:.7;margin:0"><b>待实测</b><span>三个案例各耗多少积分，团队测完再定最终建议。</span></div></div><div class="src-n">来源：workbuddy.cn 定价页和官方文档“定价详情”（2026 年 11 月 21 日查）。积分当月有效，不结转。</div>';
  };
  VIZ['工作空间：给它一个文件夹'] = function (el) {
    el.innerHTML = '<div class="pn"><div><div class="pn-d">' + VK.lap(VK.shot('img/wb/workspace.jpg', 1), 640) + '</div>' + SRC + '</div><div><div class="tree in">📁 <b>我的AI工作台</b><br>├─ 📁 资料包<span>今天的材料都在这</span><br>├─ 📁 01_简报<br>├─ 📁 02_早报<br>├─ 📁 03_汇报稿<br>└─ 📁 04_技能</div>' + steps([['桌面建“我的AI工作台”，解压资料包进去', '文件夹里有这几个子文件夹'], ['输入框下面点“选择工作空间”→“打开本地文件夹”', '选中“我的AI工作台”'], ['问它：这个文件夹里有什么', '它说出这几个子文件夹，说对了举手', 'y']], 'sm') + '</div></div>';
  };
  VIZ['输入框下面的三个选择'] = function (el) {
    var C = [['img/wb/mode.jpg', '模式', '默认 · 计划 · 仅问答', '平时用默认。事情大、怕它跑偏，先开“计划”：它先说打算怎么做，你点头再动手。'], ['', '模型', '快速 · 均衡 · 极致', '不确定就用均衡。越强的模型越耗积分。'], ['img/wb/perm.jpg', '权限', '默认权限 · 完全访问', '一直用默认权限：在工作空间里放手干，删文件、跑程序、越界之前先问你。']];
    el.innerHTML = '<div class="tri3">' + C.map(function (c, i) { return '<div class="t3 in" style="--i:' + i + '"><div class="t3-i">' + (c[0] ? '<img src="' + c[0] + '" alt="">' : '<div class="mdl3"><span>快速<small>简单、明确的事</small></span><span class="on">均衡<small>绝大多数的事</small></span><span>极致<small>复杂、要反复验证的事</small></span></div>') + '</div><div class="en">' + c[2] + '</div><h3>' + c[1] + '</h3><p>' + c[3] + '</p></div>'; }).join('') + '</div>' + SRC;
  };
  VIZ['技能：给它装本事'] = function (el) {
    el.innerHTML = '<div class="pn"><div><div class="pn-d">' + VK.lap(VK.shot('img/wb/skills.jpg', 1), 780) + '</div>' + SRC + '</div><div>' + cards([['bolt', '', '从技能市场装', '左边点“专家·技能·连接器”，看中哪个点 + 号'], ['say', '', '说一句让它找', '“帮我找一个能把网页转成 PDF 的技能”'], ['save', '', '让它帮你创建', '把自己的做法存成技能。下午每个案例做完都存一个', 'y']], 1, 'row') + call('小心', '技能可能把你的内容发到外面。优先用官方推荐的，第三方的先看来源。', 1) + '</div></div>';
  };
  VIZ['数字员工：定时任务和手机助理'] = function (el) {
    el.innerHTML = '<div class="pn" style="grid-template-columns:1fr 1fr"><div><div class="pn-d">' + VK.lap(VK.shot('img/wb/auto-new.jpg', 1), 640) + '</div><h3 class="h3s">定时任务：到点自己干</h3><p class="ps">填名称、提示词、几点跑。本地任务要电脑开着；云端任务关机也照跑，但读不到你电脑上的文件。</p></div><div><div class="pn-d">' + VK.lap(VK.shot('img/wb/wechat.jpg', 1), 640) + '</div><h3 class="h3s">助理：在微信里给它派活</h3><p class="ps">扫码绑定后，手机上发一句话，电脑上的 WorkBuddy 就开始干，干完把结果发回微信。电脑要开着。</p></div></div>' + SRC;
  };
  VIZ['全员装好'] = function (el) { el.innerHTML = '<div class="pn" style="grid-template-columns:1.2fr 1fr"><div>' + steps([['打开 WorkBuddy，微信扫码登录', '左下角出现你的头像'], ['选好工作空间：我的AI工作台', '输入框下面显示文件夹的名字'], ['发一句：这个文件夹里有什么', '它说出几个子文件夹的名字', 'y']]) + '</div><div class="now"><div class="en">全员一起</div><h3>装好的举手</h3><p>没装好的举手，助教过去。全员举手后再往下。</p><button class="vbtn k" data-g="timer:8" data-gt="全员装好" data-gn="装好、登录、选好工作空间">计时 8 分钟</button></div></div>'; };

  /* ================= 案例的通用页 ================= */
  function useFor(el, k, fam, line) { el.innerHTML = '<div class="cards" style="--n:4">' + RN.map(function (r, i) { return '<div class="card in' + (i ? '' : ' y') + '" style="--i:' + i + '"><div class="en">' + r + '</div><h3>' + ROLE[i][k] + '</h3></div>'; }).join('') + '</div><div class="stat in" style="--i:4;margin-top:22px"><b>' + line[0] + '</b><span>' + line[1] + '<br>同一类的活：' + fam + '</span></div>'; }
  function howTo(el, list, to, text) { el.innerHTML = '<div class="how"><div>' + steps(list, 'sm') + '</div>' + pc(to, text, 'tall') + '</div>'; bindCopy(el); }
  function doNow(el, min, title, checks, dev, note) { el.innerHTML = '<div class="pn" style="grid-template-columns:1fr 1.05fr"><div class="now"><div class="en">现在做 · 做完举手</div><h3>' + title + '</h3><ul class="kit2">' + checks.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul><div class="vrow"><button class="vbtn k" data-g="timer:' + min + '" data-gt="' + title + '">计时 ' + min + ' 分钟</button><button class="vbtn" data-g="wheel:num" data-gt="抽一位，投屏看成品">抽一位看成品</button></div></div><div><div class="pn-d">' + dev + '</div><div class="src-n">' + note + '</div></div></div>'; VK.fill(el); }
  function upg(el, list) { el.innerHTML = '<div class="upg">' + list.map(function (u, i) { return '<div class="upg-c in" style="--i:' + i + '"><div class="big">' + (i + 1) + '</div><h3>' + u[0] + '</h3><p>' + u[1] + '</p>' + pc('接着发给它', u[2], 'mini') + '</div>'; }).join('') + '</div>'; bindCopy(el); }

  /* ================= 篇四 案例一 ================= */
  var C1 = '案例一：一页简报｜';
  VIZ[C1 + '它是什么'] = OLD['1-16'];
  VIZ[C1 + '有什么用'] = function (el) { useFor(el, 0, '会议纪要、文件摘要、学习材料', ['2036 字 → 一页', '领导两分钟看完；你省下通读和提炼的时间。']); };
  VIZ[C1 + '怎么做'] = function (el) { howTo(el, [['把讲话稿放进“01_简报”文件夹', '文件夹里多了一个 docx'], ['把右边这段话发给 WorkBuddy', '它开始读文件、写文件，左边能看到每一步'], ['点开右侧“产物”里的 Word', '一页简报，四块都在', 'y']], '发给 WorkBuddy · 先原样发，做出来再改', PROMPT.c1); };
  VIZ[C1 + '现在做'] = function (el) { doNow(el, 10, '做出你的第一份简报', ['“产物”里有《一页简报.docx》', '打开是一页', '主旨、几点希望、数字、原话都在'], VK.lap(wbBrief(1), 760, 1000), '做出来大概是这个样子（真实成品，内容出自讲话稿原文）。'); };
  VIZ[C1 + '注意：核对四样'] = OLD['1-20'];
  VIZ[C1 + '升级：让它越做越合你意'] = function (el) { upg(el, [['让它先问你', '你没想到的，它替你想', PROMPT.c1ask], ['不满意，就说具体', '说清改哪里、怎么改、别动哪里', PROMPT.c1fix], ['把意见变成规则', '改过三次的地方，让它记下来', PROMPT.c1rule]]); };
  VIZ[C1 + '存成技能'] = function (el) { el.innerHTML = '<div class="how">' + '<div>' + cards([['1', '', '换一份材料还能用', ''], ['2', '', '同事拿去也能用', ''], ['3', '', '结果你自己能核', '', 'y']], 1, 'row') + call('验收', '存好以后，换一份自己岗位的材料，只说一句“做成一页简报”，看结果是不是一个样子。') + '</div>' + pc('发给 WorkBuddy · 存成技能', PROMPT.c1skill, 'tall') + '</div>'; bindCopy(el); };

  /* ================= 篇五 案例二 ================= */
  var C2 = '案例二：热点早报｜';
  VIZ[C2 + '它是什么'] = function (el) { el.innerHTML = '<div class="pn" style="grid-template-columns:auto auto 1fr;gap:34px"><div><div class="pn-d">' + VK.pho(VK.slot('zaobao-phone', '手机上收到早报的截图', wxNews()), 250) + '</div><div class="src-n">我们的早报（版式示意）</div></div><div><div class="pn-d">' + VK.pho(VK.shot('img/wb/mail-phone.jpg'), 250) + '</div><div class="src-n">官方示例：每日简报推到邮箱</div></div><div>' + cards([['clock', 'WHEN', '每个工作日 7:30', '到点自己跑，不用你去叫'], ['doc', 'WHAT', '10 条，分三块', '学校相关 · 高教动态 · 理论热点'], ['web', 'SOURCE', '每条都有出处', '一句话，加原文链接', 'y']], 1, 'row') + '</div></div>'; VK.fill(el); };
  VIZ[C2 + '有什么用'] = function (el) { useFor(el, 1, '选题线索、舆情苗头、政策跟踪', ['每天省 30 分钟', '不用自己挨个刷网站；它筛好了，你只看该看的。']); };
  VIZ[C2 + '怎么做'] = function (el) { howTo(el, [['新建一个任务，工作空间还选“我的AI工作台”', '左边任务列表多了一条'], ['把右边这段话发给它，黄色的地方换成你的', '它开始联网搜索，一条一条找'], ['看它交回来的早报', '10 条以内，每条有链接', 'y']], '发给 WorkBuddy · 黄色的地方换成你自己的', PROMPT.c2); };
  VIZ[C2 + '现在做'] = function (el) { doNow(el, 12, '做出今天的早报', ['对话里有今天的早报', '“02_早报”文件夹里多了一个文件', '每条都带链接'], VK.lap(VK.slot('zaobao-run', 'WorkBuddy 跑早报的截图（对话里能看到搜索步骤和结果）', VK.wb({ noside: 1, tasks: TASKS, task: 1, title: '宣传和理论热点早报', ms: [{ u: '请帮我做一份今天的《宣传和理论热点早报》……' }, { steps: [[1, '联网搜索：教育部官网 最近 24 小时'], [1, '联网搜索：中国教育报 最近 24 小时'], [1, '筛掉 3 条旧闻、1 条打不开的链接'], [1, '写入 <code>02_早报/早报_今天.md</code>']], a: '今天的早报做好了，共 8 条。有 2 个来源今天没有新内容。', file: ['M', '早报_今天.md'] }] })), 760, 900), '示意。等信息源名单定了，换成真实跑出来的截图。'); };
  VIZ[C2 + '注意：抽查三样'] = function (el) { var C = [['是不是当天的', '看发布日期', '三天前的通知，被当成今天的新闻'], ['链接能不能打开', '随手点 3 条', '点进去是 404，或者是别的文章'], ['概括有没有走样', '对着原文读一遍', '“试点”被说成了“全面推开”']];
    el.innerHTML = '<div class="ckl" style="grid-template-columns:repeat(3,1fr)">' + C.map(function (c, i) { return '<div class="ck in" style="--i:' + i + '"><h3>' + c[0] + '</h3><p>' + c[1] + '</p><div class="ex">常见的错：' + c[2] + '</div></div>'; }).join('') + '</div>' + call('为什么要抽查', '它是按概率接词的，没见过的也会说得很肯定。新闻和理论表述，错一个字都是事故。') + call('做', '每人抽 3 条点开原文。发现一个问题，记下来，下一页用。');
    qa('.ck', el).forEach(function (c) { c.addEventListener('click', function () { c.classList.toggle('on'); }); }); };
  VIZ[C2 + '升级：把问题写成规则'] = function (el) { OLD['1-25'](el); el.insertAdjacentHTML('beforeend', pc('把你发现的问题写成规则，发给它', PROMPT.c2rule, 'mini wide')); bindCopy(el); };
  VIZ[C2 + '变成数字员工'] = function (el) { el.innerHTML = '<div class="how"><div><div class="pn-d">' + VK.lap(VK.shot('img/wb/auto-new.jpg', 1), 600) + '</div>' + SRC + call('待核', '结果怎么推到手机（微信助理、企业微信还是手机 App），以团队实测为准。', 1) + '</div><div>' + pc('发给 WorkBuddy · 让它自己建定时任务', PROMPT.c2auto) + steps([['发出上面这句话', '它建好一个定时任务，告诉你几点跑'], ['左边点“定时任务”，找到它，点“立即运行”', '马上跑一次，手机上收到', 'y']], 'sm') + '</div></div>'; bindCopy(el); };

  /* ================= 篇六 案例三 ================= */
  var C3 = '案例三：向上汇报的稿子｜';
  VIZ[C3 + '它是什么'] = function (el) { el.innerHTML = '<div class="pn" style="grid-template-columns:1fr auto 1fr;gap:22px;align-items:center"><div><div class="pn-d">' + VK.lap(VK.xls(9), 650, 900) + '</div><div class="src-n">学校给的原始数据：307 篇推文，4 列</div></div><div style="font:700 44px/1 var(--sans)">→</div><div><div class="pn-d">' + VK.lap(doc(VK.REPORT, 1), 650, 900) + '</div><div class="src-n">一份给领导看的汇报：每个结论后面都有数字</div></div></div>'; };
  VIZ[C3 + '有什么用'] = function (el) { useFor(el, 2, '年度总结、述职、成绩分析', ['结论要有数', '汇报最怕“效果显著”四个字。让它把每句话都落到数字上。']); };
  VIZ[C3 + '怎么做：先算，再写'] = function (el) { el.innerHTML = '<div class="how3">' + pc('第一步 · 只让它算', PROMPT.c3a, 'tall sm2') + '<div class="gate"><b>核</b><span>你抽三个数<br>自己算一遍</span><i class="dom">' + [0, 1, 2, 3, 4].map(function (i) { return '<u style="--i:' + i + '"></u>'; }).join('') + '</i><small>错一个数，<br>后面全倒。点一下</small></div>' + pc('第二步 · 数对了，再让它写', PROMPT.c3b, 'tall sm2') + '</div>'; bindCopy(el); q('.gate', el).addEventListener('click', function () { q('.dom', el).classList.toggle('fall'); }); };
  VIZ[C3 + '注意：先对上三样'] = OLD['1-30'];
  VIZ[C3 + '资料包，课后做完'] = OLD['1-31'];

  /* ================= 篇七 收尾 ================= */
  VIZ['游戏：抽一位，展示成品'] = function (el) { el.innerHTML = '<div class="pn" style="grid-template-columns:1fr 1fr"><div class="now"><div class="en">抽到的老师，投屏 1 分钟</div><h3>讲两件事</h3><ul class="kit2"><li>你的成品长什么样</li><li>今天踩的一个坑</li></ul><div class="vrow"><button class="vbtn k" data-g="wheel:num" data-gt="抽一位，展示成品">打开转盘</button><button class="vbtn" data-g="wheel:task" data-gt="小任务转盘">小任务转盘</button><button class="vbtn" data-g="timer:3" data-gt="每人 1 分钟">计时</button></div></div><div>' + cards([['star', '', '被抽到的加分', '分数记在工牌上，明天早上看排名'], ['bolt', '', '顶栏随时能开', '右上角“转盘”“计时”，哪一页都能用', 'y']], 1, 'row') + '</div></div>'; };
  VIZ['今天带走'] = function (el) { el.innerHTML = cards([['doc', 'OUTPUT', '一页简报', '换了自己岗位的材料'], ['phone', 'OUTPUT', '每天的早报', '7:30 推到手机'], ['star', 'OUTPUT', '几个自己的技能', '以后一句话调用'], ['check', 'HABITS', '六个开关', '说清楚 · 给材料 · 给工具 · 先看方案 · 让它自查 · 存成规则', 'd']], 4); };
  VIZ['今天的作业'] = OLD['1-35'];
  VIZ['明天准备'] = OLD['1-36'];
})();
