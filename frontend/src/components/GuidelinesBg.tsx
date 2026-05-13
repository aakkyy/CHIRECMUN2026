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

    /* ─── seeded rng ─── */
    const rng = mulberry32(42)

    /* ─── resize ─── */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = Math.max(document.documentElement.scrollHeight, window.innerHeight)
      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStars()
      buildParticles()
      buildNebulaCache()
    }

    /* ─── star pool ─── */
    function buildStars() {
      stars = Array.from({ length: 420 }, () => {
        const hue = rng()
        return {
          x:          rng() * W,
          y:          rng() * H,
          r:          rng() * 1.3 + 0.15,
          phase:      rng() * Math.PI * 2,
          speed:      rng() * 0.4 + 0.1,
          col:        hue < 0.15 ? '160,200,255' : hue < 0.25 ? '255,230,170' : '220,230,255',
          bright:     rng() < 0.03,
          brightness: rng() * 0.5 + 0.5,
        }
      })
    }

    /* ─── ambient dust particles ─── */
    function buildParticles() {
      const cols = ['192,57,43', '28,115,215', '130,60,200', '60,190,230']
      particles = Array.from({ length: 55 }, () => ({
        x:     rng() * W,
        y:     rng() * H,
        vx:    (rng() - 0.5) * 0.18,
        vy:    (rng() - 0.5) * 0.12,
        r:     rng() * 2.2 + 0.6,
        alpha: rng() * 0.35 + 0.08,
        col:   cols[Math.floor(rng() * cols.length)],
        phase: rng() * Math.PI * 2,
      }))
    }

    /* ─── ring nebula (pre-rendered, static) ─── */
    function buildNebulaCache() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const s = document.createElement('canvas')
      const nr = Math.min(W, H) * 0.092
      const pad = nr * 2.4
      s.width  = pad * 2 * dpr
      s.height = pad * 2 * dpr
      const sc = s.getContext('2d')!
      sc.setTransform(dpr, 0, 0, dpr, 0, 0)
      sc.translate(pad, pad)
      sc.rotate(0.28)

      const shells = [
        { col: '28,115,215',  ra: 1.00, rb: 0.66, a: 0.22 },
        { col: '60,190,230',  ra: 0.82, rb: 0.54, a: 0.25 },
        { col: '192,57,43',   ra: 0.62, rb: 0.40, a: 0.30 },
        { col: '255,120,50',  ra: 0.44, rb: 0.28, a: 0.28 },
        { col: '220,180,70',  ra: 0.26, rb: 0.17, a: 0.26 },
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

      /* central star glow */
      const cg = sc.createRadialGradient(0, 0, 0, 0, 0, nr * 0.22)
      cg.addColorStop(0,   'rgba(255,255,255,0.95)')
      cg.addColorStop(0.18,'rgba(200,225,255,0.65)')
      cg.addColorStop(0.6, 'rgba(100,160,255,0.18)')
      cg.addColorStop(1,   'rgba(100,160,255,0)')
      sc.fillStyle = cg
      sc.beginPath(); sc.arc(0, 0, nr * 0.22, 0, Math.PI * 2); sc.fill()

      nebulaCache = s
    }

    /* ─── spawn meteor ─── */
    function spawnMeteor() {
      const angle = (Math.random() * 30 + 20) * Math.PI / 180
      const speed = Math.random() * 10 + 8
      const startX = Math.random() * W * 1.2 - W * 0.1
      const cols = ['255,255,255', '160,200,255', '255,160,120']
      meteors.push({
        x: startX, y: -20,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        len: Math.random() * 180 + 100,
        alpha: Math.random() * 0.6 + 0.5,
        width: Math.random() * 1.4 + 0.6,
        col: cols[Math.floor(Math.random() * cols.length)],
        alive: true,
      })
    }

    /* ─── draw stars ─── */
    function drawStars() {
      for (const s of stars) {
        const tw = 0.3 + 0.7 * Math.sin(t * s.speed + s.phase)
        if (s.bright) {
          const sl = s.brightness * 14
          const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.brightness * 10)
          sg.addColorStop(0,   `rgba(${s.col},${0.85 * tw})`)
          sg.addColorStop(0.4, `rgba(${s.col},${0.2  * tw})`)
          sg.addColorStop(1,   `rgba(${s.col},0)`)
          ctx.fillStyle = sg
          ctx.beginPath(); ctx.arc(s.x, s.y, s.brightness * 10, 0, Math.PI * 2); ctx.fill()
          ;[0, Math.PI / 2].forEach(ang => {
            const lg = ctx.createLinearGradient(
              s.x - Math.cos(ang)*sl, s.y - Math.sin(ang)*sl,
              s.x + Math.cos(ang)*sl, s.y + Math.sin(ang)*sl,
            )
            lg.addColorStop(0,   `rgba(${s.col},0)`)
            lg.addColorStop(0.5, `rgba(${s.col},${0.7 * tw})`)
            lg.addColorStop(1,   `rgba(${s.col},0)`)
            ctx.strokeStyle = lg; ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(s.x - Math.cos(ang)*sl, s.y - Math.sin(ang)*sl)
            ctx.lineTo(s.x + Math.cos(ang)*sl, s.y + Math.sin(ang)*sl)
            ctx.stroke()
          })
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.col},${tw * 0.7})`; ctx.fill()
      }
    }

    /* ─── draw aurora ribbons ─── */
    function drawAurora() {
      const bands = [
        { col: '192,57,43',  yFrac: 0.04, amp: 0.06, freq: 0.0014, speed: 0.06, a: 0.10, w: 120, ph: 0.0  },
        { col: '28,115,215', yFrac: 0.08, amp: 0.05, freq: 0.0018, speed: 0.08, a: 0.09, w: 90,  ph: 1.2  },
        { col: '130,50,200', yFrac: 0.12, amp: 0.07, freq: 0.0012, speed: 0.05, a: 0.08, w: 110, ph: 2.4  },
        { col: '60,190,230', yFrac: 0.16, amp: 0.04, freq: 0.0022, speed: 0.10, a: 0.07, w: 80,  ph: 3.6  },
        { col: '192,57,43',  yFrac: 0.20, amp: 0.05, freq: 0.0016, speed: 0.07, a: 0.06, w: 70,  ph: 4.8  },
        { col: '28,115,215', yFrac: 0.24, amp: 0.06, freq: 0.0010, speed: 0.04, a: 0.055,w: 100, ph: 0.7  },
      ]

      for (const b of bands) {
        const yBase = b.yFrac * H
        const amp   = b.amp * H
        const phase = b.ph + t * b.speed

        /* paint as a thick soft stroke using gradient */
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.3 + b.ph)

        ctx.beginPath()
        for (let x = 0; x <= W; x += 5) {
          const y = yBase
            + amp * Math.sin(x * b.freq + phase)
            + amp * 0.35 * Math.sin(x * b.freq * 2.3 + phase * 1.4)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        /* soft wide glow */
        ctx.strokeStyle = `rgba(${b.col},${b.a * 0.25 * pulse})`
        ctx.lineWidth   = b.w; ctx.stroke()
        /* bright core line */
        ctx.strokeStyle = `rgba(${b.col},${b.a * pulse})`
        ctx.lineWidth   = 1.5; ctx.stroke()
      }
    }

    /* ─── draw nebula cache ─── */
    function drawNebula() {
      if (!nebulaCache) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nr  = Math.min(W, H) * 0.092
      const pad = nr * 2.4
      const nx  = W * 0.76, ny = H * 0.22
      const pulse = 0.88 + 0.12 * Math.sin(t * 0.08)
      ctx.save()
      ctx.globalAlpha = pulse
      ctx.drawImage(nebulaCache, (nx - pad) * dpr, (ny - pad) * dpr, pad * 2 * dpr, pad * 2 * dpr,
                    nx - pad, ny - pad, pad * 2, pad * 2)
      ctx.restore()
    }

    /* ─── draw meteors ─── */
    function drawMeteors() {
      meteors = meteors.filter(m => m.alive)
      for (const m of meteors) {
        const tail = ctx.createLinearGradient(
          m.x - m.dx * m.len / 12, m.y - m.dy * m.len / 12,
          m.x, m.y,
        )
        tail.addColorStop(0,   `rgba(${m.col},0)`)
        tail.addColorStop(0.6, `rgba(${m.col},${m.alpha * 0.3})`)
        tail.addColorStop(1,   `rgba(${m.col},${m.alpha})`)
        ctx.strokeStyle = tail
        ctx.lineWidth   = m.width
        ctx.beginPath()
        ctx.moveTo(m.x - m.dx * m.len / 12, m.y - m.dy * m.len / 12)
        ctx.lineTo(m.x, m.y)
        ctx.stroke()

        /* advance */
        m.x     += m.dx
        m.y     += m.dy
        m.alpha -= 0.008
        if (m.alpha <= 0 || m.x > W + 50 || m.y > H + 50) m.alive = false
      }
    }

    /* ─── draw ambient particles ─── */
    function drawParticles() {
      for (const p of particles) {
        const tw = 0.4 + 0.6 * Math.sin(t * 0.3 + p.phase)
        const g  = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        g.addColorStop(0,   `rgba(${p.col},${p.alpha * tw})`)
        g.addColorStop(1,   `rgba(${p.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        if (p.y < -10) p.y = H + 10
        if (p.y > H + 10) p.y = -10
      }
    }

    /* ─── draw red emission cloud ─── */
    function drawRedCloud() {
      const a = 0.07 + 0.04 * Math.sin(t * 0.05)
      const cloud = ctx.createRadialGradient(W*0.10, H*0.75, 0, W*0.10, H*0.75, Math.min(W,H)*0.20)
      cloud.addColorStop(0,   `rgba(192,57,43,${a})`)
      cloud.addColorStop(0.5, `rgba(140,30,20,${a*0.4})`)
      cloud.addColorStop(1,   'rgba(140,30,20,0)')
      ctx.fillStyle = cloud
      ctx.beginPath(); ctx.arc(W*0.10, H*0.75, Math.min(W,H)*0.20, 0, Math.PI*2); ctx.fill()
    }

    /* ─── main loop ─── */
    function draw(ts: number) {
      t += 0.010

      ctx.fillStyle = '#010008'
      ctx.fillRect(0, 0, W, H)

      drawAurora()
      drawRedCloud()
      drawStars()
      drawNebula()
      drawParticles()

      /* spawn meteor every 2.2–4s */
      if (ts - lastMeteor > 2200 + Math.random() * 1800) {
        spawnMeteor(); lastMeteor = ts
      }
      drawMeteors()

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
