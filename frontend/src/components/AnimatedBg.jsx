import { useEffect, useRef } from 'react'

export default function AnimatedBg({ variant = 'stars' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = 0, H = 0, t = 0, raf = null
    let visible = false
    let stars = []
    let lastTime = 0
    const FPS = 24, INTERVAL = 1000 / FPS

    /* ── retina-aware resize ── */
    function resize() {
      const p   = canvas.parentElement
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
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

    function buildStars() {
      stars = Array.from({ length: 120 }, () => ({
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

    function drawStars() {
      for (const s of stars) {
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

    /* ── palette definitions (trimmed for perf) ── */
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
      const cols = ['192,57,43', '231,76,60']
      for (let l = 0; l < 22; l++) {
        const col   = cols[l % 2]
        const yBase = (l / 22) * H
        const amp   = H * 0.10
        const freq  = 0.003 + (l % 5) * 0.0007
        const phase = l * 0.62 + t * 0.18
        const alpha = 0.09 + 0.05 * Math.sin(t * 0.4 + l)
        ctx.beginPath()
        for (let x = 0; x <= W; x += 4) {
          const y = yBase + amp * Math.sin(x * freq + phase) + amp * 0.3 * Math.sin(x * freq * 2.4 + phase * 1.6)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${col},${alpha})`
        ctx.lineWidth   = 1.2; ctx.stroke()
      }
    }

    function draw(ts) {
      if (!visible) { raf = null; return }
      if (ts - lastTime < INTERVAL) { raf = requestAnimationFrame(draw); return }
      lastTime = ts
      t += 0.012

      ctx.clearRect(0, 0, W, H)
      const pal = palettes[variant]
      if (pal) {
        ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, W, H)
        drawNebula(pal)
      } else {
        ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, W, H)
        if (variant === 'streams') drawStreams()
      }
      drawStars()
      raf = requestAnimationFrame(draw)
    }

    /* ── IntersectionObserver: pause when off-screen ── */
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(draw)
    }, { threshold: 0.01 })

    const timer = setTimeout(() => {
      resize()
      observer.observe(canvas.parentElement)
      raf = requestAnimationFrame(draw)
    }, 60)

    window.addEventListener('resize', resize)
    return () => {
      clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [variant])

  return (
    <canvas ref={ref} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  )
}
