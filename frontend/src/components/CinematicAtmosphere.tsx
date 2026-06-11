import { useEffect, useRef } from 'react'
import styles from './CinematicAtmosphere.module.css'

function drawAurora(
  ctx: CanvasRenderingContext2D,
  W: number, H: number, t: number,
  yTop: number, yMax: number,
  r: number, g: number, b: number,
  maxAlpha: number, phase: number
) {
  const N = 150
  const stripW = W / N

  for (let i = 0; i < N; i++) {
    const fi = i / N
    const n1 = Math.sin(fi * 8.8  + t * 0.40 + phase)
    const n2 = Math.sin(fi * 3.4  - t * 0.26 + phase * 1.5)
    const n3 = Math.sin(fi * 13.5 + t * 0.58 + phase * 0.7)
    const combined = n1 * 0.50 + n2 * 0.32 + n3 * 0.18

    const heightFrac = 0.12 + 0.88 * Math.max(0, combined * 0.5 + 0.5)
    const rayH = (yMax - yTop) * heightFrac
    if (rayH < 3) continue

    const a1 = Math.abs(Math.sin(fi * 6.4 + t * 0.33 + phase))
    const a2 = Math.abs(Math.sin(fi * 11.8 - t * 0.22 + phase * 0.85))
    const stripAlpha = maxAlpha * (0.30 + 0.70 * ((a1 + a2) / 2))
    if (stripAlpha < 0.006) continue

    const grd = ctx.createLinearGradient(0, yTop, 0, yTop + rayH)
    grd.addColorStop(0,    `rgba(${r},${g},${b},0)`)
    grd.addColorStop(0.10, `rgba(${r},${g},${b},${(stripAlpha * 0.32).toFixed(4)})`)
    grd.addColorStop(0.52, `rgba(${r},${g},${b},${stripAlpha.toFixed(4)})`)
    grd.addColorStop(0.88, `rgba(${r},${g},${b},${(stripAlpha * 0.38).toFixed(4)})`)
    grd.addColorStop(1,    `rgba(${r},${g},${b},0)`)

    ctx.fillStyle = grd
    ctx.fillRect(i * stripW, yTop, stripW + 0.5, rayH)
  }
}

export default function CinematicAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0, raf = 0, lastTime = 0
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
      const t = ts * 0.001

      ctx.clearRect(0, 0, W, H)

      // Crimson aurora — hangs from top, reaches ~52% height
      drawAurora(ctx, W, H, t, 0, H * 0.58, 192, 57, 43, 0.48, 0.0)
      // Blue aurora — shorter, different phase
      drawAurora(ctx, W, H, t, 0, H * 0.48, 18, 75, 205, 0.36, 3.14)
    }

    window.addEventListener('resize', resize)
    resize()
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
