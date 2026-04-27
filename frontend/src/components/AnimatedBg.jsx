import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────
   AnimatedBg
   variant: "red"   → deep crimson/amber nebula (Countdown)
            "blue"  → deep teal/indigo nebula  (Secretariat)
            "stars" → plain starfield (fallback)
   ───────────────────────────────────────────────────── */
export default function AnimatedBg({ variant = 'stars' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = 0, H = 0, t = 0, raf
    let stars = []

    /* ── sizing (retina-aware) ── */
    function resize() {
      const p   = canvas.parentElement
      const dpr = window.devicePixelRatio || 1
      const cw  = p.offsetWidth  || window.innerWidth
      const ch  = p.offsetHeight || 600
      canvas.width  = cw * dpr
      canvas.height = ch * dpr
      canvas.style.width  = cw + 'px'
      canvas.style.height = ch + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      W = cw; H = ch
      buildStars()
    }

    /* ── stars ── */
    function buildStars() {
      stars = Array.from({ length: 200 }, () => ({
        x:          Math.random() * W,
        y:          Math.random() * H,
        r:          Math.random() * 1.3 + 0.2,
        phase:      Math.random() * Math.PI * 2,
        speed:      Math.random() * 0.55 + 0.25,
        bright:     Math.random() < 0.035,
        brightness: Math.random() * 0.55 + 0.45,
        col:        '220,235,255',
      }))
    }

    function drawStars() {
      for (const s of stars) {
        const tw = 0.35 + 0.65 * Math.sin(t * s.speed + s.phase)
        if (s.bright) {
          const spikeLen = s.brightness * 20
          const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.brightness * 14)
          sg.addColorStop(0,   `rgba(${s.col},${0.9 * tw})`)
          sg.addColorStop(0.4, `rgba(${s.col},${0.28 * tw})`)
          sg.addColorStop(1,   `rgba(${s.col},0)`)
          ctx.fillStyle = sg
          ctx.beginPath(); ctx.arc(s.x, s.y, s.brightness * 14, 0, Math.PI * 2); ctx.fill()
          ctx.save(); ctx.globalAlpha = 0.55 * tw
          for (let a = 0; a < 4; a++) {
            const ang = (a / 4) * Math.PI
            const lg  = ctx.createLinearGradient(
              s.x - Math.cos(ang) * spikeLen, s.y - Math.sin(ang) * spikeLen,
              s.x + Math.cos(ang) * spikeLen, s.y + Math.sin(ang) * spikeLen
            )
            lg.addColorStop(0,   `rgba(${s.col},0)`)
            lg.addColorStop(0.5, `rgba(${s.col},0.85)`)
            lg.addColorStop(1,   `rgba(${s.col},0)`)
            ctx.strokeStyle = lg; ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(s.x - Math.cos(ang) * spikeLen, s.y - Math.sin(ang) * spikeLen)
            ctx.lineTo(s.x + Math.cos(ang) * spikeLen, s.y + Math.sin(ang) * spikeLen)
            ctx.stroke()
          }
          ctx.restore()
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.col},${tw * 0.7})`; ctx.fill()
      }
    }

    /* ══════════════════════════════════════════
       NEBULA ENGINE
       Each nebula is built from multiple passes:
       1. Background dust (large soft gradients)
       2. Mid-layer cloud pillars
       3. Hot emission cores
       4. Edge wisps
    ══════════════════════════════════════════ */

    /* palette definitions */
    const palettes = {
      red: {
        bg:      '#06010a',
        dust:    [
          { cx: 0.50, cy: 0.42, rx: 0.70, ry: 0.55, col: '110,18,8',   a: 0.32 },
          { cx: 0.25, cy: 0.65, rx: 0.55, ry: 0.40, col: '80,12,6',    a: 0.24 },
          { cx: 0.78, cy: 0.28, rx: 0.50, ry: 0.42, col: '140,30,8',   a: 0.22 },
          { cx: 0.15, cy: 0.25, rx: 0.40, ry: 0.35, col: '60,8,4',     a: 0.18 },
          { cx: 0.88, cy: 0.72, rx: 0.45, ry: 0.38, col: '90,20,6',    a: 0.20 },
        ],
        pillars: [
          { cx: 0.38, cy: 0.50, r: 0.22, col: '192,40,12',  a: 0.28 },
          { cx: 0.62, cy: 0.40, r: 0.18, col: '220,60,15',  a: 0.24 },
          { cx: 0.22, cy: 0.60, r: 0.16, col: '160,30,10',  a: 0.20 },
          { cx: 0.75, cy: 0.65, r: 0.14, col: '180,45,12',  a: 0.18 },
        ],
        cores: [
          { cx: 0.48, cy: 0.45, r: 0.10, col: '255,120,40', a: 0.38 },
          { cx: 0.65, cy: 0.35, r: 0.08, col: '255,90,20',  a: 0.30 },
          { cx: 0.30, cy: 0.58, r: 0.07, col: '255,60,15',  a: 0.26 },
        ],
        wisps: [
          { col: '180,50,15',  a: 0.14 },
          { col: '220,80,20',  a: 0.10 },
          { col: '120,30,8',   a: 0.12 },
          { col: '255,100,30', a: 0.08 },
        ],
        pulse: '192,57,43',
      },
      blue: {
        bg:      '#01050e',
        dust:    [
          { cx: 0.50, cy: 0.45, rx: 0.72, ry: 0.58, col: '8,28,90',    a: 0.32 },
          { cx: 0.22, cy: 0.62, rx: 0.52, ry: 0.42, col: '6,20,70',    a: 0.24 },
          { cx: 0.80, cy: 0.30, rx: 0.48, ry: 0.40, col: '10,35,110',  a: 0.22 },
          { cx: 0.12, cy: 0.22, rx: 0.38, ry: 0.32, col: '5,15,60',    a: 0.18 },
          { cx: 0.90, cy: 0.75, rx: 0.44, ry: 0.36, col: '8,25,80',    a: 0.20 },
        ],
        pillars: [
          { cx: 0.40, cy: 0.48, r: 0.22, col: '20,80,200',   a: 0.28 },
          { cx: 0.60, cy: 0.38, r: 0.18, col: '30,120,220',  a: 0.24 },
          { cx: 0.24, cy: 0.62, r: 0.16, col: '15,60,170',   a: 0.20 },
          { cx: 0.76, cy: 0.66, r: 0.14, col: '25,90,200',   a: 0.18 },
        ],
        cores: [
          { cx: 0.50, cy: 0.44, r: 0.10, col: '86,204,242',  a: 0.42 },
          { cx: 0.63, cy: 0.34, r: 0.08, col: '60,180,255',  a: 0.34 },
          { cx: 0.32, cy: 0.57, r: 0.07, col: '40,150,240',  a: 0.28 },
        ],
        wisps: [
          { col: '30,100,210',  a: 0.14 },
          { col: '60,160,240',  a: 0.10 },
          { col: '15,70,160',   a: 0.12 },
          { col: '86,204,242',  a: 0.08 },
        ],
        pulse: '86,204,242',
      },
    }

    function drawNebula(pal) {
      /* 1. deep background dust — large elliptical gradients */
      for (let i = 0; i < pal.dust.length; i++) {
        const d     = pal.dust[i]
        const pulse = 0.85 + 0.15 * Math.sin(t * 0.18 + i * 1.1)
        ctx.save()
        ctx.translate(d.cx * W, d.cy * H)
        ctx.scale(1, d.ry / d.rx)
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, d.rx * W)
        g.addColorStop(0,   `rgba(${d.col},${d.a * pulse})`)
        g.addColorStop(0.5, `rgba(${d.col},${d.a * 0.45 * pulse})`)
        g.addColorStop(1,   `rgba(${d.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(0, 0, d.rx * W, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }

      /* 2. mid cloud pillars — dense round glows */
      for (let i = 0; i < pal.pillars.length; i++) {
        const p     = pal.pillars[i]
        const pulse = 0.8 + 0.2 * Math.sin(t * 0.28 + i * 0.9 + 1.2)
        // slight drift
        const dx    = Math.sin(t * 0.12 + i * 2.3) * W * 0.012
        const dy    = Math.cos(t * 0.10 + i * 1.7) * H * 0.010
        const cx    = p.cx * W + dx
        const cy    = p.cy * H + dy
        const r     = p.r  * Math.min(W, H)
        const g     = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,    `rgba(${p.col},${p.a * pulse})`)
        g.addColorStop(0.35, `rgba(${p.col},${p.a * 0.55 * pulse})`)
        g.addColorStop(0.70, `rgba(${p.col},${p.a * 0.18 * pulse})`)
        g.addColorStop(1,    `rgba(${p.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      }

      /* 3. hot emission cores — sharp bright centers */
      for (let i = 0; i < pal.cores.length; i++) {
        const c     = pal.cores[i]
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.55 + i * 1.5)
        const dx    = Math.sin(t * 0.08 + i * 3.1) * W * 0.006
        const dy    = Math.cos(t * 0.07 + i * 2.4) * H * 0.006
        const cx    = c.cx * W + dx
        const cy    = c.cy * H + dy
        const r     = c.r * Math.min(W, H)
        const g     = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,    `rgba(255,255,255,${0.22 * pulse})`)
        g.addColorStop(0.12, `rgba(${c.col},${c.a * pulse})`)
        g.addColorStop(0.45, `rgba(${c.col},${c.a * 0.40 * pulse})`)
        g.addColorStop(1,    `rgba(${c.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      }

      /* 4. edge wisps — thin sinusoidal filaments */
      for (let l = 0; l < pal.wisps.length; l++) {
        const w     = pal.wisps[l]
        const yOff  = (l / pal.wisps.length) * H * 0.8 + H * 0.1
        const amp   = H * 0.10
        const freq  = 0.0025 + l * 0.0006
        const phase = l * 1.4 + t * 0.14
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.3 + l)
        ctx.beginPath()
        for (let x = 0; x <= W; x += 3) {
          const y = yOff
            + amp * Math.sin(x * freq + phase)
            + amp * 0.35 * Math.sin(x * freq * 2.5 + phase * 1.6)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${w.col},${w.a * pulse})`
        ctx.lineWidth   = 1.5
        ctx.stroke()
      }

      /* 5. overall haze vignette */
      const haze = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, Math.max(W, H) * 0.72)
      const pulseA = 0.5 + 0.5 * Math.sin(t * 0.1)
      haze.addColorStop(0,   `rgba(${pal.pulse},${0.06 + 0.04 * pulseA})`)
      haze.addColorStop(0.5, `rgba(${pal.pulse},${0.02 + 0.02 * pulseA})`)
      haze.addColorStop(1,   `rgba(${pal.pulse},0)`)
      ctx.fillStyle = haze
      ctx.fillRect(0, 0, W, H)
    }

    /* ── main loop ── */
    function draw() {
      t += 0.006
      ctx.clearRect(0, 0, W, H)

      const pal = palettes[variant]
      if (pal) {
        ctx.fillStyle = pal.bg
        ctx.fillRect(0, 0, W, H)
        drawNebula(pal)
      } else {
        ctx.fillStyle = '#06060f'
        ctx.fillRect(0, 0, W, H)
      }

      drawStars()
      raf = requestAnimationFrame(draw)
    }

    const timer = setTimeout(() => { resize(); draw() }, 60)
    window.addEventListener('resize', resize)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [variant])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}
