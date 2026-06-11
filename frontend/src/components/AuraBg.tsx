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

// ── BANDS — filled aurora gradient bands (NO mesh lines) ─────
// Each band is a solid sinusoidal stripe rendered as a filled path
// with a vertical gradient, aurora-style
function drawBands(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  // [yFrac, halfH, speed, amp, phase, color: r/g/b, maxAlpha]
  const bands: [number, number, number, number, number, number, number, number, number][] = [
    // y%,   hH,   spd,  amp,  ph,   r,   g,   b,   a
    [0.13, 0.095, 0.17, 0.038, 0.00, 192,  35,  20,  0.22],  // crimson red
    [0.31, 0.085, 0.21, 0.042, 2.80, 155,   8,   8,  0.18],  // deep red
    [0.50, 0.100, 0.15, 0.035, 5.50,  22,  60, 180,  0.16],  // dark blue
    [0.69, 0.080, 0.19, 0.033, 1.40, 170,  20,  12,  0.20],  // red-orange
    [0.88, 0.070, 0.23, 0.028, 4.20,  14,  35, 165,  0.14],  // midnight blue
  ]

  const FREQ = 0.00018

  for (const [yFrac, halfH, spd, amp, phase, r, g, b, maxA] of bands) {
    const yCenter = yFrac * H
    const halfPx  = halfH * H
    const ph      = phase + t * spd
    const STEPS   = Math.ceil(W / 4)

    // Build top-edge and bottom-edge curves
    const topYs: number[] = []
    const botYs: number[] = []

    for (let i = 0; i <= STEPS; i++) {
      const x  = (i / STEPS) * W
      const dy = amp * H * Math.sin(x * FREQ * W + ph)
               + amp * H * 0.45 * Math.sin(x * FREQ * W * 2.3 + ph * 1.2)
      topYs.push(yCenter - halfPx + dy)
      botYs.push(yCenter + halfPx + dy)
    }

    // Filled strip path
    ctx.beginPath()
    ctx.moveTo(0, topYs[0])
    for (let i = 1; i <= STEPS; i++) ctx.lineTo((i / STEPS) * W, topYs[i])
    for (let i = STEPS; i >= 0; i--) ctx.lineTo((i / STEPS) * W, botYs[i])
    ctx.closePath()

    // Vertical gradient: bright center → transparent edges
    const topY0  = yCenter - halfPx
    const botY0  = yCenter + halfPx
    const bandGr = ctx.createLinearGradient(0, topY0, 0, botY0)
    bandGr.addColorStop(0.00, `rgba(${r},${g},${b},0)`)
    bandGr.addColorStop(0.25, `rgba(${r},${g},${b},${(maxA * 0.60).toFixed(3)})`)
    bandGr.addColorStop(0.50, `rgba(${r},${g},${b},${maxA.toFixed(3)})`)
    bandGr.addColorStop(0.75, `rgba(${r},${g},${b},${(maxA * 0.60).toFixed(3)})`)
    bandGr.addColorStop(1.00, `rgba(${r},${g},${b},0)`)

    ctx.fillStyle = bandGr
    ctx.fill()

    // Subtle bright rim line on top edge only — adds a glow seam
    const rimA = maxA * 0.55
    ctx.beginPath()
    ctx.moveTo(0, topYs[0])
    for (let i = 1; i <= STEPS; i++) ctx.lineTo((i / STEPS) * W, topYs[i])
    ctx.strokeStyle = `rgba(${r},${g},${b},${rimA.toFixed(3)})`
    ctx.lineWidth = 1.0; ctx.stroke()
  }
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
