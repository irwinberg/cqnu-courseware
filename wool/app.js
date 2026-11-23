/* AI 积分看板：读 data.json，按周期分组展示；“已领”记在本机浏览器（localStorage）。
   数据维护见《维护说明.md》；手机、工牌读 feed.json（今天能领的每日项）。 */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (t) { return String(t || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var KEY = 'cq-wool-v1', st = {}; try { st = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  st.claims = st.claims || {};            // { id: ['2026-11-23', ...] }
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var dayStr = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var today = dayStr(new Date()), month = today.slice(0, 7);
  var GROUPS = [['day', '每天都能领', '每天 0 点刷新'], ['week', '每周都能领', ''], ['month', '每月都能领', '每月刷新'], ['once', '新人礼包与限时活动', '每个账号一次']];
  var DATA = [];

  function claimed(it, ref) { var c = st.claims[it.id] || []; if (it.period === 'day') return c.indexOf(ref || today) >= 0; if (it.period === 'month') return c.some(function (d) { return d.slice(0, 7) === month; }); if (it.period === 'week') { var w = weekKey(new Date()); return c.some(function (d) { return weekKey(new Date(d)) === w; }); } return c.length > 0; }
  function weekKey(d) { var t = new Date(d); t.setHours(0, 0, 0, 0); t.setDate(t.getDate() - ((t.getDay() + 6) % 7)); return dayStr(t); }
  function streak(it) { var c = st.claims[it.id] || [], n = 0, d = new Date(); if (c.indexOf(dayStr(d)) < 0) d.setDate(d.getDate() - 1); while (c.indexOf(dayStr(d)) >= 0) { n++; d.setDate(d.getDate() - 1); } return n; }
  function toggle(it) { var c = st.claims[it.id] = st.claims[it.id] || []; if (claimed(it)) { st.claims[it.id] = c.filter(function (d) { return it.period === 'day' ? d !== today : it.period === 'month' ? d.slice(0, 7) !== month : it.period === 'week' ? weekKey(new Date(d)) !== weekKey(new Date()) : false; }); } else c.push(today); save(); render(); }

  function stats() {
    var todo = DATA.filter(function (it) { return !it.ended && it.period !== 'once' && !claimed(it); });
    $('#sToday').textContent = todo.length; var v = todo.reduce(function (s, it) { return s + (it.cny || 0); }, 0);
    $('#sTodayV').textContent = '项' + (v ? ' · 可折算约 ¥' + Math.round(v) : '');
    $('#sMonth').textContent = DATA.reduce(function (s, it) { return s + (st.claims[it.id] || []).filter(function (d) { return d.slice(0, 7) === month; }).length; }, 0);
  }
  function tick() { var n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0); var s = Math.floor((m - n) / 1000); $('#sNext').textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)); if (dayStr(n) !== today) { today = dayStr(n); month = today.slice(0, 7); render(); } }
  function album() {
    var got = 0;
    $('#cards').innerHTML = DATA.map(function (it) { var c = st.claims[it.id] || [], k = streak(it), lv = k >= 30 ? 3 : k >= 15 ? 2 : k >= 7 ? 1 : 0; if (c.length) got++;
      return '<div class="cd' + (c.length ? ' got' : '') + (lv ? ' lv' + lv : '') + (it.ended && c.length ? ' end' : '') + '" title="' + esc(it.title) + '"><i>' + esc(it.amount) + '</i><b>' + esc(it.platform.charAt(0)) + '</b><span>' + esc(it.platform) + '</span></div>'; }).join('');
    $('#albumInfo').textContent = DATA.length + ' 张，已收 ' + got + ' 张';
  }
  function render() {
    var q = $('#q').value.trim().toLowerCase(), api = $('#fApi').checked, todo = $('#fTodo').checked;
    $('#list').innerHTML = GROUPS.map(function (g) {
      var L = DATA.filter(function (it) { return it.period === g[0] && !it.ended && (!api || it.api) && (!todo || !claimed(it)) && (!q || (it.title + it.platform + it.models + it.desc).toLowerCase().indexOf(q) >= 0); });
      if (!L.length) return '';
      return '<section class="grp"><h2>' + g[1] + '<small>' + L.length + ' 项' + (g[2] ? ' · ' + g[2] : '') + '</small></h2>' + L.map(function (it) { var d = claimed(it);
        return '<div class="it' + (d ? ' done' : '') + '" data-id="' + it.id + '"><div class="row"><div class="av">' + esc(it.platform.charAt(0)) + '</div><div class="tt"><h3>' + esc(it.title) + '</h3><p>' + esc(it.models) + '</p><div class="tags">' + it.tags.map(function (t, i) { return i ? esc(t) : '<b>' + esc(t) + '</b>'; }).join(' · ') + (it.verified ? ' · ' + esc(it.verified) + '核实' : '') + '</div></div><div class="rt"><span class="amt">' + esc(it.amount) + '</span><div class="btns"><a class="go" href="' + esc(it.link) + '" target="_blank" rel="noopener">去领 ↗</a><button class="mk">' + (d ? '✓ 已领' : (it.period === 'once' ? '标记已领' : '今天已领')) + '</button></div></div></div><div class="dt">' + (it.models ? '<p><b>适用模型：</b>' + esc(it.models) + '</p>' : '') + (it.desc ? '<p>' + esc(it.desc) + '</p>' : '') + (it.valid ? '<p><b>有效期：</b>' + esc(it.valid) + '</p>' : '') + '<p><a href="' + esc(it.link) + '" target="_blank" rel="noopener">' + esc(it.verified || '') + '核实于官方页面</a></p></div></div>'; }).join('') + '</section>';
    }).join('') || '<p style="padding:30px;text-align:center;color:#888">没有符合条件的条目</p>';
    stats(); album();
  }
  document.addEventListener('click', function (e) {
    var it = e.target.closest && e.target.closest('.it'); if (!it) return; var x = DATA.filter(function (d) { return d.id === it.getAttribute('data-id'); })[0];
    if (e.target.closest('.mk')) toggle(x); else if (e.target.closest('.tt')) it.classList.toggle('open');
  });
  ['#q', '#fApi', '#fTodo'].forEach(function (s) { $(s).addEventListener('input', render); });
  function dlg(html) { $('#dlgBody').innerHTML = html; $('#dlg').showModal(); }
  $('#btnHow').onclick = function () { dlg('<h3>怎么算</h3><ul><li>“今天还能领”：每天、每周、每月可领、且你还没标记的条目。</li><li>折算金额只算按官方价能换成人民币的（如美元额度、抵扣券）；积分类暂不折价。</li><li>“已领”只记在这台设备的浏览器里，换设备不同步。</li><li>每条都写了核实日期，点“核实于官方页面”可查看原页面；以官网为准。</li></ul>'); };
  $('#btnReport').onclick = function () { dlg('<h3>提报一条</h3><p>只收平台官方公开的活动：不收返利、邀请链接、共享账号、只给付费用户的。</p><input id="rp1" placeholder="平台名称"><input id="rp2" placeholder="官方活动页链接"><textarea id="rp3" rows="3" placeholder="能领多少、多久一次、有什么条件"></textarea><p style="color:#888">点“好的”后复制下面的内容，发到班级群或交给讲师整理进看板。</p>');
    $('#dlg').onclose = function () { var t = ['平台：' + ($('#rp1') || {}).value, '链接：' + ($('#rp2') || {}).value, '说明：' + ($('#rp3') || {}).value].join('\n'); if (($('#rp1') || {}).value) { try { navigator.clipboard.writeText(t); } catch (e) {} } $('#dlg').onclose = null; }; };
  fetch('data.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (j) { DATA = j.items; $('#upd').textContent = j.updated; render(); tick(); setInterval(tick, 30000); });
})();
