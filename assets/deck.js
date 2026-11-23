/* 每节课的课件。数据还是 data/course.js（由 课程内容_v1.md 生成）：卷 = 一天，篇 = 一章，页 = 一页；每章前面自动加一页章节封面。
   地址：day.html?d=0（开课）… d=5（第五节）、d=6（资料）；#n 是第几页。键盘：← → 翻页，F 全屏，N 备课标注。 */
(function () {
  'use strict';
  var C = window.COURSE, V = C.vols, B = C.books, by = {};
  C.pages.forEach(function (p) { by[p.id] = p; });
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var two = function (n) { return (n < 10 ? '0' : '') + n; };
  var TABS = [['开课', 1], ['第一节', 2], ['第二节', 3], ['第三节', 4], ['第四节', 5], ['第五节', 6], ['资料', 7]];
  var d = Math.max(0, Math.min(TABS.length - 1, +(new URLSearchParams(location.search).get('d')) || 0));
  if (d === 0) { location.replace('day.html?d=1'); return; }
  document.body.classList.add('d' + d);                       // “开课”这一块不要了，主页已经讲过
  var vol = V[TABS[d][1]], chapters = vol.books.map(function (i) { return B[i]; });
  if (d === 6) chapters = chapters.filter(function (b) { return ['工牌怎么玩', '比赛规则', '每节课的资料包', '学员课前准备', '课程素材包'].indexOf(b.name) >= 0; });   // 资料页签只留这四页

  var slides = [];
  chapters.forEach(function (b, ci) {
    b.first = slides.length;
    if (d !== 6) slides.push({ cover: true, b: b, ci: ci });
    b.pages.forEach(function (id) { slides.push({ p: by[id], b: b, ci: ci }); });
  });
  var cur = Math.max(0, Math.min(slides.length - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));

  /* 顶栏、侧栏 */
  $('#tabs').innerHTML = TABS.map(function (t, i) { return i === 0 ? '' : '<a href="day.html?d=' + i + '"' + (i === d ? ' class="on"' : '') + '>' + t[0] + '</a>'; }).join('');
  $('#dayK').textContent = TABS[d][0];
  var DL = ['', '第一节_WorkBuddy', '第二节_RunningHub', '第三节_RunningHub视频', '第四节_活动出整套与黑客松', '第五节_DeepSeek_Harness'];   // 课程素材包：tools/pack.py 打包到 downloads/
  if ($('#dlBtn')) { if (d >= 1 && d <= 5) { $('#dlBtn').href = 'downloads/' + DL[d] + '.zip'; $('#dlBtn').setAttribute('download', ''); } else { $('#dlBtn').href = 'downloads/全部课程素材.zip'; $('#dlBtn').textContent = '下载全部素材 ↓'; } }
  $('#dayT').textContent = d === 0 ? '为什么办 · 学什么 · 五节课做什么' : d === 6 ? '工牌、比赛、课前准备' : vol.title;
  $('#dayS').textContent = d === 0 ? '' : d === 6 ? '课上和课后用得到的资料' : vol.sub.replace(/ · 第[一二三四五]节/, '');
  $('#chs').innerHTML = chapters.map(function (b, ci) {
    return '<li data-ci="' + ci + '"><div class="ch"><b>' + two(ci) + '</b><span>' + esc(b.name) + '</span>' + (b.time ? '<small>' + esc(b.time.split('，')[0]) + '</small>' : '') + '</div><div class="pg">' +
      b.pages.map(function (id) { return '<a data-id="' + esc(id) + '">' + esc(by[id].title) + '</a>'; }).join('') + '</div></li>';
  }).join('');
  $('#chs').addEventListener('click', function (e) {
    var a = e.target.closest('a[data-id]'), li = e.target.closest('li');
    if (a) go(slides.findIndex(function (s) { return s.p && s.p.id === a.getAttribute('data-id'); }));
    else if (li) go(chapters[+li.getAttribute('data-ci')].first);
  });

  /* 一页 */
  function splitScreen(h) { var m = h.match(/^<p>([\s\S]*?)<\/p>([\s\S]*)$/); return m ? { desc: m[1], rest: m[2] } : { desc: '', rest: h }; }
  function strip(h) { return h.replace(/^<p>|<\/p>$/g, ''); }
  function linkRefs(h) { return h.replace(/>([^<]*)/g, function (m, t) { return '>' + t.replace(/(^|[^\w.-])([0-5]-\d\d)(?!\d)/g, function (x, a, id) { return by[id] ? a + '<a data-ref="' + id + '">' + id + '</a>' : x; }); }); }
  function render() {
    var s = slides[cur], b = s.b, el = $('#slide'), h;
    if (window.VIZ_STOP) window.VIZ_STOP();
    var foot = '<div class="pgn"><span>重庆师范大学 · AI 应用实战培训 · ' + esc(TABS[d][0]) + '</span><span>' + two(cur + 1) + ' / ' + two(slides.length) + '</span></div>';
    if (s.cover) {
      h = '<div class="sl cover"><span class="tag">CHAPTER</span><span class="num">' + two(s.ci) + '</span><h2>' + esc(b.name) + '</h2>' +
        (b.desc ? '<p>' + esc(b.desc) + '</p>' : '') + '<small>' + esc([b.time, b.pages.length + ' 页'].filter(Boolean).join(' · ')) + '</small>' + foot + '</div>';
    } else {
      var p = s.p, F = {}; p.fields.forEach(function (f) { (F[f.k] = F[f.k] || []).push(f.html); });
      var viz = window.VIZ && (window.VIZ[b.name + '｜' + p.title] || window.VIZ[p.title] || window.VIZ[p.id]);   // 先按“章名｜标题”找，再按标题、页号
      if (viz) {                                    // 这一页有图示：标题照旧，正文交给 viz 画；要讲的话只在“备课标注”里显示
        el.innerHTML = '<div class="sl vz"><div class="hd"><span class="tag">' + esc(b.name) + '</span><span class="num">' + two(s.ci) + '</span></div><h2>' + esc(p.title) + '</h2><div class="vb" id="vb"></div>' + foot + '</div>';
        fit(); try { viz(document.getElementById('vb')); } catch (err) { document.getElementById('vb').textContent = '图示出错：' + err.message; }
        return after(s);
      }
      h = '<div class="sl"><div class="hd"><span class="tag">' + esc(b.name) + '</span><span class="num">' + two(s.ci) + '</span></div><h2>' + esc(p.title) + '</h2>';
      if (F.doc) h += '<div class="bd doc"><div class="tx">' + linkRefs(F.doc.join('')) + '</div></div>';
      else {
        var say = (F['讲'] || []).join('') + (F['规则'] ? '<p><b>规则</b>　' + strip(F['规则'].join('')) + '</p>' : '');
        var scr = F['屏'] ? splitScreen(F['屏'].join('')) : null, card = p.type === '卡';
        var doH = F['做'] ? '<div class="do"><span class="k">学员现在做</span><div class="tx">' + F['做'].join('') + '</div></div>' : '';
        var L = '', R = '';
        if (say) {
          L = '<div class="tx">' + say + '</div>';
          if (scr && scr.rest) R = '<div class="panel' + (card ? ' card' : '') + '"><span class="k">' + (card ? '提示词卡 · 只给结构，空格自己填' : '画面') + '</span><div class="tx">' + scr.rest + '</div></div>';
        } else if (scr) {
          L = card ? '<div class="panel card"><span class="k">提示词卡 · 只给结构，空格自己填</span><div class="tx">' + scr.rest + '</div></div>' : '<div class="tx">' + (scr.rest || '<p>' + scr.desc + '</p>') + '</div>';
        }
        if (doH) { if (R) R += doH; else L += doH; }
        h += '<div class="bd' + (R ? ' two' : '') + '"><div class="col">' + L + '</div>' + (R ? '<div class="col">' + R + '</div>' : '') + '</div>';
        var ft = '';
        (F['对应需求'] || []).forEach(function (x) { ft += '<span class="chip">对应需求 ' + strip(x) + '</span>'; });
        (F['来源'] || []).forEach(function (x) { ft += '<div class="note">来源：' + strip(x) + '</div>'; });
        if (scr && scr.desc && (say || scr.rest)) ft += '<div class="note prep-only"><b>画面</b>　' + scr.desc + '</div>';
        ['素材', '说明'].forEach(function (k) { (F[k] || []).forEach(function (x) { ft += '<div class="note prep-only"><b>' + k + '</b>　' + strip(x) + '</div>'; }); });
        p.flags.forEach(function (f) { ft += '<div class="note prep-only' + (f.k === 'miss' ? ' miss' : '') + '"><b>' + { miss: '缺素材', check: '待核', ask: '待定' }[f.k] + '</b>　' + f.html + '</div>'; });
        h += '<div class="ft">' + ft + '</div>';
      }
      h += foot + '</div>';
    }
    el.innerHTML = h; fit(); after(s);
  }
  function after(s) {
    [].forEach.call(document.querySelectorAll('#chs li'), function (li) { li.classList.toggle('on', +li.getAttribute('data-ci') === s.ci); });
    [].forEach.call(document.querySelectorAll('#chs a'), function (a) { a.classList.toggle('on', !!s.p && a.getAttribute('data-id') === s.p.id); });
    var on = document.querySelector('#chs li.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
    $('#cnt').textContent = two(cur + 1) + ' / ' + two(slides.length);
    $('#prog').style.width = ((cur + 1) / slides.length * 100) + '%';
    if (history.replaceState) history.replaceState(null, '', '#' + (cur + 1));
  }
  function fit() {
    var m = $('#main'), el = $('#slide'), full = document.body.classList.contains('full');
    el.style.transform = 'scale(' + Math.min(m.clientWidth / 1600, m.clientHeight / 900) * (full ? 1 : .98) + ')';
    var bd = el.querySelector('.bd'), h2 = el.querySelector('.sl:not(.cover) h2');
    if (h2) { var ts = 1; h2.style.setProperty('--ts', 1); while (h2.scrollHeight > 170 && ts > .6) { ts -= .05; h2.style.setProperty('--ts', ts); } }
    if (!bd || bd.classList.contains('doc')) return;
    var sl = el.querySelector('.sl'), fs = 1.2; bd.style.setProperty('--fs', fs);
    var over = function () { if (sl.scrollHeight > sl.clientHeight + 2) return true; for (var i = 0; i < bd.children.length; i++) if (bd.children[i].scrollHeight > bd.clientHeight + 2) return true; return false; };
    while (over() && fs > .5) { fs -= .03; bd.style.setProperty('--fs', fs); }
  }
  function go(i) { if (i < 0 || i >= slides.length || i === cur) return; cur = i; render(); }

  function fwd(skip) { if (!skip && window.VIZ_STEP && window.VIZ_STEP(1)) return; go(cur + 1); }           // 这一页还有下一步就走一步，走完了才翻页；skip = 直接翻页
  function back(skip) { if (!skip && window.VIZ_STEP && window.VIZ_STEP(-1)) return; go(cur - 1); }
  $('#prev').addEventListener('click', function (e) { back(e.shiftKey); });
  $('#next').addEventListener('click', function (e) { fwd(e.shiftKey); });
  $('#slide').addEventListener('click', function (e) {
    var a = e.target.closest('a[data-ref]');
    if (a) { var id = a.getAttribute('data-ref'), v = by[id].vol; location.href = 'day.html?d=' + (v - 1) + '#find=' + id; return; }
    if (e.target.closest('a,.bd.doc,.vz') || e.currentTarget.querySelector('.sl.vz')) return;                    // 图示页里的点击留给图示自己
    var r = e.currentTarget.getBoundingClientRect(); go(cur + (e.clientX > r.left + r.width / 2 ? 1 : -1));
  });
  function prep(on) { document.body.classList.toggle('prep', on); }      // 备课标注不放在课件里了；地址加 ?prep=1 才显示
  function full() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(function () {}); }
  $('#btnFull').addEventListener('click', full);
  document.addEventListener('fullscreenchange', function () { document.body.classList.toggle('full', !!document.fullscreenElement); fit(); });
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target && /INPUT|TEXTAREA/.test(e.target.tagName) && e.key === ' ')) return;
    if (e.target && e.target.tagName === 'INPUT' && /^Arrow/.test(e.key)) return;                                 // 正在拖滑块时，方向键留给滑块
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); fwd(e.shiftKey); }      // → ↓ 空格、翻页笔的下一页：先走页内的步骤，走完翻页；按住 Shift 直接翻页
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); back(e.shiftKey); }
    else if (e.key === 'Escape') { if (window.VIZ_ESC) window.VIZ_ESC(); }
    else if (e.key === 'f' || e.key === 'F') full();
  });
  addEventListener('resize', fit);
  addEventListener('hashchange', function () { var n = parseInt(location.hash.slice(1), 10); if (n) go(n - 1); });

  var m = location.hash.match(/^#find=(.+)$/);
  if (m) { var j = slides.findIndex(function (s) { return s.p && s.p.id === decodeURIComponent(m[1]); }); if (j >= 0) cur = j; }
  prep(/[?&]prep=1/.test(location.search));
  if (/[?&]qa=1/.test(location.search)) {
    var bad = []; for (var i = 0; i < slides.length; i++) { cur = i; try { render(); } catch (err) { bad.push(i + ' ERR ' + err.message); continue; }
      var sl = document.querySelector('.sl'); if (sl && sl.scrollHeight > sl.clientHeight + 2) bad.push((slides[i].p ? slides[i].p.id : 'cover') + ' OVER'); }
    var pre = document.createElement('pre'); pre.id = 'qa'; pre.textContent = 'QA d=' + d + ' slides=' + slides.length + ' BAD ' + bad.join(' | '); document.body.appendChild(pre); return;
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render); else render();
})();
