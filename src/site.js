(function () {
  var d = document, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduce) {
    d.documentElement.classList.add('js');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    d.querySelectorAll('[data-r]').forEach(function (el) { io.observe(el); });
  }

  // Cards rise out of the pocket as the page scrolls.
  var pocket = d.querySelector('.pocket');
  if (pocket && !reduce) {
    var cards = pocket.querySelectorAll('.card'), tick = false;
    addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var y = Math.min(scrollY, 500);
        cards.forEach(function (c, i) { c.style.setProperty('--lift', -(y * (.05 + (i % 3) * .035)).toFixed(1) + 'px'); });
        tick = false;
      });
    }, { passive: true });
  }

  // Headline roles rotate; all three stay in the DOM for search and screen readers.
  var roles = d.querySelectorAll('.roles b');
  if (roles.length && !reduce) {
    var ri = 0;
    setInterval(function () { roles[ri].classList.remove('on'); ri = (ri + 1) % roles.length; roles[ri].classList.add('on'); }, 2600);
  }

  // Count numbers up the first time they appear. The real value is already in the HTML.
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, n = +el.dataset.n, suf = el.dataset.s || '', t0 = performance.now();
        (function f(t) {
          var k = Math.min((t - t0) / 1100, 1), v = Math.round(n * (1 - Math.pow(1 - k, 3)));
          el.textContent = v + suf; if (k < 1) requestAnimationFrame(f);
        })(t0);
      });
    }, { threshold: .6 });
    d.querySelectorAll('[data-n]').forEach(function (el) { cio.observe(el); });
  }

  // Buttons lean toward the cursor a little.
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    d.querySelectorAll('.btn,.nav a.cta').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .14).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .22).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  // Skill pills: real physics, loaded only when the tile is close to the viewport.
  var box = d.querySelector('.pills');
  if (box && !reduce && 'IntersectionObserver' in window) {
    var near = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; near.disconnect();
      var s = d.createElement('script'); s.src = '/assets/vendor/matter.min.js';
      s.onload = function () { (d.fonts ? d.fonts.ready : Promise.resolve()).then(function () { physics(box); }); };
      d.body.appendChild(s);
    }, { rootMargin: '300px' });
    near.observe(box);
  }

  function physics(box) {
    var M = window.Matter, C = M.Composite, B = M.Bodies, Body = M.Body, Sl = M.Sleeping;
    var eng = M.Engine.create({ enableSleeping: true }), W = 0, H = 0, walls = [], drag = null, on = false;
    eng.gravity.y = 1;
    var fit = function () {
      W = box.clientWidth; H = box.clientHeight;
      if (walls.length) C.remove(eng.world, walls);
      var o = { isStatic: true, friction: .5 }, t = 80;
      walls = [B.rectangle(W / 2, H + t / 2, W + 2 * t, t, o), B.rectangle(-t / 2, H / 2 - 500, t, H + 1200, o), B.rectangle(W + t / 2, H / 2 - 500, t, H + 1200, o)];
      C.add(eng.world, walls);
    };
    var pills = [].map.call(box.children, function (el, i) { return { el: el, w: el.offsetWidth, h: el.offsetHeight, i: i }; });
    box.classList.add('live'); fit();
    pills.forEach(function (p) {
      p.b = B.rectangle(p.w / 2 + Math.random() * Math.max(W - p.w, 1), -50 - p.i * 46, p.w, p.h, { chamfer: { radius: p.h / 2 - 1 }, restitution: .42, friction: .25, frictionAir: .012, angle: (Math.random() - .5) * .7 });
      p.el.addEventListener('pointerdown', function (e) {
        e.preventDefault(); p.el.setPointerCapture(e.pointerId);
        var r = box.getBoundingClientRect();
        Sl.set(p.b, false);
        drag = M.Constraint.create({ pointA: { x: e.clientX - r.left, y: e.clientY - r.top }, bodyB: p.b, pointB: { x: 0, y: 0 }, stiffness: .1, damping: .12, length: 0 });
        C.add(eng.world, drag);
      });
      p.el.addEventListener('pointermove', function (e) {
        if (!drag || drag.bodyB !== p.b) return;
        var r = box.getBoundingClientRect(); drag.pointA.x = e.clientX - r.left; drag.pointA.y = e.clientY - r.top;
      });
      var up = function () {
        if (!drag) return; C.remove(eng.world, drag); drag = null;
        var v = p.b.velocity, m = 14; Body.setVelocity(p.b, { x: Math.max(-m, Math.min(m, v.x)), y: Math.max(-m, Math.min(m, v.y)) });
      };
      p.el.addEventListener('pointerup', up); p.el.addEventListener('pointercancel', up);
    });
    C.add(eng.world, pills.map(function (p) { return p.b; }));

    // A passing cursor nudges whatever it brushes.
    box.parentNode.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || drag) return;
      var r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      pills.forEach(function (p) {
        var dx = p.b.position.x - x, dy = p.b.position.y - y, q = Math.hypot(dx, dy);
        if (q < 74 && q > 1) { Sl.set(p.b, false); Body.applyForce(p.b, p.b.position, { x: dx / q * .0016 * p.b.mass, y: (dy / q - .6) * .0016 * p.b.mass }); }
      });
    });
    if ('ResizeObserver' in window) new ResizeObserver(function () { if (box.clientWidth !== W || box.clientHeight !== H) { fit(); pills.forEach(function (p) { Sl.set(p.b, false); }); } }).observe(box);

    var loop = function () {
      if (!on) return;
      M.Engine.update(eng, 1000 / 60);
      pills.forEach(function (p) {
        if (p.b.position.x < -60 || p.b.position.x > W + 60 || p.b.position.y > H + 60) Body.setPosition(p.b, { x: W / 2, y: -40 });
        if (p.b.position.y < -200 && p.b.velocity.y < 0) Body.setVelocity(p.b, { x: p.b.velocity.x, y: 0 });
        p.el.style.transform = 'translate(' + (p.b.position.x - p.w / 2).toFixed(1) + 'px,' + (p.b.position.y - p.h / 2).toFixed(1) + 'px) rotate(' + p.b.angle.toFixed(3) + 'rad)';
      });
      requestAnimationFrame(loop);
    };
    new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !on) { on = true; requestAnimationFrame(loop); } else if (!v) on = false; }).observe(box);
  }

  var clock = d.getElementById('clock');
  if (clock) {
    var fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
    var t = function () { clock.textContent = fmt.format(new Date()) + ' IST'; };
    t(); setInterval(t, 30000);
  }

  var chips = d.querySelectorAll('.chips button');
  if (chips.length) {
    var pick = function (cat) {
      chips.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.c === cat); });
      d.querySelectorAll('.pcard').forEach(function (c) { c.hidden = cat !== 'all' && c.dataset.c !== cat; });
    };
    chips.forEach(function (b) { b.addEventListener('click', function () { pick(b.dataset.c); history.replaceState(null, '', b.dataset.c === 'all' ? location.pathname : '#' + b.dataset.c); }); });
    var h = location.hash.slice(1);
    if (h && d.querySelector('.chips [data-c="' + h + '"]')) pick(h);
  }

  var tweets = d.querySelectorAll('.twitter-tweet');
  if (tweets.length && 'IntersectionObserver' in window) {
    var load = new IntersectionObserver(function (es) {
      if (!es.some(function (e) { return e.isIntersecting; })) return;
      load.disconnect();
      var s = d.createElement('script'); s.src = 'https://platform.twitter.com/widgets.js'; s.async = true; d.body.appendChild(s);
    }, { rootMargin: '400px' });
    tweets.forEach(function (t) { load.observe(t); });
  }
})();
