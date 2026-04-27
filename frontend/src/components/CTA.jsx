import { useEffect, useRef } from 'react'
import AnimatedBg from './AnimatedBg'
import { motion } from 'framer-motion'
import styles from './CTA.module.css'
import { viewport } from '../lib/motion'

export default function CTA() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, particles = [], raf

    function resize() {
      const r = canvas.parentElement.getBoundingClientRect()
      W = canvas.width  = r.width  || window.innerWidth
      H = canvas.height = r.height || 400
      init()
    }
    function init() {
      particles = []
      for (let i = 0; i < 80; i++) {
        particles.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.4+0.3,
          vx:(Math.random()-0.5)*0.4, vy:-Math.random()*0.55-0.15, life:Math.random(),
          dec:Math.random()*0.003+0.001, col:Math.random()<0.5?'rgba(86,204,242,':'rgba(192,57,43,' })
      }
    }
    function draw() {
      ctx.clearRect(0,0,W,H)
      for (const p of particles) {
        p.x+=p.vx; p.y+=p.vy; p.life-=p.dec
        if (p.life<=0) { p.x=Math.random()*W; p.y=H+5; p.life=Math.random()*0.8+0.2 }
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=p.col+(p.life*0.5)+')'; ctx.fill()
      }
      raf=requestAnimationFrame(draw)
    }
    const timer = setTimeout(()=>{ resize(); draw() },100)
    window.addEventListener('resize',resize)
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); window.removeEventListener('resize',resize) }
  }, [])

  return (
    <section className={styles.section} id="register" style={{position:'relative',overflow:'hidden'}}>
      <AnimatedBg variant="streams" color="86,204,242" color2="192,57,43" />
      <canvas ref={canvasRef} className={styles.canvas} />
      <motion.div
        className={styles.inner} style={{position:"relative",zIndex:1}}
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      >
        <p className={styles.eyebrow}>Don't Miss Out</p>
        <h2 className={styles.title}>
          Ready to Make Your Mark<br />on the World Stage?
        </h2>
        <p className={styles.sub}>
          Join hundreds of delegates from across the country at CHIREC International School
          across three days of diplomacy, debate, and discovery.
        </p>
        <div className={styles.actions}>
          <motion.a href="#" className={styles.btnPrimary}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(192,57,43,0.55)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >Register as Delegate</motion.a>
          <motion.a href="#" className={styles.btnOutline}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(86,204,242,0.1)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >Download Brochure</motion.a>
        </div>
      </motion.div>
    </section>
  )
}
