/* 第 1 天每一页的画面（第四版）。键 = “章名｜页标题”或“页标题”，和 课程内容_v1.md 里的标题一一对应。
   公共部件在 viz-kit.js（VK）：样机、WorkBuddy 窗口、成品墙、转盘和计时。版式在 day1.css。
   操作：→ 或 ↓ 走这一页的下一步（走完自动翻页），← 或 ↑ 退一步；按住 Shift 再按是直接翻页。点电脑、手机、截图可以放大。
   给 WorkBuddy 的提示词都在下面的 PROMPT 里，和《第1天_提示词.md》是同一份，改一处记得改另一处。 */
(function () {
  'use strict';
  var DAY = +(new URLSearchParams(location.search).get('d')) || 0;
  var VIZ = DAY === 1 ? (window.VIZ = window.VIZ || {}) : {}, VK = window.VK, q = VK.q, qa = VK.qa;      // 只在第 1 天登记页面；公共小部件放进 window.DK 给其他天用
  var I = { doc: '<path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7"/>', folder: '<path d="M3 6h7l2 3h9v10H3z"/>', check: '<path d="M5 4h14v16H5z"/><path d="M8 9l2 2 3-3M8 15l2 2 3-3M15 10h2M15 16h2"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>', star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>', bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>', photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M6 16l4-5 4 4 2-2 3 3"/>', say: '<path d="M4 5h16v11H10l-5 4v-4H4z"/>', hand: '<path d="M14 5l5 5-10 10H4v-5z"/><path d="M12 7l5 5"/>', plan: '<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>', loop: '<path d="M5 10a7 7 0 0 1 12-4l2 2M19 4v4h-4M19 14a7 7 0 0 1-12 4l-2-2M5 20v-4h4"/>', save: '<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>', store: '<path d="M4 9l2-5h12l2 5M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>' };
  var ic = function (k) { return '<span class="d-ic"><svg viewBox="0 0 24 24">' + I[k] + '</svg></span>'; };
  var esc = function (t) { return t.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
  var raw = function (t) { return t.replace(/&/g, '&amp;').replace(/"/g, '&quot;'); };
  var mark = function (t) { return esc(t).replace(/【(.+?)】/g, '<u>【$1】</u>'); };
  function pr(title, text, cls) { return '<div class="d-pr in ' + (cls || '') + '"><div class="d-prh"><span>' + title + '</span><button type="button" class="d-cp">复制</button></div><div class="d-prb" data-raw="' + raw(text) + '">' + mark(text) + '</div></div>'; }
  function bind(el) { qa('.d-cp', el).forEach(function (b) { b.addEventListener('click', function () { var h = b.closest('[data-raw]') || q('[data-raw]', b.closest('.d-pr')), t = h.getAttribute('data-raw'); try { navigator.clipboard.writeText(t); } catch (e) { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } b.textContent = '已复制'; setTimeout(function () { b.textContent = '复制'; }, 1400); }); }); }
  function st(list) { return '<ol class="d-st">' + list.map(function (s, i) { return '<li class="in' + (s[2] ? ' y' : '') + '" style="--i:' + i + '"><span class="d-n" style="grid-row:span 2">' + (i + 1) + '</span><h3>' + s[0] + '</h3>' + (s[1] ? '<p>' + s[1] + '</p>' : '') + '</li>'; }).join('') + '</ol>'; }
  function doc(html, s) { return '<div class="docv" style="--s:' + (s || 1) + '">' + html + '</div>'; }
  function cks(list) { return list.map(function (c) { return '<div class="d-ck"><i></i>' + c + '</div>'; }).join(''); }
  function bindCk(el) { qa('.d-ck,.d-cq-c', el).forEach(function (c) { c.addEventListener('click', function () { c.classList.toggle('on'); }); }); }
  /* 四种岗位的人物图标 */
  var HAIR = ['<path d="M36 47c0-16 10-27 25-27s24 9 24 25c-8-2-14-7-18-13-6 8-18 13-31 15z" fill="#111"/>', '<path d="M33 66V45c0-16 11-26 27-26s27 10 27 26v21h-9V47c-9-1-15-5-19-11-5 7-11 10-17 11v19z" fill="#111"/>', '<circle cx="60" cy="17" r="9" fill="#111"/><path d="M35 49c0-16 10-25 25-25s25 9 25 25c-6-7-14-11-25-11s-19 4-25 11z" fill="#111"/>', '<path d="M35 44c1-15 11-23 25-23s24 8 25 23z" fill="#111"/><path d="M33 43h46c6 0 11 2 13 6H33z" fill="#111"/>'];
  var PROP = ['<g transform="translate(64 90)"><rect x="7" y="-5" width="11" height="6" rx="2" fill="#FFC400"/><rect width="32" height="22" rx="5" fill="#FFC400"/><circle cx="16" cy="11" r="6.5" fill="#111"/><circle cx="16" cy="11" r="2.5" fill="#fff"/></g>', '<path d="M47 82l13 19 13-19" fill="none" stroke="#FFC400" stroke-width="3.2"/><rect x="51" y="98" width="18" height="22" rx="3" fill="#fff"/><rect x="55" y="103" width="10" height="3" rx="1.5" fill="#111"/>', '<g fill="none" stroke="#111" stroke-width="2.4"><circle cx="51" cy="50" r="7"/><circle cx="69" cy="50" r="7"/><path d="M58 50h4"/></g><g transform="translate(62 92)"><path d="M0 4c8-4 14-4 18 0v22c-4-4-10-4-18 0z" fill="#FFC400"/><path d="M18 4c4-4 10-4 18 0v22c-8-4-14-4-18 0z" fill="#fff"/></g>', '<path d="M41 85v35M79 85v35" stroke="#111" stroke-width="8"/>'];
  function av(k) { return '<span class="d-av"><svg viewBox="0 0 120 120"><path d="M16 122c0-27 19-41 44-41s44 14 44 41z" fill="' + (k === 3 ? '#FFC400' : '#111') + '"/>' + (k === 3 ? '' : '<path d="M50 81l10 12 10-12z" fill="#fff"/>') + '<rect x="52" y="64" width="16" height="20" rx="7" fill="#EBC3A0"/><circle cx="60" cy="48" r="24" fill="#F6D6B8"/>' + HAIR[k] + (k === 2 ? '' : '<circle cx="51" cy="50" r="2.4" fill="#111"/><circle cx="69" cy="50" r="2.4" fill="#111"/>') + '<path d="M54 59q6 5 12 0" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>' + PROP[k] + '</svg></span>'; }
  var RN = ['宣传部', '二级部门', '教学岗', '学生'], ROLE = [['讲话稿、活动通稿', '宣传和理论热点', '公众号年度运营汇报'], ['本单位的通知、总结', '本领域动态（学工、教务、科研）', '本单位账号数据、年度工作总结'], ['一节课的教案、一篇课文', '本学科的教研动态', '学期教学总结、成绩分析'], ['一篇论文、课程笔记', '教资、考研、招聘信息', '实习总结、社团述职']];
  var CASE = [['读', '一页简报'], ['找', '热点早报'], ['写', '汇报材料']];
  window.DK = { I: I, ic: ic, esc: esc, raw: raw, mark: mark, pr: pr, bind: bind, st: st, doc: doc, cks: cks, bindCk: bindCk, av: av, RN: RN };

  /* ================= 给 WorkBuddy 的提示词（实测后在这里改） ================= */
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

  /* ================= 八件成果 ================= */
  var bars = '<div class="bars">' + VK.MAVG.map(function (v, i) { return '<i class="' + (i === 8 ? 'hi' : '') + '" style="height:' + (v / 7211 * 100).toFixed(0) + '%;--i:' + i + '"></i>'; }).join('') + '</div>';
  var grid = '<div class="g">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(function (i) { return '<i class="' + (i < 4 ? 'h' : i === 9 ? 'y' : '') + '" style="--i:' + i + '"></i>'; }).join('') + '</div>';
  var WORKS = [
    { cls: 'c1', cover: '一页<br>简报', art: '<span class="n">1</span><i class="p p1"><i></i><i></i><i></i><i></i><i></i><i></i></i><i class="p p2"><i></i><i></i><i></i><i></i><i></i></i><i class="p p3"><i></i><i class="y"></i><i></i><i></i><i></i></i>', today: 1, name: '一页简报', from: '王书记在办学 120 周年大会上的讲话，2036 字', say: '将讲话稿整理为一页简报，引用原话须一字不差。', tags: ['读取文件', '提炼要点', '自查核对'] },
    { cls: 'c2', cover: '热点早报', art: '<i class="sun"></i><span class="t">07:30</span><i class="cd d1"></i><i class="cd d2"></i><i class="cd d3"></i>', today: 1, name: '热点早报', from: '宣传部日常关注的网站和公众号', say: '每个工作日 7:30，汇总 10 条宣传和理论热点。', tags: ['联网检索', '定时任务', '推送到手机'] },
    { cls: 'c3', cover: '年度运营<br>汇报', art: '<span class="nm3">137.6 万<small>307 篇 · 总阅读</small></span>' + bars, today: 1, name: '汇报材料', from: '公众号 307 篇推文的数据表', say: '先核算数据并交我确认，再撰写给校领导的汇报。', tags: ['读取表格', '数据核算', '撰写成稿'] },
    { cls: 'c4', cover: '会议纪要', art: '<i class="bb b1"></i><i class="bb r b2"></i><i class="bb b3"></i><span class="tdo">待办 3 项，已分到人</span>', name: '会议纪要', from: '会议录音的文字稿', say: '整理为会议纪要，待办事项按责任人列出。', tags: ['读取文件', '归纳整理'] },
    { cls: 'c5', cover: '通　知', art: '<i class="rl"></i><i class="ln l1"></i><i class="ln l2"></i><i class="ln l3"></i><span class="seal">章</span>', name: '通知与方案', from: '活动的时间、地点和要求', say: '按学校公文格式起草一份通知。', tags: ['公文格式', '套用模板'] },
    { cls: 'c6', cover: '表格<br>台账', art: grid, name: '表格与台账', from: '分散在多份文件中的名单和数字', say: '合并为一张表，标出不一致的地方。', tags: ['读取表格', '交叉核对'] },
    { cls: 'c7', cover: '宣讲提纲', art: '<div class="tr"><i style="--i:0"></i><i class="s" style="--i:1"></i><i class="s" style="--i:2"></i><i style="--i:3"></i><i class="s" style="--i:4"></i></div>', name: '宣讲提纲', from: '理论学习材料原文', say: '拟一份 15 分钟的宣讲提纲，引文标明出处。', tags: ['引用原文', '标注出处'] },
    { cls: 'c8', cover: '汇报 PPT', art: '<i class="sd s1"></i><i class="sd s2"></i><i class="sd s3"></i>', name: '汇报 PPT', from: '已完成的汇报材料', say: '按学校模板制作 8 页汇报 PPT。', tags: ['生成 PPT', '套用模板'] }];
  var TASKS = ['把讲话稿做成一页简报', '宣传和理论热点早报', '公众号 2026 年运营汇报'];
  function wbBrief(ns) { return VK.wb({ noside: ns, pw: ns ? 520 : 470, nav: '', tasks: TASKS, task: 0, title: '把讲话稿做成一页简报', ms: [{ u: PROMPT.c1.split('\n\n')[0] + '\n读者：学院的老师，每人只有两分钟。……', files: ['王书记…讲话.docx'] }, { steps: [[1, '读取 <code>王书记…讲话.docx</code>　19 段，2036 字'], [1, '列要点：四点希望、4 组数字、1 段原话'], [1, '写入 <code>一页简报.docx</code>'], [1, '对照原文核对：职务、日期、数字、原话']], a: '做好了。核对了 4 项，有 1 处已按原文修正：“25 万”原文是“超过25万名”。', file: ['W', '一页简报.docx'] }], panel: VK.BRIEF, pname: '一页简报.docx', ps: ns ? .56 : .5 }); }
  function wbReport() { return VK.wb({ nav: '', tasks: TASKS, task: 2, title: '公众号 2026 年运营汇报', ms: [{ u: '数据我核对过了。现在根据《数据核对表.xlsx》写一份给校领导看的《公众号 2026 年运营汇报》。……' }, { steps: [[1, '读取 <code>数据核对表.xlsx</code>'], [1, '三个发现，每个都对上了表里的数字'], [1, '写入 <code>公众号运营汇报.docx</code>']], a: '写好了。两条建议标了“建议”，等你来改。', file: ['W', '公众号运营汇报.docx'] }], panel: VK.REPORT, pname: '公众号运营汇报.docx', ps: .5 }); }
  function wxNews() { return '<div class="wx"><div class="wx-h">WorkBuddy 助理</div><div class="wx-b"><div class="wx-tm">周一 07:30</div><div class="wx-m"><img src="img/tool/wb.svg" alt=""><div><h6>宣传和理论热点早报</h6><div class="sec">学校相关</div><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a><div class="sec">高教动态</div><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a><div class="sec">理论热点</div><div class="ln"></div><div class="ln s"></div><a>原文链接 ›</a></div></div><div class="wx-m me"><i style="background:#d9d9d9"></i><div>第 3 条展开讲讲</div></div></div><div class="wx-f"></div></div>'; }
  function phone(w) { return VK.pho(VK.slot('zaobao-phone', '手机上收到早报的截图', wxNews()), w); }
  function openWork(el, i) {
    if (i === 0) return VK.modal(el, VK.lap(VK.slot('work-1', '', wbBrief(), 1), 1180));
    if (i === 2) return VK.modal(el, VK.lap(VK.slot('work-3', '', wbReport(), 1), 1180));
    if (i === 1) return VK.modal(el, phone(330));
    var w = WORKS[i]; return VK.modal(el, VK.lap(VK.slot('work-' + (i + 1), w.name + '的成品截图（WorkBuddy 窗口，右边打开产物）', VK.wb({ tasks: [w.name], task: 0, title: w.name, ms: [{ u: w.say }, { steps: [[1, '读取材料'], [1, '生成文件']], a: '已完成。', file: ['W', w.name + '.docx'] }] })), 1180));
  }

  /* ================= 篇一 成果展示 ================= */
  VIZ['今日安排'] = function (el) {
    var A = [['上午', [['10:00', '成果展示', '办公场景成果一览'], ['10:20', '用好 AI 的关键', '六个要素与工作原理'], ['11:10', '认识 WorkBuddy', '安装、配置与基本使用']]], ['下午', [['14:00', '案例一', '一页简报'], ['14:50', '案例二', '热点早报'], ['15:50', '案例三', '汇报材料'], ['16:30', '总结与作业', '成果展示、课后任务']]]];
    el.innerHTML = '<div class="d-ag">' + A.map(function (r, k) { return '<div class="d-ag-r in" style="--i:' + k * 2 + '"><span class="d-ag-k">' + r[0] + '</span><div class="d-ag-l">' + r[1].map(function (t) { return '<div class="d-ag-i"><b>' + t[0] + '</b><h3>' + t[1] + '</h3><p>' + t[2] + '</p></div>'; }).join('') + '</div></div>'; }).join('') +
      '<div class="d-ag-o in" style="--i:5"><span class="d-k">今日成果</span><span class="d-pill y">一页简报</span><span class="d-pill y">热点早报</span><span class="d-pill y">汇报材料</span><span class="d-pill k">个人技能</span></div></div>';
  };
  VIZ['办公场景成果展示'] = function (el) { VK.wall(el, WORKS, ['成果展示', '办公场景成果展示', ''], function (i) { openWork(el, i); }); };
  VIZ['今日实操案例'] = function (el) {
    var L = [VK.lap(doc(VK.BRIEF), 440, 900), phone(158), VK.lap(doc(VK.REPORT), 440, 900)], T = ['长材料提炼为一页要点', '定时检索，推送到手机', '由数据得出结论并成稿'];
    el.innerHTML = '<div class="d-tri nozoom">' + L.map(function (d, i) { return '<div class="d-tri-c in" style="--i:' + i + '" data-i="' + i + '"><div class="d-stage" style="--b:' + (i === 1 ? 300 : 330) + 'px">' + d + '</div><div class="d-tri-t"><i>' + CASE[i][0] + '</i><div><h3>' + CASE[i][1] + '</h3><p>' + T[i] + '</p></div></div></div>'; }).join('') + '</div>';
    VK.fill(el); qa('.d-tri-c', el).forEach(function (c) { c.addEventListener('click', function () { openWork(el, +c.getAttribute('data-i')); }); });
  };
  VIZ['岗位适配'] = function (el) {
    el.innerHTML = '<div class="d-rl"><div class="d-rl-a">' + RN.map(function (r, i) { return '<button class="d-rl-b in" style="--i:' + i + '" data-i="' + i + '">' + av(i) + r + '</button>'; }).join('') + '</div><div class="d-rl-c">' + CASE.map(function (c, k) { return '<div class="d-rl-i in" style="--i:' + (k + 4) + '"><div class="d-k"><b>' + c[0] + '</b>案例' + '一二三'[k] + ' · ' + c[1] + '</div><h3></h3></div>'; }).join('') + '</div></div>';
    function set(i) { qa('.d-rl-b', el).forEach(function (b, k) { b.classList.toggle('on', k === i); }); qa('.d-rl-i h3', el).forEach(function (h, k) { h.style.opacity = 0; VK.later(function () { h.textContent = ROLE[i][k]; h.style.opacity = 1; }, 220); }); }
    var s = VK.steps(el, 4, set); qa('.d-rl-b', el).forEach(function (b, i) { b.addEventListener('click', function () { s.go(i); }); });
  };

  /* ================= 篇二 用好 AI 的关键 ================= */
  VIZ['同一任务的两种产出'] = function (el) {
    var bad = VK.wb({ noside: 1, tasks: ['做个简报'], task: 0, title: '做个简报', ms: [{ u: '帮我把王书记的讲话做个简报' }, { st: '已完成 ›', a: '<p>好的！以下是为您整理的简报：</p><p><b>一、会议概况</b><br>大会在热烈的氛围中隆重召开，全面回顾了学院的光辉历程……</p><p><b>二、主要内容</b><br>讲话强调要加强学科建设、提升科研水平、推进国际交流，累计培养教师约 <mark>20 万名</mark>……</p><p><b>三、重要意义</b><br>本次讲话高屋建瓴、内涵丰富，为今后发展指明了方向……</p><p style="color:#999">（共 3 页，未生成文件）</p>' }] });
    var T = [['未读取原文', '数字无出处', '篇幅过长', '未生成文件'], ['依据原文', '数字可核对', '一页篇幅', '直接生成 Word']];
    el.innerHTML = '<div class="d-cmp" data-s="0"><div class="d-cmp-c a"><span class="d-pill t">一句话指令</span>' + VK.lap(bad, 610, 760) + '<div class="d-cmp-t">' + T[0].map(function (t, i) { return '<span class="d-pill r" style="--i:' + i + '">' + t + '</span>'; }).join('') + '</div></div><div class="d-cmp-c b"><span class="d-pill y">完整指令</span>' + VK.lap(wbBrief(1), 610, 1000) + '<div class="d-cmp-t">' + T[1].map(function (t, i) { return '<span class="d-pill g" style="--i:' + i + '">' + t + '</span>'; }).join('') + '</div></div></div>';
    VK.steps(el, 3, function (i) { q('.d-cmp', el).setAttribute('data-s', i); });
  };
  VIZ['三类常见问题'] = function (el) {
    var P = [['bolt', '工具与业务衔接不上', '已安装工具，但不清楚能用在哪些工作上', 'AI 接触不到业务文件，也缺少可调用的工具'], ['say', '需求表达不到位', '给出一句指令，得到的内容与预期相差较大', '面向谁、需要什么、以什么形式交付，没有交代清楚'], ['star', '产出质量不稳定', '参考案例效果很好，自己操作却达不到', '缺少材料依据、核对环节和可复用的规则']];
    el.innerHTML = '<div class="d-pn">' + P.map(function (p, i) { return '<div class="d-pn-c in" style="--i:' + i + '">' + ic(p[0]) + '<h3>' + p[1] + '</h3><p>' + p[2] + '</p><div class="d-pn-w"><div class="d-k">原因</div><p>' + p[3] + '</p></div></div>'; }).join('') + '</div>';
    var s = VK.steps(el, 4, function (i) { qa('.d-pn-c', el).forEach(function (c, k) { c.classList.toggle('on', k < i); }); });
    qa('.d-pn-c', el).forEach(function (c, k) { c.style.cursor = 'pointer'; c.addEventListener('click', function () { s.go(c.classList.contains('on') ? k : k + 1); }); });
  };
  /* 六个要素：每打开一个，右边的结果好一截；↓ 打开下一个，↑ 关掉最后一个，也可以直接点 */
  var SW = [['say', '明确要求', '对象、内容、格式', '篇幅过长', '篇幅过长，共 3 页', '篇幅一页，四部分内容'], ['doc', '提供材料', '以原文为依据', '数字无出处', '数字无出处：约 20 万', '数字出自原文：超过 25 万'], ['hand', '配置工具', '可读取、写入文件', '未生成文件', '只有对话文字，需自行排版', '直接生成 Word 文档'], ['plan', '先定方案', '复杂任务先确认思路', '文体不符', '文体不符：写成了新闻稿', '按确认的方案生成简报'], ['loop', '结果自查', '对照原文逐项核对', '引文有出入', '引用的原话与原稿有出入', '引用的原话逐字核对一致'], ['save', '固化规则', '沉淀为可复用的技能', '下次需重新说明', '下次需要重新说明', '保存为技能，一句话调用']];
  VIZ['影响产出质量的六个要素'] = function (el) {
    var on = [0, 0, 0, 0, 0, 0], dots = VK.dots(el, 7);
    el.innerHTML = '<div class="d-cs x"><div class="d-sw">' + SW.map(function (s, i) { return '<div class="d-sx"><button class="d-sw-i" data-i="' + i + '">' + ic(s[0]) + '<div><h3>' + s[1] + '</h3><p>' + s[2] + '</p></div><i></i></button><span class="d-cn"></span><span class="d-rs" data-i="' + i + '"></span></div>'; }).join('') + '</div><div class="d-cs-r">' + VK.lap('', 590, 1000) + '<div class="d-mt"></div></div></div>';
    function brief() { var long = !on[0], fake = !on[1], news = !on[3], alt = !on[4];
      return '<div class="pap"><div class="tt">' + (news ? '<mark class="bd">【新闻稿】</mark>我校初等教育学院隆重举行办学 120 周年大会' : '王国胤书记在初等教育学院办学 120 周年高质量发展大会上的讲话') + '</div><div class="mt">' + (long ? '<mark class="bd">第 1 页 / 共 3 页</mark>' : '一页简报') + ' · 2026 年 10 月 24 日</div>' +
        '<div class="lead">120 年不是终点，是新起点：对学院未来发展提四点希望。</div><h5>四点希望</h5><div class="four"><div>一、坚持立德树人，擦亮百年师范底色</div><div>二、坚持守正创新，持续深化内涵建设</div><div>三、深化校地协同，拓展服务地方效能</div><div>四、凝聚校友力量，共筑发展共同体</div></div>' +
        '<h5>关键数字</h5><div class="nums">' + (fake ? '<div><b><mark class="bd">1905</mark></b><span>学堂创办</span></div><div><b><mark class="bd">约 20 万</mark></b><span>累计培养教师</span></div><div><b><mark class="bd">3 万</mark></b><span>学院学子</span></div><div><b><mark class="bd">首批</mark></b><span>试点院校</span></div>' : '<div><b>1906</b><span>官立川东师范学堂创办</span></div><div><b>25 万+</b><span>建校以来累计培养教师</span></div><div><b>5 万余</b><span>学院学子扎根讲台</span></div><div><b>20 所</b><span>全国首批试点院校之一</span></div>') + '</div>' +
        '<h5>可以直接引用的原话</h5><blockquote>' + (alt ? '“<mark class="bd">要大力推进人工智能与教育的全面融合</mark>。”<cite>原稿中没有这句话</cite>' : '“深入推进数智化教育改革，推动人工智能等数字技术与教育教学深度融合。”<cite>原文第 14 段 · 逐字核对一致</cite>') + '</blockquote>' + (long ? '<h5>三、重要意义</h5><p style="font:400 17px/1.8 sans-serif;color:#555">本次讲话高屋建瓴、内涵丰富，为今后发展指明了方向……（后面还有两页）</p>' : '') + '</div>'; }
    function draw() {
      var n = on.filter(Boolean).length, u = on[0] ? '读者：学院的老师，每人两分钟。把讲话稿做成一页简报：一句话主旨、四点希望、关键数字、一段原话。' : '帮我把王书记的讲话做个简报', s2 = [];
      if (on[3]) s2.push([1, '方案：① 读原文 ② 列要点 ③ 成稿 ④ 核对　已确认']); if (on[1]) s2.push([1, '读取 <code>讲话稿.docx</code>　19 段，2036 字']); if (on[2]) s2.push([1, '写入 <code>一页简报.docx</code>']); if (on[4]) s2.push([1, '对照原文核对：1 处数字已按原文修正']); if (on[5]) s2.push([1, '已保存为技能“一页简报”']);
      q('.vp', el).innerHTML = VK.wb({ noside: 1, pw: 520, tasks: ['做个简报'], task: 0, title: '做个简报', ms: [{ u: u, files: on[1] ? ['讲话稿.docx'] : null }, { st: '已完成 ›', steps: s2, a: on[2] ? '已完成。' : '<p>好的，以下是简报内容：（一段文字，需自行复制到 Word 中排版）</p>', file: on[2] ? ['W', '一页简报.docx'] : null }], panel: brief(), pname: on[2] ? '一页简报.docx' : '对话中的文字', ps: .56 });
      qa('.d-sw-i', el).forEach(function (s, i) { s.classList.toggle('on', !!on[i]); });
      var chg = false; qa('.d-rs', el).forEach(function (r, i) { var v = on[i] ? '1' : '0'; if (r.getAttribute('data-v') === v) return; var first = r.getAttribute('data-v') == null; r.setAttribute('data-v', v); r.className = 'd-rs' + (on[i] ? ' on' : ''); r.innerHTML = '<i>' + (on[i] ? '✓' : '✕') + '</i>' + SW[i][on[i] ? 5 : 4]; if (!first) { void r.offsetWidth; r.classList.add('pop'); chg = true; } });      // 右边这一条跟着变：关 = 问题，开 = 改善
      qa('.d-sx', el).forEach(function (x, i) { x.classList.toggle('on', !!on[i]); });
      if (chg) { var lp = q('.lap', el); lp.classList.remove('d-glow'); void lp.offsetWidth; lp.classList.add('d-glow'); }
      q('.d-mt', el).innerHTML = '<div><b>产出质量</b><i>' + on.map(function (_, k) { return '<u class="' + (k < n ? 'on' : '') + '"></u>'; }).join('') + '</i>' + (n === 6 ? '<span class="d-pill g" style="margin-left:8px">达到交付标准</span>' : '') + '</div>';
      dots(n);
    }
    qa('.d-sw-i', el).forEach(function (s, i) { s.addEventListener('click', function () { on[i] = on[i] ? 0 : 1; draw(); }); });
    window.VIZ_STEP = function (d) { var k = d > 0 ? on.indexOf(0) : on.lastIndexOf(1); if (k < 0) return false; on[k] = d > 0 ? 1 : 0; draw(); return true; };
    draw();
  };
  /* 智能体的工作流程：左边是“思考—行动—检查”的循环，右边是 WorkBuddy 里同一步的样子 */
  VIZ['智能体的工作流程'] = function (el) {
    var PH = { t: ['接收任务', '用户用自然语言提出任务，并提供材料'], th: ['思考', '大模型分析任务，决定下一步做什么'], ac: ['行动', '调用工具：读取文件、写入文件、联网检索'], ck: ['检查', '读取执行结果，对照要求逐项核对'], o: ['交付成果', '生成文件，并说明核对情况'] };
    var S = [['t', ''], ['th', '方案：① 读取原文 ② 提炼要点 ③ 生成简报 ④ 对照核对'], ['ac', '读取 <code>讲话稿.docx</code>　19 段，2036 字'], ['th', '提炼要点：四点希望、4 组数字、1 段原话'], ['ac', '写入 <code>一页简报.docx</code>（已获授权）'], ['ck', '对照原文核对：1 处数字已按原文修正'], ['o', '']];
    var A = [[-30, 60], [90, 180], [210, 300]].map(function (a) { var t = a[0] * Math.PI / 180; return '<path d="M-9 -8L9 0L-9 8z" fill="#111" transform="translate(' + (235 + 135 * Math.cos(t)).toFixed(1) + ' ' + (228 + 135 * Math.sin(t)).toFixed(1) + ') rotate(' + a[1] + ')"/>'; }).join('');
    el.innerHTML = '<div class="d-fw"><div class="d-fw-l"><div class="d-fw-d"><svg viewBox="0 0 470 420"><circle cx="235" cy="228" r="135" fill="none" stroke="#CFCBBF" stroke-width="3.5" stroke-dasharray="1 11" stroke-linecap="round"/>' + A + '<g fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"><path d="M128 42Q168 44 190 66"/><path d="M280 66Q302 44 342 42"/></g><path d="M183 57l9 11-14-1z M335 35l10 7-10 7z" fill="#111"/></svg>' +
      '<button class="d-fw-n e" data-k="t" style="left:78px;top:40px">任务</button><button class="d-fw-n e" data-k="o" style="left:392px;top:40px">成果</button><button class="d-fw-n" data-k="th" style="left:235px;top:104px">思考<small>大模型</small></button><button class="d-fw-n" data-k="ac" style="left:352px;top:296px">行动<small>调用工具</small></button><button class="d-fw-n" data-k="ck" style="left:118px;top:296px">检查<small>核对结果</small></button><div class="d-fw-c">循环执行<br>直至完成</div></div><div class="d-fw-t"><h3></h3><p></p></div></div><div>' + VK.lap('', 850, 1000) + '</div></div>';
    var s = VK.steps(el, S.length, function (i) {
      var k = S[i][0]; qa('.d-fw-n', el).forEach(function (n) { n.classList.toggle('on', n.getAttribute('data-k') === k); });
      q('.d-fw-t h3', el).textContent = PH[k][0]; q('.d-fw-t p', el).textContent = PH[k][1];
      var done = i === S.length - 1, sp = S.slice(1, i + 1).filter(function (x) { return x[1]; }).map(function (x) { return [1, x[1]]; });
      q('.vp', el).innerHTML = VK.wb({ noside: 1, pw: 500, tasks: TASKS, task: 0, title: '把讲话稿做成一页简报', ms: [{ u: '请把工作空间里的讲话稿做成一页简报。读者：学院的老师，每人只有两分钟。……', files: ['讲话稿.docx'] }].concat(i ? [{ st: done ? '已完成 ›' : '执行中…', steps: sp, a: done ? '已完成。核对 4 项，1 处已按原文修正。' : '', file: done ? ['W', '一页简报.docx'] : null }] : []), panel: i >= 4 ? VK.BRIEF : null, pname: '一页简报.docx', ps: .54 });
    });
    qa('.d-fw-n', el).forEach(function (n) { n.addEventListener('click', function () { var k = n.getAttribute('data-k'), cur = s.at(), j = -1; for (var x = 1; x <= S.length; x++) { var y = (cur + x) % S.length; if (S[y][0] === k) { j = y; break; } } if (j >= 0) s.go(j); }); });
  };
  /* 大模型的生成原理：一句话在模型里走一趟。关联强弱和概率是示意；正确答案出自讲话稿 */
  var TK = ['重庆', '师范', '大学', '的', '办学', '历史', '可', '追溯', '至'], ATT = [.09, .07, .05, .01, .2, .26, .02, .3];
  var CH = [{ c: [['1906', .58], ['1954', .24], ['1902', .08], ['1936', .06], ['1898', .04]], aft: ['年', '创办', '的'] }, { c: [['官立川东师范学堂', .52], ['重庆师范学堂', .22], ['四川省立师范学校', .14], ['川东道立师范', .12]], aft: ['，', '学校', '于'] }, { c: [['1954', .61], ['1906', .2], ['1950', .11], ['1960', .08]], aft: ['年', '建校', '。'] }];
  VIZ['大模型的生成原理'] = function (el) {
    var ST = ['切分', '关联上文', '计算概率', '选取并接上'], CAP = ['输入的文字先被切分为<b>词元</b>，每个词元对应一个编号。', '生成下一个词之前，模型会<b>关联上文</b>的每一个词；线越粗，关联越强。', '模型为词表中的每个词计算<b>出现概率</b>，并不判断内容是否属实。', '按概率<b>选取一个词</b>接在句末；每接上一个词，都重新计算一次概率，逐词生成全文。'];
    var N = 6, picks = [], busy = false, tail = 3, s;          // tail：最后一轮选完后，后面的词已逐个生成了几个
    var ALT = { '年': '月', '创办': '成立', '的': '了', '，': '。', '学校': '后来', '于': '在', '建校': '更名', '。': '，' };                    // 第 0–3 步是四个环节，第 3、4、5 步各选取一次
    el.innerHTML = '<div class="d-md"><div class="d-md-t">' + ST.map(function (t, i) { return '<button data-i="' + i + '"><b>' + (i + 1) + '</b>' + t + '</button>'; }).join('') + '</div><div class="d-md-m"><div class="d-md-s"><svg></svg><div class="d-tk"></div><div class="d-md-c"></div></div><div class="d-md-r"><div class="d-k"><span>下一个词的候选</span><em>概率为示意</em></div><div class="d-cds"></div><div class="d-tp"><span>随机性 低</span><input type="range" min="0.3" max="2" step="0.05" value="1"><span>高</span></div></div></div></div>';
    var toks = q('.d-tk', el), svg = q('svg', el), tmp = q('input', el), cds = q('.d-cds', el), cap = q('.d-md-c', el);
    function probs(r) { var c = CH[r].c, T = +tmp.value, p = c.map(function (x) { return Math.pow(x[1], 1 / T); }), z = p.reduce(function (a, b) { return a + b; }, 0); return p.map(function (x) { return x / z; }); }
    function sample(r) { var p = probs(r), x = Math.random(), a = 0; for (var i = 0; i < p.length; i++) { a += p[i]; if (x < a) return i; } return 0; }
    function seq(r) { var a = TK.map(function (t) { return { t: t }; }); for (var k = 0; k < r; k++) { a.push({ t: CH[k].c[picks[k]][0], n: 1, bad: picks[k] !== 0 }); CH[k].aft.slice(0, k === r - 1 ? tail : 3).forEach(function (t) { a.push({ t: t, n: 1 }); }); } return a; }
    function draw(i, hi) {
      var stg = Math.min(i, 3), r = i < 3 ? 0 : i - 3, shown = i < 3 ? 0 : (busy ? r : r + 1), a = seq(shown), small = a.length > 11, done = i === N - 1 && !busy;
      qa('.d-md-t button', el).forEach(function (b, k) { b.className = k === stg ? 'on' : k < stg ? 'done' : ''; });
      toks.style.flexWrap = small ? 'wrap' : ''; toks.style.top = small ? '56px' : '170px';
      toks.innerHTML = a.map(function (x, k) { return '<span class="' + (x.bad ? 'bad' : x.n ? 'new' : '') + (stg === 1 && k === a.length - 1 ? ' sel' : '') + '" style="animation-delay:' + (stg === 0 ? k * 70 : 0) + 'ms' + (small ? ';font-size:24px;padding:10px 11px' : '') + '">' + (stg === 0 ? '<small>#' + (1000 + (x.t.charCodeAt(0) * 7 + k * 131) % 8999) + '</small>' : '') + x.t + '</span>'; }).join('');
      svg.innerHTML = '';
      if (stg === 1) { var box = q('.d-md-s', el), R = box.getBoundingClientRect(), kk = R.width / box.offsetWidth, els = qa('span', toks), c = function (e) { var b = e.getBoundingClientRect(); return [(b.left + b.width / 2 - R.left) / kk, (b.top - R.top) / kk]; }, to = c(els[els.length - 1]), h = '';
        els.forEach(function (e, k) { if (k >= els.length - 1) return; var w = ATT[k], f = c(e), my = to[1] - 40 - (to[0] - f[0]) * .2; h += '<path style="animation-delay:' + (k * 120) + 'ms" d="M' + f[0] + ' ' + f[1] + ' Q' + (f[0] + to[0]) / 2 + ' ' + my + ' ' + to[0] + ' ' + to[1] + '" fill="none" stroke="' + (w > .15 ? '#111' : '#b5b2a8') + '" stroke-width="' + (1.5 + w * 24).toFixed(1) + '" opacity="' + (.4 + w * 2).toFixed(2) + '"/>'; }); svg.innerHTML = h; }
      var bad = picks.slice(0, shown).filter(function (x) { return x !== 0; }).length;
      cap.className = 'd-md-c' + (done && bad ? ' bad' : ''); cap.innerHTML = done ? (bad ? '生成结果有 <b>' + bad + ' 处与事实不符</b>，语句却依然通顺——这就是“幻觉”。' : '本次生成结果与事实一致。<b>调高随机性</b>后重新生成，结果可能不同。') : CAP[stg];
      if (i >= 3 && !busy && tail < 3) { var at = CH[r].aft[tail]; cds.innerHTML = [[at, .96], [ALT[at] || '…', .04]].map(function (x, k) { return '<div class="d-cd' + (k ? '' : ' pk') + '"><span>' + x[0] + '</span><i><u style="width:' + x[1] * 100 + '%"></u></i><em>' + x[1] * 100 + '%</em></div>'; }).join(''); return; }
      var p = probs(r); cds.innerHTML = CH[r].c.map(function (x, k) { var pk = i >= 3 && !busy && picks[r] === k; return '<div class="d-cd' + (hi === k ? ' hi' : '') + (pk ? ' pk' + (k ? ' bad' : '') : '') + '" style="opacity:' + (stg >= 2 ? 1 : .35) + '"><span>' + x[0] + '</span><i><u style="width:' + (p[k] * 100).toFixed(1) + '%"></u></i><em>' + (p[k] * 100).toFixed(0) + '%</em></div>'; }).join('');
    }
    s = VK.steps(el, N, function (i, d) {
      for (var k = 0; k <= i - 3; k++) if (picks[k] == null) picks[k] = sample(k);
      if (i >= 3 && d > 0) { var r = i - 3, pk = picks[r] = sample(r), n = CH[r].c.length, c = 0, total = n * 2 + pk; picks.length = r + 1; busy = true; draw(i, 0);      // 候选上的高亮一格一格慢下来，停在选中的那个
        tail = 0; (function hop() { if (c >= total) { busy = false; VK.later(function () { draw(i); (function nx() { if (tail >= 3) { draw(i); return; } VK.later(function () { draw(i); tail++; VK.later(function () { draw(i); nx(); }, 380); }, 520); })(); }, 450); return; } draw(i, c % n); c++; VK.later(hop, 120 + c * c * 2.2); })(); return; }
      busy = false; tail = 3; draw(i);
    });
    var step = window.VIZ_STEP; window.VIZ_STEP = function (d) { if (busy || tail < 3) return true; return step(d); };
    qa('.d-md-t button', el).forEach(function (b, k) { b.addEventListener('click', function () { if (!busy) { picks = []; s.go(k); } }); });
    tmp.addEventListener('input', function () { if (!busy) draw(s.at()); }); tmp.addEventListener('change', function () { tmp.blur(); });
  };
  VIZ['“幻觉”的成因与对策'] = function (el) {
    var B = [[['加强学科建设', 23], ['深化校地协同', 21], ['提升科研水平', 20], ['推进国际交流', 19], ['强化师资队伍', 17]], [['加强学科建设', 3], ['深化校地协同', 90], ['提升科研水平', 3], ['推进国际交流', 2], ['强化师资队伍', 2]]];
    el.innerHTML = '<div><div class="d-hl-s"><button data-i="0">未提供材料</button><button data-i="1">提供讲话稿原文</button></div><div class="d-hl"><div class="d-hl-q"><div class="d-bub"><span class="f">📄 王书记…讲话.docx</span><div>王书记在讲话中对学院提出的第三点希望是什么？</div></div><div class="d-ans"><img src="img/tool/wb.svg" alt=""><div></div></div></div><div><div class="d-k" style="margin:0 0 12px 22px">模型内部：各候选答案的概率（示意）</div><div class="d-hl-b"></div></div></div></div>';
    var s = VK.steps(el, 2, function (i) {
      q('.d-hl', el).classList.toggle('on', !!i); qa('.d-hl-s button', el).forEach(function (b, k) { b.classList.toggle('on', k === i); });
      q('.d-hl-b', el).innerHTML = B[i].map(function (x, k) { return '<div class="d-cd' + (k === 1 && i ? ' ok' : '') + (i === 0 && k === 0 ? ' pk bad' : i === 1 && k === 1 ? ' pk' : '') + '"><span>' + x[0] + '</span><i><u style="width:' + B[1 - i][k][1] + '%"></u></i><em>' + x[1] + '%</em></div>'; }).join('');
      VK.later(function () { qa('.d-hl-b u', el).forEach(function (u, k) { u.style.width = B[i][k][1] + '%'; }); }, 60);
      q('.d-ans div', el).innerHTML = i ? '深化校地协同，拓展服务地方效能<small>✓ 与原文一致 · 正确答案的概率由 21% 升至 90%</small>' : '加强学科建设<small>✕ 与原文不符 · 各候选概率接近，模型仍会给出一个答案</small>';
    });
    qa('.d-hl-s button', el).forEach(function (b, k) { b.addEventListener('click', function () { s.go(k); }); });
  };
  VIZ['课堂互动：缺了哪一项'] = function (el) {
    var R = [['帮我把王书记的讲话做个简报。', '写了三页，不知道写给谁看', 0, [0, 2, 5]], ['帮我把王书记的讲话做成一页简报，读者是学院的老师。', '出现“约 20 万名”，原文中没有这个数字', 1, [3, 1, 4]], ['请依据工作空间中的讲话稿原文，做成一页简报，读者是学院的老师。', '结果只在对话里，还要自己复制到 Word 排版', 2, [2, 5, 0]], ['请依据讲话稿原文，做成一页简报，直接生成 Word 文档。', '交出去才发现，引用的原话与原稿有出入', 4, [1, 4, 3]]];
    el.innerHTML = '<div class="d-qz"><div class="d-qz-l"><div class="d-qz-n"></div><div class="d-qz-q"><span class="d-k">指令</span><p></p></div><div class="d-qz-r"><span class="d-k">结果</span><p></p></div></div><div class="d-qz-o"><div class="d-k">缺了哪一项？</div><div class="d-qz-b"></div><button class="d-btn w" data-g="wheel:num" data-gt="抽取一位老师回答">抽取</button></div></div>';
    VK.steps(el, R.length * 2, function (k) { var r = R[k >> 1], show = k & 1;
      q('.d-qz-n', el).innerHTML = R.map(function (_, j) { return '<i class="' + (j === k >> 1 ? 'on' : j < k >> 1 ? 'ok' : '') + '">' + (j + 1) + '</i>'; }).join('');
      q('.d-qz-q p', el).textContent = r[0]; q('.d-qz-r p', el).textContent = r[1];
      q('.d-qz-b', el).innerHTML = r[3].map(function (o, j) { return '<div class="d-qz-c' + (show ? (o === r[2] ? ' ok' : ' no') : '') + '"><b>' + 'ABC'[j] + '</b>' + ic(SW[o][0]) + '<div><h3>' + SW[o][1] + '</h3><p>' + SW[o][2] + '</p></div></div>'; }).join(''); });
  };

  /* ================= 篇三 认识 WorkBuddy（画面为官方文档截图，可用同名文件替换 img/wb/ 里的图） ================= */
  function lst(L) { return '<ol class="d-ls">' + L.map(function (p, i) { return '<li data-i="' + i + '"><span class="d-n">' + (i + 1) + '</span><div><h3>' + p[0] + '</h3><p>' + p[1] + '</p></div></li>'; }).join('') + '</ol>'; }
  VIZ['界面总览'] = function (el) {
    var P = [[16, 25, '导航与任务列表', '新建任务、定时任务、技能的入口；历史任务按时间排列。'], [59, 51, '对话输入区', '用自然语言描述任务；输入 @ 可引用文件。'], [41, 61.5, '工作空间与权限', '指定 AI 工作的文件夹，以及允许的操作范围。'], [76, 56, '模型选择', '一般使用默认模型；复杂任务可切换更强的模型。'], [8.8, 93, '账号', '套餐、积分余额和设置。']], w = 840, W = w - 26;
    el.innerHTML = '<div class="d-pp"><div class="d-pp-d">' + VK.lap(VK.shot('img/wb/home.jpg', 1), w) + P.map(function (p, i) { return '<button class="d-pin" data-i="' + i + '" style="left:' + (13 + W * p[0] / 100).toFixed(0) + 'px;top:' + (13 + W * .625 * p[1] / 100).toFixed(0) + 'px">' + (i + 1) + '</button>'; }).join('') + '</div>' + lst(P.map(function (p) { return [p[2], p[3]]; })) + '</div>';
    var s = VK.steps(el, P.length, function (i) { qa('.d-pin', el).forEach(function (p, k) { p.classList.toggle('on', k === i); }); qa('.d-ls li', el).forEach(function (l, k) { l.classList.toggle('on', k === i); }); });
    qa('.d-pin,.d-ls li', el).forEach(function (p) { p.addEventListener('click', function (e) { e.stopPropagation(); s.go(+p.getAttribute('data-i')); }); });
  };
  VIZ['下载、安装与登录'] = function (el) {
    var S = [['访问 workbuddy.cn，点击“立即下载”', '选择 Windows x64 版本', 'img/wb/download.jpg'], ['运行安装包，按提示完成安装', '建议勾选“创建桌面快捷方式”', 'img/wb/login.jpg'], ['点击“登录”，使用微信扫码', '在浏览器中完成扫码后返回软件', 'img/wb/home.jpg']];
    el.innerHTML = '<div class="d-pp"><div class="d-pp-d">' + VK.lap('<div class="d-sw3">' + S.map(function (x) { return '<img src="' + x[2] + '" alt="">'; }).join('') + '</div>', 800) + '</div><div>' + lst(S) + '<div class="d-faq"><p><b>无法安装</b>需 Windows 10 及以上 64 位系统；被安全软件拦截时请暂时退出。</p><p><b>登录无响应</b>复制登录链接，粘贴到浏览器中打开。</p></div></div></div>';
    var s = VK.steps(el, 3, function (i) { qa('.d-sw3 img', el).forEach(function (m, k) { m.classList.toggle('on', k === i); }); qa('.d-ls li', el).forEach(function (l, k) { l.classList.toggle('on', k === i); }); });
    qa('.d-ls li', el).forEach(function (p) { p.addEventListener('click', function () { s.go(+p.getAttribute('data-i')); }); });
  };
  VIZ['版本与费用'] = function (el) {
    var T = [['体验版', '免费', '', '', '500', '3 个', '系统自动选择', '课堂使用', 'y'], ['标准版', '99', '元 / 月', '连续包月 70 元 / 月', '4,000<small>基础 2,000 + 赠送 2,000</small>', '15 个', '全部可选', '五天实训推荐', 'k'], ['高级版', '199', '元 / 月', '连续包月 140 元 / 月', '9,000<small>基础 4,000 + 赠送 5,000</small>', '30 个', '全部可选', '', ''], ['旗舰版', '999', '元 / 月', '连续包月 700 元 / 月', '50,000<small>基础 20,000 + 赠送 30,000</small>', '99 个', '全部可选', '', '']];
    el.innerHTML = '<div class="d-pl">' + T.map(function (t, i) { return '<div class="d-pl-c in ' + t[8] + '" style="--i:' + i + '">' + (t[7] ? '<span class="tg">' + t[7] + '</span>' : '') + '<h3>' + t[0] + '</h3><div class="pp">' + t[1] + '<small>' + t[2] + '</small></div><div class="ps">' + t[3] + '</div><dl><dt>每月积分</dt><dd><b>' + t[4] + '</b></dd><dt>定时任务</dt><dd>' + t[5] + '</dd><dt>模型</dt><dd>' + t[6] + '</dd></dl></div>'; }).join('') + '</div><div class="d-line in" style="--i:5;margin-top:30px">课堂使用体验版即可；需完成五天全部案例的，建议开通一个月标准版。<b>积分按月发放、当月有效；经邀请链接注册可额外获得积分。</b></div>';
  };
  var FD = '<svg viewBox="0 0 24 24"><path d="M2 6a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/></svg>';
  VIZ['工作空间'] = function (el) {
    el.innerHTML = '<div class="d-ws"><div>' + VK.lap('<img class="vshot" src="img/wb/home-win.jpg" alt=""><img class="d-wsd" src="img/wb/ws-drop.jpg" alt=""><i class="d-wsb"></i>', 660, 1520) + '</div><div><div class="d-fd in"><span class="r">' + FD + '我的AI工作台</span>' + ['资料包', '01_简报', '02_早报', '03_汇报稿', '04_技能'].map(function (f) { return '<span>' + FD + f + '</span>'; }).join('') + '</div>' + st([['在桌面新建“我的AI工作台”，将资料包解压到其中'], ['在输入框下方选择“选择工作空间”→“打开本地文件夹”'], ['输入：这个文件夹里有什么', 'WorkBuddy 能列出以上子文件夹，即配置成功', 1]]) + '</div></div>';
  };
  VIZ['模式、模型与权限'] = function (el) {
    var C = [['img/wb/mode.jpg', '模式', ['默认', '计划', '仅问答'], 0, '日常使用默认模式；任务复杂时先用“计划”，确认思路后再执行。'], ['', '模型', ['快速', '均衡', '极致'], 1, '一般选择“均衡”。模型越强，消耗的积分越多。'], ['img/wb/perm.jpg', '权限', ['默认权限', '完全访问'], 0, '保持默认权限：删除文件、运行程序等操作会先征求确认。']];
    el.innerHTML = '<div class="d-o3">' + C.map(function (c, i) { return '<div class="d-o3-c in" style="--i:' + i + '"><div class="d-o3-i' + (c[0] ? ' zimg' : '') + '">' + (c[0] ? '<img src="' + c[0] + '" alt="">' : '<div class="d-m3"><span>快速<small>简单、明确的任务</small></span><span class="on">均衡<small>绝大多数任务</small></span><span>极致<small>复杂、需反复验证的任务</small></span></div>') + '</div><h3>' + c[1] + '</h3><div class="d-o3-o">' + c[2].map(function (o, k) { return '<span class="d-pill' + (k === c[3] ? ' y' : ' t') + '">' + o + '</span>'; }).join('') + '</div><p>' + c[4] + '</p></div>'; }).join('') + '</div>';
  };
  VIZ['技能'] = function (el) {
    el.innerHTML = '<div class="d-ws"><div>' + VK.lap(VK.shot('img/wb/skills-win.jpg'), 760, 1072) + '</div><div style="display:flex;flex-direction:column"><div class="d-rw">' + [['store', '从技能市场安装', '左侧进入“专家·技能·连接器”，点击 + 号安装'], ['say', '由 WorkBuddy 推荐', '例如：“帮我找一个能把网页转成 PDF 的技能”'], ['save', '将自己的做法保存为技能', '下午每完成一个案例，保存一个技能']].map(function (r, i) { return '<div class="in" style="--i:' + i + '">' + ic(r[0]) + '<div><h3>' + r[1] + '</h3><p>' + r[2] + '</p></div></div>'; }).join('') + '</div><div class="d-tip in" style="--i:4"><b>安全提示</b>优先选用官方推荐的技能；第三方技能先核实来源。</div></div></div>';
  };
  VIZ['定时任务与手机助理'] = function (el) {
    el.innerHTML = '<div class="d-2"><div class="in"><div class="d-stage" style="--b:360px">' + VK.lap('<img class="vshot" src="img/wb/home-win.jpg" alt=""><div class="d-dim"><img src="img/wb/auto-new.jpg" alt=""></div>', 600, 1520) + '</div><h3>定时任务</h3><p>设定名称、指令和执行时间，到点自动运行。本地任务需保持电脑开机；云端任务不受开关机影响，但无法读取本机文件。</p></div><div class="in" style="--i:1"><div class="d-stage d-pcph" style="--b:360px">' + VK.lap(VK.shot('img/wb/assist-pc.jpg'), 600, 1122) + VK.pho('<img src="img/wb/assist-phone.jpg" alt="" style="width:100%;height:100%;object-fit:cover;object-position:top">', 150) + '</div><h3>手机助理</h3><p>扫码绑定微信后，可在手机上下达任务，电脑端的 WorkBuddy 执行完成后将结果发回微信。</p></div></div>';
  };
  VIZ['安装检查'] = function (el) {
    el.innerHTML = '<div class="d-ok"><div>' + cks(['已登录：左下角显示个人头像', '已选择工作空间：输入框下方显示“我的AI工作台”', '已验证：WorkBuddy 能列出文件夹中的内容']) + '</div><div class="d-ok-b"><button class="d-tm" data-g="timer:8" data-gt="安装检查" data-gn="完成登录、选择工作空间并验证">计时</button></div></div>'; bindCk(el);
  };

  /* ================= 案例的通用页 ================= */
  function useFor(el, k, big, txt) { el.innerHTML = '<div><div class="d-us">' + RN.map(function (r, i) { return '<div class="d-us-i in" style="--i:' + i + '">' + av(i) + '<span class="d-k">' + r + '</span><h3>' + ROLE[i][k] + '</h3></div>'; }).join('') + '</div><div class="d-us-s in" style="--i:5"><b>' + big + '</b><span>' + txt + '</span></div></div>'; }
  function howTo(el, list, title, text, cls) { el.innerHTML = '<div class="d-hw"><div>' + st(list) + '</div>' + pr(title, text, cls) + '</div>'; bind(el); }
  function doNow(el, min, title, checks, dev) { el.innerHTML = '<div class="d-nw"><div class="d-nw-l"><h3>' + title + '</h3>' + cks(checks) + '<div class="d-row"><button class="d-btn" data-g="timer:' + min + '" data-gt="' + title + '">计时 ' + min + ' 分钟</button><button class="d-btn w" data-g="wheel:num" data-gt="抽取一位老师展示成果">抽取展示</button></div></div><div>' + dev + '</div></div>'; VK.fill(el); bindCk(el); }
  function check(el, list, rv) { el.innerHTML = '<div class="d-cq' + (rv ? ' rv' : '') + '" style="--n:' + list.length + '">' + list.map(function (c, i) { return '<div class="d-cq-c in" style="--i:' + i + '"><i>' + c[0] + '</i><h3>' + c[1] + '</h3><p>' + c[2] + '</p><em>' + c[3] + '</em></div>'; }).join('') + '</div>'; bindCk(el); }

  /* ================= 篇四 案例一：一页简报 ================= */
  var C1 = '案例一：一页简报｜', LN = ''; for (var z = 0; z < 26; z++) LN += '<u></u>';
  VIZ[C1 + '案例介绍'] = function (el) { el.innerHTML = '<div class="d-in"><div class="d-pk in"><i></i><i></i><div><h4>在初等教育学院办学 120 周年高质量发展大会上的讲话</h4>' + LN + '</div><b>2036 字 · 19 段</b></div><div class="d-arr in" style="--i:1">→</div><div class="d-in-r in" style="--i:2">' + VK.lap(doc(VK.BRIEF), 720, 900) + '<div class="d-chips"><span class="d-pill">一句话主旨</span><span class="d-pill">四点希望</span><span class="d-pill">关键数字</span><span class="d-pill">可引用的原话</span></div></div></div>'; };
  VIZ[C1 + '应用场景'] = function (el) { useFor(el, 0, '2036 字 → 1 页', '同类任务：会议纪要、文件摘要、学习材料'); };
  VIZ[C1 + '操作步骤'] = function (el) { howTo(el, [['将讲话稿放入“01_简报”文件夹'], ['将右侧提示词发送给 WorkBuddy', '可在对话区看到读取文件、写入文件的每一步'], ['在右侧“产物”中打开生成的 Word 文档', '一页简报，四部分内容齐全', 1]], '发送给 WorkBuddy', PROMPT.c1); };
  VIZ[C1 + '课堂实操'] = function (el) { doNow(el, 10, '完成第一份简报', ['“产物”中生成《一页简报.docx》', '篇幅控制在一页', '主旨、要点、数字、原话齐全'], VK.lap(wbBrief(1), 740, 1000)); };
  VIZ[C1 + '成果核对'] = function (el) { check(el, [['职', '人名与职务', '全称最容易出错', '重庆师范大学党委书记 王国胤'], ['时', '时间与场合', '年月日、上下午、会议名称', '2026 年 10 月 24 日'], ['数', '数字', '“超过”“余”“首批”等限定词不能丢', '超过25万名教师 · 五万余名学子'], ['引', '引用的原话', '加了引号，须一字不差', '原稿“百廿”的“廿”带注音，读取时可能漏字']]); };
  VIZ[C1 + '迭代优化'] = function (el) { var U = [['先让它提问', PROMPT.c1ask], ['指出具体修改', PROMPT.c1fix], ['形成规则', PROMPT.c1rule]];
    el.innerHTML = '<div class="d-up">' + U.map(function (u, i) { return '<div class="in" style="--i:' + i + '"><h3><span class="d-n">' + (i + 1) + '</span>' + u[0] + '</h3><div class="d-ub" data-raw="' + raw(u[1]) + '">' + mark(u[1]) + '<button type="button" class="d-cp">复制</button></div></div>'; }).join('') + '</div>'; bind(el); };
  VIZ[C1 + '沉淀为技能'] = function (el) { howTo(el, [['将右侧提示词发送给 WorkBuddy', '在“技能”中出现“一页简报”'], ['新建任务，换一份材料', '例如资料包中的《严校长致辞》'], ['只输入：做成一页简报', '格式、核对项与第一份一致，即沉淀成功', 1]], '发送给 WorkBuddy · 保存为技能', PROMPT.c1skill); };

  /* ================= 篇五 案例二：热点早报 ================= */
  var C2 = '案例二：热点早报｜';
  VIZ[C2 + '案例介绍'] = function (el) { el.innerHTML = '<div class="d-ws" style="grid-template-columns:1fr 1fr"><div class="d-stage in" style="--b:440px">' + phone(250) + '</div><div class="d-f3">' + [['clock', '每个工作日 7:30', '到点自动生成，无需人工触发'], ['doc', '10 条，三个栏目', '学校相关 · 高教动态 · 理论热点'], ['web', '每条附原文链接', '一句话摘要，注明发布单位和日期']].map(function (f, i) { return '<div class="in" style="--i:' + (i + 1) + '">' + ic(f[0]) + '<div><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div></div>'; }).join('') + '</div></div>'; VK.fill(el); };
  VIZ[C2 + '应用场景'] = function (el) { useFor(el, 1, '每天节省约 30 分钟', '同类任务：选题线索、舆情苗头、政策跟踪'); };
  VIZ[C2 + '操作步骤'] = function (el) { howTo(el, [['新建任务，工作空间仍选择“我的AI工作台”'], ['将右侧提示词发送给 WorkBuddy', '标黄部分替换为本部门的信息来源'], ['查看生成的早报', '10 条以内，每条附原文链接', 1]], '发送给 WorkBuddy', PROMPT.c2, 's'); };
  VIZ[C2 + '课堂实操'] = function (el) { doNow(el, 12, '生成今天的早报', ['对话区给出今天的早报', '“02_早报”文件夹中生成文件', '每条均附原文链接'], VK.lap(VK.slot('zaobao-run', 'WorkBuddy 跑早报的截图（对话里能看到搜索步骤和结果）', VK.wb({ noside: 1, tasks: TASKS, task: 1, title: '宣传和理论热点早报', ms: [{ u: '请帮我做一份今天的《宣传和理论热点早报》……' }, { steps: [[1, '联网搜索：教育部官网 最近 24 小时'], [1, '联网搜索：中国教育报 最近 24 小时'], [1, '筛掉 3 条旧闻、1 条打不开的链接'], [1, '写入 <code>02_早报/早报_今天.md</code>']], a: '今天的早报做好了，共 8 条。有 2 个来源今天没有新内容。', file: ['M', '早报_今天.md'] }] })), 740, 900)); };
  VIZ[C2 + '成果核对'] = function (el) { check(el, [['期', '发布时间', '逐条查看发布日期', '常见问题：数日前的通知被当作当天新闻'], ['链', '链接有效', '随机点开 3 条', '常见问题：链接失效，或指向其他文章'], ['准', '表述准确', '对照原文通读', '常见问题：“试点”被概括为“全面推开”']]); };
  VIZ[C2 + '迭代优化'] = function (el) { var W = [['旧闻混入', '只收录 24 小时内发布的内容'], ['链接失效', '每条必须附可打开的原文链接'], ['概括失准', '理论类只引用原文，不作概括']];
    el.innerHTML = '<div class="d-hw"><div><div class="d-k" style="padding-left:6px">把核对中发现的问题写成规则</div><div class="d-w2">' + W.map(function (w, i) { return '<div class="in" style="--i:' + i + '"><span class="d-pill r">' + w[0] + '</span><span class="d-arr" style="font-size:26px">→</span><span class="d-pill g">' + w[1] + '</span></div>'; }).join('') + '</div></div>' + pr('发送给 WorkBuddy', PROMPT.c2rule, 'b') + '</div>'; bind(el); };
  VIZ[C2 + '设为定时任务'] = function (el) { el.innerHTML = '<div class="d-hw"><div style="align-items:center">' + VK.lap(VK.shot('img/wb/auto-new.jpg', 1), 620) + '</div><div style="display:flex;flex-direction:column;gap:18px;justify-content:center">' + pr('发送给 WorkBuddy', PROMPT.c2auto, 'b') + st([['发送上方提示词', 'WorkBuddy 自动创建定时任务，并告知执行时间'], ['在左侧“定时任务”中找到该任务，点击“立即运行”', '手机上收到当天的早报', 1]]) + '</div></div>'; q('.d-pr', el).style.flex = 'none'; bind(el); };

  /* ================= 篇六 案例三：汇报材料 ================= */
  var C3 = '案例三：汇报材料｜';
  VIZ[C3 + '案例介绍'] = function (el) { el.innerHTML = '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:26px;align-items:center"><div class="d-in-r in">' + VK.lap(VK.xls(9), 610, 900) + '<span class="d-pill">原始数据 · 307 篇推文</span></div><div class="d-arr in" style="--i:1">→</div><div class="d-in-r in" style="--i:2">' + VK.lap(doc(VK.REPORT), 610, 900) + '<span class="d-pill y">汇报材料 · 结论均有数据支撑</span></div></div>'; };
  VIZ[C3 + '应用场景'] = function (el) { useFor(el, 2, '每个结论都有数据', '同类任务：年度总结、述职报告、成绩分析'); };
  VIZ[C3 + '操作步骤：先核算，再撰写'] = function (el) { el.innerHTML = '<div class="d-g3">' + pr('第一步 · 只做核算', PROMPT.c3a, 's') + '<div class="d-gt in" style="--i:1"><i>核</i><p>抽取 3 个数字<br>自行验算</p><span class="d-pill r" style="font-size:16px;white-space:normal;text-align:center;line-height:1.4">数据有误<br>后续全部失效</span></div>' + pr('第二步 · 数据确认后再撰写', PROMPT.c3b, 's') + '</div>'; bind(el); };
  VIZ[C3 + '成果核对'] = function (el) { check(el, [['列', '表格包含哪些列', '4 列', '序号 · 推文标题 · 发表日期 · 阅读量'], ['行', '共有多少行数据', '307 行', '不含标题、说明和表头'], ['期', '时间范围', '1 月 1 日至 11 月 13 日', '2026 年，共 11 个月']], 1);
    var s = VK.steps(el, 4, function (i) { qa('.d-cq-c', el).forEach(function (c, k) { c.classList.toggle('on', k < i); }); }); };
  VIZ[C3 + '课后完成'] = function (el) { el.innerHTML = '<div><div class="d-fl">' + [['XLS', '公众号数据表', '307 篇推文的原始数据'], ['DOC', '汇报稿结构样例', '只有框架，内容自行完成'], ['TXT', '两张提示词卡', '先核算，再撰写'], ['PDF', '自查评分表', '提交前逐项对照']].map(function (f, i) { return '<div class="in" style="--i:' + i + '"><span class="d-fi">' + f[0] + '</span><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div>'; }).join('') + '</div><div class="d-line in" style="--i:5;margin-top:44px">依照资料包“03_汇报稿”课后完成，<b>通过工牌提交</b>；也可换成本岗位的数据。</div></div>'; };

  /* ================= 篇七 总结与作业 ================= */
  VIZ['成果展示与点评'] = function (el) { el.innerHTML = '<div class="d-ok"><div><div class="d-k" style="margin-bottom:14px">抽到的老师投屏 1 分钟</div>' + cks(['展示今天完成的一份成果', '分享一个遇到的问题和解决办法']) + '<div style="display:flex;gap:10px;margin-top:28px"><button class="d-btn w" data-g="wheel:task" data-gt="互动任务">互动任务</button><button class="d-btn w" data-g="timer:3" data-gt="成果展示">计时</button></div></div><div class="d-ok-b"><button class="d-big" data-g="wheel:num" data-gt="抽取一位老师展示成果">抽取<small>展示人</small></button></div></div>'; bindCk(el); };
  VIZ['今日小结'] = function (el) { el.innerHTML = '<div><div class="d-sm">' + [['doc', '一页简报', '可替换为本岗位的材料'], ['phone', '热点早报', '每个工作日 7:30 推送'], ['star', '个人技能', '一句话即可调用']].map(function (c, i) { return '<div class="in" style="--i:' + i + '">' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div><div class="d-six in" style="--i:4"><span class="d-k" style="align-self:center;margin-right:6px">六个要素</span>' + SW.map(function (s) { return '<span class="d-pill">' + s[1] + '</span>'; }).join('') + '</div></div>'; };
  VIZ['课后作业'] = function (el) { el.innerHTML = '<div class="d-hm"><div class="d-hm-n in"><b>3</b><span>份成果</span></div><div><div class="d-chips in" style="--i:1;justify-content:flex-start;margin-bottom:22px;padding-left:10px"><span class="d-pill">姓名_简报</span><span class="d-pill">姓名_早报</span><span class="d-pill">姓名_汇报材料</span></div>' + st([['在工牌上选择“交作业”', '屏幕显示上传二维码'], ['微信扫码，上传文件', '提示上传成功'], ['次日上课前查看工牌', '显示成绩与排名', 1]]) + '</div></div>'; };
  VIZ['次日准备'] = function (el) { el.innerHTML = '<div><div class="d-sm" style="grid-template-columns:1fr 1fr;max-width:1000px;margin:0 auto">' + [['photo', '准备 3–5 张照片', '本单位的活动、校园风景或老照片'], ['bolt', '登录 RunningHub', '确认账号可用、积分充足']].map(function (c, i) { return '<div class="in" style="--i:' + i + '">' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div><div class="d-line in" style="--i:3;margin-top:44px"><b>第 2 天</b>AIGC 视觉创作：海报设计与老照片修复</div></div>'; };
})();
