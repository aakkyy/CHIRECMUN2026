import { useEffect, useRef } from 'react'

// ── Cubic Bezier helpers ──────────────────────────────────────
function bval(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const u = 1 - t
  return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3
}
function btan(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const u = 1 - t
  return 3 * (u*u*(p1-p0) + 2*u*t*(p2-p1) + t*t*(p3-p2))
}

interface RibbonDef {
  spx: [number,number,number,number] // bezier control x, fractions of W
  spy: [number,number,number,number] // bezier control y, fractions of H
  hw0: number  // half-width at u=0, fraction of min(W,H)
  hwM: number  // half-width at u=0.5
  hw1: number  // half-width at u=1
  uSteps: number // grid lines ACROSS ribbon
  vSteps: number // grid lines ALONG ribbon
  alpha: number
  phase: number
  speed: number
  amp: number
}

interface CloudDef {
  xf: number; yf: number
  rx: number; ry: number // radii as fraction of W/H
  r: number; g: number; b: number
  innerA: number
  phase: number; spd: number; sAmp: number
}

// ── Ribbon configs — one per corner, spiraling inward ──
const RIBBONS: RibbonDef[] = [
  // Top-left: flows from (0,0) curving inward to lower-center
  {
    spx: [0.00, 0.26, 0.42, 0.56],
    spy: [0.00, 0.14, 0.46, 0.90],
    hw0: 0.24, hwM: 0.27, hw1: 0.04,
    uSteps: 22, vSteps: 30,
    alpha: 0.55, phase: 0.0, speed: 0.24, amp: 0.040,
  },
  // Top-right: flows from (1,0) curving inward
  {
    spx: [1.00, 0.74, 0.58, 0.44],
    spy: [0.00, 0.18, 0.42, 0.88],
    hw0: 0.21, hwM: 0.25, hw1: 0.04,
    uSteps: 20, vSteps: 28,
    alpha: 0.50, phase: 2.1, speed: 0.20, amp: 0.036,
  },
  // Bottom-left: flows from (0,1) curving up-right
  {
    spx: [0.00, 0.20, 0.38, 0.60],
    spy: [1.00, 0.80, 0.54, 0.20],
    hw0: 0.18, hwM: 0.22, hw1: 0.035,
    uSteps: 18, vSteps: 26,
    alpha: 0.44, phase: 4.0, speed: 0.28, amp: 0.032,
  },
  // Bottom-right: flows from (1,1) curving up-left
  {
    spx: [1.00, 0.80, 0.63, 0.40],
    spy: [1.00, 0.78, 0.57, 0.22],
    hw0: 0.17, hwM: 0.20, hw1: 0.030,
    uSteps: 17, vSteps: 24,
    alpha: 0.42, phase: 5.8, speed: 0.22, amp: 0.028,
  },
]

// ── Smoke cloud configs ──
const CLOUDS: CloudDef[] = [
  // Corner reds
  { xf:0.00, yf:0.00, rx:0.64, ry:0.54, r:158, g:5,  b:5,  innerA:0.75, phase:0.0, spd:0.19, sAmp:0.06 },
  { xf:1.00, yf:0.00, rx:0.54, ry:0.48, r:142, g:4,  b:5,  innerA:0.66, phase:1.7, spd:0.16, sAmp:0.05 },
  { xf:0.00, yf:1.00, rx:0.48, ry:0.46, r:150, g:5,  b:5,  innerA:0.60, phase:3.3, spd:0.22, sAmp:0.07 },
  { xf:1.00, yf:1.00, rx:0.52, ry:0.47, r:148, g:5,  b:6,  innerA:0.64, phase:5.0, spd:0.18, sAmp:0.06 },
  // Edge reds — mid-top and mid-bottom
  { xf:0.50, yf:0.00, rx:0.32, ry:0.20, r:112, g:3,  b:3,  innerA:0.38, phase:1.1, spd:0.13, sAmp:0.04 },
  { xf:0.50, yf:1.00, rx:0.30, ry:0.19, r:108, g:3,  b:3,  innerA:0.34, phase:3.6, spd:0.15, sAmp:0.04 },
  // Side blues — subtle
  { xf:0.00, yf:0.50, rx:0.24, ry:0.30, r:14,  g:40, b:178, innerA:0.28, phase:2.2, spd:0.17, sAmp:0.05 },
  { xf:1.00, yf:0.50, rx:0.24, ry:0.28, r:12,  g:35, b:162, innerA:0.24, phase:5.9, spd:0.14, sAmp:0.04 },
]

// ── Sample a point on the parametric ribbon surface ──
function samplePt(
  r: RibbonDef,
  u: number,   // 0→1 along spine
  v: number,   // −1→1 across ribbon
  waveX: number,
  waveY: number,
  W: number,
  H: number,
): [number, number] {
  const sx: [number,number,number,number] = [
    r.spx[0], r.spx[1] + waveX * 0.45, r.spx[2] + waveX * 0.28, r.spx[3],
  ]
  const sy: [number,number,number,number] = [
    r.spy[0], r.spy[1] + waveY * 0.45, r.spy[2] + waveY * 0.28, r.spy[3],
  ]

  const px = bval(u, sx[0], sx[1], sx[2], sx[3]) * W
  const py = bval(u, sy[0], sy[1], sy[2], sy[3]) * H

  // Unit tangent
  let tx = btan(u, sx[0], sx[1], sx[2], sx[3]) * W
  let ty = btan(u, sy[0], sy[1], sy[2], sy[3]) * H
  const tLen = Math.sqrt(tx*tx + ty*ty) || 1
  tx /= tLen; ty /= tLen

  // Left-facing unit normal
  const nx = -ty
  const ny =  tx

  // Half-width at u (linear interp through three keyframes)
  const hw = u <= 0.5
    ? r.hw0 + (r.hwM - r.hw0) * (u * 2)
    : r.hwM + (r.hw1 - r.hwM) * ((u - 0.5) * 2)
  const halfPx = hw * Math.min(W, H)

  return [px + nx * v * halfPx, py + ny * v * halfPx]
}

export default function AuraBg() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, t = 0, raf = 0, last = 0

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Draw volumetric smoke clouds ──────────────────────────
    function drawClouds() {
      for (const c of CLOUDS) {
        const pulse = 1 + Math.sin(t * c.spd + c.phase) * c.sAmp
        const cx = c.xf * W
        const cy = c.yf * H
        const rx = c.rx * W * pulse
        const ry = c.ry * H * pulse

        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(rx / ry, 1) // squash to ellipse

        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry)
        g.addColorStop(0,    `rgba(${c.r},${c.g},${c.b},${c.innerA})`)
        g.addColorStop(0.30, `rgba(${c.r},${c.g},${c.b},${(c.innerA * 0.55).toFixed(3)})`)
        g.addColorStop(0.62, `rgba(${c.r},${c.g},${c.b},${(c.innerA * 0.16).toFixed(3)})`)
        g.addColorStop(1,    `rgba(${c.r},${c.g},${c.b},0)`)

        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(0, 0, ry, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // ── Draw a single parametric mesh ribbon ─────────────────
    function drawRibbon(r: RibbonDef) {
      const waveX = Math.sin(t * r.speed + r.phase) * r.amp
      const waveY = Math.cos(t * r.speed * 0.71 + r.phase + 1.38) * r.amp * 0.58

      const U = r.uSteps
      const V = r.vSteps

      // Pre-compute grid[vi][ui] = canvas (x,y)
      const grid: [number,number][][] = Array.from({ length: V+1 }, (_, vi) => {
        const u = vi / V
        return Array.from({ length: U+1 }, (_, ui) => {
          const v = (ui / U) * 2 - 1 // −1 to +1
          return samplePt(r, u, v, waveX, waveY, W, H)
        })
      })

      // Lines along the spine (V-direction), edge-fade across U
      for (let ui = 0; ui <= U; ui++) {
        const edgeFade = Math.pow(1 - Math.abs(ui / U - 0.5) * 2, 1.15)
        const a = r.alpha * edgeFade
        if (a < 0.012) continue

        ctx.beginPath()
        const [x0, y0] = grid[0][ui]
        ctx.moveTo(x0, y0)
        for (let vi = 1; vi <= V; vi++) {
          const [x, y] = grid[vi][ui]
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(242,234,222,${a.toFixed(3)})`
        ctx.lineWidth = 0.65
        ctx.stroke()
      }

      // Cross-lines across the ribbon (U-direction)
      for (let vi = 0; vi <= V; vi++) {
        const a = r.alpha * 0.42

        ctx.beginPath()
        const [x0, y0] = grid[vi][0]
        ctx.moveTo(x0, y0)
        for (let ui = 1; ui <= U; ui++) {
          const [x, y] = grid[vi][ui]
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(242,234,222,${a.toFixed(3)})`
        ctx.lineWidth = 0.50
        ctx.stroke()
      }
    }

    // ── Main render loop ──────────────────────────────────────
    function frame(ts: number) {
      if (ts - last < 33) { raf = requestAnimationFrame(frame); return } // ~30 fps
      last = ts
      t += 0.011

      // Base fill
      ctx.fillStyle = '#040002'
      ctx.fillRect(0, 0, W, H)

      // Volumetric clouds (behind mesh)
      drawClouds()

      // Mesh ribbons
      for (const r of RIBBONS) drawRibbon(r)

      // Center vignette — keeps text legible
      const vg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.72)
      vg.addColorStop(0,    'rgba(4,0,2,0.62)')
      vg.addColorStop(0.42, 'rgba(4,0,2,0.28)')
      vg.addColorStop(1,    'rgba(4,0,2,0)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, W, H)

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
