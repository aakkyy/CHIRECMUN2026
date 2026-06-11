/**
 * BlobBg — Aura-themed section backgrounds
 *
 * ZERO space/galaxy/star imagery. Everything is atmospheric light, color, and energy.
 *
 *  nebula      (About)       → slow-drifting volumetric color orbs (atmospheric halos)
 *  red         (Countdown)   → diagonal light shafts fanning from top corners
 *  secretariat (Secretariat) → flowing curved light ribbons crossing the canvas
 *  cta         (CTA)         → radial red-core glow that breathes
 *  contact     (Contact)     → smooth morphing gradient color field
 */

import { useAnimationFrame } from 'framer-motion'
import { useEffect, useRef, memo, type CSSProperties } from 'react'

// ── shared canvas loop — pauses off-screen & on hidden tab ─────
function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, W: number, H: number, t: number) => void,
) {
  const ref       = useRef<HTMLCanvasElement>(null)
  const t         = useRef(0)
  const visible   = useRef(false)
  const lastFrame = useRef(0)

  useEffect(() => {
    const c = ref.current; if (!c) return
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width   = c.offsetWidth  * dpr
      c.height  = c.offsetHeight * dpr
      const ctx = c.getContext('2d')
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

  useAnimationFrame((time, dt) => {
    if (time - lastFrame.current < 50) return   // ~20fps cap for section backgrounds
    lastFrame.current = time
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

// Helper: draw corner smoke cloud
function drawCornerSmoke(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  xf: number, yf: number, r: number, g: number, b: number,
  alpha: number, radiusFrac: number
) {
  const sx = xf * W, sy = yf * H, sr = radiusFrac * W
  ctx.save(); ctx.translate(sx, sy); ctx.scale(1, (radiusFrac * 0.85 * H) / sr)
  const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, sr)
  gr.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
  gr.addColorStop(0.35, `rgba(${r},${g},${b},${(alpha * 0.42).toFixed(3)})`)
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, sr, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
}

// ─────────────────────────────────────────────────────────────
// ABOUT — Slow-drifting volumetric color orbs
// Large soft gradient halos — atmospheric, not space
// ─────────────────────────────────────────────────────────────
type Orb = { ox: number; oy: number; r: number; cr: number; cg: number; cb: number; a: number; px: number; py: number; speed: number; phase: number }

const AuraAboutBg = memo(function AuraAboutBg() {
  const orbs = useRef<Orb[]>([])

  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (!orbs.current.length) {
      orbs.current = [
        { ox:0.08, oy:0.15, r:0.62, cr:155, cg:5,  cb:5,   a:0.48, px:0.038, py:0.028, speed:0.14, phase:0.0 },
        { ox:0.92, oy:0.10, r:0.55, cr:12,  cg:40, cb:178, a:0.32, px:0.032, py:0.035, speed:0.11, phase:2.5 },
        { ox:0.12, oy:0.85, r:0.44, cr:148, cg:5,  cb:5,   a:0.38, px:0.044, py:0.022, speed:0.17, phase:5.1 },
        { ox:0.88, oy:0.80, r:0.40, cr:10,  cg:28, cb:155, a:0.28, px:0.028, py:0.040, speed:0.13, phase:3.4 },
        { ox:0.50, oy:0.50, r:0.28, cr:130, cg:5,  cb:5,   a:0.18, px:0.022, py:0.018, speed:0.22, phase:1.8 },
      ]
    }

    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    for (const o of orbs.current) {
      const x  = (o.ox + Math.sin(t * o.speed + o.phase)        * o.px) * W
      const y  = (o.oy + Math.cos(t * o.speed * 0.73 + o.phase) * o.py) * H
      const rr = o.r * Math.min(W, H) * (0.92 + 0.08 * Math.sin(t * o.speed * 0.5 + o.phase))
      ctx.save()
      const g = ctx.createRadialGradient(x, y, 0, x, y, rr)
      g.addColorStop(0,    `rgba(${o.cr},${o.cg},${o.cb},${o.a})`)
      g.addColorStop(0.38, `rgba(${o.cr},${o.cg},${o.cb},${(o.a * 0.42).toFixed(3)})`)
      g.addColorStop(0.72, `rgba(${o.cr},${o.cg},${o.cb},${(o.a * 0.10).toFixed(3)})`)
      g.addColorStop(1,    `rgba(${o.cr},${o.cg},${o.cb},0)`)
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    const vg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.62)
    vg.addColorStop(0, 'rgba(4,0,2,0.45)'); vg.addColorStop(1, 'rgba(4,0,2,0)')
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)
  })

  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// COUNTDOWN — Vortex energy field
// Rotating radial plasma lines + counter-rotating outer ring,
// pulsing elliptical energy rings, breathing crimson core,
// heavy corner smoke and a subtle scanline interference texture.
// Industrial, physical electromagnetic energy — NOT space.
// ─────────────────────────────────────────────────────────────
const AuraCountdownBg = memo(function AuraCountdownBg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    const cx = W / 2, cy = H / 2
    const minDim = Math.min(W, H)

    // ── 4. Heavy corner smoke — red on top, deep blue below ──
    drawCornerSmoke(ctx, W, H, 0, 0, 155, 5, 5, 0.72, 0.56)
    drawCornerSmoke(ctx, W, H, 1, 0, 148, 5, 5, 0.66, 0.52)
    drawCornerSmoke(ctx, W, H, 0, 1, 10, 28, 150, 0.48, 0.48)
    drawCornerSmoke(ctx, W, H, 1, 1, 12, 38, 172, 0.52, 0.50)

    // ── 5. Breathing central core — deep crimson, slow pulse ──
    const breathe = 0.9 + 0.1 * Math.sin(t * 0.30)            // 0.8–1.0 scale
    const coreR = minDim * 0.62 * breathe
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
    core.addColorStop(0,    `rgba(190,30,18,${(0.26 * breathe).toFixed(3)})`)
    core.addColorStop(0.35, `rgba(155,10,8,${(0.14 * breathe).toFixed(3)})`)
    core.addColorStop(0.70, `rgba(120,5,5,${(0.05 * breathe).toFixed(3)})`)
    core.addColorStop(1,    'rgba(120,5,5,0)')
    ctx.fillStyle = core; ctx.fillRect(0, 0, W, H)

    // ── 1. Rotating radial energy lines — 48 deep-red lines ──
    const innerLen = minDim * 0.62
    const innerRot = t * 0.10
    ctx.save()
    ctx.translate(cx, cy)
    ctx.lineWidth = 1
    for (let i = 0; i < 48; i++) {
      const base = (i / 48) * Math.PI * 2
      // mild individual phase offsets — lines spin together but breathe apart
      const ang = base + innerRot + 0.06 * Math.sin(t * 0.14 + i * 0.7)
      const a = 0.16 * (0.55 + 0.45 * Math.sin(t * 0.45 + i * 1.31))
      if (a < 0.012) continue
      const ca = Math.cos(ang), sa = Math.sin(ang)
      const len = innerLen * (0.88 + 0.12 * Math.sin(t * 0.18 + i * 0.5))
      const grd = ctx.createLinearGradient(ca * minDim * 0.04, sa * minDim * 0.04, ca * len, sa * len)
      grd.addColorStop(0,    `rgba(200,45,28,${a.toFixed(3)})`)
      grd.addColorStop(0.45, `rgba(170,25,15,${(a * 0.45).toFixed(3)})`)
      grd.addColorStop(1,    'rgba(150,10,8,0)')
      ctx.strokeStyle = grd
      ctx.beginPath()
      ctx.moveTo(ca * minDim * 0.04, sa * minDim * 0.04)
      ctx.lineTo(ca * len, sa * len)
      ctx.stroke()
    }
    ctx.restore()

    // ── 2. Counter-rotating outer ring — 32 shorter blue lines ──
    const outerR0 = minDim * 0.58
    const outerR1 = minDim * 0.86
    const outerRot = -t * 0.14
    ctx.save()
    ctx.translate(cx, cy)
    ctx.lineWidth = 1
    for (let i = 0; i < 32; i++) {
      const base = (i / 32) * Math.PI * 2
      const ang = base + outerRot + 0.05 * Math.sin(t * 0.12 + i * 0.9)
      const a = 0.13 * (0.55 + 0.45 * Math.sin(t * 0.52 + i * 1.77))
      if (a < 0.012) continue
      const ca = Math.cos(ang), sa = Math.sin(ang)
      const grd = ctx.createLinearGradient(ca * outerR0, sa * outerR0, ca * outerR1, sa * outerR1)
      grd.addColorStop(0,    `rgba(40,80,200,${a.toFixed(3)})`)
      grd.addColorStop(0.5,  `rgba(20,50,175,${(a * 0.55).toFixed(3)})`)
      grd.addColorStop(1,    'rgba(12,38,172,0)')
      ctx.strokeStyle = grd
      ctx.beginPath()
      ctx.moveTo(ca * outerR0, sa * outerR0)
      ctx.lineTo(ca * outerR1, sa * outerR1)
      ctx.stroke()
    }
    ctx.restore()

    // ── 3. Glowing elliptical energy rings — 3 crimson ellipses ──
    for (let ri = 0; ri < 3; ri++) {
      const baseR = minDim * (0.26 + ri * 0.16)
      const r = baseR * (0.94 + 0.06 * Math.sin(t * 0.18 + ri * 1.6))
      const a = 0.16 * (0.6 + 0.4 * Math.sin(t * 0.24 + ri * 2.1))
      const rot = Math.sin(t * 0.08 + ri * 0.8) * 0.10
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      ctx.scale(1, 0.6)                                       // ground-level squish
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(200,50,32,${a.toFixed(3)})`
      ctx.lineWidth = 1.2
      ctx.stroke()
      // soft outer glow pass
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(192,35,20,${(a * 0.30).toFixed(3)})`
      ctx.lineWidth = 5
      ctx.stroke()
      ctx.restore()
    }

    // ── 6. Scanline interference texture — subtle CRT depth ──
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.06)'
    for (let y = 0; y < H; y += 8) ctx.fillRect(0, y, W, 4)
    ctx.restore()

    // Center vignette to keep countdown numbers readable
    const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.58)
    vg.addColorStop(0, 'rgba(4,0,2,0.50)'); vg.addColorStop(1, 'rgba(4,0,2,0)')
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)
  })

  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// SECRETARIAT — Flowing curved light ribbons
// 4 bezier-path ribbons that drift slowly across the full width
// Elegant and refined — completely different from every other section
// ─────────────────────────────────────────────────────────────
const AuraSecretariatBg = memo(function AuraSecretariatBg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    // Corner smoke — diagonal placement: red top-left + bottom-right, blue top-right + bottom-left
    drawCornerSmoke(ctx, W, H, 0, 0, 148, 5, 5, 0.60, 0.50)
    drawCornerSmoke(ctx, W, H, 1, 1, 148, 5, 5, 0.55, 0.48)
    drawCornerSmoke(ctx, W, H, 1, 0, 12, 38, 172, 0.42, 0.44)
    drawCornerSmoke(ctx, W, H, 0, 1, 12, 38, 172, 0.38, 0.42)

    // Each ribbon: defined by base control points + slow drift parameters
    const ribbonDefs = [
      // Main crimson ribbon — sweeps bottom-left to top-right
      { basePts: [0.00, 0.72, 0.28, 0.15, 0.72, 0.88, 1.00, 0.28] as const,
        cr: 192, cg: 35, cb: 20, maxA: 0.52, lineW: 3.8, glowW: 22,
        driftAmp: 0.055, speed: 0.10, phase: 0.0 },
      // Deep blue ribbon — sweeps top-left to bottom-right
      { basePts: [0.00, 0.25, 0.32, 0.78, 0.68, 0.18, 1.00, 0.68] as const,
        cr: 14, cg: 40, cb: 178, maxA: 0.44, lineW: 3.2, glowW: 18,
        driftAmp: 0.048, speed: 0.08, phase: 2.6 },
      // Thin red accent — nearly horizontal through middle
      { basePts: [0.00, 0.48, 0.38, 0.62, 0.62, 0.35, 1.00, 0.52] as const,
        cr: 160, cg: 10, cb: 8, maxA: 0.36, lineW: 2.2, glowW: 14,
        driftAmp: 0.040, speed: 0.12, phase: 5.1 },
      // Thin blue accent — near bottom
      { basePts: [0.00, 0.82, 0.40, 0.55, 0.60, 0.90, 1.00, 0.60] as const,
        cr: 12, cg: 35, cb: 165, maxA: 0.30, lineW: 1.8, glowW: 12,
        driftAmp: 0.035, speed: 0.09, phase: 3.8 },
    ]

    for (const rib of ribbonDefs) {
      const [bx0, by0, bcp1x, bcp1y, bcp2x, bcp2y, bx3, by3] = rib.basePts
      const d = rib.driftAmp, spd = rib.speed, ph = rib.phase

      // Drift each control point independently
      const x0   = (bx0   + Math.sin(t * spd + ph)          * d * 0.3) * W
      const y0   = (by0   + Math.cos(t * spd * 0.7 + ph)    * d * 0.5) * H
      const cp1x = (bcp1x + Math.sin(t * spd + ph + 1.2)    * d)       * W
      const cp1y = (bcp1y + Math.cos(t * spd * 0.8 + ph)    * d)       * H
      const cp2x = (bcp2x + Math.sin(t * spd * 0.9 + ph + 2.4) * d)    * W
      const cp2y = (bcp2y + Math.cos(t * spd + ph + 3.1)    * d)       * H
      const x3   = (bx3   + Math.sin(t * spd * 0.6 + ph)   * d * 0.3) * W
      const y3   = (by3   + Math.cos(t * spd + ph + 4.2)   * d * 0.5) * H

      const pulse = rib.maxA * (0.72 + 0.28 * Math.sin(t * spd + ph))

      // Gradient along the ribbon (start/end fade, bright middle)
      const grd = ctx.createLinearGradient(x0, y0, x3, y3)
      grd.addColorStop(0,    `rgba(${rib.cr},${rib.cg},${rib.cb},0)`)
      grd.addColorStop(0.15, `rgba(${rib.cr},${rib.cg},${rib.cb},${(pulse * 0.60).toFixed(3)})`)
      grd.addColorStop(0.50, `rgba(${rib.cr},${rib.cg},${rib.cb},${pulse.toFixed(3)})`)
      grd.addColorStop(0.85, `rgba(${rib.cr},${rib.cg},${rib.cb},${(pulse * 0.60).toFixed(3)})`)
      grd.addColorStop(1,    `rgba(${rib.cr},${rib.cg},${rib.cb},0)`)

      // Outer glow (wide, soft)
      ctx.beginPath()
      ctx.moveTo(x0, y0); ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x3, y3)
      const glowGrd = ctx.createLinearGradient(x0, y0, x3, y3)
      glowGrd.addColorStop(0,    `rgba(${rib.cr},${rib.cg},${rib.cb},0)`)
      glowGrd.addColorStop(0.50, `rgba(${rib.cr},${rib.cg},${rib.cb},${(pulse * 0.14).toFixed(3)})`)
      glowGrd.addColorStop(1,    `rgba(${rib.cr},${rib.cg},${rib.cb},0)`)
      ctx.strokeStyle = glowGrd; ctx.lineWidth = rib.glowW; ctx.stroke()

      // Core bright line
      ctx.beginPath()
      ctx.moveTo(x0, y0); ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x3, y3)
      ctx.strokeStyle = grd; ctx.lineWidth = rib.lineW; ctx.stroke()
    }
  })

  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// CTA — Radial red-core portal glow that breathes
// Commanding and dramatic — one idea executed hard
// ─────────────────────────────────────────────────────────────
const AuraCTABg = memo(function AuraCTABg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    const cx = W / 2, cy = H * 0.5
    const maxR = Math.min(W, H)

    // Heavy corner smoke
    drawCornerSmoke(ctx, W, H, 0, 0, 155, 5, 5, 0.72, 0.60)
    drawCornerSmoke(ctx, W, H, 1, 0, 148, 5, 5, 0.65, 0.56)
    drawCornerSmoke(ctx, W, H, 0, 1, 148, 5, 5, 0.62, 0.54)
    drawCornerSmoke(ctx, W, H, 1, 1, 155, 5, 5, 0.68, 0.58)

    // Blue side accents
    ;([[0, 0.5], [1, 0.5]] as [number, number][]).forEach(([xf, yf]) => {
      const g = ctx.createRadialGradient(xf * W, yf * H, 0, xf * W, yf * H, W * 0.30)
      g.addColorStop(0, 'rgba(12,38,175,0.28)'); g.addColorStop(1, 'rgba(12,38,175,0)')
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

    // 3 concentric ring accents
    for (let ri = 0; ri < 3; ri++) {
      const fr = (ri + 1) / 4
      const r  = fr * maxR * 0.48 * (0.94 + 0.06 * Math.sin(t * 0.22 + ri * 1.1))
      const a  = 0.14 * Math.sin(fr * Math.PI) * (0.72 + 0.28 * Math.sin(t * 0.30 + ri * 0.9))
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(200,55,35,${a.toFixed(3)})`
      ctx.lineWidth = 0.8; ctx.stroke()
    }
  })

  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// CONTACT — Smooth morphing gradient color field
// No discrete objects — pure color wash that shifts slowly
// Like aurora light seen through frosted glass
// ─────────────────────────────────────────────────────────────
const AuraContactBg = memo(function AuraContactBg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    // 5 large slow-moving color blobs — but MORE of them, closer together,
    // creating a smooth continuously-morphing color field with no visible objects
    const blobs = [
      { oxf:0.12, oyf:0.20, rxf:0.80, ryf:0.65, cr:155, cg:5,  cb:5,   a:0.32, spd:0.12, ph:0.0 },
      { oxf:0.88, oyf:0.15, rxf:0.70, ryf:0.55, cr:12,  cg:38, cb:175, a:0.24, spd:0.09, ph:2.8 },
      { oxf:0.50, oyf:0.60, rxf:0.90, ryf:0.70, cr:148, cg:5,  cb:5,   a:0.22, spd:0.15, ph:5.2 },
      { oxf:0.20, oyf:0.80, rxf:0.65, ryf:0.55, cr:14,  cg:40, cb:172, a:0.20, spd:0.11, ph:1.6 },
      { oxf:0.80, oyf:0.75, rxf:0.60, ryf:0.50, cr:140, cg:5,  cb:5,   a:0.25, spd:0.13, ph:3.9 },
      { oxf:0.50, oyf:0.25, rxf:0.75, ryf:0.60, cr:10,  cg:32, cb:162, a:0.18, spd:0.10, ph:6.4 },
    ]

    for (const b of blobs) {
      // Smooth lissajous drift for each blob center
      const cx = (b.oxf + Math.sin(t * b.spd + b.ph)          * 0.12) * W
      const cy = (b.oyf + Math.cos(t * b.spd * 0.77 + b.ph)   * 0.10) * H
      const rx = b.rxf * W * (0.90 + 0.10 * Math.sin(t * b.spd * 0.6 + b.ph))
      const ry = b.ryf * H * (0.90 + 0.10 * Math.cos(t * b.spd * 0.5 + b.ph))
      const alpha = b.a * (0.75 + 0.25 * Math.sin(t * b.spd + b.ph))

      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(rx / Math.min(rx, ry), ry / Math.min(rx, ry))
      const r = Math.min(rx, ry)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
      g.addColorStop(0,    `rgba(${b.cr},${b.cg},${b.cb},${alpha.toFixed(3)})`)
      g.addColorStop(0.40, `rgba(${b.cr},${b.cg},${b.cb},${(alpha * 0.38).toFixed(3)})`)
      g.addColorStop(0.75, `rgba(${b.cr},${b.cg},${b.cb},${(alpha * 0.08).toFixed(3)})`)
      g.addColorStop(1,    `rgba(${b.cr},${b.cg},${b.cb},0)`)
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    // Center vignette — keeps form legible
    const vg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.65)
    vg.addColorStop(0, 'rgba(4,0,2,0.50)'); vg.addColorStop(1, 'rgba(4,0,2,0)')
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)
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
