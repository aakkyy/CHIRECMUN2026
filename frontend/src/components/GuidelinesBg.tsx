import { useEffect, useRef } from 'react'

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296
  }
}

interface Star     { x: number; y: number; r: number; phase: number; speed: number; col: string; bright: boolean; brightness: number }
interface Meteor   { x: number; y: number; dx: number; dy: number; len: number; alpha: number; width: number; col: string; alive: boolean }
interface Particle { x: number; y: number; vx: number; vy: number; r: number; alpha: number; col: string; phase: number }

export default function GuidelinesBg() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = 0, H = 0, t = 0, raf = 0
    let stars: Star[] = []
    let meteors: Meteor[] = []
    let particles: Particle[] = []
    let nebulaCache: HTMLCanvasElement | null = null
    let lastMeteor = 0

    const rng = mulberry32(42)

    /* ─── resize — always viewport size since canvas is fixed ─── */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStars()
      buildParticles()
      buildNebulaCache()
    }

    /* ─── stars ─── */
    function buildStars() {
      stars = Array.from({ length: 380 }, () => {
        const hue = rng()
        return {
          x:          rng() * W,
          y:          rng() * H,
          r:          rng() * 1.4 + 0.2,
          phase:      rng() * Math.PI * 2,
          speed:      rng() * 0.5 + 0.1,
          col:        hue < 0.15 ? '160,200,255' : hue < 0.28 ? '255,230,170' : '220,232,255',
          bright:     rng() < 0.04,
          brightness: rng() * 0.5 + 0.5,
        }
      })
    }

    /* ─── dust particles — bigger, more opaque ─── */
    function buildParticles() {
      const cols = ['192,57,43', '28,115,215', '140,60,210', '60,190,230', '192,57,43', '28,115,215']
      particles = Array.from({ length: 80 }, () => ({
        x:     rng() * W,
        y:     rng() * H,
        vx:    (rng() - 0.5) * 0.22,
        vy:    (rng() - 0.5) * 0.14,
        r:     rng() * 3.5 + 1.5,
        alpha: rng() * 0.55 + 0.25,
        col:   cols[Math.floor(rng() * cols.length)],
        phase: rng() * Math.PI * 2,
      }))
    }

    /* ─── ring nebula (pre-rendered offscreen) ─── */
    function buildNebulaCache() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const s   = document.createElement('canvas')
      const nr  = Math.min(W, H) * 0.10
      const pad = nr * 2.6
      s.width  = pad * 2 * dpr
      s.height = pad * 2 * dpr
      const sc = s.getContext('2d')!
      sc.setTransform(dpr, 0, 0, dpr, 0, 0)
      sc.translate(pad, pad)
      sc.rotate(0.28)

      const shells = [
        { col: '28,115,215',  ra: 1.00, rb: 0.66, a: 0.30 },
        { col: '60,190,230',  ra: 0.82, rb: 0.54, a: 0.32 },
        { col: '192,57,43',   ra: 0.62, rb: 0.40, a: 0.36 },
        { col: '255,120,50',  ra: 0.44, rb: 0.28, a: 0.34 },
        { col: '220,180,70',  ra: 0.26, rb: 0.17, a: 0.30 },
      ]
      shells.forEach(({ col, ra, rb, a }) => {
        const g = sc.createRadialGradient(0, 0, nr * ra * 0.5, 0, 0, nr * ra * 1.08)
        g.addColorStop(0,    `rgba(${col},0)`)
        g.addColorStop(0.35, `rgba(${col},${a * 0.55})`)
        g.addColorStop(0.68, `rgba(${col},${a})`)
        g.addColorStop(1,    `rgba(${col},0)`)
        sc.fillStyle = g
        sc.beginPath()
        sc.ellipse(0, 0, nr * ra * 1.08, nr * rb * 0.72, 0, 0, Math.PI * 2)
        sc.ellipse(0, 0, nr * ra * 0.68, nr * rb * 0.45, 0, 0, Math.PI * 2, true)
        sc.fill('evenodd')
      })
      const cg = sc.createRadialGradient(0, 0, 0, 0, 0, nr * 0.22)
      cg.addColorStop(0,    'rgba(255,255,255,0.95)')
      cg.addColorStop(0.2,  'rgba(200,225,255,0.65)')
      cg.addColorStop(0.6,  'rgba(100,160,255,0.18)')
      cg.addColorStop(1,    'rgba(100,160,255,0)')
      sc.fillStyle = cg
      sc.beginPath(); sc.arc(0, 0, nr * 0.22, 0, Math.PI * 2); sc.fill()
      nebulaCache = s
    }

    /* ─── meteor ─── */
    function spawnMeteor() {
      const angle = (Math.random() * 25 + 18) * Math.PI / 180
      const speed = Math.random() * 12 + 9
      const cols  = ['255,255,255', '180,215,255', '255,180,130']
      meteors.push({
        x: Math.random() * W * 1.3 - W * 0.15, y: -30,
        dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
        len: Math.random() * 200 + 120,
        alpha: Math.random() * 0.5 + 0.6,
        width: Math.random() * 1.6 + 0.8,
        col: cols[Math.floor(Math.random() * cols.length)],
        alive: true,
      })
    }

    /* ─── draw aurora — MUCH brighter ─── */
    function drawAurora() {
      const bands = [
        /* red bands */
        { col: '192,57,43',  yF: 0.05, amp: 0.08, freq: 0.0013, sp: 0.055, a: 0.38, gw: 260, ph: 0.0  },
        { col: '192,57,43',  yF: 0.32, amp: 0.06, freq: 0.0017, sp: 0.070, a: 0.28, gw: 180, ph: 2.1  },
        { col: '192,57,43',  yF: 0.65, amp: 0.07, freq: 0.0011, sp: 0.045, a: 0.22, gw: 200, ph: 4.3  },
        /* blue bands */
        { col: '28,115,215', yF: 0.15, amp: 0.07, freq: 0.0016, sp: 0.065, a: 0.35, gw: 240, ph: 1.2  },
        { col: '28,115,215', yF: 0.45, amp: 0.05, freq: 0.0020, sp: 0.080, a: 0.26, gw: 170, ph: 3.3  },
        { col: '28,115,215', yF: 0.80, amp: 0.06, freq: 0.0014, sp: 0.050, a: 0.20, gw: 190, ph: 5.1  },
        /* purple accent */
        { col: '130,50,200', yF: 0.22, amp: 0.09, freq: 0.0011, sp: 0.040, a: 0.28, gw: 220, ph: 0.8  },
        { col: '130,50,200', yF: 0.58, amp: 0.07, freq: 0.0015, sp: 0.060, a: 0.22, gw: 160, ph: 2.9  },
        /* teal accent */
        { col: '40,190,210', yF: 0.72, amp: 0.05, freq: 0.0018, sp: 0.075, a: 0.20, gw: 150, ph: 1.6  },
      ]

      for (const b of bands) {
        const yBase = b.yF * H
        const amp   = b.amp * H
        const phase = b.ph + t * b.sp
        const pulse = 0.65 + 0.35 * Math.sin(t * 0.4 + b.ph)

        ctx.beginPath()
        for (let x = 0; x <= W; x += 4) {
          const y = yBase
            + amp * Math.sin(x * b.freq + phase)
            + amp * 0.4  * Math.sin(x * b.freq * 2.1 + phase * 1.3)
            + amp * 0.18 * Math.sin(x * b.freq * 3.7 + phase * 0.8)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        /* wide soft glow */
        ctx.strokeStyle = `rgba(${b.col},${b.a * 0.22 * pulse})`
        ctx.lineWidth   = b.gw; ctx.stroke()
        /* mid glow */
        ctx.strokeStyle = `rgba(${b.col},${b.a * 0.55 * pulse})`
        ctx.lineWidth   = 18; ctx.stroke()
        /* bright core */
        ctx.strokeStyle = `rgba(${b.col},${b.a * pulse})`
        ctx.lineWidth   = 2; ctx.stroke()
      }
    }

    /* ─── draw nebula ─── */
    function drawNebula() {
      if (!nebulaCache) return
      const dpr  = Math.min(window.devicePixelRatio || 1, 2)
      const nr   = Math.min(W, H) * 0.10
      const pad  = nr * 2.6
      const nx   = W * 0.78, ny = H * 0.24
      const pulse = 0.90 + 0.10 * Math.sin(t * 0.09)
      ctx.save()
      ctx.globalAlpha = pulse
      ctx.drawImage(
        nebulaCache,
        (nx - pad) * dpr, (ny - pad) * dpr, pad * 2 * dpr, pad * 2 * dpr,
        nx - pad, ny - pad, pad * 2, pad * 2,
      )
      ctx.restore()
    }

    /* ─── draw stars ─── */
    function drawStars() {
      for (const s of stars) {
        const tw = 0.3 + 0.7 * Math.sin(t * s.speed + s.phase)
        if (s.bright) {
          const sl = s.brightness * 14
          const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.brightness * 10)
          sg.addColorStop(0,   `rgba(${s.col},${0.9 * tw})`)
          sg.addColorStop(0.4, `rgba(${s.col},${0.2 * tw})`)
          sg.addColorStop(1,   `rgba(${s.col},0)`)
          ctx.fillStyle = sg
          ctx.beginPath(); ctx.arc(s.x, s.y, s.brightness * 10, 0, Math.PI * 2); ctx.fill()
          ;[0, Math.PI / 2].forEach(ang => {
            const lg = ctx.createLinearGradient(
              s.x - Math.cos(ang)*sl, s.y - Math.sin(ang)*sl,
              s.x + Math.cos(ang)*sl, s.y + Math.sin(ang)*sl,
            )
            lg.addColorStop(0, `rgba(${s.col},0)`)
            lg.addColorStop(0.5, `rgba(${s.col},${0.75 * tw})`)
            lg.addColorStop(1, `rgba(${s.col},0)`)
            ctx.strokeStyle = lg; ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(s.x - Math.cos(ang)*sl, s.y - Math.sin(ang)*sl)
            ctx.lineTo(s.x + Math.cos(ang)*sl, s.y + Math.sin(ang)*sl)
            ctx.stroke()
          })
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.col},${tw * 0.72})`; ctx.fill()
      }
    }

    /* ─── draw particles — bigger glow ─── */
    function drawParticles() {
      for (const p of particles) {
        const tw = 0.45 + 0.55 * Math.sin(t * 0.35 + p.phase)
        /* outer glow */
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
        g.addColorStop(0,   `rgba(${p.col},${p.alpha * tw})`)
        g.addColorStop(0.4, `rgba(${p.col},${p.alpha * tw * 0.4})`)
        g.addColorStop(1,   `rgba(${p.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill()
        /* bright core dot */
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.col},${Math.min(p.alpha * tw * 1.8, 0.9)})`; ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < -20) p.x = W + 20
        if (p.x > W + 20) p.x = -20
        if (p.y < -20) p.y = H + 20
        if (p.y > H + 20) p.y = -20
      }
    }

    /* ─── draw meteors ─── */
    function drawMeteors() {
      meteors = meteors.filter(m => m.alive)
      for (const m of meteors) {
        const tail = ctx.createLinearGradient(
          m.x - m.dx * (m.len / 10), m.y - m.dy * (m.len / 10), m.x, m.y,
        )
        tail.addColorStop(0,   `rgba(${m.col},0)`)
        tail.addColorStop(0.5, `rgba(${m.col},${m.alpha * 0.3})`)
        tail.addColorStop(1,   `rgba(${m.col},${m.alpha})`)
        /* glow */
        ctx.strokeStyle = tail; ctx.lineWidth = m.width * 4
        ctx.beginPath()
        ctx.moveTo(m.x - m.dx * (m.len / 10), m.y - m.dy * (m.len / 10))
        ctx.lineTo(m.x, m.y); ctx.stroke()
        /* core */
        ctx.strokeStyle = tail; ctx.lineWidth = m.width
        ctx.beginPath()
        ctx.moveTo(m.x - m.dx * (m.len / 10), m.y - m.dy * (m.len / 10))
        ctx.lineTo(m.x, m.y); ctx.stroke()

        m.x += m.dx; m.y += m.dy
        m.alpha -= 0.007
        if (m.alpha <= 0 || m.x > W + 60 || m.y > H + 60) m.alive = false
      }
    }

    /* ─── main loop ─── */
    function draw(ts: number) {
      t += 0.010
      ctx.fillStyle = '#010008'
      ctx.fillRect(0, 0, W, H)

      drawAurora()
      drawStars()
      drawNebula()
      drawParticles()

      if (ts - lastMeteor > 2000 + Math.random() * 2000) {
        spawnMeteor(); lastMeteor = ts
      }
      drawMeteors()

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
