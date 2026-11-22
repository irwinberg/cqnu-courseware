/* 重师大 AI 应用实战培训 · 课件
   三个视图：书架（#/s/书号）→ 篇的详情（#/b/书号）→ 课件页（#/p/页号）。
   数据在 data/course.js，由 tools/build_data.py 从 课程内容_v1.md 生成。 */
(function () {
  'use strict';
  var C = window.COURSE, V = C.vols, B = C.books, P = C.pages;
  var $ = function (s) { return document.querySelector(s); };
  var body = document.body;
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  var order = []; B.forEach(function (b) { b.pages.forEach(function (id) { order.push(id); }); });
  var COV = function (k) { return 'img/covers/' + k + '.jpg'; };
  var CN = '〇一二三四五六七八九';
  function cn(n) { if (n < 10) return CN[n]; if (n === 10) return '十'; if (n < 20) return '十' + CN[n - 10]; return CN[Math.floor(n / 10)] + '十' + (n % 10 ? CN[n % 10] : ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function vlen(s) { var n = 0; for (var i = 0; i < s.length; i++) n += /[\x00-\xff]/.test(s[i]) ? 0.55 : 1; return n; }
  function dayText(b) { var v = b.vol; return v === 0 ? '凡例' : v === 1 ? '第 1 天上午' : v === 7 ? '附卷' : '第 ' + (v - 1) + ' 天'; }
  function volLine(b) { var v = V[b.vol]; return v.name + (b.vol === 0 || b.vol === 7 ? '' : ' · ' + b.label); }
  function missOf(p) { return p.flags.filter(function (f) { return f.k === 'miss'; }).length; }

  /* ---------- 模式：备课版 / 上课版 ---------- */
  var mode = localStorage.getItem('cq-mode') || 'prep';
  function setMode(m) {
    mode = m; localStorage.setItem('cq-mode', m);
    body.classList.toggle('mode-prep', m === 'prep'); body.classList.toggle('mode-class', m === 'class');
    var t = m === 'prep' ? '备课版' : '上课版';
    $('#modeBtn').textContent = t; $('#dkMode').textContent = t;
    $('#footRight').textContent = m === 'prep' ? '课件 第一版 · 备课版（标注缺素材和待定）' : '课件 第一版 · 上课版';
    if (view === 'deck') renderPage(curPage);
  }

  /* ---------- 书 ---------- */
  function smallOf(b) { return b.small !== undefined ? b.small : (b.vol === 0 ? '' : b.label); }
  function sealHTML(v) { var s = v.name === '序卷' ? '序' : v.name === '附卷' ? '附' : v.name; return s.split('').join('<br>'); }
  function coverHTML(b) {
    var v = V[b.vol], n = vlen(b.name);
    var lf = Math.min(5.4, 46 / (n * 1.13));
    return '<div class="cover"><div class="cv-art" style="background-image:url(' + COV(v.cover) + ')"></div><div class="cv-stitch"></div>' +
      '<div class="cv-label"><b style="font-size:' + lf.toFixed(2) + 'em">' + esc(b.name) + '</b>' + (smallOf(b) ? '<small style="font-size:2.3em">' + esc(smallOf(b)) + '</small>' : '') + '</div>' +
      '<div class="cv-seal" style="width:7.6em;height:' + (v.name.length > 1 ? 11 : 7.6) + 'em;font-size:1em"><span style="font-size:3.4em">' + sealHTML(v) + '</span></div>' +
      '<div class="cv-play" style="--pf:4.6em"></div></div>';
  }
  var stage = $('#stage');
  var els = B.map(function (b, i) {
    var v = V[b.vol], el = document.createElement('div'), n = vlen(b.name);
    el.className = 'book';
    el.style.setProperty('--c', v.color); el.style.setProperty('--k', v.ink);
    var tf = Math.min(6.6, 60 / (n * 1.12));
    el.innerHTML = '<div class="spine"><div class="sp-art" style="background-image:url(' + COV(v.cover) + ')"></div>' +
      '<div class="sp-title" style="font-size:' + tf.toFixed(2) + 'em">' + esc(b.name) + '</div>' +
      '<div class="sp-seal" style="width:8em;height:8em;font-size:1em"><span style="font-size:5em">' + (v.name === '凡例' ? '凡' : v.key) + '</span></div>' +
      '<i class="sp-miss' + (b.miss ? ' has' : '') + '"></i></div>' + coverHTML(b) + '<div class="side"></div>';
    el.addEventListener('click', function () { if (i === center) openDetail(i); else goShelf(i); });
    stage.appendChild(el);
    return el;
  });

  var center = Math.max(0, B.findIndex(function (b) { return b.vol === 1; }));
  function hk(k) { return k === 0 ? 1 : Math.max(0.2, 0.9 * Math.pow(0.935, k - 1)); }
  var lastX = [];
  function layout() {
    var W = innerWidth, H = innerHeight, u = Math.min(W / 1440, H / 860), n = B.length;
    var H0 = 385 * u, W0 = H0 * 0.64, cx = W / 2, cy = H * 0.43, lim = W * 0.42;
    var pos = {}; pos[center] = { x: cx, w: W0, h: H0, k: 0 };
    var K = Math.floor((n - 1) / 2);
    [1, -1].forEach(function (dir) {
      var edge = W0 / 2;
      for (var k = 1; k <= K; k++) {
        var i = ((center + dir * k) % n + n) % n;
        var f = hk(k), h = H0 * f, w = h * 0.145, gap = Math.max(2, 9 * u * f);
        var x = cx + dir * (edge + gap + w / 2); edge += gap + w;
        pos[i] = { x: x, w: w, h: h, k: k };
      }
    });
    els.forEach(function (el, i) {
      var p = pos[i] || { x: cx, w: 0, h: 0, k: 99 }, k = p.k, d = Math.abs(p.x - cx);
      var jump = lastX[i] !== undefined && Math.abs(lastX[i] - p.x) > W * 0.5;
      if (jump) el.style.transition = 'none';
      el.style.width = p.w + 'px'; el.style.height = p.h + 'px';
      el.style.fontSize = (p.h / 100) + 'px';
      el.style.transform = 'translate3d(' + (p.x - p.w / 2) + 'px,' + (cy - p.h / 2) + 'px,0)';
      el.style.zIndex = 100 - k;
      var op = d > lim ? 0 : d > lim * 0.86 ? (lim - d) / (lim * 0.14) : 1;
      el.style.opacity = pos[i] ? op : 0;
      el.style.pointerEvents = op > 0.3 ? 'auto' : 'none';
      el.classList.toggle('center', i === center);
      if (jump) { void el.offsetWidth; el.style.transition = ''; }
      lastX[i] = p.x;
      var side = el.lastElementChild;
      if (k >= 1 && k <= 3) {
        var dd = p.w * (0.75 / k), right = (i - center + n) % n <= K;
        side.style.display = 'block'; side.style.width = dd + 'px';
        if (right) { side.style.left = (-dd) + 'px'; side.style.right = ''; side.style.clipPath = 'polygon(0 5%,100% 0,100% 100%,0 95%)'; }
        else { side.style.right = (-dd) + 'px'; side.style.left = ''; side.style.clipPath = 'polygon(0 0,100% 5%,100% 95%,0 100%)'; }
      } else side.style.display = 'none';
    });
    var floor = $('#floor'); floor.style.top = (cy + H0 / 2 - 34 * u) + 'px'; floor.style.height = (70 * u) + 'px';
    $('.caption').style.top = (cy + H0 / 2 + 26 * u) + 'px';
  }

  function caption() {
    var b = B[center], v = V[b.vol];
    $('#capTitle').textContent = b.name;
    $('#capSub').textContent = volLine(b) + ' / ' + v.en;
    var miss = b.pages.reduce(function (s, id) { return s + missOf(byId[id]); }, 0);
    $('#capMeta').innerHTML = esc(dayText(b) + (b.time ? ' · ' + b.time : '')) + ' — ' + b.pages.length + ' 页' +
      (miss ? '<span class="miss">· ' + miss + ' 处缺素材</span>' : '');
    $('#tlDot').style.left = tlX(center) + '%';
  }

  /* ---------- 时间轴 ---------- */
  function tlX(i) { return B.length > 1 ? (i / (B.length - 1)) * 100 : 0; }
  (function buildTimeline() {
    var tl = $('#timeline'), h = '<div class="rail"></div>';
    B.forEach(function (b, i) {
      var first = i === 0 || B[i - 1].vol !== b.vol;
      h += '<div class="tick' + (first ? ' major' : '') + '" data-i="' + i + '" style="left:' + tlX(i) + '%" title="' + esc(volLine(b) + ' ' + b.name) + '"></div>';
      if (first) h += '<div class="lab" data-i="' + i + '" style="left:' + tlX(i) + '%">' + esc(V[b.vol].short) + '</div>';
    });
    h += '<div class="dot" id="tlDot"></div>';
    tl.innerHTML = h;
    tl.addEventListener('click', function (e) { var i = e.target.getAttribute('data-i'); if (i !== null) goShelf(+i); });
  })();

  /* ---------- 视图切换 ---------- */
  var view = 'shelf', curBook = 0, curPage = null;
  function show(name) {
    view = name;
    ['shelf', 'detail', 'deck'].forEach(function (n) { $('#' + n).classList.toggle('on', n === name); });
    body.classList.toggle('in-deck', name === 'deck'); body.classList.toggle('in-detail', name === 'detail');
  }
  function goShelf(i) { center = ((i % B.length) + B.length) % B.length; setHash('#/s/' + center); }
  function openDetail(i) { setHash('#/b/' + i); }
  function openPage(id) { setHash('#/p/' + encodeURIComponent(id)); }
  function setHash(h) { if (location.hash === h) route(); else location.hash = h; }

  function route() {
    var h = decodeURIComponent(location.hash || '#/'), m;
    if ((m = h.match(/^#\/p\/(.+)$/)) && byId[m[1]]) { curPage = m[1]; curBook = byId[m[1]].book; show('deck'); renderPage(curPage); return; }
    if ((m = h.match(/^#\/b\/(\d+)$/)) && B[+m[1]]) { curBook = +m[1]; center = curBook; show('detail'); renderDetail(curBook); return; }
    if ((m = h.match(/^#\/s\/(\d+)$/)) && B[+m[1]]) center = +m[1];
    show('shelf'); layout(); caption();
  }

  /* ---------- 详情 ---------- */
  function renderDetail(i) {
    var b = B[i], v = V[b.vol];
    $('#dtKicker').textContent = volLine(b) + ' / ' + v.en;
    $('#dtTitle').textContent = b.name;
    $('#dtMeta').textContent = [dayText(b), b.time, b.pages.length + ' 页'].filter(Boolean).join(' / ');
    var last = v.books[v.books.length - 1] === i;
    $('#dtDesc').innerHTML = esc(b.desc) + (last && v.evening ? '<br><span style="color:var(--gray)">' + v.evening + '</span>' : '');
    $('#dtTerms').textContent = v.terms.length ? '本卷名词：' + v.terms.join(' · ') : (b.vol === 1 ? v.sub : '');
    $('#dtPages').innerHTML = b.pages.map(function (id) {
      var p = byId[id], ms = missOf(p);
      return '<li data-id="' + esc(id) + '"><span class="pid">' + esc(id) + '</span><span class="seal">' + esc(p.type) + '</span><span>' + esc(p.title) + '</span>' +
        (ms ? '<span class="mk">缺素材 ' + ms + '</span>' : '') + '</li>';
    }).join('');
    var cv = $('#dtCover');
    cv.innerHTML = coverHTML(b).replace('<div class="cover">', '<div class="cover" style="opacity:1;position:absolute;inset:0;background:' + v.color + '">');
    requestAnimationFrame(function () { cv.style.fontSize = (cv.clientHeight / 100) + 'px'; });
  }
  $('#dtPages').addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) openPage(li.getAttribute('data-id')); });
  $('#openBtn').addEventListener('click', function () { openPage(B[curBook].pages[0]); });
  $('#detailBack').addEventListener('click', function () { goShelf(curBook); });
  $('#dtCover').addEventListener('click', function () { openPage(B[curBook].pages[0]); });

  /* ---------- 课件页 ---------- */
  var TYPE = { '讲': '讲解', '演': '只看演示', '带': '跟着做', '练': '自己做', '玩': '互动', '卡': '提示词卡', '凡': '凡例', '附': '附卷' };
  function splitScreen(html) {
    var m = html.match(/^<p>([\s\S]*?)<\/p>([\s\S]*)$/);
    return m ? { desc: m[1], rest: m[2] } : { desc: '', rest: html };
  }
  function linkRefs(h) { return h.replace(/>([^<]*)/g, function (m, t) { return '>' + t.replace(/(^|[^\w.-])([0-5]-\d\d)(?!\d)/g, function (x, a, id) { return byId[id] ? a + '<a class="pref" href="#/p/' + id + '">' + id + '</a>' : x; }); }); }
  function structured(h) { return /<(ul|ol|pre|table)/.test(h); }

  function renderPage(id) {
    var p = byId[id], b = B[p.book], v = V[p.vol], page = $('#page');
    var idx = b.pages.indexOf(id) + 1;
    var F = {}; p.fields.forEach(function (f) { (F[f.k] = F[f.k] || []).push(f.html); });
    page.className = 'page';
    var head = '<div class="frame"></div><div class="banxin"><span class="bx-vol">' + esc(v.name) + '</span><i class="yuwei"></i>' +
      '<span class="bx-book">' + esc((b.vol === 0 || b.vol === 7 ? '' : b.label + ' ') + b.name) + '</span><span class="bx-no">' + cn(idx) + '</span></div>';
    var flags = p.flags.map(function (f) {
      var t = { miss: '缺素材', check: '待核', ask: '待定' }[f.k];
      return '<div class="flag ' + f.k + ' prep-only"><span class="tag">' + t + '</span><span>' + f.html + '</span></div>';
    }).join('');

    if (id === '0-01') {
      page.className = 'page cover-page';
      page.innerHTML = head + '<div class="cv-hero"><div><div class="k">重庆师范大学 · 2026</div><h1>AI 应用<br>实战培训</h1>' +
        '<p>五天，从会用 AI 到用 AI 做出能直接发布的作品。</p><div class="m">第 1 天 · 10:00 · 开课</div>' +
        '<div class="pg-foot" style="margin-top:28px">' + flags + '</div></div>' +
        '<div class="art" id="heroArt"></div></div>';
      var art = $('#heroArt');
      art.innerHTML = coverHTML({ name: 'AI 应用实战培训', vol: 1, label: '', small: '' }).replace('<div class="cover">', '<div class="cover" style="opacity:1;position:absolute;inset:0;background:' + V[1].color + '">');
      art.style.fontSize = '6.9px';
      fitDeck(); count(id); return;
    }

    var kicker = esc(volLine(b)) + (b.time ? ' · ' + esc(b.time) : '') + (p.type === '附' || p.type === '凡' ? '' : ' · ' + esc(TYPE[p.type] || ''));
    var html = head + '<div class="pg"><div class="pg-head"><span>' + kicker + '</span><span class="pid">' + esc(id) + '</span></div>' +
      '<div class="pg-titlebar"><span class="seal">' + esc(p.type) + '</span><h2 class="pg-title">' + esc(p.title) + '</h2></div>';

    if (F.doc) {
      html += '<div class="pg-body doc"><div class="tx">' + linkRefs(F.doc.join('')) + '</div></div>';
    } else {
      var say = (F['讲'] || []).join('') + (F['规则'] ? '<p><b>规则：</b>' + F['规则'].join('').replace(/^<p>|<\/p>$/g, '') + '</p>' : '');
      var scr = F['屏'] ? splitScreen(F['屏'].join('')) : null;
      var isCard = p.type === '卡';
      var doH = F['做'] ? '<div class="do"><span class="lab">学员</span><div class="tx">' + F['做'].join('') + '</div></div>' : '';
      var left = '', right = '';
      if (say) {
        left = '<div class="tx">' + say + '</div>';
        if (scr) {
          var cls = structured(scr.rest) ? '' : ' prep-only';
          right = '<div class="box' + (isCard ? ' card' : '') + cls + '"><span class="lab">' + (isCard ? '提示词卡 · 只给结构，空格自己填' : '画面') + '</span><div class="tx">' +
            (scr.desc ? '<p class="' + (scr.rest ? 'prep-only' : '') + '">' + scr.desc + '</p>' : '') + scr.rest + '</div></div>';
        }
      } else if (scr) {
        if (isCard) left = '<div class="box card"><span class="lab">提示词卡 · 只给结构，空格自己填</span><div class="tx">' + (scr.desc ? '<p class="prep-only">' + scr.desc + '</p>' : '') + scr.rest + '</div></div>';
        else left = '<div class="tx">' + (scr.desc ? '<p class="' + (scr.rest ? 'prep-only' : '') + '" style="' + (scr.rest ? 'color:var(--gray);font-size:.8em' : '') + '">' + (scr.rest ? '画面：' : '') + scr.desc + '</p>' : '') + scr.rest + '</div>';
      }
      if (doH) { if (right) right += doH; else left += doH; }
      var two = !!right;
      html += '<div class="pg-body' + (two ? ' two' : '') + '"><div class="col">' + left + '</div>' + (two ? '<div class="col">' + right + '</div>' : '') + '</div>';
    }
    var foot = '';
    (F['对应需求'] || []).forEach(function (h) { foot += '<span class="chip">对应需求 ' + h.replace(/<\/?p>/g, '') + '</span>'; });
    (F['来源'] || []).forEach(function (h) { foot += '<div class="note">来源：' + h.replace(/<\/?p>/g, '') + '</div>'; });
    (F['素材'] || []).forEach(function (h) { foot += '<div class="note prep-only' + (/✅/.test(h) ? ' ok' : '') + '">素材：' + h.replace(/<\/?p>/g, '') + '</div>'; });
    (F['说明'] || []).forEach(function (h) { foot += '<div class="note prep-only">说明：' + h.replace(/<\/?p>/g, '') + '</div>'; });
    html += '<div class="pg-foot">' + foot + flags + '</div></div>';
    page.innerHTML = html;
    fitDeck(); fitText(); count(id);
  }
  function fitText() {
    var bodyEl = document.querySelector('.pg-body'); if (!bodyEl || bodyEl.classList.contains('doc')) { if (bodyEl) bodyEl.style.setProperty('--fs', 0.86); return; }
    var title = document.querySelector('.pg-title'), s = 1;
    title.style.setProperty('--ts', 1);
    while (title.scrollWidth > title.clientWidth + 2 && s > 0.6) { s -= 0.05; title.style.setProperty('--ts', s); }
    s = 1.3; bodyEl.style.setProperty('--fs', s);
    var over = function () { var cols = bodyEl.children; for (var i = 0; i < cols.length; i++) if (cols[i].scrollHeight > bodyEl.clientHeight + 2) return true; return bodyEl.scrollHeight > bodyEl.clientHeight + 2; };
    while (over() && s > 0.56) { s -= 0.03; bodyEl.style.setProperty('--fs', s); }
  }
  function fitDeck() {
    var s = Math.min(innerWidth / 1600, innerHeight / 900) * (document.fullscreenElement ? 1 : 0.96);
    $('#page').style.transform = 'scale(' + s + ')';
  }
  function count(id) { $('#dkCount').textContent = id + '  ·  ' + (order.indexOf(id) + 1) + ' / ' + order.length; }
  function step(d) { var i = order.indexOf(curPage) + d; if (i >= 0 && i < order.length) openPage(order[i]); }

  $('#dkPrev').addEventListener('click', function () { step(-1); });
  $('#dkNext').addEventListener('click', function () { step(1); });
  $('#dkBook').addEventListener('click', function () { openDetail(curBook); });
  $('#dkShelf').addEventListener('click', function () { goShelf(curBook); });
  $('#dkMode').addEventListener('click', function () { setMode(mode === 'prep' ? 'class' : 'prep'); });
  $('#modeBtn').addEventListener('click', function () { setMode(mode === 'prep' ? 'class' : 'prep'); });
  $('#dkFull').addEventListener('click', toggleFull);
  function toggleFull() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(function () {}); }
  $('#deckWrap').addEventListener('click', function (e) {
    if (e.target.closest('a,button,.pg-body.doc')) return;
    step(e.clientX > innerWidth / 2 ? 1 : -1);
  });

  /* ---------- 顶栏跳转 ---------- */
  document.querySelectorAll('[data-jump]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); var t = a.getAttribute('data-jump');
      if (byId[t]) openPage(t);
      else { var i = B.findIndex(function (b) { return V[b.vol].key === t; }); goShelf(i); }
    });
  });
  $('#prevBtn').addEventListener('click', function () { goShelf(center - 1); });
  $('#nextBtn').addEventListener('click', function () { goShelf(center + 1); });

  /* ---------- 键盘、滚轮、窗口 ---------- */
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'm' || k === 'M') { setMode(mode === 'prep' ? 'class' : 'prep'); return; }
    if (k === 'f' || k === 'F') { toggleFull(); return; }
    if (view === 'shelf') {
      if (k === 'ArrowRight') goShelf(center + 1);
      else if (k === 'ArrowLeft') goShelf(center - 1);
      else if (k === 'Enter') openDetail(center);
    } else if (view === 'detail') {
      if (k === 'Enter') openPage(B[curBook].pages[0]);
      else if (k === 'Escape') goShelf(curBook);
      else if (k === 'ArrowRight' && curBook < B.length - 1) openDetail(curBook + 1);
      else if (k === 'ArrowLeft' && curBook > 0) openDetail(curBook - 1);
    } else if (view === 'deck') {
      if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); step(1); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); step(-1); }
      else if (k === 'Escape') openDetail(curBook);
      else if (k === 'Home') openPage(B[curBook].pages[0]);
    }
  });
  var wheelAcc = 0, wheelT = 0;
  $('#shelf').addEventListener('wheel', function (e) {
    e.preventDefault(); wheelAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    var now = Date.now(); if (now - wheelT < 140) return;
    if (Math.abs(wheelAcc) > 50) { goShelf(center + (wheelAcc > 0 ? 1 : -1)); wheelAcc = 0; wheelT = now; }
  }, { passive: false });
  addEventListener('resize', function () { if (view === 'shelf') layout(); else if (view === 'deck') { fitDeck(); } else renderDetail(curBook); });
  document.addEventListener('fullscreenchange', fitDeck);
  addEventListener('hashchange', route);

  setMode(mode);
  if (/[?&]qa=1/.test(location.search)) {
    // 自检：逐页渲染，记下放不下的页
    show('deck'); var bad = [], errs = [];
    order.forEach(function (id) {
      try { curPage = id; renderPage(id); } catch (e) { errs.push(id + ' ' + e.message); return; }
      var be = document.querySelector('.pg-body'); if (!be || be.classList.contains('doc')) return;
      var fs = parseFloat(be.style.getPropertyValue('--fs') || '1');
      var o = false; for (var i = 0; i < be.children.length; i++) if (be.children[i].scrollHeight > be.clientHeight + 2) o = true;
      var pg = document.querySelector('.pg'); if (pg && pg.scrollHeight > pg.clientHeight + 2) o = true;
      if (o || fs < 0.75) bad.push(id + ' fs=' + fs.toFixed(2) + (o ? ' OVER' : ''));
    });
    var pre = document.createElement('pre'); pre.id = 'qa'; pre.textContent = 'QA pages=' + order.length + '\nERR ' + errs.join(' | ') + '\nTIGHT ' + bad.join(' | ');
    document.body.appendChild(pre); return;
  }
  route();
})();
