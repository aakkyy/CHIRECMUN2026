import { useEffect, useRef } from 'react'

export default function AnimatedBg({ variant = 'cosmic' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = 0, H = 0, t = 0, raf = null
    let visible = false
    let bgStars = [], fgStars = [], asteroids = [], planets = []
    let comet = null
    let lastTime = 0
    const isCosmic = variant === 'cosmic'
    const FPS = isCosmic ? 24 : 30
    const INTERVAL = 1000 / FPS

    /* ── resize — always viewport-sized so scroll never affects canvas cost ── */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cw  = window.innerWidth
      const ch  = window.innerHeight
      canvas.width  = cw * dpr
      canvas.height = ch * dpr
      canvas.style.width  = cw + 'px'
      canvas.style.height = ch + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      W = cw; H = ch
      buildObjects()
    }

    function buildObjects() {
      /* tiny background star field — halved for perf */
      bgStars = Array.from({ length: 140 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.45 + 0.08,
        a: Math.random() * 0.35 + 0.08,
      }))

      /* foreground twinkling stars */
      fgStars = Array.from({ length: 55 }, () => ({
        x:      Math.random() * W,
        y:      Math.random() * H,
        r:      Math.random() * 1.3 + 0.3,
        phase:  Math.random() * Math.PI * 2,
        speed:  Math.random() * 0.55 + 0.2,
        bright: Math.random() < 0.04,
        bri:    Math.random() * 0.55 + 0.5,
        col:    Math.random() < 0.38 ? '210,175,255' : '220,235,255',
      }))

      /* planets */
      planets = [
        {
          cx: W * 0.83, cy: H * 0.15,
          r:  Math.min(W, H) * 0.052,
          gradStops: [
            [0,    'rgba(55,25,95,1)'],
            [0.3,  'rgba(85,45,155,1)'],
            [0.65, 'rgba(105,58,175,1)'],
            [1,    'rgba(38,18,75,1)'],
          ],
          bands: ['rgba(65,30,110,0.38)', 'rgba(95,50,160,0.32)', 'rgba(48,22,88,0.28)'],
          ring: true,
          ringRadIn: 1.2, ringRadOut: 2.1,
          ringCol: '110,65,185', ringA: 0.38, ringTilt: 0.28,
          glowCol: '80,38,145', glowA: 0.22,
        },
        {
          cx: W * 0.10, cy: H * 0.73,
          r:  Math.min(W, H) * 0.026,
          gradStops: [
            [0,    'rgba(185,52,12,1)'],
            [0.4,  'rgba(215,72,22,1)'],
            [0.75, 'rgba(145,38,8,1)'],
            [1,    'rgba(75,18,4,1)'],
          ],
          bands: ['rgba(155,42,8,0.32)', 'rgba(225,82,26,0.26)'],
          ring: false,
          glowCol: '192,57,43', glowA: 0.26,
        },
        {
          cx: W * 0.66, cy: H * 0.83,
          r:  Math.min(W, H) * 0.014,
          gradStops: [
            [0,    'rgba(75,155,225,1)'],
            [0.5,  'rgba(48,112,195,1)'],
            [1,    'rgba(18,55,115,1)'],
          ],
          bands: [],
          ring: false,
          glowCol: '86,175,242', glowA: 0.16,
        },
      ]

      /* asteroids — shapes generated once so they don't flicker */
      asteroids = Array.from({ length: 7 }, () => {
        const sides = Math.floor(Math.random() * 4) + 5
        const verts = Array.from({ length: sides }, (_, i) => {
          const angle  = (i / sides) * Math.PI * 2
          const jitter = 0.62 + Math.random() * 0.38
          return { angle, jitter }
        })
        return {
          x:        Math.random() * W,
          y:        Math.random() * H,
          r:        Math.random() * 3.2 + 1.4,
          rot:      Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.008,
          verts,
          a:        Math.random() * 0.18 + 0.06,
          col:      Math.random() < 0.5 ? '175,138,118' : '138,118,158',
        }
      })

      /* comet */
      comet = {
        x: -250,
        y: Math.random() * H * 0.55 + H * 0.05,
        vx: 1.1 + Math.random() * 0.9,
        vy: (Math.random() - 0.5) * 0.5,
        tail: 110 + Math.random() * 90,
        delay: 240 + Math.floor(Math.random() * 400),
        frame: 0,
      }
    }

    /* ── draw helpers ── */

    function drawBgStars() {
      for (const s of bgStars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,235,255,${s.a})`
        ctx.fill()
      }
    }

    function drawFgStars() {
      for (const s of fgStars) {
        const tw = 0.35 + 0.65 * Math.sin(t * s.speed + s.phase)
        if (s.bright) {
          const sl = s.bri * 18
          const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.bri * 14)
          sg.addColorStop(0,   `rgba(${s.col},${0.9 * tw})`)
          sg.addColorStop(0.4, `rgba(${s.col},${0.25 * tw})`)
          sg.addColorStop(1,   `rgba(${s.col},0)`)
          ctx.fillStyle = sg
          ctx.beginPath(); ctx.arc(s.x, s.y, s.bri * 14, 0, Math.PI * 2); ctx.fill()
          ctx.save(); ctx.globalAlpha = 0.52 * tw
          for (let a = 0; a < 4; a++) {
            const ang = (a / 4) * Math.PI
            const lg  = ctx.createLinearGradient(
              s.x - Math.cos(ang) * sl, s.y - Math.sin(ang) * sl,
              s.x + Math.cos(ang) * sl, s.y + Math.sin(ang) * sl
            )
            lg.addColorStop(0,   `rgba(${s.col},0)`)
            lg.addColorStop(0.5, `rgba(${s.col},0.85)`)
            lg.addColorStop(1,   `rgba(${s.col},0)`)
            ctx.strokeStyle = lg; ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(s.x - Math.cos(ang) * sl, s.y - Math.sin(ang) * sl)
            ctx.lineTo(s.x + Math.cos(ang) * sl, s.y + Math.sin(ang) * sl)
            ctx.stroke()
          }
          ctx.restore()
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.col},${tw * 0.68})`; ctx.fill()
      }
    }

    function drawNebulaDust() {
      const clouds = [
        { cx: 0.14, cy: 0.28, rx: 0.32, ry: 0.24, col: '75,18,135',  a: 0.13, ph: 0.0 },
        { cx: 0.78, cy: 0.52, rx: 0.36, ry: 0.28, col: '28,75,175',  a: 0.11, ph: 1.4 },
        { cx: 0.50, cy: 0.72, rx: 0.44, ry: 0.30, col: '115,18,38',  a: 0.09, ph: 2.6 },
        { cx: 0.88, cy: 0.84, rx: 0.26, ry: 0.20, col: '45,18,115',  a: 0.11, ph: 0.8 },
        { cx: 0.06, cy: 0.88, rx: 0.24, ry: 0.18, col: '135,28,18',  a: 0.10, ph: 3.2 },
        { cx: 0.40, cy: 0.12, rx: 0.30, ry: 0.18, col: '18,55,140',  a: 0.08, ph: 1.9 },
      ]
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i]
        const pulse = 0.82 + 0.18 * Math.sin(t * 0.11 + c.ph)
        ctx.save()
        ctx.translate(c.cx * W, c.cy * H)
        ctx.scale(1, c.ry / c.rx)
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, c.rx * W)
        g.addColorStop(0,   `rgba(${c.col},${c.a * pulse})`)
        g.addColorStop(0.5, `rgba(${c.col},${c.a * 0.38 * pulse})`)
        g.addColorStop(1,   `rgba(${c.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(0, 0, c.rx * W, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }
    }

    function drawPlanets() {
      for (const p of planets) {
        const pulse = 1 + 0.007 * Math.sin(t * 0.13)
        const r = p.r * pulse

        /* glow halo */
        const glow = ctx.createRadialGradient(p.cx, p.cy, r * 0.85, p.cx, p.cy, r * 2.6)
        glow.addColorStop(0, `rgba(${p.glowCol},${p.glowA})`)
        glow.addColorStop(1, `rgba(${p.glowCol},0)`)
        ctx.fillStyle = glow
        ctx.beginPath(); ctx.arc(p.cx, p.cy, r * 2.6, 0, Math.PI * 2); ctx.fill()

        /* body gradient */
        const grad = ctx.createRadialGradient(
          p.cx - r * 0.28, p.cy - r * 0.28, r * 0.04,
          p.cx, p.cy, r
        )
        for (const [stop, col] of p.gradStops) grad.addColorStop(stop, col)
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(p.cx, p.cy, r, 0, Math.PI * 2); ctx.fill()

        /* surface bands */
        if (p.bands.length) {
          ctx.save()
          ctx.beginPath(); ctx.arc(p.cx, p.cy, r, 0, Math.PI * 2); ctx.clip()
          for (let b = 0; b < p.bands.length; b++) {
            const by = p.cy - r + (b + 1.0) * (r * 2 / (p.bands.length + 1))
            ctx.fillStyle = p.bands[b]
            ctx.fillRect(p.cx - r, by - r * 0.11, r * 2, r * 0.11)
          }
          ctx.restore()
        }

        /* ring system */
        if (p.ring) {
          /* back half of ring (behind planet) */
          ctx.save()
          ctx.translate(p.cx, p.cy)
          ctx.scale(1, p.ringTilt)
          ctx.beginPath()
          ctx.arc(0, 0, r * p.ringRadOut, 0, Math.PI)
          ctx.arc(0, 0, r * p.ringRadIn,  Math.PI, 0, true)
          ctx.closePath()
          const rg = ctx.createRadialGradient(0, 0, r * p.ringRadIn, 0, 0, r * p.ringRadOut)
          rg.addColorStop(0,   `rgba(${p.ringCol},0)`)
          rg.addColorStop(0.2, `rgba(${p.ringCol},${p.ringA})`)
          rg.addColorStop(0.6, `rgba(${p.ringCol},${p.ringA * 0.55})`)
          rg.addColorStop(1,   `rgba(${p.ringCol},0)`)
          ctx.fillStyle = rg
          ctx.globalAlpha = 0.45
          ctx.fill()
          ctx.restore()

          /* planet body on top */
          ctx.fillStyle = grad
          ctx.beginPath(); ctx.arc(p.cx, p.cy, r, 0, Math.PI * 2); ctx.fill()

          /* front half of ring (in front of planet) */
          ctx.save()
          ctx.translate(p.cx, p.cy)
          ctx.scale(1, p.ringTilt)
          ctx.beginPath()
          ctx.arc(0, 0, r * p.ringRadOut, Math.PI, 2 * Math.PI)
          ctx.arc(0, 0, r * p.ringRadIn,  2 * Math.PI, Math.PI, true)
          ctx.closePath()
          ctx.fillStyle = rg
          ctx.globalAlpha = 0.7
          ctx.fill()
          ctx.restore()
        }

        /* rim highlight */
        const rim = ctx.createRadialGradient(p.cx + r * 0.55, p.cy - r * 0.48, 0, p.cx, p.cy, r)
        rim.addColorStop(0.72, `rgba(255,255,255,0)`)
        rim.addColorStop(0.9,  `rgba(255,255,255,0.09)`)
        rim.addColorStop(1,    `rgba(255,255,255,0)`)
        ctx.fillStyle = rim
        ctx.beginPath(); ctx.arc(p.cx, p.cy, r, 0, Math.PI * 2); ctx.fill()
      }
    }

    function drawAsteroids() {
      for (const a of asteroids) {
        ctx.save()
        ctx.translate(a.x, a.y)
        ctx.rotate(a.rot + t * a.rotSpeed * 60)
        ctx.beginPath()
        for (let i = 0; i < a.verts.length; i++) {
          const v  = a.verts[i]
          const rx = a.r * v.jitter * Math.cos(v.angle)
          const ry = a.r * v.jitter * Math.sin(v.angle)
          i === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry)
        }
        ctx.closePath()
        ctx.fillStyle = `rgba(${a.col},${a.a})`
        ctx.fill()
        /* subtle edge glow */
        ctx.strokeStyle = `rgba(${a.col},${a.a * 0.6})`
        ctx.lineWidth = 0.5
        ctx.stroke()
        ctx.restore()
      }
    }

    function drawComet() {
      if (!comet) return
      comet.frame++
      if (comet.frame < comet.delay) return

      comet.x += comet.vx
      comet.y += comet.vy

      if (comet.x > W + 260) {
        comet.x     = -260
        comet.y     = Math.random() * H * 0.6 + H * 0.04
        comet.vx    = 1.0 + Math.random() * 1.0
        comet.vy    = (Math.random() - 0.5) * 0.5
        comet.tail  = 100 + Math.random() * 100
        comet.delay = 180 + Math.floor(Math.random() * 360)
        comet.frame = 0
        return
      }

      const tx = comet.x - comet.tail
      const ty = comet.y - comet.vy * (comet.tail / Math.max(comet.vx, 0.01))

      /* tail */
      const tailGrad = ctx.createLinearGradient(comet.x, comet.y, tx, ty)
      tailGrad.addColorStop(0,   'rgba(230,245,255,0.62)')
      tailGrad.addColorStop(0.3, 'rgba(140,205,255,0.28)')
      tailGrad.addColorStop(1,   'rgba(86,155,230,0)')
      ctx.strokeStyle = tailGrad
      ctx.lineWidth   = 1.8
      ctx.beginPath(); ctx.moveTo(comet.x, comet.y); ctx.lineTo(tx, ty); ctx.stroke()

      /* wide diffuse glow around tail */
      const wideGrad = ctx.createLinearGradient(comet.x, comet.y, tx, ty)
      wideGrad.addColorStop(0,   'rgba(200,230,255,0.12)')
      wideGrad.addColorStop(1,   'rgba(86,155,230,0)')
      ctx.strokeStyle = wideGrad
      ctx.lineWidth   = 6
      ctx.beginPath(); ctx.moveTo(comet.x, comet.y); ctx.lineTo(tx, ty); ctx.stroke()

      /* head */
      const hg = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 9)
      hg.addColorStop(0,   'rgba(255,255,255,0.95)')
      hg.addColorStop(0.4, 'rgba(200,235,255,0.55)')
      hg.addColorStop(1,   'rgba(86,155,230,0)')
      ctx.fillStyle = hg
      ctx.beginPath(); ctx.arc(comet.x, comet.y, 9, 0, Math.PI * 2); ctx.fill()
    }

    function drawWaves() {
      /* 10 waves total (was 14) — step 5px instead of 3px for perf */
      const waves = [
        /* Red */
        { col: '192,57,43',  yFrac: 0.10, amp: 0.075, freq: 0.0028, speed: 0.14, width: 2.2, alpha: 0.42, ph: 0.00 },
        { col: '231,76,60',  yFrac: 0.28, amp: 0.055, freq: 0.0038, speed: 0.21, width: 1.4, alpha: 0.28, ph: 1.40 },
        { col: '192,57,43',  yFrac: 0.48, amp: 0.096, freq: 0.0023, speed: 0.17, width: 3.0, alpha: 0.45, ph: 2.75 },
        { col: '231,76,60',  yFrac: 0.67, amp: 0.058, freq: 0.0040, speed: 0.26, width: 1.6, alpha: 0.28, ph: 3.30 },
        { col: '192,57,43',  yFrac: 0.86, amp: 0.045, freq: 0.0034, speed: 0.15, width: 1.0, alpha: 0.18, ph: 2.05 },
        /* Blue */
        { col: '28,115,215', yFrac: 0.06, amp: 0.065, freq: 0.0034, speed: 0.19, width: 1.8, alpha: 0.34, ph: 0.60 },
        { col: '86,204,242', yFrac: 0.22, amp: 0.082, freq: 0.0027, speed: 0.13, width: 2.5, alpha: 0.43, ph: 1.95 },
        { col: '60,178,255', yFrac: 0.40, amp: 0.100, freq: 0.0021, speed: 0.18, width: 3.2, alpha: 0.46, ph: 0.38 },
        { col: '86,204,242', yFrac: 0.58, amp: 0.065, freq: 0.0037, speed: 0.29, width: 1.6, alpha: 0.28, ph: 3.72 },
        { col: '28,115,215', yFrac: 0.78, amp: 0.048, freq: 0.0044, speed: 0.12, width: 1.0, alpha: 0.18, ph: 2.28 },
      ]

      for (const w of waves) {
        const yBase = w.yFrac * H
        const amp   = w.amp * H
        const phase = w.ph + t * w.speed

        ctx.beginPath()
        for (let x = 0; x <= W; x += 5) {       /* step 5 vs 3 = 40% fewer points */
          const y = yBase
            + amp        * Math.sin(x * w.freq       + phase)
            + amp * 0.34 * Math.sin(x * w.freq * 2.2 + phase * 1.35 + 0.95)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }

        /* diffuse glow pass */
        ctx.strokeStyle = `rgba(${w.col},${w.alpha * 0.30})`
        ctx.lineWidth   = w.width * 3.5
        ctx.stroke()

        /* bright core pass */
        ctx.strokeStyle = `rgba(${w.col},${w.alpha})`
        ctx.lineWidth   = w.width
        ctx.stroke()
      }
    }

    /* ── legacy streams variant (used in CTA/Contact sections) ── */
    function drawStreams() {
      const cols = ['192,57,43', '86,204,242']
      for (let l = 0; l < 20; l++) {
        const col   = cols[l % 2]
        const yBase = (l / 20) * H
        const amp   = H * 0.09
        const freq  = 0.0028 + (l % 5) * 0.0007
        const phase = l * 0.64 + t * 0.18
        const alpha = 0.08 + 0.05 * Math.sin(t * 0.42 + l)
        ctx.beginPath()
        for (let x = 0; x <= W; x += 4) {
          const y = yBase + amp * Math.sin(x * freq + phase) + amp * 0.3 * Math.sin(x * freq * 2.4 + phase * 1.6)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${col},${alpha})`
        ctx.lineWidth = 1.2; ctx.stroke()
      }
    }

    /* ── legacy nebula palettes ── */
    const palettes = {
      red: {
        bg: '#06010a',
        dust: [
          { cx: 0.50, cy: 0.42, rx: 0.68, ry: 0.52, col: '110,18,8',  a: 0.30 },
          { cx: 0.25, cy: 0.65, rx: 0.50, ry: 0.38, col: '80,12,6',   a: 0.22 },
          { cx: 0.80, cy: 0.28, rx: 0.46, ry: 0.38, col: '140,30,8',  a: 0.20 },
        ],
        pillars: [
          { cx: 0.40, cy: 0.50, r: 0.20, col: '192,40,12', a: 0.26 },
          { cx: 0.65, cy: 0.38, r: 0.16, col: '220,60,15', a: 0.22 },
          { cx: 0.22, cy: 0.62, r: 0.14, col: '160,30,10', a: 0.18 },
        ],
        cores: [
          { cx: 0.48, cy: 0.45, r: 0.09, col: '255,120,40', a: 0.36 },
          { cx: 0.64, cy: 0.35, r: 0.07, col: '255,80,18',  a: 0.28 },
        ],
        wisps: [
          { col: '180,50,15',  a: 0.12 },
          { col: '220,80,20',  a: 0.09 },
          { col: '120,30,8',   a: 0.10 },
        ],
        pulse: '192,57,43',
      },
      blue: {
        bg: '#01050e',
        dust: [
          { cx: 0.50, cy: 0.45, rx: 0.70, ry: 0.55, col: '8,28,90',   a: 0.30 },
          { cx: 0.22, cy: 0.62, rx: 0.48, ry: 0.40, col: '6,20,70',   a: 0.22 },
          { cx: 0.82, cy: 0.30, rx: 0.44, ry: 0.38, col: '10,35,110', a: 0.20 },
        ],
        pillars: [
          { cx: 0.42, cy: 0.48, r: 0.20, col: '20,80,200',  a: 0.26 },
          { cx: 0.62, cy: 0.36, r: 0.16, col: '30,120,220', a: 0.22 },
          { cx: 0.24, cy: 0.63, r: 0.14, col: '15,60,170',  a: 0.18 },
        ],
        cores: [
          { cx: 0.50, cy: 0.44, r: 0.09, col: '86,204,242', a: 0.40 },
          { cx: 0.63, cy: 0.34, r: 0.07, col: '60,180,255', a: 0.30 },
        ],
        wisps: [
          { col: '30,100,210', a: 0.12 },
          { col: '60,160,240', a: 0.09 },
          { col: '15,70,160',  a: 0.10 },
        ],
        pulse: '86,204,242',
      },
    }

    function drawNebula(pal) {
      for (let i = 0; i < pal.dust.length; i++) {
        const d = pal.dust[i]
        const p = 0.85 + 0.15 * Math.sin(t * 0.18 + i * 1.1)
        ctx.save()
        ctx.translate(d.cx * W, d.cy * H)
        ctx.scale(1, d.ry / d.rx)
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, d.rx * W)
        g.addColorStop(0,   `rgba(${d.col},${d.a * p})`)
        g.addColorStop(0.5, `rgba(${d.col},${d.a * 0.4 * p})`)
        g.addColorStop(1,   `rgba(${d.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(0, 0, d.rx * W, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }
      for (let i = 0; i < pal.pillars.length; i++) {
        const p  = pal.pillars[i]
        const pw = 0.80 + 0.20 * Math.sin(t * 0.28 + i * 0.9 + 1.2)
        const dx = Math.sin(t * 0.12 + i * 2.3) * W * 0.010
        const dy = Math.cos(t * 0.10 + i * 1.7) * H * 0.008
        const cx = p.cx * W + dx, cy = p.cy * H + dy
        const r  = p.r * Math.min(W, H)
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,    `rgba(${p.col},${p.a * pw})`)
        g.addColorStop(0.4,  `rgba(${p.col},${p.a * 0.45 * pw})`)
        g.addColorStop(1,    `rgba(${p.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      }
      for (let i = 0; i < pal.cores.length; i++) {
        const c  = pal.cores[i]
        const pw = 0.70 + 0.30 * Math.sin(t * 0.55 + i * 1.5)
        const cx = c.cx * W, cy = c.cy * H
        const r  = c.r * Math.min(W, H)
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,    `rgba(255,255,255,${0.18 * pw})`)
        g.addColorStop(0.15, `rgba(${c.col},${c.a * pw})`)
        g.addColorStop(0.5,  `rgba(${c.col},${c.a * 0.35 * pw})`)
        g.addColorStop(1,    `rgba(${c.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      }
      for (let l = 0; l < pal.wisps.length; l++) {
        const w     = pal.wisps[l]
        const yOff  = (l / pal.wisps.length) * H * 0.8 + H * 0.1
        const amp   = H * 0.09
        const freq  = 0.0025 + l * 0.0006
        const phase = l * 1.4 + t * 0.14
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.3 + l)
        ctx.beginPath()
        for (let x = 0; x <= W; x += 4) {
          const y = yOff
            + amp * Math.sin(x * freq + phase)
            + amp * 0.3 * Math.sin(x * freq * 2.5 + phase * 1.6)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${w.col},${w.a * pulse})`
        ctx.lineWidth   = 1.2; ctx.stroke()
      }
      const pw = 0.5 + 0.5 * Math.sin(t * 0.1)
      const hz = ctx.createRadialGradient(W * .5, H * .45, 0, W * .5, H * .45, Math.max(W, H) * .7)
      hz.addColorStop(0,   `rgba(${pal.pulse},${0.05 + 0.03 * pw})`)
      hz.addColorStop(0.5, `rgba(${pal.pulse},${0.02})`)
      hz.addColorStop(1,   `rgba(${pal.pulse},0)`)
      ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H)
    }

    /* ── main draw loop ── */
    function draw(ts) {
      if (!visible) { raf = null; return }
      if (ts - lastTime < INTERVAL) { raf = requestAnimationFrame(draw); return }
      lastTime = ts
      t += 0.012

      ctx.clearRect(0, 0, W, H)

      if (variant === 'cosmic') {
        /* deep space base */
        ctx.fillStyle = '#020108'
        ctx.fillRect(0, 0, W, H)

        drawBgStars()
        drawNebulaDust()
        drawPlanets()
        drawAsteroids()
        drawComet()
        drawWaves()
        drawFgStars()

      } else if (variant === 'streams' || variant === 'nebula') {
        ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, W, H)
        drawBgStars()
        drawStreams()
        drawFgStars()

      } else {
        const pal = palettes[variant]
        if (pal) {
          ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, W, H)
          drawNebula(pal)
        } else {
          ctx.fillStyle = '#02010a'; ctx.fillRect(0, 0, W, H)
        }
        drawFgStars()
      }

      raf = requestAnimationFrame(draw)
    }

    /* canvas is fixed so it's always visible — just start immediately */
    visible = true
    const timer = setTimeout(() => {
      resize()
      raf = requestAnimationFrame(draw)
    }, 60)

    const onVisibility = () => { visible = !document.hidden }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', resize)
    return () => {
      clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
    }
  }, [variant])

  return (
    <canvas ref={ref} style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      pointerEvents: 'none',
      zIndex: 0,
    }} />
  )
}
