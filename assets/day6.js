/* “资料”页签（d=6）：只留四页——工牌、比赛、资料包、课前准备。其余（素材清单、出处、待定事项）只在 课程内容_v1.md 附卷里。 */
(function () {
  'use strict';
  if ((+(new URLSearchParams(location.search).get('d')) || 0) !== 6 || !window.VK) return;
  var VIZ = window.VIZ = window.VIZ || {}, VK = window.VK, q = VK.q, qa = VK.qa;
  var G = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var ico = function (d) { return '<span class="d6-ic">' + G(d) + '</span>'; };

  /* ---------- 一、工牌 ---------- */
  var MODES = [
    ['学员', '课表 · 交作业 · 通知 · 设置', '第一节起：课前提醒，微信扫码交作业', ['课表', '交作业', '通知', '设置']],
    ['参赛', '积分 · 排行榜 · 加分码 · 设置', '分组之后：看本组排名，评委扫码加分', ['我的积分', '排行榜', '加分码', '设置']],
    ['游客', '展品 · 投票 · 通知 · 设置', '首映会、路演：给作品投票', ['看展品', '我的投票', '通知', '设置']],
    ['种子教师', '结业解锁的称号', '第五节颁奖：名字、头像、称号', null]];
  function badge(m) {
    var scr = m[3] ? '<div class="d6-bg4">' + m[3].map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>'
      : '<div class="d6-bgs"><i></i><b>你的名字</b><em>AI 种子教师</em></div>';
    return '<div class="d6-bd"><div class="d6-bl"></div><div class="d6-sc">' + scr + '</div></div>';
  }
  VIZ['工牌怎么玩'] = function (el) {
    el.innerHTML = '<div class="d6-md">' + MODES.map(function (m, i) { return '<div class="d6-m in" style="--i:' + i + '" data-i="' + i + '">' + badge(m) + '<h3>' + m[0] + '</h3><p>' + m[2] + '</p></div>'; }).join('') + '</div>' +
      '<div class="d6-keys in" style="--i:5"><span class="d-pill">上下键选择</span><span class="d-pill">中间键进入</span><span class="d-pill y">长按中间键回主页</span></div>';
    var s = VK.steps(el, MODES.length, function (i) { qa('.d6-m', el).forEach(function (m, k) { m.classList.toggle('on', k === i); }); });
    qa('.d6-m', el).forEach(function (m) { m.addEventListener('click', function (e) { e.stopPropagation(); s.go(+m.getAttribute('data-i')); }); });
  };

  /* ---------- 二、比赛 ---------- */
  var RULE = [['分组', '第 2 或 3 天', '4–5 人一组，起队名、喊口号'], ['每轮比两样', '这节课作品 + 限时挑战卡', '15–20 分钟，如“出一张节日海报”'], ['评选', '晚 19:00 或下节课开场', '只公布前三名'], ['第五节路演', '评委 + 观众', '评委四项各 1–10 分，加观众人气']];
  VIZ['比赛规则'] = function (el) {
    el.innerHTML = '<div class="d6-rl">' + RULE.map(function (r, i) { return '<div class="d6-r in" style="--i:' + i + '"><span class="d-n">' + (i + 1) + '</span><h3>' + r[0] + '</h3><b>' + r[1] + '</b><p>' + r[2] + '</p></div>'; }).join('<i class="d6-ar in"></i>') + '</div>' +
      '<div class="d6-sco in" style="--i:6"><span class="d-k">个人分</span><div class="d6-bar"><div style="width:70%"><b>作业</b>约 70%</div><div style="width:30%" class="y"><b>组赛</b>约 30%</div></div></div>';
  };

  /* ---------- 三、资料包 ---------- */
  var PK = [['这节课学了什么', '<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>'], ['用到的指令', '<path d="M4 5h16v11H10l-5 4v-4H4z"/>'], ['下节课教什么', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'], ['下节课的课前准备', '<path d="M5 4h14v16H5z"/><path d="M8 9l2 2 3-3M8 15l2 2 3-3"/>'], ['作业怎么交', '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>']];
  VIZ['每节课的资料包'] = function (el) {
    var chat = '<div class="d6-wx"><div class="d6-wxh">班级群</div><div class="d6-wxm"><i></i><div class="d6-fc"><span class="d6-fz">ZIP</span><div><b>第一节资料包</b><small>这节课的资料</small></div></div></div></div>';
    el.innerHTML = '<div class="d6-pk"><div class="d6-pk-l in" style="--i:0">' + VK.pho(chat, 250) + '<span class="d-pill y">每节课下课发到班级群</span></div><ul class="d6-pk-r">' +
      PK.map(function (p, i) { return '<li class="in" style="--i:' + (i + 1) + '">' + ico(p[1]) + '<h3>' + p[0] + '</h3></li>'; }).join('') + '<li class="in d6-end" style="--i:7"><span class="d-pill k">五节课结束，合成一本</span></li></ul></div>';
  };

  /* ---------- 四、课前准备 ---------- */
  var PRE = [['电脑', 'Windows 10 以上，64 位', '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>'], ['WorkBuddy', '微信扫码登录\n安装受阻时，先退出火绒、360、电脑管家', '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>'], ['RunningHub', '用手机号或微信注册账号', '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'], ['剪映和微信', '剪映电脑版、电脑版微信', '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M10 9l5 3-5 3z"/>'], ['主题和照片', '一个主题：我的学院 / 我的一门课 / 我将来的班级\n3–5 张自己单位的照片', '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M6 16l4-5 4 4 2-2 3 3"/>']];
  VIZ['学员课前准备'] = function (el) {
    el.innerHTML = '<div class="d6-pre">' + PRE.map(function (p, i) { return '<div class="d6-pc in" style="--i:' + i + '">' + ico(p[2]) + '<h3>' + p[0] + '</h3><p>' + p[1].replace(/\n/g, '<br>') + '</p></div>'; }).join('') + '</div>';
  };

  /* ---------- 五、课程素材包（下载） ---------- */
  var DLS = [['第一节', 'WorkBuddy', '一页简报 · 热点早报 · 汇报材料', '第一节_WorkBuddy'], ['第二节', 'RunningHub 生图', '老照片修复 · 活动海报 · 吉祥物', '第二节_RunningHub'], ['第三节', 'RunningHub 视频', '老照片动起来 · 校园短片 · 苏轼讲课', '第三节_RunningHub视频'], ['第四节', '活动出整套', '活动出整套 · 数字员工 · 黑客松', '第四节_活动出整套与黑客松'], ['第五节', 'DeepSeek Harness', 'AI 宠物', '第五节_DeepSeek_Harness']];
  VIZ['课程素材包'] = function (el) {
    el.innerHTML = '<div style="width:100%"><div class="d6-dl">' + DLS.map(function (d, i) { return '<a class="d6-dl-i in" style="--i:' + i + '" href="downloads/' + d[3] + '.zip" download><span class="d-k">' + d[0] + '</span><h3>' + d[1] + '</h3><p>' + d[2] + '</p><b>下载 ↓</b></a>'; }).join('') + '</div><div class="d6-dl-b in" style="--i:6"><div class="d-chips" style="justify-content:flex-start"><span class="d-pill">素材</span><span class="d-pill">成品</span><span class="d-pill">指令</span></div><a class="d-btn" href="downloads/全部课程素材.zip" download>下载全部 ↓</a></div></div>';
  };
})();
