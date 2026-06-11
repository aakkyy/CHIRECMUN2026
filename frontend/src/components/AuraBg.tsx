/**
 * AuraBg — full-page fixed background for standalone pages
 *
 * Variants:
 *   ribbons  (Guidelines)  → corner parametric mesh ribbons (4-corner spiral)
 *   bands    (FAQ)         → horizontal aurora band mesh (wide flowing bands)
 *   waves    (ComingSoon)  → full-screen sinusoidal wave mesh
 */

import { useEffect, useRef } from 'react'

// ── Cubic Bezier helpers ──────────────────────────────────────
function bval(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t
  return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3
}
function btan(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t
  return 3 * (u*u*(p1-p0) + 2*u*t*(p2-p1) + t*t*(p3-p2))
}

type Cloud = {
  xf: number; yf: number
  rx: number; ry: number
  r: number; g: number; b: number
  innerA: number; phase: number; spd: number; sAmp: number
}

function drawClouds(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, clouds: Cloud[]) {
  for (const c of clouds) {
    const pulse = 1 + Math.sin(t * c.spd + c.phase) * c.sAmp
    const cx = c.xf * W, cy = c.yf * H
    const rx = c.rx * W * pulse, ry = c.ry * H * pulse
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(rx / ry, 1)
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry)
    g.addColorStop(0,    `rgba(${c.r},${c.g},${c.b},${c.innerA})`)
    g.addColorStop(0.30, `rgba(${c.r},${c.g},${c.b},${(c.innerA * 0.55).toFixed(3)})`)
    g.addColorStop(0.65, `rgba(${c.r},${c.g},${c.b},${(c.innerA * 0.15).toFixed(3)})`)
    g.addColorStop(1,    `rgba(${c.r},${c.g},${c.b},0)`)
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(0, 0, ry, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  }
}

const COMMON_CLOUDS: Cloud[] = [
  { xf:0.00, yf:0.00, rx:0.64, ry:0.54, r:158, g:5,  b:5,   innerA:0.75, phase:0.0, spd:0.19, sAmp:0.06 },
  { xf:1.00, yf:0.00, rx:0.54, ry:0.48, r:142, g:4,  b:5,   innerA:0.66, phase:1.7, spd:0.16, sAmp:0.05 },
  { xf:0.00, yf:1.00, rx:0.48, ry:0.46, r:150, g:5,  b:5,   innerA:0.60, phase:3.3, spd:0.22, sAmp:0.07 },
  { xf:1.00, yf:1.00, rx:0.52, ry:0.47, r:148, g:5,  b:6,   innerA:0.64, phase:5.0, spd:0.18, sAmp:0.06 },
  { xf:0.50, yf:0.00, rx:0.32, ry:0.20, r:112, g:3,  b:3,   innerA:0.38, phase:1.1, spd:0.13, sAmp:0.04 },
  { xf:0.50, yf:1.00, rx:0.30, ry:0.19, r:108, g:3,  b:3,   innerA:0.34, phase:3.6, spd:0.15, sAmp:0.04 },
  { xf:0.00, yf:0.50, rx:0.24, ry:0.30, r:14,  g:40, b:178, innerA:0.28, phase:2.2, spd:0.17, sAmp:0.05 },
  { xf:1.00, yf:0.50, rx:0.24, ry:0.28, r:12,  g:35, b:162, innerA:0.24, phase:5.9, spd:0.14, sAmp:0.04 },
]

const MESH_COL = '242,234,222'

// ── RIBBONS — 4-corner parametric mesh ribbons ────────────────
interface RibbonDef {
  spx: [number,number,number,number]
  spy: [number,number,number,number]
  hw0: number; hwM: number; hw1: number
  uSteps: number; vSteps: number
  alpha: number; phase: number; speed: number; amp: number
}

const RIBBONS: RibbonDef[] = [
  { spx:[0.00,0.26,0.42,0.56], spy:[0.00,0.14,0.46,0.90], hw0:0.24,hwM:0.27,hw1:0.04, uSteps:22,vSteps:30, alpha:0.55,phase:0.0,speed:0.24,amp:0.040 },
  { spx:[1.00,0.74,0.58,0.44], spy:[0.00,0.18,0.42,0.88], hw0:0.21,hwM:0.25,hw1:0.04, uSteps:20,vSteps:28, alpha:0.50,phase:2.1,speed:0.20,amp:0.036 },
  { spx:[0.00,0.20,0.38,0.60], spy:[1.00,0.80,0.54,0.20], hw0:0.18,hwM:0.22,hw1:0.035,uSteps:18,vSteps:26, alpha:0.44,phase:4.0,speed:0.28,amp:0.032 },
  { spx:[1.00,0.80,0.63,0.40], spy:[1.00,0.78,0.57,0.22], hw0:0.17,hwM:0.20,hw1:0.030,uSteps:17,vSteps:24, alpha:0.42,phase:5.8,speed:0.22,amp:0.028 },
]

function samplePt(r: RibbonDef, u: number, v: number, wX: number, wY: number, W: number, H: number): [number,number] {
  const sx: [number,number,number,number] = [r.spx[0], r.spx[1]+wX*0.45, r.spx[2]+wX*0.28, r.spx[3]]
  const sy: [number,number,number,number] = [r.spy[0], r.spy[1]+wY*0.45, r.spy[2]+wY*0.28, r.spy[3]]
  const px = bval(u,sx[0],sx[1],sx[2],sx[3])*W, py = bval(u,sy[0],sy[1],sy[2],sy[3])*H
  let tx = btan(u,sx[0],sx[1],sx[2],sx[3])*W, ty = btan(u,sy[0],sy[1],sy[2],sy[3])*H
  const tl = Math.sqrt(tx*tx+ty*ty)||1; tx/=tl; ty/=tl
  const nx = -ty, ny = tx
  const hw = u<=0.5 ? r.hw0+(r.hwM-r.hw0)*(u*2) : r.hwM+(r.hw1-r.hwM)*((u-0.5)*2)
  const hp = hw*Math.min(W,H)
  return [px+nx*v*hp, py+ny*v*hp]
}

function drawRibbons(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  for (const r of RIBBONS) {
    const wX = Math.sin(t*r.speed+r.phase)*r.amp
    const wY = Math.cos(t*r.speed*0.71+r.phase+1.38)*r.amp*0.58
    const U = r.uSteps, V = r.vSteps
    const grid: [number,number][][] = Array.from({length:V+1},(_,vi)=>{
      const u=vi/V
      return Array.from({length:U+1},(_,ui)=>{
        const v=(ui/U)*2-1
        return samplePt(r,u,v,wX,wY,W,H)
      })
    })
    // Spine-direction lines
    for (let ui=0;ui<=U;ui++){
      const ef = Math.pow(1-Math.abs(ui/U-0.5)*2,1.15)
      const a = r.alpha*ef; if(a<0.012) continue
      ctx.beginPath(); const [x0,y0]=grid[0][ui]; ctx.moveTo(x0,y0)
      for(let vi=1;vi<=V;vi++){const[x,y]=grid[vi][ui];ctx.lineTo(x,y)}
      ctx.strokeStyle=`rgba(${MESH_COL},${a.toFixed(3)})`; ctx.lineWidth=0.65; ctx.stroke()
    }
    // Cross lines
    for (let vi=0;vi<=V;vi++){
      const a=r.alpha*0.42
      ctx.beginPath(); const[x0,y0]=grid[vi][0]; ctx.moveTo(x0,y0)
      for(let ui=1;ui<=U;ui++){const[x,y]=grid[vi][ui];ctx.lineTo(x,y)}
      ctx.strokeStyle=`rgba(${MESH_COL},${a.toFixed(3)})`; ctx.lineWidth=0.50; ctx.stroke()
    }
  }
}

// ── BANDS — layered chromatic interference (FAQ) ─────────────
// Light refracting through a prism mixed with deep-atmosphere
// aurora: diagonal color slabs, prismatic shimmer sweeps,
// corner depth fields, a center dark well for readability,
// and barely-visible flowing interference fringes.
function drawBands(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const diag = Math.sqrt(W * W + H * H)

  // ── 3. Depth gradient fields — one diffuse glow near each corner ──
  const corners: [number, number, number, number, number, number, number][] = [
    // xf,  yf,   r,   g,   b,   baseA, phase
    [0.04, 0.06, 192,  35,  20, 0.16, 0.0],   // top-left crimson
    [0.96, 0.06,  18,  50, 180, 0.14, 1.9],   // top-right blue
    [0.04, 0.94,  14,  40, 170, 0.13, 3.7],   // bottom-left blue
    [0.96, 0.94, 180,  25,  15, 0.15, 5.3],   // bottom-right crimson
  ]
  for (const [xf, yf, r, g, b, baseA, ph] of corners) {
    const a = baseA * (0.78 + 0.22 * Math.sin(t * 0.16 + ph))
    const gx = xf * W, gy = yf * H
    const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.5)
    gr.addColorStop(0,   `rgba(${r},${g},${b},${a.toFixed(3)})`)
    gr.addColorStop(0.5, `rgba(${r},${g},${b},${(a * 0.30).toFixed(3)})`)
    gr.addColorStop(1,   `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H)
  }

  // ── 1. Flowing diagonal color fields — 6 drifting gradient slabs ──
  // Slabs are angled ~25° from horizontal; gradient runs perpendicular
  // to the slab and the slab drifts along that perpendicular axis.
  const SLAB_ANG = (25 * Math.PI) / 180
  const sCos = Math.cos(SLAB_ANG), sSin = Math.sin(SLAB_ANG)
  // perpendicular axis (unit)
  const pX = -sSin, pY = sCos
  const slabs: [number, number, number, number, number, number, number, number][] = [
    // offsetFrac, halfW(frac of diag), r, g, b, maxA, driftSpd, phase
    [-0.30, 0.10, 192,  35,  20, 0.18, 0.030, 0.0],
    [-0.12, 0.12,  16,  45, 175, 0.15, 0.024, 1.6],
    [ 0.04, 0.09, 165,  15,  10, 0.20, 0.036, 3.1],
    [ 0.18, 0.11,  12,  38, 172, 0.14, 0.027, 4.4],
    [ 0.34, 0.10, 185,  30,  18, 0.16, 0.033, 5.7],
    [ 0.50, 0.13,  20,  55, 185, 0.12, 0.021, 2.3],
  ]
  ctx.save()
  for (const [offF, hwF, r, g, b, maxA, spd, ph] of slabs) {
    // Perpendicular offset of the slab center from canvas center, drifting
    const drift = Math.sin(t * spd + ph) * diag * 0.10
    const off = offF * diag + drift
    const mx = W / 2 + pX * off, my = H / 2 + pY * off
    const hw = hwF * diag
    // Gradient perpendicular to slab: transparent → color → transparent
    const g0x = mx - pX * hw, g0y = my - pY * hw
    const g1x = mx + pX * hw, g1y = my + pY * hw
    const a = maxA * (0.80 + 0.20 * Math.sin(t * 0.12 + ph * 1.3))
    const gr = ctx.createLinearGradient(g0x, g0y, g1x, g1y)
    gr.addColorStop(0,   `rgba(${r},${g},${b},0)`)
    gr.addColorStop(0.5, `rgba(${r},${g},${b},${a.toFixed(3)})`)
    gr.addColorStop(1,   `rgba(${r},${g},${b},0)`)
    // Quad covering the slab area along the diagonal direction
    const L = diag
    ctx.fillStyle = gr
    ctx.beginPath()
    ctx.moveTo(mx - sCos * L - pX * hw, my - sSin * L - pY * hw)
    ctx.lineTo(mx + sCos * L - pX * hw, my + sSin * L - pY * hw)
    ctx.lineTo(mx + sCos * L + pX * hw, my + sSin * L + pY * hw)
    ctx.lineTo(mx - sCos * L + pX * hw, my - sSin * L + pY * hw)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  // ── 2. Prismatic shimmer — 3 thin 70° lines sweeping across ──
  const SHIM_ANG = (70 * Math.PI) / 180
  const shCos = Math.cos(SHIM_ANG), shSin = Math.sin(SHIM_ANG)
  ctx.save()
  ctx.lineWidth = 1
  for (let i = 0; i < 3; i++) {
    // staggered sweep: each line is offset a third of the cycle
    const cycle = (t * 0.05 + i / 3) % 1
    const x = cycle * (W * 1.4) - W * 0.2
    // fade in/out at sweep ends
    const fade = Math.sin(cycle * Math.PI)
    const a = 0.06 * fade
    if (a < 0.005) continue
    ctx.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`
    ctx.beginPath()
    ctx.moveTo(x - shCos * diag, H / 2 - shSin * diag)
    ctx.lineTo(x + shCos * diag, H / 2 + shSin * diag)
    ctx.stroke()
  }
  ctx.restore()

  // ── 5. Flowing interference fringes — 5 rippling polylines ──
  ctx.save()
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  const STEPS = Math.ceil(W / 14)
  for (let f = 0; f < 5; f++) {
    const yBase = H * (0.14 + f * 0.18)
    const ph = f * 1.9
    const ampl = H * 0.025
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const x = (i / STEPS) * W
      const y = yBase
        + ampl * Math.sin(x * 0.004 + t * 0.18 + ph)
        + ampl * 0.4 * Math.sin(x * 0.009 + t * 0.11 + ph * 1.4)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.restore()

  // ── 6. Lightning arc traces — brief seeded flashes ──
  // Each arc cycles via a sawtooth; only visible in the first 8% of
  // its cycle. Geometry is seeded per-cycle so it stays still during
  // the flash, then jumps to a new position next cycle.
  const hash = (n: number) => {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
    return s - Math.floor(s) // 0..1 deterministic
  }
  const ARCS: [number, string][] = [
    // speed, color
    [0.080, '231,76,60'],
    [0.055, '86,150,242'],
    [0.110, '231,76,60'],
  ]
  ctx.save()
  ctx.lineWidth = 1
  for (let ai = 0; ai < ARCS.length; ai++) {
    const [speed, col] = ARCS[ai]
    const progress = (t * speed) % 1.0
    if (progress >= 0.08) continue
    const seed = Math.floor(t * speed) * 31 + ai * 977
    const alpha = (1 - progress / 0.08) * 0.12
    const startX = hash(seed) * W
    ctx.strokeStyle = `rgba(${col},${alpha.toFixed(3)})`
    ctx.beginPath()
    ctx.moveTo(startX, 0)
    let x = startX
    const SEGS = 6
    for (let s = 1; s <= SEGS; s++) {
      x += (hash(seed + s) - 0.5) * 60 // ±30px horizontal deviation
      ctx.lineTo(x, (s / SEGS) * H)
    }
    ctx.stroke()
  }
  ctx.restore()

  // ── 4. Center dark well — keeps FAQ text readable ──
  const well = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.6)
  well.addColorStop(0, 'rgba(4,0,2,0.55)')
  well.addColorStop(1, 'rgba(4,0,2,0)')
  ctx.fillStyle = well; ctx.fillRect(0, 0, W, H)
}

// ── WAVES — sinusoidal full-screen wave mesh ──────────────────
function drawWaves(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const NH = 30, NV = 20
  const AMP = 0.052, FREQ = 0.0028

  function hY(x: number, yi: number): number {
    const yB = (yi / (NH - 1)) * H
    const ph = yi * 0.46 + t * 0.24
    return yB + AMP*H*Math.sin(x*FREQ+ph) + AMP*H*0.36*Math.sin(x*FREQ*2.18+ph*1.40)
  }

  // H-lines
  for (let yi = 0; yi < NH; yi++) {
    const a = 0.56 * Math.sin((yi / (NH - 1)) * Math.PI)
    if (a < 0.012) continue
    ctx.beginPath()
    ctx.moveTo(0, hY(0, yi))
    for (let x = 5; x <= W; x += 5) ctx.lineTo(x, hY(x, yi))
    ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
    ctx.lineWidth = 0.65; ctx.stroke()
  }

  // V-connections
  const vSp = W / NV
  for (let vi = 0; vi <= NV; vi++) {
    const x = vi * vSp
    const a = 0.56 * 0.42
    ctx.beginPath()
    ctx.moveTo(x, hY(x, 0))
    for (let yi = 1; yi < NH; yi++) ctx.lineTo(x, hY(x, yi))
    ctx.strokeStyle = `rgba(${MESH_COL},${a.toFixed(3)})`
    ctx.lineWidth = 0.50; ctx.stroke()
  }
}

// ── Main component ────────────────────────────────────────────
interface AuraBgProps {
  variant?: 'ribbons' | 'bands' | 'waves'
}

export default function AuraBg({ variant = 'ribbons' }: AuraBgProps) {
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

    function frame(ts: number) {
      if (ts - last < 33) { raf = requestAnimationFrame(frame); return }
      last = ts; t += 0.011

      ctx.fillStyle = '#040002'
      ctx.fillRect(0, 0, W, H)

      drawClouds(ctx, W, H, t, COMMON_CLOUDS)

      if (variant === 'bands') drawBands(ctx, W, H, t)
      else if (variant === 'waves') drawWaves(ctx, W, H, t)
      else drawRibbons(ctx, W, H, t)

      // Center vignette — keeps text readable
      const vg = ctx.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,Math.max(W,H)*.72)
      vg.addColorStop(0,    'rgba(4,0,2,0.62)')
      vg.addColorStop(0.42, 'rgba(4,0,2,0.28)')
      vg.addColorStop(1,    'rgba(4,0,2,0)')
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [variant])

  return (
    <canvas
      ref={ref}
      style={{ position:'fixed', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }}
    />
  )
}
