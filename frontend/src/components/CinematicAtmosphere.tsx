import { useEffect, useRef } from 'react'
import styles from './CinematicAtmosphere.module.css'

// ─────────────────────────────────────────────────────────
//  CinematicAtmosphere
//  Volumetric light pillar + layered fog system.
//  Pure Canvas — same GPU path as Rive, no binary file needed.
//  All motion is sinusoidal and time-based — never random jumps.
// ─────────────────────────────────────────────────────────

interface FogPlane {
  yBase: number       // vertical anchor (0–1 of canvas height)
  xOffset: number     // horizontal anchor (0–1 of canvas width)
  driftAmpX: number   // horizontal drift magnitude (px)
  driftAmpY: number   // vertical drift magnitude (px)
  driftSpeedX: number // horizontal cycle speed
  driftSpeedY: number // vertical cycle speed
  driftPhaseX: number // phase offset so planes don't sync
  driftPhaseY: number
  opacityBase: number // base opacity
  opacityAmp: number  // opacity pulse amplitude
  opacityPhase: number
  opacitySpeed: number
  rx: number          // ellipse x-radius (relative to W)
  ry: number          // ellipse y-radius (relative to H)
  color: string       // rgba color string (without alpha)
}

// Fog plane definitions — ordered back to front
const FOG_PLANES: FogPlane[] = [
  // Wide back plane — anchored center, very slow drift
  {
    yBase: 0.52, xOffset: 0.50,
    driftAmpX: 38, driftAmpY: 14,
    driftSpeedX: 0.00018, driftSpeedY: 0.00011,
    driftPhaseX: 0, driftPhaseY: 1.2,
    opacityBase: 0.055, opacityAmp: 0.018, opacityPhase: 0, opacitySpeed: 0.00022,
    rx: 0.52, ry: 0.18,
    color: '192,57,43',
  },
  // Left-drifting mid plane
  {
    yBase: 0.44, xOffset: 0.42,
    driftAmpX: 52, driftAmpY: 20,
    driftSpeedX: 0.00013, driftSpeedY: 0.00009,
    driftPhaseX: 2.1, driftPhaseY: 0.7,
    opacityBase: 0.045, opacityAmp: 0.016, opacityPhase: 1.6, opacitySpeed: 0.00019,
    rx: 0.44, ry: 0.14,
    color: '192,57,43',
  },
  // Right-drifting mid plane
  {
    yBase: 0.58, xOffset: 0.60,
    driftAmpX: 44, driftAmpY: 18,
    driftSpeedX: 0.00016, driftSpeedY: 0.00012,
    driftPhaseX: 4.2, driftPhaseY: 2.3,
    opacityBase: 0.040, opacityAmp: 0.014, opacityPhase: 3.1, opacitySpeed: 0.00017,
    rx: 0.40, ry: 0.12,
    color: '160,35,25',
  },
  // Thin foreground wisp — moves more, very transparent
  {
    yBase: 0.48, xOffset: 0.48,
    driftAmpX: 64, driftAmpY: 10,
    driftSpeedX: 0.00021, driftSpeedY: 0.00007,
    driftPhaseX: 1.0, driftPhaseY: 5.1,
    opacityBase: 0.030, opacityAmp: 0.012, opacityPhase: 2.4, opacitySpeed: 0.00025,
    rx: 0.36, ry: 0.08,
    color: '192,57,43',
  },
  // Low warm floor haze
  {
    yBase: 0.72, xOffset: 0.50,
    driftAmpX: 28, driftAmpY: 8,
    driftSpeedX: 0.00010, driftSpeedY: 0.00006,
    driftPhaseX: 3.5, driftPhaseY: 0.4,
    opacityBase: 0.048, opacityAmp: 0.010, opacityPhase: 5.0, opacitySpeed: 0.00014,
    rx: 0.58, ry: 0.10,
    color: '140,25,15',
  },
]

function drawPillar(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const cx = W / 2

  // Subtle pillar shimmer — extremely slow opacity pulse
  const shimmer = 0.85 + 0.15 * Math.sin(t * 0.00028 + 1.3)

  // ── Layer 1: Wide outer atmospheric bloom (very low opacity)
  const outerGrad = ctx.createLinearGradient(cx - W * 0.22, 0, cx + W * 0.22, 0)
  outerGrad.addColorStop(0,    'rgba(192,57,43,0.00)')
  outerGrad.addColorStop(0.30, `rgba(192,57,43,${0.028 * shimmer})`)
  outerGrad.addColorStop(0.50, `rgba(200,65,45,${0.052 * shimmer})`)
  outerGrad.addColorStop(0.70, `rgba(192,57,43,${0.028 * shimmer})`)
  outerGrad.addColorStop(1,    'rgba(192,57,43,0.00)')
  ctx.fillStyle = outerGrad
  ctx.fillRect(cx - W * 0.22, 0, W * 0.44, H)

  // ── Layer 2: Mid glow column
  const midGrad = ctx.createLinearGradient(cx - W * 0.09, 0, cx + W * 0.09, 0)
  midGrad.addColorStop(0,    'rgba(192,57,43,0.00)')
  midGrad.addColorStop(0.25, `rgba(192,57,43,${0.038 * shimmer})`)
  midGrad.addColorStop(0.50, `rgba(210,70,50,${0.065 * shimmer})`)
  midGrad.addColorStop(0.75, `rgba(192,57,43,${0.038 * shimmer})`)
  midGrad.addColorStop(1,    'rgba(192,57,43,0.00)')
  ctx.fillStyle = midGrad
  ctx.fillRect(cx - W * 0.09, 0, W * 0.18, H)

  // ── Layer 3: Narrow core column — elongated, soft edges
  const coreGrad = ctx.createLinearGradient(cx - W * 0.030, 0, cx + W * 0.030, 0)
  coreGrad.addColorStop(0,    'rgba(192,57,43,0.00)')
  coreGrad.addColorStop(0.20, `rgba(200,60,45,${0.055 * shimmer})`)
  coreGrad.addColorStop(0.50, `rgba(220,75,55,${0.090 * shimmer})`)
  coreGrad.addColorStop(0.80, `rgba(200,60,45,${0.055 * shimmer})`)
  coreGrad.addColorStop(1,    'rgba(192,57,43,0.00)')
  ctx.fillStyle = coreGrad
  ctx.fillRect(cx - W * 0.030, 0, W * 0.060, H)

  // ── Layer 4: Vertical fade — pillar fades at top and bottom
  const vertFade = ctx.createLinearGradient(0, 0, 0, H)
  vertFade.addColorStop(0,    'rgba(0,0,0,0.92)')   // fade to black at top
  vertFade.addColorStop(0.12, 'rgba(0,0,0,0.00)')
  vertFade.addColorStop(0.80, 'rgba(0,0,0,0.00)')
  vertFade.addColorStop(1,    'rgba(0,0,0,0.80)')   // fade to black at bottom
  ctx.fillStyle = vertFade
  ctx.fillRect(cx - W * 0.22, 0, W * 0.44, H)
}

function drawFogPlane(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  plane: FogPlane,
  t: number,
) {
  const x = W * plane.xOffset + Math.sin(t * plane.driftSpeedX + plane.driftPhaseX) * plane.driftAmpX
  const y = H * plane.yBase   + Math.sin(t * plane.driftSpeedY + plane.driftPhaseY) * plane.driftAmpY
  const rx = W * plane.rx
  const ry = H * plane.ry
  const opacity = plane.opacityBase + Math.sin(t * plane.opacitySpeed + plane.opacityPhase) * plane.opacityAmp

  // Elliptical radial gradient — wide and flat (rx >> ry)
  const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
  grad.addColorStop(0,   `rgba(${plane.color},${opacity})`)
  grad.addColorStop(0.5, `rgba(${plane.color},${opacity * 0.45})`)
  grad.addColorStop(1,   `rgba(${plane.color},0.00)`)

  ctx.save()
  ctx.translate(x, y)
  ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry))
  ctx.translate(-x, -y)
  ctx.fillStyle = grad
  ctx.fillRect(x - Math.max(rx, ry), y - Math.max(rx, ry), Math.max(rx, ry) * 2, Math.max(rx, ry) * 2)
  ctx.restore()
}

export default function CinematicAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0
    let raf = 0
    let lastTime = 0
    const TARGET_FPS = 24
    const INTERVAL = 1000 / TARGET_FPS

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastTime < INTERVAL) return
      lastTime = ts

      ctx.clearRect(0, 0, W, H)

      // Pillar first (furthest back)
      drawPillar(ctx, W, H, ts)

      // Fog planes front-to-back order (already sorted in FOG_PLANES)
      for (const plane of FOG_PLANES) {
        drawFogPlane(ctx, W, H, plane, ts)
      }
    }

    window.addEventListener('resize', resize)
    resize()
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
