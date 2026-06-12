import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './Hero.module.css'
import logoImg from '../assets/logo.png'
import BlobButton from './BlobButton'
import CinematicAtmosphere from './CinematicAtmosphere'

const CHIREC_LETTERS = [
  { char: 'C', color: '#e74c3c', glow: 'rgba(231,76,60,0.95)' },
  { char: 'H', color: '#22c55e', glow: 'rgba(34,197,94,0.95)'  },
  { char: 'I', color: '#1d4ed8', glow: 'rgba(29,78,216,0.95)'  },
  { char: 'R', color: '#e74c3c', glow: 'rgba(231,76,60,0.95)'  },
  { char: 'E', color: '#22c55e', glow: 'rgba(34,197,94,0.95)'  },
  { char: 'C', color: '#1e3a8a', glow: 'rgba(30,58,138,0.95)'  },
]

/* Circular authorisation stamp */
function Stamp() {
  return (
    <svg className={styles.stamp} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="70" r="64" stroke="rgba(192,57,43,0.55)" strokeWidth="1.5"/>
      <circle cx="70" cy="70" r="56" stroke="rgba(192,57,43,0.28)" strokeWidth="0.75"/>
      <defs>
        <path id="topArcH" d="M 12,70 a 58,58 0 0,1 116,0"/>
        <path id="botArcH" d="M 70,128 a 58,58 0 0,0 0,-116"/>
      </defs>
      <text fontSize="9.5" fill="rgba(192,57,43,0.80)" fontFamily="'Geist',monospace" fontWeight="700" letterSpacing="3.5">
        <textPath href="#topArcH" startOffset="50%" textAnchor="middle">AUTHORIZED · RESOLUTION XIV</textPath>
      </text>
      <text fontSize="9" fill="rgba(192,57,43,0.50)" fontFamily="'Geist',monospace" fontWeight="600" letterSpacing="2.5">
        <textPath href="#botArcH" startOffset="50%" textAnchor="middle">CHIREC MUN · 2026</textPath>
      </text>
      <text x="70" y="62" textAnchor="middle" fontSize="8.5" fill="rgba(192,57,43,0.45)" fontFamily="'Geist',monospace" fontWeight="600" letterSpacing="3">EDITION</text>
      <text x="70" y="78" textAnchor="middle" fontSize="20" fill="rgba(192,57,43,0.82)" fontFamily="'Rubik',serif" fontWeight="900" letterSpacing="1">XIV</text>
      <line x1="46" y1="84" x2="94" y2="84" stroke="rgba(192,57,43,0.28)" strokeWidth="0.75"/>
    </svg>
  )
}

const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.30 } },
}
const lineIn = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 18 } },
}
const letterVariant = {
  hidden:  { opacity: 0, y: -80, scale: 1.2, rotate: -5 },
  visible: { opacity: 1, y: 0,  scale: 1,   rotate: 0,
    transition: { type: 'spring', stiffness: 220, damping: 20 } },
}

export default function Hero() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const heroRef      = useRef<HTMLDivElement>(null)
  const chirecRowRef = useRef<HTMLDivElement>(null)
  const mouse        = useRef({ x: 0, y: 0 })
  const [clicked, setClicked] = useState<Record<number, boolean>>({})
  const toggleLetter = (i: number) => setClicked(p => ({ ...p, [i]: !p[i] }))

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (chirecRowRef.current && !chirecRowRef.current.contains(e.target as Node)) setClicked({})
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const contentY  = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const contentOp = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const hintOp    = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  /* atmospheric canvas */
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, t = 0, raf = 0, lastTime = 0
    const INTERVAL = 1000 / 30
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    const onMouse = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMouse)
    const bgPts = Array.from({ length: 44 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vy: -(0.16 + Math.random() * 0.32), vx: (Math.random() - 0.5) * 0.10,
      size: 0.4 + Math.random() * 1.1, isBlue: Math.random() < 0.35,
      alpha: 0.28 + Math.random() * 0.42, phase: Math.random() * Math.PI * 2,
    }))
    function draw(ts: number) {
      if (ts - lastTime < INTERVAL) { raf = requestAnimationFrame(draw); return }
      lastTime = ts; t = ts / 1000
      ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)
      const mx = mouse.current.x || W/2, my = mouse.current.y || H/2
      const mOX = (mx - W/2) * 0.020, mOY = (my - H/2) * 0.014
      const HALOS = [
        { x:W/2+mOX*.8, y:H*.74+mOY*.5, r:Math.min(W,H)*.90, cr:180,cg:22,cb:14,  a:.58, ph:0.0, spd:.055 },
        { x:W*.09+mOX*1.2, y:H*.32+mOY*.8, r:Math.min(W,H)*.52, cr:10,cg:60,cb:180, a:.36, ph:2.1, spd:.042 },
        { x:W*.91+mOX*1.2, y:H*.32+mOY*.8, r:Math.min(W,H)*.52, cr:10,cg:60,cb:180, a:.34, ph:4.8, spd:.038 },
      ]
      for (const h of HALOS) {
        const pulse = .93+.07*Math.sin(t*h.spd+h.ph)
        const cx2 = h.x+Math.sin(t*h.spd*.7+h.ph)*W*.014
        const cy2 = h.y+Math.cos(t*h.spd*.5+h.ph+1.3)*H*.010
        const g = ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,h.r*pulse)
        g.addColorStop(0,`rgba(${h.cr},${h.cg},${h.cb},${h.a})`)
        g.addColorStop(.38,`rgba(${h.cr},${h.cg},${h.cb},${(h.a*.40).toFixed(3)})`)
        g.addColorStop(.72,`rgba(${h.cr},${h.cg},${h.cb},${(h.a*.09).toFixed(3)})`)
        g.addColorStop(1,`rgba(${h.cr},${h.cg},${h.cb},0)`)
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H)
      }
      /* perspective grid */
      const vpX=W/2+mOX*.10, vpY=H*.70, gPh=(t*.13)%1
      ctx.save()
      for (let i=0;i<20;i++){
        const raw=((i/20)+gPh)%1, gp=Math.pow(raw,.62)
        const y2=vpY+(H+80-vpY)*gp; if(y2>H+2||y2<vpY-2)continue
        const alpha=gp*.20*(.78+.22*Math.sin(t*.20+i*.4))
        ctx.beginPath();ctx.moveTo(0,y2);ctx.lineTo(W,y2)
        ctx.strokeStyle=`rgba(192,57,43,${alpha.toFixed(4)})`;ctx.lineWidth=.3+gp*1.4;ctx.stroke()
      }
      for(let i=0;i<=32;i++){
        const xB=(i/32)*W*1.5-W*.25, cF=1-Math.abs(i/32-.5)*2
        const alpha=cF*.10*(.72+.28*Math.sin(t*.16+i*.25)); if(alpha<.004)continue
        ctx.beginPath();ctx.moveTo(vpX,vpY);ctx.lineTo(xB,H+40)
        ctx.strokeStyle=`rgba(192,57,43,${alpha.toFixed(4)})`;ctx.lineWidth=.5;ctx.stroke()
      }
      ctx.restore()
      /* atmosphere particles */
      for(const p of bgPts){
        p.y+=p.vy; p.x+=p.vx+Math.sin(t*.28+p.phase)*.08
        if(p.y<-12){p.y=H+12;p.x=Math.random()*W;p.phase=Math.random()*Math.PI*2}
        const eF=Math.min(1,(H-p.y)/(H*.22),Math.max(0,p.y/(H*.08)))
        const a=p.alpha*eF*(.68+.32*Math.sin(t*.48+p.phase)); if(a<.018)continue
        const cr=p.isBlue?'56,160,242':'231,76,60'
        for(let k=1;k<=3;k++){ctx.beginPath();ctx.arc(p.x,p.y+k*2.6,p.size*.62,0,Math.PI*2);ctx.fillStyle=`rgba(${cr},${(a*.24/k).toFixed(3)})`;ctx.fill()}
        ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle=`rgba(${cr},${a.toFixed(3)})`;ctx.fill()
      }
      /* vignettes */
      const vT=ctx.createLinearGradient(0,0,0,H*.32);vT.addColorStop(0,'rgba(4,0,2,.88)');vT.addColorStop(1,'rgba(4,0,2,0)');ctx.fillStyle=vT;ctx.fillRect(0,0,W,H*.32)
      const vB=ctx.createLinearGradient(0,H,0,H*.64);vB.addColorStop(0,'rgba(4,0,2,.85)');vB.addColorStop(1,'rgba(4,0,2,0)');ctx.fillStyle=vB;ctx.fillRect(0,H*.64,W,H*.36)
      const vL=ctx.createLinearGradient(0,0,W*.10,0);vL.addColorStop(0,'rgba(4,0,2,.82)');vL.addColorStop(1,'rgba(4,0,2,0)');ctx.fillStyle=vL;ctx.fillRect(0,0,W*.10,H)
      const vR=ctx.createLinearGradient(W,0,W*.90,0);vR.addColorStop(0,'rgba(4,0,2,.82)');vR.addColorStop(1,'rgba(4,0,2,0)');ctx.fillStyle=vR;ctx.fillRect(W*.90,0,W*.10,H)
      raf=requestAnimationFrame(draw)
    }
    window.addEventListener('resize',resize); resize(); raf=requestAnimationFrame(draw)
    return()=>{ if(raf)cancelAnimationFrame(raf); window.removeEventListener('resize',resize); window.removeEventListener('mousemove',onMouse) }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <canvas ref={canvasRef} className={styles.canvas} />
      <CinematicAtmosphere />
      <div className={styles.vignette} />

      <motion.div
        className={styles.content}
        style={{ y: contentY, opacity: contentOp }}
        initial="hidden"
        animate="visible"
        variants={staggerParent}
      >
        {/* ── TOP HEADER ROW ── */}
        <motion.div className={styles.docHeader} variants={lineIn}>
          <div className={styles.docLeft}>
            <img src={logoImg} alt="CHIREC MUN" className={styles.logoImg} />
            <span className={styles.unLabel}>CHIREC INTERNATIONAL SCHOOL</span>
          </div>
          <span className={styles.docRef}>A/CHIRECMUN/XIV/2026</span>
        </motion.div>

        <motion.div className={styles.fullHair} variants={lineIn} />

        {/* ── DOCUMENT META ROW ── */}
        <motion.div className={styles.docMeta} variants={lineIn}>
          <span className={styles.metaLeft}>General Assembly &nbsp;·&nbsp; Fourteenth Session</span>
          <span className={styles.metaRight}>Serilingampally, Hyderabad, India</span>
        </motion.div>

        <motion.div className={styles.fullHairDim} variants={lineIn} />

        {/* ── RESOLUTION LABEL ── */}
        <motion.span className={styles.resLabel} variants={lineIn}>
          Resolution XIV — Model United Nations Conference
        </motion.span>

        {/* ── CHIREC — interactive letters ── */}
        <h1 className={styles.titleBlock}>
          <motion.div
            ref={chirecRowRef}
            className={styles.chirecRow}
            variants={{ hidden:{}, visible:{ transition:{ staggerChildren:.07 } } }}
          >
            {CHIREC_LETTERS.map((l, i) => (
              <motion.span
                key={i}
                className={styles.chirec}
                variants={letterVariant}
                style={{
                  color: clicked[i] ? l.color : 'rgba(244,244,239,0.96)',
                  textShadow: clicked[i]
                    ? `0 0 80px ${l.glow}, 0 0 30px ${l.glow}`
                    : '0 0 45px rgba(192,57,43,0.20)',
                  transition: 'color .26s ease, text-shadow .26s ease',
                  cursor: 'pointer',
                }}
                whileHover={{
                  color: l.color,
                  textShadow: `0 0 65px ${l.glow}, 0 0 22px ${l.glow}`,
                  y: -10, scale: 1.08,
                  transition: { type:'spring', stiffness:380, damping:18 },
                }}
                whileTap={{ scale:.93 }}
                onClick={() => toggleLetter(i)}
              >{l.char}</motion.span>
            ))}
          </motion.div>

          <motion.span className={styles.mun} variants={lineIn}>
            Model United Nations
          </motion.span>

          <motion.span className={styles.year} variants={lineIn}>2026</motion.span>
        </h1>

        <motion.div className={styles.fullHair} variants={lineIn} />

        {/* ── FORMAL BODY LINE ── */}
        <motion.p className={styles.bodyLine} variants={lineIn}>
          Convened at the CHIREC International School, Serilingampally
          &nbsp;·&nbsp; July 31 – August 2, 2026
          &nbsp;·&nbsp; Three Hundred Delegates
        </motion.p>

        <motion.div className={styles.fullHair} variants={lineIn} />

        {/* ── STAMP + TAGLINE ROW ── */}
        <motion.div className={styles.stampRow} variants={lineIn}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 130, damping: 14, delay: 1.1 }}
          >
            <Stamp />
          </motion.div>

          <div className={styles.taglineBlock}>
            <span className={styles.taglineLabel}>Conference Theme</span>
            <span className={styles.tagline}>Represent.</span>
            <span className={styles.tagline}>Reason.</span>
            <span className={styles.tagline}>Resolve.</span>
          </div>
        </motion.div>

        {/* ── CTAs ── */}
        <motion.div className={styles.actions} variants={lineIn}>
          <BlobButton href="#register" variant="red" className={styles.btnPrimary}>
            Register as Delegate
          </BlobButton>
          <BlobButton href="/committees" variant="blue" className={styles.btnGhost}>
            View Committees
          </BlobButton>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div className={styles.scrollHint} style={{ opacity: hintOp }}>
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollTrack}><div className={styles.scrollGlider} /></div>
      </motion.div>
    </section>
  )
}
