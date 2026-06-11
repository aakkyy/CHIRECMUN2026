/**
 * BlobBg — Aura-themed section backgrounds
 *
 * Every variant shares:
 *   1. Dark base (#040002)
 *   2. Animated red/blue volumetric smoke clouds
 *   3. A unique white mesh pattern — different per section
 *
 * Variants:
 *   nebula      (About)       → diagonal flowing ribbon mesh
 *   red         (Countdown)   → sinusoidal horizontal wave mesh
 *   secretariat (Secretariat) → vertical curtain pillar mesh
 *   cta         (CTA)         → radial convergent lines + elliptic rings
 *   contact     (Contact)     → sine-distorted fabric grid
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

// ── shared smoke cloud helper ─────────────────────────────────
type Cloud = {
  xf: number; yf: number
  rx: number; ry: number
  r: number; g: number; b: number
  a: number; phase: number; spd: number; sAmp: number
}

function drawSmoke(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, clouds: Cloud[]) {
  for (const c of clouds) {
    const pulse = 1 + Math.sin(t * c.spd + c.phase) * c.sAmp
    const cx = c.xf * W, cy = c.yf * H
    const rx = c.rx * W * pulse, ry = c.ry * H * pulse
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(rx / ry, 1)
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry)
    g.addColorStop(0,    `rgba(${c.r},${c.g},${c.b},${c.a})`)
    g.addColorStop(0.32, `rgba(${c.r},${c.g},${c.b},${(c.a * 0.50).toFixed(3)})`)
    g.addColorStop(0.68, `rgba(${c.r},${c.g},${c.b},${(c.a * 0.14).toFixed(3)})`)
    g.addColorStop(1,    `rgba(${c.r},${c.g},${c.b},0)`)
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(0, 0, ry, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  }
}

// ── shared center vignette ────────────────────────────────────
function drawVignette(ctx: CanvasRenderingContext2D, W: number, H: number, alpha = 0.60) {
  const vg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.72)
  vg.addColorStop(0,    `rgba(4,0,2,${alpha})`)
  vg.addColorStop(0.45, `rgba(4,0,2,${(alpha * 0.44).toFixed(3)})`)
  vg.addColorStop(1,    'rgba(4,0,2,0)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, W, H)
}

const MESH_COL = '242,234,222'
const CSS: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }

// ─────────────────────────────────────────────────────────────
// ABOUT — Diagonal Flowing Ribbon Mesh
// Three diagonal ribbon strips at ~58°, each flowing gently
// ─────────────────────────────────────────────────────────────
const AuraAboutBg = memo(function AuraAboutBg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    drawSmoke(ctx, W, H, t, [
      { xf:0.0, yf:0.0, rx:0.52, ry:0.44, r:155, g:5,  b:5,   a:0.62, phase:0.0, spd:0.18, sAmp:0.06 },
      { xf:1.0, yf:1.0, rx:0.50, ry:0.44, r:148, g:5,  b:5,   a:0.58, phase:2.6, spd:0.21, sAmp:0.06 },
      { xf:1.0, yf:0.0, rx:0.32, ry:0.28, r:12,  g:38, b:178, a:0.26, phase:1.2, spd:0.16, sAmp:0.05 },
      { xf:0.0, yf:1.0, rx:0.30, ry:0.26, r:12,  g:35, b:165, a:0.22, phase:4.0, spd:0.14, sAmp:0.04 },
    ])

    // Diagonal axis
    const angle = Math.PI * 0.32   // ≈58° from horizontal
    const cos = Math.cos(angle), sin = Math.sin(angle)
    const pcos = -sin, psin = cos  // perpendicular unit vector
    const diag = Math.hypot(W, H)

    const RIBBONS = [
      { offset: -0.28, speed: 0.20, amp: 0.055, nLines: 20, maxA: 0.50, phase: 0.0, crossN: 18 },
      { offset:  0.00, speed: 0.16, amp: 0.060, nLines: 24, maxA: 0.56, phase: 2.1, crossN: 20 },
      { offset:  0.28, speed: 0.24, amp: 0.048, nLines: 18, maxA: 0.44, phase: 4.4, crossN: 16 },
    ]

    for (const rib of RIBBONS) {
      const waveAmp = Math.sin(t * rib.speed + rib.phase) * rib.amp * Math.min(W, H)
      const halfW   = rib.nLines * 13

      // Spine lines (parallel to diagonal)
      for (let li = 0; li < rib.nLines; li++) {
        const perpOff  = (li / (rib.nLines - 1) - 0.5) * halfW * 2
        const basePerp = rib.offset * Math.min(W, H)
        const totalP   = basePerp + perpOff + waveAmp * (1 - Math.pow(Math.abs(li / (rib.nLines - 1) - 0.5) * 2, 1.5))
        const edgeFade = Math.pow(1 - Math.abs(li / (rib.nLines - 1) - 0.5) * 2, 1.2)
        const a        = rib.maxA * edgeFade
        if (a < 0.012) continue

        const ox = W / 2 + pcos * totalP
        const oy = H / 2 + psin * totalP
        ctx.beginPath(); let started = false
        for (let d = -diag / 2; d <= diag / 2; d += 6) {
          const x = ox + cos * d, y = oy + sin * d
          if (x < -70 || x > W + 70 || y < -70 || y > H + 70) { started = false; continue }
          if (!started) { ctx.moveTo(x, y); started = true } else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
        ctx.lineWidth = 0.65; ctx.stroke()
      }

      // Cross-lines (perpendicular to diagonal, at regular intervals)
      const basePerp = rib.offset * Math.min(W, H)
      for (let ci = 0; ci <= rib.crossN; ci++) {
        const d    = (ci / rib.crossN - 0.5) * diag * 0.86
        const wOff = basePerp + Math.sin(t * rib.speed + rib.phase + d * 0.003) * rib.amp * Math.min(W, H)
        const bx   = W / 2 + cos * d, by = H / 2 + sin * d
        const x0   = bx + pcos * (wOff - halfW), y0 = by + psin * (wOff - halfW)
        const x1   = bx + pcos * (wOff + halfW), y1 = by + psin * (wOff + halfW)
        if ((x0 < -70 && x1 < -70) || (x0 > W + 70 && x1 > W + 70)) continue
        if ((y0 < -70 && y1 < -70) || (y0 > H + 70 && y1 > H + 70)) continue
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1)
        ctx.strokeStyle = `rgba(${MESH_COL},${(rib.maxA * 0.38).toFixed(3)})`
        ctx.lineWidth = 0.5; ctx.stroke()
      }
    }

    drawVignette(ctx, W, H, 0.62)
  })
  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// COUNTDOWN — Sinusoidal Wave Mesh
// Dense horizontal sine wave lines + vertical cross-connections
// ─────────────────────────────────────────────────────────────
const AuraCountdownBg = memo(function AuraCountdownBg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    drawSmoke(ctx, W, H, t, [
      { xf:0.0, yf:0.0, rx:0.58, ry:0.50, r:155, g:5,  b:5,  a:0.68, phase:0.0, spd:0.19, sAmp:0.06 },
      { xf:1.0, yf:0.0, rx:0.50, ry:0.46, r:140, g:4,  b:5,  a:0.60, phase:1.8, spd:0.16, sAmp:0.05 },
      { xf:0.0, yf:1.0, rx:0.46, ry:0.44, r:148, g:5,  b:5,  a:0.56, phase:3.6, spd:0.22, sAmp:0.07 },
      { xf:1.0, yf:1.0, rx:0.52, ry:0.47, r:145, g:5,  b:6,  a:0.60, phase:5.2, spd:0.18, sAmp:0.06 },
    ])

    const NH = 26, NV = 18
    const AMP = 0.048, FREQ = 0.0030

    function hY(x: number, yi: number): number {
      const yB = (yi / (NH - 1)) * H
      const ph = yi * 0.44 + t * 0.26
      return yB + AMP * H * Math.sin(x * FREQ + ph)
               + AMP * H * 0.34 * Math.sin(x * FREQ * 2.22 + ph * 1.38)
    }

    for (let yi = 0; yi < NH; yi++) {
      const a = 0.54 * Math.sin((yi / (NH - 1)) * Math.PI)
      if (a < 0.012) continue
      ctx.beginPath()
      ctx.moveTo(0, hY(0, yi))
      for (let x = 5; x <= W; x += 5) ctx.lineTo(x, hY(x, yi))
      ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
      ctx.lineWidth = 0.65; ctx.stroke()
    }

    const vSp = W / NV
    for (let vi = 0; vi <= NV; vi++) {
      const x = vi * vSp
      const a = 0.54 * 0.40
      ctx.beginPath()
      ctx.moveTo(x, hY(x, 0))
      for (let yi = 1; yi < NH; yi++) ctx.lineTo(x, hY(x, yi))
      ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
      ctx.lineWidth = 0.50; ctx.stroke()
    }

    drawVignette(ctx, W, H, 0.60)
  })
  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// SECRETARIAT — Vertical Curtain Pillar Mesh
// Vertical wave lines form a curtain; horizontal ties connect them
// ─────────────────────────────────────────────────────────────
const AuraSecretariatBg = memo(function AuraSecretariatBg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    drawSmoke(ctx, W, H, t, [
      { xf:0.0, yf:0.0, rx:0.50, ry:0.46, r:155, g:5,  b:5,   a:0.64, phase:0.0, spd:0.18, sAmp:0.06 },
      { xf:1.0, yf:0.0, rx:0.47, ry:0.44, r:148, g:5,  b:5,   a:0.60, phase:2.3, spd:0.15, sAmp:0.05 },
      { xf:0.5, yf:0.0, rx:0.30, ry:0.22, r:115, g:4,  b:4,   a:0.36, phase:1.1, spd:0.12, sAmp:0.04 },
      { xf:0.5, yf:1.0, rx:0.28, ry:0.20, r:12,  g:38, b:175, a:0.24, phase:3.9, spd:0.16, sAmp:0.04 },
    ])

    const NV = 24, NH = 16
    const AMP = 0.034, FREQ = 0.0026

    function vX(y: number, vi: number): number {
      const xB = (vi / (NV - 1)) * W
      const ph = vi * 0.40 + t * 0.22
      return xB + AMP * W * Math.sin(y * FREQ + ph)
               + AMP * W * 0.30 * Math.sin(y * FREQ * 2.30 + ph * 1.45)
    }

    // Vertical pillar lines
    for (let vi = 0; vi < NV; vi++) {
      const a = 0.52 * Math.sin((vi / (NV - 1)) * Math.PI)
      if (a < 0.012) continue
      ctx.beginPath()
      ctx.moveTo(vX(0, vi), 0)
      for (let y = 5; y <= H; y += 5) ctx.lineTo(vX(y, vi), y)
      ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
      ctx.lineWidth = 0.65; ctx.stroke()
    }

    // Horizontal tie-lines
    const hSp = H / NH
    for (let hi = 0; hi <= NH; hi++) {
      const y = hi * hSp
      const a = 0.52 * 0.38
      ctx.beginPath()
      ctx.moveTo(vX(y, 0), y)
      for (let vi = 1; vi < NV; vi++) ctx.lineTo(vX(y, vi), y)
      ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
      ctx.lineWidth = 0.50; ctx.stroke()
    }

    drawVignette(ctx, W, H, 0.65)
  })
  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// CTA — Convergent Radial Lines + Elliptic Rings
// Lines radiate from center; pulsing elliptic rings cross them
// ─────────────────────────────────────────────────────────────
const AuraCTABg = memo(function AuraCTABg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    drawSmoke(ctx, W, H, t, [
      { xf:0.0, yf:0.0, rx:0.58, ry:0.52, r:155, g:5,  b:5,  a:0.70, phase:0.0, spd:0.20, sAmp:0.06 },
      { xf:1.0, yf:0.0, rx:0.52, ry:0.48, r:142, g:4,  b:5,  a:0.64, phase:1.8, spd:0.17, sAmp:0.05 },
      { xf:0.0, yf:1.0, rx:0.48, ry:0.46, r:150, g:5,  b:5,  a:0.60, phase:3.5, spd:0.23, sAmp:0.07 },
      { xf:1.0, yf:1.0, rx:0.52, ry:0.48, r:148, g:5,  b:6,  a:0.64, phase:5.1, spd:0.19, sAmp:0.06 },
      { xf:0.5, yf:0.5, rx:0.26, ry:0.22, r:12,  g:38, b:178, a:0.20, phase:2.3, spd:0.14, sAmp:0.04 },
    ])

    const cx = W / 2, cy = H / 2
    const NR = 36  // radial lines

    // Radial lines from center
    for (let i = 0; i < NR; i++) {
      const baseAng = (i / NR) * Math.PI * 2
      const wave    = Math.sin(t * 0.24 + i * 0.38) * 0.045
      const ang     = baseAng + wave
      const cosA    = Math.cos(ang), sinA = Math.sin(ang)

      // Extend to canvas edge
      let len = 0
      if (Math.abs(cosA) > 0.001) len = Math.max(len, Math.abs((cosA > 0 ? W - cx : cx) / cosA))
      if (Math.abs(sinA) > 0.001) len = Math.max(len, Math.abs((sinA > 0 ? H - cy : cy) / sinA))

      const startD = 18 + 12 * Math.sin(t * 0.32 + i * 0.55)
      ctx.beginPath()
      ctx.moveTo(cx + cosA * startD, cy + sinA * startD)
      ctx.lineTo(cx + cosA * len,   cy + sinA * len)
      ctx.strokeStyle = `rgba(${MESH_COL},0.26)`
      ctx.lineWidth = 0.55; ctx.stroke()
    }

    // Pulsing concentric elliptic rings
    const NE = 12
    for (let ri = 0; ri < NE; ri++) {
      const frac    = (ri + 1) / (NE + 1)
      const pFrac   = frac + 0.020 * Math.sin(t * 0.28 + ri * 0.62)
      const rx      = pFrac * W * 0.64
      const ry      = pFrac * H * 0.60
      const a       = 0.28 * Math.sin(frac * Math.PI) * (0.72 + 0.28 * Math.sin(t * 0.38 + ri * 0.72))
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
      ctx.lineWidth = 0.58; ctx.stroke()
    }

    drawVignette(ctx, W, H, 0.72)
  })
  return <canvas ref={ref} style={CSS} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// CONTACT — Sine-Distorted Fabric Grid
// Regular H×V grid warped by sine displacement — cloth/fabric look
// ─────────────────────────────────────────────────────────────
const AuraContactBg = memo(function AuraContactBg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

    drawSmoke(ctx, W, H, t, [
      { xf:0.0, yf:0.0, rx:0.46, ry:0.42, r:155, g:5,  b:5,   a:0.58, phase:0.0, spd:0.18, sAmp:0.06 },
      { xf:1.0, yf:1.0, rx:0.46, ry:0.42, r:148, g:5,  b:5,   a:0.54, phase:2.9, spd:0.20, sAmp:0.06 },
      { xf:1.0, yf:0.0, rx:0.34, ry:0.30, r:12,  g:38, b:178, a:0.30, phase:1.6, spd:0.16, sAmp:0.05 },
      { xf:0.0, yf:1.0, rx:0.32, ry:0.28, r:12,  g:35, b:165, a:0.26, phase:4.3, spd:0.14, sAmp:0.04 },
    ])

    const NH = 20, NV = 28
    const DA = 0.032  // distortion amplitude

    // Grid point with sine distortion
    function gx(col: number, row: number): number {
      const xB = (col / (NV - 1)) * W
      const ph = row * 0.55 + t * 0.22
      return xB + DA * W * Math.sin(row * 0.62 + ph)
    }
    function gy(col: number, row: number): number {
      const yB = (row / (NH - 1)) * H
      const ph = col * 0.44 + t * 0.19
      return yB + DA * H * Math.sin(col * 0.52 + ph)
    }

    // Horizontal grid lines
    for (let row = 0; row < NH; row++) {
      const a = 0.48 * Math.sin((row / (NH - 1)) * Math.PI)
      if (a < 0.012) continue
      ctx.beginPath()
      ctx.moveTo(gx(0, row), gy(0, row))
      for (let col = 1; col < NV; col++) ctx.lineTo(gx(col, row), gy(col, row))
      ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
      ctx.lineWidth = 0.60; ctx.stroke()
    }

    // Vertical grid lines
    for (let col = 0; col < NV; col++) {
      const a = 0.48 * 0.44 * Math.sin((col / (NV - 1)) * Math.PI)
      if (a < 0.012) continue
      ctx.beginPath()
      ctx.moveTo(gx(col, 0), gy(col, 0))
      for (let row = 1; row < NH; row++) ctx.lineTo(gx(col, row), gy(col, row))
      ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
      ctx.lineWidth = 0.50; ctx.stroke()
    }

    drawVignette(ctx, W, H, 0.62)
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
