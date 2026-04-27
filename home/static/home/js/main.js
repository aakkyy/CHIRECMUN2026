/**
 * CHIREC MUN 2026 — Main JS
 * Navbar · Countdown · Scroll Reveal · Mobile Menu
 */

/* ── Navbar ────────────────────────────────────────── */
(function () {
  const nav  = document.getElementById('navbar');
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (ham && menu) {
    ham.addEventListener('click', () => {
      menu.classList.toggle('open');
      const isOpen = menu.classList.contains('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    menu.querySelectorAll('.mm-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();


/* ── Countdown ─────────────────────────────────────── */
(function () {
  const target = new Date('2026-07-31T08:00:00+05:30');

  const els = {
    d: document.getElementById('days'),
    h: document.getElementById('hours'),
    m: document.getElementById('minutes'),
    s: document.getElementById('seconds'),
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function animateNum(el, val) {
    if (!el) return;
    const next = pad(val);
    if (el.textContent !== next) {
      el.style.transform = 'translateY(-8px)';
      el.style.opacity   = '0.5';
      el.style.transition = 'all 0.2s ease';
      setTimeout(() => {
        el.textContent     = next;
        el.style.transform = 'none';
        el.style.opacity   = '1';
      }, 120);
    }
  }

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      Object.values(els).forEach(el => { if (el) el.textContent = '00'; });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff % 86400000 / 3600000);
    const m = Math.floor(diff % 3600000  / 60000);
    const s = Math.floor(diff % 60000    / 1000);

    animateNum(els.d, d);
    animateNum(els.h, h);
    animateNum(els.m, m);
    animateNum(els.s, s);
  }

  tick();
  setInterval(tick, 1000);
})();


/* ── Scroll Reveal ─────────────────────────────────── */
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (!e.isIntersecting) return;
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), Number(delay));
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
    io.observe(el);
  });
})();


/* ── Smooth active nav link ────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    });
  }, { threshold: 0.5 });

  sections.forEach(s => io.observe(s));
})();
