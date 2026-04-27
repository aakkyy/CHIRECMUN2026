import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './Hero.module.css'
import logoImg from '../assets/logo.png'

const CHIREC_LETTERS = [
  { char: 'C', color: '#e74c3c', glow: 'rgba(231,76,60,0.85)'   },  // red
  { char: 'H', color: '#22c55e', glow: 'rgba(34,197,94,0.85)'   },  // green
  { char: 'I', color: '#1d4ed8', glow: 'rgba(29,78,216,0.85)'   },  // dark blue
  { char: 'R', color: '#e74c3c', glow: 'rgba(231,76,60,0.85)'   },  // red
  { char: 'E', color: '#22c55e', glow: 'rgba(34,197,94,0.85)'   },  // green
  { char: 'C', color: '#1e3a8a', glow: 'rgba(30,58,138,0.85)'   },  // dark blue
]

const letterVariant = {
  hidden:  { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 16 } },
}

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 88, damping: 22 } },
}

export default function Hero() {
  const canvasRef = useRef(null)
  const heroRef   = useRef(null)
  const [clicked, setClicked] = useState({})
  const chirecRowRef = useRef(null)
  const toggleLetter = (i) => setClicked(prev => ({ ...prev, [i]: !prev[i] }))

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (chirecRowRef.current && !chirecRowRef.current.contains(e.target)) {
        setClicked({})
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const contentY   = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const contentOp  = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, stars = [], dust = [], shooters = [], t = 0, raf = null
    let lastTime = 0
    const FPS = 30, INTERVAL = 1000 / FPS

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
      init()
    }
    function init() {
      stars = []; dust = []
      const count = Math.min(Math.floor(W * H / 3500), 180)
      for (let i = 0; i < count; i++) {
        const r = Math.random()
        stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.5+0.2,
          s: Math.random()*0.8+0.2, b: Math.random(),
          col: r<.10?'#56CCF2':r<.18?'#85DEFF':r<.25?'#c0392b':'#ffffff' })
      }
      for (let i = 0; i < 150; i++) {
        const arm = Math.floor(Math.random()*3), aa = (arm/3)*Math.PI*2
        const dist = Math.random()*Math.min(W,H)*0.42+25
        const ang  = aa + dist*0.011 + (Math.random()-0.5)*0.9
        const r = Math.random()
        dust.push({ ang, dist, av:(1e-4+Math.random()*1.2e-4)*(Math.random()<.5?1:-1),
          rr:Math.random()*2.4+0.3, al:Math.random()*0.44+0.08,
          col: r<.28?'rgba(192,57,43,':r<.54?'rgba(86,204,242,':r<.72?'rgba(120,55,210,':'rgba(45,85,200,' })
      }
    }
    function shoot() {
      if (Math.random()<0.004 && shooters.length<2) {
        const a = Math.PI/4+(Math.random()-0.5)*0.6
        shooters.push({ x:Math.random()*W, y:Math.random()*H*0.4,
          vx:Math.cos(a)*(7+Math.random()*5), vy:Math.sin(a)*(7+Math.random()*5), life:1, tail:[] })
      }
    }
    function draw(ts) {
      if (ts - lastTime < INTERVAL) { raf = requestAnimationFrame(draw); return }
      lastTime = ts
      t++; ctx.clearRect(0,0,W,H)
      const bg = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.8)
      bg.addColorStop(0,'rgba(22,8,36,1)'); bg.addColorStop(.35,'rgba(12,5,20,1)'); bg.addColorStop(1,'rgba(2,2,8,1)')
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H)
      const core = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,210)
      core.addColorStop(0,'rgba(86,204,242,.08)'); core.addColorStop(.3,'rgba(192,57,43,.05)'); core.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=core; ctx.fillRect(0,0,W,H)
      for (const s of stars) {
        const tw=.5+.5*Math.sin(t*s.s*.04+s.b*Math.PI*2)
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2)
        ctx.fillStyle=s.col; ctx.globalAlpha=.3+tw*.7; ctx.fill()
      }
      ctx.globalAlpha=1
      for (const d of dust) {
        d.ang+=d.av; ctx.beginPath()
        ctx.arc(W/2+Math.cos(d.ang)*d.dist,H/2+Math.sin(d.ang)*d.dist,d.rr,0,Math.PI*2)
        ctx.fillStyle=d.col+d.al+')'; ctx.fill()
      }
      shoot()
      for (let i=shooters.length-1;i>=0;i--) {
        const s=shooters[i]; s.tail.push({x:s.x,y:s.y})
        if(s.tail.length>20) s.tail.shift()
        s.x+=s.vx; s.y+=s.vy; s.life-=.025
        for (let j=0;j<s.tail.length-1;j++) {
          const a=(j/s.tail.length)*s.life*.85
          ctx.beginPath(); ctx.moveTo(s.tail[j].x,s.tail[j].y); ctx.lineTo(s.tail[j+1].x,s.tail[j+1].y)
          ctx.strokeStyle=`rgba(86,204,242,${a})`; ctx.lineWidth=(j/s.tail.length)*2.2; ctx.stroke()
        }
        if(s.life<=0||s.x>W+60||s.y>H+60) shooters.splice(i,1)
      }
      raf = requestAnimationFrame(draw)
    }
    window.addEventListener('resize',resize)
    resize()
    raf = requestAnimationFrame(draw)
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize',resize) }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} />

      <motion.div
        className={styles.content}
        style={{ y: contentY, opacity: contentOp }}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
      >
        {/* Logo — opacity only so CSS float is unaffected */}
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 18 } } }}>
          <div className={styles.logoWrap}>
            <img src={logoImg} alt="CHIREC MUN Logo" className={styles.logoImg} />
          </div>
        </motion.div>

        <motion.span className={styles.badge} variants={fadeUp}>
          Edition XIV
        </motion.span>

        {/* CHIREC — letter by letter */}
        <h1 className={styles.title}>
          <motion.div
            ref={chirecRowRef}
            className={styles.chirecRow}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {CHIREC_LETTERS.map((l, i) => (
              <motion.span
                key={i}
                className={styles.chirec}
                variants={letterVariant}
                style={{
                  cursor: 'pointer',
                  color: clicked[i] ? l.color : undefined,
                  textShadow: clicked[i]
                    ? `0 0 65px ${l.glow}, 0 0 28px ${l.glow}`
                    : undefined,
                  transition: 'color 0.32s ease, text-shadow 0.32s ease',
                }}
                whileHover={{
                  opacity: 1,
                  color: l.color,
                  textShadow: `0 0 50px ${l.glow}, 0 0 20px ${l.glow}`,
                  y: -10,
                  scale: 1.12,
                  transition: { type: 'spring', stiffness: 400, damping: 18 },
                }}
                whileTap={{ opacity: 1, scale: 0.94 }}
                onClick={() => toggleLetter(i)}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >{l.char}</motion.span>
            ))}
          </motion.div>

          <motion.span className={styles.mun} variants={fadeUp}>
            Model United Nations
          </motion.span>

          <motion.span className={styles.year} variants={fadeUp}>
            2026
          </motion.span>
        </h1>

        <motion.p className={styles.slogan} variants={fadeUp}>
          Represent. Reason. Resolve.
        </motion.p>

        <motion.p className={styles.location} variants={fadeUp}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          CHIREC International School, Serilingampalle · July 31 – Aug 2, 2026
        </motion.p>

        <motion.div className={styles.actions} variants={fadeUp}>
          <motion.a href="#register" className={styles.btnPrimary}
            whileHover={{ scale: 1.04, boxShadow: '0 10px 36px rgba(192,57,43,0.55)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >Register as Delegate</motion.a>
          <motion.a href="#countdown" className={styles.btnGhost}
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(86,204,242,0.1)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >View Countdown</motion.a>
        </motion.div>
      </motion.div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
