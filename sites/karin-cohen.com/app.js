/* Hofit Yehezkel Cosmetics — interactions */
(function () {
  'use strict';

  /* ---- sticky nav shadow ---- */
  var nav = document.querySelector('.nav');
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 16);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile drawer ---- */
  var drawer = document.getElementById('drawer');
  var openBtn = document.getElementById('navToggle');
  var closeBtn = document.getElementById('drawerClose');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (openBtn) openBtn.addEventListener('click', function () { setDrawer(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
  if (drawer) {
    drawer.querySelectorAll('[data-close]').forEach(function (a) {
      a.addEventListener('click', function () { setDrawer(false); });
    });
  }

  /* ---- course tabs ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab[role="tab"]'));
  function selectTab(i) {
    tabs.forEach(function (tab, idx) {
      var selected = idx === i;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      var panel = document.getElementById('panel-' + idx);
      if (panel) {
        panel.hidden = !selected;
        if (selected) {
          panel.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
        }
      }
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(i); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var dir = e.key === 'ArrowRight' ? 1 : -1;
        var next = (i + dir + tabs.length) % tabs.length;
        tabs[next].focus();
        selectTab(next);
      }
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    });
  });

  /* ---- booking form → Aiterra CRM ---- */
  var LEAD_ENDPOINT = 'https://aiterra.agency/api/site-leads/submit';
  var LEAD_TOKEN = 'a74d0846-9303-491d-9816-ff13d723d26d';

  var bookForm = document.getElementById('bookForm');
  if (bookForm) {
    var ok = document.getElementById('formOk');
    var okHtml = ok ? ok.innerHTML : '';

    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!bookForm.checkValidity()) { bookForm.reportValidity(); return; }

      var val = function (n) {
        var el = bookForm.querySelector('[name="' + n + '"]');
        return el && el.value ? el.value.trim() : '';
      };
      var name = val('name');
      var phone = val('phone');
      var email = val('email');
      var intent = val('intent');
      var note = val('message');
      var message = intent ? ('מעוניינת ב: ' + intent + (note ? ' — ' + note : '')) : note;

      var btn = bookForm.querySelector('button[type="submit"]');
      var btnHtml = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'שולח...'; }

      fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicToken: LEAD_TOKEN,
          name: name,
          phone: phone || undefined,
          email: email || undefined,
          message: message || undefined,
          source: window.location.href
        })
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        if (ok) { ok.innerHTML = okHtml; ok.style.color = '#1e6643'; ok.style.display = 'block'; }
        bookForm.querySelectorAll('.field').forEach(function (f) { f.value = ''; });
      }).catch(function () {
        if (ok) {
          ok.textContent = 'אופס, משהו השתבש. נסו שוב או התקשרו אלינו.';
          ok.style.color = '#e74c3c';
          ok.style.display = 'block';
        }
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = btnHtml; }
      });
    });
  }
  var newsForm = document.getElementById('newsForm');
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsForm.querySelector('input');
      var btn = newsForm.querySelector('button');
      if (input && !input.checkValidity()) { input.reportValidity(); return; }
      if (btn) { btn.textContent = 'Subscribed ✓'; }
      if (input) input.value = '';
    });
  }

  /* ---- scroll reveal ---- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    document.body.classList.add('anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // safety net: if the observer never fires (some capture/preview contexts),
    // reveal everything so content is never stuck invisible.
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('in'); }); }, 2200);
  }
  /* without IO (or reduced motion) body.anim is never added → reveals stay visible */
})();
