/* 第 5 天每一页的画面（DeepSeek Harness 演示 · 路演 · 颁奖）。键 = “章名｜页标题”或“页标题”，和 课程内容_v1.md 卷五一一对应。
   公共部件：viz-kit.js（VK）、day1.js 的 DK、day2.js 的 D2K。版式在 day5.css（d5- 开头）。
   DeepSeek Harness 的界面是按官方说明画的示意，团队装好课堂锁定的版本后，截图放 img/d5/ 同名替换（dsh-*.jpg）。 */
(function () {
  'use strict';
  var DAY = +(new URLSearchParams(location.search).get('d')) || 0;
  if (DAY !== 5 || !window.DK || !window.D2K) return;
  var VIZ = window.VIZ = window.VIZ || {}, VK = window.VK, q = VK.q, qa = VK.qa, K = window.DK, K2 = window.D2K;
  var ic = K.ic, pr = K.pr, bind = K.bind, st = K.st, cks = K.cks, bindCk = K.bindCk, av = K.av;
  var flow = K2.flow;
  var G = function (d) { return '<svg viewBox="0 0 24 24">' + d + '</svg>'; };
  var SITE = 'https://cqnu-ai-cases.vercel.app';
  function slot5(n, label, fb) { return VK.slot(n, label, fb).replace('img/d1/', 'img/d5/'); }
  function fill5(el) { qa('.slot', el).forEach(function (s) { var n = s.getAttribute('data-slot'), im = new Image(); im.onload = function () { im.className = 'slot-i'; s.appendChild(im); s.classList.add('ok'); }; im.src = 'img/d5/' + n + '.jpg'; }); }

  /* DeepSeek Harness 桌面版（示意）：左侧工作区和插件，右侧主区 */
  var MODS = [['选题日历', 'clock'], ['新闻知识库', 'web'], ['写作中心', 'doc'], ['视觉与视频', 'photo'], ['审核中心', 'check'], ['台账', 'plan']];
  function dsh(o) {
    var side = '<div class="d5-ds-sd"><div class="d5-ds-lg"><i></i><b>DeepSeek Harness</b></div><div class="d5-ds-h">工作区</div><div class="d5-ds-w">' + G('<path d="M3 6h7l2 3h9v10H3z"/>') + '我的AI工作台</div><div class="d5-ds-h">' + (o.navt || '插件') + '</div>' + (o.nav || []).map(function (n, i) { return '<div class="d5-ds-n' + (o.on === i ? ' on' : '') + '">' + G(K.I[n[1]] || '') + n[0] + '</div>'; }).join('') + '<div class="d5-ds-m">模型：DeepSeek V4.1 Flash</div></div>';
    return '<div class="d5-ds"><div class="d5-ds-tb"><i></i><i></i><i></i><span>' + (o.title || 'DeepSeek Harness') + '</span></div><div class="d5-ds-b">' + side + '<div class="d5-ds-mn">' + o.main + '</div></div></div>';
  }
  function modMain(i) {
    if (i === 0) return '<div class="d5-cal"><div class="d5-mh"><b>选题日历</b><span>12 月</span></div><div class="d5-cal-g">' + ['一', '二', '三', '四', '五', '六', '日'].map(function (d) { return '<em>' + d + '</em>'; }).join('') + Array.apply(null, Array(35)).map(function (_, k) { var d = k - 0 + 1, tag = { 1: '校史节点', 9: '期末考试周', 22: '冬至', 31: '新年献词' }[d]; return '<span' + (tag ? ' class="t"' : '') + '>' + (d <= 31 ? d : '') + (tag ? '<i>' + tag + '</i>' : '') + '</span>'; }).join('') + '</div></div>';
    if (i === 1) return '<div class="d5-qa"><div class="d5-mh"><b>新闻知识库</b><span>2010–2026 年校园网新闻</span></div><div class="d5-q">学校近三年在师范生培养方面有哪些报道？</div><div class="d5-a"><p>共检索到 <b>23</b> 篇相关报道，按年份整理如下：</p><p>2026 年 · 8 篇　2025 年 · 9 篇　2024 年 · 6 篇</p><div class="d5-src"><span>[1] 校园网 · 2026-05</span><span>[2] 校园网 · 2025-11</span><span>[3] 校园网 · 2025-06</span></div></div></div>';
    if (i === 2) return '<div class="d5-wr"><div class="d5-mh"><b>写作中心</b><span>新闻稿 · 推文 · 简讯 · 讲话稿</span></div><div class="d5-wr-b"><div class="d5-wr-l">' + ['新闻稿', '推文', '简讯', '讲话稿要点', '采访提纲'].map(function (t, k) { return '<span' + (k ? '' : ' class="on"') + '>' + t + '</span>'; }).join('') + '</div><div class="d5-pg"><b>新闻稿（初稿）</b><i></i><i></i><i></i><i class="s"></i><i></i><i class="s"></i></div></div></div>';
    if (i === 3) return '<div class="d5-vv"><div class="d5-mh"><b>视觉与视频</b><span>海报 · 短视频 · 老照片</span></div><div class="d5-vv-g"><img src="img/d2/poster-v2.jpg" alt=""><img src="img/d2/poster-winter.jpg" alt=""><img src="img/d2/old1-after.jpg" alt=""><img src="img/d3/v-short.jpg" alt=""></div></div>';
    if (i === 4) return '<div class="d5-au"><div class="d5-mh"><b>审核中心</b><span>VI 辅助初审 · 文字核对</span></div><div class="d5-au-b"><div class="d5-au-p"><img src="img/d2/poster-v3.jpg" alt=""><i style="left:30%;top:80%"></i></div><div class="d5-au-l">' + [['y', '校徽比例需核对', '底部校徽与官方文件比例不一致'], ['y', '标准色偏差', '红色与重师红有差异'], ['', '人名职务', '已对照专有名词表，无问题']].map(function (r) { return '<div class="' + r[0] + '"><b>' + r[1] + '</b><span>' + r[2] + '</span></div>'; }).join('') + '</div></div></div>';
    return '<div class="d5-lg"><div class="d5-mh"><b>台账</b><span>本月发稿</span></div><div class="d4-tb"><div class="h"><span>日期</span><span>标题</span><span>平台</span><span>作者</span></div>' + [['12-01', '学校召开教学工作会议', '官网', '宣传部'], ['12-03', '冬日校园', '公众号', '融媒体中心'], ['12-05', '师范生技能大赛开幕', '视频号', '教务处'], ['12-08', '期末复习攻略', '公众号', '学生会']].map(function (r) { return '<div>' + r.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>'; }).join('') + '</div></div>';
  }

  /* ================= 篇一 开场 ================= */
  VIZ['今日安排'] = function (el) {
    var A = [['上午', [['10:00', '开场', '三维校园'], ['10:15', 'DeepSeek', '开源模型怎么选'], ['10:55', 'Harness', '六个核心部件']]], ['下午', [['14:00', '案例', '做一只 AI 宠物'], ['15:20', '路演', '每组 3 分钟'], ['16:00', '成果与颁奖', '合影'], ['16:35', '课后', '怎么继续用']]]];
    el.innerHTML = '<div class="d-ag">' + A.map(function (r, k) { return '<div class="d-ag-r in" style="--i:' + k * 2 + '"><span class="d-ag-k">' + r[0] + '</span><div class="d-ag-l">' + r[1].map(function (t) { return '<div class="d-ag-i"><b>' + t[0] + '</b><h3>' + t[1] + '</h3><p>' + t[2] + '</p></div>'; }).join('') + '</div></div>'; }).join('') +
      '<div class="d-ag-o in" style="--i:5"><span class="d-k">今日成果</span><span class="d-pill y">AI 宠物</span><span class="d-pill y">路演作品</span><span class="d-pill k">AI 种子教师</span></div></div>';
  };
  VIZ['代码已经能做到这一步'] = function (el) {
    var U = 'https://cqnu-ai-cases.vercel.app/cqnu-3d-campus/index.html';
    el.innerHTML = '<div class="d5-3d"><div class="d5-3d-f in">' + VK.lap('<img class="vshot" src="img/d5/campus3d.jpg" alt=""><button class="d5-3d-p" data-live="1">▶ 进入三维校园</button>', 940, 1440) + '</div><div class="d5-3d-t in" style="--i:2"><span class="d-pill">楼宇、湖面、道路</span><span class="d-pill">飞行、步行、坐校车</span><span class="d-pill y">全部由 AI 写代码完成</span><a class="d-btn w" href="' + U + '" target="_blank" rel="noopener">新窗口打开 ↗</a></div></div>';
    q('[data-live]', el).addEventListener('click', function (e) { e.stopPropagation(); q('.d5-3d-f .vp', el).innerHTML = '<iframe src="' + U + '" allow="fullscreen" style="width:100%;height:100%;border:0"></iframe>'; });
  };

  /* ================= 篇二 DeepSeek：模型（内容同 BRP 第 3 天前半段） ================= */
  function lst(L, cls) { return '<div class="d5-cc ' + (cls || '') + '" style="--n:' + L.length + '">' + L.map(function (c, i) { return '<div class="in" style="--i:' + i + '">' + (c[2] ? ic(c[2]) : '<span class="d-n">' + (i + 1) + '</span>') + '<h3>' + c[0] + '</h3><p>' + c[1] + '</p></div>'; }).join('') + '</div>'; }
  function two(a, b) { return '<div class="d5-two">' + [a, b].map(function (c, i) { return '<div class="d5-two-c in ' + (i ? 'k' : '') + '" style="--i:' + i + '"><span class="d-k">' + c[0] + '</span><h3>' + c[1] + '</h3>' + c[2].map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>'; }).join('<div class="d-arr in" style="--i:1">+</div>') + '</div>'; }
  function tbl(H, R, note, hi) { return '<div style="width:100%"><div class="d5-tb in" style="--c:' + H.length + '"><div class="h">' + H.map(function (h) { return '<span>' + h + '</span>'; }).join('') + '</div>' + R.map(function (r, i) { return '<div' + (hi === i ? ' class="y"' : '') + '>' + r.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>'; }).join('') + '</div>' + (note ? '<div class="d-line in" style="--i:3;margin-top:22px">' + note + '</div>' : '') + '</div>'; }
  function quote(t, s) { return '<div class="d5-qt in"><b>' + t + '</b>' + (s ? '<span>' + s + '</span>' : '') + '</div>'; }
  VIZ['DeepSeek Harness，拆成两半讲'] = function (el) { el.innerHTML = two(['前半段 · The Model', 'DeepSeek', ['深度求索做的大模型', '负责“想”：理解你的话、给出回答', '讲清：开源闭源、为什么选它、装在哪']], ['后半段 · The Harness', 'Harness', ['套在模型外面的一层框架', '负责“做”：读文件、跑命令、接系统', '讲清：一个 Agent 由哪 6 个部件撑起来']]); };
  VIZ['前四天学开车，今天看引擎和底盘'] = function (el) { el.innerHTML = lst([['前四天', 'WorkBuddy、RunningHub 是做好的产品，开箱就用', 'star'], ['今天往下看一层', '产品背后的引擎（模型）怎么选，底盘（Harness）怎么搭', 'bolt'], ['不是谁替代谁', '个人提效用好成品；涉及学校数据的事，要自己搭', 'check']]); };
  VIZ['DeepSeek 一路走来'] = function (el) {
    var T = [['2024.12', 'V3', 'MoE 路线确立，训练成本大幅下降'], ['2025.01', 'R1', '推理模型，极低成本接近国际顶尖，“DeepSeek 时刻”'], ['2026.04', 'V4-Pro / V4-Flash', '1M 上下文、MoE、MIT 开源'], ['2026.07–08', 'V4 迭代版', 'V4-Flash-0731、V4-Pro-0813'], ['2026.10', 'V4.1-Flash', '现在 API 默认模型，支持图文，Agent 能力明显提升']];
    el.innerHTML = '<div class="d4-tl d5-tl" style="grid-template-columns:repeat(5,1fr)">' + T.map(function (t, i) { return '<div class="d4-tl-i in' + (i === 4 ? ' k' : '') + '" style="--i:' + i + '"><b>' + t[0] + '</b><i></i><h3>' + t[1] + '</h3><p>' + t[2] + '</p></div>'; }).join('') + '</div>';
  };
  VIZ['好接，也好用'] = function (el) { el.innerHTML = '<div style="width:100%">' + lst([['三档思考', 'Non-think / Think High / Think Max：简单问答用快档，复杂任务用深档', 'bolt'], ['接口兼容', '同时兼容 OpenAI 与 Anthropic 格式，改一个地址就能接进现有工具', 'loop']]) + '<div class="d5-sc in" style="--i:3">' + [['79', '修真实代码的 bug'], ['88', '研究生难度的科学题'], ['92', '编程题']].map(function (s) { return '<div><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('') + '<em>考试成绩（满分 100）</em></div></div>'; };
  VIZ['闭源，还是开源'] = function (el) { el.innerHTML = two(['Closed', '闭源', ['模型在别人的服务器上', '只能通过接口租着用，按量付费', '例：GPT、Grok']], ['Open Weights', '开源', ['模型文件（权重）可以下载', '能装在自己的机器上跑', '例：DeepSeek、Qwen、Kimi、GLM']]).replace('>+<', '>VS<'); };
  VIZ['开源，开放的是什么'] = function (el) { el.innerHTML = lst([['开放的是模型文件', '准确叫“开放权重”；训练数据、训练方法一般不公开', 'save'], ['能自己部署', '装在学校自己的机器上，断网也能运行', 'store'], ['能微调', '用学校自己的资料再训练，让它更懂本校业务', 'loop']]); };
  VIZ['学校为什么倾向“国产 + 开源”'] = function (el) { el.innerHTML = '<div style="width:100%">' + lst([['个人使用', '日常写作、查资料，直接用成熟产品即可', 'hand'], ['进入学校工作', '闭源模型只能调用外部接口，校内数据要发到校外', 'store'], ['国内还受限', 'OpenAI 自 2024 年 7 月起不向中国大陆提供接口；另有数据出境合规要求', 'check']]) + '<div class="d-line in" style="--i:4;margin-top:34px">所以在学校里，一般倾向<b>“国产 + 开源”</b></div></div>'; };
  VIZ['两个维度，四种模型'] = function (el) {
    el.innerHTML = '<div class="d5-q4"><span></span><b>海外</b><b>国产</b><b>闭源<small>只能租接口</small></b><div class="in">GPT、Grok</div><div class="in" style="--i:1">国内厂商的接口</div><b>开源<small>能下载、能自己装</small></b><div class="in" style="--i:2">gpt-oss 等</div><div class="in y" style="--i:3">DeepSeek、Qwen、Kimi、GLM、MiniMax</div></div><div class="d5-q4n in" style="--i:4"><span class="d-pill">开源 / 闭源：能不能装在自己机器上</span><span class="d-pill">国产 / 海外：合规、数据出境、会不会断供</span></div>';
  };
  VIZ['国产开源模型的三个优势'] = function (el) { el.innerHTML = lst([['用得起', '同档次单价更便宜；装在自己机器上，调用几乎只剩电费', 'star'], ['数据不出校', '模型装在学校机器上，未公开稿件、舆情数据留在校内', 'save'], ['自主可控', '权重在自己手里，不怕涨价、停服、断供，也能微调', 'check']]); };
  VIZ['同档次比价'] = function (el) { el.innerHTML = tbl(['模型', '输入', '输出', '备注'], [['DeepSeek V4.1-Flash', '0.30', '1.20', '高峰价；其余时段半价'], ['xAI Grok 4.7', '2.00', '6.00', '提示词超过 20 万 token 翻倍'], ['OpenAI GPT-5.5', '5.00', '30.00', '输入超过 27.2 万 token 为 10 / 45'], ['OpenAI GPT-6.2-astra', '8.00', '40.00', 'OpenAI 最贵的旗舰档']], '美元 / 每百万 token。按输出价，GPT-5.5 约是 DeepSeek 的 <b>25 倍</b>', 0); };
  VIZ['国产模型格局'] = function (el) { el.innerHTML = tbl(['厂商', '当前旗舰', '规模', '公认强项', '许可证'], [['DeepSeek', 'V4.1-Flash / V4-Pro', '763B / 1.6T', '性价比、推理与编码', 'MIT，可商用'], ['阿里 Qwen', 'Qwen3.8', '2.4T', '多语言、生态最全、适合微调', '过往为 Apache 2.0'], ['月之暗面 Kimi', 'K3 / K3.1-Pro', '2.8T', '长时间 Agent 任务', '有营收与署名门槛'], ['智谱 GLM', 'GLM-5.3 / 5.3-Flash', '753B / 321B', '工具调用与 Agent', '逐个核对'], ['MiniMax', 'M3 / M3.1-Flash', '427B / 220B', '长上下文、多模态', '商用需单独协议']], '', 0); };
  VIZ['参数大，算得少'] = function (el) { el.innerHTML = lst([['MoE 混合专家', 'V4-Flash 总参数 284B，每个 token 只激活 13B', 'bolt'], ['低精度权重', '专家参数用 FP4、其余用 FP8 发布，官方权重本身就小', 'save'], ['1M 上下文', '一次能读入整套制度文件，长文本成本也低', 'doc']]); };
  VIZ['内存决定能跑多大的模型'] = function (el) { el.innerHTML = '<div style="width:100%">' + lst([['整个装进显存', '独立显卡看显存；Mac 和 AI 迷你主机是统一内存，看内存', 'store'], ['量化', '每个参数用更少的位存储；4 位量化内存需求约减半，质量轻微下降', 'loop'], ['跑“小一号”的模型', '如 Qwen3.6-35B-A3B、Qwen3.8-27B；8 位量化时 64GB 是实用门槛', 'star']]) + '<div class="d-line in" style="--i:4;margin-top:34px">DeepSeek 本体太大：V4-Flash 2 位量化也要约 <b>85GB</b>，不适合个人电脑</div></div>'; };
  VIZ['三档部署方案'] = function (el) { el.innerHTML = tbl(['方案', '代表机型', '内存', '参考价', '能跑什么'], [['A. 用现有电脑', '手上的 Mac 或 Windows 笔记本', '32GB 起', '0 元', '35B-A3B 级，4 位量化'], ['B. Mac mini', 'Mac mini M5 Pro', '64GB', '约 2.0–2.4 万元', 'Qwen3.6-35B-A3B、Qwen3.8-27B，8 位量化'], ['C. AI 迷你主机', 'AMD Ryzen AI Max+ 395 机型', '128GB', '约 1.5–2.2 万元', '同 B，余量大，可同时装几个模型']], 'A 先零成本体验；B 最省心、最安静；C 适合习惯 Windows、想多试几个模型'); };
  VIZ['本地 + 云端搭配'] = function (el) { el.innerHTML = lst([['涉及校内数据的任务', '一律交给本地模型', 'save'], ['不含校内数据的通用任务', '查公开资料、写通用文案，用 DeepSeek 云端接口', 'web'], ['用顺了再扩', '部门都想用时，再评估部门级服务器', 'store']]); };
  VIZ['闭源能租，开源能进机房'] = function (el) { el.innerHTML = quote('闭源：能租，不能有；<br>开源：能买断，能进机房。'); };

  /* ================= 篇三 Harness：六个核心部件（内容同 BRP 第 3 天后半段） ================= */
  var HS = function (n) { return 'img/d5/harness/' + n + '.svg'; };
  function shot(el, n, cap, L, need) { el.innerHTML = '<div class="d5-hs"><div class="d5-hs-i in"><img class="zimg" src="' + HS(n) + '" alt=""></div><div class="d5-hs-t"><span class="d-k in">' + cap + '</span>' + L.map(function (p, i) { return '<p class="in" style="--i:' + (i + 1) + '">' + p + '</p>'; }).join('') + (need ? '<div class="d5-hs-n in" style="--i:4"><b>' + need[0] + '</b>' + need[1] + '</div>' : '') + '</div></div>'; }
  VIZ['Harness 原意是挽具'] = function (el) { el.innerHTML = '<div class="d5-hr">' + [['模型是马', '有劲，但自己不会拉车，也不知道往哪走', 'bolt'], ['Harness 是挽具', '套上以后，马能拉车、听指挥、不乱跑', 'loop'], ['Agent 是套好挽具的马', '模型出力，Harness 管方向、管边界', 'star']].map(function (c, i) { return (i ? '<div class="d-arr in" style="--i:' + (i * 2 - 1) + '">' + (i === 1 ? '+' : '=') + '</div>' : '') + '<div class="d5-hr-i in' + (i === 2 ? ' y' : '') + '" style="--i:' + i * 2 + '">' + ic(c[2]) + '<h3>' + c[0] + '</h3><p>' + c[1] + '</p></div>'; }).join('') + '</div>'; };
  VIZ['买了模型，不等于有了 Agent'] = function (el) { el.innerHTML = lst([['模型只会输出文字', 'Harness 把文字变成动作：读文件、跑命令、调系统', 'say'], ['同一个模型，换个 Harness，表现差很多', '国产模型的差距，有一部分能靠 Harness 补回来', 'loop'], ['模型握在手里还不够', 'Harness 也要能自己搭、自己管，学校才真正可控', 'check']]); };
  VIZ['Harness 是一类东西'] = function (el) { el.innerHTML = tbl(['Harness', '谁做的', '今天怎么用'], [['DeepSeek Harness', '深度求索', '今天下午用它做案例'], ['Codex', 'OpenAI', '同类产品'], ['Claude Code', 'Anthropic', '业内常拿来对照'], ['learn-claude-code', '开源教学版', '今天的原理图都出自它']], '做法各家不同，骨架都差不多', 0); };
  VIZ['Harness 全景图'] = function (el) { shot(el, 'system-architecture', '一个完整 Harness 的全部零件', ['这是一个完整 Harness 拆开以后的样子。', '十几个零件，全都挂在中间同一个循环上。']); };
  VIZ['六个部件'] = function (el) { el.innerHTML = tbl(['#', '部件', '一句话', '为什么关键'], [['1', '循环', '一个循环 + 一个工具，就是最小的 Agent', '刹车就是成本控制和失控保护'], ['2', '工具', '加一个能力 = 加一个工具，循环不用改', '能做什么，全看给了哪些工具'], ['3', '权限', '先定边界，再给自由', '安全、合规、审计的第一道门'], ['4', '上下文管理', '压缩腾出空间，记忆留下该记的', '决定长任务质量和成本'], ['5', '技能', '写给 Agent 的操作说明书，用到才展开', '制度、流程、话术沉淀下来反复用'], ['6', 'MCP', '用标准协议外接工具', '接办公系统、知识库的通用办法']], '前 4 个是重点；技能前几天用过，放最后带过'); };
  VIZ['循环：转到做完为止'] = function (el) { shot(el, 'agent-loop', '一圈一圈转，直到模型不再要工具', ['模型想一步；要用工具，程序就去做，结果交回模型，再想下一步。', '模型不再要工具，这一圈才停。'], ['要定的', '刹车：最多几步、花多少钱、多久超时。']); };
  VIZ['工具：模型点名就去做'] = function (el) { shot(el, 'tool-dispatch', '模型点名，程序按名字找到处理函数', ['模型只说“我要用读文件”，程序按名字找到那段代码去执行。', '加一个能力，就加一个工具，循环一行不用改。'], ['要定的', '给它哪些工具，就决定了它能碰到什么。']); };
  VIZ['权限：先过三道闸门'] = function (el) { shot(el, 'permission-pipeline', '先看绝对禁止，再看要不要问人', ['模型每要用一次工具，先过闸门：', '绝对禁止的，直接拒绝；危险的，先问人；其余直接放行。'], ['要定的', '哪些绝对禁止，哪些必须先问人。']); };
  VIZ['上下文：快满了就压缩'] = function (el) { shot(el, 'compact-overview', '把旧对话浓缩成摘要，腾出空间', ['上下文是它干活时的“工作台”，总会堆满。', '快满时，把旧对话浓缩成摘要，腾出地方接着干。'], ['为什么关键', '直接决定长任务的质量和花费。']); };
  VIZ['记忆：重启以后还记得'] = function (el) { shot(el, 'memory-overview', '该记的写进文件，下次开工先读', ['对话会被压缩、会重启；该长期记住的，写进记忆文件。', '下次开工，先挑相关的读进来。'], ['要定的', '哪些能记、记多久、谁能看。']); };
  VIZ['技能：用到才展开'] = function (el) { shot(el, 'skill-overview', '平时只给目录，用到哪本再展开哪本', ['第 1 天、第 4 天保存过技能。这里只看原理：', '平时只给它看目录，用到哪本再展开哪本，不占工作台。'], ['要定的', '制度、话术写成技能，谁写、谁审、多久更新。']); };
  VIZ['MCP：统一的外接插口'] = function (el) { shot(el, 'mcp-architecture', '外部系统按统一协议把工具亮出来', ['校内系统按统一的协议把工具亮出来，Agent 连上就能用，', '和自带工具进同一个工具池。']); };
  VIZ['上午带走'] = function (el) { el.innerHTML = lst([['国产模型怎么选', '国产开源模型已进第一梯队：用得起、数据不出校、可控', 'star'], ['本地部署要什么', '内存决定能跑多大的模型；先小成本用起来', 'store'], ['Agent 管住哪几处', '刹车、工具、权限先定好；不是所有事都该交给 Agent', 'check']], 'g'); };

  /* ================= 篇四 案例：做一只 AI 宠物 ================= */
  var PET = 'https://ai-pet-sooty.vercel.app/';
  var C4 = '案例：做一只 AI 宠物｜';
  var PP = { start: '开始做我的 AI 宠物', read: '先读 AGENTS.md，然后按里面的流程一步一步带我做', slow: '一步一步来，每步做完停下来等我' };
  VIZ[C4 + '案例介绍'] = function (el) {
    var A = [['聊天', '接入 DeepSeek，有你设定的性格', 'say'], ['被摸', '摸头、点鼻子、戳肚子，各有反应', 'hand'], ['养成', '会饿、会困、会难过，需要照顾', 'star'], ['听你说话', '你说完话，它会叫着回应', 'bolt'], ['看见你', '认出你在笑、在挥手', 'photo']];
    el.innerHTML = '<div class="d5-pet"><div class="d5-pet-p in"><div class="d5-pet-f">' + VK.pho('<img src="img/d5/pet.jpg" alt="" style="width:100%;height:100%;object-fit:cover">', 236) + '</div><button class="d-btn y" data-live="1">打开互动版</button></div><div class="d5-pet-r">' + A.map(function (a, i) { return '<div class="d5-pl in" style="--i:' + (i + 1) + '">' + ic(a[2]) + '<div><h3>' + a[0] + '</h3><p>' + a[1] + '</p></div></div>'; }).join('') + '<div class="d-line in" style="--i:7;justify-content:flex-start;text-align:left">最后发布成一个链接，手机就能打开</div></div></div>';
    q('[data-live]', el).addEventListener('click', function (e) { e.stopPropagation(); q('.d5-pet-f .vp', el).innerHTML = '<iframe src="' + PET + '" allow="microphone;camera;autoplay" style="width:100%;height:100%;border:0"></iframe>'; this.textContent = '已打开，可直接互动'; });
  };
  VIZ[C4 + '什么算一个产品'] = function (el) { el.innerHTML = '<div style="width:100%">' + lst([['有人用', '想好是给谁用的；“大家”不是一个人', 'hand'], ['能再跑一遍', '同一件事，下次还能用；一次性的回答不算', 'loop'], ['交得出东西', '打开能看到结果；一页网页、一张表都算', 'check']]) + '<div class="d-line in" style="--i:4;margin-top:34px">不看代码多少，看这三样</div></div>'; };
  VIZ[C4 + '要准备什么'] = function (el) { el.innerHTML = tbl(['需要什么', '用来做什么', '费用'], [['一台电脑', '制作', ''], ['DeepSeek Harness', '读写文件、运行命令，带你一步步做', '免费'], ['Node.js（LTS 版本）', '让项目运行起来', '免费'], ['DeepSeek 账号', '宠物的“大脑”', '充 10 元能用很久'], ['AI 画图工具', '画出宠物形象（RunningHub 即可）', '多数有免费额度'], ['AI 视频工具', '让宠物动起来（RunningHub 即可）', '按用量'], ['一部手机', '测试', '']], ''); };
  VIZ[C4 + '十个阶段'] = function (el) {
    var S = [['准备环境', '安装 Node.js'], ['设计宠物', '物种、名字、性格、口头禅'], ['第一次跑起来', '浏览器里看到页面'], ['接入 AI 大脑', '申请密钥，粘贴到 .env'], ['画出宠物形象', '一张竖版半身像'], ['让宠物动起来', '8 段短视频'], ['宠物的声音', '选择或录制叫声'], ['手机上测试', '逐项试用'], ['发布上线', '得到一个公开链接'], ['复盘', '写一段产品介绍']];
    el.innerHTML = '<div class="d5-st10">' + S.map(function (s, i) { return '<div class="d5-st10-i' + (i < 4 ? ' t' : '') + '"><span>' + i + '</span><h3>' + s[0] + '</h3><p>' + s[1] + '</p></div>'; }).join('') + '</div><div class="d-chips in" style="--i:2;margin-top:30px"><span class="d-pill y">课上完成 0–3</span><span class="d-pill">4–9 课后完成</span></div>';
    VK.steps(el, 10, function (k) { qa('.d5-st10-i', el).forEach(function (s, j) { s.classList.toggle('on', j <= k); }); });
  };
  VIZ[C4 + '开工第一句'] = function (el) { el.innerHTML = '<div class="d-hw"><div>' + st([['下载模板，解压到桌面', '文件夹 ai-pet-template'], ['在 DeepSeek Harness 中选为工作区', '设置 → 工作区'], ['说一句话，开始', '它会读项目里的教程，一步一步带你做', 1]]) + '</div><div style="display:flex;flex-direction:column;gap:18px;justify-content:center">' + pr('开工第一句', PP.start) + pr('它没有按教程走时', PP.read) + pr('它一口气做太多时', PP.slow) + '</div></div>'; bind(el); };
  VIZ[C4 + '课堂实操'] = function (el) { K2.doNow(el, 60, '完成阶段 0–3', ['Node.js 安装完成', '宠物的名字、性格、口头禅已确定', '电脑浏览器里能看到宠物页面', '聊天回复来自 DeepSeek，有性格'], VK.pho('<img src="img/d5/pet.jpg" alt="" style="width:100%;height:100%;object-fit:cover">', 240)); };
  VIZ[C4 + '两条提醒'] = function (el) { el.innerHTML = '<div class="d5-nx">' + [['save', 'API 密钥不发在聊天里', '只粘贴进 .env 文件；万一发出去，立即到平台作废并重新生成'], ['photo', '形象用自己的创意', '不使用网上现成的角色图片']].map(function (c, i) { return '<div class="in" style="--i:' + i + '"><span class="d5-nx-n">' + (i + 1) + '</span>' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div>'; };
  VIZ[C4 + '课后继续'] = function (el) { el.innerHTML = tbl(['阶段', '内容', '验收标准'], [['4', '画出宠物形象', '有一张竖版半身像'], ['5', '让宠物动起来', '视频切换正常，触摸区域对准五官'], ['6', '宠物的声音', '说话后能听到叫声'], ['7', '手机上测试', '测试清单全部通过'], ['8', '发布上线', '手机流量下能打开链接并聊天'], ['9', '复盘', '写好产品介绍']], '下次接着做，对它说<b>“继续做我的宠物”</b>，会从上次停下的地方继续'); };

  /* ================= 篇三 进阶 ================= */
  VIZ['安装 DeepSeek Harness'] = function (el) {
    var set = '<div class="d5-set"><div class="d5-mh"><b>设置 · 模型</b></div><label>服务商</label><div class="d5-in">DeepSeek</div><label>API Key</label><div class="d5-in k">sk-••••••••••••••••</div><label>模型</label><div class="d5-in">DeepSeek V4.1 Flash</div><div class="d5-btn">保存</div></div>';
    var ws = '<div class="d5-set"><div class="d5-mh"><b>选择工作区</b></div><div class="d4-fd" style="box-shadow:none;padding:6px 0;min-width:0">' + ['桌面', '我的AI工作台', '下载'].map(function (f, k) { return '<div class="d4-fd-i" style="' + (k === 1 ? 'background:#fff4c2;border-radius:10px' : '') + '"><span class="P">' + G('<path d="M3 6h7l2 3h9v10H3z"/>') + '</span>' + f + '</div>'; }).join('') + '</div><div class="d5-btn">打开</div></div>';
    var dl = '<div class="d5-set"><div class="d5-mh"><b>下载 DeepSeek Harness</b></div><div class="d5-dl">' + ic('save') + '<div><b>Windows 桌面版</b><span>x64 · 自带运行环境</span></div></div><div class="d5-btn">下载安装包</div></div>';
    var ins = '<div class="d5-set"><div class="d5-mh"><b>安装</b></div><div class="d5-pr"><i style="width:72%"></i></div><p class="d5-sm">正在安装……无需管理员权限</p></div>';
    flow(el, [['下载 Windows 桌面版', '官方安装包，自带运行环境', VK.lap(dsh({ nav: [], main: dl }), 760, 1440)], ['双击安装', '无需管理员权限', VK.lap(dsh({ nav: [], main: ins }), 760, 1440)], ['填写 API Key', '设置 → 模型', VK.lap(dsh({ nav: [], main: set }), 760, 1440)], ['选择工作区', '选择“我的AI工作台”', VK.lap(dsh({ nav: [], main: ws }), 760, 1440)]]);
  };
  /* ================= 篇五 路演 ================= */
  VIZ['路演规则'] = function (el) {
    var C = [['价值', '解决真实的工作问题'], ['完成度', '现场能完整跑通'], ['可推广', '别人照着做也能用'], ['表达', '3 分钟讲清楚']];
    el.innerHTML = '<div class="d5-rs"><div class="d5-rs-c">' + C.map(function (c, i) { return '<div class="in" style="--i:' + i + '"><b>1–10</b><h3>' + c[0] + '</h3><p>' + c[1] + '</p></div>'; }).join('') + '</div><div class="d5-rs-b in" style="--i:5"><span class="d-pill">评委扫选手工牌上的加分码</span><span class="d-pill">观众用工牌投票</span><button class="d-btn" data-g="wheel:grp" data-gt="抽取路演顺序">抽取顺序</button><button class="d-btn w" data-g="timer:3" data-gt="路演">计时 3 分钟</button></div></div>';
  };

  /* ================= 篇六 成果汇报 ================= */
  VIZ['五天的成果'] = function (el) {
    var N = [['学员作品', '份'], ['技能', '个'], ['短片', '部'], ['海报', '张']], key = 'cq-d5-num';
    var v = {}; try { v = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    el.innerHTML = '<div class="d5-nm">' + N.map(function (n, i) { return '<div class="in" style="--i:' + i + '"><b contenteditable="true" spellcheck="false" data-k="' + i + '">' + (v[i] || '—') + '</b><span>' + n[0] + '<small>' + n[1] + '</small></span></div>'; }).join('') + '</div><div class="d-line in" style="--i:5;margin-top:50px"><b>5 天</b>· 3 样工具 · 每天 3 个案例</div>';
    qa('[data-k]', el).forEach(function (b) { b.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); b.blur(); } }); b.addEventListener('click', function (e) { e.stopPropagation(); }); b.addEventListener('blur', function () { v[b.getAttribute('data-k')] = b.textContent.trim(); try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }); });
  };

  /* ================= 篇七 颁奖 ================= */
  var HAB = [['先让它提问', '大一点的任务，先让 AI 问清楚'], ['给它材料', '事实来自材料，不靠它编'], ['结果自己核对', '人名、数字、原话逐项核对'], ['问题变成规则', '把发现的问题写进提示词'], ['做通一次，固定下来', '保存为技能，下次一句话调用']];
  VIZ['五天里反复用到的方法'] = function (el) {
    el.innerHTML = '<div class="d5-hb">' + HAB.map(function (h, i) { return '<div class="d5-hb-i"><span class="d-n">' + (i + 1) + '</span><h3>' + h[0] + '</h3><p>' + h[1] + '</p></div>'; }).join('') + '</div>';
    VK.steps(el, HAB.length, function (i) { qa('.d5-hb-i', el).forEach(function (h, k) { h.classList.toggle('on', k <= i); }); });
  };
  VIZ['它叫“提示词工程”'] = function (el) {
    el.innerHTML = '<div class="d5-pe"><div class="d5-pe-s">' + HAB.map(function (h) { return '<span class="d-pill">' + h[0] + '</span>'; }).join('') + '</div><div class="d5-pe-q">这五天反复使用的方法，有一个名字</div><div class="d5-pe-a"><b>提示词工程</b><span>Prompt Engineering</span></div></div>';
    VK.steps(el, 2, function (i) { q('.d5-pe', el).classList.toggle('on', i === 1); });
  };
  VIZ['颁奖'] = function (el) {
    var P = [[2, '个人第 2 名'], [1, '个人第 1 名'], [3, '个人第 3 名']];
    el.innerHTML = '<div class="d5-aw"><div><div class="d5-pod">' + P.map(function (p, i) { return '<div class="r' + p[0] + ' in" style="--i:' + i + '"><div class="d5-pod-a">' + ic('star') + '</div><div class="d5-pod-b"><b>' + p[0] + '</b><span>' + p[1] + '</span></div></div>'; }).join('') + '</div><div class="d-chips in" style="--i:4;margin-top:24px"><span class="d-pill k">组赛冠军</span><span class="d-pill">按组赛积分</span></div></div><div class="d5-aw-r"><div class="d6-m on nozoom" style="opacity:1;transform:none"><div class="d6-bd"><div class="d6-bl"></div><div class="d6-sc"><div class="d6-bgs"><i></i><b>你的名字</b><em>AI 种子教师</em></div></div></div></div><div class="d5-aw-t"><span class="d-k">交齐五天作品</span><b>工牌解锁“AI 种子教师”</b></div></div></div>';
    VK.steps(el, 2, function (i) { q('.d5-aw-r', el).classList.toggle('on', i === 1); });
  };

  /* ================= 篇八 课后 ================= */
  VIZ['遇到新的任务'] = function (el) {
    el.innerHTML = '<div class="d5-nx">' + [['say', '先让 AI 提问，再动手', '把要求说清楚，比反复修改更省时间'], ['save', '做通一次，再固定下来', '保存为技能，下次一句话调用']].map(function (c, i) { return '<div class="in" style="--i:' + i + '"><span class="d5-nx-n">' + (i + 1) + '</span>' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div>';
  };
  VIZ['作品和账号'] = function (el) {
    el.innerHTML = '<div class="d-sm">' + [['folder', '作品集', '保存在自己的电脑上'], ['clock', '账号余额', '到期前决定是否续费'], ['save', '技能文件', '自行备份一份']].map(function (c, i) { return '<div class="in" style="--i:' + i + '">' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div>';
  };
  VIZ['课后资源'] = function (el) {
    el.innerHTML = '<div class="d5-rs2"><a class="d5-site in" href="' + SITE + '" target="_blank" rel="noopener">' + VK.lap(slot5('site', 'AI 案例库网站首页截图', '<div class="d5-site-f"><b>AI 案例库</b><span>cqnu-ai-cases.vercel.app</span></div>'), 760, 1440) + '<span class="d-pill y">AI 案例库网站 ↗</span></a><div class="d5-rs2-r">' + [['folder', '五天资料包', '提示词、素材和操作步骤'], ['say', '班级群', '答疑、作品分享']].map(function (c, i) { return '<div class="d5-pl in" style="--i:' + (i + 1) + '">' + ic(c[0]) + '<div><h3>' + c[1] + '</h3><p>' + c[2] + '</p></div></div>'; }).join('') + '</div></div>';
    fill5(el);
  };
  VIZ['带动同事'] = function (el) {
    el.innerHTML = '<div class="d5-cw">' + [['bolt', '播放“我教你一招”', '3 分钟视频'], ['hand', '带同事做一遍', '用同事自己的材料'], ['say', '成果发到班级群', '团队选出优秀作品表扬']].map(function (c, i) { return (i ? '<div class="d-arr in" style="--i:' + (i * 2 - 1) + '">→</div>' : '') + '<div class="d5-cw-i in" style="--i:' + i * 2 + '">' + ic(c[0]) + '<h3>' + c[1] + '</h3><p>' + c[2] + '</p></div>'; }).join('') + '</div>';
  };
})();
