import { useEffect, useRef } from 'react'

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296
  }
}

export default function GuidelinesBg() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const W = window.innerWidth
      const H = Math.max(document.documentElement.scrollHeight, window.innerHeight)
      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      /* ── Deep space fill ── */
      ctx.fillStyle = '#010008'
      ctx.fillRect(0, 0, W, H)

      /* ── Milky Way band (diagonal dense star strip) ── */
      const mw = ctx.createLinearGradient(0, H * 0.1, W, H * 0.6)
      mw.addColorStop(0,   'rgba(40,30,80,0)')
      mw.addColorStop(0.3, 'rgba(40,30,80,0.08)')
      mw.addColorStop(0.5, 'rgba(60,40,110,0.12)')
      mw.addColorStop(0.7, 'rgba(40,30,80,0.07)')
      mw.addColorStop(1,   'rgba(40,30,80,0)')
      ctx.fillStyle = mw
      ctx.fillRect(0, 0, W, H)

      /* ── Starfield ── */
      const rng = mulberry32(42)
      for (let i = 0; i < 480; i++) {
        const x   = rng() * W
        const y   = rng() * H
        const r   = rng() * 1.25 + 0.1
        const a   = rng() * 0.65 + 0.15
        const hue = rng()
        const col = hue < 0.15
          ? '180,200,255'  // blue stars
          : hue < 0.25
          ? '255,230,180'  // warm yellow stars
          : '220,230,255'  // white/cool

        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col},${a})`
        ctx.fill()

        /* diffraction cross on bright stars */
        if (a > 0.6 && r > 0.9) {
          const sl = r * 10
          ;[0, Math.PI / 2].forEach(ang => {
            const lg = ctx.createLinearGradient(
              x - Math.cos(ang) * sl, y - Math.sin(ang) * sl,
              x + Math.cos(ang) * sl, y + Math.sin(ang) * sl,
            )
            lg.addColorStop(0,   `rgba(${col},0)`)
            lg.addColorStop(0.5, `rgba(${col},0.35)`)
            lg.addColorStop(1,   `rgba(${col},0)`)
            ctx.strokeStyle = lg
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(x - Math.cos(ang) * sl, y - Math.sin(ang) * sl)
            ctx.lineTo(x + Math.cos(ang) * sl, y + Math.sin(ang) * sl)
            ctx.stroke()
          })
        }
      }

      /* ── Planetary Nebula (Ring Nebula style) — upper right ── */
      const nx = W * 0.76
      const ny = H * 0.22
      const nr = Math.min(W, H) * 0.10

      /* outer shells — blue/teal */
      const shellCols = [
        { col: '28,115,215',  ra: 1.00, rb: 0.68, a: 0.20 },
        { col: '60,190,230',  ra: 0.82, rb: 0.55, a: 0.22 },
        { col: '192,57,43',   ra: 0.62, rb: 0.42, a: 0.28 },
        { col: '255,110,50',  ra: 0.42, rb: 0.28, a: 0.26 },
        { col: '220,180,80',  ra: 0.24, rb: 0.16, a: 0.24 },
      ]

      ctx.save()
      ctx.translate(nx, ny)
      ctx.rotate(0.25)

      shellCols.forEach(({ col, ra, rb, a }) => {
        /* ring = outer ellipse minus inner ellipse */
        const outerRx = nr * ra, outerRy = nr * rb * 0.72
        const innerRx = nr * ra * 0.72, innerRy = nr * rb * 0.52

        const g = ctx.createRadialGradient(0, 0, nr * ra * 0.55, 0, 0, nr * ra * 1.05)
        g.addColorStop(0,   `rgba(${col},0)`)
        g.addColorStop(0.3, `rgba(${col},${a * 0.6})`)
        g.addColorStop(0.65, `rgba(${col},${a})`)
        g.addColorStop(1,   `rgba(${col},0)`)
        ctx.fillStyle = g

        ctx.beginPath()
        ctx.ellipse(0, 0, outerRx, outerRy, 0, 0, Math.PI * 2)
        ctx.ellipse(0, 0, innerRx, innerRy, 0, 0, Math.PI * 2, true)
        ctx.fill('evenodd')
      })

      /* central star */
      const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, nr * 0.18)
      cg.addColorStop(0,   'rgba(255,255,255,0.95)')
      cg.addColorStop(0.2, 'rgba(200,225,255,0.60)')
      cg.addColorStop(0.6, 'rgba(100,160,255,0.18)')
      cg.addColorStop(1,   'rgba(100,160,255,0)')
      ctx.fillStyle = cg
      ctx.beginPath()
      ctx.arc(0, 0, nr * 0.18, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      /* ── Red emission nebula cloud — lower left ── */
      const rng2 = mulberry32(77)
      const redClouds = [
        { cx: 0.08, cy: 0.70, r: 0.13, a: 0.16 },
        { cx: 0.18, cy: 0.82, r: 0.10, a: 0.13 },
        { cx: 0.04, cy: 0.88, r: 0.08, a: 0.10 },
        { cx: 0.22, cy: 0.72, r: 0.07, a: 0.09 },
      ]
      redClouds.forEach(c => {
        const cx = c.cx * W + (rng2() - 0.5) * 40
        const cy = c.cy * H + (rng2() - 0.5) * 30
        const r  = Math.min(W, H) * c.r
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,   `rgba(192,57,43,${c.a})`)
        g.addColorStop(0.5, `rgba(140,30,20,${c.a * 0.5})`)
        g.addColorStop(1,   'rgba(140,30,20,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      })

      /* ── Teal nebula wisp — upper left ── */
      const tealClouds = [
        { cx: 0.12, cy: 0.18, r: 0.11, a: 0.10 },
        { cx: 0.05, cy: 0.30, r: 0.09, a: 0.08 },
        { cx: 0.20, cy: 0.12, r: 0.07, a: 0.07 },
      ]
      tealClouds.forEach(c => {
        const cx = c.cx * W
        const cy = c.cy * H
        const r  = Math.min(W, H) * c.r
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,   `rgba(28,115,215,${c.a})`)
        g.addColorStop(0.6, `rgba(20,80,160,${c.a * 0.4})`)
        g.addColorStop(1,   'rgba(20,80,160,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      })

      /* ── Distant galaxy (bottom right) — elliptical smudge ── */
      ctx.save()
      ctx.translate(W * 0.88, H * 0.78)
      ctx.rotate(-0.5)
      const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(W, H) * 0.055)
      gg.addColorStop(0,   'rgba(200,180,255,0.22)')
      gg.addColorStop(0.4, 'rgba(140,120,220,0.10)')
      gg.addColorStop(1,   'rgba(80,60,160,0)')
      ctx.fillStyle = gg
      ctx.scale(1, 0.4)
      ctx.beginPath()
      ctx.arc(0, 0, Math.min(W, H) * 0.055, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const timer = setTimeout(build, 60)
    window.addEventListener('resize', build)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', build)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
