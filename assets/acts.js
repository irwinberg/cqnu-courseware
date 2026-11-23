/* 翻开之后几幕的动画：进入视口时播放；26 条需求的小签在“原来的六类”和“四类”之间飞；四类到三个软件的连线；数字滚动；顶栏高亮。 */
(function () {
  'use strict';
  var acts = document.getElementById('acts'); if (!acts) return;
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var EASE = 'cubic-bezier(.2,.8,.2,1)';
  var sections = $$('.act', acts), navs = $$('.top nav a[href^="#"]');

  /* 进入视口：加 .in，样式里的动画就开始 */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting && !en.target.classList.contains('in')) { en.target.classList.add('in'); countUp(en.target); } });
    }, { root: acts, threshold: .16 });
    sections.forEach(function (el) { io.observe(el); });
  } else sections.forEach(function (el) { el.classList.add('in'); });

  function countUp(scope) {
    $$('.cu', scope).forEach(function (el) {
      var to = +el.getAttribute('data-to'), t0 = performance.now() + 500;
      (function tick(now) { var p = Math.max(0, Math.min(1, (now - t0) / 1400)), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e); if (p < 1) requestAnimationFrame(tick); })(performance.now());
    });
  }

  /* ---------- 26 条：原来的六类 ⇄ 四类 ---------- */
  var needs = document.getElementById('needs'), nd = document.getElementById('nd');
  var chips = $$('.chip', nd), slots = {}, state = 'a', la = nd.querySelector('.la'), lb = nd.querySelector('.lb'), btns = $$('.sw button', needs);
  $$('.gl', nd).forEach(function (g) { slots[g.getAttribute('data-slot')] = g; });
  chips.forEach(function (c) { c.setAttribute('data-a', c.parentNode.getAttribute('data-slot')); });
  function place(v) { chips.forEach(function (c) { slots[c.getAttribute('data-' + v)].appendChild(c); }); }
  function sizeNeeds() {                               // 两种排法都量一遍，取高的，切换时下面的内容不会跳
    nd.style.minHeight = '';
    place('a'); var ha = la.offsetHeight; place('b'); var hb = lb.offsetHeight; place(state);
    nd.style.minHeight = Math.max(ha, hb) + 'px';
  }
  function setState(v, quiet) {
    if (v === state) return;
    var first = chips.map(function (c) { return c.getBoundingClientRect(); });
    state = v; place(v); nd.setAttribute('data-v', v);
    la.classList.toggle('on', v === 'a'); lb.classList.toggle('on', v === 'b');
    btns.forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); });
    if (quiet) return;
    chips.forEach(function (c, i) {
      var l = c.getBoundingClientRect(), dx = first[i].left - l.left, dy = first[i].top - l.top;
      c.getAnimations().forEach(function (a) { a.cancel(); });
      c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(' + dx * .5 + 'px,' + (dy * .5 - 26) + 'px) scale(1.06)', offset: .5 }, { transform: 'none' }], { duration: 950, delay: i * 16, easing: EASE, fill: 'backwards' });
    });
    if (v === 'b') $$('.lb .gh b', nd).forEach(function (el) {
      var to = +el.textContent || +el.getAttribute('data-n'); el.setAttribute('data-n', to); var t0 = performance.now() + 300;
      (function tick(now) { var p = Math.max(0, Math.min(1, (now - t0) / 900)); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(performance.now());
    });
  }
  function needsProgress() { var span = needs.offsetHeight - acts.clientHeight; return span > 40 ? (acts.scrollTop - needs.offsetTop) / span : -1; }
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-v'), span = needs.offsetHeight - acts.clientHeight;
      if (span > 40) acts.scrollTo({ top: needs.offsetTop + (v === 'b' ? span * .72 : 0), behavior: 'smooth' }); else setState(v);
    });
  });

  /* ---------- 五节课：换岗位，四节课的案例一起换 ---------- */
  $$('.rl button[data-r]', acts).forEach(function (b) {
    b.addEventListener('click', function () {
      var r = b.getAttribute('data-r');
      $$('.rl button[data-r], .cs3 em[data-r]', acts).forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-r') === r); });
    });
  });

  /* ---------- 玩法：点哪一步，工牌屏幕换到哪一页；不碰它就自己轮播 ---------- */
  var plis = $$('#pl li', acts), vws = $$('#scr .vw', acts), pcur = 0, pHold = 0;
  function pset(i) { pcur = i; plis.forEach(function (l, j) { l.classList.toggle('on', j === i); }); vws.forEach(function (v, j) { v.classList.toggle('on', j === i); }); }
  plis.forEach(function (l, i) { ['pointerenter', 'click'].forEach(function (ev) { l.addEventListener(ev, function () { pHold = Date.now() + 6000; pset(i); }); }); });
  setInterval(function () { var r = document.getElementById('rules'); if (plis.length && acts.offsetWidth && r.classList.contains('in') && Date.now() > pHold) pset((pcur + 1) % plis.length); }, 3200);

  /* ---------- 工牌：跟着鼠标转，不动时慢慢摆 ---------- */
  var pp = document.getElementById('pp'), pp3 = document.getElementById('pp3'), rules = document.getElementById('rules'), px = 0, py = 0, pxT = 0, pyT = 0, pOver = false;
  if (pp) {
    rules.addEventListener('pointermove', function (e) { var r = pp3.getBoundingClientRect(); pOver = true; pxT = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (innerWidth * .32))); pyT = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (innerHeight * .5))); });
    rules.addEventListener('pointerleave', function () { pOver = false; });
    (function spin(now) {
      if (acts.offsetWidth && rules.classList.contains('in')) {
        var tx = pOver ? pxT : Math.sin(now / 1900) * .55 - .15, ty = pOver ? pyT : Math.sin(now / 2700) * .25;
        px += (tx - px) * .07; py += (ty - py) * .07;
        pp.style.setProperty('--ry', (px * 34).toFixed(2) + 'deg'); pp.style.setProperty('--rx', (6 - py * 16).toFixed(2) + 'deg'); pp.style.setProperty('--gx', (50 - px * 60).toFixed(1) + '%');
      }
      requestAnimationFrame(spin);
    })(0);
  }

  /* ---------- 四类 → 三个软件的连线 ---------- */
  var map = document.getElementById('map'), svg = document.getElementById('wires');
  function wires() {
    if (!map || !map.offsetWidth) return;
    // 用排版位置算，不受进场动画的位移影响
    var h = '', n = 0, pos = function (el) { var x = 0, y = 0, e = el; while (e && e !== map) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight }; };
    var R = { width: map.offsetWidth, height: map.offsetHeight };
    $$('.tc', map).forEach(function (card) {
      var c = pos(card), from = card.getAttribute('data-from').split(' ').map(function (id) { return map.querySelector('.tn[data-t="' + id + '"]'); }).filter(Boolean).map(pos).sort(function (p1, p2) { return p1.x - p2.x; });
      from.forEach(function (t, k) {
        var x1 = t.x + t.w / 2, y1 = t.y + t.h, x2 = c.x + c.w * (from.length === 1 ? .5 : (.34 + k * .32)), y2 = c.y, ym = (y1 + y2) / 2;
        h += '<path style="--i:' + (n++) + '" d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' C' + x1.toFixed(1) + ' ' + ym.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + ym.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '"/>';
      });
    });
    svg.setAttribute('viewBox', '0 0 ' + R.width + ' ' + R.height); svg.innerHTML = h;
    $$('path', svg).forEach(function (p) { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 'px'); });
  }

  /* ---------- 滚动：重排的时机、顶栏高亮 ---------- */
  var ticking = false;
  function onScroll() {
    ticking = false;
    var p = needsProgress(); if (p > -1) setState(p > .42 ? 'b' : 'a');
    var y = acts.scrollTop + acts.clientHeight * .4, cur = '';
    sections.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
    navs.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur); });
  }
  acts.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  function layout() { if (!acts.offsetWidth) return; sizeNeeds(); wires(); onScroll(); }
  window.addEventListener('acts:open', function () { requestAnimationFrame(layout); });
  window.addEventListener('acts:close', function () { navs.forEach(function (a) { a.classList.remove('on'); }); });
  window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
})();
