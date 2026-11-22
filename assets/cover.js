/* 封面：弧形书架 → 停在立体的《AI 新篇》→ 掀开封面进入后面几幕。
   页面不滚动。滚轮、触控板、方向键的一次手势走一步：
     书架上：一步翻一卷（q=0）→ 最后一卷再走一步：其他书退场，《AI 新篇》移到右边（q=1）
     → 再走一步：封面掀开，镜头推进到内页（q=2），后面几幕（#acts）出现，在它自己里面滚动。
   往回同理。书架的几何照 "Leon Vasari: Curved VHS Archive" 的说明。 */
(function () {
  'use strict';
  var D = window.SHELF, V = D.vols, N = V.length, COPIES = 3, M = N * COPIES, P = 1400, LAST = N - 1;
  var $ = function (s) { return document.querySelector(s); };
  var stage = $('#stage'), shelf = $('#shelf'), probe = $('#probe'), play = $('#play'), dot = $('#dot'), tl = $('#tl'), floor = $('#floor');
  var tp = $('#tp'), acts = $('#acts'), cursor = $('#cursor'), topbar = $('.top'), root = document.documentElement;
  var EASE = 'cubic-bezier(.2,.8,.2,1)';
  var mod = function (a, n) { return ((a % n) + n) % n; };
  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var sm = function (x) { return x * x * (3 - 2 * x); };
  var eio = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var vlen = function (s) { var n = 0; for (var i = 0; i < s.length; i++) n += s[i] === ' ' ? .3 : /[\x00-\xff]/.test(s[i]) ? .6 : 1; return n; };
  var IMG = function (v) { return 'img/shelf/' + v.id + '.jpg'; };

  /* ---------- 书 ---------- */
  function coverHTML(v) {
    var fs = Math.min(13.5, 42 / vlen(v.title));
    return '<i class="art" style="background-image:url(' + IMG(v) + ')"></i>' +
      '<div class="cvt"><small>重庆师范大学 · ' + (v.course ? v.cn : '校史') + '</small><b style="font-size:' + fs.toFixed(2) + 'em">' + esc(v.title) + '</b></div>' +
      '<span class="bdg">' + v.year + '</span><i class="wear"></i><i class="edge"></i>';
  }
  function spineHTML(v) {
    var t = v.title.replace(/\s/g, ''), fs = Math.min(8.4, 56 / (vlen(t) * 1.06));
    return '<i class="pic" style="background-image:url(' + IMG(v) + ');background-position:' + (v.pos || '50% 80%') + '"></i>' +
      '<b class="ttl"><span style="font-size:' + fs.toFixed(2) + 'em">' + esc(t) + '</span></b><small>CQNU</small><span class="yr">' + v.year + '</span><i class="wear"></i><i class="lit"></i>';
  }
  var tapes = [];
  for (var c = 0; c < COPIES; c++) V.forEach(function (v, i) {
    var el = document.createElement('div'); el.className = 'tape' + (v.course ? ' crs' : '');
    el.style.setProperty('--c', v.c); el.style.setProperty('--k', v.k);
    el.innerHTML = '<div class="sp">' + spineHTML(v) + '</div><div class="cv">' + coverHTML(v) + '</div><div class="bk"><i class="art" style="background-image:url(' + IMG(v) + ')"></i><i class="wear"></i></div>';
    stage.appendChild(el);
    var t = { el: el, sp: el.children[0], cv: el.children[1], bk: el.children[2], v: c * N + i, i: i, lift: 0, hover: false, shown: true };
    el.addEventListener('pointerenter', function () { t.hover = true; });
    el.addEventListener('pointerleave', function () { t.hover = false; });
    el.addEventListener('click', function () {
      if (dragMoved || q !== 0) return;
      if (Math.abs(rel(t.v, s)) < .5) { if (t.i === LAST) gesture(1); }             // 只有《AI 新篇》能翻开
      else setIdx(t.i);
    });
    tapes.push(t);
  });
  V.forEach(function (v) { new Image().src = IMG(v); });

  /* 立体的《AI 新篇》：和书架上那本同样大小、同一位置，退场时接替它 */
  var vL = V[LAST], hb = document.createElement('div'); hb.className = 'hb crs'; hb.id = 'hb';
  hb.style.setProperty('--c', vL.c); hb.style.setProperty('--k', vL.k);
  hb.innerHTML = '<div class="hf hback"><i class="wear"></i></div><div class="hsp">' + spineHTML(vL) + '</div><div class="hfore"></div><div class="htop"></div><div class="hbot"></div>' +
    '<div class="hf hpage"><div class="tpg"><b>AI 新篇</b><u></u><span>AI 应用实战培训</span><div class="tlg"><img src="img/brand/cqnu-ink.png" alt="重庆师范大学"><i>×</i><img src="img/brand/qieman.png" alt="且曼学院"></div><em>二〇二六</em></div></div><div class="hcv"><div class="hfront">' + coverHTML(vL) + '</div><div class="hinside"></div></div>';
  stage.appendChild(hb);
  var hcv = hb.querySelector('.hcv'), hpage = hb.querySelector('.hpage');
  hb.addEventListener('click', function () { if (q === 1) gesture(1); });
  var RV = (function () {
    var w = 56, h = 96, T = new Float32Array(w * h), cv = document.createElement('canvas'), cx2, img, last = -1;
    cv.width = w; cv.height = h; cx2 = cv.getContext('2d'); img = cx2.createImageData(w, h);
    function grid(gx, gy) { var g = []; for (var i = 0; i < (gx + 1) * (gy + 1); i++) g.push(Math.random()); return function (u, v) { var x = u * gx, y = v * gy, x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); var a = g[y0 * (gx + 1) + x0], b = g[y0 * (gx + 1) + x0 + 1], c = g[(y0 + 1) * (gx + 1) + x0], d2 = g[(y0 + 1) * (gx + 1) + x0 + 1]; return a + (b - a) * fx + (c - a) * fy + (a - b - c + d2) * fx * fy; }; }
    var n1 = grid(5, 8), n2 = grid(14, 24);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) T[y * w + x] = .56 * (y / h) + .3 * n1(x / w, y / h) + .1 * n2(x / w, y / h) + .04 * Math.random();
    var faces = [].slice.call(hb.querySelectorAll('.hback,.hsp,.hfore,.hpage,.hfront,.hinside')), tb = [hb.querySelector('.htop'), hb.querySelector('.hbot')];
    return function (r) {
      r = Math.round(r * 60) / 60; if (r === last) return; last = r;
      var url = '';
      if (r < 1) { var d = img.data; for (var i = 0; i < w * h; i++) { d[i * 4 + 3] = Math.max(0, Math.min(255, (r * 1.04 - T[i]) * 5200)); } cx2.putImageData(img, 0, 0); url = 'url(' + cv.toDataURL() + ')'; }
      faces.forEach(function (f) { f.style.webkitMaskImage = f.style.maskImage = url; f.style.webkitMaskSize = f.style.maskSize = url ? '100% 100%' : ''; });
      tb[0].style.visibility = r > .12 ? '' : 'hidden'; tb[1].style.visibility = r > .97 ? '' : 'hidden';
    };
  })();
  /* 点封面翻开：按位置判断，不靠命中哪个元素（立体变换之后，中间那本和右边那本有时点不中） */
  function inCover(x, y) { return q === 0 && idx === LAST && Math.abs(T - s) < .3 && Math.abs(x - W / 2) < .5 * d && Math.abs(y - cy) < .5 * H; }
  function inHero(x, y) { return q === 1 && qT === 1 && Math.abs(x - (W / 2 + W * .2)) < d * .8 && Math.abs(y - cy) < H * .75; }
  document.addEventListener('click', function (e) {
    if (opened || dragMoved || (e.target.closest && e.target.closest('a,button,.tl,.top'))) return;
    if (inCover(e.clientX, e.clientY) || inHero(e.clientX, e.clientY)) { e.stopPropagation(); gesture(1); }
  }, true);

  /* ---------- 尺寸 ---------- */
  var W, VH, H, ws, d, gap, U, XS = [], cy = 0, ZOOM = 7;
  function measure() {
    W = innerWidth; VH = innerHeight; H = probe.getBoundingClientRect().height;
    ws = H * 142 / 840; d = H * 474 / 900; gap = H * .035; U = H * (W < 768 ? 1.05 : 1.3);
    stage.style.setProperty('--ws', ws + 'px'); stage.style.setProperty('--d', d + 'px'); stage.style.fontSize = (H / 100) + 'px';
    XS = [0]; var acc = 0; for (var u = 0; u <= 3 * U; u += 2) { acc += 2 / (1 + Math.pow(u / U, 1.6)); XS.push(acc); }
    var r = shelf.getBoundingClientRect(); cy = r.top + r.height / 2;
    play.style.left = (W / 2 - d / 2 - 6 - 21) + 'px'; play.style.top = (cy + .36 * H - 21) + 'px';
    var tr = $('.mt').getBoundingClientRect(), ay = (tr.top + tr.height / 2) + 'px';
    $('#prev').style.top = ay; $('#next').style.top = ay;
    ZOOM = Math.max(W / d, VH / H) * 1.25;
  }
  function rel(v, s0) { var r = mod(v - s0, M); return r >= M / 2 ? r - M : r; }
  function Bf(r) { return Math.abs(r) < 1 ? (r + Math.sin(Math.PI * r) / Math.PI) / 2 : (r > 0 ? .5 : -.5); }
  function F(r) { return r * (ws + gap) + (d - ws + 1.4 * gap) * Bf(r); }
  function xsc(u) { var a = Math.abs(u) / 2, i = Math.min(XS.length - 2, Math.floor(a)), f = Math.min(1, a - i); return (u < 0 ? -1 : 1) * (XS[i] + (XS[i + 1] - XS[i]) * f); }

  /* ---------- 状态 ---------- */
  var idx = 0, s = N, T = N, active = -1, q = 0, qT = 0, want1 = false, pendingId = '', opened = false;
  var dragging = false, dragMoved = false, mx = innerWidth / 2, my = innerHeight / 2, tiltX = 0, tiltY = 0, dotYear = V[0].year, cx = mx, cyy = my, last = 0, lastA = -1;
  function setIdx(i) { idx = Math.max(0, Math.min(LAST, i)); T = N + idx; }
  function busy() { return q !== qT || want1; }
  function gesture(dir) {
    if (busy()) return;
    if (q === 0) { if (dir > 0) { if (idx < LAST) setIdx(idx + 1); else want1 = true; } else setIdx(idx - 1); }
    else if (q === 1) qT = dir > 0 ? 2 : 0;
    else if (q === 2 && dir < 0 && acts.scrollTop <= 0) leaveActs(1);
  }
  function enterActs() {
    opened = true; document.body.classList.add('opened'); topbar.classList.add('solid'); hb.classList.remove('on');
    var el = pendingId && document.getElementById(pendingId); pendingId = '';
    acts.scrollTop = el ? el.offsetTop : 0;
    try { acts.focus({ preventScroll: true }); } catch (e) {}
    window.dispatchEvent(new Event('acts:open'));
  }
  function leaveActs(to) { opened = false; document.body.classList.remove('opened'); topbar.classList.remove('solid'); qT = to; window.dispatchEvent(new Event('acts:close')); }

  /* ---------- 题名：遮罩滑动 ---------- */
  var masks = { t: $('.mt'), s: $('.ms'), y: $('.my') };
  function swap(mask, html, dir, delay) {
    [].forEach.call(mask.children, function (old) {
      var from = getComputedStyle(old).transform;
      old.getAnimations().forEach(function (a) { a.cancel(); });
      old.animate([{ transform: from === 'none' ? 'translateY(0)' : from }, { transform: 'translateY(' + (-dir * 105) + '%)' }], { duration: 650, easing: EASE, fill: 'forwards' }).onfinish = function () { old.remove(); };
    });
    var n = document.createElement('span'); n.innerHTML = html; mask.appendChild(n);
    n.animate([{ transform: 'translateY(' + (dir * 105) + '%)' }, { transform: 'translateY(0)' }], { duration: 650, delay: delay || 0, easing: EASE, fill: 'backwards' });
  }
  function caption(i, dir) {
    var v = V[i];
    swap(masks.t, esc(v.title), dir, 0);
    swap(masks.s, esc(v.cn + ' / ' + v.era), dir, 40);
    swap(masks.y, v.year + ' — ' + (v.course ? '课程 · 5 天' : '校史'), dir, 80);
  }

  /* ---------- 时间轴 ---------- */
  (function () {
    var h = '', span = D.y1 - D.y0;
    for (var y = D.y0; y <= D.y1; y++) {
      var maj = y % 10 === 0, x = (y - D.y0) / span * 100;
      h += '<i class="tk' + (maj ? ' maj' : '') + '" style="left:' + x + '%"></i>';
      if (maj) h += '<span class="yl' + (y === D.y0 ? ' first' : y === D.y1 ? ' last' : '') + '" style="left:' + x + '%">' + y + '</span>';
    }
    tl.insertAdjacentHTML('beforeend', h);
    tl.addEventListener('click', function (e) {
      if (q !== 0) return;
      var r = tl.getBoundingClientRect(), yr = D.y0 + (e.clientX - r.left) / r.width * span, best = 0;
      V.forEach(function (v, i) { if (Math.abs(v.year - yr) < Math.abs(V[best].year - yr)) best = i; });
      setIdx(best);
    });
  })();

  /* ---------- 每一帧 ---------- */
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
    s += (T - s) * (1 - Math.exp(-(dragging ? 18 : 5.2) * dt));
    if (want1 && Math.abs(T - s) < .02) { want1 = false; qT = 1; }
    if (q !== qT) {                                   // 两段过场都按时间走，不跟滚动速度
      var dur = Math.min(q, qT) < 1 ? 1.5 : 1.9, stp = dt / dur;
      q = qT > q ? Math.min(qT, q + stp) : Math.max(qT, q - stp);
      if (q === 2) enterActs();
    }
    var a = eio(clamp(q)), b = clamp(q - 1), co = eio(clamp(b / .5)) * 172, zb = eio(clamp((b - .4) / .6));
    if (a !== lastA) { root.style.setProperty('--a', a.toFixed(4)); lastA = a; }
    tp.classList.toggle('in', q > .62 && q < 1.12);

    var act = mod(Math.round(s), N);
    if (act !== active) { caption(act, active < 0 ? 1 : (T - s >= 0 ? 1 : -1)); active = act; }

    var settled = Math.abs(T - s) < .3 && q === 0;
    var onCover = settled && Math.abs(mx - W / 2) < .55 * d && Math.abs(my - cy) < .55 * H;
    var ty = onCover ? (mx - W / 2) / (.55 * d) * 8 : (mx - W / 2) / W * 4, tx = onCover ? -(my - cy) / (H / 2) * 5 : 0, ke = 1 - Math.exp(-7 * dt);
    tiltY += (ty - tiltY) * ke; tiltX += (tx - tiltX) * ke;

    var heroOn = q > 0 && q < 2;
    if (heroOn !== hb.classList.contains('on')) hb.classList.toggle('on', heroOn);
    for (var n = 0; n < tapes.length; n++) {
      var t = tapes[n], r = rel(t.v, s), ar = Math.abs(r), o = sm(Math.max(0, 1 - ar)), u = F(r), au = Math.abs(u);
      if (q > 0 && ar < .5 && a < .4) t.cv.style.opacity = (1 - a / .4).toFixed(3); else if (t.cv.style.opacity) t.cv.style.opacity = '';   // 透明度加在封面那一面上；加在整本上会把立体压扁
      if (au > U * 1.95 || a >= .999 || (q > 0 && ar < .5 && a >= .4)) { if (t.shown) { t.el.style.display = 'none'; t.shown = false; t.hover = false; } continue; }
      if (!t.shown) { t.el.style.display = ''; t.shown = true; }
      t.lift += ((t.hover && ar > .5 && !dragging && q === 0 ? 1 : 0) - t.lift) * (1 - Math.exp(-12 * dt));
      var sc = 1 / (1 + Math.pow(au / U, 1.6)), k = 1 / sc, dir = r < 0 ? -1 : 1;
      var z = P * (1 - k) + o * H * .1 - a * 260, x = (xsc(u) + dir * a * W * .72) * k, y = (H * .5 * (1 - sc) * .42 + o * H * .012 - t.lift * H * .05) * k;
      var ry = (u < 0 ? -1 : 1) * Math.min(1, au / U) * 26 * (1 - o) - 90 * o + tiltY * o + dir * a * 18;
      t.el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,' + z.toFixed(2) + 'px) rotateX(' + (tiltX * o).toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      t.el.style.zIndex = Math.round(3000 + z);
      t.sp.style.setProperty('--shade', Math.min(.6, o * .55 + (1 - sc) * .32).toFixed(3));
      t.cv.style.setProperty('--shade', ((1 - o) * .82).toFixed(3));
      t.bk.style.setProperty('--shade', (.62 + (1 - sc) * .2).toFixed(3));
    }

    /* 《AI 新篇》：a 段移到右边、转出厚度；b 段掀开封面、推进到内页 */
    var hx = lerp(0, W * .2, a) * (1 - zb), hy = lerp(H * .012, H * .09, a) * (1 - zb), hs = lerp(lerp(1, 1.3, a), ZOOM, zb);
    if (heroOn) {
      RV(q >= 1 ? 1 : clamp((a - .12) / .88));
      var bob = Math.sin(now / 1100) * a * (1 - clamp(b * 4));
      var hry = (tiltY * (1 - a) + (-30 + (mx - W / 2) / W * 14 + bob * 1.6) * a) * (1 - zb), hrx = (tiltX * (1 - a) + (5 - (my - VH / 2) / VH * 8) * a) * (1 - zb);
      hb.style.transform = 'translate3d(' + hx.toFixed(2) + 'px,' + (hy + bob * 3).toFixed(2) + 'px,' + (H * .1).toFixed(2) + 'px) rotateX(' + hrx.toFixed(2) + 'deg) rotateY(' + hry.toFixed(2) + 'deg) scale(' + hs.toFixed(4) + ')';
      hcv.style.setProperty('--co', co.toFixed(2)); hpage.style.setProperty('--fold', (1 - zb).toFixed(3));
    }
    floor.style.transform = 'translate(' + (hx * 1.03).toFixed(1) + 'px,' + (a * H * .25).toFixed(1) + 'px) scale(' + (lerp(1, .5, a) * (1 - eio(clamp(b * 2.2)))).toFixed(3) + ')';
    play.style.transform = 'scale(' + (q > 0 || active !== LAST ? 0 : sm(Math.max(0, 1 - Math.abs(T - s) * 3))).toFixed(3) + ')';

    var f = Math.floor(s), fr = s - f, a0 = mod(f, N), a1 = mod(f + 1, N), wrap = a1 < a0;
    var yt = wrap ? (fr < .5 ? V[a0].year : V[a1].year) : V[a0].year + (V[a1].year - V[a0].year) * fr;
    if (wrap && Math.abs(yt - dotYear) > 6) dotYear = yt; else dotYear += (yt - dotYear) * (1 - Math.exp(-14 * dt));
    dot.style.left = ((dotYear - D.y0) / (D.y1 - D.y0) * 100).toFixed(3) + '%';

    if (curOn) {
      var kc = 1 - Math.exp(-16 * dt); cx += (mx - cx) * kc; cyy += (my - cyy) * kc;
      cursor.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cyy.toFixed(1) + 'px,0)';
      var cls = 'cursor' + (hoverBtn ? ' btn' : !opened && (inCover(mx, my) || inHero(mx, my)) ? ' open' : hoverTape ? ' spine' : '') + (hoverDark ? ' inv' : '');
      if (cursor.className !== cls) cursor.className = cls;
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 输入：一次手势走一步 ---------- */
  var curOn = matchMedia('(pointer:fine)').matches, hoverBtn = false, hoverTape = false, hoverDark = false;
  if (curOn) document.body.classList.add('cur');
  addEventListener('pointermove', function (e) {
    mx = e.clientX; my = e.clientY;
    var el = e.target, cl = function (sel) { return !!(el.closest && el.closest(sel)); };
    hoverBtn = cl('a,button,.tl,label,input,.mccol.r .xn,.ck.wait'); hoverTape = q === 0 && cl('.tape'); hoverDark = cl('.dark');
    if (dragging) { var dx = e.clientX - dragX; if (Math.abs(dx) > 5) dragMoved = true; if (dragMoved) T = N + Math.max(0, Math.min(LAST, dragI - dx / (ws + gap))); }
  });
  var dragX = 0, dragI = 0;
  shelf.addEventListener('pointerdown', function (e) { if (q !== 0 || e.button) return; dragging = true; dragMoved = false; dragX = e.clientX; dragI = idx; });
  addEventListener('pointerup', function () { if (!dragging) return; dragging = false; if (dragMoved) { setIdx(Math.round(T - N)); setTimeout(function () { dragMoved = false; }, 0); } });

  var lock = 0, lastT = 0, lastAbs = 0;
  addEventListener('wheel', function (e) {
    var dl = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (opened && !(acts.scrollTop <= 0 && dl < 0)) return;                 // 后面几幕里正常滚动
    e.preventDefault();
    var now = performance.now(), ab = Math.abs(dl), fresh = now - lastT > 160 || ab > lastAbs * 1.7 + 6; lastT = now; lastAbs = ab;   // 惯性滚动的余波不算新手势
    if (now < lock || ab < 4 || !fresh) return;
    lock = now + (q === 0 && idx < LAST ? 380 : 750);
    gesture(dl > 0 ? 1 : -1);
  }, { passive: false });
  var tY = 0, tX = 0;
  addEventListener('touchstart', function (e) { tY = e.touches[0].clientY; tX = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', function (e) {
    var dy = tY - e.changedTouches[0].clientY, dx = tX - e.changedTouches[0].clientX;
    if (opened) { if (acts.scrollTop <= 0 && dy < -70) gesture(-1); return; }
    if (dragMoved) return;
    if (Math.abs(dy) > 44 && Math.abs(dy) > Math.abs(dx)) gesture(dy > 0 ? 1 : -1);
  }, { passive: true });
  $('#prev').addEventListener('click', function () { gesture(-1); });
  $('#next').addEventListener('click', function () { gesture(1); });
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (opened) { if (k === 'Escape' || ((k === 'ArrowUp' || k === 'PageUp') && acts.scrollTop <= 0)) leaveActs(1); return; }
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); gesture(1); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'Escape') { e.preventDefault(); gesture(-1); }
    else if (k === 'Home' && q === 0) setIdx(0);
    else if (k === 'End' && q === 0) setIdx(LAST);
  });

  /* 顶栏的链接：直接到某一幕 */
  function goHash(h, instant) {
    if (!h || h === 'top') { if (opened) leaveActs(0); else if (!busy() || q > 0) qT = 0; if (instant) { q = qT = 0; } return; }
    if (h === 'course') { if (opened) leaveActs(1); else if (instant) { setIdx(LAST); s = T; q = qT = 1; } else { setIdx(LAST); want1 = q === 0; if (q > 1) qT = 1; } return; }
    var el = document.getElementById(h); if (!el) return;
    if (opened) { acts.scrollTo({ top: el.offsetTop, behavior: 'smooth' }); return; }
    pendingId = h; setIdx(LAST);
    if (instant) { s = T; q = qT = 2; enterActs(); } else { if (q === 0) { s = T; q = .001; } qT = 2; want1 = false; }
  }
  [].forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); goHash(a.getAttribute('href').slice(1)); });
  });

  /* ---------- 两侧大字：由一格一格的代码字符拼成。平时很淡，偶尔有字符被改写（像在写代码）；鼠标靠近的那一片变亮、乱码加快 ---------- */
  var KJ = [].map.call(document.querySelectorAll('canvas.kanji'), function (cv) { return { cv: cv, txt: cv.getAttribute('data-t'), right: cv.classList.contains('kr'), cs: [] }; });
  var KCH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]()<>=+-*/;:#$&_01234567890101', KFONT = 'ui-monospace,"SF Mono",Menlo,Consolas,monospace';
  var kch = function () { return KCH[(Math.random() * KCH.length) | 0]; };
  function buildKanji() {
    var dpr = Math.min(2, window.devicePixelRatio || 1), S = Math.min(innerHeight * .19, innerWidth * .125), fs = Math.max(6, Math.min(9, S / 25)), cw = fs * .62, ch = fs * .98, pad = 8;
    KJ.forEach(function (k) {
      var n = k.txt.length, w = Math.ceil(S + pad * 2), h = Math.ceil(S * 1.02 * n + pad * 2), cv = k.cv;
      cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px';
      k.top = innerHeight * (k.right ? .09 : .13) - pad; k.left = k.right ? innerWidth - innerWidth * .024 + pad - w : innerWidth * .024 - pad;
      cv.style.top = k.top + 'px'; cv.style.left = k.left + 'px'; cv.style.right = 'auto';
      var off = document.createElement('canvas'); off.width = w; off.height = h; var c = off.getContext('2d');
      c.font = '800 ' + S + 'px "CQ Big","PingFang SC","Microsoft YaHei",sans-serif'; c.textBaseline = 'top'; c.textAlign = 'center'; c.fillStyle = '#000';
      for (var i = 0; i < n; i++) c.fillText(k.txt[i], w / 2, pad + i * S * 1.02 + S * .06);
      var d = c.getImageData(0, 0, w, h).data, cs = [];
      for (var y = ch / 2; y < h; y += ch) for (var x = cw / 2; x < w; x += cw) {
        if (d[((y | 0) * w + (x | 0)) * 4 + 3] < 128) continue;
        cs.push({ x: x, y: y, c: kch(), heat: 0, ph: Math.random() * 6.28, sp: .5 + Math.random() * 1.2 });
      }
      k.cs = cs; k.off = off; k.dpr = dpr; k.w = w; k.h = h; k.fs = fs; k.wr = 0;
    });
    drawKanji(performance.now());
  }
  var kjLast = 0, KR = 130;
  function drawKanji(now) {
    var t = now / 1000;
    KJ.forEach(function (k) {
      var c = k.cv.getContext('2d'), cs = k.cs, n = cs.length; if (!n) return;
      c.setTransform(k.dpr, 0, 0, k.dpr, 0, 0); c.clearRect(0, 0, k.w, k.h);
      c.font = '700 ' + k.fs + 'px ' + KFONT; c.textAlign = 'center'; c.textBaseline = 'middle';
      var px = mx - k.left, py = my - k.top, near = !opened && q < .5 && px > -KR && px < k.w + KR && py > -KR && py < k.h + KR;
      for (var j = 0; j < 5; j++) { var e = cs[(k.wr++) % n]; e.c = kch(); e.heat = 1; }        // 一个“光标”顺着往下写
      for (var i = 0; i < n; i++) {
        var p = cs[i], al = .3 * (.84 + .16 * Math.sin(t * p.sp + p.ph)) * (.86 + .2 * Math.sin(p.y * .02 - t * .6 + p.x * .01));
        if (near) { var dx = p.x - px, dy = p.y - py, f = 1 - (dx * dx + dy * dy) / (KR * KR); if (f > 0) { f *= f; al += (1 - al) * f; if (Math.random() < f * .25) { p.c = kch(); if (Math.random() < .3) p.heat = 1; } } }
        var hot = p.heat > .12;                                                    // 刚被改写的字符：黄色，慢慢退回去
        if (p.heat > 0) p.heat -= .06; else if (Math.random() < .004) { p.c = kch(); p.heat = .8; }
        c.fillStyle = hot ? 'rgba(240,176,0,' + Math.min(1, .45 + p.heat * .6).toFixed(3) + ')' : 'rgba(17,17,17,' + Math.min(1, al).toFixed(3) + ')';
        c.fillText(p.c, p.x, p.y);
      }
    });
  }
  (function kjLoop(now) { if (KJ.length && !opened && lastA < .999 && now - kjLast > 55) { kjLast = now; drawKanji(now); } requestAnimationFrame(kjLoop); })(0);
  if (document.fonts && document.fonts.load) document.fonts.load('800 100px "CQ Big"', '校史续新篇').then(buildKanji, buildKanji); else buildKanji();
  addEventListener('resize', buildKanji);

  addEventListener('resize', measure);
  function boot() {
    measure();
    var hsh = decodeURIComponent(location.hash.slice(1));
    if (hsh) goHash(hsh, true);
    dotYear = V[mod(Math.round(s), N)].year;
    requestAnimationFrame(function (t) { last = t; frame(t); });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot); else boot();
})();
