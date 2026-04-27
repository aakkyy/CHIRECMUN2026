/**
 * CHIREC MUN 2026 — Galaxy Hero + CTA Particle Systems
 */

/* ═══════════════════ HERO GALAXY ═══════════════════ */
(function () {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], dust = [], shooters = [], t = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  function init() {
    stars = []; dust = [];
    const count = Math.floor(W * H / 2200);
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.2,
        s: Math.random() * 0.8 + 0.2,
        b: Math.random(),
        col: roll < 0.10 ? '#d4af37'
           : roll < 0.18 ? '#f5cc50'
           : roll < 0.25 ? '#c0392b'
           : roll < 0.30 ? '#e74c3c'
           : '#ffffff',
      });
    }

    const cx = W / 2, cy = H / 2;
    for (let i = 0; i < 500; i++) {
      const arm  = Math.floor(Math.random() * 3);
      const aa   = (arm / 3) * Math.PI * 2;
      const dist = Math.random() * Math.min(W, H) * 0.42 + 25;
      const ang  = aa + dist * 0.010 + (Math.random() - 0.5) * 0.9;
      const roll = Math.random();
      dust.push({
        ang, dist,
        av: (0.00010 + Math.random() * 0.00012) * (Math.random() < 0.5 ? 1 : -1),
        r:  Math.random() * 2.8 + 0.3,
        al: Math.random() * 0.5 + 0.08,
        col: roll < 0.28 ? 'rgba(192,57,43,'
           : roll < 0.54 ? 'rgba(212,175,55,'
           : roll < 0.72 ? 'rgba(130,60,210,'
           : 'rgba(50,90,200,',
      });
    }
  }

  function maybeShoot() {
    if (Math.random() < 0.006 && shooters.length < 3) {
      const ang = Math.PI / 4 + (Math.random() - 0.5) * 0.6;
      shooters.push({
        x: Math.random() * W, y: Math.random() * H * 0.45,
        vx: Math.cos(ang) * (7 + Math.random() * 5),
        vy: Math.sin(ang) * (7 + Math.random() * 5),
        life: 1, tail: [],
      });
    }
  }

  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.8);
    bg.addColorStop(0,   'rgba(22,8,35,1)');
    bg.addColorStop(0.35,'rgba(12,5,20,1)');
    bg.addColorStop(1,   'rgba(2,2,8,1)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Core glow
    const core = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 200);
    core.addColorStop(0,   'rgba(212,175,55,0.16)');
    core.addColorStop(0.3, 'rgba(192,57,43,0.09)');
    core.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = core; ctx.fillRect(0, 0, W, H);

    // Stars
    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(t * s.s * 0.04 + s.b * Math.PI * 2);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.col;
      ctx.globalAlpha = 0.3 + tw * 0.7;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Dust arms
    const cx = W / 2, cy = H / 2;
    for (const d of dust) {
      d.ang += d.av;
      const px = cx + Math.cos(d.ang) * d.dist;
      const py = cy + Math.sin(d.ang) * d.dist;
      ctx.beginPath();
      ctx.arc(px, py, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.col + d.al + ')';
      ctx.fill();
    }

    // Shooters
    maybeShoot();
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.tail.push({ x: s.x, y: s.y });
      if (s.tail.length > 24) s.tail.shift();
      s.x += s.vx; s.y += s.vy; s.life -= 0.02;
      for (let j = 0; j < s.tail.length - 1; j++) {
        const a = (j / s.tail.length) * s.life * 0.85;
        ctx.beginPath();
        ctx.moveTo(s.tail[j].x, s.tail[j].y);
        ctx.lineTo(s.tail[j + 1].x, s.tail[j + 1].y);
        ctx.strokeStyle = `rgba(212,175,55,${a})`;
        ctx.lineWidth = (j / s.tail.length) * 2.5;
        ctx.stroke();
      }
      if (s.life <= 0 || s.x > W + 60 || s.y > H + 60) shooters.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ═══════════════════ CTA PARTICLES ═══════════════════ */
(function () {
  const canvas = document.getElementById('cta-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], t = 0;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width  || window.innerWidth;
    H = canvas.height = rect.height || 400;
    init();
  }

  function init() {
    particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        life: Math.random(),
        dec: Math.random() * 0.003 + 0.001,
        col: Math.random() < 0.5 ? 'rgba(212,175,55,' : 'rgba(192,57,43,',
      });
    }
  }

  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.life -= p.dec;
      if (p.life <= 0) {
        p.x = Math.random() * W; p.y = H + 10;
        p.life = Math.random() * 0.8 + 0.2;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + (p.life * 0.6) + ')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  setTimeout(() => { resize(); draw(); }, 100);
})();
