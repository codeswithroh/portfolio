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
