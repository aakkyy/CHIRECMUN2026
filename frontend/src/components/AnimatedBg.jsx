import { useEffect, useRef } from 'react'

export default function AnimatedBg({ variant = 'cosmic' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = 0, H = 0, t = 0, raf = null
    let visible = false, lastTime = 0
    let staticCanvas = null   // pre-rendered bg — only rebuilt on resize
    let fgStars = []          // for non-cosmic variants
    const FPS = 20
    const INTERVAL = 1000 / FPS

    /* ── resize ── */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (variant === 'cosmic') buildCosmicStatic()
      else buildLegacyStars()
    }

    /* ════════════════════════════════════════════
       COSMIC — static bg painted once to offscreen
    ════════════════════════════════════════════ */
    function buildCosmicStatic() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      staticCanvas = document.createElement('canvas')
      staticCanvas.width  = W * dpr
      staticCanvas.height = H * dpr
      const s = staticCanvas.getContext('2d')
      s.setTransform(dpr, 0, 0, dpr, 0, 0)

      /* deep space fill */
      s.fillStyle = '#020108'
      s.fillRect(0, 0, W, H)

      /* ── subtle nebula tint (two soft blobs, no loop) ── */
      const nb1 = s.createRadialGradient(W*0.25, H*0.35, 0, W*0.25, H*0.35, W*0.38)
      nb1.addColorStop(0,   'rgba(60,10,80,0.18)')
      nb1.addColorStop(1,   'rgba(60,10,80,0)')
      s.fillStyle = nb1; s.fillRect(0, 0, W, H)

      const nb2 = s.createRadialGradient(W*0.78, H*0.6, 0, W*0.78, H*0.6, W*0.32)
      nb2.addColorStop(0,   'rgba(10,30,100,0.16)')
      nb2.addColorStop(1,   'rgba(10,30,100,0)')
      s.fillStyle = nb2; s.fillRect(0, 0, W, H)

      /* ── stars — static dots ── */
      const rng = mulberry32(42)  // seeded so they don't shift on resize
      for (let i = 0; i < 220; i++) {
        const x   = rng() * W
        const y   = rng() * H
        const r   = rng() * 1.2 + 0.15
        const a   = rng() * 0.55 + 0.15
        const col = rng() < 0.3 ? '210,180,255' : '220,235,255'
        s.beginPath(); s.arc(x, y, r, 0, Math.PI * 2)
        s.fillStyle = `rgba(${col},${a})`; s.fill()

        /* occasional soft glow around brighter stars */
        if (a > 0.55 && r > 0.9) {
          const g = s.createRadialGradient(x, y, 0, x, y, r * 5)
          g.addColorStop(0, `rgba(${col},0.18)`)
          g.addColorStop(1, `rgba(${col},0)`)
          s.fillStyle = g; s.beginPath(); s.arc(x, y, r * 5, 0, Math.PI * 2); s.fill()
        }
      }

      /* ── Planet 1 — large gas giant, upper-right ── */
      drawStaticPlanet(s, {
        cx: W * 0.84, cy: H * 0.15,
        r:  Math.min(W, H) * 0.052,
        inner: 'rgba(55,25,95,1)', outer: 'rgba(38,18,75,1)',
        mid:   'rgba(95,50,158,1)',
        glowCol: '80,38,145', glowA: 0.20,
        bands: ['rgba(68,32,112,0.35)', 'rgba(98,52,162,0.28)'],
        ring: true, ringCol: '105,60,180', ringA: 0.32, ringTilt: 0.28,
        ringIn: 1.22, ringOut: 2.1,
      })

      /* ── Planet 2 — red rocky, lower-left ── */
      drawStaticPlanet(s, {
        cx: W * 0.10, cy: H * 0.74,
        r:  Math.min(W, H) * 0.026,
        inner: 'rgba(185,52,12,1)', outer: 'rgba(75,18,4,1)',
        mid:   'rgba(210,70,20,1)',
        glowCol: '192,57,43', glowA: 0.22,
        bands: ['rgba(155,42,8,0.30)', 'rgba(220,80,25,0.22)'],
        ring: false,
      })

      /* ── Planet 3 — small ice moon, centre-right ── */
      drawStaticPlanet(s, {
        cx: W * 0.67, cy: H * 0.82,
        r:  Math.min(W, H) * 0.014,
        inner: 'rgba(78,158,228,1)', outer: 'rgba(18,55,115,1)',
        mid:   'rgba(50,115,198,1)',
        glowCol: '86,175,242', glowA: 0.14,
        bands: [],
        ring: false,
      })
    }

    function drawStaticPlanet(s, p) {
      const { cx, cy, r } = p

      /* glow halo */
      const glow = s.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 2.5)
      glow.addColorStop(0, `rgba(${p.glowCol},${p.glowA})`)
      glow.addColorStop(1, `rgba(${p.glowCol},0)`)
      s.fillStyle = glow
      s.beginPath(); s.arc(cx, cy, r * 2.5, 0, Math.PI * 2); s.fill()

      /* body */
      const grad = s.createRadialGradient(cx - r*0.28, cy - r*0.28, r*0.04, cx, cy, r)
      grad.addColorStop(0,   p.inner)
      grad.addColorStop(0.45, p.mid)
      grad.addColorStop(1,   p.outer)
      s.fillStyle = grad
      s.beginPath(); s.arc(cx, cy, r, 0, Math.PI * 2); s.fill()

      /* bands */
      if (p.bands && p.bands.length) {
        s.save(); s.beginPath(); s.arc(cx, cy, r, 0, Math.PI * 2); s.clip()
        for (let b = 0; b < p.bands.length; b++) {
          const by = cy - r + (b + 1) * (r * 2 / (p.bands.length + 1))
          s.fillStyle = p.bands[b]
          s.fillRect(cx - r, by - r * 0.10, r * 2, r * 0.10)
        }
        s.restore()
      }

      /* ring back half */
      if (p.ring) {
        s.save(); s.translate(cx, cy); s.scale(1, p.ringTilt)
        const rg = s.createRadialGradient(0, 0, r * p.ringIn, 0, 0, r * p.ringOut)
        rg.addColorStop(0,   `rgba(${p.ringCol},0)`)
        rg.addColorStop(0.2, `rgba(${p.ringCol},${p.ringA})`)
        rg.addColorStop(0.7, `rgba(${p.ringCol},${p.ringA * 0.5})`)
        rg.addColorStop(1,   `rgba(${p.ringCol},0)`)
        s.beginPath()
        s.arc(0, 0, r * p.ringOut, 0, Math.PI)
        s.arc(0, 0, r * p.ringIn,  Math.PI, 0, true)
        s.closePath(); s.fillStyle = rg; s.globalAlpha = 0.45; s.fill()
        s.restore()

        /* redraw planet body over back ring */
        s.fillStyle = grad
        s.beginPath(); s.arc(cx, cy, r, 0, Math.PI * 2); s.fill()

        /* ring front half */
        s.save(); s.translate(cx, cy); s.scale(1, p.ringTilt)
        s.beginPath()
        s.arc(0, 0, r * p.ringOut, Math.PI, 2 * Math.PI)
        s.arc(0, 0, r * p.ringIn,  2 * Math.PI, Math.PI, true)
        s.closePath(); s.fillStyle = rg; s.globalAlpha = 0.7; s.fill()
        s.restore()
      }

      /* rim highlight */
      const rim = s.createRadialGradient(cx + r*0.55, cy - r*0.48, 0, cx, cy, r)
      rim.addColorStop(0.72, 'rgba(255,255,255,0)')
      rim.addColorStop(0.90, 'rgba(255,255,255,0.09)')
      rim.addColorStop(1,    'rgba(255,255,255,0)')
      s.fillStyle = rim
      s.beginPath(); s.arc(cx, cy, r, 0, Math.PI * 2); s.fill()
    }

    /* seeded PRNG so star positions are stable across re-renders */
    function mulberry32(seed) {
      return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0
        let z = Math.imul(seed ^ seed >>> 15, 1 | seed)
        z = z + Math.imul(z ^ z >>> 7, 61 | z) ^ z
        return ((z ^ z >>> 14) >>> 0) / 4294967296
      }
    }

    /* ── cosmic waves — the ONLY thing animated ── */
    function drawCosmicWaves() {
      const waves = [
        { col: '192,57,43',  yFrac: 0.10, amp: 0.075, freq: 0.0028, speed: 0.14, width: 2.2, alpha: 0.42, ph: 0.00 },
        { col: '231,76,60',  yFrac: 0.28, amp: 0.055, freq: 0.0038, speed: 0.21, width: 1.4, alpha: 0.28, ph: 1.40 },
        { col: '192,57,43',  yFrac: 0.48, amp: 0.096, freq: 0.0023, speed: 0.17, width: 3.0, alpha: 0.45, ph: 2.75 },
        { col: '231,76,60',  yFrac: 0.67, amp: 0.058, freq: 0.0040, speed: 0.26, width: 1.6, alpha: 0.28, ph: 3.30 },
        { col: '192,57,43',  yFrac: 0.86, amp: 0.045, freq: 0.0034, speed: 0.15, width: 1.0, alpha: 0.18, ph: 2.05 },
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
        for (let x = 0; x <= W; x += 6) {
          const y = yBase
            + amp        * Math.sin(x * w.freq + phase)
            + amp * 0.32 * Math.sin(x * w.freq * 2.2 + phase * 1.3 + 0.9)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${w.col},${w.alpha * 0.28})`
        ctx.lineWidth   = w.width * 3.2
        ctx.stroke()
        ctx.strokeStyle = `rgba(${w.col},${w.alpha})`
        ctx.lineWidth   = w.width
        ctx.stroke()
      }
    }

    /* ════════════════════════════════════════════
       LEGACY variants (red / blue / streams / nebula)
       unchanged — used in smaller homepage sections
    ════════════════════════════════════════════ */
    function buildLegacyStars() {
      fgStars = Array.from({ length: 100 }, () => ({
        x:      Math.random() * W,
        y:      Math.random() * H,
        r:      Math.random() * 1.2 + 0.2,
        phase:  Math.random() * Math.PI * 2,
        speed:  Math.random() * 0.5 + 0.2,
        bright: Math.random() < 0.025,
        brightness: Math.random() * 0.5 + 0.5,
        col:    '220,235,255',
      }))
    }

    function drawLegacyStars() {
      for (const s of fgStars) {
        const tw = 0.35 + 0.65 * Math.sin(t * s.speed + s.phase)
        if (s.bright) {
          const sl = s.brightness * 16
          const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.brightness * 12)
          sg.addColorStop(0,   `rgba(${s.col},${0.85 * tw})`)
          sg.addColorStop(0.4, `rgba(${s.col},${0.25 * tw})`)
          sg.addColorStop(1,   `rgba(${s.col},0)`)
          ctx.fillStyle = sg
          ctx.beginPath(); ctx.arc(s.x, s.y, s.brightness * 12, 0, Math.PI * 2); ctx.fill()
          ctx.save(); ctx.globalAlpha = 0.5 * tw
          for (let a = 0; a < 4; a++) {
            const ang = (a / 4) * Math.PI
            const lg  = ctx.createLinearGradient(
              s.x - Math.cos(ang)*sl, s.y - Math.sin(ang)*sl,
              s.x + Math.cos(ang)*sl, s.y + Math.sin(ang)*sl
            )
            lg.addColorStop(0,   `rgba(${s.col},0)`)
            lg.addColorStop(0.5, `rgba(${s.col},0.8)`)
            lg.addColorStop(1,   `rgba(${s.col},0)`)
            ctx.strokeStyle = lg; ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(s.x - Math.cos(ang)*sl, s.y - Math.sin(ang)*sl)
            ctx.lineTo(s.x + Math.cos(ang)*sl, s.y + Math.sin(ang)*sl)
            ctx.stroke()
          }
          ctx.restore()
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.col},${tw * 0.65})`; ctx.fill()
      }
    }

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
      const hz = ctx.createRadialGradient(W*.5, H*.45, 0, W*.5, H*.45, Math.max(W,H)*.7)
      hz.addColorStop(0,   `rgba(${pal.pulse},${0.05 + 0.03 * pw})`)
      hz.addColorStop(0.5, `rgba(${pal.pulse},${0.02})`)
      hz.addColorStop(1,   `rgba(${pal.pulse},0)`)
      ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H)
    }

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

    /* ── main loop ── */
    function draw(ts) {
      if (!visible) { raf = null; return }
      if (ts - lastTime < INTERVAL) { raf = requestAnimationFrame(draw); return }
      lastTime = ts
      t += 0.012

      if (variant === 'cosmic') {
        /* blit pre-rendered static bg — one drawImage call, zero gradients */
        if (staticCanvas) ctx.drawImage(staticCanvas, 0, 0, W, H)
        drawCosmicWaves()

      } else if (variant === 'streams' || variant === 'nebula') {
        ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, W, H)
        drawStreams()
        drawLegacyStars()

      } else {
        const pal = palettes[variant]
        if (pal) {
          ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, W, H)
          drawNebula(pal)
        } else {
          ctx.fillStyle = '#02010a'; ctx.fillRect(0, 0, W, H)
        }
        drawLegacyStars()
      }

      raf = requestAnimationFrame(draw)
    }

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
