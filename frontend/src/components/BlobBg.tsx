/**
 * BlobBg — Aura-themed section backgrounds
 *
 * Each section gets a completely different visual technique:
 *
 *  nebula      (About)       → slow-drifting volumetric color orbs
 *  red         (Countdown)   → cinematic concentric pulse rings + orbiting sparks
 *  secretariat (Secretariat) → refined starfield with red/blue glowing nodes
 *  cta         (CTA)         → radial red-core portal glow that breathes
 *  contact     (Contact)     → floating constellation — dots + connecting lines
 *
 * All share: dark #040002 base + corner red smoke accent
 */

import { useAnimationFrame } from 'framer-motion'
import { useEffect, useRef, memo, type CSSProperties } from 'react'

// ── shared canvas loop — pauses off-screen & on hidden tab ────
function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, W: number, H: number, t: number) => void,
) {
  const ref     = useRef<HTMLCanvasElement>(null)
  const t       = useRef(0)
  const visible = useRef(false)

  useEffect(() => {
    const c = ref.current; if (!c) return
    function resize() {
      const dpr    = Math.min(window.devicePixelRatio || 1, 2)
      c.width      = c.offsetWidth  * dpr
      c.height     = c.offsetHeight * dpr
      const ctx    = c.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)
    const obs = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0 })
    obs.observe(c)
    const onVis = () => { if (document.hidden) visible.current = false }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('resize', resize)
      obs.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  useAnimationFrame((_, dt) => {
    if (!visible.current) return
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    if (!c.width || !c.height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = c.width / dpr, H = c.height / dpr
    t.current += Math.min(dt, 50) * 0.001
    draw(ctx, W, H, t.current)
  })

  return ref
}

const CSS: CSSProperties = {
  position: 'absolute', inset: 0,
  width: '100%', height: '100%',
  pointerEvents: 'none', zIndex: 0,
}

// ─────────────────────────────────────────────────────────────
// ABOUT — Slow-drifting volumetric color orbs
// Large soft gradient blobs, very atmospheric and professional
// ─────────────────────────────────────────────────────────────
const AuraAboutBg = memo(function AuraAboutBg() {
  type Orb = { x: number; y: number; ox: number; oy: number; r: number; red: number; green: number; blue: number; a: number; px: number; py: number; speed: number; phase: number }
  const orbs = useRef<Orb[]>([])

  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (!orbs.current.length) {
      orbs.current = [
        // Large red orb — top left
        { x:0.08, y:0.15, ox:0.08, oy:0.15, r:0.62, red:155, green:5,  blue:5,   a:0.48, px:0.038, py:0.028, speed:0.14, phase:0.0 },
        // Large blue orb — top right
        { x:0.92, y:0.10, ox:0.92, oy:0.10, r:0.55, red:12,  green:40, blue:178, a:0.32, px:0.032, py:0.035, speed:0.11, phase:2.5 },
        // Medium red orb — bottom left
        { x:0.12, y:0.85, ox:0.12, oy:0.85, r:0.44, red:148, green:5,  blue:5,   a:0.38, px:0.044, py:0.022, speed:0.17, phase:5.1 },
        // Medium deep blue — bottom right
        { x:0.88, y:0.80, ox:0.88, oy:0.80, r:0.40, red:10,  green:28, blue:155, a:0.28, px:0.028, py:0.040, speed:0.13, phase:3.4 },
        // Small crimson accent — center
        { x:0.50, y:0.50, ox:0.50, oy:0.50, r:0.28, red:130, green:5,  blue:5,   a:0.18, px:0.022, py:0.018, speed:0.22, phase:1.8 },
      ]
    }

    ctx.fillStyle = '#040002'
    ctx.fillRect(0, 0, W, H)

    for (const o of orbs.current) {
      // Gentle drift using lissajous-style motion
      const x  = (o.ox + Math.sin(t * o.speed + o.phase)        * o.px) * W
      const y  = (o.oy + Math.cos(t * o.speed * 0.73 + o.phase) * o.py) * H
      const rr = o.r * Math.min(W, H) * (0.92 + 0.08 * Math.sin(t * o.speed * 0.5 + o.phase))

      ctx.save()
      const g = ctx.createRadialGradient(x, y, 0, x, y, rr)
      g.addColorStop(0,    `rgba(${o.red},${o.green},${o.blue},${o.a})`)
      g.addColorStop(0.38, `rgba(${o.red},${o.green},${o.blue},${(o.a * 0.42).toFixed(3)})`)
      g.addColorStop(0.72, `rgba(${o.red},${o.green},${o.blue},${(o.a * 0.10).toFixed(3)})`)
      g.addColorStop(1,    `rgba(${o.red},${o.green},${o.blue},0)`)
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    // Subtle center darkening to keep text legible
    const vg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.62)
    vg.addColorStop(0, 'rgba(4,0,2,0.45)')
    vg.addColorStop(1, 'rgba(4,0,2,0)')
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)
  })

  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// COUNTDOWN — Cinematic concentric pulse rings + orbiting sparks
// Deep red rings that emanate from center, very dramatic
// ─────────────────────────────────────────────────────────────
const AuraCountdownBg = memo(function AuraCountdownBg() {
  type Spark = { angle: number; speed: number; radius: number; size: number; phase: number; isBlue: boolean }
  const sparks = useRef<Spark[]>([])

  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (!sparks.current.length) {
      sparks.current = Array.from({ length: 28 }, (_, i) => ({
        angle:  (i / 28) * Math.PI * 2 + Math.random() * 0.4,
        speed:  0.08 + Math.random() * 0.14,
        radius: 0.18 + Math.random() * 0.18,
        size:   1.0  + Math.random() * 1.5,
        phase:  Math.random() * Math.PI * 2,
        isBlue: i % 5 === 0,
      }))
    }

    ctx.fillStyle = '#040002'
    ctx.fillRect(0, 0, W, H)

    const cx = W / 2, cy = H / 2
    const maxR = Math.min(W, H)

    // Corner red smoke (Aura signature)
    ;([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ] as [number, number][]).forEach(([xf, yf], i) => {
      const pulse = 1 + 0.06 * Math.sin(t * 0.18 + i * 1.6)
      const sx = xf * W, sy = yf * H
      const sr = 0.50 * W * pulse
      ctx.save(); ctx.translate(sx, sy); ctx.scale(1, (0.44 * H * pulse) / sr)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, sr)
      g.addColorStop(0,    'rgba(152,5,5,0.62)')
      g.addColorStop(0.35, 'rgba(145,5,5,0.26)')
      g.addColorStop(1,    'rgba(145,5,5,0)')
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, sr, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    })

    // Expanding concentric rings (3 rings at different phases, looped 0→1 over time)
    for (let ri = 0; ri < 3; ri++) {
      const tOff = (t * 0.18 + ri / 3) % 1       // 0→1 endlessly
      const r    = tOff * maxR * 0.62
      const a    = (1 - tOff) * (1 - tOff) * 0.30  // bright at center, fades out

      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(192,57,43,${a.toFixed(3)})`
      ctx.lineWidth = 1.5 - tOff; ctx.stroke()
    }

    // Steady background glow rings
    for (let ri = 0; ri < 4; ri++) {
      const fr   = (ri + 1) / 5
      const r    = fr * maxR * 0.42
      const a    = 0.10 * (0.7 + 0.3 * Math.sin(t * 0.22 + ri * 0.8))
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(192,57,43,${a.toFixed(3)})`
      ctx.lineWidth = 0.8; ctx.stroke()
    }

    // Central core glow
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.22)
    const cp  = 0.85 + 0.15 * Math.sin(t * 0.35)
    cg.addColorStop(0,    `rgba(192,57,43,${(0.22 * cp).toFixed(3)})`)
    cg.addColorStop(0.4,  `rgba(155,5,5,${(0.10 * cp).toFixed(3)})`)
    cg.addColorStop(1,    'rgba(155,5,5,0)')
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, maxR * 0.22, 0, Math.PI * 2); ctx.fill()

    // Orbiting sparks
    for (const s of sparks.current) {
      const ang  = s.angle + t * s.speed
      const r    = s.radius * maxR * 0.5
      const px   = cx + Math.cos(ang) * r
      const py   = cy + Math.sin(ang) * r
      const a    = (0.55 + 0.45 * Math.sin(t * 1.4 + s.phase)) * 0.70
      const col  = s.isBlue ? '86,180,242' : '220,70,50'
      ctx.beginPath(); ctx.arc(px, py, s.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${col},${a.toFixed(3)})`; ctx.fill()
    }
  })

  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// SECRETARIAT — Refined starfield with colored glowing nodes
// Minimal and elegant — red/blue stars drift slowly
// ─────────────────────────────────────────────────────────────
const AuraSecretariatBg = memo(function AuraSecretariatBg() {
  type Star = { x: number; y: number; vx: number; vy: number; r: number; a: number; cr: number; cg: number; cb: number; glow: boolean; phase: number }
  const stars = useRef<Star[]>([])
  const prevW = useRef(0), prevH = useRef(0)

  function init(W: number, H: number) {
    const PALS = [
      [231, 76, 60], [192, 57, 43], [255, 110, 90],  // reds
      [86, 200, 240], [42, 155, 215], [60, 180, 255], // blues
      [240, 240, 255],                                  // white
    ]
    stars.current = Array.from({ length: 130 }, (_, i) => {
      const isGlow = i < 22
      const col    = isGlow
        ? (i < 12 ? PALS[Math.floor(Math.random() * 3)] : PALS[3 + Math.floor(Math.random() * 3)])
        : PALS[Math.floor(Math.random() * PALS.length)]
      return {
        x:     Math.random() * W, y: Math.random() * H,
        vx:    (Math.random() - 0.5) * 0.06,
        vy:    (Math.random() - 0.5) * 0.05,
        r:     isGlow ? 1.5 + Math.random() * 1.4 : 0.3 + Math.random() * 0.9,
        a:     isGlow ? 0.80 + Math.random() * 0.20 : 0.18 + Math.random() * 0.45,
        cr: col[0], cg: col[1], cb: col[2],
        glow:  isGlow,
        phase: Math.random() * Math.PI * 2,
      }
    })
  }

  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (W !== prevW.current || H !== prevH.current) { init(W, H); prevW.current = W; prevH.current = H }

    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    // Subtle corner smoke
    ;([[0,0],[1,0],[0,1],[1,1]] as [number,number][]).forEach(([xf,yf], i) => {
      const sx = xf * W, sy = yf * H
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, W * 0.42)
      g.addColorStop(0, `rgba(148,5,5,0.42)`)
      g.addColorStop(1, 'rgba(148,5,5,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    })

    const ss = stars.current
    for (const s of ss) {
      s.x += s.vx; s.y += s.vy
      if (s.x < -6) s.x = W + 6; if (s.x > W + 6) s.x = -6
      if (s.y < -6) s.y = H + 6; if (s.y > H + 6) s.y = -6

      const pulse = 0.70 + 0.30 * Math.sin(t * 0.85 + s.phase)

      if (s.glow) {
        // Soft glow halo
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 8 * pulse)
        hg.addColorStop(0,    `rgba(${s.cr},${s.cg},${s.cb},${(0.22 * pulse).toFixed(3)})`)
        hg.addColorStop(1,    `rgba(${s.cr},${s.cg},${s.cb},0)`)
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 8 * pulse, 0, Math.PI * 2); ctx.fill()

        // 4-point diffraction spike (short, elegant)
        const sl = s.r * 10 * pulse
        ctx.save(); ctx.globalAlpha = 0.55 * pulse
        for (let a = 0; a < 2; a++) {
          const ang = (a / 2) * Math.PI
          const lg = ctx.createLinearGradient(
            s.x - Math.cos(ang)*sl, s.y - Math.sin(ang)*sl,
            s.x + Math.cos(ang)*sl, s.y + Math.sin(ang)*sl,
          )
          lg.addColorStop(0, `rgba(${s.cr},${s.cg},${s.cb},0)`)
          lg.addColorStop(0.5, `rgba(${s.cr},${s.cg},${s.cb},0.90)`)
          lg.addColorStop(1, `rgba(${s.cr},${s.cg},${s.cb},0)`)
          ctx.strokeStyle = lg; ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(s.x - Math.cos(ang)*sl, s.y - Math.sin(ang)*sl)
          ctx.lineTo(s.x + Math.cos(ang)*sl, s.y + Math.sin(ang)*sl)
          ctx.stroke()
        }
        ctx.restore()
      }

      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${s.cr},${s.cg},${s.cb},${(s.a * pulse).toFixed(3)})`; ctx.fill()
    }
  })

  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// CTA — Radial red-core portal glow that breathes
// Very commanding — one strong visual idea, executed cleanly
// ─────────────────────────────────────────────────────────────
const AuraCTABg = memo(function AuraCTABg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    const cx = W / 2, cy = H * 0.5
    const maxR = Math.min(W, H)

    // Heavy corner smoke (CTA should feel intense)
    ;([[0,0],[1,0],[0,1],[1,1]] as [number,number][]).forEach(([xf,yf], i) => {
      const pulse = 1 + 0.07 * Math.sin(t * 0.20 + i * 1.8)
      const sx = xf * W, sy = yf * H
      const sr = 0.60 * W * pulse
      ctx.save(); ctx.translate(sx, sy); ctx.scale(1, (0.52 * H * pulse) / sr)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, sr)
      g.addColorStop(0,    'rgba(155,5,5,0.72)')
      g.addColorStop(0.30, 'rgba(145,5,5,0.32)')
      g.addColorStop(1,    'rgba(145,5,5,0)')
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, sr, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    })

    // Blue side accents
    ;([[0,0.5],[1,0.5]] as [number,number][]).forEach(([xf,yf]) => {
      const g = ctx.createRadialGradient(xf * W, yf * H, 0, xf * W, yf * H, W * 0.30)
      g.addColorStop(0, 'rgba(12,38,175,0.28)')
      g.addColorStop(1, 'rgba(12,38,175,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    })

    // Central breathing radial glow
    const breathe  = 0.82 + 0.18 * Math.sin(t * 0.28)
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.55 * breathe)
    coreGrad.addColorStop(0,    `rgba(220,60,40,${(0.28 * breathe).toFixed(3)})`)
    coreGrad.addColorStop(0.30, `rgba(180,20,10,${(0.16 * breathe).toFixed(3)})`)
    coreGrad.addColorStop(0.65, `rgba(148,5,5,${(0.06 * breathe).toFixed(3)})`)
    coreGrad.addColorStop(1,    'rgba(148,5,5,0)')
    ctx.fillStyle = coreGrad; ctx.fillRect(0, 0, W, H)

    // 3 concentric ring accents at different radii
    for (let ri = 0; ri < 3; ri++) {
      const fr  = (ri + 1) / 4
      const r   = fr * maxR * 0.48 * (0.94 + 0.06 * Math.sin(t * 0.22 + ri * 1.1))
      const a   = 0.14 * Math.sin(fr * Math.PI) * (0.72 + 0.28 * Math.sin(t * 0.30 + ri * 0.9))
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(200,55,35,${a.toFixed(3)})`
      ctx.lineWidth = 0.8; ctx.stroke()
    }
  })

  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// CONTACT — Floating constellation network
// Elegant dots + connecting lines, red/blue palette
// ─────────────────────────────────────────────────────────────
const AuraContactBg = memo(function AuraContactBg() {
  type Node = { x: number; y: number; vx: number; vy: number; r: number; cr: number; cg: number; cb: number; phase: number }
  const nodes = useRef<Node[]>([])
  const prevW = useRef(0), prevH = useRef(0)

  function init(W: number, H: number) {
    const REDS  = [[192,57,43],[231,76,60],[210,65,45]]
    const BLUES = [[86,200,240],[42,155,215],[14,40,178]]
    nodes.current = Array.from({ length: 42 }, (_, i) => {
      const col = i % 3 === 0
        ? BLUES[Math.floor(Math.random() * 3)]
        : REDS[Math.floor(Math.random() * 3)]
      return {
        x:     Math.random() * W, y: Math.random() * H,
        vx:    (Math.random() - 0.5) * 0.22,
        vy:    (Math.random() - 0.5) * 0.16,
        r:     1.2 + Math.random() * 1.6,
        cr: col[0], cg: col[1], cb: col[2],
        phase: Math.random() * Math.PI * 2,
      }
    })
  }

  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (W !== prevW.current || H !== prevH.current) { init(W, H); prevW.current = W; prevH.current = H }

    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    // Subtle corner smoke
    ;([[0,0],[1,1]] as [number,number][]).forEach(([xf,yf]) => {
      const g = ctx.createRadialGradient(xf*W, yf*H, 0, xf*W, yf*H, W * 0.44)
      g.addColorStop(0, 'rgba(148,5,5,0.38)'); g.addColorStop(1, 'rgba(148,5,5,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    })
    ;([[1,0],[0,1]] as [number,number][]).forEach(([xf,yf]) => {
      const g = ctx.createRadialGradient(xf*W, yf*H, 0, xf*W, yf*H, W * 0.38)
      g.addColorStop(0, 'rgba(12,38,172,0.22)'); g.addColorStop(1, 'rgba(12,38,172,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    })

    const ns = nodes.current
    const maxD = Math.min(W, H) * 0.20

    for (const n of ns) {
      n.x += n.vx; n.y += n.vy
      if (n.x < -8) n.x = W+8; if (n.x > W+8) n.x = -8
      if (n.y < -8) n.y = H+8; if (n.y > H+8) n.y = -8
    }

    // Connection lines
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i], b = ns[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist > maxD) continue
        const alpha = (1 - dist / maxD) * 0.26 * (0.7 + 0.3 * Math.sin(t * 1.2 + i * 0.3))
        const cr = (a.cr + b.cr) >> 1, cg = (a.cg + b.cg) >> 1, cb = (a.cb + b.cb) >> 1
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`
        ctx.lineWidth = 0.7; ctx.stroke()
      }
    }

    // Node dots
    for (const n of ns) {
      const pulse = 0.75 + 0.25 * Math.sin(t * 1.1 + n.phase)
      // Subtle glow behind each node
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5 * pulse, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${n.cr},${n.cg},${n.cb},${(0.06 * pulse).toFixed(3)})`; ctx.fill()
      // Node dot
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${n.cr},${n.cg},${n.cb},${(0.65 * pulse).toFixed(3)})`; ctx.fill()
    }
  })

  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
interface BlobBgProps { variant?: 'nebula' | 'red' | 'cta' | 'contact' | 'secretariat' }

export default function BlobBg({ variant = 'nebula' }: BlobBgProps) {
  if (variant === 'red')         return <AuraCountdownBg />
  if (variant === 'cta')         return <AuraCTABg />
  if (variant === 'contact')     return <AuraContactBg />
  if (variant === 'secretariat') return <AuraSecretariatBg />
  return <AuraAboutBg />
}
